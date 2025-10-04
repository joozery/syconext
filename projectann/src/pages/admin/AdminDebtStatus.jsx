import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Filter, Search, RefreshCw, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const AdminDebtStatus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data
  const debts = [
    {
      id: 'DEBT001',
      phoneModel: 'iPhone 14 Pro Max',
      borrowerName: 'สมชาย ใจดี',
      remainingDebt: 25000,
      overdueInstallments: 3,
      totalInstallments: 12,
      status: 'overdue',
      lastPayment: '2024-01-15',
      nextDue: '2024-02-15'
    },
    {
      id: 'DEBT002',
      phoneModel: 'Samsung Galaxy S23 Ultra',
      borrowerName: 'สมหญิง รักดี',
      remainingDebt: 18000,
      overdueInstallments: 1,
      totalInstallments: 10,
      status: 'warning',
      lastPayment: '2024-01-20',
      nextDue: '2024-02-20'
    },
    {
      id: 'DEBT003',
      phoneModel: 'iPhone 13',
      borrowerName: 'วิชัย เก่งดี',
      remainingDebt: 12000,
      overdueInstallments: 0,
      totalInstallments: 8,
      status: 'current',
      lastPayment: '2024-01-25',
      nextDue: '2024-02-25'
    },
    {
      id: 'DEBT004',
      phoneModel: 'Samsung Galaxy A54',
      borrowerName: 'มาลี สวยดี',
      remainingDebt: 8000,
      overdueInstallments: 5,
      totalInstallments: 6,
      status: 'critical',
      lastPayment: '2023-12-10',
      nextDue: '2024-01-10'
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'current':
        return { label: 'ปกติ', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'warning':
        return { label: 'เตือน', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
      case 'overdue':
        return { label: 'ค้างชำระ', color: 'bg-orange-100 text-orange-800', icon: Clock };
      case 'critical':
        return { label: 'วิกฤต', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: 'ไม่ทราบ', color: 'bg-gray-100 text-gray-800', icon: Activity };
    }
  };

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.phoneModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || debt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "อัปเดตข้อมูลแล้ว",
      description: "ข้อมูลสถานะหนี้ได้รับการอัปเดตแล้ว",
    });
  };

  const handleStatusChange = (debtId, newStatus) => {
    toast({
      title: "อัปเดตสถานะสำเร็จ",
      description: `สถานะหนี้ ${debtId} ถูกอัปเดตเป็น ${getStatusInfo(newStatus).label}`,
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            สถานะหนี้
          </h1>
          <p className="text-gray-600 mt-2">ติดตามและจัดการสถานะหนี้ทั้งหมด</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {filteredDebts.length} รายการ
          </Badge>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            รีเฟรช
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'หนี้ปกติ', count: debts.filter(d => d.status === 'current').length, color: 'bg-green-500', icon: CheckCircle },
          { label: 'หนี้เตือน', count: debts.filter(d => d.status === 'warning').length, color: 'bg-yellow-500', icon: AlertTriangle },
          { label: 'หนี้ค้าง', count: debts.filter(d => d.status === 'overdue').length, color: 'bg-orange-500', icon: Clock },
          { label: 'หนี้วิกฤต', count: debts.filter(d => d.status === 'critical').length, color: 'bg-red-500', icon: XCircle }
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาด้วยรุ่นมือถือ, ชื่อลูกหนี้, หรือรหัสหนี้..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="current">ปกติ</option>
              <option value="warning">เตือน</option>
              <option value="overdue">ค้างชำระ</option>
              <option value="critical">วิกฤต</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              กรอง
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Debt Status Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">รหัสหนี้</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">รุ่นมือถือ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ลูกหนี้</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ยอดคงเหลือ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">งวดค้าง</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">สถานะ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">การชำระล่าสุด</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ครบกำหนด</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDebts.map((debt, index) => {
                const statusInfo = getStatusInfo(debt.status);
                return (
                  <motion.tr
                    key={debt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-blue-600">#{debt.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{debt.phoneModel}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{debt.borrowerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">฿{debt.remainingDebt.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{debt.overdueInstallments}</span>
                        <span className="text-xs text-gray-500">/ {debt.totalInstallments}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${statusInfo.color} flex items-center gap-1 w-fit`}>
                        <statusInfo.icon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{debt.lastPayment}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{debt.nextDue}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="ดูรายละเอียด">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="แก้ไข">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="ลบ" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredDebts.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบข้อมูลหนี้ที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDebtStatus;
