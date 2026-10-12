import api from './api';

export interface Statistics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalUsers: number;
  totalServices: number;
  appointmentsByStatus: Record<string, number>;
}

export const statsService = {
  getDashboardStats: async (): Promise<Statistics> => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  },

  getMonthlyStats: async (month: number, year: number): Promise<Statistics> => {
    const response = await api.get('/stats/monthly', {
      params: { month, year },
    });
    return response.data;
  },

  getUserStats: async (userId: string): Promise<Statistics> => {
    const response = await api.get(`/stats/user/${userId}`);
    return response.data;
  },
};
