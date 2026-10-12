'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const roleRoutes: Record<string, string> = {
        ADMIN: '/admin',
        GESTIONNAIRE: '/gestionnaire',
        EMPLOYE: '/employe',
        DEMANDEUR: '/demandeur',
      };
      router.push(roleRoutes[user.role] || '/login');
    } else if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
