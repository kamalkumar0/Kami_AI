// ══ STATE ══
let history = [];
let msgCount = 0;
let isLoading = false;
let chatStarted = false;
let featureMode = 'general';
let selectedModel = 'llama-3.3-70b-versatile';
let sidebarOpen = true;
let chatSessions = [];   // for history
let currentSessionTitle = '';

// ══ THEME TOGGLE ══
let isDark = true;

function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  const moon = document.querySelector('.icon-moon');
  const sun  = document.querySelector('.icon-sun');
  if (isDark) {
    moon.style.display = '';
    sun.style.display  = 'none';
    document.getElementById('themeToggleBtn').title = 'Switch to Light Mode';
  } else {
    moon.style.display = 'none';
    sun.style.display  = '';
    document.getElementById('themeToggleBtn').title = 'Switch to Dark Mode';
  }
  // Save preference
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme on startup
(function() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') toggleTheme();
})();

// ══ SIDEBAR ══
function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  document.getElementById('sidebar').classList.toggle('hidden', !sidebarOpen);
  document.getElementById('main').classList.toggle('expanded', !sidebarOpen);
  document.getElementById('sbShowBtn').classList.toggle('visible', !sidebarOpen);
}

// ══ NEW CHAT ══
function newChat() {
  if (chatStarted && history.length > 0) {
    saveToHistory(currentSessionTitle || 'Chat ' + (chatSessions.length + 1));
  }
  history = [];
  msgCount = 0;
  chatStarted = false;
  document.getElementById('msgCount').textContent = 0;
  document.getElementById('modeLabel').textContent = '—';
  document.getElementById('statusDot').className = 'status-dot';
  document.getElementById('statusText').textContent = 'Ready';

  // Reset UI to welcome
  document.getElementById('chatArea').style.display  = 'none';
  document.getElementById('centerWrap').style.display = 'flex';
  document.getElementById('welcomeHero').style.display = 'block';
  document.getElementById('featureChips').style.display = 'flex';
  document.getElementById('centerWrap').classList.remove('bottom');
  document.getElementById('messages').innerHTML = '';
  document.getElementById('promptInput').value = '';
  document.getElementById('jdZone').style.display = 'none';
  document.getElementById('featureBtnLabel').textContent = 'General';
  featureMode = 'general';
  currentSessionTitle = '';
}

function saveToHistory(title) {
  chatSessions.unshift({ title, history: [...history] });
  renderHistory();
}

function renderHistory() {
  const wrap = document.getElementById('sbHistory');
  const empty = document.getElementById('historyEmpty');
  // remove old items
  wrap.querySelectorAll('.sb-history-item').forEach(e => e.remove());
  if (chatSessions.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  chatSessions.slice(0, 10).forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'sb-history-item';
    el.textContent = s.title;
    el.title = s.title;
    wrap.appendChild(el);
  });
}

// ══ FEATURE MODE ══
function startFeature(mode) {
  setFeatureMode(
    mode,
    mode === 'general'   ? 'General'      :
    mode === 'interview' ? 'Interview Prep':
    mode === 'prep'      ? 'Study Coach'  : 'Code Help',
    mode === 'general'   ? 'Ask anything…'                              :
    mode === 'interview' ? 'Paste job description or ask a question…'   :
    mode === 'prep'      ? 'What topic do you want to study?…'          :
                           'Describe your coding problem…'
  );
  document.getElementById('promptInput').focus();
}

function setFeatureMode(mode, label, placeholder) {
  featureMode = mode;
  document.getElementById('featureBtnLabel').textContent = label;
  document.getElementById('promptInput').placeholder = placeholder;
  document.getElementById('featureMenu').classList.remove('open');

  // Show JD zone for interview mode
  const jdZone = document.getElementById('jdZone');
  jdZone.style.display = mode === 'interview' ? 'block' : 'none';

  // Highlight sidebar item
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  const map = { general: 0, interview: 1, prep: 2, code: 3 };
  const items = document.querySelectorAll('.sb-item');
  if (items[map[mode]]) items[map[mode]].classList.add('active');
  document.getElementById('modeLabel').textContent = label;
}

function toggleFeatureMenu() {
  document.getElementById('featureMenu').classList.toggle('open');
  document.getElementById('modelPopup').classList.remove('open');
}

// ══ MODEL SELECTOR ══
function toggleModelMenu(e) {
  e.stopPropagation();
  document.getElementById('modelPopup').classList.toggle('open');
  document.getElementById('featureMenu').classList.remove('open');
}

function pickModel(value, name, desc) {
  selectedModel = value;
  document.getElementById('modelTriggerLabel').textContent = name;
  document.querySelectorAll('.mpop-opt').forEach(el => el.classList.remove('selected'));
  const id = {
    'llama-3.3-70b-versatile':                        'opt-llama70b',
    'llama-3.1-8b-instant':                           'opt-llama8b',
    'meta-llama/llama-4-scout-17b-16e-instruct':      'opt-llama4scout',
    'moonshotai/kimi-k2-instruct':                    'opt-kimi-k2',
    'moonshotai/kimi-k2-instruct-0905':               'opt-kimi-k2-0905',
    'openai/gpt-oss-120b':                            'opt-gpt-120b',
    'openai/gpt-oss-20b':                             'opt-gpt-20b',
    'qwen/qwen3-32b':                                 'opt-qwen3',
    'gemini-2.0-flash':                               'opt-gemini-flash',
    'gemini-1.5-pro':                                 'opt-gemini-15-pro',
    'gemini-1.5-flash':                               'opt-gemini-15-flash',
  }[value];
  if (id) document.getElementById(id).classList.add('selected');
  document.getElementById('modelPopup').classList.remove('open');
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.model-wrap'))   document.getElementById('modelPopup').classList.remove('open');
  if (!e.target.closest('.footer-pill-btn') && !e.target.closest('.feature-menu'))
    document.getElementById('featureMenu').classList.remove('open');
});

// ══ SEND ══
async function sendMessage() {
  const promptEl = document.getElementById('promptInput');
  const jdEl     = document.getElementById('jdInput');
  const text      = promptEl.value.trim();
  const jd        = jdEl.value.trim();

  if (!text && !jd) return;
  if (isLoading) return;

  // First message → shift layout
  if (!chatStarted) {
    chatStarted = true;
    currentSessionTitle = text.substring(0, 40) || 'Interview Session';
    shiftToBottom();
  }

  const userMsg = featureMode === 'interview' && jd
    ? `[JD]:\n${jd}\n\n[User]: ${text || 'Start the interview based on this JD.'}`
    : text;

  addMsg(userMsg.replace(/\[JD\][\s\S]*?\[User\]: /, ''), 'user');
  promptEl.value = '';
  if (jd) { jdEl.value = ''; document.getElementById('jdZone').style.display = 'none'; }
  autoResize(promptEl);
  msgCount++;
  document.getElementById('msgCount').textContent = msgCount;

  await callGroq(userMsg);
}

function shiftToBottom() {
  // Hide welcome + chips, show chat area
  document.getElementById('welcomeHero').style.display  = 'none';
  document.getElementById('featureChips').style.display = 'none';

  // Show chat area — it takes all remaining space via flex:1
  const chatArea = document.getElementById('chatArea');
  chatArea.style.display = 'flex';

  // center-wrap shrinks to just the input card
  document.getElementById('centerWrap').classList.add('bottom');

  setStatus('live', featureMode === 'interview' ? 'Interviewing' :
                    featureMode === 'prep'      ? 'Coaching'     :
                    featureMode === 'code'      ? 'Coding'       : 'Chatting');
}

// ══ BUILD SYSTEM PROMPT ══
function buildSystem() {
  if (featureMode === 'interview') return `You are a professional AI job interviewer. Conduct a structured mock interview.
- Ask ONE focused question at a time. Wait for the answer.
- Mix technical, behavioural (STAR), situational questions.
- After each answer: 1-2 lines feedback.
- Number questions: Q1:, Q2: etc.
- After 8-10 questions: detailed final evaluation.`;

  if (featureMode === 'prep') return `You are an expert study and interview prep coach.
- Help the user understand topics clearly.
- Give structured explanations, examples, and practice questions.
- Be encouraging and practical.`;

  if (featureMode === 'code') return `You are an expert programming assistant.
- Help debug, explain, and write clean code.
- Always explain your reasoning.
- Use code blocks for code.`;

  return `You are a helpful, intelligent AI assistant. Answer clearly and concisely.`;
}

// ══ API CALL ══
async function callGroq(userMsg) {
  isLoading = true;
  document.getElementById('sendBtn').disabled = true;
  setStatus('think', 'Thinking…');
  const typingEl = addTyping();

  const msgs = [...history, { role: 'user', content: userMsg }];

  try {
    const res  = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: selectedModel, messages: msgs, system: buildSystem() })
    });
    const data = await res.json();
    typingEl.remove();

    if (data.error) {
      addMsg('⚠️ ' + data.error, 'ai');
      setStatus('', 'Error');
    } else {
      const reply = data.reply;
      history.push({ role: 'user',      content: userMsg });
      history.push({ role: 'assistant', content: reply  });
      addMsg(reply, 'ai');
      setStatus('live',
        featureMode === 'interview' ? 'Interviewing' :
        featureMode === 'prep'      ? 'Coaching'     :
        featureMode === 'code'      ? 'Coding'       : 'Chatting');
    }
  } catch (e) {
    typingEl.remove();
    addMsg('⚠️ Server error. Flask chal raha hai? → python app.py', 'ai');
    setStatus('', 'Error');
  }

  isLoading = false;
  document.getElementById('sendBtn').disabled = false;
}

// ══ STATUS ══
function setStatus(cls, text) {
  document.getElementById('statusDot').className  = 'status-dot' + (cls ? ' ' + cls : '');
  document.getElementById('statusText').textContent = text;
}

// ══ MESSAGES ══
function addMsg(text, who) {
  const el = document.createElement('div');
  el.className = `msg ${who}`;

  const av = document.createElement('div');
  av.className = `av av-${who}`;
  av.textContent = who === 'ai' ? 'AI' : 'You';

  const b = document.createElement('div');
  b.className = `bub bub-${who}`;
  b.innerHTML = fmt(text);

  el.appendChild(av); el.appendChild(b);
  const msgs = document.getElementById('messages');
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  return el;
}

function addTyping() {
  const el = document.createElement('div');
  el.className = 'msg';
  el.innerHTML = `<div class="av av-ai">AI</div><div class="bub bub-ai"><div class="typing"><span></span><span></span><span></span></div></div>`;
  const msgs = document.getElementById('messages');
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  return el;
}

function fmt(t) {
  return t
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/(Q\d+:)/g,  '<span class="qtag">$1</span>')
    .replace(/(💡 Tip:|Tip:|Pro tip:)/gi, '<span class="tiptag">💡 Tip</span>')
    .replace(/\n/g, '<br>');
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

// Keyboard shortcut Ctrl+K = new chat
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); newChat(); }
});