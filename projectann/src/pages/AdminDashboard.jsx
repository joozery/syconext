import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  Users,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  TrendingDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';

const AdminDashboard = () => {
  const { analytics, debts, users } = useAdmin();

  const recentActivities = [
    { id: 1, type: 'user_registered', message: 'ผู้ใช้ใหม่สมัครสมาชิก', time: '2 นาทีที่แล้ว', status: 'success' },
    { id: 2, type: 'debt_purchased', message: 'มีการซื้อหนี้ iPhone 14 Pro Max', time: '5 นาทีที่แล้ว', status: 'info' },
    { id: 3, type: 'payment_received', message: 'รับชำระเงิน 15,000 บาท', time: '10 นาทีที่แล้ว', status: 'success' },
    { id: 4, type: 'user_banned', message: 'ระงับบัญชีผู้ใช้', time: '15 นาทีที่แล้ว', status: 'warning' }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - ตลาดหนี้มือถือ</title>
        <meta name="description" content="หน้าจัดการระบบสำหรับผู้ดูแลระบบ" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
            <p className="text-gray-600">ภาพรวมการดำเนินงานของ ตลาดหนี้มือถือ</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              <Activity className="w-3 h-3 mr-1" />
              ระบบทำงานปกติ
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                <p className="text-3xl font-bold text-primary">{analytics.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12% จากเดือนที่แล้ว</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">หนี้ทั้งหมด</p>
                <p className="text-3xl font-bold text-primary">{analytics.totalDebts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8% จากเดือนที่แล้ว</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">รายได้รวม</p>
                <p className="text-3xl font-bold text-primary">฿{(analytics.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+15% จากเดือนที่แล้ว</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">เงินกู้ที่ใช้งาน</p>
                <p className="text-3xl font-bold text-primary">{analytics.activeLoans}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm text-red-500">-3% จากเดือนที่แล้ว</span>
            </div>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">กิจกรรมล่าสุด</h3>
            <Badge variant="outline" className="text-primary">
              <Activity className="w-4 h-4 mr-2" />
              การแจ้งเตือน
            </Badge>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm">{activity.message}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );

};

export default AdminDashboard;
