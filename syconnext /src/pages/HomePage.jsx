
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Sun, Shield, Award, ArrowRight, Phone, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import HeroSlider from '@/components/HeroSlider';
import Footer from '@/components/Footer';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'ระบบไฟฟ้า',
      description: 'ออกแบบและติดตั้งระบบไฟฟ้าครบวงจร'
    },
    {
      icon: <Sun className="w-12 h-12" />,
      title: 'โซล่าเซลล์',
      description: 'ติดตั้งและบำรุงรักษาระบบโซล่าเซลล์'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'บำรุงรักษา',
      description: 'บริการดูแลและซ่อมบำรุงอย่างต่อเนื่อง'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'คุณภาพมาตรฐาน',
      description: 'ผ่านการรับรองมาตรฐานสากล'
    }
  ];

  const articles = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
      title: 'เทรนด์โซล่าเซลล์ปี 2025',
      description: 'ทำความรู้จักกับเทคโนโลยีโซล่าเซลล์ล่าสุดที่จะเปลี่ยนโลก',
      date: '15 มกราคม 2025',
      category: 'เทคโนโลยี'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9',
      title: 'วิธีประหยัดค่าไฟด้วยโซล่าเซลล์',
      description: 'เคล็ดลับการใช้งานระบบโซล่าเซลล์ให้คุ้มค่าที่สุด',
      date: '10 มกราคม 2025',
      category: 'คู่มือ'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
      title: 'ผลงานติดตั้งโซล่าเซลล์ล่าสุด',
      description: 'ชมผลงานการติดตั้งระบบโซล่าเซลล์ในโครงการต่างๆ',
      date: '5 มกราคม 2025',
      category: 'ผลงาน'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      title: 'คำแนะนำการบำรุงรักษาโซล่าเซลล์',
      description: 'วิธีดูแลรักษาระบบโซล่าเซลล์ให้มีอายุการใช้งานยาวนาน',
      date: '1 มกราคม 2025',
      category: 'บำรุงรักษา'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  return (
    <>
      <Helmet>
        <title>SY Connext - ระบบไฟฟ้าและโซล่าเซลล์ครบวงจร</title>
        <meta name="description" content="SY Connext บริษัทที่เชี่ยวชาญด้านระบบไฟฟ้าและโซล่าเซลล์ บริการครบวงจรตั้งแต่การออกแบบจนถึงการบำรุงรักษา เพื่อช่วยลดค่าไฟฟ้าและส่งเสริมการใช้พลังงานสะอาด" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section - Image Slider */}
        <HeroSlider />

        {/* Services Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">บริการของเรา</h2>
              <p className="text-xl text-gray-600">ครบวงจรด้านระบบไฟฟ้าและพลังงานสะอาด</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="text-blue-600 mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Selling Products Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">สินค้าขายดี ยอดนิยมจาก SY</h2>
              <p className="text-xl text-gray-600">สินค้าคุณภาพพร้อมส่งที่ได้รับความนิยมสูงสุด</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  id: 1,
                  name: 'ชุดโซล่าเซลล์ String Inverter 60kW',
                  category: 'HUAWEI สินค้าจัดชุด',
                  price: '1,150,000.00',
                  originalPrice: '1,530,000',
                  discount: '380,000',
                  image: '/src/accest/product/HUAWE.png',
                  badge: 'ขายดี',
                  features: ['3 Phase', 'ระบบประหยัดไฟฟ้า', 'พื้นที่ติดตั้ง', 'รับประกัน 8 ปี']
                },
                {
                  id: 2,
                  name: 'ชุดโซล่าเซลล์ String Inverter 36kW',
                  category: 'HUAWEI สินค้าจัดชุด',
                  price: '735,000.00',
                  originalPrice: '954,000',
                  discount: '219,000',
                  image: '/src/accest/product/HUAWE.png',
                  badge: 'แนะนำ',
                  features: ['3 Phase', 'ระบบประหยัดไฟฟ้า', 'พื้นที่ติดตั้ง', 'รับประกัน 8 ปี']
                },
                {
                  id: 3,
                  name: 'ชุดโซล่าเซลล์ String Inverter 30kW',
                  category: 'HUAWEI สินค้าจัดชุด',
                  price: '645,000.00',
                  originalPrice: '785,000',
                  discount: '140,000',
                  image: '/src/accest/product/HUAWE.png',
                  badge: 'ใหม่',
                  features: ['3 Phase', 'ระบบประหยัดไฟฟ้า', 'พื้นที่ติดตั้ง', 'รับประกัน 8 ปี']
                },
                {
                  id: 4,
                  name: 'ชุดโซล่าเซลล์ String Inverter 50kW',
                  category: 'HUAWEI สินค้าจัดชุด',
                  price: '815,000.00',
                  originalPrice: '1,065,000',
                  discount: '250,000',
                  image: '/src/accest/product/HUAWE.png',
                  badge: 'โปรโมชั่น',
                  features: ['3 Phase', 'ระบบประหยัดไฟฟ้า', 'พื้นที่ติดตั้ง', 'รับประกัน 8 ปี']
                }
              ].map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white p-6">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        {product.badge}
                      </span>
                    </div>
                    {product.discount && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ลด ฿{product.discount}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    {/* Category */}
                    <div className="text-xs text-orange-600 font-semibold uppercase tracking-wide">
                      {product.category}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px]">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="space-y-1">
                      {product.originalPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">฿{product.originalPrice}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                            ประหยัด {Math.round((parseInt(product.discount.replace(/,/g, '')) / parseInt(product.originalPrice.replace(/,/g, ''))) * 100)}%
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-orange-500">
                          ฿{product.price}
                        </span>
                        <span className="text-sm text-gray-500">รวมภาษีมูลค่าเพิ่ม</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {product.features.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* Actions */}
                    <div className="flex gap-2">
                           <Link to={`/products/${product.id}`} className="flex-1">
                             <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-md hover:shadow-lg transition-all">
                               ดูรายละเอียด
                             </Button>
                           </Link>
                      <button className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg group/cart">
                        <svg className="w-5 h-5 group-hover/cart:scale-110 transition-transform" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2">
                          <circle cx="8" cy="21" r="1" />
                          <circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/products">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white group">
                  ดูสินค้าทั้งหมด
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Images Grid */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Top Left - Team working */}
                  <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1581092160562-40aa08e78837" 
                      alt="ทีมงาน SY Connext"
                      className="w-full h-72 object-cover"
                    />
                  </div>
                  
                  {/* Bottom Left - Solar panels parking */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d" 
                      alt="ที่จอดรถโซล่าเซลล์"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                  
                  {/* Bottom Right - Installation work */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e" 
                      alt="การติดตั้งโซล่าเซลล์"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                </div>

                {/* Stats Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 bg-orange-500 text-white rounded-2xl p-8 shadow-2xl"
                >
                  <div className="text-6xl font-bold mb-2">865+</div>
                  <div className="text-sm leading-relaxed">
                    ผลงานสะสมมากกว่า<br />
                    5 ปี การนิเคคุณภาพ<br />
                    และมาตรฐานระดับสากล
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Logo */}
                <div className="mb-6">
                  <img 
                    src="/src/accest/logo.png" 
                    alt="SY Connext Logo"
                    className="h-16 object-contain"
                  />
                </div>

                {/* Main Heading */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    เพราะอนาคตของคุณ<br />
                    คือแรงบันดาลใจของเรา
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    บริษัทของเราโดดเด่นในด้าน งานไฟฟ้าสมัยใหม่ โดยเน้นการงานที่ยั่งยืน 
                    พร้อมผสมผสาน เทคโนโลยีประหยัดพลังงาน และวัสดุที่เป็นมิตรกับสิ่งแวดล้อม
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-6">
                  {/* Feature 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">การออกแบบที่ใส่ใจ</h3>
                      <p className="text-gray-600">
                        เราให้ความสำคัญกับการลดผลกระทบต่อสิ่งแวดล้อม ทั้งต่อธรรมชาติและสังคม 
                        เลือกที่อยู่อาศัยใบพื้นที่โครงการ
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">โปร่งใสในทุกขั้นตอน</h3>
                      <p className="text-gray-600">
                        SY Connext ให้การประมาณต้นทุนที่โปร่งใส พร้อมปฏิบัติตามข้อตกลงทุกข้อ 
                        เพื่อให้ลูกค้าไว้วางใจได้ในบริการของเรา
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <a 
                    href="https://line.me/ti/p/~syconnext" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                      แอดไลน์ : SY CONNEXT
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">ทีมงานมืออาชีพ</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                ทีมงานผู้เชี่ยวชาญที่พร้อมให้บริการและคำปรึกษา เพื่อความสำเร็จของโครงการทุกชิ้นงาน
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                {
                  id: 1,
                  name: 'คุณสมชาย วงศ์ไทย',
                  position: 'หัวหน้าทีม 1',
                  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
                },
                {
                  id: 2,
                  name: 'คุณสมหญิง ใจดี',
                  position: 'หัวหน้าทีม 2',
                  image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
                },
                {
                  id: 3,
                  name: 'คุณประยุทธ มั่นคง',
                  position: 'หัวหน้าทีม 3',
                  image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a'
                },
                {
                  id: 4,
                  name: 'คุณสุดา รักงาน',
                  position: 'หัวหน้าทีม 4',
                  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956'
                },
                {
                  id: 5,
                  name: 'คุณวิชัย เก่งงาน',
                  position: 'หัวหน้าทีม 5',
                  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
                }
              ].map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white border-2 border-gray-900 rounded-none overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Image - Grayscale */}
                    <div className="relative overflow-hidden bg-gray-100">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4 text-left bg-white border-t-2 border-gray-900">
                      <h3 className="text-base font-bold text-gray-900 mb-0.5">{member.name}</h3>
                      <div className="w-8 h-0.5 bg-gray-900 my-2"></div>
                      <p className="text-sm text-gray-600">{member.position}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted Clients Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">ลูกค้าที่ไว้วางใจเรา</h2>
              <p className="text-xl text-gray-600">องค์กรและบริษัทชั้นนำที่เลือกใช้บริการของเรา</p>
            </motion.div>

            {/* Client Logos Grid */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6 max-w-7xl mx-auto">
              {[
                'รูปภาพ3.png',
                'รูปภาพ4.png',
                'รูปภาพ5.png',
                'รูปภาพ6.png',
                'รูปภาพ7.png',
                'รูปภาพ8.png',
                'รูปภาพ9.png',
                'รูปภาพ14.png'
              ].map((logo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg p-4 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group min-h-[100px]"
                >
                  <img 
                    src={`/src/accest/band/${logo}`}
                    alt={`Client Logo ${index + 1}`}
                    className="w-full h-auto max-h-20 object-contain group-hover:scale-110 transition-transform filter grayscale hover:grayscale-0"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog/News Section - Slider */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">ข่าวสาร/บทความน่ารู้</h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                ติดตามกิจกรรมและบทความจาก SY Connext เปิดมุมมองใหม่เกี่ยวกับพลังงานโซล่าเซลล์ ทั้งการอบรม การติดตั้ง โปรโมชั่นพิเศษ และเทคนิคดูแลอุปกรณ์ พร้อมอัปเดตความรู้และข่าวสารล่าสุด เพื่อก้าวทันโลกพลังงานสะอาด!
              </p>
            </motion.div>

            <div className="relative">
              {/* Slider Container */}
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-4 gap-6"
                  >
                    {articles.map((article, index) => (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                      >
                        <div className="relative overflow-hidden h-48">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {article.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                          <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                            {article.description}
                          </p>
                          <Link to={`/articles/${article.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group/link text-sm">
                            อ่านเพิ่มเติม
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all duration-300 group z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-blue-600" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 rounded-full p-3 shadow-lg transition-all duration-300 group z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-blue-600" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {articles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide
                        ? 'bg-orange-500 w-8 h-3'
                        : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/articles">
                <Button size="lg" variant="outline" className="group">
                  ดูบทความทั้งหมด
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-0 shadow-2xl rounded-2xl overflow-hidden max-w-6xl mx-auto">
              {/* Left Side - Orange Background */}
              <div className="lg:col-span-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                      อยากได้ทีมงานที่ได้<br />มาตรฐาน? ติดต่อเราเลย!
                    </h2>
                    <p className="text-white/90 text-sm leading-relaxed">
                      SY Connext พร้อมให้บริการด้วยทีมงานมืออาชีพที่ผ่านการอบรมเฉพาะทาง 
                      มีประสบการณ์ด้าน ใช้สำ และ ระบบไฟฟ้าครบวงจร มั่นใจได้ในคุณภาพ
                      และความปลอดภัยขั้นตอน
                    </p>
                  </div>

                  <div className="border-t border-white/30 pt-6 space-y-4">
                    <h3 className="text-lg font-bold">ติดต่อเราหน้าที่ด้วยตอนนี้!</h3>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <a href="tel:+66896416425" className="text-lg font-bold hover:text-white/80 transition-colors">
                          +(66) 896416425
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <a href="mailto:sy.electricsystem@gmail.com" className="text-sm hover:text-white/80 transition-colors break-all">
                          sy.electricsystem@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Form */}
              <div className="lg:col-span-3 bg-gray-50 p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <form className="space-y-4">
                    {/* เลขบัตรประชาชน / เลขผู้เสียภาษีอากร */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        เลขบัตรประชาชน / เลขผู้เสียภาษีอากร
                      </label>
                      <input
                        type="text"
                        placeholder="กรุงบาครอกข้อมูล"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* บริษัท */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        บริษัท
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* คำนำหน้า และ ชื่อ-นามสกุล */}
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          คำนำหน้า <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                          <option value="">-กรุงบาเลือก-</option>
                          <option value="นาย">นาย</option>
                          <option value="นาง">นาง</option>
                          <option value="นางสาว">นางสาว</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          ชื่อ-นามสกุล <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="ชื่อ"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 opacity-0">
                          นามสกุล
                        </label>
                        <input
                          type="text"
                          placeholder="นามสกุล"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* ที่อยู่ บ้านเลขที่ */}
                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          ที่อยู่ บ้านเลขที่ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          ตำบล <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          อำเภอ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* จังหวัด และรหัสไปรษณีย์ */}
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          จังหวัด <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          รหัสไปรษณีย์ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* เบอร์โทร, อีเมล์, ไลน์ไอดี */}
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          เบอร์โทร <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          อีเมล์ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          ไลน์ไอดี
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* ออกเอกสาร */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        ออกเอกสาร <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">ใบกำกับภาษี vat 7%</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">ใบเเนบบคครรมบคา</span>
                        </label>
                      </div>
                    </div>

                    {/* รายละเอียดสินค้าที่ต้องการ */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        รายละเอียดสินค้าที่ต้องการ <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows="3"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
                      >
                        ส่งคำขอใบเสนอราคา
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
