# Carpeta: services

Esta carpeta contiene la lógica para comunicarse con tu backend (NestJS) o APIs externas.
Aquí debes colocar todas las peticiones HTTP (fetch, axios). Esto mantiene a los componentes limpios de lógica de red.

Ejemplos:
- `api.ts` (Configuración base, interceptores)
- `auth.service.ts` (Login, registro)
- `notes.service.ts` (CRUD de notas)
