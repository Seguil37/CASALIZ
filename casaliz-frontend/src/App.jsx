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
import AdminWorkspaceLayout from './shared/components/Layout/AdminWorkspaceLayout';

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
import { ROLES, MODULES, canAccessModule } from './shared/constants/roles';
import AdminUsersPage from './features/admin-users/pages/AdminUsersPage';
import AdminPanelPage from './features/admin-users/pages/AdminPanelPage';
import ServicesPage from './features/services/pages/ServicesPage';
import ServiceDetailPage from './features/services/pages/ServiceDetailPage';
import AdminServicesPage from './features/services/pages/AdminServicesPage';
import AboutPage from './features/about/pages/AboutPage';
import TramiteTypesPage from './features/tramites/pages/TramiteTypesPage';
import TramitesByClientPage from './features/tramites/pages/TramitesByClientPage';
import TramiteTasksPage from './features/tramites/pages/TramiteTasksPage';
import ControlBoardPage from './features/tramites/pages/ControlBoardPage';
import TramiteDetailPage from './features/tramites/pages/TramiteDetailPage';
import AssignedTasksSummaryPage from './features/tramites/pages/AssignedTasksSummaryPage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';

// Agency Pages
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
const ProtectedRoute = ({ children, allowedRoles = [], requiredModule = null }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  if (requiredModule && !canAccessModule(user, requiredModule)) {
    return <Navigate to="/admin/panel" replace />;
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
            <Route path="projects/:id" element={<TourDetailPage />} />
            <Route path="tours" element={<Navigate to="/projects" replace />} />
            <Route path="tours/:id" element={<Navigate to="/projects/:id" replace />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="contacto" element={<ContactPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="about" element={<AboutPage />} />

            {/* Customer Routes */}
            <Route
              path="profile"
              element={
                <ProtectedRoute
                  allowedRoles={[ROLES.CLIENT, ROLES.ADMIN, ROLES.MASTER_ADMIN, ROLES.OPERATOR]}
                >
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="booking/:id"
              element={
                <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                  <BookingPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="booking/success"
              element={
                <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                  <BookingSuccessPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="profile/bookings"
              element={
                <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/notifications"
              element={
                <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]}>
                  <AdminWorkspaceLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="agency/dashboard"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MASTER_ADMIN]} requiredModule={MODULES.PROJECTS}>
                    <AgencyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="agency/tours"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MASTER_ADMIN]} requiredModule={MODULES.PROJECTS}>
                    <MyToursPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="agency/services"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MASTER_ADMIN]} requiredModule={MODULES.SERVICES}>
                    <AdminServicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="agency/tours/create"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MASTER_ADMIN]} requiredModule={MODULES.PROJECTS}>
                    <CreateTourPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="agency/tours/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MASTER_ADMIN]} requiredModule={MODULES.PROJECTS}>
                    <EditTourPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="agency/bookings"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MASTER_ADMIN]} requiredModule={MODULES.PROJECTS}>
                    <AgencyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN]} requiredModule={MODULES.ADMIN_USERS}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/panel"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]}>
                    <AdminPanelPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tramites/tipos"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN]} requiredModule={MODULES.TRAMITE_TYPES}>
                    <TramiteTypesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tramites/gestion"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN, ROLES.ADMIN]} requiredModule={MODULES.TRAMITES_MANAGE}>
                    <TramitesByClientPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tramites/control"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]} requiredModule={MODULES.TRAMITES_CONTROL}>
                    <ControlBoardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tramites/resumen-tareas"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]} requiredModule={MODULES.TASKS_SUMMARY}>
                    <AssignedTasksSummaryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tramites/:id/tareas"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]} requiredModule={MODULES.TASKS_SUMMARY}>
                    <TramiteTasksPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="tramites/:id/detalle"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.MASTER_ADMIN, ROLES.ADMIN, ROLES.OPERATOR]} requiredModule={MODULES.TRAMITES_CONTROL}>
                    <TramiteDetailPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
