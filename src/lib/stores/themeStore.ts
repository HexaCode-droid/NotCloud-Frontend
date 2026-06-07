import { writable } from 'svelte/store';
import type { ThemeId } from '$lib/types/settings.type';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  preview: string;
}

export const themes: ThemeOption[] = [
  { id: 'LIGHT', label: 'Claro', preview: 'bg-[#fbfbfa] border-gray-200' },
  { id: 'DARK', label: 'Oscuro', preview: 'bg-gray-900 border-gray-700' },
  { id: 'OCEAN', label: 'Océano', preview: 'bg-sky-50 border-sky-200' },
  { id: 'FOREST', label: 'Bosque', preview: 'bg-emerald-50 border-emerald-200' },
  { id: 'SUNSET', label: 'Atardecer', preview: 'bg-orange-50 border-orange-200' },
  { id: 'LAVENDER', label: 'Lavanda', preview: 'bg-violet-50 border-violet-200' },
  { id: 'LIQUID_GLASS', label: 'Cristal Líquido', preview: 'bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] border-white/50 backdrop-blur-md shadow-sm' },
  { id: 'CYBERPUNK', label: 'Cyberpunk', preview: 'bg-[#0a0a0a] border-[#ff003c] ring-1 ring-[#00f0ff]' },
  { id: 'GALAXY', label: 'Galaxia', preview: 'bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] border-purple-500/50' },
  { id: 'MATCHA', label: 'Matcha', preview: 'bg-[#f4f1ea] border-[#d5d0c4] text-[#3c4a3e]' },
  { id: 'DRACULA', label: 'Drácula', preview: 'bg-[#282a36] border-[#6272a4] text-[#f8f8f2]' }
];

export const currentTheme = writable<ThemeId>('LIGHT');

export function applyTheme(theme: ThemeId) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme.toLowerCase());
  localStorage.setItem('notcloud-theme', theme);
  currentTheme.set(theme);
}

export function loadStoredTheme(): ThemeId {
  if (typeof localStorage === 'undefined') return 'LIGHT';
  const stored = localStorage.getItem('notcloud-theme') as ThemeId | null;
  return stored ?? 'LIGHT';
}
