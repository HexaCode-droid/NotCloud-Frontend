export type ThemeId = 'LIGHT' | 'DARK' | 'OCEAN' | 'FOREST' | 'SUNSET' | 'LAVENDER' | 'LIQUID_GLASS' | 'CYBERPUNK' | 'GALAXY' | 'MATCHA' | 'DRACULA';

export interface UserSettings {
  id: string;
  userId: string;
  theme: ThemeId;
  locale: string;
  timezone: string;
  emailNotifications: boolean;
  browserNotifications: boolean;
  reminderNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  settings: UserSettings | null;
}

export interface UpdateProfileDto {
  name?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePreferencesDto {
  theme?: ThemeId;
  locale?: string;
  timezone?: string;
  emailNotifications?: boolean;
  browserNotifications?: boolean;
  reminderNotifications?: boolean;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  remindAt: string;
  emailNotified: boolean;
  browserNotified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderDto {
  title: string;
  description?: string;
  remindAt: string;
}

export interface UpdateReminderDto {
  title?: string;
  description?: string;
  remindAt?: string;
}
