import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/authContext';

// Public Components
import CustomerLogin from './pages/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup';

// Protected Components
import Dashboard from './pages/Dashboard';
import CustomersPage from './pages/Profile';
import AccountsPage from './pages/Loan';
import TransactionsPage from './pages/TransactionsPage';

// Common Components
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * AuthRoute - Redirects authenticated users away from auth pages
 */
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * ProtectedRoute - Requires authentication
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" replace />;

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

      {/* Protected Routes */}
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

      {/* Fallback / Not Found */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;
