## Resumen

<!-- Qué cambia y por qué, en 2-3 líneas. Enlaza la HU o el issue: "Cierra #123" / "HU-05". -->

## Tipo de cambio

- [ ] `feat` — funcionalidad nueva
- [ ] `fix` — corrección de bug
- [ ] `refactor` — sin cambio de comportamiento
- [ ] `chore` / `ci` / `docs` — mantenimiento, infraestructura o documentación
- [ ] ⚠️ Cambio que rompe compatibilidad (API, contrato, variables de entorno)

## Alcance

- [ ] `backend/`
- [ ] `frontend/`
- [ ] Infraestructura (Docker, CI, configuración)

## Cambios principales

<!-- Lista corta por área. Explica decisiones no obvias, no lo que ya se ve en el diff. -->

-

## Decisiones técnicas y alternativas descartadas

<!-- Si te apartaste de la HU o elegiste entre varias opciones, explica por qué. Borra la sección si no aplica. -->

## Cómo probarlo

<!-- Pasos concretos que el revisor puede repetir: comandos, usuario, ruta, resultado esperado. -->

1.

## Evidencia

<!-- Salida de tests, capturas de pantalla o GIF para cambios de UI, ejemplos de request/response. -->

## Checklist del autor

### General
- [ ] La rama parte de `main` actualizado y el título del PR sigue Conventional Commits
- [ ] Lint y tipado sin errores (`npm run lint`, `npx tsc --noEmit`) en los proyectos afectados
- [ ] Tests nuevos o actualizados para el comportamiento cambiado, y pasan
- [ ] README / `.env.example` actualizados si cambian comandos, endpoints o variables

### Seguridad
- [ ] Sin secretos, tokens ni credenciales en el código o en el historial
- [ ] Endpoints nuevos protegidos por defecto (sin `@Public()` salvo que sea intencional y justificado)
- [ ] Permisos por rol aplicados en el **backend** (`@Roles`), no solo ocultos en la UI
- [ ] Entradas validadas en el backend con DTOs (`class-validator`)
- [ ] Las respuestas usan DTOs de salida: no exponen datos personales ni campos internos
- [ ] Si se cachea un endpoint, su respuesta es igual para todos los usuarios o la clave incluye al usuario

### Frontend
- [ ] El código vive en su feature (`src/features/<feature>`) y se consume desde su `index.ts`
- [ ] `shared/` no importa nada de `features/`
- [ ] Estados de carga, error y vacío contemplados
- [ ] Formularios accesibles (labels, `aria-*`, navegación con teclado)

## Riesgos y plan de rollback

<!-- Qué podría fallar en producción y cómo revertirlo. "Bajo: solo UI" es una respuesta válida. -->

## Pendiente / fuera de alcance

<!-- Lo que queda para otro PR, con issue enlazado si existe. -->
