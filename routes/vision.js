const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/analyze', async (req, res) => {
  try {
    // Check if the image content is too large (>4MB)
    const base64Image = req.body.requests[0].image.content;
    const sizeInBytes = Buffer.from(base64Image, 'base64').length;
    
    if (sizeInBytes > 4 * 1024 * 1024) {
      return res.status(400).json({
        error: "Image size must be less than 4MB",
        sizeMB: (sizeInBytes / (1024 * 1024)).toFixed(2)
      });
    }

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        requests: [{
          image: {
            content: base64Image
          },
          features: [{
            type: 'LABEL_DETECTION',
            maxResults: 5
          }, {
            type: 'OBJECT_LOCALIZATION',
            maxResults: 5
          }]
        }]
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