// File: index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'https://playcode.io',
    'https://your-frontend-domain.com', // Add your other allowed domains
    /\.vercel\.app$/ // Allows all vercel.app subdomains
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
const claudeRouter = require('./routes/claude');
const openaiRouter = require('./routes/openai');
const googleAIRouter = require('./routes/googleai');
const visionRouter = require('./routes/vision');

app.use('/api/claude', claudeRouter);
app.use('/api/openai', openaiRouter);
app.use('/api/googleai', googleAIRouter);
app.use('/api/vision', visionRouter);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});