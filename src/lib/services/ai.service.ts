import { api } from './api';

export const aiService = {
  async complete(prompt: string, context?: string): Promise<string> {
    const res = await api.post('/ai/complete', { prompt, context });
    return res.data.text as string;
  },
};
