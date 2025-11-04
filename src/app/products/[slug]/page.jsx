"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../../hooks/useCart";
import { 
  Star, 
  Clock, 
  Users, 
  ShoppingCart, 
  Heart, 
  ArrowLeft,
  Play,
  CheckCircle,
  BookOpen,
  Award,
  Calendar,
  User,
  Share2,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  Download,
  Infinity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Header from "../../../components/header";

export default function ProductDetailPage() {
  const params = useParams();
  const { cart, addToCart, removeFromCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [favorites, setFavorites] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [showVideoModal, setShowVideoModal] = useState(false);

  // بارگذاری لایک‌ها از localStorage هنگام mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('courseFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);

  // ذخیره لایک‌ها در localStorage هنگام تغییر
  useEffect(() => {
    localStorage.setItem('courseFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.slug}`);
      if (!response.ok) {
        throw new Error('محصول یافت نشد');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const toggleFavorite = (id) => {
    if (!id) {
      console.warn("Cannot toggle favorite: Invalid product ID");
      return;
    }

    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id];
      
      console.log('Favorites updated:', newFavorites);
      return newFavorites;
    });
  };

  const handleCartToggle = (product) => {
    const id = product._id;
    if (!id) {
      console.warn("Product has no valid ID:", product);
      return;
    }

    if (isInCart(id)) {
      removeFromCart(id);
    } else {
      addToCart({
        _id: id, 
        title: product.title,
        price: product.priceafterdiscount || product.price,
        image: product.image,
        teacher: product.teacher,
        hours: product.hours,
        slug: product.slug,
        level: product.level 
      });
    }
  };

  const isInCart = (id) => {
    return cart.some(item => String(item._id) === String(id));
  };

  const isFavorite = (id) => {
    return favorites.includes(id);
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description?.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('لینک دوره در کلیپ‌بورد کپی شد!');
    }
  };

  const toggleChapter = (chapterIndex) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };

  const totalLessons = product?.curriculum?.reduce((total, chapter) => 
    total + (chapter.lessons?.length || 0), 0
  ) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-4">
                <div className="h-80 sm:h-96 bg-gray-300 rounded-3xl"></div>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="h-20 bg-gray-300 rounded-2xl"></div>
                  <div className="h-20 bg-gray-300 rounded-2xl"></div>
                  <div className="h-20 bg-gray-300 rounded-2xl"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">محصول یافت نشد</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">{error || 'این دوره در دسترس نیست'}</p>
          <Link href="/products">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-2xl hover:scale-105 transition-transform text-sm sm:text-base">
              بازگشت به دوره‌ها
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header></Header>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-400/10 via-purple-500/10 to-pink-500/10 animate-liquidMove"></div>
        <div className="absolute -top-3/4 -right-1/4 w-[200%] h-[200%] bg-gradient-to-r from-cyan-400/8 via-blue-500/8 to-indigo-500/8 animate-liquidMoveReverse"></div>
        <div className="absolute -bottom-1/2 -left-1/3 w-[200%] h-[200%] bg-gradient-to-r from-pink-400/8 via-rose-500/8 to-red-500/8 animate-liquidMoveSlow"></div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={shareProduct}
              className="group p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all duration-300"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={() => toggleFavorite(product._id)}
              className={`group p-2 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
                isFavorite(product._id)
                  ? "bg-pink-500 border-pink-600 text-white hover:bg-pink-600"
                  : "bg-white/80 border-gray-200 text-gray-600 hover:bg-pink-500 hover:border-pink-600 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isFavorite(product._id) ? 'fill-current' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Product Media */}
          <div className="space-y-4 sm:space-y-6">
            {/* Video Preview */}
            {product.videoPreview && (
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
                <div className="aspect-video bg-black relative">
                  <video
                    poster={product.image}
                    className="w-full h-full object-cover"
                    controls
                  >
                    <source src={product.videoPreview} type="video/mp4" />
                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
                  </video>
                </div>
              </div>
            )}

            {/* Main Image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
              <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoading ? 'block' : 'hidden'}`}></div>
              <img
                src={product.image}
                alt={product.title}
                className={`w-full h-64 sm:h-80 object-cover transition-opacity duration-500 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-200">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">مدت زمان</p>
                <p className="font-bold text-gray-800 text-sm sm:text-base">{product.hours}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-200">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">سطح</p>
                <p className="font-bold text-gray-800 text-sm sm:text-base">{product.level}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-200 col-span-2 sm:col-span-1">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600">دانشجو</p>
                <p className="font-bold text-gray-800 text-sm sm:text-base">{product.studentsCount?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Category & Level */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {product.category}
              </span>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {product.level}
              </span>
              {product.label && (
                <span className="bg-pink-100 text-pink-600 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  {product.label}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 leading-tight">
              {product.title}
            </h1>

            {/* Instructor */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                {product.teacher?.charAt(0)}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">مدرس دوره</p>
                <p className="font-bold text-gray-800 text-sm sm:text-base">{product.teacher}</p>
              </div>
            </div>

            {/* Description Preview */}
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {product.description?.substring(0, 150)}...
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      star <= Math.floor(product.rating?.average || product.score || 0)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm sm:text-base text-gray-700 font-medium">
                {product.rating?.average || product.score || "جدید"}
              </span>
              <span className="text-gray-500 text-xs sm:text-sm">
                ({product.rating?.count || 0} نظر)
              </span>
            </div>

            {/* Price Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-gray-800">
                    {(product.priceafterdiscount || product.price)?.toLocaleString()} تومان
                  </span>
                  {product.priceafterdiscount && product.priceafterdiscount < product.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 line-through text-sm sm:text-lg">
                        {product.price?.toLocaleString()} تومان
                      </span>
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                        {Math.round((1 - product.priceafterdiscount / product.price) * 100)}% تخفیف
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => handleCartToggle(product)}
                  className={`group flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isInCart(product._id)
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-red-500/25"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-blue-500/25"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                    {isInCart(product._id) ? (
                      <>
                        حذف از سبد خرید
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    ) : (
                      <>
                        افزودن به سبد خرید
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </span>
                </button>
                
                <button className="group bg-white text-gray-800 border border-gray-300 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300">
                  <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                    مشاهده نمونه
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {product.features?.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base">{feature.title}</span>
                </div>
              )) || (
                <>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-gray-700 text-sm sm:text-base">پشتیبانی دائمی</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-gray-700 text-sm sm:text-base">مدرک معتبر</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Infinity className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-gray-700 text-sm sm:text-base">دسترسی مادام‌العمر</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-gray-700 text-sm sm:text-base">پروژه‌های عملی</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
            {[
              { id: 'description', label: 'توضیحات', icon: BookOpen },
              { id: 'curriculum', label: 'سرفصل‌ها', icon: FileText },
              { id: 'learn', label: 'آنچه می‌آموزید', icon: Award },
              { id: 'prerequisites', label: 'پیش‌نیازها', icon: CheckCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/50'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">توضیحات کامل دوره</h3>
                <div className="text-gray-600 leading-relaxed space-y-3 sm:space-y-4 text-sm sm:text-base">
                  {product.description?.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">سرفصل‌های دوره</h3>
                  <div className="flex items-center gap-4 text-sm sm:text-base text-gray-600">
                    <span>{product.curriculum?.length || 0} فصل</span>
                    <span>•</span>
                    <span>{totalLessons} درس</span>
                    <span>•</span>
                    <span>{product.hours}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {product.curriculum?.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200">
                      <button
                        onClick={() => toggleChapter(chapterIndex)}
                        className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-100 transition-colors"
                      >
                        <div className="text-left">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                            فصل {chapterIndex + 1}: {chapter.chapter}
                          </h4>
                          <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                            {chapter.lessons?.length || 0} درس
                          </p>
                        </div>
                        {expandedChapters[chapterIndex] ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      {expandedChapters[chapterIndex] && (
                        <div className="border-t border-gray-200">
                          {chapter.lessons?.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100 last:border-b-0 hover:bg-white transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.isFree ? (
                                  <Play className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Video className="w-4 h-4 text-blue-500" />
                                )}
                                <span className="text-gray-700 text-sm sm:text-base">{lesson.title}</span>
                              </div>
                              <span className="text-gray-500 text-xs sm:text-sm">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      سرفصل‌های دوره به زودی اضافه خواهند شد.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* What You Learn Tab */}
            {activeTab === 'learn' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">آنچه در این دوره می‌آموزید</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {product.whatYouLearn?.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">مباحث پیشرفته {product.category}</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">پروژه‌های عملی و واقعی</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">تکنیک‌های کاربردی در صنعت</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">بهترین practices و استانداردها</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Prerequisites Tab */}
            {activeTab === 'prerequisites' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">پیش‌نیازهای این دوره</h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  {product.prerequisites?.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-purple-50 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-purple-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">آشنایی مقدماتی با {product.category}</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-purple-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">علاقه به یادگیری مفاهیم جدید</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 sm:p-4 bg-purple-50 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">دسترسی به کامپیوتر و اینترنت</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
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
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
    </>
  );
}