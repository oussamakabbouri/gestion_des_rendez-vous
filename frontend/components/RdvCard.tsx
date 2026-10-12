'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './StatusBadge';
import { Appointment } from '@/lib/appointmentService';

interface RdvCardProps {
  appointment: Appointment;
  serviceName?: string;
  employeeName?: string;
  demandeurName?: string;
  onClick?: () => void;
}

export const RdvCard: React.FC<RdvCardProps> = ({
  appointment,
  serviceName,
  employeeName,
  demandeurName,
  onClick,
}) => {
  const startTime = new Date(appointment.startTime).toLocaleString();
  const endTime = new Date(appointment.endTime).toLocaleString();

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{serviceName || 'Service'}</CardTitle>
            <CardDescription className="text-sm mt-1">ID: {appointment.id}</CardDescription>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {employeeName && (
          <div className="text-sm">
            <span className="font-semibold">Employee:</span> {employeeName}
          </div>
        )}
        {demandeurName && (
          <div className="text-sm">
            <span className="font-semibold">Client:</span> {demandeurName}
          </div>
        )}
        <div className="text-sm">
          <span className="font-semibold">Start:</span> {startTime}
        </div>
        <div className="text-sm">
          <span className="font-semibold">End:</span> {endTime}
        </div>
        {appointment.notes && (
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Notes:</span> {appointment.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
