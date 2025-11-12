// Print template for PDF document
export const getPrintTemplate = (organization, formatDate, coordinator, editableData = {}) => {
  // Get current date in Thai format
  const today = new Date();
  const thaiDate = today.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get organization name (director/principal name)
  const organizationName = organization?.agencyName || organization?.name || 'โรงเรียน';
  const principalName = organization?.principalName && organization.principalName !== 'ไม่ระบุ' 
    ? organization.principalName 
    : `ผู้อำนวยการ${organizationName}`;
  
  // Get document number from organization
  const documentNumber = organization?.documentNumber || 'ชร. 0001/2568';
  
  // Get editable data
  const editableAddress = editableData.address || organization?.address || organization?.epcAddress || '...........................................................';
  const coordinatorName = editableData.coordinator?.name || coordinator?.fullName || 'นาย...........................................................';
  const coordinatorPhone = editableData.coordinator?.phone || coordinator?.phone || '...........................................................';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>เอกสาร PDF</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      @page {
        margin: 1cm;
        size: A4;
      }
    }
  </style>
</head>
<body>
  <div class="max-w-4xl mx-auto px-20 pt-2 pb-8 bg-white">
    <!-- Letterhead -->
    <div class="flex items-start mb-4">
      <div class="w-16 h-16 mr-3">
        <img src="/logo-eet.png" alt="Logo" class="w-full h-full object-contain" />
      </div>
      <div class="flex-1">
        <h1 class="text-xs font-bold text-blue-600">EVOLUTION ENERGY TECH CO.,LTD.</h1>
        <p class="text-[10px] text-gray-600">บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด</p>
        <p class="text-[10px] text-gray-500 mt-0.5">
          285 ซอยรามอินทรา65 แขวงท่าแร้ง เขตบางเขน กรุงเทพมหานคร 10230
        </p>
        <p class="text-[10px] text-gray-500">
          E-Mail: evolution.entech@gmail.com Tel: 092-647-9694
        </p>
      </div>
    </div>

    <!-- Document Number -->
    <p class="text-[12px] font-['Sarabun',_sans-serif] mb-8">
      เลขที่ ${documentNumber}
    </p>

    <div class="font-['Sarabun',_sans-serif] text-[12px] leading-relaxed">
      <!-- Date -->
      <p class="text-right pr-40 mb-6">
        วันที่ ${thaiDate}
      </p>
      
      <!-- Subject -->
      <div class="mb-4">
        <div class="flex">
          <span class="inline-block w-16 flex-shrink-0">เรื่อง</span>
          <div class="flex-1">
            <p>เชิญเข้าร่วมโครงการติดตั้งและบำรุงรักษาอุปกรณ์ประหยัดพลังงานในระบบการผลิตไฟฟ้าจากพลังงานแสงอาทิตย์ที่ติดตั้งบนหลังคา (Solar Rooftop)</p>
          </div>
        </div>
      </div>
      
      <!-- Recipient -->
      <p class="mb-4">
        <span class="inline-block w-16">เรียน</span>
        ${principalName}
      </p>
      
      <!-- Attachments -->
      <div class="mb-6 space-y-1">
        <p class="flex justify-between">
          <span>
            <span class="inline-block w-20">สิ่งที่ส่งมาด้วย</span>
            <span>1. มาตรการลดค่าใช้จ่ายหน่วยงานภาครัฐ Solar Rooftop On Grid : Smart Government</span>
          </span>
          <span>1 ชุด</span>
        </p>
        <p class="flex justify-between ml-20">
          <span>2. แบบเก็บข้อมูลโครงการติดตั้งและบำรุงรักษาอุปกรณ์ประหยัดพลังงาน</span>
          <span>1 ชุด</span>
        </p>
      </div>
      
      <!-- Body -->
      <div class="text-justify space-y-4 mb-6">
        <p class="indent-12">
          ด้วย บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด มีการให้บริการโครงการจัดการพลังงานไฟฟ้าจากระบบผลิตไฟฟ้าพลังงานแสงอาทิตย์ที่ติดตั้งบนหลังคา (Solar Rooftop) เพื่อช่วยหน่วยงานราชการลดค่าใช้จ่ายในการใช้พลังงานไฟฟ้า ตามที่คณะรัฐมนตรีได้อนุมัติเป็นหลักการให้หน่วยงานราชการดำเนินการตามข้อเสนอของกระทรวงพลังงาน ลดการใช้พลังงานร้อยละ 15 (รวมไฟฟ้า และน้ำมันเชื้อเพลิง) เพื่อตอบสนองมาตรการลดค่าใช้จ่ายด้านพลังงานไฟฟ้าในหน่วยงานภาครัฐ รายละเอียดตามสิ่งที่ส่งมาด้วย 1
        </p>
        
        <p class="indent-12">
          ในการนี้ บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด ขอมีส่วนร่วมเพื่อช่วยประหยัดค่าใช้จ่าย ลดปัญหามลพิษและสิ่งแวดล้อม โดยโครงการดังกล่าว บริษัทฯ จะให้บริการติดตั้งระบบผลิตไฟฟ้าด้วยพลังงานแสงอาทิตย์แบบติดตั้งบนหลังคา (Solar Rooftop) พร้อมเป็นผู้ให้บริการครอบคลุมตั้งแต่ การจัดหาเงินทุน การสำรวจ ออกแบบ ติดตั้ง บำรุงรักษาอุปกรณ์ และรื้อถอนอุปกรณ์เมื่อครบกำหนดระยะเวลาของสัญญา หน่วยงานของท่านเพียงตอบรับตกลงใช้บริการ และอนุญาตให้ บริษัทฯ ใช้พื้นที่หลังคาของสิ่งปลูกสร้างพร้อมสิ่งจำเป็นเท่านั้น โดย บริษัทฯ จะขอเก็บค่าบริการเป็นค่าไฟฟ้าตามจำนวนที่มีการใช้จริง ผ่านเครื่องวัดหน่วยไฟฟ้า ซึ่งจะมีผลการคำนวณส่วนลดในอัตราพิเศษ แสดงให้ทราบก่อนที่จะตกลงทำสัญญา โดยค่าใช้จ่ายดังกล่าวจะคิดค่าบริการต่อหน่วยในอัตรา บาท/หน่วย ซึ่งต่ำกว่าค่าไฟฟ้าปกติ โดยไม่มีค่า FT และค่าบริการอย่างอื่น ซึ่งสามารถใช้งบสาธารณูปโภคมาชำระค่าบริการจัดการพลังงานได้ตลอดอายุสัญญา (ไฟฟ้าที่ผลิตได้จาก Solar Rooftop หมายถึงการจัดการพลังงาน)
        </p>
        
        <p class="indent-12">
          ทั้งนี้ หาก${organizationName} ต้องการมีส่วนร่วมโครงการดังกล่าว บริษัทฯ ขอเรียนว่าสามารถแจ้งความประสงค์เข้าร่วมโครงการมาที่ ${editableAddress} รายละเอียดตามที่สิ่งที่ส่งมาด้วย 2 หากมีข้อสงสัยประการใด สามารถสอบถามรายละเอียดเพิ่มเติมได้ที่ ${coordinatorName} โทรศัพท์ ${coordinatorPhone} ตำแหน่ง ผู้ประสานงาน
        </p>
        
        <p class="ml-32">
          จึงเรียนมาเพื่อทราบและดำเนินการต่อไป
        </p>
      </div>
      
      <!-- Signature -->
      <div class="text-right pr-32 mt-16">
        <p class="mb-2" style="padding-right: 3rem;">ขอแสดงความนับถือ</p>
        
        <div class="mt-6 space-y-0 flex flex-col items-end">
          <div class="flex items-end gap-4 mb-1" style="margin-right: 3rem; height: 4rem; align-items: flex-end;">
            <img 
              src="/pum.png" 
              alt="ตราปั้ม" 
              class="h-32"
              style="transform: scale(1); transform-origin: center;"
            />
            <img 
              src="/sing.png" 
              alt="ลายเซ็น" 
              class="h-10"
              style="margin-left: 2rem; align-self: flex-end;"
            />
          </div>
          <p style="padding-right: 3rem;">( นายไพศาล ภาษี )</p>
          <p style="padding-right: 3rem;">กรรมการผู้จัดการ</p>
          <p style="padding-right: 0.25rem; margin-right: 0rem;">บริษัท อีโวลูชั่น เอ็นเนอร์จี เท็ค จำกัด</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
};
