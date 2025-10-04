import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
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
  MessageCircle,
  AlertCircle,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as DropdownMenu from '@/components/ui/dropdown-menu';

const AdminSales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock sales data
  const sales = [
    {
      id: 1,
      debtId: 'D001',
      phoneModel: 'iPhone 14 Pro Max',
      buyerName: 'สมชาย ใจดี',
      buyerEmail: 'somchai@email.com',
      buyerPhone: '081-234-5678',
      amount: 28500,
      status: 'pending',
      date: '2024-01-15',
      lineNotification: true,
      paymentStatus: 'waiting'
    },
    {
      id: 2,
      debtId: 'D002',
      phoneModel: 'Samsung Galaxy S23',
      buyerName: 'สมหญิง รักดี',
      buyerEmail: 'somying@email.com',
      buyerPhone: '082-345-6789',
      amount: 35000,
      status: 'confirmed',
      date: '2024-01-14',
      lineNotification: true,
      paymentStatus: 'paid'
    },
    {
      id: 3,
      debtId: 'D003',
      phoneModel: 'iPhone 13',
      buyerName: 'วิชัย เก่งมาก',
      buyerEmail: 'wichai@email.com',
      buyerPhone: '083-456-7890',
      amount: 18000,
      status: 'completed',
      date: '2024-01-13',
      lineNotification: true,
      paymentStatus: 'paid'
    }
  ];

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.phoneModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sale.buyerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">รอดำเนินการ</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">ยืนยันแล้ว</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">เสร็จสิ้น</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">ยกเลิก</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'waiting':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">รอชำระ</Badge>;
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">ชำระแล้ว</Badge>;
      case 'failed':
        return <Badge variant="destructive">ชำระไม่สำเร็จ</Badge>;
      default:
        return <Badge variant="secondary">{paymentStatus}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>การขายหนี้ - Admin Dashboard</title>
        <meta name="description" content="จัดการการขายหนี้ทั้งหมด" />
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
            <h1 className="text-3xl font-bold text-gray-900">การขายหนี้</h1>
            <p className="text-gray-600">จัดการการขายหนี้ทั้งหมดในระบบ</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              LINE Admin
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <TrendingUp className="w-4 h-4 mr-2" />
              รายงานการขาย
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
                <p className="text-sm font-medium text-muted-foreground">การขายทั้งหมด</p>
                <p className="text-2xl font-bold text-primary">{sales.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
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
                <p className="text-sm font-medium text-muted-foreground">รอดำเนินการ</p>
                <p className="text-2xl font-bold text-yellow-600">{sales.filter(s => s.status === 'pending').length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">ยืนยันแล้ว</p>
                <p className="text-2xl font-bold text-blue-600">{sales.filter(s => s.status === 'confirmed').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
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
                <p className="text-2xl font-bold text-green-600">฿{sales.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
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
                placeholder="ค้นหาการขาย..."
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
                <option value="pending">รอดำเนินการ</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Sales Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl border border-primary/20"
        >
          <div className="p-6 border-b border-primary/20">
            <h3 className="text-lg font-semibold">รายการขายทั้งหมด ({filteredSales.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">รุ่นมือถือ</th>
                  <th className="text-left p-4 font-medium">ผู้ซื้อ</th>
                  <th className="text-left p-4 font-medium">จำนวนเงิน</th>
                  <th className="text-left p-4 font-medium">สถานะ</th>
                  <th className="text-left p-4 font-medium">การชำระเงิน</th>
                  <th className="text-left p-4 font-medium">LINE</th>
                  <th className="text-left p-4 font-medium">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale, index) => (
                  <motion.tr
                    key={sale.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-b border-primary/20 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="font-medium">{sale.phoneModel}</div>
                      <div className="text-sm text-muted-foreground">ID: {sale.debtId}</div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{sale.buyerName}</div>
                        <div className="text-sm text-muted-foreground">{sale.buyerEmail}</div>
                        <div className="text-sm text-muted-foreground">{sale.buyerPhone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-primary">฿{sale.amount.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(sale.status)}
                    </td>
                    <td className="p-4">
                      {getPaymentBadge(sale.paymentStatus)}
                    </td>
                    <td className="p-4">
                      {sale.lineNotification ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          ส่งแล้ว
                        </Badge>
                      ) : (
                        <Badge variant="outline">ยังไม่ส่ง</Badge>
                      )}
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
                            <MessageCircle className="w-4 h-4 mr-2" />
                            ส่ง LINE
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            ยืนยันการขาย
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem>
                            <CreditCard className="w-4 h-4 mr-2" />
                            ยืนยันการชำระ
                          </DropdownMenu.DropdownMenuItem>
                        </DropdownMenu.DropdownMenuContent>
                      </DropdownMenu.DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ไม่พบการขายที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default AdminSales;
