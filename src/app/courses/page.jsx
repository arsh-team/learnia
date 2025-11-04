"use client";
import { useState, useEffect } from "react";
import { 
  Star, 
  Clock, 
  Users, 
  ShoppingCart, 
  Eye, 
  Heart, 
  Zap, 
  Trash2, 
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  X,
  BookOpen,
  TrendingUp,
  Award
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import Link from "next/link";
import Header from "../../components/header";

export default function CoursesPage() {
  const [favorites, setFavorites] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  const { cart, addToCart, removeFromCart } = useCart();

  // بارگذاری لایک‌ها از localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('courseFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  // ذخیره لایک‌ها در localStorage
  useEffect(() => {
    localStorage.setItem('courseFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('خطا در دریافت دوره‌ها');
      }
      const data = await response.json();
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
    if (!id) return;
    
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  const isInCart = (productId) => {
    return cart.some(item => String(item._id) === String(productId));
  };

  const handleCartToggle = (product) => {
    const productId = product._id || product.id;
    
    if (!productId) {
      console.warn("Product has no valid ID:", product);
      return;
    }

    if (isInCart(productId)) {
      removeFromCart(productId);
    } else {
      addToCart({
        _id: productId,
        id: productId,
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

  // فیلتر و مرتب‌سازی دوره‌ها
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.teacher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || product.level === selectedLevel;
      
      const price = product.priceafterdiscount || product.price;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.priceafterdiscount || a.price) - (b.priceafterdiscount || b.price);
        case 'price-high':
          return (b.priceafterdiscount || b.price) - (a.priceafterdiscount || a.price);
        case 'popular':
          return (b.studentsCount || 0) - (a.studentsCount || 0);
        case 'rating':
          return (b.rating?.average || b.score || 0) - (a.rating?.average || a.score || 0);
        default: // newest
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const levels = [...new Set(products.map(p => p.level).filter(Boolean))];

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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
              <div className="h-12 bg-gray-300 rounded w-96 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3 mb-16"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(9)].map((_, index) => (
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
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 px-4 sm:px-6">
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
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Liquid Glass Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-liquidMove"></div>
          <div className="absolute -top-3/4 -right-1/4 w-[200%] h-[200%] bg-gradient-to-r from-cyan-400/15 via-blue-500/15 to-indigo-500/15 animate-liquidMoveReverse"></div>
          <div className="absolute -bottom-1/2 -left-1/3 w-[200%] h-[200%] bg-gradient-to-r from-pink-400/15 via-rose-500/15 to-red-500/15 animate-liquidMoveSlow"></div>
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-6 py-3 mb-6 shadow-lg">
              <BookOpen className="w-5 h-5 text-yellow-300 fill-current" />
              <span className="font-bold text-lg">دوره‌های آموزشی</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-800 mb-4">
              همه دوره‌ها
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {filteredAndSortedProducts.length} دوره آموزشی برای رشد مهارت‌های شما
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:max-w-md relative">
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="جستجو در دوره‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">جدیدترین</option>
                  <option value="price-low">قیمت: کم به زیاد</option>
                  <option value="price-high">قیمت: زیاد به کم</option>
                  <option value="popular">محبوب‌ترین</option>
                  <option value="rating">بالاترین امتیاز</option>
                </select>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  فیلترها
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      دسته‌بندی
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">همه دسته‌ها</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      سطح دوره
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-sm border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">همه سطوح</option>
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      محدوده قیمت: تا {priceRange[1].toLocaleString()} تومان
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedLevel('all');
                      setPriceRange([0, 1000000]);
                    }}
                    className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    پاک کردن فیلترها
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              نمایش {filteredAndSortedProducts.length} دوره از {products.length} دوره
            </p>
          </div>

          {/* Products Grid/List */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">دوره‌ای یافت نشد</h3>
              <p className="text-gray-500 mb-6">هیچ دوره‌ای با فیلترهای انتخاب شده مطابقت ندارد.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setPriceRange([0, 1000000]);
                  setSearchTerm('');
                }}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                مشاهده همه دوره‌ها
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product, index) => {
                const productId = product._id || product.id;
                return (
                  <div
                    key={productId || index}
                    className="group relative"
                    onMouseEnter={() => setHoveredProduct(productId)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {/* Product Card */}
                    <div className="relative bg-white/95 backdrop-blur-lg border border-gray-200 rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white hover:border-blue-200 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 shadow-lg h-full flex flex-col">
                      
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(product.category)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
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
                              isFavorite(productId)
                                ? "bg-pink-500 border-pink-600 text-white"
                                : "bg-white/90 border-white/80 text-gray-600 hover:bg-pink-500 hover:border-pink-600 hover:text-white"
                            }`}
                          >
                            <Heart 
                              className={`w-4 h-4 transition-all duration-300 ${
                                isFavorite(productId) ? "fill-current" : ""
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
                      <div className="p-6 relative z-10 flex-1 flex flex-col">
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
                        <Link href={`/products/${product.slug}`} className="flex-1">
                          <h3 className="text-gray-800 font-bold text-lg mb-2 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 cursor-pointer hover:text-blue-600 line-clamp-2">
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
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-gray-800">
                              {(product.priceafterdiscount || product.price)?.toLocaleString()} تومان
                            </span>
                            {product.priceafterdiscount && product.priceafterdiscount < product.price && (
                              <span className="text-gray-400 line-through text-sm">
                                {product.price?.toLocaleString()}
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
          ) : (
            /* List View */
            <div className="space-y-6">
              {filteredAndSortedProducts.map((product, index) => {
                const productId = product._id || product.id;
                return (
                  <div
                    key={productId || index}
                    className="group bg-white/95 backdrop-blur-lg border border-gray-200 rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/20 shadow-lg"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="lg:w-64 lg:flex-shrink-0 relative">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-48 lg:h-full object-cover"
                        />
                        {product.label && (
                          <div className={`absolute top-4 right-4 backdrop-blur-md border ${getBadgeColor(product.label)} rounded-full px-3 py-1 text-sm font-bold shadow-lg`}>
                            {product.label}
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-blue-600 text-sm font-medium bg-blue-100 rounded-full px-3 py-1">
                                {product.category}
                              </span>
                              <span className="text-gray-500 text-sm font-medium">
                                {product.level}
                              </span>
                            </div>
                            
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                                {product.title}
                              </h3>
                            </Link>
                            
                            <p className="text-gray-600 mb-4">
                              مدرس: <span className="font-semibold text-gray-700">{product.teacher}</span>
                            </p>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {product.description?.substring(0, 150)}...
                            </p>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>{product.score || "جدید"}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span>{product.hours}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-purple-500" />
                                <span>{product.studentsCount?.toLocaleString() || 0} دانشجو</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Side Actions */}
                          <div className="flex lg:flex-col items-center lg:items-end gap-4">
                            <div className="text-left lg:text-right">
                              <div className="text-2xl font-black text-gray-800 mb-1">
                                {(product.priceafterdiscount || product.price)?.toLocaleString()} تومان
                              </div>
                              {product.priceafterdiscount && product.priceafterdiscount < product.price && (
                                <div className="text-gray-400 line-through text-sm">
                                  {product.price?.toLocaleString()} تومان
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleFavorite(productId)}
                                className={`p-3 rounded-2xl backdrop-blur-lg border transition-all duration-300 ${
                                  isFavorite(productId)
                                    ? "bg-pink-500 border-pink-600 text-white"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-pink-500 hover:border-pink-600 hover:text-white"
                                }`}
                              >
                                <Heart className={`w-5 h-5 ${isFavorite(productId) ? "fill-current" : ""}`} />
                              </button>
                              
                              <button 
                                onClick={() => handleCartToggle(product)}
                                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                                  isInCart(productId)
                                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                }`}
                              >
                                {isInCart(productId) ? (
                                  <Trash2 className="w-5 h-5" />
                                ) : (
                                  <ShoppingCart className="w-5 h-5" />
                                )}
                              </button>
                              
                              <Link href={`/products/${product.slug}`}>
                                <button className="p-3 rounded-2xl bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300">
                                  <Eye className="w-5 h-5" />
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CSS Styles */}
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
          .animation-delay-1000 { animation-delay: 1s; }
          .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
        `}</style>
      </div>
    </>
  );
}