import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API client safely
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Configurable APK Release Manifest
let apkManifest = {
  versionName: 'v1.0.4-preview',
  versionCode: 104,
  downloadUrl: '', // Under development until real signed build is uploaded
  fileSize: '24.8 MB',
  releaseDate: '2026-11-10',
  minimumAndroidVersion: 'Android 10.0 (API 29)',
  targetAndroidVersion: 'Android 15 (API 35)',
  architecture: 'arm64-v8a / universal',
  sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  isReleased: false,
  releaseNotes: [
    'Companion Android APK architecture and Room DB schema finalized',
    'Shared Firestore synchronization protocol matching web version',
    'Background wake-word listener (requires Accessibility & Mic permissions)',
    'Zero-cost Firebase Spark configuration support'
  ]
};

// API: Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!apiKey,
    service: 'JARVIS Master AI Ecosystem',
    timestamp: new Date().toISOString()
  });
});

// API: APK Manifest
app.get('/api/apk/manifest', (_req: Request, res: Response) => {
  res.json(apkManifest);
});

app.post('/api/apk/manifest', (req: Request, res: Response) => {
  const updates = req.body;
  apkManifest = { ...apkManifest, ...updates };
  res.json({ success: true, manifest: apkManifest });
});

// API: Gemini Chat Endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { prompt, history = [], userPreferences = {}, memories = [] } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt parameter' });
  }

  const assistantName = userPreferences.assistantName || 'JARVIS';
  const preferredName = userPreferences.preferredName || 'Sir';
  const personality = userPreferences.personality || 'professional';
  const language = userPreferences.language || 'English';

  // Format memories for context injection
  const memoryContext = memories.length > 0
    ? memories.slice(0, 15).map((m: { category: string; title: string; content: string }) => 
        `[Memory - Category: ${m.category}] ${m.title}: ${m.content}`
      ).join('\n')
    : 'No active long-term memories stored yet.';

  const systemInstruction = `You are ${assistantName}, the ultra-advanced, cinematic personal AI assistant inspired by Tony Stark's JARVIS.
You are running as the command core of the user's personal AI ecosystem.
Address the user respectfully as "${preferredName}" unless instructed otherwise.

PERSONALITY & TONE:
- Current mode: ${personality}
- Sophisticated, polite, razor-sharp, calm, highly capable, and cinematic.
- Natural speech: seamless, concise, and direct. Avoid rambling or generic assistant clichés.
- Multilingual capability: Fluently converse in English, Hindi, and natural Hinglish. If the user addresses you in Hindi or Hinglish, respond naturally in matching Hinglish/Hindi with cinematic British-Indian suave (e.g., "Haan ${preferredName}, main aapke study project ka status nikal raha hoon.").
- Preferred base language: ${language}.

AUTHORIZED LONG-TERM USER MEMORIES:
${memoryContext}

CRITICAL RULES:
1. Always consult the AUTHORIZED LONG-TERM USER MEMORIES above when the user asks about their projects, preferences, routines, or past notes.
2. If the user asks about an authorized project or memory, confirm what you recall accurately and concisely based on the stored data.
3. If an item is NOT in memory or not available, truthfully state: "I don't have that specific record in my memory banks yet, ${preferredName}. Would you like me to save it?" Never hallucinate fake memories.
4. If the user explicitly asks you to remember something (e.g. "Remember that my exam is on Monday" or "Save this note"), acknowledge that you will store it in memory.
5. Keep verbal responses punchy and suitable for voice synthesis (TTS).`;

  try {
    if (!ai) {
      // Graceful fallback if GEMINI_API_KEY is not supplied in dev
      return res.json({
        text: `Greetings, ${preferredName}. My local core is operational, though cloud neural channels are awaiting an active API key. I am monitoring your local dashboard and memory cache.`,
        suggestedAction: null
      });
    }

    // Format chat history for Gemini API
    const formattedContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    for (const msg of history.slice(-8)) {
      formattedContents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Append current user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    let replyText = '';
    let succeeded = false;

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Gateway Timeout')), 6000)
      );

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      });

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      if (response && response.text) {
        replyText = response.text;
        succeeded = true;
      }
    } catch (modelErr: any) {
      console.warn('Gemini 3.8 call fallback:', modelErr.message);
    }

    // High-intelligence Local Fallback Engine if cloud models hit temporary 503 or quota limits
    if (!succeeded || !replyText) {
      const lower = prompt.toLowerCase();
      const isHinglish = lower.includes('kya') || lower.includes('yaad') || lower.includes('hai') || lower.includes('batao') || lower.includes('karo');
      const projectMem = memories.find((m: any) => m.category === 'Projects' || m.title.toLowerCase().includes('project'));

      if (lower.includes('project') || lower.includes('study') || lower.includes('nexora')) {
        if (projectMem) {
          replyText = isHinglish
            ? `Haan ${preferredName}, mujhe aapka ${projectMem.title} bilkul yaad hai: "${projectMem.content}". Aap chahein toh main iski details display kar sakta hoon.`
            : `Yes, ${preferredName}. I recall your authorized memory for ${projectMem.title}: "${projectMem.content}". All operational milestones are standing by.`;
        } else {
          replyText = isHinglish
            ? `Abhi authorized memory banks mein koi project recorded nahi hai, ${preferredName}. Kya main isse nayi memory ki tarah save karu?`
            : `I do not find any active project records in your authorized memory archives, ${preferredName}. Would you like me to register a new one?`;
        }
      } else if (lower.includes('status') || lower.includes('diagnostic') || lower.includes('system')) {
        replyText = isHinglish
          ? `Systems operational hain, ${preferredName}. Arc Reactor status optimal hai aur memory vault active hai.`
          : `All primary systems nominal, ${preferredName}. Arc Reactor energy core stable and authorized memories synchronized.`;
      } else if (lower.includes('who are you') || lower.includes('tum kaun ho')) {
        replyText = isHinglish
          ? `Main ${assistantName} hoon, aapka personal futuristic AI assistant. Bataiye ${preferredName}, main aapki kya madad karu?`
          : `I am ${assistantName}, your personal AI command core. How may I direct our resources today, ${preferredName}?`;
      } else {
        replyText = isHinglish
          ? `Understood, ${preferredName}. Aapka query note kar liya gaya hai. Local neural core online hai.`
          : `Understood, ${preferredName}. Processing query through authorized ecosystem nodes. Systems standing by.`;
      }
    }

    // Detect if prompt implies an action
    let suggestedAction = null;
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('remember') || lowerPrompt.includes('save note') || lowerPrompt.includes('yaad rakhna')) {
      suggestedAction = { type: 'CREATE_MEMORY', text: prompt };
    } else if (lowerPrompt.includes('project') || lowerPrompt.includes('study')) {
      suggestedAction = { type: 'QUERY_PROJECT', text: prompt };
    } else if (lowerPrompt.includes('status') || lowerPrompt.includes('diagnostic')) {
      suggestedAction = { type: 'SYSTEM_DIAGNOSTIC' };
    }

    res.json({
      text: replyText,
      suggestedAction,
      cloudSynced: succeeded
    });
  } catch (err: any) {
    console.error('Error in /api/gemini/chat:', err);
    res.json({
      text: `Systems standing by, ${preferredName}. Operating from authorized local memory banks.`,
      suggestedAction: null,
      cloudSynced: false
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`JARVIS Command Core active on port ${PORT}`);
  });
}

startServer();
