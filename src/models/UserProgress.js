import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: String,
    ref: 'Product',
    required: true
  },
  lesson: {
    type: String,
    ref: 'Lesson',
    required: true
  },
  progress: {
    type: Number, // درصد پیشرفت (0-100)
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  watchedDuration: {
    type: Number, // ثانیه
    default: 0
  },
  totalDuration: {
    type: Number, // ثانیه
    required: true
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  },
  videoCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userProgressSchema.index({ user: 1, product: 1, lesson: 1 }, { unique: true });

export default mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema);