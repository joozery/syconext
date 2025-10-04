import React from 'react';
import { Users, Menu, LogOut, Bell, Search, Plus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const { adminProfile, adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin-login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-primary/20 bg-white/80 backdrop-blur px-3 lg:h-[60px] lg:px-6">
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <input
          className="w-full rounded-md border border-gray-200 bg-white pl-8 pr-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
          placeholder="ค้นหาอย่างรวดเร็ว..."
          aria-label="Search"
        />
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button 
          variant="outline" 
          size="icon" 
          className="hidden md:inline-flex"
          onClick={handleGoHome}
          title="กลับหน้าแรก"
        >
          <Home className="h-4 w-4" />
          <span className="sr-only">กลับหน้าแรก</span>
        </Button>
        
        <Button variant="outline" size="icon" className="hidden md:inline-flex">
          <Plus className="h-4 w-4" />
          <span className="sr-only">เพิ่มใหม่</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">การแจ้งเตือน</span>
        </Button>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Users className="h-5 w-5" />
            <span className="sr-only">เมนูผู้ใช้</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {adminProfile?.name || 'Admin Account'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/admin-dashboard/profile')}>
            โปรไฟล์
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGoHome}>
            กลับหน้าแรก
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:bg-red-50 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>ออกจากระบบ</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default AdminHeader;
