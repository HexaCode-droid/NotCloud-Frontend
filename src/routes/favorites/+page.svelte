<script lang="ts">
  import { onMount } from 'svelte';
  import { pageService } from '$lib/services/page.service';
  import { favoritePages, refreshPages, updatePageInStore } from '$lib/stores/pageStore';

  let isLoading = $state(true);

  onMount(async () => {
    await refreshPages();
    isLoading = false;
  });

  async function handleUnfavorite(e: MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await pageService.update(id, { isFavorite: false });
      updatePageInStore(id, { isFavorite: false });
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="max-w-4xl mx-auto px-12 py-16 font-sans">
  <div class="text-sm text-gray-400 mb-8">
    <span class="font-medium text-gray-900">NotCloud</span>
    <span class="mx-1">/</span>
    <span>Favoritos</span>
  </div>

  <div class="mb-10 border-b border-gray-200 pb-8">
    <div class="mb-4 w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </div>
    <h1 class="text-5xl font-bold text-[#37352f] tracking-tight" style="font-family: ui-serif, Georgia, serif;">
      Favoritos
    </h1>
    <p class="text-gray-500 mt-3">Tus páginas marcadas con estrella</p>
  </div>

  {#if isLoading}
    <div class="flex justify-center py-16">
      <div class="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  {:else if $favoritePages.length > 0}
    <div class="space-y-1">
      {#each $favoritePages as p}
        <a
          href="/pages/{p.id}"
          class="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-left group"
        >
          <span class="flex items-center gap-3 min-w-0">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </span>
            <span class="font-medium text-gray-700 group-hover:text-gray-900 transition-colors truncate">
              {p.title ?? 'Sin título'}
            </span>
          </span>
          <button
            onclick={(e) => handleUnfavorite(e, p.id)}
            class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-yellow-50 text-yellow-500 transition-all shrink-0"
            title="Quitar de favoritos"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </a>
      {/each}
    </div>
  {:else}
    <div class="text-center py-16">
      <p class="text-gray-400 text-sm">No tienes páginas favoritas.</p>
      <p class="text-gray-300 text-xs mt-1">Marca una página con la estrella para verla aquí.</p>
    </div>
  {/if}
</div>
