import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as DropdownMenu from '@/components/ui/dropdown-menu';

const AdminCollection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock collection cases data
  const collectionCases = [
    {
      id: 1,
      debtId: 'D001',
      phoneModel: 'iPhone 14 Pro Max',
      borrowerName: 'สมชาย ใจดี',
      borrowerPhone: '081-234-5678',
      borrowerAddress: '123 ถนนสุขุมวิท กรุงเทพฯ',
      collectorName: 'วิชัย ทวงเก่ง',
      collectorEmail: 'wichai@email.com',
      amount: 28500,
      status: 'in_progress',
      startDate: '2024-01-15',
      lastUpdate: '2024-01-20',
      progress: 60,
      conditions: {
        selfManage: true,
        assetReturn: false,
        installmentPercent: 15
      }
    },
    {
      id: 2,
      debtId: 'D002',
      phoneModel: 'Samsung Galaxy S23',
      borrowerName: 'สมหญิง รักดี',
      borrowerPhone: '082-345-6789',
      borrowerAddress: '456 ถนนรัชดาภิเษก กรุงเทพฯ',
      collectorName: 'มานะ ทวงดี',
      collectorEmail: 'mana@email.com',
      amount: 35000,
      status: 'completed',
      startDate: '2024-01-10',
      lastUpdate: '2024-01-25',
      progress: 100,
      conditions: {
        selfManage: false,
        assetReturn: true,
        installmentPercent: 20
      }
    },
    {
      id: 3,
      debtId: 'D003',
      phoneModel: 'iPhone 13',
      borrowerName: 'วิชัย เก่งมาก',
      borrowerPhone: '083-456-7890',
      borrowerAddress: '789 ถนนพหลโยธิน กรุงเทพฯ',
      collectorName: 'ชูใจ ทวงดี',
      collectorEmail: 'choojai@email.com',
      amount: 18000,
      status: 'pending_approval',
      startDate: '2024-01-18',
      lastUpdate: '2024-01-22',
      progress: 0,
      conditions: {
        selfManage: true,
        assetReturn: false,
        installmentPercent: 10
      }
    }
  ];

  const filteredCases = collectionCases.filter(case_ => {
    const matchesSearch = case_.phoneModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          case_.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          case_.collectorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || case_.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">รอการอนุมัติ</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">กำลังดำเนินการ</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">เสร็จสิ้น</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">ยกเลิก</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>งานทวงหนี้ - Admin Dashboard</title>
        <meta name="description" content="จัดการเคสติดตามหนี้ทั้งหมด" />
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
            <h1 className="text-3xl font-bold text-gray-900">งานทวงหนี้</h1>
            <p className="text-gray-600">จัดการเคสติดตามหนี้ทั้งหมด</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              เงื่อนไขทวงหนี้
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <CheckCircle className="w-4 h-4 mr-2" />
              อนุมัติเคส
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">เคสทั้งหมด</p>
                <p className="text-2xl font-bold text-primary">{collectionCases.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
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
                <p className="text-sm font-medium text-muted-foreground">รอการอนุมัติ</p>
                <p className="text-2xl font-bold text-yellow-600">{collectionCases.filter(c => c.status === 'pending_approval').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
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
                <p className="text-sm font-medium text-muted-foreground">กำลังดำเนินการ</p>
                <p className="text-2xl font-bold text-blue-600">{collectionCases.filter(c => c.status === 'in_progress').length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm font-medium text-muted-foreground">เสร็จสิ้น</p>
                <p className="text-2xl font-bold text-green-600">{collectionCases.filter(c => c.status === 'completed').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 border border-primary/20"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="ค้นหาเคสติดตาม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending_approval">รอการอนุมัติ</option>
                <option value="in_progress">กำลังดำเนินการ</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Collection Cases Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl border border-primary/20"
        >
          <div className="p-6 border-b border-primary/20">
            <h3 className="text-lg font-semibold">เคสติดตามทั้งหมด ({filteredCases.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">รุ่นมือถือ</th>
                  <th className="text-left p-4 font-medium">ผู้กู้</th>
                  <th className="text-left p-4 font-medium">นักทวง</th>
                  <th className="text-left p-4 font-medium">จำนวนเงิน</th>
                  <th className="text-left p-4 font-medium">ความคืบหน้า</th>
                  <th className="text-left p-4 font-medium">สถานะ</th>
                  <th className="text-left p-4 font-medium">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((case_, index) => (
                  <motion.tr
                    key={case_.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-b border-primary/20 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="font-medium">{case_.phoneModel}</div>
                      <div className="text-sm text-muted-foreground">ID: {case_.debtId}</div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{case_.borrowerName}</div>
                        <div className="text-sm text-muted-foreground">{case_.borrowerPhone}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {case_.borrowerAddress}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{case_.collectorName}</div>
                        <div className="text-sm text-muted-foreground">{case_.collectorEmail}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-primary">฿{case_.amount.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${case_.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{case_.progress}%</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(case_.status)}
                    </td>
                    <td className="p-4">
                      <DropdownMenu.DropdownMenu>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenu.DropdownMenuTrigger>
                        <DropdownMenu.DropdownMenuContent>
                          <DropdownMenu.DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            ดูรายละเอียด
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            แก้ไข
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            อนุมัติเคส
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            ดูเอกสาร
                          </DropdownMenu.DropdownMenuItem>
                        </DropdownMenu.DropdownMenuContent>
                      </DropdownMenu.DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCases.length === 0 && (
            <div className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ไม่พบเคสติดตามที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default AdminCollection;
