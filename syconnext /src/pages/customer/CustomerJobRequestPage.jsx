
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sun, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CustomerJobRequestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    area: '',
    requestedDate: '',
    images: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newJob = {
      id: Date.now().toString(),
      ...formData,
      customerName: user.name,
      customerEmail: user.email,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const jobs = JSON.parse(localStorage.getItem('sy_jobs') || '[]');
    jobs.push(newJob);
    localStorage.setItem('sy_jobs', JSON.stringify(jobs));

    toast({
      title: "แจ้งงานสำเร็จ",
      description: "เราจะติดต่อกลับโดยเร็วที่สุด",
    });

    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>แจ้งงาน - SY Connext</title>
        <meta name="description" content="แจ้งงานติดตั้งและบำรุงรักษาระบบไฟฟ้าและโซล่าเซลล์" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2">
              <Sun className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SY Connext
              </span>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าหลัก
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8">
              <h1 className="text-3xl font-bold mb-2">แจ้งงาน</h1>
              <p className="text-gray-600 mb-8">กรอกรายละเอียดงานที่ต้องการ</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">หัวข้องาน</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="เช่น ติดตั้งโซล่าเซลล์"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">รายละเอียด</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="อธิบายรายละเอียดงาน"
                    className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">ประเภทงาน</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทงาน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solar_installation">ติดตั้งโซล่าเซลล์</SelectItem>
                      <SelectItem value="solar_maintenance">บำรุงรักษาโซล่าเซลล์</SelectItem>
                      <SelectItem value="electrical_installation">ติดตั้งระบบไฟฟ้า</SelectItem>
                      <SelectItem value="electrical_repair">ซ่อมแซมระบบไฟฟ้า</SelectItem>
                      <SelectItem value="other">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">พื้นที่</Label>
                  <Input
                    id="area"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="เช่น กรุงเทพมหานคร"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedDate">วันที่ต้องการ</Label>
                  <Input
                    id="requestedDate"
                    type="date"
                    value={formData.requestedDate}
                    onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  ส่งคำขอ
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CustomerJobRequestPage;
