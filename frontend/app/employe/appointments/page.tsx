'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RdvCard } from '@/components/RdvCard';
import { appointmentService, Appointment } from '@/lib/appointmentService';
import { serviceService, Service } from '@/lib/serviceService';
import { userService, User } from '@/lib/userService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar } from 'lucide-react';

export default function EmployeAppointmentsPage() {
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
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const pastAppointments = appointments
    .filter(a => new Date(a.startTime) <= new Date() || a.status === 'CANCELLED')
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <ProtectedRoute allowedRoles={['EMPLOYE']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-2">View and manage all your appointments</p>
          </div>

          {upcomingAppointments.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Upcoming Appointments
              </h2>
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
            </div>
          )}

          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastAppointments.map((appointment) => (
                  <RdvCard
                    key={appointment.id}
                    appointment={appointment}
                    serviceName={services.get(appointment.serviceId)?.name}
                    demandeurName={`${users.get(appointment.demandeurId)?.firstName} ${users.get(appointment.demandeurId)?.lastName}`}
                  />
                ))}
              </div>
            </div>
          )}

          {appointments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <p>No appointments yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
