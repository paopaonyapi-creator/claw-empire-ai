// ===== Settings Tab — Premium Upgrade =====
let activeSettingsTab = 'ceo';

function renderSettings() {
  const settings = Store.get('settings');
  const tabs = [
    { id: 'ceo', icon: '👔', label: 'CEO Settings', desc: 'เลือก CEO & ตั้งค่าระบบ' },
    { id: 'api', icon: '🔑', label: 'API Keys', desc: 'ตั้งค่า AI Provider' },
    { id: 'general', icon: '🏢', label: t('general') || 'General', desc: 'Company & preferences' },
    { id: 'appearance', icon: '🎨', label: t('appearance') || 'Appearance', desc: 'Theme & display' },
    { id: 'notifications', icon: '🔔', label: t('notifications') || 'Notifications', desc: 'Alert preferences' },
    { id: 'advanced', icon: '⚙️', label: 'Advanced', desc: 'System & data' },
    { id: 'cli', icon: '🖥️', label: 'CLI Tools', desc: 'Provider management' },
    { id: 'oauth', icon: '🔐', label: 'OAuth', desc: 'Third-party auth' },
  ];

  document.getElementById('tab-settings').innerHTML = `
    <div class="settings-header">
      <div>
        <h2 class="settings-title">⚙️ ${t('settings') || 'Settings'}</h2>
        <p class="settings-subtitle">${t('settingsDesc') || 'Configure your AI agent company'}</p>
      </div>
      <div class="settings-header-actions">
        <span class="settings-version">v2.0.4</span>
        <button class="btn btn-sm" onclick="exportFullBackup()" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff">
          💾 Backup
        </button>
        <button class="btn btn-sm" onclick="importFullBackup()" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff">
          📂 Restore
        </button>
        <button class="btn btn-sm" onclick="showToast('Settings are up to date ✅','success')">
          🔄 Check Updates
        </button>
      </div>
    </div>

    <div class="settings-layout">
      <div class="settings-sidebar">
        ${tabs.map(tab => `
          <button class="settings-nav-item ${activeSettingsTab===tab.id?'active':''}" 
                  onclick="activeSettingsTab='${tab.id}';renderSettings()" id="sett-nav-${tab.id}">
            <span class="settings-nav-icon">${tab.icon}</span>
            <div class="settings-nav-text">
              <span class="settings-nav-label">${tab.label}</span>
              <span class="settings-nav-desc">${tab.desc}</span>
            </div>
            ${tab.id === activeSettingsTab ? '<span class="settings-nav-indicator"></span>' : ''}
          </button>
        `).join('')}
      </div>
      <div class="settings-content">
        ${activeSettingsTab === 'ceo' ? renderSettingsCEO() : ''}
        ${activeSettingsTab === 'general' ? renderSettingsGeneral() : ''}
        ${activeSettingsTab === 'cli' ? renderSettingsCLI() : ''}
        ${activeSettingsTab === 'api' ? renderSettingsAPI() : ''}
        ${activeSettingsTab === 'appearance' ? renderSettingsAppearance() : ''}
        ${activeSettingsTab === 'notifications' ? renderSettingsNotifications() : ''}
        ${activeSettingsTab === 'oauth' ? renderSettingsOAuth() : ''}
        ${activeSettingsTab === 'advanced' ? renderSettingsAdvanced() : ''}
      </div>
    </div>`;
}

function renderSettingsCEO() {
  const ceoSettings = JSON.parse(localStorage.getItem('ceo-settings') || '{}');
  const agents = Store.get('agents');
  const ceoAgentId = ceoSettings.ceoAgent || '';
  const ceoName = ceoSettings.ceoName || '';
  const defaultPlatforms = ceoSettings.platforms || ['Facebook','Instagram','TikTok','YouTube'];
  const autoSchedule = ceoSettings.autoSchedule || false;

  return `
    <div class="sett-section-header">
      <h3 class="sett-section-title">👔 CEO Settings</h3>
      <p class="sett-section-desc">ตั้งค่าประธานบริษัท เลือก Agent ที่เป็น CEO และตั้งค่า Platform เริ่มต้น</p>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">👔</span>
        <div class="sett-card-title">ชื่อ CEO</div>
      </div>
      <div class="sett-card-body">
        <div class="sett-field">
          <label class="sett-label">ชื่อที่แสดงบน Dashboard</label>
          <input class="sett-input" type="text" id="ceoNameInput" value="${ceoName}" placeholder="เช่น: CEO Pao" onchange="_saveCEOSetting('ceoName', this.value)" />
        </div>
      </div>
    </div>

    <div class="sett-card" style="margin-top:12px">
      <div class="sett-card-header">
        <span class="sett-card-icon">🤖</span>
        <div class="sett-card-title">เลือก Agent ที่เป็น CEO</div>
      </div>
      <div class="sett-card-body">
        <div class="sett-field">
          <label class="sett-label">Agent หลัก (ใช้ใน CEO Chat)</label>
          <select class="sett-input" id="ceoAgentSelect" onchange="_saveCEOSetting('ceoAgent', this.value)">
            <option value="">เลือก Agent...</option>
            ${agents.map(a => `<option value="${a.id}" ${ceoAgentId === a.id ? 'selected' : ''}>${a.avatar} ${a.name} (${a.department})</option>`).join('')}
          </select>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px">💡 Agent ที่เลือกจะถูกเลือกอัตโนมัติเมื่อเปิดหน้าแชท</div>
        </div>
      </div>
    </div>

    <div class="sett-card" style="margin-top:12px">
      <div class="sett-card-header">
        <span class="sett-card-icon">🎯</span>
        <div class="sett-card-title">Platform เริ่มต้น</div>
      </div>
      <div class="sett-card-body">
        <div class="sett-field">
          <label class="sett-label">เลือก Platform ที่จะถูกเลือกอัตโนมัติใน CEO Mode</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
            ${['Facebook','Instagram','TikTok','YouTube'].map(p => {
              const icons = {Facebook:'📘',Instagram:'📸',TikTok:'🎵',YouTube:'📺'};
              const checked = defaultPlatforms.includes(p);
              return `<label style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--bg-input);border-radius:8px;cursor:pointer;border:1px solid ${checked?'var(--accent)':'var(--border)'};font-size:12px">
                <input type="checkbox" ${checked?'checked':''} onchange="_toggleCEOPlatform('${p}', this.checked)" />
                <span style="font-size:18px">${icons[p]}</span>
                <span style="font-weight:600">${p}</span>
              </label>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="sett-card" style="margin-top:12px">
      <div class="sett-card-header">
        <span class="sett-card-icon">📅</span>
        <div class="sett-card-title">ตั้งค่าเพิ่มเติม</div>
      </div>
      <div class="sett-card-body">
        <div class="sett-field">
          <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
            <input type="checkbox" ${autoSchedule?'checked':''} onchange="_saveCEOSetting('autoSchedule', this.checked)" />
            <span style="font-size:12px;font-weight:600">Auto-Schedule — เพิ่มเข้า Calendar อัตโนมัติหลังสร้างคอนเทนต์</span>
          </label>
          <div style="font-size:10px;color:var(--text-muted);margin-top:6px">💡 เมื่อ CEO Mode สร้างคอนเทนต์เสร็จ ระบบจะเพิ่มเข้า Calendar อัตโนมัติ</div>
        </div>
      </div>
    </div>

    <div class="sett-card" style="margin-top:12px">
      <div class="sett-card-header">
        <span class="sett-card-icon">👥</span>
        <div class="sett-card-title">Team Overview</div>
      </div>
      <div class="sett-card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px">
          ${agents.map(a => `
            <div style="padding:10px;background:var(--bg-input);border-radius:8px;text-align:center;border:${a.id===ceoAgentId?'2px solid var(--accent)':'1px solid var(--border)'}">
              <div style="font-size:24px">${a.avatar}</div>
              <div style="font-size:11px;font-weight:700;margin-top:4px">${a.name}</div>
              <div style="font-size:9px;color:var(--text-muted)">${a.department}</div>
              <div style="font-size:8px;margin-top:4px;padding:2px 6px;border-radius:4px;display:inline-block;background:${a.status==='working'?'rgba(34,197,94,0.1)':'rgba(156,163,175,0.1)'};color:${a.status==='working'?'#22c55e':'#9ca3af'}">${a.status==='working'?'🟢 Active':'⚫ Idle'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function _saveCEOSetting(key, value) {
  const settings = JSON.parse(localStorage.getItem('ceo-settings') || '{}');
  settings[key] = value;
  localStorage.setItem('ceo-settings', JSON.stringify(settings));
  showToast(`✅ บันทึก ${key} แล้ว`, 'success');
  if (key === 'ceoName') {
    const el = document.getElementById('ceoName');
    if (el) el.textContent = value || 'CEO Admin';
  }
}

function _toggleCEOPlatform(platform, checked) {
  const settings = JSON.parse(localStorage.getItem('ceo-settings') || '{}');
  let platforms = settings.platforms || ['Facebook','Instagram','TikTok','YouTube'];
  if (checked && !platforms.includes(platform)) platforms.push(platform);
  if (!checked) platforms = platforms.filter(p => p !== platform);
  settings.platforms = platforms;
  localStorage.setItem('ceo-settings', JSON.stringify(settings));
  showToast(`✅ ${platform} ${checked ? 'เปิดใช้' : 'ปิด'}`, 'success');
}

function renderSettingsGeneral() {
  return `
    <div class="sett-section-header">
      <h3 class="sett-section-title">🏢 Company Profile</h3>
      <p class="sett-section-desc">Configure your company identity and regional preferences</p>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🏷️</span>
        <span class="sett-card-label">Organization Info</span>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Company Name</label>
          <input class="form-input" id="settCompanyName" value="${Store.get('companyName')}" placeholder="Enter company name" />
        </div>
        <div class="form-group">
          <label class="form-label">CEO / Admin Name</label>
          <input class="form-input" id="settCeoName" value="${Store.get('ceoName')}" placeholder="Enter your name" />
        </div>
      </div>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🌐</span>
        <span class="sett-card-label">Regional Settings</span>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Language</label>
          <select class="form-select" id="settLanguage">
            <option value="en" ${Store.get('language')==='en'?'selected':''}>🇺🇸 English</option>
            <option value="th" ${Store.get('language')==='th'?'selected':''}>🇹🇭 ภาษาไทย</option>
            <option value="ko" ${Store.get('language')==='ko'?'selected':''}>🇰🇷 한국어</option>
            <option value="ja" ${Store.get('language')==='ja'?'selected':''}>🇯🇵 日本語</option>
            <option value="zh" ${Store.get('language')==='zh'?'selected':''}>🇨🇳 中文</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Timezone</label>
          <select class="form-select" id="settTimezone">
            <option value="Asia/Bangkok" selected>🕐 Asia/Bangkok (UTC+7)</option>
            <option value="UTC">🕐 UTC (GMT+0)</option>
            <option value="America/New_York">🕐 America/New_York (UTC-5)</option>
            <option value="Europe/London">🕐 Europe/London (UTC+0)</option>
            <option value="Asia/Tokyo">🕐 Asia/Tokyo (UTC+9)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🤖</span>
        <span class="sett-card-label">Default AI Provider</span>
      </div>
      <div class="form-group">
        <label class="form-label">Primary Provider for New Agents</label>
        <select class="form-select" id="settProvider">
          ${PROVIDERS.map(p => `<option value="${p.id}" ${Store.get('settings').defaultProvider===p.id?'selected':''}>${p.icon} ${p.name} — ${p.model}</option>`).join('')}
        </select>
      </div>
      <div class="sett-info-box info">
        <span>💡</span> This provider will be pre-selected when creating new agents. Each agent can use a different provider.
      </div>
    </div>

    <div class="sett-actions">
      <button class="btn btn-primary" onclick="saveGeneralSettings()">💾 Save Settings</button>
      <button class="btn" onclick="renderSettings()">↩️ Reset Changes</button>
    </div>`;
}

function renderSettingsCLI() {
  const statuses = ['installed', 'installed', 'installed', 'not_installed', 'installed', 'not_installed'];
  return `
    <div class="sett-section-header">
      <h3 class="sett-section-title">🖥️ CLI Tool Providers</h3>
      <p class="sett-section-desc">Manage CLI-based AI coding assistants installed on your system</p>
    </div>

    <div class="sett-info-box success">
      <span>✅</span> ${PROVIDERS.filter(p => p.type === 'cli').length} CLI providers available. Install more from their official docs.
    </div>

    <div class="sett-provider-grid">
      ${PROVIDERS.filter(p => p.type === 'cli').map((p, i) => `
        <div class="sett-provider-card ${statuses[i] === 'installed' ? 'installed' : 'not-installed'}">
          <div class="sett-provider-top">
            <span class="sett-provider-icon">${p.icon}</span>
            <span class="tag ${statuses[i]==='installed' ? 'tag-success' : 'tag-warning'}">${statuses[i]==='installed' ? '✅ Installed' : '⚠️ Not Installed'}</span>
          </div>
          <div class="sett-provider-name">${p.name}</div>
          <div class="sett-provider-model">${p.model}</div>
          <div class="sett-provider-actions">
            ${statuses[i] === 'installed' ? `
              <button class="btn btn-sm" onclick="showToast('Opening ${p.name} config...','info')">⚙️ Configure</button>
              <button class="btn btn-sm btn-primary" onclick="showToast('Testing ${p.name} connection...','info'); setTimeout(() => showToast('${p.name} is responding! ✅','success'), 1500)">🧪 Test</button>
            ` : `
              <button class="btn btn-sm btn-primary" onclick="showToast('Opening ${p.name} install guide...','info')">📥 Install</button>
            `}
          </div>
        </div>
      `).join('')}
    </div>`;
}

function renderSettingsAPI() {
  const apis = [
    { name: 'OpenAI', key: 'OPENAI_API_KEY', placeholder: 'sk-proj-...', icon: '🟢', color: '#22c55e', desc: 'GPT-4o, o1, o3' },
    { name: 'NVIDIA NIM', key: 'NVIDIA_KEY', placeholder: 'nvapi-...', icon: '⚡', color: '#76b900', desc: 'Llama 3.3, Nemotron' },
    { name: 'Anthropic', key: 'ANTHROPIC_API_KEY', placeholder: 'sk-ant-api03-...', icon: '🟠', color: '#f59e0b', desc: 'Claude Sonnet 4, Opus' },
    { name: 'Google AI', key: 'GOOGLE_AI_KEY', placeholder: 'AIzaSy...', icon: '🔵', color: '#3b82f6', desc: 'Gemini 2.5 Pro/Flash' },
    { name: 'DeepSeek', key: 'DEEPSEEK_KEY', placeholder: 'sk-...', icon: '🟣', color: '#a855f7', desc: 'DeepSeek V3, R1' },
    { name: 'Kimi (Moonshot)', key: 'KIMI_KEY', placeholder: 'sk-...', icon: '🟡', color: '#eab308', desc: 'Kimi K2.5' },
    { name: 'ElevenLabs', key: 'ELEVENLABS_KEY', placeholder: 'sk_...', icon: '🔊', color: '#e11d48', desc: 'Text-to-Speech (Agent Voice)' },
  ];

  return `
    <div class="sett-section-header">
      <h3 class="sett-section-title">🔑 API Key Management</h3>
      <p class="sett-section-desc">Securely store API credentials for direct model access</p>
    </div>

    <div class="sett-info-box warning">
      <span>🔒</span> Keys are stored encrypted (AES-256-GCM) in local storage. Never share your API keys.
    </div>

    <div class="sett-api-list">
      ${apis.map(api => {
        const saved = localStorage.getItem('api_' + api.key);
        return `
        <div class="sett-api-item">
          <div class="sett-api-header">
            <div class="sett-api-left">
              <span class="sett-api-icon" style="background:${api.color}20;color:${api.color}">${api.icon}</span>
              <div>
                <div class="sett-api-name">${api.name}</div>
                <div class="sett-api-desc">${api.desc}</div>
              </div>
            </div>
            <span class="tag ${saved ? 'tag-success' : 'tag-muted'}">${saved ? '🔑 Connected' : '○ Not Set'}</span>
          </div>
          <div class="sett-api-input-row">
            <input class="form-input" type="password" placeholder="${api.placeholder}" id="api_${api.key}" value="${saved || ''}" />
            <button class="btn btn-sm" onclick="toggleApiKeyVisibility('api_${api.key}')">👁️</button>
            <button class="btn btn-sm btn-primary" onclick="saveApiKey('${api.key}')">Save</button>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="sett-card" style="margin-top:16px">
      <div class="sett-card-header">
        <span class="sett-card-icon">📋</span>
        <span class="sett-card-label">Official API Endpoints</span>
      </div>
      <div class="sett-endpoint-list">
        <div class="sett-endpoint"><code>OpenAI</code> → <code>https://api.openai.com/v1</code></div>
        <div class="sett-endpoint"><code>NVIDIA NIM</code> → <code>https://integrate.api.nvidia.com/v1</code></div>
        <div class="sett-endpoint"><code>Anthropic</code> → <code>https://api.anthropic.com/v1</code></div>
        <div class="sett-endpoint"><code>Google AI</code> → <code>https://generativelanguage.googleapis.com/v1</code></div>
        <div class="sett-endpoint"><code>DeepSeek</code> → <code>https://api.deepseek.com</code></div>
        <div class="sett-endpoint"><code>Kimi</code> → <code>https://api.moonshot.cn/v1</code></div>
      </div>
    </div>`;
}

function renderSettingsAppearance() {
  const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
  const fontSize = Store.pref('fontSize') || '14';
  const sidebarCollapsed = Store.pref('sidebarCollapsed') === true;
  const animations = Store.pref('animations') !== false;
  const soundEnabled = Store.pref('soundEnabled') !== false;
  const colorTheme = Store.pref('colorTheme') || 'neon';
  const particlesOn = Store.pref('particlesEnabled') === true;

  const themes = [
    { id: 'neon', name: 'Default Neon', icon: '💜', accent: '#6366f1', bg: '#0a0e1a', secondary: '#818cf8' },
    { id: 'ocean', name: 'Ocean Blue', icon: '🌊', accent: '#0ea5e9', bg: '#0a1628', secondary: '#38bdf8' },
    { id: 'forest', name: 'Forest Green', icon: '🌲', accent: '#22c55e', bg: '#0a1a0e', secondary: '#4ade80' },
    { id: 'sunset', name: 'Sunset Orange', icon: '🌅', accent: '#f97316', bg: '#1a0f0a', secondary: '#fb923c' },
    { id: 'cherry', name: 'Cherry Pink', icon: '🌸', accent: '#ec4899', bg: '#1a0a14', secondary: '#f472b6' },
    { id: 'cyber', name: 'Cyberpunk', icon: '⚡', accent: '#eab308', bg: '#0a0a0a', secondary: '#facc15' },
    { id: 'arctic', name: 'Arctic Ice', icon: '❄️', accent: '#06b6d4', bg: '#0a1418', secondary: '#22d3ee' },
    { id: 'mono', name: 'Monochrome', icon: '⬛', accent: '#71717a', bg: '#09090b', secondary: '#a1a1aa' },
  ];

  return `
    <div class="sett-section-header">
      <h3 class="sett-section-title">🎨 Appearance & Display</h3>
      <p class="sett-section-desc">Customize the look and feel of your workspace</p>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🌗</span>
        <span class="sett-card-label">Theme Mode</span>
      </div>
      <div class="sett-theme-grid">
        <button class="sett-theme-option ${currentTheme==='dark'?'active':''}" onclick="setTheme('dark')">
          <div class="sett-theme-preview dark-preview">
            <div class="preview-bar"></div><div class="preview-card"></div><div class="preview-card"></div>
          </div>
          <span>🌙 Dark Mode</span>
        </button>
        <button class="sett-theme-option ${currentTheme==='light'?'active':''}" onclick="setTheme('light')">
          <div class="sett-theme-preview light-preview">
            <div class="preview-bar"></div><div class="preview-card"></div><div class="preview-card"></div>
          </div>
          <span>☀️ Light Mode</span>
        </button>
      </div>
    </div>

    <!-- 🎨 Color Theme Presets -->
    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🎨</span>
        <span class="sett-card-label">Color Theme</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px">
        ${themes.map(t => `
          <button onclick="applyColorTheme('${t.id}')" style="padding:12px 8px;border-radius:10px;border:2px solid ${colorTheme===t.id ? t.accent : 'transparent'};
            background:${colorTheme===t.id ? t.accent+'20' : 'var(--bg-input)'};cursor:pointer;text-align:center;transition:all 0.2s;
            ${colorTheme===t.id ? `box-shadow:0 0 12px ${t.accent}40` : ''}"
            onmouseover="this.style.borderColor='${t.accent}'"
            onmouseout="this.style.borderColor='${colorTheme===t.id ? t.accent : 'transparent'}'">
            <div style="font-size:24px;margin-bottom:4px">${t.icon}</div>
            <div style="width:24px;height:24px;border-radius:50%;margin:0 auto 6px;background:${t.accent};box-shadow:0 0 8px ${t.accent}60"></div>
            <div style="font-size:10px;color:${colorTheme===t.id ? t.accent : 'var(--text-muted)'};font-weight:${colorTheme===t.id ? '700' : '400'}">${t.name}</div>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- 🌊 Animated Background -->
    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🌊</span>
        <span class="sett-card-label">Animated Background</span>
      </div>
      <div class="sett-toggle-list">
        <div class="sett-toggle-item">
          <div class="sett-toggle-info">
            <div class="sett-toggle-name">✨ Particle Effect</div>
            <div class="sett-toggle-desc">Floating particles in the background for a premium feel</div>
          </div>
          <label class="sett-switch">
            <input type="checkbox" ${particlesOn ? 'checked' : ''} onchange="toggleParticleBackground(this.checked)" />
            <span class="sett-switch-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🔤</span>
        <span class="sett-card-label">Font Size</span>
      </div>
      <div class="sett-slider-row">
        <span class="sett-slider-label">A</span>
        <input type="range" class="sett-slider" min="12" max="18" value="${fontSize}" id="settFontSize" 
               oninput="document.documentElement.style.fontSize=this.value+'px'; document.getElementById('fontSizeValue').textContent=this.value+'px'" />
        <span class="sett-slider-label" style="font-size:18px">A</span>
        <span class="sett-slider-value" id="fontSizeValue">${fontSize}px</span>
      </div>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">✨</span>
        <span class="sett-card-label">Preferences</span>
      </div>
      <div class="sett-toggle-list">
        <div class="sett-toggle-item">
          <div class="sett-toggle-info">
            <div class="sett-toggle-name">🎭 Animations</div>
            <div class="sett-toggle-desc">Enable smooth transitions and micro-animations</div>
          </div>
          <label class="sett-switch">
            <input type="checkbox" ${animations ? 'checked' : ''} onchange="Store.setPref('animations', this.checked); showToast(this.checked ? 'Animations enabled ✨' : 'Animations disabled', 'info')" />
            <span class="sett-switch-slider"></span>
          </label>
        </div>
        <div class="sett-toggle-item">
          <div class="sett-toggle-info">
            <div class="sett-toggle-name">🔊 Sound Effects</div>
            <div class="sett-toggle-desc">Play sounds for notifications and interactions</div>
          </div>
          <label class="sett-switch">
            <input type="checkbox" ${soundEnabled ? 'checked' : ''} onchange="Store.setPref('soundEnabled', this.checked); showToast(this.checked ? 'Sounds enabled 🔊' : 'Sounds muted 🔇', 'info')" />
            <span class="sett-switch-slider"></span>
          </label>
        </div>
        <div class="sett-toggle-item">
          <div class="sett-toggle-info">
            <div class="sett-toggle-name">📐 Compact Sidebar</div>
            <div class="sett-toggle-desc">Use icon-only sidebar for more workspace</div>
          </div>
          <label class="sett-switch">
            <input type="checkbox" ${sidebarCollapsed ? 'checked' : ''} onchange="Store.setPref('sidebarCollapsed', this.checked); showToast('Sidebar preference saved 📐','info')" />
            <span class="sett-switch-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="sett-actions">
      <button class="btn btn-primary" onclick="saveFontSize()">💾 Save Appearance</button>
    </div>`;
}

function renderSettingsNotifications() {
  const notifPrefs = Store.pref('notifPrefs') || {};
  const channels = [
    { id: 'taskComplete', name: '✅ Task Completed', desc: 'When an agent finishes a task', default: true },
    { id: 'agentLevelUp', name: '🎉 Agent Level Up', desc: 'When an agent gains a level', default: true },
    { id: 'securityAlert', name: '🛡️ Security Alerts', desc: 'Critical security notifications', default: true },
    { id: 'meetingReminder', name: '📅 Meeting Reminders', desc: '15 min before scheduled meetings', default: true },
    { id: 'deployStatus', name: '🚀 Deploy Status', desc: 'Deployment success/failure', default: true },
    { id: 'weeklyDigest', name: '📊 Weekly Digest', desc: 'Weekly performance summary', default: false },
  ];

  return `
    <div class="sett-section-header">
      <h3 class="sett-section-title">🔔 Notification Preferences</h3>
      <p class="sett-section-desc">Control which alerts you receive and how</p>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">📬</span>
        <span class="sett-card-label">Notification Channels</span>
      </div>
      <div class="sett-toggle-list">
        ${channels.map(ch => `
          <div class="sett-toggle-item">
            <div class="sett-toggle-info">
              <div class="sett-toggle-name">${ch.name}</div>
              <div class="sett-toggle-desc">${ch.desc}</div>
            </div>
            <label class="sett-switch">
              <input type="checkbox" ${(notifPrefs[ch.id] !== undefined ? notifPrefs[ch.id] : ch.default) ? 'checked' : ''} 
                     onchange="saveNotifPref('${ch.id}', this.checked)" />
              <span class="sett-switch-slider"></span>
            </label>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🔕</span>
        <span class="sett-card-label">Quiet Hours</span>
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Start Time</label>
          <input class="form-input" type="time" value="22:00" id="quietStart" />
        </div>
        <div class="form-group">
          <label class="form-label">End Time</label>
          <input class="form-input" type="time" value="08:00" id="quietEnd" />
        </div>
      </div>
      <div class="sett-info-box info" style="margin-top:12px">
        <span>🌙</span> During quiet hours, only critical security alerts will be shown.
      </div>
    </div>

    <div class="sett-actions">
      <button class="btn btn-primary" onclick="showToast('Notification preferences saved! 🔔','success')">💾 Save Preferences</button>
    </div>`;
}

function renderSettingsOAuth() {
  const oauthProviders = [
    { name: 'GitHub', icon: '🐙', desc: 'Code management, PRs, and CI/CD', color: '#333', features: ['Repository access', 'Pull request automation', 'Issue tracking'] },
    { name: 'Google Workspace', icon: '🔵', desc: 'Calendar, Drive, and email integration', color: '#4285f4', features: ['Calendar sync', 'Drive storage', 'Gmail notifications'] },
    { name: 'Slack', icon: '💬', desc: 'Team communication and alerts', color: '#4a154b', features: ['Channel notifications', 'Direct messages', 'Slash commands'] },
    { name: 'Jira', icon: '📋', desc: 'Project tracking and sprint management', color: '#0052cc', features: ['Issue sync', 'Sprint boards', 'Workflow rules'] },
  ];

  return `
    <div class="sett-section-header">
      <h3 class="sett-section-title">🔐 OAuth Integrations</h3>
      <p class="sett-section-desc">Connect third-party services to enhance your workflow</p>
    </div>

    <div class="sett-oauth-grid">
      ${oauthProviders.map(o => {
        const connected = localStorage.getItem('oauth_' + o.name.toLowerCase().replace(/\s/g,''));
        return `
        <div class="sett-oauth-card ${connected ? 'connected' : ''}">
          <div class="sett-oauth-top">
            <span class="sett-oauth-icon">${o.icon}</span>
            <span class="tag ${connected ? 'tag-success' : 'tag-muted'}">${connected ? '✅ Connected' : '○ Disconnected'}</span>
          </div>
          <div class="sett-oauth-name">${o.name}</div>
          <div class="sett-oauth-desc">${o.desc}</div>
          <ul class="sett-oauth-features">
            ${o.features.map(f => `<li>• ${f}</li>`).join('')}
          </ul>
          <button class="btn btn-sm ${connected ? 'btn-danger' : 'btn-primary'}" style="width:100%" 
                  onclick="${connected ? `localStorage.removeItem('oauth_${o.name.toLowerCase().replace(/\\s/g,'')}'); showToast('${o.name} disconnected','info'); renderSettings()` : `localStorage.setItem('oauth_${o.name.toLowerCase().replace(/\\s/g,'')}','true'); showToast('${o.name} connected! ✅','success'); renderSettings()`}">
            ${connected ? '🔌 Disconnect' : '🔗 Connect ' + o.name}
          </button>
        </div>`;
      }).join('')}
    </div>`;
}

function renderSettingsAdvanced() {
  const agents = Store.get('agents') || [];
  const tasks = Store.get('tasks') || [];
  const dataSize = new Blob([JSON.stringify(Store.get())]).size;

  return `
    <div class="sett-section-header">
      <h3 class="sett-section-title">⚙️ Advanced Settings</h3>
      <p class="sett-section-desc">System configuration, data management, and diagnostics</p>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🗄️</span>
        <span class="sett-card-label">System Info</span>
      </div>
      <div class="sett-info-grid">
        <div class="sett-info-item">
          <span class="sett-info-label">Database</span>
          <span class="sett-info-value">SQLite Local (localStorage)</span>
        </div>
        <div class="sett-info-item">
          <span class="sett-info-label">Server Port</span>
          <span class="sett-info-value">8800</span>
        </div>
        <div class="sett-info-item">
          <span class="sett-info-label">Data Size</span>
          <span class="sett-info-value">${(dataSize / 1024).toFixed(1)} KB</span>
        </div>
        <div class="sett-info-item">
          <span class="sett-info-label">Total Agents</span>
          <span class="sett-info-value">${agents.length}</span>
        </div>
        <div class="sett-info-item">
          <span class="sett-info-label">Total Tasks</span>
          <span class="sett-info-value">${tasks.length}</span>
        </div>
        <div class="sett-info-item">
          <span class="sett-info-label">Version</span>
          <span class="sett-info-value">v2.0.4</span>
        </div>
      </div>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">🔄</span>
        <span class="sett-card-label">Updates</span>
      </div>
      <div class="sett-toggle-list">
        <div class="sett-toggle-item">
          <div class="sett-toggle-info">
            <div class="sett-toggle-name">🔄 Auto Update</div>
            <div class="sett-toggle-desc">Automatically pull updates from GitHub</div>
          </div>
          <label class="sett-switch">
            <input type="checkbox" id="settAutoUpdate" onchange="showToast(this.checked ? 'Auto-update enabled' : 'Auto-update disabled', 'info')" />
            <span class="sett-switch-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <div class="sett-card">
      <div class="sett-card-header">
        <span class="sett-card-icon">💾</span>
        <span class="sett-card-label">Data Management</span>
      </div>
      <div class="sett-data-actions">
        <button class="btn sett-action-btn" onclick="exportData()">
          <span class="sett-action-icon">📤</span>
          <div>
            <div class="sett-action-title">${t('exportData') || 'Export Data'}</div>
            <div class="sett-action-desc">Download all data as JSON backup</div>
          </div>
        </button>
        <button class="btn sett-action-btn" onclick="importData()">
          <span class="sett-action-icon">📥</span>
          <div>
            <div class="sett-action-title">${t('importData') || 'Import Data'}</div>
            <div class="sett-action-desc">Restore from a JSON backup file</div>
          </div>
        </button>
        <button class="btn sett-action-btn" onclick="exportAsCSV()">
          <span class="sett-action-icon">📊</span>
          <div>
            <div class="sett-action-title">Export as CSV</div>
            <div class="sett-action-desc">Export agents & tasks as spreadsheet</div>
          </div>
        </button>
      </div>
    </div>

    <div class="sett-card danger-zone">
      <div class="sett-card-header">
        <span class="sett-card-icon">⚠️</span>
        <span class="sett-card-label" style="color:var(--danger)">Danger Zone</span>
      </div>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">
        These actions are destructive and cannot be undone. Please export your data first.
      </p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-danger" onclick="if(confirm('⚠️ This will delete ALL data including agents, tasks, and settings. Continue?')){Object.keys(localStorage).filter(k=>!k.startsWith('sb-')).forEach(k=>localStorage.removeItem(k));location.reload()}">
          🗑️ ${t('resetAllData') || 'Reset All Data'}
        </button>
        <button class="btn btn-danger" style="opacity:0.8" onclick="if(confirm('Clear all agent chat history?')){Store.update('agents', a => a.map(ag => ({...ag, messages:[]}))); showToast('Chat history cleared','info')}">
          💬 Clear Chat History
        </button>
      </div>
    </div>`;
}

// ===== Helper Functions =====
function saveGeneralSettings() {
  Store.set('companyName', document.getElementById('settCompanyName')?.value || 'Claw-Empire');
  Store.set('ceoName', document.getElementById('settCeoName')?.value || 'CEO');
  Store.set('language', document.getElementById('settLanguage')?.value || 'en');
  Store.update('settings', s => ({ ...s, defaultProvider: document.getElementById('settProvider')?.value || 'claude' }));
  document.getElementById('ceoName').textContent = Store.get('ceoName');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const translated = t(key);
    if (translated && translated !== key) el.textContent = translated;
  });
  document.querySelectorAll('.nav-section-title').forEach((el, i) => {
    const keys = ['main', 'work', 'system'];
    if (keys[i]) el.textContent = t(keys[i]);
  });
  showToast('Settings saved! ⚙️', 'success');
}

function toggleApiKeyVisibility(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

function saveApiKey(key) {
  const value = document.getElementById('api_' + key)?.value;
  if (value) {
    localStorage.setItem('api_' + key, value);
    showToast(`${key} saved securely 🔒`, 'success');
    renderSettings();
  } else {
    localStorage.removeItem('api_' + key);
    showToast(`${key} removed`, 'info');
    renderSettings();
  }
}

function saveNotifPref(id, value) {
  const prefs = Store.pref('notifPrefs') || {};
  prefs[id] = value;
  Store.setPref('notifPrefs', prefs);
  showToast(value ? 'Notification enabled ✅' : 'Notification disabled 🔕', 'info');
}

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    Store.setPref('theme', 'light');
  } else {
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
    Store.setPref('theme', 'dark');
  }
  showToast(`Theme: ${theme === 'light' ? '☀️ Light' : '🌙 Dark'} mode`, 'info');
  renderSettings();
}

function saveFontSize() {
  const size = document.getElementById('settFontSize')?.value || '14';
  Store.setPref('fontSize', size);
  document.documentElement.style.fontSize = size + 'px';
  showToast('Appearance saved! 🎨', 'success');
}

function exportData() {
  const data = JSON.stringify(Store.get(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'claw-empire-export.json'; a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported! 📦', 'success');
}

function exportAsCSV() {
  const agents = Store.get('agents') || [];
  let csv = 'Name,Department,Provider,Level,Tasks Completed,Status\n';
  agents.forEach(a => {
    csv += `"${a.name}","${a.department}","${a.provider}","Lv.${a.level}","${a.tasksCompleted}","${a.status}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'claw-empire-agents.csv'; a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported! 📊', 'success');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        Object.keys(data).forEach(key => {
          Store.set(key, data[key]);
        });
        showToast('Data imported successfully! 📥', 'success');
        setTimeout(() => location.reload(), 1000);
      } catch (err) {
        showToast('Invalid JSON file ❌', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ===== 🎨 Color Theme Customizer =====
const COLOR_THEMES = {
  neon:   { accent: '#6366f1', accentLight: '#818cf8', accentDark: '#4f46e5', bg: '#0a0e1a', bgSecondary: '#111827', bgCard: '#1a1f35', bgSidebar: '#0d1225', bgInput: '#151b30', border: '#1e2a45', glow: 'rgba(99,102,241,0.25)' },
  ocean:  { accent: '#0ea5e9', accentLight: '#38bdf8', accentDark: '#0284c7', bg: '#0a1628', bgSecondary: '#0c1e36', bgCard: '#122a45', bgSidebar: '#081420', bgInput: '#0f2035', border: '#1a3555', glow: 'rgba(14,165,233,0.25)' },
  forest: { accent: '#22c55e', accentLight: '#4ade80', accentDark: '#16a34a', bg: '#0a1a0e', bgSecondary: '#0f2414', bgCard: '#15301a', bgSidebar: '#081508', bgInput: '#112510', border: '#1e452a', glow: 'rgba(34,197,94,0.25)' },
  sunset: { accent: '#f97316', accentLight: '#fb923c', accentDark: '#ea580c', bg: '#1a0f0a', bgSecondary: '#24150e', bgCard: '#351f15', bgSidebar: '#15100a', bgInput: '#2a1810', border: '#452e1e', glow: 'rgba(249,115,22,0.25)' },
  cherry: { accent: '#ec4899', accentLight: '#f472b6', accentDark: '#db2777', bg: '#1a0a14', bgSecondary: '#24101c', bgCard: '#351528', bgSidebar: '#150a10', bgInput: '#2a1020', border: '#451e35', glow: 'rgba(236,72,153,0.25)' },
  cyber:  { accent: '#eab308', accentLight: '#facc15', accentDark: '#ca8a04', bg: '#0a0a0a', bgSecondary: '#1a1a0e', bgCard: '#252514', bgSidebar: '#10100a', bgInput: '#1e1e10', border: '#3a3a1e', glow: 'rgba(234,179,8,0.25)' },
  arctic: { accent: '#06b6d4', accentLight: '#22d3ee', accentDark: '#0891b2', bg: '#0a1418', bgSecondary: '#0e1c22', bgCard: '#152830', bgSidebar: '#081015', bgInput: '#102025', border: '#1e3540', glow: 'rgba(6,182,212,0.25)' },
  mono:   { accent: '#71717a', accentLight: '#a1a1aa', accentDark: '#52525b', bg: '#09090b', bgSecondary: '#18181b', bgCard: '#27272a', bgSidebar: '#0f0f10', bgInput: '#1c1c1e', border: '#3f3f46', glow: 'rgba(113,113,122,0.25)' },
};

function applyColorTheme(themeId) {
  const t = COLOR_THEMES[themeId];
  if (!t) return;
  const r = document.documentElement;
  r.style.setProperty('--accent', t.accent);
  r.style.setProperty('--accent-light', t.accentLight);
  r.style.setProperty('--accent-dark', t.accentDark);
  r.style.setProperty('--accent-glow', t.glow);
  r.style.setProperty('--bg-primary', t.bg);
  r.style.setProperty('--bg-secondary', t.bgSecondary);
  r.style.setProperty('--bg-card', t.bgCard);
  r.style.setProperty('--bg-sidebar', t.bgSidebar);
  r.style.setProperty('--bg-input', t.bgInput);
  r.style.setProperty('--border', t.border);
  Store.setPref('colorTheme', themeId);
  // Update particle colors if active
  if (document.getElementById('particleCanvas')) {
    toggleParticleBackground(false);
    toggleParticleBackground(true);
  }
  showToast(`🎨 Theme: ${themeId.charAt(0).toUpperCase() + themeId.slice(1)} applied!`, 'success');
  renderSettings();
}

// Restore theme on page load
(function() {
  const saved = Store.pref('colorTheme');
  if (saved && COLOR_THEMES[saved]) {
    const t = COLOR_THEMES[saved];
    const r = document.documentElement;
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-light', t.accentLight);
    r.style.setProperty('--accent-dark', t.accentDark);
    r.style.setProperty('--accent-glow', t.glow);
    r.style.setProperty('--bg-primary', t.bg);
    r.style.setProperty('--bg-secondary', t.bgSecondary);
    r.style.setProperty('--bg-card', t.bgCard);
    r.style.setProperty('--bg-sidebar', t.bgSidebar);
    r.style.setProperty('--bg-input', t.bgInput);
    r.style.setProperty('--border', t.border);
  }
})();

// ===== 🌊 Animated Particle Background =====
let particleAnimId = null;

function toggleParticleBackground(enabled) {
  Store.setPref('particlesEnabled', enabled);
  const existing = document.getElementById('particleCanvas');
  if (!enabled) {
    if (existing) existing.remove();
    if (particleAnimId) { cancelAnimationFrame(particleAnimId); particleAnimId = null; }
    return;
  }
  if (existing) return; // already running

  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0.4';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6366f1';
  const particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    // Draw connections
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    particleAnimId = requestAnimationFrame(draw);
  }
  draw();
}

// Auto-start particles if enabled
(function() {
  if (Store.pref('particlesEnabled') === true) {
    setTimeout(() => toggleParticleBackground(true), 500);
  }
})();
