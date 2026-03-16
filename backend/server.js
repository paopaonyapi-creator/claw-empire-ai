const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Supabase config for JWT verification
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://orpubwckffcxvyapchqj.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// CORS
app.use(cors({
  origin: [
    'https://claw-empire-ai.surge.sh',
    'http://localhost:8800',
    'http://localhost:3000',
    'http://127.0.0.1:8800'
  ]
}));
app.use(express.json({ limit: '1mb' }));

// ===== Rate Limiter (in-memory, 30 req/min per IP) =====
const rateMap = new Map();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000; // 1 minute

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  let entry = rateMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    entry = { start: now, count: 0 };
    rateMap.set(ip, entry);
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
  }
  next();
}
// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap) {
    if (now - entry.start > RATE_WINDOW * 2) rateMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ===== Auth Middleware (verify Supabase JWT) =====
async function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token. Please log in.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    // Verify with Supabase /auth/v1/user endpoint
    const resp = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { 'Authorization': `Bearer ${token}`, 'apikey': SUPABASE_ANON_KEY }
    });
    if (!resp.ok) return res.status(401).json({ error: 'Invalid or expired token.' });
    const user = await resp.json();
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Auth verification failed.' });
  }
}

// ===== AI Provider Config =====
const PROVIDERS = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    envKey: 'OPENAI_API_KEY',
    type: 'openai'
  },
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    envKey: 'ANTHROPIC_API_KEY',
    type: 'anthropic'
  },
  nvidia: {
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama-3.3-70b-instruct',
    envKey: 'NVIDIA_KEY',
    type: 'openai'
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
    envKey: 'DEEPSEEK_KEY',
    type: 'openai'
  },
  kimi: {
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'moonshot-v1-8k',
    envKey: 'KIMI_KEY',
    type: 'openai'
  },
  gemini: {
    model: 'gemini-2.5-flash',
    envKey: 'GOOGLE_AI_KEY',
    type: 'gemini'
  }
};

// ===== Health Check =====
app.get('/', (req, res) => {
  const available = Object.entries(PROVIDERS)
    .filter(([, p]) => !!process.env[p.envKey])
    .map(([id]) => id);
  res.json({ status: 'ok', service: 'Claw-Empire API', providers: available });
});

// ===== GET /api/providers — list available providers =====
app.get('/api/providers', (req, res) => {
  const available = Object.entries(PROVIDERS)
    .filter(([, p]) => !!process.env[p.envKey])
    .map(([id, p]) => ({ id, model: p.model, type: p.type }));
  res.json({ providers: available });
});

// ===== POST /api/chat — proxy to AI provider =====
app.post('/api/chat', rateLimiter, verifyAuth, async (req, res) => {
  try {
    const { provider: requestedProvider, messages, system } = req.body;

    // Find available provider (requested or first available)
    let providerKey = requestedProvider;
    let providerConfig = providerKey ? PROVIDERS[providerKey] : null;

    if (!providerConfig || !process.env[providerConfig.envKey]) {
      // Failover: find first available
      for (const [key, p] of Object.entries(PROVIDERS)) {
        if (process.env[p.envKey]) {
          providerKey = key;
          providerConfig = p;
          break;
        }
      }
    }

    if (!providerConfig || !process.env[providerConfig.envKey]) {
      return res.status(503).json({ error: 'No AI providers configured. Set API keys in environment variables.' });
    }

    const apiKey = process.env[providerConfig.envKey];
    let aiResponse;

    if (providerConfig.type === 'gemini') {
      aiResponse = await callGemini(apiKey, providerConfig.model, messages, system);
    } else if (providerConfig.type === 'anthropic') {
      aiResponse = await callAnthropic(apiKey, providerConfig.model, messages, system);
    } else {
      aiResponse = await callOpenAICompatible(apiKey, providerConfig.endpoint, providerConfig.model, messages, system);
    }

    res.json({ response: aiResponse, provider: providerKey, model: providerConfig.model });
  } catch (err) {
    console.error('[/api/chat] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== POST /api/chat/stream — streaming SSE endpoint =====
app.post('/api/chat/stream', rateLimiter, verifyAuth, async (req, res) => {
  try {
    const { messages, system } = req.body;

    // Find available Gemini provider
    let providerKey, providerConfig;
    for (const [key, p] of Object.entries(PROVIDERS)) {
      if (p.type === 'gemini' && process.env[p.envKey]) {
        providerKey = key;
        providerConfig = p;
        break;
      }
    }
    if (!providerConfig) return res.status(503).json({ error: 'No streaming provider available' });

    const apiKey = process.env[providerConfig.envKey];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${providerConfig.model}:streamGenerateContent?alt=sse&key=${apiKey}`;

    // Build Gemini multi-turn format
    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    const body = { contents, generationConfig: { maxOutputTokens: 2048, temperature: 0.7 } };
    if (system) body.systemInstruction = { parts: [{ text: system }] };

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Provider', providerKey);
    res.setHeader('X-Model', providerConfig.model);
    res.flushHeaders();

    // Stream from Gemini
    const geminiResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!geminiResp.ok) {
      const t = await geminiResp.text();
      res.write(`data: ${JSON.stringify({ error: `${geminiResp.status}: ${t}` })}\n\n`);
      res.end();
      return;
    }

    // Pipe SSE chunks
    const reader = geminiResp.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('[/api/chat/stream] Error:', err.message);
    try { res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`); } catch(e) {}
    res.end();
  }
});

// ===== POST /api/tts — proxy to ElevenLabs =====
app.post('/api/tts', rateLimiter, verifyAuth, async (req, res) => {
  const apiKey = process.env.ELEVENLABS_KEY;
  if (!apiKey) return res.status(503).json({ error: 'ElevenLabs API key not configured' });

  try {
    const { text, voiceId } = req.body;
    const vid = voiceId || '21m00Tcm4TlvDq8ikWAM';
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } })
    });
    if (!resp.ok) throw new Error('ElevenLabs: ' + resp.status);
    const buffer = await resp.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('[/api/tts] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ===== AI Provider Implementations =====

async function callOpenAICompatible(apiKey, endpoint, model, messages, system) {
  const msgs = system ? [{ role: 'system', content: system }, ...messages] : messages;
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: msgs, max_tokens: 2048, temperature: 0.7 })
  });
  if (!resp.ok) { const t = await resp.text(); throw new Error(`${resp.status}: ${t}`); }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callAnthropic(apiKey, model, messages, system) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model, max_tokens: 2048, system: system || '', messages })
  });
  if (!resp.ok) { const t = await resp.text(); throw new Error(`${resp.status}: ${t}`); }
  const data = await resp.json();
  return data.content?.[0]?.text || '';
}

async function callGemini(apiKey, model, messages, system) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  // Build proper multi-turn conversation
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));
  const body = {
    contents,
    generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
  };
  if (system) body.systemInstruction = { parts: [{ text: system }] };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!resp.ok) { const t = await resp.text(); throw new Error(`${resp.status}: ${t}`); }
  const data = await resp.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ===== Start =====
app.listen(PORT, () => {
  const available = Object.entries(PROVIDERS).filter(([, p]) => !!process.env[p.envKey]).map(([id]) => id);
  console.log(`🚀 Claw-Empire API running on port ${PORT}`);
  console.log(`📡 Available providers: ${available.length ? available.join(', ') : 'NONE — set API keys!'}`);
});
