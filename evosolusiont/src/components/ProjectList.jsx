import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, User, Calendar, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProjectDetailDialog from '@/components/ProjectDetailDialog';

const ProjectList = ({ userRole, userId }) => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [userRole, userId]);

  const loadProjects = () => {
    const allProjects = JSON.parse(localStorage.getItem('eep_projects') || '[]');
    
    let filteredProjects = allProjects;
    if (userRole === 'contractor') {
      filteredProjects = allProjects.filter(p => p.contractor === userId);
    } else if (userRole === 'coordinator') {
      filteredProjects = allProjects.filter(p => p.coordinator === userId);
    }

    setProjects(filteredProjects);
  };

  const filteredProjects = projects.filter(project =>
    project.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.siteCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'รอดำเนินการ', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      in_progress: { label: 'กำลังดำเนินการ', className: 'bg-blue-100 text-blue-700 border-blue-200' },
      completed: { label: 'เสร็จสิ้น', className: 'bg-green-100 text-green-700 border-green-200' },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-0">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="ค้นหาโครงการ (ชื่อสถานที่, รหัส, ที่อยู่)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-slate-200 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-effect border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {project.siteName}
                      </h3>
                      <p className="text-sm text-slate-500">{project.siteCode}</p>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                      <span className="line-clamp-2">{project.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>ผู้รับเหมา: {project.contractor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{new Date(project.createdAt).toLocaleDateString('th-TH')}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedProject(project)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    จัดการโครงการ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="glass-effect border-0">
          <CardContent className="p-12 text-center">
            <p className="text-slate-500">ไม่พบโครงการ</p>
          </CardContent>
        </Card>
      )}

      {selectedProject && (
        <ProjectDetailDialog
          project={selectedProject}
          userRole={userRole}
          onClose={() => setSelectedProject(null)}
          onUpdate={loadProjects}
        />
      )}
    </div>
  );
};

export default ProjectList;