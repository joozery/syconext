
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Briefcase, Users, FolderOpen, 
  LogOut, Menu, X, ChevronDown, Bell, Globe, Newspaper, Package, Image, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from '@/accest/logo.png';

const AdminLayout = ({ children, pageTitle, breadcrumb }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isWebsiteMenuOpen, setIsWebsiteMenuOpen] = useState(false);

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      label: 'Dashboard',
      color: 'blue'
    },
    { 
      path: '/admin/quotations', 
      icon: <FileText className="w-5 h-5" />, 
      label: 'ใบเสนอราคา',
      color: 'green'
    },
    { 
      path: '/admin/jobs', 
      icon: <Briefcase className="w-5 h-5" />, 
      label: 'จัดการงาน',
      color: 'purple'
    },
    { 
      path: '/admin/technicians', 
      icon: <Users className="w-5 h-5" />, 
      label: 'จัดการช่าง',
      color: 'indigo'
    },
    { 
      path: '/admin/documents', 
      icon: <FolderOpen className="w-5 h-5" />, 
      label: 'เอกสาร',
      color: 'yellow'
    },
  ];

  const websiteMenuItems = [
    { path: '/admin/articles', icon: <Newspaper className="w-4 h-4" />, label: 'จัดการบทความ' },
    { path: '/admin/products', icon: <Package className="w-4 h-4" />, label: 'จัดการสินค้า' },
    { path: '/admin/banners', icon: <Image className="w-4 h-4" />, label: 'จัดการแบนเนอร์' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200
        flex flex-col transform transition-transform duration-300 ease-in-out shadow-lg
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-center p-5 border-b border-gray-200">
          <img 
            src={logo} 
            alt="SY Connext Logo" 
            className="h-12 object-contain"
          />
        </div>

        {/* User Profile Card */}
        <div className="p-3 mx-3 mt-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{user?.name || 'Admin User'}</p>
              <div className="flex items-center mt-0.5 gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"></div>
                <p className="text-xs text-white/90">Online</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Main Menu Items */}
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                  ${isActive 
                    ? 'bg-orange-50 text-orange-600 font-medium border-l-3 border-orange-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
                  }
                `}
              >
                <div className={`
                  ${isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-orange-500'}
                  transition-colors
                `}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-2 border-t border-gray-200"></div>

          {/* Website Management Section */}
          <div>
            <button
              onClick={() => setIsWebsiteMenuOpen(!isWebsiteMenuOpen)}
              className={`
                group w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                ${location.pathname.includes('/admin/articles') || 
                  location.pathname.includes('/admin/products') || 
                  location.pathname.includes('/admin/banners')
                  ? 'bg-orange-50 text-orange-600 font-medium border-l-3 border-orange-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
                }
              `}
            >
              <div className="flex items-center space-x-2.5">
                <Globe className={`w-5 h-5 ${
                  (location.pathname.includes('/admin/articles') || 
                   location.pathname.includes('/admin/products') || 
                   location.pathname.includes('/admin/banners'))
                    ? 'text-orange-600' 
                    : 'text-gray-400 group-hover:text-orange-500'
                }`} />
                <span>จัดการเว็บไซต์</span>
              </div>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${isWebsiteMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Submenu */}
            {isWebsiteMenuOpen && (
              <div className="mt-1 ml-2 space-y-0.5 border-l-2 border-gray-200 pl-2">
                {websiteMenuItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center space-x-2.5 px-3 py-2 rounded-lg transition-all text-xs
                        ${isActive 
                          ? 'bg-orange-50 text-orange-600 font-medium' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-orange-600'
                        }
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Management */}
          <Link
            to="/admin/users"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
              group flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
              ${location.pathname.startsWith('/admin/users')
                ? 'bg-orange-50 text-orange-600 font-medium border-l-3 border-orange-500' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-orange-600'
              }
            `}
          >
            <div className={`
              ${location.pathname.startsWith('/admin/users') ? 'text-orange-600' : 'text-gray-400 group-hover:text-orange-500'}
              transition-colors
            `}>
              <Shield className="w-5 h-5" />
            </div>
            <span>จัดการผู้ใช้</span>
          </Link>
        </nav>
        
        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group text-sm"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              {breadcrumb && (
                <div className="text-sm text-gray-500 hidden sm:block">
                  <Link to="/admin/dashboard" className="hover:text-blue-600">หน้าหลัก</Link>
                  {' > '}
                  <span className="font-medium text-gray-700">{breadcrumb}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5"/>
              </Button>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                     <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>โปรไฟล์</DropdownMenuItem>
                  <DropdownMenuItem>ตั้งค่า</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>ออกจากระบบ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
           <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {React.cloneElement(children, { pageTitle, breadcrumb })}
          </motion.div>
        </main>
      </div>

       {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
