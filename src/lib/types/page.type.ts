// Tipos de bloques disponibles (espeja el enum de NestJS)
export type BlockType = 'TEXT' | 'H1' | 'H2' | 'H3' | 'TODO' | 'IMAGE' | 'CODE';

export interface Block {
  id: string;
  type: BlockType;
  content: string | null;
  order: number;
  pageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string | null;
  icon: string | null;
  cover: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  parentPageId: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  blocks?: Block[];
  subPages?: Page[];
}

export interface CreatePageDto {
  title?: string;
  icon?: string;
  cover?: string;
  isFavorite?: boolean;
  parentPageId?: string;
}

export interface UpdatePageDto {
  title?: string;
  icon?: string;
  cover?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export interface CreateBlockDto {
  type: BlockType;
  content?: string;
  order: number;
}

export interface UpdateBlockDto {
  content?: string;
  type?: BlockType;
}

export interface ReorderBlocksDto {
  blocks: { id: string; order: number }[];
}
