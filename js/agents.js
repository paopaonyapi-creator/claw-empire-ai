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

function removeAgent(id) {
  if (!confirm('Remove this agent?')) return;
  Store.update('agents', agents => agents.filter(a => a.id !== id));
  renderAgents();
  showToast('Agent removed', 'info');
}
