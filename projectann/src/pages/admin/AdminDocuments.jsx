import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Calendar,
  User,
  Link,
  Folder,
  File,
  Image,
  Archive,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as DropdownMenu from '@/components/ui/dropdown-menu';

const AdminDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');

  // Mock documents data
  const documents = [
    {
      id: 1,
      name: 'สัญญาเงินกู้ iPhone 14 Pro Max',
      type: 'contract',
      contractId: 'C001',
      debtId: 'D001',
      borrowerName: 'สมชาย ใจดี',
      fileSize: '2.5 MB',
      uploadDate: '2024-01-15',
      uploadBy: 'Admin User',
      status: 'active',
      downloadCount: 5,
      fileType: 'pdf'
    },
    {
      id: 2,
      name: 'สำเนาบัตรประชาชน',
      type: 'id_card',
      contractId: 'C001',
      debtId: 'D001',
      borrowerName: 'สมชาย ใจดี',
      fileSize: '1.2 MB',
      uploadDate: '2024-01-15',
      uploadBy: 'Admin User',
      status: 'active',
      downloadCount: 3,
      fileType: 'jpg'
    },
    {
      id: 3,
      name: 'เอกสารการชำระเงิน',
      type: 'payment',
      contractId: 'C002',
      debtId: 'D002',
      borrowerName: 'สมหญิง รักดี',
      fileSize: '800 KB',
      uploadDate: '2024-01-14',
      uploadBy: 'Admin User',
      status: 'active',
      downloadCount: 2,
      fileType: 'pdf'
    },
    {
      id: 4,
      name: 'รายงานการติดตามหนี้',
      type: 'report',
      contractId: 'C003',
      debtId: 'D003',
      borrowerName: 'วิชัย เก่งมาก',
      fileSize: '1.8 MB',
      uploadDate: '2024-01-13',
      uploadBy: 'Admin User',
      status: 'archived',
      downloadCount: 1,
      fileType: 'pdf'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.contractId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesContract = contractFilter === 'all' || doc.contractId === contractFilter;
    return matchesSearch && matchesType && matchesContract;
  });

  const getTypeBadge = (type) => {
    switch (type) {
      case 'contract':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">สัญญา</Badge>;
      case 'id_card':
        return <Badge variant="default" className="bg-green-100 text-green-800">บัตรประชาชน</Badge>;
      case 'payment':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">การชำระเงิน</Badge>;
      case 'report':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">รายงาน</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">ใช้งาน</Badge>;
      case 'archived':
        return <Badge variant="outline" className="border-gray-500 text-gray-700">เก็บถาวร</Badge>;
      case 'deleted':
        return <Badge variant="destructive">ลบแล้ว</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'doc':
      case 'docx':
        return <File className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>ระบบเอกสาร - Admin Dashboard</title>
        <meta name="description" content="จัดการเอกสารทั้งหมดในระบบ" />
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
            <h1 className="text-3xl font-bold text-gray-900">ระบบเอกสาร</h1>
            <p className="text-gray-600">จัดการเอกสารทั้งหมดในระบบ</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Folder className="w-4 h-4 mr-2" />
              จัดกลุ่มเอกสาร
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" />
              อัพโหลดเอกสาร
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
                <p className="text-sm font-medium text-muted-foreground">เอกสารทั้งหมด</p>
                <p className="text-2xl font-bold text-primary">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
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
                <p className="text-sm font-medium text-muted-foreground">สัญญา</p>
                <p className="text-2xl font-bold text-blue-600">{documents.filter(d => d.type === 'contract').length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
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
                <p className="text-sm font-medium text-muted-foreground">บัตรประชาชน</p>
                <p className="text-2xl font-bold text-green-600">{documents.filter(d => d.type === 'id_card').length}</p>
              </div>
              <Image className="w-8 h-8 text-green-600" />
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
                <p className="text-sm font-medium text-muted-foreground">ดาวน์โหลดรวม</p>
                <p className="text-2xl font-bold text-purple-600">{documents.reduce((sum, d) => sum + d.downloadCount, 0)}</p>
              </div>
              <Download className="w-8 h-8 text-purple-600" />
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
                placeholder="ค้นหาเอกสาร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">ประเภททั้งหมด</option>
                <option value="contract">สัญญา</option>
                <option value="id_card">บัตรประชาชน</option>
                <option value="payment">การชำระเงิน</option>
                <option value="report">รายงาน</option>
              </select>

              <select
                value={contractFilter}
                onChange={(e) => setContractFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">สัญญาทั้งหมด</option>
                <option value="C001">C001</option>
                <option value="C002">C002</option>
                <option value="C003">C003</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Documents Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl border border-primary/20"
        >
          <div className="p-6 border-b border-primary/20">
            <h3 className="text-lg font-semibold">เอกสารทั้งหมด ({filteredDocuments.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">ชื่อเอกสาร</th>
                  <th className="text-left p-4 font-medium">ประเภท</th>
                  <th className="text-left p-4 font-medium">สัญญา</th>
                  <th className="text-left p-4 font-medium">ผู้กู้</th>
                  <th className="text-left p-4 font-medium">ขนาดไฟล์</th>
                  <th className="text-left p-4 font-medium">สถานะ</th>
                  <th className="text-left p-4 font-medium">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc, index) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="border-b border-primary/20 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.fileType)}
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {doc.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getTypeBadge(doc.type)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{doc.contractId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{doc.borrowerName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{doc.fileSize}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(doc.status)}
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
                            ดูเอกสาร
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            ดาวน์โหลด
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            แก้ไข
                          </DropdownMenu.DropdownMenuItem>
                          <DropdownMenu.DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            เก็บถาวร
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

          {filteredDocuments.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ไม่พบเอกสารที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default AdminDocuments;
