<script lang="ts">
  import { onMount } from 'svelte';
  import { pageService } from '$lib/services/page.service';
  import {
    archivedPages,
    refreshPages,
    removeArchivedFromStore,
    removePageFromStore
  } from '$lib/stores/pageStore';

  let isLoading = $state(true);

  onMount(async () => {
    await refreshPages();
    isLoading = false;
  });

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  async function handleRestore(id: string) {
    try {
      await pageService.restore(id);
      removeArchivedFromStore(id);
      await refreshPages();
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePermanentDelete(id: string) {
    if (!confirm('¿Eliminar permanentemente esta página? Esta acción no se puede deshacer.')) return;
    try {
      await pageService.remove(id);
      removeArchivedFromStore(id);
      removePageFromStore(id);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="max-w-4xl mx-auto px-12 py-16 font-sans">
  <div class="text-sm text-gray-400 mb-8">
    <span class="font-medium text-gray-900">NotCloud</span>
    <span class="mx-1">/</span>
    <span>Papelera</span>
  </div>

  <div class="mb-10 border-b border-gray-200 pb-8">
    <div class="mb-4 w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
    </div>
    <h1 class="text-5xl font-bold text-[#37352f] tracking-tight" style="font-family: ui-serif, Georgia, serif;">
      Papelera
    </h1>
    <p class="text-gray-500 mt-3">Páginas eliminadas que puedes restaurar o borrar definitivamente</p>
  </div>

  {#if isLoading}
    <div class="flex justify-center py-16">
      <div class="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  {:else if $archivedPages.length > 0}
    <div class="space-y-1">
      {#each $archivedPages as p}
        <div class="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100 transition-colors group">
          <div class="flex items-center gap-3 min-w-0">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 flex-shrink-0 opacity-60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </span>
            <div class="min-w-0">
              <p class="font-medium text-gray-700 truncate">{p.title ?? 'Sin título'}</p>
              <p class="text-xs text-gray-400">Eliminada el {formatDate(p.updatedAt)}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
            <button
              onclick={() => handleRestore(p.id)}
              class="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Restaurar
            </button>
            <button
              onclick={() => handlePermanentDelete(p.id)}
              class="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center py-16">
      <p class="text-gray-400 text-sm">La papelera está vacía.</p>
      <p class="text-gray-300 text-xs mt-1">Las páginas que elimines aparecerán aquí.</p>
    </div>
  {/if}
</div>
