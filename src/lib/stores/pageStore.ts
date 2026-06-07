import { writable } from 'svelte/store';
import type { Page } from '$lib/types/page.type';

export const pages = writable<Page[]>([]);
export const recentPages = writable<Page[]>([]);
export const favoritePages = writable<Page[]>([]);
export const archivedPages = writable<Page[]>([]);

export async function refreshPages() {
  const { pageService } = await import('$lib/services/page.service');
  const [data, recentData, favData, archData] = await Promise.all([
    pageService.findAll(),
    pageService.findRecent(),
    pageService.findFavorites(),
    pageService.findArchived(),
  ]);
  pages.set(data);
  recentPages.set(recentData);
  favoritePages.set(favData);
  archivedPages.set(archData);
}

export function addPageToStore(page: Page) {
  if (!page.parentPageId) {
    pages.update((p) => [page, ...p]);
  }
  recentPages.update((p) => [page, ...p].slice(0, 10));
}

export function removePageFromStore(id: string) {
  pages.update((p) => p.filter((page) => page.id !== id));
  recentPages.update((p) => p.filter((page) => page.id !== id));
  favoritePages.update((p) => p.filter((page) => page.id !== id));
}

export function updatePageInStore(id: string, updates: Partial<Page>) {
  pages.update((p) => p.map((page) => (page.id === id ? { ...page, ...updates } : page)));
  recentPages.update((p) => p.map((page) => (page.id === id ? { ...page, ...updates } : page)));
  favoritePages.update((p) => {
    if (updates.isFavorite === false) {
      return p.filter((page) => page.id !== id);
    }
    if (updates.isFavorite === true) {
      const existing = p.find((page) => page.id === id);
      if (existing) {
        return p.map((page) => (page.id === id ? { ...page, ...updates } : page));
      }
    }
    return p.map((page) => (page.id === id ? { ...page, ...updates } : page));
  });
}

export function addFavoriteToStore(page: Page) {
  favoritePages.update((p) => {
    if (p.some((item) => item.id === page.id)) return p;
    return [page, ...p];
  });
}

export function removeArchivedFromStore(id: string) {
  archivedPages.update((p) => p.filter((page) => page.id !== id));
}

export function addArchivedToStore(page: Page) {
  archivedPages.update((p) => {
    if (p.some((item) => item.id === page.id)) return p;
    return [page, ...p];
  });
}
