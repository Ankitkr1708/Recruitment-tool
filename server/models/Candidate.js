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
    match: [/\S+@\S+\.\S+/, 'is invalid'] // Basic email validation
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
    type: Number, // For AI/manual ranking
    default: 0
  },
  resumeLink: {
    type: String // URL to S3, Cloudinary, or other file storage
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
  // You could add 'notes', 'interviewFeedback', etc. later
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Candidate', candidateSchema);