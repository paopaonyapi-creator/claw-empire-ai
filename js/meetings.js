// ===== Meetings Tab =====
function renderMeetings() {
  const meetings = Store.get('meetings');
  const agents = Store.get('agents');

  document.getElementById('tab-meetings').innerHTML = `
    <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
      <div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:4px">📅 Meetings</h2>
        <p style="color:var(--text-muted);font-size:13px">AI-generated meeting summaries with approval workflow</p>
      </div>
      <button class="btn btn-primary btn-sm" onclick="showScheduleMeetingModal()">+ Schedule Meeting</button>
    </div>

    <div>
      ${meetings.map(meeting => {
        const dept = Store.getDeptInfo(meeting.department);
        const attendeeAgents = (meeting.attendees || []).map(id => Store.getAgent(id)).filter(Boolean);
        return `<div class="meeting-card">
          <div class="meeting-header">
            <div>
              <div class="meeting-title">${meeting.title}</div>
              <div style="display:flex;gap:6px;margin-top:6px">
                ${renderStatusTag(meeting.status)}
                <span class="tag tag-accent">${dept?.icon} ${dept?.name}</span>
                <span class="tag tag-purple">${meeting.type}</span>
                <span class="tag tag-info">${meeting.duration}min</span>
              </div>
            </div>
            <div style="text-align:right">
              <div class="meeting-time">${formatDate(meeting.scheduledAt)}</div>
              <div style="font-size:11px;color:var(--text-muted)">${formatTime(meeting.scheduledAt)}</div>
            </div>
          </div>
          <div style="margin-bottom:12px">
            <div style="font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:6px">ATTENDEES</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              ${attendeeAgents.map(a => `
                <div style="display:flex;align-items:center;gap:4px;padding:4px 8px;background:var(--bg-input);border-radius:12px">
                  ${renderAgentAvatar(a, 20)}
                  <span style="font-size:11px">${a.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ${meeting.summary ? `<div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-xs);margin-bottom:12px">
            <div style="font-size:11px;font-weight:600;color:var(--text-muted);margin-bottom:4px">📝 SUMMARY</div>
            <p style="font-size:12px;line-height:1.5;color:var(--text-secondary)">${meeting.summary}</p>
          </div>` : ''}
          <div style="display:flex;gap:8px;justify-content:flex-end">
            ${!meeting.summary && (meeting.status === 'scheduled' || meeting.status === 'completed') ?
              `<button class="btn btn-sm" style="background:linear-gradient(135deg,rgba(99,102,241,0.2),rgba(168,85,247,0.2));color:var(--accent-light);border:1px solid rgba(99,102,241,0.3)" onclick="generateMeetingSummary('${meeting.id}')">🤖 AI Summary</button>` : ''}
            ${meeting.status === 'completed' && !meeting.approved ?
              `<button class="btn btn-success btn-sm" onclick="approveMeeting('${meeting.id}')">✅ Approve</button>
               <button class="btn btn-danger btn-sm" onclick="rejectMeeting('${meeting.id}')">❌ Reject</button>` : ''}
            ${meeting.approved ? '<span class="tag tag-success">✅ Approved</span>' : ''}
          </div>
        </div>`;
      }).join('')}
      ${!meetings.length ? renderEmptyState('📅', 'No Meetings', 'Schedule your first team meeting') : ''}
    </div>`;
}

function showScheduleMeetingModal() {
  const agents = Store.get('agents');
  showModal('Schedule Meeting', `
    <div class="form-group">
      <label class="form-label">Meeting Title</label>
      <input class="form-input" id="meetingTitle" placeholder="e.g. Sprint Planning" />
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Department</label>
        <select class="form-select" id="meetingDept">
          ${DEPARTMENTS.map(d => `<option value="${d.id}">${d.icon} ${d.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-select" id="meetingType">
          <option>standup</option><option>planning</option><option>review</option>
          <option>retrospective</option><option>strategy</option><option>demo</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Duration (minutes)</label>
      <select class="form-select" id="meetingDuration">
        <option>15</option><option selected>30</option><option>45</option><option>60</option>
      </select>
    </div>
  `, [
    { label: 'Schedule', class: 'btn-primary', onclick: 'createMeeting()' },
    { label: 'Cancel', onclick: 'closeModal()' }
  ]);
}

function createMeeting() {
  const title = document.getElementById('meetingTitle')?.value?.trim();
  if (!title) { showToast('Enter a title', 'error'); return; }
  const agents = Store.get('agents');
  Store.update('meetings', meetings => [...meetings, {
    id: generateId(), title, department: document.getElementById('meetingDept').value,
    type: document.getElementById('meetingType').value,
    attendees: agents.slice(0, 3).map(a => a.id),
    summary: '', status: 'scheduled',
    scheduledAt: Date.now() + 3600000,
    duration: parseInt(document.getElementById('meetingDuration').value),
    approved: false,
  }]);
  closeModal(); renderMeetings();
  showToast(`Meeting "${title}" scheduled! 📅`, 'success');
}

function approveMeeting(id) {
  Store.update('meetings', m => m.map(x => x.id === id ? { ...x, approved: true } : x));
  renderMeetings(); showToast('Meeting approved ✅', 'success');
}

function rejectMeeting(id) {
  Store.update('meetings', m => m.map(x => x.id === id ? { ...x, status: 'rejected' } : x));
  renderMeetings(); showToast('Meeting rejected', 'warning');
}

// ===== 📝 AI Meeting Summary =====
async function generateMeetingSummary(meetingId) {
  const meeting = Store.get('meetings').find(m => m.id === meetingId);
  if (!meeting) { showToast('Meeting not found', 'error'); return; }

  if (typeof getAllAvailableProviders === 'undefined' || !getAllAvailableProviders().length) {
    showToast('❌ ต้องมี API Key อย่างน้อย 1 ตัว', 'error');
    return;
  }

  showToast('🤖 AI กำลังสรุป Meeting...', 'info');

  const agents = Store.get('agents');
  const tasks = Store.get('tasks');
  const attendeeAgents = (meeting.attendees || []).map(id => Store.getAgent(id)).filter(Boolean);
  const dept = Store.getDeptInfo(meeting.department);

  // Gather context about attendees and their tasks
  const attendeeInfo = attendeeAgents.map(a => {
    const agentTasks = tasks.filter(t => t.assignedTo === a.id);
    return `- ${a.name} (${Store.getDeptInfo(a.department)?.name}, Lv${a.level}, ${a.status}): ${agentTasks.length} tasks (${agentTasks.filter(t=>t.status==='done').length} done)`;
  }).join('\n');

  const prompt = `คุณเป็น AI เลขา สำหรับสรุปการประชุม

ข้อมูลการประชุม:
- หัวข้อ: ${meeting.title}
- ประเภท: ${meeting.type}
- แผนก: ${dept?.name || 'N/A'}
- ระยะเวลา: ${meeting.duration} นาที
- ผู้เข้าร่วม:
${attendeeInfo}

สรุปการประชุมเป็นภาษาไทย สั้นๆ กระชับ ประมาณ 5-8 บรรทัด ครอบคลุม:
1. ประเด็นที่หารือ
2. สถานะงานของแต่ละคน
3. Action Items
4. สิ่งที่ต้องติดตาม`;

  try {
    const result = await callAIWithFailover(
      'คุณเป็น AI เลขาสรุปการประชุมมืออาชีพ ตอบเป็นภาษาไทยเท่านั้น',
      prompt, null
    );

    // Save summary to meeting
    Store.update('meetings', meetings => meetings.map(m =>
      m.id === meetingId ? { ...m, summary: result.response, status: 'completed' } : m
    ));

    renderMeetings();
    showToast(`📝 สรุป Meeting "${meeting.title}" เรียบร้อย!`, 'success');
  } catch (err) {
    showToast(`❌ สรุปไม่ได้: ${err.message}`, 'error');
  }
}
