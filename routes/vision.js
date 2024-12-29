const express = require('express');
const router = express.Router();
const axios = require('axios');

// Configure express for streaming
router.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

router.post('/analyze', async (req, res) => {
    try {
        console.log('Received vision request');

        const response = await axios({
            method: 'post',
            url: `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
            data: req.body,
            headers: {
                'Content-Type': 'application/json'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            responseType: 'stream'
        });

        response.data.pipe(res);
        
        response.data.on('error', (error) => {
            console.error('Stream error:', error);
            res.status(500).json({ error: error.message });
        });

    } catch (error) {
        console.error('Vision API Error:', error.message);
        if (error.response?.data) {
            // Log the error response for debugging
            console.error('Error details:', await error.response.data.toJSON());
        }
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data
        });
    }
});

module.exports = router;