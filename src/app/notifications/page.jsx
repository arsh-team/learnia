"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  CheckCircle, 
  Trash2, 
  Info, 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  ExternalLink,
  Filter,
  Search,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from "../../components/header";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });


  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  // کلاس رنگ بر اساس نوع اعلان
  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'system':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  // فرمت تاریخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'امروز';
    } else if (diffDays === 1) {
      return 'دیروز';
    } else if (diffDays < 7) {
      return `${diffDays} روز پیش`;
    } else {
      return date.toLocaleDateString('fa-IR');
    }
  };

  // دریافت اعلان‌ها
  const fetchNotifications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `/api/notifications?page=${page}&limit=${pagination.limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('خطا در دریافت اعلان‌ها');
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      alert('خطا در دریافت اعلان‌ها');
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  // علامت‌گذاری به عنوان خوانده شده
  const markAsRead = useCallback(async (notificationId = null) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notificationId,
          markAll: !notificationId
        })
      });

      if (!response.ok) {
        throw new Error('خطا در بروزرسانی وضعیت اعلان');
      }

      const data = await response.json();
      
      // بروزرسانی local state
      if (notificationId) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        );
      } else {
        // علامت‌گذاری همه به عنوان خوانده شده
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
      }
      
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert('خطا در بروزرسانی وضعیت اعلان');
    }
  }, []);

  // حذف اعلان
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('خطا در حذف اعلان');
      }

      // حذف از local state
      setNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      );
      
      // اگر اعلان حذف شده خوانده نشده بود، کاهش تعداد
      const deletedNotification = notifications.find(n => n._id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('خطا در حذف اعلان');
    }
  }, [notifications]);

  // وقتی کاربر اعلان را می‌بیند، به صورت خودکار علامت‌گذاری شود
  const handleNotificationClick = useCallback(async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    // اگر actionUrl وجود دارد، redirect کن
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  }, [markAsRead, router]);

  // فیلتر اعلان‌ها
  const filteredNotifications = notifications.filter(notification => {
    // فیلتر وضعیت
    if (filter === 'unread' && notification.isRead) return false;
    if (filter === 'read' && !notification.isRead) return false;
    
    // فیلتر جستجو
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(term) ||
        notification.message.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // بارگذاری اولیه
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // وقتی صفحه باز می‌شود، همه اعلان‌ها را به عنوان خوانده شده علامت‌گذاری کن
  useEffect(() => {
    if (notifications.length > 0 && unreadCount > 0) {
      markAsRead(); // علامت‌گذاری همه
    }
  }, [notifications.length]); // فقط وقتی که notifications بارگذاری شد

  if (loading && notifications.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-300 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* هدر صفحه */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-800">
                    اعلان‌ها
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {unreadCount > 0 
                      ? `${unreadCount} اعلان خوانده نشده` 
                      : 'همه اعلان‌ها خوانده شده‌اند'
                    }
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead()}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  علامت‌گذاری همه به عنوان خوانده شده
                </button>
              )}
            </div>

            {/* فیلتر و جستجو */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="جستجو در اعلان‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">همه اعلان‌ها</option>
                  <option value="unread">خوانده نشده</option>
                  <option value="read">خوانده شده</option>
                </select>
              </div>
            </div>
          </div>

          {/* لیست اعلان‌ها */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-2 rounded-2xl p-4 transition-all cursor-pointer hover:shadow-md ${
                      notification.isRead 
                        ? 'border-gray-200 bg-white' 
                        : 'border-blue-300 bg-blue-50'
                    } ${getNotificationColor(notification.type)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-4">
                      {/* آیکون */}
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* محتوا */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-semibold text-lg ${
                            notification.isRead ? 'text-gray-800' : 'text-blue-800'
                          }`}>
                            {notification.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(notification.createdAt)}
                            </span>
                            
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 leading-relaxed">
                          {notification.message}
                        </p>

                        {notification.image && (
                          <div className="mb-3">
                            <img 
                              src={notification.image} 
                              alt={notification.title}
                              className="max-w-xs rounded-lg shadow-sm"
                            />
                          </div>
                        )}

                        {/* اقدامات */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <span className="flex items-center gap-1 text-sm text-blue-600">
                                <ExternalLink className="w-4 h-4" />
                                مشاهده بیشتر
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                            className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    اعلانی یافت نشد
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || filter !== 'all' 
                      ? 'هیچ اعلانی با فیلترهای انتخاب شده مطابقت ندارد.'
                      : 'هنوز اعلانی برای شما ارسال نشده است.'
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => fetchNotifications(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      pagination.page === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}