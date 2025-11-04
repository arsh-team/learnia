// components/ProductsSection.jsx
"use client";
import { useState, useEffect } from "react";
import { Star, Clock, Users, ShoppingCart, Eye, Heart, Zap, Trash2 } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import Link from "next/link";

export default function ProductsSection() {
  const [favorites, setFavorites] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { cart, addToCart, removeFromCart } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('خطا در دریافت محصولات');
      }
      const data = await response.json();
      console.log("Products data:", data); // برای دیباگ
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const getBadgeColor = (label) => {
    const colors = {
      "پرطرفدار": "bg-pink-500 text-white border-pink-600",
      "جدید": "bg-blue-500 text-white border-blue-600",
      "ویژه": "bg-purple-500 text-white border-purple-600",
      "تخفیف‌دار": "bg-green-500 text-white border-green-600",
      "پرسرعت": "bg-cyan-500 text-white border-cyan-600",
      "حرفه‌ای": "bg-orange-500 text-white border-orange-600"
    };
    return colors[label] || "bg-gray-500 text-white border-gray-600";
  };

  const getGradient = (category) => {
    const gradients = {
      "ریاضی": "from-blue-500/40 to-purple-600/40",
      "برنامه‌نویسی": "from-purple-500/40 to-pink-600/40",
      "هوش مصنوعی": "from-cyan-500/40 to-blue-600/40",
      "طراحی": "from-pink-500/40 to-rose-600/40",
      "مدیریت": "from-green-500/40 to-teal-600/40",
      "شبکه": "from-orange-500/40 to-red-600/40"
    };
    return gradients[category] || "from-blue-500/40 to-purple-600/40";
  };

  // تابع بهبود یافته برای بررسی وجود محصول در سبد خرید
  const isInCart = (productId) => {
    return cart.some(item => String(item._id) === String(productId));
  };

  // تابع بهبود یافته برای مدیریت افزودن/حذف از سبد خرید
  const handleCartToggle = (product) => {
    // استفاده از id یا _id - هر کدام که موجود باشد
    const productId = product._id || product.id;
    
    if (!productId) {
      console.warn("Product has no valid ID:", product);
      return;
    }

    console.log("Cart toggle for product:", productId, product.title); // دیباگ

    if (isInCart(productId)) {
      removeFromCart(productId);
    } else {
      addToCart({
        _id: productId, // استفاده از شناسه واقعی
        id: productId, // برای سازگاری
        title: product.title,
        price: product.priceafterdiscount || product.price,
        image: product.image,
        teacher: product.teacher,
        hours: product.hours,
        slug: product.slug,
        level: product.level,
        category: product.category
      });
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen w-full py-16 px-6 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-6"></div>
            <div className="h-12 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto mb-16"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-3xl p-6 shadow-lg">
                  <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen w-full py-16 px-6 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl">
            <p className="text-lg font-medium">{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen w-full py-16 px-6 relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Liquid Glass Background - Darker for better contrast */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-liquidMove"></div>
        <div className="absolute -top-3/4 -right-1/4 w-[200%] h-[200%] bg-gradient-to-r from-cyan-400/15 via-blue-500/15 to-indigo-500/15 animate-liquidMoveReverse"></div>
        <div className="absolute -bottom-1/2 -left-1/3 w-[200%] h-[200%] bg-gradient-to-r from-pink-400/15 via-rose-500/15 to-red-500/15 animate-liquidMoveSlow"></div>
        
        {/* Additional background layers for better visibility */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-6 py-3 mb-6 shadow-lg">
          <Zap className="w-5 h-5 text-yellow-300 fill-current" />
          <span className="font-bold text-lg">دوره‌های ویژه</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-4">
          منتخب بهترین دوره‌ها
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          با کیفیت‌ترین دوره‌های آموزشی را با جدیدترین متدهای تدریس تجربه کنید
        </p>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">هیچ دوره‌ای یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const productId = product._id || product.id;
              return (
                <div
                  key={productId || index}
                  className="group relative"
                  onMouseEnter={() => setHoveredProduct(productId)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Card */}
                  <div className="relative bg-white/95 backdrop-blur-lg border border-gray-200 rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white hover:border-blue-200 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 shadow-lg">
                    
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(product.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Badge */}
                      {product.label && (
                        <div className={`absolute top-4 right-4 backdrop-blur-md border ${getBadgeColor(product.label)} rounded-full px-3 py-1 text-sm font-bold shadow-lg`}>
                          {product.label}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <button
                          onClick={() => toggleFavorite(productId)}
                          className={`p-2 rounded-full backdrop-blur-lg border transition-all duration-300 shadow-lg ${
                            favorites.includes(productId)
                              ? "bg-pink-500 border-pink-600 text-white"
                              : "bg-white/90 border-white/80 text-gray-600 hover:bg-pink-500 hover:border-pink-600 hover:text-white"
                          }`}
                        >
                          <Heart 
                            className={`w-4 h-4 transition-all duration-300 ${
                              favorites.includes(productId) ? "fill-current" : ""
                            }`} 
                          />
                        </button>
                        
                        <Link href={`/products/${product.slug}`}>
                          <button className="p-2 rounded-full bg-white/90 backdrop-blur-lg border border-white/80 text-gray-600 shadow-lg transition-all duration-300 hover:bg-blue-500 hover:border-blue-600 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Link href={`/products/${product.slug}`}>
                          <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-105 shadow-lg">
                            مشاهده سریع
                          </button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 relative z-10">
                      {/* Category & Level */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-blue-600 text-sm font-medium bg-blue-100 rounded-full px-3 py-1">
                          {product.category}
                        </span>
                        <span className="text-gray-500 text-sm font-medium">
                          {product.level}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-gray-800 font-bold text-lg mb-2 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 cursor-pointer hover:text-blue-600">
                          {product.title}
                        </h3>
                      </Link>
                      
                      {/* Instructor */}
                      <p className="text-gray-600 text-sm mb-4">
                        مدرس: <span className="font-semibold text-gray-700">{product.teacher}</span>
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-gray-700 text-sm font-medium">
                            {product.score || "جدید"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600 text-sm">{product.hours}</span>
                        </div>
                      </div>
                      
                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-gray-800">
                            {(product.priceafterdiscount || product.price).toLocaleString()} تومان
                          </span>
                          {product.priceafterdiscount && product.priceafterdiscount < product.price && (
                            <span className="text-gray-400 line-through text-sm">
                              {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => handleCartToggle(product)}
                          className={`group/btn relative p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md ${
                            isInCart(productId)
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-red-500/25"
                              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-blue-500/25"
                          }`}
                        >
                          {isInCart(productId) ? (
                            <Trash2 className="w-5 h-5" />
                          ) : (
                            <ShoppingCart className="w-5 h-5" />
                          )}
                          
                          {/* Liquid Shimmer */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                        </button>
                      </div>
                    </div>
                    
                    {/* Liquid Hover Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-blue-50/50 to-transparent -skew-x-12 transform translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Floating Elements */}
                  {hoveredProduct === productId && (
                    <>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full blur-sm animate-ping"></div>
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full blur-sm animate-ping animation-delay-1000"></div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Load More Button */}
        <div className="text-center mt-16">
          <Link href="/products">
            <button className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
              <span className="flex items-center gap-2">
                مشاهده همه دوره‌ها
                <Zap className="w-5 h-5 group-hover:animate-bounce" />
              </span>
              
              {/* Liquid Shimmer Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </Link>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes liquidMove {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(1%, 2%) rotate(0.5deg) scale(1.01);
          }
          50% {
            transform: translate(2%, 1%) rotate(0deg) scale(1.005);
          }
          75% {
            transform: translate(1%, 2%) rotate(-0.5deg) scale(1.01);
          }
        }
        
        @keyframes liquidMoveReverse {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(-1%, -2%) rotate(-0.5deg) scale(1.01);
          }
          50% {
            transform: translate(-2%, -1%) rotate(0deg) scale(1.005);
          }
          75% {
            transform: translate(-1%, -2%) rotate(0.5deg) scale(1.01);
          }
        }
        
        @keyframes liquidMoveSlow {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(1.5%, 1%) rotate(0.3deg) scale(1.008);
          }
          66% {
            transform: translate(-1%, 1.5%) rotate(-0.3deg) scale(1.008);
          }
        }
        
        .animate-liquidMove {
          animation: liquidMove 20s ease-in-out infinite;
        }
        
        .animate-liquidMoveReverse {
          animation: liquidMoveReverse 25s ease-in-out infinite;
        }
        
        .animate-liquidMoveSlow {
          animation: liquidMoveSlow 30s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}