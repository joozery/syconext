import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Download, FileText, Calendar, Check, X, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from '@/components/ui/use-toast';
import { projectsAPI, epcAPI, coordinatorsAPI } from '@/services/api';

// 16 ขั้นตอนการดำเนินงาน
const PROJECT_STEPS = [
  { id: 1, name: 'ลงทะเบียนหน่วยงาน', description: 'ลงทะเบียนข้อมูลหน่วยงานเข้าระบบ' },
  { id: 2, name: 'ออกหนังสือเชิญชวน', description: 'ออกหนังสือเชิญชวนหน่วยงานเข้าร่วมโครงการ' },
  { id: 3, name: 'หน่วยงานตอบรับเข้าร่วมโครงการ', description: 'รอหน่วยงานตอบรับเข้าร่วมโครงการ' },
  { id: 4, name: 'มอบหมาย EPC เข้าสำรวจ', description: 'มอบหมายบริษัท EPC เข้าสำรวจพื้นที่' },
  { id: 5, name: 'พิจารณาตามข้อเสนอ', description: 'พิจารณาข้อเสนอจากบริษัท EPC', note: '⚠️ ถ้าไม่ผ่านเกณฑ์ต้องปฏิเสธงาน' },
  { id: 6, name: 'ลงนามสัญญากับหน่วยงาน', description: 'ลงนามสัญญาความร่วมมือกับหน่วยงาน' },
  { id: 7, name: 'สัญญาจ้าง EPC', description: 'ทำสัญญาจ้างกับบริษัท EPC' },
  { id: 8, name: 'PPA เปิด PO ให้ EPC', description: 'ออก Purchase Order ให้บริษัท EPC' },
  { id: 9, name: 'หน่วยงานออกหนังสือขออนุญาต อ.1', description: 'หน่วยงานออกหนังสือขออนุญาตติดตั้ง อ.1' },
  { id: 10, name: 'ส่งมอบ-รับมอบอุปกรณ์', description: 'ส่งมอบและรับมอบอุปกรณ์โซล่าเซลล์' },
  { id: 11, name: 'EPC ติดตั้งอุปกรณ์', description: 'บริษัท EPC ติดตั้งระบบโซล่าเซลล์' },
  { id: 12, name: 'ตรวจรับงาน', description: 'ตรวจรับงานติดตั้งจากบริษัท EPC' },
  { id: 13, name: 'บำรุงรักษาครั้งที่ 1', description: 'การบำรุงรักษาครั้งที่ 1 (6 เดือน)' },
  { id: 14, name: 'บำรุงรักษาครั้งที่ 2', description: 'การบำรุงรักษาครั้งที่ 2 (12 เดือน)' },
  { id: 15, name: 'บำรุงรักษาครั้งที่ 3', description: 'การบำรุงรักษาครั้งที่ 3 (18 เดือน)' },
  { id: 16, name: 'บำรุงรักษาครั้งที่ 4', description: 'การบำรุงรักษาครั้งที่ 4 (24 เดือน)' },
];

const ProjectStatusDetail = ({ projectId, onBack }) => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [epcCompany, setEpcCompany] = useState(null);
  const [coordinator, setCoordinator] = useState(null);
  const [projectSteps, setProjectSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingStep, setUploadingStep] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedStepDocuments, setSelectedStepDocuments] = useState({ stepName: '', docs: [] });
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    documents: [], // Changed to array for multiple files
    notes: '',
  });

  useEffect(() => {
    loadProjectDetail();
  }, [projectId]);

  // Convert "DD / MM / YYYY (Buddhist)" back to "YYYY-MM-DD (Gregorian)" for input[type="date"]
  const convertBuddhistToGregorian = (buddhistDateStr) => {
    if (!buddhistDateStr || buddhistDateStr === 'N/A') return '';
    try {
      const parts = buddhistDateStr.split('/').map(p => p.trim());
      if (parts.length !== 3) return '';
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const buddhistYear = parseInt(parts[2]);
      const gregorianYear = buddhistYear - 543;
      return `${gregorianYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    } catch (e) {
      return '';
    }
  };

  const loadProjectDetail = async () => {
    setLoading(true);
    try {
      // ดึงข้อมูลโครงการ
      const projectRes = await projectsAPI.getProjectById(projectId);
      const projectData = projectRes.data || projectRes;
      setProject(projectData);

      // ดึงข้อมูล EPC
      if (projectData.epcId) {
        try {
          const epcRes = await epcAPI.getEpcById(projectData.epcId);
          setEpcCompany(epcRes.data || epcRes);
        } catch (error) {
          console.log('EPC not found');
        }
      }

      // ดึงข้อมูล Coordinator
      if (projectData.coordinatorId) {
        try {
          const coordinatorRes = await coordinatorsAPI.getCoordinatorById(projectData.coordinatorId);
          setCoordinator(coordinatorRes.data || coordinatorRes);
        } catch (error) {
          console.log('Coordinator not found');
        }
      }

      // ดึงข้อมูล 16 ขั้นตอนจาก API
      try {
        const stepsRes = await projectsAPI.getProjectSteps(projectId);
        const apiSteps = stepsRes.data || stepsRes || [];
        
        // Format date as "1 / 9 / 2568" (with spaces)
        const formatDateWithSpaces = (dateString) => {
          if (!dateString) return 'N/A';
          const date = new Date(dateString);
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear() + 543; // Convert to Buddhist year
          return `${day} / ${month} / ${year}`;
        };

        // รวมข้อมูลจาก PROJECT_STEPS กับข้อมูลจาก API
        // เรียงลำดับ 1-16 และใช้ชื่อจาก PROJECT_STEPS
        const formattedSteps = PROJECT_STEPS.map(templateStep => {
          // หาข้อมูลจาก API ที่ตรงกับ stepNumber
          const apiStep = apiSteps.find(s => s.stepNumber === templateStep.id);
          
          return {
            id: templateStep.id, // Now ID = stepNumber (fixed in database)
            stepNumber: `${templateStep.id} / 16`,
            name: templateStep.name, // ใช้ชื่อจาก PROJECT_STEPS
            description: templateStep.description,
            note: templateStep.note,
            startDate: apiStep ? formatDateWithSpaces(apiStep.startDate) : 'N/A',
            endDate: apiStep ? formatDateWithSpaces(apiStep.endDate) : 'N/A',
            document: apiStep?.documentName || null,
            documentPath: apiStep?.documentPath || null,
            notes: apiStep?.notes || '',
            status: apiStep?.status || 'pending',
          };
        });

        setProjectSteps(formattedSteps);
      } catch (error) {
        console.error('Error loading project steps:', error);
        
        // ถ้า API error ให้ใช้ PROJECT_STEPS โดยตรง
        const fallbackSteps = PROJECT_STEPS.map(step => ({
          id: step.id,
          stepNumber: `${step.id} / 16`,
          name: step.name,
          description: step.description,
          note: step.note,
          startDate: 'N/A',
          endDate: 'N/A',
          document: null,
          documentPath: null,
          notes: '',
          status: 'pending',
        }));
        
        setProjectSteps(fallbackSteps);
      }

      toast({
        title: "✅ โหลดข้อมูลสำเร็จ",
        description: "แสดงรายละเอียดโครงการแล้ว",
      });
    } catch (error) {
      console.error('Error loading project detail:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลโครงการได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        documents: files, // Store multiple files
      }));
    }
  };

  const handleUploadEvidence = async (stepId) => {
    if (!formData.documents || formData.documents.length === 0) {
      toast({
        title: "⚠️ กรุณาเลือกไฟล์",
        description: "กรุณาเลือกไฟล์หลักฐานที่ต้องการอัพโหลด (สูงสุด 20 ไฟล์)",
        variant: "destructive",
      });
      return;
    }

    // Check if startDate is provided
    if (!formData.startDate) {
      toast({
        title: "⚠️ กรุณาระบุวันที่",
        description: "กรุณาระบุวันที่รับหลักฐาน (วันที่อัพเดท)",
        variant: "destructive",
      });
      return;
    }

    // Check file limit
    if (formData.documents.length > 20) {
      toast({
        title: "⚠️ ไฟล์เกินจำกัด",
        description: "สามารถอัพโหลดได้สูงสุด 20 ไฟล์ต่อครั้ง",
        variant: "destructive",
      });
      return;
    }

    setUploadingStep(stepId);
    try {
      // สร้าง FormData สำหรับอัพโหลดหลายไฟล์
      const uploadFormData = new FormData();
      
      // Append multiple files
      formData.documents.forEach((file) => {
        uploadFormData.append('documents', file);
      });
      
      // ใช้วันที่ปัจจุบันเป็น "วันที่รับหลักฐาน" อัตโนมัติ
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      uploadFormData.append('startDate', formData.startDate || today);
      
      if (formData.endDate) uploadFormData.append('endDate', formData.endDate);
      if (formData.notes) uploadFormData.append('notes', formData.notes);

      // เรียก API อัพโหลด
      const response = await projectsAPI.uploadStepEvidence(projectId, stepId, uploadFormData);
      
      // อัพเดทข้อมูลในหน้า
      await loadProjectDetail();

      toast({
        title: "✅ อัพโหลดสำเร็จ",
        description: `อัพโหลดหลักฐานขั้นตอนที่ ${stepId} สำเร็จแล้ว (${formData.documents.length} ไฟล์)`,
      });

      setEditingStep(null);
      setFormData({ startDate: '', endDate: '', documents: [], notes: '' });
    } catch (error) {
      console.error('Error uploading evidence:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถอัพโหลดไฟล์ได้",
        variant: "destructive",
      });
    } finally {
      setUploadingStep(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-500', text: 'เสร็จสิ้น', icon: Check },
      'in-progress': { color: 'bg-blue-500', text: 'กำลังดำเนินการ', icon: Clock },
      pending: { color: 'bg-gray-400', text: 'รอดำเนินการ', icon: AlertTriangle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon size={14} />
        {config.text}
      </Badge>
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">ไม่พบข้อมูลโครงการ</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับ
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">รายละเอียดโครงการและอัพเดทสถานะ</h1>
            <p className="text-sm text-gray-500 mt-1">ติดตามความคืบหน้าโครงการทั้ง 16 ขั้นตอน</p>
          </div>
        </div>
      </div>

      {/* Project Info Card - Compact Version */}
      <Card>
        <CardHeader className="bg-blue-600 text-white py-3">
          <CardTitle className="text-base font-semibold">ข้อมูลโครงการ</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-700 pb-1 border-b border-yellow-400">
                โรงเรียน/หน่วยงาน
              </h3>
              <p className="text-sm text-gray-900">{project.agencyName || 'โรงเรียนเดชะวุฒประเทศวิทยาคม'}</p>
              <p className="text-xs text-gray-500">{project.province || 'ระยอง'}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-700 pb-1 border-b border-yellow-400">
                EPC บริษัท
              </h3>
              <p className="text-sm text-gray-900">{epcCompany?.epcName || 'บริษัท เอ็น เอ็น พี จำกัด'}</p>
              <p className="text-xs text-gray-500">{epcCompany?.contactPhone || ''}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-700 pb-1 border-b border-yellow-400">
                ผู้ประสานงาน (Sale)
              </h3>
              <p className="text-sm text-gray-900">{coordinator?.fullName || 'นางสาวภูศิริ์ย์ ปริทานยุกต'}</p>
              <p className="text-xs text-gray-500">{coordinator?.phoneNumber || ''}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-700 pb-1 border-b border-yellow-400">
                สถานะโครงการ
              </h3>
              {getStatusBadge(project.status || 'in-progress')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Note - Compact */}
      <Card className="border-yellow-400 bg-yellow-50">
        <CardContent className="py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-yellow-900">⚠️ หมายเหตุสำคัญ:</p>
              <ul className="text-xs text-yellow-800 space-y-0.5 list-disc list-inside">
                <li>สถานะที่ <strong>5</strong> หากโรงเรียนไม่ผ่านเกณฑ์ที่ไว้ จะไม่สามารถดำเนินการต่อได้</li>
                <li>**ที่สำคัญที่สุด time stamp ต้องเทื่ที่ <strong>2</strong> ขึ้นไปจะเป็นการกระทับครั้งแรกเท่านั้น</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 16 Steps Table */}
      <Card>
        <CardHeader>
          <CardTitle>16 ขั้นตอนการดำเนินงาน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-600 hover:bg-blue-600">
                  <TableHead className="text-white font-semibold text-center w-20">ลำดับ</TableHead>
                  <TableHead className="text-white font-semibold text-center w-24">รหัส</TableHead>
                  <TableHead className="text-white font-semibold min-w-[250px]">ชื่อขั้นตอน</TableHead>
                  <TableHead className="text-white font-semibold text-center w-40">วันที่รับหลักฐาน</TableHead>
                  <TableHead className="text-white font-semibold text-center w-32">อุปกรณ์/เอกสาร</TableHead>
                  <TableHead className="text-white font-semibold text-center w-32">หมายเหตุ</TableHead>
                  <TableHead className="text-white font-semibold text-center w-40">อัพโหลดหลักฐาน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectSteps.map((step, index) => (
                  <TableRow 
                    key={step.id}
                    className={`
                      ${index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}
                      hover:bg-blue-100 transition-colors
                    `}
                  >
                    {/* ลำดับ */}
                    <TableCell className="text-center font-medium">{step.id}</TableCell>
                    
                    {/* รหัส */}
                    <TableCell className="text-center font-medium text-gray-700">{step.stepNumber}</TableCell>
                    
                    {/* ชื่อขั้นตอน */}
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{step.name}</p>
                        {step.id === 5 && (
                          <p className="text-xs text-purple-600 mt-1">⚠️ ถ้าไม่ผ่านเกณฑ์ต้องปฏิเสธงาน</p>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* วันที่รับหลักฐาน */}
                    <TableCell className="text-center">
                      {editingStep === step.id ? (
                        <div>
                          <Input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full border-blue-500"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">วันที่อัพเดท</p>
                        </div>
                      ) : (
                        <span className={step.startDate === 'N/A' ? 'text-gray-400' : 'text-gray-700'}>
                          {step.startDate}
                        </span>
                      )}
                    </TableCell>
                    
                    {/* อุปกรณ์/เอกสาร */}
                    <TableCell className="text-center">
                      {step.document ? (
                        (() => {
                          try {
                            // Try to parse as JSON array
                            const docs = JSON.parse(step.document);
                            if (Array.isArray(docs) && docs.length > 0) {
                              return (
                                <button
                                  onClick={() => {
                                    setSelectedStepDocuments({
                                      stepName: step.name,
                                      docs: docs
                                    });
                                    setShowDocumentsModal(true);
                                  }}
                                  className="flex flex-col gap-1 w-full hover:bg-blue-100 p-2 rounded transition-colors cursor-pointer"
                                >
                                  <span className="text-blue-600 font-medium text-sm">
                                    📁 {docs.length} ไฟล์
                                  </span>
                                  <div className="text-xs text-gray-600">
                                    {docs.slice(0, 2).map((doc, idx) => {
                                      const fileName = doc.split('/').pop();
                                      return (
                                        <div key={idx} className="truncate" title={fileName}>
                                          {fileName.length > 15 ? fileName.substring(0, 15) + '...' : fileName}
                                        </div>
                                      );
                                    })}
                                    {docs.length > 2 && (
                                      <div className="text-blue-500 font-medium">คลิกเพื่อดูทั้งหมด</div>
                                    )}
                                  </div>
                                </button>
                              );
                            }
                          } catch (e) {
                            // Old format - single file
                          }
                          return (
                            <a 
                              href={`http://localhost:8000${step.document}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                            >
                              📄 ดูไฟล์
                            </a>
                          );
                        })()
                      ) : (
                        <span className="text-gray-400 text-sm">...</span>
                      )}
                    </TableCell>
                    
                    {/* หมายเหตุ */}
                    <TableCell className="text-center">
                      {editingStep === step.id ? (
                        <Textarea
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="หมายเหตุ..."
                          className="w-full min-w-[150px]"
                          rows={2}
                        />
                      ) : (
                        <span className={step.notes ? 'text-gray-700' : 'text-gray-400'}>
                          {step.notes || '...'}
                        </span>
                      )}
                    </TableCell>
                    
                    {/* อัพโหลดหลักฐาน */}
                    <TableCell className="text-center">
                      {editingStep === step.id ? (
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <label className="cursor-pointer">
                            <Input
                              type="file"
                              multiple
                              onChange={(e) => handleFileChange(e)}
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.zip,.rar"
                            />
                            <div className="flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                              <Upload size={14} />
                              เลือกไฟล์ (สูงสุด 20)
                            </div>
                          </label>
                          {formData.documents && formData.documents.length > 0 && (
                            <p className="text-xs text-green-600 font-medium">
                              ✓ เลือกแล้ว {formData.documents.length} ไฟล์
                            </p>
                          )}
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleUploadEvidence(step.id)}
                              disabled={uploadingStep === step.id || !formData.documents || formData.documents.length === 0}
                              className="flex-1 text-xs px-2 py-1 h-7"
                            >
                              {uploadingStep === step.id ? 'กำลังบันทึก...' : 'บันทึก'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingStep(null);
                                setFormData({ startDate: '', endDate: '', document: null, notes: '' });
                              }}
                              className="px-2 py-1 h-7"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => {
                            // ถ้าเป็นขั้นตอนที่ 1 "ลงทะเบียนหน่วยงาน" ให้ไปหน้าฟอร์มลงทะเบียน
                            if (step.id === 1) {
                              navigate(`/admin/agency-registration/${projectId}`);
                            } else {
                              // Load existing data into form
                              // Convert Buddhist date format to Gregorian YYYY-MM-DD for input[type="date"]
                              // ถ้าไม่มี startDate ให้ใช้วันที่ปัจจุบัน
                              const currentDate = new Date().toISOString().split('T')[0];
                              
                              setFormData({
                                startDate: convertBuddhistToGregorian(step.startDate) || currentDate,
                                endDate: convertBuddhistToGregorian(step.endDate),
                                documents: [],
                                notes: step.notes || ''
                              });
                              
                              setEditingStep(step.id);
                            }
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 text-sm"
                        >
                          {step.status === 'completed' ? 'แก้ไข' : 'อัพเดท'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Documents Modal */}
      {showDocumentsModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDocumentsModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">📁 รายการเอกสาร</h3>
                <p className="text-sm text-blue-100 mt-1">{selectedStepDocuments.stepName}</p>
              </div>
              <button
                onClick={() => setShowDocumentsModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                  จำนวน <span className="font-bold text-blue-600">{selectedStepDocuments.docs.length}</span> ไฟล์
                </p>
              </div>
              
              <div className="space-y-2">
                {selectedStepDocuments.docs.map((doc, index) => {
                  const fileName = doc.split('/').pop();
                  const fileExt = fileName.split('.').pop().toLowerCase();
                  
                  // กำหนดไอคอนตามประเภทไฟล์
                  const getFileIcon = () => {
                    if (['pdf'].includes(fileExt)) return '📄';
                    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) return '🖼️';
                    if (['doc', 'docx'].includes(fileExt)) return '📝';
                    if (['xls', 'xlsx'].includes(fileExt)) return '📊';
                    if (['zip', 'rar'].includes(fileExt)) return '📦';
                    return '📎';
                  };

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl">{getFileIcon()}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate" title={fileName}>
                            {index + 1}. {fileName}
                          </p>
                          <p className="text-xs text-gray-500 uppercase">{fileExt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`http://localhost:8000${doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <FileText size={16} />
                          เปิดดู
                        </a>
                        <a
                          href={`http://localhost:8000${doc}`}
                          download
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <Download size={16} />
                          ดาวน์โหลด
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <Button
                onClick={() => setShowDocumentsModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                ปิด
              </Button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default ProjectStatusDetail;

