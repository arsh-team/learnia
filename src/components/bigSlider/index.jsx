"use client";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Play, Star, Users, Clock } from "lucide-react";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      id: 1,
      title: "دوره جامع ریاضی پیشرفته",
      subtitle: "آماده‌سازی برای المپیاد",
      description: "با بهترین اساتید کشور و روش‌های نوین آموزشی، خود را برای المپیاد ریاضی آماده کنید",
      image: "https://maze-prod.s3.ir-thr-at1.arvanstorage.ir/sliders/mSnk98jmhqSjMcc9E7aDhNTXMlSZsmyQBSoPTSpc.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=f1783f99-f21a-4559-aa2b-73097a0453e0%2F20251017%2Fir-thr-at1%2Fs3%2Faws4_request&X-Amz-Date=20251017T072211Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=52e243f19f2c0771b1322081f4bddfb3c6813d0ed3f696f4937d10aaf8601834",
      stats: {
        rating: 4.9,
        students: 1250,
        duration: "۴۲ ساعت"
      },
      gradient: "from-blue-500/20 to-purple-600/20"
    },
    {
      id: 2,
      title: "آموزش برنامه‌نویسی پایتون",
      subtitle: "از صفر تا صد",
      description: "یادگیری برنامه‌نویسی با پروژه‌های عملی و بازارکار محور",
      image: "https://maze-prod.s3.ir-thr-at1.arvanstorage.ir/sliders/mSnk98jmhqSjMcc9E7aDhNTXMlSZsmyQBSoPTSpc.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=f1783f99-f21a-4559-aa2b-73097a0453e0%2F20251017%2Fir-thr-at1%2Fs3%2Faws4_request&X-Amz-Date=20251017T072211Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=52e243f19f2c0771b1322081f4bddfb3c6813d0ed3f696f4937d10aaf8601834",
      stats: {
        rating: 4.8,
        students: 2300,
        duration: "۶۰ ساعت"
      },
      gradient: "from-purple-500/20 to-pink-600/20"
    },
    {
      id: 3,
      title: "کارگاه هوش مصنوعی",
      subtitle: "دنیای آینده",
      description: "با آخرین تکنولوژی‌های هوش مصنوعی آشنا شوید و پروژه‌های واقعی اجرا کنید",
      image: "https://maze-prod.s3.ir-thr-at1.arvanstorage.ir/sliders/mSnk98jmhqSjMcc9E7aDhNTXMlSZsmyQBSoPTSpc.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=f1783f99-f21a-4559-aa2b-73097a0453e0%2F20251017%2Fir-thr-at1%2Fs3%2Faws4_request&X-Amz-Date=20251017T072211Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=52e243f19f2c0771b1322081f4bddfb3c6813d0ed3f696f4937d10aaf8601834",
      stats: {
        rating: 4.9,
        students: 1800,
        duration: "۳۶ ساعت"
      },
      gradient: "from-cyan-500/20 to-blue-600/20"
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden rounded-3xl">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-400/10 via-purple-500/10 to-pink-500/10 animate-[liquidMove_15s_ease-in-out_infinite]"></div>
        <div className="absolute -top-3/4 -right-1/4 w-[200%] h-[200%] bg-gradient-to-r from-cyan-400/8 via-blue-500/8 to-indigo-500/8 animate-[liquidMove_18s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute -bottom-1/2 -left-1/3 w-[200%] h-[200%] bg-gradient-to-r from-pink-400/8 via-rose-500/8 to-red-500/8 animate-[liquidMove_20s_ease-in-out_infinite]"></div>
      </div>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? "opacity-100 transform translate-x-0"
              : index < currentSlide
              ? "opacity-0 transform -translate-x-full"
              : "opacity-0 transform translate-x-full"
          }`}
        >
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} backdrop-blur-[1px]`}></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">دوره فعال</span>
                </div>

                {/* Title & Subtitle */}
                <h1 className="text-5xl lg:text-7xl font-black text-white mb-4 leading-tight">
                  {slide.title}
                  <span className="block text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent mt-2">
                    {slide.subtitle}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-lg">
                  {slide.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{slide.stats.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                    <Users className="w-5 h-5 text-blue-300" />
                    <span className="text-white font-semibold">{slide.stats.students} نفر</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-lg px-4 py-2 border border-white/20">
                    <Clock className="w-5 h-5 text-green-300" />
                    <span className="text-white font-semibold">{slide.stats.duration}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4">
                  <button className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                    <span className="relative z-10 flex items-center gap-2">
                      شروع یادگیری
                      <Play className="w-5 h-5" />
                    </span>
                    
                    {/* Liquid Shimmer Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    {/* Glass Border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-sm group-hover:blur-md transition-all duration-300 -z-10"></div>
                  </button>

                  <button className="group relative bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-105">
                    <span className="flex items-center gap-2">
                      مشاهده اطلاعات
                    </span>
                    
                    {/* Liquid Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-300 transition-colors" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/20 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 600);
              }
            }}
            className={`group transition-all duration-300 ${
              index === currentSlide ? "scale-125" : "scale-100"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white shadow-lg shadow-blue-500/50"
                  : "bg-white/40 group-hover:bg-white/60"
              }`}
            ></div>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        ></div>
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
            transform: translate(4%, 1%) rotate(0deg) scale(1.01);
          }
          75% {
            transform: translate(2%, 3%) rotate(-1deg) scale(1.02);
          }
        }
        
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}