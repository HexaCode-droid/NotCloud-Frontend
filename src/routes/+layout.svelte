<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import Sidebar from '$lib/components/notes/Sidebar.svelte';
  import NotificationPoller from '$lib/components/notifications/NotificationPoller.svelte';
  import { applyTheme, loadStoredTheme } from '$lib/stores/themeStore';
  import { applyLayout, loadStoredLayout, currentLayout } from '$lib/stores/layoutStore';
  import { loadUserProfile } from '$lib/stores/settingsStore';

  let { children } = $props();

  let isAuthRoute = $derived(page.url.pathname.startsWith('/auth'));

  onMount(async () => {
    applyTheme(loadStoredTheme());
    applyLayout(loadStoredLayout());
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
  <div 
    class="flex h-screen overflow-hidden font-sans
      {$currentLayout === 'SIDEBAR_RIGHT' ? 'flex-row-reverse' : ''}
      {$currentLayout === 'DOCK_BOTTOM' ? 'flex-col-reverse' : ''}
      {$currentLayout === 'DOCK_TOP' ? 'flex-col' : ''}
      {$currentLayout === 'FLOATING_PANELS' ? 'p-3 sm:p-5 gap-3 sm:gap-5' : ''}"
    style="background: transparent; color: var(--nc-text);"
  >
    <Sidebar />
    <main 
      class="flex-1 overflow-y-auto {$currentLayout === 'FLOATING_PANELS' ? 'rounded-2xl shadow-xl border border-[var(--nc-border)]' : ''}" 
      style="background: {$currentLayout === 'FLOATING_PANELS' ? 'var(--nc-surface)' : 'var(--nc-bg)'};"
    >
      {@render children()}
    </main>
    <NotificationPoller />
  </div>
{/if}
