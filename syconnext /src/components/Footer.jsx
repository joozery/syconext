import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, MapPin, Phone, Mail, Headphones, ChevronUp, MessageCircle } from 'lucide-react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    'ติดตั้งโซล่าเซลล์',
    'บริการเครื่องปรับอากาศ',
    'ระบบไฟฟ้าและการสื่อสาร',
    'ขออนุญาติภาครัฐ'
  ];

  const recommendations = [
    'เกี่ยวกับเรา',
    'บริการของเรา',
    'ติดต่อเพิ่มเติม',
    'บทความ'
  ];

  return (
    <footer className="bg-[#0a192f] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Company Info & Social Media */}
          <div>
            {/* Logo */}
            <div className="mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">S</span>
                <span className="text-2xl font-bold text-orange-500">Y</span>
                <span className="text-2xl font-bold text-white">connext</span>
              </div>
              <p className="text-sm text-white mt-1">
                เอสวาย คอนเน็ค (ประเทศไทย) จำกัด
              </p>
            </div>

            {/* Legal/Tax Info */}
            <div className="mb-6 text-sm text-white/70">
              <p>ห้างหุ้นส่วนจำกัดเอสวาย อิเล็คตริค ซิสเต็ม ทะเบียนผู้เสียภาษีเลขที่ 0673558001120</p>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <span className="text-white font-bold text-sm">f</span>
              </a>
              <a 
                href="https://messenger.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded flex items-center justify-center transition-colors"
                aria-label="Messenger"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://line.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded flex items-center justify-center transition-colors"
                aria-label="LINE"
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5h-3v-1h3v1zm5-3.5H7.5v-1h8v1zm0-3H7.5v-1h8v1z"/>
                </svg>
              </a>
              <a 
                href="tel:0896416425" 
                className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded flex items-center justify-center transition-colors"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Middle Column - Services & Recommendations (2 Sub-columns) */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Sub-column - Services */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">บริการแนะนำของเรา</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-white">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Sub-column - Recommendations */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">แนะนำ</h3>
              <ul className="space-y-3">
                {recommendations.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <Link to={`/${item === 'เกี่ยวกับเรา' ? 'about' : item === 'บริการของเรา' ? 'services' : item === 'ติดต่อเพิ่มเติม' ? 'contact' : 'articles'}`} className="text-white hover:text-orange-500 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">ช่องทางติดต่อ</h3>
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-white text-sm leading-relaxed">
                  เลขที่ 7/17 ถ. สระบุรี-หล่มสัก ต.ในเมือง อ.เมือง จ.เพชรบูรณ์ 67000 
                  (สี่แยกโรงพยาบาลเพชรรัตน์ ฝั่งฮอนด้าศรี สยาม)
                </p>
              </div>

              {/* Customer Service */}
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-white">Customer Service : <a href="tel:056020350" className="hover:text-orange-500 transition-colors">056-020350</a></span>
              </div>

              {/* Direct Phone */}
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href="tel:0896416425" className="text-white hover:text-orange-500 transition-colors">089-6416425</a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <a href="mailto:sy.electricsystem@gmail.com" className="text-white hover:text-orange-500 transition-colors">sy.electricsystem@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-white/70 text-sm">
            © Copyright 2024 SY Connext (Thailand) Co., Ltd. All Rights Reserved. 2025 |
          </p>
          
          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className={`w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded flex items-center justify-center transition-all duration-300 ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

