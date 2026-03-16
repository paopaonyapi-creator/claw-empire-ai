// ===== Office View — Premium Isometric Upgrade =====
let officeViewMode = 'floor'; // floor | grid | list

function renderOffice() {
  const agents = Store.get('agents');
  const statusCounts = {
    working: agents.filter(a => a.status === 'working').length,
    idle: agents.filter(a => a.status === 'idle').length,
    meeting: agents.filter(a => a.status === 'meeting').length,
    offline: agents.filter(a => a.status === 'offline').length,
  };
  const totalTasks = agents.reduce((s, a) => s + (a.tasksCompleted || 0), 0);
  const avgLevel = agents.length ? (agents.reduce((s, a) => s + a.level, 0) / agents.length).toFixed(1) : 0;

  document.getElementById('tab-office').innerHTML = `
    <div class="office-header">
      <div>
        <h2 class="office-title">🏢 ${t('office') || 'Office View'}</h2>
        <p class="office-subtitle">${t('yourVirtualOffice') || 'Your virtual AI company office'}</p>
      </div>
      <div class="office-header-right">
        <div class="office-live-badge">
          <span class="office-live-dot"></span> LIVE
        </div>
        <div class="office-view-toggle">
          <button class="ovt-btn ${officeViewMode==='floor'?'active':''}" onclick="officeViewMode='floor';renderOffice()" title="Floor View">🏢</button>
          <button class="ovt-btn ${officeViewMode==='grid'?'active':''}" onclick="officeViewMode='grid';renderOffice()" title="Grid View">⊞</button>
          <button class="ovt-btn ${officeViewMode==='list'?'active':''}" onclick="officeViewMode='list';renderOffice()" title="List View">☰</button>
        </div>
        <button class="btn btn-sm" onclick="simulateAgentActivity()">⚡ ${t('simulateActivity') || 'Simulate Activity'}</button>
        <button class="btn btn-sm btn-primary" onclick="showAddAgentModal()">+ ${t('addAgent') || 'Add Agent'}</button>
      </div>
    </div>

    <!-- Status Overview Bar -->
    <div class="office-status-bar">
      <div class="osb-item">
        <span class="osb-dot working"></span>
        <span class="osb-count">${statusCounts.working}</span>
        <span class="osb-label">Working</span>
      </div>
      <div class="osb-item">
        <span class="osb-dot idle"></span>
        <span class="osb-count">${statusCounts.idle}</span>
        <span class="osb-label">Idle</span>
      </div>
      <div class="osb-item">
        <span class="osb-dot meeting"></span>
        <span class="osb-count">${statusCounts.meeting}</span>
        <span class="osb-label">Meeting</span>
      </div>
      <div class="osb-item">
        <span class="osb-dot offline"></span>
        <span class="osb-count">${statusCounts.offline}</span>
        <span class="osb-label">Offline</span>
      </div>
      <div class="osb-divider"></div>
      <div class="osb-item">
        <span class="osb-icon">👥</span>
        <span class="osb-count">${agents.length}</span>
        <span class="osb-label">Total</span>
      </div>
      <div class="osb-item">
        <span class="osb-icon">✅</span>
        <span class="osb-count">${totalTasks}</span>
        <span class="osb-label">Tasks Done</span>
      </div>
      <div class="osb-item">
        <span class="osb-icon">📊</span>
        <span class="osb-count">Lv.${avgLevel}</span>
        <span class="osb-label">Avg Level</span>
      </div>
    </div>

    <!-- Main Office Area -->
    ${officeViewMode === 'floor' ? renderOfficeFloor(agents) : ''}
    ${officeViewMode === 'grid' ? renderOfficeGrid(agents) : ''}
    ${officeViewMode === 'list' ? renderOfficeList(agents) : ''}

    <!-- Department Activity Summary -->
    <div class="office-dept-bar">
      ${DEPARTMENTS.slice(0, 8).map(dept => {
        const deptAgents = agents.filter(a => a.department === dept.id);
        const workingCount = deptAgents.filter(a => a.status === 'working').length;
        return `<div class="office-dept-chip ${deptAgents.length ? '' : 'empty'}" onclick="showDeptDetail('${dept.id}')">
          <span>${dept.icon}</span>
          <span class="odc-name">${dept.name}</span>
          <span class="odc-count">${deptAgents.length}
            ${workingCount > 0 ? `<span class="odc-active">${workingCount} active</span>` : ''}
          </span>
        </div>`;
      }).join('')}
    </div>`;
}

function renderOfficeFloor(agents) {
  // Dynamic positioning based on departments
  const deptZones = {
    engineering: { x: 40, y: 30, label: '⚙️ ENGINEERING', color: '#6366f1' },
    design: { x: 440, y: 30, label: '🎨 DESIGN STUDIO', color: '#ec4899' },
    marketing: { x: 40, y: 240, label: '📢 MARKETING', color: '#f59e0b' },
    qa: { x: 240, y: 240, label: '🧪 QA CENTER', color: '#22c55e' },
    devops: { x: 440, y: 240, label: '🚀 DEVOPS', color: '#a855f7' },
    security: { x: 640, y: 240, label: '🛡️ SECURITY', color: '#ef4444' },
    research: { x: 640, y: 30, label: '🔬 RESEARCH', color: '#06b6d4' },
    data: { x: 240, y: 30, label: '📊 DATA SCIENCE', color: '#3b82f6' },
  };

  const deptCounters = {};
  
  return `
    <div class="office-container" style="height:480px">
      <div class="office-floor">
        <!-- Grid Pattern -->
        <div class="office-grid-pattern"></div>

        <!-- Department Zone Labels -->
        ${Object.entries(deptZones).map(([id, z]) => `
          <div class="office-zone-label" style="left:${z.x}px;top:${z.y - 18}px;color:${z.color}">
            ${z.label}
          </div>
          <div class="office-zone-border" style="left:${z.x - 10}px;top:${z.y - 4}px;width:185px;height:196px;border-color:${z.color}20"></div>
        `).join('')}

        <!-- Meeting Room -->
        <div class="office-meeting-room" onclick="showToast('Meeting room: ${agents.filter(a=>a.status==='meeting').length} agents in meeting','info')">
          <div class="omr-icon">🗣️</div>
          <div class="omr-label">MEETING ROOM</div>
          <div class="omr-count">${agents.filter(a=>a.status==='meeting').length} in meeting</div>
        </div>

        <!-- CEO Corner -->
        <div class="office-ceo-desk" onclick="showToast('Welcome back, CEO! 👋\\nCompany: ${Store.get('companyName')}\\nAgents: ${agents.length}','info')">
          <div class="ocd-glow"></div>
          <div style="font-size:28px">👔</div>
          <div class="ocd-label">CEO</div>
          <div class="ocd-name">${Store.get('ceoName')}</div>
        </div>

        <!-- Server Rack -->
        <div class="office-server" onclick="showToast('All systems operational! ✅','success')">
          <div style="font-size:22px">🖥️</div>
          <div style="font-size:9px;color:var(--success);font-weight:600">SERVERS</div>
          <div style="font-size:8px;color:var(--text-muted)">99.9% uptime</div>
        </div>

        <!-- Agent Desks -->
        ${agents.map((agent, i) => {
          const dept = Store.getDeptInfo(agent.department);
          const zone = deptZones[agent.department] || deptZones.engineering;
          if (!deptCounters[agent.department]) deptCounters[agent.department] = 0;
          const idx = deptCounters[agent.department]++;
          const col = idx % 2;
          const row = Math.floor(idx / 2);
          const x = zone.x + col * 95;
          const y = zone.y + 10 + row * 92;

          const statusGlow = agent.status === 'working' ? `box-shadow:0 0 20px ${dept?.color || '#6366f1'}40` :
            agent.status === 'meeting' ? 'box-shadow:0 0 15px rgba(245,158,11,0.3)' : '';
          const pulseClass = agent.status === 'working' ? 'desk-pulse' : '';

          return `<div class="office-desk-v2 ${pulseClass}" style="left:${x}px;top:${y}px;${statusGlow}"
            onclick="showAgentDetailModal('${agent.id}')">
            <div class="odv2-avatar" style="background:${agent.color}">
              ${agent.emoji}
              <div class="odv2-status status-${agent.status}"></div>
            </div>
            <div class="odv2-info">
              <div class="odv2-name">${agent.name}</div>
              <div class="odv2-level">Lv.${agent.level}</div>
            </div>
            <div class="odv2-xp-bar">
              <div class="odv2-xp-fill" style="width:${(agent.xp / agent.xpMax * 100)}%;background:${dept?.color || 'var(--accent)'}"></div>
            </div>
            <div class="odv2-tasks">${agent.tasksCompleted} tasks</div>
          </div>`;
        }).join('')}

        <!-- Decorative Elements -->
        <div class="office-plant" style="left:850px;top:30px">🪴</div>
        <div class="office-plant" style="left:850px;top:160px">🌿</div>
        <div class="office-plant" style="left:10px;top:420px">☕</div>
      </div>
    </div>`;
}

function renderOfficeGrid(agents) {
  return `
    <div class="office-grid-view">
      ${agents.map(agent => {
        const dept = Store.getDeptInfo(agent.department);
        const provider = Store.getProviderInfo(agent.provider);
        const successRate = agent.tasksCompleted > 0
          ? Math.round((agent.tasksCompleted / (agent.tasksCompleted + (agent.tasksFailed || 0))) * 100)
          : 0;
        return `<div class="office-agent-card" onclick="showAgentDetailModal('${agent.id}')">
          <div class="oac-header" style="background:${agent.color}">
            <span class="oac-emoji">${agent.emoji}</span>
            <div class="oac-status-badge status-${agent.status}">${agent.status}</div>
          </div>
          <div class="oac-body">
            <div class="oac-name">${agent.name}</div>
            <div class="oac-dept">${dept?.icon || ''} ${dept?.name || agent.department}</div>
            <div class="oac-stats-row">
              <div class="oac-stat">
                <span class="oac-stat-val">Lv.${agent.level}</span>
                <span class="oac-stat-label">Level</span>
              </div>
              <div class="oac-stat">
                <span class="oac-stat-val">${agent.tasksCompleted}</span>
                <span class="oac-stat-label">Tasks</span>
              </div>
              <div class="oac-stat">
                <span class="oac-stat-val">${successRate}%</span>
                <span class="oac-stat-label">Success</span>
              </div>
            </div>
            <div class="oac-xp">
              <div class="oac-xp-bar">
                <div class="oac-xp-fill" style="width:${(agent.xp / agent.xpMax * 100)}%"></div>
              </div>
              <span class="oac-xp-text">${agent.xp}/${agent.xpMax} XP</span>
            </div>
            <div class="oac-provider">${provider?.icon || '🤖'} ${provider?.name || 'AI'}</div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function renderOfficeList(agents) {
  return `
    <div class="office-list-view">
      <div class="olv-header-row">
        <div class="olv-col" style="width:200px">Agent</div>
        <div class="olv-col" style="width:140px">Department</div>
        <div class="olv-col" style="width:100px">Status</div>
        <div class="olv-col" style="width:80px">Level</div>
        <div class="olv-col" style="width:100px">Tasks</div>
        <div class="olv-col" style="flex:1">XP Progress</div>
        <div class="olv-col" style="width:130px">Provider</div>
      </div>
      ${agents.map(agent => {
        const dept = Store.getDeptInfo(agent.department);
        const provider = Store.getProviderInfo(agent.provider);
        return `<div class="olv-row" onclick="showAgentDetailModal('${agent.id}')">
          <div class="olv-col" style="width:200px">
            <div class="olv-agent">
              <div class="olv-avatar" style="background:${agent.color}">${agent.emoji}</div>
              <div>
                <div class="olv-name">${agent.name}</div>
                <div class="olv-sub">${timeAgo(agent.lastActive || Date.now())}</div>
              </div>
            </div>
          </div>
          <div class="olv-col" style="width:140px">
            <span class="olv-dept-badge" style="border-color:${dept?.color || 'var(--border)'}">${dept?.icon || ''} ${dept?.name || ''}</span>
          </div>
          <div class="olv-col" style="width:100px">${renderStatusTag(agent.status)}</div>
          <div class="olv-col" style="width:80px"><span class="olv-level">Lv.${agent.level}</span></div>
          <div class="olv-col" style="width:100px">
            <span style="font-weight:700;color:var(--success)">${agent.tasksCompleted}</span>
            <span style="color:var(--text-muted)">/ ${(agent.tasksFailed||0)} fail</span>
          </div>
          <div class="olv-col" style="flex:1">
            <div class="olv-xp-row">
              <div class="olv-xp-bar"><div class="olv-xp-fill" style="width:${(agent.xp/agent.xpMax*100)}%"></div></div>
              <span class="olv-xp-text">${agent.xp}/${agent.xpMax}</span>
            </div>
          </div>
          <div class="olv-col" style="width:130px"><span class="olv-provider">${provider?.icon || ''} ${provider?.name || ''}</span></div>
        </div>`;
      }).join('')}
    </div>`;
}

function showDeptDetail(deptId) {
  const dept = Store.getDeptInfo(deptId);
  const agents = Store.get('agents').filter(a => a.department === deptId);
  const tasks = Store.get('tasks').filter(t => t.department === deptId);

  showModal(`${dept?.icon} ${dept?.name} Department`, `
    <div class="grid-3" style="margin-bottom:16px">
      <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:20px;font-weight:800">${agents.length}</div>
        <div style="font-size:11px;color:var(--text-muted)">Agents</div>
      </div>
      <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:20px;font-weight:800">${agents.filter(a=>a.status==='working').length}</div>
        <div style="font-size:11px;color:var(--text-muted)">Working</div>
      </div>
      <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:20px;font-weight:800">${tasks.length}</div>
        <div style="font-size:11px;color:var(--text-muted)">Tasks</div>
      </div>
    </div>
    <div style="font-size:13px;font-weight:600;margin-bottom:8px">Team Members</div>
    ${agents.length ? agents.map(a => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);margin-bottom:6px">
        ${renderAgentAvatar(a, 32)}
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px">${a.name}</div>
          <div style="font-size:10px;color:var(--text-muted)">Lv.${a.level} · ${a.tasksCompleted} tasks</div>
        </div>
        ${renderStatusTag(a.status)}
      </div>
    `).join('') : '<div style="font-size:12px;color:var(--text-muted)">No agents in this department</div>'}
  `, [{ label: 'Close', onclick: 'closeModal()' }]);
}

function simulateAgentActivity() {
  Store.update('agents', agents => agents.map(a => ({
    ...a,
    status: randomChoice(['working', 'working', 'working', 'idle', 'meeting']),
    xp: Math.min(a.xp + Math.floor(Math.random() * 50), a.xpMax),
    lastActive: Date.now(),
  })));
  renderOffice();
  showToast('Agent activity simulated! ⚡', 'success');
}

function showAgentDetailModal(agentId) {
  const agent = Store.getAgent(agentId);
  if (!agent) return;
  const dept = Store.getDeptInfo(agent.department);
  const provider = Store.getProviderInfo(agent.provider);
  const agentTasks = Store.getTasksForAgent(agentId);
  const successRate = agent.tasksCompleted > 0
    ? Math.round((agent.tasksCompleted / (agent.tasksCompleted + (agent.tasksFailed || 0))) * 100) : 0;

  showModal(`Agent: ${agent.name}`, `
    <div style="display:flex;gap:20px;margin-bottom:20px;align-items:center">
      <div style="position:relative">
        ${renderAgentAvatar(agent, 72)}
        <div class="status-indicator status-${agent.status}" style="position:absolute;bottom:2px;right:2px;width:16px;height:16px;border:3px solid var(--bg-card);border-radius:50%"></div>
      </div>
      <div style="flex:1">
        <h3 style="font-size:20px;font-weight:800;margin-bottom:2px">${agent.name}</h3>
        <div style="font-size:13px;color:var(--text-muted)">${dept?.icon} ${dept?.name} · Level ${agent.level}</div>
        <div style="margin-top:6px;display:flex;gap:6px;align-items:center">
          ${renderStatusTag(agent.status)}
          <span class="tag" style="font-size:10px">${provider?.icon} ${provider?.name}</span>
        </div>
      </div>
    </div>

    <div class="grid-4" style="margin-bottom:16px">
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:18px;font-weight:800;color:var(--success)">${agent.tasksCompleted}</div>
        <div style="font-size:10px;color:var(--text-muted)">Completed</div>
      </div>
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:18px;font-weight:800;color:var(--danger)">${agent.tasksFailed || 0}</div>
        <div style="font-size:10px;color:var(--text-muted)">Failed</div>
      </div>
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:18px;font-weight:800;color:var(--accent-light)">${successRate}%</div>
        <div style="font-size:10px;color:var(--text-muted)">Success Rate</div>
      </div>
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:18px;font-weight:800;color:var(--warning)">Lv.${agent.level}</div>
        <div style="font-size:10px;color:var(--text-muted)">Level</div>
      </div>
    </div>

    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px">
        <span style="font-weight:600">XP Progress</span>
        <span style="color:var(--text-muted)">${agent.xp} / ${agent.xpMax} XP</span>
      </div>
      ${renderProgressBar(agent.xp, agent.xpMax, 'accent')}
    </div>

    <!-- 🏆 Achievements -->
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px">🏆 Achievements</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${getAgentAchievements(agent).map(a => `
          <div style="padding:6px 10px;border-radius:12px;font-size:11px;display:flex;align-items:center;gap:4px;
            ${a.earned 
              ? 'background:linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,165,0,0.15));border:1px solid rgba(255,215,0,0.3);color:#ffd700' 
              : 'background:var(--bg-input);color:var(--text-muted);opacity:0.5'}" 
            title="${a.desc}">
            <span>${a.earned ? a.icon : '🔒'}</span>
            <span>${a.name}</span>
          </div>
        `).join('')}
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:6px">
        ⭐ ${getAgentAchievements(agent).filter(a => a.earned).length}/${getAgentAchievements(agent).length} achievements unlocked
      </div>
    </div>

    <!-- 🧬 Skill Tree -->
    <div style="margin-bottom:16px">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px">🧬 Skill Tree</div>
      ${renderSkillTree(agent)}
    </div>

    <div>
      <div style="font-size:13px;font-weight:700;margin-bottom:8px">📋 Active Tasks (${agentTasks.length})</div>
      ${agentTasks.length ? agentTasks.slice(0, 5).map(t => `
        <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);margin-bottom:6px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:12px;font-weight:500">${t.title}</span>
          ${renderStatusTag(t.status)}
        </div>`).join('') : '<div style="font-size:12px;color:var(--text-muted);padding:12px;text-align:center">No tasks assigned yet</div>'}
    </div>
  `, [
    { label: '💬 Chat', class: 'btn-primary', onclick: `closeModal();selectedChatAgent='${agent.id}';document.querySelectorAll('.nav-item')[4]?.click()` },
    { label: '📸 Export Card', onclick: `exportAgentProfileCard('${agent.id}')` },
    { label: 'Close', onclick: 'closeModal()' }
  ]);
}

function showAddAgentModal() {
  showModal('Add New Agent', `
    <div class="form-group">
      <label class="form-label">Agent Name</label>
      <input class="form-input" id="newAgentName" placeholder="e.g. Spark, Bolt, Titan..." />
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Department</label>
        <select class="form-select" id="newAgentDept">
          ${DEPARTMENTS.map(d => `<option value="${d.id}">${d.icon} ${d.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">AI Provider</label>
        <select class="form-select" id="newAgentProvider">
          ${PROVIDERS.map(p => `<option value="${p.id}">${p.icon} ${p.name} (${p.type})</option>`).join('')}
        </select>
      </div>
    </div>
  `, [
    { label: '🤖 Create Agent', class: 'btn-primary', onclick: 'createAgent()' },
    { label: 'Cancel', onclick: 'closeModal()' }
  ]);
}

function createAgent() {
  const name = document.getElementById('newAgentName')?.value?.trim();
  if (!name) { showToast('Please enter a name', 'error'); return; }
  const dept = document.getElementById('newAgentDept').value;
  const providerId = document.getElementById('newAgentProvider').value;
  const provider = Store.getProviderInfo(providerId);
  const i = Store.get('agents').length;
  Store.update('agents', agents => [...agents, {
    id: generateId(), name, department: dept, provider: providerId,
    model: provider?.model || 'unknown', status: 'idle', level: 1, xp: 0, xpMax: 1000,
    skills: [], tasksCompleted: 0, tasksFailed: 0,
    color: SPRITE_COLORS[i % SPRITE_COLORS.length],
    emoji: ['🤖','🧠','💡','⚡','🎯','🔮','🌟','🦾','🧬','🔥','💎','🌀'][i % 12],
    createdAt: Date.now(), lastActive: Date.now(),
  }]);
  closeModal();
  renderOffice();
  showToast(`Agent "${name}" created! 🎉`, 'success');
}
