import api from './api';

export interface Holiday {
  id: string;
  date: string;
  name: string;
}

export const holidayService = {
  getAll: async (): Promise<Holiday[]> => {
    const response = await api.get('/holidays');
    return response.data;
  },

  create: async (data: Omit<Holiday, 'id'>): Promise<Holiday> => {
    const response = await api.post('/holidays', data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/holidays/${id}`);
  },
};
