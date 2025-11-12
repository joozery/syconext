import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, Users, BarChart3, TrendingUp, TrendingDown, 
  Calendar, Clock, Target, CheckCircle, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Activity, Zap 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell, Legend, Label } from 'recharts';


// Chart configurations
const chartConfig = {
  เชิญชวน: {
    label: "เชิญชวน",
    color: "#3b82f6",
  },
  ตอบรับ: {
    label: "ตอบรับ",
    color: "#14b8a6",
  },
  ติดตั้ง: {
    label: "ติดตั้ง",
    color: "#f97316",
  },
  completed: {
    label: "เสร็จสิ้น",
    color: "#10b981",
  },
  inProgress: {
    label: "กำลังดำเนินการ",
    color: "#3b82f6",
  },
  pending: {
    label: "รอดำเนินการ",
    color: "#f59e0b",
  },
  value: {
    label: "จำนวน",
    color: "#8b5cf6",
  },
};


const DashboardOverview = ({ userRole, userId }) => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, inProgress: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [activeChart, setActiveChart] = useState('เชิญชวน');

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('eep_projects') || '[]');
    let filteredProjects = projects;
    if (userRole === 'contractor') {
      filteredProjects = projects.filter(p => p.contractor === userId);
    } else if (userRole === 'coordinator') {
      filteredProjects = projects.filter(p => p.coordinator === userId);
    }
    
    const completed = filteredProjects.filter(p => p.status === 'completed').length;
    const pending = filteredProjects.filter(p => p.status === 'pending').length;
    const inProgress = filteredProjects.filter(p => p.status === 'in_progress').length;
    
    setStats({ 
      total: filteredProjects.length, 
      completed, 
      pending, 
      inProgress 
    });
  }, [userRole, userId]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  };

  const statCards = [
    {
      title: "หนังสือส่งออกเชิญชวน",
      value: "18",
      change: "+5.2%",
      changeType: "increase",
      icon: Newspaper,
      color: "#3b82f6",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      data: [
        { name: 'W1', value: 12 }, { name: 'W2', value: 15 }, { name: 'W3', value: 14 },
        { name: 'W4', value: 17 }, { name: 'W5', value: 18 },
      ]
    },
    {
      title: "ตอบรับเข้าร่วม",
      value: "13",
      change: "-1.8%",
      changeType: "decrease",
      icon: Users,
      color: "#14b8a6",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      data: [
        { name: 'W1', value: 15 }, { name: 'W2', value: 12 }, { name: 'W3', value: 14 },
        { name: 'W4', value: 12 }, { name: 'W5', value: 13 },
      ]
    },
    {
      title: "ดำเนินงานติดตั้ง",
      value: "9",
      change: "+12%",
      changeType: "increase",
      icon: BarChart3,
      color: "#f97316",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      data: [
        { name: 'W1', value: 5 }, { name: 'W2', value: 7 }, { name: 'W3', value: 6 },
        { name: 'W4', value: 8 }, { name: 'W5', value: 9 },
      ]
    },
    {
      title: "โครงการทั้งหมด",
      value: stats.total.toString(),
      change: "+8.5%",
      changeType: "increase",
      icon: Target,
      color: "#8b5cf6",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      data: [
        { name: 'W1', value: stats.total - 3 }, { name: 'W2', value: stats.total - 2 }, 
        { name: 'W3', value: stats.total - 1 }, { name: 'W4', value: stats.total },
        { name: 'W5', value: stats.total },
      ]
    }
  ];
  
  // สร้างข้อมูลรายวันสำหรับ 3 เดือน (90 วัน)
  const generateDailyData = () => {
    const data = [];
    const startDate = new Date('2025-04-01');
    
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // สร้างข้อมูลแบบสุ่มแต่สมจริง
      const baseValue = Math.random() * 100 + 50;
      const trend = Math.sin(i * 0.1) * 20;
      const noise = (Math.random() - 0.5) * 30;
      
      data.push({
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
        'เชิญชวน': Math.max(0, Math.round(baseValue + trend + noise)),
        'ตอบรับ': Math.max(0, Math.round(baseValue * 0.7 + trend * 0.8 + noise * 0.6)),
        'ติดตั้ง': Math.max(0, Math.round(baseValue * 0.4 + trend * 0.5 + noise * 0.4)),
      });
    }
    
    return data;
  };

  const mainChartData = generateDailyData();

  const pieData = [
    { name: 'เสร็จสิ้น', value: stats.completed, fill: '#10b981' },
    { name: 'กำลังดำเนินการ', value: stats.inProgress, fill: '#3b82f6' },
    { name: 'รอดำเนินการ', value: stats.pending, fill: '#f59e0b' },
  ];

  const weeklyData = [
    { name: 'สัปดาห์ที่ 1', completed: 12, pending: 8, inProgress: 5 },
    { name: 'สัปดาห์ที่ 2', completed: 15, pending: 6, inProgress: 7 },
    { name: 'สัปดาห์ที่ 3', completed: 18, pending: 4, inProgress: 9 },
    { name: 'สัปดาห์ที่ 4', completed: 22, pending: 3, inProgress: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 mt-1">ภาพรวมการดำเนินงาน (หน่วยงานในระบบทั้งหมด: {stats.total} แห่ง)</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            เสร็จสิ้น {stats.completed}
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Activity className="w-3 h-3 mr-1" />
            กำลังดำเนินการ {stats.inProgress}
          </Badge>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            รอดำเนินการ {stats.pending}
          </Badge>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const currentValue = parseInt(card.value);
          const maxValue = Math.max(currentValue * 2, 100); // เพิ่ม max value ให้ชัดเจนขึ้น
          const remainingValue = maxValue - currentValue;
          
          const donutData = [
            { 
              name: card.title, 
              value: currentValue, 
              fill: card.color
            },
            { 
              name: 'remaining', 
              value: remainingValue, 
              fill: '#e2e8f0' // สีเทาที่ชัดเจนขึ้น
            }
          ];
          
          return (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="flex flex-col relative overflow-hidden hover:shadow-lg transition-all duration-300 group bg-white border-slate-200">
                <CardHeader className="items-center pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${card.bgColor}`}>
                      <card.icon className={`w-4 h-4 ${card.textColor}`} />
                    </div>
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-2">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[140px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={35}
                        outerRadius={60}
                        strokeWidth={0}
                        startAngle={90}
                        endAngle={450}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-slate-800 text-2xl font-bold"
                                  >
                                    {card.value}
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
                <CardContent className="pt-0 pb-4">
                  <div className="flex items-center justify-center text-xs text-slate-500">
                    {card.changeType === 'increase' ? (
                      <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-600 mr-1" />
                    )}
                    <span className={`font-semibold ${card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                      {card.change}
                    </span>
                    <span className="ml-1 text-slate-400">จากสัปดาห์ก่อน</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">ภาพรวมรายเดือน</TabsTrigger>
          <TabsTrigger value="weekly">รายสัปดาห์</TabsTrigger>
          <TabsTrigger value="status">สถานะโครงการ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
              <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  ภาพรวมโครงการรายเดือน
                </CardTitle>
                <CardDescription>
                  แสดงความคืบหน้าของโครงการแต่ละประเภท
                </CardDescription>
              </div>
              <div className="flex">
                {["เชิญชวน", "ตอบรับ", "ติดตั้ง"].map((key) => {
                  const chart = key;
                  const total = mainChartData.reduce((acc, curr) => acc + curr[key], 0);
                  const avg = Math.round(total / mainChartData.length);
                  return (
                    <button
                      key={chart}
                      data-active={activeChart === chart}
                      className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6 hover:bg-muted/30 transition-colors"
                      onClick={() => setActiveChart(chart)}
                    >
                      <span className="text-muted-foreground text-xs">
                        {chartConfig[chart]?.label || chart}
                      </span>
                      <span className="text-lg leading-none font-bold sm:text-3xl">
                        {total.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        เฉลี่ย {avg}/วัน
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={mainChartData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                  barCategoryGap={0}
                  maxBarSize={2}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={20}
                    interval="preserveStartEnd"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('th-TH', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[200px]"
                        labelFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString('th-TH', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          });
                        }}
                      />
                    }
                  />
                  <Bar 
                    dataKey={activeChart} 
                    fill={chartConfig[activeChart]?.color || "#3b82f6"}
                    radius={[0, 0, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                ความคืบหน้ารายสัปดาห์
              </CardTitle>
              <CardDescription>
                แสดงสถานะโครงการในแต่ละสัปดาห์
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer config={chartConfig} className="h-full">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProgress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  สถานะโครงการ
                </CardTitle>
                <CardDescription>
                  แสดงสัดส่วนของโครงการแต่ละสถานะ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ChartContainer config={chartConfig} className="h-full">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  สรุปความคืบหน้า
                </CardTitle>
                <CardDescription>
                  ข้อมูลสรุปการดำเนินงาน
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">เสร็จสิ้น</p>
                      <p className="text-sm text-green-600">{stats.completed} โครงการ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-blue-800">กำลังดำเนินการ</p>
                      <p className="text-sm text-blue-600">{stats.inProgress} โครงการ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="font-semibold text-orange-800">รอดำเนินการ</p>
                      <p className="text-sm text-orange-600">{stats.pending} โครงการ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardOverview;