import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    ref: 'Product',
    required: true
  },
  chapter: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isFree: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true }, // 'pdf', 'zip', 'code'
  }]
}, {
  timestamps: true
});

export default mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);