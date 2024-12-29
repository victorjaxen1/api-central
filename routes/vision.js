const express = require('express');
const router = express.Router();
const axios = require('axios');

// Set body size limit for this route
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: true }));

router.post('/analyze', async (req, res) => {
    try {
        const response = await axios.post(
            `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Encoding': 'identity'
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Vision API Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;