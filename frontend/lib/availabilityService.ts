import api from './api';

export interface Availability {
  id: string;
  employeeId: string;
  dayOfWeek: number; // 0-6, 0 = Sunday
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export const availabilityService = {
  getByEmployee: async (employeeId: string): Promise<Availability[]> => {
    const response = await api.get(`/availability/employee/${employeeId}`);
    return response.data;
  },

  create: async (data: Omit<Availability, 'id'>): Promise<Availability> => {
    const response = await api.post('/availability', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Availability>): Promise<Availability> => {
    const response = await api.put(`/availability/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/availability/${id}`);
  },

  getAvailableSlots: async (
    serviceId: string,
    employeeId: string,
    date: string
  ): Promise<string[]> => {
    const response = await api.get('/availability/slots', {
      params: { serviceId, employeeId, date },
    });
    return response.data;
  },
};
