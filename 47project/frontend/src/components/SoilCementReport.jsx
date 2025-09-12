import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Printer, Download, Edit2, Save, X } from 'lucide-react';

const SoilCementReport = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [drillingTimer, setDrillingTimer] = useState('00:00:00');
  const [groutingTimer, setGroutingTimer] = useState('00:00:00');
  const [drillingStartTime, setDrillingStartTime] = useState(null);
  const [groutingStartTime, setGroutingStartTime] = useState(null);
  const [showDrillingTimeInput, setShowDrillingTimeInput] = useState(false);
  const [showGroutingTimeInput, setShowGroutingTimeInput] = useState(false);
  const [customDrillingTime, setCustomDrillingTime] = useState('');
  const [customGroutingTime, setCustomGroutingTime] = useState('');
  
  // State for real-time graph data
  const [graphData, setGraphData] = useState({
    pressure: Array(11).fill(0).map((_, i) => ({ x: i * 1.0, y: 100 + Math.random() * 50 })),
    rotation: Array(11).fill(0).map((_, i) => ({ x: i * 1.0, y: 50 + Math.random() * 20 })),
    speed: Array(11).fill(0).map((_, i) => ({ x: i * 1.0, y: Math.min(1, i * 0.08 + Math.random() * 0.2) })),
    flow: Array(11).fill(0).map((_, i) => ({ x: i * 1.0, y: 100 + Math.random() * 30 })),
    waterVolume: Array(11).fill(0).map((_, i) => ({ x: i * 1.0, y: i * 80 + Math.random() * 50 })),
    cementVolume: Array(11).fill(0).map((_, i) => ({ x: i * 1.0, y: i * 80 + Math.random() * 50 }))
  });
  
  const [formData, setFormData] = useState({
    projectName: "NEW FOUR-LANE HIGHWAY BETWEEN CONTACT 4 (Angthong Bypass)",
    company: "152 เอ็นจิเนียริ่ง จำกัด",
    date: "16/08/2025",
    startDrilling: "14:06:33",
    timeDrilling: "00:09:21",
    endDrilling: "14:15:54",
    rigNo: "DG-04",
    startGrouting: "14:16:10",
    timeGrouting: "00:08:10",
    endGrouting: "14:24:20",
    diameter: "0.600",
    tip: "10.031",
    length: "10.031",
    top: "0.000",
    groundLevel: "1.480",
    columnNo: "R26-C126",
    cementRatio: "250.000",
    cementWT: "701.800",
    groutVolume: "1004.000"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // อัพเดทกราฟเมื่อข้อมูลฟอร์มเปลี่ยน
    updateGraphData(field, value);
  };

  // ฟังก์ชันอัพเดทกราฟตามข้อมูลฟอร์ม
  const updateGraphData = (field, value) => {
    const numValue = parseFloat(value) || 0;
    
    setGraphData(prev => {
      const newData = { ...prev };
      
      switch (field) {
        case 'tip':
        case 'length':
        case 'top':
          // อัพเดทกราฟที่เกี่ยวข้องกับความลึก
          newData.speed = prev.speed.map((point, i) => ({
            ...point,
            y: Math.min(1, (numValue / 100) + (i * 0.08) + Math.random() * 0.1)
          }));
          newData.waterVolume = prev.waterVolume.map((point, i) => ({
            ...point,
            y: Math.min(2000, (numValue * 80) + (i * 20) + Math.random() * 30)
          }));
          newData.cementVolume = prev.cementVolume.map((point, i) => ({
            ...point,
            y: Math.min(2000, (numValue * 80) + (i * 20) + Math.random() * 30)
          }));
          break;
          
        case 'cementRatio':
          // อัพเดทกราฟ Pressure ตามอัตราส่วนซีเมนต์
          newData.pressure = prev.pressure.map((point, i) => ({
            ...point,
            y: 100 + (numValue / 10) + Math.sin(i * 0.5) * 10 + Math.random() * 20
          }));
          break;
          
        case 'groutVolume':
          // อัพเดทกราฟ Flow ตามปริมาณซีเมนต์
          newData.flow = prev.flow.map((point, i) => ({
            ...point,
            y: 100 + (numValue / 20) + Math.sin(i * 0.5) * 15 + Math.random() * 10
          }));
          break;
          
        case 'diameter':
          // อัพเดทกราฟ Rotation ตามขนาดเส้นผ่านศูนย์กลาง
          newData.rotation = prev.rotation.map((point, i) => ({
            ...point,
            y: 50 + (numValue * 10) + Math.cos(i * 0.5) * 5 + Math.random() * 10
          }));
          break;
      }
      
      return newData;
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // สามารถเพิ่ม logic สำหรับบันทึกข้อมูลได้ที่นี่
    console.log('Data saved:', formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // รีเซ็ตข้อมูลกลับเป็นค่าเดิม
    setFormData({
      projectName: "NEW FOUR-LANE HIGHWAY BETWEEN CONTACT 4 (Angthong Bypass)",
      company: "152 เอ็นจิเนียริ่ง จำกัด",
      date: "16/08/2025",
      startDrilling: "14:06:33",
      timeDrilling: "00:09:21",
      endDrilling: "14:15:54",
      rigNo: "DG-04",
      startGrouting: "14:16:10",
      timeGrouting: "00:08:10",
      endGrouting: "14:24:20",
      diameter: "0.600",
      tip: "10.031",
      length: "10.031",
      top: "0.000",
      groundLevel: "1.480",
      columnNo: "R26-C126",
      cementRatio: "250.000",
      cementWT: "701.800",
      groutVolume: "1004.000"
    });
  };

  // Timer functions for drilling
  const startDrillingTimer = () => {
    // เริ่ม timer ด้วยเวลาปัจจุบันเสมอ
    const now = new Date();
    
    // ถ้ามี custom time ที่ set ไว้แล้ว ให้ใช้เวลานั้น
    if (formData.startDrilling && !drillingStartTime) {
      // ใช้เวลาที่ set ไว้แล้ว แต่ไม่เปลี่ยน drillingStartTime
      setDrillingStartTime(now); // ใช้เวลาปัจจุบันเป็นจุดเริ่มต้น timer
      setDrillingTimer('00:00:00'); // เริ่มต้นที่ 00:00:00
    } else {
      // ใช้เวลาปัจจุบัน
      const timeString = now.toTimeString().split(' ')[0];
      setFormData(prev => ({ ...prev, startDrilling: timeString }));
      setDrillingStartTime(now);
      setDrillingTimer('00:00:00'); // รีเซ็ต timer เป็น 00:00:00
    }
    setShowDrillingTimeInput(false); // ซ่อน input
  };

  const setDrillingCustomTime = () => {
    if (customDrillingTime) {
      setFormData(prev => ({ ...prev, startDrilling: customDrillingTime }));
      setShowDrillingTimeInput(false);
      setCustomDrillingTime('');
    }
  };

  const startDrillingTimerWithCustomTime = () => {
    if (formData.startDrilling) {
      // แปลงเวลาที่ set ไว้เป็น Date object
      const [hours, minutes, seconds] = formData.startDrilling.split(':').map(Number);
      const now = new Date();
      const customTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
      
      setDrillingStartTime(customTime);
      setDrillingTimer('00:00:00'); // เริ่มต้นที่ 00:00:00
    }
  };

  const stopDrillingTimer = () => {
    if (drillingStartTime) {
      // ใช้เวลาที่ timer เดินอยู่ (เวลาปัจจุบันที่แสดงใน timer)
      const currentTimerValue = drillingTimer; // เช่น "01:58:48"
      const [timerHours, timerMinutes, timerSeconds] = currentTimerValue.split(':').map(Number);
      
      // แปลง Start time ที่ set ไว้เป็น milliseconds
      const [startHours, startMinutes, startSeconds] = formData.startDrilling.split(':').map(Number);
      const startTime = new Date();
      startTime.setHours(startHours, startMinutes, startSeconds, 0);
      
      // คำนวณ End time = Start time ที่ set ไว้ + Timer duration
      const timerDurationMs = (timerHours * 3600 + timerMinutes * 60 + timerSeconds) * 1000;
      const endTime = new Date(startTime.getTime() + timerDurationMs);
      const endTimeString = endTime.toTimeString().split(' ')[0];
      
      setFormData(prev => ({ 
        ...prev, 
        timeDrilling: currentTimerValue,
        endDrilling: endTimeString 
      }));
      setDrillingStartTime(null);
      setDrillingTimer(currentTimerValue); // เก็บค่า timer สุดท้าย
    }
  };

  // Timer functions for grouting
  const startGroutingTimer = () => {
    // เริ่ม timer ด้วยเวลาปัจจุบันเสมอ
    const now = new Date();
    
    // ถ้ามี custom time ที่ set ไว้แล้ว ให้ใช้เวลานั้น
    if (formData.startGrouting && !groutingStartTime) {
      // ใช้เวลาที่ set ไว้แล้ว แต่ไม่เปลี่ยน groutingStartTime
      setGroutingStartTime(now); // ใช้เวลาปัจจุบันเป็นจุดเริ่มต้น timer
      setGroutingTimer('00:00:00'); // เริ่มต้นที่ 00:00:00
    } else {
      // ใช้เวลาปัจจุบัน
      const timeString = now.toTimeString().split(' ')[0];
      setFormData(prev => ({ ...prev, startGrouting: timeString }));
      setGroutingStartTime(now);
      setGroutingTimer('00:00:00'); // รีเซ็ต timer เป็น 00:00:00
    }
    setShowGroutingTimeInput(false); // ซ่อน input
  };

  const setGroutingCustomTime = () => {
    if (customGroutingTime) {
      setFormData(prev => ({ ...prev, startGrouting: customGroutingTime }));
      setShowGroutingTimeInput(false);
      setCustomGroutingTime('');
    }
  };

  const startGroutingTimerWithCustomTime = () => {
    if (formData.startGrouting) {
      // แปลงเวลาที่ set ไว้เป็น Date object
      const [hours, minutes, seconds] = formData.startGrouting.split(':').map(Number);
      const now = new Date();
      const customTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
      
      setGroutingStartTime(customTime);
      setGroutingTimer('00:00:00'); // เริ่มต้นที่ 00:00:00
    }
  };

  const stopGroutingTimer = () => {
    if (groutingStartTime) {
      // ใช้เวลาที่ timer เดินอยู่ (เวลาปัจจุบันที่แสดงใน timer)
      const currentTimerValue = groutingTimer; // เช่น "00:25:00"
      const [timerHours, timerMinutes, timerSeconds] = currentTimerValue.split(':').map(Number);
      
      // แปลง Start time ที่ set ไว้เป็น milliseconds
      const [startHours, startMinutes, startSeconds] = formData.startGrouting.split(':').map(Number);
      const startTime = new Date();
      startTime.setHours(startHours, startMinutes, startSeconds, 0);
      
      // คำนวณ End time = Start time ที่ set ไว้ + Timer duration
      const timerDurationMs = (timerHours * 3600 + timerMinutes * 60 + timerSeconds) * 1000;
      const endTime = new Date(startTime.getTime() + timerDurationMs);
      const endTimeString = endTime.toTimeString().split(' ')[0];
      
      setFormData(prev => ({ 
        ...prev, 
        timeGrouting: currentTimerValue,
        endGrouting: endTimeString 
      }));
      setGroutingStartTime(null);
      setGroutingTimer(currentTimerValue); // เก็บค่า timer สุดท้าย
    }
  };

  // Cleanup timers on component unmount
  React.useEffect(() => {
    return () => {
      // ไม่ต้อง clearInterval เพราะเราไม่ได้เก็บ timer ID แล้ว
    };
  }, []);

  // Continuous timer updates and graph updates when timers are running
  useEffect(() => {
    let interval;
    if (drillingStartTime || groutingStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        
        // อัพเดท Drilling Timer
        if (drillingStartTime) {
          const elapsed = (now - drillingStartTime) / 1000;
          // ใช้ค่าสัมบูรณ์เพื่อป้องกันค่าติดลบ
          const absoluteElapsed = Math.abs(elapsed);
          const hours = Math.floor(absoluteElapsed / 3600);
          const minutes = Math.floor((absoluteElapsed % 3600) / 60);
          const seconds = Math.floor(absoluteElapsed % 60);
          const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          setDrillingTimer(timeString); // อัพเดท timer state
          setFormData(prev => ({ ...prev, timeDrilling: timeString }));
        }
        
        // อัพเดท Grouting Timer
        if (groutingStartTime) {
          const elapsed = (now - groutingStartTime) / 1000;
          // ใช้ค่าสัมบูรณ์เพื่อป้องกันค่าติดลบ
          const absoluteElapsed = Math.abs(elapsed);
          const hours = Math.floor(absoluteElapsed / 3600);
          const minutes = Math.floor((absoluteElapsed % 3600) / 60);
          const seconds = Math.floor(absoluteElapsed % 60);
          const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          setGroutingTimer(timeString); // อัพเดท timer state
          setFormData(prev => ({ ...prev, timeGrouting: timeString }));
        }
        
        // คำนวณข้อมูลกราฟจากข้อมูลฟอร์มจริง
        const depth = parseFloat(formData.tip) || 10.0;
        const cementRatio = parseFloat(formData.cementRatio) || 250.0;
        const groutVolume = parseFloat(formData.groutVolume) || 1004.0;
        const diameter = parseFloat(formData.diameter) || 0.6;
        
        // ใช้เวลาปัจจุบันสำหรับการคำนวณกราฟ
        const currentTime = Date.now();
        const drillingElapsed = drillingStartTime ? (currentTime - drillingStartTime) / 1000 : 0;
        const groutingElapsed = groutingStartTime ? (currentTime - groutingStartTime) / 1000 : 0;
        const graphElapsed = Math.max(drillingElapsed, groutingElapsed);
        
        setGraphData(prev => ({
          ...prev,
          pressure: prev.pressure.map((point, i) => ({
            ...point,
            y: 100 + (cementRatio / 10) + Math.sin(graphElapsed + i) * 10 + Math.random() * 20
          })),
          rotation: prev.rotation.map((point, i) => ({
            ...point,
            y: 50 + (depth / 20) + Math.cos(graphElapsed + i) * 5 + Math.random() * 10
          })),
          speed: prev.speed.map((point, i) => ({
            ...point,
            y: Math.min(1, (depth / 100) + Math.sin(graphElapsed + i) * 0.1 + Math.random() * 0.1)
          })),
          flow: prev.flow.map((point, i) => ({
            ...point,
            y: 100 + (groutVolume / 20) + Math.sin(graphElapsed + i) * 15 + Math.random() * 10
          })),
          waterVolume: prev.waterVolume.map((point, i) => ({
            ...point,
            y: Math.min(2000, (depth * 80) + Math.sin(graphElapsed + i) * 40 + Math.random() * 30)
          })),
          cementVolume: prev.cementVolume.map((point, i) => ({
            ...point,
            y: Math.min(2000, (depth * 80) + Math.cos(graphElapsed + i) * 40 + Math.random() * 30)
          }))
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [drillingStartTime, groutingStartTime, formData.tip, formData.cementRatio, formData.groutVolume]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // สร้าง PDF หรือ download functionality
    console.log('Download functionality');
  };

  return (
    <div className="min-h-screen p-6 print:p-0 print:bg-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:border-b-2 border border-gray-200/50 print:hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">REPORT SOIL CEMENT COLUMN</h1>
                <p className="text-lg text-gray-600 mt-1">รายงานการเจาะและฉีดซีเมนต์</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-lg">
              <div className="text-lg font-semibold">บริษัท 152 เอ็นจิเนียริ่ง จำกัด</div>
              <div className="text-sm opacity-90">152 ENGINEERING CO.,LTD</div>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>แก้ไข</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึก</span>
                  </Button>
                  <Button
                    onClick={handleCancel}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>ยกเลิก</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Information Table */}
      <div className="rounded-2xl mb-8 print:shadow-none print:border-2 print:mb-4 border border-gray-200/50">

        {/* Table Layout - 8 Columns */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm print:text-xs">
            <tbody>
              {/* Row 1: Project Name (spans all 8 columns) */}
              <tr>
                <td className="border border-gray-300 font-semibold text-gray-700 w-1/8">
                  Project Name
                </td>
                <td className="border border-gray-300" colSpan="7">
                  {isEditing ? (
                    <Input
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="ชื่อโครงการ"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.projectName}</span>
                  )}
                </td>
              </tr>

              {/* Row 2: Company (spans all 8 columns) */}
              <tr>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Company
                </td>
                <td className="border border-gray-300" colSpan="7">
                  {isEditing ? (
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="ชื่อบริษัท"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.company}</span>
                  )}
                </td>
              </tr>

              {/* Row 3: Date, Rig No., Column No., Cement Ratio (4 pairs = 8 columns) */}
              <tr>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Date
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.date}</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Rig No.
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      value={formData.rigNo}
                      onChange={(e) => handleInputChange('rigNo', e.target.value)}
                      className="w-full border-0 focus:ring-2"
                      placeholder="DG-04"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.rigNo}</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Column No.
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      value={formData.columnNo}
                      onChange={(e) => handleInputChange('columnNo', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="R26-C126"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.columnNo}</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Cement Ratio
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.cementRatio}
                      onChange={(e) => handleInputChange('cementRatio', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="250.000"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.cementRatio} kg/cu.m.</span>
                  )}
                </td>
              </tr>

              {/* Row 4: Start Drilling, Start Grouting, Tip, Cement WT (4 pairs = 8 columns) */}
              <tr>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Start Drilling
                </td>
                <td className="border border-gray-300">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800">{formData.startDrilling}</span>
                      {!drillingStartTime ? (
                        <Button
                          onClick={startDrillingTimer}
                          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white print:hidden"
                          disabled={isEditing}
                        >
                          Start
                        </Button>
                      ) : (
                        <Button
                          onClick={stopDrillingTimer}
                          className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white print:hidden"
                          disabled={isEditing}
                        >
                          Stop
                        </Button>
                      )}
                      <Button
                        onClick={() => setShowDrillingTimeInput(!showDrillingTimeInput)}
                        className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white print:hidden"
                        disabled={isEditing}
                      >
                        Custom
                      </Button>
                    </div>
                    
                    {showDrillingTimeInput && (
                      <div className="flex items-center space-x-2 print:hidden">
                        <Input
                          type="time"
                          value={customDrillingTime}
                          onChange={(e) => setCustomDrillingTime(e.target.value)}
                          className="w-24 h-8 text-xs"
                          step="1"
                        />
                        <Button 
                          onClick={setDrillingCustomTime}
                          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Set
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowDrillingTimeInput(false);
                            setCustomDrillingTime('');
                          }}
                          variant="outline"
                          className="px-2 py-1 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Start Grouting
                </td>
                <td className="border border-gray-300">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800">{formData.startGrouting}</span>
                      {!groutingStartTime ? (
                        <Button
                          onClick={startGroutingTimer}
                          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white print:hidden"
                          disabled={isEditing}
                        >
                          Start
                        </Button>
                      ) : (
                        <Button
                          onClick={stopGroutingTimer}
                          className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white print:hidden"
                          disabled={isEditing}
                        >
                          Stop
                        </Button>
                      )}
                      <Button
                        onClick={() => setShowGroutingTimeInput(!showGroutingTimeInput)}
                        className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white print:hidden"
                        disabled={isEditing}
                      >
                        Custom
                      </Button>
                    </div>
                    
                    {showGroutingTimeInput && (
                      <div className="flex items-center space-x-2 print:hidden">
                        <Input
                          type="time"
                          value={customGroutingTime}
                          onChange={(e) => setCustomGroutingTime(e.target.value)}
                          className="w-24 h-8 text-xs"
                          step="1"
                        />
                        <Button 
                          onClick={setGroutingCustomTime}
                          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Set
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowGroutingTimeInput(false);
                            setCustomGroutingTime('');
                          }}
                          variant="outline"
                          className="px-2 py-1 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Tip
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.tip}
                      onChange={(e) => handleInputChange('tip', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="10.031"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.tip} m.</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Cement WT.
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.cementWT}
                      onChange={(e) => handleInputChange('cementWT', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="701.800"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.cementWT} kg.</span>
                  )}
                </td>
              </tr>

              {/* Row 5: Time Drilling, Time Grouting, Length (3 pairs = 6 columns, 2 empty) */}
              <tr>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Time Drilling
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="time"
                      value={formData.timeDrilling}
                      onChange={(e) => handleInputChange('timeDrilling', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.timeDrilling}</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Time Grouting
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="time"
                      value={formData.timeGrouting}
                      onChange={(e) => handleInputChange('timeGrouting', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.timeGrouting}</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Length
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.length}
                      onChange={(e) => handleInputChange('length', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="10.031"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.length} m.</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  &nbsp;
                </td>
                <td className="border border-gray-300">
                  &nbsp;
                </td>
              </tr>

              {/* Row 6: End Drilling, End Grouting, Top (3 pairs = 6 columns, 2 empty) */}
              <tr>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  End Drilling
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="time"
                      value={formData.endDrilling}
                      onChange={(e) => handleInputChange('endDrilling', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.endDrilling}</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  End Grouting
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="time"
                      value={formData.endGrouting}
                      onChange={(e) => handleInputChange('endGrouting', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.endGrouting}</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Top
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={formData.top}
                      onChange={(e) => handleInputChange('top', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="0.000"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.top} m.</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  &nbsp;
                </td>
                <td className="border border-gray-300">
                  &nbsp;
                </td>
              </tr>

              {/* Row 7: Diameter, Ground Level, Grout Volume (3 pairs = 6 columns, 2 empty) */}
              <tr>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Diameter
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.diameter}
                      onChange={(e) => handleInputChange('diameter', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="0.600"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.diameter} m.</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Ground Level
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.groundLevel}
                      onChange={(e) => handleInputChange('groundLevel', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="1.480"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.groundLevel} m.</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  Grout Volume
                </td>
                <td className="border border-gray-300">
                  {isEditing ? (
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.groutVolume}
                      onChange={(e) => handleInputChange('groutVolume', e.target.value)}
                      className="w-full border-0 focus:ring-2 focus:ring-blue-500"
                      placeholder="1004.000"
                    />
                  ) : (
                    <span className="text-gray-800">{formData.groutVolume} L</span>
                  )}
                </td>
                <td className="border border-gray-300 font-semibold text-gray-700">
                  &nbsp;
                </td>
                <td className="border border-gray-300">
                  &nbsp;
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="rounded-2xl print:shadow-none print:border-2 print:rounded-lg border border-gray-200/50">
        
        <div className="space-y-8 print:space-y-4">
          {/* Row 1: Pressure */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 text-center print:text-base print:mb-2 print:text-orange-900">Pressure (Bar.) ↓</h3>
              <div className="h-48 relative print:h-24 pb-1">
                <img 
                  src="/src/assets/pressuredown.jpg" 
                  alt="Pressure Chart" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 text-center print:text-base print:mb-2 print:text-orange-900">Pressure (Bar.) ↑</h3>
              <div className="bg-white rounded-lg p-4 print:shadow-none print:border print:p-2">
                <div className="h-40 relative print:h-20">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 print:text-xs">
                    <span>400</span>
                    <span>200</span>
                    <span>0</span>
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-600 print:text-xs">
                    <span>10.0</span>
                    <span>7.5</span>
                    <span>5.0</span>
                    <span>2.5</span>
                    <span>0.0</span>
                  </div>
                  {/* Area Chart */}
                  <svg className="w-full h-full print:w-full print:h-full" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="pressureGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 160 ${graphData.pressure.map((point, i) => 
                        `L ${point.x * 40} ${160 - (point.y / 400) * 160}`
                      ).join(' ')} L 400 160 Z`}
                      fill="url(#pressureGradient2)"
                      stroke="#f97316"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Rotation */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center print:text-base print:mb-2 print:text-blue-900">Rotation (RPM) ↓</h3>
              <div className="bg-white rounded-lg p-4 print:shadow-none print:border print:p-2">
                <div className="h-40 relative print:h-20">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 print:text-xs">
                    <span>200</span>
                    <span>100</span>
                    <span>0</span>
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-600 print:text-xs">
                    <span>0.0</span>
                    <span>2.5</span>
                    <span>5.0</span>
                    <span>7.5</span>
                    <span>10.0</span>
                  </div>
                  {/* Area Chart */}
                  <svg className="w-full h-full print:w-full print:h-full" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="rotationGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 160 ${graphData.rotation.map((point, i) => 
                        `L ${point.x * 40} ${160 - (point.y / 200) * 160}`
                      ).join(' ')} L 400 160 Z`}
                      fill="url(#rotationGradient1)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center print:text-base print:mb-2 print:text-blue-900">Rotation (RPM) ↑</h3>
              <div className="bg-white rounded-lg p-4 print:shadow-none print:border print:p-2">
                <div className="h-40 relative print:h-20">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 print:text-xs">
                    <span>200</span>
                    <span>100</span>
                    <span>0</span>
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-600 print:text-xs">
                    <span>10.0</span>
                    <span>7.5</span>
                    <span>5.0</span>
                    <span>2.5</span>
                    <span>0.0</span>
                  </div>
                  {/* Area Chart */}
                  <svg className="w-full h-full print:w-full print:h-full" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="rotationGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 160 ${graphData.rotation.map((point, i) => 
                        `L ${point.x * 40} ${160 - (point.y / 200) * 160}`
                      ).join(' ')} L 400 160 Z`}
                      fill="url(#rotationGradient2)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Speed */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4 text-center print:text-base print:mb-2 print:text-green-900">Speed (M/Min) ↓</h3>
              <div className="bg-white rounded-lg p-4 print:shadow-none print:border print:p-2">
                <div className="h-40 relative print:h-20">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 print:text-xs">
                    <span>10</span>
                    <span>5</span>
                    <span>0</span>
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-600 print:text-xs">
                    <span>0.0</span>
                    <span>2.5</span>
                    <span>5.0</span>
                    <span>7.5</span>
                    <span>10.0</span>
                  </div>
                  {/* Area Chart */}
                  <svg className="w-full h-full print:w-full print:h-full" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="speedGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 160 ${graphData.speed.map((point, i) => 
                        `L ${point.x * 40} ${160 - (point.y / 10) * 160}`
                      ).join(' ')} L 400 160 Z`}
                      fill="url(#speedGradient1)"
                      stroke="#22c55e"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4 text-center print:text-base print:mb-2 print:text-green-900">Speed (M/Min) ↑</h3>
              <div className="h-48 relative print:h-24 pb-1">
                <img 
                  src="/src/assets/speedup.jpg" 
                  alt="Speed Chart" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Flow */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 text-center print:text-base print:mb-2 print:text-yellow-900">Flow (L/Min) ↓</h3>
              <div className="h-48 relative print:h-24 pb-1">
                <img 
                  src="/src/assets/flowdown.jpg" 
                  alt="Flow Chart" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4 text-center print:text-base print:mb-2 print:text-yellow-900">Flow (L/Min) ↑</h3>
              <div className="bg-white rounded-lg p-4 print:shadow-none print:border print:p-2">
                <div className="h-40 relative print:h-20">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 print:text-xs">
                    <span>400</span>
                    <span>200</span>
                    <span>0</span>
                  </div>
                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-600 print:text-xs">
                    <span>10.0</span>
                    <span>7.5</span>
                    <span>5.0</span>
                    <span>2.5</span>
                    <span>0.0</span>
                  </div>
                  {/* Area Chart */}
                  <svg className="w-full h-full print:w-full print:h-full" viewBox="0 0 400 160">
                    <defs>
                      <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#eab308" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#eab308" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 160 ${graphData.flow.map((point, i) => 
                        `L ${point.x * 40} ${160 - (point.y / 400) * 160}`
                      ).join(' ')} L 400 160 Z`}
                      fill="url(#flowGradient2)"
                      stroke="#eab308"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Volume */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 text-center print:text-base print:mb-2 print:text-purple-900">Water Volume (Liter) ↓</h3>
              <div className="h-48 relative print:h-24 pb-1">
                <img 
                  src="/src/assets/waterdown.jpg" 
                  alt="Water Volume Chart" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 print:bg-white print:border-2 print:p-3 print:rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-4 text-center print:text-base print:mb-2 print:text-red-900">Cement Volume (Liter) ↑</h3>
              <div className="h-48 relative print:h-24 pb-1">
                <img 
                  src="/src/assets/cementup.jpg" 
                  alt="Cement Volume Chart" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12 print:hidden">
        <Button 
          onClick={handlePrint} 
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Printer className="w-5 h-5" />
          <span className="text-lg">พิมพ์รายงาน</span>
        </Button>
        <Button 
          onClick={handleDownload} 
          variant="outline" 
          className="flex items-center space-x-3 px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Download className="w-5 h-5" />
          <span className="text-lg">ดาวน์โหลด PDF</span>
        </Button>
      </div>

      {/* Back Button */}
      <div className="text-center mt-8 print:hidden">
        <Button 
          onClick={() => window.history.back()} 
          variant="ghost" 
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          ← กลับไปหน้าหลัก
        </Button>
      </div>
    </div>
  );
};

export default SoilCementReport;
