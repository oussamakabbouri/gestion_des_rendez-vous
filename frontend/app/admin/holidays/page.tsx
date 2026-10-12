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
import { holidayService, Holiday } from '@/lib/holidayService';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function AdminHolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    name: '',
  });

  const navigation = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Services', href: '/admin/services', icon: '🛠️' },
    { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
    { label: 'Holidays', href: '/admin/holidays', icon: '🏖️' },
  ];

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      const data = await holidayService.getAll();
      setHolidays(data);
    } catch (error) {
      toast.error('Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newHoliday = await holidayService.create(formData as any);
      setHolidays([...holidays, newHoliday]);
      setOpen(false);
      setFormData({
        date: '',
        name: '',
      });
      toast.success('Holiday added successfully');
    } catch (error) {
      toast.error('Failed to add holiday');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      try {
        await holidayService.delete(id);
        setHolidays(holidays.filter(h => h.id !== id));
        toast.success('Holiday deleted');
      } catch (error) {
        toast.error('Failed to delete holiday');
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
              <h1 className="text-3xl font-bold text-gray-900">Holiday Management</h1>
              <p className="text-gray-600 mt-2">Manage company holidays</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Holiday
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Holiday</DialogTitle>
                  <DialogDescription>Add a new holiday to the calendar</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Holiday Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Christmas"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Holiday</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company Holidays</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holiday Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell>{holiday.name}</TableCell>
                      <TableCell>{new Date(holiday.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(holiday.id)}
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
