import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    memberType: 'investor'
  });

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

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === formData.email)) {
      toast({
        title: "อีเมลนี้ถูกใช้งานแล้ว",
        description: "กรุณาใช้อีเมลอื่น",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'member',
      memberType: formData.memberType,
      status: 'pending',
      approvedDebts: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    toast({
      title: "สมัครสมาชิกสำเร็จ!",
      description: "รอการอนุมัติจาก Admin",
    });

    onRegister(newUser);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <Helmet>
        <title>สมัครสมาชิก - ตลาดหนี้มือถือ</title>
        <meta name="description" content="สมัครสมาชิกเพื่อเริ่มต้นลงทุน" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border rounded-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <UserPlus className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">สมัครสมาชิก</h1>
            <p className="text-muted-foreground">เริ่มต้นการลงทุนกับเรา</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="ชื่อของคุณ"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0xx-xxx-xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>ประเภทสมาชิก</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, memberType: 'investor'})}
                  className={`p-3 rounded-md border text-center transition-all ${
                    formData.memberType === 'investor'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-secondary text-muted-foreground hover:bg-accent'
                  }`}
                >
                  นักลงทุน
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, memberType: 'collector'})}
                  className={`p-3 rounded-md border text-center transition-all ${
                    formData.memberType === 'collector'
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-secondary text-muted-foreground hover:bg-accent'
                  }`}
                >
                  นักทวง
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              สมัครสมาชิก
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              มีบัญชีอยู่แล้ว?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-primary hover:underline font-semibold"
              >
                เข้าสู่ระบบ
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;