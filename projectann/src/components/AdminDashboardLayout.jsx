import React, { useState, createContext, useContext } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

// Create context for sidebar state
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

const AdminDashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      <div className="flex h-screen w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AdminSidebar />
        <div className="flex flex-col min-h-0 overflow-hidden flex-1 transition-all duration-300">
          <AdminHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto overscroll-contain scrollbar-hide">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

export default AdminDashboardLayout;
