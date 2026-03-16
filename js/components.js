// ===== Shared UI Components =====
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300); }, duration);
}

function showModal(title, content, actions = []) {
  const overlay = document.getElementById('modalOverlay');
  const container = document.getElementById('modalContainer');

  // Handle both signatures: showModal(htmlContent) and showModal(title, content, actions)
  let hasTitle = true;
  if (content === undefined || (typeof content !== 'string' && !Array.isArray(content))) {
    // Called as showModal(contentHtml) — content-only mode
    content = title;
    title = '';
    hasTitle = false;
    if (typeof arguments[1] === 'object' && Array.isArray(arguments[1])) {
      actions = arguments[1];
    }
  }

  container.innerHTML = `
    ${hasTitle && title ? `<div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>` : `<div style="display:flex;justify-content:flex-end;padding:8px 8px 0"><button class="modal-close" onclick="closeModal()" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&times;</button></div>`}
    <div class="modal-body">${content}</div>
    ${actions.length ? `<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:20px">
      ${actions.map(a => `<button class="btn ${a.class || ''}" onclick="${a.onclick}">${a.label}</button>`).join('')}
    </div>` : ''}`;
  overlay.classList.add('active');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

// ===== 🌟 Agent Evolution Tiers =====
function getAgentTier(level) {
  if (level >= 9) return { icon: '💎', name: 'Diamond', glow: '#b9f2ff' };
  if (level >= 7) return { icon: '🦅', name: 'Eagle', glow: '#ffd700' };
  if (level >= 5) return { icon: '🐥', name: 'Phoenix', glow: '#ff9500' };
  if (level >= 3) return { icon: '🐣', name: 'Rising', glow: '#22c55e' };
  return { icon: '🥚', name: 'Rookie', glow: '#8892a8' };
}

function renderAgentAvatar(agent, size = 40) {
  const statusClass = `status-${agent.status}`;
  const tier = getAgentTier(agent.level);
  const tierBadge = size >= 36 ? `<div style="position:absolute;top:-3px;right:-3px;font-size:${Math.max(size*0.3,10)}px;filter:drop-shadow(0 0 3px ${tier.glow})" title="${tier.name}">${tier.icon}</div>` : '';
  return `<div class="agent-avatar" style="width:${size}px;height:${size}px;background:${agent.color};font-size:${size*0.45}px;position:relative">
    ${agent.emoji}
    <div class="status-indicator ${statusClass}"></div>
    ${tierBadge}
  </div>`;
}

function renderPriorityTag(priority) {
  const cls = { high: 'tag-danger', medium: 'tag-warning', low: 'tag-info' };
  return `<span class="tag ${cls[priority] || 'tag-info'}">${priority}</span>`;
}

function renderStatusTag(status) {
  const map = { idle: ['tag-info','Idle'], working: ['tag-success','Working'], meeting: ['tag-warning','Meeting'],
    offline: ['tag-danger','Offline'], backlog: ['tag-info','Backlog'], todo: ['tag-purple','To Do'],
    in_progress: ['tag-warning','In Progress'], review: ['tag-cyan','Review'], done: ['tag-success','Done'],
    completed: ['tag-success','Completed'], scheduled: ['tag-info','Scheduled'], in_progress: ['tag-warning','In Progress'] };
  const [cls, label] = map[status] || ['tag-info', status];
  return `<span class="tag ${cls}">${label}</span>`;
}

function renderProgressBar(value, max, cls = 'accent') {
  const pct = Math.min((value / max) * 100, 100);
  return `<div class="progress-bar"><div class="progress-fill ${cls}" style="width:${pct}%"></div></div>`;
}

function renderEmptyState(icon, title, subtitle) {
  return `<div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
    <div style="font-size:48px;margin-bottom:16px">${icon}</div>
    <h3 style="font-size:16px;color:var(--text-secondary);margin-bottom:8px">${title}</h3>
    <p style="font-size:13px">${subtitle}</p>
  </div>`;
}

function renderMiniChart(data, color = 'var(--accent)', h = 40, w = 120) {
  if (!data || !data.length) return '';
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length-1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${(data.length-1)/(data.length-1)*w}" cy="${h - ((data[data.length-1]-min)/range)*(h-4)-2}" r="3" fill="${color}"/>
  </svg>`;
}

// ===== 🏆 Achievement System =====
function getAgentAchievements(agent) {
  return [
    { id: 'first_task', name: 'First Blood', icon: '🥇', desc: 'Complete first task', earned: agent.tasksCompleted >= 1 },
    { id: 'five_tasks', name: 'Workhorse', icon: '🐎', desc: 'Complete 5 tasks', earned: agent.tasksCompleted >= 5 },
    { id: 'ten_tasks', name: 'Task Master', icon: '👑', desc: 'Complete 10 tasks', earned: agent.tasksCompleted >= 10 },
    { id: 'level5', name: 'Rising Star', icon: '⭐', desc: 'Reach Level 5', earned: agent.level >= 5 },
    { id: 'level10', name: 'Elite Agent', icon: '💎', desc: 'Reach Level 10', earned: agent.level >= 10 },
    { id: 'no_fail', name: 'Perfectionist', icon: '✨', desc: '0 failed tasks', earned: agent.tasksCompleted >= 3 && (agent.tasksFailed || 0) === 0 },
    { id: 'veteran', name: 'Veteran', icon: '🎖️', desc: 'Level 7+', earned: agent.level >= 7 },
    { id: 'powerhouse', name: 'Powerhouse', icon: '💪', desc: 'Complete 20 tasks', earned: agent.tasksCompleted >= 20 },
    { id: 'speedy', name: 'Speed Demon', icon: '⚡', desc: 'Currently working', earned: agent.status === 'working' },
    { id: 'team_player', name: 'Team Player', icon: '🤝', desc: 'Been in a meeting', earned: agent.status === 'meeting' || agent.level >= 3 },
  ];
}

// ===== 🔔 Live Notification Feed =====
let liveNotifQueue = [];
let liveNotifActive = false;

function showLiveNotification(icon, title, message, type = 'info') {
  liveNotifQueue.push({ icon, title, message, type });
  if (!liveNotifActive) processLiveNotifQueue();
}

function processLiveNotifQueue() {
  if (!liveNotifQueue.length) { liveNotifActive = false; return; }
  liveNotifActive = true;
  const { icon, title, message, type } = liveNotifQueue.shift();

  // Create or get container
  let container = document.getElementById('liveNotifContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'liveNotifContainer';
    container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;max-width:360px';
    document.body.appendChild(container);
  }

  const colors = { info: '#6366f1', success: '#22c55e', warning: '#f59e0b', error: '#ef4444' };
  const notif = document.createElement('div');
  notif.style.cssText = `
    background:rgba(15,20,35,0.95);backdrop-filter:blur(20px);border-radius:12px;
    padding:14px 16px;border:1px solid ${colors[type]}33;
    box-shadow:0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.05);
    display:flex;gap:10px;align-items:flex-start;
    animation:slideInRight 0.3s ease;cursor:pointer;
    transition:transform 0.2s,opacity 0.3s;
  `;
  notif.innerHTML = `
    <span style="font-size:20px;flex-shrink:0">${icon}</span>
    <div style="flex:1;min-width:0">
      <div style="font-size:12px;font-weight:700;color:${colors[type]};margin-bottom:2px">${title}</div>
      <div style="font-size:11px;color:#b0b8c8;line-height:1.4">${message}</div>
    </div>
    <span style="color:#5a6480;font-size:14px;cursor:pointer;padding:2px" onclick="this.parentElement.remove()">✕</span>
  `;
  notif.onclick = () => notif.remove();
  container.appendChild(notif);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(100%)';
    setTimeout(() => { notif.remove(); processLiveNotifQueue(); }, 300);
  }, 4000);
}

// Add CSS animation
const liveNotifStyle = document.createElement('style');
liveNotifStyle.textContent = `
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`;
document.head.appendChild(liveNotifStyle);

// ===== 🧬 Skill Tree =====
const SKILL_TREES = {
  engineering: [
    { icon: '💻', name: 'Code Review', lvl: 1 },
    { icon: '🏗️', name: 'Architecture', lvl: 2 },
    { icon: '🔧', name: 'Debugging', lvl: 3 },
    { icon: '⚡', name: 'Performance', lvl: 5 },
    { icon: '🛡️', name: 'Security', lvl: 7 },
    { icon: '🚀', name: 'Deployment', lvl: 9 },
  ],
  design: [
    { icon: '🎨', name: 'UI Design', lvl: 1 },
    { icon: '📐', name: 'Layout', lvl: 2 },
    { icon: '🖼️', name: 'Prototyping', lvl: 3 },
    { icon: '✨', name: 'Animation', lvl: 5 },
    { icon: '🧩', name: 'Design System', lvl: 7 },
    { icon: '👁️', name: 'UX Research', lvl: 9 },
  ],
  marketing: [
    { icon: '📢', name: 'Content', lvl: 1 },
    { icon: '📊', name: 'Analytics', lvl: 2 },
    { icon: '🎯', name: 'Targeting', lvl: 3 },
    { icon: '📱', name: 'Social Media', lvl: 5 },
    { icon: '🤝', name: 'Partnerships', lvl: 7 },
    { icon: '🏆', name: 'Brand Strategy', lvl: 9 },
  ],
};
// Default tree for departments not explicitly listed
const DEFAULT_SKILLS = [
  { icon: '📝', name: 'Documentation', lvl: 1 },
  { icon: '🔍', name: 'Research', lvl: 2 },
  { icon: '📈', name: 'Analysis', lvl: 3 },
  { icon: '🧪', name: 'Testing', lvl: 5 },
  { icon: '🎓', name: 'Mentoring', lvl: 7 },
  { icon: '👑', name: 'Leadership', lvl: 9 },
];

function renderSkillTree(agent) {
  const skills = SKILL_TREES[agent.department] || DEFAULT_SKILLS;
  const w = 420, h = 50;
  const spacing = w / (skills.length + 1);

  return `<div style="position:relative;background:var(--bg-input);border-radius:var(--radius-xs);padding:12px 8px;overflow-x:auto">
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;margin:0 auto">
      <!-- Connection lines -->
      ${skills.map((s, i) => {
        if (i === 0) return '';
        const x1 = spacing * i, x2 = spacing * (i + 1);
        const unlocked = agent.level >= s.lvl;
        return `<line x1="${x1}" y1="25" x2="${x2}" y2="25" stroke="${unlocked ? '#22c55e' : '#2a3050'}" stroke-width="2" ${unlocked ? '' : 'stroke-dasharray="4 4"'}/>`;
      }).join('')}
    </svg>
    <div style="display:flex;justify-content:space-around;margin-top:-35px;position:relative;z-index:1">
      ${skills.map(s => {
        const unlocked = agent.level >= s.lvl;
        return `<div style="text-align:center;min-width:55px" title="${s.name} (Lv.${s.lvl})">
          <div style="width:32px;height:32px;border-radius:50%;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:16px;
            ${unlocked 
              ? `background:linear-gradient(135deg,rgba(34,197,94,0.25),rgba(16,185,129,0.15));border:2px solid #22c55e;box-shadow:0 0 8px rgba(34,197,94,0.4)` 
              : `background:var(--bg-input);border:2px solid #2a3050;opacity:0.5`}">
            ${unlocked ? s.icon : '🔒'}
          </div>
          <div style="font-size:9px;margin-top:3px;color:${unlocked ? '#22c55e' : 'var(--text-muted)'};font-weight:${unlocked ? '600' : '400'}">${s.name}</div>
          <div style="font-size:8px;color:var(--text-muted)">Lv.${s.lvl}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

// ===== 📸 Export Profile Card =====
function exportAgentProfileCard(agentId) {
  const agent = Store.getAgent(agentId);
  if (!agent) return showToast('Agent not found', 'error');

  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 500, 300);
  grad.addColorStop(0, '#0f1423');
  grad.addColorStop(1, '#1a1f3a');
  ctx.fillStyle = grad;
  ctx.roundRect(0, 0, 500, 300, 16);
  ctx.fill();

  // Border glow
  ctx.strokeStyle = '#6366f140';
  ctx.lineWidth = 2;
  ctx.roundRect(0, 0, 500, 300, 16);
  ctx.stroke();

  // Agent emoji circle
  ctx.fillStyle = agent.color;
  ctx.beginPath();
  ctx.arc(70, 80, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '28px serif';
  ctx.textAlign = 'center';
  ctx.fillText(agent.emoji, 70, 90);

  // Tier badge
  const tier = getAgentTier(agent.level);
  ctx.font = '18px serif';
  ctx.fillText(tier.icon, 95, 55);

  // Name & info
  ctx.textAlign = 'left';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(agent.name, 125, 70);

  const dept = Store.getDeptInfo(agent.department);
  ctx.fillStyle = '#8892a8';
  ctx.font = '13px system-ui, sans-serif';
  ctx.fillText(`${dept?.name || agent.department} · Level ${agent.level} · ${tier.name}`, 125, 92);

  // Stats boxes
  const stats = [
    { label: 'Tasks Done', value: agent.tasksCompleted, color: '#22c55e' },
    { label: 'Success %', value: agent.tasksCompleted ? Math.round(agent.tasksCompleted / (agent.tasksCompleted + (agent.tasksFailed||0)) * 100) + '%' : '100%', color: '#818cf8' },
    { label: 'Level', value: `Lv.${agent.level}`, color: '#f59e0b' },
    { label: 'XP', value: `${agent.xp}/${agent.xpMax}`, color: '#06b6d4' },
  ];

  stats.forEach((s, i) => {
    const x = 30 + i * 115;
    ctx.fillStyle = '#141830';
    ctx.roundRect(x, 130, 100, 55, 8);
    ctx.fill();
    ctx.fillStyle = s.color;
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(s.value), x + 50, 158);
    ctx.fillStyle = '#5a6480';
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText(s.label, x + 50, 175);
  });

  // Achievements count
  const achievements = getAgentAchievements(agent);
  const earned = achievements.filter(a => a.earned).length;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillText(`🏆 ${earned}/${achievements.length} Achievements`, 30, 220);

  // XP Progress bar
  ctx.fillStyle = '#1e2340';
  ctx.roundRect(30, 235, 440, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#6366f1';
  ctx.roundRect(30, 235, 440 * (agent.xp / agent.xpMax), 10, 5);
  ctx.fill();

  // Footer
  ctx.fillStyle = '#3a4060';
  ctx.font = '10px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏢 Claw-Empire · AI Agent Office Simulator', 250, 280);

  // Download
  const link = document.createElement('a');
  link.download = `${agent.name}_profile_card.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast(`📸 ${agent.name} Profile Card exported!`, 'success');
}

// ===== ⏰ Focus Timer (Pomodoro) =====
let focusTimerState = { running: false, seconds: 25 * 60, mode: 'work', interval: null };

function showFocusTimer() {
  let existing = document.getElementById('focusTimerWidget');
  if (existing) { existing.remove(); return; }

  const widget = document.createElement('div');
  widget.id = 'focusTimerWidget';
  widget.style.cssText = 'position:fixed;bottom:20px;right:20px;width:200px;background:rgba(15,20,35,0.97);border:1px solid rgba(99,102,241,0.3);border-radius:16px;padding:16px;box-shadow:0 12px 40px rgba(0,0,0,0.5);z-index:15000;text-align:center;backdrop-filter:blur(12px)';
  document.body.appendChild(widget);
  renderFocusTimer();
}

function renderFocusTimer() {
  const widget = document.getElementById('focusTimerWidget');
  if (!widget) return;
  const { seconds, mode, running } = focusTimerState;
  const total = mode === 'work' ? 25 * 60 : 5 * 60;
  const pct = seconds / total;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const r = 60, cx = 80, cy = 70;
  const circumference = 2 * Math.PI * r;
  const dashoffset = circumference * (1 - pct);
  const color = mode === 'work' ? '#6366f1' : '#22c55e';

  widget.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span style="font-size:12px;font-weight:700;color:${color}">⏰ ${mode === 'work' ? 'Focus Time' : 'Break Time'}</span>
      <span onclick="document.getElementById('focusTimerWidget')?.remove()" style="cursor:pointer;color:#5a6480;font-size:14px">✕</span>
    </div>
    <svg width="160" height="140" viewBox="0 0 160 140" style="margin:0 auto;display:block">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1e2340" stroke-width="8"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="8" 
        stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${dashoffset}"
        transform="rotate(-90 ${cx} ${cy})" style="transition:stroke-dashoffset 0.5s"/>
      <text x="${cx}" y="${cy-5}" text-anchor="middle" font-size="28" font-weight="800" fill="#e2e8f0" font-family="system-ui">${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}</text>
      <text x="${cx}" y="${cy+15}" text-anchor="middle" font-size="10" fill="#5a6480">${mode === 'work' ? '💼 Working' : '☕ Resting'}</text>
    </svg>
    <div style="display:flex;gap:6px;justify-content:center;margin-top:8px">
      <button onclick="toggleFocusTimer()" style="padding:6px 16px;border-radius:8px;border:none;cursor:pointer;font-size:12px;font-weight:700;
        background:${running ? 'rgba(239,68,68,0.2);color:#ef4444' : `rgba(${mode==='work' ? '99,102,241' : '34,197,94'},0.2);color:${color}`}">
        ${running ? '⏸ Pause' : '▶ Start'}
      </button>
      <button onclick="resetFocusTimer()" style="padding:6px 12px;border-radius:8px;border:none;cursor:pointer;font-size:12px;background:rgba(255,255,255,0.05);color:#8892a8">🔄</button>
    </div>`;
}

function toggleFocusTimer() {
  if (focusTimerState.running) {
    clearInterval(focusTimerState.interval);
    focusTimerState.running = false;
  } else {
    focusTimerState.running = true;
    focusTimerState.interval = setInterval(() => {
      focusTimerState.seconds--;
      if (focusTimerState.seconds <= 0) {
        clearInterval(focusTimerState.interval);
        focusTimerState.running = false;
        playSound('notification');
        if (focusTimerState.mode === 'work') {
          focusTimerState.mode = 'break';
          focusTimerState.seconds = 5 * 60;
          showLiveNotification('break', '☕ Break Time!', 'เวลาพัก 5 นาที — ไปยืดเส้นยืดสาย!', '☕');
        } else {
          focusTimerState.mode = 'work';
          focusTimerState.seconds = 25 * 60;
          showLiveNotification('success', '💪 Back to Work!', 'เริ่ม Focus Time 25 นาที!', '💼');
        }
      }
      renderFocusTimer();
    }, 1000);
  }
  renderFocusTimer();
}

function resetFocusTimer() {
  clearInterval(focusTimerState.interval);
  focusTimerState = { running: false, seconds: 25 * 60, mode: 'work', interval: null };
  renderFocusTimer();
}
