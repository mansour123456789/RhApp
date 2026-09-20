import { apiClient } from '@/shared/lib/axios';

export const dashboardService = {
  getStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    return data;
  },
};

