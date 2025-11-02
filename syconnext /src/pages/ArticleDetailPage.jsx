import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ArticleDetailPage = () => {
  const { id } = useParams();

  // Mock article data - ในระบบจริงควรดึงจาก API
  const article = {
    id: 1,
    title: 'เทรนด์โซล่าเซลล์ปี 2025',
    category: 'เทคโนโลยี',
    date: '15 มกราคม 2025',
    author: 'ทีมงาน SY Connext',
    readTime: '5 นาที',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
    excerpt: 'ทำความรู้จักกับเทคโนโลยีโซล่าเซลล์ล่าสุดที่จะเปลี่ยนโลก',
    content: `
      <h2>เทคโนโลยีโซล่าเซลล์ที่กำลังมาแรงในปี 2025</h2>
      <p>ในปี 2025 อุตสาหกรรมโซล่าเซลล์กำลังก้าวเข้าสู่ยุคใหม่ด้วยเทคโนโลยีที่ทันสมัยและมีประสิทธิภาพสูงขึ้นกว่าเดิม การพัฒนาแผงโซล่าเซลล์รุ่นใหม่ไม่เพียงแต่เพิ่มประสิทธิภาพในการผลิตไฟฟ้าเท่านั้น แต่ยังช่วยลดต้นทุนการติดตั้งและบำรุงรักษาอีกด้วย</p>

      <h2>1. แผงโซล่าเซลล์ชนิด Perovskite</h2>
      <p>เทคโนโลยี Perovskite Solar Cells เป็นนวัตกรรมใหม่ที่กำลังได้รับความสนใจอย่างมาก ด้วยประสิทธิภาพที่สูงถึง 25-30% และต้นทุนการผลิตที่ต่ำกว่าแผงโซล่าเซลล์แบบเดิม นอกจากนี้ยังมีน้ำหนักเบาและยืดหยุ่นได้ ทำให้สามารถติดตั้งได้ในพื้นที่ที่หลากหลาย</p>

      <h2>2. ระบบจัดเก็บพลังงาน (Energy Storage)</h2>
      <p>การพัฒนาระบบแบตเตอรี่สำหรับเก็บพลังงานจากแผงโซล่าเซลล์มีความสำคัญมากขึ้น โดยเฉพาะแบตเตอรี่ลิเธียมไอออนรุ่นใหม่ที่มีความจุสูงและอายุการใช้งานยาวนานขึ้น ทำให้สามารถใช้พลังงานโซล่าเซลล์ได้ตลอด 24 ชั่วโมง</p>

      <h2>3. AI และ IoT ในระบบโซล่าเซลล์</h2>
      <p>การนำเทคโนโลยี AI และ IoT มาใช้ในระบบโซล่าเซลล์ช่วยให้สามารถติดตามและจัดการการผลิตไฟฟ้าได้อย่างมีประสิทธิภาพ ระบบสามารถวิเคราะห์ข้อมูลและปรับแต่งการทำงานของแผงโซล่าเซลล์ให้เหมาะสมกับสภาพอากาศและความต้องการใช้ไฟฟ้า</p>

      <h2>4. Building-Integrated Photovoltaics (BIPV)</h2>
      <p>เทคโนโลยี BIPV เป็นการผสมผสานแผงโซล่าเซลล์เข้ากับวัสดุก่อสร้าง เช่น หลังคา หน้าต่าง และผนังอาคาร ทำให้อาคารสามารถผลิตพลังงานไฟฟ้าได้เองโดยไม่กระทบต่อความสวยงามของสถาปัตยกรรม</p>

      <h2>5. โซล่าเซลล์แบบลอยน้ำ (Floating Solar)</h2>
      <p>การติดตั้งแผงโซล่าเซลล์บนผิวน้ำเป็นแนวโน้มที่กำลังได้รับความนิยม โดยเฉพาะในประเทศที่มีพื้นที่จำกัด ระบบนี้ไม่เพียงแต่ช่วยประหยัดพื้นที่ แต่ยังช่วยลดการระเหยของน้ำและเพิ่มประสิทธิภาพของแผงโซล่าเซลล์ด้วยการระบายความร้อนจากน้ำ</p>

      <h2>ข้อดีของเทคโนโลยีโซล่าเซลล์ใหม่</h2>
      <ul>
        <li>ประสิทธิภาพสูงขึ้น 30-40% เมื่อเทียบกับแผงรุ่นเก่า</li>
        <li>ต้นทุนการติดตั้งลดลง</li>
        <li>อายุการใช้งานยาวนานขึ้น (25-30 ปี)</li>
        <li>เป็นมิตรกับสิ่งแวดล้อมมากขึ้น</li>
        <li>สามารถติดตั้งได้ในพื้นที่หลากหลาย</li>
      </ul>

      <h2>สรุป</h2>
      <p>เทคโนโลยีโซล่าเซลล์ในปี 2025 มีการพัฒนาอย่างต่อเนื่อง ทำให้พลังงานแสงอาทิตย์กลายเป็นทางเลือกหลักในการผลิตพลังงานสะอาด หากคุณสนใจติดตั้งระบบโซล่าเซลล์สำหรับบ้านหรือธุรกิจของคุณ ทีมงาน SY Connext พร้อมให้คำปรึกษาและบริการติดตั้งอย่างมืออาชีพ</p>
    `,
    tags: ['โซล่าเซลล์', 'เทคโนโลยี', 'พลังงานสะอาด', 'นวัตกรรม']
  };

  const relatedArticles = [
    {
      id: 2,
      title: 'วิธีประหยัดค่าไฟด้วยโซล่าเซลล์',
      category: 'คู่มือ',
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9',
      date: '10 มกราคม 2025'
    },
    {
      id: 3,
      title: 'ผลงานติดตั้งโซล่าเซลล์ล่าสุด',
      category: 'ผลงาน',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
      date: '5 มกราคม 2025'
    },
    {
      id: 4,
      title: 'คำแนะนำการบำรุงรักษาโซล่าเซลล์',
      category: 'บำรุงรักษา',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
      date: '1 มกราคม 2025'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{article.title} - SY Connext</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-gray-600 hover:text-blue-600">หน้าแรก</Link>
              <span className="text-gray-400">/</span>
              <Link to="/#articles" className="text-gray-600 hover:text-blue-600">บทความ</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{article.title}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
                <ArrowLeft className="w-4 h-4" />
                กลับไปหน้าแรก
              </Link>

              {/* Article Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">อ่าน {article.readTime}</span>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-4 pb-6 border-b">
                  <span className="text-sm text-gray-600 font-medium">แชร์บทความ:</span>
                  <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Featured Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-xl"
                />
              </motion.div>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: article.content }}
                style={{
                  '--tw-prose-body': '#374151',
                  '--tw-prose-headings': '#111827',
                  '--tw-prose-links': '#2563eb',
                }}
              />

              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12 pb-12 border-b"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-5 h-5 text-gray-600" />
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white text-center mb-12"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  สนใจติดตั้งโซล่าเซลล์?
                </h3>
                <p className="text-lg mb-6 text-white/90">
                  ปรึกษาทีมงานมืออาชีพของเราได้ฟรี พร้อมรับใบเสนอราคาที่คุ้มค่า
                </p>
                <Link to="/">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold">
                    ขอใบเสนอราคา
                  </Button>
                </Link>
              </motion.div>

              {/* Related Articles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">บทความที่เกี่ยวข้อง</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`/articles/${relatedArticle.id}`}
                      className="group"
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={relatedArticle.image}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                              {relatedArticle.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="text-xs text-gray-500 mb-2">{relatedArticle.date}</div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedArticle.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
};

export default ArticleDetailPage;

