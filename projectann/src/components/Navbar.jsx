import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, LayoutDashboard, Settings, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo2.png';

const Navbar = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  // Animation variants
  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const buttonVariants = {
    initial: { scale: 1, opacity: 1 },
    hover: { 
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.98 }
  };

  const userInfoVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.6
      }}
      className="glass-effect sticky top-0 z-50 border-b border-primary/20"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div 
            variants={logoVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentPage('/')}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: logoLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img 
                src={logo}
                alt="ตลาดหนี้มือถือ"
                className="h-10 md:h-12 w-auto max-w-[180px] object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onLoad={() => setLogoLoaded(true)}
                onError={() => {
                  console.error('Failed to load logo');
                  setLogoLoaded(true);
                }}
              />
              {!logoLoaded && (
                <div className="h-10 md:h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
              )}
            </motion.div>
          </motion.div>

          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {!user ? (
                <motion.div
                  key="auth-buttons"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentPage('/login')}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      เข้าสู่ระบบ
                    </Button>
                  </motion.div>
                         <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                           <Button
                             onClick={() => setCurrentPage('/register')}
                           >
                             <UserPlus className="w-4 h-4 mr-2" />
                             สมัครสมาชิก
                           </Button>
                         </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="user-menu"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentPage('/')}
                      className={`${currentPage === '/' ? 'bg-accent' : ''}`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      ตลาดหนี้
                    </Button>
                  </motion.div>
                  
                  {user.role !== 'admin' && (
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button 
                        variant="ghost" 
                        onClick={() => setCurrentPage('/dashboard')}
                        className={`${currentPage === '/dashboard' ? 'bg-accent' : ''}`}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </motion.div>
                  )}
                  
                         {user.role === 'admin' && (
                           <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                             <Button
                               variant="ghost"
                               onClick={() => setCurrentPage('/admin-dashboard')}
                               className={`${currentPage === '/admin-dashboard' ? 'bg-accent' : ''}`}
                             >
                               <Settings className="w-4 h-4 mr-2" />
                               จัดการระบบ
                             </Button>
                           </motion.div>
                         )}
                  
                  <motion.div 
                    className="flex items-center gap-3 pl-2 border-l"
                    variants={userInfoVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="text-right">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === 'admin' ? 'ผู้ดูแลระบบ' : user.memberType === 'investor' ? 'นักลงทุน' : 'นักทวง'}
                      </p>
                    </div>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={onLogout}
                        whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;