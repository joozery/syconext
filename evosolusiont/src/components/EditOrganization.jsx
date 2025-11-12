import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Phone, User, FileText, Mail, Hash, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { projectsAPI, coordinatorsAPI, documentVersionsAPI } from '@/services/api';
import Swal from 'sweetalert2';

const EditOrganization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [coordinatorsList, setCoordinatorsList] = useState([]);
  const [versionCount, setVersionCount] = useState(0);
  const [canEdit, setCanEdit] = useState(true);
  const [originalData, setOriginalData] = useState(null);
  
  // Extract ID from URL or sessionStorage
  const getOrganizationId = () => {
    const match = location.pathname.match(/\/admin\/edit-organization\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const id = getOrganizationId();
  
  const [formData, setFormData] = useState({
    // ข้อมูลพื้นฐาน (ข้อมูลที่ผู้ใช้ไม่สามารถแก้ไข)
    agencyName: '',
    agencyCode: '',
    address: '',
    
    // ข้อมูลที่แก้ไขได้
    position: '', // ตำแหน่ง
    salutation: '', // คำนำ (นาย/นาง/นางสาว)
    province: '', // จังหวัด
    district: '', // อำเภอ
    subdistrict: '', // ตำบล
    ministry: '', // กระทรวง
    affiliation: '', // สังกัด
    
    // เลขที่ผู้ประสานงาน (auto from database)
    coordinatorNumber: '',
    coordinatorPhone: '', // เบอร์โทรศัพท์
    postalCodeArea: '', // รหัสไปรษณีย์สานาม
    
    // ชื่อผู้ประสานงาน (คุณ...)
    coordinator1: '', // คุณอนุวัฒน์
    coordinator2: '', // คุณอนันต์
    coordinator3: '', // คุณอิศราห์
    
    status: 'approved'
  });

  useEffect(() => {
    if (id) {
      loadOrganizationData();
      loadCoordinatorsList();
      loadVersionInfo();
    } else {
      setLoading(false);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบ ID ของหน่วยงาน",
        variant: "destructive"
      });
    }
  }, [id]);

  const loadOrganizationData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      console.log('Loading organization ID:', id);
      
      // Try to get from sessionStorage first
      const storedData = sessionStorage.getItem('editOrganizationData');
      if (storedData) {
        const orgData = JSON.parse(storedData);
        console.log('Organization data from sessionStorage:', orgData);
        populateFormData(orgData);
      }
      
      // Also fetch from API
      const response = await projectsAPI.getProjectById(id);
      if (response.success && response.data) {
        console.log('Project data from API:', response.data);
        setOriginalData(response.data); // เก็บข้อมูลเดิมไว้
        populateFormData(response.data);
      }
    } catch (error) {
      console.error('Error loading organization:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลหน่วยงานได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (data) => {
    console.log('Populating form with data:', data);
    
    setFormData({
      agencyName: data.agencyName || data.name || '',
      agencyCode: data.agencyCode || data.code || '',
      address: data.address || '',
      position: data.position || '',
      salutation: data.salutation || '',
      province: data.province || '',
      district: data.district || '',
      subdistrict: data.subdistrict || '',
      ministry: data.ministry || '',
      affiliation: data.affiliation || '',
      coordinatorNumber: data.coordinatorId?.toString() || data.coordinatorNumber || '',
      coordinatorPhone: data.coordinatorPhone || data.phone || '',
      postalCodeArea: data.postalCodeArea || data.postalCode || '',
      coordinator1: data.coordinatorName || data.coordinator1 || '',
      coordinator2: data.coordinator2 || '',
      coordinator3: data.coordinator3 || '',
      status: data.status || 'approved'
    });
  };

  const loadCoordinatorsList = async () => {
    try {
      const response = await coordinatorsAPI.getCoordinators({ status: 'approved' });
      if (response.success) {
        const coordsData = response.data.coordinators || response.data || [];
        setCoordinatorsList(coordsData);
        console.log('Loaded coordinators list:', coordsData);
      }
    } catch (error) {
      console.error('Error loading coordinators:', error);
    }
  };

  const loadVersionInfo = async () => {
    if (!id) return;
    
    try {
      const response = await documentVersionsAPI.getProjectSummary(id);
      if (response.success && response.data) {
        const { versionCount: count, canEdit: editable } = response.data;
        setVersionCount(count);
        setCanEdit(editable);
        console.log(`Version info: ${count} versions, canEdit: ${editable}`);
        
        // แสดง warning ถ้าใกล้ถึงลิมิต
        if (count === 2) {
          toast({
            title: "⚠️ คำเตือน",
            description: "นี่คือการแก้ไขครั้งสุดท้าย (3/3)",
            variant: "warning"
          });
        }
      }
    } catch (error) {
      console.error('Error loading version info:', error);
      // ถ้าไม่มี version ยัง ก็ให้แก้ไขได้
      setVersionCount(0);
      setCanEdit(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-complete handlers
  const handleAgencyNameChange = (value) => {
    handleInputChange('agencyName', value);
    // Trigger auto-complete search if needed
  };

  const handleCoordinatorSelect = (coordinatorId) => {
    console.log('Selected coordinator ID:', coordinatorId);
    console.log('Coordinators list:', coordinatorsList);
    
    if (!coordinatorId) {
      // Clear coordinator fields if no selection
      setFormData(prev => ({
        ...prev,
        coordinatorNumber: '',
        coordinatorPhone: '',
        coordinator1: ''
      }));
      return;
    }
    
    const selected = coordinatorsList.find(c => c.id === parseInt(coordinatorId));
    console.log('Selected coordinator:', selected);
    
    if (selected) {
      setFormData(prev => ({
        ...prev,
        coordinatorNumber: selected.id?.toString() || '',
        coordinatorPhone: selected.phone || selected.phoneNumber || selected.coordinatorPhone || '',
        coordinator1: selected.fullName || selected.name || ''
      }));
    }
  };

  const handleEditDocument = async () => {
    try {
      setLoading(true);
      
      // ตรวจสอบว่าแก้ไขได้หรือไม่
      if (!canEdit) {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถแก้ไขได้',
          text: 'เอกสารนี้ถูกแก้ไขครบ 3 ครั้งแล้ว ไม่สามารถแก้ไขเพิ่มเติมได้',
          confirmButtonColor: '#ef4444'
        });
        return;
      }
      
      // Validate required fields
      if (!formData.agencyName) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูล',
          text: 'กรุณากรอกชื่อหน่วยงาน',
          confirmButtonColor: '#f59e0b'
        });
        return;
      }
      
      if (!formData.coordinatorNumber) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูล',
          text: 'กรุณาเลือกผู้ประสานงาน',
          confirmButtonColor: '#f59e0b'
        });
        return;
      }

      // ถามเหตุผลในการแก้ไข
      const { value: editReason } = await Swal.fire({
        title: `สร้างการแก้ไขครั้งที่ ${versionCount + 1}`,
        input: 'textarea',
        inputLabel: 'เหตุผลในการแก้ไข',
        inputPlaceholder: 'กรุณาระบุเหตุผลในการแก้ไขเอกสาร...',
        inputAttributes: {
          'aria-label': 'กรุณาระบุเหตุผลในการแก้ไขเอกสาร'
        },
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        inputValidator: (value) => {
          if (!value) {
            return 'กรุณาระบุเหตุผลในการแก้ไข'
          }
        }
      });

      if (!editReason) {
        setLoading(false);
        return;
      }

      // ข้อมูลที่แก้ไข
      const editedData = {
        ministry: formData.ministry,
        affiliation: formData.affiliation,
        coordinatorId: parseInt(formData.coordinatorNumber),
        coordinatorName: formData.coordinator1,
        coordinatorPhone: formData.coordinatorPhone
      };
      
      console.log('Creating document version with data:', editedData);
      console.log('Project ID:', id);
      console.log('Edit reason:', editReason);

      // สร้าง version ใหม่
      const response = await documentVersionsAPI.createVersion(id, {
        editedData: editedData,
        editReason: editReason,
        editedBy: JSON.parse(localStorage.getItem('eep_current_user'))?.username || 'admin'
      });
      
      console.log('Response from API:', response);
      
      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'สร้างการแก้ไขสำเร็จ!',
          html: `
            <p>สร้างการแก้ไขครั้งที่ ${response.data.versionNumber} เรียบร้อยแล้ว</p>
            <p class="text-sm text-gray-600 mt-2">เลขที่เอกสาร: ${response.data.documentNumber}</p>
          `,
          confirmButtonColor: '#10b981'
        });
        
        // Clear sessionStorage
        sessionStorage.removeItem('editOrganizationData');
        
        // Navigate back
        navigate('/admin/projects');
      } else {
        throw new Error(response.message || 'Create version failed');
      }
    } catch (error) {
      console.error('Error creating document version:', error);
      console.error('Error details:', {
        message: error.message,
        error: error.error,
        response: error.response,
        stack: error.stack
      });
      
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        html: `
          <p>${error.message || error.error || 'ไม่สามารถบันทึกข้อมูลได้'}</p>
          <p class="text-xs text-gray-500 mt-2">กรุณาตรวจสอบ Console (F12) สำหรับข้อมูลเพิ่มเติม</p>
        `,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.agencyName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }
  
  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">ไม่พบ ID ของหน่วยงาน</p>
          <Button onClick={() => navigate('/admin/projects')}>
            กลับไปหน้ารายการ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/projects')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              แก้ไขข้อมูลหน่วยงาน ภาครัฐ/เอกชน
            </h1>
            <p className="text-slate-600 mt-1">
              {formData.agencyName || 'กำลังโหลด...'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center justify-between text-blue-900 text-xl">
              <span className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                แก้ไขหนังสือเชิญชวน
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-normal text-slate-600">
                  จำนวนการแก้ไข: <span className={`font-bold ${versionCount >= 3 ? 'text-red-600' : 'text-blue-600'}`}>{versionCount}/3</span>
                </span>
                {!canEdit && (
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                    แก้ไขครบแล้ว
                  </span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Row 1: ชื่อหน่วยงาน, รหัสหน่วยงาน, ที่อยู่หน่วยงาน (Disabled) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  ชื่อหน่วยงาน
                </Label>
                <Input
                  value={formData.agencyName || ''}
                  disabled
                  className="bg-slate-50 border-slate-300 text-slate-600 cursor-not-allowed"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Hash className="w-4 h-4 text-purple-600" />
                  รหัสหน่วยงาน
                </Label>
                <Input
                  value={formData.agencyCode || ''}
                  disabled
                  className="bg-slate-50 border-slate-300 text-slate-600 cursor-not-allowed"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Home className="w-4 h-4 text-green-600" />
                  ที่อยู่หน่วยงาน
                </Label>
                <Input
                  value={formData.address || ''}
                  disabled
                  className="bg-slate-50 border-slate-300 text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Row 2: ตำบล, อำเภอ, จังหวัด (Disabled) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  ตำบล
                </Label>
                <Input
                  value={formData.subdistrict || ''}
                  disabled
                  className="bg-slate-50 border-slate-300 text-slate-600 cursor-not-allowed"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  อำเภอ
                </Label>
                <Input
                  value={formData.district || ''}
                  disabled
                  className="bg-slate-50 border-slate-300 text-slate-600 cursor-not-allowed"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  จังหวัด
                </Label>
                <Input
                  value={formData.province || ''}
                  disabled
                  className="bg-slate-50 border-slate-300 text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Row 3: กระทรวง, สังกัด (Editable) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  กระทรวง
                </Label>
                <Input
                  value={formData.ministry || ''}
                  onChange={(e) => handleInputChange('ministry', e.target.value)}
                  placeholder="กรอกชื่อกระทรวง"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  สังกัด
                </Label>
                <Input
                  value={formData.affiliation || ''}
                  onChange={(e) => handleInputChange('affiliation', e.target.value)}
                  placeholder="กรอกสังกัด"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 4: ชื่อผู้ประสานงาน (Select), เบอร์ติดต่อ (Auto), รหัสผู้ประสานงาน (Auto) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <User className="w-4 h-4 text-blue-600" />
                  ชื่อผู้ประสานงาน <span className="text-red-500">*</span>
                </Label>
                <select
                  value={formData.coordinatorNumber || ''}
                  onChange={(e) => handleCoordinatorSelect(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm rounded-md border border-blue-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 outline-none transition-colors"
                >
                  <option value="">-- เลือกผู้ประสานงาน --</option>
                  {coordinatorsList.map((coord) => (
                    <option key={coord.id} value={coord.id}>
                      {coord.fullName || coord.name}
                    </option>
                  ))}
                </select>
                {formData.coordinator1 && (
                  <p className="text-xs text-slate-600 mt-1">
                    ✓ เลือก: {formData.coordinator1}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Phone className="w-4 h-4 text-blue-600" />
                  เบอร์ติดต่อ
                </Label>
                <Input
                  value={formData.coordinatorPhone || ''}
                  disabled
                  placeholder="เบอร์จะแสดงอัตโนมัติเมื่อเลือกผู้ประสานงาน"
                  className="bg-slate-50 border-slate-300 text-slate-600 cursor-not-allowed"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Hash className="w-4 h-4 text-blue-600" />
                  รหัสผู้ประสานงาน
                </Label>
                <Input
                  value={formData.coordinatorNumber || ''}
                  disabled
                  placeholder="รหัสจะแสดงอัตโนมัติเมื่อเลือกผู้ประสานงาน"
                  className="bg-slate-50 border-slate-300 text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/projects')}
                className="px-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ยกเลิก
              </Button>
              <Button
                onClick={handleEditDocument}
                disabled={loading || !canEdit}
                className={`px-12 shadow-lg ${
                  !canEdit 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังบันทึก...
                  </>
                ) : !canEdit ? (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    ไม่สามารถแก้ไขได้
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    บันทึกการแก้ไขครั้งที่ {versionCount + 1}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditOrganization;

