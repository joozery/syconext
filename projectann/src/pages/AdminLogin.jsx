import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const AdminLogin = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Force create admin user
    const adminUser = {
      id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      status: 'approved'
    };
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Current users:', users);
    console.log('Login attempt:', { email, password });
    
    // Always ensure admin user exists
    const adminExists = users.find(u => u.email === 'admin@test.com');
    if (!adminExists) {
      users = [adminUser, ...users];
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Added admin user:', adminUser);
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    console.log('Found user:', user);
    
    if (user && user.role === 'admin') {
      toast({
        title: "เข้าสู่ระบบ Admin สำเร็จ!",
        description: `ยินดีต้อนรับ ${user.name}`,
      });
      onLogin(user);
    } else {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: "เฉพาะ Admin เท่านั้นที่เข้าถึงได้",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login - ตลาดหนี้มือถือ</title>
        <meta name="description" content="เข้าสู่ระบบสำหรับผู้ดูแลระบบ" />
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-md"
      >
        <motion.div
          className="glass-card border border-red-200 dark:border-red-800 rounded-xl p-8 space-y-6 glow-red"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <motion.div
              className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center justify-center"
              variants={iconVariants}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Admin Login
            </h1>
            <p className="text-muted-foreground">เข้าสู่ระบบสำหรับผู้ดูแลระบบ</p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email">อีเมล Admin</Label>
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                </motion.div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-500/20"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน Admin</Label>
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                </motion.div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-red-200 focus:border-red-500 focus:ring-red-500/20"
                  required
                />
                <motion.button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    กำลังเข้าสู่ระบบ...
                  </motion.div>
                ) : (
                  "เข้าสู่ระบบ Admin"
                )}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="button"
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => {
                  setEmail('admin@test.com');
                  setPassword('admin123');
                }}
              >
                🔑 ทดสอบ Admin
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={() => {
                  localStorage.removeItem('users');
                  localStorage.removeItem('currentUser');
                  console.log('Cleared localStorage');
                  toast({
                    title: "ล้างข้อมูลสำเร็จ",
                    description: "ข้อมูล localStorage ถูกล้างแล้ว",
                  });
                }}
              >
                🗑️ ล้างข้อมูล
              </Button>
            </motion.div>
          </motion.form>

          <motion.div variants={itemVariants} className="text-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับไปหน้า Login ปกติ
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="pt-4 border-t border-red-200 dark:border-red-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">🔑 ข้อมูล Admin:</p>
              <div className="space-y-1 text-xs">
                <p><strong>อีเมล:</strong> admin@test.com</p>
                <p><strong>รหัสผ่าน:</strong> admin123</p>
                <p><strong>บทบาท:</strong> Admin</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
