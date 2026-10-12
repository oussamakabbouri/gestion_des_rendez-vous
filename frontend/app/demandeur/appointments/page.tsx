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
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function DemandeurAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Map<string, Service>>(new Map());
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const navigation = [
    { label: 'Dashboard', href: '/demandeur', icon: '📊' },
    { label: 'Book Appointment', href: '/demandeur/book', icon: '📅' },
    { label: 'My Appointments', href: '/demandeur/appointments', icon: '📋' },
  ];

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [appoData, servData, usrData] = await Promise.all([
        appointmentService.getByUserId(user!.id),
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

  const handleCancel = async (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.update(appointmentId, { status: 'CANCELLED' });
        setAppointments(appointments.map(a => 
          a.id === appointmentId ? { ...a, status: 'CANCELLED' } : a
        ));
        toast.success('Appointment cancelled');
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  const upcomingAppointments = appointments
    .filter(a => new Date(a.startTime) > new Date() && a.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const pastAppointments = appointments
    .filter(a => new Date(a.startTime) <= new Date() || a.status === 'CANCELLED')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  const filteredUpcoming = statusFilter 
    ? upcomingAppointments.filter(a => a.status === statusFilter)
    : upcomingAppointments;

  const filteredPast = statusFilter 
    ? pastAppointments.filter(a => a.status === statusFilter)
    : pastAppointments;

  return (
    <ProtectedRoute allowedRoles={['DEMANDEUR']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600 mt-2">View and manage your bookings</p>
            </div>
            <Link href="/demandeur/book">
              <Button>Book New Appointment</Button>
            </Link>
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

          {filteredUpcoming.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUpcoming.map((appointment) => (
                  <div key={appointment.id} className="space-y-3">
                    <RdvCard
                      appointment={appointment}
                      serviceName={services.get(appointment.serviceId)?.name}
                      employeeName={`${users.get(appointment.employeeId)?.firstName} ${users.get(appointment.employeeId)?.lastName}`}
                    />
                    {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Cancel Appointment
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredPast.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPast.map((appointment) => (
                  <RdvCard
                    key={appointment.id}
                    appointment={appointment}
                    serviceName={services.get(appointment.serviceId)?.name}
                    employeeName={`${users.get(appointment.employeeId)?.firstName} ${users.get(appointment.employeeId)?.lastName}`}
                  />
                ))}
              </div>
            </div>
          )}

          {appointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No appointments yet</p>
                <Link href="/demandeur/book">
                  <Button>Book Your First Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
