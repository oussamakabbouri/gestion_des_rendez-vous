import api from './api';

export interface Appointment {
  id: string;
  serviceId: string;
  employeeId: string;
  demandeurId: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export const appointmentService = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (data: Omit<Appointment, 'id'>): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  getByUserId: async (userId: string): Promise<Appointment[]> => {
    const response = await api.get(`/appointments/user/${userId}`);
    return response.data;
  },
};
