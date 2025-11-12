import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone, Building2, FileText, Upload, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { coordinatorsAPI } from '@/services/api';
import Swal from 'sweetalert2';

const EditCoordinator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Extract coordinatorId from URL
  const getCoordinatorIdFromUrl = () => {
    const match = location.pathname.match(/\/admin\/edit-coordinator\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const coordinatorId = getCoordinatorIdFromUrl();
  
  console.log('EditCoordinator - URL:', location.pathname);
  console.log('EditCoordinator - coordinatorId:', coordinatorId);
  
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    bank: '',
    bankAccountNumber: '',
    email: '',
    idCardNumber: '',
    province: '',
    district: '',
    subdistrict: '',
    postalCode: '',
  });

  const [documents, setDocuments] = useState({
    idCard: null,
    bankStatement: null,
    idCardName: '',
    bankStatementName: '',
  });

  useEffect(() => {
    if (coordinatorId) {
      loadCoordinatorData();
    } else {
      setLoading(false);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบ ID ของผู้ประสานงาน",
        variant: "destructive"
      });
    }
  }, [coordinatorId]);

  const loadCoordinatorData = async () => {
    if (!coordinatorId) return;
    
    try {
      setLoading(true);
      console.log('Loading coordinator data for ID:', coordinatorId);
      
      const response = await coordinatorsAPI.getCoordinatorById(coordinatorId);
      console.log('Coordinator data response:', response);
      
      if (response.success || response.data) {
        const coordData = response.data || response;
        
        setFormData({
          fullName: coordData.fullName || coordData.name || '',
          address: coordData.address || '',
          phone: coordData.phone || coordData.phoneNumber || '',
          bank: coordData.bank || '',
          bankAccountNumber: coordData.bankAccountNumber || '',
          email: coordData.email || '',
          idCardNumber: coordData.idCardNumber || '',
          province: coordData.province || '',
          district: coordData.district || '',
          subdistrict: coordData.subdistrict || '',
          postalCode: coordData.postalCode || '',
        });

        // Set existing document names
        setDocuments(prev => ({
          ...prev,
          idCardName: coordData.idCardFile || '',
          bankStatementName: coordData.bankStatementFile || '',
        }));
      }
    } catch (error) {
      console.error('Error loading coordinator:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลผู้ประสานงานได้",
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
      if (!formData.fullName || !formData.phone) {
        Swal.fire({
          icon: 'warning',
          title: 'กรุณากรอกข้อมูล',
          text: 'กรุณากรอกชื่อและเบอร์ติดต่อ',
          confirmButtonColor: '#f59e0b'
        });
        setLoading(false);
        return;
      }

      console.log('Updating coordinator with ID:', coordinatorId);
      console.log('Form data:', formData);

      const response = await coordinatorsAPI.updateCoordinator(coordinatorId, formData);
      
      console.log('Update response:', response);

      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          text: 'บันทึกข้อมูลผู้ประสานงานเรียบร้อยแล้ว',
          confirmButtonColor: '#10b981'
        });
        
        navigate('/admin/organization-details');
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating coordinator:', error);
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

  if (loading && !formData.fullName) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!coordinatorId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">ไม่พบ ID ของผู้ประสานงาน</p>
          <Button onClick={() => navigate('/admin/organization-details')}>
            กลับไปหน้ารายการ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
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
              <User className="h-8 w-8 text-orange-600" />
              แก้ไขข้อมูลผู้ประสานงาน
            </h1>
            <p className="text-slate-600 mt-1">
              {formData.fullName || 'กำลังโหลด...'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
            <CardTitle className="flex items-center gap-2 text-orange-900 text-xl">
              <User className="w-6 h-6" />
              ข้อมูลผู้ประสานงาน/Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Row 1: ชื่อ, ที่อยู่, เบอร์ติดต่อ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <User className="w-4 h-4 text-orange-600" />
                  ชื่อ <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="ชื่อผู้ประสานงาน"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <MapPin className="w-4 h-4 text-green-600" />
                  ที่อยู่
                </Label>
                <Input
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="ที่อยู่"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Phone className="w-4 h-4 text-blue-600" />
                  เบอร์ติดต่อ <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="เบอร์โทรศัพท์"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 2: บัญชีธนาคาร, เลขบัญชีธนาคาร */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  บัญชีธนาคาร
                </Label>
                <Input
                  value={formData.bank || ''}
                  onChange={(e) => handleInputChange('bank', e.target.value)}
                  placeholder="ชื่อธนาคาร"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  เลขบัญชีธนาคาร
                </Label>
                <Input
                  value={formData.bankAccountNumber || ''}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                  placeholder="เลขที่บัญชี"
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ไฟล์เอกสาร */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">ไฟล์เอกสาร</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. ไฟล์ใบประชาบัตร */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText className="w-4 h-4 text-blue-600" />
                      ไฟล์ใบประชาบัตร.pdf
                    </Label>
                  </div>
                  {documents.idCardName && (
                    <a
                      href={`/uploads/coordinators/${documents.idCardName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block mb-2"
                    >
                      📄 {documents.idCardName}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        onChange={(e) => handleFileChange('idCard', e.target.files[0])}
                        className="hidden"
                        accept=".pdf"
                      />
                      <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                      </div>
                    </label>
                    {documents.idCard && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ {documents.idCard.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. ไฟล์สำเนาบัญชีธนาคาร */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <FileText className="w-4 h-4 text-green-600" />
                      ไฟล์สำเนาบัญชีธนาคาร.pdf
                    </Label>
                  </div>
                  {documents.bankStatementName && (
                    <a
                      href={`/uploads/coordinators/${documents.bankStatementName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block mb-2"
                    >
                      📄 {documents.bankStatementName}
                    </a>
                  )}
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        onChange={(e) => handleFileChange('bankStatement', e.target.files[0])}
                        className="hidden"
                        accept=".pdf"
                      />
                      <div className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2 text-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                      </div>
                    </label>
                    {documents.bankStatement && (
                      <span className="text-xs text-green-600 font-medium">
                        ✓ {documents.bankStatement.name}
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

export default EditCoordinator;

