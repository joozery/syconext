import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, MapPin, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const RegisterProject = () => {
  const [formData, setFormData] = useState({
    siteName: '',
    siteCode: '',
    address: '',
    contractor: '',
    coordinator: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newProject = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updates: [],
    };

    const projects = JSON.parse(localStorage.getItem('eep_projects') || '[]');
    projects.push(newProject);
    localStorage.setItem('eep_projects', JSON.stringify(projects));

    toast({
      title: "ลงทะเบียนสำเร็จ! 🎉",
      description: `หน่วยงาน ${formData.siteName} ถูกเพิ่มเข้าระบบแล้ว`,
    });

    setFormData({
      siteName: '',
      siteCode: '',
      address: '',
      contractor: '',
      coordinator: '',
      description: '',
    });
  };

  const handleExcelUpload = () => {
    toast({
      title: "🚧 ฟีเจอร์นี้ยังไม่พร้อมใช้งาน",
      description: "คุณสามารถขอเพิ่มฟีเจอร์นี้ในข้อความถัดไปได้! 🚀",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-6 h-6 text-blue-600" />
            <span>ลงทะเบียนหน่วยงาน</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button
              onClick={handleExcelUpload}
              variant="outline"
              className="w-full border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
            >
              <Upload className="w-5 h-5 mr-2" />
              นำเข้าข้อมูลจากไฟล์ Excel
            </Button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">หรือกรอกข้อมูลด้วยตนเอง</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">ชื่อหน่วยงาน *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="pl-10"
                    placeholder="เช่น สาขากรุงเทพ"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteCode">รหัสหน่วยงาน *</Label>
                <Input
                  id="siteCode"
                  value={formData.siteCode}
                  onChange={(e) => setFormData({ ...formData, siteCode: e.target.value })}
                  placeholder="เช่น BKK-001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">ที่อยู่ *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-10 min-h-[80px]"
                  placeholder="กรอกที่อยู่สถานที่"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contractor">ผู้รับเหมา *</Label>
                <Input
                  id="contractor"
                  value={formData.contractor}
                  onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                  placeholder="เช่น contractor"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coordinator">ผู้ประสานงาน *</Label>
                <Input
                  id="coordinator"
                  value={formData.coordinator}
                  onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                  placeholder="เช่น coordinator"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">รายละเอียดเพิ่มเติม</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[100px]"
                placeholder="กรอกรายละเอียดเพิ่มเติม (ถ้ามี)"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              ลงทะเบียนหน่วยงาน
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterProject;