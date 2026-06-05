import { api } from './api';
import type { Block, CreateBlockDto, UpdateBlockDto, ReorderBlocksDto } from '$lib/types/page.type';

export const blockService = {

  async findAll(pageId: string): Promise<Block[]> {
    const res = await api.get(`/pages/${pageId}/blocks`);
    return res.data;
  },

  async create(pageId: string, data: CreateBlockDto): Promise<Block> {
    const res = await api.post(`/pages/${pageId}/blocks`, data);
    return res.data;
  },

  async update(pageId: string, blockId: string, data: UpdateBlockDto): Promise<Block> {
    const res = await api.patch(`/pages/${pageId}/blocks/${blockId}`, data);
    return res.data;
  },

  async reorder(pageId: string, data: ReorderBlocksDto): Promise<Block[]> {
    const res = await api.patch(`/pages/${pageId}/blocks/reorder`, data);
    return res.data;
  },

  async remove(pageId: string, blockId: string): Promise<void> {
    await api.delete(`/pages/${pageId}/blocks/${blockId}`);
  }

};
