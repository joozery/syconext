import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, FilePlus2, ListTodo, FileText, ChevronRight, User, ChevronDown, Settings, Bell, Search, Users, UserCircle, List, Eye, FileSpreadsheet, FileCheck, PenTool, Shield, CalendarClock, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DashboardOverview from '@/components/DashboardOverview';
import ProjectList from '@/components/ProjectList';
import AllOrganizationsList from '@/components/AllOrganizationsList';
import OrganizationDetails from '@/components/OrganizationDetails';
import ApprovalQueue from '@/components/ApprovalQueue';
import ReportPage from '@/components/ReportPage';
import RegisterProject from '@/components/RegisterProject';
import RegisterEpc from '@/components/RegisterEpc';
// import EpcList from '@/components/EpcList';
import RegisterCoordinator from '@/components/RegisterCoordinator';
import RegisterAgency from '@/components/RegisterAgency';
import EditProject from '@/components/EditProject';
import EditOrganization from '@/components/EditOrganization';
import EditEpc from '@/components/EditEpc';
import EditCoordinator from '@/components/EditCoordinator';
import EditAgency from '@/components/EditAgency';
import AgencyRegistrationStep from '@/components/AgencyRegistrationStep';
import AdminUsers from '@/components/AdminUsers';
import DocumentSettings from '@/components/DocumentSettings';
import SignatureSettings from '@/components/SignatureSettings';
import ApprovalManagement from '@/components/ApprovalManagement';
import Profile from '@/components/Profile';
import NotificationBell from '@/components/NotificationBell';
import MaintenanceSchedule from '@/components/MaintenanceSchedule';
import { toast } from '@/components/ui/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import logoEet from '@/assets/logo-eet.png';

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('dashboard');

  // Update activeView based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/')) {
      const view = path.split('/admin/')[1] || 'dashboard';
      setActiveView(view);
    } else if (path === '/dashboard') {
      setActiveView('dashboard');
    }
  }, [location.pathname]);

  const handleNavigation = (viewId) => {
    setActiveView(viewId);
    if (viewId === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(`/admin/${viewId}`);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'status', label: 'อัพเดทสถานะ', icon: ListTodo },
    { id: 'reports', label: 'Report', icon: FileText },
    { id: 'admin-users', label: 'Admin Users', icon: Users },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  const renderContent = () => {
    // Check if URL matches edit patterns
    const path = location.pathname;
    const editProjectMatch = path.match(/\/admin\/edit-project\/(\d+)/);
    const editOrganizationMatch = path.match(/\/admin\/edit-organization\/(\d+)/);
    const editEpcMatch = path.match(/\/admin\/edit-epc\/(\d+)/);
    const editCoordinatorMatch = path.match(/\/admin\/edit-coordinator\/(\d+)/);
    const editAgencyMatch = path.match(/\/admin\/edit-agency\/(\d+)/);
    const agencyRegistrationMatch = path.match(/\/admin\/agency-registration\/(\d+)/);
    const projectStatusMatch = path.match(/\/admin\/status\/project\/(\d+)/);
    
    if (editProjectMatch) {
      return <EditProject />;
    }
    
    if (editOrganizationMatch) {
      return <EditOrganization />;
    }
    
    if (editEpcMatch) {
      return <EditEpc />;
    }
    
    if (editCoordinatorMatch) {
      return <EditCoordinator />;
    }
    
    if (editAgencyMatch) {
      return <EditAgency />;
    }
    
    if (agencyRegistrationMatch) {
      return <AgencyRegistrationStep />;
    }
    
    if (projectStatusMatch) {
      const projectId = projectStatusMatch[1];
      return <ApprovalQueue initialProjectId={parseInt(projectId)} />;
    }
    
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview userRole="admin" />;
      case 'register-project':
        return <RegisterProject />;
      case 'register-epc':
        return <RegisterEpc />;
      // case 'epc-list':
      //   return <EpcList />;
      case 'register-coordinator':
        return <RegisterCoordinator />;
      case 'register-agency':
        return <RegisterAgency />;
      case 'status':
        return <ApprovalQueue />;
      case 'projects':
        return <AllOrganizationsList />;
      case 'organization-details':
        return <OrganizationDetails />;
      case 'reports':
        return <ReportPage />;
      case 'admin-users':
        return <AdminUsers />;
      case 'document-settings':
        return <DocumentSettings />;
      case 'signature-settings':
        return <SignatureSettings />;
      case 'approval-management':
        return <ApprovalManagement />;
      case 'maintenance-schedule':
        return <MaintenanceSchedule />;
      case 'profile':
        return <Profile user={user} />;
      default:
        return <DashboardOverview userRole="admin" />;
    }
  };

  const handleNotImplemented = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg p-1">
                <img 
                  src={logoEet} 
                  alt="EVOLUTION ENERGY TECH Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">EVOLUTION ENERGY TECH</h1>
                <p className="text-xs text-gray-600">Admin Dashboard</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="ค้นหาโครงการ, หน่วยงาน..."
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications - Real-time */}
              <NotificationBell />

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-3 h-auto p-2 hover:bg-slate-100">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    การตั้งค่า
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 py-3">
              {/* 1. Dashboard */}
              <Button
                onClick={() => handleNavigation('dashboard')}
                variant={activeView === 'dashboard' ? "default" : "ghost"}
                className={`flex items-center justify-center text-sm h-9 px-4 rounded-lg transition-all duration-200 ${
                  activeView === 'dashboard' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-800 hover:text-black hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>

              {/* 2. ลงทะเบียน */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={['register-project', 'register-epc', 'epc-list', 'register-coordinator', 'register-agency'].includes(activeView) ? "default" : "ghost"}
                    className={`flex items-center justify-center text-sm h-9 px-4 rounded-lg transition-all duration-200 ${
                      ['register-project', 'register-epc', 'epc-list', 'register-coordinator', 'register-agency'].includes(activeView) 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-800 hover:text-black hover:bg-slate-100'
                    }`}
                  >
                    <FilePlus2 className="w-4 h-4 mr-2" />
                    ลงทะเบียน
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('register-epc')}
                    className="cursor-pointer"
                  >
                    <FilePlus2 className="w-4 h-4 mr-2" />
                    ลงทะเบียน EPC
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('register-agency')}
                    className="cursor-pointer"
                  >
                    <FilePlus2 className="w-4 h-4 mr-2" />
                    ลงทะเบียนหน่วยงาน
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('register-coordinator')}
                    className="cursor-pointer"
                  >
                    <FilePlus2 className="w-4 h-4 mr-2" />
                    ลงทะเบียน Sale
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 3. เมนูสถานะ - Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={['status', 'maintenance-schedule'].includes(activeView) ? "default" : "ghost"}
                    className={`flex items-center justify-center text-sm h-9 px-4 rounded-lg transition-all duration-200 ${
                      ['status', 'maintenance-schedule'].includes(activeView) 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-800 hover:text-black hover:bg-slate-100'
                    }`}
                  >
                    <ListTodo className="w-4 h-4 mr-2" />
                    เมนูสถานะ
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('status')}
                    className="cursor-pointer"
                  >
                    <ListTodo className="w-4 h-4 mr-2" />
                    อัพเดทสถานะ
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('maintenance-schedule')}
                    className="cursor-pointer"
                  >
                    <CalendarClock className="w-4 h-4 mr-2" />
                    กำหนดบำรุงรักษา
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 4. รายชื่อหน่วยงานทั้งหมด */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={['projects', 'organization-details'].includes(activeView) ? "default" : "ghost"}
                    className={`flex items-center justify-center text-sm h-9 px-4 rounded-lg transition-all duration-200 ${
                      ['projects', 'organization-details'].includes(activeView) 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-800 hover:text-black hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    รายชื่อหน่วยงานทั้งหมด
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('projects')}
                    className="cursor-pointer"
                  >
                    <List className="w-4 h-4 mr-2" />
                    รายชื่อในระบบ
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('organization-details')}
                    className="cursor-pointer"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    ดูรายละเอียดข้อมูล
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 5. Report */}
              <Button
                onClick={() => handleNavigation('reports')}
                variant={activeView === 'reports' ? "default" : "ghost"}
                className={`flex items-center justify-center text-sm h-9 px-4 rounded-lg transition-all duration-200 ${
                  activeView === 'reports' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-800 hover:text-black hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Report
              </Button>

              {/* 6. Admin Users - Changed to Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={['admin-users', 'document-settings', 'signature-settings', 'approval-management'].includes(activeView) ? "default" : "ghost"}
                    className={`flex items-center justify-center text-sm h-9 px-4 rounded-lg transition-all duration-200 ${
                      ['admin-users', 'document-settings', 'signature-settings', 'approval-management'].includes(activeView) 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-gray-800 hover:text-black hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Admin Users
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('admin-users')}
                    className="cursor-pointer"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    จัดการผู้ใช้
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('document-settings')}
                    className="cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    การตั้งค่าเอกสาร
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('signature-settings')}
                    className="cursor-pointer"
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    การตั้งค่าลายเซ็น
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('approval-management')}
                    className="cursor-pointer"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    การอนุมัติ Sale/ผู้ประสานงาน
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 7. Profile */}
              <Button
                onClick={() => handleNavigation('profile')}
                variant={activeView === 'profile' ? "default" : "ghost"}
                className={`flex items-center justify-center text-sm h-9 px-4 rounded-lg transition-all duration-200 ${
                  activeView === 'profile' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-800 hover:text-black hover:bg-slate-100'
                }`}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">2025 EET</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;