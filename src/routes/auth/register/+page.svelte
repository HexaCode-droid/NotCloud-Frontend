<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { authService } from '$lib/services/auth.service';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let isLoading = $state(false);
  let errorMessage = $state('');

  async function handleSubmit() {
    isLoading = true;
    errorMessage = '';
    
    try {
      await authService.register({ name, email, password });
      window.location.href = `/auth/verify?email=${encodeURIComponent(email)}`;
    } catch (error: any) {
      console.error(error);
      errorMessage = error.response?.data?.message || 'Hubo un error al registrar tu cuenta. El usuario podría ya existir.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
  <Card class="w-full max-w-md p-8 shadow-xl shadow-gray-200/50">
    <div class="text-center mb-8 flex flex-col items-center">
      <div class="bg-blue-100 text-blue-600 p-3 rounded-2xl mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Crear Cuenta</h1>
      <p class="text-gray-500 text-sm mt-2">Únete a NotCloud y organiza tus ideas</p>
    </div>
    
    {#if errorMessage}
      <div class="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">
        {errorMessage}
      </div>
    {/if}

    <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Input 
        id="name"
        label="Nombre completo" 
        type="text" 
        placeholder="Tu nombre" 
        bind:value={name} 
      />

      <Input 
        id="email"
        label="Correo electrónico" 
        type="email" 
        placeholder="tu@correo.com" 
        bind:value={email} 
      />
      
      <Input 
        id="password"
        label="Contraseña" 
        type="password" 
        placeholder="••••••••" 
        bind:value={password} 
      />
      
      <Button type="submit" class="w-full mt-4" {isLoading}>
        Registrarme
      </Button>
    </form>
    
    <div class="mt-8 text-center text-sm text-gray-600">
      ¿Ya tienes una cuenta? <a href="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">Inicia sesión</a>
    </div>
  </Card>
</div>
