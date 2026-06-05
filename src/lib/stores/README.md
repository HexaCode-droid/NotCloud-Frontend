# Carpeta: stores

Esta carpeta contiene el estado global de la aplicación utilizando Svelte Stores (`writable`, `readable`, `derived`).
Útil para datos que necesitan ser accedidos por múltiples componentes que no están directamente relacionados.

Ejemplos:
- `authStore.ts` (Manejo del usuario actual logueado y tokens)
- `uiStore.ts` (Estado de la interfaz de usuario, como menús abiertos o tema claro/oscuro)
