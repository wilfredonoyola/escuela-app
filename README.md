# escuela-app

Monorepo con el frontend y el backend de la aplicación.

| Carpeta | Stack |
| --- | --- |
| `frontend/` | Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript |
| `backend/` | NestJS 11 · TypeScript · Jest |

## Requisitos

- Node.js 20+
- npm

## Desarrollo

```bash
# Backend (http://localhost:3000)
cd backend
npm install
npm run start:dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev -- -p 3001
```

> Ambos usan el puerto 3000 por defecto; arranca el frontend en otro puerto (p. ej. 3001) o cambia `PORT` en el backend.

## Scripts útiles

| | Frontend | Backend |
| --- | --- | --- |
| Lint | `npm run lint` | `npm run lint` |
| Build | `npm run build` | `npm run build` |
| Tests | — | `npm test` / `npm run test:e2e` |
