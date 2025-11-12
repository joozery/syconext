import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Eye, Search, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { coordinatorsAPI } from '@/services/api';

const ApprovalManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    loadCoordinators();
  }, []);

  const loadCoordinators = async () => {
    setLoading(true);
    try {
      const response = await coordinatorsAPI.getCoordinators({ limit: 1000 });
      if (response.success) {
        const coordinatorsData = response.data.coordinators || response.data || [];
        setCoordinators(coordinatorsData);
      }
    } catch (error) {
      console.error('Error loading coordinators:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await coordinatorsAPI.approveCoordinator(id);
      if (response.success) {
        toast({
          title: "✅ อนุมัติสำเร็จ",
          description: "อนุมัติ Sale เรียบร้อยแล้ว",
        });
        loadCoordinators();
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถอนุมัติได้",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await coordinatorsAPI.rejectCoordinator(id);
      if (response.success) {
        toast({
          title: "✅ ปฏิเสธสำเร็จ",
          description: "ปฏิเสธ Sale เรียบร้อยแล้ว",
        });
        loadCoordinators();
      }
    } catch (error) {
      console.error('Reject error:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถปฏิเสธได้",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">อนุมัติแล้ว</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">รออนุมัติ</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">ปฏิเสธ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredCoordinators = coordinators.filter(coord => {
    const matchesSearch = coord.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coord.phone?.includes(searchTerm) ||
                         coord.idCardNumber?.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || coord.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            การอนุมัติ Sale/ผู้ประสานงาน
          </h1>
          <p className="text-slate-600">จัดการการอนุมัติและปฏิเสธการลงทะเบียน Sale</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{coordinators.length}</div>
              <p className="text-sm text-gray-600">ทั้งหมด</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {coordinators.filter(c => c.status === 'pending').length}
              </div>
              <p className="text-sm text-gray-600">รออนุมัติ</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {coordinators.filter(c => c.status === 'approved').length}
              </div>
              <p className="text-sm text-gray-600">อนุมัติแล้ว</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {coordinators.filter(c => c.status === 'rejected').length}
              </div>
              <p className="text-sm text-gray-600">ปฏิเสธ</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="ค้นหาด้วยชื่อ, เบอร์โทร, เลขบัตรประชาชน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                >
                  ทั้งหมด
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('pending')}
                >
                  รออนุมัติ
                </Button>
                <Button
                  variant={filterStatus === 'approved' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('approved')}
                >
                  อนุมัติแล้ว
                </Button>
                <Button
                  variant="outline"
                  onClick={loadCoordinators}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการลงทะเบียน Sale</CardTitle>
            <CardDescription>รายการทั้งหมด {filteredCoordinators.length} รายการ</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-slate-600">กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">ลำดับ</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">ชื่อ-นามสกุล</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">เลขบัตรประชาชน</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">เบอร์โทร</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">สถานะ</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">วันที่สมัคร</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <AnimatePresence>
                      {filteredCoordinators.map((coord, index) => (
                        <motion.tr
                          key={coord.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium">{coord.fullName}</td>
                          <td className="px-4 py-3 text-sm">{coord.idCardNumber}</td>
                          <td className="px-4 py-3 text-sm">{coord.phone}</td>
                          <td className="px-4 py-3 text-sm">{getStatusBadge(coord.status)}</td>
                          <td className="px-4 py-3 text-sm">
                            {coord.createdAt ? new Date(coord.createdAt).toLocaleDateString('th-TH') : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              {coord.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApprove(coord.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="w-4 h-4 mr-1" />
                                    อนุมัติ
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleReject(coord.id)}
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    ปฏิเสธ
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ApprovalManagement;
