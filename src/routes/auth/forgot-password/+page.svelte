<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { authService } from '$lib/services/auth.service';
  import notCloudLogo from '$lib/assets/NotCloudLogo.png';

  let email = $state('');
  let isLoading = $state(false);
  let errorMessage = $state('');
  let successMessage = $state('');

  async function handleSubmit() {
    isLoading = true;
    errorMessage = '';
    successMessage = '';

    try {
      const response = await authService.forgotPassword({ email });
      successMessage =
        response.message ||
        'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';
    } catch (error: any) {
      console.error(error);
      errorMessage =
        error.response?.data?.message || 'No se pudo procesar la solicitud. Inténtalo de nuevo.';
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
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Recuperar contraseña</h1>
      <p class="text-gray-500 text-sm mt-2">
        Te enviaremos un enlace para restablecer tu contraseña
      </p>
    </div>

    {#if errorMessage}
      <div class="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">
        {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div class="mb-4 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg text-center border border-green-100">
        {successMessage}
      </div>
    {/if}

    <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Input
        id="email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@correo.com"
        bind:value={email}
      />

      <Button type="submit" class="w-full mt-2" {isLoading}>
        Enviar enlace de recuperación
      </Button>
    </form>

    <div class="mt-8 text-center text-sm text-gray-600">
      <a href="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">Volver al inicio de sesión</a>
    </div>
  </Card>
</div>
