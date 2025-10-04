import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  Filter,
  Eye,
  FileText,
  PieChart,
  Activity,
  CreditCard,
  Users,
  ShoppingCart,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('all');

  // Mock report data
  const reportData = {
    totalDebts: 156,
    soldDebts: 89,
    pendingDebts: 45,
    totalRevenue: 2850000,
    totalProfit: 450000,
    totalLoss: 120000,
    activeCollectors: 23,
    completedCases: 67,
    pendingCases: 12
  };

  const salesData = [
    { month: 'มกราคม', amount: 850000, count: 23 },
    { month: 'กุมภาพันธ์', amount: 920000, count: 28 },
    { month: 'มีนาคม', amount: 780000, count: 21 },
    { month: 'เมษายน', amount: 1050000, count: 32 },
    { month: 'พฤษภาคม', amount: 950000, count: 29 },
    { month: 'มิถุนายน', amount: 1100000, count: 35 }
  ];

  const debtStatusData = [
    { status: 'เปิดขาย', count: 45, percentage: 28.8 },
    { status: 'ขายแล้ว', count: 89, percentage: 57.1 },
    { status: 'ติดตาม', count: 22, percentage: 14.1 }
  ];

  const collectionData = [
    { collector: 'วิชัย ทวงเก่ง', cases: 15, success: 12, revenue: 180000 },
    { collector: 'มานะ ทวงดี', cases: 12, success: 10, revenue: 150000 },
    { collector: 'ชูใจ ทวงดี', cases: 18, success: 14, revenue: 210000 },
    { collector: 'สมชาย ทวงเก่ง', cases: 10, success: 8, revenue: 120000 }
  ];

  return (
    <>
      <Helmet>
        <title>รายงาน - Admin Dashboard</title>
        <meta name="description" content="รายงานและสถิติของระบบ" />
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
            <h1 className="text-3xl font-bold text-gray-900">รายงาน</h1>
            <p className="text-gray-600">รายงานและสถิติของระบบ</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              เลือกช่วงเวลา
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              ส่งออกรายงาน
            </Button>
          </div>
        </div>

        {/* Date Range Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 border border-primary/20"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">ช่วงเวลา</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="7">7 วันล่าสุด</option>
                <option value="30">30 วันล่าสุด</option>
                <option value="90">90 วันล่าสุด</option>
                <option value="365">1 ปีล่าสุด</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">ประเภทรายงาน</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">รายงานทั้งหมด</option>
                <option value="sales">รายงานการขาย</option>
                <option value="collection">รายงานการทวงหนี้</option>
                <option value="profit">รายงานกำไร/ขาดทุน</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">หนี้ทั้งหมด</p>
                <p className="text-2xl font-bold text-primary">{reportData.totalDebts}</p>
              </div>
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12% จากเดือนที่แล้ว</span>
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
                <p className="text-sm font-medium text-muted-foreground">ยอดขายรวม</p>
                <p className="text-2xl font-bold text-green-600">฿{(reportData.totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8% จากเดือนที่แล้ว</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">กำไรสุทธิ</p>
                <p className="text-2xl font-bold text-blue-600">฿{(reportData.totalProfit / 1000).toFixed(0)}K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+15% จากเดือนที่แล้ว</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">เคสเสร็จสิ้น</p>
                <p className="text-2xl font-bold text-purple-600">{reportData.completedCases}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+22% จากเดือนที่แล้ว</span>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">รายงานการขายรายเดือน</h3>
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            
            <div className="space-y-4">
              {salesData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{data.month}</span>
                      <span className="text-sm text-muted-foreground">{data.count} รายการ</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.amount / Math.max(...salesData.map(d => d.amount))) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-primary font-medium mt-1">฿{data.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Debt Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">สถานะหนี้</h3>
              <PieChart className="w-6 h-6 text-primary" />
            </div>
            
            <div className="space-y-4">
              {debtStatusData.map((data, index) => (
                <div key={data.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      data.status === 'เปิดขาย' ? 'bg-green-500' :
                      data.status === 'ขายแล้ว' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm font-medium">{data.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{data.count}</div>
                    <div className="text-xs text-muted-foreground">{data.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Collection Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card rounded-xl border border-primary/20"
        >
          <div className="p-6 border-b border-primary/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">ประสิทธิภาพการทวงหนี้</h3>
              <Activity className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">นักทวง</th>
                  <th className="text-left p-4 font-medium">เคสทั้งหมด</th>
                  <th className="text-left p-4 font-medium">สำเร็จ</th>
                  <th className="text-left p-4 font-medium">อัตราสำเร็จ</th>
                  <th className="text-left p-4 font-medium">รายได้</th>
                </tr>
              </thead>
              <tbody>
                {collectionData.map((collector, index) => (
                  <motion.tr
                    key={collector.collector}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="border-b border-primary/20 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="font-medium">{collector.collector}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{collector.cases}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-green-600">{collector.success}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          {((collector.success / collector.cases) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-primary">฿{collector.revenue.toLocaleString()}</div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AdminReports;
