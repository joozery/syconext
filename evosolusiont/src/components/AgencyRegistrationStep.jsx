import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { projectsAPI, coordinatorsAPI } from '@/services/api';
import Swal from 'sweetalert2';

const AgencyRegistrationStep = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract projectId from URL path
  const getProjectIdFromUrl = () => {
    const match = location.pathname.match(/\/admin\/agency-registration\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const projectId = getProjectIdFromUrl();
  
  console.log('AgencyRegistrationStep - URL:', location.pathname);
  console.log('AgencyRegistrationStep - projectId:', projectId);
  
  const [loading, setLoading] = useState(false);
  const [documentFiles, setDocumentFiles] = useState([]); // Changed to array for multiple files
  const [existingDocuments, setExistingDocuments] = useState([]); // เก็บไฟล์ที่มีอยู่แล้ว
  const [coordinatorsList, setCoordinatorsList] = useState([]);
  
  // State สำหรับข้อมูลจังหวัด อำเภอ ตำบล
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [loadingLocation, setLoadingLocation] = useState({
    provinces: false,
    districts: false,
    subdistricts: false,
  });
  
  const [formData, setFormData] = useState({
    directorName: '',
    directorPhone: '',
    directorEmail: '',
    address: '',
    subdistrict: '',
    district: '',
    province: '',
    postalCode: '',
    affiliation: '',
    coordinatorId: '',
    coordinatorName: '',
    coordinatorPhone: '',
    registrationDate: '',
    notes: '', // เพิ่ม field หมายเหตุ
  });

  useEffect(() => {
    loadProjectData();
    loadCoordinators();
    fetchProvinces();
    loadExistingDocuments();
  }, [projectId]);

  // โหลดไฟล์ที่อัพโหลดไว้แล้ว
  const loadExistingDocuments = async () => {
    try {
      const response = await projectsAPI.getStepsByProject(projectId);
      const steps = response.data?.steps || response.data || [];
      
      console.log('📄 All steps:', steps);
      
      // หา step 1 (ลงทะเบียนหน่วยงาน)
      const step1 = steps.find(s => s.stepNumber === 1);
      console.log('📄 Step 1:', step1);
      
      if (step1 && step1.documentName) {
        console.log('📄 Step 1 documentName:', step1.documentName);
        console.log('📄 Step 1 documentPath:', step1.documentPath);
        
        try {
          // Parse JSON array
          const docNames = JSON.parse(step1.documentName);
          const docPaths = step1.documentPath ? JSON.parse(step1.documentPath) : [];
          
          const docs = docNames.map((name, index) => ({
            name: name,
            path: docPaths[index] || '',
            existing: true
          }));
          
          console.log('📄 Parsed documents:', docs);
          setExistingDocuments(docs);
        } catch (e) {
          console.log('📄 Not JSON format, using old format');
          // ถ้าไม่ใช่ JSON array (format เก่า)
          if (step1.documentName) {
            setExistingDocuments([{
              name: step1.documentName,
              path: step1.documentPath || '',
              existing: true
            }]);
          }
        }
      } else {
        console.log('📄 No documents found for step 1');
      }
    } catch (error) {
      console.error('Error loading existing documents:', error);
    }
  };

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getProjectById(projectId);
      const project = response.data || response;

      console.log('📝 Project data:', project);
      console.log('📝 Project notes:', project.notes);

      setFormData({
        directorName: project.directorName || '',
        directorPhone: project.directorPhone || '',
        directorEmail: project.directorEmail || '',
        address: project.address || '',
        subdistrict: project.subdistrict || '',
        district: project.district || '',
        province: project.province || '',
        postalCode: project.postalCode || '',
        affiliation: project.affiliation || '',
        coordinatorId: project.coordinatorId?.toString() || '',
        coordinatorName: project.coordinatorName || '',
        coordinatorPhone: project.coordinatorPhone || '',
        registrationDate: project.registrationDate || '',
        notes: project.notes || '', // เพิ่ม notes
      });

      // Set selected values for dropdowns and load dependent data
      if (project.province) {
        setSelectedProvince(project.province);
        // Load districts immediately using API
        await loadDistrictsForProvince(project.province);
        
        if (project.district) {
          setSelectedDistrict(project.district);
          // Load subdistricts immediately using API
          await loadSubdistrictsForDistrict(project.province, project.district);
          
          if (project.subdistrict) {
            setSelectedSubdistrict(project.subdistrict);
          }
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลโครงการได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to load districts without depending on provinces state
  const loadDistrictsForProvince = async (provinceName) => {
    try {
      setLoadingLocation(prev => ({ ...prev, districts: true }));
      const [provincesRes, districtsRes] = await Promise.all([
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json'),
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json')
      ]);
      
      if (!provincesRes.ok || !districtsRes.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const provincesData = await provincesRes.json();
      const districtsData = await districtsRes.json();
      
      const province = provincesData.find(p => p.name_th === provinceName);
      if (province) {
        const filteredDistricts = districtsData.filter(d => d.province_id === province.id);
        setDistricts(filteredDistricts);
      }
    } catch (error) {
      console.error('Error loading districts:', error);
      toast({
        title: "⚠️ ไม่สามารถโหลดอำเภอได้",
        description: "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoadingLocation(prev => ({ ...prev, districts: false }));
    }
  };
  
  // Helper function to load subdistricts without depending on provinces/districts state
  const loadSubdistrictsForDistrict = async (provinceName, districtName) => {
    try {
      setLoadingLocation(prev => ({ ...prev, subdistricts: true }));
      const [provincesRes, districtsRes, subdistrictsRes] = await Promise.all([
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json'),
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json'),
        fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/sub_district.json')
      ]);
      
      if (!provincesRes.ok || !districtsRes.ok || !subdistrictsRes.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const provincesData = await provincesRes.json();
      const districtsData = await districtsRes.json();
      const subdistrictsData = await subdistrictsRes.json();
      
      const province = provincesData.find(p => p.name_th === provinceName);
      if (province) {
        const district = districtsData.find(d => d.name_th === districtName && d.province_id === province.id);
        if (district) {
          const filteredSubdistricts = subdistrictsData.filter(s => s.district_id === district.id);
          setSubdistricts(filteredSubdistricts);
        }
      }
    } catch (error) {
      console.error('Error loading subdistricts:', error);
      toast({
        title: "⚠️ ไม่สามารถโหลดตำบลได้",
        description: "กรุณาเลือกอำเภอใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setLoadingLocation(prev => ({ ...prev, subdistricts: false }));
    }
  };

  // Effect to reload districts and subdistricts when provinces are loaded and formData has province
  useEffect(() => {
    if (provinces.length > 0 && formData.province && !selectedProvince) {
      setSelectedProvince(formData.province);
      fetchDistricts(formData.province).then(() => {
        if (formData.district) {
          setSelectedDistrict(formData.district);
          fetchSubdistricts(formData.province, formData.district).then(() => {
            if (formData.subdistrict) {
              setSelectedSubdistrict(formData.subdistrict);
            }
          });
        }
      });
    }
  }, [provinces, formData.province]);

  const loadCoordinators = async () => {
    try {
      const response = await coordinatorsAPI.getCoordinators();
      const coordinators = response.data?.coordinators || response.data || [];
      setCoordinatorsList(coordinators);
    } catch (error) {
      console.error('Error loading coordinators:', error);
    }
  };

  // ฟังก์ชันดึงข้อมูลจังหวัด
  const fetchProvinces = async () => {
    setLoadingLocation(prev => ({ ...prev, provinces: true }));
    try {
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProvinces(data || []);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลจังหวัดได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoadingLocation(prev => ({ ...prev, provinces: false }));
    }
  };

  // ฟังก์ชันดึงข้อมูลอำเภอ
  const fetchDistricts = async (provinceName) => {
    if (!provinceName) return;
    setLoadingLocation(prev => ({ ...prev, districts: true }));
    try {
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const province = provinces.find(p => p.name_th === provinceName);
      if (province) {
        const filteredDistricts = data.filter(d => d.province_id === province.id);
        setDistricts(filteredDistricts);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลอำเภอได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoadingLocation(prev => ({ ...prev, districts: false }));
    }
  };

  // ฟังก์ชันดึงข้อมูลตำบล
  const fetchSubdistricts = async (provinceName, districtName) => {
    if (!provinceName || !districtName) return;
    setLoadingLocation(prev => ({ ...prev, subdistricts: true }));
    try {
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/sub_district.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const district = districts.find(d => d.name_th === districtName);
      if (district) {
        const filteredSubdistricts = data.filter(sd => sd.district_id === district.id);
        setSubdistricts(filteredSubdistricts);
      }
    } catch (error) {
      console.error('Error fetching subdistricts:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลตำบลได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoadingLocation(prev => ({ ...prev, subdistricts: false }));
    }
  };

  // ฟังก์ชันดึงรหัสไปรษณีย์อัตโนมัติ
  const fetchPostalCode = async (subdistrictName) => {
    if (!subdistrictName) return;
    
    try {
      const subdistrict = subdistricts.find(s => s.name_th === subdistrictName);
      if (subdistrict && subdistrict.zip_code) {
        setFormData(prev => ({ ...prev, postalCode: subdistrict.zip_code.toString() }));
      }
    } catch (error) {
      console.error('Error fetching postal code:', error);
    }
  };

  // ฟังก์ชันจัดการการเลือกจังหวัด
  const handleProvinceChange = async (value) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setSelectedSubdistrict('');
    setDistricts([]);
    setSubdistricts([]);
    setFormData(prev => ({ 
      ...prev, 
      province: value,
      district: '',
      subdistrict: '',
      postalCode: ''
    }));
    
    await fetchDistricts(value);
  };

  // ฟังก์ชันจัดการการเลือกอำเภอ
  const handleDistrictChange = async (value) => {
    setSelectedDistrict(value);
    setSelectedSubdistrict('');
    setSubdistricts([]);
    setFormData(prev => ({ 
      ...prev, 
      district: value,
      subdistrict: '',
      postalCode: ''
    }));
    
    await fetchSubdistricts(selectedProvince, value);
  };

  // ฟังก์ชันจัดการการเลือกตำบล
  const handleSubdistrictChange = async (value) => {
    setSelectedSubdistrict(value);
    
    setFormData(prev => ({ 
      ...prev, 
      subdistrict: value
    }));
    
    await fetchPostalCode(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoordinatorChange = (e) => {
    const coordinatorId = e.target.value;
    const selectedCoordinator = coordinatorsList.find(c => c.id.toString() === coordinatorId);
    
    if (selectedCoordinator) {
      setFormData(prev => ({
        ...prev,
        coordinatorId: coordinatorId,
        coordinatorName: selectedCoordinator.fullName || '',
        coordinatorPhone: selectedCoordinator.phone || '',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        coordinatorId: '',
        coordinatorName: '',
        coordinatorPhone: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    if (files.length > 0) {
      setDocumentFiles(files); // Store multiple files
      toast({
        title: "✅ เลือกไฟล์สำเร็จ",
        description: `เลือกแล้ว ${files.length} ไฟล์`
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields (optional - เก็บไว้ถ้าต้องการ validation)
      // if (!formData.directorName) {
      //   toast({
      //     title: "⚠️ กรุณากรอกข้อมูล",
      //     description: "กรุณากรอกชื่อผู้อำนวยการ",
      //     variant: "destructive",
      //   });
      //   setLoading(false);
      //   return;
      // }

      // Validate location fields (optional - comment out to allow partial updates)
      // if (!selectedProvince || !selectedDistrict || !selectedSubdistrict) {
      //   toast({
      //     title: "⚠️ กรุณากรอกข้อมูล",
      //     description: "กรุณาเลือกจังหวัด อำเภอ และตำบล ให้ครบถ้วน",
      //     variant: "destructive",
      //   });
      //   setLoading(false);
      //   return;
      // }

      // อัพเดทข้อมูลโครงการ
      const coordinatorIdValue = formData.coordinatorId ? parseInt(formData.coordinatorId) : null;
      
      // Only send editable fields to backend
      const updateData = {
        directorName: formData.directorName || null,
        directorPhone: formData.directorPhone || null,
        directorEmail: formData.directorEmail || null,
        address: formData.address || null,
        province: selectedProvince || null,
        district: selectedDistrict || null,
        subdistrict: selectedSubdistrict || null,
        postalCode: formData.postalCode || null,
        affiliation: formData.affiliation || null,
        coordinatorId: isNaN(coordinatorIdValue) ? null : coordinatorIdValue
      };
      
      // Filter out null values (keep only fields that have values)
      const filteredData = Object.keys(updateData).reduce((acc, key) => {
        const value = updateData[key];
        if (value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      console.log('📤 Sending data to backend:', filteredData);
      
      await projectsAPI.updateProject(projectId, filteredData);

      // อัพโหลดเอกสาร (ถ้ามี) - รองรับหลายไฟล์
      if (documentFiles && documentFiles.length > 0) {
        const uploadFormData = new FormData();
        // Append multiple files
        documentFiles.forEach((file) => {
          uploadFormData.append('documents', file);
        });
        await projectsAPI.uploadStepEvidence(projectId, 1, uploadFormData);
        
        toast({
          title: "✅ อัพโหลดเอกสารสำเร็จ",
          description: `อัพโหลดแล้ว ${documentFiles.length} ไฟล์`,
        });
      }

      toast({
        title: "✅ บันทึกสำเร็จ",
        description: "บันทึกข้อมูลลงทะเบียนหน่วยงานเรียบร้อยแล้ว",
      });

      // กลับไปหน้ารายละเอียดโครงการ
      navigate(`/admin/status/project/${projectId}`);
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/admin/status/project/${projectId}`);
  };

  if (loading && !formData.directorName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับ
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ลงทะเบียนหน่วยงาน</h1>
          <p className="text-sm text-gray-500 mt-1">แก้ไขข้อมูลการลงทะเบียนหน่วยงาน - ขั้นตอนที่ 1/16</p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-lg">ข้อมูลหน่วยงาน</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ชื่อ ผอ. */}
            <div>
              <Label htmlFor="directorName" className="text-sm font-medium">
                ชื่อ ผอ.
              </Label>
              <Input
                id="directorName"
                name="directorName"
                value={formData.directorName}
                onChange={handleInputChange}
                placeholder="ชื่อผู้อำนวยการ"
                className="mt-1"
              />
            </div>

            {/* เบอร์ติดต่อหน่วยงาน */}
            <div>
              <Label htmlFor="directorPhone" className="text-sm font-medium">
                เบอร์ติดต่อหน่วยงาน
              </Label>
              <Input
                id="directorPhone"
                name="directorPhone"
                value={formData.directorPhone}
                onChange={handleInputChange}
                placeholder="เบอร์โทรศัพท์"
                className="mt-1"
              />
            </div>

            {/* อีเมลหน่วยงาน */}
            <div>
              <Label htmlFor="directorEmail" className="text-sm font-medium">
                อีเมลหน่วยงาน
              </Label>
              <Input
                id="directorEmail"
                name="directorEmail"
                type="email"
                value={formData.directorEmail}
                onChange={handleInputChange}
                placeholder="อีเมล"
                className="mt-1"
              />
            </div>

            {/* ที่อยู่ */}
            <div>
              <Label htmlFor="address" className="text-sm font-medium">
                ที่อยู่
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="ที่อยู่"
                className="mt-1"
              />
            </div>

            {/* จังหวัด */}
            <div>
              <Label className="text-sm font-medium">
                จังหวัด <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={loadingLocation.provinces ? "กำลังโหลด..." : "เลือกจังหวัด"} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {provinces.map((province) => (
                    <SelectItem key={province.id} value={province.name_th}>
                      {province.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* อำเภอ */}
            <div>
              <Label className="text-sm font-medium">
                อำเภอ <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={selectedDistrict} 
                onValueChange={handleDistrictChange}
                disabled={!selectedProvince || loadingLocation.districts}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={
                    loadingLocation.districts ? "กำลังโหลด..." : 
                    selectedProvince ? "เลือกอำเภอ" : "เลือกจังหวัดก่อน"
                  } />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.name_th}>
                      {district.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ตำบล */}
            <div>
              <Label className="text-sm font-medium">
                ตำบล <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={selectedSubdistrict} 
                onValueChange={handleSubdistrictChange}
                disabled={!selectedDistrict || loadingLocation.subdistricts}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={
                    loadingLocation.subdistricts ? "กำลังโหลด..." : 
                    selectedDistrict ? "เลือกตำบล" : "เลือกอำเภอก่อน"
                  } />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {subdistricts.map((subdistrict) => (
                    <SelectItem key={subdistrict.id} value={subdistrict.name_th}>
                      {subdistrict.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* รหัสไปรษณีย์ */}
            <div>
              <Label htmlFor="postalCode" className="text-sm font-medium">
                รหัสไปรษณีย์ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                placeholder="รหัสไปรษณีย์ (อัตโนมัติ)"
                className="mt-1 bg-gray-50"
                readOnly
              />
            </div>

            {/* สังกัด */}
            <div>
              <Label htmlFor="affiliation" className="text-sm font-medium">
                สังกัด
              </Label>
              <Input
                id="affiliation"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleInputChange}
                placeholder="สังกัด"
                className="mt-1"
              />
            </div>

            {/* ชื่อ ผู้ประสานงาน */}
            <div>
              <Label htmlFor="coordinatorId" className="text-sm font-medium">
                ชื่อ ผู้ประสานงาน
              </Label>
              <select
                id="coordinatorId"
                name="coordinatorId"
                value={formData.coordinatorId}
                onChange={handleCoordinatorChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกผู้ประสานงาน</option>
                {coordinatorsList.map((coordinator) => (
                  <option key={coordinator.id} value={coordinator.id}>
                    {coordinator.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* เบอร์ผู้ประสานงาน */}
            <div>
              <Label htmlFor="coordinatorPhone" className="text-sm font-medium">
                เบอร์ผู้ประสานงาน
              </Label>
              <Input
                id="coordinatorPhone"
                name="coordinatorPhone"
                value={formData.coordinatorPhone}
                onChange={handleInputChange}
                placeholder="เบอร์โทรศัพท์"
                className="mt-1 bg-gray-50"
                disabled
              />
            </div>

            {/* ระบุวันที่ */}
            <div>
              <Label htmlFor="registrationDate" className="text-sm font-medium">
                ระบุวันที่
              </Label>
              <Input
                id="registrationDate"
                name="registrationDate"
                type="date"
                value={formData.registrationDate}
                onChange={handleInputChange}
                placeholder="dd/mm/yyyy"
                className="mt-1"
              />
            </div>
          </div>

          {/* หมายเหตุ */}
          <div className="mt-4">
            <Label htmlFor="notes" className="text-sm font-medium">
              หมายเหตุ
            </Label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="กรอกหมายเหตุ (ถ้ามี)"
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* แสดงไฟล์ที่อัพโหลดไว้แล้ว */}
          {existingDocuments.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm font-medium mb-2 block">
                ไฟล์ที่อัพโหลดไว้แล้ว ({existingDocuments.length} ไฟล์)
              </Label>
              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                {existingDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-blue-600">📄</span>
                    <a 
                      href={`http://localhost:8000${doc.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 hover:underline truncate"
                    >
                      {idx + 1}. {doc.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* อัพโหลดเอกสาร (Multiple Files) */}
          <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.zip,.rar"
                />
                <div className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2">
                  <Upload size={18} />
                  เลือกเอกสาร (สูงสุด 20 ไฟล์)
                </div>
              </label>
              <div className="text-sm text-gray-600">
                {documentFiles && documentFiles.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-green-600 font-medium">
                      ✓ เลือกแล้ว {documentFiles.length} ไฟล์
                    </span>
                    <div className="text-xs text-gray-500 max-w-md">
                      {documentFiles.slice(0, 3).map((file, idx) => (
                        <div key={idx} className="truncate">
                          {idx + 1}. {file.name}
                        </div>
                      ))}
                      {documentFiles.length > 3 && (
                        <div className="text-gray-400">+{documentFiles.length - 3} ไฟล์อื่นๆ</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">ยังไม่ได้เลือกเอกสาร</span>
                )}
              </div>
            </div>
          </div>

          {/* ปุ่มแก้ไข */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
            >
              {loading ? (
                <>กำลังบันทึก...</>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  แก้ไข
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyRegistrationStep;

