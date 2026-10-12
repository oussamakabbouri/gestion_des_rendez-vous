'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RdvCard } from '@/components/RdvCard';
import { appointmentService, Appointment } from '@/lib/appointmentService';
import { serviceService, Service } from '@/lib/serviceService';
import { userService, User } from '@/lib/userService';
import toast from 'react-hot-toast';

export default function GestionnaireAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Map<string, Service>>(new Map());
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const navigation = [
    { label: 'Dashboard', href: '/gestionnaire', icon: '📊' },
    { label: 'Services', href: '/gestionnaire/services', icon: '🛠️' },
    { label: 'Employees', href: '/gestionnaire/employees', icon: '👥' },
    { label: 'Appointments', href: '/gestionnaire/appointments', icon: '📅' },
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

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await appointmentService.update(appointmentId, { status: newStatus as any });
      setAppointments(appointments.map(a => 
        a.id === appointmentId ? { ...a, status: newStatus as any } : a
      ));
      toast.success('Appointment updated');
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  if (loading) return <div>Loading...</div>;

  const filteredAppointments = statusFilter 
    ? appointments.filter(a => a.status === statusFilter)
    : appointments;

  return (
    <ProtectedRoute allowedRoles={['GESTIONNAIRE']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">Manage and track all appointments</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filter by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="space-y-3">
                <RdvCard
                  appointment={appointment}
                  serviceName={services.get(appointment.serviceId)?.name}
                  employeeName={`${users.get(appointment.employeeId)?.firstName} ${users.get(appointment.employeeId)?.lastName}`}
                  demandeurName={`${users.get(appointment.demandeurId)?.firstName} ${users.get(appointment.demandeurId)?.lastName}`}
                />
                <Select value={appointment.status} onValueChange={(value) => 
                  handleStatusChange(appointment.id, value)
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
