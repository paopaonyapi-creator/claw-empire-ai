// ===== Reports Tab — Premium Upgrade =====
let reportFilter = 'all'; // all, in_progress, completed, review
let reportViewMode = 'cards'; // cards | table

function renderReports() {
  const reports = Store.get('reports');
  const agents = Store.get('agents');

  // Stats
  const total = reports.length;
  const inProgress = reports.filter(r => r.status === 'in_progress').length;
  const completed = reports.filter(r => r.status === 'completed' || r.status === 'done').length;
  const inReview = reports.filter(r => r.status === 'review').length;

  // Filter
  const filteredReports = reportFilter === 'all' ? reports
    : reports.filter(r => {
        if (reportFilter === 'completed') return r.status === 'completed' || r.status === 'done';
        return r.status === reportFilter;
      });

  // Report type config
  const typeConfig = {
    development:          { icon: '⚙️', label: 'Development', color: '#6366f1' },
    report:               { icon: '📊', label: 'Analytics', color: '#3b82f6' },
    web_research_report:  { icon: '🌐', label: 'Web Research', color: '#06b6d4' },
    novel:                { icon: '📖', label: 'Content', color: '#8b5cf6' },
    video_preprod:        { icon: '🎬', label: 'Video', color: '#ec4899' },
    security_audit:       { icon: '🛡️', label: 'Security Audit', color: '#ef4444' },
    performance:          { icon: '⚡', label: 'Performance', color: '#f59e0b' },
    sprint_review:        { icon: '🏃', label: 'Sprint Review', color: '#22c55e' },
  };

  document.getElementById('tab-reports').innerHTML = `
    <!-- Header -->
    <div class="rpt-header">
      <div>
        <h2 class="rpt-title">📄 ${t('reports') || 'Reports'}</h2>
        <p class="rpt-subtitle">${t('aiGeneratedReports') || 'AI-generated reports and deliverables'}</p>
      </div>
      <div class="rpt-header-actions">
        <div class="rpt-view-toggle">
          <button class="rvt-btn ${reportViewMode==='cards'?'active':''}" onclick="reportViewMode='cards';renderReports()">🗂️</button>
          <button class="rvt-btn ${reportViewMode==='table'?'active':''}" onclick="reportViewMode='table';renderReports()">☰</button>
        </div>
        <button class="btn btn-primary btn-sm" onclick="showRequestReportModal()">
          <span style="margin-right:4px">📝</span> ${t('requestReport') || '+ Request Report'}
        </button>
      </div>
    </div>

    <!-- KPI Stats -->
    <div class="rpt-stats-bar">
      <div class="rpt-stat-card" onclick="reportFilter='all';renderReports()">
        <div class="rsc-icon" style="background:rgba(99,102,241,0.1);color:#6366f1">📄</div>
        <div class="rsc-data">
          <div class="rsc-count">${total}</div>
          <div class="rsc-label">Total Reports</div>
        </div>
      </div>
      <div class="rpt-stat-card" onclick="reportFilter='in_progress';renderReports()">
        <div class="rsc-icon" style="background:rgba(59,130,246,0.1);color:#3b82f6">🔄</div>
        <div class="rsc-data">
          <div class="rsc-count">${inProgress}</div>
          <div class="rsc-label">In Progress</div>
        </div>
      </div>
      <div class="rpt-stat-card" onclick="reportFilter='review';renderReports()">
        <div class="rsc-icon" style="background:rgba(245,158,11,0.1);color:#f59e0b">👁️</div>
        <div class="rsc-data">
          <div class="rsc-count">${inReview}</div>
          <div class="rsc-label">In Review</div>
        </div>
      </div>
      <div class="rpt-stat-card" onclick="reportFilter='completed';renderReports()">
        <div class="rsc-icon" style="background:rgba(34,197,94,0.1);color:#22c55e">✅</div>
        <div class="rsc-data">
          <div class="rsc-count">${completed}</div>
          <div class="rsc-label">Completed</div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="rpt-filter-bar">
      <div class="rpt-filters">
        ${[
          { key: 'all', label: 'All Reports', count: total },
          { key: 'in_progress', label: '🔄 In Progress', count: inProgress },
          { key: 'review', label: '👁️ Review', count: inReview },
          { key: 'completed', label: '✅ Completed', count: completed },
        ].map(f => `<button class="rpt-filter-btn ${reportFilter===f.key?'active':''}" onclick="reportFilter='${f.key}';renderReports()">
          ${f.label} <span class="rpt-filter-count">${f.count}</span>
        </button>`).join('')}
      </div>
      <div class="rpt-sort">
        <span style="font-size:11px;color:var(--text-muted)">📅 Most Recent</span>
      </div>
    </div>

    <!-- Report Content -->
    ${filteredReports.length === 0 ? renderReportEmptyState() : ''}
    ${reportViewMode === 'cards' ? renderReportCards(filteredReports, typeConfig) : ''}
    ${reportViewMode === 'table' ? renderReportTable(filteredReports, typeConfig) : ''}
  `;
}

function renderReportCards(reports, typeConfig) {
  return `<div class="rpt-grid">
    ${reports.map(r => {
      const agent = r.agent ? Store.getAgent(r.agent) : null;
      const tc = typeConfig[r.type] || { icon: '📄', label: r.type, color: '#6366f1' };
      const progress = r.status === 'completed' || r.status === 'done' ? 100
        : r.status === 'review' ? 85
        : r.status === 'in_progress' ? Math.floor(Math.random() * 40 + 30) : 10;
      const statusEmoji = { in_progress: '🔄', review: '👁️', completed: '✅', done: '✅', backlog: '📋' };

      return `<div class="rpt-card" onclick="viewReportDetail('${r.id}')">
        <div class="rpt-card-top">
          <div class="rpt-card-type" style="background:${tc.color}15;color:${tc.color};border-color:${tc.color}30">
            ${tc.icon} ${tc.label}
          </div>
          <div class="rpt-card-date">${timeAgo(r.createdAt)}</div>
        </div>

        <h3 class="rpt-card-title">${r.title}</h3>

        <p class="rpt-card-desc">${r.content || 'No description provided.'}</p>

        <div class="rpt-card-progress">
          <div class="rpt-card-progress-bar">
            <div class="rpt-card-progress-fill" style="width:${progress}%;background:${tc.color}"></div>
          </div>
          <span class="rpt-card-progress-label">${progress}%</span>
        </div>

        <div class="rpt-card-footer">
          <div class="rpt-card-agent">
            ${agent ? `${renderAgentAvatar(agent, 22)} <span>${agent.name}</span>` : '<span style="color:var(--text-muted)">Unassigned</span>'}
          </div>
          <div class="rpt-card-status">
            ${statusEmoji[r.status] || '📄'} ${renderStatusTag(r.status)}
          </div>
        </div>

        <div class="rpt-card-actions">
          <button class="btn btn-sm" onclick="event.stopPropagation();viewReportDetail('${r.id}')">👁️ View</button>
          <button class="btn btn-sm" onclick="event.stopPropagation();exportReportPDF('${r.id}')">📥 Export</button>
          <button class="btn btn-sm" onclick="event.stopPropagation();toggleReportStatus('${r.id}')">🔄 Status</button>
          <button class="btn btn-sm" style="color:var(--danger)" onclick="event.stopPropagation();deleteReport('${r.id}')">🗑️</button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderReportTable(reports, typeConfig) {
  return `<div class="rpt-table-wrap">
    <table class="rpt-table">
      <thead>
        <tr>
          <th>Report</th>
          <th>Type</th>
          <th>Status</th>
          <th>Agent</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${reports.map(r => {
          const agent = r.agent ? Store.getAgent(r.agent) : null;
          const tc = typeConfig[r.type] || { icon: '📄', label: r.type, color: '#6366f1' };
          return `<tr class="rpt-table-row" onclick="viewReportDetail('${r.id}')">
            <td>
              <div class="rpt-table-title">${r.title}</div>
              <div class="rpt-table-desc">${(r.content || '').substring(0, 60)}...</div>
            </td>
            <td><span class="rpt-type-badge" style="background:${tc.color}15;color:${tc.color}">${tc.icon} ${tc.label}</span></td>
            <td>${renderStatusTag(r.status)}</td>
            <td>${agent ? `<div class="rpt-table-agent">${renderAgentAvatar(agent, 20)} ${agent.name}</div>` : '<span style="color:var(--text-muted)">—</span>'}</td>
            <td><span style="font-size:12px;color:var(--text-muted)">${formatDate(r.createdAt)}</span></td>
            <td>
              <div class="rpt-table-actions">
                <button class="btn btn-sm" onclick="event.stopPropagation();exportReportPDF('${r.id}')">📥</button>
                <button class="btn btn-sm" style="color:var(--danger)" onclick="event.stopPropagation();deleteReport('${r.id}')">🗑️</button>
              </div>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderReportEmptyState() {
  return `<div class="rpt-empty">
    <div class="rpt-empty-icon">📄</div>
    <h3 class="rpt-empty-title">${reportFilter === 'all' ? 'No Reports Yet' : `No ${reportFilter.replace('_', ' ')} reports`}</h3>
    <p class="rpt-empty-desc">Request your first AI-generated report to get started</p>
    <button class="btn btn-primary" onclick="showRequestReportModal()">📝 Request Report</button>
  </div>`;
}

function viewReportDetail(reportId) {
  const r = Store.get('reports').find(rep => rep.id === reportId);
  if (!r) return;
  const agent = r.agent ? Store.getAgent(r.agent) : null;
  const typeConfig = {
    development: { icon: '⚙️', label: 'Development' },
    report: { icon: '📊', label: 'Analytics' },
    web_research_report: { icon: '🌐', label: 'Web Research' },
    novel: { icon: '📖', label: 'Content' },
    video_preprod: { icon: '🎬', label: 'Video' },
    security_audit: { icon: '🛡️', label: 'Security Audit' },
    performance: { icon: '⚡', label: 'Performance' },
    sprint_review: { icon: '🏃', label: 'Sprint Review' },
  };
  const tc = typeConfig[r.type] || { icon: '📄', label: r.type };

  showModal(`📄 ${r.title}`, `
    <div class="rpt-detail-header">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <span class="tag tag-purple">${tc.icon} ${tc.label}</span>
        ${renderStatusTag(r.status)}
        <span class="tag" style="font-size:10px">📅 ${formatDate(r.createdAt)}</span>
      </div>
      ${agent ? `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        ${renderAgentAvatar(agent, 28)}
        <div>
          <div style="font-size:13px;font-weight:600">${agent.name}</div>
          <div style="font-size:10px;color:var(--text-muted)">${Store.getDeptInfo(agent.department)?.name || ''}</div>
        </div>
      </div>` : ''}
    </div>

    <div style="padding:16px;background:var(--bg-input);border-radius:var(--radius-sm);margin-bottom:16px;min-height:120px">
      <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:var(--text-muted)">📋 Report Content</div>
      <div style="font-size:13px;line-height:1.8;white-space:pre-wrap">${r.content || 'Report generation in progress...\n\nThis report will be populated once the assigned agent completes the analysis.'}</div>
    </div>

    <div class="grid-3" style="margin-bottom:12px">
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:14px;font-weight:800">${r.status === 'completed' || r.status === 'done' ? '100%' : '65%'}</div>
        <div style="font-size:10px;color:var(--text-muted)">Progress</div>
      </div>
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:14px;font-weight:800">${tc.label}</div>
        <div style="font-size:10px;color:var(--text-muted)">Type</div>
      </div>
      <div style="padding:10px;background:var(--bg-input);border-radius:var(--radius-xs);text-align:center">
        <div style="font-size:14px;font-weight:800">${r.status}</div>
        <div style="font-size:10px;color:var(--text-muted)">Status</div>
      </div>
    </div>
  `, [
    { label: '📥 Export PDF', class: 'btn-primary', onclick: `closeModal();exportReportPDF('${r.id}')` },
    { label: '🔄 Change Status', onclick: `closeModal();toggleReportStatus('${r.id}')` },
    { label: 'Close', onclick: 'closeModal()' },
  ]);
}

function toggleReportStatus(reportId) {
  const statusFlow = ['backlog', 'in_progress', 'review', 'completed'];
  Store.update('reports', reports => reports.map(r => {
    if (r.id !== reportId) return r;
    const currentIdx = statusFlow.indexOf(r.status);
    const nextStatus = statusFlow[(currentIdx + 1) % statusFlow.length];
    return { ...r, status: nextStatus };
  }));
  renderReports();
  const r = Store.get('reports').find(rep => rep.id === reportId);
  showToast(`Report status → ${r?.status || 'updated'} ✅`, 'success');
}

function deleteReport(reportId) {
  if (!confirm('Delete this report?')) return;
  Store.update('reports', reports => reports.filter(r => r.id !== reportId));
  renderReports();
  showToast('Report deleted 🗑️', 'info');
}

function exportReportPDF(reportId) {
  const r = Store.get('reports').find(rep => rep.id === reportId);
  if (!r) return;
  const agent = r.agent ? Store.getAgent(r.agent) : null;

  const content = `
══════════════════════════════════════════
  📄 REPORT: ${r.title}
══════════════════════════════════════════

Type:       ${r.type}
Status:     ${r.status}
Date:       ${formatDate(r.createdAt)}
Agent:      ${agent?.name || 'Unassigned'}
Department: ${agent ? (Store.getDeptInfo(agent.department)?.name || '') : 'N/A'}

──────────────────────────────────────────
  CONTENT
──────────────────────────────────────────

${r.content || 'No content generated yet.'}

──────────────────────────────────────────
Generated by Claw-Empire AI Office
${new Date().toISOString()}
══════════════════════════════════════════`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report_${r.title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Report exported! 📥', 'success');
}

function showRequestReportModal() {
  const agents = Store.get('agents');
  showModal('📝 Request New Report', `
    <div class="form-group">
      <label class="form-label">Report Title</label>
      <input class="form-input" id="reportTitle" placeholder="e.g. Sprint Review Q1 2026, Security Audit..." />
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="form-label">Report Type</label>
        <select class="form-select" id="reportType">
          <option value="development">⚙️ Development</option>
          <option value="report">📊 Analytics Report</option>
          <option value="web_research_report">🌐 Web Research</option>
          <option value="security_audit">🛡️ Security Audit</option>
          <option value="performance">⚡ Performance</option>
          <option value="sprint_review">🏃 Sprint Review</option>
          <option value="novel">📖 Content Writing</option>
          <option value="video_preprod">🎬 Video Pre-prod</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Assign Agent</label>
        <select class="form-select" id="reportAgent">
          ${agents.map(a => `<option value="${a.id}">${a.emoji} ${a.name} — ${Store.getDeptInfo(a.department)?.name || ''}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Priority</label>
      <div style="display:flex;gap:8px">
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:13px">
          <input type="radio" name="reportPriority" value="low"> 🟢 Low
        </label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:13px">
          <input type="radio" name="reportPriority" value="medium" checked> 🟡 Medium
        </label>
        <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:13px">
          <input type="radio" name="reportPriority" value="high"> 🔴 High
        </label>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Instructions / Description</label>
      <textarea class="form-textarea" id="reportInstructions" rows="4" 
        placeholder="Describe what the report should cover, key data points to include, format preferences..."></textarea>
    </div>
  `, [
    { label: '📝 Create Report', class: 'btn-primary', onclick: 'createReport()' },
    { label: 'Cancel', onclick: 'closeModal()' }
  ]);
}

function createReport() {
  const title = document.getElementById('reportTitle')?.value?.trim();
  if (!title) { showToast('Enter a title', 'error'); return; }
  const priority = document.querySelector('input[name="reportPriority"]:checked')?.value || 'medium';
  Store.update('reports', reports => [...reports, {
    id: generateId(), title,
    type: document.getElementById('reportType').value,
    agent: document.getElementById('reportAgent').value,
    priority,
    status: 'in_progress',
    createdAt: Date.now(),
    content: document.getElementById('reportInstructions')?.value || 'Report generation in progress...',
  }]);
  closeModal();
  renderReports();
  showToast(`Report "${title}" requested! 📄`, 'success');
}
