// ===== 👔 CEO Dashboard — Command Center =====
function renderDashboard() {
  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  const history = JSON.parse(localStorage.getItem('cs-content-history') || '[]');
  const scheduled = JSON.parse(localStorage.getItem('cs-scheduled-posts') || '[]');
  const ceoSettings = JSON.parse(localStorage.getItem('ceo-settings') || '{}');
  const ceoName = ceoSettings.ceoName || 'CEO';
  const isFirstTime = !localStorage.getItem('ceo-welcomed');

  const activeAgents = agents.filter(a => a.status === 'working').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const todayPosts = history.filter(h => {
    const d = new Date(h.timestamp);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const tabEl = document.getElementById('tab-dashboard');
  tabEl.innerHTML = `
    <!-- Welcome Guide (first time) -->
    ${isFirstTime ? `
    <div id="ceoWelcomeGuide" style="background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(239,68,68,0.06));border:1px solid rgba(245,158,11,0.2);border-radius:16px;padding:24px;margin-bottom:24px;position:relative">
      <button onclick="dismissWelcome()" style="position:absolute;top:12px;right:12px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px">✕</button>
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:48px">👔</div>
        <h2 style="font-size:20px;font-weight:800;margin:8px 0 0;background:linear-gradient(135deg,#f59e0b,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">ยินดีต้อนรับสู่ CEO Mode</h2>
        <p style="color:var(--text-muted);font-size:12px;margin-top:4px">ระบบ AI ที่ทำงานแทนคุณ — แค่สั่ง ได้ผลลัพธ์</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
        <div style="background:var(--bg-card);border-radius:12px;padding:16px;text-align:center">
          <div style="font-size:32px;margin-bottom:8px">1️⃣</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:4px">สั่งงาน</div>
          <div style="color:var(--text-muted);font-size:11px">กด "👔 CEO Mode" หรือ พิมพ์ใน Chat</div>
        </div>
        <div style="background:var(--bg-card);border-radius:12px;padding:16px;text-align:center">
          <div style="font-size:32px;margin-bottom:8px">2️⃣</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:4px">AI ทำงาน</div>
          <div style="color:var(--text-muted);font-size:11px">AI วิเคราะห์ + สร้างคอนเทนต์ 4 Platform</div>
        </div>
        <div style="background:var(--bg-card);border-radius:12px;padding:16px;text-align:center">
          <div style="font-size:32px;margin-bottom:8px">3️⃣</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:4px">ได้ผลลัพธ์</div>
          <div style="color:var(--text-muted);font-size:11px">Copy / Save / Schedule ทันที</div>
        </div>
      </div>
      <div style="text-align:center;margin-top:16px">
        <button class="btn btn-primary" onclick="dismissWelcome();switchTab('chat')" style="background:linear-gradient(135deg,#f59e0b,#ef4444);font-weight:700;padding:10px 32px">
          🚀 เริ่มใช้งาน CEO Mode
        </button>
      </div>
    </div>
    ` : ''}

    <!-- Header -->
    <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:4px">
          👔 สวัสดี ${ceoName}
        </h2>
        <p style="color:var(--text-muted);font-size:13px">
          ${_getCEOGreeting()} · <span style="color:var(--accent)">${new Date().toLocaleDateString('th-TH', {weekday:'long', day:'numeric', month:'long'})}</span>
        </p>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-sm" onclick="switchTab('chat');setTimeout(()=>startCEOMode(),500)" style="background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;font-weight:700;font-size:12px;padding:8px 16px">
          👔 CEO Mode
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:24px">
      <div style="background:var(--bg-card);border-radius:12px;padding:16px;border:1px solid var(--border)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:24px">📝</span>
          <span style="font-size:10px;color:#22c55e;font-weight:600">วันนี้</span>
        </div>
        <div style="font-size:28px;font-weight:800;color:var(--text-primary)">${todayPosts}</div>
        <div style="font-size:11px;color:var(--text-muted)">คอนเทนต์สร้างแล้ว</div>
      </div>
      <div style="background:var(--bg-card);border-radius:12px;padding:16px;border:1px solid var(--border)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:24px">📅</span>
          <span style="font-size:10px;color:#6366f1;font-weight:600">รอโพสต์</span>
        </div>
        <div style="font-size:28px;font-weight:800;color:var(--text-primary)">${scheduled.length}</div>
        <div style="font-size:11px;color:var(--text-muted)">ตั้งเวลาแล้ว</div>
      </div>
      <div style="background:var(--bg-card);border-radius:12px;padding:16px;border:1px solid var(--border)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:24px">🤖</span>
          <span style="font-size:10px;color:#f59e0b;font-weight:600">${activeAgents} Active</span>
        </div>
        <div style="font-size:28px;font-weight:800;color:var(--text-primary)">${agents.length}</div>
        <div style="font-size:11px;color:var(--text-muted)">AI Agents</div>
      </div>
      <div style="background:var(--bg-card);border-radius:12px;padding:16px;border:1px solid var(--border)">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:24px">✅</span>
          <span style="font-size:10px;color:#10b981;font-weight:600">${completedTasks}/${tasks.length}</span>
        </div>
        <div style="font-size:28px;font-weight:800;color:var(--text-primary)">${history.length}</div>
        <div style="font-size:11px;color:var(--text-muted)">ผลงานทั้งหมด</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div style="margin-bottom:24px">
      <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;color:var(--text-primary)">⚡ สั่งงานด่วน</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px">
        <button onclick="switchTab('chat');setTimeout(()=>startCEOMode(),500)" class="btn" style="background:linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.08));border:1px solid rgba(245,158,11,0.2);padding:16px;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
          <div style="font-size:28px;margin-bottom:6px">👔</div>
          <div style="font-size:12px;font-weight:700;color:var(--text-primary)">CEO Mode</div>
          <div style="font-size:9px;color:var(--text-muted);margin-top:2px">สั่งงาน AI ครบจบ</div>
        </button>
        <button onclick="switchTab('chat')" class="btn" style="background:var(--bg-card);border:1px solid var(--border);padding:16px;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
          <div style="font-size:28px;margin-bottom:6px">💬</div>
          <div style="font-size:12px;font-weight:700;color:var(--text-primary)">CEO Chat</div>
          <div style="font-size:9px;color:var(--text-muted);margin-top:2px">แชทกับ AI Agent</div>
        </button>
        <button onclick="_quickCEOContent('โพสต์โปรโมทสินค้าใหม่')" class="btn" style="background:var(--bg-card);border:1px solid var(--border);padding:16px;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
          <div style="font-size:28px;margin-bottom:6px">📝</div>
          <div style="font-size:12px;font-weight:700;color:var(--text-primary)">สร้าง Post</div>
          <div style="font-size:9px;color:var(--text-muted);margin-top:2px">AI สร้างโพสต์ทันที</div>
        </button>
        <button onclick="_quickCEOContent('วิเคราะห์คู่แข่งและแนะนำกลยุทธ์')" class="btn" style="background:var(--bg-card);border:1px solid var(--border);padding:16px;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
          <div style="font-size:28px;margin-bottom:6px">🏆</div>
          <div style="font-size:12px;font-weight:700;color:var(--text-primary)">วิเคราะห์คู่แข่ง</div>
          <div style="font-size:9px;color:var(--text-muted);margin-top:2px">AI คิดกลยุทธ์ให้</div>
        </button>
      </div>
    </div>

    <!-- CEO Activity Feed + Content History -->
    <div style="display:grid;grid-template-columns:${history.length > 0 ? '1fr 1fr' : '1fr'};gap:16px">
      <!-- Activity Feed -->
      <div style="background:var(--bg-card);border-radius:12px;padding:16px;border:1px solid var(--border)">
        <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px">
          🔔 แจ้งเตือน / กิจกรรมล่าสุด
        </h3>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto">
          ${_buildActivityFeed(history, scheduled, agents)}
        </div>
      </div>

      <!-- Recent Content History -->
      ${history.length > 0 ? `
      <div style="background:var(--bg-card);border-radius:12px;padding:16px;border:1px solid var(--border)">
        <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:6px">
          📋 คอนเทนต์ล่าสุด
          <span style="font-size:10px;color:var(--text-muted);font-weight:400">(${history.length} รายการ)</span>
        </h3>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto">
          ${history.slice(0, 8).map(h => `
            <div style="padding:10px;background:var(--bg-input);border-radius:8px;cursor:pointer;transition:all 0.2s" onmouseover="this.style.borderLeft='3px solid var(--accent)'" onmouseout="this.style.borderLeft=''" onclick="showModal('<div style=\\'max-width:600px;white-space:pre-wrap;font-size:12px;max-height:500px;overflow-y:auto\\'>${h.content?.substring(0, 500).replace(/'/g,'').replace(/\n/g,'\\n')}</div>')">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <span style="font-size:11px;font-weight:600">${h.icon || '📝'} ${h.agentName || 'AI'}</span>
                <span style="font-size:9px;color:var(--text-muted)">${_timeAgo(h.timestamp)}</span>
              </div>
              <div style="font-size:11px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${(h.content || '').substring(0, 60)}...</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>

    <!-- How-to Section -->
    <div style="margin-top:24px;background:var(--bg-card);border-radius:12px;padding:16px;border:1px solid var(--border)">
      <h3 style="font-size:14px;font-weight:700;margin-bottom:12px">💡 วิธีใช้งาน CEO System</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px">
        <div style="padding:12px;background:var(--bg-input);border-radius:8px">
          <div style="font-weight:600;font-size:12px;margin-bottom:6px">👔 CEO Mode — สั่งงานครบจบ</div>
          <div style="font-size:11px;color:var(--text-muted);line-height:1.6">
            1. กด "👔 CEO Mode" ที่ Dashboard หรือ Chat<br>
            2. ใส่หัวข้อ / แนบรูปสินค้า<br>
            3. เลือก Platform (FB, IG, TK, YT)<br>
            4. กด "สั่งการ" → รอ 30-60 วิ<br>
            5. ได้คอนเทนต์ทุก Platform!
          </div>
        </div>
        <div style="padding:12px;background:var(--bg-input);border-radius:8px">
          <div style="font-weight:600;font-size:12px;margin-bottom:6px">💬 CEO Chat — แชทกับ AI</div>
          <div style="font-size:11px;color:var(--text-muted);line-height:1.6">
            1. เลือก Agent ที่ต้องการแชท<br>
            2. พิมพ์คำถามหรือคำสั่ง<br>
            3. แนบรูป 📷 ได้ → AI วิเคราะห์<br>
            4. ตอบเป็นภาษาไทย<br>
            5. สั่ง $ command ได้เลย
          </div>
        </div>
        <div style="padding:12px;background:var(--bg-input);border-radius:8px">
          <div style="font-weight:600;font-size:12px;margin-bottom:6px">⚙️ Settings — ตั้งค่าระบบ</div>
          <div style="font-size:11px;color:var(--text-muted);line-height:1.6">
            1. ตั้ง API Key ใน Settings<br>
            2. เลือก Agent ที่เป็น CEO<br>
            3. เลือก Platform เริ่มต้น<br>
            4. ตั้งชื่อ CEO ของคุณ<br>
            5. Backup / Restore ข้อมูล
          </div>
        </div>
      </div>
    </div>
  `;
}

function _getCEOGreeting() {
  const h = new Date().getHours();
  if (h < 6) return '🌙 ยังไม่นอนเหรอ ท่าน CEO?';
  if (h < 12) return '☀️ สวัสดีตอนเช้า';
  if (h < 17) return '🌤️ สวัสดีตอนบ่าย';
  if (h < 21) return '🌆 สวัสดีตอนเย็น';
  return '🌙 สวัสดีตอนดึก';
}

function _timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'เมื่อกี้';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชม.ที่แล้ว`;
  const days = Math.floor(hrs / 24);
  return `${days} วันที่แล้ว`;
}

function _buildActivityFeed(history, scheduled, agents) {
  const items = [];

  // From history (recent content)
  history.slice(0, 3).forEach(h => {
    items.push({
      icon: '✅',
      text: `สร้างคอนเทนต์ <strong>${h.agentName || 'AI'}</strong> สำเร็จ`,
      time: h.timestamp,
      color: '#22c55e'
    });
  });

  // Scheduled posts
  scheduled.slice(0, 3).forEach(s => {
    items.push({
      icon: '📅',
      text: `ตั้งเวลาโพสต์ <strong>${s.title || s.platform}</strong>`,
      time: s.created || Date.now(),
      color: '#6366f1'
    });
  });

  // Active agents
  agents.filter(a => a.status === 'working').forEach(a => {
    items.push({
      icon: '🤖',
      text: `<strong>${a.name}</strong> กำลังทำงาน...`,
      time: Date.now(),
      color: '#f59e0b'
    });
  });

  // Sort by time
  items.sort((a, b) => b.time - a.time);

  if (items.length === 0) {
    return `
      <div style="text-align:center;padding:24px;color:var(--text-muted)">
        <div style="font-size:36px;margin-bottom:8px">📭</div>
        <div style="font-size:12px">ยังไม่มีกิจกรรม</div>
        <div style="font-size:11px;margin-top:4px">เริ่มต้นด้วยการกด <strong>👔 CEO Mode</strong></div>
      </div>
    `;
  }

  return items.slice(0, 8).map(item => `
    <div style="display:flex;gap:10px;align-items:center;padding:8px;background:var(--bg-input);border-radius:8px;border-left:3px solid ${item.color}">
      <span style="font-size:16px">${item.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:11px">${item.text}</div>
        <div style="font-size:9px;color:var(--text-muted)">${_timeAgo(item.time)}</div>
      </div>
    </div>
  `).join('');
}

function dismissWelcome() {
  localStorage.setItem('ceo-welcomed', 'true');
  const el = document.getElementById('ceoWelcomeGuide');
  if (el) { el.style.transition = 'all 0.3s'; el.style.opacity = '0'; el.style.maxHeight = '0'; setTimeout(() => el.remove(), 300); }
}

function _quickCEOContent(topic) {
  switchTab('chat');
  setTimeout(() => {
    startCEOMode();
    setTimeout(() => {
      const input = document.getElementById('ceoModeInput');
      if (input) input.value = topic;
    }, 300);
  }, 500);
}

// ===== Keep helper functions from old dashboard =====
function renderMiniChart(data, color) {
  const max = Math.max(...data);
  const w = 60, h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(' ');
  return `<svg width="${w}" height="${h}" style="opacity:0.6"><polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5"/></svg>`;
}

function exportDashboardCSV() {
  const history = JSON.parse(localStorage.getItem('cs-content-history') || '[]');
  let csv = 'Agent,Provider,Time,Content\n';
  history.forEach(h => {
    csv += `"${h.agentName || ''}","${h.provider || ''}","${new Date(h.timestamp).toLocaleString()}","${(h.content || '').substring(0, 200).replace(/"/g, '""')}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ceo-report-${Date.now()}.csv`;
  a.click();
  showToast('📊 CSV exported!', 'success');
}

function exportDashboardJSON() {
  const data = { history: JSON.parse(localStorage.getItem('cs-content-history') || '[]'), scheduled: JSON.parse(localStorage.getItem('cs-scheduled-posts') || '[]'), agents: Store.get('agents'), tasks: Store.get('tasks') };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ceo-data-${Date.now()}.json`;
  a.click();
  showToast('📋 JSON exported!', 'success');
}
