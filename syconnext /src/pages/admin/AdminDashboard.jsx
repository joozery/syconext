
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalQuotations: 0,
    totalJobs: 0,
    totalRevenue: 0,
    activeJobs: 0,
    recentJobs: [],
    availableTechnicians: []
  });

  const chartData = [
    { name: 'ม.ค.', revenue: 4000, jobs: 24 },
    { name: 'ก.พ.', revenue: 3000, jobs: 13 },
    { name: 'มี.ค.', revenue: 5000, jobs: 38 },
    { name: 'เม.ย.', revenue: 2780, jobs: 19 },
    { name: 'พ.ค.', revenue: 1890, jobs: 48 },
    { name: 'มิ.ย.', revenue: 2390, jobs: 32 },
  ];

  useEffect(() => {
    const quotations = JSON.parse(localStorage.getItem('sy_quotations') || '[]');
    const jobs = JSON.parse(localStorage.getItem('sy_jobs') || '[]');
    const users = JSON.parse(localStorage.getItem('sy_connext_users') || '[]');

    const revenue = quotations.reduce((sum, q) => sum + (q.total || 0), 0);
    const active = jobs.filter(j => ['pending', 'in_progress'].includes(j.status)).length;
    const recentJobs = jobs.slice(-3).reverse();
    const technicians = users.filter(u => u.role === 'technician');

    const assignedTechnicians = new Set(jobs.filter(j => j.status === 'in_progress' && j.technicianId).map(j => j.technicianId));
    const availableTechnicians = technicians.filter(t => !assignedTechnicians.has(t.id)).slice(0,3);

    setStats({
      totalQuotations: quotations.length,
      totalJobs: jobs.length,
      totalRevenue: revenue,
      activeJobs: active,
      recentJobs,
      availableTechnicians,
    });
  }, []);

  const statCards = [
    {
      title: 'ใบเสนอราคา',
      value: stats.totalQuotations,
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      title: 'งานทั้งหมด',
      value: stats.totalJobs,
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
    },
    {
      title: 'งานที่ยังไม่เสร็จ',
      value: stats.activeJobs,
      icon: <Users className="w-6 h-6 text-orange-600" />,
    },
    {
      title: 'รายได้รวม',
      value: `฿${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-purple-600" />,
    }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - SY Connext Admin</title>
        <meta name="description" content="แดชบอร์ดสำหรับจัดการระบบ SY Connext" />
      </Helmet>

      <AdminLayout pageTitle="Dashboard" breadcrumb="Dashboard">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index}>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>สรุปภาพรวมรายได้และจำนวนงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="รายได้ (฿)" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="jobs" fill="#82ca9d" name="จำนวนงาน" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>งานล่าสุด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentJobs.length > 0 ? stats.recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-sm text-gray-500">{job.customerName}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {job.status}
                      </span>
                    </div>
                  )) : <p className="text-gray-500">ไม่มีงานล่าสุด</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ช่างที่ว่าง</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.availableTechnicians.length > 0 ? stats.availableTechnicians.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{tech.name}</p>
                          <p className="text-sm text-gray-500">{tech.email}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        ว่าง
                      </span>
                    </div>
                  )) : <p className="text-gray-500">ไม่มีช่างที่ว่าง</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
