"use client";
import { motion } from "framer-motion";
import Header from "../../components/header";
import { 
  BookOpen, 
  Rocket, 
  Target, 
  Award, 
  Star, 
  Users,
  Zap,
  TrendingUp,
  Shield,
  Heart,
  Globe,
  Clock
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Rocket,
      title: 'دوره‌های پروژه‌محور',
      description: 'یادگیری با انجام پروژه‌های واقعی و ساخت نمونه‌کارهای عملی',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'مسیرهای یادگیری',
      description: 'مسیرهای مشخص و هدفمند برای رسیدن به مهارت‌های مورد نیاز بازار کار',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'گواهی‌نامه معتبر',
      description: 'دریافت گواهی‌نامه‌های معتبر برای نمایش مهارت‌های کسب‌شده',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Star,
      title: 'اساتید متخصص',
      description: 'آموزش توسط اساتید با تجربه صنعت و نمونه‌کارهای واقعی',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'جامعه پویا',
      description: 'عضویت در جامعه‌ای از یادگیرندگان و متخصصان',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'پیگیری پیشرفت',
      description: 'ابزارهای پیشرفته برای تحلیل و پیگیری پیشرفت یادگیری',
      color: 'from-teal-500 to-blue-500'
    }
  ];

  const stats = [
    { icon: Users, value: "۵۰,۰۰۰+", label: "دانشجو" },
    { icon: BookOpen, value: "۲۰۰+", label: "دوره آموزشی" },
    { icon: Award, value: "۹۸%", label: "رضایت کاربران" },
    { icon: Globe, value: "۱۰+", label: "کشور" }
  ];

  const values = [
    {
      icon: Heart,
      title: "تمرکز بر کیفیت",
      description: "کیفیت محتوا و تجربه یادگیری برای ما در اولویت است"
    },
    {
      icon: Shield,
      title: "شفافیت",
      description: "شفافیت کامل در ارائه خدمات و پشتیبانی"
    },
    {
      icon: Zap,
      title: "نوآوری",
      description: "همیشه در حال بهبود و نوآوری در روش‌های آموزش"
    },
    {
      icon: Clock,
      title: "پشتیبانی دائمی",
      description: "پشتیبانی ۲۴/۷ برای همراهی در مسیر یادگیری"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

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
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-6 py-3 mb-6 shadow-lg"
            >
              <BookOpen className="w-5 h-5 text-yellow-300" />
              <span className="font-bold text-lg">درباره Learnia</span>
            </motion.div>

            <h1 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                انقلابی در یادگیری
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                با تکنولوژی مدرن
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learnia پلتفرم آموزشی نسل جدید است که با ترکیب تکنولوژی پیشرفته و روش‌های نوین تدریس، 
              تجربه‌ای شخصی‌شده و کارآمد از یادگیری را برای شما به ارمغان می‌آورد.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission & Vision */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="w-6 h-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">ماموریت ما</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                ماموریت Learnia این است که یادگیری باکیفیت را برای همه در دسترس کند. ما با تمرکز بر 
                تجربه عملی، مسیرهای یادگیری مشخص و ابزارهای پیگیری پیشرفت، به شما کمک می‌کنیم 
                نه تنها تئوری، بلکه مهارت‌های عملی مورد نیاز بازار کار را کسب کنید.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Zap className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">چشم‌انداز ما</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                می‌خواهیم به بزرگ‌ترین پلتفرم آموزشی خاورمیانه تبدیل شویم که در آن هر کسی 
                بتواند بدون محدودیت زمانی و مکانی، مهارت‌های مورد نیاز خود را با بهترین کیفیت 
                یاد بگیرد و در مسیر شغلی خود پیشرفت کند.
              </p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-800 mb-4">
                آنچه در Learnia پیدا می‌کنید
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                ویژگی‌های منحصر به فردی که Learnia را به انتخاب اول یادگیرندگان تبدیل کرده است
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-800 mb-4">
                ارزش‌های ما
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                اصولی که بر اساس آنها کار می‌کنیم و به آنها پایبند هستیم
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">آماده شروع هستید؟</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                همین حالا به جامعه Learnia بپیوندید و مسیر یادگیری خود را با بهترین ابزارها و 
                محتوای آموزشی شروع کنید.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/register'}
                  className="bg-white text-blue-600 font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  شروع یادگیری رایگان
                </motion.button>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-bold py-3 px-6 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 text-center"
                >
                  تماس با پشتیبانی
                </motion.a>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">اطلاعات تماس</h3>
              <div className="space-y-3">
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="font-medium">ایمیل:</span>
                  <a href="mailto:hello@learnia.ir" className="text-blue-500 hover:text-blue-600">
                    hello@learnia.ir
                  </a>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="font-medium">تلفن:</span>
                  <a href="tel:+982112345678" className="text-blue-500 hover:text-blue-600">
                    +98 21 1234 5678
                  </a>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="font-medium">ساعات کاری:</span>
                  شنبه تا چهارشنبه، ۹ صبح تا ۵ عصر
                </p>
              </div>
            </div>
          </motion.div>
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