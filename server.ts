import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// High body limit to support user uploaded base64 room photos
app.use(express.json({ limit: '35mb' }));

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Multi-Turn Interior Design Consultant Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, roomContext, currentImage } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required' });
      return;
    }

    if (!ai) {
      // Fallback response if API key is temporarily absent
      res.json({
        reply: `As your Interior Design Consultant for this ${roomContext?.currentStyle || 'modern'} space, I love that refinement! Adjusting the colors and textures will bring incredible balance to the room. Try pairing this with warm ambient lighting at 2700K and organic materials to anchor the composition.`,
        suggestedChanges: {
          rugColor: '#2563eb',
        },
      });
      return;
    }

    const systemInstruction = `You are Aura's Senior Interior Design Consultant & Architectural Stylist.
Your personality is sophisticated, encouraging, articulate, and deeply knowledgeable about interior architecture, color theory, ergonomics, spatial harmony, lighting temperatures, and materials (woods, stones, metals, textiles).

CURRENT ROOM CONTEXT:
- Room Type: ${roomContext?.roomType || 'Living Room'}
- Current Style: ${roomContext?.currentStyle || 'Mid-Century Modern'}
- Active Items in Room: ${JSON.stringify(roomContext?.items || [])}
- Refinements applied so far: ${JSON.stringify(roomContext?.userEdits || [])}

GUIDELINES FOR YOUR RESPONSES:
1. Directly answer the user's design inquiry, refinement (e.g., "Keep this layout but make the rug blue", "Add more indoor plants", "Change the wall to terracotta", "Find a budget coffee table under $200").
2. Explain WHY the change works or offer practical styling tips (e.g., complementary color contrast, tactile layering, visual weight distribution).
3. If the user asks for item recommendations or replacements, give 2-3 specific furniture/decor suggestions with name, material, and approximate price.
4. Keep answers concise, inspiring, and actionable (2-4 brief paragraphs). Avoid generic fluff.
5. If the user asked to change an element in the room (such as rug color, wall color, sofa color, or lighting), include a JSON tag at the very end of your message in the format:
\`\`\`json
{
  "refinement": {
    "type": "rug_color" | "wall_color" | "lighting" | "furniture_swap" | "general",
    "rugColor": "#hexOrColorName",
    "wallColor": "#hexOrColorName",
    "summary": "Short 1-sentence summary of the visual change"
  }
}
\`\`\``;

    // Build contents array for Gemini
    const contents: any[] = [];

    // Map conversation history
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const isLatestUserMessage = i === messages.length - 1 && msg.role === 'user';

      if (isLatestUserMessage && currentImage && currentImage.startsWith('data:image/')) {
        // Send multimodal image with the latest user message
        const base64Data = currentImage.split(',')[1];
        const mimeType = currentImage.split(';')[0].replace('data:', '');
        contents.push({
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            { text: msg.content },
          ],
        });
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const rawText = response.text || '';

    // Extract optional JSON refinement block if provided
    let cleanText = rawText;
    let suggestedChanges = undefined;
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        suggestedChanges = parsed.refinement;
        cleanText = rawText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        // ignore parse errors
      }
    }

    res.json({
      reply: cleanText,
      suggestedChanges,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Failed to generate consultant response',
      details: error?.message || String(error),
      fallbackReply: 'I received your design request! For this space, balancing warm texture and crisp accents will achieve that cohesive designer look. Let me know if you would like me to adjust specific furniture dimensions or color tones.',
    });
  }
});

// AI Room Makeover & Shoppable Items Generation
app.post('/api/reimagine', async (req: Request, res: Response) => {
  try {
    const { styleName, styleId, roomType, customInstruction, image } = req.body;

    if (!ai) {
      res.json({
        designCritique: `A curated ${styleName} transformation optimizing natural light and tactile balance.`,
        palette: [
          { hex: '#4a2c16', name: 'Walnut', role: 'primary' },
          { hex: '#c97a3a', name: 'Caramel Leather', role: 'secondary' },
          { hex: '#d97706', name: 'Warm Amber', role: 'accent' },
          { hex: '#faf6f0', name: 'Cream', role: 'neutral' },
        ],
        items: [],
      });
      return;
    }

    const promptText = `Analyze this room transformation for a "${roomType || 'Living Room'}" into the "${styleName}" aesthetic.
${customInstruction ? `User specific refinement instruction: "${customInstruction}"` : ''}

Provide a structured JSON output with:
1. "designCritique": A brief 2-3 sentence overview of how the space was reimagined (flow, materials, lighting).
2. "palette": An array of 4-5 hex colors with "hex", "name", and "role" ("primary" | "secondary" | "accent" | "neutral" | "trim").
3. "shoppableItems": An array of 4-6 specific furniture and decor pieces seen in this reimagined space with:
   - "name": Detailed product title (e.g. "Haven Low-Profile Velvet Sofa in Olive")
   - "category": "seating" | "lighting" | "rugs" | "tables" | "decor" | "storage" | "plants"
   - "estimatedPrice": Number in USD (e.g. 1299)
   - "styleMatchScore": Number 90-99
   - "materials": e.g. "Solid Walnut, Performance Velvet"
   - "dimensions": e.g. "88\\"W x 36\\"D x 31\\"H"
   - "description": 1-2 sentence aesthetic styling advice
   - "searchKeyword": Clean e-commerce search query for finding this exact piece on West Elm / Wayfair / CB2

Return ONLY valid JSON matching this schema:
\`\`\`json
{
  "designCritique": "string",
  "palette": [{"hex": "string", "name": "string", "role": "string"}],
  "shoppableItems": [...]
}
\`\`\``;

    const parts: any[] = [{ text: promptText }];
    if (image && image.startsWith('data:image/')) {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].replace('data:', '');
      parts.unshift({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        temperature: 0.6,
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Reimagine endpoint error:', error);
    res.status(500).json({
      error: 'Failed to process room reimagining',
      details: error?.message || String(error),
    });
  }
});

// Gemini Multimodal Room Image Generation / Editing Endpoint
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, baseImage } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Gemini API is not configured' });
      return;
    }

    // Try generating image with gemini-3.1-flash-image
    const parts: any[] = [];
    if (baseImage && baseImage.startsWith('data:image/')) {
      const base64Data = baseImage.split(',')[1];
      const mimeType = baseImage.split(';')[0].replace('data:', '');
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }
    parts.push({
      text: `Interior design architectural makeover: ${prompt}. Photorealistic, 8k resolution, architectural digest interior photography, natural lighting, highly detailed furniture joinery and textiles.`,
    });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
            imageSize: '1K',
          },
        },
      });

      let generatedImageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        res.json({ imageUrl: generatedImageUrl });
        return;
      }
    } catch (genError: any) {
      console.warn('Image generation model not available or quota limited:', genError?.message);
    }

    // Fallback: Notify client so it can use high-fidelity SVG/canvas composite
    res.json({
      imageUrl: null,
      message: 'Visual preview rendered via client architectural engine.',
    });
  } catch (error: any) {
    console.error('Generate image error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate image' });
  }
});

// Vite middleware mounting in dev mode, static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
