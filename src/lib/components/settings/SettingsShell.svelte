<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    icon: Snippet;
    breadcrumb?: string;
    children: Snippet;
  }

  let { title, icon, breadcrumb = 'Configuración', children }: Props = $props();
</script>

<div class="max-w-3xl mx-auto px-12 py-16 font-sans">
  <div class="text-sm text-[var(--nc-muted)] mb-8">
    <a href="/" class="hover:text-[var(--nc-text)] transition-colors">NotCloud</a>
    <span class="mx-1">/</span>
    <a href="/settings" class="hover:text-[var(--nc-text)] transition-colors">Más</a>
    <span class="mx-1">/</span>
    <span>{breadcrumb}</span>
  </div>

  <div class="mb-10 border-b border-[var(--nc-border)] pb-8">
    <div class="flex items-center gap-4 mb-4">
      <div class="w-14 h-14 rounded-xl bg-[var(--nc-surface)] border border-[var(--nc-border)] flex items-center justify-center">
        {@render icon()}
      </div>
      <h1 class="text-4xl font-bold text-[var(--nc-text)] tracking-tight" style="font-family: ui-serif, Georgia, serif;">
        {title}
      </h1>
    </div>
  </div>

  {@render children()}
</div>
