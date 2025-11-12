import React, { useState, useEffect, useRef } from 'react';
import { Building2, MapPin, User, Phone, AlertCircle, CheckCircle, ArrowRight, X, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { agenciesAPI, coordinatorsAPI, projectsAPI } from '@/services/api';

const RegisterAgency = () => {
  // States for Agency Search
  const [searchAgency, setSearchAgency] = useState('');
  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  
  // States for Address
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [ministry, setMinistry] = useState('');
  const [affiliation, setAffiliation] = useState('');
  
  // States for Coordinators
  const [coordinators, setCoordinators] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  
  // Additional fields
  const [region, setRegion] = useState('');
  
  // Other states
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const agencyInputRef = useRef(null);

  // Load data on mount
  useEffect(() => {
    loadAgencies();
    loadCoordinators();
    loadProvinces();
  }, []);

  // Reload coordinators periodically or on window focus to catch new registrations
  useEffect(() => {
    const handleFocus = () => {
      loadCoordinators();
    };

    // Reload when window gains focus
    window.addEventListener('focus', handleFocus);

    // Also reload every 30 seconds to catch new coordinators
    const interval = setInterval(() => {
      loadCoordinators();
    }, 30000); // 30 seconds

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Search agencies when search term changes (with debounce)
  useEffect(() => {
    const searchAgenciesDebounced = async () => {
      if (searchAgency.trim().length >= 2) {
        try {
          const response = await agenciesAPI.searchAgencies(searchAgency);
          if (response.success) {
            setFilteredAgencies(response.data || []);
            setShowAgencyDropdown(true);
          }
        } catch (error) {
          console.error('Error searching agencies:', error);
          setFilteredAgencies([]);
        }
      } else {
        setFilteredAgencies([]);
        setShowAgencyDropdown(false);
      }
    };

    const timeoutId = setTimeout(searchAgenciesDebounced, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchAgency]);

  // Auto-fill address when agency is selected
  useEffect(() => {
    if (selectedAgency) {
      setSelectedProvince(selectedAgency.province || '');
      setSelectedDistrict(selectedAgency.district || '');
      setSelectedSubdistrict(selectedAgency.subdistrict || '');
      setPostalCode(selectedAgency.postalCode || '');
      setAddress(selectedAgency.address || '');
      setMinistry(selectedAgency.ministry || '');
      setAffiliation(selectedAgency.affiliation || '');
      setRegion(selectedAgency.region || '');
      
      // Load districts and subdistricts
      if (selectedAgency.province) {
        loadDistricts(selectedAgency.province);
      }
      if (selectedAgency.province && selectedAgency.district) {
        loadSubdistricts(selectedAgency.province, selectedAgency.district);
      }
    }
  }, [selectedAgency]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (agencyInputRef.current && !agencyInputRef.current.contains(event.target)) {
        setShowAgencyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadAgencies = async () => {
    try {
      setLoading(true);
      const response = await agenciesAPI.getAllAgencies();
      if (response.success) {
        setAgencies(response.data || []);
      }
    } catch (error) {
      console.error('Error loading agencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCoordinators = async (showSuccessMessage = false) => {
    try {
      // Load all coordinators (both approved and pending) so user can see all available options
      const response = await coordinatorsAPI.getCoordinators({ limit: 1000 });
      console.log('📋 Coordinators API response:', response);
      if (response.success) {
        const allCoordinators = response.data?.coordinators || response.data || [];
        console.log('👥 All coordinators:', allCoordinators);
        // Filter to show only approved and pending coordinators
        const availableCoordinators = allCoordinators.filter(coord => 
          coord.status === 'approved' || coord.status === 'pending'
        );
        console.log('✅ Available coordinators:', availableCoordinators.length);
        setCoordinators(availableCoordinators);
        
        if (showSuccessMessage) {
          toast({
            title: "✅ โหลดข้อมูลสำเร็จ",
            description: `พบผู้ประสานงาน ${availableCoordinators.length} คน (${availableCoordinators.filter(c => c.status === 'approved').length} คนอนุมัติแล้ว)`,
          });
        }
      }
    } catch (error) {
      console.error('Error loading coordinators:', error);
      if (showSuccessMessage) {
        toast({
          title: "❌ เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลผู้ประสานงานได้",
          variant: "destructive",
        });
      }
    }
  };

  const loadProvinces = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/province.json');
      const data = await response.json();
      setProvinces(data || []);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  const loadDistricts = async (provinceName) => {
    if (!provinceName) return;
    try {
      // Load all districts and filter by province
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/district.json');
      const data = await response.json();
      
      // Find province ID
      const province = provinces.find(p => p.name_th === provinceName);
      if (province) {
        const filteredDistricts = data.filter(d => d.province_id === province.id);
        setDistricts(filteredDistricts);
      }
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const loadSubdistricts = async (provinceName, districtName) => {
    if (!provinceName || !districtName) return;
    try {
      // Load all subdistricts and filter by district
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest/sub_district.json');
      const data = await response.json();
      
      // Find district ID
      const district = districts.find(d => d.name_th === districtName);
      if (district) {
        const filteredSubdistricts = data.filter(sd => sd.district_id === district.id);
        setSubdistricts(filteredSubdistricts);
        
        // Auto-fill postal code from first subdistrict
        if (filteredSubdistricts.length > 0 && filteredSubdistricts[0].zip_code) {
          setPostalCode(filteredSubdistricts[0].zip_code.toString());
        }
      }
    } catch (error) {
      console.error('Error loading subdistricts:', error);
    }
  };

  const handleSelectAgency = (agency) => {
    setSelectedAgency(agency);
    setSearchAgency(agency.agencyName);
    setShowAgencyDropdown(false);
  };

  const handleClearAgency = () => {
    setSelectedAgency(null);
    setSearchAgency('');
    setFilteredAgencies([]);
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedSubdistrict('');
    setPostalCode('');
    setAddress('');
    setMinistry('');
    setAffiliation('');
    setRegion('');
  };

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    setSelectedDistrict('');
    setSelectedSubdistrict('');
    setDistricts([]);
    setSubdistricts([]);
    if (province) {
      loadDistricts(province);
    }
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setSelectedSubdistrict('');
    setPostalCode('');
    setSubdistricts([]);
    if (selectedProvince && district) {
      loadSubdistricts(selectedProvince, district);
    }
  };

  const handleSubdistrictChange = (subdistrictName) => {
    setSelectedSubdistrict(subdistrictName);
    
    // Auto-fill postal code
    const subdistrict = subdistricts.find(sd => sd.name_th === subdistrictName);
    if (subdistrict && subdistrict.zip_code) {
      setPostalCode(subdistrict.zip_code.toString());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!searchAgency.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกชื่อโรงเรียน',
        text: 'กรุณากรอกชื่อโรงเรียนหรือเลือกจากรายการ',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!selectedCoordinator) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือกผู้ประสานงาน',
        text: 'กรุณาเลือกผู้ประสานงาน (Sale) ที่ดูแลโครงการนี้',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    if (!selectedProvince || !selectedDistrict || !selectedSubdistrict) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกที่อยู่ให้ครบถ้วน',
        text: 'กรุณาเลือกจังหวัด อำเภอ และตำบล',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const projectData = {
        agencyId: selectedAgency?.id || null,
        agencyName: searchAgency,
        coordinatorId: selectedCoordinator.id,
        projectName: `โครงการติดตั้งโซล่าเซลล์ - ${searchAgency}`,
        description: `โครงการติดตั้งและบำรุงรักษาอุปกรณ์ประหยัดพลังงานในระบบการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ที่ติดตั้งบนหลังคา (Solar Rooftop)\n\nภาค: ${region}`,
        address: address,
        province: selectedProvince,
        district: selectedDistrict,
        subdistrict: selectedSubdistrict,
        postalCode: postalCode,
        ministry: ministry,
        affiliation: affiliation,
        region: region,
        status: 'pending'
      };

      const response = await projectsAPI.registerProject(projectData);

      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'ลงทะเบียนสำเร็จ!',
          html: `
            <p class="mb-2">ลงทะเบียนโครงการของ <strong>${searchAgency}</strong> เรียบร้อยแล้ว</p>
            <p class="text-sm text-gray-600">ผู้ประสานงาน: ${selectedCoordinator.fullName}</p>
          `,
          confirmButtonColor: '#10b981'
        });

        // Reset form
        handleClearAgency();
        setSelectedCoordinator(null);
        setRegion('');
      } else {
        throw new Error(response.message || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error registering project:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถลงทะเบียนโครงการได้',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            ลงทะเบียนหน่วยงาน
          </h1>
          <p className="text-slate-600">
            ค้นหาและเลือกโรงเรียนเพื่อลงทะเบียนโครงการติดตั้งโซล่าเซลล์
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Agency Search */}
          <Card className="mb-6 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Search className="h-5 w-5" />
                ค้นหาและเลือกโรงเรียน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Agency Name */}
                <div ref={agencyInputRef} className="md:col-span-3">
                  <Label>ชื่อหน่วยงาน <span className="text-red-500">*</span></Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={searchAgency}
                      onChange={(e) => setSearchAgency(e.target.value)}
                      onFocus={() => searchAgency && setShowAgencyDropdown(true)}
                      placeholder="พิมพ์ชื่อโรงเรียนเพื่อค้นหา หรือกรอกชื่อใหม่..."
                      className="pl-10 pr-10"
                    />
                    {searchAgency && (
                      <button
                        type="button"
                        onClick={handleClearAgency}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                    
                    {/* Dropdown */}
                    {showAgencyDropdown && filteredAgencies.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {filteredAgencies.map((agency) => (
                          <button
                            key={agency.id}
                            type="button"
                            onClick={() => handleSelectAgency(agency)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-0"
                          >
                            <div className="font-medium">{agency.agencyName}</div>
                            <div className="text-sm text-gray-600">{agency.district} / {agency.province}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <Label>ภาคหน่วยงาน</Label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full mt-2 border rounded-lg px-3 py-2"
                  >
                    <option value="">-- เลือกภาค --</option>
                    <option value="ภาคเหนือ">ภาคเหนือ</option>
                    <option value="ภาคกลาง">ภาคกลาง</option>
                    <option value="ภาคตะวันออกเฉียงเหนือ">ภาคตะวันออกเฉียงเหนือ</option>
                    <option value="ภาคใต้">ภาคใต้</option>
                    <option value="ภาคตะวันออก">ภาคตะวันออก</option>
                    <option value="ภาคตะวันตก">ภาคตะวันตก</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <Label>ที่อยู่หน่วยงาน</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="กรอกที่อยู่หน่วยงาน..."
                    className="mt-2"
                  />
                </div>

                {/* Province */}
                <div>
                  <Label>จังหวัด <span className="text-red-500">*</span></Label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full mt-2 border rounded-lg px-3 py-2"
                  >
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces.map((prov) => (
                      <option key={prov.id} value={prov.name_th}>{prov.name_th}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <Label>อำเภอ <span className="text-red-500">*</span></Label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full mt-2 border rounded-lg px-3 py-2"
                    disabled={!selectedProvince}
                  >
                    <option value="">-- เลือกอำเภอ --</option>
                    {districts.map((dist) => (
                      <option key={dist.id} value={dist.name_th}>{dist.name_th}</option>
                    ))}
                  </select>
                </div>

                {/* Subdistrict */}
                <div>
                  <Label>ตำบล <span className="text-red-500">*</span></Label>
                  <select
                    value={selectedSubdistrict}
                    onChange={(e) => handleSubdistrictChange(e.target.value)}
                    className="w-full mt-2 border rounded-lg px-3 py-2"
                    disabled={!selectedDistrict}
                  >
                    <option value="">-- เลือกตำบล --</option>
                    {subdistricts.map((sub) => (
                      <option key={sub.id} value={sub.name_th}>{sub.name_th}</option>
                    ))}
                  </select>
                </div>

                {/* Postal Code */}
                <div>
                  <Label>รหัสไปรษณีย์</Label>
                  <Input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="mt-2"
                    maxLength={5}
                  />
                </div>

                {/* Ministry */}
                <div>
                  <Label>กระทรวง</Label>
                  <Input
                    value={ministry}
                    onChange={(e) => setMinistry(e.target.value)}
                    placeholder="กรอกชื่อกระทรวง..."
                    className="mt-2"
                  />
                </div>

                {/* Affiliation */}
                <div>
                  <Label>สังกัด</Label>
                  <Input
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder="กรอกชื่อสังกัด..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Coordinator */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>เลือกผู้ประสานงาน <span className="text-red-500">*</span></Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadCoordinators(true)}
                      className="text-xs h-7"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      รีโหลด
                    </Button>
                  </div>
                  <select
                    value={selectedCoordinator?.id || ''}
                    onChange={(e) => {
                      const coordinator = coordinators.find(c => c.id === parseInt(e.target.value));
                      setSelectedCoordinator(coordinator);
                    }}
                    className="w-full mt-2 border rounded-lg px-3 py-2"
                  >
                    <option value="">-- เลือกผู้ประสานงาน --</option>
                    {coordinators.map((coord) => (
                      <option key={coord.id} value={coord.id}>
                        {coord.fullName} ({coord.phone}) {coord.status === 'pending' ? '[รออนุมัติ]' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    จำนวนผู้ประสานงาน: {coordinators.length} คน 
                    ({coordinators.filter(c => c.status === 'approved').length} คนอนุมัติแล้ว, {coordinators.filter(c => c.status === 'pending').length} คนรออนุมัติ)
                  </p>
                </div>

                {/* Coordinator Phone */}
                <div>
                  <Label>เบอร์ติดต่อผู้ประสานงาน</Label>
                  <Input
                    value={selectedCoordinator?.phone || ''}
                    readOnly
                    className="mt-2 bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
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
              {loading ? 'กำลังบันทึก...' : 'ลงทะเบียนโครงการ'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfirmModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-lg w-full"
              >
                <div className="text-center mb-6">
                  <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">ยืนยันการลงทะเบียน</h3>
                  <p className="text-slate-600">กรุณาตรวจสอบข้อมูลก่อนยืนยัน</p>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <Label className="text-xs text-slate-600">โรงเรียน</Label>
                    <div className="font-medium">{searchAgency}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <Label className="text-xs text-slate-600">ภาค</Label>
                    <div className="font-medium">{region || '-'}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <Label className="text-xs text-slate-600">ผู้ประสานงาน</Label>
                    <div className="font-medium">{selectedCoordinator?.fullName}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <Label className="text-xs text-slate-600">ที่อยู่</Label>
                    <div>{address && `${address} `}{selectedSubdistrict} {selectedDistrict} {selectedProvince} {postalCode}</div>
                  </div>
                  {ministry && (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <Label className="text-xs text-slate-600">กระทรวง</Label>
                      <div>{ministry}</div>
                    </div>
                  )}
                  {affiliation && (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <Label className="text-xs text-slate-600">สังกัด</Label>
                      <div>{affiliation}</div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    ยืนยัน
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterAgency;
