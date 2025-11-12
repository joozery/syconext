import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const ReportPage = () => {
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const allProjects = JSON.parse(localStorage.getItem('eep_projects') || '[]');
    setProjects(allProjects);
  }, []);

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === filterStatus);

  const handleExportPDF = () => {
    toast({
      title: "🚧 ฟีเจอร์นี้ยังไม่พร้อมใช้งาน",
      description: "คุณสามารถขอเพิ่มฟีเจอร์นี้ในข้อความถัดไปได้! 🚀",
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'รอดำเนินการ',
      in_progress: 'กำลังดำเนินการ',
      completed: 'เสร็จสิ้น',
    };
    return labels[status] || status;
  };

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>รายงานโครงการ</span>
            </div>
            <Button
              onClick={handleExportPDF}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลด PDF
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-sm text-slate-600 mb-1">โครงการทั้งหมด</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
              <p className="text-sm text-slate-600 mb-1">รอดำเนินการ</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <p className="text-sm text-slate-600 mb-1">กำลังดำเนินการ</p>
              <p className="text-3xl font-bold text-purple-600">{stats.inProgress}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <p className="text-sm text-slate-600 mb-1">เสร็จสิ้น</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <Filter className="w-5 h-5 text-slate-400" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="pending">รอดำเนินการ</SelectItem>
                <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
                <SelectItem value="completed">เสร็จสิ้น</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">รหัส</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">ชื่อสถานที่</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">ที่อยู่</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">ผู้รับเหมา</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">สถานะ</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">วันที่สร้าง</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 text-sm text-slate-600">{project.siteCode}</td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">{project.siteName}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{project.address}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{project.contractor}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-700' :
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(project.createdAt).toLocaleDateString('th-TH')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500">ไม่พบข้อมูลโครงการ</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;