// File: routes/vision.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Remove size limits for this route specifically
router.use(express.json({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

router.post('/analyze', async (req, res) => {
    try {
        console.log('Received vision request');
        console.log('Request size:', JSON.stringify(req.body).length);
        
        // Forward the request directly to Google Vision API
        const response = await axios.post(
            `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'User-Agent': 'API-Central-Vision'
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 30000 // 30 second timeout
            }
        );

        console.log('Vision API response received');
        console.log('Response status:', response.status);
        res.json(response.data);

    } catch (error) {
        console.error('Vision API Error Details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            code: error.code
        });
        
        res.status(error.response?.status || 500).json(error.response?.data || {
            error: error.message,
            details: error.response?.data
        });
    }
});

module.exports = router;