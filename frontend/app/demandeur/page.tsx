'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RdvCard } from '@/components/RdvCard';
import { appointmentService, Appointment } from '@/lib/appointmentService';
import { serviceService, Service } from '@/lib/serviceService';
import { userService, User } from '@/lib/userService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DemandeurDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Map<string, Service>>(new Map());
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  const upcomingAppointments = appointments
    .filter(a => new Date(a.startTime) > new Date() && a.status !== 'CANCELLED')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  return (
    <ProtectedRoute allowedRoles={['DEMANDEUR']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
              <p className="text-gray-600 mt-2">Book and manage your appointments</p>
            </div>
            <Link href="/demandeur/book">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointments.filter(a => a.status === 'COMPLETED').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Upcoming Appointments
            </h2>
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  <p className="mb-4">No upcoming appointments</p>
                  <Link href="/demandeur/book">
                    <Button>Book Your First Appointment</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingAppointments.map((appointment) => (
                  <RdvCard
                    key={appointment.id}
                    appointment={appointment}
                    serviceName={services.get(appointment.serviceId)?.name}
                    employeeName={`${users.get(appointment.employeeId)?.firstName} ${users.get(appointment.employeeId)?.lastName}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
