// ===== Kanban Board — Premium Upgrade =====
let draggedCard = null;
let kanbanFilterDept = '';
let kanbanFilterPriority = '';
let kanbanSearchQuery = '';

function renderKanban() {
  const tasks = Store.get('tasks');
  const agents = Store.get('agents');

  const columns = [
    { id: 'backlog', title: 'Backlog', icon: '📋', color: '#94a3b8', gradient: 'linear-gradient(135deg, #475569, #64748b)' },
    { id: 'todo', title: 'To Do', icon: '📌', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' },
    { id: 'in_progress', title: 'In Progress', icon: '🔄', color: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)' },
    { id: 'review', title: 'Review', icon: '👁️', color: '#06b6d4', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)' },
    { id: 'done', title: 'Done', icon: '✅', color: '#22c55e', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)' },
  ];

  // Stats
  const totalTasks = tasks.length;
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
  const completedToday = tasks.filter(t => t.status === 'done' && t.updatedAt > Date.now() - 86400000).length;
  const overdue = tasks.filter(t => t.dueDate && t.dueDate < Date.now() && t.status !== 'done').length;

  document.getElementById('tab-kanban').innerHTML = `
    <!-- Header -->
    <div class="kb-header">
      <div>
        <h2 class="kb-title">📋 ${t('kanban') || 'Kanban Board'}</h2>
        <p class="kb-subtitle">${t('dragAndDrop') || 'Drag and drop tasks between columns'}</p>
      </div>
      <div class="kb-header-actions">
        <button class="btn btn-sm" onclick="showKanbanStats()">📊 Stats</button>
        <button class="btn btn-sm" onclick="autoAssignTasks()">🤖 Auto-Assign</button>
        <button class="btn btn-primary btn-sm" onclick="showAddTaskModal()">+ ${t('newTask') || 'New Task'}</button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="kb-stats-row">
      <div class="kb-stat"><span class="kb-stat-num">${totalTasks}</span><span class="kb-stat-label">Total</span></div>
      <div class="kb-stat-divider"></div>
      ${columns.map(c => {
        const count = tasks.filter(t => t.status === c.id).length;
        return `<div class="kb-stat">
          <span class="kb-stat-dot" style="background:${c.color}"></span>
          <span class="kb-stat-num">${count}</span>
          <span class="kb-stat-label">${c.title}</span>
        </div>`;
      }).join('')}
      <div class="kb-stat-divider"></div>
      ${highPriority > 0 ? `<div class="kb-stat kb-stat-warn"><span class="kb-stat-num">🔴 ${highPriority}</span><span class="kb-stat-label">High Priority</span></div>` : ''}
      ${overdue > 0 ? `<div class="kb-stat kb-stat-danger"><span class="kb-stat-num">⏰ ${overdue}</span><span class="kb-stat-label">Overdue</span></div>` : ''}
    </div>

    <!-- Filters Bar -->
    <div class="kb-filters">
      <div class="kb-filter-left">
        <div class="kb-search-box">
          <span>🔍</span>
          <input type="text" class="kb-search-input" placeholder="Search tasks..." value="${kanbanSearchQuery}"
            oninput="kanbanSearchQuery=this.value;renderKanban()" />
        </div>
        <select class="form-select kb-filter-select" onchange="kanbanFilterDept=this.value;renderKanban()">
          <option value="">All Departments</option>
          ${DEPARTMENTS.map(d => `<option value="${d.id}" ${kanbanFilterDept===d.id?'selected':''}>${d.icon} ${d.name}</option>`).join('')}
        </select>
        <select class="form-select kb-filter-select" onchange="kanbanFilterPriority=this.value;renderKanban()">
          <option value="">All Priorities</option>
          <option value="high" ${kanbanFilterPriority==='high'?'selected':''}>🔴 High</option>
          <option value="medium" ${kanbanFilterPriority==='medium'?'selected':''}>🟡 Medium</option>
          <option value="low" ${kanbanFilterPriority==='low'?'selected':''}>🟢 Low</option>
        </select>
      </div>
      ${(kanbanFilterDept || kanbanFilterPriority || kanbanSearchQuery) ? `
        <button class="btn btn-sm" onclick="kanbanFilterDept='';kanbanFilterPriority='';kanbanSearchQuery='';renderKanban()">
          ✕ Clear Filters
        </button>` : ''}
    </div>

    <!-- Kanban Columns -->
    <div class="kanban-board">
      ${columns.map(col => {
        let colTasks = tasks.filter(t => t.status === col.id);
        if (kanbanFilterDept) colTasks = colTasks.filter(t => t.department === kanbanFilterDept);
        if (kanbanFilterPriority) colTasks = colTasks.filter(t => t.priority === kanbanFilterPriority);
        if (kanbanSearchQuery) {
          const q = kanbanSearchQuery.toLowerCase();
          colTasks = colTasks.filter(t => t.title.toLowerCase().includes(q) || (t.description||'').toLowerCase().includes(q));
        }

        return `<div class="kanban-column" data-status="${col.id}"
          ondragover="event.preventDefault();this.classList.add('drag-over')"
          ondragleave="this.classList.remove('drag-over')"
          ondrop="handleDrop(event,'${col.id}');this.classList.remove('drag-over')">

          <div class="kanban-column-header">
            <div class="kb-col-title-row">
              <div class="kb-col-dot" style="background:${col.gradient}"></div>
              <span class="kanban-column-title">${col.title}</span>
              <span class="kanban-count">${colTasks.length}</span>
            </div>
            <button class="btn btn-sm btn-icon kb-col-add" onclick="showAddTaskModal('${col.id}')" title="Add task">+</button>
          </div>

          <div class="kanban-cards" data-col="${col.id}">
            ${colTasks.map(task => renderKanbanCard(task, col)).join('')}
            ${colTasks.length === 0 ? `<div class="kb-empty-col">
              <span>📭</span><span>No tasks</span>
            </div>` : ''}
          </div>

          <div class="kb-col-footer">
            <button class="kb-add-card-btn" onclick="showAddTaskModal('${col.id}')">+ Add Card</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function renderKanbanCard(task, col) {
  const agent = task.assignee ? Store.getAgent(task.assignee) : null;
  const dept = Store.getDeptInfo(task.department);
  const isOverdue = task.dueDate && task.dueDate < Date.now() && task.status !== 'done';
  const daysLeft = task.dueDate ? Math.ceil((task.dueDate - Date.now()) / 86400000) : null;

  return `<div class="kanban-card ${isOverdue ? 'overdue' : ''}" draggable="true" data-task-id="${task.id}"
    ondragstart="handleDragStart(event,'${task.id}')" ondragend="handleDragEnd(event)"
    onclick="showTaskDetailModal('${task.id}')">

    <div class="kb-card-top">
      <div class="kb-card-tags">
        ${renderPriorityTag(task.priority)}
        <span class="tag tag-sm" style="background:${dept?.color}20;color:${dept?.color};font-size:9px">${dept?.icon || ''} ${dept?.name || ''}</span>
      </div>
      <button class="kb-card-menu" onclick="event.stopPropagation();showTaskQuickMenu('${task.id}')" title="Quick actions">⋯</button>
    </div>

    <div class="kanban-card-title">${task.title}</div>

    ${task.description ? `<p class="kb-card-desc">${task.description.substring(0, 80)}${task.description.length > 80 ? '...' : ''}</p>` : ''}

    <div class="kanban-card-footer">
      <div class="kb-card-assignee">
        ${agent ? `${renderAgentAvatar(agent, 22)} <span>${agent.name}</span>` : '<span class="kb-unassigned">👤 Unassigned</span>'}
      </div>
      <div class="kb-card-meta">
        ${isOverdue ? `<span class="kb-overdue-badge">⏰ Overdue</span>` :
          daysLeft !== null && daysLeft <= 3 && daysLeft >= 0 ? `<span class="kb-due-soon">${daysLeft}d left</span>` :
          `<span class="kb-time-ago">${timeAgo(task.updatedAt)}</span>`}
      </div>
    </div>
  </div>`;
}

function handleDragStart(e, taskId) {
  draggedCard = taskId;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  draggedCard = null;
}

function handleDrop(e, newStatus) {
  e.preventDefault();
  if (!draggedCard) return;
  const oldTask = Store.get('tasks').find(t => t.id === draggedCard);
  Store.update('tasks', tasks => tasks.map(t =>
    t.id === draggedCard ? { ...t, status: newStatus, updatedAt: Date.now() } : t
  ));
  // If moved to done, award XP to agent
  if (newStatus === 'done' && oldTask?.assignee) {
    Store.update('agents', agents => agents.map(a =>
      a.id === oldTask.assignee ? { ...a, tasksCompleted: (a.tasksCompleted || 0) + 1, xp: Math.min(a.xp + 25, a.xpMax) } : a
    ));
  }
  renderKanban();
  const statusLabels = { backlog: 'Backlog', todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Done ✅' };
  showToast(`Task → ${statusLabels[newStatus] || newStatus}`, 'success');
}

function showTaskQuickMenu(taskId) {
  const task = Store.get('tasks').find(t => t.id === taskId);
  if (!task) return;
  const statuses = ['backlog', 'todo', 'in_progress', 'review', 'done'];
  const statusLabels = { backlog: '📋 Backlog', todo: '📌 To Do', in_progress: '🔄 In Progress', review: '👁️ Review', done: '✅ Done' };

  showModal(`⚡ Quick Actions: ${task.title}`, `
    <div style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;margin-bottom:8px">Move to:</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${statuses.filter(s => s !== task.status).map(s =>
          `<button class="btn btn-sm" onclick="quickMoveTask('${taskId}','${s}')">${statusLabels[s]}</button>`
        ).join('')}
      </div>
    </div>
    <div style="margin-bottom:16px">
      <div style="font-size:12px;font-weight:700;margin-bottom:8px">Priority:</div>
      <div style="display:flex;gap:6px">
        ${['low', 'medium', 'high'].map(p =>
          `<button class="btn btn-sm ${task.priority === p ? 'btn-primary' : ''}" onclick="quickSetPriority('${taskId}','${p}')">
            ${{low:'🟢 Low', medium:'🟡 Medium', high:'🔴 High'}[p]}
          </button>`
        ).join('')}
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-sm" style="flex:1" onclick="closeModal();showTaskDetailModal('${taskId}')">📝 Edit Details</button>
      <button class="btn btn-sm" style="color:var(--danger)" onclick="deleteTask('${taskId}')">🗑️ Delete</button>
    </div>
  `, [{ label: 'Close', onclick: 'closeModal()' }]);
}

function quickMoveTask(taskId, status) {
  const task = Store.get('tasks').find(t => t.id === taskId);
  Store.update('tasks', tasks => tasks.map(t =>
    t.id === taskId ? { ...t, status, updatedAt: Date.now() } : t
  ));
  if (status === 'done' && task?.assignee) {
    Store.update('agents', agents => agents.map(a =>
      a.id === task.assignee ? { ...a, tasksCompleted: (a.tasksCompleted || 0) + 1, xp: Math.min(a.xp + 25, a.xpMax) } : a
    ));
  }
  closeModal(); renderKanban();
  showToast(`Task moved to ${status.replace('_', ' ')}`, 'success');
}

function quickSetPriority(taskId, priority) {
  Store.update('tasks', tasks => tasks.map(t =>
    t.id === taskId ? { ...t, priority, updatedAt: Date.now() } : t
  ));
  closeModal(); renderKanban();
  showToast(`Priority → ${priority}`, 'success');
}

async function autoAssignTasks() {
  const agents = Store.get('agents').filter(a => a.status !== 'offline');
  const tasks = Store.get('tasks');
  const unassigned = tasks.filter(t => !t.assignee && t.status !== 'done');

  if (unassigned.length === 0) {
    showToast('✅ ทุก task ถูก assign แล้ว!', 'info');
    return;
  }

  // Try AI-powered assignment
  const providers = typeof getAllAvailableProviders === 'function' ? getAllAvailableProviders() : [];
  if (providers.length > 0 && typeof callAIWithFailover === 'function') {
    showToast('🤖 AI กำลังวิเคราะห์ task assignments...', 'info');

    const taskList = unassigned.map(t => `- "${t.title}" (dept:${t.department}, priority:${t.priority})`).join('\n');
    const agentList = agents.map(a => `- ${a.name} (dept:${a.department}, level:${a.level}, workload:${tasks.filter(tt=>tt.assignee===a.id&&tt.status!=='done').length})`).join('\n');

    try {
      const result = await callAIWithFailover(
        'คุณเป็น Project Manager ช่วย assign task ให้เหมาะสม ตอบเป็น JSON array เท่านั้น',
        `จับคู่ task กับ agent ที่เหมาะที่สุด โดยพิจารณาจาก department, level, workload\n\nTasks ที่ยังไม่ assign:\n${taskList}\n\nAgents:\n${agentList}\n\nตอบเป็น JSON array แบบนี้เท่านั้น ไม่ต้องอธิบาย:\n[{"task":"ชื่อ task","agent":"ชื่อ agent","reason":"เหตุผลสั้นๆ"}]`,
        null
      );

      // Try to parse AI suggestions
      const jsonMatch = result.response.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        let assigned = 0;
        Store.update('tasks', allTasks => allTasks.map(t => {
          if (t.assignee || t.status === 'done') return t;
          const match = suggestions.find(s => t.title.includes(s.task) || s.task.includes(t.title));
          if (match) {
            const agent = agents.find(a => a.name.toLowerCase() === match.agent.toLowerCase());
            if (agent) { assigned++; return { ...t, assignee: agent.id, updatedAt: Date.now() }; }
          }
          return t;
        }));
        renderKanban();
        showToast(`🧠 AI assigned ${assigned} tasks! (${result.provider.icon} ${result.provider.name})`, 'success');
        return;
      }
    } catch (err) {
      console.log('AI auto-assign failed, falling back:', err.message);
    }
  }

  // Fallback: simple round-robin
  let assigned = 0;
  Store.update('tasks', tasks => tasks.map(t => {
    if (t.assignee || t.status === 'done') return t;
    const deptAgents = agents.filter(a => a.department === t.department);
    const pick = deptAgents.length ? deptAgents[assigned % deptAgents.length] : agents[assigned % agents.length];
    if (pick) { assigned++; return { ...t, assignee: pick.id, updatedAt: Date.now() }; }
    return t;
  }));
  renderKanban();
  showToast(`🤖 Auto-assigned ${assigned} tasks!`, 'success');
}

function showKanbanStats() {
  const tasks = Store.get('tasks');
  const columns = ['backlog', 'todo', 'in_progress', 'review', 'done'];
  const colLabels = { backlog: '📋 Backlog', todo: '📌 To Do', in_progress: '🔄 In Progress', review: '👁️ Review', done: '✅ Done' };
  const totalDone = tasks.filter(t => t.status === 'done').length;
  const totalActive = tasks.filter(t => t.status !== 'done' && t.status !== 'backlog').length;
  const highPri = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length;
  const avgAge = tasks.length ? Math.round(tasks.reduce((s, t) => s + (Date.now() - t.createdAt), 0) / tasks.length / 86400000) : 0;

  showModal('📊 Kanban Statistics', `
    <div class="grid-4" style="margin-bottom:20px">
      <div style="text-align:center;padding:12px;background:var(--bg-input);border-radius:var(--radius-xs)">
        <div style="font-size:24px;font-weight:800">${tasks.length}</div>
        <div style="font-size:10px;color:var(--text-muted)">Total Tasks</div>
      </div>
      <div style="text-align:center;padding:12px;background:var(--bg-input);border-radius:var(--radius-xs)">
        <div style="font-size:24px;font-weight:800;color:var(--success)">${totalDone}</div>
        <div style="font-size:10px;color:var(--text-muted)">Completed</div>
      </div>
      <div style="text-align:center;padding:12px;background:var(--bg-input);border-radius:var(--radius-xs)">
        <div style="font-size:24px;font-weight:800;color:var(--warning)">${totalActive}</div>
        <div style="font-size:10px;color:var(--text-muted)">Active</div>
      </div>
      <div style="text-align:center;padding:12px;background:var(--bg-input);border-radius:var(--radius-xs)">
        <div style="font-size:24px;font-weight:800">${avgAge}d</div>
        <div style="font-size:10px;color:var(--text-muted)">Avg Age</div>
      </div>
    </div>
    <div style="font-size:13px;font-weight:700;margin-bottom:10px">Column Breakdown</div>
    ${columns.map(c => {
      const count = tasks.filter(t => t.status === c).length;
      const pct = tasks.length ? Math.round(count / tasks.length * 100) : 0;
      return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="width:120px;font-size:12px">${colLabels[c]}</span>
        <div style="flex:1;height:6px;background:var(--bg-input);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:3px"></div>
        </div>
        <span style="font-size:11px;font-weight:700;width:40px;text-align:right">${count}</span>
      </div>`;
    }).join('')}
    ${highPri > 0 ? `<div style="margin-top:12px;padding:10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:var(--radius-xs)">
      <span style="font-size:12px;color:var(--danger);font-weight:600">⚠️ ${highPri} high-priority tasks still open</span>
    </div>` : ''}
  `, [{ label: 'Close', onclick: 'closeModal()' }]);
}

function showAddTaskModal(status = 'todo') {
  const agents = Store.get('agents');
  showModal('📌 Create New Task', `
    <div class="form-group">
      <label class="form-label">Task Title</label>
      <input class="form-input" id="newTaskTitle" placeholder="e.g. Implement login page, Fix API bug..." />
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-textarea" id="newTaskDesc" rows="3" placeholder="What needs to be done..."></textarea>
    </div>
    <div class="grid-3">
      <div class="form-group">
        <label class="form-label">Department</label>
        <select class="form-select" id="newTaskDept">
          ${DEPARTMENTS.map(d => `<option value="${d.id}">${d.icon} ${d.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="newTaskPriority">
          <option value="low">🟢 Low</option>
          <option value="medium" selected>🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Due Date</label>
        <input type="date" class="form-input" id="newTaskDueDate" value="${new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]}" />
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Assign To</label>
      <select class="form-select" id="newTaskAssignee">
        <option value="">👤 Unassigned</option>
        ${agents.map(a => `<option value="${a.id}">${a.emoji} ${a.name} — ${Store.getDeptInfo(a.department)?.name || ''}</option>`).join('')}
      </select>
    </div>
  `, [
    { label: '📌 Create Task', class: 'btn-primary', onclick: `createTask('${status}')` },
    { label: 'Cancel', onclick: 'closeModal()' }
  ]);
}

function createTask(status) {
  const title = document.getElementById('newTaskTitle')?.value?.trim();
  if (!title) { showToast('Please enter a title', 'error'); return; }
  const dueDateVal = document.getElementById('newTaskDueDate')?.value;
  Store.update('tasks', tasks => [...tasks, {
    id: generateId(), title,
    description: document.getElementById('newTaskDesc')?.value || '',
    department: document.getElementById('newTaskDept').value,
    priority: document.getElementById('newTaskPriority').value,
    status: status,
    assignee: document.getElementById('newTaskAssignee').value || null,
    createdAt: Date.now(), updatedAt: Date.now(),
    dueDate: dueDateVal ? new Date(dueDateVal).getTime() : Date.now() + 86400000 * 7,
    tags: [],
  }]);
  closeModal(); renderKanban();
  showToast(`Task "${title}" created! 📋`, 'success');
}

function showTaskDetailModal(taskId) {
  const task = Store.get('tasks').find(t => t.id === taskId);
  if (!task) return;
  const agent = task.assignee ? Store.getAgent(task.assignee) : null;
  const dept = Store.getDeptInfo(task.department);
  const isOverdue = task.dueDate && task.dueDate < Date.now() && task.status !== 'done';
  const daysLeft = task.dueDate ? Math.ceil((task.dueDate - Date.now()) / 86400000) : null;

  showModal(`📝 ${task.title}`, `
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
      ${renderPriorityTag(task.priority)} ${renderStatusTag(task.status)}
      <span class="tag" style="background:${dept?.color}20;color:${dept?.color}">${dept?.icon} ${dept?.name}</span>
      ${isOverdue ? '<span class="tag" style="background:rgba(239,68,68,0.15);color:var(--danger)">⏰ Overdue</span>' : ''}
    </div>

    <div style="padding:14px;background:var(--bg-input);border-radius:var(--radius-xs);margin-bottom:16px;min-height:60px">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;font-weight:600">📋 Description</div>
      <div style="font-size:13px;line-height:1.7">${task.description || 'No description provided.'}</div>
    </div>

    <div class="grid-3" style="margin-bottom:16px">
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs)">
        <div style="font-size:10px;color:var(--text-muted)">Assigned To</div>
        <div style="font-size:13px;font-weight:600;margin-top:4px">
          ${agent ? `<span style="display:flex;align-items:center;gap:4px">${renderAgentAvatar(agent, 18)} ${agent.name}</span>` : '👤 Unassigned'}
        </div>
      </div>
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs)">
        <div style="font-size:10px;color:var(--text-muted)">Due Date</div>
        <div style="font-size:13px;font-weight:600;margin-top:4px;${isOverdue?'color:var(--danger)':''}">${formatDate(task.dueDate)}
          ${daysLeft !== null ? `<span style="font-size:10px;color:var(--text-muted)"> (${daysLeft > 0 ? daysLeft+'d left' : 'overdue'})</span>` : ''}
        </div>
      </div>
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs)">
        <div style="font-size:10px;color:var(--text-muted)">Created</div>
        <div style="font-size:13px;font-weight:600;margin-top:4px">${timeAgo(task.createdAt)}</div>
      </div>
    </div>

    <div style="font-size:10px;color:var(--text-muted)">Last updated ${timeAgo(task.updatedAt)}</div>
  `, [
    { label: '⚡ Quick Actions', onclick: `closeModal();showTaskQuickMenu('${taskId}')` },
    { label: '🗑️ Delete', class: 'btn-sm', onclick: `deleteTask('${taskId}')` },
    { label: 'Close', onclick: 'closeModal()' }
  ]);
}

function deleteTask(taskId) {
  if (!confirm('Delete this task?')) return;
  Store.update('tasks', tasks => tasks.filter(t => t.id !== taskId));
  closeModal(); renderKanban();
  showToast('Task deleted 🗑️', 'info');
}
