import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, RotateCw, ZoomIn, ZoomOut, FileText, Calendar, Building2, User, Phone, Mail, MapPin, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { getPrintTemplate } from './print-template';

const PDFPreviewModal = ({ isOpen, onClose, organization, coordinator: initialCoordinator, onDownload, onPrint }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  
  // State for editable address
  const [editableAddress, setEditableAddress] = useState('');
  const [editableCoordinator, setEditableCoordinator] = useState({
    name: '',
    phone: ''
  });
  
  // Use coordinator from organization data (from registration)
  const coordinator = {
    fullName: editableCoordinator.name || organization?.coordinator || 'ไม่ระบุ',
    phone: editableCoordinator.phone || organization?.coordinatorContact || 'ไม่ระบุ',
    email: organization?.coordinatorEmail || 'ไม่ระบุ'
  };
  
  // Initialize editable data when modal opens or organization changes
  useEffect(() => {
    if (isOpen && organization) {
      console.log('PDFPreviewModal - Organization data:', organization);
      console.log('PDFPreviewModal - Document Number:', organization?.documentNumber);
      setEditableAddress(organization?.address || organization?.epcAddress || '');
      setEditableCoordinator({
        name: organization?.coordinator || organization?.coordinatorName || '',
        phone: organization?.coordinatorContact || organization?.coordinatorPhone || ''
      });
    }
  }, [isOpen, organization]);

  // Load TH SarabunPSK font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (isOpen && organization) {
      generatePDF();
    }
  }, [isOpen, organization]);

  const generatePDF = async () => {
    setLoading(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock PDF URL (in real implementation, this would be from your backend)
      const mockPdfUrl = `data:application/pdf;base64,${btoa('Mock PDF Content')}`;
      setPdfUrl(mockPdfUrl);
      
      toast({
        title: "✅ สร้างเอกสารสำเร็จ",
        description: "เอกสาร PDF พร้อมสำหรับการดูและดาวน์โหลด",
      });
    } catch (error) {
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างเอกสาร PDF ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(organization);
    }
    toast({
      title: "📥 กำลังดาวน์โหลด",
      description: `กำลังดาวน์โหลดเอกสารสำหรับ ${organization.epcName || organization.name}`,
    });
  };

  const handlePrint = () => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        // Use the new Tailwind-based template with editable data
        const editableData = {
          address: editableAddress,
          coordinator: editableCoordinator
        };
        const printContent = getPrintTemplate(organization, formatDate, coordinator, editableData);
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for Tailwind and fonts to load then print
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 1500);
        
        toast({
          title: "🖨️ กำลังเตรียมพิมพ์",
          description: `กำลังเตรียมเอกสารสำหรับพิมพ์`,
        });
      } else {
        throw new Error('ไม่สามารถเปิดหน้าต่างพิมพ์ได้');
      }
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถพิมพ์เอกสารได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
    
    if (onPrint) {
      onPrint(organization);
    }
  };

  // OLD CODE TO REMOVE - START
  const handlePrint_OLD = () => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        // OLD Create print content with full styling
        const printContent_OLD = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>เอกสาร PDF - ${organization?.epcName || organization?.name}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Sarabun', sans-serif;
                background: white;
                padding: 0;
                line-height: 1.6;
              }
              
              .document-container {
                max-width: 21cm;
                margin: 0 auto;
                background: white;
                padding: 2.54cm 2.54cm 2.54cm 3.17cm;
                min-height: 29.7cm;
              }
              
              /* Company Header */
              .company-header {
                display: flex;
                gap: 12px;
                margin-bottom: 30px;
                align-items: flex-start;
              }
              
              .company-logo {
                width: 70px;
                height: 70px;
                background: #2563eb;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 28px;
                flex-shrink: 0;
              }
              
              .company-info {
                flex: 1;
              }
              
              .company-name-en {
                font-size: 16px;
                font-weight: bold;
                color: #000;
                margin-bottom: 2px;
                line-height: 1.2;
              }
              
              .company-name-th {
                font-size: 14px;
                font-weight: 600;
                color: #000;
                margin-bottom: 6px;
                line-height: 1.2;
              }
              
              .company-address {
                font-size: 12px;
                color: #000;
                margin-bottom: 2px;
                line-height: 1.4;
              }
              
              .company-contact {
                font-size: 12px;
                color: #000;
                line-height: 1.4;
              }
              
              /* Document Details */
              .document-details {
                margin-bottom: 20px;
              }
              
              .detail-row {
                margin-bottom: 0;
                line-height: 2;
              }
              
              .detail-item {
                display: inline;
                margin-right: 60px;
              }
              
              .detail-label {
                font-size: 16px;
                font-weight: 400;
                color: #000;
              }
              
              .detail-value {
                font-size: 16px;
                color: #000;
              }
              
              .detail-subject {
                margin: 20px 0;
                line-height: 2;
              }
              
              .detail-subject .detail-label {
                font-size: 16px;
                font-weight: 400;
                color: #000;
              }
              
              .detail-subject .detail-value {
                font-size: 16px;
                color: #000;
                line-height: 1.8;
                display: block;
                text-indent: 80px;
                margin-top: -24px;
              }
              
              .detail-to {
                margin: 10px 0;
                line-height: 2;
              }
              
              .detail-to .detail-label {
                font-size: 16px;
                font-weight: 400;
                color: #000;
              }
              
              .detail-to .detail-value {
                font-size: 16px;
                color: #000;
              }
              
              .attachments {
                margin: 15px 0 20px 0;
                line-height: 2;
              }
              
              .attachments .detail-label {
                font-size: 16px;
                font-weight: 400;
                color: #000;
                display: block;
              }
              
              .attachments .detail-value {
                font-size: 16px;
                color: #000;
                margin-left: 140px;
                line-height: 2;
              }
              
              .attachments .detail-value div {
                text-indent: -20px;
                padding-left: 20px;
              }
              
              /* Document Content */
              .document-content {
                margin: 25px 0;
              }
              
              .content-paragraph {
                font-size: 16px;
                color: #000;
                line-height: 2;
                margin-bottom: 0;
                text-align: justify;
                text-indent: 60px;
              }
              
              /* Response Section */
              .response-section {
                margin-top: 25px;
              }
              
              .response-intro {
                font-size: 16px;
                color: #000;
                line-height: 2;
                text-align: justify;
                text-indent: 60px;
                margin-bottom: 15px;
              }
              
              .response-box {
                border: none;
                padding: 0;
                background: transparent;
                margin-top: 15px;
                margin-left: 100px;
              }
              
              .response-title {
                font-size: 16px;
                font-weight: 400;
                color: #000;
                margin-bottom: 10px;
              }
              
              .response-item {
                margin-bottom: 10px;
                font-size: 16px;
                line-height: 2;
              }
              
              .response-label {
                color: #000;
                display: inline-block;
                width: 120px;
              }
              
              .response-value {
                color: #000;
              }
              
              /* Document Footer */
              .document-footer {
                margin-top: 60px;
                display: block;
                text-align: center;
              }
              
              .footer-respect {
                font-size: 16px;
                color: #000;
                margin-bottom: 60px;
                text-align: center;
              }
              
              .footer-signature {
                text-align: center;
              }
              
              .signature-label {
                font-size: 16px;
                color: #000;
                margin-bottom: 50px;
              }
              
              .signature-name {
                font-size: 16px;
                color: #000;
                margin-bottom: 5px;
              }
              
              .signature-company {
                font-size: 16px;
                color: #000;
              }
              
              @media print {
                body {
                  padding: 0;
                }
                
                .document-container {
                  max-width: none;
                  padding: 2.54cm 2.54cm 2.54cm 3.17cm;
                }
                
                @page {
                  margin: 0;
                  size: A4;
                }
              }
            </style>
          </head>
          <body>
            <div class="document-container">
              <!-- Company Header -->
              <div class="company-header">
                <div class="company-logo">E</div>
                <div class="company-info">
                  <div class="company-name-en">EVOLUTION ENERGY TECH CO.,LTD.</div>
                  <div class="company-name-th">บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด</div>
                  <div class="company-address">285 ซอยรามอินทรา65 แขวงท่าแร้ง เขตบางเขน กรุงเทพมหานคร 10230</div>
                  <div class="company-contact">E-Mail: evolution.entech@gmail.com Tel: 092-647-9694</div>
                </div>
              </div>

              <!-- Document Details -->
              <div class="document-details">
                <div class="detail-row">
                  <div class="detail-item">
                    <span class="detail-label">เลขที่</span>
                    <span class="detail-value"> ${organization?.documentNumber || 'ชร. 0001/2568'}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">วันที่</span>
                    <span class="detail-value"> ${formatDate(new Date())}</span>
                  </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <span class="detail-label" style="font-size: 16px;">วันที่....................................</span>
                </div>
                
                <div class="detail-subject">
                  <span class="detail-label">เรื่อง</span>
                  <span class="detail-value">เชิญเข้าร่วมโครงการติดตั้งและบำรุงรักษาอุปกรณ์ประหยัดพลังงานในระบบการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ที่ติดตั้งบนหลังคา (Solar Rooftop)</span>
                </div>
                
                <div class="detail-to">
                  <span class="detail-label">เรียน</span>
                  <span class="detail-value"> ผู้อำนวยการโรงเรียน</span>
                </div>
                
                <div class="attachments">
                  <span class="detail-label">สิ่งที่ส่งมาด้วย</span>
                  <div class="detail-value">
                    <div>1. มาตรการลดค่าใช้จ่ายหน่วยงานภาครัฐ Solar Rooftop On Grid : Smart Government 1 ชุด</div>
                    <div>2. แบบเก็บข้อมูลโครงการติดตั้งและบำรุงรักษาอุปกรณ์ประหยัดพลังงาน 1 ชุด</div>
                  </div>
                </div>
              </div>

              <!-- Document Content -->
              <div class="document-content">
                <p class="content-paragraph">
                  ด้วย บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด มีการให้บริการโครงการจัดการพลังงานไฟฟ้าจากระบบผลิตไฟฟ้าพลังงานแสงอาทิตย์ที่ติดตั้งบนหลังคา (Solar Rooftop) เพื่อช่วยหน่วยงานราชการลดค่าใช้จ่ายในการใช้พลังงานไฟฟ้า ตามที่คณะรัฐมนตรีได้อนุมัติเป็นหลักการให้หน่วยงานราชการดำเนินการตามข้อเสนอของกระทรวงพลังงาน ลดการใช้พลังงานร้อยละ 15 (รวมไฟฟ้า และน้ำมันเชื้อเพลิง) เพื่อตอบสนองมาตรการลดค่าใช้จ่ายด้านพลังงานไฟฟ้าในหน่วยงานภาครัฐ รายละเอียดตามสิ่งที่ส่งมาด้วย 1
                </p>
                
                <p class="content-paragraph">
                  ในการนี้ บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด ขอมีส่วนร่วมเพื่อช่วยประหยัดค่าใช้จ่าย ลดปัญหามลพิษและสิ่งแวดล้อม โดยโครงการดังกล่าว บริษัทฯ จะให้บริการติดตั้งระบบผลิตไฟฟ้าด้วยพลังงานแสงอาทิตย์แบบติดตั้งบนหลังคา (Solar Rooftop) พร้อมเป็นผู้ให้บริการครอบคลุมตั้งแต่ การจัดหาเงินทุน การสำรวจ ออกแบบ ติดตั้ง บำรุงรักษาอุปกรณ์ และรื้อถอนอุปกรณ์เมื่อครบกำหนดระยะเวลาของสัญญา หน่วยงานของท่านเพียงตอบรับตกลงใช้บริการ และอนุญาตให้ บริษัทฯ ใช้พื้นที่หลังคาของสิ่งปลูกสร้างพร้อมสิ่งจำเป็นเท่านั้น โดย บริษัทฯ จะขอเก็บค่าบริการเป็นค่าไฟฟ้าตามจำนวนที่มีการใช้จริง ผ่านเครื่องวัดหน่วยไฟฟ้า ซึ่งจะมีผลการคำนวณส่วนลดในอัตราพิเศษ แสดงให้ทราบก่อนที่จะตกลงทำสัญญา โดยค่าใช้จ่ายดังกล่าวจะคิดค่าบริการต่อหน่วยในอัตรา บาท/หน่วย ซึ่งต่ำกว่าค่าไฟฟ้าปกติ โดยไม่มีค่า FT และค่าบริการอย่างอื่น ซึ่งสามารถใช้งบสาธารณูปโภคมาชำระค่าบริการจัดการพลังงานได้ตลอดอายุสัญญา (ไฟฟ้าที่ผลิตได้จาก Solar Rooftop หมายถึงการจัดการพลังงาน)
                </p>
              </div>

              <!-- Call to Action -->
              <div class="response-section">
                <p class="response-intro">
                  ทั้งนี้ หากโรงเรียนของท่านสนใจที่จะเข้าร่วมโครงการดังกล่าว แจ้งความประสงค์เข้าร่วมโครงการมาที่ .............................. หรือสอบถามรายละเอียดเพิ่มเติมได้ที่ 2 ท่านเหล่านี้ผู้ประสานงาน สามารถติดต่อมาได้ตลอดเวลา
                </p>
                
                <div class="response-box">
                  <div class="response-item">
                    <span class="response-label">เบอร์โทรศัพท์ มือถือ</span>
                    <span class="response-value">.............................. ตำแหน่ง .............................. ตำแหน่ง ...............................</span>
                  </div>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                  <p style="font-size: 16px; line-height: 2;">จึงเรียนมาเพื่อทราบและขอความอนุเคราะห์ดำเนินการตอบกลับ</p>
                </div>
              </div>

              <!-- Document Footer -->
              <div class="document-footer">
                <div class="footer-respect">
                  ขอแสดงความนับถือ
                </div>
                <div class="footer-signature">
                  <p class="signature-label">( นายสุรศักดิ์ รัตน์ วิไลยกุลธร )</p>
                  <p class="signature-name">กรรมการผู้จัดการ</p>
                  <p class="signature-company">บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for fonts to load then print
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 1000);
        
        toast({
          title: "🖨️ กำลังเตรียมพิมพ์",
          description: `กำลังเตรียมเอกสารสำหรับพิมพ์ ${organization?.epcName || organization?.name}`,
        });
      } else {
        throw new Error('ไม่สามารถเปิดหน้าต่างพิมพ์ได้');
      }
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถพิมพ์เอกสารได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
    
    if (onPrint) {
      onPrint(organization);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">ตัวอย่างเอกสาร PDF</h2>
                <p className="text-sm text-slate-600">{organization?.epcName || organization?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 border border-slate-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 50}
                  className="h-8 w-8 p-0"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="px-2 text-sm font-medium min-w-[3rem] text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Rotate Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="h-8 w-8 p-0"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[calc(95vh-140px)]">
            {/* PDF Preview */}
            <div className="flex-1 p-4 bg-slate-100 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">กำลังสร้างเอกสาร PDF...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                  {/* Mock PDF Content */}
                  <div 
                    className="pdf-content bg-white px-20 pt-2 pb-8"
                    style={{ 
                      transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {/* Letterhead */}
                    <div className="flex items-start mb-4">
                      <div className="w-16 h-16 mr-3">
                        <img src="/logo-eet.png" alt="Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-xs font-bold text-blue-600">EVOLUTION ENERGY TECH CO.,LTD.</h1>
                        <p className="text-[10px] text-gray-600">บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          285 ซอยรามอินทรา65 แขวงท่าแร้ง เขตบางเขน กรุงเทพมหานคร 10230
                        </p>
                        <p className="text-[10px] text-gray-500">
                          E-Mail: evolution.entech@gmail.com Tel: 092-647-9694
                        </p>
                      </div>
                    </div>

                    {/* Document Number */}
                    <p className="text-[12px] font-['Sarabun',_sans-serif] mb-8">
                      เลขที่ {organization?.documentNumber || 'ชร. 0001/2568'}
                    </p>

                    <div className="font-['Sarabun',_sans-serif] text-[12px] leading-relaxed">
                      {/* Date */}
                      <p className="text-right pr-40 mb-6">
                        วันที่ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      
                      {/* Subject */}
                      <div className="mb-4">
                        <div className="flex">
                          <span className="inline-block w-16 flex-shrink-0">เรื่อง</span>
                          <div className="flex-1">
                            <p>เชิญเข้าร่วมโครงการติดตั้งและบำรุงรักษาอุปกรณ์ประหยัดพลังงานในระบบการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ที่ติดตั้งบนหลังคา (Solar Rooftop)</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recipient */}
                      <p className="mb-4">
                        <span className="inline-block w-16">เรียน</span>
                        {organization?.principalName && organization.principalName !== 'ไม่ระบุ' 
                          ? organization.principalName 
                          : `ผู้อำนวยการ${organization?.name || 'โรงเรียน'}`}
                      </p>
                      
                      {/* Attachments */}
                      <div className="mb-6 space-y-1">
                        <p className="flex justify-between">
                          <span>
                            <span className="inline-block w-20">สิ่งที่ส่งมาด้วย</span>
                            <span>1. มาตรการลดค่าใช้จ่ายหน่วยงานภาครัฐ Solar Rooftop On Grid : Smart Government</span>
                          </span>
                          <span>1 ชุด</span>
                        </p>
                        <p className="flex justify-between ml-20">
                          <span>2. แบบเก็บข้อมูลโครงการติดตั้งและบำรุงรักษาอุปกรณ์ประหยัดพลังงาน</span>
                          <span>1 ชุด</span>
                        </p>
                      </div>
                      
                      {/* Body */}
                      <div className="text-justify space-y-4 mb-6">
                        <p className="indent-12">
                          ด้วย บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด มีการให้บริการโครงการจัดการพลังงานไฟฟ้าจากระบบผลิตไฟฟ้าพลังงานแสงอาทิตย์ที่ติดตั้งบนหลังคา (Solar Rooftop) เพื่อช่วยหน่วยงานราชการลดค่าใช้จ่ายในการใช้พลังงานไฟฟ้า ตามที่คณะรัฐมนตรีได้อนุมัติเป็นหลักการให้หน่วยงานราชการดำเนินการตามข้อเสนอของกระทรวงพลังงาน ลดการใช้พลังงานร้อยละ 15 (รวมไฟฟ้า และน้ำมันเชื้อเพลิง) เพื่อตอบสนองมาตรการลดค่าใช้จ่ายด้านพลังงานไฟฟ้าในหน่วยงานภาครัฐ รายละเอียดตามสิ่งที่ส่งมาด้วย 1
                        </p>
                        
                        <p className="indent-12">
                          ในการนี้ บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด ขอมีส่วนร่วมเพื่อช่วยประหยัดค่าใช้จ่าย ลดปัญหามลพิษและสิ่งแวดล้อม โดยโครงการดังกล่าว บริษัทฯ จะให้บริการติดตั้งระบบผลิตไฟฟ้าด้วยพลังงานแสงอาทิตย์แบบติดตั้งบนหลังคา (Solar Rooftop) พร้อมเป็นผู้ให้บริการครอบคลุมตั้งแต่ การจัดหาเงินทุน การสำรวจ ออกแบบ ติดตั้ง บำรุงรักษาอุปกรณ์ และรื้อถอนอุปกรณ์เมื่อครบกำหนดระยะเวลาของสัญญา หน่วยงานของท่านเพียงตอบรับตกลงใช้บริการ และอนุญาตให้ บริษัทฯ ใช้พื้นที่หลังคาของสิ่งปลูกสร้างพร้อมสิ่งจำเป็นเท่านั้น โดย บริษัทฯ จะขอเก็บค่าบริการเป็นค่าไฟฟ้าตามจำนวนที่มีการใช้จริง ผ่านเครื่องวัดหน่วยไฟฟ้า ซึ่งจะมีผลการคำนวณส่วนลดในอัตราพิเศษ แสดงให้ทราบก่อนที่จะตกลงทำสัญญา โดยค่าใช้จ่ายดังกล่าวจะคิดค่าบริการต่อหน่วยในอัตรา บาท/หน่วย ซึ่งต่ำกว่าค่าไฟฟ้าปกติ โดยไม่มีค่า FT และค่าบริการอย่างอื่น ซึ่งสามารถใช้งบสาธารณูปโภคมาชำระค่าบริการจัดการพลังงานได้ตลอดอายุสัญญา (ไฟฟ้าที่ผลิตได้จาก Solar Rooftop หมายถึงการจัดการพลังงาน)
                        </p>
                        
                        <p className="indent-12">
                          ทั้งนี้ หาก{organization?.name || 'โรงเรียน'} ต้องการมีส่วนร่วมโครงการดังกล่าว บริษัทฯ ขอเรียนว่าสามารถแจ้งความประสงค์เข้าร่วมโครงการมาที่ {editableAddress || '...........................................................'} รายละเอียดตามที่สิ่งที่ส่งมาด้วย 2 หากมีข้อสงสัยประการใด สามารถสอบถามรายละเอียดเพิ่มเติมได้ที่ {coordinator?.fullName || 'นาย...........................................................'} โทรศัพท์ {coordinator?.phone || '...........................................................'} ตำแหน่ง ผู้ประสานงาน
                        </p>
                        
                        <p className="ml-32">
                          จึงเรียนมาเพื่อทราบและดำเนินการต่อไป
                        </p>
                      </div>
                      
                      {/* Signature */}
                      <div className="text-right pr-32 mt-16">
                        <p className="mb-2" style={{ paddingRight: '3rem' }}>ขอแสดงความนับถือ</p>
                        
                        <div className="mt-6 space-y-0 flex flex-col items-end">
                          <div className="flex items-end gap-4 mb-1" style={{ marginRight: '3rem', height: '4rem', alignItems: 'flex-end' }}>
                            <img 
                              src="/pum.png" 
                              alt="ตราปั้ม" 
                              className="h-32"
                              style={{ transform: 'scale(1)', transformOrigin: 'center' }}
                            />
                            <img 
                              src="/sing.png" 
                              alt="ลายเซ็น" 
                              className="h-10"
                              style={{ marginLeft: '2rem', alignSelf: 'flex-end' }}
                            />
                          </div>
                          <p style={{ paddingRight: '3rem' }}>( นายไพศาล ภาษี )</p>
                          <p style={{ paddingRight: '3rem' }}>กรรมการผู้จัดการ</p>
                          <p style={{ paddingRight: '0.25rem', marginRight: '0rem' }}>บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Organization Summary Sidebar */}
            <div className="w-96 bg-slate-50 border-l border-slate-200 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                แก้ไขข้อมูลการส่ง
              </h3>
              
              <div className="space-y-4">
                {/* Editable Address Form */}
                <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                  <Label className="text-sm font-semibold text-slate-800 mb-3 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    ที่อยู่ส่งเอกสาร
                  </Label>
                  <Textarea
                    value={editableAddress}
                    onChange={(e) => setEditableAddress(e.target.value)}
                    placeholder="กรอกที่อยู่สำหรับส่งเอกสาร..."
                    className="min-h-[80px] text-sm"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    ข้อมูลนี้จะแสดงในเอกสาร PDF
                  </p>
                </div>

                {/* Editable Coordinator Form */}
                <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                  <Label className="text-sm font-semibold text-slate-800 mb-3 block flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" />
                    ข้อมูลผู้ประสานงาน
                  </Label>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-slate-600 mb-1 block">ชื่อ-นามสกุล</Label>
                      <Input
                        value={editableCoordinator.name}
                        onChange={(e) => setEditableCoordinator(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="กรอกชื่อผู้ประสานงาน"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-600 mb-1 block">เบอร์ติดต่อ</Label>
                      <Input
                        value={editableCoordinator.phone}
                        onChange={(e) => setEditableCoordinator(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="08x-xxx-xxxx"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Display Coordinator Info */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-300">
                  <Label className="text-sm font-semibold text-orange-900 mb-3 block">ตัวอย่างการแสดงผล</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-orange-900">
                      <User className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="font-medium">{coordinator?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-900">
                      <Phone className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span>{coordinator?.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {(organization?.epcName || organization?.name)?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{organization?.epcName || organization?.name}</p>
                      <Badge variant="secondary" className={`text-xs ${
                        organization?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {organization?.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {organization?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{organization.email}</span>
                      </div>
                    )}
                    {(organization?.epcContact || organization?.contact) && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{organization.epcContact || organization.contact}</span>
                      </div>
                    )}
                    {(organization?.epcAddress || organization?.address) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{organization.epcAddress || organization.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">เข้าร่วม: {formatDate(organization?.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-2">สถิติโครงการ</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">จำนวนโครงการ</span>
                      <Badge variant="outline" className="text-xs">{organization?.projects || 0}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-600">
              <p>เอกสารนี้ถูกสร้างขึ้นเมื่อ {formatDate(new Date())}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6"
              >
                ปิด
              </Button>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="px-6 text-purple-600 hover:text-purple-700"
              >
                <Printer className="w-4 h-4 mr-2" />
                พิมพ์
              </Button>
              <Button
                onClick={handleDownload}
                className="px-6 bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                ดาวน์โหลด PDF
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PDFPreviewModal;
