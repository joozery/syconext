import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, Calendar, FileText, Search, Filter, Download, Eye, Edit, Trash2, Plus, User, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { epcAPI, projectsAPI, coordinatorsAPI } from '@/services/api';

const OrganizationDetails = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [epcCompanies, setEpcCompanies] = useState([]);
  const [governmentAgencies, setGovernmentAgencies] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for organizations
  const organizations = [
    // EPC Companies
    {
      id: 1,
      name: 'บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด',
      type: 'EPC',
      code: 'EPC001',
      ministry: 'กระทรวงพลังงาน',
      affiliation: 'สมาคมพลังงานทดแทนไทย',
      address: '285 ซอยรามอินทรา65 แขวงท่าแร้ง เขตบางเขน กรุงเทพมหานคร 10230',
      contact: '092-647-9694',
      email: 'evolution.entech@gmail.com',
      coordinator: 'นายสมชาย ใจดี',
      coordinatorContact: '081-234-5678',
      coordinatorEmail: 'somchai@evolution.com',
      province: 'กรุงเทพมหานคร',
      taxId: '0105560001234',
      projects: 25,
      status: 'active',
      registeredDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      description: 'บริษัทรับเหมาติดตั้งระบบพลังงานแสงอาทิตย์และพลังงานทดแทน'
    },
    {
      id: 2,
      name: 'บริษัท เอสโซลาร์ จำกัด',
      type: 'EPC',
      code: 'EPC002',
      ministry: 'กระทรวงพลังงาน',
      affiliation: 'สมาคมพลังงานทดแทนไทย',
      address: '456 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310',
      contact: '02-234-5678',
      email: 'info@esolar.co.th',
      coordinator: 'นางสาวมาลี สวยงาม',
      coordinatorContact: '082-345-6789',
      coordinatorEmail: 'malee@esolar.co.th',
      province: 'กรุงเทพมหานคร',
      taxId: '0105560005678',
      projects: 18,
      status: 'active',
      registeredDate: '2024-01-10',
      lastUpdated: '2024-01-18',
      description: 'ผู้เชี่ยวชาญด้านระบบพลังงานแสงอาทิตย์และระบบกักเก็บพลังงาน'
    },
    // Government Agencies
    {
      id: 3,
      name: 'โรงเรียนวัดสระแก้ว',
      type: 'Government',
      code: 'GOV001',
      ministry: 'กระทรวงศึกษาธิการ',
      affiliation: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษากรุงเทพมหานคร',
      address: '123 ถนนราชดำเนิน แขวงพระบรมมหาราชวัง เขตพระนคร กรุงเทพมหานคร 10200',
      contact: '02-123-4567',
      email: 'info@school.ac.th',
      coordinator: 'นายวิชัย เก่งมาก',
      coordinatorContact: '083-456-7890',
      coordinatorEmail: 'wichai@school.ac.th',
      province: 'กรุงเทพมหานคร',
      projects: 5,
      status: 'active',
      registeredDate: '2024-01-05',
      lastUpdated: '2024-01-15',
      description: 'โรงเรียนประถมศึกษาที่เข้าร่วมโครงการพลังงานทดแทน'
    },
    {
      id: 4,
      name: 'โรงเรียนบ้านหนองบัว',
      type: 'Government',
      code: 'GOV002',
      ministry: 'กระทรวงศึกษาธิการ',
      affiliation: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษากรุงเทพมหานคร',
      address: '456 ถนนวิภาวดีรังสิต แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900',
      contact: '02-234-5678',
      email: 'info@school2.ac.th',
      coordinator: 'นางสมหญิง รักงาน',
      coordinatorContact: '084-567-8901',
      coordinatorEmail: 'somying@school2.ac.th',
      province: 'กรุงเทพมหานคร',
      projects: 8,
      status: 'active',
      registeredDate: '2024-01-08',
      lastUpdated: '2024-01-12',
      description: 'โรงเรียนประถมศึกษาที่มีโครงการพลังงานสะอาด'
    },
    {
      id: 5,
      name: 'โรงเรียนอนุบาลเชียงใหม่',
      type: 'Government',
      code: 'GOV003',
      ministry: 'กระทรวงศึกษาธิการ',
      affiliation: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาเชียงใหม่',
      address: '789 ถนนนิมมานเหมินท์ ตำบลสุเทพ อำเภอเมืองเชียงใหม่ เชียงใหม่ 50200',
      contact: '053-123-4567',
      email: 'info@school3.ac.th',
      coordinator: 'นายธนาคาร ใจดี',
      coordinatorContact: '085-678-9012',
      coordinatorEmail: 'thanakarn@school3.ac.th',
      province: 'เชียงใหม่',
      projects: 12,
      status: 'active',
      registeredDate: '2024-01-12',
      lastUpdated: '2024-01-25',
      description: 'โรงเรียนอนุบาลที่เข้าร่วมโครงการพลังงานทดแทนในภาคเหนือ'
    },
    // Private Organizations
    {
      id: 6,
      name: 'บริษัท กรีน พาวเวอร์ จำกัด',
      type: 'Private',
      code: 'PRV001',
      ministry: 'กระทรวงพลังงาน',
      affiliation: 'สมาคมพลังงานทดแทนไทย',
      address: '321 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมืองขอนแก่น ขอนแก่น 40000',
      contact: '043-234-5678',
      email: 'info@greenpower.co.th',
      coordinator: 'นางมาลี สวยงาม',
      coordinatorContact: '086-789-0123',
      coordinatorEmail: 'malee@greenpower.co.th',
      province: 'ขอนแก่น',
      taxId: '0105560009012',
      projects: 15,
      status: 'active',
      registeredDate: '2024-01-20',
      lastUpdated: '2024-01-30',
      description: 'บริษัทเอกชนที่ให้บริการด้านพลังงานทดแทนและอนุรักษ์พลังงาน'
    }
  ];

  // Load data from API
  useEffect(() => {
    loadEpcCompanies();
    loadGovernmentAgencies();
    loadCoordinators();
  }, []);

  const loadEpcCompanies = async () => {
    try {
      const response = await epcAPI.getAllEpcCompanies();
      if (response.success) {
        setEpcCompanies(response.data || []);
      } else {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูล EPC ได้",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading EPC companies:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับ API ได้",
        variant: "destructive",
      });
    }
  };

  const loadGovernmentAgencies = async () => {
    setLoading(true);
    try {
      const response = await projectsAPI.getProjects({ limit: 1000 });
      if (response.success) {
        const transformedData = (response.data || []).map(project => {
          let displayName = project.agencyName || '';
          if (displayName && !displayName.startsWith('โรงเรียน')) {
            displayName = `โรงเรียน${displayName}`;
          }
          
          return {
            id: project.id,
            name: displayName,
            type: 'Government',
            code: project.id.toString().padStart(6, '0'),
            ministry: project.ministry || 'ไม่ระบุ',
            affiliation: project.affiliation || 'ไม่ระบุ',
            address: `${project.address || ''} ${project.subdistrict || ''} ${project.district || ''} ${project.province || ''} ${project.postalCode || ''}`.trim(),
            contact: project.coordinatorPhone || 'ไม่ระบุ',
            email: project.coordinatorEmail || 'ไม่ระบุ',
            coordinator: project.coordinatorName || 'ไม่ระบุ',
            coordinatorContact: project.coordinatorPhone || 'ไม่ระบุ',
            coordinatorEmail: project.coordinatorEmail || 'ไม่ระบุ',
            province: project.province || 'ไม่ระบุ',
            taxId: 'ไม่ระบุ',
            projects: 1,
            status: project.status || 'pending',
            registeredDate: project.createdAt ? new Date(project.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ',
            lastUpdated: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('th-TH') : 'ไม่ระบุ',
            description: project.description || 'ไม่มีคำอธิบาย'
          };
        });
        setGovernmentAgencies(transformedData);
      } else {
        throw new Error(response.message || 'Failed to load government agencies');
      }
    } catch (error) {
      console.error('Error loading government agencies:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถโหลดข้อมูลหน่วยงานภาครัฐได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCoordinators = async () => {
    try {
      const response = await coordinatorsAPI.getCoordinators({ limit: 1000, status: 'approved' });
      if (response.success) {
        const coordinatorsData = response.data.coordinators || response.data || [];
        const transformedData = coordinatorsData.map(coord => ({
          id: coord.id,
          name: coord.fullName || coord.name || 'ไม่ระบุ',
          type: 'Coordinator',
          code: `SALE${coord.id.toString().padStart(4, '0')}`,
          ministry: 'ผู้ประสานงาน/Sale',
          affiliation: '-',
          address: `${coord.address || ''} ${coord.subdistrict || ''} ${coord.district || ''} ${coord.province || ''} ${coord.postalCode || ''}`.trim() || 'ไม่ระบุ',
          contact: coord.phone || coord.phoneNumber || 'ไม่ระบุ',
          email: coord.email || 'ไม่ระบุ',
          coordinator: coord.fullName || coord.name || 'ไม่ระบุ',
          coordinatorContact: coord.phone || coord.phoneNumber || 'ไม่ระบุ',
          coordinatorEmail: coord.email || 'ไม่ระบุ',
          province: coord.province || 'ไม่ระบุ',
          taxId: coord.idCardNumber || 'ไม่ระบุ',
          bank: coord.bank || 'ไม่ระบุ',
          bankAccount: coord.bankAccountNumber || 'ไม่ระบุ',
          projects: 0,
          status: coord.status === 'approved' ? 'active' : 'pending',
          registeredDate: coord.createdAt ? new Date(coord.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ',
          lastUpdated: coord.updatedAt ? new Date(coord.updatedAt).toLocaleDateString('th-TH') : 'ไม่ระบุ',
          description: 'ผู้ประสานงาน/Sale ที่ได้รับการอนุมัติ'
        }));
        setCoordinators(transformedData);
      }
    } catch (error) {
      console.error('Error loading coordinators:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลผู้ประสานงานได้",
        variant: "destructive",
      });
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'EPC':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">EPC</Badge>;
      case 'Government':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">หน่วยงาน</Badge>;
      case 'Coordinator':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">ผู้ประสานงาน</Badge>;
      case 'Private':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">เอกชน</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <Badge variant="secondary" className="bg-green-100 text-green-700">ใช้งาน</Badge>
      : <Badge variant="secondary" className="bg-red-100 text-red-700">ไม่ใช้งาน</Badge>;
  };

  // Combine EPC data from API, Government agencies from API, and Coordinators from API
  const allOrganizations = [
    ...epcCompanies.map(epc => ({
      ...epc,
      type: 'EPC',
      code: epc.epcCode || `EPC${epc.id}`,
      ministry: 'กระทรวงพลังงาน',
      affiliation: 'สมาคมพลังงานทดแทนไทย',
      coordinator: epc.epcContact || 'ไม่ระบุ',
      coordinatorContact: epc.epcContact || '',
      coordinatorEmail: epc.email || '',
      province: epc.province || 'ไม่ระบุ',
      projects: epc.projects || 0,
      registeredDate: epc.createdAt || 'ไม่ระบุ',
      lastUpdated: epc.updatedAt || 'ไม่ระบุ',
      description: 'บริษัทรับเหมาติดตั้งระบบพลังงานแสงอาทิตย์และพลังงานทดแทน'
    })),
    ...governmentAgencies, // Government agencies from API
    ...coordinators // Coordinators/Sale from API
  ];

  const filteredOrganizations = allOrganizations.filter(org => {
    const matchesSearch = (org.epcName || org.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (org.epcCode || org.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (org.ministry || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || org.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const handleViewDetails = (org) => {
    setSelectedOrganization(org);
    setShowDetailModal(true);
  };

  const handleEdit = (org) => {
    console.log('OrganizationDetails - handleEdit called with org:', org);
    
    if (org.type === 'Government') {
      // For government agencies, navigate to edit agency page
      if (!org.id) {
        toast({
          title: "❌ เกิดข้อผิดพลาด",
          description: "ไม่พบ ID ของหน่วยงาน",
          variant: "destructive",
        });
        return;
      }
      
      console.log('OrganizationDetails - Navigating to /admin/edit-agency/' + org.id);
      
      // Navigate to EditAgency page (NEW FILE)
      window.location.href = `/admin/edit-agency/${org.id}`;
    } else if (org.type === 'EPC') {
      // For EPC companies, navigate to edit EPC page
      if (!org.id) {
        toast({
          title: "❌ เกิดข้อผิดพลาด",
          description: "ไม่พบ ID ของบริษัท EPC",
          variant: "destructive",
        });
        return;
      }
      
      console.log('OrganizationDetails - Navigating to /admin/edit-epc/' + org.id);
      
      // Navigate to EditEpc page
      window.location.href = `/admin/edit-epc/${org.id}`;
    } else if (org.type === 'Coordinator') {
      // For Coordinators, navigate to edit coordinator page
      if (!org.id) {
        toast({
          title: "❌ เกิดข้อผิดพลาด",
          description: "ไม่พบ ID ของผู้ประสานงาน",
          variant: "destructive",
        });
        return;
      }
      
      console.log('OrganizationDetails - Navigating to /admin/edit-coordinator/' + org.id);
      
      // Navigate to EditCoordinator page
      window.location.href = `/admin/edit-coordinator/${org.id}`;
    } else {
      // For other types
      toast({
        title: "🚧 Feature In Progress",
        description: `การแก้ไขข้อมูล ${org.type} กำลังพัฒนา`,
      });
    }
  };

  const handleDelete = (org) => {
    toast({
      title: "ลบข้อมูล",
      description: `กำลังลบข้อมูลของ ${org.name}`,
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2">รายละเอียดข้อมูลหน่วยงาน</h1>
        <p className="text-slate-600 text-lg">ดูและจัดการรายละเอียดข้อมูลหน่วยงานทั้งหมดในระบบ</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หน่วยงานทั้งหมด</CardTitle>
            <Building2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allOrganizations.length}</div>
            <p className="text-xs text-slate-500">หน่วยงานในระบบ</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">บริษัท EPC</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {allOrganizations.filter(org => org.type === 'EPC').length}
            </div>
            <p className="text-xs text-slate-500">บริษัทรับเหมาติดตั้ง</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">หน่วยงานภาครัฐ</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allOrganizations.filter(org => org.type === 'Government').length}
            </div>
            <p className="text-xs text-slate-500">โรงเรียน/หน่วยงาน</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ประสานงาน</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {allOrganizations.filter(org => org.type === 'Coordinator').length}
            </div>
            <p className="text-xs text-slate-500">ผู้ประสานงาน/Sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">ค้นหาและกรองข้อมูล</CardTitle>
          <CardDescription>ค้นหาและกรองข้อมูลหน่วยงานตามประเภทและคำค้นหา</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="ค้นหาหน่วยงาน (ชื่อ, รหัส, กระทรวง)"
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="กรองตามประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="EPC">EPC</SelectItem>
                  <SelectItem value="Government">หน่วยงาน</SelectItem>
                  <SelectItem value="Coordinator">ผู้ประสานงาน</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              ส่งออกข้อมูล
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">รายการหน่วยงาน</CardTitle>
          <CardDescription>รายการหน่วยงานทั้งหมดในระบบ ({filteredOrganizations.length} รายการ)</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-slate-600">กำลังโหลดข้อมูล...</span>
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p>ไม่พบข้อมูลหน่วยงาน</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">ชื่อหน่วยงาน</TableHead>
                    <TableHead className="w-[100px]">ประเภท</TableHead>
                    <TableHead className="w-[120px]">จังหวัด</TableHead>
                    <TableHead className="w-[150px]">ผู้ประสานงาน</TableHead>
                    <TableHead className="w-[120px]">เบอร์ติดต่อ</TableHead>
                    <TableHead className="w-[100px]">โครงการ</TableHead>
                    <TableHead className="w-[150px]">การดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrganizations.map((org, index) => (
                    <motion.tr
                      key={org.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-slate-50"
                    >
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800">
                            {org.epcName || org.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {org.epcCode || org.code}
                          </p>
                          <p className="text-xs text-slate-400 truncate max-w-[180px]">
                            {org.epcAddress || org.address}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(org.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-sm">{org.province}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="text-sm">{org.coordinator}</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-[140px]">
                            {org.coordinatorEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="text-sm">{org.epcContact || org.contact}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {org.projects} โครงการ
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(org)}
                            className="text-xs h-7"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            ดู
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(org)}
                            className="text-xs h-7"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            แก้ไข
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(org)}
                            className="text-xs h-7"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            ลบ
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredOrganizations.length > 0 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-slate-600">
                แสดง {startIndex + 1}-{Math.min(endIndex, filteredOrganizations.length)} จาก {filteredOrganizations.length} รายการ
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  ‹
                </Button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="h-8 w-8 p-0"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-1">...</span>;
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  ›
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrganization && (
          <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  รายละเอียดหน่วยงาน
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Organization Header */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {selectedOrganization.epcName || selectedOrganization.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {getTypeBadge(selectedOrganization.type)}
                        <Badge variant="outline" className="text-sm">
                          {selectedOrganization.epcCode || selectedOrganization.code}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-1">
                        <strong>กระทรวง:</strong> {selectedOrganization.ministry}
                      </p>
                      <p className="text-slate-600">
                        <strong>สังกัด:</strong> {selectedOrganization.affiliation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        ข้อมูลติดต่อ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-600">ที่อยู่</p>
                        <p className="text-slate-800">{selectedOrganization.epcAddress || selectedOrganization.address}</p>
                        <p className="text-sm text-slate-500">จังหวัด: {selectedOrganization.province}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">เบอร์ติดต่อ</p>
                        <p className="text-slate-800">{selectedOrganization.epcContact || selectedOrganization.contact}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">อีเมล</p>
                        <p className="text-slate-800">{selectedOrganization.email}</p>
                      </div>
                      {selectedOrganization.taxId && (
                        <div>
                          <p className="text-sm font-medium text-slate-600">เลขที่ผู้เสียภาษี</p>
                          <p className="text-slate-800">{selectedOrganization.taxId}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        ข้อมูลผู้ประสานงาน
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-600">ชื่อผู้ประสานงาน</p>
                        <p className="text-slate-800">{selectedOrganization.coordinator}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">เบอร์ติดต่อ</p>
                        <p className="text-slate-800">{selectedOrganization.coordinatorContact}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">อีเมล</p>
                        <p className="text-slate-800">{selectedOrganization.coordinatorEmail}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        ข้อมูลโครงการ
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {selectedOrganization.projects}
                        </div>
                        <p className="text-slate-600">โครงการทั้งหมด</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        วันที่ลงทะเบียน
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-800 mb-1">
                          {selectedOrganization.registeredDate}
                        </div>
                        <p className="text-slate-600">วันที่เข้าร่วมระบบ</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        อัปเดตล่าสุด
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-800 mb-1">
                          {selectedOrganization.lastUpdated}
                        </div>
                        <p className="text-slate-600">วันที่แก้ไขล่าสุด</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                {selectedOrganization.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">รายละเอียดเพิ่มเติม</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 leading-relaxed">
                        {selectedOrganization.description}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrganizationDetails;
