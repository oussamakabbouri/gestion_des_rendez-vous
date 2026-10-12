'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { statsService, Statistics } from '@/lib/statsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Calendar, CheckCircle, XCircle } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigation = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Services', href: '/admin/services', icon: '🛠️' },
    { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
    { label: 'Holidays', href: '/admin/holidays', icon: '🏖️' },
  ];

  if (loading || !stats) {
    return <div>Loading...</div>;
  }

  const statusData = [
    { name: 'Pending', value: stats.appointmentsByStatus?.PENDING || 0 },
    { name: 'Confirmed', value: stats.appointmentsByStatus?.CONFIRMED || 0 },
    { name: 'Completed', value: stats.appointmentsByStatus?.COMPLETED || 0 },
    { name: 'Cancelled', value: stats.appointmentsByStatus?.CANCELLED || 0 },
  ];

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here&apos;s your system overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalServices}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedAppointments}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.cancelledAppointments}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Appointments by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Appointment statistics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Appointments:</span>
                  <span className="font-semibold">{stats.totalAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-green-600">{stats.completedAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled:</span>
                  <span className="font-semibold text-red-600">{stats.cancelledAppointments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending/Confirmed:</span>
                  <span className="font-semibold text-blue-600">
                    {stats.totalAppointments - stats.completedAppointments - stats.cancelledAppointments}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
