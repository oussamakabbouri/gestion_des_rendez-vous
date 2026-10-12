import api from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'GESTIONNAIRE' | 'EMPLOYE' | 'DEMANDEUR';
  phone?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getByRole: async (role: string): Promise<User[]> => {
    const response = await api.get(`/users/role/${role}`);
    return response.data;
  },
};
