import api from './api';

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price?: number;
}

export const serviceService = {
  getAll: async (): Promise<Service[]> => {
    const response = await api.get('/services');
    return response.data;
  },

  getById: async (id: string): Promise<Service> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  create: async (data: Omit<Service, 'id'>): Promise<Service> => {
    const response = await api.post('/services', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Service>): Promise<Service> => {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
