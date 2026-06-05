<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let {
    children,
    class: className = ''
  }: {
    children: Snippet;
    class?: string;
  } = $props();
</script>

<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden {className}">
  {@render children()}
</div>
