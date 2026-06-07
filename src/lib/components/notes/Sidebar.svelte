<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import {
    pages,
    recentPages,
    refreshPages,
    addPageToStore,
    removePageFromStore,
    addArchivedToStore
  } from '$lib/stores/pageStore';
  import { pageService } from '$lib/services/page.service';
  import type { Page } from '$lib/types/page.type';
  import notCloudLogo from '$lib/assets/NotCloudLogo.png';
  import { userProfile } from '$lib/stores/settingsStore';
  import { currentLayout } from '$lib/stores/layoutStore';

  let currentPath = $derived(page.url.pathname);
  let isCreating = $state(false);
  let isDock = $derived($currentLayout === 'DOCK_BOTTOM' || $currentLayout === 'DOCK_TOP');
  let isFloating = $derived($currentLayout === 'FLOATING_PANELS');

  onMount(async () => {
    await refreshPages();
  });

  async function handleNewPage() {
    isCreating = true;
    try {
      const newPage = await pageService.create({ title: 'Nueva página', icon: '📄' });
      addPageToStore(newPage);
      goto(`/pages/${newPage.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      isCreating = false;
    }
  }

  async function handleArchivePage(e: MouseEvent, pageId: string, title?: string | null) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`¿Mover "${title ?? 'esta página'}" a la papelera?`)) return;
    try {
      const archived = await pageService.archive(pageId);
      removePageFromStore(pageId);
      addArchivedToStore(archived);
      if (currentPath.includes(pageId)) goto('/');
    } catch (e) {
      console.error(e);
    }
  }

  function handleLogout() {
    document.cookie = 'token=; Max-Age=0; path=/';
    window.location.href = '/auth/login';
  }
</script>

<aside 
  class="shrink-0 overflow-hidden transition-all
    {isDock 
      ? `w-full h-16 sm:h-20 flex flex-row items-center justify-center px-4 z-40 ${$currentLayout === 'DOCK_TOP' ? 'border-b shadow-sm' : 'border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'}` 
      : `w-64 h-full flex flex-col justify-between ${$currentLayout === 'SIDEBAR_RIGHT' ? 'border-l' : 'border-r'}`}
    {isFloating && !isDock ? 'rounded-2xl shadow-xl border border-[var(--nc-border)]' : ''}" 
  style="border-color: var(--nc-border); background: {isFloating && !isDock ? 'var(--nc-surface)' : 'var(--nc-sidebar)'};"
>
  {#if isDock}
    <div class="flex items-center gap-2 sm:gap-6 h-full">
      <a href="/" class="p-3 sm:p-4 rounded-xl hover:bg-black/5 transition-colors text-[var(--nc-text)] {currentPath === '/' ? 'bg-black/10' : 'opacity-70 hover:opacity-100'}" title="Inicio">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
      </a>
      <a href="/favorites" class="p-3 sm:p-4 rounded-xl hover:bg-black/5 transition-colors text-[var(--nc-text)] {currentPath === '/favorites' ? 'bg-black/10' : 'opacity-70 hover:opacity-100'}" title="Favoritos">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </a>
      <a href="/calendar" class="p-3 sm:p-4 rounded-xl hover:bg-black/5 transition-colors text-[var(--nc-text)] {currentPath === '/calendar' ? 'bg-black/10' : 'opacity-70 hover:opacity-100'}" title="Calendario">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </a>
      <button onclick={handleNewPage} disabled={isCreating} class="p-3 sm:p-4 mx-2 rounded-2xl bg-[var(--nc-primary)] text-white hover:opacity-90 shadow-md transition-all transform hover:scale-105 active:scale-95" title="Nueva página">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
      </button>
      <a href="/trash" class="p-3 sm:p-4 rounded-xl hover:bg-black/5 transition-colors text-[var(--nc-text)] {currentPath === '/trash' ? 'bg-black/10' : 'opacity-70 hover:opacity-100'}" title="Papelera">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
      </a>
      <a href="/settings" class="p-3 sm:p-4 rounded-xl hover:bg-black/5 transition-colors text-[var(--nc-text)] {currentPath.startsWith('/settings') ? 'bg-black/10' : 'opacity-70 hover:opacity-100'}" title="Configuración">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      </a>
    </div>
  {:else}
    <div class="overflow-y-auto pb-4 flex-1">
      <!-- Header -->
      <div class="px-4 py-3 hover:bg-black/5 cursor-pointer transition-colors flex items-center gap-2 group">
        <img src={notCloudLogo} alt="NotCloud Logo" class="h-6 object-contain" />
        <span class="font-semibold text-[var(--nc-text)] text-sm">NotCloud</span>
      </div>

      <!-- Quick Actions -->
      <div class="mt-2 px-2 space-y-0.5">
        <a href="/" class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors {currentPath === '/' ? 'bg-black/10 text-[var(--nc-text)] font-medium' : 'text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100'}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Inicio
        </a>
        <a href="/favorites" class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors {currentPath === '/favorites' ? 'bg-black/10 text-[var(--nc-text)] font-medium' : 'text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100'}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          Favoritos
        </a>
        <a href="/trash" class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors {currentPath === '/trash' ? 'bg-black/10 text-[var(--nc-text)] font-medium' : 'text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100'}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          Papelera
        </a>
        <a href="/calendar" class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors {currentPath === '/calendar' ? 'bg-black/10 text-[var(--nc-text)] font-medium' : 'text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100'}">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Calendario
        </a>
      </div>

      <!-- Más -->
      <div class="mt-4">
        <div class="px-4 text-xs font-semibold text-[var(--nc-text)] opacity-50 mb-1 uppercase tracking-wider">Más</div>
        <nav class="px-2 space-y-0.5">
          <a href="/settings" class="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors {currentPath.startsWith('/settings') ? 'bg-black/10 text-[var(--nc-text)] font-medium' : 'text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100'}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Configuración
          </a>
        </nav>
      </div>

      <!-- Recent Pages -->
      <div class="mt-6">
        <div class="px-4 text-xs font-semibold text-[var(--nc-text)] opacity-50 mb-1 uppercase tracking-wider">Recientes</div>
        <nav class="px-2 space-y-0.5">
          {#if $recentPages.length === 0}
            <p class="px-2 py-1.5 text-xs text-[var(--nc-text)] opacity-40 italic">No hay recientes</p>
          {/if}
          {#each $recentPages as p}
            <a
              href="/pages/{p.id}"
              class="group w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors {currentPath === `/pages/${p.id}` ? 'bg-black/10 text-[var(--nc-text)] font-medium' : 'text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100'}"
            >
              <span class="flex items-center gap-2 truncate">
                <span class="opacity-70">{p.icon ?? '📄'}</span>
                <span class="truncate">{p.title ?? 'Sin título'}</span>
              </span>
            </a>
          {/each}
        </nav>
      </div>

      <!-- Pages Section -->
      <div class="mt-4">
        <div class="px-4 text-xs font-semibold text-[var(--nc-text)] opacity-50 mb-1 uppercase tracking-wider">Mis páginas</div>
        <nav class="px-2 space-y-0.5">
          {#if $pages.length === 0}
            <p class="px-2 py-1.5 text-xs text-[var(--nc-text)] opacity-40 italic">Sin páginas aún</p>
          {/if}
          {#each $pages as p}
            <a
              href="/pages/{p.id}"
              class="group w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors {currentPath === `/pages/${p.id}` ? 'bg-black/10 text-[var(--nc-text)] font-medium' : 'text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100'}"
            >
              <span class="flex items-center gap-2 truncate">
                <span class="opacity-70">{p.icon ?? '📄'}</span>
                <span class="truncate">{p.title ?? 'Sin título'}</span>
              </span>
              <button
                onclick={(e) => handleArchivePage(e, p.id, p.title)}
                class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/10 text-red-500 transition-all shrink-0"
                title="Mover a papelera"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </a>
          {/each}
        </nav>
      </div>
    </div>

    <!-- Bottom actions -->
    <div class="p-2 border-t space-y-0.5" style="border-color: var(--nc-border);">
      {#if $userProfile?.name}
        <div class="px-2 py-2 text-xs text-[var(--nc-text)] opacity-60 truncate">
          {$userProfile.name}
        </div>
      {/if}
      <button
        onclick={handleNewPage}
        disabled={isCreating}
        class="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        {isCreating ? 'Creando...' : 'Nueva página'}
      </button>
      <button onclick={handleLogout} class="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors text-[var(--nc-text)] opacity-80 hover:bg-black/5 hover:opacity-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Cerrar sesión
      </button>
    </div>
  {/if}
</aside>
