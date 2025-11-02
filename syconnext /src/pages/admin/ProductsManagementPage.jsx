import React from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ProductsManagementPage = () => {
  // Mock data
  const products = [
    {
      id: 1,
      name: 'ชุดโซล่าเซลล์ String Inverter 60kW',
      category: 'HUAWEI สินค้าจัดชุด',
      price: '1,150,000.00',
      stock: 5,
      status: 'มีสินค้า'
    },
    {
      id: 2,
      name: 'ชุดโซล่าเซลล์ String Inverter 36kW',
      category: 'HUAWEI สินค้าจัดชุด',
      price: '735,000.00',
      stock: 8,
      status: 'มีสินค้า'
    },
    {
      id: 3,
      name: 'ชุดโซล่าเซลล์ String Inverter 30kW',
      category: 'HUAWEI สินค้าจัดชุด',
      price: '645,000.00',
      stock: 0,
      status: 'สินค้าหมด'
    }
  ];

  return (
    <>
      <Helmet>
        <title>จัดการสินค้า - SY Connext Admin</title>
      </Helmet>

      <AdminLayout pageTitle="จัดการสินค้า" breadcrumb="จัดการสินค้า">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
              <p className="text-gray-600 mt-1">จัดการสินค้าและบริการทั้งหมดของเว็บไซต์</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้าใหม่
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="ค้นหาสินค้า..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">ค้นหา</Button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สินค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ราคา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สต็อก
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      ฿{product.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.stock} ชุด</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        product.status === 'มีสินค้า' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
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

export default ProductsManagementPage;

