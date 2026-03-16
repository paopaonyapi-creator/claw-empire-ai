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
    // Don't trigger shortcuts when typing in inputs/textareas
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

    if (e.key === 'Escape') {
      if (commandPaletteOpen) { closeCommandPalette(); return; }
      closeModal(); searchResults.classList.remove('active');
      document.activeElement?.blur(); // Unfocus any input
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (commandPaletteOpen) closeCommandPalette();
      else openCommandPalette();
    }
    // Alt+1-9: Switch tabs
    if (e.altKey && e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const tabs = ['dashboard','office','kanban','agents','chat','skills','meetings','reports','settings'];
      if (tabs[parseInt(e.key) - 1]) switchTab(tabs[parseInt(e.key) - 1]);
    }
    // Ctrl+/: Focus chat input
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      switchTab('chat');
      setTimeout(() => document.getElementById('chatInput')?.focus(), 100);
    }
    // Ctrl+N: New task (open kanban + add task modal)
    if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !isTyping) {
      e.preventDefault();
      switchTab('kanban');
      setTimeout(() => { if (typeof showAddTaskModal === 'function') showAddTaskModal(); }, 200);
    }
    // Ctrl+D: Toggle dark/light theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !isTyping) {
      e.preventDefault();
      document.getElementById('themeToggle')?.click();
    }
    // ?: Show shortcut help (when not typing)
    if (e.key === '?' && !isTyping && !e.ctrlKey && !e.metaKey) {
      showToast('⌨️ Ctrl+K Search · Alt+1-9 Tabs · Ctrl+/ Chat · Ctrl+N Task · Ctrl+D Theme', 'info', 4000);
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
          showLevelUpCelebration(agents[idx]);
          checkAchievements(agents[idx]);
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

          // 💰 Earn coins for task completion
          const reward = 50 + (agent.level * 10);
          Store.update('economy', eco => ({
            ...eco,
            coins: (eco.coins || 0) + reward,
            totalEarned: (eco.totalEarned || 0) + reward,
            income: (eco.income || 0) + reward,
          }));

          // Add activity notification
          Store.update('notifications', ns => [{
            id: generateId(), text: `${agent.name} completed "${taskToComplete.title}" ✅ +${reward} 🪙`,
            type: 'success', ts: Date.now(), read: false
          }, ...ns]);
          if (typeof showLiveNotification === 'function') {
            showLiveNotification('✅', `${agent.name} เสร็จงาน!`, `"${taskToComplete.title}" +${reward} 🪙`, 'success');
          }

          // Track daily quest progress
          if (typeof addDailyProgress === 'function') {
            addDailyProgress('tasksCompleted');
            addDailyProgress('coinsEarned', reward);
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

// ===== 🎉 Level-Up Celebration System =====
function showLevelUpCelebration(agent) {
  // Remove old celebration if any
  document.getElementById('levelUpCelebration')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'levelUpCelebration';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);animation:fadeIn .3s ease;
  `;

  // Confetti particles
  let confetti = '';
  const colors = ['#f59e0b','#6366f1','#22c55e','#ef4444','#06b6d4','#ec4899','#8b5cf6'];
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 100;
    const delay = Math.random() * 1;
    const duration = 1.5 + Math.random() * 2;
    const color = colors[i % colors.length];
    const size = 6 + Math.random() * 6;
    confetti += `<div style="position:absolute;left:${x}%;top:-10px;width:${size}px;height:${size}px;
      background:${color};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      animation:confettiFall ${duration}s ${delay}s ease-in forwards;opacity:0"></div>`;
  }

  const dept = typeof Store !== 'undefined' ? Store.getDeptInfo(agent.department) : null;
  const rankTitle = agent.level >= 10 ? '🏆 Legend' : agent.level >= 7 ? '⭐ Expert' : agent.level >= 4 ? '💎 Senior' : '🔰 Junior';

  overlay.innerHTML = `
    ${confetti}
    <div style="text-align:center;padding:40px 50px;background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2));
      border:2px solid rgba(99,102,241,0.5);border-radius:24px;position:relative;
      animation:celebPulse 1.5s ease infinite;max-width:380px">
      <div style="font-size:64px;margin-bottom:8px;animation:celebBounce .6s ease">🎉</div>
      <div style="font-size:28px;font-weight:800;background:linear-gradient(135deg,#f59e0b,#ef4444,#ec4899);
        -webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px">LEVEL UP!</div>
      <div style="font-size:18px;font-weight:700;color:var(--text-primary);margin-bottom:12px">
        ${agent.name} → Level ${agent.level}
      </div>
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px">
        ${dept?.icon || '🏢'} ${dept?.name || agent.department} · ${rankTitle}
      </div>
      <div style="display:flex;gap:16px;justify-content:center;margin-bottom:20px">
        <div style="text-align:center">
          <div style="font-size:22px;font-weight:700;color:var(--accent-light)">${agent.tasksCompleted || 0}</div>
          <div style="font-size:10px;color:var(--text-muted)">Tasks Done</div>
        </div>
        <div style="width:1px;background:var(--border)"></div>
        <div style="text-align:center">
          <div style="font-size:22px;font-weight:700;color:#22c55e">${agent.level}</div>
          <div style="font-size:10px;color:var(--text-muted)">New Level</div>
        </div>
        <div style="width:1px;background:var(--border)"></div>
        <div style="text-align:center">
          <div style="font-size:22px;font-weight:700;color:#f59e0b">${agent.xpMax}</div>
          <div style="font-size:10px;color:var(--text-muted)">Next XP</div>
        </div>
      </div>
      <button onclick="document.getElementById('levelUpCelebration')?.remove()"
        style="padding:8px 24px;background:linear-gradient(135deg,#6366f1,#8b5cf6);
        border:none;border-radius:12px;color:#fff;font-weight:600;cursor:pointer;font-size:14px">
        🚀 Awesome!
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Auto dismiss after 6 seconds
  setTimeout(() => overlay.remove(), 6000);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ===== 🏅 Achievement System =====
const ACHIEVEMENTS = [
  { id: 'first_blood', title: '🩸 First Blood', desc: 'Complete first task', check: a => (a.tasksCompleted || 0) >= 1 },
  { id: 'lv5', title: '⭐ Rising Star', desc: 'Reach Level 5', check: a => a.level >= 5 },
  { id: 'lv10', title: '🏆 Legend', desc: 'Reach Level 10', check: a => a.level >= 10 },
  { id: 'tasks10', title: '📋 Task Master', desc: 'Complete 10 tasks', check: a => (a.tasksCompleted || 0) >= 10 },
  { id: 'tasks50', title: '🔥 Unstoppable', desc: 'Complete 50 tasks', check: a => (a.tasksCompleted || 0) >= 50 },
  { id: 'tasks100', title: '💎 Diamond Worker', desc: 'Complete 100 tasks', check: a => (a.tasksCompleted || 0) >= 100 },
];

function checkAchievements(agent) {
  const unlocked = JSON.parse(localStorage.getItem('achievements') || '{}');
  ACHIEVEMENTS.forEach(ach => {
    const key = `${agent.id}_${ach.id}`;
    if (!unlocked[key] && ach.check(agent)) {
      unlocked[key] = { ts: Date.now(), agent: agent.name };
      localStorage.setItem('achievements', JSON.stringify(unlocked));
      showToast(`🏅 Achievement Unlocked! ${ach.title} — ${agent.name}: ${ach.desc}`, 'success', 5000);
      Store.update('notifications', ns => [{
        id: generateId(), text: `🏅 ${agent.name}: ${ach.title} — ${ach.desc}`,
        type: 'success', ts: Date.now(), read: false
      }, ...ns]);
    }
  });
}

// ===== 🏬 Agent Marketplace =====
const MARKETPLACE_ITEMS = [
  { id: 'agent_ninja', name: '🥷 Ninja Dev', desc: 'Elite stealth coder — 2x task speed', cost: 2000, type: 'agent',
    agent: { name: 'Ninja', department: 'engineering', provider: 'gemini', model: 'gemini-2.5-flash', level: 5, xp: 0, xpMax: 1200, skills: ['Stealth Ops', 'Full-Stack Dev'] } },
  { id: 'agent_oracle', name: '🔮 Oracle AI', desc: 'Data prophet — predicts trends', cost: 3000, type: 'agent',
    agent: { name: 'Oracle', department: 'analytics', provider: 'openai', model: 'gpt-4o', level: 7, xp: 0, xpMax: 1500, skills: ['Analytics', 'AI/ML'] } },
  { id: 'agent_phoenix', name: '🔥 Phoenix', desc: 'Marketing fire — viral campaigns', cost: 2500, type: 'agent',
    agent: { name: 'Phoenix', department: 'marketing', provider: 'gemini', model: 'gemini-2.5-flash', level: 4, xp: 0, xpMax: 1100, skills: ['Marketing', 'Growth Hacking'] } },
  { id: 'xp_boost', name: '⚡ XP Boost Pack', desc: '+500 XP to all agents', cost: 1500, type: 'boost' },
  { id: 'coin_doubler', name: '💎 Coin Doubler', desc: 'Double coins for next 10 tasks', cost: 3000, type: 'perk',
    perk: 'coinDoubler' },
  { id: 'auto_complete', name: '🤖 Auto-Complete', desc: 'Instantly complete 3 random tasks', cost: 2000, type: 'action' },
];

function showMarketplace() {
  const economy = Store.get('economy') || { coins: 5000 };
  const purchased = JSON.parse(localStorage.getItem('marketplace_purchased') || '[]');

  const items = MARKETPLACE_ITEMS.map(item => {
    const owned = purchased.includes(item.id) && item.type === 'agent';
    return `
      <div style="display:flex;align-items:center;gap:14px;padding:14px;border-radius:14px;
        background:${owned ? 'rgba(34,197,94,0.1)' : 'var(--bg-input)'};
        border:1px solid ${owned ? 'rgba(34,197,94,0.3)' : 'var(--border)'}">
        <div style="font-size:36px">${item.name.split(' ')[0]}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px">${item.name}</div>
          <div style="font-size:11px;color:var(--text-muted)">${item.desc}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700;color:#f59e0b;font-size:14px">${item.cost} 🪙</div>
          ${owned
            ? '<span style="color:#22c55e;font-size:12px;font-weight:600">✅ Owned</span>'
            : `<button class="btn btn-sm btn-primary" onclick="purchaseItem('${item.id}')"
                ${economy.coins < item.cost ? 'disabled style="opacity:0.4"' : ''}>Buy</button>`
          }
        </div>
      </div>`;
  }).join('');

  showModal(`
    <div style="max-width:520px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">🏬</div>
        <h3>Agent Marketplace</h3>
        <p style="color:var(--text-muted);font-size:13px">Your balance: <strong style="color:#f59e0b">${economy.coins?.toLocaleString()} 🪙</strong></p>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:400px;overflow-y:auto">
        ${items}
      </div>
    </div>
  `);
  playSound('notification');
}

function purchaseItem(itemId) {
  const item = MARKETPLACE_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  const economy = Store.get('economy') || { coins: 5000, totalSpent: 0 };
  if (economy.coins < item.cost) { showToast('❌ Not enough coins!', 'error'); return; }

  // Deduct coins
  Store.update('economy', eco => ({
    ...eco,
    coins: eco.coins - item.cost,
    totalSpent: (eco.totalSpent || 0) + item.cost,
    expenses: (eco.expenses || 0) + item.cost,
  }));

  if (item.type === 'agent') {
    // Add new agent
    const newAgent = {
      id: generateId(),
      ...item.agent,
      status: 'active',
      tasksCompleted: 0,
      tasksFailed: 0,
      lastActive: Date.now(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${item.agent.name}`,
    };
    Store.update('agents', agents => [...agents, newAgent]);
    const purchased = JSON.parse(localStorage.getItem('marketplace_purchased') || '[]');
    purchased.push(itemId);
    localStorage.setItem('marketplace_purchased', JSON.stringify(purchased));
    showToast(`🎉 ${item.name} joined your team!`, 'success', 4000);
  } else if (item.type === 'boost') {
    // XP boost to all agents
    Store.update('agents', agents => agents.map(a => ({ ...a, xp: Math.min(a.xp + 500, a.xpMax) })));
    showToast('⚡ +500 XP to all agents!', 'success', 3000);
  } else if (item.type === 'action') {
    // Auto-complete 3 tasks
    const tasks = Store.get('tasks');
    let completed = 0;
    const updated = tasks.map(t => {
      if (completed < 3 && (t.status === 'in_progress' || t.status === 'todo')) {
        completed++;
        return { ...t, status: 'done', completedAt: Date.now() };
      }
      return t;
    });
    Store.set('tasks', updated);
    showToast(`🤖 Auto-completed ${completed} tasks!`, 'success', 3000);
  } else if (item.type === 'perk') {
    localStorage.setItem('perk_' + item.perk, JSON.stringify({ active: true, remaining: 10 }));
    showToast(`💎 ${item.name} activated!`, 'success', 3000);
  }

  playSound('purchase');
  closeModal();
  if (typeof renderDashboard === 'function') renderDashboard();
}

// ===== 🔊 Enhanced Sound Effects =====
// Override playSound with richer sounds
(function enhanceSounds() {
  const origPlaySound = window.playSound;
  window.playSound = function(type) {
    const settings = Store.get('settings');
    if (settings?.preferences?.soundEnabled === false) return;

    try {
      const ctx = window._audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      window._audioCtx = ctx;

      if (type === 'purchase') {
        // Coin sound: ascending arpeggio
        [523, 659, 784].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.value = 0.08;
          osc.start(ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);
          osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
      } else if (type === 'levelup') {
        // Fanfare: major chord
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'triangle';
          gain.gain.value = 0.06;
          osc.start(ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.stop(ctx.currentTime + 0.5);
        });
      } else if (type === 'coin') {
        // Quick coin clink
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 1200;
        osc.type = 'sine';
        gain.gain.value = 0.06;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.stop(ctx.currentTime + 0.1);
      } else {
        // Fall back to original
        if (origPlaySound) origPlaySound(type);
      }
    } catch(e) {
      if (origPlaySound) origPlaySound(type);
    }
  };
})();

// ===== 👤 CEO Profile & Stats =====
function getCeoLevel() {
  const eco = Store.get('economy') || { totalEarned: 0 };
  const agents = Store.get('agents') || [];
  const tasks = Store.get('tasks') || [];
  const totalTasks = tasks.filter(t => t.status === 'done').length;
  const totalXP = (eco.totalEarned || 0) + totalTasks * 20 + agents.length * 50;
  const level = Math.max(1, Math.floor(totalXP / 500) + 1);
  const xpInLevel = totalXP % 500;
  return { level, xp: xpInLevel, xpMax: 500, totalXP, totalTasks, totalEarned: eco.totalEarned || 0 };
}

function getCeoRank(level) {
  if (level >= 20) return { title: '👑 Legendary CEO', color: '#f59e0b' };
  if (level >= 15) return { title: '💎 Executive', color: '#8b5cf6' };
  if (level >= 10) return { title: '🏆 Director', color: '#22c55e' };
  if (level >= 7) return { title: '⭐ Manager', color: '#06b6d4' };
  if (level >= 4) return { title: '📊 Team Lead', color: '#3b82f6' };
  if (level >= 2) return { title: '💼 Junior CEO', color: '#818cf8' };
  return { title: '🔰 Intern CEO', color: '#8892a8' };
}

function showCeoProfile() {
  const ceo = getCeoLevel();
  const rank = getCeoRank(ceo.level);
  const agents = Store.get('agents') || [];
  const eco = Store.get('economy') || {};
  const achievements = JSON.parse(localStorage.getItem('achievements') || '{}');
  const achCount = Object.keys(achievements).length;
  const ceoName = Store.get('ceoName') || 'CEO Admin';

  showModal(`
    <div style="max-width:450px">
      <div style="text-align:center;padding:20px 0">
        <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);
          display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 12px;
          border:3px solid ${rank.color};box-shadow:0 0 20px ${rank.color}40">👤</div>
        <h2 style="font-size:22px;margin-bottom:4px">${ceoName}</h2>
        <div style="color:${rank.color};font-weight:700;font-size:14px;margin-bottom:12px">${rank.title}</div>

        <div style="max-width:250px;margin:0 auto">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:4px">
            <span>Level ${ceo.level}</span>
            <span>${ceo.xp} / ${ceo.xpMax} XP</span>
          </div>
          <div style="width:100%;height:8px;background:var(--bg-input);border-radius:4px;overflow:hidden">
            <div style="width:${(ceo.xp/ceo.xpMax)*100}%;height:100%;background:linear-gradient(90deg,${rank.color},#f59e0b);border-radius:4px;transition:width 0.5s"></div>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
        <div style="text-align:center;padding:12px;background:var(--bg-input);border-radius:12px">
          <div style="font-size:20px;font-weight:800;color:var(--accent-light)">${agents.length}</div>
          <div style="font-size:10px;color:var(--text-muted)">Agents</div>
        </div>
        <div style="text-align:center;padding:12px;background:var(--bg-input);border-radius:12px">
          <div style="font-size:20px;font-weight:800;color:#22c55e">${ceo.totalTasks}</div>
          <div style="font-size:10px;color:var(--text-muted)">Tasks Done</div>
        </div>
        <div style="text-align:center;padding:12px;background:var(--bg-input);border-radius:12px">
          <div style="font-size:20px;font-weight:800;color:#f59e0b">${(eco.coins||0).toLocaleString()}</div>
          <div style="font-size:10px;color:var(--text-muted)">Coins 🪙</div>
        </div>
        <div style="text-align:center;padding:12px;background:var(--bg-input);border-radius:12px">
          <div style="font-size:20px;font-weight:800;color:#ec4899">${achCount}</div>
          <div style="font-size:10px;color:var(--text-muted)">Badges</div>
        </div>
      </div>

      ${achCount > 0 ? `
      <div style="margin-bottom:16px">
        <div style="font-weight:700;font-size:13px;margin-bottom:8px">🏅 Achievements Unlocked</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${Object.entries(achievements).map(([k, v]) => `
            <span style="padding:3px 8px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.3);
              border-radius:8px;font-size:11px;color:#f59e0b">🏅 ${v.agent}</span>
          `).join('')}
        </div>
      </div>` : ''}

      <button onclick="closeModal()" class="btn btn-primary" style="width:100%">Close</button>
    </div>
  `);
}

// Update CEO level badge periodically
setInterval(() => {
  const ceo = getCeoLevel();
  const rank = getCeoRank(ceo.level);
  const badge = document.getElementById('ceoLevelBadge');
  if (badge) badge.innerHTML = `<span style="color:${rank.color}">⭐ Lv.${ceo.level}</span>`;
}, 5000);
