// ===== Messenger Integration =====
function renderMessenger() {
  const channels = Store.get('messengerChannels');
  document.getElementById('tab-messenger').innerHTML = `
    <div style="margin-bottom:20px">
      <h2 style="font-size:22px;font-weight:800;margin-bottom:4px">📱 Messenger Integration</h2>
      <p style="color:var(--text-muted);font-size:13px">Connect external messengers to send $ CEO directives from anywhere</p>
    </div>
    <div class="messenger-channels">
      ${channels.map(ch => `
        <div class="channel-card" onclick="showChannelConfig('${ch.id}')">
          <div class="channel-icon">${ch.icon}</div>
          <div class="channel-name">${ch.name}</div>
          <div class="channel-status">
            ${ch.connected ?
              '<span class="tag tag-success">Connected</span>' :
              '<span class="tag tag-info">Not Connected</span>'}
          </div>
          <button class="btn btn-sm ${ch.connected ? '' : 'btn-primary'}" style="margin-top:12px">
            ${ch.connected ? '⚙️ Configure' : '🔌 Connect'}
          </button>
        </div>
      `).join('')}
    </div>

    <div class="card" style="margin-top:24px">
      <div class="card-header">
        <div>
          <div class="card-title">$ Command → Chat Delegation</div>
          <div class="card-subtitle">How CEO directives flow through messenger channels</div>
        </div>
      </div>
      <div style="padding:16px;background:var(--bg-input);border-radius:var(--radius-sm);font-family:var(--font-mono);font-size:12px;line-height:2;color:var(--text-secondary)">
        <div><span style="color:var(--accent-light)">$</span> deploy production → <span style="color:var(--success)">DevOps Agent</span> → git pull, build, deploy</div>
        <div><span style="color:var(--accent-light)">$</span> security scan → <span style="color:var(--success)">Security Agent</span> → SAST + dependency audit</div>
        <div><span style="color:var(--accent-light)">$</span> design review → <span style="color:var(--success)">Design Agent</span> → screenshot + feedback</div>
        <div><span style="color:var(--accent-light)">$</span> write tests → <span style="color:var(--success)">QA Agent</span> → unit + integration coverage</div>
      </div>
    </div>

    <!-- Inter-Agent Chat -->
    <div class="card" style="margin-top:24px">
      <div class="card-header">
        <div>
          <div class="card-title">💬 Agent Office Chat</div>
          <div class="card-subtitle">Real-time conversations between your agents</div>
        </div>
        <button class="btn btn-sm" onclick="generateAgentChat()">🔄 New Chat</button>
      </div>
      <div id="agentChatFeed" style="max-height:350px;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px">
        ${renderAgentChatFeed()}
      </div>
    </div>`;
}

function showChannelConfig(channelId) {
  const channels = Store.get('messengerChannels');
  const ch = channels.find(c => c.id === channelId);
  if (!ch) return;

  const tokenFields = {
    telegram: 'Bot Token', discord: 'Bot Token', slack: 'OAuth Token',
    whatsapp: 'API Key', google_chat: 'Webhook URL', signal: 'Phone Number'
  };

  showModal(`Configure ${ch.name}`, `
    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:48px">${ch.icon}</div>
      <h3 style="margin-top:8px">${ch.name}</h3>
    </div>
    <div class="form-group">
      <label class="form-label">${tokenFields[channelId] || 'API Key'}</label>
      <input class="form-input" id="channelToken" type="password" placeholder="Enter ${tokenFields[channelId]?.toLowerCase() || 'token'}..." value="${ch.config?.token || ''}" />
    </div>
    <div class="form-group">
      <label class="form-label">Channel/Chat ID</label>
      <input class="form-input" id="channelChatId" placeholder="Enter channel ID..." value="${ch.config?.chatId || ''}" />
    </div>
    <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-xs);font-size:11px;color:var(--text-muted)">
      🔒 Credentials are stored encrypted (AES-256-GCM) in the local database — never in .env or source code.
    </div>
  `, [
    { label: ch.connected ? 'Disconnect' : 'Connect', class: ch.connected ? 'btn-danger' : 'btn-primary',
      onclick: `toggleChannel('${channelId}')` },
    { label: 'Cancel', onclick: 'closeModal()' }
  ]);
}

function toggleChannel(channelId) {
  Store.update('messengerChannels', channels => channels.map(ch =>
    ch.id === channelId ? {
      ...ch,
      connected: !ch.connected,
      config: {
        token: document.getElementById('channelToken')?.value || '',
        chatId: document.getElementById('channelChatId')?.value || '',
      }
    } : ch
  ));
  closeModal(); renderMessenger();
  const ch = Store.get('messengerChannels').find(c => c.id === channelId);
  showToast(`${ch?.name} ${ch?.connected ? 'connected' : 'disconnected'}!`, ch?.connected ? 'success' : 'info');
}

// ===== 💬 Inter-Agent Chat System =====
const AGENT_CHAT_TEMPLATES = [
  ['Hey, can you review my PR? 🔍', 'Sure! Give me 5 mins to check it 👀', 'LGTM! Great work 🎉'],
  ['The deployment pipeline is broken 😰', 'Let me check the logs...', 'Found it! Missing env variable. Fixed ✅'],
  ['Who wants coffee? ☕', 'Me please! Double shot 💪', 'I\'ll have a green tea 🍵'],
  ['Sprint review in 10 mins!', 'On my way 🏃', 'Can we push it back 15 mins? Still debugging 🐛'],
  ['Great job on the new feature! 🚀', 'Thanks! Could not have done it without the API docs 📚', 'Team effort! 🤝'],
  ['Anyone know how to fix CORS issues?', 'Try adding the Access-Control headers', 'Or use the proxy in vite.config 💡'],
  ['New design mockups ready for review 🎨', 'Love the color scheme! Very modern', 'Can we make the CTA button bigger? 🔘'],
  ['Server load is spiking 📈', 'Scaling up the instances now...', 'Auto-scaling kicked in, we\'re stable ✅'],
  ['Who broke the tests? 😤', 'Not me! I only changed CSS 🎨', 'Found it — snapshot needs updating 📸'],
  ['Happy Friday everyone! 🎉', 'Any plans for the weekend?', 'Coding side projects of course! 💻'],
];

let _agentChatHistory = [];

function renderAgentChatFeed() {
  if (_agentChatHistory.length === 0) generateAgentChat();
  return _agentChatHistory.map(msg => `
    <div style="display:flex;gap:10px;align-items:flex-start">
      ${typeof renderAgentAvatar === 'function' ? renderAgentAvatar(msg.agent, 28) : `<div style="width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px">${msg.agent.name[0]}</div>`}
      <div style="flex:1">
        <div style="display:flex;gap:8px;align-items:baseline">
          <span style="font-weight:600;font-size:12px">${msg.agent.name}</span>
          <span style="font-size:9px;color:var(--text-muted)">${msg.timeAgo}</span>
        </div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:2px">${msg.text}</div>
      </div>
    </div>
  `).join('');
}

function generateAgentChat() {
  const agents = Store.get('agents') || [];
  if (agents.length < 2) return;

  const template = AGENT_CHAT_TEMPLATES[Math.floor(Math.random() * AGENT_CHAT_TEMPLATES.length)];
  const shuffled = [...agents].sort(() => Math.random() - 0.5);
  const participants = shuffled.slice(0, Math.min(3, agents.length));

  _agentChatHistory = template.map((text, i) => ({
    agent: participants[i % participants.length],
    text,
    timeAgo: `${Math.floor(Math.random() * 10) + 1}m ago`,
  }));

  // Also add to older history
  const extras = AGENT_CHAT_TEMPLATES[Math.floor(Math.random() * AGENT_CHAT_TEMPLATES.length)];
  extras.forEach((text, i) => {
    _agentChatHistory.push({
      agent: agents[Math.floor(Math.random() * agents.length)],
      text,
      timeAgo: `${Math.floor(Math.random() * 50) + 10}m ago`,
    });
  });

  // Re-render if feed element exists
  const feed = document.getElementById('agentChatFeed');
  if (feed) {
    feed.innerHTML = renderAgentChatFeed();
    showToast('💬 New agent conversation generated!', 'info');
  }
}
