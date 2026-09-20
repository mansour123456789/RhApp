import { apiClient } from '@/shared/lib/axios';
import { type User } from '../types/auth.types';

export const authService = {
  login: async (credentials: Record<string, string>): Promise<User & { token: string }> => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  },
  
  me: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
