import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  product: {
    type: String,
    ref: 'Product',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'short_answer'],
      default: 'multiple_choice'
    },
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    correctAnswer: String,
    explanation: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  timeLimit: {
    type: Number, // دقیقه
    default: 30
  },
  passingScore: {
    type: Number,
    default: 70
  },
  maxAttempts: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

export default mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);