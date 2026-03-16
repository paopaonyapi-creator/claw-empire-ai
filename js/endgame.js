// ===== 🏢 Endgame Systems — Rivals, Relationships, Prestige =====

// ===== 🏢 Company Rivals =====
const RIVAL_COMPANIES = [
  { id: 'nexus', name: 'NexusTech', icon: '🔵', ceo: 'Alex Nova', agents: 8, score: 0, growth: 1.2, style: 'Aggressive' },
  { id: 'phantom', name: 'PhantomAI', icon: '👻', ceo: 'Dr. Shadow', agents: 6, score: 0, growth: 1.5, style: 'Stealth' },
  { id: 'titan', name: 'TitanCorp', icon: '⚔️', ceo: 'Iron Magnus', agents: 12, score: 0, growth: 0.8, style: 'Brute Force' },
  { id: 'zen', name: 'ZenFlow', icon: '🧘', ceo: 'Harmony Lee', agents: 5, score: 0, growth: 1.8, style: 'Efficiency' },
  { id: 'blaze', name: 'BlazeLabs', icon: '🔥', ceo: 'Pyra Chen', agents: 7, score: 0, growth: 1.3, style: 'Innovation' },
];

function getRivalScores() {
  const saved = JSON.parse(localStorage.getItem('rival_scores') || '{}');
  const today = new Date().toISOString().split('T')[0];
  if (saved._date !== today) {
    // Reset daily with slight randomization
    RIVAL_COMPANIES.forEach(r => {
      saved[r.id] = Math.floor(Math.random() * 3000) + 1000;
    });
    saved._date = today;
    localStorage.setItem('rival_scores', JSON.stringify(saved));
  }
  return saved;
}

function getMyScore() {
  const eco = Store.get('economy') || {};
  const agents = Store.get('agents') || [];
  const tasks = Store.get('tasks') || [];
  const prestige = parseInt(localStorage.getItem('prestige_level') || '0');
  const doneCount = tasks.filter(t => t.status === 'done').length;
  return (eco.totalEarned || 0) + doneCount * 50 + agents.length * 100 + prestige * 500;
}

function showRivalLeaderboard() {
  const scores = getRivalScores();
  const myScore = getMyScore();
  const ceoName = Store.get('ceoName') || 'CEO Admin';

  // Build leaderboard
  const entries = [
    { name: 'Claw-Empire Corp', icon: '🐾', ceo: ceoName, score: myScore, isMe: true, style: 'Your Company' },
    ...RIVAL_COMPANIES.map(r => ({ ...r, score: scores[r.id] || 0, isMe: false }))
  ].sort((a, b) => b.score - a.score);

  const myRank = entries.findIndex(e => e.isMe) + 1;
  const medals = ['🥇', '🥈', '🥉'];

  const rows = entries.map((e, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;
      background:${e.isMe ? 'rgba(99,102,241,0.15)' : 'var(--bg-input)'};
      border:${e.isMe ? '2px solid #6366f1' : '1px solid var(--border)'};
      ${e.isMe ? 'box-shadow:0 0 12px rgba(99,102,241,0.2)' : ''}">
      <div style="font-size:18px;width:28px;text-align:center;font-weight:800">${medals[i] || '#' + (i+1)}</div>
      <div style="font-size:24px">${e.icon}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:13px">${e.name} ${e.isMe ? '⭐' : ''}</div>
        <div style="font-size:10px;color:var(--text-muted)">CEO: ${e.ceo} · ${e.style}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:800;font-size:16px;color:${e.isMe ? '#6366f1' : '#f59e0b'}">${e.score.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--text-muted)">points</div>
      </div>
    </div>
  `).join('');

  showModal(`
    <div style="max-width:480px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">🏢</div>
        <h3>Industry Leaderboard</h3>
        <p style="color:var(--text-muted);font-size:12px">You are ranked <strong style="color:#f59e0b">#${myRank}</strong> of ${entries.length} companies</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto">
        ${rows}
      </div>
    </div>
  `);
  playSound('notification');
}

// Rival scores slowly increase over time
setInterval(() => {
  const scores = getRivalScores();
  RIVAL_COMPANIES.forEach(r => {
    scores[r.id] = (scores[r.id] || 0) + Math.floor(Math.random() * 50 * r.growth);
  });
  localStorage.setItem('rival_scores', JSON.stringify(scores));
}, 15000);


// ===== 💑 Agent Relationship System =====
const RELATIONSHIP_TYPES = {
  bestFriend: { icon: '💕', label: 'Best Friends', bonus: 1.2 },
  friend:     { icon: '😊', label: 'Friends', bonus: 1.1 },
  neutral:    { icon: '🤝', label: 'Colleagues', bonus: 1.0 },
  rival:      { icon: '😤', label: 'Rivals', bonus: 0.85 },
  nemesis:    { icon: '⚔️', label: 'Nemesis', bonus: 0.7 },
};

function getRelationships() {
  return JSON.parse(localStorage.getItem('agent_relationships') || '{}');
}

function setRelationship(agentId1, agentId2, type) {
  const rels = getRelationships();
  const key = [agentId1, agentId2].sort().join('_');
  rels[key] = type;
  localStorage.setItem('agent_relationships', JSON.stringify(rels));
}

function getRelationship(agentId1, agentId2) {
  const rels = getRelationships();
  const key = [agentId1, agentId2].sort().join('_');
  return rels[key] || 'neutral';
}

function showRelationshipMap() {
  const agents = Store.get('agents') || [];
  if (agents.length < 2) { showToast('Need at least 2 agents!', 'info'); return; }

  // Auto-generate relationships if none exist
  const rels = getRelationships();
  if (Object.keys(rels).length === 0) {
    const types = Object.keys(RELATIONSHIP_TYPES);
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const weights = [0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4]; // weighted towards neutral/friend
        const type = types[weights[Math.floor(Math.random() * weights.length)]];
        setRelationship(agents[i].id, agents[j].id, type);
      }
    }
  }

  const pairs = [];
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const type = getRelationship(agents[i].id, agents[j].id);
      const rel = RELATIONSHIP_TYPES[type];
      if (type !== 'neutral') {
        pairs.push({ a: agents[i], b: agents[j], type, rel });
      }
    }
  }

  const pairsHtml = pairs.length > 0 ? pairs.map(p => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:var(--bg-input)">
      <div style="text-align:center">
        ${typeof renderAgentAvatar === 'function' ? renderAgentAvatar(p.a, 28) : '🤖'}
        <div style="font-size:10px;font-weight:600">${p.a.name}</div>
      </div>
      <div style="flex:1;text-align:center">
        <div style="font-size:20px">${p.rel.icon}</div>
        <div style="font-size:9px;color:var(--text-muted)">${p.rel.label}</div>
        <div style="font-size:9px;color:${p.rel.bonus >= 1 ? '#22c55e' : '#ef4444'}">${p.rel.bonus >= 1 ? '+' : ''}${Math.round((p.rel.bonus - 1) * 100)}% productivity</div>
      </div>
      <div style="text-align:center">
        ${typeof renderAgentAvatar === 'function' ? renderAgentAvatar(p.b, 28) : '🤖'}
        <div style="font-size:10px;font-weight:600">${p.b.name}</div>
      </div>
    </div>
  `).join('') : '<p style="text-align:center;color:var(--text-muted);font-size:13px">All agents are neutral colleagues 🤝</p>';

  showModal(`
    <div style="max-width:450px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">💑</div>
        <h3>Agent Relationships</h3>
        <p style="color:var(--text-muted);font-size:12px">Bonds affect team productivity when working together</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto">
        ${pairsHtml}
      </div>
      <button onclick="resetRelationships()" class="btn btn-sm" style="width:100%;margin-top:12px">🔄 Shuffle Relationships</button>
    </div>
  `);
}

function resetRelationships() {
  localStorage.removeItem('agent_relationships');
  closeModal();
  setTimeout(() => showRelationshipMap(), 200);
  showToast('💑 Relationships reshuffled!', 'info');
}

// Random relationship events
setInterval(() => {
  const agents = Store.get('agents') || [];
  if (agents.length < 2 || Math.random() > 0.1) return;
  const a = agents[Math.floor(Math.random() * agents.length)];
  let b;
  do { b = agents[Math.floor(Math.random() * agents.length)]; } while (b.id === a.id);

  const current = getRelationship(a.id, b.id);
  const types = Object.keys(RELATIONSHIP_TYPES);
  const idx = types.indexOf(current);
  // Small chance to improve or worsen
  const newIdx = Math.random() > 0.5
    ? Math.max(0, idx - 1) // improve
    : Math.min(types.length - 1, idx + 1); // worsen
  if (newIdx !== idx) {
    setRelationship(a.id, b.id, types[newIdx]);
  }
}, 45000);


// ===== 🔄 Prestige System =====
function getPrestigeLevel() {
  return parseInt(localStorage.getItem('prestige_level') || '0');
}

function getPrestigeMultiplier() {
  const level = getPrestigeLevel();
  return 1 + (level * 0.15); // 15% bonus per prestige level
}

function showPrestigePanel() {
  const level = getPrestigeLevel();
  const multiplier = getPrestigeMultiplier();
  const myScore = getMyScore();
  const nextPrestigeCost = (level + 1) * 5000;
  const canPrestige = myScore >= nextPrestigeCost;

  const benefits = [
    `🪙 Coin earn rate: ${(multiplier * 100).toFixed(0)}%`,
    `⚡ XP gain: ${(multiplier * 100).toFixed(0)}%`,
    `📊 Starting coins: ${1000 * (level + 1)}`,
    `⭐ Prestige badges: ${level}`,
  ];

  showModal(`
    <div style="max-width:420px">
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:56px;text-shadow:0 0 20px rgba(245,158,11,0.5)">
          ${'⭐'.repeat(Math.min(level, 10)) || '🔰'}
        </div>
        <h3 style="margin-top:8px">Prestige Level ${level}</h3>
        <p style="color:#f59e0b;font-weight:700;font-size:14px">${multiplier.toFixed(2)}x Multiplier</p>
      </div>

      <div style="padding:16px;background:var(--bg-input);border-radius:12px;margin-bottom:16px">
        <div style="font-weight:700;font-size:13px;margin-bottom:8px">Current Bonuses:</div>
        ${benefits.map(b => `<div style="font-size:12px;color:var(--text-secondary);padding:2px 0">${b}</div>`).join('')}
      </div>

      <div style="padding:16px;background:${canPrestige ? 'rgba(245,158,11,0.1)' : 'var(--bg-input)'};
        border:1px solid ${canPrestige ? 'rgba(245,158,11,0.3)' : 'var(--border)'};border-radius:12px;margin-bottom:16px">
        <div style="font-weight:700;font-size:13px;margin-bottom:4px">Next Prestige</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">
          Reset company & keep prestige bonuses. Need ${nextPrestigeCost.toLocaleString()} score (You: ${myScore.toLocaleString()})
        </div>
        <div style="width:100%;height:8px;background:var(--bg-primary);border-radius:4px;overflow:hidden;margin-bottom:8px">
          <div style="width:${Math.min(100, (myScore / nextPrestigeCost) * 100)}%;height:100%;background:linear-gradient(90deg,#f59e0b,#ef4444);border-radius:4px"></div>
        </div>
        <button class="btn btn-sm ${canPrestige ? 'btn-primary' : ''}" onclick="doPrestige()"
          ${canPrestige ? '' : 'disabled style="opacity:0.4"'}
          style="width:100%;${canPrestige ? 'background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff' : ''}">
          🔄 Prestige to Level ${level + 1} → ${((1 + (level + 1) * 0.15) * 100).toFixed(0)}% multiplier
        </button>
      </div>

      <div style="padding:10px;background:rgba(239,68,68,0.1);border-radius:8px;font-size:11px;color:#ef4444;border:1px solid rgba(239,68,68,0.2)">
        ⚠️ Prestige will reset: coins, tasks, agent levels. You keep: agents, skills, prestige bonuses.
      </div>
    </div>
  `);
}

function doPrestige() {
  const level = getPrestigeLevel();
  const myScore = getMyScore();
  const nextCost = (level + 1) * 5000;
  if (myScore < nextCost) { showToast('❌ Not enough score!', 'error'); return; }
  if (!confirm(`🔄 Prestige to Level ${level + 1}? This will reset coins, tasks, and agent levels but keep agents, skills, and increase your multiplier to ${((1 + (level + 1) * 0.15) * 100).toFixed(0)}%!`)) return;

  const newLevel = level + 1;
  localStorage.setItem('prestige_level', newLevel.toString());

  // Reset economy
  const startCoins = 1000 * (newLevel + 1);
  Store.set('economy', { coins: startCoins, totalEarned: 0, totalSpent: 0, income: 0, expenses: 0 });

  // Reset tasks
  Store.set('tasks', []);

  // Reset agent levels but keep agents & skills
  Store.update('agents', agents => agents.map(a => ({
    ...a, level: 1, xp: 0, xpMax: 500, tasksCompleted: 0, tasksFailed: 0, mood: 'happy',
  })));

  closeModal();
  playSound('levelup');
  showToast(`🔄 Prestige Level ${newLevel}! ${((1 + newLevel * 0.15) * 100).toFixed(0)}% multiplier active!`, 'success', 5000);

  Store.update('notifications', ns => [{
    id: 'prestige_' + Date.now(),
    text: `🔄 Company reached Prestige ${newLevel}! All bonuses increased!`,
    type: 'success', ts: Date.now(), read: false,
  }, ...ns]);

  if (typeof renderDashboard === 'function') renderDashboard();
}

// ===== Add buttons to Dashboard =====
(function patchDashboardForEndgame() {
  const orig = window.renderDashboard;
  if (!orig) return;
  const wrapped = window.renderDashboard; // might already be wrapped by gameplay.js
  window.renderDashboard = function() {
    wrapped();
    const header = document.querySelector('#tab-dashboard > div:first-child > div:last-child');
    if (header) {
      if (!document.getElementById('rivalBtn')) {
        const btn = document.createElement('button');
        btn.id = 'rivalBtn';
        btn.className = 'btn btn-sm';
        btn.style.cssText = 'background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff';
        btn.innerHTML = '🏢 Rivals';
        btn.onclick = showRivalLeaderboard;
        header.prepend(btn);
      }
      if (!document.getElementById('relBtn')) {
        const btn = document.createElement('button');
        btn.id = 'relBtn';
        btn.className = 'btn btn-sm';
        btn.innerHTML = '💑 Relations';
        btn.onclick = showRelationshipMap;
        header.prepend(btn);
      }
      if (!document.getElementById('prestigeBtn')) {
        const btn = document.createElement('button');
        btn.id = 'prestigeBtn';
        btn.className = 'btn btn-sm';
        const pLvl = getPrestigeLevel();
        btn.style.cssText = pLvl > 0 ? 'background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff' : '';
        btn.innerHTML = `🔄 P${pLvl}`;
        btn.title = 'Prestige System';
        btn.onclick = showPrestigePanel;
        header.prepend(btn);
      }
    }
  };
})();
