# Guía de contribución

## Flujo de trabajo

1. Actualiza `main` y crea una rama desde ahí:
   - `feat/<descripcion-corta>` — funcionalidad nueva
   - `fix/<descripcion-corta>` — corrección
   - `refactor/…`, `chore/…`, `docs/…`, `ci/…`
2. Haz commits pequeños y con sentido propio (ver convención abajo).
3. Abre un PR hacia `main` y completa la plantilla (`.github/pull_request_template.md`).
4. Se requiere al menos una aprobación y que el lint, el tipado y los tests pasen antes de hacer merge.
5. Merge con **squash** usando un título en formato Conventional Commits. Borra la rama después del merge.

## Convención de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/):

```
<tipo>(<alcance>): <descripción en imperativo y minúscula>

<cuerpo opcional: el porqué del cambio>
```

- Tipos: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `perf`
- Alcances: `backend`, `frontend`, `infra`, o el módulo (`auth`, `schools`…)
- Ejemplo: `feat(schools): permitir ordenar el listado por matrícula`

## Antes de abrir el PR

```bash
# backend
cd backend && npm run lint && npx tsc --noEmit && npm run test:e2e

# frontend
cd frontend && npm run lint && npx tsc --noEmit
```

## Convenciones de código

### Backend (NestJS)

- Un módulo por dominio en `src/modules/<dominio>`: `controller → service → repository`.
- Los servicios dependen del **repositorio abstracto**, nunca de la fuente de datos concreta.
- Todo endpoint está protegido por defecto. Usa `@Public()` solo con justificación y `@Roles()` para restringir por rol.
- Toda entrada se valida con un DTO de `class-validator`. Toda salida pasa por un DTO de respuesta con lista blanca de campos.
- La configuración se lee con `ConfigService` desde `src/config/configuration.ts`. Nada de valores ni secretos escritos en el código. Cada variable nueva se documenta en `.env.example`.
- Los errores se lanzan como `HttpException` de Nest. El filtro global da formato a la respuesta y nunca expone el stack.

### Frontend (Next.js)

- Organización por features: `src/features/<feature>/{api,components,hooks,schemas,types.ts,index.ts}`.
- `src/app` solo enruta y compone. La lógica vive en las features.
- Importa una feature solo a través de su `index.ts`. `shared/` no depende de ninguna feature.
- Las llamadas al API pasan por `shared/lib/api-client.ts`, y los datos del servidor por TanStack Query (con query keys centralizadas por feature).
- Las reglas de validación de formularios (zod) reflejan las del backend, pero nunca las reemplazan.
