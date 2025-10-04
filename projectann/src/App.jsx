import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Marketplace from '@/pages/Marketplace';
import DebtDetail from '@/pages/DebtDetail';
import Dashboard from '@/pages/Dashboard';
import AdminPanel from '@/pages/AdminPanel';
import AdminDashboardLayout from '@/components/AdminDashboardLayout';
import AdminMain from '@/components/AdminMain';
import AdminLogin from '@/pages/AdminLogin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { AdminProvider } from '@/contexts/AdminContext';

// App Content Component
function AppContent() {
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    if (userData.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleAdminLogin = (adminData) => {
    setUser(adminData);
    localStorage.setItem('currentUser', JSON.stringify(adminData));
    navigate('/admin-dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleViewDebt = (debt) => {
    setSelectedDebt(debt);
    navigate('/detail');
  };

  // Page transition variants
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    in: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    out: { 
      opacity: 0, 
      y: -20,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <ThemeProvider>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin-login" element={<AdminLogin onLogin={handleAdminLogin} onBack={() => navigate('/login')} />} />
          <Route path="/admin-dashboard/*" element={
            <AdminDashboardLayout>
              <AdminMain />
            </AdminDashboardLayout>
          } />
          
          {/* Public Routes - With Navbar/Footer */}
          <Route path="/*" element={
            <>
              <Helmet>
                <title>ตลาดหนี้มือถือ - ระบบซื้อขายหนี้เสียออนไลน์</title>
                <meta name="description" content="แพลตฟอร์มซื้อขายหนี้มือถือออนไลน์ สำหรับนักลงทุนและนักทวงหนี้มืออาชีพ" />
              </Helmet>
              
              <Navbar
                currentPage={location.pathname}
                setCurrentPage={(path) => navigate(path)}
                user={user}
                onLogout={handleLogout}
              />
              
              <main className="container mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Routes>
                      <Route path="/" element={<Marketplace onViewDebt={handleViewDebt} user={user} />} />
                      <Route path="/detail" element={<DebtDetail debt={selectedDebt} user={user} onBack={() => navigate('/')} />} />
                      <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                      <Route path="/admin" element={user && user.role === 'admin' ? <AdminPanel user={user} /> : <Navigate to="/admin-login" />} />
                      <Route path="/login" element={<Login onLogin={handleLogin} onSwitchToRegister={() => navigate('/register')} />} />
                      <Route path="/register" element={<Register onRegister={handleLogin} onSwitchToLogin={() => navigate('/login')} />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </main>
              
              <Footer />
              <Toaster />
            </>
          } />
        </Routes>
      </motion.div>
    </ThemeProvider>
  );
}

// Main App Component
function App() {
  return (
    <HelmetProvider>
      <AdminProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminProvider>
    </HelmetProvider>
  );
}

export default App;