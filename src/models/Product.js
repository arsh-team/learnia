import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: {
    type: String, // تغییر به String برای کار با رشته‌های ساده
    required: true
  },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceafterdiscount: { type: Number },
  label: { type: String },
  teacher: { type: String, required: true },
  teacherImage: { type: String },
  teacherBio: { type: String },
  image: { type: String, required: true },
  videoPreview: { type: String },
  hours: { type: String, required: true },
  studentsCount: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  whatYouLearn: [{ type: String }],
  prerequisites: [{ type: String }],
  curriculum: [{
    chapter: { type: String, required: true },
    lessons: [{
      title: { type: String, required: true },
      duration: { type: String, required: true },
      isFree: { type: Boolean, default: false }
    }]
  }],
  features: [{
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String }
  }],
  language: { type: String, default: 'فارسی' },
  lastUpdated: { type: Date, default: Date.now },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
productSchema.virtual('discountPercentage').get(function() {
  if (this.priceafterdiscount && this.price) {
    return Math.round((1 - this.priceafterdiscount / this.price) * 100);
  }
  return 0;
});

productSchema.virtual('isOnSale').get(function() {
  return this.priceafterdiscount && this.priceafterdiscount < this.price;
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);