
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import logo from '@/accest/logo.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    company: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านอีกครั้ง",
        variant: "destructive",
      });
      return;
    }

    const { confirmPassword, ...userData } = formData;
    const result = register(userData);
    
    if (result.success) {
      toast({
        title: "ลงทะเบียนสำเร็จ",
        description: "ยินดีต้อนรับสู่ SY Connext!",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "ลงทะเบียนไม่สำเร็จ",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>ลงทะเบียน - SY Connext</title>
        <meta name="description" content="ลงทะเบียนเข้าใช้งาน SY Connext เพื่อเริ่มใช้บริการของเรา" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img 
                  src={logo} 
                  alt="SY Connext Logo" 
                  className="h-20 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ลงทะเบียน</h1>
              <p className="text-gray-600 mt-2">สร้างบัญชีใหม่</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="ชื่อของคุณ"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">ประเภทผู้ใช้</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">ลูกค้า</SelectItem>
                    <SelectItem value="technician">ช่าง</SelectItem>
                    <SelectItem value="accountant">บัญชี</SelectItem>
                    <SelectItem value="admin">แอดมิน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === 'customer' && (
                <div className="space-y-2">
                  <Label htmlFor="company">บริษัท (ถ้ามี)</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="ชื่อบริษัท"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                ลงทะเบียน
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                มีบัญชีอยู่แล้ว?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
