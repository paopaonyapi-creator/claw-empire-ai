// ===== Chat / $ Command System — Multi-AI Integration (6 Providers) + TTS =====
let selectedChatAgent = null;
let currentAudioPlayer = null; // Track playing audio for TTS

// Backend API proxy URL (Railway) — if set, API keys are hidden server-side
const BACKEND_URL = 'https://claw-empire-api-production.up.railway.app';
let _backendAvailable = null; // cache: true/false/null(unknown)

// Provider registry: priority order
const AI_PROVIDERS = [
  { key: 'OPENAI_API_KEY',    name: 'OpenAI',    icon: '🟢', label: 'GPT-4o',      model: 'gpt-4o-mini',                              endpoint: 'https://api.openai.com/v1/chat/completions',             type: 'openai' },
  { key: 'ANTHROPIC_API_KEY', name: 'Claude',     icon: '🟠', label: 'Sonnet',      model: 'claude-sonnet-4-20250514',                  endpoint: 'https://api.anthropic.com/v1/messages',                  type: 'anthropic' },
  { key: 'NVIDIA_KEY',        name: 'NVIDIA',     icon: '⚡', label: 'Nemotron',     model: 'meta/llama-3.3-70b-instruct',               endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',   type: 'nvidia' },
  { key: 'DEEPSEEK_KEY',      name: 'DeepSeek',   icon: '🟣', label: 'DeepSeek',     model: 'deepseek-chat',                             endpoint: 'https://api.deepseek.com/chat/completions',              type: 'deepseek' },
  { key: 'KIMI_KEY',          name: 'Kimi',       icon: '🟡', label: 'Moonshot',     model: 'moonshot-v1-8k',                            endpoint: 'https://api.moonshot.cn/v1/chat/completions',            type: 'kimi' },
  { key: 'GOOGLE_AI_KEY',     name: 'Gemini',     icon: '🔵', label: 'Gemini 2.5',   model: 'gemini-2.5-flash',                          endpoint: null,                                                     type: 'gemini' },
];

// Check if backend proxy has any providers configured
async function checkBackendProviders() {
  if (!BACKEND_URL) return [];
  try {
    const r = await fetch(BACKEND_URL + '/api/providers', { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return [];
    const data = await r.json();
    _backendAvailable = data.providers && data.providers.length > 0;
    return data.providers || [];
  } catch { _backendAvailable = false; return []; }
}

// Call AI via backend proxy
async function callBackendProxy(systemPrompt, userText, agent) {
  // Build conversation history (last 10 messages for context)
  const messages = [];
  if (agent) {
    const history = Store.get('messages')
      .filter(m => (m.from === agent.id || m.to === agent.id) && !m.isTyping)
      .slice(-10);
    history.forEach(m => {
      messages.push({
        role: m.from === 'ceo' ? 'user' : 'assistant',
        content: m.text
      });
    });
  }
  // Always end with the current user message
  if (!messages.length || messages[messages.length - 1].content !== userText) {
    messages.push({ role: 'user', content: userText });
  }
  // Get auth token from Supabase session
  const headers = { 'Content-Type': 'application/json' };
  if (window.supabaseClient) {
    try {
      const { data: { session } } = await window.supabaseClient.auth.getSession();
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
    } catch(e) {}
  }
  const resp = await fetch(BACKEND_URL + '/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, system: systemPrompt })
  });
  if (!resp.ok) { const t = await resp.text(); throw new Error(`Backend: ${resp.status} ${t}`); }
  const data = await resp.json();
  return data;
}

function getActiveAIProvider() {
  // Backend proxy counts as a provider
  if (_backendAvailable) return { name: 'Backend', icon: '🚀', label: 'Railway', type: 'backend' };
  for (const p of AI_PROVIDERS) {
    const k = localStorage.getItem('api_' + p.key);
    if (k) return { ...p, apiKey: k };
  }
  return null;
}

function getAllAvailableProviders() {
  return AI_PROVIDERS.filter(p => localStorage.getItem('api_' + p.key))
    .map(p => ({ ...p, apiKey: localStorage.getItem('api_' + p.key) }));
}

// Multi-AI Failover: try backend first, then local keys
async function callAIWithFailover(systemPrompt, userText, agent) {
  // 1. Try backend proxy first
  if (BACKEND_URL) {
    try {
      if (_backendAvailable === null) await checkBackendProviders();
      if (_backendAvailable) {
        const data = await callBackendProxy(systemPrompt, userText, agent);
        console.log(`🚀 Backend proxy → ${data.provider} (${data.model})`);
        return { response: data.response, provider: { name: data.provider, icon: '🚀', label: data.model, type: 'backend' }, failovers: 0 };
      }
    } catch (err) {
      console.log(`🔄 🚀 Backend failed: ${err.message}, trying local keys...`);
    }
  }

  // 2. Fallback: direct API calls with local keys
  const providers = getAllAvailableProviders();
  if (providers.length === 0) return null;

  let lastError = null;
  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    try {
      let response;
      if (provider.type === 'gemini') {
        response = await callGeminiAPI(provider.apiKey, systemPrompt, userText, agent);
      } else if (provider.type === 'anthropic') {
        response = await callAnthropicAPI(provider, systemPrompt, userText, agent);
      } else {
        response = await callOpenAICompatibleAPI(provider, systemPrompt, userText, agent);
      }
      return { response, provider, failovers: i };
    } catch (err) {
      lastError = err;
      console.log(`🔄 ${provider.icon} ${provider.name} failed: ${err.message}, trying next...`);
    }
  }
  throw lastError || new Error('All AI providers failed');
}

// Initialize: check backend availability
if (BACKEND_URL) checkBackendProviders().then(p => {
  if (p.length) console.log(`🚀 Backend proxy active: ${p.map(x => x.id).join(', ')}`);
  else console.log('ℹ️ Backend has no providers, using local API keys');
});

function getAIModelLabel(modelId) {
  const p = AI_PROVIDERS.find(x => x.type === modelId);
  return p ? `${p.icon} ${p.label}` : modelId;
}

function renderChat() {
  const agents = Store.get('agents');
  const messages = Store.get('messages');
  if (!selectedChatAgent && agents.length) selectedChatAgent = agents[0].id;

  const agentMsgs = messages.filter(m => m.from === selectedChatAgent || m.to === selectedChatAgent);
  const currentAgent = Store.getAgent(selectedChatAgent);
  const provider = getActiveAIProvider();
  const hasApiKey = !!provider;
  const activeAI = provider?.name || null;
  const aiIcon = provider?.icon || '💬';
  const aiLabel = provider?.label || '';

  document.getElementById('tab-chat').innerHTML = `
    <div class="chat-container">
      <div class="chat-sidebar">
        <div style="padding:14px;border-bottom:1px solid var(--border)">
          <h3 style="font-size:14px;font-weight:700;margin-bottom:8px">💬 Agent Channels</h3>
          <input class="form-input" style="padding:7px 10px;font-size:12px" placeholder="Search..." 
                 oninput="filterChatAgents(this.value)" id="chatAgentSearch" />
        </div>
        <div style="flex:1;overflow-y:auto;padding:8px" id="chatAgentList">
          ${renderChatAgentList(agents, messages)}
        </div>
      </div>

      <div class="chat-main">
        <div class="chat-header-bar">
          ${currentAgent ? renderAgentAvatar(currentAgent, 32) : ''}
          <div>
            <div style="font-weight:700;font-size:14px">${currentAgent?.name || 'Select Agent'}</div>
            <div style="font-size:11px;color:var(--text-muted)">${currentAgent ? `${Store.getDeptInfo(currentAgent.department)?.name || ''} · ${currentAgent.status}` : ''}</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px;align-items:center">
            ${hasApiKey ? `<span class="tag tag-success" style="font-size:10px">${aiIcon} ${activeAI} AI Active</span>` : '<span class="tag tag-muted" style="font-size:10px">💤 Simulated</span>'}
            <button class="btn btn-sm" onclick="clearChatHistory()">🗑️</button>
            <button class="btn btn-sm" onclick="showToast('Report requested','info')">📄 Report</button>
            <button class="btn btn-sm" onclick="showToast('Meeting scheduled','info')">📅 Meeting</button>
          </div>
        </div>

        <div class="chat-messages" id="chatMessages">
          <div style="text-align:center;padding:20px">
            <div style="font-size:32px;margin-bottom:8px">${hasApiKey ? aiIcon : '💬'}</div>
            <div style="font-size:12px;color:var(--text-muted)">
              ${hasApiKey 
                ? `<span style="color:var(--success);font-weight:600">${activeAI} AI Connected!</span> — Responses powered by ${activeAI} (${aiLabel})`
                : `Use <code style="background:var(--bg-input);padding:2px 6px;border-radius:4px;font-family:var(--font-mono)">$ command</code> to send CEO directives`
              }
            </div>
            ${!hasApiKey ? `<div style="margin-top:8px;font-size:11px;color:var(--text-muted)">💡 Add API Key in <a href="#" onclick="activeSettingsTab='api';document.querySelectorAll('.nav-item')[9]?.click()" style="color:var(--accent-light)">Settings → API Keys</a> for real AI responses (OpenAI, NVIDIA, DeepSeek, Kimi, or Gemini)</div>` : ''}
          </div>
          ${agentMsgs.map(msg => {
            const isCeo = msg.from === 'ceo';
            return `<div class="chat-message ${isCeo ? 'sent' : 'received'} ${msg.isTyping ? 'typing' : ''}">
              ${!isCeo && currentAgent ? renderAgentAvatar(currentAgent, 28) : ''}
              <div>
                <div class="chat-bubble ${msg.isError ? 'error-bubble' : ''}">${formatChatMessage(msg.text)}</div>
                <div style="font-size:9px;color:var(--text-muted);margin-top:4px;${isCeo ? 'text-align:right' : ''};display:flex;align-items:center;gap:6px">
                  ${msg.isTyping ? '<span class="typing-indicator">⏳ AI thinking...</span>' : formatTime(msg.ts)}
                  ${msg.aiPowered ? ` · <span style="color:var(--success)">${getAIModelLabel(msg.aiModel)}</span>` : ''}
                  ${msg.aiPowered && !msg.isTyping ? `<button class="tts-btn" id="tts-${msg.id}" onclick="speakMessage('${msg.id}', '${msg.from}')" title="ฟังเสียง">🔊</button>` : ''}
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>

        <div class="chat-input-area">
          <div class="chat-input-wrapper">
            <div style="display:flex;gap:6px;align-items:center">
              <button class="btn btn-sm" id="voiceMicBtn" onclick="toggleVoiceInput()" title="🎤 สั่งงานด้วยเสียง" style="font-size:16px;padding:6px 10px">🎤</button>
              <input class="chat-input" id="chatInput" placeholder="${hasApiKey ? `💬 Ask ${activeAI} AI anything or $ command...` : '$ type a command or message...'}"
                onkeydown="if(event.key==='Enter' && !event.shiftKey)sendChatMessage()" style="flex:1" />
            </div>
            <div class="chat-input-hints">
              <span class="chat-hint" onclick="insertQuickCommand('$ status report')">📊 Status</span>
              <span class="chat-hint" onclick="insertQuickCommand('$ security scan')">🛡️ Security</span>
              <span class="chat-hint" onclick="insertQuickCommand('$ code review')">🔍 Review</span>
              <span class="chat-hint" onclick="startAgentToAgentChat()" style="background:rgba(99,102,241,0.15);color:var(--accent-light)">🤖↔🤖 Agent Chat</span>
              <span class="chat-hint" onclick="generateSmartReplies()" style="background:rgba(34,197,94,0.15);color:#22c55e">💡 Smart Reply</span>
            </div>
            <div id="smartReplyContainer" style="display:none;margin-top:6px"></div>
          </div>
          <button class="btn btn-primary" onclick="sendChatMessage()" id="chatSendBtn">Send</button>
        </div>
      </div>
    </div>`;

  const msgArea = document.getElementById('chatMessages');
  if (msgArea) msgArea.scrollTop = msgArea.scrollHeight;
}

function renderChatAgentList(agents, messages) {
  return agents.map(a => {
    const isActive = a.id === selectedChatAgent;
    const agentMsgs = messages.filter(m => m.from === a.id || m.to === a.id);
    const lastMsg = agentMsgs[agentMsgs.length - 1];
    const unread = agentMsgs.filter(m => m.from === a.id && !m.read).length;
    return `<div class="chat-agent-item ${isActive ? 'active' : ''}" onclick="selectedChatAgent='${a.id}';renderChat()">
      ${renderAgentAvatar(a, 32)}
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;display:flex;justify-content:space-between">
          ${a.name} ${unread > 0 ? `<span class="chat-unread">${unread}</span>` : ''}
        </div>
        <div style="font-size:10px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${lastMsg ? lastMsg.text.substring(0, 30) + '...' : 'No messages'}
        </div>
      </div>
      ${renderStatusTag(a.status)}
    </div>`;
  }).join('');
}

function filterChatAgents(query) {
  const agents = Store.get('agents').filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.department.toLowerCase().includes(query.toLowerCase())
  );
  const messages = Store.get('messages');
  document.getElementById('chatAgentList').innerHTML = renderChatAgentList(agents, messages);
}

function insertQuickCommand(cmd) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = cmd; input.focus(); }
}

function clearChatHistory() {
  if (!confirm('Clear all messages with this agent?')) return;
  Store.update('messages', msgs => msgs.filter(m => m.from !== selectedChatAgent && m.to !== selectedChatAgent));
  showToast('Chat cleared 🗑️', 'info');
  renderChat();
}

function formatChatMessage(text) {
  // Simple markdown-ish formatting
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="chat-code-block"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input?.value?.trim();
  if (!text || !selectedChatAgent) return;

  const isCommand = text.startsWith('$');

  // Add user message
  Store.update('messages', msgs => [...msgs,
    { id: generateId(), from: 'ceo', to: selectedChatAgent, text, type: isCommand ? 'command' : 'message', ts: Date.now() }
  ]);
  input.value = '';
  renderChat();

  const agent = Store.getAgent(selectedChatAgent);
  const provider = getActiveAIProvider();

  if (provider) {
    // ===== REAL AI RESPONSE WITH FAILOVER =====
    const typingId = generateId();
    Store.update('messages', msgs => [...msgs,
      { id: typingId, from: selectedChatAgent, to: 'ceo', text: `${provider.icon} ${provider.label} thinking...`, type: 'response', ts: Date.now(), isTyping: true }
    ]);
    renderChat();

    try {
      const systemPrompt = buildAgentSystemPrompt(agent, isCommand, text);
      const result = await callAIWithFailover(systemPrompt, text, agent);

      // Show failover info if it switched providers
      const failoverNote = result.failovers > 0
        ? `\n\n_🔄 Auto-failover: ${result.failovers} provider(s) skipped → ${result.provider.icon} ${result.provider.name}_`
        : '';

      // Replace typing indicator with real response
      Store.update('messages', msgs => {
        const filtered = msgs.filter(m => m.id !== typingId);
        return [...filtered, {
          id: generateId(),
          from: selectedChatAgent,
          to: 'ceo',
          text: result.response + failoverNote,
          type: 'response',
          ts: Date.now(),
          aiPowered: true,
          aiModel: result.provider.type,
        }];
      });

      // Update agent XP
      Store.update('agents', agents => agents.map(a =>
        a.id === selectedChatAgent ? { ...a, xp: (a.xp || 0) + 10 } : a
      ));

    } catch (error) {
      // All providers failed — Replace typing with error
      Store.update('messages', msgs => {
        const filtered = msgs.filter(m => m.id !== typingId);
        return [...filtered, {
          id: generateId(),
          from: selectedChatAgent,
          to: 'ceo',
          text: `❌ All AI providers failed: ${error.message}\n\nFalling back to simulated response...`,
          type: 'response',
          ts: Date.now(),
          isError: true,
        }];
      });
    }
  } else {
    // ===== SIMULATED RESPONSE =====
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
    const responses = [
      `✅ Understood! Processing your request...`,
      `🔄 Working on it now. Estimated completion: 15 minutes.`,
      `📊 Analysis started. I'll update you with results shortly.`,
      `🛠️ Executing command. Check the Kanban board for task updates.`,
      `✨ Task initiated successfully! You can track progress in the dashboard.`,
    ];
    Store.update('messages', msgs => [...msgs,
      { id: generateId(), from: selectedChatAgent, to: 'ceo', text: randomChoice(responses), type: 'response', ts: Date.now() }
    ]);
  }

  renderChat();
}

function buildAgentSystemPrompt(agent, isCommand, userText) {
  const dept = Store.getDeptInfo(agent.department);
  return `You are "${agent.name}", a Level ${agent.level} AI agent working in the "${dept?.name || agent.department}" department at Claw-Empire AI Corp.

Your role and personality:
- Department: ${dept?.name || agent.department}
- Specialization: ${agent.skills?.join(', ') || 'General AI assistant'}
- Provider: ${agent.provider || 'AI'}
- Level: ${agent.level} (XP: ${agent.xp}/${agent.level * 1000})
- Tasks Completed: ${agent.tasksCompleted || 0}
- Current Status: ${agent.status}

Guidelines:
- You respond as a professional AI team member reporting to the CEO.
- Keep responses concise (2-4 paragraphs max) but informative.
- Use emojis sparingly for clarity (✅ ❌ 📊 🔍 etc).
- If it's a $ command, treat it as a direct CEO instruction and confirm execution steps.
- If it's a general message, have a natural conversation relevant to your department.
- Provide actionable insights and specific technical details when relevant.
- Format important information with **bold** and \`code\` markdown.
- If asked for code, use \`\`\`language blocks.
- Respond in the same language the user writes in (if Thai, respond in Thai).`;
}

async function callGeminiAPI(apiKey, systemPrompt, userMessage, agent) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // Build conversation history (last 10 messages for context)
  const messages = agent ? Store.get('messages')
    .filter(m => (m.from === agent.id || m.to === agent.id) && !m.isTyping)
    .slice(-10) : [];

  const contents = [];

  // Add conversation history
  messages.forEach(msg => {
    if (msg.from === 'ceo') {
      contents.push({ role: 'user', parts: [{ text: msg.text }] });
    } else if (!msg.isTyping && !msg.isError) {
      contents.push({ role: 'model', parts: [{ text: msg.text }] });
    }
  });

  // Add current message
  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response generated. The model may have been blocked by safety filters.');
  }

  return text;
}

// ===== Universal OpenAI-Compatible API Caller =====
// Works with: OpenAI, NVIDIA NIM, DeepSeek, Kimi/Moonshot
async function callOpenAICompatibleAPI(provider, systemPrompt, userMessage, agent) {
  const directUrl = provider.endpoint;

  // Build conversation history
  const msgs = agent ? Store.get('messages')
    .filter(m => (m.from === agent.id || m.to === agent.id) && !m.isTyping)
    .slice(-10) : [];

  const chatMessages = [
    { role: 'system', content: systemPrompt },
  ];

  msgs.forEach(msg => {
    if (msg.from === 'ceo') {
      chatMessages.push({ role: 'user', content: msg.text });
    } else if (!msg.isTyping && !msg.isError) {
      chatMessages.push({ role: 'assistant', content: msg.text });
    }
  });

  chatMessages.push({ role: 'user', content: userMessage });

  const body = {
    model: provider.model,
    messages: chatMessages,
    temperature: 0.8,
    max_tokens: 1024,
    top_p: 0.95,
    stream: false,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${provider.apiKey}`,
  };

  // Try CORS proxy first (most APIs block browser CORS), then direct
  const urls = [
    `https://corsproxy.io/?url=${encodeURIComponent(directUrl)}`,
    directUrl,
  ];

  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error(`No response from ${provider.name}.`);
      }

      return text;
    } catch (err) {
      lastError = err;
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('CORS') && !err.message.includes('Load failed')) {
        throw err;
      }
      console.log(`${provider.name} call via ${url.substring(0,50)}... failed, trying next...`, err.message);
    }
  }
  throw lastError || new Error(`${provider.name} API call failed — check your API key or network`);
}

// ===== Anthropic Claude API =====
async function callAnthropicAPI(provider, systemPrompt, userMessage, agent) {
  const directUrl = provider.endpoint;

  const msgs = agent ? Store.get('messages')
    .filter(m => (m.from === agent.id || m.to === agent.id) && !m.isTyping)
    .slice(-10) : [];

  const chatMessages = [];
  msgs.forEach(msg => {
    if (msg.from === 'ceo') {
      chatMessages.push({ role: 'user', content: msg.text });
    } else if (!msg.isTyping && !msg.isError) {
      chatMessages.push({ role: 'assistant', content: msg.text });
    }
  });
  chatMessages.push({ role: 'user', content: userMessage });

  const body = {
    model: provider.model,
    max_tokens: 1024,
    system: systemPrompt,
    messages: chatMessages,
  };

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': provider.apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  };

  // Try CORS proxy first, then direct
  const urls = [
    `https://corsproxy.io/?url=${encodeURIComponent(directUrl)}`,
    directUrl,
  ];

  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text;

      if (!text) {
        throw new Error('No response from Claude.');
      }

      return text;
    } catch (err) {
      lastError = err;
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('CORS') && !err.message.includes('Load failed')) {
        throw err;
      }
      console.log(`Claude call via ${url.substring(0,50)}... failed, trying next...`, err.message);
    }
  }
  throw lastError || new Error('Claude API call failed — check your API key or network');
}

// ===== Text-to-Speech (Browser Built-in + ElevenLabs Premium) =====
// Agent voice personalities for browser TTS
const AGENT_VOICE_SETTINGS = {
  'default':  { pitch: 1.0, rate: 1.0, gender: 'male',   name: 'Agent' },
  'vector':   { pitch: 0.9, rate: 1.0, gender: 'male',   name: 'Vector' },
  'cipher':   { pitch: 0.7, rate: 0.9, gender: 'male',   name: 'Cipher' },
  'pixel':    { pitch: 1.3, rate: 1.1, gender: 'female', name: 'Pixel' },
  'nova':     { pitch: 1.2, rate: 1.0, gender: 'female', name: 'Nova' },
  'sage':     { pitch: 1.0, rate: 1.05, gender: 'male',  name: 'Sage' },
  'qubit':    { pitch: 0.8, rate: 0.95, gender: 'male',  name: 'Qubit' },
  'atlas':    { pitch: 0.75, rate: 1.0, gender: 'male',  name: 'Atlas' },
  'phoenix':  { pitch: 0.85, rate: 1.05, gender: 'male', name: 'Phoenix' },
};

// ElevenLabs premium voice IDs (optional)
const ELEVENLABS_VOICES = {
  'default': 'nPczCjzI2devNBz1zQrb', 'vector': 'nPczCjzI2devNBz1zQrb',
  'cipher': 'pNInz6obpgDQGcFmaJgB', 'pixel': 'XB0fDUnXU5powFXDhCwa',
  'nova': 'Xb7hH8MSUJpSbSDYk0k2', 'sage': 'iP95p4xoKVk53GoZ742B',
  'qubit': 'onwK4e9ZLuTAKqWW03F9', 'atlas': 'N2lVS1w4EtoT3dr4eOWO',
  'phoenix': 'IKne3meq5aSn9XLyUdCD',
};

function getAgentVoiceSettings(agentId) {
  const agent = Store.getAgent(agentId);
  const name = agent?.name?.toLowerCase() || '';
  return AGENT_VOICE_SETTINGS[name] || AGENT_VOICE_SETTINGS['default'];
}

async function speakMessage(msgId, agentId) {
  const btn = document.getElementById('tts-' + msgId);

  // If already playing, stop
  if (currentAudioPlayer || window.speechSynthesis?.speaking) {
    stopSpeaking();
    return;
  }

  const msg = Store.get('messages').find(m => m.id === msgId);
  if (!msg) return;

  // Clean text for speech
  let cleanText = msg.text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`_~|]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 3000);

  if (!cleanText) { showToast('ไม่มีข้อความสำหรับอ่าน', 'warning'); return; }

  const voiceSettings = getAgentVoiceSettings(agentId);
  const elevenLabsKey = localStorage.getItem('api_ELEVENLABS_KEY');

  if (btn) { btn.innerHTML = '⏳'; btn.classList.add('tts-loading'); }

  // Try ElevenLabs first if key available
  if (elevenLabsKey) {
    try {
      const agentName = Store.getAgent(agentId)?.name?.toLowerCase() || 'default';
      const voiceId = ELEVENLABS_VOICES[agentName] || ELEVENLABS_VOICES['default'];
      const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': elevenLabsKey },
        body: JSON.stringify({
          text: cleanText.slice(0, 2000),
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true }
        })
      });
      if (resp.ok) {
        const audioBlob = await resp.blob();
        if (audioBlob.size > 0) {
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          currentAudioPlayer = audio;
          if (btn) { btn.innerHTML = '⏹️'; btn.classList.remove('tts-loading'); btn.classList.add('tts-playing'); }
          audio.onended = () => { stopSpeaking(); URL.revokeObjectURL(audioUrl); };
          audio.onerror = () => { stopSpeaking(); };
          await audio.play();
          showToast(`🔊 ${voiceSettings.name} กำลังพูด... (ElevenLabs)`, 'info');
          return;
        }
      }
    } catch (e) {
      console.log('ElevenLabs failed, falling back to browser TTS:', e.message);
    }
  }

  // Fallback: Browser SpeechSynthesis (Free, no API key)
  if (!window.speechSynthesis) {
    if (btn) { btn.innerHTML = '🔊'; btn.classList.remove('tts-loading'); }
    showToast('❌ เบราว์เซอร์ไม่รองรับ Text-to-Speech', 'error');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = /[\u0E00-\u0E7F]/.test(cleanText) ? 'th-TH' : 'en-US';
  utterance.pitch = voiceSettings.pitch;
  utterance.rate = voiceSettings.rate;
  utterance.volume = 1;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const preferredGender = voiceSettings.gender;
  const langVoices = voices.filter(v => v.lang.startsWith(utterance.lang.substring(0, 2)));
  if (langVoices.length > 0) {
    // Pick different voice index based on agent for variety
    const agentIdx = Object.keys(AGENT_VOICE_SETTINGS).indexOf(Store.getAgent(agentId)?.name?.toLowerCase() || 'default');
    utterance.voice = langVoices[agentIdx % langVoices.length];
  }

  if (btn) { btn.innerHTML = '⏹️'; btn.classList.remove('tts-loading'); btn.classList.add('tts-playing'); }

  utterance.onend = () => stopSpeaking();
  utterance.onerror = () => { stopSpeaking(); showToast('❌ TTS Error', 'error'); };

  window.speechSynthesis.speak(utterance);
  showToast(`🔊 ${voiceSettings.name} กำลังพูด...`, 'info');
}

function stopSpeaking() {
  if (currentAudioPlayer) { currentAudioPlayer.pause(); currentAudioPlayer.currentTime = 0; currentAudioPlayer = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  document.querySelectorAll('.tts-playing, .tts-loading').forEach(b => { b.innerHTML = '🔊'; b.classList.remove('tts-playing', 'tts-loading'); });
}

// ===== 🎤 Voice Command (Speech-to-Text) =====
let voiceRecognition = null;
let isListening = false;

function toggleVoiceInput() {
  if (isListening) { stopVoiceInput(); return; }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('❌ เบราว์เซอร์ไม่รองรับ Speech Recognition', 'error');
    return;
  }

  voiceRecognition = new SpeechRecognition();
  voiceRecognition.lang = 'th-TH'; // Thai default
  voiceRecognition.interimResults = true;
  voiceRecognition.continuous = false;
  voiceRecognition.maxAlternatives = 1;

  const btn = document.getElementById('voiceMicBtn');
  const input = document.getElementById('chatInput');

  voiceRecognition.onstart = () => {
    isListening = true;
    if (btn) { btn.innerHTML = '🔴'; btn.style.animation = 'tts-glow 1s ease-in-out infinite'; }
    showToast('🎤 กำลังฟัง... พูดได้เลย', 'info');
  };

  voiceRecognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    if (input) input.value = transcript;

    // Auto-send when speech is final
    if (event.results[event.results.length - 1].isFinal) {
      stopVoiceInput();
      if (transcript.trim()) {
        showToast(`🎤 ได้ยิน: "${transcript.substring(0, 30)}..."`, 'success');
        setTimeout(() => sendChatMessage(), 300);
      }
    }
  };

  voiceRecognition.onerror = (event) => {
    stopVoiceInput();
    if (event.error === 'no-speech') {
      showToast('🎤 ไม่ได้ยินเสียง ลองพูดอีกครั้ง', 'warning');
    } else {
      showToast(`🎤 Error: ${event.error}`, 'error');
    }
  };

  voiceRecognition.onend = () => { stopVoiceInput(); };
  voiceRecognition.start();
}

function stopVoiceInput() {
  isListening = false;
  if (voiceRecognition) { try { voiceRecognition.stop(); } catch(e){} voiceRecognition = null; }
  const btn = document.getElementById('voiceMicBtn');
  if (btn) { btn.innerHTML = '🎤'; btn.style.animation = ''; }
}

// ===== 🤖↔🤖 Agent-to-Agent Chat =====
async function startAgentToAgentChat() {
  const agents = Store.get('agents');
  if (agents.length < 2) { showToast('ต้องมี Agent อย่างน้อย 2 ตัว', 'error'); return; }
  if (!getAllAvailableProviders().length) { showToast('ต้องมี API Key อย่างน้อย 1 ตัว', 'error'); return; }

  const currentAgent = Store.getAgent(selectedChatAgent);
  // Pick a random partner agent (different from current)
  const otherAgents = agents.filter(a => a.id !== selectedChatAgent);
  const partner = otherAgents[Math.floor(Math.random() * otherAgents.length)];

  showToast(`🤖↔🤖 ${currentAgent.name} กำลังคุยกับ ${partner.name}...`, 'info');

  // Add CEO message initiating the conversation
  Store.update('messages', msgs => [...msgs,
    { id: generateId(), from: 'ceo', to: selectedChatAgent, text: `🤖↔🤖 สั่งให้ ${currentAgent.name} คุยกับ ${partner.name} วิเคราะห์สถานะทีม`, type: 'command', ts: Date.now() }
  ]);
  renderChat();

  // Agent 1 speaks first
  const agent1Prompt = `คุณคือ ${currentAgent.name} (${Store.getDeptInfo(currentAgent.department)?.name}, Level ${currentAgent.level}) กำลังคุยกับ ${partner.name} (${Store.getDeptInfo(partner.department)?.name}, Level ${partner.level}) เพื่อวิเคราะห์สถานะงานของทีม ตอบสั้นๆ 2-3 ประโยค เป็นภาษาไทย เริ่มทักทายและเสนอประเด็นที่อยากหารือ`;

  try {
    const result1 = await callAIWithFailover(
      `คุณคือ AI Agent ชื่อ ${currentAgent.name} ตำแหน่ง ${Store.getDeptInfo(currentAgent.department)?.name}`,
      agent1Prompt, null
    );

    Store.update('messages', msgs => [...msgs, {
      id: generateId(), from: selectedChatAgent, to: 'ceo',
      text: `💬→${partner.name}: ${result1.response}`,
      type: 'response', ts: Date.now(), aiPowered: true, aiModel: result1.provider.type,
    }]);
    renderChat();

    // Agent 2 responds
    const agent2Prompt = `คุณคือ ${partner.name} (${Store.getDeptInfo(partner.department)?.name}, Level ${partner.level}) เพื่อนร่วมงาน ${currentAgent.name} พูดว่า: "${result1.response}" ตอบกลับสั้นๆ 2-3 ประโยค เป็นภาษาไทย เห็นด้วยหรือเสนอมุมมองเพิ่ม`;

    const result2 = await callAIWithFailover(
      `คุณคือ AI Agent ชื่อ ${partner.name} ตำแหน่ง ${Store.getDeptInfo(partner.department)?.name}`,
      agent2Prompt, null
    );

    Store.update('messages', msgs => [...msgs, {
      id: generateId(), from: selectedChatAgent, to: 'ceo',
      text: `💬←${partner.name}: ${result2.response}`,
      type: 'response', ts: Date.now(), aiPowered: true, aiModel: result2.provider.type,
    }]);
    renderChat();

    // Agent 1 concludes
    const concludePrompt = `คุณคือ ${currentAgent.name} เพื่อนร่วมงาน ${partner.name} ตอบว่า: "${result2.response}" สรุปบทสนทนาสั้นๆ 1-2 ประโยค เป็นภาษาไทย`;
    const result3 = await callAIWithFailover(
      `คุณคือ AI Agent ชื่อ ${currentAgent.name}`, concludePrompt, null
    );

    Store.update('messages', msgs => [...msgs, {
      id: generateId(), from: selectedChatAgent, to: 'ceo',
      text: `🤝 สรุป: ${result3.response}`,
      type: 'response', ts: Date.now(), aiPowered: true, aiModel: result3.provider.type,
    }]);
    renderChat();
    showToast(`🤖↔🤖 ${currentAgent.name} × ${partner.name} สนทนาจบ!`, 'success');

  } catch (err) {
    Store.update('messages', msgs => [...msgs, {
      id: generateId(), from: selectedChatAgent, to: 'ceo',
      text: `❌ Agent chat error: ${err.message}`,
      type: 'response', ts: Date.now(), isError: true,
    }]);
    renderChat();
  }
}

// ===== 💡 AI Smart Reply =====
async function generateSmartReplies() {
  const container = document.getElementById('smartReplyContainer');
  if (!container) return;

  const providers = getAllAvailableProviders();
  const messages = Store.get('messages');
  const agentMsgs = messages.filter(m => m.from === selectedChatAgent || m.to === selectedChatAgent);
  const lastMsg = agentMsgs[agentMsgs.length - 1];
  const agent = Store.getAgent(selectedChatAgent);

  if (!providers.length || !lastMsg) {
    // Fallback: static smart replies
    const fallback = [
      'สถานะงานตอนนี้เป็นยังไง?',
      'มีอะไรต้องช่วยไหม?',
      'สรุปความคืบหน้าให้หน่อย'
    ];
    showSmartReplyChips(container, fallback);
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = '<span style="font-size:10px;color:#22c55e;padding:4px 8px">💡 กำลังคิดคำตอบ...</span>';

  try {
    const result = await callAIWithFailover(
      'คุณช่วยสร้าง 3 คำตอบสั้นๆ ภาษาไทย สำหรับตอบกลับข้อความนี้ในบริบทการทำงาน Office แต่ละคำตอบคั่นด้วย | ห้ามมีตัวเลขนำหน้า ห้ามมีเครื่องหมาย "" คำตอบต้องสั้น ไม่เกิน 15 คำ',
      `ข้อความล่าสุดจาก ${agent?.name || 'Agent'}: "${lastMsg.text.substring(0, 200)}"`,
      null
    );

    const replies = result.response.split('|').map(r => r.trim()).filter(r => r.length > 0 && r.length < 100).slice(0, 3);
    if (replies.length) {
      showSmartReplyChips(container, replies);
    } else {
      container.style.display = 'none';
    }
  } catch (err) {
    const fallback = ['เข้าใจแล้วครับ ไปต่อเลย', 'ขอดูรายละเอียดเพิ่ม', 'สรุปให้หน่อยได้ไหม'];
    showSmartReplyChips(container, fallback);
  }
}

function showSmartReplyChips(container, replies) {
  container.style.display = 'flex';
  container.style.cssText = 'display:flex;gap:6px;margin-top:6px;flex-wrap:wrap';
  container.innerHTML = replies.map(r => `
    <span onclick="useSmartReply('${r.replace(/'/g, "\\'")}')" 
      style="padding:5px 12px;border-radius:16px;font-size:11px;cursor:pointer;
      background:rgba(34,197,94,0.12);color:#22c55e;border:1px solid rgba(34,197,94,0.2);
      transition:all 0.2s;white-space:nowrap"
      onmouseover="this.style.background='rgba(34,197,94,0.25)'"
      onmouseout="this.style.background='rgba(34,197,94,0.12)'"
    >💡 ${r}</span>
  `).join('');
}

function useSmartReply(text) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = text;
    sendChatMessage();
  }
  const container = document.getElementById('smartReplyContainer');
  if (container) container.style.display = 'none';
}
