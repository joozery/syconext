import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Users, UserCheck, UserX, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const AdminApprovals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  // Mock data
  const approvals = [
    {
      id: 'APP001',
      userId: 'USER001',
      userName: 'สมชาย ใจดี',
      userEmail: 'somchai@email.com',
      userPhone: '08x-xxx-xxxx',
      requestType: 'debt_access',
      debtId: 'DEBT001',
      debtModel: 'iPhone 14 Pro Max',
      requestDate: '2024-01-20',
      status: 'pending',
      reason: 'ต้องการซื้อหนี้เพื่อลงทุน'
    },
    {
      id: 'APP002',
      userId: 'USER002',
      userName: 'สมหญิง รักดี',
      userEmail: 'somying@email.com',
      userPhone: '08x-xxx-xxxx',
      requestType: 'debt_access',
      debtId: 'DEBT002',
      debtModel: 'Samsung Galaxy S23 Ultra',
      requestDate: '2024-01-19',
      status: 'pending',
      reason: 'สนใจซื้อหนี้เพื่อธุรกิจ'
    },
    {
      id: 'APP003',
      userId: 'USER003',
      userName: 'วิชัย เก่งดี',
      userEmail: 'wichai@email.com',
      userPhone: '08x-xxx-xxxx',
      requestType: 'debt_access',
      debtId: 'DEBT003',
      debtModel: 'iPhone 13',
      requestDate: '2024-01-18',
      status: 'approved',
      reason: 'ต้องการซื้อหนี้เพื่อลงทุน'
    },
    {
      id: 'APP004',
      userId: 'USER004',
      userName: 'มาลี สวยดี',
      userEmail: 'malee@email.com',
      userPhone: '08x-xxx-xxxx',
      requestType: 'debt_access',
      debtId: 'DEBT004',
      debtModel: 'Samsung Galaxy A54',
      requestDate: '2024-01-17',
      status: 'rejected',
      reason: 'ต้องการซื้อหนี้เพื่อลงทุน'
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'รอการอนุมัติ', 
          color: 'bg-yellow-100 text-yellow-800', 
          icon: Clock 
        };
      case 'approved':
        return { 
          label: 'อนุมัติแล้ว', 
          color: 'bg-green-100 text-green-800', 
          icon: CheckCircle 
        };
      case 'rejected':
        return { 
          label: 'ปฏิเสธ', 
          color: 'bg-red-100 text-red-800', 
          icon: XCircle 
        };
      default:
        return { 
          label: 'ไม่ทราบ', 
          color: 'bg-gray-100 text-gray-800', 
          icon: Clock 
        };
    }
  };

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.debtModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (approvalId) => {
    toast({
      title: "อนุมัติสำเร็จ",
      description: `คำขอ ${approvalId} ได้รับการอนุมัติแล้ว`,
    });
  };

  const handleReject = (approvalId) => {
    toast({
      title: "ปฏิเสธสำเร็จ",
      description: `คำขอ ${approvalId} ถูกปฏิเสธแล้ว`,
    });
  };

  const handleBulkApprove = () => {
    const pendingApprovals = filteredApprovals.filter(a => a.status === 'pending');
    toast({
      title: "อนุมัติทั้งหมดสำเร็จ",
      description: `อนุมัติคำขอ ${pendingApprovals.length} รายการแล้ว`,
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
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            รอการอนุมัติ
          </h1>
          <p className="text-gray-600 mt-2">จัดการคำขอเข้าถึงข้อมูลหนี้</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {filteredApprovals.length} รายการ
          </Badge>
          <Button
            onClick={handleBulkApprove}
            className="bg-green-600 hover:bg-green-700"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            อนุมัติทั้งหมด
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: 'รอการอนุมัติ', count: approvals.filter(a => a.status === 'pending').length, color: 'bg-yellow-500', icon: Clock },
          { label: 'อนุมัติแล้ว', count: approvals.filter(a => a.status === 'approved').length, color: 'bg-green-500', icon: CheckCircle },
          { label: 'ปฏิเสธ', count: approvals.filter(a => a.status === 'rejected').length, color: 'bg-red-500', icon: XCircle }
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
              placeholder="ค้นหาด้วยชื่อผู้ใช้, อีเมล, รุ่นมือถือ, หรือรหัสคำขอ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รอการอนุมัติ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="rejected">ปฏิเสธ</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Approvals Table */}
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">รหัสคำขอ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ผู้ใช้</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">หนี้ที่ขอ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">เหตุผล</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">วันที่ขอ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">สถานะ</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApprovals.map((approval, index) => {
                const statusInfo = getStatusInfo(approval.status);
                return (
                  <motion.tr
                    key={approval.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-blue-600">#{approval.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{approval.userName}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{approval.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span>{approval.userPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{approval.debtModel}</span>
                        <span className="text-xs text-gray-500">#{approval.debtId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{approval.reason}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{approval.requestDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${statusInfo.color} flex items-center gap-1 w-fit`}>
                        <statusInfo.icon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {approval.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="อนุมัติ"
                              onClick={() => handleApprove(approval.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              title="ปฏิเสธ"
                              onClick={() => handleReject(approval.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {approval.status === 'approved' && (
                          <Badge className="bg-green-100 text-green-800">
                            <UserCheck className="w-3 h-3 mr-1" />
                            อนุมัติแล้ว
                          </Badge>
                        )}
                        {approval.status === 'rejected' && (
                          <Badge className="bg-red-100 text-red-800">
                            <UserX className="w-3 h-3 mr-1" />
                            ปฏิเสธแล้ว
                          </Badge>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">ไม่พบคำขอที่ตรงกับเงื่อนไขการค้นหา</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          การดำเนินการด่วน
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleBulkApprove()}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            อนุมัติทั้งหมด
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              const pendingApprovals = filteredApprovals.filter(a => a.status === 'pending');
              toast({
                title: "ส่งอีเมลแจ้งเตือน",
                description: `ส่งอีเมลแจ้งเตือนให้ผู้ใช้ ${pendingApprovals.length} คน`,
              });
            }}
          >
            <Mail className="w-4 h-4 mr-2" />
            ส่งอีเมลแจ้งเตือน
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              toast({
                title: "ส่งรายงาน",
                description: "ส่งรายงานการอนุมัติให้ผู้จัดการ",
              });
            }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            ส่งรายงาน
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminApprovals;
