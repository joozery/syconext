import React, { useState } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    isConnected,
    markAsRead, 
    markAllAsRead, 
    clearAll,
    deleteNotification 
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 1000 / 60);
    
    if (diffInMinutes < 1) return 'เมื่อสักครู่';
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ชั่วโมงที่แล้ว`;
    return date.toLocaleDateString('th-TH', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    const icons = {
      user_login: '🔐',
      user_register: '👤',
      epc_register: '🏢',
      agency_register: '🏛️',
      coordinator_register: '👨‍💼',
      project_register: '📋',
      approval_request: '✅'
    };
    return icons[type] || '🔔';
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-slate-100 transition-colors"
          title={isConnected ? 'การแจ้งเตือนพร้อมใช้งาน' : 'กำลังเชื่อมต่อ...'}
        >
          <Bell className={`w-5 h-5 ${isConnected ? 'text-slate-700' : 'text-slate-400'}`} />
          
          {/* Connection status indicator */}
          {!isConnected && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-1 -right-1"
            >
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            </motion.div>
          )}
          
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="h-5 min-w-[20px] px-1 flex items-center justify-center text-xs font-bold rounded-full bg-red-500"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </motion.div>
          )}
          {!isConnected && (
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full border border-white" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-96 max-h-[600px] overflow-hidden p-0"
        sideOffset={8}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
          <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              การแจ้งเตือน
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isConnected ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  เชื่อมต่อแล้ว
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  กำลังเชื่อมต่อ...
                </span>
              )}
            </p>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 text-xs"
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  อ่านทั้งหมด
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                ลบทั้งหมด
              </Button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[500px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium mb-1">ไม่มีการแจ้งเตือน</p>
              <p className="text-xs text-slate-500">
                คุณจะได้รับการแจ้งเตือนที่นี่เมื่อมีกิจกรรมใหม่
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`border-b border-slate-100 last:border-0 ${
                    !notification.read ? 'bg-blue-50/50' : 'bg-white'
                  } hover:bg-slate-50 transition-colors`}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        !notification.read ? 'bg-blue-100' : 'bg-slate-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          !notification.read ? 'font-semibold text-slate-800' : 'text-slate-700'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-3 text-center">
            <p className="text-xs text-slate-500">
              แสดงการแจ้งเตือน {notifications.length} รายการ
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;

