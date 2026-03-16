// ===== Claw-Empire Data Layer =====
const DEPARTMENTS = [
  { id: 'engineering', name: 'Engineering', icon: '⚙️', color: '#6366f1' },
  { id: 'design', name: 'Design', icon: '🎨', color: '#ec4899' },
  { id: 'marketing', name: 'Marketing', icon: '📢', color: '#f59e0b' },
  { id: 'research', name: 'Research', icon: '🔬', color: '#06b6d4' },
  { id: 'qa', name: 'QA Testing', icon: '🧪', color: '#22c55e' },
  { id: 'devops', name: 'DevOps', icon: '🚀', color: '#a855f7' },
  { id: 'security', name: 'Security', icon: '🛡️', color: '#ef4444' },
  { id: 'data', name: 'Data Science', icon: '📊', color: '#3b82f6' },
];

const PROVIDERS = [
  { id: 'claude', name: 'Claude Code', icon: '🟠', type: 'cli', model: 'claude-sonnet-4' },
  { id: 'codex', name: 'Codex CLI', icon: '🟢', type: 'cli', model: 'codex-mini' },
  { id: 'gemini', name: 'Gemini CLI', icon: '🔵', type: 'cli', model: 'gemini-2.5-pro' },
  { id: 'opencode', name: 'OpenCode', icon: '⚪', type: 'cli', model: 'gpt-4.1' },
  { id: 'kimi', name: 'Kimi Code', icon: '🟡', type: 'cli', model: 'kimi-k2.5' },
  { id: 'copilot', name: 'GitHub Copilot', icon: '🟣', type: 'oauth', model: 'copilot-gpt4' },
  { id: 'antigravity', name: 'Antigravity', icon: '🔴', type: 'api', model: 'gemini-2.5-flash' },
];

const AGENT_NAMES = [
  'Nova', 'Atlas', 'Cipher', 'Pixel', 'Vector', 'Qubit', 'Sage', 'Phoenix',
  'Echo', 'Nexus', 'Prism', 'Vortex', 'Helix', 'Zenith', 'Onyx', 'Flux'
];

const SPRITE_COLORS = [
  'linear-gradient(135deg, #6366f1, #a855f7)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #22c55e, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #14b8a6, #22c55e)',
  'linear-gradient(135deg, #f97316, #f59e0b)',
];

const SKILL_CATEGORIES = {
  'Frontend': ['React', 'Vue.js', 'Angular', 'TypeScript', 'CSS/SCSS', 'Tailwind', 'Next.js', 'Vite', 'Three.js', 'WebGL', 'WebXR', 'PWA', 'GraphQL Client', 'State Management', 'Animation', 'Accessibility'],
  'Backend': ['Node.js', 'Python', 'Go', 'Rust', 'Java', 'Express', 'FastAPI', 'gRPC', 'REST API', 'WebSocket', 'Microservices', 'Serverless', 'Message Queues', 'Caching', 'Load Balancing', 'Rate Limiting'],
  'Database': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB', 'Elasticsearch', 'ClickHouse', 'Schema Design', 'Query Optimization', 'Migrations', 'Replication'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD', 'GitHub Actions', 'Monitoring', 'Logging', 'Nginx', 'Caddy'],
  'AI/ML': ['LLM Integration', 'RAG Systems', 'Fine-tuning', 'Prompt Engineering', 'Computer Vision', 'NLP', 'TensorFlow', 'PyTorch', 'Embeddings', 'Agent Orchestration', 'Tool Calling', 'Evaluation'],
  'Security': ['OAuth/OIDC', 'JWT', 'Encryption', 'Penetration Testing', 'OWASP', 'CORS', 'CSP', 'WAF', 'Vulnerability Scanning', 'Compliance', 'Zero Trust', 'Secrets Management'],
  'Design': ['UI Design', 'UX Research', 'Figma', 'Design Systems', 'Responsive Design', 'Motion Design', 'Prototyping', 'Brand Identity', 'Typography', 'Color Theory', 'Illustration', 'Icon Design'],
  'Testing': ['Unit Testing', 'E2E Testing', 'Load Testing', 'Security Testing', 'API Testing', 'Visual Regression', 'Jest', 'Playwright', 'Cypress', 'k6', 'Test Strategy', 'Coverage Analysis'],
};

const TASK_TEMPLATES = [
  { title: 'Implement authentication flow', dept: 'engineering', priority: 'high' },
  { title: 'Design new landing page', dept: 'design', priority: 'high' },
  { title: 'Set up CI/CD pipeline', dept: 'devops', priority: 'medium' },
  { title: 'Create marketing campaign assets', dept: 'marketing', priority: 'medium' },
  { title: 'Security audit - Q1 2026', dept: 'security', priority: 'high' },
  { title: 'Build recommendation engine', dept: 'data', priority: 'high' },
  { title: 'API performance testing', dept: 'qa', priority: 'medium' },
  { title: 'Research competitor analysis', dept: 'research', priority: 'low' },
  { title: 'Refactor payment module', dept: 'engineering', priority: 'high' },
  { title: 'Mobile responsive overhaul', dept: 'design', priority: 'medium' },
  { title: 'Kubernetes cluster migration', dept: 'devops', priority: 'high' },
  { title: 'Social media content calendar', dept: 'marketing', priority: 'low' },
  { title: 'Implement rate limiting', dept: 'security', priority: 'medium' },
  { title: 'User behavior analytics dashboard', dept: 'data', priority: 'medium' },
  { title: 'Regression test suite expansion', dept: 'qa', priority: 'low' },
  { title: 'Evaluate new LLM providers', dept: 'research', priority: 'medium' },
];

const MEETING_TEMPLATES = [
  { title: 'Daily Standup — Engineering', dept: 'engineering', type: 'standup' },
  { title: 'Sprint Planning — Week 12', dept: 'engineering', type: 'planning' },
  { title: 'Design Review — Landing Page v2', dept: 'design', type: 'review' },
  { title: 'Security Incident Retrospective', dept: 'security', type: 'retrospective' },
  { title: 'Marketing Strategy Alignment', dept: 'marketing', type: 'strategy' },
  { title: 'Cross-team Demo Day', dept: 'engineering', type: 'demo' },
];

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return Math.floor(seconds/60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds/3600) + 'h ago';
  return Math.floor(seconds/86400) + 'd ago';
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
