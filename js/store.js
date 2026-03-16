// ===== Claw-Empire State Store (with Supabase Cloud Sync) =====
const Store = {
  _state: {
    companyName: 'Claw-Empire Corp',
    ceoName: 'CEO Admin',
    language: 'en',
    activeTab: 'dashboard',
    agents: [],
    tasks: [],
    meetings: [],
    messages: [],
    reports: [],
    notifications: [],
    messengerChannels: [],
    settings: {
      defaultProvider: 'claude',
      theme: 'dark',
      autoUpdateEnabled: false,
      apiKeys: {},
      preferences: {
        fontSize: '14',
        sidebarCollapsed: false,
        animations: true,
        soundEnabled: true,
        colorTheme: 'neon',
        particlesEnabled: false,
        notifPrefs: {},
      }
    }
  },
  _listeners: [],
  _saveTimer: null,
  _supabase: null,
  _userId: null,
  _cloudReady: false,

  get(key) { return key ? this._state[key] : this._state; },

  set(key, value) {
    this._state[key] = value;
    this._save();
    this._notify(key);
  },

  update(key, fn) {
    this._state[key] = fn(this._state[key]);
    this._save();
    this._notify(key);
  },

  subscribe(fn) { this._listeners.push(fn); return function() { Store._listeners = Store._listeners.filter(function(l) { return l !== fn; }); }; },

  _notify(key) { this._listeners.forEach(function(fn) { fn(key, Store._state[key]); }); },

  // ===== Save (localStorage + Supabase cloud) =====
  _save() {
    // Always save to localStorage (fast, offline fallback)
    try { localStorage.setItem('claw-empire-state', JSON.stringify(this._state)); } catch(e) {}

    // Debounced cloud save (500ms)
    if (this._cloudReady && this._supabase && this._userId) {
      clearTimeout(this._saveTimer);
      this._saveTimer = setTimeout(function() { Store._cloudSave(); }, 500);
    }
  },

  async _cloudSave() {
    if (!this._supabase || !this._userId) return;
    try {
      var result = await this._supabase.from('user_data').upsert({
        user_id: this._userId,
        state: this._state,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (result.error) {
        console.warn('[Store] Cloud save error:', result.error.message);
      } else {
        console.log('[Store] ☁️ Cloud saved');
      }
    } catch(e) {
      console.warn('[Store] Cloud save failed:', e.message);
    }
  },

  // ===== Load (try cloud first, fallback to localStorage) =====
  _load() {
    try {
      var saved = localStorage.getItem('claw-empire-state');
      if (saved) {
        var parsed = JSON.parse(saved);
        Object.assign(this._state, parsed);
      }
    } catch(e) {}
  },

  async _cloudLoad() {
    if (!this._supabase || !this._userId) return false;
    try {
      var result = await this._supabase
        .from('user_data')
        .select('state')
        .eq('user_id', this._userId)
        .single();

      if (result.error) {
        if (result.error.code === 'PGRST116') {
          // No row found — first time user, will seed + save
          console.log('[Store] 🆕 New user, no cloud data yet');
          return false;
        }
        console.warn('[Store] Cloud load error:', result.error.message);
        return false;
      }

      if (result.data && result.data.state) {
        Object.assign(this._state, result.data.state);
        // Also update localStorage with cloud data
        try { localStorage.setItem('claw-empire-state', JSON.stringify(this._state)); } catch(e) {}
        console.log('[Store] ☁️ Loaded from cloud');
        return true;
      }
      return false;
    } catch(e) {
      console.warn('[Store] Cloud load failed:', e.message);
      return false;
    }
  },

  // ===== Init =====
  init() {
    // Load from localStorage immediately (fast)
    this._load();
    // Ensure settings.preferences exists
    if (!this._state.settings.preferences) {
      this._state.settings.preferences = { fontSize: '14', sidebarCollapsed: false, animations: true, soundEnabled: true, colorTheme: 'neon', particlesEnabled: false, notifPrefs: {} };
    }
    // Migrate old scattered localStorage keys into Store
    this._migratePrefs();
    if (this._state.agents.length === 0) this._seedData();
  },

  // Connect to Supabase (called after auth is ready)
  async connectCloud(supabaseClient, userId) {
    this._supabase = supabaseClient;
    this._userId = userId;

    // Try cloud load
    var loaded = await this._cloudLoad();
    if (loaded) {
      // Cloud had data — notify all listeners to refresh UI
      this._listeners.forEach(function(fn) { fn('*', null); });
    } else {
      // No cloud data — seed if needed, then save to cloud
      if (this._state.agents.length === 0) this._seedData();
      await this._cloudSave();
    }

    this._cloudReady = true;
    console.log('[Store] ☁️ Cloud sync active for user:', userId);
  },

  _seedData() {
    // Seed Agents
    var agents = [];
    var statuses = ['idle', 'working', 'working', 'working', 'meeting', 'idle'];
    for (var i = 0; i < 8; i++) {
      var dept = DEPARTMENTS[i % DEPARTMENTS.length];
      var provider = PROVIDERS[i % PROVIDERS.length];
      agents.push({
        id: generateId(),
        name: AGENT_NAMES[i],
        department: dept.id,
        provider: provider.id,
        model: provider.model,
        status: randomChoice(statuses),
        level: Math.floor(Math.random() * 10) + 1,
        xp: Math.floor(Math.random() * 1000),
        xpMax: 1000,
        skills: [],
        tasksCompleted: Math.floor(Math.random() * 50) + 5,
        tasksFailed: Math.floor(Math.random() * 5),
        color: SPRITE_COLORS[i],
        emoji: ['🤖','🧠','💡','⚡','🎯','🔮','🌟','🦾'][i],
        createdAt: Date.now() - Math.random() * 86400000 * 30,
        lastActive: Date.now() - Math.random() * 3600000,
      });
    }
    this._state.agents = agents;

    // Seed Tasks
    var taskStatuses = ['backlog', 'todo', 'in_progress', 'review', 'done'];
    var tasks = TASK_TEMPLATES.map(function(t, i) {
      return {
        id: generateId(),
        title: t.title,
        description: 'Task description for: ' + t.title,
        department: t.dept,
        priority: t.priority,
        status: taskStatuses[i % taskStatuses.length],
        assignee: agents[i % agents.length] ? agents[i % agents.length].id : null,
        createdAt: Date.now() - Math.random() * 86400000 * 14,
        updatedAt: Date.now() - Math.random() * 86400000 * 3,
        dueDate: Date.now() + Math.random() * 86400000 * 14,
        tags: [t.dept],
      };
    });
    this._state.tasks = tasks;

    // Seed Meetings
    var meetings = MEETING_TEMPLATES.map(function(m, i) {
      return {
        id: generateId(),
        title: m.title,
        department: m.dept,
        type: m.type,
        attendees: agents.slice(0, Math.floor(Math.random() * 4) + 2).map(function(a) { return a.id; }),
        summary: 'AI-generated summary for ' + m.title + '. Key decisions and action items discussed.',
        status: ['completed', 'scheduled', 'in_progress'][i % 3],
        scheduledAt: Date.now() + (i - 3) * 86400000,
        duration: [15, 30, 45, 60][Math.floor(Math.random() * 4)],
        approved: i % 3 === 0,
      };
    });
    this._state.meetings = meetings;

    // Seed Messages
    var messages = [
      { id: generateId(), from: 'ceo', to: agents[0] ? agents[0].id : null, text: '$ deploy staging environment', type: 'command', ts: Date.now() - 3600000 },
      { id: generateId(), from: agents[0] ? agents[0].id : null, to: 'ceo', text: 'Staging deployment initiated. Building Docker image...', type: 'response', ts: Date.now() - 3500000 },
      { id: generateId(), from: agents[0] ? agents[0].id : null, to: 'ceo', text: '✅ Staging deployed successfully at https://staging.example.com', type: 'response', ts: Date.now() - 3200000 },
      { id: generateId(), from: 'ceo', to: agents[1] ? agents[1].id : null, text: '$ analyze codebase security vulnerabilities', type: 'command', ts: Date.now() - 7200000 },
      { id: generateId(), from: agents[1] ? agents[1].id : null, to: 'ceo', text: 'Running SAST scan... Found 3 medium-severity issues in auth module.', type: 'response', ts: Date.now() - 7000000 },
    ];
    this._state.messages = messages;

    // Seed Reports
    var reports = [
      { id: generateId(), title: 'Sprint 12 Development Report', type: 'development', agent: agents[0] ? agents[0].id : null, status: 'completed', createdAt: Date.now() - 86400000, content: 'Completed 12 tasks, 2 PRs merged.' },
      { id: generateId(), title: 'Security Audit Q1 2026', type: 'report', agent: agents[6] ? agents[6].id : null, status: 'in_progress', createdAt: Date.now() - 172800000, content: 'Ongoing security assessment...' },
      { id: generateId(), title: 'Market Research — AI Tools', type: 'web_research_report', agent: agents[3] ? agents[3].id : null, status: 'completed', createdAt: Date.now() - 259200000, content: 'Analyzed 15 competing products.' },
    ];
    this._state.reports = reports;

    // Seed Messenger Channels
    this._state.messengerChannels = [
      { id: 'telegram', name: 'Telegram', icon: '✈️', connected: false, config: {} },
      { id: 'discord', name: 'Discord', icon: '🎮', connected: false, config: {} },
      { id: 'slack', name: 'Slack', icon: '💬', connected: false, config: {} },
      { id: 'whatsapp', name: 'WhatsApp', icon: '📱', connected: false, config: {} },
      { id: 'google_chat', name: 'Google Chat', icon: '💭', connected: false, config: {} },
      { id: 'signal', name: 'Signal', icon: '🔒', connected: false, config: {} },
    ];

    // Seed Notifications
    this._state.notifications = [
      { id: generateId(), text: 'Nova completed "Implement auth flow"', type: 'success', ts: Date.now() - 1800000, read: false },
      { id: generateId(), text: 'Atlas leveled up to Level 5!', type: 'info', ts: Date.now() - 3600000, read: false },
      { id: generateId(), text: 'Security scan found 3 issues', type: 'warning', ts: Date.now() - 7200000, read: true },
    ];

    this._save();
  },

  // Agent helpers
  getAgent(id) { return this._state.agents.find(function(a) { return a.id === id; }); },
  getAgentsByDept(dept) { return this._state.agents.filter(function(a) { return a.department === dept; }); },
  getTasksByStatus(status) { return this._state.tasks.filter(function(t) { return t.status === status; }); },
  getTasksForAgent(agentId) { return this._state.tasks.filter(function(t) { return t.assignee === agentId; }); },
  getDeptInfo(id) { return DEPARTMENTS.find(function(d) { return d.id === id; }); },
  getProviderInfo(id) { return PROVIDERS.find(function(p) { return p.id === id; }); },

  // ===== Preferences helpers =====
  pref(key) {
    var prefs = this._state.settings && this._state.settings.preferences;
    if (!prefs) return undefined;
    return prefs[key];
  },
  setPref(key, value) {
    if (!this._state.settings.preferences) this._state.settings.preferences = {};
    this._state.settings.preferences[key] = value;
    this._save();
    this._notify('settings');
  },

  // Migrate old localStorage keys into Store settings.preferences
  _migratePrefs() {
    var migrated = false;
    var prefs = this._state.settings.preferences;
    var keys = [
      { ls: 'fontSize', pref: 'fontSize', type: 'string' },
      { ls: 'sidebarCollapsed', pref: 'sidebarCollapsed', type: 'bool' },
      { ls: 'animations', pref: 'animations', type: 'bool' },
      { ls: 'soundEnabled', pref: 'soundEnabled', type: 'bool' },
      { ls: 'colorTheme', pref: 'colorTheme', type: 'string' },
      { ls: 'particlesEnabled', pref: 'particlesEnabled', type: 'bool' },
      { ls: 'theme', pref: 'theme', type: 'string' },
      { ls: 'notifPrefs', pref: 'notifPrefs', type: 'json' },
    ];
    keys.forEach(function(k) {
      var val = localStorage.getItem(k.ls);
      if (val !== null) {
        if (k.type === 'bool') prefs[k.pref] = val === 'true';
        else if (k.type === 'json') { try { prefs[k.pref] = JSON.parse(val); } catch(e) {} }
        else prefs[k.pref] = val;
        localStorage.removeItem(k.ls);
        migrated = true;
      }
    });
    if (migrated) {
      console.log('[Store] Migrated preferences to Store');
      this._save();
    }
  },
};
