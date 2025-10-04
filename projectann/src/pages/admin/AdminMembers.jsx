import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  Shield,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import { useAdmin } from '@/contexts/AdminContext';

const AdminMembers = () => {
  const { users, addUser, updateUserStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'investor':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">นักลงทุน</Badge>;
      case 'collector':
        return <Badge variant="default" className="bg-green-100 text-green-800">นักทวง</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">ใช้งาน</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">รอการอนุมัติ</Badge>;
      case 'banned':
        return <Badge variant="destructive">ระงับ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>จัดการสมาชิก - Admin Dashboard</title>
        <meta name="description" content="จัดการสมาชิกทั้งหมดในระบบ" />
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
            <h1 className="text-3xl font-bold text-gray-900">จัดการสมาชิก</h1>
            <p className="text-gray-600">จัดการสมาชิกทั้งหมดในระบบ</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <UserCheck className="w-4 h-4 mr-2" />
              อนุมัติทั้งหมด
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Users className="w-4 h-4 mr-2" />
              เพิ่มสมาชิก
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
                <p className="text-sm font-medium text-muted-foreground">สมาชิกทั้งหมด</p>
                <p className="text-2xl font-bold text-primary">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
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
                <p className="text-sm font-medium text-muted-foreground">นักลงทุน</p>
                <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'investor').length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm font-medium text-muted-foreground">นักทวง</p>
                <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'collector').length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
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
                <p className="text-sm font-medium text-muted-foreground">รอการอนุมัติ</p>
                <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'pending').length}</p>
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
                placeholder="ค้นหาสมาชิก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">บทบาททั้งหมด</option>
                <option value="investor">นักลงทุน</option>
                <option value="collector">นักทวง</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="active">ใช้งาน</option>
                <option value="pending">รอการอนุมัติ</option>
                <option value="banned">ระงับ</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Members Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl border border-primary/20"
        >
          <div className="p-6 border-b border-primary/20">
            <h3 className="text-lg font-semibold">รายการสมาชิกทั้งหมด ({filteredUsers.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">ชื่อ</th>
                  <th className="text-left p-4 font-medium">อีเมล</th>
                  <th className="text-left p-4 font-medium">บทบาท</th>
                  <th className="text-left p-4 font-medium">สถานะ</th>
                  <th className="text-left p-4 font-medium">วันที่สมัคร</th>
                  <th className="text-left p-4 font-medium">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-b border-primary/20 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user.joinDate}</span>
                      </div>
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
                            อนุมัติ
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem className="text-red-600">
                            <UserX className="w-4 h-4 mr-2" />
                            ระงับบัญชี
                          </DropdownMenu.DropdownMenuItem>
                        </DropdownMenu.DropdownMenuContent>
                      </DropdownMenu.DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ไม่พบสมาชิกที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default AdminMembers;
