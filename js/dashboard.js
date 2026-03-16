// ===== Dashboard Tab (Enhanced with Charts & i18n) =====
function renderDashboard() {
  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  const meetings = Store.get('meetings');
  const economy = Store.get('economy') || { coins: 5000, totalEarned: 0, totalSpent: 0 };

  const activeAgents = agents.filter(a => a.status === 'working').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled').length;

  const sparkData1 = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40];
  const sparkData2 = [5, 8, 6, 10, 9, 12, 11, 15, 14, 18];
  const sparkData3 = [3, 5, 4, 7, 6, 8, 7, 9, 8, 10];
  const sparkData4 = [2, 3, 2, 4, 3, 5, 4, 6, 5, 7];

  // Build department task count for bar chart
  const deptTaskCounts = DEPARTMENTS.map(d => ({
    name: d.name.substring(0, 6),
    icon: d.icon,
    count: tasks.filter(t => t.department === d.id).length,
    color: d.color,
  }));
  const maxTasks = Math.max(...deptTaskCounts.map(d => d.count), 1);

  // Task status donut chart data
  const statusCounts = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: inProgress,
    review: tasks.filter(t => t.status === 'review').length,
    done: completedTasks,
  };
  const total = tasks.length || 1;

  document.getElementById('tab-dashboard').innerHTML = `
    <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
      <div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:4px">${t('dashboard')}</h2>
        <p style="color:var(--text-muted);font-size:13px">${t('realTimeOverview')}</p>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-sm" onclick="exportDashboardCSV()" title="Download CSV">📊 CSV</button>
        <button class="btn btn-sm" onclick="exportDashboardJSON()" title="Download JSON">📋 JSON</button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid-4" style="margin-bottom:24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
      <div class="kpi-card accent">
        <div class="kpi-icon">🤖</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div class="kpi-value">${agents.length}</div>
            <div class="kpi-label">${t('totalAgents')}</div>
            <div class="kpi-change up">↑ ${activeAgents} ${t('active')}</div>
          </div>
          ${renderMiniChart(sparkData1, '#818cf8')}
        </div>
      </div>
      <div class="kpi-card success">
        <div class="kpi-icon">✅</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div class="kpi-value">${completedTasks}</div>
            <div class="kpi-label">${t('tasksCompleted')}</div>
            <div class="kpi-change up">↑ 23% ${t('thisWeek')}</div>
          </div>
          ${renderMiniChart(sparkData2, '#22c55e')}
        </div>
      </div>
      <div class="kpi-card warning">
        <div class="kpi-icon">⏳</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div class="kpi-value">${inProgress}</div>
            <div class="kpi-label">${t('inProgress')}</div>
            <div class="kpi-change up">↑ 2 ${t('newToday')}</div>
          </div>
          ${renderMiniChart(sparkData3, '#f59e0b')}
        </div>
      </div>
      <div class="kpi-card info">
        <div class="kpi-icon">📅</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div class="kpi-value">${upcomingMeetings}</div>
            <div class="kpi-label">${t('upcomingMeetings')}</div>
            <div class="kpi-change down">↓ 1 ${t('cancelled')}</div>
          </div>
          ${renderMiniChart(sparkData4, '#3b82f6')}
        </div>
      </div>
      <div class="kpi-card" style="border-left:3px solid #f59e0b">
        <div class="kpi-icon">💰</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end">
          <div>
            <div class="kpi-value">${economy.coins?.toLocaleString() || 0}</div>
            <div class="kpi-label">Coins 🪙</div>
            <div class="kpi-change up">+${economy.totalEarned?.toLocaleString() || 0} earned</div>
          </div>
          <button class="btn btn-sm" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;font-size:11px" onclick="showMarketplace()">🏬 Shop</button>
        </div>
      </div>
    </div>

    <div class="grid-3" style="margin-bottom:24px">
      <!-- Agent Rankings -->
      <div class="card" style="grid-column:span 2">
        <div class="card-header">
          <div>
            <div class="card-title">🏆 ${t('agentRankings')}</div>
            <div class="card-subtitle">${t('performanceLeaderboard')}</div>
          </div>
          <button class="btn btn-sm">${t('viewAll')}</button>
        </div>
        <div>
          ${agents.sort((a, b) => b.tasksCompleted - a.tasksCompleted).slice(0, 5).map((agent, i) => {
            const dept = Store.getDeptInfo(agent.department);
            return `<div style="display:flex;align-items:center;gap:12px;padding:10px 0;${i < 4 ? 'border-bottom:1px solid var(--border)' : ''}">
              <span style="font-size:16px;width:24px;text-align:center;font-weight:800;color:${i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'var(--text-muted)'}">${i+1}</span>
              ${renderAgentAvatar(agent, 36)}
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px">${agent.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${dept?.icon} ${dept?.name} · Lv.${agent.level}</div>
              </div>
              <div style="text-align:right">
                <div style="font-weight:700;font-size:14px">${agent.tasksCompleted}</div>
                <div style="font-size:10px;color:var(--text-muted)">${t('tasks')}</div>
              </div>
              <div style="width:80px">${renderProgressBar(agent.xp, agent.xpMax, 'accent')}</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Department Status -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🏢 ${t('departments')}</div>
            <div class="card-subtitle">${t('activeStatus')}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${DEPARTMENTS.slice(0, 6).map(dept => {
            const deptAgents = Store.getAgentsByDept(dept.id);
            const active = deptAgents.filter(a => a.status === 'working').length;
            return `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg-input);border-radius:var(--radius-xs)">
              <span style="font-size:18px">${dept.icon}</span>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:600">${dept.name}</div>
                <div style="font-size:10px;color:var(--text-muted)">${active}/${deptAgents.length} ${t('active')}</div>
              </div>
              <div style="width:60px">${renderProgressBar(active, Math.max(deptAgents.length, 1), 'success')}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid-2" style="margin-bottom:24px">
      <!-- Bar Chart: Tasks by Department -->
      <!-- Bar Chart: Tasks by Department (Chart.js) -->
      <div class="card" style="cursor:pointer" onclick="narrateChart('department')" title="💡 คลิกเพื่อให้ AI อธิบายกราฟ">
        <div class="card-header">
          <div>
            <div class="card-title">📊 Tasks by Department</div>
            <div class="card-subtitle">Distribution across teams · 💡 Click for AI analysis</div>
          </div>
        </div>
        <div style="height:200px;position:relative">
          <canvas id="deptBarChart"></canvas>
        </div>
      </div>

      <!-- Donut Chart: Task Status -->
      <div class="card" style="cursor:pointer" onclick="narrateChart('status')" title="💡 คลิกเพื่อให้ AI อธิบายกราฟ">
        <div class="card-header">
          <div>
            <div class="card-title">🍩 Task Status Distribution</div>
            <div class="card-subtitle">${tasks.length} total tasks · 💡 Click for AI analysis</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:24px">
          <div class="donut-chart">
            ${renderDonutChart(statusCounts, total)}
            <div class="donut-center">
              <div style="font-size:22px;font-weight:800">${tasks.length}</div>
              <div style="font-size:10px;color:var(--text-muted)">${t('tasks')}</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;flex:1">
            ${Object.entries({ backlog:['#8892a8','Backlog'], todo:['#a855f7','To Do'], in_progress:['#f59e0b','In Progress'], review:['#06b6d4','Review'], done:['#22c55e','Done'] })
              .map(([key, [color, label]]) => `
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0"></div>
                <span style="font-size:12px;flex:1">${label}</span>
                <span style="font-size:12px;font-weight:700">${statusCounts[key]}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 📉 Burndown Chart -->
    <div class="card" style="margin-bottom:24px">
      <div class="card-header">
        <div>
          <div class="card-title">📉 Sprint Burndown</div>
          <div class="card-subtitle">7-day sprint progress — ideal vs actual</div>
        </div>
        <span class="tag tag-info" style="font-size:10px">Sprint #${Math.ceil(Math.random()*12+1)}</span>
      </div>
      <div style="padding:0 8px">${renderBurndownChart(tasks)}</div>
    </div>

    <div class="grid-2">
      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">⚡ ${t('recentActivity')}</div>
            <div class="card-subtitle">${t('latestUpdates')}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:2px">
          ${Store.get('notifications').slice(0, 5).map(n => `
            <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
              <span style="font-size:14px">${n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
              <div style="flex:1">
                <div style="font-size:12px">${n.text}</div>
                <div style="font-size:10px;color:var(--text-muted)">${timeAgo(n.ts)}</div>
              </div>
              ${!n.read ? '<div style="width:6px;height:6px;background:var(--accent);border-radius:50%;flex-shrink:0;margin-top:6px"></div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Provider Status -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🔌 ${t('providerStatus')}</div>
            <div class="card-subtitle">${t('connectedProviders')}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${PROVIDERS.slice(0, 6).map(p => {
            const agentsUsing = agents.filter(a => a.provider === p.id).length;
            const isActive = agentsUsing > 0;
            return `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg-input);border-radius:var(--radius-xs)">
              <span style="font-size:16px">${p.icon}</span>
              <div style="flex:1">
                <div style="font-size:12px;font-weight:600">${p.name}</div>
                <div style="font-size:10px;color:var(--text-muted)">${p.model} · ${p.type.toUpperCase()}</div>
              </div>
              <span class="tag ${isActive ? 'tag-success' : 'tag-info'}">${isActive ? `${agentsUsing} agent${agentsUsing>1?'s':''}` : 'Available'}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- 🤖 AI Powered Features -->
    <div style="margin-top:24px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <h3 style="font-size:16px;font-weight:700;margin:0">🤖 AI-Powered Features</h3>
        <span class="tag tag-accent" style="font-size:10px">
          ${getAllAvailableProviders().length} AI${getAllAvailableProviders().length > 1 ? 's' : ''} Active
        </span>
      </div>
      <div class="grid-3" style="gap:12px">
        <button class="ai-feature-btn" onclick="generateAIInsights()" id="btn-ai-insights">
          <span style="font-size:24px">🧠</span>
          <div style="font-weight:700;font-size:13px">AI Insights</div>
          <div style="font-size:10px;color:var(--text-muted)">วิเคราะห์ข้อมูลทีม</div>
        </button>
        <button class="ai-feature-btn" onclick="generateAIReport()" id="btn-ai-report">
          <span style="font-size:24px">📊</span>
          <div style="font-weight:700;font-size:13px">AI Report</div>
          <div style="font-size:10px;color:var(--text-muted)">สร้างรายงานสรุป</div>
        </button>
        <button class="ai-feature-btn" onclick="runMultiModelCompare()" id="btn-multi-compare">
          <span style="font-size:24px">⚔️</span>
          <div style="font-weight:700;font-size:13px">Multi-Model</div>
          <div style="font-size:10px;color:var(--text-muted)">เปรียบเทียบ AI</div>
        </button>
      </div>
      <div class="grid-3" style="gap:12px;margin-top:12px">
        <button class="ai-feature-btn" onclick="generateDailyStandup()">
          <span style="font-size:24px">📝</span>
          <div style="font-weight:700;font-size:13px">Daily Standup</div>
          <div style="font-size:10px;color:var(--text-muted)">สรุปสถานะทีมประจำวัน</div>
        </button>
        <button class="ai-feature-btn" onclick="generateWeekReport()">
          <span style="font-size:24px">📈</span>
          <div style="font-weight:700;font-size:13px">Week Report</div>
          <div style="font-size:10px;color:var(--text-muted)">สรุปรายสัปดาห์</div>
        </button>
        <button class="ai-feature-btn" onclick="toggleSimulation()" id="simToggleBtn">
          <span style="font-size:24px">🔄</span>
          <div style="font-weight:700;font-size:13px">Simulation</div>
          <div style="font-size:10px;color:var(--text-muted)">เปิด/ปิด Auto-Sim</div>
        </button>
      </div>
      <div id="ai-result-panel" style="margin-top:16px"></div>
    </div>
  `;

  // Render Chart.js bar chart after DOM is ready
  setTimeout(() => {
    const canvas = document.getElementById('deptBarChart');
    if (canvas && typeof Chart !== 'undefined') {
      // Destroy previous instance if exists
      if (canvas._chartInstance) canvas._chartInstance.destroy();
      const ctx = canvas.getContext('2d');
      canvas._chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: deptTaskCounts.map(d => d.icon + ' ' + d.name),
          datasets: [{
            label: 'Tasks',
            data: deptTaskCounts.map(d => d.count),
            backgroundColor: deptTaskCounts.map(d => d.color + '99'),
            borderColor: deptTaskCounts.map(d => d.color),
            borderWidth: 2,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#8892a8', stepSize: 1 },
              grid: { color: 'rgba(255,255,255,0.06)' },
            },
            x: {
              ticks: { color: '#8892a8', font: { size: 10 } },
              grid: { display: false },
            }
          }
        }
      });
    }
  }, 50);
}

// ===== SVG Donut Chart =====
function renderDonutChart(data, total) {
  const colors = { backlog:'#8892a8', todo:'#a855f7', in_progress:'#f59e0b', review:'#06b6d4', done:'#22c55e' };
  const r = 50, cx = 60, cy = 60, sw = 14;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const segments = Object.entries(data).map(([key, value]) => {
    const pct = value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const segment = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colors[key]}"
      stroke-width="${sw}" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}"
      transform="rotate(-90 ${cx} ${cy})" style="transition:stroke-dasharray 1s ease,stroke-dashoffset 1s ease"/>`;
    offset += dash;
    return segment;
  }).join('');

  return `<svg width="120" height="120" viewBox="0 0 120 120">${segments}</svg>`;
}

// ===== AI Dashboard Features =====
function gatherTeamMetrics() {
  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  const meetings = Store.get('meetings');
  return {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'working').length,
    idleAgents: agents.filter(a => a.status === 'idle').length,
    totalTasks: tasks.length,
    doneTasks: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    backlog: tasks.filter(t => t.status === 'backlog').length,
    highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'done').length,
    meetings: meetings.length,
    scheduledMeetings: meetings.filter(m => m.status === 'scheduled').length,
    topAgent: agents.sort((a, b) => b.tasksCompleted - a.tasksCompleted)[0]?.name || 'N/A',
    agentList: agents.map(a => `${a.name}(${a.department},Lv${a.level},${a.status})`).join(', '),
  };
}

function showAIResultPanel(title, icon, content, provider) {
  const panel = document.getElementById('ai-result-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="card" style="border:1px solid var(--accent);animation:fadeUp 0.3s ease">
      <div class="card-header" style="border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">${icon}</span>
          <div>
            <div class="card-title">${title}</div>
            ${provider ? `<div class="card-subtitle">${provider.icon} Powered by ${provider.name}</div>` : ''}
          </div>
        </div>
        <button class="btn btn-sm" onclick="document.getElementById('ai-result-panel').innerHTML=''">✕</button>
      </div>
      <div style="padding:16px;font-size:13px;line-height:1.8;white-space:pre-wrap">${content}</div>
    </div>`;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function generateAIInsights() {
  const btn = document.getElementById('btn-ai-insights');
  if (btn) btn.innerHTML = '<span style="font-size:24px">⏳</span><div style="font-weight:700;font-size:13px">Analyzing...</div><div style="font-size:10px;color:var(--text-muted)">กำลังวิเคราะห์</div>';

  const metrics = gatherTeamMetrics();
  const prompt = `คุณเป็น AI Analyst ของบริษัท Claw-Empire AI Corp วิเคราะห์ข้อมูลทีมต่อไปนี้แล้วให้ insights เป็นภาษาไทย:

ข้อมูลทีม:
- Agent ทั้งหมด: ${metrics.totalAgents} (Active: ${metrics.activeAgents}, Idle: ${metrics.idleAgents})
- Tasks: ${metrics.totalTasks} (Done: ${metrics.doneTasks}, In Progress: ${metrics.inProgress}, Backlog: ${metrics.backlog})
- High Priority ค้าง: ${metrics.highPriority}
- Meetings: ${metrics.scheduledMeetings} scheduled
- Top Performer: ${metrics.topAgent}
- ทีม: ${metrics.agentList}

ให้วิเคราะห์ 3-5 ข้อ พร้อมคำแนะนำ ใช้ emoji ให้ดูน่าอ่าน กระชับ`;

  try {
    const result = await callAIWithFailover(
      'คุณเป็น AI Business Analyst เก่งมาก วิเคราะห์ข้อมูลทีมและให้คำแนะนำเชิงกลยุทธ์',
      prompt, null
    );
    showAIResultPanel('AI Insights — วิเคราะห์ข้อมูลทีม', '🧠', result.response, result.provider);
  } catch (err) {
    showAIResultPanel('Error', '❌', `วิเคราะห์ไม่ได้: ${err.message}`, null);
  }

  if (btn) btn.innerHTML = '<span style="font-size:24px">🧠</span><div style="font-weight:700;font-size:13px">AI Insights</div><div style="font-size:10px;color:var(--text-muted)">วิเคราะห์ข้อมูลทีม</div>';
}

async function generateAIReport() {
  const btn = document.getElementById('btn-ai-report');
  if (btn) btn.innerHTML = '<span style="font-size:24px">⏳</span><div style="font-weight:700;font-size:13px">Generating...</div><div style="font-size:10px;color:var(--text-muted)">กำลังสร้างรายงาน</div>';

  const metrics = gatherTeamMetrics();
  const prompt = `สร้างรายงานสรุปทีม Claw-Empire AI Corp เป็นภาษาไทย:

ข้อมูล:
- 🤖 Agent: ${metrics.totalAgents} คน (Active ${metrics.activeAgents}, Idle ${metrics.idleAgents})
- ✅ Tasks Done: ${metrics.doneTasks}/${metrics.totalTasks} (${Math.round(metrics.doneTasks/Math.max(metrics.totalTasks,1)*100)}%)
- 🔄 In Progress: ${metrics.inProgress}
- 📋 Backlog: ${metrics.backlog}
- 🔴 High Priority ค้าง: ${metrics.highPriority}
- 🏆 Top: ${metrics.topAgent}

สร้างรายงานสรุปแบบ Executive Summary มี:
1. ภาพรวมผลงาน
2. จุดเด่น & จุดที่ต้องปรับปรุง
3. แนวทางแก้ไข 3 ข้อ
4. KPI เป้าหมายสัปดาห์หน้า
ใช้ emoji ให้สวยงาม กระชับ`;

  try {
    const result = await callAIWithFailover(
      'คุณเป็น Project Manager มืออาชีพ เขียนรายงานสรุปทีมที่กระชับ มี insights เชิงลึก',
      prompt, null
    );
    showAIResultPanel('📊 AI Report — สรุปผลงานทีม', '📊', result.response, result.provider);
  } catch (err) {
    showAIResultPanel('Error', '❌', `สร้างรายงานไม่ได้: ${err.message}`, null);
  }

  if (btn) btn.innerHTML = '<span style="font-size:24px">📊</span><div style="font-weight:700;font-size:13px">AI Report</div><div style="font-size:10px;color:var(--text-muted)">สร้างรายงานสรุป</div>';
}

async function runMultiModelCompare() {
  const btn = document.getElementById('btn-multi-compare');
  if (btn) btn.innerHTML = '<span style="font-size:24px">⏳</span><div style="font-weight:700;font-size:13px">Comparing...</div><div style="font-size:10px;color:var(--text-muted)">กำลังเปรียบเทียบ</div>';

  const providers = getAllAvailableProviders();
  if (providers.length < 2) {
    showAIResultPanel('Error', '⚠️', 'ต้องมี API Key อย่างน้อย 2 ตัวขึ้นไปถึงจะเปรียบเทียบได้', null);
    if (btn) btn.innerHTML = '<span style="font-size:24px">⚔️</span><div style="font-weight:700;font-size:13px">Multi-Model</div><div style="font-size:10px;color:var(--text-muted)">เปรียบเทียบ AI</div>';
    return;
  }

  const question = 'อธิบายสั้นๆ 2- 3 ประโยค ว่า AI จะเปลี่ยนการทำงานในออฟฟิศอย่างไรในอนาคต';
  const systemPrompt = 'ตอบเป็นภาษาไทย กระชับ 2-3 ประโยค';

  let results = [];
  for (const provider of providers) {
    try {
      const start = Date.now();
      let response;
      if (provider.type === 'gemini') {
        response = await callGeminiAPI(provider.apiKey, systemPrompt, question, null);
      } else if (provider.type === 'anthropic') {
        response = await callAnthropicAPI(provider, systemPrompt, question, null);
      } else {
        response = await callOpenAICompatibleAPI(provider, systemPrompt, question, null);
      }
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      results.push({ provider, response, elapsed, ok: true });
    } catch (err) {
      results.push({ provider, response: `❌ ${err.message}`, elapsed: '-', ok: false });
    }
  }

  // Build comparison panel
  let html = `<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));gap:12px">`;
  results.forEach(r => {
    html += `<div style="background:var(--bg-input);border-radius:var(--radius-sm);padding:12px;border:1px solid ${r.ok ? 'var(--border)' : 'var(--danger)'}">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
        <span>${r.provider.icon}</span>
        <strong style="font-size:12px">${r.provider.name}</strong>
        <span style="margin-left:auto;font-size:10px;color:var(--text-muted)">⏱ ${r.elapsed}s</span>
      </div>
      <div style="font-size:12px;line-height:1.6">${r.response}</div>
    </div>`;
  });
  html += `</div><div style="margin-top:8px;font-size:10px;color:var(--text-muted)">❓ คำถาม: "${question}"</div>`;

  showAIResultPanel(`⚔️ Multi-Model Comparison — ${results.length} AI${results.length>1?'s':''}`, '⚔️', html, null);

  if (btn) btn.innerHTML = '<span style="font-size:24px">⚔️</span><div style="font-weight:700;font-size:13px">Multi-Model</div><div style="font-size:10px;color:var(--text-muted)">เปรียบเทียบ AI</div>';
}

// ===== 📊 AI Chart Narrator =====
async function narrateChart(chartType) {
  if (typeof getAllAvailableProviders === 'undefined' || !getAllAvailableProviders().length) {
    showToast('❌ ต้องมี API Key อย่างน้อย 1 ตัว', 'error'); return;
  }

  showToast('📊 AI กำลังวิเคราะห์กราฟ...', 'info');

  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  let chartData = '';

  if (chartType === 'department') {
    const deptInfo = DEPARTMENTS.map(d => {
      const count = tasks.filter(t => t.department === d.id).length;
      const done = tasks.filter(t => t.department === d.id && t.status === 'done').length;
      return `${d.name}: ${count} tasks (${done} done)`;
    }).join('\n');
    chartData = `กราฟแท่ง: Tasks by Department\n${deptInfo}`;
  } else if (chartType === 'status') {
    const statuses = {
      backlog: tasks.filter(t => t.status === 'backlog').length,
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
    chartData = `กราฟโดนัท: Task Status Distribution\nBacklog: ${statuses.backlog}, Todo: ${statuses.todo}, In Progress: ${statuses.in_progress}, Review: ${statuses.review}, Done: ${statuses.done}\nรวม: ${tasks.length} tasks`;
  }

  const prompt = `วิเคราะห์ข้อมูลกราฟนี้เป็นภาษาไทย สั้นๆ 3-5 ประโยค:
1. อธิบายสิ่งที่เห็นจากข้อมูล
2. จุดเด่นหรือปัญหาที่ควรสนใจ
3. คำแนะนำสั้นๆ

ข้อมูล:
${chartData}`;

  try {
    const result = await callAIWithFailover(
      'คุณเป็น Data Analyst เชี่ยวชาญการอ่านกราฟ ตอบเป็นภาษาไทย กระชับ', prompt, null
    );

    const emoji = chartType === 'department' ? '📊' : '🍩';
    showAIResultPanel(
      `${emoji} AI Chart Analysis`,
      emoji,
      `<div style="font-size:13px;line-height:1.7">${result.response}</div>
       <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">⏱️ ${result.provider.name} · ${(result.responseTime/1000).toFixed(1)}s</div>`,
      null
    );
  } catch (err) {
    showToast(`❌ วิเคราะห์กราฟไม่ได้: ${err.message}`, 'error');
  }
}

// ===== 📝 AI Daily Standup Generator =====
async function generateDailyStandup() {
  if (typeof getAllAvailableProviders === 'undefined' || !getAllAvailableProviders().length) {
    showToast('❌ ต้องมี API Key อย่างน้อย 1 ตัว', 'error'); return;
  }

  showToast('📝 AI กำลังสร้าง Daily Standup...', 'info');

  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  const meetings = Store.get('meetings');

  // Build detailed agent status
  const agentStatus = agents.map(a => {
    const dept = Store.getDeptInfo(a.department);
    const agentTasks = tasks.filter(t => t.assignedTo === a.id);
    const inProgress = agentTasks.filter(t => t.status === 'in_progress');
    const completed = agentTasks.filter(t => t.status === 'done');
    return `- ${a.name} (${dept?.name}, Lv${a.level}, ${a.status}): ${inProgress.length} กำลังทำ, ${completed.length} เสร็จแล้ว [tasks: ${inProgress.map(t=>t.title).join(', ') || 'ว่าง'}]`;
  }).join('\n');

  // Task summary
  const taskSummary = {
    total: tasks.length,
    backlog: tasks.filter(t => t.status === 'backlog').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    unassigned: tasks.filter(t => !t.assignedTo).length,
  };

  const today = new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `สร้าง Daily Standup Report (สรุปสถานะทีมประจำวัน) เป็นภาษาไทย

วันที่: ${today}

สถานะ Agent:
${agentStatus}

สรุป Tasks:
- รวม: ${taskSummary.total} tasks
- Backlog: ${taskSummary.backlog}
- กำลังทำ: ${taskSummary.inProgress}
- เสร็จแล้ว: ${taskSummary.done}
- ยังไม่มีคนรับ: ${taskSummary.unassigned}

Meeting วันนี้: ${meetings.filter(m => m.status === 'scheduled').length} รายการ

เขียนรายงานในรูปแบบ:
📅 Daily Standup — [วันที่]
🟢 เมื่อวาน (ทำอะไรไปบ้าง)
🔵 วันนี้ (จะทำอะไร)
🔴 Blockers (ปัญหาอะไรที่ขัดขวาง)
⭐ Highlights (จุดเด่น)

สั้นกระชับ ชัดเจน ไม่เกิน 10 บรรทัด`;

  try {
    const result = await callAIWithFailover(
      'คุณเป็น Scrum Master มืออาชีพ สรุป Daily Standup Report ภาษาไทย กระชับ ชัดเจน', prompt, null
    );

    showAIResultPanel(
      `📝 Daily Standup — ${today}`,
      '📝',
      `<div style="font-size:13px;line-height:1.7;white-space:pre-line">${result.response}</div>
       <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">⏱️ ${result.provider.name} · ${(result.responseTime/1000).toFixed(1)}s</div>`,
      null
    );
    showToast('📝 Daily Standup สร้างเรียบร้อย!', 'success');
  } catch (err) {
    showToast(`❌ สร้าง Standup ไม่ได้: ${err.message}`, 'error');
  }
}

// ===== 📈 AI Week Report Generator =====
async function generateWeekReport() {
  if (typeof getAllAvailableProviders === 'undefined' || !getAllAvailableProviders().length) {
    showToast('❌ ต้องมี API Key อย่างน้อย 1 ตัว', 'error'); return;
  }

  showToast('📈 AI กำลังสร้าง Week Report...', 'info');

  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  const meetings = Store.get('meetings');

  // Gather comprehensive data
  const topPerformers = [...agents].sort((a, b) => b.tasksCompleted - a.tasksCompleted).slice(0, 3);
  const deptStats = DEPARTMENTS.map(d => {
    const deptTasks = tasks.filter(t => t.department === d.id);
    return `${d.name}: ${deptTasks.length} tasks (${deptTasks.filter(t=>t.status==='done').length} done)`;
  }).join('\n');

  const agentStats = agents.map(a => {
    const dept = Store.getDeptInfo(a.department);
    const achievements = getAgentAchievements(a).filter(ach => ach.earned).length;
    return `- ${a.name} (${dept?.name}, Lv${a.level}): ${a.tasksCompleted} tasks done, ${achievements}/10 achievements`;
  }).join('\n');

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  const dateRange = `${weekStart.toLocaleDateString('th-TH')} - ${today.toLocaleDateString('th-TH')}`;

  const prompt = `สร้าง Weekly Performance Report (รายงานผลงานรายสัปดาห์) เป็นภาษาไทย

ช่วงเวลา: ${dateRange}

สถานะ Agent:
${agentStats}

สถิติแผนก:
${deptStats}

Top Performers:
${topPerformers.map((a, i) => `${i+1}. ${a.name} - ${a.tasksCompleted} tasks, Lv${a.level}`).join('\n')}

ภาพรวม:
- Agent ทั้งหมด: ${agents.length} คน (${agents.filter(a=>a.status==='working').length} working)
- Task ทั้งหมด: ${tasks.length} (Done: ${tasks.filter(t=>t.status==='done').length}, In Progress: ${tasks.filter(t=>t.status==='in_progress').length})
- Meeting สัปดาห์นี้: ${meetings.length}

เขียนรายงานในรูปแบบ:
📈 Weekly Report — [ช่วงวัน]
📊 ภาพรวมสัปดาห์
🏆 Top Performers (ใครทำงานเด่น)
📋 สถิติแผนก
📈 Trends (แนวโน้ม)
💡 คำแนะนำสำหรับสัปดาห์หน้า

กระชับ ไม่เกิน 15 บรรทัด`;

  try {
    const result = await callAIWithFailover(
      'คุณเป็น Project Manager สรุปผลงานรายสัปดาห์ ภาษาไทย มืออาชีพ', prompt, null
    );

    showAIResultPanel(
      `📈 Weekly Report — ${dateRange}`,
      '📈',
      `<div style="font-size:13px;line-height:1.7;white-space:pre-line">${result.response}</div>
       <div style="margin-top:8px;font-size:10px;color:var(--text-muted)">⏱️ ${result.provider.name} · ${(result.responseTime/1000).toFixed(1)}s</div>`,
      null
    );
    showToast('📈 Week Report สร้างเรียบร้อย!', 'success');
  } catch (err) {
    showToast(`❌ สร้าง Week Report ไม่ได้: ${err.message}`, 'error');
  }
}

// ===== 🏅 Leaderboard Modal =====
function showLeaderboardModal() {
  const agents = Store.get('agents');
  const ranked = [...agents].sort((a, b) => b.tasksCompleted - a.tasksCompleted);
  const maxTasks = Math.max(ranked[0]?.tasksCompleted || 1, 1);

  const podiumColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
  const podiumEmojis = ['🥇', '🥈', '🥉'];

  const podium = ranked.slice(0, 3).map((a, i) => {
    const tier = getAgentTier(a.level);
    const achievements = getAgentAchievements(a).filter(ac => ac.earned).length;
    return `<div style="text-align:center;${i===0?'order:1':''}${i===1?'order:0':''}${i===2?'order:2':''}">
      <div style="font-size:28px;margin-bottom:4px">${podiumEmojis[i]}</div>
      ${renderAgentAvatar(a, 48)}
      <div style="font-weight:700;font-size:13px;margin-top:4px">${a.name}</div>
      <div style="font-size:10px;color:var(--text-muted)">${tier.icon} ${tier.name} · Lv${a.level}</div>
      <div style="font-size:18px;font-weight:800;color:${podiumColors[i]};margin-top:2px">${a.tasksCompleted}</div>
      <div style="font-size:10px;color:var(--text-muted)">${achievements}/10 🏆</div>
    </div>`;
  }).join('');

  const ranking = ranked.map((a, i) => {
    const tier = getAgentTier(a.level);
    const dept = Store.getDeptInfo(a.department);
    const pct = (a.tasksCompleted / maxTasks * 100).toFixed(0);
    const achievements = getAgentAchievements(a).filter(ac => ac.earned).length;
    return `<div style="display:flex;align-items:center;gap:10px;padding:8px;${i < ranked.length-1 ? 'border-bottom:1px solid var(--border)' : ''}">
      <span style="width:20px;text-align:center;font-weight:800;font-size:14px;color:${i<3?podiumColors[i]:'var(--text-muted)'}">${i+1}</span>
      ${renderAgentAvatar(a, 32)}
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600">${a.name} <span style="color:var(--text-muted);font-size:10px">${dept?.icon} ${dept?.name}</span></div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
          <div style="flex:1;height:6px;border-radius:3px;background:var(--bg-input);overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${i<3?podiumColors[i]:'var(--accent)'};border-radius:3px;transition:width 0.5s"></div>
          </div>
          <span style="font-size:11px;font-weight:700;min-width:30px">${a.tasksCompleted}</span>
        </div>
      </div>
      <div style="text-align:right;font-size:10px;color:var(--text-muted)">
        ${tier.icon} Lv${a.level} · ${achievements}🏆
      </div>
    </div>`;
  }).join('');

  showModal('🏅 Agent Leaderboard', `
    <div style="display:flex;justify-content:center;gap:24px;padding:16px 0;margin-bottom:16px;background:var(--bg-input);border-radius:var(--radius-xs)">
      ${podium}
    </div>
    <div style="font-size:12px;font-weight:700;margin-bottom:8px">📊 Full Rankings</div>
    <div style="max-height:300px;overflow-y:auto">${ranking}</div>
    <div style="margin-top:12px;font-size:10px;color:var(--text-muted);text-align:center">
      Total: ${agents.length} agents · ${agents.reduce((s,a) => s + a.tasksCompleted, 0)} tasks completed
    </div>
  `, [{ label: 'Close', onclick: 'closeModal()' }]);
}

// ===== 📉 Burndown Chart =====
function renderBurndownChart(tasks) {
  const totalTasks = tasks.length || 16;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const days = 7;
  const w = 600, h = 180, pad = 40;

  // Ideal line: straight from total to 0
  const idealPts = Array.from({length: days+1}, (_, i) => {
    const x = pad + (i / days) * (w - pad*2);
    const y = pad + (i / days) * (h - pad*2);
    return `${x},${y}`;
  }).join(' ');

  // Actual line: simulate realistic progress based on done tasks
  const progress = doneTasks / totalTasks;
  const actualData = [totalTasks];
  for (let i = 1; i <= days; i++) {
    const base = totalTasks * (1 - (i / days) * progress);
    const jitter = (Math.sin(i * 2.5) * totalTasks * 0.08);
    actualData.push(Math.max(0, Math.round(base + jitter)));
  }
  const actualPts = actualData.map((v, i) => {
    const x = pad + (i / days) * (w - pad*2);
    const y = pad + ((totalTasks - v) / totalTasks) * (h - pad*2);
    return `${x},${y}`;
  }).join(' ');

  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return `<svg width="100%" height="${h+10}" viewBox="0 0 ${w} ${h+10}" style="overflow:visible">
    <!-- Grid lines -->
    ${[0, 0.25, 0.5, 0.75, 1].map(pct => {
      const y = pad + pct * (h - pad*2);
      return `<line x1="${pad}" y1="${y}" x2="${w-pad}" y2="${y}" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
              <text x="${pad-6}" y="${y+3}" text-anchor="end" font-size="9" fill="#5a6480">${Math.round(totalTasks*(1-pct))}</text>`;
    }).join('')}
    <!-- Day labels -->
    ${dayLabels.map((d, i) => {
      const x = pad + (i / (days-1)) * (w - pad*2);
      return `<text x="${x}" y="${h+6}" text-anchor="middle" font-size="9" fill="#5a6480">${d}</text>`;
    }).join('')}
    <!-- Ideal line -->
    <polyline points="${idealPts}" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="6 4" opacity="0.6"/>
    <!-- Actual line -->
    <polyline points="${actualPts}" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Data points -->
    ${actualData.map((v, i) => {
      const x = pad + (i / days) * (w - pad*2);
      const y = pad + ((totalTasks - v) / totalTasks) * (h - pad*2);
      return `<circle cx="${x}" cy="${y}" r="3.5" fill="#818cf8" stroke="#0f1423" stroke-width="2"/>`;
    }).join('')}
    <!-- Current marker -->
    <circle cx="${actualData.length > 1 ? pad + ((actualData.length-1) / days) * (w - pad*2) : pad}" 
            cy="${actualData.length > 1 ? pad + ((totalTasks - actualData[actualData.length-1]) / totalTasks) * (h - pad*2) : pad}" 
            r="5" fill="#818cf8" stroke="#fff" stroke-width="2" opacity="0.9"/>
    <!-- Legend -->
    <line x1="${w-140}" y1="12" x2="${w-120}" y2="12" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="${w-116}" y="15" font-size="9" fill="#5a6480">Ideal</text>
    <line x1="${w-75}" y1="12" x2="${w-55}" y2="12" stroke="#818cf8" stroke-width="2.5"/>
    <text x="${w-51}" y="15" font-size="9" fill="#5a6480">Actual</text>
  </svg>`;
}

// ===== 📊 Dashboard Auto-Refresh =====
let dashboardRefreshInterval = null;

function startDashboardAutoRefresh() {
  stopDashboardAutoRefresh();
  dashboardRefreshInterval = setInterval(() => {
    const dashTab = document.getElementById('tab-dashboard');
    if (dashTab && dashTab.offsetParent !== null) {
      renderDashboard();
    } else {
      stopDashboardAutoRefresh();
    }
  }, 5000);
}

function stopDashboardAutoRefresh() {
  if (dashboardRefreshInterval) {
    clearInterval(dashboardRefreshInterval);
    dashboardRefreshInterval = null;
  }
}

// Auto-start when dashboard is rendered
const _origRenderDashboard = renderDashboard;
// Patch: after any dashboard render, start auto-refresh
(function() {
  const origSwitchTab = window.switchTab;
  if (origSwitchTab) {
    window.switchTab = function(tab) {
      origSwitchTab(tab);
      if (tab === 'dashboard') startDashboardAutoRefresh();
      else stopDashboardAutoRefresh();
    };
  }
})();

// ===== 📊 Export Functions =====
function exportDashboardCSV() {
  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  const date = new Date().toISOString().split('T')[0];

  // Agent Report CSV
  let csv = 'Name,Department,Level,XP,Status,Tasks Completed,Tasks Failed\n';
  agents.forEach(a => {
    const dept = Store.getDeptInfo(a.department);
    csv += `"${a.name}","${dept?.name || a.department}",${a.level},${a.xp},"${a.status}",${a.tasksCompleted || 0},${a.tasksFailed || 0}\n`;
  });

  csv += '\n\nTask Report\nTitle,Status,Priority,Department,Assignee,Created,Due Date\n';
  tasks.forEach(t => {
    const agent = agents.find(a => a.id === t.assignee);
    csv += `"${t.title}","${t.status}","${t.priority || 'medium'}","${t.department || ''}","${agent?.name || 'Unassigned'}","${new Date(t.createdAt).toLocaleDateString()}","${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''}"\n`;
  });

  downloadFile(`claw-empire-report-${date}.csv`, csv, 'text/csv');
  showToast('📊 CSV Report downloaded!', 'success');
}

function exportDashboardJSON() {
  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  const meetings = Store.get('meetings');
  const date = new Date().toISOString().split('T')[0];

  const report = {
    generated: new Date().toISOString(),
    summary: {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'working').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'done').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      meetings: meetings.length,
    },
    agents: agents.map(a => ({
      name: a.name, department: a.department, level: a.level, xp: a.xp,
      status: a.status, tasksCompleted: a.tasksCompleted || 0,
    })),
    tasks: tasks.map(t => ({
      title: t.title, status: t.status, priority: t.priority,
      department: t.department, createdAt: t.createdAt, dueDate: t.dueDate,
    })),
  };

  downloadFile(`claw-empire-report-${date}.json`, JSON.stringify(report, null, 2), 'application/json');
  showToast('📋 JSON Report downloaded!', 'success');
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
