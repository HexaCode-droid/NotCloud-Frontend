# NotCloud

> Organiza tus ideas sin límites — un bloque a la vez.

**NotCloud** es una aplicación web moderna de toma de notas y gestión del conocimiento, construida con **Svelte 5**, **SvelteKit 2** y **TypeScript 6**. Con un editor basado en bloques, integración de IA, calendario con recordatorios y una experiencia altamente personalizable.

---

## ✨ Características

### 📝 Editor por Bloques
- Bloque tipo texto, encabezados H1/H2/H3, listas TODO, código e imágenes
- Autoguardado con debounce de 800ms
- Paleta de comandos con `/` para cambiar tipo de bloque
- Soporte para sub-páginas con jerarquía padre-hijo

### 🤖 Asistente IA integrado
- Presiona `Espacio` en un bloque vacío para invocar el asistente
- Envía contexto del bloque actual + vecinos a la API de IA
- Inserta el texto generado directamente en tu nota

### 🗂️ Gestión de páginas
- Crear, editar, archivar y eliminar páginas
- Marcar como favoritas para acceso rápido
- Vista de páginas recientes y archivadas (papelera)
- Restaurar o eliminar permanentemente desde la papelera

### 📅 Calendario & Recordatorios
- Vista mensual con navegación entre meses
- Creación y eliminación de recordatorios por día
- Notificaciones push vía Browser Notification API
- Polling cada 30s para recordatorios próximos

### 🎨 Temas (11 temas)
| Claro | Oscuro | Ocean | Forest | Sunset | Lavender |
|-------|--------|-------|--------|--------|----------|
| **Liquid Glass** | **Cyberpunk** | **Galaxy** | **Matcha** | **Dracula** |

### 📐 Modos de Layout (5 modos)
`Barra lateral izquierda` · `Barra lateral derecha` · `Paneles flotantes` · `Dock inferior` · `Dock superior`

### 🔐 Autenticación completa
- Registro, inicio de sesión y verificación por email (código de 6 dígitos)
- Recuperación de contraseña con token por email
- JWT almacenado en cookie con interceptor automático

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | [Svelte 5](https://svelte.dev/) + [SvelteKit 2](https://kit.svelte.dev/) |
| **Lenguaje** | [TypeScript 6](https://www.typescriptlang.org/) |
| **Estilos** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Build** | [Vite 8](https://vitejs.dev/) |
| **HTTP** | [Axios](https://axios-http.com/) |
| **Calendario** | date-fns + Event Calendar |
| **Editor emoji** | emoji-picker-element |
| **Backend** | NestJS (`not-cloud-bakend.vercel.app`) |

---

## 📦 Instalación

```bash
# clonar el repositorio
git clone https://github.com/tu-usuario/notcloudfrontend.git
cd notcloudfrontend

# instalar dependencias
pnpm install

# configurar variables de entorno
cp .env.example .env
# editar PUBLIC_API_URL con la URL de tu backend

# iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🔧 Scripts

| Comando | Descripción |
|---------|------------|
| `pnpm dev` | Inicia servidor de desarrollo |
| `pnpm build` | Compila para producción |
| `pnpm preview` | Vista previa de build producción |
| `pnpm check` | Type-checking con `svelte-check` |
| `pnpm check:watch` | Type-checking en modo watch |

---

## 🌐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PUBLIC_API_URL` | URL base del backend API | `https://not-cloud-bakend.vercel.app` |

---

## 📁 Estructura del Proyecto

```
src/
├── app.css                  # Estilos globales + 11 temas
├── app.html                 # Shell HTML
├── hooks.server.ts          # Hooks de servidor (auth redirect)
├── lib/
│   ├── assets/              # Imágenes, iconos
│   ├── components/
│   │   ├── ai/              # Asistente IA (AiPrompt)
│   │   ├── calendar/        # Vista calendario
│   │   ├── notes/           # Sidebar, BlockEditor, CommandMenu, etc.
│   │   ├── notifications/   # NotificationPoller
│   │   ├── settings/        # SettingsShell
│   │   └── ui/              # Button, Card, Input, Icon
│   ├── services/            # API services (auth, page, block, reminder, etc.)
│   ├── stores/              # Estado global (layout, theme, pages, settings)
│   ├── types/               # Interfaces TypeScript
│   └── utils/               # Utilidades
└── routes/                  # Páginas SvelteKit
    ├── auth/                # login, register, verify, forgot/reset password
    ├── calendar/
    ├── favorites/
    ├── pages/[id]/
    ├── settings/            # profile, notifications
    └── trash/
```

---

## 🧠 Arquitectura

NotCloud sigue una arquitectura SPA clásica con SvelteKit:

1. **hooks.server.ts** — Verifica autenticación en cada request y redirige según sea necesario
2. **`+layout.svelte`** — Layout raíz: inicializa tema, layout y sidebar
3. **Services** (`src/lib/services/`) — Capa de comunicación con la API via Axios
4. **Stores** (`src/lib/stores/`) — Estado global reactivo con los stores de Svelte 5 runes
5. **Componentes** — UI atómica (Button, Input) → componentes de dominio (BlockEditor, Sidebar) → páginas

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Si encuentras un bug o tienes una sugerencia:

1. Haz fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT © 2026 NotCloud
