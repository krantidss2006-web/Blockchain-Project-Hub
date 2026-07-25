import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' })); // Allow large image uploads

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint to generate/edit images
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const parts: any[] = [{ text: prompt }];

    // If an image is provided, it's an edit operation
    if (imageBase64 && mimeType) {
      parts.unshift({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: { parts },
      config: {
        // Nano banana models don't support responseMimeType or responseSchema
      }
    });

    let generatedImageUrl = null;
    let generatedText = null;

    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
         if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
         } else if (part.text) {
            generatedText = part.text;
         }
      }
    }

    if (generatedImageUrl) {
      res.json({ imageUrl: generatedImageUrl, text: generatedText });
    } else {
       res.status(500).json({ error: 'No image generated', text: generatedText });
    }

  } catch (error: any) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
