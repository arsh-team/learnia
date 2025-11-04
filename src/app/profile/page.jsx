"use client";
import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Camera,
  Shield,
  BookOpen,
  Award,
  Clock,
  Settings,
  AlertCircle,
  LogOut,
  PlayCircle,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import { showToast } from "nextjs-toast-notify";


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    age: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const router = useRouter();

  // داده‌های نمونه برای تست
  const mockUser = {
    _id: "1",
    email: "user@example.com",
    username: "user123",
    firstname: "علی",
    lastname: "محمدی",
    age: 25,
    createdAt: "2024-01-15T00:00:00.000Z"
  };

  const mockEnrollments = [
    {
      _id: "1",
      product: { title: "دوره React پیشرفته", category: "فرانت‌اند" },
      progress: 85,
      completed: false,
      lastAccessed: "2024-12-20T10:30:00.000Z",
      enrolledAt: "2024-11-15T00:00:00.000Z"
    },
    {
      _id: "2",
      product: { title: "Node.js کامل", category: "بک‌اند" },
      progress: 100,
      completed: true,
      lastAccessed: "2024-12-18T15:45:00.000Z",
      enrolledAt: "2024-10-20T00:00:00.000Z"
    },
    {
      _id: "3",
      product: { title: "آموزش MongoDB", category: "دیتابیس" },
      progress: 45,
      completed: false,
      lastAccessed: "2024-12-19T09:15:00.000Z",
      enrolledAt: "2024-12-01T00:00:00.000Z"
    }
  ];

  useEffect(() => {
    fetchUserProfile();
    fetchUserEnrollments();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("⚠️ No token found, using mock data");
        setUser(mockUser);
        setEditForm({
          username: mockUser.username || "",
          firstname: mockUser.firstname || "",
          lastname: mockUser.lastname || "",
          age: mockUser.age || ""
        });
        setLoading(false);
        return;
      }

      console.log("🔐 Fetching user profile with token...");
      const response = await fetch("/api/auth/me", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("📨 Response status:", response.status);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setEditForm({
          username: userData.username || "",
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          age: userData.age || ""
        });
      } else {
        console.log("❌ API error, using mock data");
        setUser(mockUser);
        setEditForm({
          username: mockUser.username || "",
          firstname: mockUser.firstname || "",
          lastname: mockUser.lastname || "",
          age: mockUser.age || ""
        });
        
        if (response.status === 401) {
          localStorage.removeItem("token");
          setError("احراز هویت ناموفق. از داده‌های نمونه استفاده می‌شود.");
        }
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      setUser(mockUser);
      setEditForm({
        username: mockUser.username || "",
        firstname: mockUser.firstname || "",
        lastname: mockUser.lastname || "",
        age: mockUser.age || ""
      });
      setError("خطا در ارتباط با سرور. از داده‌های نمونه استفاده می‌شود.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrollments = async () => {
    try {
      setEnrollmentsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("⚠️ No token found, using mock enrollments");
        setEnrollments(mockEnrollments);
        return;
      }

      const response = await fetch("/api/enrollments/my-enrollments", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const enrollmentsData = await response.json();
        setEnrollments(enrollmentsData);
      } else {
        console.log("❌ API error, using mock enrollments");
        setEnrollments(mockEnrollments);
      }
    } catch (error) {
      console.error("❌ Error fetching enrollments:", error);
      setEnrollments(mockEnrollments);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  // محاسبات بر اساس enrollments
  const calculateUserStats = () => {
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.completed).length;
    const inProgressCourses = totalCourses - completedCourses;
    const averageProgress = totalCourses > 0 
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses)
      : 0;
    
    // محاسبه مجموع زمان مطالعه بر اساس تعداد دوره‌ها و پیشرفت
    const totalStudyHours = Math.round(totalCourses * 10 * (averageProgress / 100));

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      averageProgress,
      totalStudyHours
    };
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        setUser(prev => ({
          ...prev,
          ...editForm,
          age: editForm.age ? parseInt(editForm.age) : prev.age
        }));
        setIsEditing(false);
        setSuccess("اطلاعات با موفقیت بروزرسانی شد (حالت نمونه)");
        setTimeout(() => setSuccess(""), 3000);
        return;
      }

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        setSuccess("اطلاعات با موفقیت بروزرسانی شد");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "خطا در بروزرسانی اطلاعات");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      username: user?.username || "",
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      age: user?.age || ""
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const calculateMemberSince = (createdAt) => {
    if (!createdAt) return "جدید";
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} روز`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ماه`;
    return `${Math.floor(diffDays / 365)} سال`;
  };

  const formatLastAccessed = (dateString) => {
    if (!dateString) return "نامشخص";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "امروز";
    if (diffDays === 1) return "دیروز";
    if (diffDays < 7) return `${diffDays} روز پیش`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} هفته پیش`;
    return `${Math.floor(diffDays / 30)} ماه پیش`;
  };

  const stats = calculateUserStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                <div className="h-64 bg-gray-300 rounded-2xl"></div>
                <div className="h-20 bg-gray-300 rounded-2xl"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-12 bg-gray-300 rounded-2xl"></div>
                <div className="h-32 bg-gray-300 rounded-2xl"></div>
                <div className="h-32 bg-gray-300 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-400/10 via-purple-500/10 to-pink-500/10 animate-liquidMove"></div>
        <div className="absolute -top-3/4 -right-1/4 w-[200%] h-[200%] bg-gradient-to-r from-cyan-400/8 via-blue-500/8 to-indigo-500/8 animate-liquidMoveReverse"></div>
        <div className="absolute -bottom-1/2 -left-1/3 w-[200%] h-[200%] bg-gradient-to-r from-pink-400/8 via-rose-500/8 to-red-500/8 animate-liquidMoveSlow"></div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Alert Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700"
          >
            <div className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              <span>{success}</span>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
              نمایه کاربری
            </h1>
            <p className="text-gray-600">مدیریت اطلاعات حساب کاربری</p>
          </div>
          
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Edit3 className="w-5 h-5" />
                ویرایش اطلاعات
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-500 text-white font-medium px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <X className="w-5 h-5" />
                  انصراف
                </button>
              </>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white font-medium px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
              خروج
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - User Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 border border-gray-200 shadow-lg"
            >
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-4">
                    {user?.firstname?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </div>
                  <button
                  onClick={
                    () =>
                      showToast.warning("امکان تغییر تصویر نمایه فعلا وجود ندارد", {
                        duration: 2000,
                        progress: true,
                        position: "top-right",
                        transition: "bounceIn",
                        icon: '',
                      })
                  }
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {user?.firstname && user?.lastname 
                    ? `${user.firstname} ${user.lastname}`
                    : user?.username || "کاربر"
                  }
                </h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">دوره‌های فعال</span>
                  </div>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {stats.totalCourses}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">تکمیل شده</span>
                  </div>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {stats.completedCourses}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">در حال یادگیری</span>
                  </div>
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {stats.inProgressCourses}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-700">میانگین پیشرفت</span>
                  </div>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {stats.averageProgress}%
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Account Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 border border-gray-200 shadow-lg"
            >
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                اطلاعات حساب
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">عضویت از</span>
                  <span className="text-gray-800 font-medium text-sm">
                    {calculateMemberSince(user?.createdAt)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">وضعیت حساب</span>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                    فعال
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">آخرین فعالیت</span>
                  <span className="text-gray-800 font-medium text-sm">
                    {enrollments.length > 0 
                      ? formatLastAccessed(enrollments[0]?.lastAccessed)
                      : "نامشخص"
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 border border-gray-200 shadow-lg"
            >
              <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                اطلاعات شخصی
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email - Read Only */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    آدرس ایمیل
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800">{user?.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">ایمیل قابل تغییر نیست</p>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام کاربری
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="نام کاربری خود را وارد کنید"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-gray-800">{user?.username || "تعیین نشده"}</span>
                    </div>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.firstname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstname: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="نام خود را وارد کنید"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-gray-800">{user?.firstname || "تعیین نشده"}</span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام خانوادگی
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.lastname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastname: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-gray-800">{user?.lastname || "تعیین نشده"}</span>
                    </div>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سن
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="سن خود را وارد کنید"
                      min="1"
                      max="120"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-gray-800">
                        {user?.age ? `${user.age} سال` : "تعیین نشده"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاریخ عضویت
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-800">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : "نامشخص"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enrollments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 border border-gray-200 shadow-lg"
            >
              <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                دوره‌های من
              </h3>

              {enrollmentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-100 rounded-xl">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید.</p>
                  <button 
                    onClick={() => router.push("/profile/products")}
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                  >
                    مشاهده دوره‌ها
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          enrollment.completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {enrollment.completed ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <PlayCircle className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {enrollment.product?.title || "دوره بدون عنوان"}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {enrollment.product?.category || "دسته‌بندی نامشخص"} • 
                            آخرین بازدید: {formatLastAccessed(enrollment.lastAccessed)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">پیشرفت</div>
                          <div className="text-lg font-bold text-gray-800">
                            {enrollment.progress}%
                          </div>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              enrollment.completed 
                                ? 'bg-green-500' 
                                : enrollment.progress > 50 
                                  ? 'bg-blue-500' 
                                  : 'bg-orange-500'
                            }`}
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes liquidMove {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(1%, 2%) rotate(0.5deg) scale(1.01); }
          50% { transform: translate(2%, 1%) rotate(0deg) scale(1.005); }
          75% { transform: translate(1%, 2%) rotate(-0.5deg) scale(1.01); }
        }
        @keyframes liquidMoveReverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(-1%, -2%) rotate(-0.5deg) scale(1.01); }
          50% { transform: translate(-2%, -1%) rotate(0deg) scale(1.005); }
          75% { transform: translate(-1%, -2%) rotate(0.5deg) scale(1.01); }
        }
        @keyframes liquidMoveSlow {
          0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(1.5%, 1%) rotate(0.3deg) scale(1.008); }
          66% { transform: translate(-1%, 1.5%) rotate(-0.3deg) scale(1.008); }
        }
        .animate-liquidMove { animation: liquidMove 20s ease-in-out infinite; }
        .animate-liquidMoveReverse { animation: liquidMoveReverse 25s ease-in-out infinite; }
        .animate-liquidMoveSlow { animation: liquidMoveSlow 30s ease-in-out infinite; }
      `}</style>
    </div>
    </>
  );
}