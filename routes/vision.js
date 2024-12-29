const express = require('express');
const router = express.Router();
const axios = require('axios');

// Configure route-specific parser
router.use(express.json({
    limit: '50mb',
    extended: true,
    parameterLimit: 100000
}));

router.post('/analyze', async (req, res) => {
    try {
        console.log('Received vision request');
        
        // Ensure we have a valid request body
        if (!req.body || !req.body.requests) {
            return res.status(400).json({ error: 'Invalid request format' });
        }

        // Make request to Vision API
        const visionResponse = await axios({
            method: 'post',
            url: `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
            data: req.body,
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip'
            },
            // Handle large responses
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            // Don't use streaming for Vercel
            timeout: 30000 // 30 second timeout
        });

        // Send response directly
        return res.json(visionResponse.data);

    } catch (error) {
        console.error('Vision API Error:', error.message);
        
        // Enhanced error logging
        if (error.response) {
            console.error('Error Response:', {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });
        }

        // Send appropriate error response
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || 'Internal server error'
        });
    }
});

module.exports = router;