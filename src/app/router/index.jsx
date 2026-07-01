import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import HomePage from '../../pages/Home/HomePage';
import AboutPage from '../../pages/About/AboutPage';
import ServicesPage from '../../pages/Services/ServicesPage';
import ServiceDetailsPage from '../../pages/Services/ServiceDetailsPage';
import SolutionsPage from '../../pages/Solutions/SolutionsPage';
import SolutionDetailsPage from '../../pages/Solutions/SolutionDetailsPage';
import DataCenterPage from '../../pages/DataCenter/DataCenterPage';
import FacilityDetailsPage from '../../pages/DataCenter/FacilityDetailsPage';
import ContactPage from '../../pages/Contact/ContactPage';
import NotFoundPage from '../../pages/NotFound/NotFoundPage';
import EnterpriseServerPage from '../../pages/Servers/EnterpriseServerPage';
import AIServerPage from '../../pages/Servers/AIServerPage';
import ColocationPage from '../../pages/Services/ColocationPage';

// Legal Imports
import PrivacyPolicyPage from '../../pages/Legal/PrivacyPolicyPage';
import TermsOfServicePage from '../../pages/Legal/TermsOfServicePage';
import RefundPolicyPage from '../../pages/Legal/RefundPolicyPage';

// Auth & Dashboard Imports
import LoginPage from '../../pages/Auth/LoginPage';
import SignupPage from '../../pages/Auth/SignupPage';
import ForgotPasswordPage from '../../pages/Auth/ForgotPasswordPage';
import DashboardPage from '../../pages/Dashboard/DashboardPage';
import VerificationPage from '../../pages/Dashboard/VerificationPage';
import PaymentPage from '../../pages/Dashboard/PaymentPage';
import MyServicesPage from '../../pages/Dashboard/MyServicesPage';
import MyPaymentsPage from '../../pages/Dashboard/MyPaymentsPage';
import ProfilePage from '../../pages/Dashboard/ProfilePage';
import MyEnquiriesPage from '../../pages/Dashboard/MyEnquiriesPage';
import MyQuotesPage from '../../pages/Dashboard/MyQuotesPage';
import ProtectedRoute from '../../components/ProtectedRoute';

// Admin Imports
import AdminLayout from '../../layouts/AdminLayout';
import AdminProtectedRoute from '../../components/AdminProtectedRoute';
import { AdminAuthProvider } from '../../context/AdminAuthContext';
import AdminLoginPage from '../../pages/Admin/AdminLoginPage';
import AdminDashboardPage from '../../pages/Admin/AdminDashboardPage';
import AdminUsersPage from '../../pages/Admin/AdminUsersPage';
import AdminUserDetailsPage from '../../pages/Admin/AdminUserDetailsPage';
import AdminEnquiriesPage from '../../pages/Admin/AdminEnquiriesPage';
import AdminEnquiryDetailsPage from '../../pages/Admin/AdminEnquiryDetailsPage';
import AdminQuotesPage from '../../pages/Admin/AdminQuotesPage';
import AdminQuoteDetailsPage from '../../pages/Admin/AdminQuoteDetailsPage';
import AdminVerificationsPage from '../../pages/Admin/AdminVerificationsPage';
import AdminVerificationDetailPage from '../../pages/Admin/AdminVerificationDetailPage';
import AdminServicesPage from '../../pages/Admin/AdminServicesPage';
import AdminPaymentsPage from '../../pages/Admin/AdminPaymentsPage';
import AdminComplianceLogsPage from '../../pages/Admin/AdminComplianceLogsPage';
import AdminSettingsPage from '../../pages/Admin/AdminSettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'services/:slug',
        element: <ServiceDetailsPage />,
      },
      {
        path: 'solutions',
        element: <SolutionsPage />,
      },
      {
        path: 'solutions/:slug',
        element: <SolutionDetailsPage />,
      },
      {
        path: 'data-center',
        element: <DataCenterPage />,
      },
      {
        path: 'data-center/facilities/:slug',
        element: <FacilityDetailsPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'enterprise-servers',
        element: <EnterpriseServerPage />,
      },
      {
        path: 'ai-servers',
        element: <AIServerPage />,
      },
      {
        path: 'colocation',
        element: <ColocationPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: 'terms-and-conditions',
        element: <Navigate to="/terms-of-service" replace />,
      },
      {
        path: 'terms-of-service',
        element: <TermsOfServicePage />,
      },
      {
        path: 'refund-policy',
        element: <RefundPolicyPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'verification/:quoteId',
        element: (
          <ProtectedRoute>
            <VerificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'payment/:quoteId',
        element: (
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/services',
        element: (
          <ProtectedRoute>
            <MyServicesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/payments',
        element: (
          <ProtectedRoute>
            <MyPaymentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/enquiries',
        element: (
          <ProtectedRoute>
            <MyEnquiriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/quotes',
        element: (
          <ProtectedRoute>
            <MyQuotesPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <AdminAuthProvider>
        <AdminLoginPage />
      </AdminAuthProvider>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminAuthProvider>
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      </AdminAuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />
      },
      {
        path: 'users',
        element: <AdminUsersPage />
      },
      {
        path: 'users/:id',
        element: <AdminUserDetailsPage />
      },
      {
        path: 'enquiries',
        element: <AdminEnquiriesPage />
      },
      {
        path: 'enquiries/:id',
        element: <AdminEnquiryDetailsPage />
      },
      {
        path: 'quotes',
        element: <AdminQuotesPage />
      },
      {
        path: 'quotes/:id',
        element: <AdminQuoteDetailsPage />
      },
      {
        path: 'verifications',
        element: <AdminVerificationsPage />
      },
      {
        path: 'verifications/:id',
        element: <AdminVerificationDetailPage />
      },
      {
        path: 'services',
        element: <AdminServicesPage />
      },
      {
        path: 'payments',
        element: <AdminPaymentsPage />
      },
      {
        path: 'compliance',
        element: <AdminComplianceLogsPage />
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />
      }
    ]
  }
]);
