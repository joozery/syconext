import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1643035660996-0834db96a85a',
      title: 'ระบบไฟฟ้าและโซล่าเซลล์',
      description: 'บริการครบวงจรตั้งแต่การออกแบบจนถึงการบำรุงรักษา เพื่อช่วยลดค่าไฟฟ้าและส่งเสริมการใช้พลังงานสะอาด',
      buttonText: 'เริ่มต้นใช้งาน',
      overlay: 'from-blue-900/60 to-green-900/60'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
      title: 'ติดตั้งโซล่าเซลล์คุณภาพ',
      description: 'ทีมงานมืออาชีพพร้อมให้บริการติดตั้งระบบโซล่าเซลล์ที่ทันสมัยและมีประสิทธิภาพสูง',
      buttonText: 'ขอใบเสนอราคา',
      overlay: 'from-orange-900/60 to-yellow-900/60'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9',
      title: 'บำรุงรักษาและซ่อมแซม',
      description: 'บริการบำรุงรักษาระบบไฟฟ้าและโซล่าเซลล์อย่างต่อเนื่อง เพื่อความปลอดภัยและประสิทธิภาพสูงสุด',
      buttonText: 'ติดต่อเรา',
      overlay: 'from-purple-900/60 to-pink-900/60'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      setDirection(1);
    }, 5000); // เปลี่ยนสไลด์ทุก 5 วินาที

    return () => clearInterval(timer);
  }, [slides.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 1.05
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    })
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden bg-gray-900">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.4, ease: "easeInOut" },
            opacity: { duration: 0.3 },
            scale: { duration: 0.4, ease: "easeInOut" }
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          >
            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.overlay}`} />
            
            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-2xl">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                  >
                    {currentSlide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
                  >
                    {currentSlide.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link to="/register">
                      <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white group text-lg px-8 py-6">
                        {currentSlide.buttonText}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 py-6">
                      ติดต่อเรา
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'bg-orange-500 w-10 h-3'
                : 'bg-white/50 hover:bg-white/70 w-3 h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;

