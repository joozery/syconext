import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import { Input } from '@/components/ui/input';

const UsersManagementPage = () => {
  // Mock data
  const [users] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@syconnext.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-01-15 14:30:00',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'technician',
      status: 'active',
      lastLogin: '2025-01-14 09:15:00',
      createdAt: '2024-06-15'
    },
    {
      id: 3,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'accountant',
      status: 'active',
      lastLogin: '2025-01-13 16:45:00',
      createdAt: '2024-08-20'
    },
    {
      id: 4,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'customer',
      status: 'inactive',
      lastLogin: '2024-12-01 10:20:00',
      createdAt: '2024-09-10'
    }
  ]);

  const getRoleBadge = (role) => {
    const badges = {
      admin: { text: 'ผู้ดูแลระบบ', className: 'bg-red-100 text-red-800' },
      technician: { text: 'ช่างเทคนิค', className: 'bg-blue-100 text-blue-800' },
      accountant: { text: 'นักบัญชี', className: 'bg-green-100 text-green-800' },
      customer: { text: 'ลูกค้า', className: 'bg-gray-100 text-gray-800' }
    };
    return badges[role] || badges.customer;
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? { text: 'ใช้งาน', className: 'bg-green-100 text-green-800' }
      : { text: 'ระงับ', className: 'bg-red-100 text-red-800' };
  };

  return (
    <>
      <Helmet>
        <title>จัดการผู้ใช้ - SY Connext Admin</title>
      </Helmet>

      <AdminLayout pageTitle="จัดการผู้ใช้" breadcrumb="จัดการผู้ใช้">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้งานระบบ</h1>
              <p className="text-gray-600 mt-1">จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มผู้ใช้ใหม่
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ผู้ใช้ทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">กำลังใช้งาน</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ระงับการใช้งาน</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {users.filter(u => u.status === 'inactive').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ผู้ดูแลระบบ</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="ค้นหาผู้ใช้..."
                  className="pl-10"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option value="">ทุกสถานะ</option>
                <option value="active">ใช้งาน</option>
                <option value="inactive">ระงับ</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option value="">ทุกบทบาท</option>
                <option value="admin">ผู้ดูแลระบบ</option>
                <option value="technician">ช่างเทคนิค</option>
                <option value="accountant">นักบัญชี</option>
                <option value="customer">ลูกค้า</option>
              </select>
              <Button variant="outline">ค้นหา</Button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้ใช้
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    บทบาท
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เข้าสู่ระบบล่าสุด
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  const statusBadge = getStatusBadge(user.status);
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${roleBadge.className}`}>
                          {roleBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadge.className}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleString('th-TH')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UsersManagementPage;

