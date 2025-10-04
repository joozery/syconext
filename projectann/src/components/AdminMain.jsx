import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/pages/AdminDashboard';

// Debt Management Pages
import AdminDebts from '@/pages/admin/AdminDebts';
import AdminDebtAdd from '@/pages/admin/AdminDebtAdd';
import AdminDebtStatus from '@/pages/admin/AdminDebtStatus';
import AdminDebtAccess from '@/pages/admin/AdminDebtAccess';

// Member Management Pages
import AdminMembers from '@/pages/admin/AdminMembers';
import AdminApprovals from '@/pages/admin/AdminApprovals';

// Sales Pages
import AdminSales from '@/pages/admin/AdminSales';

// Collection Pages
import AdminCollection from '@/pages/admin/AdminCollection';

// Document Pages
import AdminDocuments from '@/pages/admin/AdminDocuments';

// Report Pages
import AdminReports from '@/pages/admin/AdminReports';

const AdminMain = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<AdminDashboard />} />
      
      {/* Debt Management */}
      <Route path="debts" element={<AdminDebts />} />
      <Route path="debt-add" element={<AdminDebtAdd />} />
      <Route path="debt-status" element={<AdminDebtStatus />} />
      <Route path="debt-access" element={<AdminDebtAccess />} />
      
      {/* Member Management */}
      <Route path="members" element={<AdminMembers />} />
      <Route path="approvals" element={<AdminApprovals />} />
      
      {/* Sales */}
      <Route path="sales" element={<AdminSales />} />
      
      {/* Collection */}
      <Route path="collection" element={<AdminCollection />} />
      
      {/* Documents */}
      <Route path="documents" element={<AdminDocuments />} />
      
      {/* Reports */}
      <Route path="reports" element={<AdminReports />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
    </Routes>
  );
};

export default AdminMain;
