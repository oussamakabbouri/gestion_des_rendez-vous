import api from './api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  getByUser: async (userId: string): Promise<Notification[]> => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    await api.put(`/notifications/user/${userId}/read-all`);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
