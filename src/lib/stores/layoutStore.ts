import { writable } from 'svelte/store';

export type LayoutId = 'SIDEBAR_LEFT' | 'SIDEBAR_RIGHT' | 'FLOATING_PANELS' | 'DOCK_BOTTOM' | 'DOCK_TOP';

export interface LayoutOption {
  id: LayoutId;
  label: string;
  icon: string;
}

export const layouts: LayoutOption[] = [
  { id: 'SIDEBAR_LEFT', label: 'Clásico', icon: 'left' },
  { id: 'SIDEBAR_RIGHT', label: 'Derecha', icon: 'right' },
  { id: 'FLOATING_PANELS', label: 'Flotante', icon: 'floating' },
  { id: 'DOCK_BOTTOM', label: 'Abajo', icon: 'bottom' },
  { id: 'DOCK_TOP', label: 'Arriba', icon: 'top' }
];

export const currentLayout = writable<LayoutId>('SIDEBAR_LEFT');

export function applyLayout(layout: LayoutId) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-layout', layout.toLowerCase());
  localStorage.setItem('notcloud-layout', layout);
  currentLayout.set(layout);
}

export function loadStoredLayout(): LayoutId {
  if (typeof localStorage === 'undefined') return 'SIDEBAR_LEFT';
  const stored = localStorage.getItem('notcloud-layout') as LayoutId | null;
  return stored ?? 'SIDEBAR_LEFT';
}
