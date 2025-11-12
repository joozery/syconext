
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { authAPI } from '@/services/api';
import logoEet from '@/assets/logo-eet.png';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call API to login
      const response = await authAPI.login({
        email: username, // Backend expects 'email' field
        password: password
      });

      if (response.success) {
        // Store JWT token
        localStorage.setItem('eep_jwt_token', response.data.token);
        
        // Store user data
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name || `${response.data.user.firstName} ${response.data.user.lastName}`,
          email: response.data.user.email,
          role: response.data.user.role
        };
        
        localStorage.setItem('eep_current_user', JSON.stringify(userData));
        
        toast({
          title: "เข้าสู่ระบบสำเร็จ! 🎉",
          description: `ยินดีต้อนรับ ${userData.name}`,
        });
        
        onLogin(userData);
        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'เข้าสู่ระบบไม่สำเร็จ';
      let errorTitle = 'เข้าสู่ระบบไม่สำเร็จ';
      
      if (error.timeout) {
        errorTitle = 'การเชื่อมต่อหมดเวลา';
        errorMessage = 'เซิร์ฟเวอร์ใช้เวลาตอบสนองนานเกินไป กรุณาลองใหม่อีกครั้ง';
      } else if (error.network) {
        errorTitle = 'ไม่สามารถเชื่อมต่อได้';
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, title: "ปลอดภัย", desc: "ระบบรักษาความปลอดภัยระดับสูง" },
    { icon: Zap, title: "รวดเร็ว", desc: "ประมวลผลข้อมูลแบบ Real-time" },
    { icon: Users, title: "ครบครัน", desc: "รองรับการทำงานหลายระดับ" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-sky-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-3000"></div>
        
        {/* Subtle Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-6xl"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Branding & Features */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-slate-800 space-y-8"
            >
              {/* Logo & Title */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl p-2">
                      <img 
                        src={logoEet} 
                        alt="EVOLUTION ENERGY TECH Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                      EVOLUTION ENERGY TECH
                    </h1>
                    <p className="text-slate-600 text-lg">ระบบบริหารจัดการ ERP</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-semibold text-slate-700">
                    แพลตฟอร์มครบครันสำหรับการจัดการ
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    โครงการและหน่วยงานภายในองค์กร พร้อมระบบอนุมัติและรายงานที่ทันสมัย
                  </p>
                </motion.div>
              </div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="grid grid-cols-1 gap-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:bg-white/80 transition-all duration-300 shadow-sm"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                      <p className="text-slate-600 text-sm">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-2xl"
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">เข้าสู่ระบบ</h3>
                    <p className="text-slate-600">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Username Field */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="username" className="text-slate-700 font-medium">ชื่อผู้ใช้</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-12 h-12 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                          placeholder="กรอกชื่อผู้ใช้"
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Password Field */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="password" className="text-slate-700 font-medium">รหัสผ่าน</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 h-12 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                          placeholder="กรอกรหัสผ่าน"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            กำลังเข้าสู่ระบบ...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            เข้าสู่ระบบ
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Footer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="mt-12 pt-8 border-t border-slate-200"
                  >
                    <div className="flex flex-col items-center gap-6">
                      {/* Logo and Brand */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl p-1.5">
                          <img 
                            src={logoEet} 
                            alt="EEP Logo" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-slate-800">EVOLUTION ENERGY TECH System</h3>
                          <p className="text-sm text-slate-500">ระบบบริหารจัดการ ERP</p>
                        </div>
                      </div>
                      
                      {/* Copyright */}
                      <div className="text-center">
                        <p className="text-sm text-slate-600 font-medium">
                          © 2025 EVOLUTION ENERGY TECH System. All rights reserved.
                        </p>
                      </div>
                      
                      {/* Decorative Line */}
                      <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
