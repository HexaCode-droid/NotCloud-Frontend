<script lang="ts">
  import 'emoji-picker-element';
  import { onMount } from 'svelte';

  let { onSelect, onClose } = $props<{ onSelect: (emoji: string) => void, onClose: () => void }>();

  let pickerElement: HTMLElement;

  onMount(() => {
    pickerElement.addEventListener('emoji-click', (event: any) => {
      onSelect(event.detail.unicode);
    });
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<!-- Backdrop -->
<div
  class="fixed inset-0 z-40"
  onclick={onClose}
  onkeydown={handleKeyDown}
  role="button"
  tabindex="-1"
></div>

<div class="absolute z-50 mt-2 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
  <emoji-picker bind:this={pickerElement}></emoji-picker>
</div>
