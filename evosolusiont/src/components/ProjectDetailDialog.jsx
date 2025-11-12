import React, { useState } from 'react';
import { X, Save, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const ProjectDetailDialog = ({ project, userRole, onClose, onUpdate }) => {
  const [status, setStatus] = useState(project.status);
  const [note, setNote] = useState('');

  const handleUpdate = () => {
    const projects = JSON.parse(localStorage.getItem('eep_projects') || '[]');
    const projectIndex = projects.findIndex(p => p.id === project.id);

    if (projectIndex === -1) return;

    const update = {
      timestamp: new Date().toISOString(),
      status,
      note,
      updatedBy: userRole,
      approved: userRole === 'admin',
    };

    if (userRole === 'admin') {
      projects[projectIndex].status = status;
      projects[projectIndex].updates = [...(projects[projectIndex].updates || []), update];
      
      toast({
        title: "อัพเดตสำเร็จ! ✅",
        description: "สถานะโครงการถูกอัพเดตแล้ว",
      });
    } else {
      const pendingUpdates = JSON.parse(localStorage.getItem('eep_pending_updates') || '[]');
      pendingUpdates.push({
        projectId: project.id,
        projectName: project.siteName,
        ...update,
      });
      localStorage.setItem('eep_pending_updates', JSON.stringify(pendingUpdates));
      
      toast({
        title: "ส่งคำขออัพเดตแล้ว! 📝",
        description: "รอการอนุมัติจากผู้ดูแลระบบ",
      });
    }

    localStorage.setItem('eep_projects', JSON.stringify(projects));
    onUpdate();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass-effect">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{project.siteName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm text-slate-500">รหัสสถานที่</p>
              <p className="font-semibold text-slate-800">{project.siteCode}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">สถานะปัจจุบัน</p>
              <p className="font-semibold text-slate-800">
                {project.status === 'pending' && 'รอดำเนินการ'}
                {project.status === 'in_progress' && 'กำลังดำเนินการ'}
                {project.status === 'completed' && 'เสร็จสิ้น'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-slate-500">ที่อยู่</p>
              <p className="font-semibold text-slate-800">{project.address}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>อัพเดตสถานะ</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">รอดำเนินการ</SelectItem>
                  <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>หมายเหตุ</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="กรอกรายละเอียดการอัพเดต..."
                className="min-h-[120px]"
              />
            </div>
          </div>

          {project.updates && project.updates.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>ประวัติการอัพเดต</span>
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {project.updates.map((update, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-700">
                        {update.status === 'pending' && 'รอดำเนินการ'}
                        {update.status === 'in_progress' && 'กำลังดำเนินการ'}
                        {update.status === 'completed' && 'เสร็จสิ้น'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(update.timestamp).toLocaleString('th-TH')}
                      </span>
                    </div>
                    {update.note && <p className="text-slate-600">{update.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleUpdate}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {userRole === 'admin' ? 'บันทึกการอัพเดต' : 'ส่งคำขออัพเดต'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="h-12"
            >
              <X className="w-4 h-4 mr-2" />
              ปิด
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailDialog;