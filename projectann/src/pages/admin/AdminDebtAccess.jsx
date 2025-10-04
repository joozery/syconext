import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Eye, EyeOff, Lock, Unlock, Settings, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const AdminDebtAccess = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accessFilter, setAccessFilter] = useState('all');

  // Mock data
  const debts = [
    {
      id: 'DEBT001',
      phoneModel: 'iPhone 14 Pro Max',
      borrowerName: 'สมชาย ใจดี',
      remainingDebt: 25000,
      accessLevel: 'public',
      viewCount: 45,
      approvedUsers: 12,
      pendingUsers: 3
    },
    {
      id: 'DEBT002',
      phoneModel: 'Samsung Galaxy S23 Ultra',
      borrowerName: 'สมหญิง รักดี',
      remainingDebt: 18000,
      accessLevel: 'restricted',
      viewCount: 23,
      approvedUsers: 8,
      pendingUsers: 5
    },
    {
      id: 'DEBT003',
      phoneModel: 'iPhone 13',
      borrowerName: 'วิชัย เก่งดี',
      remainingDebt: 12000,
      accessLevel: 'private',
      viewCount: 8,
      approvedUsers: 2,
      pendingUsers: 1
    },
    {
      id: 'DEBT004',
      phoneModel: 'Samsung Galaxy A54',
      borrowerName: 'มาลี สวยดี',
      remainingDebt: 8000,
      accessLevel: 'public',
      viewCount: 67,
      approvedUsers: 15,
      pendingUsers: 7
    }
  ];

  const getAccessLevelInfo = (level) => {
    switch (level) {
      case 'public':
        return { 
          label: 'สาธารณะ', 
          color: 'bg-green-100 text-green-800', 
          icon: Eye,
          description: 'ทุกคนสามารถดูได้'
        };
      case 'restricted':
        return { 
          label: 'จำกัด', 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: AlertTriangle,
          description: 'เฉพาะผู้ใช้ที่อนุมัติ'
        };
      case 'private':
        return { 
          label: 'ส่วนตัว', 
          color: 'bg-red-100 text-red-800', 
          icon: Lock,
          description: 'เฉพาะ Admin เท่านั้น'
        };
      default:
        return { 
          label: 'ไม่ทราบ', 
          color: 'bg-gray-100 text-gray-800', 
          icon: Shield,
          description: 'ไม่ทราบสถานะ'
        };
    }
  };

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.phoneModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccess = accessFilter === 'all' || debt.accessLevel === accessFilter;
    return matchesSearch && matchesAccess;
  });

  const handleAccessLevelChange = (debtId, newLevel) => {
    toast({
      title: "อัปเดตระดับการเข้าถึงสำเร็จ",
      description: `ระดับการเข้าถึงหนี้ ${debtId} ถูกอัปเดตเป็น ${getAccessLevelInfo(newLevel).label}`,
    });
  };

  const handleApproveUser = (debtId, userId) => {
    toast({
      title: "อนุมัติผู้ใช้สำเร็จ",
      description: `ผู้ใช้ ${userId} ได้รับการอนุมัติให้เข้าถึงหนี้ ${debtId}`,
    });
  };

  const handleRejectUser = (debtId, userId) => {
    toast({
      title: "ปฏิเสธผู้ใช้สำเร็จ",
      description: `ผู้ใช้ ${userId} ถูกปฏิเสธการเข้าถึงหนี้ ${debtId}`,
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            ระดับการเข้าถึง
          </h1>
          <p className="text-gray-600 mt-2">จัดการสิทธิ์การเข้าถึงข้อมูลหนี้</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredDebts.length} รายการ
        </Badge>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: 'สาธารณะ', count: debts.filter(d => d.accessLevel === 'public').length, color: 'bg-green-500', icon: Eye },
          { label: 'จำกัด', count: debts.filter(d => d.accessLevel === 'restricted').length, color: 'bg-yellow-500', icon: AlertTriangle },
          { label: 'ส่วนตัว', count: debts.filter(d => d.accessLevel === 'private').length, color: 'bg-red-500', icon: Lock }
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
            <Input
              placeholder="ค้นหาด้วยรุ่นมือถือ, ชื่อลูกหนี้, หรือรหัสหนี้..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">ระดับการเข้าถึงทั้งหมด</option>
              <option value="public">สาธารณะ</option>
              <option value="restricted">จำกัด</option>
              <option value="private">ส่วนตัว</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Access Control Table */}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ระดับการเข้าถึง</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">จำนวนการดู</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ผู้ใช้ที่อนุมัติ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">รอการอนุมัติ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDebts.map((debt, index) => {
                const accessInfo = getAccessLevelInfo(debt.accessLevel);
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
                      <div className="flex items-center gap-2">
                        <Badge className={`${accessInfo.color} flex items-center gap-1 w-fit`}>
                          <accessInfo.icon className="w-3 h-3" />
                          {accessInfo.label}
                        </Badge>
                        <span className="text-xs text-gray-500">{accessInfo.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{debt.viewCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-900">{debt.approvedUsers}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-900">{debt.pendingUsers}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="จัดการสิทธิ์"
                          onClick={() => handleAccessLevelChange(debt.id, 'public')}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="อนุมัติผู้ใช้"
                          onClick={() => handleApproveUser(debt.id, 'USER001')}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="ปฏิเสธผู้ใช้"
                          onClick={() => handleRejectUser(debt.id, 'USER001')}
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
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
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบข้อมูลหนี้ที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        )}
      </motion.div>

      {/* Access Level Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          การตั้งค่าระดับการเข้าถึง
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">สาธารณะ</h4>
            </div>
            <p className="text-sm text-green-700 mb-3">ทุกคนสามารถดูข้อมูลหนี้ได้</p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              ตั้งเป็นสาธารณะ
            </Button>
          </div>
          
          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-800">จำกัด</h4>
            </div>
            <p className="text-sm text-yellow-700 mb-3">เฉพาะผู้ใช้ที่อนุมัติเท่านั้น</p>
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
              ตั้งเป็นจำกัด
            </Button>
          </div>
          
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-800">ส่วนตัว</h4>
            </div>
            <p className="text-sm text-red-700 mb-3">เฉพาะ Admin เท่านั้น</p>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              ตั้งเป็นส่วนตัว
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDebtAccess;
