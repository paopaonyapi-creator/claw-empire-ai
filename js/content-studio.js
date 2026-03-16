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
          <button class="btn btn-sm" onclick="showContentCalendar()" style="background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff">📅 Calendar</button>
          <button class="btn btn-sm" onclick="showTemplatesLibrary()" style="background:linear-gradient(135deg,#f59e0b,#22c55e);color:#fff">📋 Templates</button>
          <button class="btn btn-sm" onclick="showPlatformPreview()" style="background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff">👁️ Preview</button>
          <button class="btn btn-sm" onclick="showContentHistory()" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff">📜 History</button>
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
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
          <button class="btn btn-sm" onclick="aiAutoWorkflow()" style="background:linear-gradient(135deg,#ff6b6b,#ee5a24,#f9ca24);color:#fff;font-size:12px;font-weight:800;padding:8px 16px;box-shadow:0 4px 15px rgba(238,90,36,0.4);animation:pulse 2s infinite">🚀 Auto Content</button>
          <span style="color:var(--text-muted);font-size:9px">|</span>
          <button class="btn btn-sm" onclick="aiScanTrends()" style="background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;font-size:11px">🔍 Scan Trends</button>
          <button class="btn btn-sm" onclick="aiAudienceInsight()" style="background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font-size:11px">🧠 Audience Insight</button>
          <button class="btn btn-sm" onclick="aiWritePost()" style="background:linear-gradient(135deg,#22c55e,#14b8a6);color:#fff;font-size:11px">✍️ Write Post</button>
          <button class="btn btn-sm" onclick="aiGenerateHooks()" style="background:linear-gradient(135deg,#ef4444,#ec4899);color:#fff;font-size:11px">🎣 Generate Hooks</button>
          <button class="btn btn-sm" onclick="aiGenerateHashtags()" style="background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#fff;font-size:11px">#️⃣ Hashtags</button>
          <button class="btn btn-sm" onclick="aiContentScore()" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;font-size:11px">💯 Content Score</button>
          <button class="btn btn-sm" onclick="aiContentPlanner()" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:11px">📋 Planner 7D</button>
          <button class="btn btn-sm" onclick="aiCompetitorAnalysis()" style="background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;font-size:11px">🏆 Competitor</button>
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
  // Auto-save to history
  _saveToContentHistory(agentIcon, agentName, provider, content);
  showModal(`
    <div style="max-width:550px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="font-size:36px">${agentIcon}</div>
        <div>
          <h3 style="margin:0">${agentName}</h3>
          <div style="font-size:10px;color:var(--text-muted)">Powered by ${provider} 🤖</div>
        </div>
      </div>
      <div style="padding:16px;background:var(--bg-input);border-radius:12px;font-size:13px;line-height:1.7;white-space:pre-wrap;max-height:400px;overflow-y:auto">${content}</div>
      <div style="margin-top:10px;display:flex;gap:6px;justify-content:flex-end">
        <button class="btn btn-sm" onclick="navigator.clipboard.writeText(document.querySelector('#modalOverlay .modal-content div[style*=pre-wrap]')?.innerText||'');showToast('📋 คัดลอกแล้ว!','success')" style="font-size:11px">📋 คัดลอก</button>
        <button class="btn btn-sm" onclick="showContentHistory()" style="font-size:11px">📜 ดูประวัติ</button>
      </div>
    </div>
  `);
}

function _getTopicInput() {
  const items = getContentItems();
  const ideas = items.filter(i => i.stage === 'idea' || i.stage === 'draft');
  if (ideas.length > 0) return ideas[0].title;
  return 'เทคนิคขายของออนไลน์ให้ปังในปี 2024';
}

// Timeout wrapper — skip if AI doesn't respond in 30s
function _callAIWithTimeout(system, prompt, agent, timeoutMs = 30000) {
  return Promise.race([
    callAIWithFailover(system, prompt, agent),
    new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout (' + (timeoutMs/1000) + 's) — ลองใหม่อีกครั้ง')), timeoutMs))
  ]);
}

// 1. 🔍 Trend Hunter — Scan Trends
async function aiScanTrends() {
  _showAILoading('🔍', 'Trend Hunter', 'กำลังสแกนเทรนด์...');
  try {
    const result = await _callAIWithTimeout(
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
    const result = await _callAIWithTimeout(
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
    const result = await _callAIWithTimeout(
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
    const result = await _callAIWithTimeout(
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
    const result = await _callAIWithTimeout(
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
    const result = await _callAIWithTimeout(
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
    const result = await _callAIWithTimeout(
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

// ===== 🚀 AI Auto-Workflow — Chain 5 Agents =====

function _updateAutoProgress(steps, currentIdx, statusText) {
  const modal = document.querySelector('.modal-content') || document.querySelector('[style*="max-width:600px"]');
  const container = document.getElementById('auto-workflow-progress');
  if (!container) return;
  container.innerHTML = `
    <div style="margin-bottom:16px">
      ${steps.map((s, i) => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;margin-bottom:6px;
          background:${i === currentIdx ? 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(236,72,153,0.08))' : i < currentIdx ? 'rgba(34,197,94,0.06)' : 'var(--bg-input)'};
          border:${i === currentIdx ? '2px solid #6366f1' : '1px solid var(--border)'};
          ${i === currentIdx ? 'box-shadow:0 2px 12px rgba(99,102,241,0.15)' : ''}">
          <div style="width:36px;height:36px;border-radius:10px;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:18px;
            ${i === currentIdx ? 'animation:pulse 1.5s infinite' : ''}">${s.icon}</div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:12px">${s.name}</div>
            <div style="font-size:10px;color:var(--text-muted)">${s.task}</div>
          </div>
          <div style="font-size:16px">${i < currentIdx ? '✅' : i === currentIdx ? '⏳' : '⬜'}</div>
        </div>
      `).join('')}
    </div>
    <div style="text-align:center">
      <div style="font-size:11px;color:#6366f1;font-weight:700">${statusText}</div>
      <div style="width:100%;height:6px;background:var(--border);border-radius:4px;margin-top:8px;overflow:hidden">
        <div style="width:${Math.round(((currentIdx + 0.5) / steps.length) * 100)}%;height:100%;background:linear-gradient(90deg,#6366f1,#ec4899);border-radius:4px;transition:width 0.5s"></div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:4px">${currentIdx + 1} / ${steps.length} steps</div>
    </div>
  `;
}

async function aiAutoWorkflow() {
  const steps = [
    { icon: '🔍', name: 'Trend Hunter', task: 'สแกนเทรนด์ที่มาแรง', color: '#f59e0b',
      prompt: 'สแกนเทรนด์โซเชียลมีเดียที่มาแรงตอนนี้ ให้ 3 หัวข้อที่น่าทำคอนเทนต์ ตอบสั้นๆ แต่ละหัวข้อ 2-3 บรรทัด',
      system: 'คุณคือ Trend Hunter ตอบภาษาไทยสั้นกระชับ ให้ 3 เทรนด์ที่มาแรง พร้อมเหตุผลสั้นๆ' },
    { icon: '🧠', name: 'Audience Planner', task: 'วิเคราะห์มุมเล่าที่โดนใจ', color: '#8b5cf6',
      prompt: '', // will be filled with trend result
      system: 'คุณคือ Audience Insight Planner ตอบภาษาไทยสั้นกระชับ วิเคราะห์กลุ่มเป้าหมาย: Pain Points 3 ข้อ, Desires 3 ข้อ, แนะนำมุมเล่า 1 มุมที่ดีสุด' },
    { icon: '✍️', name: 'Content Writer', task: 'เขียนโพสต์ฉบับเต็ม', color: '#22c55e',
      prompt: '', // will be filled
      system: 'คุณคือ Content Writer ตอบภาษาไทย เขียนโพสต์ Facebook ฉบับเต็มจากหัวข้อที่ให้ มี Hook เปิด + เนื้อหา 3 ย่อหน้า + CTA + hashtag 5 อัน' },
    { icon: '🎣', name: 'Hook Specialist', task: 'สร้าง Hook 3 เวอร์ชัน', color: '#ef4444',
      prompt: '', // will be filled
      system: 'คุณคือ Hook Specialist ตอบภาษาไทย สร้าง Hook 3 เวอร์ชันจากโพสต์ที่ให้ แต่ละ Hook มีสไตล์ต่างกัน (Curiosity/Fear/Challenge) พร้อม CTA' },
    { icon: '🎬', name: 'Video Producer', task: 'แตกเป็น 3 คลิปสั้น', color: '#ec4899',
      prompt: '', // will be filled
      system: 'คุณคือ Video Script Producer ตอบภาษาไทย แตกโพสต์เป็น 3 คลิปสั้น (15/30/60 วินาที) แต่ละคลิปมี: ชื่อ, Hook เปิด 3 วิ, เนื้อหา 3 จุด, CTA, Platform ที่เหมาะ' },
  ];

  // Show progress modal
  showModal(`
    <div style="max-width:600px">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:48px;animation:pulse 1.5s infinite">🚀</div>
        <h3 style="background:linear-gradient(135deg,#ff6b6b,#ee5a24,#f9ca24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:20px">AI Auto Content</h3>
        <p style="color:var(--text-muted);font-size:11px">5 AI Agents ทำงานต่อเนื่องอัตโนมัติ</p>
      </div>
      <div id="auto-workflow-progress"></div>
    </div>
  `);

  const results = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    _updateAutoProgress(steps, i, `${step.icon} ${step.name} กำลังทำงาน...`);

    // Build prompt based on previous results
    let userPrompt = step.prompt;
    if (i === 1 && results[0]) {
      userPrompt = `จากเทรนด์นี้:\n${results[0].substring(0, 500)}\n\nวิเคราะห์กลุ่มเป้าหมายและแนะนำมุมเล่าที่ดีที่สุด`;
    } else if (i === 2 && results[1]) {
      userPrompt = `จากการวิเคราะห์กลุ่มเป้าหมาย:\n${results[1].substring(0, 500)}\n\nเขียนโพสต์ Facebook ฉบับเต็มจากมุมเล่าที่แนะนำ`;
    } else if (i === 3 && results[2]) {
      userPrompt = `จากโพสต์นี้:\n${results[2].substring(0, 500)}\n\nสร้าง Hook 3 เวอร์ชัน`;
    } else if (i === 4 && results[2]) {
      userPrompt = `จากโพสต์นี้:\n${results[2].substring(0, 500)}\n\nแตกเป็น 3 คลิปสั้น`;
    }

    try {
      const result = await _callAIWithTimeout(step.system, userPrompt, { name: step.name, department: 'Content' });
      results.push(result.response);
    } catch (e) {
      results.push(`❌ Error: ${e.message}`);
    }
  }

  // Show ALL completed
  _updateAutoProgress(steps, steps.length, '🎉 เสร็จหมดแล้ว!');
  await new Promise(r => setTimeout(r, 1000));

  // Show comprehensive results
  showModal(`
    <div style="max-width:650px">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:48px">🎉</div>
        <h3 style="background:linear-gradient(135deg,#ff6b6b,#ee5a24,#f9ca24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:20px">Auto Content สำเร็จ!</h3>
        <p style="color:var(--text-muted);font-size:11px">5 AI Agents ทำงานเสร็จครบ — ผลลัพธ์พร้อมใช้</p>
      </div>
      <div style="max-height:500px;overflow-y:auto">
        ${steps.map((s, i) => `
          <details ${i === 2 ? 'open' : ''} style="margin-bottom:8px;border:1px solid var(--border);border-radius:12px;overflow:hidden">
            <summary style="padding:12px;cursor:pointer;background:var(--bg-input);display:flex;align-items:center;gap:10px;font-weight:700;font-size:13px">
              <span style="font-size:20px">${s.icon}</span>
              <span style="flex:1">${s.name}</span>
              <span style="font-size:12px">${results[i]?.startsWith('❌') ? '❌' : '✅'}</span>
            </summary>
            <div style="padding:14px;font-size:12px;line-height:1.7;white-space:pre-wrap;background:var(--bg-card)">${results[i] || 'No result'}</div>
          </details>
        `).join('')}
      </div>
    </div>
  `);

  showToast('🚀 Auto Content เสร็จครบ 5 ขั้นตอน!', 'success', 5000);
}

// ===== 📅 Content Calendar =====
function showContentCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const dayNames = ['อา','จ','อ','พ','พฤ','ศ','ส'];
  const items = getContentItems();

  // Map content to dates
  const dateMap = {};
  items.forEach(item => {
    const d = item.date || item.created;
    if (d) {
      const key = new Date(d).getDate();
      if (!dateMap[key]) dateMap[key] = [];
      dateMap[key].push(item);
    }
  });

  // Merge scheduled posts from localStorage
  const scheduledPosts = _getScheduledPosts();
  scheduledPosts.forEach(sp => {
    if (sp.month === month && sp.year === year) {
      if (!dateMap[sp.day]) dateMap[sp.day] = [];
      dateMap[sp.day].push(sp);
    }
  });
  // Sample posts only if no real data exists
  if (Object.keys(dateMap).length === 0) {
    const samplePosts = {
      [now.getDate()]: [{title:'โพสต์ขายสินค้า',platform:'facebook',type:'post'}],
      [now.getDate()+1]: [{title:'คลิป Behind the scenes',platform:'tiktok',type:'video'}],
      [now.getDate()+2]: [{title:'คารูเซลความรู้',platform:'instagram',type:'carousel'}],
      [now.getDate()+4]: [{title:'ไลฟ์สอนใช้งาน',platform:'facebook',type:'live'}],
    };
    Object.keys(samplePosts).forEach(k => {
      const d = parseInt(k);
      if (d <= daysInMonth) { dateMap[d] = samplePosts[d]; }
    });
  }

  const platformColors = {facebook:'#3b82f6',instagram:'#ec4899',tiktok:'#000',twitter:'#1da1f2',x:'#000',youtube:'#ef4444'};
  const platformIcons = {facebook:'📘',instagram:'📸',tiktok:'🎵',twitter:'🐦',x:'𝕏',youtube:'▶️'};

  let calGrid = '';
  // Header row
  calGrid += dayNames.map(d => `<div style="text-align:center;font-weight:700;font-size:11px;color:var(--text-muted);padding:6px">${d}</div>`).join('');
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) calGrid += '<div></div>';
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === now.getDate();
    const hasContent = dateMap[d] && dateMap[d].length > 0;
    const contentDots = hasContent ? dateMap[d].slice(0,3).map(c => {
      const color = platformColors[c.platform] || '#6366f1';
      return `<div style="font-size:8px;background:${color};color:#fff;border-radius:4px;padding:1px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%" title="${c.title}">${platformIcons[c.platform]||'📄'} ${c.title?.substring(0,8)||''}</div>`;
    }).join('') : '';
    const moreCount = hasContent && dateMap[d].length > 3 ? `<div style="font-size:8px;color:var(--text-muted)">+${dateMap[d].length-3} more</div>` : '';
    calGrid += `<div style="min-height:70px;border:1px solid ${isToday ? '#6366f1' : 'var(--border)'};border-radius:8px;padding:4px;
      background:${isToday ? 'rgba(99,102,241,0.08)' : 'var(--bg-card)'};
      ${isToday ? 'box-shadow:0 0 8px rgba(99,102,241,0.2)' : ''};
      cursor:pointer" onclick="showCalendarDay(${d})">
      <div style="font-size:11px;font-weight:${isToday?'800':'600'};color:${isToday?'#6366f1':'var(--text)'}">${d}</div>
      <div style="display:flex;flex-direction:column;gap:2px;margin-top:2px">${contentDots}${moreCount}</div>
    </div>`;
  }

  showModal(`
    <div style="max-width:700px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <h3 style="margin:0">📅 Content Calendar</h3>
          <p style="color:var(--text-muted);font-size:11px;margin:4px 0 0">${monthNames[month]} ${year}</p>
        </div>
        <div style="display:flex;gap:6px">
          <span style="background:rgba(59,130,246,0.1);color:#3b82f6;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700">📘 FB</span>
          <span style="background:rgba(236,72,153,0.1);color:#ec4899;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700">📸 IG</span>
          <span style="background:rgba(0,0,0,0.05);padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700">🎵 TT</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">
        ${calGrid}
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-sm" onclick="addNewContent()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff">➕ เพิ่มคอนเทนต์</button>
      </div>
    </div>
  `);
}

function showCalendarDay(day) {
  const items = getContentItems();
  const scheduled = _getScheduledPosts();
  const now = new Date();
  const dateMap = {};
  items.forEach(item => {
    const d = item.date || item.created;
    if (d) { const key = new Date(d).getDate(); if (!dateMap[key]) dateMap[key] = []; dateMap[key].push(item); }
  });
  // Merge scheduled posts
  scheduled.forEach(sp => {
    if (sp.day === day && sp.month === now.getMonth() && sp.year === now.getFullYear()) {
      if (!dateMap[day]) dateMap[day] = [];
      dateMap[day].push(sp);
    }
  });
  const dayItems = dateMap[day] || [];
  const platformIcons = {facebook:'📘',instagram:'📸',tiktok:'🎵',x:'𝕏',youtube:'▶️'};
  showModal(`
    <div style="max-width:420px">
      <h3 style="margin-bottom:12px">📅 วันที่ ${day} ${['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'][now.getMonth()]}</h3>
      ${dayItems.length ? '<div style="margin-bottom:12px">' + dayItems.map((i, idx) => {
        const isScheduled = i.created && !i.date; // scheduled posts have no .date field
        return `
        <div style="padding:10px;background:var(--bg-input);border-radius:10px;margin-bottom:6px;display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">${platformIcons[i.platform]||'📄'}</span>
          <div style="flex:1">
            <div style="font-weight:700;font-size:12px">${i.title}</div>
            <div style="font-size:10px;color:var(--text-muted)">${i.platform || 'All'} · ${i.type || 'post'}</div>
          </div>
          ${isScheduled ? `<button onclick="_deleteScheduledPost(${day},${idx})" style="background:none;border:none;cursor:pointer;font-size:14px;padding:4px;border-radius:6px;color:var(--text-muted)" title="ลบ" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-muted)'">🗑️</button>` : ''}
        </div>`;
      }).join('') + '</div>' : '<p style="color:var(--text-muted);text-align:center;margin-bottom:12px">ยังไม่มีคอนเทนต์วันนี้</p>'}
      <div style="background:var(--bg-input);border-radius:12px;padding:12px;border:1px dashed var(--border)">
        <div style="font-weight:700;font-size:12px;margin-bottom:8px">➕ เพิ่มคอนเทนต์วันนี้</div>
        <input id="schedTitle" placeholder="ชื่อคอนเทนต์..." style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);font-size:12px;margin-bottom:6px;box-sizing:border-box">
        <div style="display:flex;gap:6px;margin-bottom:8px">
          <select id="schedPlatform" style="flex:1;padding:6px 8px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);font-size:11px">
            <option value="facebook">📘 Facebook</option>
            <option value="instagram">📸 Instagram</option>
            <option value="tiktok">🎵 TikTok</option>
            <option value="x">𝕏 X (Twitter)</option>
            <option value="youtube">▶️ YouTube</option>
          </select>
          <select id="schedType" style="flex:1;padding:6px 8px;border:1px solid var(--border);border-radius:8px;background:var(--bg-card);color:var(--text);font-size:11px">
            <option value="post">📝 Post</option>
            <option value="video">🎬 Video</option>
            <option value="reel">📱 Reel</option>
            <option value="carousel">🖼️ Carousel</option>
            <option value="live">🔴 Live</option>
            <option value="story">📖 Story</option>
          </select>
        </div>
        <button class="btn btn-sm" onclick="_addScheduledPost(${day})" style="width:100%;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff">✅ บันทึก</button>
      </div>
    </div>
  `);
}

// ===== 📋 Content Templates Library =====
const CONTENT_TEMPLATES = [
  { id: 't1', name: 'โพสต์ขายสินค้า', icon: '🛒', cat: 'ขาย', desc: 'โพสต์แนะนำสินค้า + ราคา + CTA ซื้อเลย', prompt: 'เขียนโพสต์ขายสินค้าออนไลน์ ให้มี Hook เปิด, รายละเอียดสินค้า, ราคาพิเศษ, CTA สั่งซื้อ, hashtag 5 อัน' },
  { id: 't2', name: 'เล่าเรื่อง (Storytelling)', icon: '📖', cat: 'เล่าเรื่อง', desc: 'โพสต์เล่าเรื่องจากประสบการณ์จริง', prompt: 'เขียนโพสต์เล่าเรื่อง storytelling จากประสบการณ์จริง ให้อ่านแล้วอิน มี twist ending และ lesson learned' },
  { id: 't3', name: 'สอนความรู้ (How-to)', icon: '📚', cat: 'สอน', desc: 'โพสต์สอนวิธีทำ ขั้นตอน 1-2-3', prompt: 'เขียนโพสต์สอนวิธีทำ step-by-step 5 ขั้นตอน ภาษาง่ายๆ ให้คนทำตามได้เลย มี emoji ประกอบ' },
  { id: 't4', name: 'รีวิวสินค้า', icon: '⭐', cat: 'รีวิว', desc: 'รีวิวจริง พร้อมข้อดี-ข้อเสีย', prompt: 'เขียนรีวิวสินค้าแบบจริงใจ มีข้อดี 3 ข้อ ข้อเสีย 1 ข้อ สรุปว่าเหมาะกับใคร ให้คะแนน /5' },
  { id: 't5', name: 'Before & After', icon: '🔄', cat: 'ขาย', desc: 'เปรียบเทียบก่อน-หลังใช้สินค้า', prompt: 'เขียนโพสต์ Before & After เปรียบเทียบก่อนและหลังใช้สินค้า/บริการ ให้เห็นผลลัพธ์ชัดเจน มี CTA' },
  { id: 't6', name: 'Q&A ถาม-ตอบ', icon: '❓', cat: 'engagement', desc: 'โพสต์ถาม-ตอบเพิ่ม engagement', prompt: 'เขียนโพสต์ Q&A 5 คำถาม-คำตอบ ที่คนถามบ่อยเกี่ยวกับสินค้า/ธุรกิจ ตอบสั้นกระชับเข้าใจง่าย' },
  { id: 't7', name: 'โพลล์ (Poll)', icon: '📊', cat: 'engagement', desc: 'โพสต์โหวตเลือก สร้าง engagement', prompt: 'เขียนโพสต์ Poll ถามความเห็น ให้เลือก 2-4 ตัวเลือก หัวข้อน่าสนใจ ชวนให้คนคอมเมนต์' },
  { id: 't8', name: 'ส่วนลดพิเศษ', icon: '🏷️', cat: 'โปรโมชั่น', desc: 'โพสต์โปรโมชั่น ส่วนลด flash sale', prompt: 'เขียนโพสต์โปรโมชั่นส่วนลดพิเศษ มี urgency (จำกัดเวลา), ราคาเปรียบเทียบ, CTA รีบสั่ง, emoji 🔥' },
  { id: 't9', name: 'Testimonial ลูกค้า', icon: '💬', cat: 'โซเชียลพรูฟ', desc: 'โพสต์รีวิวจากลูกค้าจริง', prompt: 'เขียนโพสต์ testimonial จากลูกค้าจริง 3 คน แต่ละคนมีปัญหาต่างกัน เล่าว่าสินค้าช่วยแก้ปัญหาอย่างไร' },
  { id: 't10', name: 'เทรนด์ของวัน', icon: '🔥', cat: 'เทรนด์', desc: 'โพสต์เกาะกระแสเทรนด์ร้อน', prompt: 'เขียนโพสต์เกาะกระแสเทรนด์ที่มาแรงตอนนี้ เชื่อมโยงกับสินค้า/ธุรกิจอย่างแนบเนียน มี hashtag trending' },
  { id: 't11', name: 'สคริปต์คลิปสั้น TikTok', icon: '🎬', cat: 'วิดีโอ', desc: 'สคริปต์คลิปสั้น 15-60 วินาที', prompt: 'เขียนสคริปต์คลิปสั้น TikTok 30 วินาที มี Hook 3 วิแรก, เนื้อหา 3 จุด, CTA, แนะนำเพลงประกอบ' },
  { id: 't12', name: 'คารูเซล Instagram', icon: '📸', cat: 'วิดีโอ', desc: 'เนื้อหาคารูเซล 5-10 slides', prompt: 'เขียนเนื้อหาคารูเซล Instagram 7 slides: Slide 1=Hook ปก, Slide 2-6=เนื้อหาทีละข้อ, Slide 7=CTA + summary' },
  { id: 't13', name: 'Email Newsletter', icon: '📧', cat: 'อีเมล', desc: 'อีเมลประชาสัมพันธ์', prompt: 'เขียน email newsletter หัวข้อน่าสนใจ มี subject line 3 ตัวเลือก, preheader, เนื้อหา 3 section, CTA button' },
  { id: 't14', name: 'Thread บน X', icon: '🧵', cat: 'เทรนด์', desc: 'Thread 5-10 ทวีตให้ความรู้', prompt: 'เขียน Thread บน X (Twitter) 7 ทวีต ให้ความรู้เรื่องหนึ่ง ทวีตแรกเป็น Hook, ทวีต 2-6 เนื้อหา, ทวีตสุดท้ายเป็น CTA' },
  { id: 't15', name: 'Comparison เปรียบเทียบ', icon: '⚖️', cat: 'สอน', desc: 'เปรียบเทียบ A vs B', prompt: 'เขียนโพสต์เปรียบเทียบ 2 ตัวเลือก (A vs B) ให้ข้อดี-ข้อเสียแต่ละอัน สรุปว่าเหมาะกับใคร ใช้ตารางเปรียบเทียบ' },
];

function showTemplatesLibrary() {
  const categories = [...new Set(CONTENT_TEMPLATES.map(t => t.cat))];

  showModal(`
    <div style="max-width:650px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <span style="font-size:32px">📋</span>
        <div>
          <h3 style="margin:0">Content Templates</h3>
          <p style="color:var(--text-muted);font-size:11px;margin:2px 0 0">${CONTENT_TEMPLATES.length} templates พร้อมใช้ — เลือกแล้ว AI เขียนให้ทันที</p>
        </div>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
        ${categories.map(c => `<span style="padding:4px 10px;border-radius:8px;font-size:10px;font-weight:700;background:rgba(99,102,241,0.1);color:#6366f1">${c}</span>`).join('')}
      </div>
      <div style="max-height:450px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px">
        ${CONTENT_TEMPLATES.map(t => `
          <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:12px;padding:12px;cursor:pointer;transition:all 0.2s;
            hover:transform:translateY(-2px)" onclick="useTemplate('${t.id}')">
            <div style="font-size:28px;margin-bottom:6px">${t.icon}</div>
            <div style="font-weight:700;font-size:12px;margin-bottom:4px">${t.name}</div>
            <div style="font-size:10px;color:var(--text-muted);line-height:1.4">${t.desc}</div>
            <div style="margin-top:8px">
              <span style="font-size:9px;background:rgba(99,102,241,0.1);color:#6366f1;padding:2px 6px;border-radius:4px">${t.cat}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `);
}

async function useTemplate(templateId) {
  const template = CONTENT_TEMPLATES.find(t => t.id === templateId);
  if (!template) return;
  const topic = _getTopicInput();
  _showAILoading(template.icon, template.name, `กำลังสร้างคอนเทนต์จาก Template...`);
  try {
    const result = await _callAIWithTimeout(
      `คุณคือ Content Writer มืออาชีพ ตอบเป็นภาษาไทย\n${template.prompt}`,
      `หัวข้อ: ${topic}\nสร้างคอนเทนต์ตาม template: ${template.name}`,
      { name: 'Template Writer', department: 'Content' }
    );
    _showAIResult(template.icon, template.name, result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// ===== 👁️ Multi-Platform Preview =====
function showPlatformPreview() {
  // Try to pull real AI-generated content from history
  const history = _getContentHistory();
  const latestAI = history.length > 0 ? history[0] : null;
  const items = getContentItems();
  const latestPost = items.find(i => i.stage === 'posted' || i.stage === 'scheduled') || items[0];
  const title = latestAI?.agentName || latestPost?.title || 'เทคนิคขายของออนไลน์ให้ปังในปี 2024';
  const sampleContent = latestAI?.content || `🔥 ${title}\n\nเคยมั้ยที่รู้สึกว่าทำคอนเทนต์ไปแล้ว แต่ไม่มีคนเห็น? วันนี้จะมาเปิดเผย 3 เทคนิคลับที่ทำให้ยอดพุ่ง 10 เท่า!\n\n1️⃣ เลือกเวลาโพสต์ที่ถูกต้อง\n2️⃣ ใช้ Hook ที่หยุดนิ้วได้\n3️⃣ มี CTA ที่ชัดเจน\n\n💬 คุณใช้เทคนิคไหนอยู่? คอมเมนต์บอกหน่อย!\n\n#ขายของออนไลน์ #DigitalMarketing #ContentCreator #Tips2024 #SMM`;
  const previewSource = latestAI ? `📌 ใช้ข้อมูลจาก: ${latestAI.agentName} (${new Date(latestAI.timestamp).toLocaleString('th-TH')})` : '📌 ใช้ข้อมูลตัวอย่าง — สร้างคอนเทนต์ด้วย AI แล้วกลับมาดูใหม่!';

  const platforms = [
    { name: 'Facebook', icon: '📘', color: '#3b82f6', maxChar: 63206, bestTime: '11:00-13:00', format: 'โพสต์ยาวได้ + รูป/วิดีโอ', charLabel: 'ไม่จำกัด (แนะนำ < 500)' },
    { name: 'Instagram', icon: '📸', color: '#ec4899', maxChar: 2200, bestTime: '17:00-21:00', format: 'รูป/คารูเซล + Caption', charLabel: '2,200 ตัวอักษร' },
    { name: 'TikTok', icon: '🎵', color: '#000', maxChar: 300, bestTime: '19:00-23:00', format: 'วิดีโอสั้น + Caption', charLabel: '300 ตัวอักษร' },
    { name: 'X (Twitter)', icon: '𝕏', color: '#1da1f2', maxChar: 280, bestTime: '08:00-10:00', format: 'ข้อความสั้น + Thread', charLabel: '280 ตัวอักษร' },
  ];

  showModal(`
    <div style="max-width:700px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <span style="font-size:32px">👁️</span>
        <div>
          <h3 style="margin:0">Multi-Platform Preview</h3>
          <p style="color:var(--text-muted);font-size:11px;margin:2px 0 0">${previewSource}</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-height:500px;overflow-y:auto">
        ${platforms.map(p => {
          const charCount = sampleContent.length;
          const isOverLimit = charCount > p.maxChar;
          const displayContent = isOverLimit ? sampleContent.substring(0, p.maxChar) + '...' : sampleContent;
          return `
          <div style="border:1px solid var(--border);border-radius:14px;overflow:hidden;background:var(--bg-card)">
            <div style="background:${p.color};color:#fff;padding:10px 14px;display:flex;align-items:center;gap:8px">
              <span style="font-size:20px">${p.icon}</span>
              <span style="font-weight:700;font-size:14px">${p.name}</span>
            </div>
            <div style="padding:12px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <div style="width:32px;height:32px;border-radius:50%;background:${p.color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px">👤</div>
                <div>
                  <div style="font-weight:700;font-size:11px">Your Brand</div>
                  <div style="font-size:9px;color:var(--text-muted)">Just now</div>
                </div>
              </div>
              <div style="font-size:11px;line-height:1.5;white-space:pre-wrap;max-height:120px;overflow-y:auto;background:var(--bg-input);padding:8px;border-radius:8px">${displayContent}</div>
              <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:9px;color:${isOverLimit ? '#ef4444' : '#22c55e'};font-weight:700">
                  ${isOverLimit ? '⚠️ เกินลิมิต!' : '✅ OK'} ${charCount}/${p.charLabel}
                </span>
              </div>
              <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--border);display:flex;gap:12px">
                <span style="font-size:9px;color:var(--text-muted)">⏰ Best: ${p.bestTime}</span>
                <span style="font-size:9px;color:var(--text-muted)">📐 ${p.format}</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:12px;background:var(--bg-input);border-radius:10px;padding:12px">
        <div style="font-weight:700;font-size:12px;margin-bottom:6px">📊 Platform Summary</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center">
          ${platforms.map(p => {
            const ok = sampleContent.length <= p.maxChar;
            return `<div style="padding:6px;border-radius:8px;background:${ok ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)'}">
              <div style="font-size:16px">${p.icon}</div>
              <div style="font-size:10px;font-weight:700;color:${ok ? '#22c55e' : '#ef4444'}">${ok ? '✅ Ready' : '⚠️ Too long'}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `);
}

// ===== 📜 Content History =====
function _getContentHistory() {
  try { return JSON.parse(localStorage.getItem('cs-content-history') || '[]'); } catch { return []; }
}

function _saveToContentHistory(icon, agentName, provider, content) {
  const history = _getContentHistory();
  history.unshift({ icon, agentName, provider, content, timestamp: Date.now() });
  // Keep max 50 items
  if (history.length > 50) history.length = 50;
  localStorage.setItem('cs-content-history', JSON.stringify(history));
}

function showContentHistory() {
  const history = _getContentHistory();
  showModal(`
    <div style="max-width:600px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:28px">📜</span>
          <div>
            <h3 style="margin:0">Content History</h3>
            <p style="color:var(--text-muted);font-size:11px;margin:2px 0 0">${history.length} รายการ — AI สร้างให้ทั้งหมด</p>
          </div>
        </div>
        ${history.length ? '<div style="display:flex;gap:4px;flex-wrap:wrap"><button class="btn btn-sm" onclick="_exportHistory()" style="background:linear-gradient(135deg,#10b981,#059669);color:#fff;font-size:10px">📥 TXT</button><button class="btn btn-sm" onclick="_exportHistoryCSV()" style="background:linear-gradient(135deg,#3b82f6,#6366f1);color:#fff;font-size:10px">📊 CSV</button><button class="btn btn-sm" onclick="_clearAllHistory()" style="background:rgba(239,68,68,0.1);color:#ef4444;font-size:10px">🗑️ ลบทั้งหมด</button></div>' : ''}
      </div>
      <div style="max-height:450px;overflow-y:auto">
        ${history.length ? history.map((h, i) => `
          <div style="background:var(--bg-input);border-radius:12px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <div style="display:flex;align-items:center;gap:6px">
                <span style="font-size:20px">${h.icon}</span>
                <div>
                  <div style="font-weight:700;font-size:12px">${h.agentName}</div>
                  <div style="font-size:9px;color:var(--text-muted)">${h.provider} · ${new Date(h.timestamp).toLocaleString('th-TH')}</div>
                </div>
              </div>
              <div style="display:flex;gap:4px">
                <button class="btn btn-sm" onclick="navigator.clipboard.writeText(${JSON.stringify(h.content).replace(/'/g,"\\'")});showToast('📋 คัดลอกแล้ว!','success')" style="font-size:9px;padding:2px 8px">📋</button>
                <button class="btn btn-sm" onclick="aiContentRemix(${i})" style="font-size:9px;padding:2px 8px;color:#6366f1" title="Remix">🔄</button>
                <button class="btn btn-sm" onclick="_deleteHistoryItem(${i})" style="font-size:9px;padding:2px 8px;color:#ef4444">🗑️</button>
              </div>
            </div>
            <div style="font-size:11px;line-height:1.5;color:var(--text-muted);max-height:60px;overflow:hidden;white-space:pre-wrap">${(h.content||'').substring(0,150)}${(h.content||'').length > 150 ? '...' : ''}</div>
          </div>
        `).join('') : '<div style="text-align:center;padding:40px;color:var(--text-muted)"><div style="font-size:48px;margin-bottom:8px">📭</div><p>ยังไม่มีประวัติ — ลองใช้ AI สร้างคอนเทนต์ก่อน!</p></div>'}
      </div>
    </div>
  `);
}

function _exportHistory() {
  const history = _getContentHistory();
  if (!history.length) return showToast('ยังไม่มีประวัติ', 'warning');
  let txt = '===== Content History Export =====\n';
  txt += 'Exported: ' + new Date().toLocaleString('th-TH') + '\n\n';
  history.forEach((h, i) => {
    txt += `--- #${i+1} ${h.agentName} (${h.provider}) ---\n`;
    txt += `Date: ${new Date(h.timestamp).toLocaleString('th-TH')}\n`;
    txt += h.content + '\n\n';
  });
  const blob = new Blob([txt], {type:'text/plain;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `content-history-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  showToast('📥 Export เสร็จแล้ว!', 'success');
}

function _deleteHistoryItem(index) {
  const history = _getContentHistory();
  if (index >= 0 && index < history.length) {
    history.splice(index, 1);
    localStorage.setItem('cs-content-history', JSON.stringify(history));
    showToast('🗑️ ลบแล้ว!', 'success');
    showContentHistory();
  }
}

function _clearAllHistory() {
  if (!confirm('ลบประวัติทั้งหมด? (ย้อนกลับไม่ได้)')) return;
  localStorage.removeItem('cs-content-history');
  showToast('🗑️ ลบประวัติทั้งหมดแล้ว!', 'success');
  showContentHistory();
}

// ===== 🏆 Competitor Analysis AI =====
async function aiCompetitorAnalysis() {
  const topic = _getTopicInput();
  _showAILoading('🏆', 'Competitor Analysis', 'กำลังวิเคราะห์คู่แข่ง...');
  try {
    const result = await _callAIWithTimeout(
      `คุณคือ Market Analyst ผู้เชี่ยวชาญด้านการวิเคราะห์การแข่งขัน
ตอบเป็นภาษาไทย วิเคราะห์คู่แข่งในหัวข้อ/อุตสาหกรรมที่ให้มา:

## 🏆 Competitor Analysis Report

### 📊 ภาพรวมตลาด
- ขนาดตลาด + แนวโน้ม
- กลุ่มเป้าหมายหลัก

### 🥇 คู่แข่งหลัก 3-5 ราย
แต่ละรายวิเคราะห์:
- ชื่อ + จุดแข็ง + จุดอ่อน
- กลยุทธ์คอนเทนต์
- Platform หลักที่ใช้
- ความถี่ในการโพสต์

### 📈 SWOT Analysis (ของเรา)
- Strengths / Weaknesses / Opportunities / Threats

### 💡 แผนเอาชนะคู่แข่ง
- 5 กลยุทธ์ที่ควรทำทันที
- Content gaps ที่คู่แข่งยังไม่ทำ
- Unique value proposition ที่ควรเน้น

### 📅 Action Plan 7 วัน
- ทำอะไรก่อน-หลัง เพื่อแซงคู่แข่ง`,
      `วิเคราะห์คู่แข่งในหัวข้อ/อุตสาหกรรม: ${topic}`,
      { name: 'Market Analyst', department: 'Strategy' }
    );
    _showAIResult('🏆', 'Competitor Analysis', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// ===== 📊 CSV Export =====
function _exportHistoryCSV() {
  const history = _getContentHistory();
  if (!history.length) return showToast('ยังไม่มีประวัติ', 'warning');
  const escapeCSV = (str) => `"${(str||'').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
  let csv = 'No,Agent,Provider,Date,Content\n';
  history.forEach((h, i) => {
    csv += `${i+1},${escapeCSV(h.agentName)},${escapeCSV(h.provider)},${escapeCSV(new Date(h.timestamp).toLocaleString('th-TH'))},${escapeCSV(h.content)}\n`;
  });
  const blob = new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `content-history-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast('📊 Export CSV เสร็จ!', 'success');
}

// ===== 📋 Content Planner AI (7 Days) =====
async function aiContentPlanner() {
  const topic = _getTopicInput();
  _showAILoading('📋', 'Content Planner', 'กำลังวางแผน 7 วัน...');
  try {
    const result = await _callAIWithTimeout(
      `คุณคือ Content Planner ผู้เชี่ยวชาญด้านการวางแผนคอนเทนต์
ตอบเป็นภาษาไทย วางแผนคอนเทนต์ 7 วัน:

แต่ละวันต้องมี:
- ชื่อคอนเทนต์
- Platform (เลือกจาก: facebook, instagram, tiktok, x, youtube)
- ประเภท (เลือกจาก: post, video, reel, carousel, live, story)
- เวลาโพสต์ที่ดีที่สุด
- เหตุผลสั้นๆ

ตอบเป็น JSON array format เท่านั้น:
[{"day":1,"title":"ชื่อ","platform":"facebook","type":"post","reason":"เหตุผล"},...]

ห้ามตอบอย่างอื่นนอกจาก JSON array ห่อ JSON ด้วย [ ] ตัวเดียวเท่านั้น`,
      `วางแผนคอนเทนต์ 7 วัน สำหรับหัวข้อ: ${topic}`,
      { name: 'Content Planner', department: 'Strategy' }
    );
    const responseText = result.response;
    // Try to extract JSON array from AI response
    let plan = null;
    try {
      const jsonMatch = responseText.match(/\[\s*\{[\s\S]*?\}\s*\]/)
      if (jsonMatch) plan = JSON.parse(jsonMatch[0]);
    } catch(e) { console.log('Plan JSON parse failed', e); }

    if (plan && Array.isArray(plan) && plan.length > 0) {
      // Auto-add to calendar
      const now = new Date();
      const posts = _getScheduledPosts();
      let added = 0;
      plan.forEach(p => {
        const targetDay = now.getDate() + (p.day || 1);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        if (targetDay <= daysInMonth) {
          posts.push({
            title: p.title || 'Untitled',
            platform: p.platform || 'facebook',
            type: p.type || 'post',
            day: targetDay,
            month: now.getMonth(),
            year: now.getFullYear(),
            created: Date.now() + added,
            fromPlanner: true
          });
          added++;
        }
      });
      localStorage.setItem('cs-scheduled-posts', JSON.stringify(posts));
      // Show result with auto-schedule confirmation
      _showAIResult('📋', 'Content Planner', result.provider?.name || 'AI',
        `✅ เพิ่ม ${added} โพสต์ใน Calendar อัตโนมัติแล้ว!\n\n` +
        plan.map((p,i) => `📅 วันที่ ${now.getDate()+(p.day||1)} | ${p.platform} | ${p.type}\n   📌 ${p.title}\n   💡 ${p.reason || ''}`).join('\n\n')
      );
      showToast(`📋 เพิ่ม ${added} โพสต์ใน Calendar!`, 'success');
    } else {
      // Couldn't parse JSON, just show raw result
      _showAIResult('📋', 'Content Planner', result.provider?.name || 'AI', responseText);
    }
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// ===== 🔄 Content Remix =====
async function aiContentRemix(historyIndex) {
  const history = _getContentHistory();
  if (historyIndex < 0 || historyIndex >= history.length) return;
  const original = history[historyIndex];
  const platforms = ['Facebook', 'Instagram', 'TikTok', 'X/Twitter', 'YouTube'];
  
  _showAILoading('🔄', 'Content Remix', 'กำลัง Remix...');
  try {
    const result = await _callAIWithTimeout(
      `คุณคือ Content Remix Specialist ผู้เชี่ยวชาญด้านการปรับคอนเทนต์ให้เหมาะกับแต่ละแพลตฟอร์ม
ตอบเป็นภาษาไทย
นำคอนเทนต์ต้นฉบับมา Remix ใหม่สำหรับทุก Platform:

แต่ละ Platform ต้อง:
1. **Facebook** — โพสต์ยาว เล่าเรื่อง มี CTA
2. **Instagram** — Caption สั้น + hashtags 15 อัน
3. **TikTok** — Script 15 วินาที + hook แรง
4. **X/Twitter** — Thread 3-5 ข้อความ สั้นๆ กระชับ
5. **YouTube** — Script ยาว + description + tags`,
      `Remix คอนเทนต์นี้:\n\n${original.content.substring(0, 2000)}`,
      { name: 'Content Remixer', department: 'Creative' }
    );
    _showAIResult('🔄', 'Content Remix', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// ===== 💾 Backup & Restore =====
function exportFullBackup() {
  const backup = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try { backup[key] = JSON.parse(localStorage.getItem(key)); } catch { backup[key] = localStorage.getItem(key); }
  }
  const blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `claw-empire-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  showToast('💾 Backup เสร็จ! เก็บไฟล์ไว้ในที่ปลอดภัย', 'success');
}

function importFullBackup() {
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
        if (!confirm(`นำเข้าข้อมูลจาก Backup? (${Object.keys(data).length} keys)\n\nข้อมูลปัจจุบันจะถูกแทนที่!`)) return;
        Object.entries(data).forEach(([key, val]) => {
          localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
        });
        showToast('✅ Restore สำเร็จ! กำลัง reload...', 'success');
        setTimeout(() => location.reload(), 1500);
      } catch (err) {
        showToast('❌ ไฟล์ไม่ถูกต้อง: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ===== 📅 Calendar Scheduling =====
function _getScheduledPosts() {
  try { return JSON.parse(localStorage.getItem('cs-scheduled-posts') || '[]'); } catch { return []; }
}

function _addScheduledPost(day) {
  const title = document.getElementById('schedTitle')?.value?.trim();
  const platform = document.getElementById('schedPlatform')?.value || 'facebook';
  const type = document.getElementById('schedType')?.value || 'post';
  if (!title) { showToast('⚠️ กรุณาใส่ชื่อคอนเทนต์', 'warning'); return; }
  const now = new Date();
  const posts = _getScheduledPosts();
  posts.push({ title, platform, type, day, month: now.getMonth(), year: now.getFullYear(), created: Date.now() });
  localStorage.setItem('cs-scheduled-posts', JSON.stringify(posts));
  showToast(`✅ เพิ่ม "${title}" ในวันที่ ${day} แล้ว!`, 'success');
  showCalendarDay(day);
}

function _deleteScheduledPost(day, itemIdx) {
  const now = new Date();
  const posts = _getScheduledPosts();
  // Find scheduled posts for this day and remove the one at itemIdx
  let matchIdx = -1;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].day === day && posts[i].month === now.getMonth() && posts[i].year === now.getFullYear()) {
      matchIdx++;
      // itemIdx is relative to the day's display (including content items before scheduled)
      // We track by timestamp match instead
    }
  }
  // Simpler: remove posts for this day that match
  const dayPosts = posts.filter(p => p.day === day && p.month === now.getMonth() && p.year === now.getFullYear());
  if (dayPosts.length > 0) {
    const toRemove = dayPosts[0]; // Remove first match for simplicity
    const idx = posts.findIndex(p => p.created === toRemove.created);
    if (idx >= 0) {
      posts.splice(idx, 1);
      localStorage.setItem('cs-scheduled-posts', JSON.stringify(posts));
      showToast(`🗑️ ลบแล้ว!`, 'success');
      showCalendarDay(day);
    }
  }
}

// ===== #️⃣ Hashtag Generator =====
async function aiGenerateHashtags() {
  const topic = _getTopicInput();
  _showAILoading('#️⃣', 'Hashtag Generator', 'กำลังสร้าง Hashtag...');
  try {
    const result = await _callAIWithTimeout(
      `คุณคือ Hashtag Specialist ผู้เชี่ยวชาญด้าน Social Media Hashtag
ตอบเป็นภาษาไทย สร้าง Hashtag แบ่งตาม Platform:

1. Facebook (10 hashtags) — เน้นที่ engagement + niche
2. Instagram (15 hashtags) — ผสม big/medium/small เพื่อ reach สูงสุด
3. TikTok (10 hashtags) — เน้น trending + FYP
4. X/Twitter (5 hashtags) — สั้นกระชับ

แต่ละชุดต้อง:
- แสดง hashtag พร้อมเหตุผลว่าทำไมเลือกอันนี้
- ให้คะแนน Trending Score (1-10) แต่ละอัน
- ให้คำแนะนำว่าอันไหนควรใช้คู่กันเพื่อ boost reach`,
      `สร้าง hashtag สำหรับหัวข้อ: ${topic}`,
      { name: 'Hashtag Generator', department: 'Social Media' }
    );
    _showAIResult('#️⃣', 'Hashtag Generator', result.provider?.name || 'AI', result.response);
  } catch (e) { showModal(`<div style="text-align:center"><div style="font-size:48px">❌</div><p>${e.message}</p></div>`); }
}

// ===== 💯 Content Score =====
async function aiContentScore() {
  // Try to get latest AI content
  const history = _getContentHistory();
  const latestContent = history.length > 0 ? history[0].content : null;
  if (!latestContent) {
    showToast('⚠️ ยังไม่มีคอนเทนต์ — ลองใช้ AI สร้างคอนเทนต์ก่อน แล้วกลับมาให้คะแนน!', 'warning');
    return;
  }
  _showAILoading('💯', 'Content Score', 'กำลังวิเคราะห์คอนเทนต์...');
  try {
    const result = await _callAIWithTimeout(
      `คุณคือ Content Quality Analyst ผู้เชี่ยวชาญด้านการประเมินคุณภาพคอนเทนต์
ตอบเป็นภาษาไทย วิเคราะห์คอนเทนต์ต่อไปนี้ ให้คะแนน:

## 🎯 Content Score: XX/100

แบ่งคะแนนย่อย 5 ด้าน:
1. 🎣 Hook Power (X/20) — พาดหัวดึงดูดแค่ไหน?
2. 📝 Readability (X/20) — อ่านง่ายแค่ไหน?
3. 🎯 Value (X/20) — ให้คุณค่าแค่ไหน?
4. 📱 Platform Fit (X/20) — เหมาะกับ platform ไหน?
5. 💡 CTA Strength (X/20) — กระตุ้นให้ทำอะไรได้?

## ✅ จุดแข็ง (3 ข้อ)
## ⚠️ ควรปรับ (3 ข้อ)
## 💡 เวอร์ชันปรับปรุง (เขียนใหม่ให้สั้นๆ)`,
      `วิเคราะห์คอนเทนต์นี้:\n\n${latestContent.substring(0, 2000)}`,
      { name: 'Content Analyst', department: 'Quality' }
    );
    _showAIResult('💯', 'Content Score', result.provider?.name || 'AI', result.response);
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
