<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { pageService } from '$lib/services/page.service';
  import { refreshPages } from '$lib/stores/pageStore';
  import type { Page } from '$lib/types/page.type';

  let recentPages = $state<Page[]>([]);
  let isCreating = $state(false);

  onMount(async () => {
    recentPages = await pageService.findAll();
  });

  async function handleNewPage() {
    isCreating = true;
    try {
      const newPage = await pageService.create({ title: 'Sin título', icon: '📄' });
      await refreshPages();
      goto(`/pages/${newPage.id}`);
    } finally {
      isCreating = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto px-12 py-16 font-sans">
  <!-- Breadcrumbs -->
  <div class="text-sm text-gray-400 mb-8">
    <span class="font-medium text-gray-900">NotCloud</span>
    <span class="mx-1">/</span>
    <span>Inicio</span>
  </div>

  <!-- Title Section -->
  <div class="mb-10 border-b border-gray-200 pb-8">
    <div class="text-5xl mb-4">🏠</div>
    <h1 class="text-5xl font-bold text-[#37352f] tracking-tight" style="font-family: ui-serif, Georgia, serif;">Inicio</h1>
  </div>

  <!-- New Page Button -->
  <button
    onclick={handleNewPage}
    disabled={isCreating}
    class="mb-12 inline-flex items-center gap-2 px-4 py-2 border border-gray-200 shadow-sm rounded-full bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
    {isCreating ? 'Creando...' : 'Nueva página'}
  </button>

  <!-- Recent Pages from API -->
  {#if recentPages.length > 0}
    <div>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Páginas Recientes</h2>
      <div class="space-y-1">
        {#each recentPages as p}
          <a
            href="/pages/{p.id}"
            class="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-left group"
          >
            <span class="text-xl">{p.icon ?? '📄'}</span>
            <span class="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{p.title ?? 'Sin título'}</span>
          </a>
        {/each}
      </div>
    </div>
  {:else}
    <div class="text-center py-16">
      <p class="text-gray-400 text-sm">No tienes páginas aún.</p>
      <p class="text-gray-300 text-xs mt-1">Crea tu primera con el botón de arriba.</p>
    </div>
  {/if}
</div>
