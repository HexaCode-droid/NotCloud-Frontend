import { api } from './api';
import type { Page, CreatePageDto, UpdatePageDto } from '$lib/types/page.type';

export const pageService = {

  async findAll(): Promise<Page[]> {
    const res = await api.get('/pages');
    return res.data;
  },

  async findFavorites(): Promise<Page[]> {
    const res = await api.get('/pages/favorites');
    return res.data;
  },

  async findRecent(): Promise<Page[]> {
    const res = await api.get('/pages/recent');
    return res.data;
  },

  async findArchived(): Promise<Page[]> {
    const res = await api.get('/pages/archived');
    return res.data;
  },

  async findOne(id: string): Promise<Page> {
    const res = await api.get(`/pages/${id}`);
    return res.data;
  },

  async create(data: CreatePageDto = {}): Promise<Page> {
    const res = await api.post('/pages', data);
    return res.data;
  },

  async update(id: string, data: UpdatePageDto): Promise<Page> {
    const res = await api.patch(`/pages/${id}`, data);
    return res.data;
  },

  async archive(id: string): Promise<Page> {
    const res = await api.patch(`/pages/${id}`, { isArchived: true });
    return res.data;
  },

  async restore(id: string): Promise<Page> {
    const res = await api.patch(`/pages/${id}`, { isArchived: false });
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/pages/${id}`);
  }

};
