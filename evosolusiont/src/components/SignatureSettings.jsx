import React, { useState } from 'react';
import { PenTool, Save, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const SignatureSettings = () => {
  const [loading, setLoading] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureSettings, setSignatureSettings] = useState({
    signerName: 'นายวิศรุต ศรีสุข',
    signerPosition: 'ประธานกรรมการ',
    companyName: 'บริษัท EVOLUTION ENERGY TECH จำกัด'
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "❌ ไฟล์ใหญ่เกินไป",
          description: "ขนาดไฟล์ไม่เกิน 2MB",
          variant: "destructive",
        });
        return;
      }
      setSignatureImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSignatureImage(null);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "✅ บันทึกสำเร็จ",
        description: "การตั้งค่าลายเซ็นได้รับการบันทึกเรียบร้อยแล้ว",
      });
    } catch (error) {
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกการตั้งค่าได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3 mb-2">
            <PenTool className="h-8 w-8 text-blue-600" />
            การตั้งค่าลายเซ็น
          </h1>
          <p className="text-slate-600">จัดการลายเซ็นที่ใช้ในเอกสาร</p>
        </div>

        {/* Signature Upload Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-blue-600" />
              อัปโหลดลายเซ็น
            </CardTitle>
            <CardDescription>อัปโหลดรูปภาพลายเซ็นที่ใช้ในเอกสาร</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {signatureImage ? (
              <div className="relative">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <img
                    src={signatureImage}
                    alt="Signature"
                    className="max-w-xs mx-auto"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="mt-2"
                >
                  <X className="w-4 h-4 mr-2" />
                  ลบรูปภาพ
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">ไม่มีลายเซ็นที่อัปโหลด</p>
                <Label htmlFor="signature-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    อัปโหลดรูปภาพ
                  </Button>
                  <Input
                    id="signature-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
                <p className="text-xs text-gray-500 mt-2">รองรับ PNG, JPG (สูงสุด 2MB)</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signer Information Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-purple-600" />
              ข้อมูลผู้ลงนาม
            </CardTitle>
            <CardDescription>ระบุข้อมูลของผู้ลงนามในเอกสาร</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>ชื่อ-นามสกุล</Label>
                <Input
                  value={signatureSettings.signerName}
                  onChange={(e) => setSignatureSettings({...signatureSettings, signerName: e.target.value})}
                  placeholder="นายวิศรุต ศรีสุข"
                  className="mt-2"
                />
              </div>
              <div>
                <Label>ตำแหน่ง</Label>
                <Input
                  value={signatureSettings.signerPosition}
                  onChange={(e) => setSignatureSettings({...signatureSettings, signerPosition: e.target.value})}
                  placeholder="ประธานกรรมการ"
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>ชื่อบริษัท</Label>
              <Input
                value={signatureSettings.companyName}
                onChange={(e) => setSignatureSettings({...signatureSettings, companyName: e.target.value})}
                placeholder="บริษัท EVOLUTION ENERGY TECH จำกัด"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Signature Preview Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5 text-green-600" />
              ตัวอย่างลายเซ็น
            </CardTitle>
            <CardDescription>ตัวอย่างการแสดงลายเซ็นในเอกสาร</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="border-2 border-gray-200 rounded-lg p-8 bg-white">
              <div className="flex justify-center items-center space-x-8">
                {/* Signature Space */}
                <div className="text-center">
                  {signatureImage ? (
                    <img
                      src={signatureImage}
                      alt="Signature"
                      className="max-w-xs mb-2"
                    />
                  ) : (
                    <div className="border-b-2 border-gray-400 w-64 h-24"></div>
                  )}
                  <p className="text-sm text-gray-700 mt-2">({signatureSettings.signerName})</p>
                  <p className="text-sm text-gray-600">{signatureSettings.signerPosition}</p>
                  <p className="text-sm text-gray-600">{signatureSettings.companyName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            <Save className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignatureSettings;
