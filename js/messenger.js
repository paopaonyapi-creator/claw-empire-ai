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
