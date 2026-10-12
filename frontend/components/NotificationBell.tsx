'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { notificationService, Notification } from '@/lib/notificationService';
import { useAuth } from '@/context/AuthContext';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      if (user) {
        const data = await notificationService.getByUser(user.id);
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map(notification => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start p-3 cursor-pointer"
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="font-semibold text-sm">{notification.title}</div>
              <div className="text-xs text-gray-600">{notification.message}</div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
