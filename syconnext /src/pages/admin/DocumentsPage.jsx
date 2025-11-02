
import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const DocumentsPage = () => {
  return (
    <>
      <Helmet>
        <title>จัดเก็บเอกสาร - SY Connext Admin</title>
        <meta name="description" content="จัดเก็บและจัดการเอกสารทั้งหมด" />
      </Helmet>

      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">จัดเก็บเอกสาร</h1>
            <p className="text-gray-600 mt-2">เก็บไฟล์ QT, รูปงาน, ใบเสร็จ</p>
          </div>

          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">ระบบจัดเก็บเอกสาร</p>
            <p className="text-sm text-gray-500">
              🚧 ฟีเจอร์นี้ยังไม่พร้อมใช้งาน—แต่ไม่ต้องกังวล! คุณสามารถขอเพิ่มฟีเจอร์นี้ในข้อความถัดไป! 🚀
            </p>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default DocumentsPage;
