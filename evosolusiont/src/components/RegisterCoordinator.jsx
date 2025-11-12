import React, { useState, useRef, useEffect } from 'react';
import { Upload, AlertCircle, X, FileText, User as UserIcon, Phone, MapPin, CreditCard, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { coordinatorsAPI } from '@/services/api';
import Swal from 'sweetalert2';

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

const RegisterCoordinator = () => {
  const [coordinatorData, setCoordinatorData] = useState({
    fullName: '',
    idCardNumber: '',
    phone: '',
    email: '',
    bank: '',
    bankAccountNumber: '',
    bankAccountName: '',
    address: '',
    province: '',
    district: '',
    subdistrict: '',
    postalCode: '',
  });
  
  const [loading, setLoading] = useState(false);

  // States for Address
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [addressLoading, setAddressLoading] = useState({
    provinces: false,
    districts: false,
    subdistricts: false,
  });

  // รายชื่อธนาคารไทย
  const thaiBanks = [
    'ธนาคารกรุงเทพ',
    'ธนาคารกสิกรไทย',
    'ธนาคารกรุงไทย',
    'ธนาคารไทยพาณิชย์',
    'ธนาคารกรุงศรีอยุธยา',
    'ธนาคารทหารไทยธนชาต',
    'ธนาคารยูโอบี',
    'ธนาคารซีไอเอ็มบี ไทย',
    'ธนาคารเกียรตินาคินภัทร',
    'ธนาคารแลนด์ แอนด์ เฮาส์',
    'ธนาคารมิซูโฮ',
    'ธนาคารซูมิโตโม มิตซุย แบงกิ้ง คอร์ปอเรชั่น',
    'ธนาคารฮ่องกงและเซี่ยงไฮ้แบงกิ้งคอร์ปอเรชั่น',
    'ธนาคารสแตนดาร์ดชาร์เตอร์ด',
    'ธนาคารเดอะบังก์ออฟโตเกียว-มิตซูบิชิ',
    'ธนาคารออมสิน',
    'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร',
    'ธนาคารอิสลามแห่งประเทศไทย',
    'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',
    'ธนาคารเพื่อการส่งออกและนำเข้าแห่งประเทศไทย',
    'ธนาคารแห่งประเทศไทย',
    'ธนาคารอื่นๆ'
  ];
  const [files, setFiles] = useState({
    idCard: null,
    bankPassbook: null,
    contract: null,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // โหลดข้อมูลจังหวัดเมื่อ component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCoordinatorData(prev => ({ ...prev, [id]: value }));
  };

  const handleBankChange = (value) => {
    setCoordinatorData(prev => ({ ...prev, bank: value }));
  };

  // ฟังก์ชันดึงข้อมูลจังหวัด
  const loadProvinces = async () => {
    setAddressLoading(prev => ({ ...prev, provinces: true }));
    try {
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProvinces(data || []);
    } catch (error) {
      console.error('Error loading provinces:', error);
    } finally {
      setAddressLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  // ฟังก์ชันดึงข้อมูลอำเภอ
  const loadDistricts = async (provinceName) => {
    if (!provinceName) return;
    setAddressLoading(prev => ({ ...prev, districts: true }));
    try {
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
      console.error('Error loading districts:', error);
    } finally {
      setAddressLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // ฟังก์ชันดึงข้อมูลตำบล
  const loadSubdistricts = async (provinceName, districtName) => {
    if (!provinceName || !districtName) return;
    setAddressLoading(prev => ({ ...prev, subdistricts: true }));
    try {
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
      console.error('Error loading subdistricts:', error);
    } finally {
      setAddressLoading(prev => ({ ...prev, subdistricts: false }));
    }
  };

  // ฟังก์ชันจัดการการเลือกจังหวัด
  const handleProvinceChange = async (value) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setSelectedSubdistrict('');
    setDistricts([]);
    setSubdistricts([]);
    setCoordinatorData(prev => ({ 
      ...prev, 
      province: value,
      district: '',
      subdistrict: '',
      postalCode: ''
    }));
    
    // ส่งชื่อจังหวัดไปยัง API
    await loadDistricts(value);
  };

  // ฟังก์ชันจัดการการเลือกอำเภอ
  const handleDistrictChange = async (value) => {
    setSelectedDistrict(value);
    setSelectedSubdistrict('');
    setSubdistricts([]);
    setCoordinatorData(prev => ({ 
      ...prev, 
      district: value,
      subdistrict: '',
      postalCode: ''
    }));
    
    // ส่งชื่อจังหวัดและอำเภอไปยัง API
    await loadSubdistricts(selectedProvince, value);
  };

  // ฟังก์ชันจัดการการเลือกตำบล
  const handleSubdistrictChange = async (value) => {
    setSelectedSubdistrict(value);
    
    // Auto-fill postal code
    const subdistrict = subdistricts.find(s => s.name_th === value);
    if (subdistrict && subdistrict.zip_code) {
      setCoordinatorData(prev => ({ ...prev, postalCode: subdistrict.zip_code.toString() }));
    }
    
    setCoordinatorData(prev => ({ 
      ...prev, 
      subdistrict: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = e.target.id;
      setFiles(prev => ({ ...prev, [fileType]: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    
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
      // Validate required fields
      if (!coordinatorData.fullName || !coordinatorData.idCardNumber || !coordinatorData.phone) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ-นามสกุล, เลขบัตรประชาชน, เบอร์โทรศัพท์)');
      }
      
      // Validate ID card number (13 digits)
      if (!/^\d{13}$/.test(coordinatorData.idCardNumber)) {
        throw new Error('เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก');
      }
      
      // Validate phone number (10 digits)
      if (!/^0\d{9}$/.test(coordinatorData.phone)) {
        throw new Error('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0');
      }
      
      // Prepare FormData for file upload
      const formData = new FormData();
      
      // Append all coordinator data
      Object.keys(coordinatorData).forEach(key => {
        if (coordinatorData[key]) {
          formData.append(key, coordinatorData[key]);
        }
      });
      
      // Append files
      if (files.idCard) {
        formData.append('idCard', files.idCard);
      }
      if (files.bankPassbook) {
        formData.append('bankPassbook', files.bankPassbook);
      }
      if (files.contract) {
        formData.append('contract', files.contract);
      }
      
      // Call API with FormData
      const response = await coordinatorsAPI.createCoordinator(formData);
      
      console.log('Coordinator API response:', response);
      
      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          text: response.message || 'ลงทะเบียน Sale สำเร็จ',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#10b981'
        });
        
        // Reset form
        setCoordinatorData({
          fullName: '',
          idCardNumber: '',
          phone: '',
          email: '',
          bank: '',
          bankAccountNumber: '',
          bankAccountName: '',
          address: '',
          province: '',
          district: '',
          subdistrict: '',
          postalCode: '',
        });
        setFiles({
          idCard: null,
          bankPassbook: null,
          contract: null,
        });
      } else {
        throw new Error(response.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } catch (error) {
      console.error('Register coordinator error:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || error.error || 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">หน้าลงทะเบียน Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ข้อมูลส่วนตัว */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                ข้อมูลส่วนตัว
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">ชื่อ-นามสกุล <span className="text-red-500">*</span></Label>
                  <Input id="fullName" placeholder="กรอกชื่อ-นามสกุล" value={coordinatorData.fullName} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idCardNumber">เลขบัตรประชาชน <span className="text-red-500">*</span></Label>
                  <Input 
                    id="idCardNumber" 
                    placeholder="1234567890123" 
                    value={coordinatorData.idCardNumber} 
                    onChange={handleInputChange} 
                    maxLength={13}
                    pattern="\d{13}"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรติดต่อ <span className="text-red-500">*</span></Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="0812345678" 
                    value={coordinatorData.phone} 
                    onChange={handleInputChange} 
                    maxLength={10}
                    pattern="0\d{9}"
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@email.com" 
                    value={coordinatorData.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Input id="address" placeholder="บ้านเลขที่ ถนน" value={coordinatorData.address} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label>จังหวัด <span className="text-red-500">*</span></Label>
                  <Select value={selectedProvince} onValueChange={handleProvinceChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder={addressLoading.provinces ? "กำลังโหลด..." : "เลือกจังหวัด"} />
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
                <div className="space-y-2">
                  <Label>อำเภอ/เขต <span className="text-red-500">*</span></Label>
                  <Select 
                    value={selectedDistrict} 
                    onValueChange={handleDistrictChange} 
                    disabled={!selectedProvince || addressLoading.districts}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={addressLoading.districts ? "กำลังโหลด..." : selectedProvince ? "เลือกอำเภอ/เขต" : "เลือกจังหวัดก่อน"} />
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>ตำบล/แขวง <span className="text-red-500">*</span></Label>
                  <Select 
                    value={selectedSubdistrict} 
                    onValueChange={handleSubdistrictChange} 
                    disabled={!selectedDistrict || addressLoading.subdistricts}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={addressLoading.subdistricts ? "กำลังโหลด..." : selectedDistrict ? "เลือกตำบล/แขวง" : "เลือกอำเภอก่อน"} />
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
                <div className="space-y-2">
                  <Label htmlFor="postalCode">รหัสไปรษณีย์ <span className="text-red-500">*</span></Label>
                  <Input 
                    id="postalCode" 
                    placeholder="10110" 
                    value={coordinatorData.postalCode} 
                    onChange={handleInputChange} 
                    maxLength={5}
                    pattern="\d{5}"
                    required
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* ข้อมูลธนาคาร */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                ข้อมูลธนาคาร
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 force-dropdown-down">
                  <Label htmlFor="bank">ธนาคาร</Label>
                  <Select value={coordinatorData.bank} onValueChange={handleBankChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกธนาคาร" />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper" 
                      side="bottom" 
                      align="start"
                      className="z-50"
                      style={{ 
                        transform: 'translateY(4px)',
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}
                    >
                      {thaiBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber">เลขบัญชีธนาคาร</Label>
                  <Input id="bankAccountNumber" placeholder="กรอกเลขบัญชีธนาคาร" value={coordinatorData.bankAccountNumber} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountName">ชื่อบัญชีธนาคาร</Label>
                  <Input id="bankAccountName" placeholder="กรอกชื่อบัญชีธนาคาร" value={coordinatorData.bankAccountName} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadInput
                label="อัปโหลดไฟล์บัตรประชาชน"
                id="idCard"
                onFileSelect={handleFileSelect}
                fileName={files.idCard?.name}
              />
              
              <FileUploadInput
                label="อัปโหลดไฟล์หน้าสมุดบัญชีเงินฝาก"
                id="bankPassbook"
                onFileSelect={handleFileSelect}
                fileName={files.bankPassbook?.name}
              />
              
              <FileUploadInput
                label="อัปโหลดไฟล์สัญญาจ้างผู้ประสานงาน"
                id="contract"
                onFileSelect={handleFileSelect}
                fileName={files.contract?.name}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">ข้อกำหนดไฟล์:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• ไฟล์ต้องเป็น PDF เท่านั้น</li>
                    <li>• ขนาดไฟล์ไม่เกิน 20MB</li>
                    <li>• ไฟล์บัตรประชาชนต้องชัดเจน อ่านได้ง่าย</li>
                    <li>• ไฟล์สมุดบัญชีต้องแสดงชื่อเจ้าของบัญชีชัดเจน</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
                ลงทะเบียน
              </Button>
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
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    ข้อมูลส่วนตัว
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">ชื่อ-นามสกุล</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{coordinatorData.fullName || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">เลขบัตรประชาชน</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{coordinatorData.idCardNumber || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">เบอร์โทรติดต่อ</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{coordinatorData.phone || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">อีเมล</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{coordinatorData.email || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-600">ที่อยู่ตามบัตรประชาชน</Label>
                    <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      <span className="text-slate-800">
                        {[
                          coordinatorData.address,
                          coordinatorData.subdistrict && `ต.${coordinatorData.subdistrict}`,
                          coordinatorData.district && `อ.${coordinatorData.district}`,
                          coordinatorData.province && `จ.${coordinatorData.province}`,
                          coordinatorData.postalCode
                        ].filter(Boolean).join(' ') || 'ไม่ระบุ'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Banking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    ข้อมูลธนาคาร
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">ธนาคาร</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{coordinatorData.bank || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">เลขบัญชีธนาคาร</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{coordinatorData.bankAccountNumber || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-600">ชื่อบัญชีธนาคาร</Label>
                      <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <span className="text-slate-800">{coordinatorData.bankAccountName || 'ไม่ระบุ'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uploaded Files */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    ไฟล์ที่อัปโหลด
                  </h3>
                  
                  <div className="space-y-3">
                    {files.idCard && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{files.idCard.name}</span>
                        <span className="inline-flex items-center rounded-full border border-transparent bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-semibold">
                          อัปโหลดแล้ว
                        </span>
                      </div>
                    )}
                    
                    {files.bankPassbook && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{files.bankPassbook.name}</span>
                        <span className="inline-flex items-center rounded-full border border-transparent bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-semibold">
                          อัปโหลดแล้ว
                        </span>
                      </div>
                    )}
                    
                    {files.contract && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{files.contract.name}</span>
                        <span className="inline-flex items-center rounded-full border border-transparent bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-semibold">
                          อัปโหลดแล้ว
                        </span>
                      </div>
                    )}
                    
                    {!files.idCard && !files.bankPassbook && !files.contract && (
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

export default RegisterCoordinator;
