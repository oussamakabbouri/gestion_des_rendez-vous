'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600">403</h1>
            <p className="text-gray-600 mt-2">Access Denied</p>
          </div>
          <CardTitle>Unauthorized Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            You don&apos;t have permission to access this resource. Please contact your administrator if you believe this is a mistake.
          </p>
          <Link href="/dashboard">
            <Button className="w-full">Return to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
