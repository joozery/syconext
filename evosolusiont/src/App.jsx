import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginPage from '@/components/LoginPage';
import AdminDashboard from '@/components/AdminDashboard';
import ContractorDashboard from '@/components/ContractorDashboard';
import CoordinatorDashboard from '@/components/CoordinatorDashboard';
import { Toaster } from '@/components/ui/toaster';
import { authAPI } from '@/services/api';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Dashboard Router Component
const DashboardRouter = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} onLogout={onLogout} />;
      case 'contractor':
        return <ContractorDashboard user={user} onLogout={onLogout} />;
      case 'coordinator':
        return <CoordinatorDashboard user={user} onLogout={onLogout} />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return renderDashboard();
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('eep_jwt_token');
        const savedUser = localStorage.getItem('eep_current_user');
        
        if (token && savedUser) {
          // Verify token with backend
          try {
            const response = await authAPI.getCurrentUser();
            if (response.success) {
              const userData = {
                id: response.data.user.id,
                name: response.data.user.name || `${response.data.user.firstName} ${response.data.user.lastName}`,
                email: response.data.user.email,
                role: response.data.user.role
              };
              setCurrentUser(userData);
              // Update localStorage with fresh user data
              localStorage.setItem('eep_current_user', JSON.stringify(userData));
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('eep_jwt_token');
              localStorage.removeItem('eep_current_user');
            }
          } catch (error) {
            // Token expired or invalid, clear storage
            localStorage.removeItem('eep_jwt_token');
            localStorage.removeItem('eep_current_user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear storage on error
        localStorage.removeItem('eep_jwt_token');
        localStorage.removeItem('eep_current_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('eep_jwt_token');
      localStorage.removeItem('eep_current_user');
    }
  };

  return (
    <Router>
      <NotificationProvider user={currentUser}>
        <Helmet>
          <title>ระบบบริหารจัดการ ERP - EVOLUTION ENERGY TECH System</title>
          <meta name="description" content="ระบบบริหารจัดการงานภายในองค์กร EEP พร้อมระบบอนุมัติและรายงาน" />
        </Helmet>
        
        <div className="min-h-screen">
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">กำลังโหลด...</p>
              </div>
            </div>
          ) : (
            <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              currentUser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={currentUser}>
                <DashboardRouter user={currentUser} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin specific routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute user={currentUser}>
                {currentUser?.role === 'admin' ? (
                  <DashboardRouter user={currentUser} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </ProtectedRoute>
            } 
          />
          
          {/* Contractor specific routes */}
          <Route 
            path="/contractor/*" 
            element={
              <ProtectedRoute user={currentUser}>
                {currentUser?.role === 'contractor' ? (
                  <DashboardRouter user={currentUser} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </ProtectedRoute>
            } 
          />
          
          {/* Coordinator specific routes */}
          <Route 
            path="/coordinator/*" 
            element={
              <ProtectedRoute user={currentUser}>
                {currentUser?.role === 'coordinator' ? (
                  <DashboardRouter user={currentUser} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              <Navigate to={currentUser ? "/dashboard" : "/login"} replace />
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <Navigate to={currentUser ? "/dashboard" : "/login"} replace />
            } 
          />
            </Routes>
          )}
          <Toaster />
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App;