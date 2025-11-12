
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Upload, AlertCircle, Building2, CheckCircle, ArrowRight, X, FileText, User, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { epcAPI } from '@/services/api';

// CSS สำหรับแก้ไขปัญหา dropdown positioning และ scroll overlap
const dropdownStyles = `
  .select-dropdown-fix {
    position: relative;
    z-index: 9999;
  }
  
  .select-dropdown-fix [data-radix-popper-content-wrapper] {
    z-index: 9999 !important;
  }
  
  .select-dropdown-fix [data-radix-select-content] {
    max-height: 200px;
    overflow-y: auto;
  }
  
  /* แก้ไขปัญหา scroll overlap กับ navbar */
  .register-epc-container {
    margin-top: 0;
    padding-top: 2rem;
    position: relative;
    z-index: 1;
  }
  
  /* ป้องกันฟอร์มขึ้นมาทับ navbar เมื่อ scroll */
  .register-epc-form {
    position: relative;
    z-index: 1;
    background: white;
  }
  
  /* เพิ่ม margin-top สำหรับ content area */
  .register-epc-content {
    margin-top: 1rem;
  }
`;

const FileUploadInput = ({ label, id, onFileSelect, fileName }) => {
  const inputRef = useRef(null);
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <Button type="button" variant="outline" onClick={() => inputRef.current.click()} className="w-28 justify-center">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Input ref={inputRef} id={id} type="file" className="hidden" onChange={onFileSelect} accept=".pdf" />
        <span className="text-sm text-slate-500 truncate" title={fileName}>{fileName || "No file selected"}</span>
      </div>
    </div>
  );
};

const RegisterEpc = () => {
  const [epcData, setEpcData] = useState({
    epcName: '',
    epcAddress: '',
    epcContact: '',
    taxId: '',
    coordinatorName: '',
    coordinatorContact: '',
    province: '',
    district: '',
    subdistrict: '',
    postalCode: '',
  });

  // State สำหรับข้อมูลจังหวัด อำเภอ ตำบล
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    subdistricts: false,
  });
  const [files, setFiles] = useState({
    nda: null,
    companyCert: null,
    employmentContract: null,
    tndtContract: null,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // โหลดข้อมูลจังหวัดเมื่อ component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEpcData(prev => ({ ...prev, [id]: value }));
  };

  // ฟังก์ชันดึงข้อมูลจังหวัด
  const fetchProvinces = async () => {
    setLoading(prev => ({ ...prev, provinces: true }));
    try {
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProvinces(data || []);
    } catch (error) {
      console.error('Error fetching provinces from GitHub API:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลจังหวัดได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  // ฟังก์ชันดึงข้อมูลอำเภอ
  const fetchDistricts = async (provinceName) => {
    if (!provinceName) return;
    setLoading(prev => ({ ...prev, districts: true }));
    try {
      // Load all districts and filter by province
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Find province ID
      const province = provinces.find(p => p.name_th === provinceName);
      if (province) {
        const filteredDistricts = data.filter(d => d.province_id === province.id);
        setDistricts(filteredDistricts);
      }
    } catch (error) {
      console.error('Error fetching districts from GitHub API:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลอำเภอ/เขตได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // ฟังก์ชันดึงข้อมูลตำบล
  const fetchSubdistricts = async (provinceName, districtName) => {
    if (!provinceName || !districtName) return;
    setLoading(prev => ({ ...prev, subdistricts: true }));
    try {
      // Load all subdistricts and filter by district
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/sub_district.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Find district ID
      const district = districts.find(d => d.name_th === districtName);
      if (district) {
        const filteredSubdistricts = data.filter(sd => sd.district_id === district.id);
        setSubdistricts(filteredSubdistricts);
      }
    } catch (error) {
      console.error('Error fetching subdistricts from GitHub API:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถโหลดข้อมูลตำบล/แขวงได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(prev => ({ ...prev, subdistricts: false }));
    }
  };

  // ฟังก์ชันดึงรหัสไปรษณีย์อัตโนมัติ
  const fetchPostalCode = async (provinceName, districtName, subdistrictName) => {
    if (!provinceName || !districtName || !subdistrictName) return;
    
    try {
      // Auto-fill postal code from subdistricts data
      const subdistrict = subdistricts.find(s => s.name_th === subdistrictName);
      if (subdistrict && subdistrict.zip_code) {
        setEpcData(prev => ({ ...prev, postalCode: subdistrict.zip_code.toString() }));
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
    setEpcData(prev => ({ 
      ...prev, 
      province: value,
      district: '',
      subdistrict: '',
      postalCode: ''
    }));
    
    // ส่งชื่อจังหวัดไปยัง API
    await fetchDistricts(value);
  };

  // ฟังก์ชันจัดการการเลือกอำเภอ
  const handleDistrictChange = async (value) => {
    setSelectedDistrict(value);
    setSelectedSubdistrict('');
    setSubdistricts([]);
    setEpcData(prev => ({ 
      ...prev, 
      district: value,
      subdistrict: '',
      postalCode: ''
    }));
    
    // ส่งชื่อจังหวัดและอำเภอไปยัง API
    await fetchSubdistricts(selectedProvince, value);
  };

  // ฟังก์ชันจัดการการเลือกตำบล
  const handleSubdistrictChange = async (value) => {
    setSelectedSubdistrict(value);
    
    // ดึงรหัสไปรษณีย์อัตโนมัติ
    await fetchPostalCode(selectedProvince, selectedDistrict, value);
    
    setEpcData(prev => ({ 
      ...prev, 
      subdistrict: value
    }));
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      await Swal.fire({
        icon: 'error',
        title: 'ประเภทไฟล์ไม่ถูกต้อง',
        text: 'กรุณาอัปโหลดไฟล์ PDF เท่านั้น',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
      return;
    }
    if (file && file.size > 20 * 1024 * 1024) { // 20MB
      await Swal.fire({
        icon: 'error',
        title: 'ไฟล์ใหญ่เกินไป',
        text: 'ขนาดไฟล์ต้องไม่เกิน 20MB',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
      return;
    }
    setFiles(prev => ({ ...prev, [fileType]: file }));
    
    // Show success message
    await Swal.fire({
      icon: 'success',
      title: 'อัปโหลดไฟล์สำเร็จ',
      text: `ไฟล์ ${fileType} ถูกอัปโหลดเรียบร้อยแล้ว`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  // Helper function to get file label
  const getFileLabel = (fileKey) => {
    const labels = {
      nda: 'สัญญา NDA',
      companyCert: 'หนังสือรับรองบริษัท',
      employmentContract: 'เอกสารสัญญาจ้างงาน',
      tndtContract: 'ไฟล์อื่นๆ'
    };
    return labels[fileKey] || fileKey;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!epcData.epcName || !epcData.taxId || !epcData.epcAddress || 
        !selectedProvince || !selectedDistrict || !selectedSubdistrict || 
        !epcData.postalCode || !epcData.epcContact) {
      await Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'ยืนยันการส่งข้อมูล',
      html: `
        <div class="text-left">
          <p><strong>ชื่อบริษัท:</strong> ${epcData.epcName}</p>
          <p><strong>เลขที่ผู้เสียภาษี:</strong> ${epcData.taxId}</p>
          <p><strong>ที่อยู่:</strong> ${epcData.epcAddress}</p>
          <p><strong>จังหวัด:</strong> ${selectedProvince}</p>
          <p><strong>อำเภอ/เขต:</strong> ${selectedDistrict}</p>
          <p><strong>ตำบล/แขวง:</strong> ${selectedSubdistrict}</p>
          <p><strong>รหัสไปรษณีย์:</strong> ${epcData.postalCode}</p>
          <p><strong>เบอร์ติดต่อ:</strong> ${epcData.epcContact}</p>
          ${epcData.coordinatorName ? `<p><strong>ชื่อผู้ติดต่อ:</strong> ${epcData.coordinatorName}</p>` : ''}
          ${epcData.coordinatorContact ? `<p><strong>เบอร์ผู้ติดต่อ:</strong> ${epcData.coordinatorContact}</p>` : ''}
          
          <div class="mt-4">
            <h4 class="font-semibold text-gray-700 mb-2">ไฟล์ที่อัปโหลด:</h4>
            ${Object.keys(files).filter(key => files[key]).length > 0 ? 
              Object.keys(files).filter(key => files[key]).map(key => 
                `<div class="flex items-center space-x-2 mb-2">
                  <span class="text-sm text-gray-600">${getFileLabel(key)}:</span>
                  <span class="text-sm font-medium text-blue-600">${files[key].name}</span>
                  <button type="button" onclick="window.openPreview('${key}')" class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">ดูไฟล์</button>
                </div>`
              ).join('') : 
              '<p class="text-sm text-gray-500">ไม่มีไฟล์อัปโหลด</p>'
            }
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันส่งข้อมูล',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      reverseButtons: true,
      didOpen: () => {
        // Add preview function to window
        window.openPreview = (fileKey) => {
          const file = files[fileKey];
          if (file) {
            const url = URL.createObjectURL(file);
            window.open(url, '_blank');
          }
        };
      }
    });

    if (result.isConfirmed) {
      // Show loading
      Swal.fire({
        title: 'กำลังส่งข้อมูล...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // Prepare data for API
        const apiData = {
          epcName: epcData.epcName,
          taxId: epcData.taxId,
          epcAddress: epcData.epcAddress,
          epcContact: epcData.epcContact,
          province: selectedProvince,
          district: selectedDistrict,
          subdistrict: selectedSubdistrict,
          postalCode: epcData.postalCode,
          coordinatorName: epcData.coordinatorName || '',
          coordinatorContact: epcData.coordinatorContact || ''
        };

        console.log('Sending EPC data:', apiData);
        console.log('Sending files:', files);

        // Call API
        const response = await epcAPI.registerEpc(apiData, files);
        
        console.log('EPC API response:', response);
        
        if (response.success) {
          await Swal.fire({
            icon: 'success',
            title: 'ส่งข้อมูลสำเร็จ!',
            text: response.message || 'ข้อมูลบริษัท EPC ถูกส่งเรียบร้อยแล้ว',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#10b981'
          });
          
          // Reset form
          setEpcData({
            epcName: '',
            epcAddress: '',
            epcContact: '',
            taxId: '',
            coordinatorName: '',
            coordinatorContact: '',
            province: '',
            district: '',
            subdistrict: '',
            postalCode: '',
          });
          setSelectedProvince('');
          setSelectedDistrict('');
          setSelectedSubdistrict('');
          setProvinces([]);
          setDistricts([]);
          setSubdistricts([]);
          setFiles({});
        } else {
          throw new Error(response.message || 'ไม่สามารถส่งข้อมูลได้');
        }
      } catch (error) {
        console.error('EPC registration error:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.status,
          code: error.code
        });
        
        await Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message || 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };


  return (
    <div className="space-y-6 register-epc-container">
      <style>{dropdownStyles}</style>
      <Card className="border-0 shadow-sm register-epc-form">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">หน้าลงทะเบียน EPC</CardTitle>
        </CardHeader>
        <CardContent className="register-epc-content">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ข้อมูลบริษัท */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">ข้อมูลบริษัท</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="epcName" className="text-sm font-medium text-slate-700">
                    ชื่อบริษัท EPC <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="epcName"
                    placeholder="กรอกชื่อบริษัท EPC"
                    value={epcData.epcName}
                    onChange={handleInputChange}
                    className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxId" className="text-sm font-medium text-slate-700">
                    เลขที่ผู้เสียภาษี <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="taxId"
                    placeholder="กรอกเลขที่ผู้เสียภาษี"
                    value={epcData.taxId}
                    onChange={handleInputChange}
                    className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="epcAddress" className="text-sm font-medium text-slate-700">
                  ที่อยู่บริษัท <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="epcAddress"
                  placeholder="กรอกที่อยู่บริษัท"
                  value={epcData.epcAddress}
                  onChange={handleInputChange}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* ข้อมูลที่อยู่แบบละเอียด */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-700">ข้อมูลที่อยู่แบบละเอียด</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 select-dropdown-fix">
                    <Label className="text-sm font-medium text-slate-700">
                      จังหวัด <span className="text-red-500">*</span>
                    </Label>
                    <Select value={selectedProvince} onValueChange={handleProvinceChange} required>
                      <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder={loading.provinces ? "กำลังโหลด..." : "เลือกจังหวัด"} />
                      </SelectTrigger>
                      <SelectContent 
                        position="popper" 
                        side="bottom" 
                        align="start" 
                        className="z-[9999] max-h-[200px] overflow-y-auto"
                        sideOffset={2}
                        avoidCollisions={true}
                        collisionPadding={20}
                      >
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.name_th}>
                            {province.name_th}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 select-dropdown-fix">
                    <Label className="text-sm font-medium text-slate-700">
                      อำเภอ/เขต <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={selectedDistrict} 
                      onValueChange={handleDistrictChange} 
                      disabled={!selectedProvince || loading.districts}
                      required
                    >
                      <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder={loading.districts ? "กำลังโหลด..." : selectedProvince ? "เลือกอำเภอ/เขต" : "เลือกจังหวัดก่อน"} />
                      </SelectTrigger>
                      <SelectContent 
                        position="popper" 
                        side="bottom" 
                        align="start" 
                        className="z-[9999] max-h-[200px] overflow-y-auto"
                        sideOffset={2}
                        avoidCollisions={true}
                        collisionPadding={20}
                      >
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.name_th}>
                            {district.name_th}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 select-dropdown-fix">
                    <Label className="text-sm font-medium text-slate-700">
                      ตำบล/แขวง <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={selectedSubdistrict} 
                      onValueChange={handleSubdistrictChange} 
                      disabled={!selectedDistrict || loading.subdistricts}
                      required
                    >
                      <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder={loading.subdistricts ? "กำลังโหลด..." : selectedDistrict ? "เลือกตำบล/แขวง" : "เลือกอำเภอก่อน"} />
                      </SelectTrigger>
                      <SelectContent 
                        position="popper" 
                        side="bottom" 
                        align="start" 
                        className="z-[9999] max-h-[200px] overflow-y-auto"
                        sideOffset={2}
                        avoidCollisions={true}
                        collisionPadding={20}
                      >
                        {subdistricts.map((subdistrict) => (
                          <SelectItem key={subdistrict.id} value={subdistrict.name_th}>
                            {subdistrict.name_th}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 select-dropdown-fix">
                    <Label htmlFor="postalCode" className="text-sm font-medium text-slate-700">
                      รหัสไปรษณีย์ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      placeholder="รหัสไปรษณีย์"
                      value={epcData.postalCode}
                      onChange={handleInputChange}
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="epcContact" className="text-sm font-medium text-slate-700">
                  เบอร์ติดต่อบริษัท <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="epcContact"
                  placeholder="กรอกเบอร์ติดต่อบริษัท"
                  value={epcData.epcContact}
                  onChange={handleInputChange}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* ข้อมูลผู้ติดต่อ */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">ข้อมูลผู้ติดต่อ (ถ้ามี)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="coordinatorName" className="text-sm font-medium text-slate-700">
                    ชื่อผู้ติดต่อ
                  </Label>
                  <Input
                    id="coordinatorName"
                    placeholder="กรอกชื่อผู้ติดต่อ"
                    value={epcData.coordinatorName}
                    onChange={handleInputChange}
                    className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="coordinatorContact" className="text-sm font-medium text-slate-700">
                    เบอร์ติดต่อผู้ติดต่อ
                  </Label>
                  <Input
                    id="coordinatorContact"
                    type="tel"
                    placeholder="08x-xxx-xxxx"
                    value={epcData.coordinatorContact}
                    onChange={handleInputChange}
                    className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-center text-slate-700">อัปโหลดไฟล์ต่างๆ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FileUploadInput label="อัปโหลดไฟล์ สัญญา NDA" id="nda" onFileSelect={(e) => handleFileChange(e, 'nda')} fileName={files.nda?.name} />
                <FileUploadInput label="อัปโหลดไฟล์หนังสือรับรองบริษัท" id="companyCert" onFileSelect={(e) => handleFileChange(e, 'companyCert')} fileName={files.companyCert?.name} />
                <FileUploadInput label="อัปโหลดไฟล์เอกสารสัญญาจ้างงาน" id="employmentContract" onFileSelect={(e) => handleFileChange(e, 'employmentContract')} fileName={files.employmentContract?.name} />
                <FileUploadInput label="อัปโหลดไฟล์อื่นๆ" id="tndtContract" onFileSelect={(e) => handleFileChange(e, 'tndtContract')} fileName={files.tndtContract?.name} />
              </div>
              <div className="flex items-center text-sm text-slate-500 mt-4">
                <p className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-blue-500" />
                  ไฟล์ต้องเป็น PDF ขนาดไฟล์ไม่เกิน 20MB
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  type="submit" 
                  size="lg" 
                  className="group relative w-full max-w-md h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center justify-center">
                    <span className="text-lg font-semibold">ลงทะเบียนบริษัท EPC</span>
                  </div>
                  
                  {/* Success State Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={handleCancelSubmit}
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
                <h2 className="text-xl font-bold text-slate-800">ตรวจสอบข้อมูลก่อนดำเนินการต่อ</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelSubmit}
                  className="h-8 w-8 text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    ข้อมูลบริษัท
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2 select-dropdown-fix">
                      <Label className="text-sm font-medium text-slate-600">ชื่อบริษัท EPC</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{epcData.epcName || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 select-dropdown-fix">
                      <Label className="text-sm font-medium text-slate-600">เลขที่ผู้เสียภาษี</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{epcData.taxId || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 select-dropdown-fix">
                    <Label className="text-sm font-medium text-slate-600">ที่อยู่บริษัท</Label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      <span className="text-slate-800">{epcData.epcAddress || 'ไม่ระบุ'}</span>
                    </div>
                  </div>

                  {/* ข้อมูลที่อยู่แบบละเอียด */}
                  <div className="space-y-4">
                    <h4 className="text-md font-semibold text-slate-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      ข้อมูลที่อยู่แบบละเอียด
                    </h4>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2 select-dropdown-fix">
                        <Label className="text-sm font-medium text-slate-600">จังหวัด</Label>
                        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <span className="text-slate-800">{epcData.province || 'ไม่ระบุ'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 select-dropdown-fix">
                        <Label className="text-sm font-medium text-slate-600">อำเภอ/เขต</Label>
                        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <span className="text-slate-800">{epcData.district || 'ไม่ระบุ'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 select-dropdown-fix">
                        <Label className="text-sm font-medium text-slate-600">ตำบล/แขวง</Label>
                        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <span className="text-slate-800">{epcData.subdistrict || 'ไม่ระบุ'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 select-dropdown-fix">
                        <Label className="text-sm font-medium text-slate-600">รหัสไปรษณีย์</Label>
                        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <span className="text-slate-800">{epcData.postalCode || 'ไม่ระบุ'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 select-dropdown-fix">
                    <Label className="text-sm font-medium text-slate-600">เบอร์ติดต่อบริษัท</Label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      <span className="text-slate-800">{epcData.epcContact || 'ไม่ระบุ'}</span>
                    </div>
                  </div>
                </div>

                {/* Coordinator Information */}
                {(epcData.coordinatorName || epcData.coordinatorContact) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      ข้อมูลผู้ติดต่อ
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2 select-dropdown-fix">
                        <Label className="text-sm font-medium text-slate-600">ชื่อผู้ติดต่อ</Label>
                        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <span className="text-slate-800">{epcData.coordinatorName || 'ไม่ระบุ'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 select-dropdown-fix">
                        <Label className="text-sm font-medium text-slate-600">เบอร์ติดต่อผู้ติดต่อ</Label>
                        <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <span className="text-slate-800">{epcData.coordinatorContact || 'ไม่ระบุ'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Uploaded Files */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    ไฟล์ที่อัปโหลด
                  </h3>
                  
                  <div className="space-y-3">
                    {files.nda && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{files.nda.name}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">อัปโหลดแล้ว</Badge>
                      </div>
                    )}
                    
                    {files.companyCert && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{files.companyCert.name}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">อัปโหลดแล้ว</Badge>
                      </div>
                    )}
                    
                    {files.employmentContract && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{files.employmentContract.name}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">อัปโหลดแล้ว</Badge>
                      </div>
                    )}
                    
                    {files.tndtContract && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{files.tndtContract.name}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">อัปโหลดแล้ว</Badge>
                      </div>
                    )}
                    
                    {!files.nda && !files.companyCert && !files.employmentContract && !files.tndtContract && (
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center">
                        <span className="text-slate-500">ยังไม่มีไฟล์ที่อัปโหลด</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={handleCancelSubmit}
                  className="px-6 py-2"
                >
                  ยกเลิก
                </Button>
                <Button
                  onClick={handleConfirmSubmit}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ยืนยัน
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegisterEpc;
  