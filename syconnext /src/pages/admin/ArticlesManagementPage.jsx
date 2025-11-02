import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ArticlesManagementPage = () => {
  // Mock data
  const articles = [
    {
      id: 1,
      title: 'เทรนด์โซล่าเซลล์ปี 2025',
      category: 'เทคโนโลยี',
      status: 'เผยแพร่',
      date: '15 มกราคม 2025',
      views: 1234
    },
    {
      id: 2,
      title: 'วิธีประหยัดค่าไฟด้วยโซล่าเซลล์',
      category: 'คู่มือ',
      status: 'เผยแพร่',
      date: '10 มกราคม 2025',
      views: 856
    },
    {
      id: 3,
      title: 'ผลงานติดตั้งโซล่าเซลล์ล่าสุด',
      category: 'ผลงาน',
      status: 'แบบร่าง',
      date: '5 มกราคม 2025',
      views: 0
    }
  ];

  return (
    <>
      <Helmet>
        <title>จัดการบทความ - SY Connext Admin</title>
      </Helmet>

      <AdminLayout pageTitle="จัดการบทความ" breadcrumb="จัดการบทความ">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการบทความ</h1>
              <p className="text-gray-600 mt-1">จัดการบทความและข่าวสารทั้งหมดของเว็บไซต์</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มบทความใหม่
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="ค้นหาบทความ..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">ค้นหา</Button>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    บทความ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เข้าชม
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        article.status === 'เผยแพร่' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{article.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{article.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ArticlesManagementPage;

