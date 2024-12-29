const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/complete', async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    console.log('API Key present:', !!process.env.CLAUDE_API_KEY);
    
    const requestBody = {
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: req.body.messages || [],
      system: "You are a helpful AI assistant."
    };
    
    console.log('Sending to Claude:', JSON.stringify(requestBody, null, 2));

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': process.env.CLAUDE_API_KEY
        }
      }
    );

    console.log('Claude API response:', response.data);
    res.json(response.data);

  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error message:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
      details: {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      }
    });
  }
});

module.exports = router;