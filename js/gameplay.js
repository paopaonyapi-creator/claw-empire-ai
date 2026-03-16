// ===== 🎮 Gameplay Systems — Daily Quests, Random Events, Agent Moods =====

// ===== 📋 Daily Quests =====
const DAILY_QUESTS = [
  { id: 'complete_3', title: '✅ Complete 3 Tasks', desc: 'Have agents complete 3 tasks', target: 3, reward: 300, check: () => getDailyProgress('tasksCompleted') },
  { id: 'train_agent', title: '🎓 Train an Agent', desc: 'Send any agent to training', target: 1, reward: 200, check: () => getDailyProgress('trainings') },
  { id: 'earn_500', title: '💰 Earn 500 Coins', desc: 'Accumulate 500 coins today', target: 500, reward: 250, check: () => getDailyProgress('coinsEarned') },
  { id: 'chat_5', title: '💬 Send 5 Messages', desc: 'Chat with agents 5 times', target: 5, reward: 150, check: () => getDailyProgress('messagesSent') },
  { id: 'assign_tasks', title: '📝 Create 2 Tasks', desc: 'Add 2 new tasks to Kanban', target: 2, reward: 200, check: () => getDailyProgress('tasksCreated') },
  { id: 'level_up', title: '⬆️ Level Up an Agent', desc: 'Any agent reaches next level', target: 1, reward: 500, check: () => getDailyProgress('levelUps') },
  { id: 'buy_item', title: '🛒 Buy from Marketplace', desc: 'Purchase any item from the shop', target: 1, reward: 300, check: () => getDailyProgress('purchases') },
  { id: 'visit_tabs', title: '🗂️ Visit 4 Tabs', desc: 'Navigate to 4 different tabs', target: 4, reward: 100, check: () => getDailyProgress('tabsVisited') },
];

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getDailyProgress(key) {
  const data = JSON.parse(localStorage.getItem('daily_progress') || '{}');
  const today = getTodayKey();
  if (data._date !== today) return 0;
  return data[key] || 0;
}

function addDailyProgress(key, amount = 1) {
  const data = JSON.parse(localStorage.getItem('daily_progress') || '{}');
  const today = getTodayKey();
  if (data._date !== today) {
    // New day — reset progress
    Object.keys(data).forEach(k => { if (k !== '_date') delete data[k]; });
    data._date = today;
  }
  data[key] = (data[key] || 0) + amount;
  localStorage.setItem('daily_progress', JSON.stringify(data));
}

function getTodaysQuests() {
  const today = getTodayKey();
  const saved = localStorage.getItem('daily_quests_date');
  let questIds;
  if (saved === today) {
    questIds = JSON.parse(localStorage.getItem('daily_quests_ids') || '[]');
  } else {
    // Pick 3 random quests for today
    const shuffled = [...DAILY_QUESTS].sort(() => Math.random() - 0.5);
    questIds = shuffled.slice(0, 3).map(q => q.id);
    localStorage.setItem('daily_quests_date', today);
    localStorage.setItem('daily_quests_ids', JSON.stringify(questIds));
  }
  return questIds.map(id => DAILY_QUESTS.find(q => q.id === id)).filter(Boolean);
}

function showDailyQuests() {
  const quests = getTodaysQuests();
  const claimed = JSON.parse(localStorage.getItem('daily_claimed') || '{}');
  const today = getTodayKey();

  const questsHtml = quests.map(q => {
    const progress = Math.min(q.check(), q.target);
    const pct = Math.round((progress / q.target) * 100);
    const done = progress >= q.target;
    const isClaimed = claimed[today]?.includes(q.id);

    return `
      <div style="padding:14px;border-radius:14px;background:${done ? 'rgba(34,197,94,0.1)' : 'var(--bg-input)'};
        border:1px solid ${done ? 'rgba(34,197,94,0.3)' : 'var(--border)'}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div>
            <div style="font-weight:700;font-size:13px">${q.title}</div>
            <div style="font-size:11px;color:var(--text-muted)">${q.desc}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700;color:#f59e0b;font-size:13px">${q.reward} 🪙</div>
            ${isClaimed ? '<span style="color:#22c55e;font-size:11px;font-weight:600">✅ Claimed</span>'
              : done ? `<button class="btn btn-sm btn-primary" onclick="claimQuest('${q.id}',${q.reward})">Claim!</button>`
              : `<span style="font-size:11px;color:var(--text-muted)">${progress}/${q.target}</span>`}
          </div>
        </div>
        <div style="width:100%;height:6px;background:var(--bg-primary);border-radius:3px;overflow:hidden">
          <div style="width:${pct}%;height:100%;background:${done ? '#22c55e' : 'linear-gradient(90deg,#6366f1,#f59e0b)'};border-radius:3px;transition:width 0.5s"></div>
        </div>
      </div>`;
  }).join('');

  showModal(`
    <div style="max-width:420px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">📋</div>
        <h3>Daily Quests</h3>
        <p style="color:var(--text-muted);font-size:12px">Complete quests for bonus rewards! Resets daily.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${questsHtml}
      </div>
    </div>
  `);
}

function claimQuest(questId, reward) {
  const today = getTodayKey();
  const claimed = JSON.parse(localStorage.getItem('daily_claimed') || '{}');
  if (!claimed[today]) claimed[today] = [];
  if (claimed[today].includes(questId)) return;
  claimed[today].push(questId);
  localStorage.setItem('daily_claimed', JSON.stringify(claimed));

  Store.update('economy', eco => ({
    ...eco,
    coins: (eco.coins || 0) + reward,
    totalEarned: (eco.totalEarned || 0) + reward,
  }));

  playSound('purchase');
  showToast(`📋 Quest claimed! +${reward} 🪙`, 'success');
  closeModal();
  setTimeout(() => showDailyQuests(), 300);
}


// ===== ⚡ Random Company Events =====
const COMPANY_EVENTS = [
  { id: 'hackathon', icon: '💻', title: 'Company Hackathon!', desc: 'All agents get +200 XP bonus!', duration: 30000,
    effect: () => { Store.update('agents', as => as.map(a => ({ ...a, xp: Math.min(a.xp + 200, a.xpMax) }))); } },
  { id: 'server_crash', icon: '☠️', title: 'Server Crash!', desc: 'Emergency! 2 random tasks reset to in_progress.', duration: 15000,
    effect: () => {
      Store.update('tasks', ts => {
        let count = 0;
        return ts.map(t => {
          if (count < 2 && t.status === 'done') { count++; return { ...t, status: 'in_progress' }; }
          return t;
        });
      });
    } },
  { id: 'investor', icon: '💰', title: 'Investor Visit!', desc: 'Impressed! +1000 coins bonus!', duration: 20000,
    effect: () => { Store.update('economy', eco => ({ ...eco, coins: (eco.coins||0) + 1000, totalEarned: (eco.totalEarned||0) + 1000 })); } },
  { id: 'team_building', icon: '🎉', title: 'Team Building Day!', desc: 'All agents mood → Happy! Productivity up!', duration: 25000,
    effect: () => { Store.update('agents', as => as.map(a => ({ ...a, mood: 'happy' }))); } },
  { id: 'coffee_machine', icon: '☕', title: 'Coffee Machine Upgraded!', desc: 'Agents work 2x faster for 30 seconds!', duration: 30000,
    effect: () => { Store.update('agents', as => as.map(a => ({ ...a, mood: 'energized' }))); } },
  { id: 'bug_outbreak', icon: '🐛', title: 'Bug Outbreak!', desc: '3 new urgent tasks auto-created.', duration: 15000,
    effect: () => {
      ['Fix login crash', 'Patch security vuln', 'Fix API timeout'].forEach(title => {
        Store.update('tasks', ts => [...ts, {
          id: 'bug_' + Date.now() + Math.random(),
          title, status: 'todo', priority: 'high',
          department: 'engineering', createdAt: Date.now(),
        }]);
      });
    } },
  { id: 'award', icon: '🏆', title: 'Industry Award!', desc: 'Top agent gains +500 XP! Company reputation soars!', duration: 20000,
    effect: () => {
      Store.update('agents', as => {
        const sorted = [...as].sort((a,b) => b.level - a.level);
        return as.map(a => a.id === sorted[0]?.id ? { ...a, xp: Math.min(a.xp + 500, a.xpMax) } : a);
      });
    } },
  { id: 'power_outage', icon: '🔌', title: 'Power Outage!', desc: 'All agents go idle for 10 seconds.', duration: 10000,
    effect: () => { Store.update('agents', as => as.map(a => ({ ...a, mood: 'tired' }))); } },
];

let _lastEventTime = 0;

function triggerRandomEvent() {
  const now = Date.now();
  if (now - _lastEventTime < 60000) return; // Max 1 event per minute
  if (Math.random() > 0.15) return; // 15% chance per tick

  _lastEventTime = now;
  const event = COMPANY_EVENTS[Math.floor(Math.random() * COMPANY_EVENTS.length)];

  // Show event notification
  showEventBanner(event);
  event.effect();

  Store.update('notifications', ns => [{
    id: 'evt_' + Date.now(), text: `${event.icon} ${event.title} — ${event.desc}`,
    type: event.id === 'server_crash' || event.id === 'bug_outbreak' ? 'error' : 'success',
    ts: Date.now(), read: false,
  }, ...ns]);

  playSound(event.id === 'server_crash' || event.id === 'bug_outbreak' ? 'error' : 'success');
}

function showEventBanner(event) {
  const banner = document.createElement('div');
  banner.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10000;
    padding:16px 28px;border-radius:16px;font-size:14px;font-weight:700;
    background:linear-gradient(135deg,rgba(99,102,241,0.95),rgba(139,92,246,0.95));
    color:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.4);backdrop-filter:blur(12px);
    display:flex;align-items:center;gap:12px;animation:celebBounce .5s ease;max-width:500px`;
  banner.innerHTML = `
    <span style="font-size:32px">${event.icon}</span>
    <div>
      <div style="font-size:15px">${event.title}</div>
      <div style="font-size:11px;opacity:0.8;font-weight:400">${event.desc}</div>
    </div>`;
  document.body.appendChild(banner);
  setTimeout(() => { banner.style.transition = 'opacity 0.5s'; banner.style.opacity = '0'; }, 4000);
  setTimeout(() => banner.remove(), 4500);
}

// Hook into simulation tick for random events
(function hookEvents() {
  const origSetInterval = window._simInterval;
  setInterval(() => { triggerRandomEvent(); }, 10000);
})();


// ===== 😊 Agent Mood System =====
const MOODS = {
  happy:     { icon: '😊', label: 'Happy',     color: '#22c55e', productivity: 1.3 },
  neutral:   { icon: '😐', label: 'Neutral',   color: '#8892a8', productivity: 1.0 },
  tired:     { icon: '😴', label: 'Tired',     color: '#f59e0b', productivity: 0.7 },
  stressed:  { icon: '😤', label: 'Stressed',  color: '#ef4444', productivity: 0.5 },
  energized: { icon: '⚡', label: 'Energized', color: '#6366f1', productivity: 1.5 },
};

function getAgentMood(agent) {
  return MOODS[agent.mood] || MOODS.neutral;
}

function renderMoodBadge(agent) {
  const mood = getAgentMood(agent);
  return `<span title="${mood.label}" style="font-size:14px;cursor:help">${mood.icon}</span>`;
}

// Random mood changes every 30 seconds
setInterval(() => {
  const moodKeys = Object.keys(MOODS);
  Store.update('agents', agents => agents.map(a => {
    if (Math.random() > 0.2) return a; // 20% chance to change mood
    const weights = { happy: 3, neutral: 4, tired: 2, stressed: 1, energized: 1 };
    const weighted = [];
    Object.entries(weights).forEach(([mood, w]) => { for (let i = 0; i < w; i++) weighted.push(mood); });
    const newMood = weighted[Math.floor(Math.random() * weighted.length)];
    return { ...a, mood: newMood };
  }));
}, 30000);

// Initialize moods for agents that don't have one
setTimeout(() => {
  Store.update('agents', agents => agents.map(a =>
    a.mood ? a : { ...a, mood: 'neutral' }
  ));
}, 1000);

// ===== Add Daily Quest button to dashboard =====
// Patch renderDashboard to add quest button
(function patchDashboardForQuests() {
  const orig = window.renderDashboard;
  if (!orig) return;
  window.renderDashboard = function() {
    orig();
    // Add quest button after export buttons
    const header = document.querySelector('#tab-dashboard > div:first-child > div:last-child');
    if (header && !document.getElementById('questBtn')) {
      const btn = document.createElement('button');
      btn.id = 'questBtn';
      btn.className = 'btn btn-sm';
      btn.style.cssText = 'background:linear-gradient(135deg,#6366f1,#ec4899);color:#fff';
      btn.innerHTML = '📋 Quests';
      btn.onclick = showDailyQuests;
      header.prepend(btn);
    }
  };
})();

// Track tab visits for daily quest
(function trackTabVisits() {
  const origSwitch = window.switchTab;
  if (!origSwitch) return;
  const visited = new Set();
  window.switchTab = function(tab) {
    origSwitch(tab);
    if (!visited.has(tab)) {
      visited.add(tab);
      addDailyProgress('tabsVisited');
    }
  };
})();
