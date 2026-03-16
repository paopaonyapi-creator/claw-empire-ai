// ===== Agents Tab =====
function renderAgents() {
  const agents = Store.get('agents');
  document.getElementById('tab-agents').innerHTML = `
    <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:4px">🤖 Agent Management</h2>
        <p style="color:var(--text-muted);font-size:13px">${agents.length} agents across ${DEPARTMENTS.length} departments</p>
      </div>
      <div style="display:flex;gap:8px">
        <input class="form-input" style="width:200px;padding:7px 12px" placeholder="Search agents..." id="agentSearch" oninput="filterAgentTable()" />
        <button class="btn btn-primary btn-sm" onclick="showAddAgentModal()">+ Add Agent</button>
      </div>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <table class="agent-table" id="agentTable">
        <thead>
          <tr>
            <th>Agent</th><th>Department</th><th>Provider</th><th>Status</th>
            <th>Level</th><th>Tasks</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${agents.map(agent => {
            const dept = Store.getDeptInfo(agent.department);
            const provider = Store.getProviderInfo(agent.provider);
            return `<tr data-agent-name="${agent.name.toLowerCase()}">
              <td>
                <div style="display:flex;align-items:center;gap:10px">
                  ${renderAgentAvatar(agent, 36)}
                  <div>
                    <div style="font-weight:600">${agent.name}</div>
                    <div style="font-size:11px;color:var(--text-muted)">Last active ${timeAgo(agent.lastActive)}</div>
                  </div>
                </div>
              </td>
              <td><span class="tag tag-accent">${dept?.icon} ${dept?.name}</span></td>
              <td>
                <div style="font-size:12px">${provider?.icon} ${provider?.name}</div>
                <div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono)">${agent.model}</div>
              </td>
              <td>${renderStatusTag(agent.status)}</td>
              <td>
                <div style="font-weight:700">Lv.${agent.level}</div>
                <div style="width:60px;margin-top:4px">${renderProgressBar(agent.xp, agent.xpMax, 'accent')}</div>
              </td>
              <td>
                <div style="font-weight:600">${agent.tasksCompleted}</div>
                <div style="font-size:10px;color:var(--text-muted)">${agent.tasksFailed} failed</div>
              </td>
              <td>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-sm" onclick="showAgentDetailModal('${agent.id}')">View</button>
                  <button class="btn btn-sm" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff" onclick="showTrainModal('${agent.id}')">🎯 Train</button>
                  <button class="btn btn-sm btn-danger" onclick="removeAgent('${agent.id}')">✕</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function filterAgentTable() {
  const q = document.getElementById('agentSearch')?.value?.toLowerCase() || '';
  document.querySelectorAll('#agentTable tbody tr').forEach(tr => {
    tr.style.display = tr.dataset.agentName.includes(q) ? '' : 'none';
  });
}

// ===== 🎯 Agent Training System =====
const TRAINING_COURSES = [
  { id: 'leadership', name: '👑 Leadership', desc: 'Improve team management', xpCost: 200, skill: 'Leadership', duration: 10000 },
  { id: 'coding', name: '💻 Advanced Coding', desc: 'Master new frameworks', xpCost: 300, skill: 'Full-Stack Dev', duration: 15000 },
  { id: 'analytics', name: '📊 Data Analytics', desc: 'Learn data analysis', xpCost: 250, skill: 'Analytics', duration: 12000 },
  { id: 'security', name: '🔒 Cybersecurity', desc: 'Security best practices', xpCost: 350, skill: 'Security', duration: 18000 },
  { id: 'design', name: '🎨 UX Design', desc: 'User experience mastery', xpCost: 200, skill: 'UX Design', duration: 10000 },
  { id: 'marketing', name: '📢 Growth Marketing', desc: 'Drive user acquisition', xpCost: 250, skill: 'Marketing', duration: 12000 },
  { id: 'ai', name: '🤖 AI/ML Engineering', desc: 'Build intelligent systems', xpCost: 400, skill: 'AI/ML', duration: 20000 },
  { id: 'devops', name: '⚙️ DevOps Mastery', desc: 'CI/CD & infrastructure', xpCost: 300, skill: 'DevOps', duration: 15000 },
];

function showTrainModal(agentId) {
  const agent = Store.getAgent(agentId);
  if (!agent) return;
  const dept = Store.getDeptInfo(agent.department);
  const currentSkills = agent.skills || [];

  const coursesList = TRAINING_COURSES.map(c => {
    const hasSkill = currentSkills.includes(c.skill);
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;
        background:${hasSkill ? 'rgba(34,197,94,0.1)' : 'var(--bg-input)'};
        border:1px solid ${hasSkill ? 'rgba(34,197,94,0.3)' : 'var(--border)'};
        opacity:${hasSkill ? '0.6' : '1'}">
        <div style="font-size:28px">${c.name.split(' ')[0]}</div>
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px">${c.name}</div>
          <div style="font-size:11px;color:var(--text-muted)">${c.desc}</div>
          <div style="font-size:10px;color:var(--accent-light);margin-top:2px">⚡ ${c.xpCost} XP · ⏱️ ${c.duration/1000}s</div>
        </div>
        ${hasSkill
          ? '<span style="color:#22c55e;font-weight:600;font-size:12px">✅ Learned</span>'
          : `<button class="btn btn-sm btn-primary" onclick="startTraining('${agentId}','${c.id}')" ${agent.xp < c.xpCost ? 'disabled style="opacity:0.4"' : ''}>Train</button>`
        }
      </div>`;
  }).join('');

  showModal(`
    <div style="max-width:500px">
      <div style="text-align:center;margin-bottom:20px">
        ${renderAgentAvatar(agent, 56)}
        <h3 style="margin-top:8px">🎯 Train ${agent.name}</h3>
        <p style="color:var(--text-muted);font-size:12px">${dept?.icon} ${dept?.name} · Lv.${agent.level} · XP: ${agent.xp}/${agent.xpMax}</p>
        <p style="color:var(--text-muted);font-size:11px;margin-top:4px">Skills: ${currentSkills.join(', ') || 'None yet'}</p>
      </div>
      <div id="trainingProgress" style="display:none;margin-bottom:16px"></div>
      <div style="display:flex;flex-direction:column;gap:8px;max-height:350px;overflow-y:auto" id="trainingCourses">
        ${coursesList}
      </div>
    </div>
  `);
}

function startTraining(agentId, courseId) {
  const agent = Store.getAgent(agentId);
  const course = TRAINING_COURSES.find(c => c.id === courseId);
  if (!agent || !course) return;
  if (agent.xp < course.xpCost) { showToast('❌ Not enough XP!', 'error'); return; }

  // Deduct XP
  Store.update('agents', agents => agents.map(a =>
    a.id === agentId ? { ...a, xp: a.xp - course.xpCost, status: 'training' } : a
  ));

  // Hide courses, show progress
  const coursesEl = document.getElementById('trainingCourses');
  const progressEl = document.getElementById('trainingProgress');
  if (coursesEl) coursesEl.style.display = 'none';
  if (progressEl) {
    progressEl.style.display = 'block';
    progressEl.innerHTML = `
      <div style="text-align:center;padding:20px">
        <div style="font-size:48px;margin-bottom:12px;animation:celebBounce .6s ease">🎓</div>
        <div style="font-weight:700;font-size:16px;margin-bottom:4px">${agent.name} is training...</div>
        <div style="color:var(--text-muted);font-size:13px;margin-bottom:16px">${course.name} — ${course.desc}</div>
        <div style="width:100%;height:8px;background:var(--bg-input);border-radius:4px;overflow:hidden">
          <div id="trainBar" style="width:0%;height:100%;background:linear-gradient(90deg,#6366f1,#f59e0b);border-radius:4px;transition:width 0.5s"></div>
        </div>
        <div id="trainTimer" style="font-size:11px;color:var(--text-muted);margin-top:8px">0%</div>
      </div>`;
  }

  showToast(`🎓 ${agent.name} started ${course.name}!`, 'info');

  // Animate progress
  const steps = 20;
  const stepTime = course.duration / steps;
  let step = 0;
  const interval = setInterval(() => {
    step++;
    const pct = Math.round((step / steps) * 100);
    const bar = document.getElementById('trainBar');
    const timer = document.getElementById('trainTimer');
    if (bar) bar.style.width = pct + '%';
    if (timer) timer.textContent = pct + '%';

    if (step >= steps) {
      clearInterval(interval);
      // Unlock skill
      Store.update('agents', agents => agents.map(a => {
        if (a.id !== agentId) return a;
        const skills = [...(a.skills || [])];
        if (!skills.includes(course.skill)) skills.push(course.skill);
        return { ...a, skills, status: 'active', xp: a.xp + 50 };
      }));
      showToast(`🎉 ${agent.name} learned ${course.skill}! +50 XP bonus`, 'success', 4000);
      if (typeof showLevelUpCelebration !== 'undefined') {
        // Mini celebration
        Store.update('notifications', ns => [{
          id: generateId(), text: `🎓 ${agent.name} completed ${course.name}!`,
          type: 'success', ts: Date.now(), read: false
        }, ...ns]);
      }
      closeModal();
      renderAgents();
    }
  }, stepTime);
}

function removeAgent(id) {
  if (!confirm('Remove this agent?')) return;
  Store.update('agents', agents => agents.filter(a => a.id !== id));
  renderAgents();
  showToast('Agent removed', 'info');
}
