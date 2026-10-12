'use client';

import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'ACTIVE' | 'INACTIVE';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800' },
    COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
    ACTIVE: { label: 'Active', className: 'bg-green-100 text-green-800' },
    INACTIVE: { label: 'Inactive', className: 'bg-gray-100 text-gray-800' },
  };

  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};
