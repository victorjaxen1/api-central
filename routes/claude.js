const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/complete', async (req, res) => {
  try {
    // Log incoming request body for debugging
    console.log('Incoming request:', req.body);

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: req.body.messages || [],
        system: "You are a helpful AI assistant."
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': process.env.CLAUDE_API_KEY
        }
      }
    );

    // Log response for debugging
    console.log('Claude API response:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;