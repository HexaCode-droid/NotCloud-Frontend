<script lang="ts">
  import { onMount } from 'svelte';
  import SettingsShell from '$lib/components/settings/SettingsShell.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { settingsService } from '$lib/services/settings.service';
  import { loadUserProfile, userProfile, updateProfileInStore } from '$lib/stores/settingsStore';

  let name = $state('');
  let email = $state('');
  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  let isSavingProfile = $state(false);
  let isSavingPassword = $state(false);
  let profileMessage = $state('');
  let passwordMessage = $state('');
  let passwordError = $state('');

  onMount(async () => {
    const profile = await loadUserProfile();
    name = profile.name ?? '';
    email = profile.email;
  });

  async function handleSaveProfile() {
    isSavingProfile = true;
    profileMessage = '';
    try {
      const updated = await settingsService.updateProfile({ name });
      updateProfileInStore(updated);
      profileMessage = 'Perfil actualizado correctamente';
    } catch (error: any) {
      profileMessage = error.response?.data?.message || 'Error al guardar el perfil';
    } finally {
      isSavingProfile = false;
    }
  }

  async function handleChangePassword() {
    passwordError = '';
    passwordMessage = '';

    if (newPassword !== confirmPassword) {
      passwordError = 'Las contraseñas no coinciden';
      return;
    }

    if (newPassword.length < 8) {
      passwordError = 'La nueva contraseña debe tener al menos 8 caracteres';
      return;
    }

    isSavingPassword = true;
    try {
      const result = await settingsService.changePassword({ currentPassword, newPassword });
      passwordMessage = result.message;
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
    } catch (error: any) {
      passwordError = error.response?.data?.message || 'Error al cambiar la contraseña';
    } finally {
      isSavingPassword = false;
    }
  }
</script>

<SettingsShell title="Cuenta" breadcrumb="Cuenta">
  {#snippet icon()}
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  {/snippet}
  <div class="space-y-10">
    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-[var(--nc-text)]">Datos personales</h2>

      {#if profileMessage}
        <p class="text-sm text-[var(--nc-primary)]">{profileMessage}</p>
      {/if}

      <Input id="email" label="Correo electrónico" type="email" bind:value={email} disabled />
      <Input id="name" label="Nombre completo" type="text" placeholder="Tu nombre" bind:value={name} />

      <Button onclick={handleSaveProfile} isLoading={isSavingProfile}>
        Guardar cambios
      </Button>
    </section>

    <section class="space-y-4 border-t border-[var(--nc-border)] pt-8">
      <h2 class="text-lg font-semibold text-[var(--nc-text)]">Cambiar contraseña</h2>

      {#if passwordMessage}
        <p class="text-sm text-green-600">{passwordMessage}</p>
      {/if}
      {#if passwordError}
        <p class="text-sm text-red-600">{passwordError}</p>
      {/if}

      <Input id="currentPassword" label="Contraseña actual" type="password" bind:value={currentPassword} />
      <Input id="newPassword" label="Nueva contraseña" type="password" bind:value={newPassword} />
      <Input id="confirmPassword" label="Confirmar nueva contraseña" type="password" bind:value={confirmPassword} />

      <Button onclick={handleChangePassword} isLoading={isSavingPassword}>
        Actualizar contraseña
      </Button>
    </section>
  </div>
</SettingsShell>
