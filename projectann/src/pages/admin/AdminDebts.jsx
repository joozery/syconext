import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import { useAdmin } from '@/contexts/AdminContext';

const AdminDebts = () => {
  const { debts, addDebt, updateDebtStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.phoneModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          debt.borrower.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || debt.status === statusFilter;
    const matchesAccess = accessFilter === 'all' || debt.accessLevel === accessFilter;
    return matchesSearch && matchesStatus && matchesAccess;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-100 text-green-800">เปิดขาย</Badge>;
      case 'sold':
        return <Badge variant="secondary">ขายแล้ว</Badge>;
      case 'tracking':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">ติดตาม</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAccessBadge = (accessLevel) => {
    switch (accessLevel) {
      case 'public':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Public</Badge>;
      case 'limited':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Limited</Badge>;
      case 'full':
        return <Badge variant="outline" className="border-red-500 text-red-700">Full</Badge>;
      default:
        return <Badge variant="secondary">{accessLevel}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>จัดการหนี้เสีย - Admin Dashboard</title>
        <meta name="description" content="จัดการหนี้เสียทั้งหมดในระบบ" />
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
            <h1 className="text-3xl font-bold text-gray-900">จัดการหนี้เสีย</h1>
            <p className="text-gray-600">จัดการหนี้เสียทั้งหมดในระบบ</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มหนี้ใหม่
          </Button>
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
                <p className="text-sm font-medium text-muted-foreground">หนี้ทั้งหมด</p>
                <p className="text-2xl font-bold text-primary">{debts.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-primary" />
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
                <p className="text-sm font-medium text-muted-foreground">เปิดขาย</p>
                <p className="text-2xl font-bold text-green-600">{debts.filter(d => d.status === 'available').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
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
                <p className="text-sm font-medium text-muted-foreground">ขายแล้ว</p>
                <p className="text-2xl font-bold text-blue-600">{debts.filter(d => d.status === 'sold').length}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm font-medium text-muted-foreground">ติดตาม</p>
                <p className="text-2xl font-bold text-yellow-600">{debts.filter(d => d.status === 'tracking').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
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
                placeholder="ค้นหาหนี้..."
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
                <option value="available">เปิดขาย</option>
                <option value="sold">ขายแล้ว</option>
                <option value="tracking">ติดตาม</option>
              </select>

              <select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">ระดับการเข้าถึงทั้งหมด</option>
                <option value="public">Public</option>
                <option value="limited">Limited</option>
                <option value="full">Full</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Debts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl border border-primary/20"
        >
          <div className="p-6 border-b border-primary/20">
            <h3 className="text-lg font-semibold">รายการหนี้ทั้งหมด ({filteredDebts.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">รุ่นมือถือ</th>
                  <th className="text-left p-4 font-medium">ยอดคงเหลือ</th>
                  <th className="text-left p-4 font-medium">ผู้กู้</th>
                  <th className="text-left p-4 font-medium">สถานะ</th>
                  <th className="text-left p-4 font-medium">ระดับการเข้าถึง</th>
                  <th className="text-left p-4 font-medium">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredDebts.map((debt, index) => (
                  <motion.tr
                    key={debt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-b border-primary/20 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="font-medium">{debt.phoneModel}</div>
                      <div className="text-sm text-muted-foreground">{debt.borrower}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-primary">฿{debt.remainingDebt?.toLocaleString() || debt.amount?.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{debt.borrower}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(debt.status)}
                    </td>
                    <td className="p-4">
                      {getAccessBadge(debt.accessLevel || 'public')}
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
                            <AlertCircle className="w-4 h-4 mr-2" />
                            เปลี่ยนสถานะ
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            ลบ
                          </DropdownMenu.DropdownMenuItem>
                        </DropdownMenu.DropdownMenuContent>
                      </DropdownMenu.DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDebts.length === 0 && (
            <div className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ไม่พบหนี้ที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default AdminDebts;
