import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Building2, Users, User, Eye, Edit, Trash2, X, Save, Phone, Mail, MapPin, Calendar, FileText, Download, FileDown, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { epcAPI, projectsAPI, documentVersionsAPI } from '@/services/api';
import PDFPreviewModal from './PDFPreviewModal';

const AllOrganizationsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('agencies');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [epcCompanies, setEpcCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedPDFItem, setSelectedPDFItem] = useState(null);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedProjectVersions, setSelectedProjectVersions] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 50;

  // Load data from API
  useEffect(() => {
    loadEpcCompanies();
    loadProjects(currentPage);
  }, [currentPage]);

  const loadEpcCompanies = async () => {
    try {
      setLoading(true);
      const response = await epcAPI.getEpcList();
      
      if (response.success) {
        setEpcCompanies(response.data || []);
        console.log('Loaded EPC companies:', response.data);
      } else {
        throw new Error(response.message || 'Failed to load EPC companies');
      }
    } catch (error) {
      console.error('Error loading EPC companies:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถโหลดข้อมูลบริษัท EPC ได้",
        variant: "destructive",
      });
      // Fallback to empty array if API fails
      setEpcCompanies([]);
    } finally {
      setLoading(false);
    }
  };


  const loadProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjects({ 
        page: page,
        limit: itemsPerPage
      });
      
      if (response.success) {
        // Transform API data to match component format
        const transformedData = await Promise.all((response.data || []).map(async (project) => {
          // Add "โรงเรียน" prefix if not already present
          let displayName = project.agencyName || '';
          if (displayName && !displayName.startsWith('โรงเรียน')) {
            displayName = `โรงเรียน${displayName}`;
          }
          
          // Get version count and version dates for this project
          let versionCount = 0;
          let version2Date = null;
          let version3Date = null;
          let version2Data = null;
          let version3Data = null;
          try {
            const versionResponse = await documentVersionsAPI.getProjectSummary(project.id);
            
            if (versionResponse.success && versionResponse.data) {
              versionCount = versionResponse.data.versionCount || 0;
              const versions = versionResponse.data.versions || [];
              
              // Get date for version 2
              const v2 = versions.find(v => v.version_number === 2);
              if (v2 && v2.createdAt) {
                version2Date = new Date(v2.createdAt).toLocaleDateString('th-TH', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });
                version2Data = v2; // Store full version data
              }
              
              // Get date for version 3
              const v3 = versions.find(v => v.version_number === 3);
              if (v3 && v3.createdAt) {
                version3Date = new Date(v3.createdAt).toLocaleDateString('th-TH', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                });
                version3Data = v3; // Store full version data
              }
            }
          } catch (error) {
            console.error(`Error loading version count for project ${project.id}:`, error);
          }
          
          return {
            id: project.id,
            name: displayName,
            type: 'Government',
          code: project.id.toString().padStart(6, '0'),
          ministry: project.ministry || 'ไม่ระบุ',
          affiliation: project.affiliation || 'ไม่ระบุ',
          address: `${project.address || ''} ${project.subdistrict || ''} ${project.district || ''} ${project.province || ''} ${project.postalCode || ''}`.trim(),
          contact: 'ไม่ระบุ',
          email: 'ไม่ระบุ',
          coordinator: project.coordinatorName || 'ไม่ระบุ',
          coordinatorContact: project.coordinatorPhone || 'ไม่ระบุ',
          coordinatorEmail: project.coordinatorEmail || 'ไม่ระบุ',
          province: project.province || 'ไม่ระบุ',
          region: project.region || 'ไม่ระบุ',
          taxId: 'ไม่ระบุ',
          projects: 1,
          status: project.status || 'pending',
          registeredDate: project.createdAt ? new Date(project.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ',
          lastUpdated: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('th-TH') : 'ไม่ระบุ',
          description: project.description || 'ไม่มีคำอธิบาย',
          principalName: 'ไม่ระบุ',
          documentNumber: project.documentNumber || 'ชร. 0001/2568',
          versionCount: versionCount,
          version2Date: version2Date,
          version3Date: version3Date,
          version2Data: version2Data,
          version3Data: version3Data
        };
        }));
        
        setProjects(transformedData);
        
        // Update pagination info
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.totalItems);
        }
        
        console.log('Loaded projects:', transformedData.length, 'of', response.pagination?.totalItems || 0);
      } else {
        throw new Error(response.message || 'Failed to load projects');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถโหลดข้อมูลโครงการได้",
        variant: "destructive",
      });
      // Fallback to empty array if API fails
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for EPC companies (fallback)
  const mockEpcCompanies = [
    {
      id: 1,
      name: 'บริษัท EPC เอ็นเนอร์จี จำกัด',
      contact: '02-123-4567',
      email: 'contact@epcenergy.com',
      address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
      status: 'active',
      projects: 15,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'บริษัท กรีน พาวเวอร์ จำกัด',
      contact: '02-234-5678',
      email: 'info@greenpower.com',
      address: '456 ถนนรัชดาภิเษก กรุงเทพฯ 10400',
      status: 'active',
      projects: 8,
      createdAt: '2024-02-20'
    },
    {
      id: 3,
      name: 'บริษัท โซลาร์ เทค จำกัด',
      contact: '02-345-6789',
      email: 'support@solartech.com',
      address: '789 ถนนพระราม 4 กรุงเทพฯ 10500',
      status: 'inactive',
      projects: 3,
      createdAt: '2024-03-10'
    }
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleViewDetails = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowDetailModal(true);
  };

  const handleEdit = (item, type) => {
    // Navigate to edit page based on type
    // Both 'agencies' and projects should navigate to EditOrganization page
    const organizationData = {
      id: item.id,
      name: item.name,
      agencyName: item.name,
      agencyCode: item.code || item.agencyCode || '',
      address: item.address || '',
      province: item.province || '',
      district: item.district || '',
      subdistrict: item.subdistrict || '',
      ministry: item.ministry || '',
      affiliation: item.affiliation || '',
      coordinator: item.coordinator || '',
      coordinator1: item.coordinator || '',
      coordinatorName: item.coordinator || '',
      coordinatorContact: item.coordinatorContact || '',
      coordinatorPhone: item.coordinatorContact || '',
      coordinatorEmail: item.coordinatorEmail || '',
      coordinatorId: item.coordinatorId || '',
      coordinatorNumber: item.coordinatorId || '',
    };
    
    console.log('AllOrganizationsList - Storing organization data:', organizationData);
    console.log('AllOrganizationsList - Navigating to /admin/edit-organization/' + item.id);
    
    sessionStorage.setItem('editOrganizationData', JSON.stringify(organizationData));
    window.location.href = `/admin/edit-organization/${item.id}`;
  };

  // Handle version viewing
  const handleViewVersions = async (projectId, versionNumber = null) => {
    toast({
      title: "🚧 ฟีเจอร์นี้ยังไม่พร้อมใช้งาน",
      description: "ฟีเจอร์การดูประวัติการแก้ไขจะมาพร้อมในอนาคต",
    });
  };

  // Handle creating new version
  const handleCreateVersion = async (projectId, editedData) => {
    toast({
      title: "🚧 ฟีเจอร์นี้ยังไม่พร้อมใช้งาน",
      description: "ฟีเจอร์การสร้างการแก้ไขจะมาพร้อมในอนาคต",
    });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    // Validation
    if (!editingItem.name || !editingItem.email) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกชื่อและอีเมลให้ครบถ้วน",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "✅ บันทึกสำเร็จ",
      description: `ข้อมูล ${editingItem.name} ถูกอัปเดตเรียบร้อยแล้ว`,
    });

    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleInputChange = (field, value) => {
    setEditingItem(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = (item, type) => {
    toast({
      title: "🚧 Feature In Progress",
      description: `การลบข้อมูล ${item.epcName || item.name} ยังไม่พร้อมใช้งาน`,
    });
  };

  // Bulk selection functions
  const handleSelectItem = (item) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectAll = () => {
    const filteredData = getFilteredData();
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData);
    }
  };

  const isItemSelected = (item) => {
    return selectedItems.some(selected => selected.id === item.id);
  };

  // PDF Export functions
  const handleExportSinglePDF = (item) => {
    console.log('AllOrganizationsList - Selected item for PDF:', item);
    console.log('AllOrganizationsList - Document Number:', item?.documentNumber);
    setSelectedPDFItem(item);
    setShowPDFPreview(true);
  };

  const handleExportBulkPDF = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "⚠️ ไม่มีรายการที่เลือก",
        description: "กรุณาเลือกรายการที่ต้องการออกเอกสาร",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "📄 กำลังสร้างเอกสาร PDF",
      description: `กำลังสร้างเอกสารสำหรับ ${selectedItems.length} รายการ...`,
    });
    
    // Simulate bulk PDF generation
    setTimeout(() => {
      toast({
        title: "✅ สร้างเอกสารสำเร็จ",
        description: `เอกสาร PDF สำหรับ ${selectedItems.length} รายการ พร้อมดาวน์โหลด`,
      });
      setSelectedItems([]);
      setShowBulkActions(false);
    }, 3000);
  };

  const handlePrintDocument = (item) => {
    toast({
      title: "🖨️ กำลังเตรียมพิมพ์",
      description: `กำลังเตรียมเอกสารสำหรับพิมพ์ ${item.epcName || item.name}...`,
    });
  };

  const handleDownloadPDF = (item) => {
    toast({
      title: "📥 กำลังดาวน์โหลด",
      description: `กำลังดาวน์โหลดเอกสารสำหรับ ${item.epcName || item.name}`,
    });
    setShowPDFPreview(false);
    setSelectedPDFItem(null);
  };

  const handlePrintPDF = (item) => {
    toast({
      title: "🖨️ กำลังเตรียมพิมพ์",
      description: `กำลังเตรียมเอกสารสำหรับพิมพ์ ${item.epcName || item.name}`,
    });
  };

  const handleClosePDFPreview = () => {
    setShowPDFPreview(false);
    setSelectedPDFItem(null);
  };

  // Handle version PDF preview
  const handleViewVersionPDF = (item, versionData) => {
    // Create a modified item with version's document number
    const versionItem = {
      ...item,
      documentNumber: versionData.document_number,
      versionNumber: versionData.version_number,
      isVersion: true
    };
    
    setSelectedPDFItem(versionItem);
    setShowPDFPreview(true);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const getFilteredData = () => {
    const data = projects; // Only show projects
    
    return data.filter(item => {
      if (!item) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const name = (item.name || '').toLowerCase();
      const email = (item.email || '').toLowerCase();
      const contact = (item.contact || '').toLowerCase();
      const province = (item.province || '').toLowerCase();
      const coordinatorName = (item.coordinatorName || '').toLowerCase();
      
      return name.includes(searchLower) ||
             email.includes(searchLower) ||
             contact.includes(searchLower) ||
             province.includes(searchLower) ||
             coordinatorName.includes(searchLower);
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const renderTableView = () => {
    const filteredData = getFilteredData();
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">ลำดับ</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">ชื่อหน่วยงาน</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">จังหวัด</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">ผู้ประสานงาน</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">วันที่พิมพ์เอกสาร</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">แก้ไขครั้งที่2</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">แก้ไขครั้งที่3</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">เอกสารส่งออก</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">ฉบับแก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr 
                key={item.id} 
                className={`border-b hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
              >
                <td className="px-4 py-3 text-sm">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.name}</td>
                <td className="px-4 py-3 text-sm">{item.province}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex flex-col">
                    <span>{item.coordinator}</span>
                    <span className="text-xs text-slate-500">{item.coordinatorContact}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{item.lastUpdated}</td>
                
                {/* แก้ไขครั้งที่2 */}
                <td className="px-4 py-3 text-sm">
                  {item.version2Date && item.version2Data ? (
                    <button
                      onClick={() => handleViewVersionPDF(item, item.version2Data)}
                      className="text-green-600 font-medium hover:text-green-700 hover:underline cursor-pointer transition-colors"
                      title="คลิกเพื่อดูเอกสาร PDF"
                    >
                      {item.version2Date}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                
                {/* แก้ไขครั้งที่3 */}
                <td className="px-4 py-3 text-sm">
                  {item.version3Date && item.version3Data ? (
                    <button
                      onClick={() => handleViewVersionPDF(item, item.version3Data)}
                      className="text-green-600 font-medium hover:text-green-700 hover:underline cursor-pointer transition-colors"
                      title="คลิกเพื่อดูเอกสาร PDF"
                    >
                      {item.version3Date}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                
                <td className="px-4 py-3 text-sm">
                  {item.documentUrl ? (
                    <a 
                      href={item.documentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      เอกสารฉบับที่: {item.code}/...pdf
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleExportSinglePDF(item)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                    >
                      ออกหนังสือ
                    </Button>
                  )}
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item, activeTab)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 border-0"
                  >
                    แก้ไขข้อมูล
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'agencies': return 'หน่วยงาน ภาครัฐ/เอกชน';
      default: return tab;
    }
  };

  const getTabCount = (tab) => {
    switch (tab) {
      case 'agencies': return totalItems || projects.length;
      default: return 0;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2">รายชื่อหน่วยงานทั้งหมด</h1>
        <p className="text-slate-600 text-lg mb-4">จัดการข้อมูลหน่วยงาน EPC ผู้ประสานงาน และหน่วยงานภาครัฐ/เอกชน</p>
      </motion.div>

            {/* Tabs - Only show agencies */}
            <div className="flex flex-wrap gap-2">
              {['agencies'].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  variant={activeTab === tab ? "default" : "outline"}
                  className={`flex items-center gap-2 ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {getTabLabel(tab)}
                  <Badge variant="secondary" className="ml-1">
                    {getTabCount(tab)}
                  </Badge>
                </Button>
              ))}
            </div>

      {/* Search and Bulk Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={`ค้นหา${getTabLabel(activeTab)}...`}
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <span className="text-sm text-blue-700 font-medium">
                เลือกแล้ว {selectedItems.length} รายการ
              </span>
              <Button
                onClick={handleExportBulkPDF}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                ออกหนังสือ PDF ทั้งหมด
              </Button>
              <Button
                onClick={() => setSelectedItems([])}
                variant="outline"
                size="sm"
                className="text-slate-600"
              >
                ยกเลิกการเลือก
              </Button>
            </div>
          )}
          
          <Button
            onClick={handleSelectAll}
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            {selectedItems.length === getFilteredData().length ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                ยกเลิกเลือกทั้งหมด
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4 mr-2" />
                เลือกทั้งหมด
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">
            {getTabLabel(activeTab)} ({totalItems.toLocaleString()} รายการ)
          </CardTitle>
                <CardDescription>
                  หน่วยงานภาครัฐและเอกชนที่เกี่ยวข้อง - หน้า {currentPage} จาก {totalPages}
                </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-600">กำลังโหลดข้อมูล...</p>
            </div>
          ) : getFilteredData().length === 0 ? (
            <p className="text-center text-slate-500 py-8">ไม่พบข้อมูล</p>
          ) : (
            renderTableView()
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                แสดง {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} จากทั้งหมด {totalItems.toLocaleString()} รายการ
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className="text-slate-600"
                >
                  ← ก่อนหน้า
                </Button>
                
                <div className="flex items-center gap-1">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant={currentPage === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        className="w-10"
                      >
                        1
                      </Button>
                      {currentPage > 4 && <span className="text-slate-400">...</span>}
                    </>
                  )}
                  
                  {/* Page numbers around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                    .map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    ))}
                  
                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="text-slate-400">...</span>}
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="text-slate-600"
                >
                  ถัดไป →
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">รายละเอียดข้อมูล</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDetailModal(false)}
                  className="h-8 w-8 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Header Info */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                    {(selectedItem.epcName || selectedItem.name).charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedItem.epcName || selectedItem.name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{getTabLabel(selectedItem.type)}</p>
                    <Badge variant="secondary" className={`mt-2 ${selectedItem.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedItem.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                    </Badge>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    ข้อมูลการติดต่อ
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.email && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> อีเมล
                        </Label>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-slate-800">{selectedItem.email}</span>
                        </div>
                      </div>
                    )}
                    
                    {(selectedItem.epcContact || selectedItem.contact || selectedItem.phone) && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                          <Phone className="w-4 h-4" /> เบอร์ติดต่อ
                        </Label>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-slate-800">{selectedItem.epcContact || selectedItem.contact || selectedItem.phone}</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedItem.taxId && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                          <FileText className="w-4 h-4" /> เลขที่ผู้เสียภาษี
                        </Label>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-slate-800">{selectedItem.taxId}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address */}
                {(selectedItem.epcAddress || selectedItem.address) && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      ที่อยู่
                    </h4>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-800">{selectedItem.epcAddress || selectedItem.address}</span>
                    </div>
                    {selectedItem.province && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">จังหวัด</Label>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-slate-800">{selectedItem.province}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">อำเภอ/เขต</Label>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-slate-800">{selectedItem.district}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">ตำบล/แขวง</Label>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-slate-800">{selectedItem.subdistrict}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedItem.postalCode && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-600">รหัสไปรษณีย์</Label>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-slate-800">{selectedItem.postalCode}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    ข้อมูลเพิ่มเติม
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> จำนวนโครงการ
                      </Label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-800 font-semibold">{selectedItem.projects || 0} โครงการ</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> วันที่เข้าร่วม
                      </Label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-800">{selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Type-specific fields */}
                  {selectedItem.type === 'epc' && (selectedItem.coordinatorName || selectedItem.coordinatorContact) && (
                    <div className="space-y-4">
                      <h5 className="text-md font-semibold text-slate-700 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        ข้อมูลผู้ประสานงาน
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedItem.coordinatorName && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-600">ชื่อผู้ประสานงาน</Label>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <span className="text-slate-800">{selectedItem.coordinatorName}</span>
                            </div>
                          </div>
                        )}
                        {selectedItem.coordinatorContact && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-600">เบอร์ผู้ประสานงาน</Label>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <span className="text-slate-800">{selectedItem.coordinatorContact}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedItem.type === 'agencies' && selectedItem.type && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">ประเภทหน่วยงาน</Label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-800">{selectedItem.type}</span>
                      </div>
                    </div>
                  )}

                  {selectedItem.type === 'coordinators' && selectedItem.department && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">แผนก</Label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-800">{selectedItem.department}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Files Information for EPC */}
                {selectedItem.type === 'epc' && (selectedItem.nda_file || selectedItem.companyCert_file || selectedItem.employmentContract_file || selectedItem.tndtContract_file) && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      ไฟล์เอกสาร
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedItem.nda_file && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">NDA</Label>
                          <div className="flex items-center gap-2">
                            <p className="text-slate-800 text-sm break-all flex-1">{selectedItem.nda_file}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`https://api.devwooyou.space/${selectedItem.nda_file}`, '_blank')}
                              className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              ดูเอกสาร
                            </Button>
                          </div>
                        </div>
                      )}
                      {selectedItem.companyCert_file && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">ใบรับรองบริษัท</Label>
                          <div className="flex items-center gap-2">
                            <p className="text-slate-800 text-sm break-all flex-1">{selectedItem.companyCert_file}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`https://api.devwooyou.space/${selectedItem.companyCert_file}`, '_blank')}
                              className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              ดูเอกสาร
                            </Button>
                          </div>
                        </div>
                      )}
                      {selectedItem.employmentContract_file && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">สัญญาจ้างงาน</Label>
                          <div className="flex items-center gap-2">
                            <p className="text-slate-800 text-sm break-all flex-1">{selectedItem.employmentContract_file}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`https://api.devwooyou.space/${selectedItem.employmentContract_file}`, '_blank')}
                              className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              ดูเอกสาร
                            </Button>
                          </div>
                        </div>
                      )}
                      {selectedItem.tndtContract_file && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-600">สัญญา TNDT</Label>
                          <div className="flex items-center gap-2">
                            <p className="text-slate-800 text-sm break-all flex-1">{selectedItem.tndtContract_file}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`https://api.devwooyou.space/${selectedItem.tndtContract_file}`, '_blank')}
                              className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              ดูเอกสาร
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2"
                >
                  ปิด
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedItem, selectedItem.type);
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  แก้ไขข้อมูล
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">แก้ไขข้อมูล</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelEdit}
                  className="h-8 w-8 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    ข้อมูลพื้นฐาน
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editName">ชื่อ <span className="text-red-500">*</span></Label>
                    <Input
                      id="editName"
                      placeholder="กรอกชื่อ"
                      value={editingItem.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editEmail">อีเมล <span className="text-red-500">*</span></Label>
                    <Input
                      id="editEmail"
                      type="email"
                      placeholder="กรอกอีเมล"
                      value={editingItem.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    ข้อมูลการติดต่อ
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editContact">เบอร์ติดต่อ</Label>
                    <Input
                      id="editContact"
                      type="tel"
                      placeholder="กรอกเบอร์ติดต่อ"
                      value={editingItem.contact || editingItem.phone || ''}
                      onChange={(e) => handleInputChange(editingItem.contact ? 'contact' : 'phone', e.target.value)}
                      className="h-12"
                    />
                  </div>
                  
                  {editingItem.address && (
                    <div className="space-y-2">
                      <Label htmlFor="editAddress">ที่อยู่</Label>
                      <Input
                        id="editAddress"
                        placeholder="กรอกที่อยู่"
                        value={editingItem.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="h-12"
                      />
                    </div>
                  )}
                </div>

                {/* Type-specific fields */}
                {editingItem.type === 'agencies' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-600" />
                      ข้อมูลหน่วยงาน
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editType">ประเภทหน่วยงาน</Label>
                      <Input
                        id="editType"
                        placeholder="กรอกประเภทหน่วยงาน"
                        value={editingItem.type || ''}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                )}

                {editingItem.type === 'coordinators' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      ข้อมูลผู้ประสานงาน
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="editDepartment">แผนก</Label>
                      <Input
                        id="editDepartment"
                        placeholder="กรอกแผนก"
                        value={editingItem.department || ''}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-600" />
                    สถานะ
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editStatus">สถานะการใช้งาน</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={editingItem.status === 'active' ? 'default' : 'outline'}
                        onClick={() => handleInputChange('status', 'active')}
                        className={editingItem.status === 'active' ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        ใช้งาน
                      </Button>
                      <Button
                        variant={editingItem.status === 'inactive' ? 'default' : 'outline'}
                        onClick={() => handleInputChange('status', 'inactive')}
                        className={editingItem.status === 'inactive' ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        ไม่ใช้งาน
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="px-6 py-2"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  บันทึก
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={handleClosePDFPreview}
        organization={selectedPDFItem}
        onDownload={handleDownloadPDF}
        onPrint={handlePrintPDF}
      />

      {/* Version History Modal */}
      <AnimatePresence>
        {showVersionModal && selectedProjectVersions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVersionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">ประวัติการแก้ไขเอกสาร</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowVersionModal(false)}
                  className="h-8 w-8 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Project Info */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {selectedProjectVersions.project.agencyName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    เลขที่เอกสารหลัก: {selectedProjectVersions.project.documentNumber}
                  </p>
                  <p className="text-sm text-slate-600">
                    จำนวนการแก้ไข: {selectedProjectVersions.versionCount} ครั้ง
                  </p>
                </div>

                {/* Versions List */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-700">รายการการแก้ไข</h4>
                  
                  {selectedProjectVersions.versions.map((version, index) => (
                    <div key={version.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-slate-800">
                          แก้ไขครั้งที่ {version.version_number}
                        </h5>
                        <Badge variant="outline" className="text-xs">
                          {version.document_number}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-slate-600">วันที่แก้ไข:</span>
                          <p className="text-slate-800">
                            {new Date(version.created_at).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-slate-600">แก้ไขโดย:</span>
                          <p className="text-slate-800">{version.edited_by}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium text-slate-600">เหตุผล:</span>
                          <p className="text-slate-800">{version.edit_reason}</p>
                        </div>
                      </div>

                      {/* Show changes */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h6 className="font-medium text-blue-800 mb-2">ข้อมูลที่แก้ไข:</h6>
                        <div className="text-sm text-blue-700">
                          {Object.keys(JSON.parse(version.edited_data)).map(key => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span>{JSON.parse(version.edited_data)[key] || 'ไม่ระบุ'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedProjectVersions.versions.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      ยังไม่มีการแก้ไขเอกสาร
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => setShowVersionModal(false)}
                  className="px-6 py-2"
                >
                  ปิด
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllOrganizationsList;
