# Usuarios de prueba (localhost)

Cuentas ficticias para probar el MVP en local. Viven en `backend/data/users.json` y las contraseñas se guardan como hash bcrypt (coste 10). **Solo sirven para desarrollo**: no las uses en ningún entorno real.

| # | Nombre | Usuario | Contraseña | Rol |
| --- | --- | --- | --- | --- |
| 1 | Ana Administradora | `admin@prueba.test` | `Admin123*` | ADMIN |
| 2 | Carlos Consulta | `consulta@prueba.test` | `Consulta123*` | CONSULTA |
| 3 | Beatriz Supervisora | `admin2@prueba.test` | `Admin2Prueba*` | ADMIN |
| 4 | Diego Lector | `consulta2@prueba.test` | `Consulta2Prueba*` | CONSULTA |

Hay dos cuentas por rol para probar que los cambios de un usuario se ven desde otra sesión, por ejemplo una ventana normal y otra de incógnito.

## Qué puede hacer cada rol

| Acción | Endpoint | ADMIN | CONSULTA |
| --- | --- | --- | --- |
| Iniciar sesión | `POST /auth/login` | ✅ | ✅ |
| Ver su perfil | `GET /auth/me` | ✅ | ✅ |
| Listar y filtrar centros | `GET /schools?page=&limit=&departamento=&q=` | ✅ | ✅ |
| Ver departamentos | `GET /schools/departamentos` | ✅ | ✅ |
| Ver un centro | `GET /schools/:id` | ✅ | ✅ |
| Editar la matrícula | `PATCH /schools/:id` | ✅ | ❌ 403 |

## Probar desde el navegador

1. Levanta el backend (`http://localhost:4000`) y el frontend (`http://localhost:3000`) como indica el [README](../README.md#cómo-levantarlo).
2. Abre `http://localhost:3000/login` y entra con cualquiera de las cuentas.
3. Con un usuario **ADMIN**, edita la matrícula de un centro: el valor nuevo se ve en el momento.
4. Con un usuario **CONSULTA**, la tabla es de solo lectura.

## Probar desde la terminal

```bash
API=http://localhost:4000

# 1. Login: guarda el token
TOKEN=$(curl -s -X POST $API/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@prueba.test","password":"Admin123*"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).accessToken')

# 2. Perfil (no incluye passwordHash)
curl -s $API/auth/me -H "Authorization: Bearer $TOKEN"

# 3. Listado paginado y filtrado
curl -s "$API/schools?page=1&limit=5&departamento=La%20Paz" -H "Authorization: Bearer $TOKEN"

# 4. Editar matrícula (ADMIN → 200, CONSULTA → 403)
curl -s -X PATCH $API/schools/1 \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"matricula":420}'
```

## Casos negativos que vale la pena revisar

| Caso | Resultado esperado |
| --- | --- |
| Contraseña incorrecta o email que no existe | `401 Credenciales incorrectas` (el mismo mensaje en los dos casos) |
| Más de 5 intentos de login en un minuto | `429 Too Many Requests` |
| `/schools` o `/auth/me` sin token, o con el token vencido (1 h) | `401` |
| `PATCH /schools/:id` con un usuario CONSULTA | `403` |
| Matrícula negativa, decimal, texto o mayor que 100 000 | `400` |
| `PATCH` a un id que no existe | `404` |

> Los datos se cargan en memoria al arrancar el backend. Si reinicias el backend, las matrículas editadas vuelven a sus valores originales.

## Agregar otro usuario

Genera el hash desde `backend/`:

```bash
node -e 'console.log(require("bcryptjs").hashSync(process.argv[1], 10))' 'MiClave123*'
```

Agrega el objeto a `backend/data/users.json` con un `id` nuevo y `rol` igual a `ADMIN` o `CONSULTA`, y reinicia el backend: los usuarios solo se leen al arrancar.
