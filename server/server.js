const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads .env variables into process.env
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Core Middleware
app.use(cors({
  origin: process.env.CLIENT_URL // Only allow requests from your React app
}));
app.use(express.json()); // Parses incoming JSON payloads

// Ensure uploads folder exists and serve it statically at /uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir)); // Serve uploaded resume files

// 2. Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    
    // 4. Start Server (Only start after DB connection is successful)
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error. Please make sure MongoDB is running.');
    console.error(err);
    process.exit(1); // Exit the process with an error
  });

// 3. API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Recruitment API is running' });
});

// Import and use candidate routes
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/api/candidates', candidateRoutes); // Mount the routes

// We will import and use candidate routes here
// Example: app.use('/api/candidates', require('./routes/candidateRoutes'));