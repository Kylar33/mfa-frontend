import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import TrainerDashboard from './pages/trainer/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import Unauthorized from './pages/Unauthorized';

const queryClient = new QueryClient();

function App() {
  const { auth } = useAuth() || {};

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer"
              element={
                <ProtectedRoute allowedRoles={['trainer']}>
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                auth ? (
                  <Navigate
                    to={
                      auth.role === 'admin'
                        ? '/admin'
                        : auth.role === 'trainer'
                        ? '/trainer'
                        : '/user'
                    }
                    replace
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;