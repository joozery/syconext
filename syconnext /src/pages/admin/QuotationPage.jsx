
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Download, Send, Trash2, MoreHorizontal, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const QuotationPage = () => {
  const [quotations, setQuotations] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('sy_quotations');
    if (stored) {
      setQuotations(JSON.parse(stored).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  }, []);

  const handleDownloadPDF = (quotationId) => {
     navigate(`/admin/quotations/${quotationId}?print=true`);
  };

  const handleSendEmail = (quotation) => {
    toast({ title: "🚧 ฟีเจอร์นี้ยังไม่พร้อมใช้งาน" });
  };

  const handleDelete = (id) => {
    const updated = quotations.filter(q => q.id !== id);
    setQuotations(updated);
    localStorage.setItem('sy_quotations', JSON.stringify(updated));
    toast({ title: "ลบใบเสนอราคาสำเร็จ" });
  };

  return (
    <>
      <Helmet>
        <title>ใบเสนอราคา - SY Connext Admin</title>
        <meta name="description" content="จัดการใบเสนอราคาทั้งหมด" />
      </Helmet>

      <AdminLayout pageTitle="ใบเสนอราคา (QT)" breadcrumb="ใบเสนอราคา">
        <div className="space-y-4">
          <div className="flex justify-end items-center">
            <Link to="/admin/quotations/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                สร้างใบเสนอราคา
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-0">
                {quotations.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">ยังไม่มีใบเสนอราคา</h3>
                    <p className="mt-1 text-sm text-gray-500">เริ่มต้นสร้างใบเสนอราคาใหม่ได้เลย</p>
                  </div>
                ) : (
                    <Table>
                        <TableHeader><TableRow><TableHead>เลขที่ QT</TableHead><TableHead>ลูกค้า</TableHead><TableHead>สาขา</TableHead><TableHead>ยอดรวม</TableHead><TableHead>วันที่สร้าง</TableHead><TableHead className="text-right">จัดการ</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {quotations.map(q => (
                                <TableRow key={q.id}>
                                    <TableCell className="font-medium">QT-{q.id.slice(-6)}</TableCell>
                                    <TableCell>{q.customerName}</TableCell>
                                    <TableCell><Badge variant="outline">{q.branch}</Badge></TableCell>
                                    <TableCell className="font-semibold">฿{q.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                    <TableCell>{new Date(q.createdAt).toLocaleDateString('th-TH')}</TableCell>
                                    <TableCell className="text-right">
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/admin/quotations/${q.id}`)}><Eye className="w-4 h-4 mr-2" />ดูรายละเอียด</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDownloadPDF(q.id)}><Download className="w-4 h-4 mr-2" />ดาวน์โหลด PDF</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSendEmail(q)}><Send className="w-4 h-4 mr-2" />ส่งอีเมล</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(q.id)}><Trash2 className="w-4 h-4 mr-2" />ลบ</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default QuotationPage;
