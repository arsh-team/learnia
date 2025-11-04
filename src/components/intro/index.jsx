"use client";
import { motion } from "framer-motion";
import { 
  Brain, 
  Rocket, 
  Users, 
  Award, 
  Zap, 
  Shield,
  Star,
  TrendingUp,
  BookOpen,
  Video,
  MessageSquare,
  BarChart3
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AIFeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "آزمون های چالشی",
      description: "هر دوره با آزمون های چالشی، ضامن کیفیت درک شما از مطلب می باشد",
      color: "from-purple-500 to-pink-500",
      bgColor: "purple"
    },
    {
      icon: Rocket,
      title: "یادگیری تعاملی",
      description: "تجربه یادگیری پویا و تعاملی با قابلیت پرسش و پاسخ زنده با هوش مصنوعی",
      color: "from-blue-500 to-cyan-500",
      bgColor: "blue"
    },
    {
      icon: Users,
      title: "جامعه پویا",
      description: "به جامعه‌ای از یادگیرندگان بپیوندید و در بحث‌های گروهی شرکت کنید",
      color: "from-green-500 to-emerald-500",
      bgColor: "green"
    },
    {
      icon: Zap,
      title: "یادگیری سریع",
      description: "دیگر لازم نیست یک متخصص باشید، هوش مصنوعی مکمل شما خواهد بود!",
      color: "from-red-500 to-rose-500",
      bgColor: "red"
    },
    {
      icon: Shield,
      title: "پشتیبانی ۲۴/۷",
      description: "پشتیبانی تمام‌وقت توسط هوش مصنوعی و تیم متخصص",
      color: "from-indigo-500 to-purple-500",
      bgColor: "indigo"
    },
    {
      icon: Shield,
      title: "دیگر لازم نیست ماه ها مفاهیم پیچیده را یاد بگیرید",
      description: "ما به شما آموزش می‌دهیم چگونه با ابزار های هوش مصنوعی یک متخصص شوید!",
      color: "from-indigo-500 to-purple-500",
      bgColor: "indigo"
    }
  ];

  const router = useRouter();

  const stats = [
    { icon: Users, value: "10+", label: "دانشجو" },
    { icon: BookOpen, value: "6+", label: "دوره آموزشی" },
    { icon: Award, value: "۹۸%", label: "رضایت کاربران" },
    { icon: TrendingUp, value: "۳x", label: "سرعت رسیدن به تخصص" }
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
    <section className="relative min-h-screen w-full py-20 overflow-hidden">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-[liquidMove_15s_ease-in-out_infinite] rounded-full"></div>
        <div className="absolute -bottom-1/3 -right-1/4 w-[120%] h-[120%] bg-gradient-to-r from-cyan-400/15 via-blue-500/15 to-indigo-500/15 animate-[liquidMove_12s_ease-in-out_infinite_reverse] rounded-full"></div>
        <div className="absolute top-1/4 left-1/3 w-[80%] h-[80%] bg-gradient-to-r from-pink-400/10 via-rose-500/10 to-red-500/10 animate-[liquidMove_18s_ease-in-out_infinite] rounded-full"></div>
        
        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3 mb-6"
          >
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              پلتفرم آموزشی نسل جدید
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              انقلابی در یادگیری
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              با هوش مصنوعی
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            لرنیا، اولین پلتفرم آموزش مفاهیم و دانش های نوین، با کمک هوش مصنوعی؛
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}با هوش مصنوعی{" "}
            </span>
            بهترین میشی!
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center transition-all duration-300 group-hover:bg-white/20 group-hover:shadow-xl">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium text-sm">
                  {stat.label}
                </div>
                
                {/* Liquid Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              {/* Main Card */}
              <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 h-full transition-all duration-500 group-hover:bg-white/15 group-hover:shadow-2xl overflow-hidden">
                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-black text-gray-800 mb-4 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>

                {/* Liquid Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl -z-10`}></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-3xl"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 group-hover:animate-ping"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="relative inline-block">
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Button Text */}
              <span className="relative z-10" onClick={() => {
                router.push('/courses');
              }}>بزن بریم</span>
              
              {/* Liquid Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              {/* Particle Effects */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      transition: {
                        duration: 1,
                        delay: i * 0.1,
                        repeat: Infinity
                      }
                    }}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`
                    }}
                  />
                ))}
              </div>
            </motion.button>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity duration-300"></div>
          </div>

        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes liquidMove {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(2%, 3%) rotate(1deg) scale(1.02);
          }
          50% {
            transform: translate(-1%, 2%) rotate(-1deg) scale(1.01);
          }
          75% {
            transform: translate(1%, -1%) rotate(0.5deg) scale(1.02);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .floating {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}