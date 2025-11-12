import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, User, Phone, Mail, ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Swal from 'sweetalert2';
import { projectsAPI, coordinatorsAPI, epcAPI } from '@/services/api';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coordinators, setCoordinators] = useState([]);
  const [epcCompanies, setEpcCompanies] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    agencyName: '',
    agencyCode: '',
    address: '',
    position: '',
    authority: '',
    upperUnit: '',
    lowerUnit: '',
    estimatedUsers: '',
    directorName: '',
    deliveryOfficer: '',
    deliveryPosition: '',
    province: '',
    district: '',
    subdistrict: '',
    postalCode: '',
    region: '',
    ministry: '',
    videoLink: '',
    authorizedPerson: '',
    affiliation: '',
    coordinatorId: '',
    coordinator1Name: '',
    coordinator1Phone: '',
    coordinator1Code: '',
    coordinator2Name: '',
    coordinator2Phone: '',
    coordinator2Code: '',
    epcId: '',
    description: ''
  });

  // Load project data
  useEffect(() => {
    loadProjectData();
    loadCoordinators();
    loadEpcCompanies();
  }, [id]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      console.log('EditProject - Loading project data, ID from URL:', id);
      
      // Try to get from sessionStorage first
      const storedData = sessionStorage.getItem('editProjectData');
      console.log('EditProject - SessionStorage data:', storedData);
      
      if (storedData) {
        const projectData = JSON.parse(storedData);
        console.log('EditProject - Parsed project data:', projectData);
        
        // Use ID from sessionStorage if URL ID is undefined
        const projectId = id || projectData.id;
        console.log('EditProject - Using project ID:', projectId);
        
        setFormData({
          agencyName: projectData.name || projectData.agencyName || '',
          agencyCode: projectData.agencyCode || '',
          address: projectData.address || '',
          position: projectData.position || '',
          authority: projectData.authority || '',
          upperUnit: projectData.upperUnit || '',
          lowerUnit: projectData.lowerUnit || '',
          estimatedUsers: projectData.estimatedUsers || '',
          directorName: projectData.directorName || '',
          deliveryOfficer: projectData.deliveryOfficer || '',
          deliveryPosition: projectData.deliveryPosition || '',
          province: projectData.province || '',
          district: projectData.district || '',
          subdistrict: projectData.subdistrict || '',
          postalCode: projectData.postalCode || '',
          region: projectData.region || '',
          ministry: projectData.ministry || '',
          videoLink: projectData.videoLink || '',
          authorizedPerson: projectData.authorizedPerson || '',
          affiliation: projectData.affiliation || '',
          coordinatorId: projectData.coordinatorId || '',
          coordinator1Name: projectData.coordinator1Name || projectData.coordinator || '',
          coordinator1Phone: projectData.coordinator1Phone || projectData.coordinatorContact || '',
          coordinator1Code: projectData.coordinator1Code || '',
          coordinator2Name: projectData.coordinator2Name || '',
          coordinator2Phone: projectData.coordinator2Phone || '',
          coordinator2Code: projectData.coordinator2Code || '',
          epcId: projectData.epcId || '',
          description: projectData.description || ''
        });
        
        // Don't remove sessionStorage immediately - keep it for potential re-renders
        // sessionStorage.removeItem('editProjectData');
        console.log('EditProject - Form data set from sessionStorage');
        
        // If we have a valid project ID, try to fetch full data from API to supplement
        if (projectId) {
          console.log('EditProject - Fetching additional data from API, ID:', projectId);
          try {
            const response = await projectsAPI.getProjectById(projectId);
            console.log('EditProject - API response:', response);
            
            if (response.success && response.data) {
              const project = response.data;
              console.log('EditProject - Supplementing with API data:', project);
              
              // Merge API data with sessionStorage data (sessionStorage takes priority for basic fields)
              setFormData(prev => ({
                ...prev,
                agencyCode: project.agencyCode || prev.agencyCode,
                position: project.position || prev.position,
                authority: project.authority || prev.authority,
                upperUnit: project.upperUnit || prev.upperUnit,
                lowerUnit: project.lowerUnit || prev.lowerUnit,
                estimatedUsers: project.estimatedUsers || prev.estimatedUsers,
                directorName: project.directorName || prev.directorName,
                deliveryOfficer: project.deliveryOfficer || prev.deliveryOfficer,
                deliveryPosition: project.deliveryPosition || prev.deliveryPosition,
                videoLink: project.videoLink || prev.videoLink,
                authorizedPerson: project.authorizedPerson || prev.authorizedPerson,
                district: project.district || prev.district,
                subdistrict: project.subdistrict || prev.subdistrict,
                postalCode: project.postalCode || prev.postalCode,
                region: project.region || prev.region,
                coordinatorId: project.coordinatorId || prev.coordinatorId,
                epcId: project.epcId || prev.epcId,
                description: project.description || prev.description
              }));
              
              console.log('EditProject - Form data merged with API data');
            }
          } catch (apiError) {
            console.warn('EditProject - Could not fetch from API, using sessionStorage only:', apiError);
          }
        }
      } else if (id) {
        // Fetch from API if not in sessionStorage and id exists
        console.log('EditProject - No sessionStorage, fetching from API, ID:', id);
        const response = await projectsAPI.getProjectById(id);
        console.log('EditProject - API response:', response);
        
        if (response.success && response.data) {
          const project = response.data;
          console.log('EditProject - Project data from API:', project);
          setFormData({
            agencyName: project.agencyName || '',
            agencyCode: project.agencyCode || '',
            address: project.address || '',
            position: project.position || '',
            authority: project.authority || '',
            upperUnit: project.upperUnit || '',
            lowerUnit: project.lowerUnit || '',
            estimatedUsers: project.estimatedUsers || '',
            directorName: project.directorName || '',
            deliveryOfficer: project.deliveryOfficer || '',
            deliveryPosition: project.deliveryPosition || '',
            province: project.province || '',
            district: project.district || '',
            subdistrict: project.subdistrict || '',
            postalCode: project.postalCode || '',
            region: project.region || '',
            ministry: project.ministry || '',
            videoLink: project.videoLink || '',
            authorizedPerson: project.authorizedPerson || '',
            affiliation: project.affiliation || '',
            coordinatorId: project.coordinatorId || '',
            coordinator1Name: project.coordinator1Name || '',
            coordinator1Phone: project.coordinator1Phone || '',
            coordinator1Code: project.coordinator1Code || '',
            coordinator2Name: project.coordinator2Name || '',
            coordinator2Phone: project.coordinator2Phone || '',
            coordinator2Code: project.coordinator2Code || '',
            epcId: project.epcId || '',
            description: project.description || ''
          });
          console.log('EditProject - Form data set from API');
        } else {
          console.error('EditProject - API returned no data or failed');
          toast({
            title: "❌ ไม่พบโครงการ",
            description: "ไม่พบข้อมูลโครงการที่ต้องการแก้ไข",
            variant: "destructive",
          });
        }
      } else {
        console.error('EditProject - No ID provided and no sessionStorage');
        toast({
          title: "❌ ไม่พบ ID",
          description: "ไม่พบ ID ของโครงการที่จะแก้ไข กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถโหลดข้อมูลโครงการได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCoordinators = async () => {
    try {
      const response = await coordinatorsAPI.getCoordinators({ status: 'approved' });
      console.log('Coordinators API response:', response);
      
      if (response.success) {
        // Handle both MongoDB and MySQL response formats
        const coordinatorsData = response.data.coordinators || response.data || [];
        setCoordinators(coordinatorsData);
        console.log('Loaded coordinators:', coordinatorsData);
      }
    } catch (error) {
      console.error('Error loading coordinators:', error);
    }
  };

  const loadEpcCompanies = async () => {
    try {
      const response = await epcAPI.getEpcList();
      console.log('EPC API response:', response);
      
      if (response.success) {
        const epcData = response.data || [];
        setEpcCompanies(epcData);
        console.log('Loaded EPC companies:', epcData);
      }
    } catch (error) {
      console.error('Error loading EPC companies:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.agencyName || !formData.coordinatorId) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        text: 'กรุณากรอกชื่อหน่วยงานและเลือกผู้ประสานงาน',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      setLoading(true);

      const response = await projectsAPI.updateProject(id, formData);

      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ!',
          text: 'ข้อมูลโครงการถูกอัปเดตเรียบร้อยแล้ว',
          confirmButtonColor: '#10b981'
        });

        navigate('/admin/projects');
      } else {
        throw new Error(response.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
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
              แก้ไขข้อมูลโครงการ
            </h1>
            <p className="text-slate-600 mt-1">
              {formData.agencyName || 'กำลังโหลด...'}
            </p>
          </div>
        </div>

        {loading && !formData.agencyName ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Agency Information */}
            <Card className="mb-6 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Building2 className="h-5 w-5" />
                  ข้อมูลหน่วยงาน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* แถวที่ 1: ชื่อหน่วยงาน, รหัสหน่วยงาน, ที่อยู่หน่วยงาน */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>ชื่อหน่วยงาน <span className="text-red-500">*</span></Label>
                    <Input
                      value={formData.agencyName}
                      onChange={(e) => handleInputChange('agencyName', e.target.value)}
                      placeholder="กรอกชื่อหน่วยงาน..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>รหัสหน่วยงาน</Label>
                    <Input
                      value={formData.agencyCode}
                      onChange={(e) => handleInputChange('agencyCode', e.target.value)}
                      placeholder="กรอกรหัสหน่วยงาน..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>ที่อยู่หน่วยงาน</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="กรอกที่อยู่..."
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* แถวที่ 2: ตำแหน่ง, อำนาจ, จังหวัด */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>ตำแหน่ง</Label>
                    <Input
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="กรอกตำแหน่ง..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>อำนาจ</Label>
                    <Input
                      value={formData.authority}
                      onChange={(e) => handleInputChange('authority', e.target.value)}
                      placeholder="กรอกอำนาจ..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>จังหวัด</Label>
                    <Input
                      value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      placeholder="กรอกจังหวัด..."
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* แถวที่ 3: หน่วยเหนือผู้ใช้ไฟ, หน่วยกอาฟไม้ใช้, ประมาณผู้ใช้ไฟ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>หน่วยเหนือผู้ใช้ไฟ</Label>
                    <Input
                      value={formData.upperUnit}
                      onChange={(e) => handleInputChange('upperUnit', e.target.value)}
                      placeholder="กรอกหน่วยเหนือผู้ใช้ไฟ..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>หน่วยกอาฟไม้ใช้</Label>
                    <Input
                      value={formData.lowerUnit}
                      onChange={(e) => handleInputChange('lowerUnit', e.target.value)}
                      placeholder="กรอกหน่วยกอาฟไม้ใช้..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>ประมาณผู้ใช้ไฟ</Label>
                    <Input
                      type="number"
                      value={formData.estimatedUsers}
                      onChange={(e) => handleInputChange('estimatedUsers', e.target.value)}
                      placeholder="กรอกจำนวนผู้ใช้ไฟ..."
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* แถวที่ 4: ชื่อ ผอ., เเนตชื่อตัดยอบส่งมอบงาน, ชื่อเเหน่งมอบงาน */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>ชื่อ ผอ.</Label>
                    <Input
                      value={formData.directorName}
                      onChange={(e) => handleInputChange('directorName', e.target.value)}
                      placeholder="กรอกชื่อ ผอ...."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>เเนตชื่อตัดยอบส่งมอบงาน</Label>
                    <Input
                      value={formData.deliveryOfficer}
                      onChange={(e) => handleInputChange('deliveryOfficer', e.target.value)}
                      placeholder="กรอกเเนตชื่อตัดยอบส่งมอบงาน..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>ชื่อเเหน่งมอบงาน</Label>
                    <Input
                      value={formData.deliveryPosition}
                      onChange={(e) => handleInputChange('deliveryPosition', e.target.value)}
                      placeholder="กรอกชื่อเเหน่งมอบงาน..."
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* แถวที่ 5: กระทรวง, ลิงค์วิดีโอ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>กระทรวง</Label>
                    <Input
                      value={formData.ministry}
                      onChange={(e) => handleInputChange('ministry', e.target.value)}
                      placeholder="กรอกชื่อกระทรวง..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>ลิงค์วิดีโอ</Label>
                    <Input
                      value={formData.videoLink}
                      onChange={(e) => handleInputChange('videoLink', e.target.value)}
                      placeholder="กรอกลิงค์วิดีโอ..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordinator */}
            <Card className="mb-6 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <User className="h-5 w-5" />
                  ผู้ประสานงาน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* ผู้ประสานงาน 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>ชื่อ ผู้ประสานงาน 1</Label>
                    <select
                      value={formData.coordinatorId}
                      onChange={(e) => {
                        const selectedCoord = coordinators.find(c => c.id === parseInt(e.target.value));
                        handleInputChange('coordinatorId', e.target.value);
                        if (selectedCoord) {
                          handleInputChange('coordinator1Name', selectedCoord.fullName || selectedCoord.name);
                          handleInputChange('coordinator1Phone', selectedCoord.phone || selectedCoord.phoneNumber);
                          handleInputChange('coordinator1Code', selectedCoord.id);
                        }
                      }}
                      className="w-full mt-2 border rounded-lg px-3 py-2"
                    >
                      <option value="">-- เลือกผู้ประสานงาน --</option>
                      {coordinators.map((coord) => (
                        <option key={coord.id} value={coord.id}>
                          {coord.fullName || coord.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>เบอร์ผู้ประสานงาน 1</Label>
                    <Input
                      value={formData.coordinator1Phone}
                      onChange={(e) => handleInputChange('coordinator1Phone', e.target.value)}
                      placeholder="เบอร์โทรศัพท์..."
                      className="mt-2"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>รหัสผู้ประสานงาน</Label>
                    <Input
                      value={formData.coordinator1Code}
                      onChange={(e) => handleInputChange('coordinator1Code', e.target.value)}
                      placeholder="รหัสผู้ประสานงาน..."
                      className="mt-2"
                      readOnly
                    />
                  </div>
                </div>

                {/* ผู้ประสานงาน 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อ ผู้ประสานงาน 2</Label>
                    <Input
                      value={formData.coordinator2Name}
                      onChange={(e) => handleInputChange('coordinator2Name', e.target.value)}
                      placeholder="กรอกชื่อผู้ประสานงาน 2..."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>เบอร์ผู้ประสานงาน 2</Label>
                    <Input
                      value={formData.coordinator2Phone}
                      onChange={(e) => handleInputChange('coordinator2Phone', e.target.value)}
                      placeholder="เบอร์โทรศัพท์..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EPC Company */}
            <Card className="mb-6 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Building2 className="h-5 w-5" />
                  EPC ผู้รับผิดชอบ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label>เลือก EPC ผู้รับผิดชอบ</Label>
                  <select
                    value={formData.epcId}
                    onChange={(e) => handleInputChange('epcId', e.target.value)}
                    className="w-full mt-2 border rounded-lg px-3 py-2"
                  >
                    <option value="">-- เลือก EPC ผู้รับผิดชอบ --</option>
                    {epcCompanies.map((epc) => (
                      <option key={epc.id} value={epc.id}>
                        {epc.epcName || epc.companyName} - {epc.taxId || 'ไม่ระบุเลขภาษี'}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/projects')}
                className="flex-1 h-12"
                disabled={loading}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                <Save className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProject;



