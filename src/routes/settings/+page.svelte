<script lang="ts">
  import { onMount } from 'svelte';
  import SettingsShell from '$lib/components/settings/SettingsShell.svelte';
  import { settingsService } from '$lib/services/settings.service';
  import { themes, applyTheme, currentTheme } from '$lib/stores/themeStore';
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

  const sections = [
    {
      href: '/settings/profile',
      icon: '👤',
      title: 'Cuenta',
      description: 'Correo electrónico, contraseña, datos personales'
    },
    {
      href: '/settings/notifications',
      icon: '🔔',
      title: 'Notificaciones',
      description: 'Configura qué notificaciones recibir'
    },
    {
      href: '/calendar',
      icon: '📅',
      title: 'Calendario',
      description: 'Recordatorios y eventos programados'
    }
  ];
</script>

<SettingsShell title="Configuración" icon="⚙️">
  <div class="space-y-2 mb-10">
    {#each sections as section}
      <a
        href={section.href}
        class="flex items-center gap-4 p-4 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)] hover:bg-[var(--nc-hover)] transition-colors"
      >
        <span class="text-2xl">{section.icon}</span>
        <div>
          <p class="font-semibold text-[var(--nc-text)]">{section.title}</p>
          <p class="text-sm text-[var(--nc-muted)]">{section.description}</p>
        </div>
      </a>
    {/each}
  </div>

  <div class="border-t border-[var(--nc-border)] pt-8">
    <div class="flex items-center gap-3 mb-6">
      <span class="text-2xl">🎨</span>
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
</SettingsShell>
