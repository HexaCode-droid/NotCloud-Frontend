import { writable } from 'svelte/store';
import type { Page } from '$lib/types/page.type';

// Lista de páginas raíz que se muestra en el Sidebar
export const pages = writable<Page[]>([]);

// Lista de páginas recientes
export const recentPages = writable<Page[]>([]);

// Función de ayuda para recargar las páginas desde la API
export async function refreshPages() {
  const { pageService } = await import('$lib/services/page.service');
  const [data, recentData] = await Promise.all([
    pageService.findAll(),
    pageService.findRecent()
  ]);
  pages.set(data);
  recentPages.set(recentData);
}

// Helpers para Optimistic UI (Actualización local)
export function addPageToStore(page: Page) {
  // Añadir a root pages solo si no tiene padre
  if (!page.parentPageId) {
    pages.update(p => [page, ...p]);
  }
  // Añadir a recientes y mantener solo 10
  recentPages.update(p => [page, ...p].slice(0, 10));
}

export function removePageFromStore(id: string) {
  pages.update(p => p.filter(page => page.id !== id));
  recentPages.update(p => p.filter(page => page.id !== id));
}

export function updatePageInStore(id: string, updates: Partial<Page>) {
  pages.update(p => p.map(page => page.id === id ? { ...page, ...updates } : page));
  recentPages.update(p => p.map(page => page.id === id ? { ...page, ...updates } : page));
}
