<script lang="ts">
  import type { Page } from '$lib/types/page.type';

  let { page }: { page: Page } = $props();

  // Extraemos el primer bloque con contenido para mostrarlo como preview
  let preview = $derived(
    page.blocks?.find(b => b.content && b.content.trim() !== '')?.content ?? ''
  );
</script>

<a
  href="/pages/{page.id}"
  class="group block border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
>
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
