import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Calendar, MapPin, Briefcase, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import phone images
import iPhone14ProMax from '@/assets/14promax.jpeg';
import SamsungS23Ultra from '@/assets/samsungs23ultra.jpg';
import iPhone13 from '@/assets/iPhone13Midnight_PDP_Position1AMidnight.webp';
import SamsungA54 from '@/assets/SamsungGalaxyA545G256GB.jpg';

const DebtCard = ({ debt, onViewDebt, index }) => {
  // Function to get the correct phone image
  const getPhoneImage = (phoneModel) => {
    if (phoneModel.includes('iPhone 14 Pro Max')) {
      return iPhone14ProMax;
    } else if (phoneModel.includes('Samsung Galaxy S23 Ultra')) {
      return SamsungS23Ultra;
    } else if (phoneModel.includes('iPhone 13')) {
      return iPhone13;
    } else if (phoneModel.includes('Samsung Galaxy A54')) {
      return SamsungA54;
    }
    // Fallback to default smartphone icon
    return null;
  };

  const phoneImage = getPhoneImage(debt.phoneModel);

  // Animation variants
  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const amountVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="glass-card rounded-xl border border-primary/20 p-6 space-y-4 transition-shadow duration-300 cursor-pointer card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-24 h-24 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shadow-lg"
            variants={iconVariants}
            whileHover="hover"
          >
            {phoneImage ? (
              <motion.img
                src={phoneImage}
                alt={debt.phoneModel}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                whileHover={{ scale: 1.05 }}
              />
            ) : (
              <Smartphone className="w-8 h-8 text-primary" />
            )}
          </motion.div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{debt.phoneModel}</h3>
            <motion.span 
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                debt.debtType === 'installment' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {debt.debtType === 'installment' ? 'เช่าซื้อสินค้า' : 'เงินกู้'}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <motion.div 
          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
          variants={amountVariants}
          whileHover="hover"
        >
          <span className="text-muted-foreground text-sm">ยอดหนี้คงเหลือ</span>
          <span className="font-bold text-xl text-primary">฿{debt.remainingDebt.toLocaleString()}</span>
        </motion.div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: 'เงินต้น', value: debt.principal, color: 'text-foreground' },
            { label: 'ดอกเบี้ย', value: debt.interest, color: 'text-amber-600' },
            { label: 'ค่าปรับ', value: debt.penalty, color: 'text-red-600' }
          ].map((item, idx) => (
            <motion.div 
              key={item.label}
              className="bg-secondary/50 p-2 rounded-lg text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-muted-foreground">{item.label}</p>
              <p className={`font-semibold ${item.color}`}>฿{item.value.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex items-center gap-2 text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.6 }}
        >
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">ค้าง {debt.overdueInstallments} งวด จาก {debt.totalInstallments} งวด</span>
        </motion.div>

        <motion.div 
          className="flex items-start gap-2 text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.7 }}
        >
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="text-muted-foreground">
            {debt.location.village} ต.{debt.location.tambon} อ.{debt.location.amphoe} จ.{debt.location.province}
          </span>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2 text-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.8 }}
        >
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{debt.occupation} - {debt.workplace}</span>
        </motion.div>
      </div>

      <motion.div 
        className="pt-4 border-t flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.9 }}
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="flex-1">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDebt(debt)}
          >
            <Eye className="w-4 h-4 mr-2" />
            รายละเอียด
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap" className="flex-1">
          <Button
            className="w-full"
            onClick={() => onViewDebt(debt)}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            ซื้อหนี้
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DebtCard;