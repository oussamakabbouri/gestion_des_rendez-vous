'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { serviceService, Service } from '@/lib/serviceService';
import { userService, User } from '@/lib/userService';
import { availabilityService } from '@/lib/availabilityService';
import { appointmentService } from '@/lib/appointmentService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function BookAppointmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    serviceId: '',
    employeeId: '',
    date: '',
    time: '',
  });

  const navigation = [
    { label: 'Dashboard', href: '/demandeur', icon: '📊' },
    { label: 'Book Appointment', href: '/demandeur/book', icon: '📅' },
    { label: 'My Appointments', href: '/demandeur/appointments', icon: '📋' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servData, empData] = await Promise.all([
        serviceService.getAll(),
        userService.getByRole('EMPLOYE'),
      ]);
      setServices(servData);
      setEmployees(empData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSlots = async () => {
    if (!formData.serviceId || !formData.employeeId || !formData.date) {
      toast.error('Please select service, employee, and date');
      return;
    }

    try {
      const slots = await availabilityService.getAvailableSlots(
        formData.serviceId,
        formData.employeeId,
        formData.date
      );
      setAvailableSlots(slots);
    } catch (error) {
      toast.error('Failed to load available slots');
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const appointmentDateTime = `${formData.date}T${formData.time}`;
      const service = services.find(s => s.id === formData.serviceId);
      const durationMs = (service?.duration || 30) * 60 * 1000;
      const endTime = new Date(new Date(appointmentDateTime).getTime() + durationMs).toISOString();

      await appointmentService.create({
        serviceId: formData.serviceId,
        employeeId: formData.employeeId,
        demandeurId: user.id,
        startTime: new Date(appointmentDateTime).toISOString(),
        endTime,
        status: 'PENDING',
      });

      toast.success('Appointment booked successfully!');
      router.push('/demandeur/appointments');
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={['DEMANDEUR']}>
      <DashboardLayout navigation={navigation}>
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
            <p className="text-gray-600 mt-2">Choose your service and available time slot</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBookAppointment} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="service">Select Service</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => {
                    setFormData({ ...formData, serviceId: value, time: '' });
                    setAvailableSlots([]);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} ({service.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employee">Select Employee</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => {
                    setFormData({ ...formData, employeeId: value, time: '' });
                    setAvailableSlots([]);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value, time: '' });
                      setAvailableSlots([]);
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {formData.serviceId && formData.employeeId && formData.date && availableSlots.length === 0 && (
                  <Button type="button" variant="outline" onClick={handleLoadSlots} className="w-full">
                    Load Available Times
                  </Button>
                )}

                {availableSlots.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="time">Select Time</Label>
                    <Select value={formData.time} onValueChange={(value) => 
                      setFormData({ ...formData, time: value })
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={!formData.time}>
                  Book Appointment
                </Button>
              </form>
            </CardContent>
          </Card>

          {formData.serviceId && (
            <Card className="bg-blue-50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold">
                      {services.find(s => s.id === formData.serviceId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">
                      {services.find(s => s.id === formData.serviceId)?.duration} minutes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
