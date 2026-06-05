# Carpeta: assets

Esta carpeta contiene recursos estáticos que **necesitan ser procesados** por el empaquetador (Vite).
Al importar estos archivos en Svelte, Vite puede aplicar optimizaciones (como hashear el nombre del archivo para caché).

Ejemplos:
- `logo-book.svg`
- Archivos de fuentes locales (.woff, .ttf)
- Imágenes que cambian durante la compilación

Nota: Los archivos que no requieran procesamiento (como favicon o robots.txt) deben ir en la carpeta `static` en la raíz del proyecto.
