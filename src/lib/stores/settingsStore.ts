import { writable } from 'svelte/store';
import type { UserProfile } from '$lib/types/settings.type';
import { applyTheme } from './themeStore';

export const userProfile = writable<UserProfile | null>(null);

export async function loadUserProfile() {
  const { settingsService } = await import('$lib/services/settings.service');
  const profile = await settingsService.getMe();
  userProfile.set(profile);
  if (profile.settings?.theme) {
    applyTheme(profile.settings.theme);
  }
  return profile;
}

export function updateProfileInStore(updates: Partial<UserProfile>) {
  userProfile.update((current) => (current ? { ...current, ...updates } : current));
}
