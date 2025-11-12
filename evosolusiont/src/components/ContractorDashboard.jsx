import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ClipboardList, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectList from '@/components/ProjectList';
import DashboardOverview from '@/components/DashboardOverview';

const ContractorDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200"> {/* Updated background gradient */}
      <nav className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">ระบบบริหารจัดการ ERP</h1>
                <p className="text-xs text-slate-500">Contractor Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                <p className="text-xs text-slate-500">ผู้รับเหมา</p>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-effect p-1 h-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              <Briefcase className="w-4 h-4 mr-2" />
              ภาพรวม
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
              <ClipboardList className="w-4 h-4 mr-2" />
              งานของฉัน
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview userRole="contractor" userId={user.username} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectList userRole="contractor" userId={user.username} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContractorDashboard;