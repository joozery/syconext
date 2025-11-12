import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Building2, Phone, Hash, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { epcAPI } from '@/services/api';
import Swal from 'sweetalert2';

const EditEpc = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Extract epcId from URL
  const getEpcIdFromUrl = () => {
    const match = location.pathname.match(/\/admin\/edit-epc\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const epcId = getEpcIdFromUrl();
  
  console.log('EditEpc - URL:', location.pathname);
  console.log('EditEpc - epcId:', epcId);
  
  const [formData, setFormData] = useState({
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

  const [documents, setDocuments] = useState({
    nda: null,
    companyCert: null,
    employmentContract: null,
    tndtContract: null,
    ndaName: '',
    companyCertName: '',
    employmentContractName: '',
    tndtContractName: '',
  });

  useEffect(() => {
    if (epcId) {
      loadEpcData();
    } else {
      setLoading(false);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบ ID ของบริษัท EPC",
        variant: "destructive"
      });
    }
  }, [epcId]);

  const loadEpcData = async () => {
    if (!epcId) return;
    
    try {
      setLoading(true);
      console.log('Loading EPC data for ID:', epcId);
      
      const response = await epcAPI.getEpcById(epcId);
      console.log('EPC data response:', response);
      
      if (response.success || response.data) {
        const epcData = response.data || response;
        
        setFormData({
          epcName: epcData.epcName || '',
          epcAddress: epcData.epcAddress || '',
          epcContact: epcData.epcContact || '',
          taxId: epcData.taxId || '',
          coordinatorName: epcData.coordinatorName || '',
          coordinatorContact: epcData.coordinatorContact || '',
          province: epcData.province || '',
          district: epcData.district || '',
          subdistrict: epcData.subdistrict || '',
          postalCode: epcData.postalCode || '',
        });

        // Set existing document names
        setDocuments(prev => ({
          ...prev,
          ndaName: epcData.ndaFile || '',
          companyCertName: epcData.companyCertFile || '',
          employmentContractName: epcData.employmentContractFile || '',
          tndtContractName: epcData.tndtContractFile || '',
        }));
      }
    } catch (error) {
      console.error('Error loading EPC:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลบริษัท EPC ได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [field]: file,
        [`${field}Name`]: file.name
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.epcName || !formData.taxId) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูล',
          text: 'กรุณากรอกชื่อบริษัทและเลขผู้เสียภาษี',
          confirmButtonColor: '#f59e0b'
        });
        setLoading(false);
        return;
      }

      // Prepare form data for file upload
      const submitData = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Append files if they exist
      if (documents.nda) {
        submitData.append('nda', documents.nda);
      }
      if (documents.companyCert) {
        submitData.append('companyCert', documents.companyCert);
      }
      if (documents.employmentContract) {
        submitData.append('employmentContract', documents.employmentContract);
      }
      if (documents.tndtContract) {
        submitData.append('tndtContract', documents.tndtContract);
      }

      console.log('Updating EPC with ID:', epcId);

      const response = await epcAPI.updateEpc(epcId, formData);
      
      console.log('Update response:', response);

      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          text: 'บันทึกข้อมูลบริษัท EPC เรียบร้อยแล้ว',
          confirmButtonColor: '#10b981'
        });
        
        navigate('/admin/organization-details');
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating EPC:', error);
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

  if (loading && !formData.epcName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!epcId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">ไม่พบ ID ของบริษัท EPC</p>
          <Button onClick={() => navigate('/admin/organization-details')}>
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
            onClick={() => navigate('/admin/organization-details')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            ย้อนกลับ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              แก้ไขข้อมูลของบริษัท {formData.epcName} (EPC)
            </h1>
            <p className="text-slate-600 mt-1">
              {formData.epcName || 'กำลังโหลด...'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-900 text-xl">
              <Building2 className="w-6 h-6" />
              ข้อมูลบริษัท EPC
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Row 1: ตั้งอยู่ที่, เบอร์ติดต่อ, เลขผู้เสียภาษี */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  ตั้งอยู่ที่ <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.epcAddress || ''}
                  onChange={(e) => handleInputChange('epcAddress', e.target.value)}
                  placeholder="ที่อยู่บริษัท"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Phone className="w-4 h-4 text-green-600" />
                  เบอร์ติดต่อ <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.epcContact || ''}
                  onChange={(e) => handleInputChange('epcContact', e.target.value)}
                  placeholder="เบอร์โทรศัพท์"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Hash className="w-4 h-4 text-purple-600" />
                  เลขผู้เสียภาษี <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.taxId || ''}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="เลขที่ผู้เสียภาษี"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 2: ผู้ประสานงาน, เบอร์ผู้ประสานงาน */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  ผู้ประสานงาน
                </Label>
                <Input
                  value={formData.coordinatorName || ''}
                  onChange={(e) => handleInputChange('coordinatorName', e.target.value)}
                  placeholder="ชื่อผู้ประสานงาน"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Phone className="w-4 h-4 text-orange-600" />
                  เบอร์ผู้ประสานงาน
                </Label>
                <Input
                  value={formData.coordinatorContact || ''}
                  onChange={(e) => handleInputChange('coordinatorContact', e.target.value)}
                  placeholder="เบอร์โทรศัพท์ผู้ประสานงาน"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ไฟล์เอกสารบริษัท EPC */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">อัปโหลดไฟล์ต่างๆ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. สัญญา NDA */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText className="w-4 h-4 text-blue-600" />
                      อัปโหลดไฟล์ สัญญา NDA
                    </Label>
                  </div>
                  {documents.ndaName && (
                    <a
                      href={`/uploads/epc/${documents.ndaName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block mb-2"
                    >
                      📄 {documents.ndaName}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        onChange={(e) => handleFileChange('nda', e.target.files[0])}
                        className="hidden"
                        accept=".pdf"
                      />
                      <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                      </div>
                    </label>
                    {documents.nda && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ {documents.nda.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. หนังสือรับรองบริษัท */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText className="w-4 h-4 text-green-600" />
                      อัปโหลดไฟล์หนังสือรับรองบริษัท
                    </Label>
                  </div>
                  {documents.companyCertName && (
                    <a
                      href={`/uploads/epc/${documents.companyCertName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block mb-2"
                    >
                      📄 {documents.companyCertName}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        onChange={(e) => handleFileChange('companyCert', e.target.files[0])}
                        className="hidden"
                        accept=".pdf"
                      />
                      <div className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                      </div>
                    </label>
                    {documents.companyCert && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ {documents.companyCert.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. เอกสารสัญญาจ้างงาน */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText className="w-4 h-4 text-purple-600" />
                      อัปโหลดไฟล์เอกสารสัญญาจ้างงาน
                    </Label>
                  </div>
                  {documents.employmentContractName && (
                    <a
                      href={`/uploads/epc/${documents.employmentContractName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block mb-2"
                    >
                      📄 {documents.employmentContractName}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        onChange={(e) => handleFileChange('employmentContract', e.target.files[0])}
                        className="hidden"
                        accept=".pdf"
                      />
                      <div className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center gap-2 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                      </div>
                    </label>
                    {documents.employmentContract && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ {documents.employmentContract.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* 4. ไฟล์อื่นๆ */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText className="w-4 h-4 text-orange-600" />
                      อัปโหลดไฟล์อื่นๆ
                    </Label>
                  </div>
                  {documents.tndtContractName && (
                    <a
                      href={`/uploads/epc/${documents.tndtContractName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block mb-2"
                    >
                      📄 {documents.tndtContractName}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        onChange={(e) => handleFileChange('tndtContract', e.target.files[0])}
                        className="hidden"
                        accept=".pdf"
                      />
                      <div className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded flex items-center gap-2 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                      </div>
                    </label>
                    {documents.tndtContract && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ {documents.tndtContract.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-slate-500 mt-4">
                <p className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  ไฟล์ต้องเป็น PDF ขนาดไฟล์ไม่เกิน 20MB
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/organization-details')}
                className="px-8 bg-orange-500 hover:bg-orange-600 text-white border-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ย้อนกลับ
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="px-12 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    แก้ไขข้อมูล
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

export default EditEpc;

