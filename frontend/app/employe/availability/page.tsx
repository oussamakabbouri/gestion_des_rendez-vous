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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { availabilityService, Availability } from '@/lib/availabilityService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export default function EmployeAvailabilityPage() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: '1',
    startTime: '09:00',
    endTime: '17:00',
  });

  const navigation = [
    { label: 'Dashboard', href: '/employe', icon: '📊' },
    { label: 'My Availability', href: '/employe/availability', icon: '📅' },
    { label: 'My Appointments', href: '/employe/appointments', icon: '📋' },
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (user) {
      loadAvailability();
    }
  }, [user]);

  const loadAvailability = async () => {
    try {
      if (user) {
        const data = await availabilityService.getByEmployee(user.id);
        setAvailability(data);
      }
    } catch (error) {
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newAvailability = await availabilityService.create({
        employeeId: user.id,
        dayOfWeek: parseInt(formData.dayOfWeek),
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setAvailability([...availability, newAvailability]);
      setOpen(false);
      setFormData({
        dayOfWeek: '1',
        startTime: '09:00',
        endTime: '17:00',
      });
      toast.success('Availability added successfully');
    } catch (error) {
      toast.error('Failed to add availability');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this availability slot?')) {
      try {
        await availabilityService.delete(id);
        setAvailability(availability.filter(a => a.id !== id));
        toast.success('Availability deleted');
      } catch (error) {
        toast.error('Failed to delete availability');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={['EMPLOYE']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Availability</h1>
              <p className="text-gray-600 mt-2">Set your working hours and availability</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Availability
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Availability Slot</DialogTitle>
                  <DialogDescription>Set your available working hours</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Day of Week</label>
                    <Select value={formData.dayOfWeek} onValueChange={(value) => 
                      setFormData({ ...formData, dayOfWeek: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dayNames.map((day, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Time</label>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Time</label>
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Add Slot</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {availability.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No availability slots set. Add your first slot to get started.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availability
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell>{dayNames[slot.dayOfWeek]}</TableCell>
                          <TableCell>{slot.startTime}</TableCell>
                          <TableCell>{slot.endTime}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(slot.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
