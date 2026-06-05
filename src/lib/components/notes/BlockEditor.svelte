<script lang="ts">
  import { blockService } from '$lib/services/block.service';
  import { pageService } from '$lib/services/page.service';
  import { refreshPages } from '$lib/stores/pageStore';
  import { goto } from '$app/navigation';
  import CommandMenu from './CommandMenu.svelte';
  import type { Block, BlockType } from '$lib/types/page.type';

  let { pageId }: { pageId: string } = $props();

  let blocks = $state<Block[]>([]);
  let showCommand = $state(false);
  let commandAnchorIndex = $state<number | null>(null);
  let saveTimers: Record<string, ReturnType<typeof setTimeout>> = {};

  // $effect se dispara cada vez que pageId cambia (fix del bug de navegación)
  $effect(() => {
    const id = pageId;
    blocks = [];
    blockService.findAll(id).then(data => { blocks = data; });
  });

  // Auto-guardado: espera 800ms de inactividad antes de guardar
  function scheduleSave(block: Block) {
    clearTimeout(saveTimers[block.id]);
    saveTimers[block.id] = setTimeout(async () => {
      await blockService.update(pageId, block.id, { content: block.content ?? '' });
    }, 800);
  }

  async function handleKeyDown(e: KeyboardEvent, block: Block, index: number) {
    const target = e.target as HTMLElement;
    
    // Detectar "/" al principio de una línea vacía para abrir el menú de comandos
    if (e.key === '/' && (block.content === '' || block.content === null)) {
      e.preventDefault();
      commandAnchorIndex = index;
      showCommand = true;
      return;
    }

    // Enter → crear nuevo bloque TEXT debajo
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBlock = await blockService.create(pageId, {
        type: 'TEXT',
        content: '',
        order: index + 1
      });
      // Reordenar localmente los bloques siguientes
      blocks = [...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)];
      // Focus al nuevo bloque
      setTimeout(() => {
        const els = document.querySelectorAll('[data-block-input]');
        (els[index + 1] as HTMLElement)?.focus();
      }, 50);
      return;
    }

    // Backspace en bloque vacío → eliminar bloque
    if (e.key === 'Backspace' && (block.content === '' || block.content === null) && blocks.length > 1) {
      e.preventDefault();
      await blockService.remove(pageId, block.id);
      blocks = blocks.filter(b => b.id !== block.id);
      setTimeout(() => {
        const els = document.querySelectorAll('[data-block-input]');
        (els[Math.max(0, index - 1)] as HTMLElement)?.focus();
      }, 50);
    }
  }

  async function handleCommandSelect(type: BlockType | 'PAGE') {
    showCommand = false;
    if (commandAnchorIndex === null) return;

    if (type === 'PAGE') {
      const targetBlock = blocks[commandAnchorIndex];
      // Si el bloque estaba vacío, lo eliminamos para no dejar basura
      if (!targetBlock.content) {
        await blockService.remove(pageId, targetBlock.id);
      }
      
      const newPage = await pageService.create({ 
        title: 'Sin título', 
        icon: '📄', 
        parentPageId: pageId 
      });
      await refreshPages();
      goto(`/pages/${newPage.id}`);
      return;
    }

    const targetBlock = blocks[commandAnchorIndex];
    // Cambiar el tipo del bloque actual
    const updated = await blockService.update(pageId, targetBlock.id, { type });
    blocks[commandAnchorIndex] = { ...targetBlock, type };
    commandAnchorIndex = null;
  }

  function getBlockClass(type: BlockType): string {
    switch (type) {
      case 'H1':   return 'text-4xl font-bold text-gray-900 py-1';
      case 'H2':   return 'text-2xl font-bold text-gray-800 py-1';
      case 'H3':   return 'text-xl font-semibold text-gray-800 py-0.5';
      case 'CODE': return 'font-mono text-sm bg-gray-100 px-3 py-2 rounded-md text-gray-800';
      case 'TODO': return 'text-base text-gray-700';
      default:     return 'text-base text-gray-700 leading-relaxed';
    }
  }
</script>

<div class="flex flex-col gap-1">
  {#each blocks as block, i}
    <div class="relative group flex items-start gap-2">
      
      <!-- Ícono de tipo (solo se muestra en hover) -->
      <button
        onclick={() => { commandAnchorIndex = i; showCommand = true; }}
        class="opacity-0 group-hover:opacity-100 transition-opacity mt-1 p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded shrink-0"
        title="Cambiar tipo de bloque"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
      </button>

      <!-- Checkbox para TODO -->
      {#if block.type === 'TODO'}
        <input type="checkbox" class="mt-1.5 shrink-0 accent-blue-600" />
      {/if}

      <!-- Input del bloque (contenteditable o textarea) -->
      <div class="flex-1 relative">
        {#if block.type === 'CODE'}
          <textarea
            data-block-input
            bind:value={block.content}
            oninput={() => scheduleSave(block)}
            onkeydown={(e) => handleKeyDown(e, block, i)}
            rows={3}
            placeholder="Escribe código aquí..."
            class="w-full resize-none outline-none bg-transparent {getBlockClass(block.type)} placeholder:text-gray-300"
          ></textarea>
        {:else}
          <input
            data-block-input
            type="text"
            bind:value={block.content}
            oninput={() => scheduleSave(block)}
            onkeydown={(e) => handleKeyDown(e, block, i)}
            placeholder={block.type === 'H1' ? 'Título 1' : block.type === 'H2' ? 'Título 2' : block.type === 'H3' ? 'Título 3' : 'Escribe algo, o / para comandos...'}
            class="w-full outline-none bg-transparent {getBlockClass(block.type)} placeholder:text-gray-300"
          />
        {/if}

        <!-- Menú de comandos anclado a este bloque -->
        {#if showCommand && commandAnchorIndex === i}
          <CommandMenu
            onselect={handleCommandSelect}
            onclose={() => { showCommand = false; commandAnchorIndex = null; }}
          />
        {/if}
      </div>
    </div>
  {/each}

  <!-- Área vacía al final para añadir bloques -->
  {#if blocks.length === 0}
    <button
      class="text-left text-gray-300 hover:text-gray-400 text-base py-1 px-7 transition-colors"
      onclick={async () => {
        const b = await blockService.create(pageId, { type: 'TEXT', content: '', order: 0 });
        blocks = [b];
        setTimeout(() => (document.querySelector('[data-block-input]') as HTMLElement)?.focus(), 50);
      }}
    >
      Haz clic para escribir, o escribe / para ver los comandos...
    </button>
  {/if}
</div>
