<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import Sidebar from '$lib/components/notes/Sidebar.svelte';

  let { children } = $props();
  
  let isAuthRoute = $derived(page.url.pathname.startsWith('/auth'));
</script>

{#if isAuthRoute}
  {@render children()}
{:else}
  <div class="flex h-screen bg-white overflow-hidden text-gray-800 font-sans">
    <Sidebar />
    <main class="flex-1 overflow-y-auto">
      {@render children()}
    </main>
  </div>
{/if}
