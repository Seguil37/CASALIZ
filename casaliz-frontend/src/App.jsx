// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import './App.css';

// Utils
import ScrollToTop from './shared/components/ScrollToTop';

// Layouts
import MainLayout from './shared/components/Layout/MainLayout';

// Pages
import HomePage from './features/tours/pages/HomePage';
import ToursPage from './features/tours/pages/ToursPage';
import TourDetailPage from './features/tours/pages/TourDetailPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import BookingPage from './features/booking/pages/BookingPage';
import BookingSuccessPage from './features/booking/pages/BookingSuccessPage';
import MyBookingsPage from './features/customer/pages/MyBookingsPage';
import FavoritesPage from './features/customer/pages/FavoritesPage';
import ContactPage from './features/contact/pages/ContactPage';

// Admin Pages
import MasterDashboard from './features/admin/pages/MasterDashboard';
import AgencyDashboard from './features/agency/pages/AgencyDashboard';
import CreateTourPage from './features/agency/pages/CreateTourPage';
import EditTourPage from './features/agency/pages/EditTourPage';
import MyToursPage from './features/agency/pages/MyToursPage';
import AgencyBookingsPage from './features/agency/pages/AgencyBookingsPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ToursPage />} />
            <Route path="projects/:slug" element={<TourDetailPage />} />
            <Route path="tours" element={<Navigate to="/projects" replace />} />
            <Route path="tours/:slug" element={<TourDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="contacto" element={<ContactPage />} />

            {/* Customer Routes */}
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={['client', 'admin', 'master_admin']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Master Admin Routes */}
            <Route
              path="master/dashboard"
              element={
                <ProtectedRoute allowedRoles={['master_admin']}>
                  <MasterDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'master_admin']}>
                  <AgencyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/projects"
              element={
                <ProtectedRoute allowedRoles={['admin', 'master_admin']}>
                  <MyToursPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/projects/create"
              element={
                <ProtectedRoute allowedRoles={['admin', 'master_admin']}>
                  <CreateTourPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/projects/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['admin', 'master_admin']}>
                  <EditTourPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/reviews"
              element={
                <ProtectedRoute allowedRoles={['admin', 'master_admin']}>
                  <AgencyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="booking/:id"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="booking/success"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <BookingSuccessPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="profile/bookings"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
