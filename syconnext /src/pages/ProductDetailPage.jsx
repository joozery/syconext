import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Check, Truck, Shield, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - ในระบบจริงควรดึงจาก API
  const product = {
    id: 1,
    name: 'ชุดโซล่าเซลล์ String Inverter 60kW',
    category: 'HUAWEI สินค้าจัดชุด',
    price: '1,150,000.00',
    originalPrice: '1,530,000',
    discount: '380,000',
    discountPercent: 25,
    badge: 'ขายดี',
    images: [
      '/src/accest/product/HUAWE.png',
      'https://images.unsplash.com/photo-1509391366360-2e959784a276',
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e'
    ],
    description: 'ชุดโซล่าเซลล์ String Inverter ขนาด 60kW จาก HUAWEI คุณภาพสูง เหมาะสำหรับโรงงานและอาคารขนาดใหญ่ ช่วยประหยัดค่าไฟฟ้าได้สูงสุด พร้อมระบบจัดการพลังงานอัจฉริยะ',
    features: [
      '3 Phase - เหมาะสำหรับระบบไฟฟ้าขนาดใหญ่',
      'ระบบประหยัดไฟฟ้าสูงสุดถึง 70%',
      'พื้นที่ติดตั้ง 300-400 ตารางเมตร',
      'รับประกัน 8 ปี พร้อมบริการหลังการขาย',
      'ประสิทธิภาพสูง 98.6%',
      'ทนทานต่อสภาพอากาศ IP65'
    ],
    specifications: [
      { label: 'กำลังการผลิต', value: '60 kW' },
      { label: 'แรงดันไฟฟ้า', value: '380V AC, 3 Phase' },
      { label: 'จำนวนแผงโซล่าเซลล์', value: '120 แผง' },
      { label: 'Inverter', value: 'HUAWEI SUN2000-60KTL-M0' },
      { label: 'ระยะเวลาติดตั้ง', value: '5-7 วัน' },
      { label: 'การรับประกัน', value: '8 ปี' }
    ],
    included: [
      'แผงโซล่าเซลล์ 550W x 120 แผง',
      'Inverter HUAWEI 60kW',
      'โครงสร้างติดตั้งแบบครบชุด',
      'สายไฟและอุปกรณ์เสริม',
      'ค่าติดตั้งและทดสอบระบบ',
      'เอกสารรับประกัน 8 ปี'
    ],
    benefits: [
      { icon: Truck, title: 'จัดส่งฟรี', desc: 'ทั่วประเทศ' },
      { icon: Shield, title: 'รับประกัน 8 ปี', desc: 'บริการหลังการขาย' },
      { icon: Clock, title: 'ติดตั้งเร็ว', desc: '5-7 วันทำการ' },
      { icon: Package, title: 'ครบชุด', desc: 'พร้อมติดตั้ง' }
    ]
  };

  const relatedProducts = [
    {
      id: 2,
      name: 'ชุดโซล่าเซลล์ 36kW',
      price: '735,000.00',
      originalPrice: '954,000',
      discount: '219,000',
      image: '/src/accest/product/HUAWE.png',
      badge: 'แนะนำ'
    },
    {
      id: 3,
      name: 'ชุดโซล่าเซลล์ 30kW',
      price: '645,000.00',
      originalPrice: '785,000',
      discount: '140,000',
      image: '/src/accest/product/HUAWE.png',
      badge: 'ใหม่'
    },
    {
      id: 4,
      name: 'ชุดโซล่าเซลล์ 50kW',
      price: '815,000.00',
      originalPrice: '1,065,000',
      discount: '250,000',
      image: '/src/accest/product/HUAWE.png',
      badge: 'โปรโมชั่น'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} - SY Connext</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-600 hover:text-blue-600">หน้าแรก</Link>
              <span className="text-gray-400">/</span>
              <Link to="/products" className="text-gray-600 hover:text-blue-600">สินค้า</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <div className="container mx-auto px-4 py-12">
          <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าสินค้า
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Images */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 mb-4"
              >
                <div className="relative">
                  <img 
                    src={product.images[selectedImage]} 
                    alt={product.name}
                    className="w-full h-[500px] object-contain"
                  />
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                      ลด ฿{product.discount}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold">
                    {product.badge}
                  </div>
                </div>
              </motion.div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-white rounded-lg p-3 border-2 transition-all ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-20 object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Details */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-sm text-orange-600 font-semibold uppercase tracking-wide mb-2">
                  {product.category}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-6">{product.description}</p>

                {/* Price */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 mb-6">
                  {product.originalPrice && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg text-gray-500 line-through">฿{product.originalPrice}</span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ประหยัด {product.discountPercent}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-orange-500">฿{product.price}</span>
                    <span className="text-gray-600">รวมภาษีมูลค่าเพิ่ม</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {product.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
                      <benefit.icon className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="font-bold text-gray-900">{benefit.title}</div>
                        <div className="text-sm text-gray-600">{benefit.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">จำนวน</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-6 py-2 font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-600">ชุด</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <Button size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-6">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    เพิ่มลงตะกร้า
                  </Button>
                  <Button size="lg" variant="outline" className="px-6 py-6 border-2">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="px-6 py-6 border-2">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <Button size="lg" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6">
                  ดูรายละเอียดและขอใบเสนอราคา
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Features */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">คุณสมบัติเด่น</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลจำเพาะ</h3>
                  <dl className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-200">
                        <dt className="text-gray-600">{spec.label}:</dt>
                        <dd className="font-semibold text-gray-900">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Included */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">รายการในชุด</h3>
                  <ul className="space-y-3">
                    {product.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/products/${item.id}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                  >
                    <div className="relative bg-gradient-to-br from-gray-50 to-white p-6">
                      <img src={item.image} alt={item.name} className="w-full h-64 object-contain" />
                      {item.discount && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ลด ฿{item.discount}
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {item.badge}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      {item.originalPrice && (
                        <div className="text-sm text-gray-500 line-through mb-1">฿{item.originalPrice}</div>
                      )}
                      <div className="text-2xl font-bold text-orange-500">฿{item.price}</div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;

