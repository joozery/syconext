import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, FileText, Download, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const Dashboard = ({ user }) => {
  const [purchasedDebts, setPurchasedDebts] = useState([]);
  const [assignedCases, setAssignedCases] = useState([]);

  useEffect(() => {
    const savedPurchases = localStorage.getItem(`purchases_${user.id}`);
    if (savedPurchases) {
      setPurchasedDebts(JSON.parse(savedPurchases));
    }

    const savedCases = localStorage.getItem(`cases_${user.id}`);
    if (savedCases) {
      setAssignedCases(JSON.parse(savedCases));
    }
  }, [user.id]);

  const handleDownloadDocument = (debtId) => {
    toast({
      title: "กำลังดาวน์โหลดเอกสาร",
      description: `เอกสารหนี้รหัส ${debtId} กำลังดาวน์โหลด...`,
    });
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard - ตลาดหนี้มือถือ</title>
        <meta name="description" content="จัดการหนี้และเคสของคุณ" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border rounded-xl p-6 md:p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">ยินดีต้อนรับ, {user.name}</p>
          </div>
        </div>

        {user.status === 'pending' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="font-bold text-lg text-amber-900">รอการอนุมัติ</h3>
                <p className="text-amber-700">บัญชีของคุณกำลังรอการอนุมัติจาก Admin</p>
              </div>
            </div>
          </div>
        )}

        {user.status === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-bold text-lg text-green-900">บัญชีได้รับการอนุมัติแล้ว</h3>
                <p className="text-green-800">คุณสามารถเข้าถึงฟีเจอร์ทั้งหมดได้แล้ว</p>
              </div>
            </div>
          </div>
        )}

        <Tabs defaultValue="purchased" className="space-y-6">
          <TabsList>
            <TabsTrigger value="purchased">
              <ShoppingBag className="w-4 h-4 mr-2" />
              หนี้ที่ซื้อ
            </TabsTrigger>
            <TabsTrigger value="assigned">
              <FileText className="w-4 h-4 mr-2" />
              เคสที่ได้รับมอบหมาย
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchased" className="space-y-4">
            {purchasedDebts.length === 0 ? (
              <div className="text-center py-12 bg-secondary rounded-xl">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-foreground">ยังไม่มีหนี้ที่ซื้อ</p>
                <p className="text-sm text-muted-foreground mt-2">เริ่มต้นซื้อหนี้จากตลาดหนี้มือถือ</p>
              </div>
            ) : (
              purchasedDebts.map((debt) => (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-xl p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{debt.phoneModel}</h3>
                      <p className="text-muted-foreground">รหัส: #{debt.id}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ซื้อแล้ว
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ยอดหนี้</p>
                      <p className="text-lg font-bold">฿{debt.remainingDebt.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">งวดค้าง</p>
                      <p className="text-lg font-bold">{debt.overdueInstallments} งวด</p>
                    </div>
                  </div>

                  {user.approvedDebts && user.approvedDebts.includes(debt.id) && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownloadDocument(debt.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      ดาวน์โหลดเอกสาร
                    </Button>
                  )}
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            {assignedCases.length === 0 ? (
              <div className="text-center py-12 bg-secondary rounded-xl">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl text-foreground">ยังไม่มีเคสที่ได้รับมอบหมาย</p>
                <p className="text-sm text-muted-foreground mt-2">รอ Admin มอบหมายเคสให้คุณ</p>
              </div>
            ) : (
              assignedCases.map((caseItem) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-xl p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{caseItem.phoneModel}</h3>
                      <p className="text-muted-foreground">รหัส: #{caseItem.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      caseItem.status === 'tracking' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {caseItem.status === 'tracking' ? 'กำลังติดตาม' : 'ปิดแล้ว'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ยอดหนี้</p>
                      <p className="text-lg font-bold">฿{caseItem.remainingDebt.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ค่าตอบแทน</p>
                      <p className="text-lg font-bold text-green-600">฿{caseItem.commission.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDownloadDocument(caseItem.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    ดาวน์โหลดเอกสาร
                  </Button>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;