import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Settings, Users, FileText, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = ({ user }) => {
  const [debts, setDebts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [newDebt, setNewDebt] = useState({
    phoneModel: '',
    remainingDebt: 0,
    principal: 0,
    interest: 0,
    penalty: 0,
    overdueInstallments: 0,
    totalInstallments: 0,
    debtType: 'installment',
    location: {
      village: '',
      moo: '',
      tambon: '',
      amphoe: '',
      province: ''
    },
    occupation: '',
    workplace: '',
    status: 'available',
    accessLevel: 'public'
  });

  useEffect(() => {
    const savedDebts = localStorage.getItem('debts');
    if (savedDebts) {
      setDebts(JSON.parse(savedDebts));
    }

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers = [{
        id: '1',
        name: 'Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'admin',
        status: 'approved'
      }];
      localStorage.setItem('users', JSON.stringify(initialUsers));
      setUsers(initialUsers);
    }
  }, []);

  const handleAddDebt = () => {
    const debt = {
      ...newDebt,
      id: Date.now().toString(),
      remainingDebt: Number(newDebt.principal) + Number(newDebt.interest) + Number(newDebt.penalty)
    };

    const updatedDebts = [...debts, debt];
    setDebts(updatedDebts);
    localStorage.setItem('debts', JSON.stringify(updatedDebts));

    toast({
      title: "เพิ่มหนี้สำเร็จ!",
      description: `เพิ่มหนี้ ${debt.phoneModel} แล้ว`,
    });

    setIsAddDebtOpen(false);
    setNewDebt({
      phoneModel: '',
      remainingDebt: 0,
      principal: 0,
      interest: 0,
      penalty: 0,
      overdueInstallments: 0,
      totalInstallments: 0,
      debtType: 'installment',
      location: {
        village: '',
        moo: '',
        tambon: '',
        amphoe: '',
        province: ''
      },
      occupation: '',
      workplace: '',
      status: 'available',
      accessLevel: 'public'
    });
  };

  const handleDeleteDebt = (debtId) => {
    const updatedDebts = debts.filter(d => d.id !== debtId);
    setDebts(updatedDebts);
    localStorage.setItem('debts', JSON.stringify(updatedDebts));

    toast({
      title: "ลบหนี้สำเร็จ",
      description: "ลบรายการหนี้แล้ว",
    });
  };

  const handleApproveUser = (userId) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: 'approved' } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: "อนุมัติสมาชิกสำเร็จ",
      description: "สมาชิกสามารถใช้งานได้แล้ว",
    });
  };

  const handleRejectUser = (userId) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: 'rejected' } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: "ปฏิเสธสมาชิก",
      description: "ปฏิเสธการสมัครสมาชิกแล้ว",
      variant: "destructive",
    });
  };

  const handleGrantAccess = (userId, debtId) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const approvedDebts = u.approvedDebts || [];
        if (!approvedDebts.includes(debtId)) {
          return { ...u, approvedDebts: [...approvedDebts, debtId] };
        }
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: "อนุมัติสิทธิ์สำเร็จ",
      description: "สมาชิกสามารถเข้าถึงข้อมูลเต็มได้แล้ว",
    });
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Admin Panel - ตลาดหนี้มือถือ</title>
        <meta name="description" content="จัดการระบบตลาดหนี้มือถือ" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border rounded-xl p-6 md:p-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">จัดการระบบทั้งหมด</p>
          </div>
        </div>

        <Tabs defaultValue="debts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="debts">
              <FileText className="w-4 h-4 mr-2" />
              จัดการหนี้
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              จัดการสมาชิก
            </TabsTrigger>
          </TabsList>

          <TabsContent value="debts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">รายการหนี้ทั้งหมด</h2>
              <Dialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มหนี้ใหม่
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl gradient-text">เพิ่มหนี้ใหม่</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>รุ่นมือถือ</Label>
                      <Input
                        value={newDebt.phoneModel}
                        onChange={(e) => setNewDebt({...newDebt, phoneModel: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>เงินต้น</Label>
                        <Input
                          type="number"
                          value={newDebt.principal}
                          onChange={(e) => setNewDebt({...newDebt, principal: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>ดอกเบี้ย</Label>
                        <Input
                          type="number"
                          value={newDebt.interest}
                          onChange={(e) => setNewDebt({...newDebt, interest: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>ค่าปรับ</Label>
                        <Input
                          type="number"
                          value={newDebt.penalty}
                          onChange={(e) => setNewDebt({...newDebt, penalty: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>งวดที่ค้าง</Label>
                        <Input
                          type="number"
                          value={newDebt.overdueInstallments}
                          onChange={(e) => setNewDebt({...newDebt, overdueInstallments: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>จำนวนงวดทั้งหมด</Label>
                        <Input
                          type="number"
                          value={newDebt.totalInstallments}
                          onChange={(e) => setNewDebt({...newDebt, totalInstallments: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>ประเภทหนี้</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setNewDebt({...newDebt, debtType: 'installment'})}
                          className={`p-3 rounded-md border text-center ${
                            newDebt.debtType === 'installment'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          เช่าซื้อ
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewDebt({...newDebt, debtType: 'loan'})}
                          className={`p-3 rounded-md border text-center ${
                            newDebt.debtType === 'loan'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          เงินกู้
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>หมู่บ้าน</Label>
                        <Input
                          value={newDebt.location.village}
                          onChange={(e) => setNewDebt({...newDebt, location: {...newDebt.location, village: e.target.value}})}
                        />
                      </div>
                      <div>
                        <Label>หมู่</Label>
                        <Input
                          value={newDebt.location.moo}
                          onChange={(e) => setNewDebt({...newDebt, location: {...newDebt.location, moo: e.target.value}})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>ตำบล</Label>
                        <Input
                          value={newDebt.location.tambon}
                          onChange={(e) => setNewDebt({...newDebt, location: {...newDebt.location, tambon: e.target.value}})}
                        />
                      </div>
                      <div>
                        <Label>อำเภอ</Label>
                        <Input
                          value={newDebt.location.amphoe}
                          onChange={(e) => setNewDebt({...newDebt, location: {...newDebt.location, amphoe: e.target.value}})}
                        />
                      </div>
                      <div>
                        <Label>จังหวัด</Label>
                        <Input
                          value={newDebt.location.province}
                          onChange={(e) => setNewDebt({...newDebt, location: {...newDebt.location, province: e.target.value}})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>อาชีพ</Label>
                        <Input
                          value={newDebt.occupation}
                          onChange={(e) => setNewDebt({...newDebt, occupation: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>สถานที่ทำงาน</Label>
                        <Input
                          value={newDebt.workplace}
                          onChange={(e) => setNewDebt({...newDebt, workplace: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddDebt}
                      className="w-full"
                    >
                      เพิ่มหนี้
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {debts.map((debt) => (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-xl p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{debt.phoneModel}</h3>
                      <p className="text-sm text-muted-foreground">รหัส: #{debt.id}</p>
                      <div className="mt-2 flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          debt.debtType === 'installment'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {debt.debtType === 'installment' ? 'เช่าซื้อ' : 'เงินกู้'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          debt.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {debt.status === 'available' ? 'เปิดขาย' : 'ปิดการขาย'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toast({
                          title: "🚧 ฟีเจอร์นี้ยังไม่พร้อมใช้งาน",
                          description: "คุณสามารถขอเพิ่มฟีเจอร์นี้ในข้อความถัดไป! 🚀"
                        })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteDebt(debt.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">ยอดหนี้</p>
                      <p className="font-bold">฿{debt.remainingDebt.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">งวดค้าง</p>
                      <p className="font-bold">{debt.overdueInstallments}/{debt.totalInstallments}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">จังหวัด</p>
                      <p className="font-bold">{debt.location.province}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h2 className="text-2xl font-bold">จัดการสมาชิก</h2>
            
            <div className="space-y-4">
              {users.filter(u => u.role !== 'admin').map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground">{member.phone}</p>
                      <div className="mt-2 flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.memberType === 'investor'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {member.memberType === 'investor' ? 'นักลงทุน' : 'นักทวง'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : member.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status === 'approved' ? 'อนุมัติแล้ว' : member.status === 'pending' ? 'รออนุมัติ' : 'ปฏิเสธ'}
                        </span>
                      </div>
                    </div>
                    {member.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleApproveUser(member.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          อนุมัติ
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectUser(member.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          ปฏิเสธ
                        </Button>
                      </div>
                    )}
                  </div>

                  {member.status === 'approved' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2">อนุมัติสิทธิ์เข้าถึงหนี้:</p>
                      <div className="flex flex-wrap gap-2">
                        {debts.slice(0, 5).map((debt) => (
                          <Button
                            key={debt.id}
                            size="sm"
                            variant="outline"
                            onClick={() => handleGrantAccess(member.id, debt.id)}
                          >
                            {member.approvedDebts && member.approvedDebts.includes(debt.id) ? (
                              <Check className="w-3 h-3 mr-1 text-green-600" />
                            ) : null}
                            #{debt.id}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminPanel;