import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, FileText, User, Phone, MapPin, Calendar, DollarSign, CreditCard, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const AdminDebtAdd = () => {
  const [formData, setFormData] = useState({
    phoneModel: '',
    remainingDebt: '',
    principal: '',
    interest: '',
    penalty: '',
    overdueInstallments: '',
    totalInstallments: '',
    debtType: 'installment',
    borrowerName: '',
    borrowerPhone: '',
    borrowerEmail: '',
    village: '',
    moo: '',
    tambon: '',
    amphoe: '',
    province: '',
    occupation: '',
    workplace: '',
    creditScore: '',
    interestRate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "เพิ่มหนี้สำเร็จ",
        description: "ข้อมูลหนี้ใหม่ถูกเพิ่มเข้าสู่ระบบแล้ว",
      });
      
      // Reset form
      setFormData({
        phoneModel: '',
        remainingDebt: '',
        principal: '',
        interest: '',
        penalty: '',
        overdueInstallments: '',
        totalInstallments: '',
        debtType: 'installment',
        borrowerName: '',
        borrowerPhone: '',
        borrowerEmail: '',
        village: '',
        moo: '',
        tambon: '',
        amphoe: '',
        province: '',
        occupation: '',
        workplace: '',
        creditScore: '',
        interestRate: ''
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มหนี้ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            เพิ่มหนี้ใหม่
          </h1>
          <p className="text-gray-600 mt-2">เพิ่มข้อมูลหนี้มือถือใหม่เข้าสู่ระบบ</p>
        </div>
        <Badge variant="outline" className="text-sm">
          รายการใหม่
        </Badge>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <FileText className="w-5 h-5" />
            ข้อมูลหนี้มือถือ
          </h2>
          <p className="text-blue-100 mt-1">กรอกข้อมูลหนี้มือถือที่ต้องการเพิ่ม</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Product Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              ข้อมูลสินค้า
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneModel">รุ่นมือถือ</Label>
                <Input
                  id="phoneModel"
                  name="phoneModel"
                  value={formData.phoneModel}
                  onChange={handleInputChange}
                  placeholder="เช่น iPhone 14 Pro Max"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="debtType">ประเภทหนี้</Label>
                <select
                  id="debtType"
                  name="debtType"
                  value={formData.debtType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="installment">เช่าซื้อสินค้า</option>
                  <option value="loan">เงินกู้</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              ข้อมูลทางการเงิน
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="remainingDebt">ยอดหนี้คงเหลือ (บาท)</Label>
                <Input
                  id="remainingDebt"
                  name="remainingDebt"
                  type="number"
                  value={formData.remainingDebt}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="principal">เงินต้น (บาท)</Label>
                <Input
                  id="principal"
                  name="principal"
                  type="number"
                  value={formData.principal}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interest">ดอกเบี้ย (บาท)</Label>
                <Input
                  id="interest"
                  name="interest"
                  type="number"
                  value={formData.interest}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="penalty">ค่าปรับ (บาท)</Label>
                <Input
                  id="penalty"
                  name="penalty"
                  type="number"
                  value={formData.penalty}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">อัตราดอกเบี้ย (% ต่อปี)</Label>
                <Input
                  id="interestRate"
                  name="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  placeholder="12.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="creditScore">คะแนนเครดิต</Label>
                <Input
                  id="creditScore"
                  name="creditScore"
                  type="number"
                  value={formData.creditScore}
                  onChange={handleInputChange}
                  placeholder="720"
                />
              </div>
            </div>
          </div>

          {/* Installment Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              ข้อมูลงวด
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="overdueInstallments">งวดที่ค้าง</Label>
                <Input
                  id="overdueInstallments"
                  name="overdueInstallments"
                  type="number"
                  value={formData.overdueInstallments}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalInstallments">งวดทั้งหมด</Label>
                <Input
                  id="totalInstallments"
                  name="totalInstallments"
                  type="number"
                  value={formData.totalInstallments}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Borrower Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-600" />
              ข้อมูลลูกหนี้
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="borrowerName">ชื่อ-นามสกุล</Label>
                <Input
                  id="borrowerName"
                  name="borrowerName"
                  value={formData.borrowerName}
                  onChange={handleInputChange}
                  placeholder="ชื่อ-นามสกุล"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="borrowerPhone">เบอร์โทรศัพท์</Label>
                <Input
                  id="borrowerPhone"
                  name="borrowerPhone"
                  value={formData.borrowerPhone}
                  onChange={handleInputChange}
                  placeholder="08x-xxx-xxxx"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="borrowerEmail">อีเมล</Label>
                <Input
                  id="borrowerEmail"
                  name="borrowerEmail"
                  type="email"
                  value={formData.borrowerEmail}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              ที่อยู่ลูกหนี้
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="village">หมู่บ้าน</Label>
                <Input
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  placeholder="หมู่บ้าน"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="moo">หมู่ที่</Label>
                <Input
                  id="moo"
                  name="moo"
                  value={formData.moo}
                  onChange={handleInputChange}
                  placeholder="หมู่ที่"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tambon">ตำบล</Label>
                <Input
                  id="tambon"
                  name="tambon"
                  value={formData.tambon}
                  onChange={handleInputChange}
                  placeholder="ตำบล"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amphoe">อำเภอ</Label>
                <Input
                  id="amphoe"
                  name="amphoe"
                  value={formData.amphoe}
                  onChange={handleInputChange}
                  placeholder="อำเภอ"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">จังหวัด</Label>
                <Input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  placeholder="จังหวัด"
                  required
                />
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              ข้อมูลการทำงาน
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="occupation">อาชีพ</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="อาชีพ"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workplace">สถานที่ทำงาน</Label>
                <Input
                  id="workplace"
                  name="workplace"
                  value={formData.workplace}
                  onChange={handleInputChange}
                  placeholder="สถานที่ทำงาน"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="px-8"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="px-8 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกข้อมูล
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminDebtAdd;
