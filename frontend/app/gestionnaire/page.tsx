'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { serviceService, Service } from '@/lib/serviceService';
import { userService, User } from '@/lib/userService';
import { statsService, Statistics } from '@/lib/statsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GestionnaireDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
      const [statsData, servData, empData] = await Promise.all([
        statsService.getDashboardStats(),
        serviceService.getAll(),
        userService.getByRole('EMPLOYE'),
      ]);
      setStats(statsData);
      setServices(servData);
      setEmployees(empData);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return <div>Loading...</div>;

  const chartData = [
    { name: 'Pending', value: stats.appointmentsByStatus?.PENDING || 0 },
    { name: 'Confirmed', value: stats.appointmentsByStatus?.CONFIRMED || 0 },
    { name: 'Completed', value: stats.appointmentsByStatus?.COMPLETED || 0 },
  ];

  return (
    <ProtectedRoute allowedRoles={['GESTIONNAIRE']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your team and appointments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Briefcase className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{services.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointments Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Go to the Appointments page to view detailed list</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
