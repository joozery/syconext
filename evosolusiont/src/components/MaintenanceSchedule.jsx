import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, CalendarClock, Building2, User, MapPin, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { projectsAPI, epcAPI, coordinatorsAPI } from '@/services/api';

const MaintenanceSchedule = () => {
  const [projects, setProjects] = useState([]);
  const [epcCompanies, setEpcCompanies] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [maintenanceSteps, setMaintenanceSteps] = useState({}); // เก็บ step 13-16 ของแต่ละโปรเจค

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projectsRes, epcRes, coordinatorsRes] = await Promise.all([
        projectsAPI.getProjects({ limit: 100 }),
        epcAPI.getAllEpcCompanies(),
        coordinatorsAPI.getCoordinators({ limit: 100 })
      ]);

      console.log('Projects for maintenance:', projectsRes);

      const allProjects = projectsRes.data?.projects || projectsRes.data || [];
      
      // เพิ่มข้อมูล maintenance steps (13-16) สำหรับแต่ละโครงการ
      const maintenanceStepsData = {};
      const projectsWithMaintenanceSteps = await Promise.all(
        allProjects.map(async (project) => {
          try {
            const stepsRes = await projectsAPI.getProjectSteps(project.id);
            const steps = stepsRes.data || [];
            
            // กรองเฉพาะ step 13, 14, 15, 16 (บำรุงรักษา)
            const maintenanceStepsOnly = steps.filter(s => 
              s.stepNumber >= 13 && s.stepNumber <= 16
            );
            
            // เก็บข้อมูล maintenance steps
            maintenanceStepsData[project.id] = maintenanceStepsOnly;
            
            // หา step ล่าสุดที่ทำเสร็จ (มี startDate หรือ documentPath)
            const completedMaintenanceStepsData = maintenanceStepsOnly.filter(s => 
              s.startDate || s.documentPath || s.status === 'completed'
            );
            
            // หา stepNumber สูงสุดที่เสร็จแล้ว
            const latestMaintenanceStep = completedMaintenanceStepsData.length > 0
              ? Math.max(...completedMaintenanceStepsData.map(s => s.stepNumber))
              : 12; // ถ้ายังไม่ได้ทำเลย แสดง 12 (ผ่าน step 12 มาแล้ว)
            
            // เช็คว่าโปรเจคนี้ถึงขั้นตอนบำรุงรักษาหรือยัง (ต้องผ่าน step 12 มาแล้ว)
            const reachedMaintenance = steps.some(s => 
              s.stepNumber >= 13 && (s.startDate || s.documentPath || s.status === 'completed')
            );
            
            return {
              ...project,
              completedMaintenanceSteps: completedMaintenanceStepsData.length,
              latestMaintenanceStep,
              totalSteps: 16,
              maintenanceStatus: `${latestMaintenanceStep}/16`,
              reachedMaintenance
            };
          } catch (error) {
            console.log(`No steps found for project ${project.id}`);
            return null;
          }
        })
      );

      // กรองเฉพาะโครงการที่ถึงขั้นตอนบำรุงรักษาแล้ว
      const maintenanceProjects = projectsWithMaintenanceSteps.filter(p => 
        p !== null && p.reachedMaintenance
      );
      
      setProjects(maintenanceProjects);
      setMaintenanceSteps(maintenanceStepsData);
      setEpcCompanies(epcRes.data || []);
      setCoordinators(coordinatorsRes.data?.coordinators || coordinatorsRes.data || []);

      toast({
        title: "✅ โหลดข้อมูลสำเร็จ",
        description: `พบโครงการที่ต้องบำรุงรักษา ${maintenanceProjects.length} รายการ`,
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

  const getEpcName = (projectId) => {
    const randomEpc = epcCompanies[Math.floor(Math.random() * epcCompanies.length)];
    return randomEpc?.epcName || 'บริษัท เอ็น เอ็น พี จำกัด';
  };

  const getCoordinatorName = (coordinatorId) => {
    if (!coordinatorId) return 'ไม่ระบุ';
    const coordinator = coordinators.find(c => c.id === coordinatorId);
    return coordinator?.fullName || 'ไม่ระบุ';
  };

  // กรองและค้นหาข้อมูล
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.agencyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.province?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus !== 'all') {
      const latestStep = project.latestMaintenanceStep;
      if (filterStatus === 'step13') matchesFilter = latestStep >= 13;
      else if (filterStatus === 'step14') matchesFilter = latestStep >= 14;
      else if (filterStatus === 'step15') matchesFilter = latestStep >= 15;
      else if (filterStatus === 'step16') matchesFilter = latestStep === 16;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

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


  return (
    <div className="space-y-6">
      {/* Header with Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <CalendarClock className="w-8 h-8 text-blue-600" />
            รายการโครงการกำหนดบำรุงรักษา
          </h1>
          <p className="text-slate-600 mt-1">
            <span className="text-sm text-orange-600 font-medium">*แสดงเฉพาะโครงการที่ถึง Step 13-16 (บำรุงรักษา 4 ครั้ง)*</span>
          </p>
          <p className="text-slate-500 mt-1 text-sm">
            ติดตามความคืบหน้าการบำรุงรักษาในช่วง 6, 12, 18, และ 24 เดือน
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

      {/* Statistics Cards - Maintenance Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">โครงการทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
            <p className="text-xs text-slate-500 mt-1">ที่ถึงขั้นบำรุงรักษา</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">13/16</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {projects.filter(p => p.latestMaintenanceStep >= 13).length}
            </div>
            <p className="text-xs text-slate-500 mt-1">บำรุงรักษาครั้งที่ 1 (6 เดือน)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">14/16</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {projects.filter(p => p.latestMaintenanceStep >= 14).length}
            </div>
            <p className="text-xs text-slate-500 mt-1">บำรุงรักษาครั้งที่ 2 (12 เดือน)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">15/16</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {projects.filter(p => p.latestMaintenanceStep >= 15).length}
            </div>
            <p className="text-xs text-slate-500 mt-1">บำรุงรักษาครั้งที่ 3 (18 เดือน)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">16/16</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {projects.filter(p => p.latestMaintenanceStep === 16).length}
            </div>
            <p className="text-xs text-slate-500 mt-1">บำรุงรักษาครั้งที่ 4 (24 เดือน) - เสร็จสมบูรณ์</p>
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
                  <SelectValue placeholder="กรองตามสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="step13">13/16 ↑</SelectItem>
                  <SelectItem value="step14">14/16 ↑</SelectItem>
                  <SelectItem value="step15">15/16 ↑</SelectItem>
                  <SelectItem value="step16">16/16 (เสร็จสมบูรณ์)</SelectItem>
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
              <p className="text-slate-500">ไม่พบโครงการในขั้นตอนบำรุงรักษา</p>
              <p className="text-sm text-slate-400 mt-2">
                {projects.length === 0 
                  ? 'ยังไม่มีโครงการที่ถึงขั้นตอนบำรุงรักษา (Step 13-16)'
                  : 'ลองเปลี่ยนตัวกรองหรือคำค้นหา'
                }
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-orange-500">
                    <TableRow>
                      <TableHead className="text-white font-semibold text-center w-16">ลำดับ</TableHead>
                      <TableHead className="text-white font-semibold">วิคควบรยาน</TableHead>
                      <TableHead className="text-white font-semibold">จังหวัด</TableHead>
                      <TableHead className="text-white font-semibold">ผู้รับเหมา (EPC)</TableHead>
                      <TableHead className="text-white font-semibold">ผู้ประสานงาน</TableHead>
                      <TableHead className="text-white font-semibold text-center">ครบกำหนด</TableHead>
                      <TableHead className="text-white font-semibold text-center">สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((project, index) => (
                      <TableRow 
                        key={project.id}
                        className={`${index % 2 === 0 ? 'bg-orange-50' : 'bg-white'} hover:bg-orange-100 transition-colors`}
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
                          {formatDate(project.createdAt)}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const latestStep = project.latestMaintenanceStep;
                            let bgColor = '';
                            let textColor = '';
                            
                            if (latestStep === 12) {
                              bgColor = 'bg-gray-100';
                              textColor = 'text-gray-700';
                            } else if (latestStep === 13) {
                              bgColor = 'bg-orange-100';
                              textColor = 'text-orange-700';
                            } else if (latestStep === 14) {
                              bgColor = 'bg-yellow-100';
                              textColor = 'text-yellow-700';
                            } else if (latestStep === 15) {
                              bgColor = 'bg-purple-100';
                              textColor = 'text-purple-700';
                            } else if (latestStep === 16) {
                              bgColor = 'bg-green-100';
                              textColor = 'text-green-700';
                            }
                            
                            return (
                              <Badge className={`${bgColor} ${textColor} border font-bold`}>
                                {project.maintenanceStatus}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Bottom Note */}
              <div className="mt-4 text-center">
                <p className="text-sm text-orange-600 font-medium">
                  *หน้านี้แสดงเฉพาะโครงการที่ถึงขั้นตอนบำรุงรักษา (Step 13-16)*
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Step 13: บำรุงรักษาครั้งที่ 1 (6 เดือน) | Step 14: ครั้งที่ 2 (12 เดือน) | Step 15: ครั้งที่ 3 (18 เดือน) | Step 16: ครั้งที่ 4 (24 เดือน)
                </p>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-slate-600">
                    แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, filteredProjects.length)} จาก {filteredProjects.length} รายการ
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
                      {[...Array(Math.min(totalPages, 4))].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
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

export default MaintenanceSchedule;
