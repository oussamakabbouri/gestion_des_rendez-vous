'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RdvCard } from '@/components/RdvCard';
import { appointmentService, Appointment } from '@/lib/appointmentService';
import { serviceService, Service } from '@/lib/serviceService';
import { userService, User } from '@/lib/userService';
import toast from 'react-hot-toast';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Map<string, Service>>(new Map());
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);

  const navigation = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Services', href: '/admin/services', icon: '🛠️' },
    { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
    { label: 'Holidays', href: '/admin/holidays', icon: '🏖️' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appoData, servData, usrData] = await Promise.all([
        appointmentService.getAll(),
        serviceService.getAll(),
        userService.getAll(),
      ]);

      setAppointments(appoData);
      
      const servMap = new Map();
      servData.forEach(s => servMap.set(s.id, s));
      setServices(servMap);

      const usrMap = new Map();
      usrData.forEach(u => usrMap.set(u.id, u));
      setUsers(usrMap);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
            <p className="text-gray-600 mt-2">View and manage all appointments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((appointment) => (
              <RdvCard
                key={appointment.id}
                appointment={appointment}
                serviceName={services.get(appointment.serviceId)?.name}
                employeeName={`${users.get(appointment.employeeId)?.firstName} ${users.get(appointment.employeeId)?.lastName}`}
                demandeurName={`${users.get(appointment.demandeurId)?.firstName} ${users.get(appointment.demandeurId)?.lastName}`}
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
