<script lang="ts">
  import { page } from '$app/state';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { authService } from '$lib/services/auth.service';
  import notCloudLogo from '$lib/assets/NotCloudLogo.png';

  let newPassword = $state('');
  let confirmPassword = $state('');
  let isLoading = $state(false);
  let errorMessage = $state('');
  let successMessage = $state('');

  const token = $derived(page.url.searchParams.get('token') ?? '');

  async function handleSubmit() {
    if (!token) {
      errorMessage = 'El enlace de recuperación no es válido o ha expirado.';
      return;
    }

    if (newPassword !== confirmPassword) {
      errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    isLoading = true;
    errorMessage = '';
    successMessage = '';

    try {
      const response = await authService.resetPassword({ token, newPassword });
      successMessage =
        response.message || 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.';
    } catch (error: any) {
      console.error(error);
      errorMessage =
        error.response?.data?.message || 'El enlace de recuperación no es válido o ha expirado.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
  <Card class="w-full max-w-md p-8 shadow-xl shadow-gray-200/50">
    <div class="text-center mb-8 flex flex-col items-center">
      <div class="mb-4">
        <img src={notCloudLogo} alt="NotCloud Logo" class="h-10 object-contain" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Nueva contraseña</h1>
      <p class="text-gray-500 text-sm mt-2">Crea una contraseña segura para tu cuenta</p>
    </div>

    {#if !token}
      <div class="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">
        El enlace de recuperación no es válido o ha expirado.
      </div>
    {/if}

    {#if errorMessage}
      <div class="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">
        {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div class="mb-4 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg text-center border border-green-100">
        {successMessage}
      </div>
      <div class="text-center">
        <a href="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">Ir al inicio de sesión</a>
      </div>
    {:else if token}
      <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Input
          id="newPassword"
          label="Nueva contraseña"
          type="password"
          placeholder="••••••••"
          bind:value={newPassword}
        />

        <Input
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          bind:value={confirmPassword}
        />

        <Button type="submit" class="w-full mt-2" {isLoading}>
          Restablecer contraseña
        </Button>
      </form>
    {/if}

    <div class="mt-8 text-center text-sm text-gray-600">
      <a href="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">Volver al inicio de sesión</a>
    </div>
  </Card>
</div>
