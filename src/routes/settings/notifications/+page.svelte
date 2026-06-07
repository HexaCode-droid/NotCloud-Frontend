<script lang="ts">
  import { onMount } from 'svelte';
  import SettingsShell from '$lib/components/settings/SettingsShell.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { settingsService } from '$lib/services/settings.service';
  import { loadUserProfile, userProfile } from '$lib/stores/settingsStore';

  let emailNotifications = $state(true);
  let browserNotifications = $state(true);
  let reminderNotifications = $state(true);
  let isSaving = $state(false);
  let message = $state('');
  let errorMessage = $state('');

  onMount(async () => {
    const profile = await loadUserProfile();
    if (profile.settings) {
      emailNotifications = profile.settings.emailNotifications;
      browserNotifications = profile.settings.browserNotifications;
      reminderNotifications = profile.settings.reminderNotifications;
    }
  });

  async function requestBrowserPermission() {
    if (typeof Notification === 'undefined') {
      errorMessage = 'Tu navegador no soporta notificaciones';
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      errorMessage = 'Permiso de notificaciones denegado';
      browserNotifications = false;
    } else {
      errorMessage = '';
      message = 'Notificaciones del navegador activadas';
    }
  }

  async function handleSave() {
    isSaving = true;
    message = '';
    errorMessage = '';

    if (browserNotifications) {
      await requestBrowserPermission();
    }

    try {
      const updated = await settingsService.updatePreferences({
        emailNotifications,
        browserNotifications,
        reminderNotifications
      });
      userProfile.update((p) => (p ? { ...p, settings: updated } : p));
      message = 'Preferencias de notificaciones guardadas';
    } catch (error: any) {
      errorMessage = error.response?.data?.message || 'Error al guardar preferencias';
    } finally {
      isSaving = false;
    }
  }
</script>

<SettingsShell title="Notificaciones" breadcrumb="Notificaciones">
  {#snippet icon()}
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  {/snippet}
  <p class="text-[var(--nc-muted)] mb-8">
    Elige cómo quieres recibir avisos de recordatorios y actividad en NotCloud.
  </p>

  {#if message}
    <p class="text-sm text-[var(--nc-primary)] mb-4">{message}</p>
  {/if}
  {#if errorMessage}
    <p class="text-sm text-red-600 mb-4">{errorMessage}</p>
  {/if}

  <div class="space-y-4 mb-8">
    <label class="flex items-center justify-between p-4 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)] cursor-pointer">
      <div>
        <p class="font-medium text-[var(--nc-text)]">Correo electrónico</p>
        <p class="text-sm text-[var(--nc-muted)]">Recibir recordatorios por email</p>
      </div>
      <input type="checkbox" bind:checked={emailNotifications} class="w-5 h-5 accent-[var(--nc-primary)]" />
    </label>

    <label class="flex items-center justify-between p-4 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)] cursor-pointer">
      <div>
        <p class="font-medium text-[var(--nc-text)]">Navegador</p>
        <p class="text-sm text-[var(--nc-muted)]">Notificaciones push en este dispositivo</p>
      </div>
      <input type="checkbox" bind:checked={browserNotifications} class="w-5 h-5 accent-[var(--nc-primary)]" />
    </label>

    <label class="flex items-center justify-between p-4 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)] cursor-pointer">
      <div>
        <p class="font-medium text-[var(--nc-text)]">Recordatorios</p>
        <p class="text-sm text-[var(--nc-muted)]">Activar avisos de eventos del calendario</p>
      </div>
      <input type="checkbox" bind:checked={reminderNotifications} class="w-5 h-5 accent-[var(--nc-primary)]" />
    </label>
  </div>

  <Button onclick={handleSave} isLoading={isSaving}>
    Guardar preferencias
  </Button>
</SettingsShell>
