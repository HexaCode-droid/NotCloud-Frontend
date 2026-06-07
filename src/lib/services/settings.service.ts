import { api } from './api';
import type {
  ChangePasswordDto,
  UpdatePreferencesDto,
  UpdateProfileDto,
  UserProfile
} from '$lib/types/settings.type';

export const settingsService = {
  async getMe(): Promise<UserProfile> {
    const res = await api.get('/settings/me');
    return res.data;
  },

  async updateProfile(data: UpdateProfileDto): Promise<UserProfile> {
    const res = await api.patch('/settings/profile', data);
    return res.data;
  },

  async changePassword(data: ChangePasswordDto): Promise<{ message: string }> {
    const res = await api.patch('/settings/password', data);
    return res.data;
  },

  async updatePreferences(data: UpdatePreferencesDto) {
    const res = await api.patch('/settings/preferences', data);
    return res.data;
  }
};
