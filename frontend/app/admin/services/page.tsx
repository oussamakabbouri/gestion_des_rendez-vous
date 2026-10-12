'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { serviceService, Service } from '@/lib/serviceService';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
  });

  const navigation = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Services', href: '/admin/services', icon: '🛠️' },
    { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
    { label: 'Holidays', href: '/admin/holidays', icon: '🏖️' },
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newService = await serviceService.create(formData as any);
      setServices([...services, newService]);
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        duration: 30,
        price: 0,
      });
      toast.success('Service created successfully');
    } catch (error) {
      toast.error('Failed to create service');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.delete(id);
        setServices(services.filter(s => s.id !== id));
        toast.success('Service deleted');
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
              <p className="text-gray-600 mt-2">Manage all services</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Service</DialogTitle>
                  <DialogDescription>Add a new service to the system</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Service Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Duration (minutes)</label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Create Service</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Services</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{service.duration} min</TableCell>
                      <TableCell>${service.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
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
