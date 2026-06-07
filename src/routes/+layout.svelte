<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import Sidebar from '$lib/components/notes/Sidebar.svelte';
  import NotificationPoller from '$lib/components/notifications/NotificationPoller.svelte';
  import { applyTheme, loadStoredTheme } from '$lib/stores/themeStore';
  import { loadUserProfile } from '$lib/stores/settingsStore';

  let { children } = $props();

  let isAuthRoute = $derived(page.url.pathname.startsWith('/auth'));

  onMount(async () => {
    applyTheme(loadStoredTheme());
    if (!isAuthRoute) {
      try {
        await loadUserProfile();
      } catch {
        // Usuario no autenticado o token expirado
      }
    }
  });
</script>

{#if isAuthRoute}
  {@render children()}
{:else}
  <div class="flex h-screen overflow-hidden font-sans" style="background: var(--nc-bg); color: var(--nc-text);">
    <Sidebar />
    <main class="flex-1 overflow-y-auto" style="background: var(--nc-bg);">
      {@render children()}
    </main>
    <NotificationPoller />
  </div>
{/if}
