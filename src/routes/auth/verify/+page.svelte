<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import { authService } from '$lib/services/auth.service';
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let email = $state('');
  let codeDigits = $state(['', '', '', '', '', '']);
  let isLoading = $state(false);
  let errorMessage = $state('');
  let inputRefs: HTMLInputElement[] = [];

  onMount(() => {
    // Si venimos del registro, atrapamos el correo de la URL
    const emailFromUrl = page.url.searchParams.get('email');
    if (emailFromUrl) {
      email = emailFromUrl;
    }
  });

  // Función para ocultar parte del correo (ej: sebas***@gmail.com)
  function obfuscateEmail(e: string) {
    if (!e) return '';
    const [name, domain] = e.split('@');
    if (!name || !domain) return e;
    if (name.length <= 3) return `${name}***@${domain}`;
    return `${name.substring(0, 3)}***@${domain}`;
  }

  function handleInput(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    // Solo permitir números
    target.value = value.replace(/[^0-9]/g, '');
    codeDigits[index] = target.value;

    // Saltar al siguiente input automáticamente
    if (target.value !== '' && index < 5) {
      inputRefs[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent) {
    // Si presiona borrar y el input actual está vacío, volver al anterior
    if (event.key === 'Backspace' && codeDigits[index] === '' && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').replace(/[^0-9]/g, '').substring(0, 6);
    if (!pastedData) return;
    
    for (let i = 0; i < pastedData.length; i++) {
      codeDigits[i] = pastedData[i];
    }
    
    // Enfocar el input después del último pegado
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs[nextIndex]?.focus();
  }

  async function handleSubmit() {
    const code = codeDigits.join('');
    if (code.length !== 6) {
      errorMessage = 'Por favor ingresa el código completo de 6 dígitos.';
      return;
    }

    isLoading = true;
    errorMessage = '';
    
    try {
      await authService.verifyEmail({ email, code });
      window.location.href = '/';
    } catch (error: any) {
      console.error(error);
      errorMessage = error.response?.data?.message || 'Código incorrecto o expirado.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-[#f8faff] p-4 relative overflow-hidden font-sans">
  <!-- Fondo decorativo suave -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-white pointer-events-none"></div>

  <div class="w-full max-w-md z-10 flex flex-col items-center">
    
    <!-- Icono centrado (usando uno similar al de fingerprint/seguridad de tu imagen) -->
    <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-gray-100">
      <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
    </div>

    <h1 class="text-2xl font-bold text-gray-900 tracking-tight mb-2">Code Verification</h1>
    <p class="text-gray-500 text-sm mb-8 text-center">
      We have sent code to your Email <span class="font-medium text-blue-600">{obfuscateEmail(email)}</span>
    </p>
    
    {#if errorMessage}
      <div class="mb-6 w-full p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">
        {errorMessage}
      </div>
    {/if}

    <form class="w-full flex flex-col items-center" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      
      <!-- Contenedor de los 6 inputs del código -->
      <div class="flex gap-2 sm:gap-3 mb-8" onpaste={handlePaste}>
        {#each codeDigits as digit, i}
          <input
            bind:this={inputRefs[i]}
            type="text"
            inputmode="numeric"
            maxlength="1"
            value={digit}
            oninput={(e) => handleInput(i, e)}
            onkeydown={(e) => handleKeyDown(i, e)}
            class="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
        {/each}
      </div>
      
      <Button type="submit" class="w-full py-3.5 rounded-full text-base font-medium shadow-lg shadow-blue-500/30" {isLoading}>
        Verify Account
      </Button>
    </form>
    
    <div class="mt-8 text-center text-sm">
      <span class="text-gray-500">Didn't receive code?</span> 
      <button class="font-medium text-blue-600 hover:text-blue-700 ml-1 transition-colors">Resend</button>
    </div>
  </div>
</div>
