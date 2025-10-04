import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '@/components/AdminDashboardLayout';
import { 
  Home, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  HelpCircle,
  LogOut,
  Bell,
  Plus,
  Shield,
  TrendingUp,
  Activity,
  FileText,
  Megaphone,
  CheckCircle,
  ShoppingCart,
  MessageCircle,
  DollarSign,
  Upload
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';

const navigationGroups = [
  {
    title: 'หลัก',
    items: [
      { to: '/admin-dashboard', label: 'แดชบอร์ด', icon: Home, badge: null },
    ]
  },
  {
    title: 'จัดการหนี้เสีย',
    items: [
      { to: '/admin-dashboard/debts', label: 'รายการหนี้ทั้งหมด', icon: CreditCard, badge: '89' },
      { to: '/admin-dashboard/debt-add', label: 'เพิ่มหนี้ใหม่', icon: Plus, badge: null },
      { to: '/admin-dashboard/debt-status', label: 'สถานะหนี้', icon: Activity, badge: null },
      { to: '/admin-dashboard/debt-access', label: 'ระดับการเข้าถึง', icon: Shield, badge: null },
    ]
  },
  {
    title: 'จัดการสมาชิก',
    items: [
      { to: '/admin-dashboard/members', label: 'สมาชิกทั้งหมด', icon: Users, badge: '1,247' },
      { to: '/admin-dashboard/approvals', label: 'รอการอนุมัติ', icon: CheckCircle, badge: '12' },
      { to: '/admin-dashboard/permissions', label: 'สิทธิ์เข้าถึง', icon: Shield, badge: null },
    ]
  },
  {
    title: 'การขายหนี้',
    items: [
      { to: '/admin-dashboard/sales', label: 'รายการขาย', icon: ShoppingCart, badge: '156' },
      { to: '/admin-dashboard/line-notifications', label: 'LINE Admin', icon: MessageCircle, badge: 'New' },
      { to: '/admin-dashboard/payments', label: 'การชำระเงิน', icon: CreditCard, badge: null },
    ]
  },
  {
    title: 'งานทวงหนี้',
    items: [
      { to: '/admin-dashboard/collection', label: 'เคสติดตาม', icon: TrendingUp, badge: '45' },
      { to: '/admin-dashboard/conditions', label: 'เงื่อนไขทวงหนี้', icon: FileText, badge: null },
      { to: '/admin-dashboard/approvals', label: 'อนุมัติเคส', icon: CheckCircle, badge: '8' },
    ]
  },
  {
    title: 'ระบบเอกสาร',
    items: [
      { to: '/admin-dashboard/documents', label: 'เอกสารทั้งหมด', icon: FileText, badge: null },
      { to: '/admin-dashboard/upload', label: 'อัพโหลดเอกสาร', icon: Upload, badge: null },
      { to: '/admin-dashboard/contracts', label: 'สัญญา', icon: FileText, badge: null },
    ]
  },
  {
    title: 'รายงาน',
    items: [
      { to: '/admin-dashboard/reports', label: 'รายงานทั้งหมด', icon: BarChart3, badge: null },
      { to: '/admin-dashboard/sales-report', label: 'รายงานการขาย', icon: TrendingUp, badge: null },
      { to: '/admin-dashboard/profit-loss', label: 'กำไร/ขาดทุน', icon: DollarSign, badge: null },
      { to: '/admin-dashboard/collection-status', label: 'สถานะติดตาม', icon: Activity, badge: null },
    ]
  },
  {
    title: 'การตั้งค่า',
    items: [
      { to: '/admin-dashboard/settings', label: 'การตั้งค่า', icon: Settings, badge: null },
      { to: '/admin-dashboard/profile', label: 'โปรไฟล์', icon: User, badge: null },
    ]
  }
];

const AdminSidebar = () => {
  const { isSidebarCollapsed: isCollapsed, toggleSidebar } = useSidebar();
  const { adminProfile, adminLogout } = useAdmin();

  return (
    <aside className={`hidden md:flex flex-col h-screen bg-gradient-to-b from-primary-50 via-white to-secondary-50 border-r border-primary/20 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-white/80 backdrop-blur-sm">
        {!isCollapsed && (
          <NavLink to="/admin-dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">Admin Panel</span>
              <span className="text-xs text-gray-500">ระบบจัดการหนี้มือถือ</span>
            </div>
          </NavLink>
        )}
        {isCollapsed && (
          <NavLink to="/admin-dashboard" className="flex items-center justify-center w-full group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
          </NavLink>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-8 w-8 p-0 hover:bg-primary/10 text-gray-600 hover:text-primary"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-primary/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาเมนู..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="px-3 space-y-6">
          {navigationGroups.map((group, groupIndex) => (
            <div key={group.title}>
              {!isCollapsed && (
                <div className="px-3 mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.title}
                  </h3>
                </div>
              )}
              <nav className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    end={item.to === '/admin-dashboard'}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                      }`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`h-4 w-4 shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
                        {!isCollapsed && (
                          <>
                            <span className="truncate flex-1">{item.label}</span>
                            {item.badge && (
                              <Badge 
                                variant={item.badge === 'New' ? 'default' : 'secondary'} 
                                className="text-xs px-1.5 py-0.5 h-5"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
              {groupIndex < navigationGroups.length - 1 && !isCollapsed && (
                <div className="my-4 h-px bg-primary/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="border-t border-primary/20 p-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{adminProfile?.name || 'ผู้ดูแลระบบ'}</p>
              <p className="text-xs text-muted-foreground truncate">{adminProfile?.email || 'admin@test.com'}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-primary/20 p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>เวอร์ชัน</span>
              <Badge variant="outline" className="text-xs">v1.0.0</Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs">
                  <HelpCircle className="h-3 w-3" />
                  ต้องการความช่วยเหลือ?
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    ติดต่อทีมสนับสนุน
                  </DialogTitle>
                  <DialogDescription>
                    เลือกช่องทางที่สะดวกเพื่อพูดคุยกับทีมเรา
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <a href="tel:+6600000000" className="w-full">
                    <Button className="w-full gap-2">
                      <Bell className="h-4 w-4" />
                      โทรหาเรา
                    </Button>
                  </a>
                  <a href="mailto:admin@test.com" className="w-full">
                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      ส่งอีเมล
                    </Button>
                  </a>
                </div>
              </DialogContent>
            </Dialog>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={adminLogout}
            >
              <LogOut className="h-3 w-3" />
              ออกจากระบบ
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="ความช่วยเหลือ">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" 
              title="ออกจากระบบ"
              onClick={adminLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
