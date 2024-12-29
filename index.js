const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Import routes
const claudeRouter = require('./routes/claude');
const openaiRouter = require('./routes/openai');
const googleAIRouter = require('./routes/googleai');
const visionRouter = require('./routes/vision');

// Use routes
app.use('/api/claude', claudeRouter);
app.use('/api/openai', openaiRouter);
app.use('/api/googleai', googleAIRouter);
app.use('/api/vision', visionRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});