'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { userService, User } from '@/lib/userService';
import { availabilityService, Availability } from '@/lib/availabilityService';
import { StatusBadge } from '@/components/StatusBadge';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';

export default function GestionnaireEmployeesPage() {
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAvailability, setShowAvailability] = useState(false);

  const navigation = [
    { label: 'Dashboard', href: '/gestionnaire', icon: '📊' },
    { label: 'Services', href: '/gestionnaire/services', icon: '🛠️' },
    { label: 'Employees', href: '/gestionnaire/employees', icon: '👥' },
    { label: 'Appointments', href: '/gestionnaire/appointments', icon: '📅' },
  ];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await userService.getByRole('EMPLOYE');
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAvailability = async (employee: User) => {
    setSelectedEmployee(employee);
    try {
      const data = await availabilityService.getByEmployee(employee.id);
      setAvailability(data);
      setShowAvailability(true);
    } catch (error) {
      toast.error('Failed to load availability');
    }
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute allowedRoles={['GESTIONNAIRE']}>
      <DashboardLayout navigation={navigation}>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-2">Manage your team and their availability</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        <StatusBadge status={employee.status} />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewAvailability(employee)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Availability
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {showAvailability && selectedEmployee && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedEmployee.firstName}&apos;s Availability</CardTitle>
                <Button onClick={() => setShowAvailability(false)} className="absolute right-8">
                  Close
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availability.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-500">
                          No availability set
                        </TableCell>
                      </TableRow>
                    ) : (
                      availability.map((slot) => (
                        <TableRow key={slot.id}>
                          <TableCell>{dayNames[slot.dayOfWeek]}</TableCell>
                          <TableCell>{slot.startTime}</TableCell>
                          <TableCell>{slot.endTime}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
