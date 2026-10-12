# Rendez-Vous - Appointment Management System

A professional, full-stack appointment management application built with React, Next.js, and Node.js/Spring Boot backend.

## Features

### Admin Dashboard
- User management (create, edit, delete users)
- Service management
- Holiday management
- System-wide statistics and analytics
- View all appointments across the system

### Gestionnaire (Manager) Dashboard
- Manage team members (employees)
- View and manage employee availability
- Monitor all appointments
- Update appointment statuses
- View services and analytics

### Employé (Employee) Dashboard
- Set personal availability (weekly schedule)
- View upcoming appointments
- View personal appointment history
- Manage their working hours

### Demandeur (Client) Dashboard
- Book appointments
- View available time slots based on employee availability and service duration
- Manage personal appointments
- Cancel appointments if needed
- View appointment history

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Fetching**: Axios with JWT authentication
- **Charts**: Recharts
- **Notifications**: react-hot-toast
- **Calendar**: react-big-calendar

### Backend
- **API**: Spring Boot REST API on `http://localhost:8080/api/v1`
- **Authentication**: JWT tokens
- **Database**: (As per your Spring Boot configuration)

## Setup Instructions

### Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Application Structure

```
app/
├── login/              # Login page
├── register/           # Registration page
├── dashboard/          # Role-based redirect
├── admin/              # Admin pages
│   ├── page.tsx       # Dashboard
│   ├── users/         # User management
│   ├── services/      # Service management
│   ├── appointments/  # All appointments
│   └── holidays/      # Holiday management
├── gestionnaire/       # Manager pages
│   ├── page.tsx       # Dashboard
│   ├── services/      # View services
│   ├── employees/     # Employee management
│   └── appointments/  # Manage appointments
├── employe/           # Employee pages
│   ├── page.tsx       # Dashboard
│   ├── availability/  # Set availability
│   └── appointments/  # View appointments
└── demandeur/         # Client pages
    ├── page.tsx       # Dashboard
    ├── book/          # Book appointment
    └── appointments/  # View/manage appointments

components/
├── DashboardLayout.tsx    # Main layout with sidebar
├── ProtectedRoute.tsx     # Role-based access control
├── StatusBadge.tsx        # Status display component
├── NotificationBell.tsx   # Notifications dropdown
└── RdvCard.tsx           # Appointment card component

lib/
├── api.ts                 # Axios client with interceptors
├── authService.ts         # Authentication
├── appointmentService.ts  # Appointments
├── serviceService.ts      # Services
├── userService.ts         # Users
├── availabilityService.ts # Availability slots
├── notificationService.ts # Notifications
├── statsService.ts        # Statistics
└── holidayService.ts      # Holidays

context/
└── AuthContext.tsx        # Authentication context provider
```

## API Endpoints Expected

The application expects the following Spring Boot API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /users/role/{role}` - Get users by role

### Appointments
- `GET /appointments` - Get all appointments
- `GET /appointments/{id}` - Get appointment by ID
- `POST /appointments` - Create appointment
- `PUT /appointments/{id}` - Update appointment
- `DELETE /appointments/{id}` - Delete appointment
- `GET /appointments/user/{userId}` - Get user's appointments

### Services
- `GET /services` - Get all services
- `GET /services/{id}` - Get service by ID
- `POST /services` - Create service
- `PUT /services/{id}` - Update service
- `DELETE /services/{id}` - Delete service

### Availability
- `GET /availability/employee/{employeeId}` - Get employee availability
- `POST /availability` - Create availability slot
- `PUT /availability/{id}` - Update availability
- `DELETE /availability/{id}` - Delete availability
- `GET /availability/slots` - Get available slots for booking

### Notifications
- `GET /notifications/user/{userId}` - Get user notifications
- `PUT /notifications/{id}/read` - Mark notification as read
- `PUT /notifications/user/{userId}/read-all` - Mark all as read
- `DELETE /notifications/{id}` - Delete notification

### Statistics
- `GET /stats/dashboard` - Get dashboard statistics
- `GET /stats/monthly` - Get monthly statistics
- `GET /stats/user/{userId}` - Get user statistics

### Holidays
- `GET /holidays` - Get all holidays
- `POST /holidays` - Create holiday
- `DELETE /holidays/{id}` - Delete holiday

## User Roles

1. **ADMIN** - Full system access
2. **GESTIONNAIRE** - Manager: manage employees and appointments
3. **EMPLOYE** - Employee: set availability and view appointments
4. **DEMANDEUR** - Client: book appointments

## Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. If token expires (401), user is redirected to login

## Development Tips

### Adding a New Page
1. Create folder in `app/{role}/`
2. Add `page.tsx` file
3. Wrap with `<ProtectedRoute allowedRoles={['ROLE']}>` 
4. Use `<DashboardLayout>` for consistent UI

### API Calls
All API calls use the configured `api` client from `lib/api.ts`. The client automatically includes JWT tokens and handles 401 errors.

```typescript
import { appointmentService } from '@/lib/appointmentService';

const appointments = await appointmentService.getAll();
```

### Styling
Use Tailwind CSS classes and shadcn/ui components. Design tokens are configured in `globals.css`.

## Deployment

### Build for Production
```bash
pnpm build
pnpm start
```

### Environment Setup for Production
Set `NEXT_PUBLIC_API_URL` to your production API URL.

## Support

For issues or questions, refer to the technical stack documentation file or contact your development team.
