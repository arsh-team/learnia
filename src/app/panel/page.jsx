"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  BookOpen,
  Award,
  Clock,
  Settings,
  AlertCircle,
  LogOut,
  PlayCircle,
  CheckCircle2,
  BarChart3,
  Target,
  TrendingUp,
  Calendar as CalendarIcon,
  Zap,
  Star,
  Crown,
  Rocket,
  Grid,
  List,
  Eye,
  Plus,
  Moon,
  Sun,
  Trash2,
  Edit,
  CheckCircle,
  Circle,
  BarChart,
  PieChart,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "../../components/header";

// کامپوننت GoalForm را خارج از کامپوننت اصلی تعریف می‌کنیم
const GoalForm = React.memo(({ goalForm, editingGoal, onInputChange, onSave, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 mb-6"
    >
      <h3 className="font-bold text-gray-800 mb-4 text-lg sm:text-xl">
        {editingGoal ? 'ویرایش هدف' : 'هدف جدید'}
      </h3>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عنوان هدف *
          </label>
          <input
            type="text"
            value={goalForm.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="مثال: تکمیل دوره React"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            هدف عددی *
          </label>
          <input
            type="number"
            value={goalForm.target}
            onChange={(e) => onInputChange('target', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="مثال: 100"
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مهلت *
          </label>
          <input
            type="date"
            value={goalForm.deadline}
            onChange={(e) => onInputChange('deadline', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اولویت
          </label>
          <select
            value={goalForm.priority}
            onChange={(e) => onInputChange('priority', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          >
            <option value="low">پایین</option>
            <option value="medium">متوسط</option>
            <option value="high">بالا</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نوع هدف
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'course', label: 'دوره', icon: BookOpen },
              { value: 'learning', label: 'یادگیری', icon: Target },
              { value: 'points', label: 'امتیاز', icon: Award },
              { value: 'time', label: 'زمان', icon: Clock }
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onInputChange('type', type.value)}
                className={`p-3 border-2 rounded-xl text-center transition-all flex flex-col items-center justify-center min-h-[80px] ${
                  goalForm.type === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <type.icon className="w-5 h-5 mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSave}
          className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium text-base"
        >
          {editingGoal ? 'بروزرسانی هدف' : 'ذخیره هدف'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-base"
        >
          انصراف
        </button>
      </div>
    </motion.div>
  );
});

GoalForm.displayName = 'GoalForm';

export default function DashboardPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({});
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: "",
    target: "",
    deadline: "",
    type: "learning",
    priority: "medium"
  });
  const [formKey, setFormKey] = useState(Date.now());
  const router = useRouter();

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('userGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage whenever goals change
  useEffect(() => {
    localStorage.setItem('userGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/dashboard/stats", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات");
      }

      const data = await response.json();
      
      setUser(data.user);
      setEnrollments(data.enrollments);
      setStats(data.overview);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("خطا در بارگذاری اطلاعات داشبورد");
    } finally {
      setLoading(false);
    }
  };

  // Goal Management Functions
  const addGoal = () => {
    if (!goalForm.title || !goalForm.target || !goalForm.deadline) {
      setError("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      title: goalForm.title,
      target: parseInt(goalForm.target),
      current: 0,
      deadline: goalForm.deadline,
      type: goalForm.type,
      priority: goalForm.priority,
      createdAt: new Date().toISOString(),
      completed: false
    };

    setGoals(prev => [newGoal, ...prev]);
    setGoalForm({
      title: "",
      target: "",
      deadline: "",
      type: "learning",
      priority: "medium"
    });
    setShowGoalForm(false);
    setError("");
    setFormKey(Date.now());
  };

  const updateGoal = () => {
    if (!goalForm.title || !goalForm.target || !goalForm.deadline) {
      setError("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }

    setGoals(prev => prev.map(goal => 
      goal.id === editingGoal.id 
        ? { 
            ...goal, 
            title: goalForm.title,
            target: parseInt(goalForm.target),
            deadline: goalForm.deadline,
            type: goalForm.type,
            priority: goalForm.priority
          }
        : goal
    ));

    setEditingGoal(null);
    setGoalForm({
      title: "",
      target: "",
      deadline: "",
      type: "learning",
      priority: "medium"
    });
    setShowGoalForm(false);
    setError("");
    setFormKey(Date.now());
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const updateGoalProgress = (goalId, newProgress) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            current: Math.min(newProgress, goal.target),
            completed: newProgress >= goal.target
          }
        : goal
    ));
  };

  const toggleGoalCompletion = (goalId) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            completed: !goal.completed,
            current: !goal.completed ? goal.target : goal.current
          }
        : goal
    ));
  };

  const startEditingGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      target: goal.target.toString(),
      deadline: goal.deadline,
      type: goal.type,
      priority: goal.priority
    });
    setShowGoalForm(true);
    setFormKey(Date.now());
  };

  const cancelGoalForm = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
    setGoalForm({
      title: "",
      target: "",
      deadline: "",
      type: "learning",
      priority: "medium"
    });
    setError("");
    setFormKey(Date.now());
  };

  const handleGoalFormChange = useCallback((field, value) => {
    setGoalForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const getGoalTypeIcon = (type) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'learning': return Target;
      case 'points': return Award;
      case 'time': return Clock;
      default: return Target;
    }
  };

  const calculateGoalStats = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.completed).length;
    const inProgressGoals = totalGoals - completedGoals;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    return { totalGoals, completedGoals, inProgressGoals, completionRate };
  };

  const calculateStudySessions = () => {
    return enrollments.map((enrollment, index) => ({
      date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      duration: Math.round((parseInt(enrollment.product?.hours) || 1) * 60 * (enrollment.progress / 100)),
      topic: enrollment.product?.title
    })).slice(0, 5);
  };

  const generateQuickActions = () => {
    const latestEnrollment = enrollments[0];
    
    return [
      {
        id: 1,
        title: "ادامه یادگیری",
        description: latestEnrollment ? `ادامه ${latestEnrollment.product?.title}` : "شروع دوره جدید",
        icon: PlayCircle,
        color: "blue",
        action: () => latestEnrollment ? 
          router.push(`/learning/${latestEnrollment.product?._id}`) : 
          router.push("/courses")
      },
      {
        id: 2,
        title: "کاوش دوره‌ها",
        description: "دوره‌های جدید را کشف کنید",
        icon: BookOpen,
        color: "green",
        action: () => router.push("/courses")
      },
      {
        id: 3,
        title: "تعیین هدف جدید",
        description: "هدف یادگیری جدیدی تنظیم کنید",
        icon: Target,
        color: "purple",
        action: () => {
          setActiveTab("goals");
          setMobileMenuOpen(false);
        }
      },
      {
        id: 4,
        title: "بررسی پیشرفت",
        description: "نمودارهای پیشرفت خود را ببینید",
        icon: TrendingUp,
        color: "orange",
        action: () => {
          setActiveTab("analytics");
          setMobileMenuOpen(false);
        }
      }
    ];
  };

  const ProgressRing = ({ progress, size = 120, strokeWidth = 8, label }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-blue-500 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-gray-800">{progress}%</span>
          {label && <span className="text-sm text-gray-600">{label}</span>}
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${
              change > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-xl bg-${color}-100 text-${color}-500`}>
          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </div>
    </motion.div>
  );

  const GoalProgress = ({ goal }) => {
    const ProgressIcon = getGoalTypeIcon(goal.type);
    const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
    const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`bg-white rounded-xl p-4 border-2 transition-all duration-300 ${
          goal.completed 
            ? 'border-green-200 bg-green-50' 
            : daysLeft < 3 
              ? 'border-red-200 bg-red-50'
              : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => toggleGoalCompletion(goal.id)}
              className={`mt-1 p-1 rounded-full transition-colors ${
                goal.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
              }`}
            >
              {goal.completed ? (
                <CheckCircle className="w-5 h-5 fill-current" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold mb-1 text-base break-words ${
                goal.completed ? 'text-green-700 line-through' : 'text-gray-800'
              }`}>
                {goal.title}
              </h4>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <ProgressIcon className="w-4 h-4" />
                  <span>
                    {goal.type === 'course' && 'دوره'}
                    {goal.type === 'learning' && 'یادگیری'}
                    {goal.type === 'points' && 'امتیاز'}
                    {goal.type === 'time' && 'زمان'}
                  </span>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  goal.priority === 'high' ? 'bg-red-100 text-red-600' :
                  goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {goal.priority === 'high' ? 'بالا' : goal.priority === 'medium' ? 'متوسط' : 'پایین'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => startEditingGoal(goal)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">پیشرفت</span>
          <span className="text-sm font-medium text-gray-800">
            {goal.current} / {goal.target}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              goal.completed 
                ? 'bg-green-500' 
                : progress > 70 
                  ? 'bg-blue-500' 
                  : progress > 30 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{Math.round(progress)}% تکمیل</span>
          <span className={daysLeft < 3 && !goal.completed ? 'text-red-500 font-medium' : ''}>
            {goal.completed ? 'تکمیل شده' : daysLeft > 0 ? `${daysLeft} روز باقی‌مانده` : 'مهلت گذشته'}
          </span>
        </div>

        {!goal.completed && (
          <div className="flex gap-2 mt-3">
            <input
              type="range"
              min="0"
              max={goal.target}
              value={goal.current}
              onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={() => updateGoalProgress(goal.id, goal.current + 1)}
              disabled={goal.current >= goal.target}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +1
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const StudySessionChart = () => {
    const sessions = calculateStudySessions();
    const maxDuration = sessions.length > 0 ? Math.max(...sessions.map(s => s.duration)) : 1;
    
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg h-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h3 className="font-bold text-lg sm:text-xl text-gray-800">فعالیت مطالعاتی</h3>
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <span>مدت مطالعه</span>
            </div>
          </div>
        </div>
        
        {sessions.length > 0 ? (
          <div className="relative">
            <div className="flex items-end justify-between h-40 sm:h-48 gap-2 sm:gap-3">
              {sessions.map((session, index) => {
                const heightPercentage = Math.max((session.duration / maxDuration) * 85, 5); 
                
                return (
                  <div 
                    key={index} 
                    className="flex flex-col items-center flex-1 group relative"
                  >
                    <div className="relative w-full flex justify-center">
                      <div
                        className="w-6 sm:w-10 rounded-t-lg transition-all duration-700 ease-out group-hover:w-8 sm:group-hover:w-12 group-hover:shadow-lg bg-gradient-to-t from-blue-500 to-purple-500"
                        style={{ 
                          height: `${heightPercentage}%`,
                          minHeight: '20px' 
                        }}
                      ></div>
                      
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-gray-800 text-white text-xs rounded-lg py-2 px-3 z-10 shadow-xl">
                        <span className="font-bold whitespace-nowrap">{session.duration} دقیقه</span>
                        <span className="text-gray-300 whitespace-nowrap">
                          {new Date(session.date).toLocaleDateString('fa-IR', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-gray-800 border-l-transparent border-r-transparent"></div>
                      </div>
                    </div>
                    
                    <span className="text-xs text-gray-600 mt-3 font-medium text-center">
                      {new Date(session.date).toLocaleDateString('fa-IR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                    
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      {session.duration} دقیقه
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="absolute bottom-16 left-0 right-0 h-px bg-gray-200 z-0"></div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0 دقیقه</span>
              <span>{maxDuration} دقیقه</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base sm:text-lg mb-2">هنوز فعالیت مطالعاتی ثبت نشده است</p>
            <p className="text-sm text-gray-400">پس از شروع مطالعه، نمودار شما در اینجا نمایش داده خواهد شد</p>
          </div>
        )}
      </div>
    );
  };

  const LearningPath = () => (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-bold text-gray-800 text-lg sm:text-xl">مسیر یادگیری شما</h3>
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-orange-500" />
          <span className="text-sm text-gray-600">
            سطح: {enrollments.length > 0 ? 'متوسط' : 'شروع'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {enrollments.slice(0, 3).map((enrollment, index) => (
          <div key={enrollment._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
              enrollment.completed ? 'bg-green-500 text-white' :
              enrollment.progress > 50 ? 'bg-blue-500 text-white' :
              'bg-orange-500 text-white'
            }`}>
              {enrollment.completed ? <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" /> : index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{enrollment.product?.title}</h4>
              <p className="text-sm text-gray-600 truncate">{enrollment.product?.category}</p>
            </div>
            <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium ${
              enrollment.completed ? 'bg-green-100 text-green-600' :
              enrollment.progress > 50 ? 'bg-blue-100 text-blue-600' :
              'bg-orange-100 text-orange-600'
            }`}>
              {enrollment.completed ? 'تکمیل شده' : `${enrollment.progress}%`}
            </div>
          </div>
        ))}
        
        {enrollments.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm sm:text-base">هنوز دوره‌ای شروع نکرده‌اید</p>
            <button 
              onClick={() => router.push("/courses")}
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              مشاهده دوره‌ها
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderGoals = () => {
    const goalStats = calculateGoalStats();
    const sortedGoals = [...goals].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">اهداف یادگیری</h2>
            <p className="text-gray-600 text-sm sm:text-base">اهداف خود را مدیریت و پیگیری کنید</p>
          </div>
          
          <div className="flex items-center gap-3">
            {!showGoalForm && (
              <button
                onClick={() => setShowGoalForm(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                هدف جدید
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-500">{goalStats.totalGoals}</div>
            <div className="text-xs sm:text-sm text-gray-600">کل اهداف</div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-500">{goalStats.completedGoals}</div>
            <div className="text-xs sm:text-sm text-gray-600">تکمیل شده</div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-orange-500">{goalStats.inProgressGoals}</div>
            <div className="text-xs sm:text-sm text-gray-600">در حال انجام</div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-500">{goalStats.completionRate}%</div>
            <div className="text-xs sm:text-sm text-gray-600">نرخ تکمیل</div>
          </div>
        </div>

        {showGoalForm && (
          <GoalForm
            key={formKey}
            goalForm={goalForm}
            editingGoal={editingGoal}
            onInputChange={handleGoalFormChange}
            onSave={editingGoal ? updateGoal : addGoal}
            onCancel={cancelGoalForm}
          />
        )}

        {sortedGoals.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-2xl border border-gray-200">
            <Target className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">هنوز هدفی تعریف نکرده‌اید</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">با تعیین اهداف، مسیر یادگیری خود را مشخص کنید</p>
            <button 
              onClick={() => setShowGoalForm(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base"
            >
              ایجاد اولین هدف
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {sortedGoals.map((goal) => (
              <GoalProgress key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => {
    const goalStats = calculateGoalStats();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <StatCard
            title="دوره‌های فعال"
            value={stats.totalCourses || 0}
            change={null}
            icon={BookOpen}
            color="blue"
          />
          <StatCard
            title="تکمیل شده"
            value={stats.completedCourses || 0}
            change={null}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="اهداف"
            value={goalStats.totalGoals}
            change={null}
            icon={Target}
            color="orange"
          />
          <StatCard
            title="ساعت مطالعه"
            value={stats.totalStudyTime || 0}
            change={null}
            icon={Clock}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StudySessionChart />
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-4">اقدامات سریع</h3>
            {generateQuickActions().map((action) => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className={`w-full p-3 sm:p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 text-right flex items-center gap-3`}
              >
                <div className={`p-2 rounded-lg bg-${action.color}-100 text-${action.color}-500 flex-shrink-0`}>
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{action.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-6">پیشرفت کلی</h3>
            <div className="flex justify-center">
              <ProgressRing 
                progress={stats.averageProgress || 0} 
                size={100}
                label="میانگین پیشرفت"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.inProgressCourses || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600">در حال یادگیری</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">{stats.consistencyScore || 0}%</div>
                <div className="text-xs sm:text-sm text-gray-600">ثبات مطالعه</div>
              </div>
            </div>
          </div>
          <LearningPath />
        </div>
      </div>
    );
  };

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">دوره‌های من</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/courses")}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            دوره جدید
          </button>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-white rounded-2xl border border-gray-200">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">هنوز دوره‌ای ندارید</h3>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">با ثبت‌نام در دوره‌ها، یادگیری را شروع کنید</p>
          <button 
            onClick={() => router.push("/courses")}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base"
          >
            مشاهده دوره‌ها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {enrollments.map((enrollment) => (
            <motion.div
              key={enrollment._id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    enrollment.product?.level === 'مقدماتی' ? 'bg-green-100 text-green-600' :
                    enrollment.product?.level === 'متوسط' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {enrollment.product?.level || 'نامشخص'}
                  </span>
                  {enrollment.product?.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{enrollment.product.rating}</span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm sm:text-base">
                  {enrollment.product?.title || 'دوره بدون عنوان'}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-4">{enrollment.product?.category || 'دسته‌بندی نامشخص'}</p>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1">
                      <span>پیشرفت</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {enrollment.product?.hours && (
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                      <span>مدت دوره</span>
                      <span>{enrollment.product.hours} ساعت</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-6">
                  <button 
                    onClick={() => router.push(`/learning/${enrollment.product?._id}`)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-medium"
                  >
                    {enrollment.progress > 0 ? 'ادامه یادگیری' : 'شروع یادگیری'}
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    const { learningAnalysis = {}, insights = {}, overallStatus } = stats;
    
    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">تحلیل‌های پیشرفته</h2>
        
        {/* وضعیت کلی */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">وضعیت کلی</h3>
              <p className="text-gray-600">{overallStatus || 'در حال تحلیل وضعیت...'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* کارایی یادگیری */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-6">کارایی یادگیری</h3>
            <div className="space-y-4">
              {[
                { label: "میانگین پیشرفت", value: stats.averageProgress || 0, max: 100 },
                { label: "سرعت یادگیری", value: stats.learningVelocity || 0, max: 10 },
                { label: "ثبات مطالعه", value: stats.consistencyScore || 0, max: 100 },
                { label: "درگیری با محتوا", value: learningAnalysis.engagementScore || 0, max: 100 },
                { label: "کارایی کلی", value: stats.productivityScore || 0, max: 200 }
              ].map((metric, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1">
                    <span>{metric.label}</span>
                    <span>{metric.value} / {metric.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${(metric.value / metric.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الگوهای یادگیری */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-6">الگوهای یادگیری</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">سبک یادگیری</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">سرعت یادگیری</p>
                    <p className="font-bold text-blue-700">{learningAnalysis.learningPace || 'نامشخص'}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">سطح نظم</p>
                    <p className="font-bold text-purple-700">{learningAnalysis.consistencyLevel || 'نامشخص'}</p>
                  </div>
                </div>
              </div>

              {/* نقاط قوت و ضعف */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">نقاط قوت</h4>
                  <div className="space-y-2">
                    {insights.strengths?.length > 0 ? (
                      insights.strengths.map((strength, index) => (
                        <div
                          key={index}
                          className="p-2 bg-green-50 rounded-lg flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{strength.category}</span>
                          <span className="text-xs text-green-600 ml-auto">{strength.score}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">در حال تحلیل نقاط قوت...</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">نقاط نیازمند تقویت</h4>
                  <div className="space-y-2">
                    {insights.weaknesses?.length > 0 ? (
                      insights.weaknesses.map((weakness, index) => (
                        <div
                          key={index}
                          className="p-2 bg-red-50 rounded-lg flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">{weakness.category}</span>
                          <span className="text-xs text-red-600 ml-auto">{weakness.score}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">در حال تحلیل نقاط ضعف...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* توصیه‌های یادگیری */}
              {learningAnalysis.recommendedActions?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">توصیه‌های یادگیری</h4>
                  <div className="space-y-2">
                    {learningAnalysis.recommendedActions.map((action, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-start gap-3"
                      >
                        <div className="mt-0.5">
                          <Rocket className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-700">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* الگوهای پیشرفت */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
          <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-6">الگوهای پیشرفت در موضوعات</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.patterns?.map((pattern, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
              >
                <h4 className="font-medium text-gray-800 mb-3">{pattern.category}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>پیشرفت</span>
                      <span>{pattern.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${pattern.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>نرخ تکمیل</span>
                      <span>{pattern.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${pattern.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Mobile Navigation Menu
  const MobileNavMenu = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="fixed inset-0 bg-black/15 bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">منو</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {[
                { id: "overview", label: "دید کلی", icon: Grid },
                { id: "courses", label: "دوره‌ها", icon: BookOpen },
                { id: "analytics", label: "تحلیل‌ها", icon: BarChart3 },
                { id: "goals", label: "اهداف", icon: Target },
                { id: "planner", label: "برنامه‌ریزی", icon: CalendarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-24 sm:h-32 bg-gray-300 rounded-2xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-48 sm:h-64 bg-gray-300 rounded-2xl"></div>
              <div className="h-48 sm:h-64 bg-gray-300 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <MobileNavMenu />
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'
      } pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6`}>
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className={`text-xl sm:text-2xl md:text-3xl font-black mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  خوش آمدید، {user?.firstname || user?.username}!
                </h1>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {enrollments.length > 0 
                    ? `شما در ${stats.totalCourses} دوره ثبت‌نام کرده‌اید و ${stats.completedCourses} دوره را تکمیل کرده‌اید`
                    : "هنوز در دوره‌ای ثبت‌نام نکرده‌اید"
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 sm:p-3 rounded-2xl transition-all ${
                    darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white border border-gray-200 shadow-lg text-gray-700'
                  }`}
                >
                  {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
                
                {user?.streak > 0 && (
                  <div className={`hidden sm:flex items-center gap-2 rounded-2xl px-3 py-2 ${
                    darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-lg'
                  }`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {user.streak} روز متوالی
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl px-3 py-2 shadow-lg">
                  <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-sm sm:text-base">{user?.points || 0}</span>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-2xl bg-white border border-gray-200 shadow-lg text-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Streak Indicator */}
            {user?.streak > 0 && (
              <div className={`sm:hidden flex items-center gap-2 rounded-2xl px-4 py-3 ${
                darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-lg'
              }`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {user.streak} روز متوالی
                </span>
              </div>
            )}
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Desktop Navigation Tabs */}
          <div className={`hidden lg:flex gap-1 rounded-2xl p-2 mb-8 overflow-x-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-lg'
          }`}>
            {[
              { id: "overview", label: "دید کلی", icon: Grid },
              { id: "courses", label: "دوره‌ها", icon: BookOpen },
              { id: "analytics", label: "تحلیل‌ها", icon: BarChart3 },
              { id: "goals", label: "اهداف", icon: Target },
              { id: "planner", label: "برنامه‌ریزی", icon: CalendarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : darkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Current Tab Indicator */}
          <div className="lg:hidden mb-6">
            <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-lg'
            }`}>
              {(() => {
                const currentTab = [
                  { id: "overview", label: "دید کلی", icon: Grid },
                  { id: "courses", label: "دوره‌ها", icon: BookOpen },
                  { id: "analytics", label: "تحلیل‌ها", icon: BarChart3 },
                  { id: "goals", label: "اهداف", icon: Target },
                  { id: "planner", label: "برنامه‌ریزی", icon: CalendarIcon }
                ].find(tab => tab.id === activeTab);
                
                return (
                  <>
                    <currentTab.icon className="w-5 h-5" />
                    <span className="font-medium">{currentTab?.label}</span>
                  </>
                );
              })()}
            </div>
          </div>

          <div>
            {activeTab === "overview" && renderOverview()}
            {activeTab === "courses" && renderCourses()}
            {activeTab === "analytics" && renderAnalytics()}
            {activeTab === "goals" && renderGoals()}
            {activeTab === "planner" && (
              <div className="text-center py-8 sm:py-12 bg-white rounded-2xl border border-gray-200">
                <CalendarIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">برنامه‌ریزی هفتگی</h3>
                <p className="text-gray-600 text-sm sm:text-base">به زودی...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}