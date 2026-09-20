import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { DashboardLayout } from '@/shared/components/layouts/DashboardLayout';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { MyProfilePage } from '@/features/home/pages/MyProfilePage';
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage';
import { EmployeeDetailPage } from '@/features/employees/pages/EmployeeDetailPage';

import { PointagePage } from '@/features/pointage/pages/PointagePage';
import { CongesPage } from '@/features/conges/pages/CongesPage';
import { PlanningPage } from '@/features/planning/pages/PlanningPage';
import { StatistiquesPage } from '@/features/statistiques/pages/StatistiquesPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { OnboardingPage } from '@/features/onboarding/pages/OnboardingPage';
import { PayrollPage } from '@/features/payroll/pages/PayrollPage';
import { ExpensesPage } from '@/features/expenses/pages/ExpensesPage';
import { PerformancePage } from '@/features/performance/pages/PerformancePage';

import { DocumentsPage } from '@/features/documents/pages/DocumentsPage';

import { CalendarPage } from '@/features/calendar/pages/CalendarPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { useEmployeeStore } from '@/shared/store/mock-data';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useEmployeeStore(state => state.currentUser);
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: '/my-profile',
    element: <ProtectedRoute><MyProfilePage /></ProtectedRoute>,
  },
  {
    path: '/employees',
    element: <ProtectedRoute><EmployeesPage /></ProtectedRoute>,
  },
  {
    path: '/employees/:id',
    element: <ProtectedRoute><EmployeeDetailPage /></ProtectedRoute>,
  },
  {
    path: '/pointage',
    element: <ProtectedRoute><PointagePage /></ProtectedRoute>,
  },
  {
    path: '/conges',
    element: <ProtectedRoute><CongesPage /></ProtectedRoute>,
  },
  {
    path: '/planning',
    element: <ProtectedRoute><PlanningPage /></ProtectedRoute>,
  },
  {
    path: '/statistiques',
    element: <ProtectedRoute><StatistiquesPage /></ProtectedRoute>,
  },
  {
    path: '/onboarding',
    element: <ProtectedRoute><OnboardingPage /></ProtectedRoute>,
  },
  {
    path: '/paie',
    element: <ProtectedRoute><PayrollPage /></ProtectedRoute>,
  },
  {
    path: '/expenses',
    element: <ProtectedRoute><ExpensesPage /></ProtectedRoute>,
  },
  {
    path: '/performance',
    element: <ProtectedRoute><PerformancePage /></ProtectedRoute>,
  },

  {
    path: '/documents',
    element: <ProtectedRoute><DocumentsPage /></ProtectedRoute>,
  },

  {
    path: '/calendar',
    element: <ProtectedRoute><CalendarPage /></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
