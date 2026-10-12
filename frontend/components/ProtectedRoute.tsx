'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect('/login');
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
};
