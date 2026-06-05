<script lang="ts">
  import type { BlockType } from '$lib/types/page.type';

  type CommandOption = {
    type: BlockType | 'PAGE';
    label: string;
    description: string;
    icon: string;
  };

  let {
    onselect,
    onclose
  }: {
    onselect: (type: BlockType | 'PAGE') => void;
    onclose: () => void;
  } = $props();

  const commands: CommandOption[] = [
    { type: 'TEXT',  label: 'Texto',    description: 'Párrafo de texto normal',  icon: '¶' },
    { type: 'PAGE',  label: 'Página',   description: 'Incrustar una sub-página',  icon: '📄' },
    { type: 'H1',   label: 'Título 1', description: 'Encabezado grande',         icon: 'H1' },
    { type: 'H2',   label: 'Título 2', description: 'Encabezado mediano',         icon: 'H2' },
    { type: 'H3',   label: 'Título 3', description: 'Encabezado pequeño',         icon: 'H3' },
    { type: 'TODO', label: 'Tarea',    description: 'Lista de tareas (checkbox)', icon: '☑' },
    { type: 'CODE', label: 'Código',   description: 'Bloque de código',           icon: '<>' },
    { type: 'IMAGE',label: 'Imagen',   description: 'Imagen desde URL',           icon: '🖼' },
  ];

  let query = $state('');
  let filtered = $derived(
    commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
  );

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') onclose();
  }

  function focusEl(node: HTMLElement) {
    node.focus();
  }
</script>

<!-- Backdrop -->
<div
  class="fixed inset-0 z-40"
  onclick={onclose}
  onkeydown={handleKeyDown}
  role="button"
  tabindex="-1"
></div>

<!-- Menu -->
<div class="absolute z-50 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
  <div class="p-2 border-b border-gray-100">
    <input
      bind:value={query}
      placeholder="Buscar un bloque..."
      class="w-full text-sm px-2 py-1 outline-none text-gray-700 placeholder:text-gray-400"
      use:focusEl
    />
  </div>
  <div class="py-1 max-h-64 overflow-y-auto">
    {#if filtered.length === 0}
      <p class="px-4 py-3 text-sm text-gray-400 text-center">Sin resultados</p>
    {/if}
    {#each filtered as cmd}
      <button
        class="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
        onclick={() => onselect(cmd.type)}
      >
        <span class="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">{cmd.icon}</span>
        <div>
          <p class="text-sm font-medium text-gray-800">{cmd.label}</p>
          <p class="text-xs text-gray-400">{cmd.description}</p>
        </div>
      </button>
    {/each}
  </div>
</div>
