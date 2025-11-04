"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/header";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Users,
  Zap,
  Heart
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    message: "" 
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => 
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data?.error || "خطا در ارسال پیام" });
        return;
      }

      setStatus({ 
        type: "success", 
        message: "پیام شما ثبت شد. در اولین فرصت پاسخ می‌دهیم." 
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Submit error:", err);
      setStatus({ type: "error", message: "خطا در ارسال پیام" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "ایمیل",
      value: "hello@learnia.ir",
      description: "برای پیام‌های عمومی و سوالات",
      color: "blue",
      href: "mailto:hello@learnia.ir"
    },
    {
      icon: Phone,
      title: "تلفن",
      value: "+98 21 1234 5678",
      description: "پاسخگوی شما در ساعات کاری",
      color: "green",
      href: "tel:+982112345678"
    },
    {
      icon: MapPin,
      title: "آدرس",
      value: "تهران، خیابان ولیعصر",
      description: "دفتر مرکزی ما",
      color: "purple",
      href: "#"
    },
    {
      icon: Clock,
      title: "ساعات کاری",
      value: "۹ صبح تا ۵ عصر",
      description: "شنبه تا چهارشنبه",
      color: "orange",
      href: "#"
    }
  ];

  const socialNetworks = [
    {
      name: "اینستاگرام",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500",
      href: "#"
    },
    {
      name: "تلگرام",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500",
      href: "#"
    },
    {
      name: "لینکدین",
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-600",
      href: "#"
    },
    {
      name: "توییتر",
      color: "from-sky-500 to-blue-500",
      bgColor: "bg-sky-500",
      href: "#"
    }
  ];

  return (
    <>
      <Header />
      
      {/* Liquid Glass Background */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-[liquidMove_15s_ease-in-out_infinite] rounded-full"></div>
          <div className="absolute -bottom-1/3 -right-1/4 w-[120%] h-[120%] bg-gradient-to-r from-cyan-400/15 via-blue-500/15 to-indigo-500/15 animate-[liquidMove_12s_ease-in-out_infinite_reverse] rounded-full"></div>
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-6 py-3 mb-6 shadow-lg">
              <MessageCircle className="w-5 h-5 text-yellow-300" />
              <span className="font-bold text-lg">در تماس باشید</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                تماس با ما
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              هر سوال، پیشنهاد یا نظری دارید، خوشحال می‌شویم بشنویم. تیم پشتیبانی ما همیشه آماده کمک به شماست.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="block group"
                >
                  <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-${item.color}-100 text-${item.color}-500 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{item.title}</h3>
                        <p className="text-gray-700 font-medium mb-1">{item.value}</p>
                        <p className="text-gray-500 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}

              {/* Social Networks */}
              <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  شبکه‌های اجتماعی
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  برای آخرین اخبار، دوره‌های جدید و محتوای آموزشی ما را دنبال کنید
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {socialNetworks.map((network, index) => (
                    <motion.a
                      key={index}
                      href={network.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`bg-gradient-to-r ${network.color} text-white rounded-xl p-3 text-center font-medium hover:shadow-lg transition-all duration-300`}
                    >
                      {network.name}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Partnership */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-6 h-6 text-white" />
                  <h3 className="font-bold text-lg">همکاری با ما</h3>
                </div>
                <p className="text-green-100 text-sm mb-4">
                  مدرس هستید یا ایده همکاری دارید؟ با ما در میان بگذارید.
                </p>
                <a 
                  href="mailto:partners@learnia.ir"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-xl font-medium hover:bg-green-50 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  partners@learnia.ir
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Send className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">پیام خود را ارسال کنید</h2>
                    <p className="text-gray-600">در کمتر از ۲۴ ساعت پاسخ می‌دهیم</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence>
                    {status && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl border-2 ${
                          status.type === 'success' 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {status.type === 'success' ? (
                            <Zap className="w-5 h-5" />
                          ) : (
                            <MessageCircle className="w-5 h-5" />
                          )}
                          <span>{status.message}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        value={form.name}
                        onChange={handleChange('name')}
                        placeholder="مثال: محمدرضا اصفری"
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ایمیل *
                      </label>
                      <input
                        value={form.email}
                        onChange={handleChange('email')}
                        placeholder="example@email.com"
                        type="email"
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      شماره تماس
                    </label>
                    <input
                      value={form.phone}
                      onChange={handleChange('phone')}
                      placeholder="09123456789"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      پیام شما *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={handleChange('message')}
                      placeholder="پیام، سوال یا پیشنهاد خود را اینجا بنویسید..."
                      rows={6}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className={`w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-blue-500/25'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>در حال ارسال...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        <span>ارسال پیام</span>
                      </div>
                    )}
                  </motion.button>

                  <p className="text-center text-gray-500 text-sm">
                    یا مستقیماً به{" "}
                    <a href="mailto:hello@learnia.ir" className="text-blue-500 hover:text-blue-600 font-medium">
                      hello@learnia.ir
                    </a>{" "}
                    ایمیل بزنید
                  </p>
                </form>
              </div>
            </motion.div>
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
        `}</style>
      </div>
    </>
  );
}