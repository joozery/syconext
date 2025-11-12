import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, RefreshCw, Download, FileText, Building2, User, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from '@/components/ui/use-toast';
import { agenciesAPI, epcAPI, coordinatorsAPI, projectsAPI } from '@/services/api';
import ProjectStatusDetail from './ProjectStatusDetail';

const ApprovalQueue = ({ initialProjectId = null }) => {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);
  const [epcCompanies, setEpcCompanies] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [projectLatestSteps, setProjectLatestSteps] = useState({}); // เก็บขั้นตอนล่าสุดของแต่ละโปรเจค
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // ดึงข้อมูลโครงการที่ลงทะเบียนจาก register-agency
      const [projectsRes, epcRes, coordinatorsRes] = await Promise.all([
        projectsAPI.getProjects({ limit: 100 }),
        epcAPI.getAllEpcCompanies(),
        coordinatorsAPI.getCoordinators({ limit: 100 })
      ]);

      console.log('Projects:', projectsRes);
      console.log('EPC:', epcRes);
      console.log('Coordinators:', coordinatorsRes);

      // ใช้ข้อมูลโครงการแทน agencies
      const projects = projectsRes.data?.projects || projectsRes.data || [];
      setAgencies(projects);
      setEpcCompanies(epcRes.data || []);
      setCoordinators(coordinatorsRes.data?.coordinators || coordinatorsRes.data || []);

      // โหลดขั้นตอนล่าสุดสำหรับแต่ละโปรเจค
      await loadLatestStepsForProjects(projects);

      toast({
        title: "✅ โหลดข้อมูลสำเร็จ",
        description: `พบโครงการที่ลงทะเบียน ${projects.length} รายการ`,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // โหลดขั้นตอนล่าสุดสำหรับแต่ละโปรเจค
  const loadLatestStepsForProjects = async (projects) => {
    const latestStepsMap = {};
    
    await Promise.all(
      projects.map(async (project) => {
        try {
          const response = await projectsAPI.getProjectSteps(project.id);
          // response.data = { success: true, data: steps }
          const steps = response.data || response || [];
          
          console.log(`🔍 Project ${project.id} response:`, response);
          console.log(`🔍 Project ${project.id} steps:`, steps);
          
          // หาขั้นตอนล่าสุดที่มีการอัพเดท (มี startDate หรือ document)
          const completedSteps = steps.filter(step => {
            const hasStartDate = step.startDate && step.startDate !== null && step.startDate !== 'NULL';
            const hasDocument = step.documentPath && step.documentPath !== null && step.documentPath !== 'NULL';
            const isCompleted = step.status === 'completed';
            
            console.log(`  Step ${step.stepNumber}:`, {
              startDate: step.startDate,
              documentPath: step.documentPath,
              status: step.status,
              hasStartDate,
              hasDocument,
              isCompleted,
              willInclude: hasStartDate || hasDocument || isCompleted
            });
            
            return hasStartDate || hasDocument || isCompleted;
          });
          
          console.log(`✅ Project ${project.id} completed steps:`, completedSteps.length);
          
          if (completedSteps.length > 0) {
            // เรียงตาม stepNumber แล้วเอาตัวสูงสุด
            const latestStep = completedSteps.sort((a, b) => b.stepNumber - a.stepNumber)[0];
            latestStepsMap[project.id] = latestStep.stepNumber;
            console.log(`📊 Project ${project.id} latest step: ${latestStep.stepNumber}`);
          } else {
            latestStepsMap[project.id] = 0; // ยังไม่มีการอัพเดท
            console.log(`⚠️ Project ${project.id} has no completed steps`);
          }
        } catch (error) {
          console.error(`Error loading steps for project ${project.id}:`, error);
          latestStepsMap[project.id] = 0;
        }
      })
    );
    
    console.log('📋 Final latestStepsMap:', latestStepsMap);
    setProjectLatestSteps(latestStepsMap);
  };

  // หา EPC ที่เกี่ยวข้อง
  const getEpcName = (projectId) => {
    // ในอนาคตจะมี relation ระหว่าง project กับ EPC
    // ตอนนี้ใช้ข้อมูล mock หรือ random
    const randomEpc = epcCompanies[Math.floor(Math.random() * epcCompanies.length)];
    return randomEpc?.epcName || 'บริษัท เอ็น เอ็น พี จำกัด';
  };

  // หาผู้ประสานงานจาก coordinatorId
  const getCoordinatorName = (coordinatorId) => {
    if (!coordinatorId) return 'ไม่ระบุ';
    const coordinator = coordinators.find(c => c.id === coordinatorId);
    return coordinator?.fullName || 'ไม่ระบุ';
  };

  // กรองและค้นหาข้อมูล
  const filteredAgencies = agencies.filter(project => {
    const matchesSearch = 
      project.agencyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.province?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAgencies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);

  // สถานะแบบ mock (ในอนาคตจะดึงจาก API)
  const getStatusBadge = (status) => {
    const statuses = {
      active: { label: '4/18', color: 'bg-green-100 text-green-700 border-green-300' },
      pending: { label: '3/18', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      completed: { label: '5/18', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    };
    const statusInfo = statuses[status] || statuses.active;
    return (
      <Badge className={`${statusInfo.color} border font-medium`}>
        {statusInfo.label}
      </Badge>
    );
  };

  // Format วันที่
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  // ดูรายละเอียดโครงการ
  const handleViewDetail = (project) => {
    navigate(`/admin/status/project/${project.id}`);
  };

  // กลับมาหน้ารายการ
  const handleBackToList = () => {
    navigate('/admin/status');
  };

  // ถ้ามี initialProjectId ให้แสดงหน้ารายละเอียด
  if (initialProjectId) {
    return (
      <ProjectStatusDetail 
        projectId={initialProjectId}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            อัพเดทสถานะ
          </h1>
          <p className="text-slate-600 mt-1">
            ติดตามสถานะการดำเนินงานหน่วยงานที่ลงทะเบียน
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            รีเฟรช
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">โครงการทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{agencies.length}</div>
            <p className="text-xs text-slate-500 mt-1">รายการ</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">กำลังดำเนินการ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {agencies.filter(p => p.status === 'active' || p.status === 'in_progress').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">รายการ</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">รอดำเนินการ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {agencies.filter(p => p.status === 'pending').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">รายการ</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">บริษัท EPC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{epcCompanies.length}</div>
            <p className="text-xs text-slate-500 mt-1">บริษัท</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="ค้นหาชื่อหน่วยงาน หรือจังหวัด..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="active">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-slate-600">กำลังโหลดข้อมูล...</span>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">ไม่พบข้อมูลหน่วยงาน</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-orange-500">
                    <TableRow>
                      <TableHead className="text-white font-semibold text-center w-16">ลำดับ</TableHead>
                      <TableHead className="text-white font-semibold">ชื่อหน่วยงาน</TableHead>
                      <TableHead className="text-white font-semibold">จังหวัด</TableHead>
                      <TableHead className="text-white font-semibold">ผู้รับเหมา (EPC)</TableHead>
                      <TableHead className="text-white font-semibold">ผู้ประสานงาน</TableHead>
                      <TableHead className="text-white font-semibold text-center">วันที่ส่งเหมา</TableHead>
                      <TableHead className="text-white font-semibold text-center">สถานะล่าสุด</TableHead>
                      <TableHead className="text-white font-semibold text-center">ปุ่ม</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((project, index) => (
                      <TableRow 
                        key={project.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="text-center font-medium">
                          {indexOfFirstItem + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{project.agencyName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{project.province || 'ไม่ระบุ'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getEpcName(project.id)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span>{getCoordinatorName(project.coordinatorId)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{formatDate(project.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const latestStep = projectLatestSteps[project.id];
                            if (latestStep === undefined) {
                              return <span className="text-gray-400">กำลังโหลด...</span>;
                            }
                            if (latestStep === 0) {
                              return <Badge variant="secondary">ยังไม่เริ่ม</Badge>;
                            }
                            return (
                              <Badge 
                                className={`${
                                  latestStep >= 13 ? 'bg-green-600' : 
                                  latestStep >= 7 ? 'bg-blue-600' : 
                                  'bg-yellow-600'
                                } text-white font-bold`}
                              >
                                {latestStep}/16
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleViewDetail(project)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            ดูรายละเอียด/อัพเดทสถานะ
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-slate-600">
                    แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, filteredAgencies.length)} จาก {filteredAgencies.length} รายการ
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      ก่อนหน้า
                    </Button>
                    
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                          className="w-10"
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      ถัดไป
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalQueue;
