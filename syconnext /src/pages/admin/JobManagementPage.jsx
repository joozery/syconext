
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, MoreHorizontal, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const JobManagementPage = () => {
  const [jobs, setJobs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');

  const branches = ['สาขา 1', 'สาขา 2', 'สาขา 3', 'สาขา 4', 'สาขา 5', 'สาขา 6'];

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem('sy_jobs') || '[]');
    const storedUsers = JSON.parse(localStorage.getItem('sy_connext_users') || '[]');
    const allQuotations = JSON.parse(localStorage.getItem('sy_quotations') || '[]');

    const jobData = storedJobs.map(job => {
      const tech = storedUsers.find(u => u.id === job.technicianId);
      const qt = allQuotations.find(q => q.id === job.quotationId);
      return { ...job, technicianName: tech ? tech.name : 'ยังไม่มอบหมาย', branch: qt ? qt.branch : 'N/A' };
    });

    setJobs(jobData);
    setTechnicians(storedUsers.filter(u => u.role === 'technician'));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch = branchFilter === 'all' || job.branch === branchFilter;
      return matchesSearch && matchesBranch;
    });
  }, [jobs, searchTerm, branchFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'รอดำเนินการ', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      in_progress: { label: 'กำลังดำเนินการ', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      completed: { label: 'เสร็จสิ้น', className: 'bg-green-100 text-green-800 border-green-200' },
      cancelled: { label: 'ยกเลิก', className: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = statusConfig[status] || { label: 'ไม่ทราบ', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    return <Badge variant="outline" className={`font-medium ${config.className}`}>{config.label}</Badge>;
  };

  const handleOpenAssignDialog = (job) => {
    setSelectedJob(job);
    setSelectedTechnician(job.technicianId || '');
    setIsAssignDialogOpen(true);
  };
  
  const handleAssignJob = () => {
    if (!selectedJob || !selectedTechnician) {
      toast({ title: 'ข้อผิดพลาด', description: 'กรุณาเลือกช่าง', variant: 'destructive' });
      return;
    }
    
    const updatedJobs = jobs.map(j => 
      j.id === selectedJob.id 
      ? { ...j, technicianId: selectedTechnician, status: 'in_progress', technicianName: technicians.find(t=>t.id === selectedTechnician).name } 
      : j
    );
    
    setJobs(updatedJobs);
    localStorage.setItem('sy_jobs', JSON.stringify(updatedJobs));
    toast({ title: 'สำเร็จ', description: `มอบหมายงานให้ช่างเรียบร้อยแล้ว` });
    setIsAssignDialogOpen(false);
  };

  const handleDeleteJob = (jobId) => {
     const updatedJobs = jobs.filter(j => j.id !== jobId);
     setJobs(updatedJobs);
     localStorage.setItem('sy_jobs', JSON.stringify(updatedJobs));
     toast({ title: 'สำเร็จ', description: 'ลบงานเรียบร้อยแล้ว' });
  };

  return (
    <>
      <Helmet>
        <title>จัดการงาน - SY Connext Admin</title>
        <meta name="description" content="จัดการและมอบหมายงานทั้งหมดในระบบ" />
      </Helmet>

      <AdminLayout pageTitle="รายการข้อมูลงานซ่อม/ติดตั้ง" breadcrumb="จัดการงาน">
        <div className="space-y-4">
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                             <Input 
                                placeholder="ค้นหารหัสใบซ่อม, ชื่อลูกค้า, เบอร์โทรศัพท์"
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                             />
                        </div>
                         <Select value={branchFilter} onValueChange={setBranchFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="--สาขาทั้งหมด--" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">--สาขาทั้งหมด--</SelectItem>
                                {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> เพิ่มรายการ
                        </Button>
                    </div>
                </CardContent>
            </Card>

          <Card>
             <CardContent className="p-0">
                {filteredJobs.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-600">ไม่พบข้อมูล</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>เลขที่แจ้งซ่อม/ลูกค้า</TableHead>
                        <TableHead>รายละเอียด</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead>สาขา</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>วันที่</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">
                            <div className="font-bold text-gray-800">QT{job.id.slice(-6)}</div>
                            <div className="text-xs text-muted-foreground">{job.customerName}</div>
                          </TableCell>
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{job.type}</TableCell>
                           <TableCell>{job.branch}</TableCell>
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell>{new Date(job.createdAt).toLocaleDateString('th-TH')}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">จัดการ</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenAssignDialog(job)}>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        มอบหมายช่าง
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteJob(job.id)}>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        ลบ
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
             </CardContent>
          </Card>
        </div>
      </AdminLayout>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>มอบหมายงาน: {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">ลูกค้า: <span className="font-medium">{selectedJob?.customerName}</span></p>
            <Select onValueChange={setSelectedTechnician} value={selectedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกช่าง" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map(tech => (
                  <SelectItem key={tech.id} value={tech.id}>{tech.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleAssignJob}>ยืนยัน</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobManagementPage;
