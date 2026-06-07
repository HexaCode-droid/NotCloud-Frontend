import { api } from './api';
import type { CreateReminderDto, Reminder, UpdateReminderDto } from '$lib/types/settings.type';

export const reminderService = {
  async findAll(from?: string, to?: string): Promise<Reminder[]> {
    const res = await api.get('/reminders', { params: { from, to } });
    return res.data;
  },

  async findUpcoming(): Promise<Reminder[]> {
    const res = await api.get('/reminders/upcoming');
    return res.data;
  },

  async create(data: CreateReminderDto): Promise<Reminder> {
    const res = await api.post('/reminders', data);
    return res.data;
  },

  async update(id: string, data: UpdateReminderDto): Promise<Reminder> {
    const res = await api.patch(`/reminders/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/reminders/${id}`);
  },

  async markBrowserNotified(id: string): Promise<void> {
    await api.patch(`/reminders/${id}/browser-notified`);
  }
};
