import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'หน้าแรก' },
    { path: '/about', label: 'เกี่ยวกับเรา' },
    { path: '/products', label: 'สินค้า' },
    { path: '/services', label: 'บริการของเรา', hasDropdown: true },
    { path: '/portfolio', label: 'ผลงาน' },
    { path: '/articles', label: 'บทความ' },
    { path: '/contact', label: 'ติดต่อเรา' },
    { path: '/quote', label: 'ขอใบเสนอราคา' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Contact Bar - Orange Background */}
      <div className="bg-orange-500 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>sy.solare@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>084-049-0364</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>089-641-6425</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Dark Blue Background */}
      <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex flex-col group">
                <div className="flex items-center transition-transform group-hover:scale-105 duration-300">
                  <span className="text-2xl font-bold text-white">S</span>
                  <span className="text-2xl font-bold text-orange-500">Y</span>
                  <span className="text-2xl font-bold text-white">connext</span>
                </div>
                <span className="text-[10px] text-white/80 group-hover:text-white leading-tight mt-0.5 transition-colors">
                  เอสวาย คอนเน็ค (ประเทศไทย) จำกัด
                </span>
              </Link>
            </div>

            {/* Navigation Links - Center */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <DropdownMenu key={link.path} open={isServicesOpen} onOpenChange={setIsServicesOpen}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`
                            relative flex items-center gap-1 px-4 py-2 text-white font-medium
                            transition-all duration-300 group
                            hover:text-orange-400
                            ${isServicesOpen ? 'text-orange-400' : ''}
                          `}
                        >
                          <span>{link.label}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
                          <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform origin-left transition-transform duration-300 ${isServicesOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-white text-gray-900 min-w-[200px]">
                        <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors">ออกแบบและติดตั้งระบบไฟฟ้า</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors">ติดตั้งโซล่าเซลล์</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors">บำรุงรักษาและซ่อมแซม</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-colors">ตรวจสอบและแก้ไขปัญหาต่างๆ</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      relative px-4 py-2 whitespace-nowrap font-medium
                      transition-all duration-300 group
                      ${isActive(link.path) 
                        ? 'text-orange-400' 
                        : 'text-white hover:text-orange-400'
                      }
                    `}
                  >
                    {link.label}
                    <span 
                      className={`
                        absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 
                        transform origin-left transition-transform duration-300
                        ${isActive(link.path) 
                          ? 'scale-x-100' 
                          : 'scale-x-0 group-hover:scale-x-100'
                        }
                      `}
                    ></span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Button and Icons */}
            <div className="flex items-center gap-4">
              {/* Course Button */}
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white hidden md:inline-flex rounded px-4 py-2"
              >
                คอร์สเรียนโซล่าเซลล์
              </Button>

              {/* Shopping Cart with Badge */}
              <div className="relative group">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110">
                  <svg 
                    className="w-6 h-6 transition-colors" 
                    viewBox="0 0 24 24" 
                    fill="white" 
                    stroke="rgb(249 115 22)" 
                    strokeWidth="2.5"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                </button>
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  0
                </span>
              </div>

              {/* Search Icon */}
              <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110 group">
                <Search className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors" />
              </button>

              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 hover:bg-white/10 rounded transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Blue Bottom Border */}
        <div className="h-1 bg-blue-500"></div>
      </nav>
    </>
  );
};

export default Navbar;

