# Directorio de Centros Escolares — MVP

MVP interno para consultar el directorio de centros escolares y actualizar su matrícula.

| Carpeta | Stack |
| --- | --- |
| `backend/` | NestJS 11 · TypeScript · `@nestjs/jwt` · `@nestjs/cache-manager` (memoria) · class-validator |
| `frontend/` | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · TanStack Query · Zod |

Usuarios de prueba:

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin@prueba.test` | `Admin123*` | ADMIN |
| `consulta@prueba.test` | `Consulta123*` | CONSULTA |
| `admin2@prueba.test` | `Admin2Prueba*` | ADMIN |
| `consulta2@prueba.test` | `Consulta2Prueba*` | CONSULTA |

Los permisos de cada rol, los ejemplos con `curl` y los casos de error están en [docs/usuarios-de-prueba.md](docs/usuarios-de-prueba.md).

## Cómo levantarlo

Requisitos: Node.js 22 o superior y npm.

### Sin Docker

```bash
# Backend → http://localhost:4000
cd backend
cp .env.example .env        # genera un JWT_SECRET propio: openssl rand -base64 48
npm install
npm run start:dev

# Frontend → http://localhost:3000 (en otra terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Con Docker

```bash
docker compose up --build
```

Levanta `frontend` en el puerto 3000 y `backend` en el 4000. El frontend espera a que el backend responda en `/health`.
El compose trae un `JWT_SECRET` solo para desarrollo, y se puede sobrescribir con `JWT_SECRET=... docker compose up`.

> Los Dockerfiles y el compose están escritos pero no se han ejecutado todavía en este entorno.

### Pruebas y calidad

```bash
cd backend && npm run test:e2e   # 11 pruebas e2e de los flujos críticos
cd backend && npm run lint
cd frontend && npm run lint
```

## API

Todos los endpoints requieren `Authorization: Bearer <token>`, salvo los marcados como públicos.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/auth/login` | Público. Body `{ email, password }` → `{ accessToken, tokenType, expiresIn, user }` |
| `GET` | `/auth/me` | Perfil del dueño del token (`id, nombre, email, rol`). No se cachea |
| `GET` | `/schools?page=&limit=&departamento=&q=` | Listado paginado y filtrado. Se cachea |
| `GET` | `/schools/departamentos` | Departamentos para el filtro. Se cachea |
| `GET` | `/schools/:id` | Un centro. Se cachea |
| `PATCH` | `/schools/:id` | Solo ADMIN. Body `{ matricula }` (entero 0–100 000). Invalida la caché |
| `GET` | `/health` | Público. Lo usa el healthcheck de Docker |

Errores con formato uniforme: `{ statusCode, message, path, timestamp }`, sin stack.

## Arquitectura

### Backend: módulos por dominio + repositorios

```
backend/
├── data/                       schools.json (20) · users.json (2, bcrypt)
└── src/
    ├── config/                 configuración tipada desde variables de entorno (falla si falta JWT_SECRET)
    ├── common/                 decoradores (@Public, @Roles, @CurrentUser), filtro de errores, DTOs de paginación
    ├── infrastructure/
    │   └── json-data/          JsonFileReader: único punto que sabe que los datos viven en archivos
    └── modules/
        ├── auth/               login, /me, JwtAuthGuard y RolesGuard globales
        ├── users/              UsersRepository (abstracto) + JsonUsersRepository
        ├── schools/            controller → service → SchoolsRepository (abstracto) + JsonSchoolsRepository
        └── health/
```

- **Seguro por defecto:** `JwtAuthGuard` y `RolesGuard` se registran como `APP_GUARD`. Todo endpoint exige token salvo que se marque con `@Public()`.
- **Repositorios abstractos:** para pasar a Postgres u otra base solo hay que crear `PrismaSchoolsRepository` (o similar) y cambiar el `useClass` del módulo. Ni los servicios ni los controladores cambian.
- **Filtrado y paginación en el repositorio:** con una base de datos se traducen directamente a `WHERE` / `LIMIT` / `OFFSET`.

### Frontend: organizado por features

```
frontend/src/
├── app/                        solo enrutamiento y composición
│   ├── (auth)/login/
│   ├── (dashboard)/            layout protegido (RequireAuth + encabezado)
│   │   └── schools/
│   └── providers.tsx           QueryClient + AuthProvider
├── features/
│   ├── auth/                   api · context (sesión) · components · types · index.ts (API pública)
│   └── schools/                api · hooks (React Query) · schemas (zod) · components · types · index.ts
└── shared/                     config/env, api-client, token-storage, query-client
```

- Cada feature expone solo lo que exporta en su `index.ts`. `app/` compone features, y `shared/` no depende de ninguna feature.
- El `api-client` centraliza el token, el formato de errores (`ApiError`) y el cierre de sesión ante un 401.
- TanStack Query maneja la caché del cliente. Al guardar una matrícula se actualizan las listas en memoria y luego se revalidan contra el servidor.

## Observaciones a las historias de usuario

Como responsable técnico cambié varias definiciones. Para cada una: qué pedía la HU, qué se hizo y qué riesgo evita.

| HU | Pedía | Se implementó | Riesgo evitado |
| --- | --- | --- | --- |
| 01.1 | `GET /auth/login?email=&password=` | `POST /auth/login` con body JSON | Que las credenciales queden en logs del servidor y proxies, en el historial del navegador y en el header `Referer` |
| 01.2 | Devolver el usuario completo de `users.json` | Solo `id, nombre, email, rol` | Exponer `passwordHash`, que permitiría crackear la contraseña offline |
| 01.3 | Token en `localStorage` | Se mantiene, pero aislado en `shared/lib/token-storage.ts`, con expiración de 1 h y cierre de sesión automático ante un 401 | Si hay XSS, el token puede robarse. Se acota el impacto y queda lista la migración a una cookie httpOnly |
| 01.4 | 401 y "Credenciales incorrectas" | Igual, con el mismo mensaje y tiempo de respuesta parecido exista o no el email (se compara contra un hash ficticio). Además, máximo 5 intentos por minuto | Averiguar qué cuentas existen y ataques de fuerza bruta |
| 02.2 | Guard JWT en `/schools` y `/auth/me` | Guard **global** con lista explícita de rutas `@Public()` | Que un endpoint nuevo quede sin protección por olvido |
| 03.1 | `GET /schools` sin paginar; el cliente pagina y filtra | Paginación y filtros en el servidor (`page`, `limit` ≤ 100, `departamento`, `q`) | Con 5 000 registros: respuestas pesadas, consumo de memoria en el navegador y lentitud en móviles |
| 03.2 | Devolver los objetos del JSON sin transformar | `SchoolResponseDto` con lista blanca de campos | Filtrar datos personales (DUI y teléfono del director), `observacionesInternas` y `createdBy` |
| 04.2 | `CacheInterceptor` global, incluido `/auth/me` | Caché solo en las lecturas de `/schools`. `/auth/me` lleva `Cache-Control: no-store` | **Fuga entre usuarios:** la clave de caché es la URL, así que cualquier usuario recibiría el perfil de quien llamó primero a `/auth/me` |
| 04.3 | TTL 0 (nunca expira) | TTL de 60 s configurable, y cada `PATCH` vacía la caché | Datos viejos indefinidamente, lo que contradice la HU-05.3 |
| 05.2 | Validar solo en el frontend | Se valida en ambos lados: zod en el formulario y `class-validator` en el backend (entero entre 0 y 100 000). `ValidationPipe` rechaza campos extra. Si el id no existe, 404 | Cualquiera puede llamar al API directamente y guardar valores negativos, decimales o texto |
| 05.3 | Ver el valor actualizado de inmediato | Invalidación de caché en el servidor y actualización de la caché del cliente | — |
| 06.2 | Secreto JWT y URL del API escritos en el código | Variables de entorno (`.env.example`). La app no arranca si `JWT_SECRET` falta o es corto. El compose trae un valor solo para desarrollo | Si el repo se filtra, cualquiera podría firmar tokens válidos, incluso de ADMIN |
| 06.3 | CORS `origin: '*'` | Lista de orígenes permitidos en `CORS_ORIGIN` (por defecto `http://localhost:3000`) | Que cualquier sitio pueda usar el API desde el navegador. Además, entre contenedores no hay CORS: la petición la hace el navegador |
| 06.4 | Responder con mensaje y stack completos | Filtro global: mensaje genérico al cliente y stack solo en el log del servidor | Revelar rutas, versiones y estructura interna, que sirven de reconocimiento para un atacante |

Otras medidas: `helmet` para los headers de seguridad, `/health` para el healthcheck, imágenes Docker multi-stage que corren como usuario `node` sin privilegios.

## Pendiente y cómo lo resolvería con más tiempo

- **Persistencia:** los cambios de matrícula viven en memoria y se pierden al reiniciar. El siguiente paso es Postgres con Prisma o TypeORM, implementando los repositorios abstractos.
- **Sesión:** pasar el token a una cookie `httpOnly; Secure; SameSite=Strict` (con un proxy en Next o un BFF) y agregar refresh tokens y revocación.
- **Caché distribuida:** el almacén en memoria no se comparte entre réplicas. Usar Redis (Keyv) e invalidar por tags o claves de `/schools` en lugar de `clear()`.
- **Auditoría:** registrar quién cambió cada matrícula y cuándo (`updatedBy`, `updatedAt`, historial).
- **Pruebas:** unitarias de servicios y guards, y pruebas de componentes y e2e en el frontend (Playwright). Más CI con lint, tipado y pruebas.
- **Observabilidad:** logs estructurados (pino) con request-id, métricas y documentación OpenAPI (`@nestjs/swagger`).
- **UX:** filtros en la URL (`?departamento=`) para poder compartir enlaces, ordenar por columna y avisos (toasts).
- **Docker:** verificar `docker compose up --build` de punta a punta.

## Uso de IA

- **Generado con IA (Claude Code):** la estructura de ambos proyectos, los módulos de Nest, guards, DTOs, la feature de auth y la de centros en Next, los datos de prueba (`schools.json`, y `users.json` con hashes bcrypt generados por script), los Dockerfiles y este README.
- **Cómo se validó:**
  - `tsc --noEmit` y ESLint sin errores en backend y frontend.
  - 11 pruebas e2e (supertest) sobre los riesgos de la tabla: 401 sin token, 403 para CONSULTA, 400 con matrícula inválida, 404 con id inexistente, respuesta sin `passwordHash` ni datos del director, `/auth/me` aislado por usuario, y que el `PATCH` se vea en la siguiente lectura cacheada.
  - Prueba manual con curl del login, `/auth/me`, el listado filtrado y CORS rechazando un origen ajeno.
  - Revisión manual de las decisiones de seguridad frente al enunciado.
