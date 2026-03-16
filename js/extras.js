// ===== 🎮 Extras — Mini-Games, Notification Center, Company Timeline =====

// ===== 🎮 Mini-Games =====
function showMiniGames() {
  showModal(`
    <div style="max-width:400px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">🎮</div>
        <h3>Break Room</h3>
        <p style="color:var(--text-muted);font-size:12px">Take a break and earn bonus coins!</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div onclick="closeModal();setTimeout(startTypingGame,300)" style="display:flex;align-items:center;gap:14px;padding:16px;border-radius:14px;background:var(--bg-input);border:1px solid var(--border);cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='#6366f1'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:36px">⌨️</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:14px">Typing Speed Test</div>
            <div style="font-size:11px;color:var(--text-muted)">Type fast to earn coins! 60 words = 500 🪙</div>
          </div>
          <div style="color:var(--accent-light);font-size:20px">→</div>
        </div>
        <div onclick="closeModal();setTimeout(startMemoryGame,300)" style="display:flex;align-items:center;gap:14px;padding:16px;border-radius:14px;background:var(--bg-input);border:1px solid var(--border);cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderColor='#22c55e'" onmouseout="this.style.borderColor='var(--border)'">
          <div style="font-size:36px">🧠</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:14px">Emoji Memory Match</div>
            <div style="font-size:11px;color:var(--text-muted)">Match pairs to earn coins! Fast = more 🪙</div>
          </div>
          <div style="color:var(--accent-light);font-size:20px">→</div>
        </div>
      </div>
    </div>
  `);
}

// === Typing Speed Test ===
function startTypingGame() {
  const words = ['code','deploy','server','agent','debug','sprint','merge','build','test','push','commit','review','refactor','optimize','scale','API','frontend','backend','database','function','variable','async','promise','render','component','module','package','config','docker','cloud'];
  const target = [];
  for (let i = 0; i < 15; i++) target.push(words[Math.floor(Math.random() * words.length)]);
  const targetStr = target.join(' ');
  let startTime = null;

  showModal(`
    <div style="max-width:500px">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:36px">⌨️</div>
        <h3>Typing Speed Test</h3>
        <p style="color:var(--text-muted);font-size:11px">Type the words below as fast as you can!</p>
      </div>
      <div id="typingTarget" style="padding:16px;background:var(--bg-input);border-radius:12px;font-family:var(--font-mono);font-size:14px;line-height:1.8;margin-bottom:12px;color:var(--text-secondary)">${targetStr}</div>
      <textarea id="typingInput" rows="3" style="width:100%;padding:12px;border-radius:12px;background:var(--bg-primary);border:2px solid var(--border);color:var(--text-primary);font-family:var(--font-mono);font-size:14px;resize:none" placeholder="Start typing here..." oninput="checkTyping()"></textarea>
      <div id="typingResult" style="text-align:center;margin-top:12px;font-size:13px;color:var(--text-muted)">⏱️ Timer starts when you type...</div>
    </div>
  `);

  window._typingTarget = targetStr;
  window._typingStart = null;

  setTimeout(() => document.getElementById('typingInput')?.focus(), 100);
}

function checkTyping() {
  const input = document.getElementById('typingInput')?.value || '';
  const target = window._typingTarget;
  if (!target) return;

  if (!window._typingStart && input.length > 0) {
    window._typingStart = Date.now();
  }

  // Highlight correct/incorrect characters
  const targetEl = document.getElementById('typingTarget');
  if (targetEl) {
    let html = '';
    for (let i = 0; i < target.length; i++) {
      if (i < input.length) {
        html += input[i] === target[i]
          ? `<span style="color:#22c55e">${target[i]}</span>`
          : `<span style="color:#ef4444;text-decoration:underline">${target[i]}</span>`;
      } else {
        html += target[i];
      }
    }
    targetEl.innerHTML = html;
  }

  // Check if complete
  if (input.length >= target.length) {
    const elapsed = (Date.now() - window._typingStart) / 1000;
    const wordCount = target.split(' ').length;
    const wpm = Math.round((wordCount / elapsed) * 60);
    const accuracy = Math.round((target.split('').filter((c, i) => c === input[i]).length / target.length) * 100);
    const reward = Math.round(wpm * accuracy / 20);

    Store.update('economy', eco => ({ ...eco, coins: (eco.coins||0) + reward, totalEarned: (eco.totalEarned||0) + reward }));

    document.getElementById('typingResult').innerHTML = `
      <div style="font-size:15px;font-weight:700;color:#22c55e;margin-bottom:4px">🏁 Complete!</div>
      <div>⚡ ${wpm} WPM · 🎯 ${accuracy}% accuracy · +${reward} 🪙</div>
    `;
    document.getElementById('typingInput').disabled = true;
    playSound('purchase');
  }
}

// === Memory Match ===
function startMemoryGame() {
  const emojis = ['🚀','🎯','💎','🔥','⚡','🎮','🏆','🌟'];
  const pairs = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  window._memoryCards = pairs;
  window._memoryFlipped = [];
  window._memoryMatched = new Set();
  window._memoryMoves = 0;
  window._memoryStart = Date.now();

  renderMemoryBoard();
}

function renderMemoryBoard() {
  const cards = window._memoryCards;
  const matched = window._memoryMatched;
  const flipped = window._memoryFlipped;

  const grid = cards.map((emoji, i) => {
    const isFlipped = flipped.includes(i) || matched.has(i);
    return `<div onclick="flipCard(${i})" style="width:60px;height:60px;border-radius:12px;
      display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;
      background:${matched.has(i) ? 'rgba(34,197,94,0.2)' : isFlipped ? 'var(--bg-primary)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)'};
      border:2px solid ${matched.has(i) ? '#22c55e' : isFlipped ? 'var(--accent)' : 'transparent'};
      transition:all 0.2s;user-select:none">
      ${isFlipped ? emoji : '❓'}
    </div>`;
  }).join('');

  showModal(`
    <div style="max-width:360px">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:36px">🧠</div>
        <h3>Memory Match</h3>
        <p style="color:var(--text-muted);font-size:11px">Moves: ${window._memoryMoves} · Matched: ${matched.size/2}/8</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;justify-items:center">
        ${grid}
      </div>
      <div id="memoryResult" style="text-align:center;margin-top:12px"></div>
    </div>
  `);
}

function flipCard(index) {
  const flipped = window._memoryFlipped;
  const matched = window._memoryMatched;
  const cards = window._memoryCards;
  if (matched.has(index) || flipped.includes(index) || flipped.length >= 2) return;

  flipped.push(index);
  renderMemoryBoard();

  if (flipped.length === 2) {
    window._memoryMoves++;
    const [a, b] = flipped;
    if (cards[a] === cards[b]) {
      matched.add(a); matched.add(b);
      window._memoryFlipped = [];
      setTimeout(() => {
        renderMemoryBoard();
        if (matched.size === cards.length) {
          // Win!
          const elapsed = ((Date.now() - window._memoryStart) / 1000).toFixed(1);
          const reward = Math.max(50, Math.round(500 - window._memoryMoves * 15 - elapsed * 5));
          Store.update('economy', eco => ({ ...eco, coins: (eco.coins||0) + reward, totalEarned: (eco.totalEarned||0) + reward }));
          playSound('purchase');
          showToast(`🧠 Memory Match complete! ${window._memoryMoves} moves, ${elapsed}s → +${reward} 🪙`, 'success', 4000);
        }
      }, 300);
    } else {
      setTimeout(() => { window._memoryFlipped = []; renderMemoryBoard(); }, 800);
    }
  }
}


// ===== 🔔 Notification Center =====
function showNotificationCenter() {
  const notifications = Store.get('notifications') || [];
  const unread = notifications.filter(n => !n.read).length;

  const filterBtns = ['All', 'Success', 'Error', 'Info'].map(f => {
    const type = f.toLowerCase();
    return `<button class="btn btn-sm" onclick="filterNotifications('${type}')" 
      style="font-size:11px;padding:4px 10px">${f === 'All' ? '📋' : f === 'Success' ? '✅' : f === 'Error' ? '❌' : 'ℹ️'} ${f}</button>`;
  }).join('');

  const list = notifications.slice(0, 30).map(n => `
    <div class="notification-item" data-type="${n.type}" style="display:flex;gap:10px;padding:10px;border-radius:10px;
      background:${n.read ? 'transparent' : 'rgba(99,102,241,0.08)'};
      border-left:3px solid ${n.type === 'success' ? '#22c55e' : n.type === 'error' ? '#ef4444' : '#6366f1'};
      margin-bottom:4px;transition:all 0.2s" 
      onmouseover="this.style.background='var(--bg-input)'" onmouseout="this.style.background='${n.read ? 'transparent' : 'rgba(99,102,241,0.08)'}'">
      <div style="font-size:16px">${n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : 'ℹ️'}</div>
      <div style="flex:1">
        <div style="font-size:12px;color:var(--text-primary)">${n.text}</div>
        <div style="font-size:9px;color:var(--text-muted);margin-top:2px">${new Date(n.ts).toLocaleTimeString()}</div>
      </div>
      ${!n.read ? '<div style="width:6px;height:6px;border-radius:50%;background:#6366f1;margin-top:4px;flex-shrink:0"></div>' : ''}
    </div>
  `).join('') || '<p style="text-align:center;color:var(--text-muted);padding:20px">No notifications yet</p>';

  showModal(`
    <div style="max-width:480px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
          <h3 style="margin:0">🔔 Notifications</h3>
          <p style="color:var(--text-muted);font-size:11px;margin:0">${unread} unread</p>
        </div>
        <button class="btn btn-sm" onclick="markAllRead()" style="font-size:11px">✅ Mark All Read</button>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px">${filterBtns}</div>
      <div id="notifList" style="max-height:400px;overflow-y:auto">${list}</div>
    </div>
  `);
}

function markAllRead() {
  Store.update('notifications', ns => ns.map(n => ({ ...n, read: true })));
  showToast('✅ All notifications marked as read', 'info');
  closeModal();
  updateNotifBadge();
}

function filterNotifications(type) {
  const items = document.querySelectorAll('.notification-item');
  items.forEach(el => {
    el.style.display = (type === 'all' || el.dataset.type === type) ? 'flex' : 'none';
  });
}

function updateNotifBadge() {
  const unread = (Store.get('notifications') || []).filter(n => !n.read).length;
  let badge = document.getElementById('notifBadge');
  if (!badge) {
    const navDash = document.getElementById('nav-dashboard');
    if (navDash) {
      badge = document.createElement('span');
      badge.id = 'notifBadge';
      badge.style.cssText = 'position:absolute;top:4px;right:4px;background:#ef4444;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px;min-width:14px;text-align:center';
      navDash.style.position = 'relative';
      navDash.appendChild(badge);
    }
  }
  if (badge) {
    badge.textContent = unread > 0 ? unread : '';
    badge.style.display = unread > 0 ? 'block' : 'none';
  }
}

// Update badge periodically
setInterval(updateNotifBadge, 5000);
setTimeout(updateNotifBadge, 2000);


// ===== 📜 Company Timeline =====
function showTimeline() {
  const agents = Store.get('agents') || [];
  const tasks = Store.get('tasks') || [];
  const eco = Store.get('economy') || {};
  const prestige = parseInt(localStorage.getItem('prestige_level') || '0');
  const doneTasks = tasks.filter(t => t.status === 'done').length;

  const milestones = [
    { icon: '🏢', title: 'Company Founded', desc: 'Claw-Empire Corp was established', time: 'Day 1', done: true },
    { icon: '🤖', title: 'First Agent Hired', desc: `Recruited ${agents[0]?.name || 'an agent'}`, time: 'Day 1', done: agents.length >= 1 },
    { icon: '✅', title: 'First Task Completed', desc: 'Team delivered first project', time: 'Week 1', done: doneTasks >= 1 },
    { icon: '👥', title: 'Team of 5', desc: 'Grew to 5 agents', time: 'Week 2', done: agents.length >= 5 },
    { icon: '💰', title: 'First 1,000 Coins', desc: 'Revenue milestone reached', time: 'Week 3', done: (eco.totalEarned||0) >= 1000 },
    { icon: '📊', title: '10 Tasks Done', desc: 'Consistent delivery track record', time: 'Month 1', done: doneTasks >= 10 },
    { icon: '🎓', title: 'First Training', desc: 'Invested in agent development', time: 'Month 1', done: agents.some(a => (a.skills||[]).length > 0) },
    { icon: '🏬', title: 'Marketplace Purchase', desc: 'Expanded through marketplace', time: 'Month 2', done: (eco.totalSpent||0) > 0 },
    { icon: '💎', title: '5,000 Coins Earned', desc: 'Becoming profitable', time: 'Month 2', done: (eco.totalEarned||0) >= 5000 },
    { icon: '👑', title: 'Team of 10', desc: 'Major expansion milestone', time: 'Month 3', done: agents.length >= 10 },
    { icon: '🏆', title: '50 Tasks Done', desc: 'Enterprise-level operations', time: 'Quarter 2', done: doneTasks >= 50 },
    { icon: '⭐', title: 'First Prestige', desc: 'Reset for bonus multiplier', time: 'Quarter 3', done: prestige >= 1 },
    { icon: '🚀', title: 'Legendary Status', desc: '10,000+ coins earned total', time: 'Year 1', done: (eco.totalEarned||0) >= 10000 },
  ];

  const completed = milestones.filter(m => m.done).length;

  const timelineHtml = milestones.map((m, i) => `
    <div style="display:flex;gap:14px;position:relative">
      <div style="display:flex;flex-direction:column;align-items:center">
        <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;
          font-size:18px;background:${m.done ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--bg-input)'};
          border:2px solid ${m.done ? '#6366f1' : 'var(--border)'}">
          ${m.done ? m.icon : '🔒'}
        </div>
        ${i < milestones.length - 1 ? `<div style="width:2px;height:40px;background:${m.done ? '#6366f1' : 'var(--border)'}"></div>` : ''}
      </div>
      <div style="flex:1;padding-bottom:${i < milestones.length - 1 ? '20px' : '0'}">
        <div style="font-weight:700;font-size:13px;color:${m.done ? 'var(--text-primary)' : 'var(--text-muted)'}">${m.title}</div>
        <div style="font-size:11px;color:var(--text-muted)">${m.desc}</div>
        <div style="font-size:10px;color:${m.done ? '#22c55e' : 'var(--text-muted)'};margin-top:2px">${m.done ? '✅ ' : '🔒 '}${m.time}</div>
      </div>
    </div>
  `).join('');

  showModal(`
    <div style="max-width:420px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">📜</div>
        <h3>Company Timeline</h3>
        <p style="color:var(--text-muted);font-size:12px">${completed}/${milestones.length} milestones achieved</p>
        <div style="width:200px;height:6px;background:var(--bg-input);border-radius:3px;overflow:hidden;margin:8px auto 0">
          <div style="width:${(completed/milestones.length)*100}%;height:100%;background:linear-gradient(90deg,#6366f1,#22c55e);border-radius:3px"></div>
        </div>
      </div>
      <div style="max-height:400px;overflow-y:auto;padding:4px">
        ${timelineHtml}
      </div>
    </div>
  `);
}

// ===== Add buttons to Dashboard =====
(function patchDashboardForExtras() {
  const orig = window.renderDashboard;
  if (!orig) return;
  const wrapped = window.renderDashboard;
  window.renderDashboard = function() {
    wrapped();
    const header = document.querySelector('#tab-dashboard > div:first-child > div:last-child');
    if (header) {
      if (!document.getElementById('gamesBtn')) {
        const btn = document.createElement('button');
        btn.id = 'gamesBtn';
        btn.className = 'btn btn-sm';
        btn.innerHTML = '🎮 Games';
        btn.onclick = showMiniGames;
        header.appendChild(btn);
      }
      if (!document.getElementById('notifCenterBtn')) {
        const btn = document.createElement('button');
        btn.id = 'notifCenterBtn';
        btn.className = 'btn btn-sm';
        btn.innerHTML = '🔔 Notifs';
        btn.onclick = showNotificationCenter;
        header.appendChild(btn);
      }
      if (!document.getElementById('timelineBtn')) {
        const btn = document.createElement('button');
        btn.id = 'timelineBtn';
        btn.className = 'btn btn-sm';
        btn.innerHTML = '📜 Timeline';
        btn.onclick = showTimeline;
        header.appendChild(btn);
      }
    }
  };
})();
