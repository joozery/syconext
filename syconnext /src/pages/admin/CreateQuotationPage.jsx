
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // <-- เพิ่มบรรทัดนี้

const CreateQuotationPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const branches = ['สาขา 1', 'สาขา 2', 'สาขา 3', 'สาขา 4', 'สาขา 5', 'สาขา 6'];
    const [formData, setFormData] = useState({
        customerName: '', customerEmail: '', customerTel: '', customerAddress: '',
        branch: '',
        issueDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        items: [{ description: '', quantity: 1, price: 0 }],
        discount: 0, tax: 7,
        notes: 'ราคานี้ยังไม่รวมภาษีมูลค่าเพิ่ม 7%\nยืนราคา 30 วัน'
    });

    const addItem = () => setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, price: 0 }] });
    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };
    const removeItem = (index) => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });

    const calculateSubtotal = () => formData.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const afterDiscount = subtotal - (Number(formData.discount) || 0);
        const taxAmount = afterDiscount * ((Number(formData.tax) || 0) / 100);
        return afterDiscount + taxAmount;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const storedQuotations = JSON.parse(localStorage.getItem('sy_quotations') || '[]');
        const newQuotation = {
            id: Date.now().toString(), ...formData,
            total: calculateTotal(), createdAt: new Date().toISOString(), status: 'draft'
        };
        const updatedQuotations = [newQuotation, ...storedQuotations];
        localStorage.setItem('sy_quotations', JSON.stringify(updatedQuotations));

        toast({ title: "สร้างใบเสนอราคาสำเร็จ", description: `เลขที่ QT-${newQuotation.id.slice(-6)}` });
        navigate('/admin/quotations');
    };

    return (
        <>
            <Helmet><title>สร้างใบเสนอราคา - SY Connext</title></Helmet>
            <AdminLayout pageTitle="สร้างใบเสนอราคาใหม่" breadcrumb="สร้างใบเสนอราคา">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-end gap-2 mb-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/quotations')}>ยกเลิก</Button>
                        <Button type="submit"><Save className="w-4 h-4 mr-2" /> บันทึกใบเสนอราคา</Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="lg:col-span-2">
                                    <h2 className="text-xl font-bold">SY Connext</h2>
                                    <p className="text-sm text-muted-foreground">ระบบไฟฟ้าและโซล่าเซลล์</p>
                                </div>
                                <div className="lg:col-span-2 text-left lg:text-right">
                                    <h1 className="text-2xl font-bold">ใบเสนอราคา</h1>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-semibold mb-2">ลูกค้า:</h3>
                                    <div className="grid gap-2 text-sm">
                                        <Input placeholder="ชื่อ-นามสกุล" value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} required />
                                        <Input type="email" placeholder="อีเมล" value={formData.customerEmail} onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} required />
                                        <Input placeholder="เบอร์โทรศัพท์" value={formData.customerTel} onChange={e => setFormData({ ...formData, customerTel: e.target.value })} />
                                        <Textarea placeholder="ที่อยู่" value={formData.customerAddress} onChange={e => setFormData({ ...formData, customerAddress: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                    <Label>สาขา:</Label>
                                    <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })} required>
                                        <SelectTrigger><SelectValue placeholder="เลือกสาขา" /></SelectTrigger>
                                        <SelectContent>{branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Label>วันที่:</Label>
                                    <Input type="date" value={formData.issueDate} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} />
                                    <Label>ยืนราคาถึงวันที่:</Label>
                                    <Input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                                </div>
                            </div>

                            <div className="mt-8">
                                <Table>
                                    <TableHeader><TableRow><TableHead className="w-[50%]">รายละเอียด</TableHead><TableHead>จำนวน</TableHead><TableHead>ราคา/หน่วย</TableHead><TableHead className="text-right">รวม</TableHead><TableHead></TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {formData.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell><Input value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} required /></TableCell>
                                                <TableCell><Input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} min="1" required /></TableCell>
                                                <TableCell><Input type="number" value={item.price} onChange={(e) => updateItem(index, 'price', e.target.value)} min="0" step="0.01" required /></TableCell>
                                                <TableCell className="text-right">{(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} disabled={formData.items.length === 1}><Trash2 className="w-4 h-4 text-red-500" /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2"><Plus className="w-4 h-4 mr-2" />เพิ่มรายการ</Button>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <div className="w-full max-w-sm space-y-2 text-sm">
                                    <div className="flex justify-between"><span>รวมเป็นเงิน</span><span>{calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between items-center">
                                        <Label>ส่วนลด (บาท)</Label>
                                        <Input className="w-32 text-right" type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} />
                                    </div>
                                    <div className="flex justify-between"><span>ยอดหลังหักส่วนลด</span><span>{(calculateSubtotal() - formData.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between items-center">
                                        <Label>ภาษีมูลค่าเพิ่ม (%)</Label>
                                        <Input className="w-32 text-right" type="number" value={formData.tax} onChange={e => setFormData({ ...formData, tax: e.target.value })} />
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-bold text-lg"><span>ยอดรวมทั้งสิ้น</span><span>฿{calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <Label>หมายเหตุ:</Label>
                                <Textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3}/>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </AdminLayout>
        </>
    );
};

export default CreateQuotationPage;
