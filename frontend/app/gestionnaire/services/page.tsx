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
import { serviceService, Service } from '@/lib/serviceService';
import toast from 'react-hot-toast';

export default function GestionnaireServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = [
    { label: 'Dashboard', href: '/gestionnaire', icon: '📊' },
    { label: 'Services', href: '/gestionnaire/services', icon: '🛠️' },
    { label: 'Employees', href: '/gestionnaire/employees', icon: '👥' },
    { label: 'Appointments', href: '/gestionnaire/appointments', icon: '📅' },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceService.getAll();
      setServices(data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={['GESTIONNAIRE']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600 mt-2">View all available services</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-semibold">{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{service.duration} minutes</TableCell>
                      <TableCell>${service.price?.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
