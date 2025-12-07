// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import './App.css';

// Utils
import ScrollToTop from './shared/components/ScrollToTop';

// Layouts
import MainLayout from './shared/components/Layout/MainLayout';

// Pages
import HomePage from './features/home/pages/HomePage';
import ServicesPage from './features/services/pages/ServicesPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import ProjectDetailPage from './features/projects/pages/ProjectDetailPage';
import AboutPage from './features/about/pages/AboutPage';
import ContactPage from './features/contact/pages/ContactPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ProfilePage from './features/profile/pages/ProfilePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <LoginPage />;
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
            <Route index element={<HomePage />} />
            <Route path="servicios" element={<ServicesPage />} />
            <Route path="proyectos" element={<ProjectsPage />} />
            <Route path="proyectos/:id" element={<ProjectDetailPage />} />
            <Route path="nosotros" element={<AboutPage />} />
            <Route path="contacto" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
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
