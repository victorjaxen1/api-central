// File: index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Increase overall limits
app.use(express.json({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
const claudeRouter = require('./routes/claude');
const openaiRouter = require('./routes/openai');
const googleAIRouter = require('./routes/googleai');
const visionRouter = require('./routes/vision');

app.use('/api/claude', claudeRouter);
app.use('/api/openai', openaiRouter);
app.use('/api/googleai', googleAIRouter);
app.use('/api/vision', visionRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});