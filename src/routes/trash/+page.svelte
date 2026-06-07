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
    <div class="text-5xl mb-4">🗑️</div>
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
            <span class="text-xl shrink-0 opacity-60">{p.icon ?? '📄'}</span>
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
