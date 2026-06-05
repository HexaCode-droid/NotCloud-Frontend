import { writable } from 'svelte/store';
import type { Page } from '$lib/types/page.type';

// Lista de páginas raíz que se muestra en el Sidebar
export const pages = writable<Page[]>([]);

// Lista de páginas recientes
export const recentPages = writable<Page[]>([]);

// Función de ayuda para recargar las páginas desde la API
// Se importa y llama desde cualquier componente que modifique páginas
export async function refreshPages() {
  const { pageService } = await import('$lib/services/page.service');
  const [data, recentData] = await Promise.all([
    pageService.findAll(),
    pageService.findRecent()
  ]);
  pages.set(data);
  recentPages.set(recentData);
}
