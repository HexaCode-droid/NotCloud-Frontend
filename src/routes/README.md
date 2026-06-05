# Carpeta: routes

En SvelteKit, esta carpeta funciona como tu **enrutador (router)**. Todo se basa en el sistema de archivos (File-system based routing).

Cualquier carpeta que crees aquí adentro se convertirá automáticamente en una ruta (URL) de tu aplicación, siempre y cuando contenga un archivo `+page.svelte`.

## Archivos especiales de SvelteKit:

- **`+page.svelte`**: Es la vista de la página de esa ruta.
  - Ej: `src/routes/+page.svelte` -> se ve en la ruta `/` (Inicio)
  - Ej: `src/routes/login/+page.svelte` -> se ve en la ruta `/login`

- **`+layout.svelte`**: Es un envoltorio o plantilla que envuelve a todas las páginas de esa carpeta y sus subcarpetas. Ideal para Navbars, Footers o Sidebars que no cambian al navegar.
  - El contenido de la página hija se renderiza donde pongas el tag `<slot />` (o `{@render children()}` en Svelte 5).

- **`+page.ts` / `+page.js`**: Archivo para cargar datos (Loaders) antes de que la página se renderice. Funciona tanto en el cliente como en el servidor.

- **`+page.server.ts`**: Igual que el anterior, pero SÓLO se ejecuta en el servidor (útil si necesitas usar secretos, variables de entorno privadas o consultar una base de datos directamente, aunque en tu caso hablarás con NestJS).

## Regla de Oro
Intenta mantener los archivos `+page.svelte` lo más **limpios** posibles. Delega la lógica de negocio a `src/lib/services` y la UI compleja a componentes en `src/lib/components`. Las páginas solo deben ser el "pegamento" que une ambas partes.
