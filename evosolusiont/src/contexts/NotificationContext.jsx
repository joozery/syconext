import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { toast } from '@/components/ui/use-toast';

const NotificationContext = createContext(null);

// แก้ Socket URL ให้ถูกต้อง
const getSocketURL = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  
  // ลบ /api ออกเพื่อได้ base URL
  let baseUrl = apiBaseUrl.replace('/api', '');
  
  // แก้ไข URL ที่ผิดพลาด (แต่ต้องไม่ทำซ้ำถ้ามีอยู่แล้ว)
  if (!baseUrl.includes('://')) {
    baseUrl = baseUrl.replace('https:/', 'https://');
    baseUrl = baseUrl.replace('http:/', 'http://');
  }
  
  console.log('🔌 Socket URL:', baseUrl);
  return baseUrl;
};

const SOCKET_URL = getSocketURL();

export const NotificationProvider = ({ children, user }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    // Only connect if user is admin
    if (!user || user.role !== 'admin') {
      console.log('🔌 Socket: User is not admin, skipping connection');
      return;
    }

    const token = localStorage.getItem('eep_jwt_token');
    if (!token) {
      console.log('🔌 Socket: No token found');
      return;
    }

    console.log('🔌 Connecting to socket server:', SOCKET_URL);
    
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      toast({
        title: "🔔 การแจ้งเตือนพร้อมใช้งาน",
        description: "คุณจะได้รับการแจ้งเตือนแบบ real-time",
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Listen for notifications
    newSocket.on('notification', (notification) => {
      console.log('📢 New notification received:', notification);
      
      // Add to notifications list
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show toast notification
      toast({
        title: getNotificationTitle(notification.type),
        description: notification.message,
        duration: 5000,
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.close();
    };
  }, [user]);

  // Get notification title based on type
  const getNotificationTitle = (type) => {
    const titles = {
      user_login: '🔐 การเข้าสู่ระบบใหม่',
      user_register: '👤 ผู้ใช้ใหม่',
      epc_register: '🏢 บริษัท EPC ใหม่',
      agency_register: '🏛️ หน่วยงานใหม่',
      coordinator_register: '👨‍💼 ผู้ประสานงานใหม่',
      project_register: '📋 โครงการใหม่',
      approval_request: '✅ คำขออนุมัติใหม่'
    };
    return titles[type] || '🔔 การแจ้งเตือน';
  };

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Emit to server
    if (socket) {
      socket.emit('notification:read', notificationId);
    }
  }, [socket]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Delete specific notification
  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
      return prev.filter(notif => notif.id !== notificationId);
    });
  }, []);

  const value = {
    socket,
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;

