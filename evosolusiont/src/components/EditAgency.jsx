import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { projectsAPI, coordinatorsAPI } from '@/services/api';
import Swal from 'sweetalert2';

const EditAgency = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [coordinatorsList, setCoordinatorsList] = useState([]);
  
  // Extract ID from URL
  const getAgencyIdFromUrl = () => {
    const match = location.pathname.match(/\/admin\/edit-agency\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const agencyId = getAgencyIdFromUrl();
  
  console.log('EditAgency - URL:', location.pathname);
  console.log('EditAgency - agencyId:', agencyId);
  
  const [formData, setFormData] = useState({
    agencyName: '',
    province: '',
    address: '',
    position: '',
    district: '',
    subdistrict: '',
    salutation: '',
    phoneNumber: '',
    email: '',
    ministry: '',
    affiliation: '',
    coordinator3: '',
    coordinatorId: '',
    coordinatorName: '',
    coordinatorPhone: '',
    epcName: '',
    coordinator2: '',
    coordinator2Phone: '',
  });

  const [equipmentData, setEquipmentData] = useState([
    { id: 1, quantity: 123, cost: 123 },
    { id: 2, quantity: 123, cost: 123 },
    { id: 3, quantity: 123, cost: 123 },
    { id: 4, quantity: 123, cost: 123 },
    { id: 5, quantity: 123, cost: 123 },
    { id: 6, quantity: 123, cost: 123 },
    { id: 7, quantity: '', cost: '' },
    { id: 8, quantity: '', cost: '' },
    { id: 9, quantity: '', cost: '' },
    { id: 10, quantity: '', cost: '' },
    { id: 11, quantity: '', cost: '' },
    { id: 12, quantity: '', cost: '' },
  ]);

  const [summaryData, setSummaryData] = useState({
    totalQuantity: 123,
    totalCost: 567,
    additionalQuantity: 23,
    additionalCost: 453,
  });

  const [kWpData, setKWpData] = useState({
    estimate100: 567,
    estimate70: 456,
    actual: 400,
  });

  useEffect(() => {
    if (agencyId) {
      loadAgencyData();
      loadCoordinatorsList();
    } else {
      setLoading(false);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบ ID ของหน่วยงาน",
        variant: "destructive"
      });
    }
  }, [agencyId]);

  const loadAgencyData = async () => {
    if (!agencyId) return;
    
    try {
      setLoading(true);
      console.log('Loading agency data for ID:', agencyId);
      
      const response = await projectsAPI.getProjectById(agencyId);
      console.log('Agency data response:', response);
      
      if (response.success && response.data) {
        const data = response.data;
        
        setFormData({
          agencyName: data.agencyName || data.name || '',
          province: data.province || '',
          address: data.address || '',
          position: data.position || '',
          district: data.district || '',
          subdistrict: data.subdistrict || '',
          salutation: data.salutation || '',
          phoneNumber: data.phoneNumber || data.phone || '',
          email: data.email || '',
          ministry: data.ministry || '',
          affiliation: data.affiliation || '',
          coordinator3: data.coordinator3 || '',
          coordinatorId: data.coordinatorId?.toString() || '',
          coordinatorName: data.coordinatorName || '',
          coordinatorPhone: data.coordinatorPhone || '',
          epcName: data.epcName || '',
          coordinator2: data.coordinator2 || '',
          coordinator2Phone: data.coordinator2Phone || '',
        });

        // โหลดข้อมูลตาราง (ถ้ามี)
        if (data.equipmentData) {
          try {
            const parsedEquipment = JSON.parse(data.equipmentData);
            setEquipmentData(parsedEquipment);
          } catch (e) {
            console.log('Could not parse equipmentData:', e);
          }
        }

        if (data.summaryData) {
          try {
            const parsedSummary = JSON.parse(data.summaryData);
            setSummaryData(parsedSummary);
            
            // คำนวณ kWp อัตโนมัติจาก additionalQuantity
            if (parsedSummary.additionalQuantity) {
              const quantity = parseFloat(parsedSummary.additionalQuantity) || 0;
              const estimate100 = (quantity * 12 / 500).toFixed(2);
              const estimate70 = (quantity * 12 / 500 * 0.7).toFixed(2);
              
              // ถ้ามี kWpData จาก database ให้ใช้ actual เดิม
              if (data.kWpData) {
                try {
                  const parsedKWp = JSON.parse(data.kWpData);
                  setKWpData({
                    estimate100: estimate100,
                    estimate70: estimate70,
                    actual: parsedKWp.actual || ''
                  });
                } catch (e) {
                  setKWpData({
                    estimate100: estimate100,
                    estimate70: estimate70,
                    actual: ''
                  });
                }
              } else {
                setKWpData({
                  estimate100: estimate100,
                  estimate70: estimate70,
                  actual: ''
                });
              }
            }
          } catch (e) {
            console.log('Could not parse summaryData:', e);
          }
        } else if (data.kWpData) {
          // ถ้าไม่มี summaryData แต่มี kWpData ให้โหลด kWpData
          try {
            const parsedKWp = JSON.parse(data.kWpData);
            setKWpData(parsedKWp);
          } catch (e) {
            console.log('Could not parse kWpData:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error loading agency:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลหน่วยงานได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoordinatorSelect = (coordinatorId) => {
    console.log('Selected coordinator ID:', coordinatorId);
    
    if (!coordinatorId) {
      setFormData(prev => ({
        ...prev,
        coordinatorId: '',
        coordinatorPhone: '',
        coordinatorName: ''
      }));
      return;
    }
    
    const selected = coordinatorsList.find(c => c.id === parseInt(coordinatorId));
    console.log('Selected coordinator:', selected);
    
    if (selected) {
      setFormData(prev => ({
        ...prev,
        coordinatorId: selected.id?.toString() || '',
        coordinatorPhone: selected.phone || selected.phoneNumber || '',
        coordinatorName: selected.fullName || selected.name || ''
      }));
    }
  };

  const handleEquipmentChange = (id, field, value) => {
    setEquipmentData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSummaryChange = (field, value) => {
    setSummaryData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // ถ้าแก้ไข additionalQuantity (เพิ่ม) ให้คำนวณ kWp อัตโนมัติ
      if (field === 'additionalQuantity') {
        const quantity = parseFloat(value) || 0;
        
        // สูตร: quantity * 12 เดือน / 500
        const estimate100 = (quantity * 12 / 500).toFixed(2);
        const estimate70 = (quantity * 12 / 500 * 0.7).toFixed(2);
        
        setKWpData({
          estimate100: estimate100,
          estimate70: estimate70,
          actual: kWpData.actual // เก็บค่าเดิม
        });
        
        console.log('Auto-calculated kWp:', { estimate100, estimate70 });
      }
      
      return newData;
    });
  };

  const handleKWpChange = (field, value) => {
    setKWpData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.agencyName) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูล',
          text: 'กรุณากรอกชื่อหน่วยงาน',
          confirmButtonColor: '#f59e0b'
        });
        setLoading(false);
        return;
      }

      console.log('Updating agency with ID:', agencyId);
      console.log('Form data:', formData);
      console.log('Equipment data:', equipmentData);
      console.log('Summary data:', summaryData);
      console.log('kWp data:', kWpData);

      // Update data
      const updateData = {
        ministry: formData.ministry,
        affiliation: formData.affiliation,
        coordinatorId: parseInt(formData.coordinatorId) || null,
        position: formData.position,
        salutation: formData.salutation,
        phoneNumber: formData.phoneNumber,
        coordinator2: formData.coordinator2,
        coordinator2Phone: formData.coordinator2Phone,
        coordinator3: formData.coordinator3,
        // เพิ่มข้อมูลตาราง (อาจต้องเก็บเป็น JSON string)
        equipmentData: JSON.stringify(equipmentData),
        summaryData: JSON.stringify(summaryData),
        kWpData: JSON.stringify(kWpData),
      };

      const response = await projectsAPI.updateProject(agencyId, updateData);
      
      console.log('Update response:', response);

      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          text: 'บันทึกข้อมูลหน่วยงานเรียบร้อยแล้ว',
          confirmButtonColor: '#10b981'
        });
        
        navigate('/admin/organization-details');
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating agency:', error);
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

  if (!agencyId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">ไม่พบ ID ของหน่วยงาน</p>
          <Button onClick={() => navigate('/admin/organization-details')}>
            กลับไปหน้ารายการ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/organization-details')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              แก้ไขข้อมูลหน่วยงาน
            </h1>
            <p className="text-slate-600 mt-1">
              {formData.agencyName || 'กำลังโหลด...'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center text-blue-900 text-xl">
              <Building2 className="w-6 h-6 mr-2" />
              ข้อมูลหน่วยงาน
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Side - Form (8 columns) */}
              <div className="col-span-8 space-y-4">
                {/* Row 1: ชื่อหน่วยงาน, ที่ตั้งหน่วยงาน, ที่อยู่หน่วยงาน */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1 block">ชื่อหน่วยงาน</Label>
                    <Input
                      value={formData.agencyName || ''}
                      disabled
                      className="h-8 text-sm bg-slate-50 border-slate-300"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">ที่ตั้งหน่วยงาน</Label>
                    <Input
                      value={formData.province || ''}
                      disabled
                      className="h-8 text-sm bg-slate-50 border-slate-300"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">ที่อยู่หน่วยงาน</Label>
                    <Input
                      value={formData.address || ''}
                      disabled
                      className="h-8 text-sm bg-slate-50 border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 2: หมายเหตุผู้นำ, อำเภอ, ตำบล */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1 block">หมายเหตุผู้นำ(ถ้ามี)</Label>
                    <Input
                      value={formData.position || ''}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="ระบุหมายเหตุ"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">อำเภอ</Label>
                    <Input
                      value={formData.district || ''}
                      disabled
                      className="h-8 text-sm bg-slate-50 border-slate-300"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">ตำบล</Label>
                    <Input
                      value={formData.subdistrict || ''}
                      disabled
                      className="h-8 text-sm bg-slate-50 border-slate-300"
                    />
                  </div>
                </div>

                {/* Row 3: ชื่อ ยศ., เบอร์ติดต่อหน่วยงาน, อีเมลหน่วยงาน */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1 block">ชื่อ ยศ.</Label>
                    <Input
                      value={formData.salutation || ''}
                      onChange={(e) => handleInputChange('salutation', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="นาย/นาง/นางสาว"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">เบอร์ติดต่อหน่วยงาน</Label>
                    <Input
                      value={formData.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="เบอร์โทร"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">อีเมลหน่วยงาน</Label>
                    <Input
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="อีเมล"
                    />
                  </div>
                </div>

                {/* Row 4: กระทรวง, สังกัด, ผู้ประสานงานที่โอนเซอบ */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1 block">กระทรวง</Label>
                    <Input
                      value={formData.ministry || ''}
                      onChange={(e) => handleInputChange('ministry', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="กระทรวง"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">สังกัด</Label>
                    <Input
                      value={formData.affiliation || ''}
                      onChange={(e) => handleInputChange('affiliation', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="สังกัด"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">ผู้ประสานงานที่โอนเซอบ</Label>
                    <Input
                      value={formData.coordinator3 || ''}
                      onChange={(e) => handleInputChange('coordinator3', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="ผู้ประสานงาน"
                    />
                  </div>
                </div>

                {/* Row 5: ชื่อ ผู้ประสานงาน 1, เบอร์ที่โประสานงาน 1, EPC ผู้รับผิดชอบ */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1 block">ชื่อ ผู้ประสานงาน 1</Label>
                    <select
                      value={formData.coordinatorId || ''}
                      onChange={(e) => handleCoordinatorSelect(e.target.value)}
                      className="w-full h-8 px-2 text-sm rounded-md border border-blue-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    >
                      <option value="">-- เลือก --</option>
                      {coordinatorsList.map((coord) => (
                        <option key={coord.id} value={coord.id}>
                          {coord.fullName || coord.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">เบอร์ที่โประสานงาน 1</Label>
                    <Input
                      value={formData.coordinatorPhone || ''}
                      disabled
                      className="h-8 text-sm bg-slate-50 border-slate-300"
                      placeholder="เบอร์อัตโนมัติ"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">Epc ผู้รับผิดชอบ</Label>
                    <Input
                      value={formData.epcName || ''}
                      onChange={(e) => handleInputChange('epcName', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="EPC"
                    />
                  </div>
                </div>

                {/* Row 6: ชื่อ ผู้ประสานงาน 2, เบอร์ที่โประสานงาน 2 */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-medium mb-1 block">ชื่อ ผู้ประสานงาน 2</Label>
                    <Input
                      value={formData.coordinator2 || ''}
                      onChange={(e) => handleInputChange('coordinator2', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="ผู้ประสานงาน 2"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium mb-1 block">เบอร์ที่โประสานงาน 2</Label>
                    <Input
                      value={formData.coordinator2Phone || ''}
                      onChange={(e) => handleInputChange('coordinator2Phone', e.target.value)}
                      className="h-8 text-sm border-blue-300"
                      placeholder="เบอร์โทร"
                    />
                  </div>
                  <div></div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'กำลังบันทึก...' : 'แก้ไขข้อมูล'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin/organization-details')}
                    className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                  >
                    ย้อนกลับ
                  </Button>
                </div>
              </div>

              {/* Right Side - Table (4 columns) */}
              <div className="col-span-4">
                <div className="border rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-blue-600 text-white grid grid-cols-3 text-center text-xs font-semibold">
                    <div className="border-r border-blue-500 py-1">เลข</div>
                    <div className="border-r border-blue-500 py-1">จำนวนหน่วยที่ใช้เฉลี่ย (kWh)</div>
                    <div className="py-1">ค่าใช้จ่าย (บาท)</div>
                  </div>
                  
                  {/* Table Rows */}
                  {equipmentData.map((item) => (
                    <div 
                      key={item.id} 
                      className={`grid grid-cols-3 text-center text-xs ${
                        item.id % 2 === 0 ? 'bg-blue-100' : 'bg-white'
                      } border-b`}
                    >
                      <div className="border-r py-1 flex items-center justify-center">{item.id}</div>
                      <div className="border-r py-1 px-1">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleEquipmentChange(item.id, 'quantity', e.target.value)}
                          className="w-full h-6 text-center text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                      <div className="py-1 px-1">
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) => handleEquipmentChange(item.id, 'cost', e.target.value)}
                          className="w-full h-6 text-center text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Summary Rows */}
                  <div className="grid grid-cols-3 text-center text-xs bg-white border-b font-medium">
                    <div className="border-r py-1 flex items-center justify-center">รวม</div>
                    <div className="border-r py-1 px-1">
                      <input
                        type="number"
                        value={summaryData.totalQuantity}
                        onChange={(e) => handleSummaryChange('totalQuantity', e.target.value)}
                        className="w-full h-6 text-center text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none font-medium"
                        placeholder="0"
                      />
                    </div>
                    <div className="py-1 px-1">
                      <input
                        type="number"
                        value={summaryData.totalCost}
                        onChange={(e) => handleSummaryChange('totalCost', e.target.value)}
                        className="w-full h-6 text-center text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none font-medium"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-center text-xs bg-white border-b font-medium">
                    <div className="border-r py-1 flex items-center justify-center">เพิ่ม</div>
                    <div className="border-r py-1 px-1">
                      <input
                        type="number"
                        value={summaryData.additionalQuantity}
                        onChange={(e) => handleSummaryChange('additionalQuantity', e.target.value)}
                        className="w-full h-6 text-center text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none font-medium"
                        placeholder="0"
                      />
                    </div>
                    <div className="py-1 px-1">
                      <input
                        type="number"
                        value={summaryData.additionalCost}
                        onChange={(e) => handleSummaryChange('additionalCost', e.target.value)}
                        className="w-full h-6 text-center text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none font-medium"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  {/* KWp Section */}
                  <div className="bg-blue-600 text-white text-center text-xs font-semibold py-1">
                    ชนาดตึดตั้ง - kWp
                  </div>
                  <div className="grid grid-cols-2 text-xs">
                    <div className="border-r border-b py-1 px-2 flex items-center">ประมาณการ 100%</div>
                    <div className="bg-blue-100 border-b py-1 px-1">
                      <input
                        type="text"
                        value={kWpData.estimate100}
                        readOnly
                        className="w-full h-6 text-center text-xs border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
                        placeholder="คำนวณอัตโนมัติ"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 text-xs">
                    <div className="border-r border-b py-1 px-2 flex items-center">ประมาณการ 70%</div>
                    <div className="bg-blue-100 border-b py-1 px-1">
                      <input
                        type="text"
                        value={kWpData.estimate70}
                        readOnly
                        className="w-full h-6 text-center text-xs border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
                        placeholder="คำนวณอัตโนมัติ"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 text-xs">
                    <div className="border-r py-1 px-2 bg-orange-200 flex items-center">ติดตั้งจริง</div>
                    <div className="bg-orange-200 py-1 px-1">
                      <input
                        type="number"
                        value={kWpData.actual}
                        onChange={(e) => handleKWpChange('actual', e.target.value)}
                        className="w-full h-6 text-center text-xs border border-orange-400 rounded focus:border-orange-600 focus:outline-none bg-orange-100"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAgency;
