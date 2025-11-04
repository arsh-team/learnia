"use client";
import { useEffect, useState, useRef } from "react";
import {
  BookOpen,
  CalendarDays,
  Award,
  Phone,
  ShoppingCart,
  User,
  LogOut,
  MessageSquare,
  Settings,
  CreditCard,
  Bell
} from "lucide-react";
import Link from "next/link";
import { useCart } from "../../hooks/useCart";
import { useNotifications } from "../../hooks/useNotifications";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cart } = useCart();
  const { unreadCount, fetchUnreadCount, markAsRead } = useNotifications();
  const profileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    if (token) {
      fetchUnreadCount();
    }
  }, [fetchUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    window.location.href = "/";
  };

  const handleNotificationClick = async () => {
    // اگر اعلان خوانده نشده وجود دارد، همه را علامت‌گذاری کن
    if (unreadCount > 0) {
      await markAsRead(); // علامت‌گذاری همه اعلان‌ها
    }
    setIsProfileOpen(false);
  };

  const profileMenuItems = [
    {
      icon: User,
      label: "نمایه کاربری",
      href: "/profile",
      color: "blue"
    },
    {
      icon: CreditCard,
      label: "پنل کاربری",
      href: "/panel",
      color: "green"
    },
    {
      icon: Bell,
      label: "اعلان‌ها",
      href: "/notifications",
      color: "pink",
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      icon: LogOut,
      label: "خروج از حساب کاربری",
      onClick: handleLogout,
      color: "red"
    }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-b-3xl">
      {/* Liquid Glass Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-400/15 via-purple-500/15 to-pink-500/15 animate-[liquidMove_8s_ease-in-out_infinite]"></div>
        <div className="absolute -top-3/4 -right-1/4 w-[200%] h-[200%] bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-indigo-500/10 animate-[liquidMove_10s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute -bottom-1/2 -left-1/3 w-[200%] h-[200%] bg-gradient-to-r from-pink-400/10 via-rose-500/10 to-red-500/10 animate-[liquidMove_12s_ease-in-out_infinite]"></div>
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* --- Logo with Glass Effect --- */}
        <Link href="/">
          <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent select-none relative cursor-pointer">
            Learnia
            <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-500/20 blur-md -z-10 rounded-lg"></span>
          </h1>
        </Link>

        {/* --- Nav Links with Glass Morphism --- */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { icon: BookOpen, text: "لیست دوره‌ها", color: "blue", href: "/courses" },
            { icon: CalendarDays, text: "درباره کلاس ها", color: "purple", href: "/about" },
            { icon: Phone, text: "تماس با ما", color: "green", href: "/call" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
                activeLink === item.text
                  ? "bg-white/20 text-white shadow-lg"    
                  : "text-gray-700 hover:text-white"
              }`}
              onMouseEnter={() => setActiveLink(item.text)}
              onMouseLeave={() => setActiveLink("")}
            >
              <item.icon
                className={`w-4 h-4 transition-all duration-300 ${
                  activeLink === item.text
                    ? `text-${item.color}-300`
                    : `text-${item.color}-500 group-hover:text-${item.color}-300`
                }`}
              />
              <span className="transition-all duration-300 text-sm sm:text-base">
                {item.text}
              </span>
              
              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-${item.color}-500/30 to-${item.color}-600/30 rounded-xl backdrop-blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                activeLink === item.text ? "opacity-100" : ""
              }`}></div>
              
              {/* Liquid Drip Effect */}
              <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-full transition-all duration-300 group-hover:w-3/4 ${
                activeLink === item.text ? "w-3/4" : ""
              }`}></div>
            </Link>
          ))}
        </nav>

        {/* --- Actions with Glass Morphism --- */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* سبد خرید با افکت شیشه‌ای */}
          <Link href="/cart">
            <button className="group relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg">
              <ShoppingCart className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 group-hover:text-white" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full shadow-lg">
                  {cart.length}
                </span>
              )}
              
              {/* Liquid Bubble Effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>

          {/* دکمه اعلان‌ها */}
          {isLoggedIn && (
            <Link href="/notifications">
              <button 
                className="group relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 backdrop-blur-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg"
                onClick={handleNotificationClick}
              >
                <Bell className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 group-hover:text-white" />
                
                {/* Badge برای اعلان‌های خوانده نشده */}
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full shadow-lg"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
                
                {/* Liquid Bubble Effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-400/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* پالس انیمیشن برای اعلان‌های جدید */}
                {unreadCount > 0 && (
                  <motion.div
                    className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-red-400/50"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </button>
            </Link>
          )}

          {/* ورود / ثبت نام یا پروفایل */}
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="group relative p-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <User className="text-white w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
                
                {/* Liquid Shine Effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Desktop Dropdown */}
              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    {/* Desktop Version */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="hidden md:block absolute left-0 top-full mt-2 w-64 origin-top-right"
                    >
                      <div className="bg-white/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              U
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">کاربر عزیز</p>
                              <p className="text-gray-600 text-xs">
                                {unreadCount > 0 
                                  ? `${unreadCount} اعلان خوانده نشده` 
                                  : 'همه اعلان‌ها خوانده شده'
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          {profileMenuItems.map((item, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {item.href ? (
                                <Link href={item.href} onClick={() => setIsProfileOpen(false)}>
                                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200 group cursor-pointer">
                                    <div className={`p-2 rounded-lg bg-${item.color}-100 text-${item.color}-600 group-hover:bg-${item.color}-500 group-hover:text-white transition-colors duration-200`}>
                                      <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center"
                                      >
                                        {item.badge}
                                      </motion.span>
                                    )}
                                  </div>
                                </Link>
                              ) : (
                                <button
                                  onClick={item.onClick}
                                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-200 group cursor-pointer text-right"
                                >
                                  <div className={`p-2 rounded-lg bg-${item.color}-100 text-${item.color}-600 group-hover:bg-${item.color}-500 group-hover:text-white transition-colors duration-200`}>
                                    <item.icon className="w-4 h-4" />
                                  </div>
                                  <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                                    {item.label}
                                  </span>
                                </button>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {/* Mobile Bottom Sheet */}
                    <motion.div
                      initial={{ opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: "100%" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="fixed flex flex-col inset-x-0 -bottom-[100vh] h-[100vh] pt-[40vh] bg-black/5 z-50 md:hidden"
                    >
                      <div className="bg-white/95 h-full backdrop-blur-2xl border-t border-white/20 rounded-t-3xl shadow-2xl">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2">
                          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                        </div>

                        {/* Header */}
                        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              U
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">کاربر عزیز</p>
                              <p className="text-gray-600 text-sm">
                                {unreadCount > 0 
                                  ? `${unreadCount} اعلان خوانده نشده` 
                                  : 'همه اعلان‌ها خوانده شده'
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-4 overflow-y-auto">
                          <div className="grid gap-2">
                            {profileMenuItems.map((item, index) => (
                              <motion.div
                                key={index}
                                whileTap={{ scale: 0.95 }}
                              >
                                {item.href ? (
                                  <Link href={item.href} onClick={() => setIsProfileOpen(false)}>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/50 active:bg-white/70 transition-all duration-200 group cursor-pointer">
                                      <div className={`p-3 rounded-xl bg-${item.color}-100 text-${item.color}-600 group-hover:bg-${item.color}-500 group-hover:text-white transition-colors duration-200`}>
                                        <item.icon className="w-5 h-5" />
                                      </div>
                                      <span className="flex-1 text-gray-700 group-hover:text-gray-900 font-medium text-right">
                                        {item.label}
                                      </span>
                                      {item.badge && (
                                        <motion.span 
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="bg-red-500 text-white text-sm px-2 py-1 rounded-full min-w-[24px] text-center"
                                        >
                                          {item.badge}
                                        </motion.span>
                                      )}
                                    </div>
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => {
                                      item.onClick?.();
                                      setIsProfileOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-white/50 active:bg-white/70 transition-all duration-200 group cursor-pointer text-right"
                                  >
                                    <div className={`p-3 rounded-xl bg-${item.color}-100 text-${item.color}-600 group-hover:bg-${item.color}-500 group-hover:text-white transition-colors duration-200`}>
                                      <item.icon className="w-5 h-5" />
                                    </div>
                                    <span className="flex-1 text-gray-700 group-hover:text-gray-900 font-medium">
                                      {item.label}
                                    </span>
                                  </button>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 h-full -z-10 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsProfileOpen(false)}
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={"/login"}
                className="group relative text-gray-700 font-medium px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 hover:text-white text-sm sm:text-base">
                ورود
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl backdrop-blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href={"/login"}
                className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-sm sm:text-base">
                ثبت نام
                
                {/* Liquid Shimmer Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes liquidMove {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(5%, 10%) rotate(5deg);
          }
          50% {
            transform: translate(10%, 5%) rotate(0deg);
          }
          75% {
            transform: translate(5%, 10%) rotate(-5deg);
          }
        }
      `}</style>
    </header>
  );
}