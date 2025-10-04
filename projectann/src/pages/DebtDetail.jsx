import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Calendar, MapPin, Briefcase, FileText, MessageCircle, Lock, CheckCircle, Clock, Shield, TrendingUp, DollarSign, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

// Import phone images
import iPhone14ProMax from '@/assets/14promax.jpeg';
import SamsungS23Ultra from '@/assets/samsungs23ultra.jpg';
import iPhone13 from '@/assets/iPhone13Midnight_PDP_Position1AMidnight.webp';
import SamsungA54 from '@/assets/SamsungGalaxyA545G256GB.jpg';

const DebtDetail = ({ debt, user, onBack }) => {
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
    return null;
  };

  if (!debt) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-muted-foreground">ไม่พบข้อมูลหนี้</p>
        <Button onClick={onBack} className="mt-4">กลับไปหน้าหลัก</Button>
      </div>
    );
  }

  const phoneImage = getPhoneImage(debt.phoneModel);

  const handleBuyDebt = () => {
    const message = `สวัสดีครับ ผม/ดิฉันสนใจซื้อหนี้รหัส ${debt.id}\n\nรายละเอียด:\n- รุ่นมือถือ: ${debt.phoneModel}\n- ยอดหนี้: ฿${debt.remainingDebt.toLocaleString()}\n- ค้าง: ${debt.overdueInstallments} งวด\n\nรบกวนติดต่อกลับด้วยครับ/ค่ะ`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://line.me/R/oaMessage/@admin?${encodedMessage}`, '_blank');
    
    toast({
      title: "กำลังเชื่อมต่อ LINE",
      description: "กรุณารอสักครู่...",
    });
  };

  const canViewFullDetails = user && (user.role === 'admin' || (user.approvedDebts && user.approvedDebts.includes(debt.id)));
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>รายละเอียดหนี้ - {debt.phoneModel}</title>
        <meta name="description" content={`ข้อมูลหนี้มือถือ ${debt.phoneModel} ยอดคงเหลือ ${debt.remainingDebt} บาท`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้าหลัก
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Product Card */}
            <div className="glass-card rounded-2xl p-8 border border-primary/20">
              <div className="text-center space-y-6">
                {/* Phone Image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  {phoneImage ? (
                    <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-2xl bg-white p-4">
                      <img
                        src={phoneImage}
                        alt={debt.phoneModel}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 mx-auto rounded-2xl bg-secondary flex items-center justify-center shadow-2xl">
                      <Smartphone className="w-16 h-16 text-primary" />
                    </div>
                  )}
                </motion.div>

                {/* Product Info */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h1 className="text-2xl font-bold text-foreground">{debt.phoneModel}</h1>
                    <Badge 
                      variant={debt.debtType === 'installment' ? 'default' : 'secondary'}
                      className={`text-sm px-4 py-2 ${
                        debt.debtType === 'installment' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {debt.debtType === 'installment' ? 'เช่าซื้อสินค้า' : 'เงินกู้'}
                    </Badge>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center"
                  >
                    <p className="text-sm text-muted-foreground mb-2">รหัสหนี้</p>
                    <p className="text-xl font-bold text-primary">#{debt.id}</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                size="lg"
                className="w-full text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleBuyDebt}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                ติดต่อซื้อหนี้ผ่าน LINE
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Financial Summary */}
            <div className="glass-card rounded-2xl p-8 border border-primary/20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold text-primary mb-2">฿{debt.remainingDebt.toLocaleString()}</h2>
                <p className="text-muted-foreground">ยอดหนี้คงเหลือ</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'เงินต้น', value: debt.principal, icon: DollarSign, color: 'text-green-600' },
                  { label: 'ดอกเบี้ย', value: debt.interest, icon: TrendingUp, color: 'text-amber-600' },
                  { label: 'ค่าปรับ', value: debt.penalty, icon: Clock, color: 'text-red-600' }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-secondary/50 p-6 rounded-xl text-center"
                  >
                    <item.icon className={`w-8 h-8 mx-auto mb-3 ${item.color}`} />
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className={`text-xl font-bold ${item.color}`}>฿{item.value.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contract Details */}
            <div className="glass-card rounded-2xl p-8 border border-primary/20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6"
              >
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-primary" />
                  ข้อมูลสัญญา
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Calendar,
                    label: 'งวดที่ค้าง',
                    value: `${debt.overdueInstallments} งวด จาก ${debt.totalInstallments} งวด`,
                    color: 'text-blue-600'
                  },
                  {
                    icon: MapPin,
                    label: 'ที่อยู่ลูกหนี้',
                    value: `${debt.location.village} ม.${debt.location.moo}, ต.${debt.location.tambon}, อ.${debt.location.amphoe}, จ.${debt.location.province}`,
                    color: 'text-gray-600'
                  },
                  {
                    icon: Briefcase,
                    label: 'อาชีพ',
                    value: debt.occupation,
                    color: 'text-green-600'
                  },
                  {
                    icon: Building,
                    label: 'สถานที่ทำงาน',
                    value: debt.workplace,
                    color: 'text-purple-600'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="bg-secondary/30 p-6 rounded-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
                        <p className="font-semibold text-foreground">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Access Control */}
            {!isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="glass-card rounded-2xl p-8 border border-amber-200 bg-amber-50/50"
              >
                <div className="text-center">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                  <h3 className="text-2xl font-bold mb-3 text-amber-900">ต้องเข้าสู่ระบบเพื่อดูข้อมูลเพิ่มเติม</h3>
                  <p className="text-amber-700 mb-6">กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อเข้าถึงข้อมูลสัญญาฉบับเต็ม</p>
                </div>
              </motion.div>
            )}

            {isLoggedIn && !canViewFullDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="glass-card rounded-2xl p-8 border border-blue-200 bg-blue-50/50"
              >
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-2xl font-bold mb-3 text-blue-900">รอการอนุมัติจาก Admin</h3>
                  <p className="text-blue-700 mb-6">คุณจะสามารถเข้าถึงข้อมูลสัญญาฉบับเต็มและเอกสารที่เกี่ยวข้องได้ หลังจาก Admin อนุมัติสิทธิ์</p>
                </div>
              </motion.div>
            )}

            {canViewFullDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="glass-card rounded-2xl p-8 border border-green-200 bg-green-50/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-900">ข้อมูลสัญญาฉบับเต็ม</h3>
                </div>
                <div className="space-y-3 text-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>คุณได้รับอนุมัติให้เข้าถึงข้อมูลเต็มแล้ว</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>สามารถดาวน์โหลดเอกสารประกอบได้ใน Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>ข้อมูลติดต่อลูกหนี้และรายละเอียดเพิ่มเติมพร้อมใช้งาน</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DebtDetail;