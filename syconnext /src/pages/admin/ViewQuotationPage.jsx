
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/components/ui/use-toast';
import { Printer, Send, ArrowLeft } from 'lucide-react';
import logo from '@/accest/logo.png';

const ViewQuotationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const [quotation, setQuotation] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('sy_quotations') || '[]');
        const found = stored.find(q => q.id === id);
        if (found) {
            setQuotation(found);
        } else {
            toast({ title: "ไม่พบใบเสนอราคา", variant: "destructive" });
            navigate('/admin/quotations');
        }
    }, [id, navigate, toast]);

    useEffect(() => {
        if (quotation && searchParams.get('print') === 'true') {
            document.body.classList.add('print-mode');
            setTimeout(() => {
                window.print();
                document.body.classList.remove('print-mode');
                navigate(`/admin/quotations/${id}`);
            }, 500);
        }
    }, [quotation, searchParams, id, navigate]);

    if (!quotation) {
        return <AdminLayout><div className="text-center">กำลังโหลด...</div></AdminLayout>;
    }
    
    const subtotal = quotation.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
    const total = quotation.total;

    return (
        <>
            <Helmet><title>ใบเสนอราคา QT-{id.slice(-6)}</title></Helmet>
            <style>{`
                @media print {
                    body.print-mode { -webkit-print-color-adjust: exact; }
                    /* ซ่อนทุกอย่างที่ไม่ต้องการพิมพ์ */
                    .no-print { display: none !important; }
                    aside { display: none !important; }
                    header { display: none !important; }
                    nav { display: none !important; }
                    /* ปรับ layout ให้เต็มหน้า */
                    body { margin: 0; padding: 0; }
                    main { padding: 0 !important; margin: 0 !important; }
                    .print-content { 
                        box-shadow: none !important; 
                        border: none !important; 
                        margin: 0 !important;
                        page-break-after: auto;
                    }
                    /* ซ่อน scrollbar */
                    ::-webkit-scrollbar { display: none; }
                    html { overflow: hidden; }
                }
            `}</style>
            <AdminLayout pageTitle={`ใบเสนอราคา QT-${id.slice(-6)}`} breadcrumb="ดูใบเสนอราคา">
                <div className="space-y-4">
                    <div className="flex justify-between items-center no-print">
                        <Button variant="outline" onClick={() => navigate('/admin/quotations')}><ArrowLeft className="w-4 h-4 mr-2" /> กลับ</Button>
                        <div className="flex gap-2">
                             <Button onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> พิมพ์</Button>
                             <Button variant="secondary"><Send className="w-4 h-4 mr-2" /> ส่งอีเมล</Button>
                        </div>
                    </div>
                    
                    <Card className="print-content">
                        <CardContent className="p-8">
                            {/* Header */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <img 
                                        src={logo} 
                                        alt="SY Connext Logo" 
                                        className="h-16 object-contain mb-3"
                                    />
                                    <p className="text-muted-foreground">123 ถนนสุขุมวิท, แขวงคลองเตยเหนือ, เขตวัฒนา, กรุงเทพฯ 10110</p>
                                    <p className="text-muted-foreground">เลขประจำตัวผู้เสียภาษี: 0123456789012</p>
                                </div>
                                <div className="text-right">
                                    <h1 className="text-4xl font-bold text-gray-800">ใบเสนอราคา</h1>
                                    <p className="text-muted-foreground mt-1">เลขที่: QT-{quotation.id.slice(-6)}</p>
                                </div>
                            </div>
                             {/* Customer and Dates */}
                            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                                <div>
                                    <h3 className="font-semibold text-gray-600 mb-1">ลูกค้า</h3>
                                    <p className="font-bold">{quotation.customerName}</p>
                                    <p>{quotation.customerAddress}</p>
                                    <p>{quotation.customerEmail}</p>
                                    <p>{quotation.customerTel}</p>
                                </div>
                                <div className="text-right">
                                    <div className="grid grid-cols-2">
                                        <span className="font-semibold text-gray-600">วันที่:</span>
                                        <span>{new Date(quotation.issueDate).toLocaleDateString('th-TH')}</span>
                                        <span className="font-semibold text-gray-600">ยืนราคาถึงวันที่:</span>
                                        <span>{new Date(quotation.expiryDate).toLocaleDateString('th-TH')}</span>
                                        <span className="font-semibold text-gray-600">สาขา:</span>
                                        <span>{quotation.branch}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Items Table */}
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="w-[5%]">#</TableHead>
                                        <TableHead className="w-[45%]">รายละเอียด</TableHead>
                                        <TableHead className="text-center">จำนวน</TableHead>
                                        <TableHead className="text-right">ราคา/หน่วย</TableHead>
                                        <TableHead className="text-right">รวม</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {quotation.items.map((item, index) => (
                                        <TableRow key={index}><TableCell>{index + 1}</TableCell><TableCell>{item.description}</TableCell><TableCell className="text-center">{item.quantity}</TableCell><TableCell className="text-right">{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell><TableCell className="text-right">{(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell></TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* Totals */}
                            <div className="mt-6 flex justify-end">
                                <div className="w-full max-w-sm space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-muted-foreground">รวมเป็นเงิน</span><span>{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">ส่วนลด</span><span>{Number(quotation.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">ยอดหลังหักส่วนลด</span><span>{(subtotal - quotation.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">ภาษีมูลค่าเพิ่ม ({quotation.tax}%)</span><span>{(total - (subtotal - quotation.discount)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                    <hr className="my-2 border-dashed" />
                                    <div className="flex justify-between font-bold text-lg"><span >ยอดรวมทั้งสิ้น</span><span >฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                                </div>
                            </div>
                             {/* Notes and Signature */}
                            <div className="mt-12 text-sm">
                                {quotation.notes && (
                                    <div className="mb-8">
                                        <h4 className="font-semibold mb-2">หมายเหตุ:</h4>
                                        <p className="text-muted-foreground whitespace-pre-line">{quotation.notes}</p>
                                    </div>
                                )}
                                <div className="flex justify-between items-end">
                                    <div className="w-1/3 text-center">
                                        <div className="border-t border-dashed mt-12 pt-2">ผู้อนุมัติ</div>
                                    </div>
                                     <div className="w-1/3 text-center">
                                        <div className="border-t border-dashed mt-12 pt-2">ผู้จัดทำ</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        </>
    );
};

export default ViewQuotationPage;
