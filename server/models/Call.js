import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['ai', 'human'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral']
  }
});

const callSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'failed'],
    default: 'pending'
  },
  transcript: [messageSchema],
  nextFollowUpDate: Date,
  notes: String
}, {
  timestamps: true
});

export const Call = mongoose.model('Call', callSchema);