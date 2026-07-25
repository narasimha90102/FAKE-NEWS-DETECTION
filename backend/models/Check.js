import mongoose from 'mongoose';

const CheckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  text: { type: String, required: true },
  verdict: { type: String, required: true },
  score: { type: Number, required: true },
  summary: { type: String },
  confidence: { type: String, default: 'High' },
  language: { type: String, default: 'English' },
  metrics: {
    sourceReliability: { type: Number, default: 85 },
    contentAnalysis: { type: Number, default: 78 },
    factVerification: { type: Number, default: 90 },
    crossReference: { type: Number, default: 75 }
  },
  createdAt: { type: Date, default: Date.now }
});

export const Check = mongoose.model('Check', CheckSchema);
