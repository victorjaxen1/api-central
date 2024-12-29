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
        
        // Forward the request directly to Google Vision API
        const response = await axios.post(
            `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'gzip'
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        console.log('Vision API response received');
        res.json(response.data);

    } catch (error) {
        console.error('Vision API Error:', error.message);
        // Send the actual error from Google Vision API
        res.status(error.response?.status || 500).json(error.response?.data || {
            error: error.message
        });
    }
});

module.exports = router;