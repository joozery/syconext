
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import QuotationPage from '@/pages/admin/QuotationPage';
import CreateQuotationPage from '@/pages/admin/CreateQuotationPage';
import ViewQuotationPage from '@/pages/admin/ViewQuotationPage';
import JobManagementPage from '@/pages/admin/JobManagementPage';
import TechnicianPage from '@/pages/admin/TechnicianPage';
import DocumentsPage from '@/pages/admin/DocumentsPage';
import ArticlesManagementPage from '@/pages/admin/ArticlesManagementPage';
import ProductsManagementPage from '@/pages/admin/ProductsManagementPage';
import BannersManagementPage from '@/pages/admin/BannersManagementPage';
import UsersManagementPage from '@/pages/admin/UsersManagementPage';
import CustomerJobRequestPage from '@/pages/customer/CustomerJobRequestPage';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Helmet>
          <title>SY Connext - ระบบไฟฟ้าและโซล่าเซลล์</title>
          <meta name="description" content="SY Connext บริษัทที่เชี่ยวชาญด้านระบบไฟฟ้าและโซล่าเซลล์ บริการครบวงจรตั้งแต่การออกแบบจนถึงการบำรุงรักษา" />
        </Helmet>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          
          <Route 
            path="/customer/job-request" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerJobRequestPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/quotations" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                <QuotationPage />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/quotations/new" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                <CreateQuotationPage />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/admin/quotations/:id" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                <ViewQuotationPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/jobs" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                <JobManagementPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/technicians" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TechnicianPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/documents" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'accountant']}>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/articles" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ArticlesManagementPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProductsManagementPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/banners" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BannersManagementPage />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UsersManagementPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
