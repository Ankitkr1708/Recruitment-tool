const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Candidate name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  jobTitle: {
    type: String
  },
  status: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  score: {
    type: Number,
    default: 0
  },
  resumeLink: {
    type: String, // Path to the uploaded file, e.g., /uploads/resume-123.pdf
    required: [true, 'Resume is required']
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);