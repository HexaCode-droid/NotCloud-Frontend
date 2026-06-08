<script lang="ts">
  import type { Page } from '$lib/types/page.type';
  import { pageService } from '$lib/services/page.service';
  import { removePageFromStore, addArchivedToStore } from '$lib/stores/pageStore';

  let {
    page,
    ondelete,
  }: {
    page: Page;
    ondelete?: (id: string) => void;
  } = $props();

  let preview = $derived(
    page.blocks?.find(b => b.content && b.content.trim() !== '')?.content ?? ''
  );

  async function handleArchive(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`¿Mover "${page.title ?? 'esta página'}" a la papelera?`)) return;
    try {
      await pageService.archive(page.id);
      removePageFromStore(page.id);
      addArchivedToStore({ ...page, isArchived: true });
      ondelete?.(page.id);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<div class="group relative block border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all bg-white">
  <a href="/pages/{page.id}" class="block">
    <!-- Mini breadcrumb -->
    <p class="text-xs text-gray-400 mb-2 truncate">NotCloud / ... / {page.title ?? 'Sin título'}</p>

    <!-- Icon + Title -->
    <div class="flex items-center gap-2 mb-3">
      <div class="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm">
        {page.icon ?? '📄'}
      </div>
      <span class="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors truncate">
        {page.title ?? 'Sin título'}
      </span>
    </div>

    <!-- Preview of first block -->
    {#if preview}
      <p class="text-xs text-gray-500 leading-relaxed line-clamp-3">{preview}</p>
    {:else}
      <p class="text-xs text-gray-300 italic">Página vacía</p>
    {/if}
  </a>

  <button
    onclick={handleArchive}
    class="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
    title="Mover a papelera"
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  </button>
</div>
