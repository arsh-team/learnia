// app/cart/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { Trash2, ShoppingBag, CreditCard, CheckCircle2, Loader, BookOpen } from "lucide-react";
import Link from "next/link";
import Header from "../../components/header";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState({});
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  
  const handleEnrollAll = async () => {
    try {
      setLoading(true);
      setEnrollmentStatus({});
      
      const token = localStorage.getItem("token");
      if (!token) {
        alert("لطفاً ابتدا وارد حساب کاربری خود شوید");
        router.push("/login");
        return;
      }

      // استخراج productId ها از سبد خرید
      const productIds = cart.map(item => item._id).filter(id => id);
      
      if (productIds.length === 0) {
        alert("سبد خرید شما خالی است");
        return;
      }

      console.log("Enrolling in products:", productIds);

      // استفاده از API ثبت‌نام گروهی
      const response = await fetch("/api/enrollments/bulk-enroll", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productIds: productIds
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در ثبت‌نام گروهی");
      }

      console.log("Bulk enrollment response:", data);

      // ایجاد وضعیت برای هر محصول
      const results = {};
      data.results.forEach(result => {
        results[result.productId] = {
          success: result.success,
          message: result.success ? "ثبت‌نام موفق" : result.error
        };
      });

      setEnrollmentStatus(results);
      
      // پاک کردن دوره‌های موفق از سبد خرید
      const successfulIds = Object.keys(results).filter(id => results[id].success);
      successfulIds.forEach(id => removeFromCart(id));
      
      // نمایش پیام موفقیت
      setTimeout(() => {
        if (data.successfulCount > 0) {
          alert(`ثبت‌نام در ${data.successfulCount} دوره با موفقیت انجام شد!`);
          if (data.successfulCount === cart.length) {
            router.push("/panel");
          }
        } else {
          alert("متأسفانه در هیچ یک از دوره‌ها ثبت‌نام انجام نشد.");
        }
      }, 1000);

    } catch (error) {
      console.error("Enrollment process error:", error);
      alert(error.message || "خطا در ثبت‌نام دوره‌ها");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price || 0), 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Liquid Glass Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-400/10 via-purple-500/10 to-pink-500/10 animate-liquidMove"></div>
        <div className="absolute -top-3/4 -right-1/4 w-[200%] h-[200%] bg-gradient-to-r from-cyan-400/8 via-blue-500/8 to-indigo-500/8 animate-liquidMoveReverse"></div>
        <div className="absolute -bottom-1/2 -left-1/3 w-[200%] h-[200%] bg-gradient-to-r from-pink-400/8 via-rose-500/8 to-red-500/8 animate-liquidMoveSlow"></div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-800 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-blue-500" />
              سبد خرید شما
            </h1>
            {cart.length > 0 && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {cart.length} دوره
              </span>
            )}
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="group relative bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
            >
              <span className="flex items-center gap-2">
                پاک کردن همه
                <Trash2 className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">سبد خرید شما خالی است</h2>
              <p className="text-gray-500 mb-8">می‌توانید از بین دوره‌های آموزشی ما انتخاب کنید</p>
              <Link href="/products">
                <button className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
                  <span className="flex items-center gap-2">
                    مشاهده دوره‌ها
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </Link>
            </div>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <div
                  key={item._id || index}
                  className={`group relative bg-white/80 backdrop-blur-lg border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 ${
                    enrollmentStatus[item._id]?.success 
                      ? 'border-green-200 bg-green-50' 
                      : enrollmentStatus[item._id]?.success === false
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <Link href={`/products/${item.slug}`}>
                        <div className="flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden cursor-pointer group/image">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                          />
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start gap-3">
                            <Link href={`/products/${item.slug}`}>
                              <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                                {item.title}
                              </h3>
                            </Link>
                            
                            {/* Enrollment Status */}
                            {enrollmentStatus[item._id] && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                enrollmentStatus[item._id].success
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {enrollmentStatus[item._id].success ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : null}
                                {enrollmentStatus[item._id].message}
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="group/delete p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-gray-600 mb-2">مدرس: {item.teacher}</p>
                        <p className="text-gray-500 text-sm mb-4">مدت زمان: {item.hours}</p>

                        <div className="flex items-center justify-between">
                          {/* Price */}
                          <div className="text-left">
                            <span className="text-2xl font-black text-gray-800">
                              {(item.price || 0).toLocaleString()} تومان
                            </span>
                          </div>
                          
                          {/* Level Badge */}
                          {item.level && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              item.level === 'مقدماتی' ? 'bg-green-100 text-green-600' :
                              item.level === 'متوسط' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {item.level}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liquid Hover Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-blue-50/30 to-transparent -skew-x-12 transform translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                  خلاصه سفارش
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تعداد دوره‌ها:</span>
                    <span className="font-semibold text-gray-800">
                      {cart.length} دوره
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">جمع کل:</span>
                    <span className="text-2xl font-black text-gray-800">
                      {totalAmount.toLocaleString()} تومان
                    </span>
                  </div>

                  {totalAmount > 600000 && (
                    <div className="flex justify-between items-center text-green-600 bg-green-50 rounded-xl p-3">
                      <span>تخفیف:</span>
                      <span className="font-semibold">۵۰,۰۰۰ تومان</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-800">مبلغ قابل پرداخت:</span>
                  <span className="text-2xl font-black text-blue-600">
                    {totalAmount > 600000 ? (totalAmount - 50000).toLocaleString() : totalAmount.toLocaleString()} تومان
                  </span>
                </div>

                <button 
                  onClick={handleEnrollAll}
                  disabled={loading || Object.values(enrollmentStatus).some(status => status?.success)}
                  className="group relative w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        در حال ثبت‌نام...
                      </>
                    ) : Object.values(enrollmentStatus).some(status => status?.success) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        ثبت‌نام انجام شد
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        ثبت‌نام در دوره‌ها
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/products")}
                    className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    ادامه خرید
                  </button>
                  
                  <button
                    onClick={() => router.push("/panel")}
                    className="w-full border border-blue-300 text-blue-600 font-medium py-3 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    مشاهده پنل کاربری
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  با کلیک بر روی ثبت‌نام، قوانین و شرایط را پذیرفته‌اید
                </p>
              </div>
            </div>
          </div>
        )}
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