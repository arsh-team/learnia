import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  product: {
    type: String,
    ref: 'Product',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  maxScore: {
    type: Number,
    default: 100
  },
  attachments: [{
    title: String,
    url: String
  }]
}, {
  timestamps: true
});

export default mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);