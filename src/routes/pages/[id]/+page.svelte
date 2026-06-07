<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { pageService } from '$lib/services/page.service';
  import { updatePageInStore, addPageToStore, addFavoriteToStore, refreshPages } from '$lib/stores/pageStore';
  import BlockEditor from '$lib/components/notes/BlockEditor.svelte';
  import SubPageCard from '$lib/components/notes/SubPageCard.svelte';
  import EmojiPicker from '$lib/components/notes/EmojiPicker.svelte';
  import type { Page } from '$lib/types/page.type';

  let pageId = $derived(page.params.id);
  let currentPage = $state<Page | null>(null);
  let isLoading = $state(true);
  let isCreatingSubPage = $state(false);
  let showEmojiPicker = $state(false);

  $effect(() => {
    const id = pageId;
    if (id) loadPage(id);
  });

  async function loadPage(id: string) {
    isLoading = true;
    currentPage = null;
    try {
      currentPage = await pageService.findOne(id);
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
    }
  }

  async function handleTitleBlur() {
    if (!currentPage || !pageId) return;
    await pageService.update(pageId, { title: currentPage.title ?? '' });
  }

  function handleTitleInput() {
    if (!currentPage || !pageId) return;
    updatePageInStore(pageId, { title: currentPage.title ?? '' });
  }

  async function handleToggleFavorite() {
    if (!currentPage || !pageId) return;
    currentPage.isFavorite = !currentPage.isFavorite;
    updatePageInStore(pageId, { isFavorite: currentPage.isFavorite });
    await pageService.update(pageId, { isFavorite: currentPage.isFavorite });
    if (currentPage.isFavorite) {
      addFavoriteToStore(currentPage);
    } else {
      await refreshPages();
    }
  }

  async function handleCreateSubPage() {
    if (!pageId) return;
    isCreatingSubPage = true;
    try {
      const newPage = await pageService.create({
        title: 'Nueva página',
        icon: '📄',
        parentPageId: pageId
      });
      if (currentPage) {
        currentPage.subPages = [...(currentPage.subPages || []), newPage];
      }
      addPageToStore(newPage);
    } finally {
      isCreatingSubPage = false;
    }
  }

  async function handleEmojiSelect(emoji: string) {
    showEmojiPicker = false;
    if (!currentPage || !pageId) return;
    currentPage.icon = emoji;
    updatePageInStore(pageId, { icon: emoji });
    await pageService.update(pageId, { icon: emoji });
  }
</script>

{#if isLoading}
  <div class="flex items-center justify-center h-full">
    <div class="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
{:else if currentPage}
  <div class="max-w-4xl mx-auto px-12 py-16 font-sans">

    <!-- Breadcrumbs -->
    <div class="text-sm text-gray-400 mb-8 flex items-center gap-1">
      <a href="/" class="hover:text-gray-600 transition-colors">NotCloud</a>
      {#if currentPage.parentPageId}
        <span>/</span>
        <span class="text-gray-400">...</span>
      {/if}
      <span>/</span>
      <span class="text-gray-600">{currentPage.title ?? 'Sin título'}</span>
    </div>

    <!-- Page Header -->
    <div class="mb-8 pb-4">
      <div class="relative inline-block">
        <button 
          class="text-5xl mb-4 cursor-pointer select-none hover:bg-gray-100 rounded-lg transition-colors" 
          onclick={() => showEmojiPicker = !showEmojiPicker}
          title="Cambiar ícono"
        >
          {currentPage.icon ?? '📄'}
        </button>
        {#if showEmojiPicker}
          <EmojiPicker 
            onSelect={handleEmojiSelect} 
            onClose={() => showEmojiPicker = false} 
          />
        {/if}
      </div>

      <div class="flex items-start gap-3">
        <input
          type="text"
          bind:value={currentPage.title}
          onblur={handleTitleBlur}
          oninput={handleTitleInput}
          placeholder="Sin título"
          style="font-family: ui-serif, Georgia, serif;"
          class="flex-1 text-5xl font-bold text-[#37352f] tracking-tight outline-none bg-transparent placeholder:text-gray-200"
        />
        <button
          onclick={handleToggleFavorite}
          class="mt-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title={currentPage.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {#if currentPage.isFavorite}
            <svg class="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          {:else}
            <svg class="w-5 h-5 text-gray-300 hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
          {/if}
        </button>
      </div>
      <div class="mt-4 border-t border-gray-100"></div>
    </div>

    <!-- Block Editor -->
    {#if pageId}
      <BlockEditor {pageId} />
    {/if}

    <!-- Sub-pages Section -->
    {#if (currentPage.subPages?.length ?? 0) > 0 || isCreatingSubPage}
      <div class="mt-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sub-páginas</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {#each currentPage.subPages ?? [] as subPage}
            <SubPageCard page={subPage} />
          {/each}
        </div>
      </div>
    {/if}

    <!-- Add sub-page button (always visible at bottom) -->
    <div class="mt-8 pt-4 border-t border-gray-100">
      <button
        onclick={handleCreateSubPage}
        disabled={isCreatingSubPage}
        class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        {isCreatingSubPage ? 'Creando...' : 'Agregar sub-página'}
      </button>
    </div>

  </div>
{:else}
  <div class="flex items-center justify-center h-full">
    <p class="text-gray-400">Página no encontrada.</p>
  </div>
{/if}
