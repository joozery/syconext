
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Briefcase, UserPlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const TechnicianPage = () => {
  const [technicians, setTechnicians] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTechData, setNewTechData] = useState({ name: '', email: '', password: '' });
  const { toast } = useToast();

  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('sy_connext_users') || '[]');
    const allJobs = JSON.parse(localStorage.getItem('sy_jobs') || '[]');
    
    setTechnicians(allUsers.filter(u => u.role === 'technician'));
    setJobs(allJobs);
  }, []);

  const getTechJobCount = (techId) => {
    return jobs.filter(job => job.technicianId === techId && job.status === 'in_progress').length;
  };
  
  const handleAddTechnician = () => {
    if (!newTechData.name || !newTechData.email || !newTechData.password) {
        toast({ title: 'ข้อผิดพลาด', description: 'กรุณากรอกข้อมูลให้ครบ', variant: 'destructive'});
        return;
    }

    const allUsers = JSON.parse(localStorage.getItem('sy_connext_users') || '[]');
    
    if (allUsers.find(u => u.email === newTechData.email)) {
        toast({ title: 'ข้อผิดพลาด', description: 'อีเมลนี้ถูกใช้งานแล้ว', variant: 'destructive'});
        return;
    }
    
    const newTechnician = {
        id: Date.now().toString(),
        ...newTechData,
        role: 'technician',
        createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...allUsers, newTechnician];
    localStorage.setItem('sy_connext_users', JSON.stringify(updatedUsers));
    setTechnicians(updatedUsers.filter(u => u.role === 'technician'));

    toast({ title: 'สำเร็จ!', description: 'เพิ่มช่างใหม่เรียบร้อยแล้ว'});
    setIsAddDialogOpen(false);
    setNewTechData({ name: '', email: '', password: '' });
  };
  
  const handleDeleteTechnician = (techId) => {
    const allUsers = JSON.parse(localStorage.getItem('sy_connext_users') || '[]');
    const updatedUsers = allUsers.filter(u => u.id !== techId);
    
    localStorage.setItem('sy_connext_users', JSON.stringify(updatedUsers));
    setTechnicians(updatedUsers.filter(u => u.role === 'technician'));
    
    toast({ title: 'สำเร็จ', description: 'ลบช่างเรียบร้อยแล้ว'});
  };

  return (
    <>
      <Helmet>
        <title>จัดการช่าง - SY Connext Admin</title>
        <meta name="description" content="จัดการช่างทั้งหมดในระบบ" />
      </Helmet>

      <AdminLayout pageTitle="จัดการช่าง" breadcrumb="จัดการช่าง">
        <div className="space-y-4">
          <div className="flex justify-end items-center">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" /> เพิ่มช่าง
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มช่างใหม่</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                    <Input id="name" value={newTechData.name} onChange={(e) => setNewTechData({...newTechData, name: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="email">อีเมล</Label>
                    <Input id="email" type="email" value={newTechData.email} onChange={(e) => setNewTechData({...newTechData, email: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="password">รหัสผ่าน</Label>
                    <Input id="password" type="password" value={newTechData.password} onChange={(e) => setNewTechData({...newTechData, password: e.target.value})} />
                  </div>
                </div>
                 <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>ยกเลิก</Button>
                    <Button onClick={handleAddTechnician}>ยืนยัน</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
                {technicians.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">ยังไม่มีช่างในระบบ</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อช่าง</TableHead>
                        <TableHead>อีเมล</TableHead>
                        <TableHead>งานที่รับผิดชอบ</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead className="text-right">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {technicians.map((tech) => {
                        const jobCount = getTechJobCount(tech.id);
                        const isBusy = jobCount > 0;
                        return (
                          <TableRow key={tech.id}>
                            <TableCell className="font-medium">{tech.name}</TableCell>
                            <TableCell>{tech.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-gray-500"/>
                                {jobCount} งาน
                              </div>
                            </TableCell>
                            <TableCell>
                              {isBusy ? (
                                 <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">ไม่ว่าง</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">ว่าง</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteTechnician(tech.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default TechnicianPage;
