import React, { useState } from 'react';
import { FileText, Save, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const DocumentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    documentPrefix: 'ชร',
    defaultYear: '2568',
    headerText: 'บริษัท EVOLUTION ENERGY TECH จำกัด',
    footerText: 'บริษัท EVOLUTION ENERGY TECH จำกัด 123 ถนนสุขุมวิท กรุงเทพฯ 10110',
    documentTitle: 'เชิญเข้าร่วมโครงการติดตั้งและบำรุงรักษาอุปกรณ์ประหยัดพลังงานในระบบการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ที่ติดตั้งบนหลังคา (Solar Rooftop)'
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "✅ บันทึกสำเร็จ",
        description: "การตั้งค่าเอกสารได้รับการบันทึกเรียบร้อยแล้ว",
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
            <FileText className="h-8 w-8 text-blue-600" />
            การตั้งค่าเอกสาร
          </h1>
          <p className="text-slate-600">จัดการการตั้งค่าของเอกสารและรายละเอียดต่างๆ</p>
        </div>

        {/* Document Settings Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              ตั้งค่าระบบเลขที่เอกสาร
            </CardTitle>
            <CardDescription>กำหนดรูปแบบและเลขที่เอกสารที่จะใช้ในระบบ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>คำนำหน้าลเลขที่เอกสาร</Label>
                <Input
                  value={settings.documentPrefix}
                  onChange={(e) => setSettings({...settings, documentPrefix: e.target.value})}
                  placeholder="ชร"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">เช่น ชร, ทว, อว</p>
              </div>
              <div>
                <Label>ปีที่ใช้ในระบบ</Label>
                <Input
                  value={settings.defaultYear}
                  onChange={(e) => setSettings({...settings, defaultYear: e.target.value})}
                  placeholder="2568"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">ปี พ.ศ.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Content Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              เนื้อหาเอกสาร
            </CardTitle>
            <CardDescription>กำหนดข้อความและเนื้อหาที่จะแสดงในเอกสาร</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <Label>ชื่อบริษัท/หน่วยงาน</Label>
              <Input
                value={settings.headerText}
                onChange={(e) => setSettings({...settings, headerText: e.target.value})}
                placeholder="บริษัท EVOLUTION ENERGY TECH จำกัด"
                className="mt-2"
              />
            </div>
            <div>
              <Label>ที่อยู่บริษัท (Footer)</Label>
              <Textarea
                value={settings.footerText}
                onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                placeholder="บริษัท EVOLUTION ENERGY TECH จำกัด 123 ถนนสุขุมวิท กรุงเทพฯ 10110"
                className="mt-2"
                rows={3}
              />
            </div>
            <div>
              <Label>หัวเรื่องเอกสาร</Label>
              <Textarea
                value={settings.documentTitle}
                onChange={(e) => setSettings({...settings, documentTitle: e.target.value})}
                placeholder="หัวเรื่องเอกสาร..."
                className="mt-2"
                rows={3}
              />
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

export default DocumentSettings;
