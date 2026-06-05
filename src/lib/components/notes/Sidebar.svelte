<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { pages, recentPages, refreshPages } from '$lib/stores/pageStore';
  import { pageService } from '$lib/services/page.service';
  import type { Page } from '$lib/types/page.type';

  let currentPath = $derived(page.url.pathname);
  let isCreating = $state(false);

  onMount(async () => {
    await refreshPages();
  });

  async function handleNewPage() {
    isCreating = true;
    try {
      const newPage = await pageService.create({ title: 'Sin título', icon: '📄' });
      await refreshPages();
      goto(`/pages/${newPage.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      isCreating = false;
    }
  }

  async function handleDeletePage(e: MouseEvent, pageId: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('¿Eliminar esta página?')) return;
    await pageService.remove(pageId);
    await refreshPages();
    if (currentPath.includes(pageId)) goto('/');
  }

  function handleLogout() {
    document.cookie = 'token=; Max-Age=0; path=/';
    window.location.href = '/auth/login';
  }
</script>

<aside class="w-64 h-full border-r border-gray-200 bg-[#fbfbfa] flex flex-col justify-between shrink-0">
  <div class="overflow-y-auto pb-4 flex-1">
    <!-- Header -->
    <div class="px-4 py-3 hover:bg-gray-200/50 cursor-pointer transition-colors flex items-center gap-2 group">
      <div class="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
      </div>
      <span class="font-semibold text-gray-900 text-sm">NotCloud</span>
    </div>

    <!-- Quick Actions -->
    <div class="mt-2 px-2 space-y-0.5">
      <a href="/" class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md {currentPath === '/' ? 'bg-gray-200/70 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-200/50'}">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        Inicio
      </a>
      <a href="/favorites" class="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-200/50 rounded-md">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        Favoritos
      </a>
      <a href="/trash" class="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-200/50 rounded-md">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        Papelera
      </a>
    </div>

    <!-- Recent Pages -->
    <div class="mt-6">
      <div class="px-4 text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Recientes</div>
      <nav class="px-2 space-y-0.5">
        {#if $recentPages.length === 0}
          <p class="px-2 py-1.5 text-xs text-gray-400 italic">No hay recientes</p>
        {/if}
        {#each $recentPages as p}
          <a
            href="/pages/{p.id}"
            class="group w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md {currentPath === `/pages/${p.id}` ? 'bg-gray-200/70 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-200/50'}"
          >
            <span class="flex items-center gap-2 truncate">
              <span>{p.icon ?? '📄'}</span>
              <span class="truncate">{p.title ?? 'Sin título'}</span>
            </span>
          </a>
        {/each}
      </nav>
    </div>

    <!-- Pages Section -->
    <div class="mt-4">
      <div class="px-4 text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Mis páginas</div>
      <nav class="px-2 space-y-0.5">
        {#if $pages.length === 0}
          <p class="px-2 py-1.5 text-xs text-gray-400 italic">Sin páginas aún</p>
        {/if}
        {#each $pages as p}
          <a
            href="/pages/{p.id}"
            class="group w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md {currentPath === `/pages/${p.id}` ? 'bg-gray-200/70 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-200/50'}"
          >
            <span class="flex items-center gap-2 truncate">
              <span>{p.icon ?? '📄'}</span>
              <span class="truncate">{p.title ?? 'Sin título'}</span>
            </span>
            <button
              onclick={(e) => handleDeletePage(e, p.id)}
              class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-all shrink-0"
              title="Eliminar"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </a>
        {/each}
      </nav>
    </div>
  </div>

  <!-- Bottom actions -->
  <div class="p-2 border-t border-gray-200 space-y-0.5">
    <button
      onclick={handleNewPage}
      disabled={isCreating}
      class="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200/50 rounded-md transition-colors disabled:opacity-50"
    >
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
      {isCreating ? 'Creando...' : 'Nueva página'}
    </button>
    <button onclick={handleLogout} class="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200/50 rounded-md transition-colors">
      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      Cerrar sesión
    </button>
  </div>
</aside>
