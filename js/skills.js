// ===== Skills Library =====
let skillCategoryFilter = '';

function renderSkills() {
  const allSkills = [];
  Object.entries(SKILL_CATEGORIES).forEach(([cat, skills]) => {
    skills.forEach(s => allSkills.push({ name: s, category: cat }));
  });

  const catIcons = { Frontend:'🖥️', Backend:'⚙️', Database:'🗄️', DevOps:'🚀', 'AI/ML':'🧠', Security:'🛡️', Design:'🎨', Testing:'🧪' };
  const filtered = skillCategoryFilter ? allSkills.filter(s => s.category === skillCategoryFilter) : allSkills;

  document.getElementById('tab-skills').innerHTML = `
    <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <h2 style="font-size:22px;font-weight:800;margin-bottom:4px">⭐ Skills Library</h2>
        <p style="color:var(--text-muted);font-size:13px">${allSkills.length}+ skills available across ${Object.keys(SKILL_CATEGORIES).length} categories</p>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-sm ${!skillCategoryFilter ? 'btn-primary' : ''}" onclick="skillCategoryFilter='';renderSkills()">All</button>
        ${Object.keys(SKILL_CATEGORIES).map(cat =>
          `<button class="btn btn-sm ${skillCategoryFilter===cat ? 'btn-primary' : ''}" onclick="skillCategoryFilter='${cat}';renderSkills()">${catIcons[cat]||''} ${cat}</button>`
        ).join('')}
      </div>
    </div>

    <div class="skills-grid">
      ${filtered.map(skill => `
        <div class="skill-card" onclick="showSkillAssignModal('${skill.name}','${skill.category}')">
          <div class="skill-card-icon">${catIcons[skill.category] || '📦'}</div>
          <div class="skill-card-name">${skill.name}</div>
          <div class="skill-card-desc">${skill.category}</div>
          <div style="margin-top:8px">
            <span class="tag tag-accent" style="font-size:9px">Click to assign</span>
          </div>
        </div>
      `).join('')}
    </div>`;
}

function showSkillAssignModal(skillName, category) {
  const agents = Store.get('agents');
  showModal(`Assign Skill: ${skillName}`, `
    <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px">Category: <strong>${category}</strong></p>
    <div class="form-group">
      <label class="form-label">Assign to Agent</label>
      <select class="form-select" id="skillAssignAgent">
        ${agents.map(a => `<option value="${a.id}">${a.emoji} ${a.name} (${Store.getDeptInfo(a.department)?.name})</option>`).join('')}
      </select>
    </div>
  `, [
    { label: 'Assign', class: 'btn-primary', onclick: `assignSkill('${skillName}')` },
    { label: 'Cancel', onclick: 'closeModal()' }
  ]);
}

function assignSkill(skillName) {
  const agentId = document.getElementById('skillAssignAgent')?.value;
  if (!agentId) return;
  Store.update('agents', agents => agents.map(a =>
    a.id === agentId ? { ...a, skills: [...(a.skills||[]), skillName] } : a
  ));
  closeModal();
  showToast(`Skill "${skillName}" assigned! ⭐`, 'success');
}
