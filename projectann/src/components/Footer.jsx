import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Twitter, Youtube, Instagram, Heart, Tag, Home } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          {/* Main Title */}
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              ตลาดหนี้มือถือ
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              แพลตฟอร์มซื้อขายหนี้มือถือออนไลน์ สำหรับนักลงทุนและนักทวงหนี้มืออาชีพ
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ค้นหาและซื้อหนี้มือถือคุณภาพได้ง่ายๆ ผ่านระบบออนไลน์ที่ปลอดภัย 
              พร้อมข้อมูลครบถ้วนและโปร่งใส ครอบคลุมทุกประเภทหนี้ 
              <span className="text-primary-600 font-semibold"> เช่าซื้อสินค้า</span>, 
              <span className="text-primary-600 font-semibold"> เงินกู้</span>, 
              <span className="text-primary-600 font-semibold"> หนี้บัตรเครดิต</span>, 
              <span className="text-primary-600 font-semibold"> หนี้ส่วนบุคคล</span> 
              และ <span className="text-primary-600 font-semibold">หนี้ธุรกิจ</span> 
              เพื่อตอบสนองความต้องการทุกประเภท
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 py-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">หน้าหลัก</span>
            </motion.div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">หนี้ที่สนใจ</span>
            </motion.div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors"
            >
              <Tag className="w-5 h-5" />
              <span className="font-medium">โปรโมชัน</span>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">02-888-8888 กด 04</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">support@debtmarket.com</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 cursor-pointer transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">กรุงเทพมหานคร</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left - Contact Center */}
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold">Debt Contact Center</div>
                <div className="text-sm text-primary-100">02-888-8888 กด 04</div>
              </div>
            </div>

            {/* Center - Slogan */}
            <div className="text-center">
              <p className="text-white font-medium">บริการทุกระดับประทับใจ</p>
            </div>

            {/* Right - Social Media */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-100 transition-colors"
              >
                <Facebook className="w-4 h-4 text-primary-600" />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-100 transition-colors"
              >
                <Twitter className="w-4 h-4 text-primary-600" />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-100 transition-colors"
              >
                <Youtube className="w-4 h-4 text-primary-600" />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-100 transition-colors"
              >
                <Instagram className="w-4 h-4 text-primary-600" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-800 text-center py-4">
        <p className="text-gray-400 text-sm">
          © 2024 ตลาดหนี้มือถือ. All rights reserved. | 
          <span className="ml-2">นโยบายความเป็นส่วนตัว</span> | 
          <span className="ml-2">เงื่อนไขการใช้งาน</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
