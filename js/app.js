// ===== Claw-Empire Main App (Enhanced) =====
(function() {
  'use strict';

  // Initialize Store (sync load from localStorage)
  Store.init();

  // Connect cloud sync when auth is ready
  let _pollCount = 0;
  (function connectWhenReady() {
    if (++_pollCount > 100) { console.warn('[App] Cloud connect timed out'); return; }
    if (window._pendingCloudConnect) {
      var cc = window._pendingCloudConnect;
      window._pendingCloudConnect = null;
      Store.connectCloud(cc.client, cc.userId);
    } else {
      setTimeout(connectWhenReady, 100);
    }
  })();

  // Apply saved theme
  if (Store.get('settings')?.theme === 'light') {
    document.body.classList.add('light');
  }

  // Tab rendering map
  const tabRenderers = {
    dashboard: renderDashboard,
    office: renderOffice,
    kanban: renderKanban,
    agents: renderAgents,
    chat: renderChat,
    skills: renderSkills,
    meetings: renderMeetings,
    reports: renderReports,
    messenger: renderMessenger,
    settings: renderSettings,
  };

  // ===== Switch Tab =====
  function switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

    const navBtn = document.querySelector(`[data-tab="${tabId}"]`);
    const tabEl = document.getElementById(`tab-${tabId}`);
    if (navBtn) navBtn.classList.add('active');
    if (tabEl) tabEl.classList.add('active');

    document.getElementById('currentSection').textContent = t(tabId);

    if (tabRenderers[tabId]) tabRenderers[tabId]();
    Store.set('activeTab', tabId);
  }

  // Nav click handlers
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // ===== Sidebar Toggle =====
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  // ===== Theme Toggle =====
  document.getElementById('themeToggle').addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    Store.update('settings', s => ({ ...s, theme: isLight ? 'light' : 'dark' }));
    // Update theme-color meta
    document.querySelector('meta[name="theme-color"]').content = isLight ? '#f5f7fb' : '#0a0e1a';
    // Update icon
    const btn = document.getElementById('themeToggle');
    btn.innerHTML = isLight
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    playSound('click');
    showToast(isLight ? '☀️ Light mode' : '🌙 Dark mode', 'info');
  });

  // ===== Modal =====
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // ===== Global Search =====
  const searchInput = document.getElementById('globalSearch');
  const searchResults = document.getElementById('searchResults');

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q || q.length < 2) { searchResults.classList.remove('active'); return; }

    const results = [];
    // Search agents
    Store.get('agents').forEach(a => {
      if (a.name.toLowerCase().includes(q)) {
        results.push({ type: 'Agent', icon: a.emoji, name: a.name,
          sub: Store.getDeptInfo(a.department)?.name || '', action: () => { switchTab('agents'); } });
      }
    });
    // Search tasks
    Store.get('tasks').forEach(t => {
      if (t.title.toLowerCase().includes(q)) {
        results.push({ type: 'Task', icon: '📋', name: t.title,
          sub: t.priority + ' · ' + t.status.replace('_',' '), action: () => { switchTab('kanban'); } });
      }
    });
    // Search skills
    Object.entries(SKILL_CATEGORIES).forEach(([cat, skills]) => {
      skills.forEach(s => {
        if (s.toLowerCase().includes(q)) {
          results.push({ type: 'Skill', icon: '⭐', name: s, sub: cat, action: () => { switchTab('skills'); } });
        }
      });
    });

    if (results.length) {
      searchResults.innerHTML = results.slice(0, 8).map((r, i) => `
        <div class="search-result-item" onclick="handleSearchResult(${i})">
          <span style="font-size:18px">${r.icon}</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600">${r.name}</div>
            <div style="font-size:11px;color:var(--text-muted)">${r.sub}</div>
          </div>
          <span class="search-result-type tag-accent tag">${r.type}</span>
        </div>
      `).join('');
      searchResults.classList.add('active');
      window._searchResults = results.slice(0, 8);
    } else {
      searchResults.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:13px">No results found</div>';
      searchResults.classList.add('active');
    }
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => searchResults.classList.remove('active'), 200);
  });

  window.handleSearchResult = function(idx) {
    if (window._searchResults?.[idx]?.action) window._searchResults[idx].action();
    searchResults.classList.remove('active');
    searchInput.value = '';
  };

  // ===== ⌨️ Command Palette =====
  let commandPaletteOpen = false;

  const COMMANDS = [
    // Navigation
    { icon: '📊', name: 'Dashboard', desc: 'Go to Dashboard', category: 'Navigate', action: () => switchTab('dashboard') },
    { icon: '🏢', name: 'Office View', desc: 'View office', category: 'Navigate', action: () => switchTab('office') },
    { icon: '📋', name: 'Kanban Board', desc: 'Task board', category: 'Navigate', action: () => switchTab('kanban') },
    { icon: '🤖', name: 'Agents', desc: 'Manage agents', category: 'Navigate', action: () => switchTab('agents') },
    { icon: '💬', name: 'Chat', desc: 'AI chat', category: 'Navigate', action: () => switchTab('chat') },
    { icon: '📅', name: 'Meetings', desc: 'View meetings', category: 'Navigate', action: () => switchTab('meetings') },
    { icon: '⚙️', name: 'Settings', desc: 'App settings', category: 'Navigate', action: () => switchTab('settings') },
    // AI Features
    { icon: '🧠', name: 'AI Insights', desc: 'วิเคราะห์ข้อมูลทีม', category: 'AI', action: () => { switchTab('dashboard'); setTimeout(() => generateAIInsights(), 300); } },
    { icon: '📝', name: 'Daily Standup', desc: 'สรุปสถานะทีม', category: 'AI', action: () => { switchTab('dashboard'); setTimeout(() => generateDailyStandup(), 300); } },
    { icon: '📈', name: 'Week Report', desc: 'สรุปรายสัปดาห์', category: 'AI', action: () => { switchTab('dashboard'); setTimeout(() => generateWeekReport(), 300); } },
    { icon: '⚔️', name: 'Multi-Model Compare', desc: 'เปรียบเทียบ AI', category: 'AI', action: () => { switchTab('dashboard'); setTimeout(() => runMultiModelCompare(), 300); } },
    { icon: '🤖', name: 'Agent Chat', desc: 'Agent คุยกัน', category: 'AI', action: () => { switchTab('chat'); setTimeout(() => startAgentToAgentChat(), 300); } },
    // Actions
    { icon: '🔄', name: 'Toggle Simulation', desc: 'เปิด/ปิด Auto-Sim', category: 'Action', action: () => toggleSimulation() },
    { icon: '🌙', name: 'Toggle Theme', desc: 'สลับ Dark/Light', category: 'Action', action: () => document.getElementById('themeToggle').click() },
    { icon: '🔔', name: 'Notifications', desc: 'ดูแจ้งเตือน', category: 'Action', action: () => document.getElementById('notificationBtn').click() },
    { icon: '➕', name: 'Add Agent', desc: 'เพิ่ม Agent ใหม่', category: 'Action', action: () => { switchTab('agents'); setTimeout(() => showAddAgentModal(), 300); } },
    { icon: '📦', name: 'Import Data', desc: 'นำเข้าข้อมูล', category: 'Action', action: () => importData() },
    { icon: '🏅', name: 'Leaderboard', desc: 'จัดอันดับ Agent', category: 'Action', action: () => { switchTab('dashboard'); setTimeout(() => showLeaderboardModal(), 300); } },
  ];

  window.openCommandPalette = function() {
    if (commandPaletteOpen) return;
    commandPaletteOpen = true;

    const overlay = document.createElement('div');
    overlay.id = 'cmdPaletteOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);z-index:20000;display:flex;justify-content:center;padding-top:15vh';
    overlay.onclick = (e) => { if (e.target === overlay) closeCommandPalette(); };

    const palette = document.createElement('div');
    palette.style.cssText = 'width:520px;max-height:420px;background:rgba(15,20,35,0.98);border:1px solid rgba(99,102,241,0.3);border-radius:16px;box-shadow:0 24px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.05);overflow:hidden;display:flex;flex-direction:column';

    palette.innerHTML = `
      <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:10px">
        <span style="color:#6366f1;font-size:16px">⌨️</span>
        <input id="cmdInput" type="text" placeholder="Type a command..." 
          style="flex:1;background:none;border:none;outline:none;color:#e2e8f0;font-size:14px;font-family:inherit" autocomplete="off"/>
        <kbd style="padding:2px 8px;border-radius:4px;background:rgba(255,255,255,0.08);color:#8892a8;font-size:11px">ESC</kbd>
      </div>
      <div id="cmdResults" style="overflow-y:auto;flex:1;padding:6px"></div>
    `;
    overlay.appendChild(palette);
    document.body.appendChild(overlay);

    const input = document.getElementById('cmdInput');
    const results = document.getElementById('cmdResults');
    let selectedIdx = 0;

    function renderCommands(filter = '') {
      const q = filter.toLowerCase();
      const filtered = COMMANDS.filter(c => 
        c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      );
      selectedIdx = 0;

      if (!filtered.length) {
        results.innerHTML = '<div style="padding:20px;text-align:center;color:#5a6480;font-size:13px">No commands found</div>';
        return;
      }

      let lastCat = '';
      results.innerHTML = filtered.map((c, i) => {
        const catHeader = c.category !== lastCat ? `<div style="padding:4px 12px;font-size:10px;font-weight:700;color:#5a6480;text-transform:uppercase;letter-spacing:1px">${c.category}</div>` : '';
        lastCat = c.category;
        return `${catHeader}<div class="cmd-item" data-idx="${i}" 
          style="padding:8px 12px;border-radius:8px;display:flex;align-items:center;gap:10px;cursor:pointer;
          ${i === 0 ? 'background:rgba(99,102,241,0.15)' : ''}"
          onmouseover="this.style.background='rgba(99,102,241,0.15)'" 
          onmouseout="this.style.background=${i === selectedIdx ? "'rgba(99,102,241,0.15)'" : "'none'"}"
          onclick="executeCommand(${COMMANDS.indexOf(c)})">
          <span style="font-size:18px">${c.icon}</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600;color:#e2e8f0">${c.name}</div>
            <div style="font-size:11px;color:#5a6480">${c.desc}</div>
          </div>
        </div>`;
      }).join('');
      window._filteredCmds = filtered;
    }

    renderCommands();
    setTimeout(() => input.focus(), 50);

    input.addEventListener('input', () => renderCommands(input.value));
    input.addEventListener('keydown', (e) => {
      const items = results.querySelectorAll('.cmd-item');
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = Math.min(selectedIdx + 1, items.length - 1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = Math.max(selectedIdx - 1, 0); }
      if (e.key === 'Enter' && window._filteredCmds?.[selectedIdx]) {
        executeCommand(COMMANDS.indexOf(window._filteredCmds[selectedIdx]));
      }
      items.forEach((item, i) => {
        item.style.background = i === selectedIdx ? 'rgba(99,102,241,0.15)' : 'none';
      });
      if (items[selectedIdx]) items[selectedIdx].scrollIntoView({ block: 'nearest' });
    });
  };

  window.executeCommand = function(idx) {
    if (COMMANDS[idx]) {
      closeCommandPalette();
      COMMANDS[idx].action();
      playSound('click');
    }
  };

  window.closeCommandPalette = function() {
    commandPaletteOpen = false;
    document.getElementById('cmdPaletteOverlay')?.remove();
  };

  // ===== Keyboard Shortcuts =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (commandPaletteOpen) { closeCommandPalette(); return; }
      closeModal(); searchResults.classList.remove('active');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (commandPaletteOpen) closeCommandPalette();
      else openCommandPalette();
    }
    // Number shortcuts for tabs
    if (e.altKey && e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const tabs = ['dashboard','office','kanban','agents','chat','skills','meetings','reports','settings'];
      if (tabs[parseInt(e.key) - 1]) switchTab(tabs[parseInt(e.key) - 1]);
    }
  });

  // ===== Notifications =====
  document.getElementById('notificationBtn').addEventListener('click', () => {
    playSound('notification');
    const notifications = Store.get('notifications');
    const content = notifications.length ? notifications.map(n => `
      <div style="display:flex;gap:10px;padding:10px;border-bottom:1px solid var(--border);${!n.read ? 'background:rgba(99,102,241,0.05)' : ''}">
        <span>${n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <div style="flex:1"><div style="font-size:12px">${n.text}</div>
        <div style="font-size:10px;color:var(--text-muted)">${timeAgo(n.ts)}</div></div>
      </div>
    `).join('') : '<div style="text-align:center;padding:20px;color:var(--text-muted)">No notifications</div>';

    showModal('🔔 ' + t('notifications'), content, [
      { label: t('markAllRead'), class: 'btn-sm', onclick: 'markAllRead()' },
      { label: t('close'), onclick: 'closeModal()' }
    ]);
  });

  window.markAllRead = function() {
    Store.update('notifications', ns => ns.map(n => ({ ...n, read: true })));
    closeModal();
    showToast(t('markAllRead'), 'info');
  };

  // ===== Sound Effects =====
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  window.playSound = function(type) {
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.value = 0.05;

      if (type === 'click') { osc.frequency.value = 800; osc.type = 'sine'; }
      else if (type === 'notification') { osc.frequency.value = 523; osc.type = 'triangle'; }
      else if (type === 'success') { osc.frequency.value = 659; osc.type = 'sine'; }
      else if (type === 'error') { osc.frequency.value = 200; osc.type = 'sawtooth'; }
      else { osc.frequency.value = 440; osc.type = 'sine'; }

      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
  };

  // ===== Import Data =====
  window.importData = function() {
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
          Object.keys(data).forEach(key => Store.set(key, data[key]));
          showToast('Data imported successfully! 📦', 'success');
          playSound('success');
          location.reload();
        } catch(err) {
          showToast('Invalid file format', 'error');
          playSound('error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ===== Update CEO name =====
  document.getElementById('ceoName').textContent = Store.get('ceoName');

  // ===== i18n Update Function =====
  function updateI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translated = t(key);
      if (translated && translated !== key) el.textContent = translated;
    });
  }

  // ===== Update nav labels with i18n =====
  function updateNavLabels() {
    document.querySelectorAll('.nav-section-title').forEach((el, i) => {
      const keys = ['main', 'work', 'system'];
      if (keys[i]) el.textContent = t(keys[i]);
    });
    updateI18n();
  }
  updateNavLabels();

  // ===== 🔄 Enhanced Real-time Agent Simulation =====
  let simulationRunning = true;
  window.simulationInterval = null;

  window.toggleSimulation = function() {
    simulationRunning = !simulationRunning;
    showToast(simulationRunning ? '▶️ Simulation resumed' : '⏸️ Simulation paused', 'info');
    const btn = document.getElementById('simToggleBtn');
    if (btn) btn.textContent = simulationRunning ? '⏸️' : '▶️';
  };

  function runSimulationTick() {
    if (!simulationRunning) return;
    const agents = Store.get('agents');
    const tasks = Store.get('tasks');
    if (!agents.length) return;

    const idx = Math.floor(Math.random() * agents.length);
    const agent = agents[idx];
    const newStatus = randomChoice(['working', 'working', 'working', 'idle', 'meeting']);

    // Status change
    if (agent.status !== newStatus) {
      agents[idx].status = newStatus;
      agents[idx].lastActive = Date.now();

      // XP gain when working
      if (newStatus === 'working') {
        agents[idx].xp = Math.min(agents[idx].xp + Math.floor(Math.random() * 10), agents[idx].xpMax);
        if (agents[idx].xp >= agents[idx].xpMax) {
          agents[idx].level++;
          agents[idx].xp = 0;
          agents[idx].xpMax = Math.floor(agents[idx].xpMax * 1.2);
          Store.update('notifications', ns => [{
            id: generateId(), text: `${agents[idx].name} leveled up to Level ${agents[idx].level}! 🎉`,
            type: 'info', ts: Date.now(), read: false
          }, ...ns]);
          if (typeof showLiveNotification === 'function') {
            showLiveNotification('🎉', `${agents[idx].name} Level Up!`, `ขึ้นเลเวล ${agents[idx].level} แล้ว!`, 'success');
          }
          playSound('success');
        }
      }
    }

    // 🆕 Task completion (~20% chance per tick)
    if (agent.status === 'working' && Math.random() < 0.2) {
      const agentTasks = tasks.filter(t => t.assignedTo === agent.id && t.status === 'in_progress');
      if (agentTasks.length > 0) {
        const taskToComplete = agentTasks[Math.floor(Math.random() * agentTasks.length)];
        const taskIdx = tasks.findIndex(t => t.id === taskToComplete.id);
        if (taskIdx !== -1) {
          tasks[taskIdx].status = 'done';
          tasks[taskIdx].completedAt = Date.now();
          agents[idx].tasksCompleted = (agents[idx].tasksCompleted || 0) + 1;

          // Add activity notification
          Store.update('notifications', ns => [{
            id: generateId(), text: `${agent.name} completed "${taskToComplete.title}" ✅`,
            type: 'success', ts: Date.now(), read: false
          }, ...ns]);
          if (typeof showLiveNotification === 'function') {
            showLiveNotification('✅', `${agent.name} เสร็จงาน!`, `"${taskToComplete.title}"`, 'success');
          }

          Store.set('tasks', tasks);
        }
      }
    }

    // 🆕 Pick up new tasks (~15% chance)
    if (agent.status === 'working' && Math.random() < 0.15) {
      const unassigned = tasks.filter(t => !t.assignedTo && (t.status === 'backlog' || t.status === 'todo'));
      if (unassigned.length > 0) {
        const task = unassigned[Math.floor(Math.random() * unassigned.length)];
        const tIdx = tasks.findIndex(t => t.id === task.id);
        if (tIdx !== -1) {
          tasks[tIdx].assignedTo = agent.id;
          tasks[tIdx].status = 'in_progress';
          Store.set('tasks', tasks);
        }
      }
    }

    Store.set('agents', agents);
  }

  window.simulationInterval = setInterval(runSimulationTick, 12000);

  // ===== Initial Render =====
  const savedTab = Store.get('activeTab') || 'dashboard';
  switchTab(savedTab);

  // ===== Console Branding =====
  console.log('%c🏢 Claw-Empire v2.0.4', 'font-size:20px;font-weight:bold;color:#6366f1');
  console.log('%cAI Agent Office Simulator — Enhanced Edition!', 'color:#818cf8');
  console.log('%cShortcuts: Ctrl+K (search), Alt+1-9 (tabs), Esc (close)', 'color:#5a6480');
})();
