<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import { authService } from '$lib/services/auth.service';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let isLoading = $state(false);
  let errorMessage = $state('');

  async function handleSubmit() {
    isLoading = true;
    errorMessage = '';
    
    try {
      await authService.login({ email, password });
      goto('/');
    } catch (error: any) {
      console.error(error);
      errorMessage = error.response?.data?.message || 'Correo o contraseña incorrectos.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
  <Card class="w-full max-w-md p-8 shadow-xl shadow-gray-200/50">
    <div class="text-center mb-8 flex flex-col items-center">
      <div class="bg-blue-100 text-blue-600 p-3 rounded-2xl mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Iniciar Sesión</h1>
      <p class="text-gray-500 text-sm mt-2">Bienvenido de nuevo a NotCloud</p>
    </div>
    
    {#if errorMessage}
      <div class="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">
        {errorMessage}
      </div>
    {/if}
    
    <form class="flex flex-col gap-5" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Input 
        id="email"
        label="Correo electrónico" 
        type="email" 
        placeholder="example@email.com" 
        bind:value={email} 
      />
      
      <Input 
        id="password"
        label="Contraseña" 
        type="password" 
        placeholder="••••••••" 
        bind:value={password} 
      />
      
      <div class="flex items-center justify-end -mt-2">
        <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500">¿Olvidaste tu contraseña?</a>
      </div>
      
      <Button type="submit" class="w-full mt-2" {isLoading}>
        Entrar a mis notas
      </Button>
    </form>
    
    <div class="mt-8 text-center text-sm text-gray-600">
      ¿No tienes una cuenta? <a href="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">Regístrate gratis</a>
    </div>
  </Card>
</div>
