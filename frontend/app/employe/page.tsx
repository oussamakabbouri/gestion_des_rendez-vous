'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RdvCard } from '@/components/RdvCard';
import { appointmentService, Appointment } from '@/lib/appointmentService';
import { useAuth } from '@/context/AuthContext';
import { serviceService, Service } from '@/lib/serviceService';
import { userService, User } from '@/lib/userService';
import toast from 'react-hot-toast';

export default function EmployeDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Map<string, Service>>(new Map());
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(true);

  const navigation = [
    { label: 'Dashboard', href: '/employe', icon: '📊' },
    { label: 'My Availability', href: '/employe/availability', icon: '📅' },
    { label: 'My Appointments', href: '/employe/appointments', icon: '📋' },
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
    <ProtectedRoute allowedRoles={['EMPLOYE']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
            <p className="text-gray-600 mt-2">Here&apos;s your appointment overview</p>
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
            <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No upcoming appointments
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingAppointments.map((appointment) => (
                  <RdvCard
                    key={appointment.id}
                    appointment={appointment}
                    serviceName={services.get(appointment.serviceId)?.name}
                    demandeurName={`${users.get(appointment.demandeurId)?.firstName} ${users.get(appointment.demandeurId)?.lastName}`}
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
