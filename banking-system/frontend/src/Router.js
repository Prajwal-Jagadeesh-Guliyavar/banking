import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/authContext';

// Public Components
import CustomerLogin from './pages/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';

// Protected Components
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/CustomersPage';
import AccountsPage from './pages/AccountsPage';
import TransactionsPage from './pages/TransactionsPage';
import AdminDashboard from './pages/AdminDashboard';

// Common Components
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * AuthRoute - Redirects authenticated users away from auth pages
 */
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  // If user is logged in, redirect to appropriate dashboard
  if (user) {
    return <Navigate to={user.type === 'admin' ? '/admin/dashboard' : '/'} replace />;
  }

  return children;
};

/**
 * ProtectedRoute - Requires authentication
 * If adminOnly is true, only allows admin users
 */
const ProtectedRoute = ({ adminOnly = false, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (adminOnly && user.type !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <CustomerLogin />
          </AuthRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <AuthRoute>
            <CustomerSignup />
          </AuthRoute>
        } 
      />
      <Route 
        path="/admin/login" 
        element={
          <AuthRoute>
            <AdminLogin />
          </AuthRoute>
        } 
      />
      <Route 
        path="/admin/signup" 
        element={
          <AuthRoute>
            <AdminSignup />
          </AuthRoute>
        } 
      />

      {/* Customer Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/customers" 
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/accounts" 
        element={
          <ProtectedRoute>
            <AccountsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        } 
      />

      {/* Admin Protected Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Fallback / Not Found */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;
