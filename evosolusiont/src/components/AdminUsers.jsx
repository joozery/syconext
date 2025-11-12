import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit, Trash2, Shield, UserCheck, UserX, Mail, Phone, Calendar, X, Save, Eye, EyeOff, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { usersAPI } from '@/services/api';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    usersByRole: {}
  });
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  });
  const [editUser, setEditUser] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  });
  const [showEditPassword, setShowEditPassword] = useState(false);

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const [usersResponse, statsResponse] = await Promise.all([
          usersAPI.getUsers(),
          usersAPI.getUserStats()
        ]);
        
        if (usersResponse.success) {
          setUsers(usersResponse.data.users || []);
        }
        
        if (statsResponse.success) {
          setUserStats({
            totalUsers: statsResponse.data.totalUsers || 0,
            activeUsers: statsResponse.data.activeUsers || 0,
            inactiveUsers: statsResponse.data.inactiveUsers || 0,
            usersByRole: statsResponse.data.usersByRole || {}
          });
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "❌ เกิดข้อผิดพลาด",
          description: "ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Password validation functions
  const validatePassword = (password) => {
    const requirements = {
      hasNumber: /\d/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasLength: password.length >= 6 && password.length <= 50,
      hasSymbol: /[-().&@?'#,/;+]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      isLatinOnly: /^[a-zA-Z0-9\-().&@?'#,/;+]+$/.test(password)
    };
    return requirements;
  };

  const passwordRequirements = validatePassword(newUser.password);
  const editPasswordRequirements = validatePassword(editUser.password);

  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-700 border-green-200">ใช้งาน</Badge> :
      <Badge className="bg-red-100 text-red-700 border-red-200">ไม่ใช้งาน</Badge>;
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Admin</Badge>;
      case 'user':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">User</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleInputChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveUser = async () => {
    // Validation
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
      toast({
        title: "❌ ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกชื่อ, นามสกุล, อีเมล และรหัสผ่าน",
        variant: "destructive"
      });
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "❌ รหัสผ่านไม่ตรงกัน",
        description: "กรุณายืนยันรหัสผ่านให้ถูกต้อง",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const userData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        password: newUser.password
      };

      const response = await usersAPI.createUser(userData);
      
      if (response.success) {
        // Refresh users list
        const usersResponse = await usersAPI.getUsers();
        if (usersResponse.success) {
          setUsers(usersResponse.data.users || []);
        }
        
        toast({
          title: "✅ เพิ่มผู้ใช้สำเร็จ",
          description: `เพิ่มผู้ใช้ ${newUser.firstName} ${newUser.lastName} เรียบร้อยแล้ว`,
        });

        // Reset form
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'user',
          password: '',
          confirmPassword: ''
        });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถเพิ่มผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAdd = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user',
      password: '',
      confirmPassword: ''
    });
    setShowAddModal(false);
  };

  const handleCancelEdit = () => {
    setEditUser({
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user',
      password: '',
      confirmPassword: ''
    });
    setShowEditPassword(false);
    setShowEditModal(false);
  };

  const handleSaveEdit = async () => {
    // Validation
    if (!editUser.firstName || !editUser.lastName || !editUser.email || !editUser.phone || !editUser.role) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive"
      });
      return;
    }

    // Password validation if changing password
    if (showEditPassword && editUser.password) {
      if (editUser.password !== editUser.confirmPassword) {
        toast({
          title: "❌ รหัสผ่านไม่ตรงกัน",
          description: "กรุณายืนยันรหัสผ่านให้ถูกต้อง",
          variant: "destructive"
        });
        return;
      }

      const editPasswordRequirements = validatePassword(editUser.password);
      if (!editPasswordRequirements.hasLength || !editPasswordRequirements.hasNumber || 
          !editPasswordRequirements.hasLowercase || !editPasswordRequirements.hasUppercase) {
        toast({
          title: "❌ รหัสผ่านไม่ถูกต้อง",
          description: "รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่, ตัวอักษรพิมพ์เล็ก, ตัวเลข และความยาว 6-50 ตัวอักษร",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const updateData = {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        phone: editUser.phone,
        role: editUser.role
      };

      // Add password if changing
      if (showEditPassword && editUser.password) {
        updateData.password = editUser.password;
      }

      const response = await usersAPI.updateUser(editUser.id, updateData);

      if (response.success) {
        toast({
          title: "✅ แก้ไขผู้ใช้สำเร็จ",
          description: `แก้ไขข้อมูล ${editUser.firstName} ${editUser.lastName} เรียบร้อยแล้ว`,
        });
        
        // Re-fetch users and stats to update the list
        const [usersResponse, statsResponse] = await Promise.all([
          usersAPI.getUsers(),
          usersAPI.getUserStats()
        ]);
        
        if (usersResponse.success) {
          setUsers(usersResponse.data.users || []);
        }
        
        if (statsResponse.success) {
          setUserStats({
            totalUsers: statsResponse.data.totalUsers || 0,
            activeUsers: statsResponse.data.activeUsers || 0,
            inactiveUsers: statsResponse.data.inactiveUsers || 0,
            usersByRole: statsResponse.data.usersByRole || {}
          });
        }
        
        setEditUser({
          id: null,
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'user',
          password: '',
          confirmPassword: ''
        });
        setShowEditPassword(false);
        setShowEditModal(false);
      } else {
        throw new Error(response.message || "ไม่สามารถแก้ไขผู้ใช้ได้");
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถแก้ไขผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (user) => {
    try {
      // Set edit user data
      setEditUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        password: '',
        confirmPassword: ''
      });
      setShowEditPassword(false);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error editing user:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      // Confirm deletion
      if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ ${user.firstName} ${user.lastName}?`)) {
        return;
      }

      const response = await usersAPI.deleteUser(user.id);
      
      if (response.success) {
        // Refresh users list and stats
        const [usersResponse, statsResponse] = await Promise.all([
          usersAPI.getUsers(),
          usersAPI.getUserStats()
        ]);
        
        if (usersResponse.success) {
          setUsers(usersResponse.data.users || []);
        }
        
        if (statsResponse.success) {
          setUserStats({
            totalUsers: statsResponse.data.totalUsers || 0,
            activeUsers: statsResponse.data.activeUsers || 0,
            inactiveUsers: statsResponse.data.inactiveUsers || 0,
            usersByRole: statsResponse.data.usersByRole || {}
          });
        }
        
        toast({
          title: "✅ ลบผู้ใช้สำเร็จ",
          description: `ลบผู้ใช้ ${user.firstName} ${user.lastName} เรียบร้อยแล้ว`,
        });
      } else {
        throw new Error(response.message || "ไม่สามารถลบผู้ใช้ได้");
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถลบผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.isActive ? 'inactive' : 'active';
      const response = await usersAPI.updateUserStatus(user.id, newStatus);
      
      if (response.success) {
        // Refresh users list and stats
        const [usersResponse, statsResponse] = await Promise.all([
          usersAPI.getUsers(),
          usersAPI.getUserStats()
        ]);
        
        if (usersResponse.success) {
          setUsers(usersResponse.data.users || []);
        }
        
        if (statsResponse.success) {
          setUserStats({
            totalUsers: statsResponse.data.totalUsers || 0,
            activeUsers: statsResponse.data.activeUsers || 0,
            inactiveUsers: statsResponse.data.inactiveUsers || 0,
            usersByRole: statsResponse.data.usersByRole || {}
          });
        }
        
        toast({
          title: "✅ เปลี่ยนสถานะสำเร็จ",
          description: `เปลี่ยนสถานะ ${user.firstName} ${user.lastName} เป็น ${newStatus === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'} เรียบร้อยแล้ว`,
        });
      } else {
        throw new Error(response.message || "ไม่สามารถเปลี่ยนสถานะได้");
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "❌ เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">กำลังโหลดข้อมูลผู้ใช้...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">จัดการผู้ใช้</h1>
          <p className="text-slate-600 mt-1">จัดการข้อมูลผู้ใช้ในระบบ</p>
        </div>
        <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มผู้ใช้
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">ผู้ใช้ทั้งหมด</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{userStats.totalUsers}</div>
            <p className="text-xs text-slate-500">คน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">ผู้ใช้ที่ใช้งาน</CardTitle>
            <UserCheck className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{userStats.activeUsers}</div>
            <p className="text-xs text-slate-500">คน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">ผู้ใช้ที่ไม่ได้ใช้งาน</CardTitle>
            <UserX className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{userStats.inactiveUsers}</div>
            <p className="text-xs text-slate-500">คน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Admin</CardTitle>
            <Shield className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {userStats.usersByRole?.admin || 0}
            </div>
            <p className="text-xs text-slate-500">คน</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-600" />
            ค้นหาผู้ใช้
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="ค้นหาด้วยชื่อ, อีเมล, หรือบทบาท..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อผู้ใช้ ({filteredUsers.length})</CardTitle>
          <CardDescription>รายการผู้ใช้ทั้งหมดในระบบ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.isActive)}
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(user)}
                      className="text-xs"
                    >
                      {user.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      className="text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      แก้ไข
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      ลบ
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">เพิ่มผู้ใช้ใหม่</h2>
                <Button variant="ghost" size="sm" onClick={handleCancelAdd}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">ชื่อ</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="กรอกชื่อ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">นามสกุล</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="กรอกนามสกุล"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="กรอกอีเมล"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="กรอกเบอร์โทรศัพท์"
                  />
                </div>

                <div>
                  <Label htmlFor="role">บทบาท</Label>
                  <Select value={newUser.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกบทบาท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="กรอกรหัสผ่าน"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="ยืนยันรหัสผ่าน"
                  />
                </div>

                {/* Password Requirements */}
                {newUser.password && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">ข้อกำหนดรหัสผ่าน:</Label>
                    <div className="space-y-1 text-sm">
                      <div className={`flex items-center space-x-2 ${passwordRequirements.hasLength ? 'text-green-600' : 'text-red-600'}`}>
                        <Check className="w-4 h-4" />
                        <span>ความยาว 6-50 ตัวอักษร</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        <Check className="w-4 h-4" />
                        <span>มีตัวเลข</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                        <Check className="w-4 h-4" />
                        <span>มีตัวอักษรพิมพ์เล็ก</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                        <Check className="w-4 h-4" />
                        <span>มีตัวอักษรพิมพ์ใหญ่</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={handleCancelAdd}>
                  ยกเลิก
                </Button>
                <Button 
                  onClick={handleSaveUser} 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      บันทึก
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">แก้ไขข้อมูลผู้ใช้</h2>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFirstName">ชื่อ</Label>
                    <Input
                      id="editFirstName"
                      value={editUser.firstName}
                      onChange={(e) => setEditUser({...editUser, firstName: e.target.value})}
                      placeholder="กรอกชื่อ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLastName">นามสกุล</Label>
                    <Input
                      id="editLastName"
                      value={editUser.lastName}
                      onChange={(e) => setEditUser({...editUser, lastName: e.target.value})}
                      placeholder="กรอกนามสกุล"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editEmail">อีเมล</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                    placeholder="กรอกอีเมล"
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
                </div>

                <div>
                  <Label htmlFor="editPhone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="editPhone"
                    value={editUser.phone}
                    onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                    placeholder="กรอกเบอร์โทรศัพท์"
                  />
                </div>

                <div>
                  <Label htmlFor="editRole">บทบาท</Label>
                  <Select value={editUser.role} onValueChange={(value) => setEditUser({...editUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกบทบาท" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password Change Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">เปลี่ยนรหัสผ่าน</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                    >
                      {showEditPassword ? 'ยกเลิกการเปลี่ยนรหัสผ่าน' : 'เปลี่ยนรหัสผ่าน'}
                    </Button>
                  </div>
                  
                  {showEditPassword && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="editPassword">รหัสผ่านใหม่</Label>
                        <div className="relative">
                          <Input
                            id="editPassword"
                            type={showPassword ? "text" : "password"}
                            value={editUser.password}
                            onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                            placeholder="กรอกรหัสผ่านใหม่"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="editConfirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                        <Input
                          id="editConfirmPassword"
                          type="password"
                          value={editUser.confirmPassword}
                          onChange={(e) => setEditUser({...editUser, confirmPassword: e.target.value})}
                          placeholder="ยืนยันรหัสผ่านใหม่"
                        />
                      </div>

                      {/* Password Requirements */}
                      {editUser.password && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">ข้อกำหนดรหัสผ่าน:</Label>
                          <div className="space-y-1 text-sm">
                            <div className={`flex items-center space-x-2 ${editPasswordRequirements.hasLength ? 'text-green-600' : 'text-red-600'}`}>
                              <Check className="w-4 h-4" />
                              <span>ความยาว 6-50 ตัวอักษร</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${editPasswordRequirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                              <Check className="w-4 h-4" />
                              <span>มีตัวเลข</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${editPasswordRequirements.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                              <Check className="w-4 h-4" />
                              <span>มีตัวอักษรพิมพ์เล็ก</span>
                            </div>
                            <div className={`flex items-center space-x-2 ${editPasswordRequirements.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                              <Check className="w-4 h-4" />
                              <span>มีตัวอักษรพิมพ์ใหญ่</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                  ยกเลิก
                </Button>
                <Button onClick={handleSaveEdit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      บันทึก
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;