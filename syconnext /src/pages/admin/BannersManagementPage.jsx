import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const BannersManagementPage = () => {
  // Mock data
  const banners = [
    {
      id: 1,
      title: 'ระบบไฟฟ้าและโซล่าเซลล์',
      position: 'Hero Slider - Slide 1',
      status: 'เปิดใช้งาน',
      image: 'https://images.unsplash.com/photo-1643035660996-0834db96a85a'
    },
    {
      id: 2,
      title: 'ติดตั้งโซล่าเซลล์คุณภาพ',
      position: 'Hero Slider - Slide 2',
      status: 'เปิดใช้งาน',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276'
    },
    {
      id: 3,
      title: 'บำรุงรักษาและซ่อมแซม',
      position: 'Hero Slider - Slide 3',
      status: 'เปิดใช้งาน',
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9'
    }
  ];

  return (
    <>
      <Helmet>
        <title>จัดการแบนเนอร์ - SY Connext Admin</title>
      </Helmet>

      <AdminLayout pageTitle="จัดการแบนเนอร์" breadcrumb="จัดการแบนเนอร์">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการแบนเนอร์</h1>
              <p className="text-gray-600 mt-1">จัดการแบนเนอร์และภาพสไลด์ของเว็บไซต์</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มแบนเนอร์ใหม่
            </Button>
          </div>

          {/* Banners Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      banner.status === 'เปิดใช้งาน' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {banner.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{banner.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{banner.position}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      ดู
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      แก้ไข
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default BannersManagementPage;

