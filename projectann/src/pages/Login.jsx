import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const Login = ({ onLogin, onSwitchToRegister }) => {
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
    
    if (user) {
      toast({
        title: "เข้าสู่ระบบสำเร็จ!",
        description: `ยินดีต้อนรับ ${user.name}`,
      });
      onLogin(user);
    } else {
      toast({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Helmet>
        <title>เข้าสู่ระบบ - ตลาดหนี้มือถือ</title>
        <meta name="description" content="เข้าสู่ระบบเพื่อเข้าถึงฟีเจอร์ทั้งหมด" />
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-md"
      >
        <motion.div 
          className="glass-card border border-primary/20 rounded-xl p-8 space-y-6 glow-primary"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <motion.div 
              className="w-14 h-14 mx-auto rounded-lg bg-primary text-primary-foreground flex items-center justify-center"
              variants={iconVariants}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <LogIn className="w-7 h-7" />
            </motion.div>
            <h1 className="text-3xl font-bold gradient-text">เข้าสู่ระบบ</h1>
            <p className="text-muted-foreground">ยินดีต้อนรับกลับมา!</p>
          </motion.div>

          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
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
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
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
                  className="pl-10 pr-10"
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
                       className="w-full"
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
                         "เข้าสู่ระบบ"
                       )}
                     </Button>
                   </motion.div>
          </motion.form>

          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-muted-foreground">
              ยังไม่มีบัญชี?{' '}
              <motion.button
                onClick={onSwitchToRegister}
                className="text-primary hover:underline font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                สมัครสมาชิก
              </motion.button>
            </p>
          </motion.div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;