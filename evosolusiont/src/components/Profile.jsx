import React, { useState } from 'react';
import { UserCircle, Edit, Save, X, Mail, Phone, Shield, Calendar, MapPin, Building2, Key, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'ผู้ดูแลระบบ',
    email: user?.email || 'admin@eep.com',
    phone: '08x-xxx-xxxx',
    address: 'ที่อยู่บริษัท EEP Management System',
    company: 'EEP Management System',
    role: user?.role || 'Admin',
    joinDate: '2025-01-01',
    lastLogin: '2024-01-15 14:30',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณายืนยันรหัสผ่านให้ถูกต้อง",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "✅ บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลโปรไฟล์ถูกอัปเดตเรียบร้อยแล้ว",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Super Admin':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Super Admin</Badge>;
      case 'Admin':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Admin</Badge>;
      case 'Coordinator':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Coordinator</Badge>;
      case 'Project Manager':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Project Manager</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCircle className="w-6 h-6 text-green-600" />
            </div>
            โปรไฟล์ผู้ใช้
          </h1>
          <p className="text-slate-600 mt-2">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                ยกเลิก
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                บันทึก
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              แก้ไขข้อมูล
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {profileData.name.charAt(0)}
                  </span>
                </div>
              </div>
              <CardTitle className="text-xl">{profileData.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                {getRoleBadge(profileData.role)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-600">เข้าร่วมระบบเมื่อ</p>
                <p className="font-semibold">{profileData.joinDate}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600">เข้าสู่ระบบล่าสุด</p>
                <p className="font-semibold">{profileData.lastLogin}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-blue-600" />
                ข้อมูลส่วนตัว
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์ติดต่อ</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">บริษัท</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-slate-50' : ''}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                การตั้งค่าความปลอดภัย
              </CardTitle>
              <CardDescription>เปลี่ยนรหัสผ่านและจัดการความปลอดภัย</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={profileData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={!isEditing}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={!isEditing}
                    className={!isEditing ? 'bg-slate-50' : ''}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-600" />
                ข้อมูลบัญชี
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>บทบาท</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    {getRoleBadge(profileData.role)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>สถานะบัญชี</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <Badge className="bg-green-100 text-green-700 border-green-200">ใช้งานอยู่</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>วันที่เข้าร่วม</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <span className="text-slate-800">{profileData.joinDate}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>เข้าสู่ระบบล่าสุด</Label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <span className="text-slate-800">{profileData.lastLogin}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
