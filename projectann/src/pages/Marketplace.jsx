import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DebtCard from '@/components/DebtCard';

const Marketplace = ({ onViewDebt, user }) => {
  const [debts, setDebts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // ล้างข้อมูลเก่าและใช้ข้อมูลใหม่
    localStorage.removeItem('debts');
      const initialDebts = [
        {
          id: '1',
          phoneModel: 'iPhone 14 Pro Max 256GB',
          remainingDebt: 28500,
          principal: 25000,
          interest: 2500,
          penalty: 1000,
          overdueInstallments: 3,
          totalInstallments: 24,
          debtType: 'installment',
          location: {
            village: 'หมู่บ้านสวนสุข',
            moo: '5',
            tambon: 'บางกะปิ',
            amphoe: 'ห้วยขวาง',
            province: 'กรุงเทพมหานคร'
          },
          occupation: 'พนักงานบริษัท',
          workplace: 'บริษัท ABC จำกัด',
          status: 'available',
          accessLevel: 'public',
          phoneNumber: '081-234-5678',
          email: 'user1@example.com',
          creditScore: 720,
          lastPaymentDate: '2024-01-15',
          nextPaymentDate: '2024-02-15',
          monthlyPayment: 1200,
          interestRate: 12.5,
          purchaseDate: '2023-06-15',
          warrantyExpiry: '2025-06-15'
        },
        {
          id: '2',
          phoneModel: 'Samsung Galaxy S23 Ultra 512GB',
          remainingDebt: 35000,
          principal: 30000,
          interest: 3500,
          penalty: 1500,
          overdueInstallments: 5,
          totalInstallments: 36,
          debtType: 'loan',
          location: {
            village: 'หมู่บ้านมณีรัตน์',
            moo: '3',
            tambon: 'ลาดพร้าว',
            amphoe: 'วังทองหลาง',
            province: 'กรุงเทพมหานคร'
          },
          occupation: 'ค้าขาย',
          workplace: 'ร้านค้าส่วนตัว',
          status: 'available',
          accessLevel: 'public',
          phoneNumber: '082-345-6789',
          email: 'user2@example.com',
          creditScore: 680,
          lastPaymentDate: '2024-01-10',
          nextPaymentDate: '2024-02-10',
          monthlyPayment: 1500,
          interestRate: 15.0,
          purchaseDate: '2023-08-20',
          warrantyExpiry: '2025-08-20'
        },
        {
          id: '3',
          phoneModel: 'iPhone 13 128GB',
          remainingDebt: 18000,
          principal: 15000,
          interest: 2000,
          penalty: 1000,
          overdueInstallments: 2,
          totalInstallments: 18,
          debtType: 'installment',
          location: {
            village: 'หมู่บ้านสุขสันต์',
            moo: '7',
            tambon: 'บางนา',
            amphoe: 'บางนา',
            province: 'กรุงเทพมหานคร'
          },
          occupation: 'ข้าราชการ',
          workplace: 'กระทรวงการคลัง',
          status: 'available',
          accessLevel: 'public',
          phoneNumber: '083-456-7890',
          email: 'user3@example.com',
          creditScore: 750,
          lastPaymentDate: '2024-01-20',
          nextPaymentDate: '2024-02-20',
          monthlyPayment: 1000,
          interestRate: 10.0,
          purchaseDate: '2023-05-10',
          warrantyExpiry: '2025-05-10'
        },
        {
          id: '4',
          phoneModel: 'Samsung Galaxy A54 5G 256GB',
          remainingDebt: 22000,
          principal: 20000,
          interest: 1500,
          penalty: 500,
          overdueInstallments: 1,
          totalInstallments: 12,
          debtType: 'installment',
          location: {
            village: 'หมู่บ้านวิลล่า',
            moo: '2',
            tambon: 'ลาดกระบัง',
            amphoe: 'ลาดกระบัง',
            province: 'กรุงเทพมหานคร'
          },
          occupation: 'ครู',
          workplace: 'โรงเรียนประถมศึกษา',
          status: 'available',
          accessLevel: 'public',
          phoneNumber: '084-567-8901',
          email: 'user4@example.com',
          creditScore: 690,
          lastPaymentDate: '2024-01-25',
          nextPaymentDate: '2024-02-25',
          monthlyPayment: 1800,
          interestRate: 11.5,
          purchaseDate: '2023-09-05',
          warrantyExpiry: '2025-09-05'
        }
      ];
      localStorage.setItem('debts', JSON.stringify(initialDebts));
      setDebts(initialDebts);
  }, []);

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = debt.phoneModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         debt.location.province.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || debt.debtType === filterType;
    const isAvailable = debt.status === 'available';
    return matchesSearch && matchesFilter && isAvailable;
  });

  return (
    <div className="space-y-8">
      <Helmet>
        <title>ตลาดหนี้มือถือ - รายการหนี้ทั้งหมด</title>
        <meta name="description" content="เลือกดูรายการหนี้มือถือที่เปิดขาย พร้อมข้อมูลครบถ้วน" />
      </Helmet>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 p-8 md:p-12 text-center"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
        
        <div className="relative z-10 space-y-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            ตลาดหนี้มือถือ
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            เลือกซื้อหนี้คุณภาพ ลงทุนอย่างชาญฉลาด
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            className="flex justify-center gap-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{debts.length}</div>
              <div className="text-sm text-primary-200">รายการหนี้</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-sm text-primary-200">ข้อมูลจริง</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-primary-200">บริการ</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/60 w-5 h-5" />
            <Input
              placeholder="ค้นหารุ่นมือถือ หรือจังหวัด..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg border-primary/30 focus:border-primary focus:ring-primary/20"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className={`px-6 py-3 font-semibold transition-all duration-200 ${
                filterType === 'all' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'border-primary/30 text-primary hover:bg-primary/5'
              }`}
            >
              ทั้งหมด
            </Button>
            <Button
              variant={filterType === 'installment' ? 'default' : 'outline'}
              onClick={() => setFilterType('installment')}
              className={`px-6 py-3 font-semibold transition-all duration-200 ${
                filterType === 'installment' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'border-primary/30 text-primary hover:bg-primary/5'
              }`}
            >
              เช่าซื้อ
            </Button>
            <Button
              variant={filterType === 'loan' ? 'default' : 'outline'}
              onClick={() => setFilterType('loan')}
              className={`px-6 py-3 font-semibold transition-all duration-200 ${
                filterType === 'loan' 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'border-primary/30 text-primary hover:bg-primary/5'
              }`}
            >
              เงินกู้
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">พบ {filteredDebts.length} รายการ</span>
            </div>
            {searchTerm && (
              <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-lg">
                <span className="text-muted-foreground">ค้นหา:</span>
                <span className="font-medium text-foreground">"{searchTerm}"</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground">
            อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredDebts.map((debt, index) => (
          <DebtCard 
            key={debt.id} 
            debt={debt} 
            onViewDebt={onViewDebt}
            index={index}
          />
        ))}
      </div>

      {filteredDebts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-xl text-muted-foreground">ไม่พบรายการหนี้ที่ตรงกับการค้นหา</p>
        </motion.div>
      )}
    </div>
  );
};

export default Marketplace;