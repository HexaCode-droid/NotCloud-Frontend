<script lang="ts">
  import { onMount } from 'svelte';
  import SettingsShell from '$lib/components/settings/SettingsShell.svelte';
  import { settingsService } from '$lib/services/settings.service';
  import { themes, applyTheme, currentTheme } from '$lib/stores/themeStore';
  import { layouts, applyLayout, currentLayout } from '$lib/stores/layoutStore';
  import type { LayoutId } from '$lib/stores/layoutStore';
  import { loadUserProfile, userProfile } from '$lib/stores/settingsStore';
  import type { ThemeId } from '$lib/types/settings.type';

  let isSavingTheme = $state(false);
  let message = $state('');

  onMount(() => {
    loadUserProfile();
  });

  async function handleThemeChange(theme: ThemeId) {
    isSavingTheme = true;
    message = '';
    try {
      applyTheme(theme);
      await settingsService.updatePreferences({ theme });
      userProfile.update((p) =>
        p?.settings ? { ...p, settings: { ...p.settings, theme } } : p
      );
      message = 'Tema actualizado';
    } catch (error) {
      console.error(error);
      message = 'No se pudo guardar el tema';
    } finally {
      isSavingTheme = false;
    }
  }

  function handleLayoutChange(layout: LayoutId) {
    applyLayout(layout);
    message = 'Disposición actualizada';
  }

</script>


<SettingsShell title="Configuración" breadcrumb="Configuración">
  {#snippet icon()}
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  {/snippet}

  <div class="space-y-2 mb-10">
    <!-- Cuenta -->
    <a href="/settings/profile" class="flex items-center gap-4 p-4 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)] hover:bg-[var(--nc-hover)] transition-colors">
      <span class="w-10 h-10 rounded-lg bg-[var(--nc-hover)] border border-[var(--nc-border)] flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </span>
      <div>
        <p class="font-semibold text-[var(--nc-text)]">Cuenta</p>
        <p class="text-sm text-[var(--nc-muted)]">Correo electrónico, contraseña, datos personales</p>
      </div>
    </a>

    <!-- Notificaciones -->
    <a href="/settings/notifications" class="flex items-center gap-4 p-4 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)] hover:bg-[var(--nc-hover)] transition-colors">
      <span class="w-10 h-10 rounded-lg bg-[var(--nc-hover)] border border-[var(--nc-border)] flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </span>
      <div>
        <p class="font-semibold text-[var(--nc-text)]">Notificaciones</p>
        <p class="text-sm text-[var(--nc-muted)]">Configura qué notificaciones recibir</p>
      </div>
    </a>

    <!-- Calendario -->
    <a href="/calendar" class="flex items-center gap-4 p-4 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)] hover:bg-[var(--nc-hover)] transition-colors">
      <span class="w-10 h-10 rounded-lg bg-[var(--nc-hover)] border border-[var(--nc-border)] flex items-center justify-center flex-shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </span>
      <div>
        <p class="font-semibold text-[var(--nc-text)]">Calendario</p>
        <p class="text-sm text-[var(--nc-muted)]">Recordatorios y eventos programados</p>
      </div>
    </a>
  </div>

  <div class="border-t border-[var(--nc-border)] pt-8">
    <div class="flex items-center gap-3 mb-6">
      <span class="w-8 h-8 rounded-lg bg-[var(--nc-hover)] border border-[var(--nc-border)] flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </span>
      <h2 class="text-2xl font-bold text-[var(--nc-text)]" style="font-family: ui-serif, Georgia, serif;">Apariencia</h2>
    </div>

    {#if message}
      <p class="text-sm text-[var(--nc-primary)] mb-4">{message}</p>
    {/if}

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {#each themes as theme}
        <button
          onclick={() => handleThemeChange(theme.id)}
          disabled={isSavingTheme}
          class="p-4 rounded-xl border-2 transition-all text-left disabled:opacity-50
            {$currentTheme === theme.id
              ? 'border-[var(--nc-primary)] bg-[var(--nc-primary-soft)]'
              : 'border-[var(--nc-border)] bg-[var(--nc-surface)] hover:border-[var(--nc-primary)]'}"
        >
          <div class="w-full h-8 rounded-md mb-3 border {theme.preview}"></div>
          <span class="font-medium text-[var(--nc-text)]">{theme.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="border-t border-[var(--nc-border)] pt-8 mt-10">
    <div class="flex items-center gap-3 mb-6">
      <span class="w-8 h-8 rounded-lg bg-[var(--nc-hover)] border border-[var(--nc-border)] flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
        </svg>
      </span>
      <h2 class="text-2xl font-bold text-[var(--nc-text)]" style="font-family: ui-serif, Georgia, serif;">Disposición</h2>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {#each layouts as layout}
        <button
          onclick={() => handleLayoutChange(layout.id)}
          class="p-4 rounded-xl border-2 transition-all text-left flex flex-col items-center gap-2
            {$currentLayout === layout.id
              ? 'border-[var(--nc-primary)] bg-[var(--nc-primary-soft)]'
              : 'border-[var(--nc-border)] bg-[var(--nc-surface)] hover:border-[var(--nc-primary)]'}"
        >
          {#if layout.icon === 'left'}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          {:else if layout.icon === 'right'}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
          {:else if layout.icon === 'floating'}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="11" height="16" rx="1"/></svg>
          {:else if layout.icon === 'bottom'}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
          {:else if layout.icon === 'top'}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
          {/if}
          <span class="font-medium text-[var(--nc-text)] mt-2">{layout.label}</span>
        </button>
      {/each}
    </div>
  </div>
</SettingsShell>
