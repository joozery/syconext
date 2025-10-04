import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AdminContext = createContext();

const STORAGE_KEYS = {
  token: 'projectann_admin_token',
  profile: 'projectann_admin_profile',
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [debts, setDebts] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalDebts: 89,
    totalUsers: 1247,
    totalRevenue: 2450000,
    activeLoans: 156
  });

  useEffect(() => {
    // Check for existing admin session
    const token = localStorage.getItem(STORAGE_KEYS.token);
    const profileStr = localStorage.getItem(STORAGE_KEYS.profile);
    if (token) {
      setIsAdmin(true);
      if (profileStr) {
        try { 
          setAdminProfile(JSON.parse(profileStr)); 
        } catch {
          // ignore invalid JSON
        }
      }
    }
  }, []);

  const adminLogin = (email, password) => {
    // Simple hardcoded admin credentials for demo
    if (email === 'admin@test.com' && password === 'admin123') {
      const profile = {
        id: 1,
        name: 'Admin',
        email: 'admin@test.com',
        role: 'admin',
        avatar: null
      };

      localStorage.setItem(STORAGE_KEYS.token, 'demo_token_' + Date.now());
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));

      setIsAdmin(true);
      setAdminProfile(profile);

      toast({
        title: 'เข้าสู่ระบบ Admin สำเร็จ',
        description: 'ยินดีต้อนรับสู่ระบบจัดการ ตลาดหนี้มือถือ',
      });
      return true;
    } else {
      toast({
        title: 'เข้าสู่ระบบล้มเหลว',
        description: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        variant: 'destructive',
      });
      return false;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.profile);
    setIsAdmin(false);
    setAdminProfile(null);
    toast({
      title: 'ออกจากระบบ Admin สำเร็จ',
    });
  };

  useEffect(() => {
    // Load sample data for demo
    const sampleDebts = [
      {
        id: 1,
        phoneModel: 'iPhone 14 Pro Max 256GB',
        remainingDebt: 28500,
        borrower: 'สมชาย ใจดี',
        status: 'available',
        date: new Date().toISOString()
      },
      {
        id: 2,
        phoneModel: 'Samsung Galaxy S23 Ultra 512GB',
        remainingDebt: 35000,
        borrower: 'สมหญิง รักดี',
        status: 'sold',
        date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        phoneModel: 'iPhone 13 128GB',
        remainingDebt: 18000,
        borrower: 'วิชัย เก่งมาก',
        status: 'available',
        date: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    const sampleUsers = [
      {
        id: 1,
        name: 'สมชาย ใจดี',
        email: 'somchai@email.com',
        role: 'investor',
        status: 'active',
        joinDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'สมหญิง รักดี',
        email: 'somying@email.com',
        role: 'collector',
        status: 'active',
        joinDate: '2024-01-20'
      },
      {
        id: 3,
        name: 'วิชัย เก่งมาก',
        email: 'wichai@email.com',
        role: 'investor',
        status: 'banned',
        joinDate: '2024-01-10'
      }
    ];

    setDebts(sampleDebts);
    setUsers(sampleUsers);
  }, []);

  const addDebt = (debt) => {
    const newDebt = {
      ...debt,
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'available'
    };
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebtStatus = (debtId, status) => {
    setDebts(prev => prev.map(debt => 
      debt.id === debtId ? { ...debt, status } : debt
    ));
  };

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now(),
      joinDate: new Date().toISOString(),
      status: 'active'
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUserStatus = (userId, status) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));
  };

  const value = {
    isAdminAuthenticated: isAdmin,
    adminProfile,
    adminLogin,
    adminLogout,
    debts,
    users,
    analytics,
    addDebt,
    updateDebtStatus,
    addUser,
    updateUserStatus,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
