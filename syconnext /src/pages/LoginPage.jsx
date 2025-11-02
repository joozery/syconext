
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import logo from '@/accest/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    
    if (result.success) {
      toast({
        title: "เข้าสู่ระบบสำเร็จ",
        description: "ยินดีต้อนรับกลับมา!",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>เข้าสู่ระบบ - SY Connext</title>
        <meta name="description" content="เข้าสู่ระบบ SY Connext เพื่อจัดการงานและบริการของคุณ" />
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
              <h1 className="text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
              <p className="text-gray-600 mt-2">ยินดีต้อนรับกลับมา</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                เข้าสู่ระบบ
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ยังไม่มีบัญชี?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                  ลงทะเบียน
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

export default LoginPage;
