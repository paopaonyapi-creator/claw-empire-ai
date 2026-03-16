// ===== 📝 Content Studio — 10 Content Creator Agents + Daily Workflow =====

// ===== 10 Agent Positions =====
const CONTENT_TEAM = [
  { id: 'cs-strategist', name: 'Chief Content Strategist', role: 'Strategy', icon: '👑', emoji: '👑',
    color: '#6366f1', time: '10:00', desc: 'วางเกมใหญ่ กำหนดเป้าหมายคอนเทนต์ทั้งหมด',
    tasks: ['กำหนดธีมประจำเดือน', 'เลือกหัวข้อไหนทำก่อน-หลัง', 'ตั้ง KPI: ยอดวิว/แชร์/ขาย'],
    status: 'idle', progress: 0 },
  { id: 'cs-trend', name: 'Trend Hunter', role: 'Research', icon: '🔍', emoji: '🔍',
    color: '#f59e0b', time: '09:00', desc: 'ส่องเทรนด์ จับประเด็นร้อนก่อนใคร',
    tasks: ['สแกน Twitter/TikTok trending', 'รายงาน Hot Topics 3 อันดับ', 'วิเคราะห์ว่าเทรนด์ไหนเข้ากับแบรนด์'],
    status: 'idle', progress: 0 },
  { id: 'cs-audience', name: 'Audience Insight Planner', role: 'Research', icon: '🧠', emoji: '🧠',
    color: '#8b5cf6', time: '09:30', desc: 'แปลว่าคนดูอยากฟังอะไร เจ็บตรงไหน เชื่อคำแบบไหน',
    tasks: ['วิเคราะห์ Pain Point กลุ่มเป้าหมาย', 'เลือกมุมเล่าที่โดนใจ', 'แนะนำ Hook ที่หยุดนิ้วได้'],
    status: 'idle', progress: 0 },
  { id: 'cs-writer', name: 'Content Writer', role: 'Content', icon: '✍️', emoji: '✍️',
    color: '#22c55e', time: '10:30', desc: 'เขียนโพสต์ขาย ความรู้ เล่าเรื่อง บทความ สคริปต์',
    tasks: ['เขียนโพสต์ฉบับเต็ม', 'เขียนบทความ SEO', 'เขียนสคริปต์คลิป', 'เขียนแคปชัน'],
    status: 'idle', progress: 0 },
  { id: 'cs-hook', name: 'Hook & Copy Specialist', role: 'Content', icon: '🎣', emoji: '🎣',
    color: '#ef4444', time: '11:00', desc: 'ทำพาดหัวแรงๆ CTA ที่ทำให้คนคอมเมนต์ แชร์ ทักแชต',
    tasks: ['สร้าง Hook 3 เวอร์ชัน', 'เขียน CTA แรงๆ', 'ทำ A/B test headline'],
    status: 'idle', progress: 0 },
  { id: 'cs-design', name: 'Visual Designer', role: 'Design', icon: '🎨', emoji: '🎨',
    color: '#06b6d4', time: '11:30', desc: 'ทำบรีฟภาพ ปกโพสต์ คารูเซล Thumbnail',
    tasks: ['ออกแบบปกโพสต์', 'สร้างคารูเซล 5-10 slides', 'ทำ Thumbnail คลิป'],
    status: 'idle', progress: 0 },
  { id: 'cs-video', name: 'Video Script Producer', role: 'Content', icon: '🎬', emoji: '🎬',
    color: '#ec4899', time: '13:00', desc: 'แปลงโพสต์ให้เป็นคลิป Shorts/Reels/TikTok',
    tasks: ['แตกบทความ 1 ชิ้น → 3 คลิปสั้น', 'เขียน script + shot list', 'กำหนด timing + CTA'],
    status: 'idle', progress: 0 },
  { id: 'cs-calendar', name: 'Content Calendar Manager', role: 'Operations', icon: '📅', emoji: '📅',
    color: '#14b8a6', time: 'ทั้งวัน', desc: 'คุมตารางโพสต์ วันนี้ลงอะไร พรุ่งนี้ลง อะไร',
    tasks: ['จัดตารางโพสต์รายสัปดาห์', 'ติดตามสถานะ: Draft/Hook/Visual/Ready', 'แจ้งเตือนทีมถ้ามี delay'],
    status: 'idle', progress: 0 },
  { id: 'cs-publisher', name: 'Publisher & Community Mgr', role: 'Publishing', icon: '📢', emoji: '📢',
    color: '#f97316', time: '17:00', desc: 'ลงโพสต์หลาย platform ตอบคอมเมนต์ คัดคำถามลูกค้า',
    tasks: ['ตั้งเวลาโพสต์ FB/IG/TikTok/X', 'ตอบคอมเมนต์สำคัญ', 'คัดคำถามที่มีโอกาสปิดขาย'],
    status: 'idle', progress: 0 },
  { id: 'cs-analyst', name: 'Performance Analyst', role: 'Analytics', icon: '📊', emoji: '📊',
    color: '#3b82f6', time: 'ทุกศุกร์', desc: 'วิเคราะห์ผลงาน โพสต์ไหนปัง/แป้ก สรุป Weekly Report',
    tasks: ['วิเคราะห์ engagement rate', 'สรุปโพสต์ Top 3 + Bottom 3', 'สรุป Weekly Report + แนะนำ'],
    status: 'idle', progress: 0 },
];

// ===== Daily Workflow Schedule =====
const DAILY_WORKFLOW = [
  { time: '09:00', agent: 'cs-trend', task: '🔥 ส่งรายงาน Hot Topics ประจำวัน', duration: 30 },
  { time: '09:30', agent: 'cs-audience', task: '🧠 สรุปมุมเล่าที่โดนใจกลุ่มเป้าหมาย', duration: 30 },
  { time: '10:00', agent: 'cs-strategist', task: '👑 เลือกหัวข้อ + จัดลำดับความสำคัญ', duration: 30 },
  { time: '10:30', agent: 'cs-writer', task: '✍️ เขียนโพสต์ฉบับเต็ม', duration: 30 },
  { time: '11:00', agent: 'cs-hook', task: '🎣 ทำ Hook 3 เวอร์ชัน + CTA', duration: 30 },
  { time: '11:30', agent: 'cs-design', task: '🎨 ทำบรีฟภาพ / ปก / คารูเซล', duration: 60 },
  { time: '13:00', agent: 'cs-video', task: '🎬 แตกโพสต์ → คลิปสั้น 3 ตอน', duration: 120 },
  { time: '17:00', agent: 'cs-publisher', task: '📢 ตั้งเวลาโพสต์ FB/IG/TikTok/X', duration: 60 },
  { time: '20:00', agent: 'cs-publisher', task: '💬 เช็กคอมเมนต์ + คัดคำถามปิดขาย', duration: 60 },
  { time: 'ศุกร์', agent: 'cs-analyst', task: '📊 ส่ง Weekly Report สรุปผลงาน', duration: 120 },
];

// ===== Content Pipeline Statuses =====
const PIPELINE_STAGES = [
  { id: 'idea', label: '💡 Idea', color: '#8b5cf6' },
  { id: 'draft', label: '✍️ Draft', color: '#f59e0b' },
  { id: 'hook', label: '🎣 Hook', color: '#ef4444' },
  { id: 'visual', label: '🎨 Visual', color: '#06b6d4' },
  { id: 'scheduled', label: '📅 Scheduled', color: '#14b8a6' },
  { id: 'posted', label: '✅ Posted', color: '#22c55e' },
];

// ===== Content Items Store =====
function getContentItems() {
  return JSON.parse(localStorage.getItem('content_items') || '[]');
}
function saveContentItems(items) {
  localStorage.setItem('content_items', JSON.stringify(items));
}

// Generate sample content if empty
function initContentItems() {
  let items = getContentItems();
  if (items.length > 0) return items;
  const sampleTopics = [
    { title: '5 เทคนิคขายของบน TikTok ที่ได้ผลจริง', platform: 'TikTok', type: 'video' },
    { title: 'ทำไมคอนเทนต์ของคุณไม่มีคนดู?', platform: 'Facebook', type: 'post' },
    { title: 'Content Calendar สำหรับมือใหม่', platform: 'Instagram', type: 'carousel' },
    { title: 'เปรียบเทียบ Reels vs Shorts vs TikTok', platform: 'Cross', type: 'article' },
    { title: 'Hook ที่ทำให้คนหยุดเลื่อนจอ', platform: 'Facebook', type: 'post' },
    { title: 'สรุป Trend สัปดาห์นี้ Top 5', platform: 'Twitter', type: 'thread' },
  ];
  items = sampleTopics.map((t, i) => ({
    id: 'ct-' + Date.now() + i,
    ...t,
    stage: PIPELINE_STAGES[i % PIPELINE_STAGES.length].id,
    assignedTo: CONTENT_TEAM[Math.floor(Math.random() * CONTENT_TEAM.length)].id,
    createdAt: Date.now() - Math.random() * 86400000 * 7,
    hook: i < 3 ? 'คุณเคยสงสัยไหมว่า...' : '',
    engagement: Math.floor(Math.random() * 5000),
  }));
  saveContentItems(items);
  return items;
}

// ===== Render Content Studio Tab =====
function renderContentStudio() {
  const container = document.getElementById('tab-content-studio');
  if (!container) return;

  const items = initContentItems();
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const timeStr = `${String(currentHour).padStart(2,'0')}:${String(currentMin).padStart(2,'0')}`;

  // Determine which agent is currently active
  let activeWorkflow = null;
  for (let i = DAILY_WORKFLOW.length - 1; i >= 0; i--) {
    const w = DAILY_WORKFLOW[i];
    if (w.time === 'ศุกร์') continue;
    if (timeStr >= w.time) { activeWorkflow = w; break; }
  }

  container.innerHTML = `
    <div style="padding:24px;max-width:1400px;margin:0 auto">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px">
        <div>
          <h2 style="margin:0;font-size:22px">📝 Content Studio</h2>
          <p style="color:var(--text-muted);font-size:13px;margin:4px 0 0">ทีม Content Creator 10 ตำแหน่ง + Daily Workflow</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-sm" onclick="showDailyWorkflow()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff">📋 Daily Workflow</button>
          <button class="btn btn-sm" onclick="showContentPipeline()" style="background:linear-gradient(135deg,#06b6d4,#22c55e);color:#fff">🔄 Pipeline Board</button>
          <button class="btn btn-sm" onclick="addNewContent()">➕ New Content</button>
          <button class="btn btn-sm" onclick="showWeeklyReport()" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff">📊 Weekly Report</button>
        </div>
      </div>

      <!-- AI Power Panel -->
      <div style="background:linear-gradient(135deg,rgba(236,72,153,0.08),rgba(99,102,241,0.08));border:1px solid rgba(236,72,153,0.2);border-radius:16px;padding:16px;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="font-size:18px">🤖</span>
          <span style="font-weight:800;font-size:14px;background:linear-gradient(135deg,#ec4899,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent">AI Content Powers</span>
          <span style="font-size:10px;color:var(--text-muted)">— ใช้ AI จริงสร้างคอนเทนต์</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-sm" onclick="aiScanTrends()" style="background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;font-size:11px">🔍 Scan Trends</button>
          <button class="btn btn-sm" onclick="aiAudienceInsight()" style="background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font-size:11px">🧠 Audience Insight</button>
          <button class="btn btn-sm" onclick="aiWritePost()" style="background:linear-gradient(135deg,#22c55e,#14b8a6);color:#fff;font-size:11px">✍️ Write Post</button>
          <button class="btn btn-sm" onclick="aiGenerateHooks()" style="background:linear-gradient(135deg,#ef4444,#ec4899);color:#fff;font-size:11px">🎣 Generate Hooks</button>
          <button class="btn btn-sm" onclick="aiVisualBrief()" style="background:linear-gradient(135deg,#06b6d4,#3b82f6);color:#fff;font-size:11px">🎨 Visual Brief</button>
          <button class="btn btn-sm" onclick="aiVideoScript()" style="background:linear-gradient(135deg,#ec4899,#f59e0b);color:#fff;font-size:11px">🎬 Video Script</button>
          <button class="btn btn-sm" onclick="aiWeeklyAnalysis()" style="background:linear-gradient(135deg,#3b82f6,#22c55e);color:#fff;font-size:11px">📊 AI Analysis</button>
        </div>
      </div>

      <!-- Active Workflow Status -->
      <div style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.08));border:1px solid rgba(99,102,241,0.2);border-radius:16px;padding:20px;margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <div style="width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:pulse 2s infinite"></div>
          <span style="font-weight:700;font-size:14px">⏰ Workflow วันนี้ — ${timeStr}</span>
          ${activeWorkflow ? `<span style="font-size:12px;color:#6366f1;font-weight:600">▶ ${CONTENT_TEAM.find(a => a.id === activeWorkflow.agent)?.icon} ${activeWorkflow.task}</span>` : '<span style="font-size:12px;color:var(--text-muted)">รอเริ่มงาน 09:00</span>'}
        </div>
        <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:4px">
          ${DAILY_WORKFLOW.filter(w => w.time !== 'ศุกร์').map(w => {
            const agent = CONTENT_TEAM.find(a => a.id === w.agent);
            const isPast = timeStr > w.time;
            const isCurrent = activeWorkflow && activeWorkflow.time === w.time;
            return `<div style="min-width:100px;padding:8px 12px;border-radius:10px;text-align:center;font-size:10px;
              background:${isCurrent ? 'rgba(99,102,241,0.2)' : isPast ? 'rgba(34,197,94,0.1)' : 'var(--bg-input)'};
              border:${isCurrent ? '2px solid #6366f1' : '1px solid var(--border)'};
              ${isCurrent ? 'box-shadow:0 0 12px rgba(99,102,241,0.3)' : ''}">
              <div style="font-size:18px">${agent?.icon || '⏰'}</div>
              <div style="font-weight:700;margin:2px 0">${w.time}</div>
              <div style="color:var(--text-muted);font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px">${agent?.name?.split(' ')[0] || ''}</div>
              ${isPast ? '<div style="color:#22c55e;font-size:9px">✓ Done</div>' : isCurrent ? '<div style="color:#6366f1;font-size:9px">▶ Active</div>' : '<div style="color:var(--text-muted);font-size:9px">⏳ Waiting</div>'}
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Team Grid -->
      <h3 style="font-size:16px;margin-bottom:12px">👥 Content Team — ${CONTENT_TEAM.length} Positions</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-bottom:24px">
        ${CONTENT_TEAM.map(agent => {
          const isActive = activeWorkflow && activeWorkflow.agent === agent.id;
          const assignedCount = items.filter(i => i.assignedTo === agent.id).length;
          return `
            <div onclick="showAgentDetail('${agent.id}')" style="padding:16px;border-radius:14px;cursor:pointer;transition:all 0.2s;
              background:${isActive ? 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))' : 'var(--bg-card)'};
              border:${isActive ? '2px solid #6366f1' : '1px solid var(--border)'};
              ${isActive ? 'box-shadow:0 4px 20px rgba(99,102,241,0.15)' : ''}"
              onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 25px rgba(0,0,0,0.1)'"
              onmouseout="this.style.transform='';this.style.boxShadow='${isActive ? '0 4px 20px rgba(99,102,241,0.15)' : ''}'">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
                <div style="width:44px;height:44px;border-radius:12px;background:${agent.color};display:flex;align-items:center;justify-content:center;font-size:22px;
                  ${isActive ? 'box-shadow:0 0 15px ' + agent.color + '60' : ''}">${agent.icon}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${agent.name}</div>
                  <div style="font-size:10px;color:var(--text-muted)">${agent.role} · ${agent.time}</div>
                </div>
                ${isActive ? '<div style="padding:2px 8px;border-radius:6px;background:#6366f1;color:#fff;font-size:9px;font-weight:700">ACTIVE</div>' : ''}
              </div>
              <div style="font-size:11px;color:var(--text-secondary);margin-bottom:8px">${agent.desc}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                <span style="font-size:9px;padding:2px 6px;border-radius:4px;background:rgba(99,102,241,0.1);color:#6366f1">${assignedCount} items</span>
                ${agent.tasks.slice(0, 2).map(t => `<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:var(--bg-input);color:var(--text-muted)">${t.length > 20 ? t.slice(0,18)+'...' : t}</span>`).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Mini Pipeline -->
      <h3 style="font-size:16px;margin-bottom:12px">🔄 Content Pipeline</h3>
      <div style="display:grid;grid-template-columns:repeat(${PIPELINE_STAGES.length},1fr);gap:8px;margin-bottom:20px">
        ${PIPELINE_STAGES.map(stage => {
          const stageItems = items.filter(i => i.stage === stage.id);
          return `
            <div style="padding:12px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border);min-height:120px">
              <div style="font-size:12px;font-weight:700;margin-bottom:8px;color:${stage.color}">${stage.label} (${stageItems.length})</div>
              ${stageItems.slice(0, 3).map(item => `
                <div style="padding:6px 8px;margin-bottom:4px;border-radius:8px;background:var(--bg-input);font-size:10px;cursor:pointer"
                  onclick="event.stopPropagation();moveContentForward('${item.id}')"
                  title="Click to move forward">
                  <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.title.length > 25 ? item.title.slice(0,23)+'...' : item.title}</div>
                  <div style="color:var(--text-muted);font-size:9px">${item.platform} · ${item.type}</div>
                </div>
              `).join('')}
              ${stageItems.length > 3 ? `<div style="font-size:9px;color:var(--text-muted);text-align:center">+${stageItems.length - 3} more</div>` : ''}
            </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

// ===== Show Agent Detail Modal =====
function showAgentDetail(agentId) {
  const agent = CONTENT_TEAM.find(a => a.id === agentId);
  if (!agent) return;
  const items = getContentItems().filter(i => i.assignedTo === agentId);

  showModal(`
    <div style="max-width:480px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        <div style="width:64px;height:64px;border-radius:16px;background:${agent.color};display:flex;align-items:center;justify-content:center;font-size:32px;
          box-shadow:0 4px 15px ${agent.color}40">${agent.icon}</div>
        <div>
          <h3 style="margin:0">${agent.name}</h3>
          <div style="color:var(--text-muted);font-size:12px">${agent.role} · เริ่มงาน ${agent.time}</div>
        </div>
      </div>
      <div style="padding:14px;background:var(--bg-input);border-radius:12px;margin-bottom:16px">
        <div style="font-weight:700;font-size:13px;margin-bottom:6px">📋 หน้าที่หลัก:</div>
        ${agent.tasks.map(t => `<div style="font-size:12px;color:var(--text-secondary);padding:3px 0">• ${t}</div>`).join('')}
      </div>
      <div style="padding:14px;background:var(--bg-input);border-radius:12px;margin-bottom:16px">
        <div style="font-weight:700;font-size:13px;margin-bottom:6px">📝 คอนเทนต์ที่รับผิดชอบ (${items.length}):</div>
        ${items.length > 0 ? items.map(i => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">
            <div>
              <div style="font-size:12px;font-weight:600">${i.title.length > 30 ? i.title.slice(0,28)+'...' : i.title}</div>
              <div style="font-size:10px;color:var(--text-muted)">${i.platform} · ${i.type}</div>
            </div>
            <span style="font-size:9px;padding:2px 8px;border-radius:4px;background:${PIPELINE_STAGES.find(s => s.id === i.stage)?.color || '#888'}20;
              color:${PIPELINE_STAGES.find(s => s.id === i.stage)?.color || '#888'};font-weight:600">${PIPELINE_STAGES.find(s => s.id === i.stage)?.label || i.stage}</span>
          </div>
        `).join('') : '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px">ยังไม่มีงาน</div>'}
      </div>
      <div style="text-align:center">
        <div style="font-size:11px;color:var(--text-muted)">${agent.desc}</div>
      </div>
    </div>
  `);
}

// ===== Daily Workflow Modal =====
function showDailyWorkflow() {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  showModal(`
    <div style="max-width:500px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">📋</div>
        <h3>Daily Workflow</h3>
        <p style="color:var(--text-muted);font-size:12px">ตารางงาน Content Team ประจำวัน · ตอนนี้ ${timeStr}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;max-height:500px;overflow-y:auto">
        ${DAILY_WORKFLOW.map(w => {
          const agent = CONTENT_TEAM.find(a => a.id === w.agent);
          const isPast = w.time !== 'ศุกร์' && timeStr > w.time;
          const isCurrent = w.time !== 'ศุกร์' && timeStr >= w.time && timeStr < w.time.replace(':00',':30').replace(':30',':59');
          return `
            <div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;
              background:${isCurrent ? 'rgba(99,102,241,0.12)' : isPast ? 'rgba(34,197,94,0.06)' : 'var(--bg-input)'};
              border:${isCurrent ? '2px solid #6366f1' : '1px solid var(--border)'}">
              <div style="width:50px;text-align:center">
                <div style="font-weight:800;font-size:14px;color:${isCurrent ? '#6366f1' : isPast ? '#22c55e' : 'var(--text-primary)'}">${w.time}</div>
                <div style="font-size:9px;color:var(--text-muted)">${w.duration}min</div>
              </div>
              <div style="width:36px;height:36px;border-radius:10px;background:${agent?.color || '#888'};display:flex;align-items:center;justify-content:center;font-size:18px">${agent?.icon || '⏰'}</div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:12px">${agent?.name || '—'}</div>
                <div style="font-size:11px;color:var(--text-secondary)">${w.task}</div>
              </div>
              <div style="font-size:14px">${isPast ? '✅' : isCurrent ? '▶️' : '⏳'}</div>
            </div>`;
        }).join('')}
      </div>
    </div>
  `);
}

// ===== Content Pipeline Board =====
function showContentPipeline() {
  const items = initContentItems();

  showModal(`
    <div style="max-width:800px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">🔄</div>
        <h3>Content Pipeline Board</h3>
        <p style="color:var(--text-muted);font-size:12px">คลิกที่ content เพื่อเลื่อน stage ถัดไป</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(${PIPELINE_STAGES.length},1fr);gap:8px;overflow-x:auto">
        ${PIPELINE_STAGES.map(stage => {
          const stageItems = items.filter(i => i.stage === stage.id);
          return `
            <div style="padding:10px;border-radius:12px;background:var(--bg-input);min-width:120px;min-height:200px">
              <div style="font-size:11px;font-weight:800;margin-bottom:8px;color:${stage.color};text-align:center;
                padding:4px;border-radius:6px;background:${stage.color}15">${stage.label}</div>
              <div style="font-size:18px;text-align:center;font-weight:800;color:${stage.color};margin-bottom:8px">${stageItems.length}</div>
              ${stageItems.map(item => {
                const agent = CONTENT_TEAM.find(a => a.id === item.assignedTo);
                return `
                  <div onclick="moveContentForward('${item.id}');showContentPipeline();" style="padding:8px;margin-bottom:6px;border-radius:8px;background:var(--bg-card);
                    border:1px solid var(--border);cursor:pointer;transition:all 0.2s"
                    onmouseover="this.style.borderColor='${stage.color}'" onmouseout="this.style.borderColor='var(--border)'">
                    <div style="font-size:10px;font-weight:700;margin-bottom:2px">${item.title.length > 22 ? item.title.slice(0,20)+'...' : item.title}</div>
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <span style="font-size:9px;color:var(--text-muted)">${item.platform}</span>
                      <span style="font-size:12px" title="${agent?.name || ''}">${agent?.icon || '👤'}</span>
                    </div>
                  </div>`;
              }).join('')}
            </div>`;
        }).join('')}
      </div>
    </div>
  `);
}

// Move content to next stage
function moveContentForward(itemId) {
  const items = getContentItems();
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  const stageIds = PIPELINE_STAGES.map(s => s.id);
  const idx = stageIds.indexOf(item.stage);
  if (idx < stageIds.length - 1) {
    item.stage = stageIds[idx + 1];
    saveContentItems(items);
    showToast(`✅ "${item.title.slice(0,20)}..." → ${PIPELINE_STAGES[idx + 1].label}`, 'success');
    renderContentStudio();
  } else {
    showToast('🎉 Content already posted!', 'info');
  }
}

// ===== Add New Content =====
function addNewContent() {
  showModal('➕ New Content', `
    <div style="display:flex;flex-direction:column;gap:12px">
      <div>
        <label class="form-label">Title / หัวข้อ</label>
        <input class="form-input" id="newContentTitle" placeholder="เช่น 5 เทคนิคขายของออนไลน์">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label class="form-label">Platform</label>
          <select class="form-select" id="newContentPlatform">
            <option>Facebook</option><option>Instagram</option><option>TikTok</option>
            <option>Twitter</option><option>YouTube</option><option>Cross</option>
          </select>
        </div>
        <div>
          <label class="form-label">Type</label>
          <select class="form-select" id="newContentType">
            <option>post</option><option>video</option><option>carousel</option>
            <option>article</option><option>thread</option><option>reel</option>
          </select>
        </div>
      </div>
      <div>
        <label class="form-label">Assign to</label>
        <select class="form-select" id="newContentAssign">
          ${CONTENT_TEAM.map(a => `<option value="${a.id}">${a.icon} ${a.name}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary" onclick="saveNewContent()">➕ Add to Pipeline</button>
    </div>
  `);
}

function saveNewContent() {
  const title = document.getElementById('newContentTitle')?.value;
  if (!title) { showToast('กรุณาใส่หัวข้อ', 'error'); return; }
  const items = getContentItems();
  items.push({
    id: 'ct-' + Date.now(),
    title,
    platform: document.getElementById('newContentPlatform')?.value || 'Facebook',
    type: document.getElementById('newContentType')?.value || 'post',
    stage: 'idea',
    assignedTo: document.getElementById('newContentAssign')?.value || 'cs-writer',
    createdAt: Date.now(),
    hook: '',
    engagement: 0,
  });
  saveContentItems(items);
  closeModal();
  showToast('✅ Added to Pipeline!', 'success');
  renderContentStudio();
}

// ===== Weekly Report =====
function showWeeklyReport() {
  const items = getContentItems();
  const posted = items.filter(i => i.stage === 'posted');
  const inProgress = items.filter(i => i.stage !== 'posted' && i.stage !== 'idea');
  const ideas = items.filter(i => i.stage === 'idea');

  const topPosts = [...posted].sort((a, b) => b.engagement - a.engagement).slice(0, 3);
  const totalEngagement = posted.reduce((s, i) => s + (i.engagement || 0), 0);
  const avgEngagement = posted.length > 0 ? Math.round(totalEngagement / posted.length) : 0;

  const platformStats = {};
  posted.forEach(p => {
    platformStats[p.platform] = (platformStats[p.platform] || 0) + 1;
  });

  showModal(`
    <div style="max-width:500px">
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:48px">📊</div>
        <h3>Weekly Performance Report</h3>
        <p style="color:var(--text-muted);font-size:12px">สรุปผลงานโดย Performance Analyst</p>
      </div>

      <!-- KPI Cards -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
        <div style="text-align:center;padding:14px;border-radius:12px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2)">
          <div style="font-size:24px;font-weight:800;color:#22c55e">${posted.length}</div>
          <div style="font-size:10px;color:var(--text-muted)">Posted</div>
        </div>
        <div style="text-align:center;padding:14px;border-radius:12px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2)">
          <div style="font-size:24px;font-weight:800;color:#f59e0b">${inProgress.length}</div>
          <div style="font-size:10px;color:var(--text-muted)">In Progress</div>
        </div>
        <div style="text-align:center;padding:14px;border-radius:12px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2)">
          <div style="font-size:24px;font-weight:800;color:#8b5cf6">${ideas.length}</div>
          <div style="font-size:10px;color:var(--text-muted)">Ideas</div>
        </div>
      </div>

      <!-- Engagement -->
      <div style="padding:14px;background:var(--bg-input);border-radius:12px;margin-bottom:16px">
        <div style="font-weight:700;font-size:13px;margin-bottom:8px">📈 Engagement Summary</div>
        <div style="display:flex;justify-content:space-between;font-size:12px">
          <span>Total Engagement:</span>
          <span style="font-weight:700;color:#22c55e">${totalEngagement.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:4px">
          <span>Avg per Post:</span>
          <span style="font-weight:700;color:#6366f1">${avgEngagement.toLocaleString()}</span>
        </div>
      </div>

      <!-- Top Posts -->
      <div style="padding:14px;background:var(--bg-input);border-radius:12px;margin-bottom:16px">
        <div style="font-weight:700;font-size:13px;margin-bottom:8px">🏆 Top 3 Posts</div>
        ${topPosts.map((p, i) => `
          <div style="display:flex;align-items:center;gap:10px;padding:6px 0;${i < topPosts.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
            <span style="font-size:16px">${['🥇','🥈','🥉'][i]}</span>
            <div style="flex:1;min-width:0">
              <div style="font-size:11px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</div>
              <div style="font-size:9px;color:var(--text-muted)">${p.platform} · ${p.type}</div>
            </div>
            <div style="font-weight:800;font-size:12px;color:#f59e0b">${(p.engagement || 0).toLocaleString()}</div>
          </div>
        `).join('')}
      </div>

      <!-- Platform Breakdown -->
      <div style="padding:14px;background:var(--bg-input);border-radius:12px">
        <div style="font-weight:700;font-size:13px;margin-bottom:8px">📱 Platform Breakdown</div>
        ${Object.entries(platformStats).map(([platform, count]) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:12px;width:80px;font-weight:600">${platform}</span>
            <div style="flex:1;height:8px;background:var(--bg-primary);border-radius:4px;overflow:hidden">
              <div style="width:${(count / Math.max(...Object.values(platformStats))) * 100}%;height:100%;background:linear-gradient(90deg,#6366f1,#06b6d4);border-radius:4px"></div>
            </div>
            <span style="font-size:11px;font-weight:700;color:#6366f1">${count}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `);
}

// ===== 🤖 AI Content Generator Functions =====

function _showAILoading(agentIcon, agentName, loading) {
  showModal(`
    <div style="text-align:center;padding:30px">
      <div style="font-size:60px;margin-bottom:12px;animation:pulse 1.5s infinite">${agentIcon}</div>
      <h3>${agentName}</h3>
      <p style="color:var(--text-muted);font-size:12px">${loading}</p>
      <div style="width:60px;height:4px;background:var(--border);border-radius:4px;margin:16px auto;overflow:hidden">
        <div style="width:100%;height:100%;background:linear-gradient(90deg,#6366f1,#ec4899);animation:loading 1.5s infinite;border-radius:4px"></div>
      </div>
    </div>
  `);
}

function _showAIResult(agentIcon, agentName, provider, content) {
  showModal(`
    <div style="max-width:550px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="font-size:36px">${agentIcon}</div>
        <div>
          <h3 style="margin:0">${agentName}</h3>
          <div style="font-size:10px;color:var(--text-muted)">Powered by ${provider} 🤖</div>
        </div>
      </div>
      <div style="padding:16px;background:var(--bg-input);border-radius:12px;font-size:13px;line-height:1.7;white-space:pre-wrap;max-height:500px;overflow-y:auto">${content}</div>
    </div>
  `);
}

function _getTopicInput() {
  const items = getContentItems();
  const ideas = items.filter(i => i.stage === 'idea' || i.stage === 'draft');
  if (ideas.length > 0) return ideas[0].title;
  return 'เทคนิคขายของออนไลน์ให้ปังในปี 2024';
}

// 1. 🔍 Trend Hunter — Scan Trends
async function aiScanTrends() {
  _showAILoading('🔍', 'Trend Hunter', 'กำลังสแกนเทรนด์...');
  try {
    const result = await callAIWithFailover(
      `คุณคือ Trend Hunter ผู้เชี่ยวชาญด้านการจับเทรนด์ออนไลน์
ตอบเป็นภาษาไทย ให้รายงาน Hot Topics 5 อันดับที่มาแรงตอนนี้
แต่ละหัวข้อต้องมี:
- ชื่อเทรนด์
- ทำไมถึงมาแรง
- ควรเล่ามุมไหน
- Platform ไหนเหมาะสุด
- ระดับความร้อน (🔥 1-5)
จัดไป 5 เทรนด์ ให้สั้นกระชับ`,
      'สแกนเทรนด์ที่มาแรงตอนนี้ในโซเชียลมีเดีย วิเคราะห์ให้หน่อย',
      { name: 'Trend Hunter', department: 'Research' }
    );
    _showAIResult('🔍', 'Trend Hunter Report', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// 2. 🧠 Audience Insight Planner
async function aiAudienceInsight() {
  const topic = _getTopicInput();
  _showAILoading('🧠', 'Audience Insight Planner', 'กำลังวิเคราะห์กลุ่มเป้าหมาย...');
  try {
    const result = await callAIWithFailover(
      `คุณคือ Audience Insight Planner ผู้เชี่ยวชาญด้านพฤติกรรมผู้บริโภค
ตอบเป็นภาษาไทย วิเคราะห์กลุ่มเป้าหมายสำหรับหัวข้อที่ให้มา:
1. Pain Points — เจ็บตรงไหน 3 ข้อ
2. Desires — อยากได้อะไร 3 ข้อ
3. Fears — กลัวอะไร 3 ข้อ
4. Beliefs — เชื่อคำแบบไหน
5. Hook ที่จะหยุดนิ้ว — แนะนำ 3 มุมเล่า
6. แนะนำ: ควรเล่ามุมไหนถึงจะโดนที่สุด
ให้กระชับ ใช้ emoji`,
      `หัวข้อ: "${topic}" — วิเคราะห์กลุ่มเป้าหมายให้หน่อย`,
      { name: 'Audience Planner', department: 'Research' }
    );
    _showAIResult('🧠', 'Audience Insight', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// 3. ✍️ Content Writer — Write Post
async function aiWritePost() {
  const topic = _getTopicInput();
  _showAILoading('✍️', 'Content Writer', 'กำลังเขียนโพสต์...');
  try {
    const result = await callAIWithFailover(
      `คุณคือ Content Writer มืออาชีพ
ตอบเป็นภาษาไทย เขียนโพสต์ Facebook ฉบับเต็มจากหัวข้อที่ให้มา:
- เปิดด้วย Hook แรงๆ ให้หยุดเลื่อน
- เนื้อหา 3-5 ย่อหน้า มีข้อมูล insight
- ใช้ storytelling ดึงอารมณ์
- ใส่ bullet points / numbered list ให้อ่านง่าย
- ปิดด้วย CTA ที่ทำให้คนคอมเมนต์หรือแชร์
- เพิ่ม hashtag 5-8 อัน
- ความยาว 200-400 คำ`,
      `หัวข้อ: "${topic}" — เขียนโพสต์ให้สมบูรณ์พร้อมลง`,
      { name: 'Content Writer', department: 'Content' }
    );
    _showAIResult('✍️', 'Content Writer', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// 4. 🎣 Hook & Copy Specialist — Generate Hooks
async function aiGenerateHooks() {
  const topic = _getTopicInput();
  _showAILoading('🎣', 'Hook & Copy Specialist', 'กำลังสร้าง Hook...');
  try {
    const result = await callAIWithFailover(
      `คุณคือ Hook & Copy Specialist ผู้เชี่ยวชาญการเขียนพาดหัว
ตอบเป็นภาษาไทย สร้าง Hook 5 เวอร์ชันจากหัวข้อที่ให้:

สำหรับแต่ละ Hook ให้ระบุ:
- Hook (ประโยคเปิด 1-2 บรรทัด)
- สไตล์ (Curiosity / Fear / Challenge / Story / Shock)
- CTA (Call to Action) 1 บรรทัด
- คะแนนพลัง (⚡ 1-10)

เรียงจากแรงสุดไปน้อยสุด ใช้ emoji`,
      `หัวข้อ: "${topic}" — สร้าง Hook 5 เวอร์ชันให้`,
      { name: 'Hook Specialist', department: 'Content' }
    );
    _showAIResult('🎣', 'Hook Generator', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// 5. 🎨 Visual Designer — Visual Brief
async function aiVisualBrief() {
  const topic = _getTopicInput();
  _showAILoading('🎨', 'Visual Designer', 'กำลังออกแบบ Visual Brief...');
  try {
    const result = await callAIWithFailover(
      `คุณคือ Visual Designer ผู้เชี่ยวชาญด้านออกแบบ
ตอบเป็นภาษาไทย สร้าง Visual Brief สำหรับหัวข้อที่ให้:

1. 🖼 ปกโพสต์:
   - คอนเซ็ปต์ภาพ
   - สี/โทน
   - ข้อความบนภาพ (สั้นๆ)
   - สไตล์ (minimal/bold/gradient/3D)

2. 📱 คารูเซล (5 slides):
   - Slide 1: ปก (หัวข้อ + hook)
   - Slide 2-4: เนื้อหา (ข้อมูลสำคัญ)
   - Slide 5: CTA + ติดตาม

3. 🎬 Thumbnail:
   - คอนเซ็ปต์ thumbnail สำหรับคลิป
   - ข้อความ / expression / สี`,
      `หัวข้อ: "${topic}" — ออกแบบ Visual Brief ให้ทั้งปก, คารูเซล, thumbnail`,
      { name: 'Visual Designer', department: 'Design' }
    );
    _showAIResult('🎨', 'Visual Brief', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// 6. 🎬 Video Script Producer
async function aiVideoScript() {
  const topic = _getTopicInput();
  _showAILoading('🎬', 'Video Script Producer', 'กำลังเขียน Script คลิปสั้น...');
  try {
    const result = await callAIWithFailover(
      `คุณคือ Video Script Producer ผู้เชี่ยวชาญเขียนสคริปต์คลิปสั้น
ตอบเป็นภาษาไทย แตกหัวข้อ 1 ชิ้นเป็น 3 คลิปสั้น:

สำหรับแต่ละคลิป ให้ระบุ:
📹 คลิปที่ [1/2/3]:
- ชื่อคลิป
- Hook เปิด (3 วินาทีแรก)
- เนื้อหา (จุดสำคัญ 3-5 ข้อ)
- CTA ปิด
- ความยาว (15/30/60 วินาที)
- Platform เหมาะ: TikTok/Reels/Shorts
- Shot list (wide/close-up/screencast)

ให้แต่ละคลิปต่างมุม: คลิป 1 = ข้อมูล, คลิป 2 = เล่าเรื่อง, คลิป 3 = ท้าทาย`,
      `หัวข้อ: "${topic}" — แตกเป็น 3 คลิปสั้น`,
      { name: 'Video Producer', department: 'Content' }
    );
    _showAIResult('🎬', 'Video Scripts (3 clips)', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// 7. 📊 Performance Analyst — AI Weekly Analysis
async function aiWeeklyAnalysis() {
  const items = getContentItems();
  const posted = items.filter(i => i.stage === 'posted');
  const summary = items.map(i => `"${i.title}" (${i.platform}/${i.type}) → ${i.stage}, engagement: ${i.engagement}`).join('\n');

  _showAILoading('📊', 'Performance Analyst', 'กำลังวิเคราะห์ผลงาน...');
  try {
    const result = await callAIWithFailover(
      `คุณคือ Performance Analyst ผู้เชี่ยวชาญวิเคราะห์คอนเทนต์
ตอบเป็นภาษาไทย วิเคราะห์ข้อมูลคอนเทนต์ที่ให้มา:

สรุปให้ครอบคลุม:
1. 📊 ภาพรวม: กี่ชิ้น / กี่ posted / กี่ in progress
2. 🏆 โพสต์ที่ดีที่สุด + เหตุผล
3. 📉 โพสต์ที่ควรปรับปรุง + แนะนำ
4. 🔥 เทรนด์ที่ควรทำซ้ำ
5. ⛔ สิ่งที่ควรหยุดทำ
6. 📋 แนะนำ 3 หัวข้อถัดไปที่น่าจะปัง
7. 💡 คะแนนสุขภาพคอนเทนต์ (/100)

ใช้ emoji ให้อ่านง่าย กระชับ`,
      `ข้อมูลคอนเทนต์:\n${summary}\n\nวิเคราะห์ผลงานรายสัปดาห์ให้หน่อย`,
      { name: 'Performance Analyst', department: 'Analytics' }
    );
    _showAIResult('📊', 'AI Weekly Analysis', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// ===== Register Tab =====
(function initContentStudio() {
  // Add command palette shortcut
  if (typeof window.switchTab === 'function') {
    const origSwitch = window.switchTab;
    window.switchTab = function(tab) {
      origSwitch(tab);
      if (tab === 'content-studio') renderContentStudio();
    };
  }
})();
