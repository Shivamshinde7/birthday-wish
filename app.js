/**
 * Birthday Achievement Generator
 * Interactive Mini-Game & Certificate Application
 */

// --- GLOBAL STATE ---
const appState = {
  name: 'Legendary Colleague',
  perk: '🚀 Fast Responder',
  quote: 'You officially made my birthday 37% happier.',
  certId: '#BDAY-XP-9921',
  dateStr: '',
  audioEnabled: true,
  currentPage: 1
};

// --- RANDOMIZED DATA BANKS ---
const PERKS_BANK = [
  { icon: '🥇', title: 'Fast Responder', desc: 'Wished within record breaking time' },
  { icon: '🍰', title: 'Cake Lover', desc: 'Always present when sweets are cut' },
  { icon: '🎉', title: 'Birthday Hero', desc: 'Spreads immaculate office vibes' },
  { icon: '💻', title: 'Debugging Supporter', desc: 'Helps fix bugs & boosts morale' },
  { icon: '☕', title: 'Coffee Powered Human', desc: 'Runs 100% on caffeine & wishes' },
  { icon: '😂', title: 'Emoji Champion', desc: 'Sent the most expressive birthday texts' },
  { icon: '🌟', title: 'Office Superstar', desc: 'Legendary status certified by HR' }
];

const QUOTES_BANK = [
  "You officially made my birthday 37% happier.",
  "Your wish has been safely stored in my permanent happiness database.",
  "Bug Report: Too much positivity & happiness detected.",
  "System Update: Birthday successfully upgraded to v2.0.",
  "Your good vibes have been accepted with 200 OK status.",
  "Warning: High doses of office friendship detected."
];

const VERIFY_STEPS = [
  "✔ Searching HR Database...",
  "✔ Checking WhatsApp Wishes History...",
  "✔ Verifying Good Human Status...",
  "✔ Detecting Birthday Positivity Levels...",
  "✔ Compiling Happiness Tokens...",
  "✔ Almost Done..."
];

// --- WEB AUDIO SYNTHESIZER FOR SOUND EFFECTS ---
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && appState.audioEnabled) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!appState.audioEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  playBleep() {
    if (!appState.audioEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + Math.random() * 300, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  playSuccessFanfare() {
    if (!appState.audioEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 3 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);

        const startTime = this.ctx.currentTime + idx * 0.09;
        const duration = idx === 3 ? 0.6 : 0.2;

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      } catch (e) {}
    });
  }
}

const sfx = new SoundEffects();

// --- DOM INIT & EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
  // Format current date
  const now = new Date();
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  appState.dateStr = now.toLocaleDateString('en-US', options);

  // Setup UI elements
  setupAudioToggle();
  setupQuickChips();
  setupInputEnter();

  // Show page 1 initial status
  updateStatusBadge('MISSION ACTIVE');
  generateAmbientBalloons();
});

// --- NAVIGATION & PAGE MANAGEMENT ---
function navigateToPage(targetPageNum) {
  sfx.playPop();
  
  const currentView = document.getElementById(`page-${appState.currentPage}`);
  const targetView = document.getElementById(`page-${targetPageNum}`);

  if (currentView) {
    currentView.classList.remove('page-active');
  }

  appState.currentPage = targetPageNum;

  if (targetView) {
    targetView.classList.add('page-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Page-specific setup logic
  if (targetPageNum === 3) {
    updateStatusBadge('SCANNING IN PROGRESS');
    startVerificationSequence();
  } else if (targetPageNum === 4) {
    updateStatusBadge('MISSION COMPLETED');
    sfx.playSuccessFanfare();
    populateSuccessScreen();
  } else if (targetPageNum === 5) {
    updateStatusBadge('REWARD UNLOCKED');
    populateCertificate();
    triggerMassiveConfetti();
  }
}

// --- PAGE 1 -> PAGE 2 ---
function startMissionFlow() {
  navigateToPage(2);
}

// --- PAGE 2 -> PAGE 3 ---
function submitNameFlow() {
  const inputEl = document.getElementById('colleague-name-input');
  let enteredName = inputEl ? inputEl.value.trim() : '';
  
  if (!enteredName) {
    enteredName = 'Mystery Colleague ⭐';
  }

  appState.name = enteredName;

  // Randomize Perk & Quote
  const randPerk = PERKS_BANK[Math.floor(Math.random() * PERKS_BANK.length)];
  appState.perk = randPerk;

  const randQuote = QUOTES_BANK[Math.floor(Math.random() * QUOTES_BANK.length)];
  appState.quote = randQuote;

  // Generate random Badge ID
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  appState.certId = `#BDAY-XP-${randomNum}`;

  navigateToPage(3);
}

// --- PAGE 3: VERIFICATION SEQUENCE ---
function startVerificationSequence() {
  const msgEl = document.getElementById('verify-status-msg');
  const barEl = document.getElementById('verify-progress-bar');
  const percentEl = document.getElementById('verify-progress-percent');

  let stepIdx = 0;
  let currentProgress = 5;

  if (barEl) barEl.style.width = '5%';
  if (percentEl) percentEl.textContent = '5%';
  if (msgEl) msgEl.textContent = VERIFY_STEPS[0];

  const stepTimer = setInterval(() => {
    stepIdx++;
    sfx.playBleep();

    if (stepIdx < VERIFY_STEPS.length) {
      if (msgEl) {
        msgEl.style.opacity = 0;
        setTimeout(() => {
          msgEl.textContent = VERIFY_STEPS[stepIdx];
          msgEl.style.opacity = 1;
        }, 150);
      }
    }
  }, 950);

  const progressTimer = setInterval(() => {
    currentProgress += 3 + Math.random() * 4;
    if (currentProgress > 100) currentProgress = 100;

    const rounded = Math.floor(currentProgress);
    if (barEl) barEl.style.width = `${rounded}%`;
    if (percentEl) percentEl.textContent = `${rounded}%`;

    if (currentProgress >= 100) {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
      
      if (msgEl) msgEl.textContent = "✔ Database Synchronized 100%!";
      
      // Trigger mini confetti burst
      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }

      setTimeout(() => {
        navigateToPage(4);
      }, 900);
    }
  }, 120);
}

// --- PAGE 4: SUCCESS SCREEN POPULATION ---
function populateSuccessScreen() {
  const greetingEl = document.getElementById('success-greeting-name');
  if (greetingEl) {
    greetingEl.textContent = `Hello ${appState.name} 👋`;
  }

  const perkTitleEl = document.getElementById('perk-title-text');
  const perkIconEl = document.getElementById('perk-icon-text');
  const perkDescEl = document.getElementById('perk-desc-text');

  if (perkTitleEl && appState.perk) perkTitleEl.textContent = appState.perk.title;
  if (perkIconEl && appState.perk) perkIconEl.textContent = appState.perk.icon;
  if (perkDescEl && appState.perk) perkDescEl.textContent = appState.perk.desc;

  const quoteEl = document.getElementById('appreciation-quote-text');
  if (quoteEl) {
    quoteEl.textContent = `"${appState.quote}"`;
  }
}

// --- PAGE 5: CERTIFICATE POPULATION ---
function populateCertificate() {
  const certNameEl = document.getElementById('cert-holder-name');
  if (certNameEl) {
    certNameEl.textContent = appState.name;
  }

  const certIdEl = document.getElementById('cert-badge-id');
  if (certIdEl) {
    certIdEl.textContent = appState.certId;
  }

  const stampDateEl = document.getElementById('stamp-date-text');
  if (stampDateEl) {
    stampDateEl.textContent = appState.dateStr;
  }
}

// --- AUDIO TOGGLE ---
function setupAudioToggle() {
  const btn = document.getElementById('audio-toggle-button');
  const icon = document.getElementById('audio-toggle-icon');
  const text = document.getElementById('audio-toggle-text');

  if (!btn) return;

  btn.addEventListener('click', () => {
    appState.audioEnabled = !appState.audioEnabled;
    if (appState.audioEnabled) {
      sfx.init();
      sfx.playPop();
      if (icon) icon.textContent = '🔊';
      if (text) text.textContent = 'Sound ON';
      btn.classList.add('audio-active');
    } else {
      if (icon) icon.textContent = '🔇';
      if (text) text.textContent = 'Sound OFF';
      btn.classList.remove('audio-active');
    }
  });
}

// --- QUICK CHIPS INPUT ---
function setupQuickChips() {
  const chips = document.querySelectorAll('.chip-btn');
  const inputEl = document.getElementById('colleague-name-input');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      sfx.playBleep();
      const val = chip.getAttribute('data-name');
      if (inputEl && val) {
        inputEl.value = val;
        inputEl.focus();
      }
    });
  });
}

function setupInputEnter() {
  const inputEl = document.getElementById('colleague-name-input');
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitNameFlow();
      }
    });
  }
}

// --- STATUS BADGE ---
function updateStatusBadge(statusText) {
  const badgeEl = document.getElementById('mission-status-text');
  if (badgeEl) {
    badgeEl.textContent = statusText;
  }
}

// --- FLOATING BALLOONS GENERATOR ---
function generateAmbientBalloons() {
  const container = document.getElementById('balloons-wrapper');
  if (!container) return;

  const emojis = ['🎈', '✨', '🎂', '🎉', '⭐', '🎊', '🍰'];
  const count = window.innerWidth < 600 ? 8 : 15;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'floating-balloon';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Random position and timing
    const leftPos = Math.random() * 95;
    const animDuration = 12 + Math.random() * 18;
    const animDelay = Math.random() * -20;
    const fontSize = 1.8 + Math.random() * 2.2;

    el.style.left = `${leftPos}%`;
    el.style.animationDuration = `${animDuration}s`;
    el.style.animationDelay = `${animDelay}s`;
    el.style.fontSize = `${fontSize}rem`;

    container.appendChild(el);
  }
}

// --- CONFETTI EXPLOSIONS ---
function triggerMassiveConfetti() {
  if (typeof confetti !== 'function') return;

  // Center burst
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#00f2fe', '#4facfe', '#9b51e0', '#ff0844', '#ffb300', '#00e676']
  });

  // Cannon sides
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } });
  }, 350);

  setTimeout(() => {
    confetti({ particleCount: 90, spread: 130, origin: { y: 0.4 } });
  }, 800);
}

// --- EXPORT TO PNG ---
async function downloadCertificatePNG() {
  sfx.playPop();
  const certNode = document.getElementById('premium-certificate-card');
  if (!certNode) return;

  showToast('🎨 Generating High-Res PNG...');

  try {
    const canvas = await html2canvas(certNode, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FAFAFA',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    const cleanName = appState.name.replace(/[^a-zA-Z0-9]/g, '_') || 'Colleague';
    downloadLink.download = `Birthday_Achievement_${cleanName}.png`;
    downloadLink.href = imgData;
    downloadLink.click();

    showToast('✔ PNG Saved to Downloads!');
    triggerMassiveConfetti();
  } catch (err) {
    console.error("PNG export failure", err);
    showToast('❌ Error generating image. Please try screenshotting.');
  }
}

// --- EXPORT TO PDF ---
async function downloadCertificatePDF() {
  sfx.playPop();
  const certNode = document.getElementById('premium-certificate-card');
  if (!certNode) return;

  showToast('📄 Compiling Luxury PDF...');

  try {
    const canvas = await html2canvas(certNode, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FAFAFA',
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const { jsPDF } = window.jspdf;

    // A4 Landscape format
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    doc.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
    const cleanName = appState.name.replace(/[^a-zA-Z0-9]/g, '_') || 'Colleague';
    doc.save(`Birthday_Certificate_${cleanName}.pdf`);

    showToast('✔ Official PDF Saved!');
    triggerMassiveConfetti();
  } catch (err) {
    console.error("PDF export failure", err);
    showToast('❌ Error generating PDF.');
  }
}

// --- CELEBRATE AGAIN RESET ---
function resetAndCelebrateAgain() {
  sfx.playPop();
  triggerMassiveConfetti();
  showToast('🎉 Extra Birthday Vibe Unlocked!');
  
  // Optionally randomize quotes again
  const randQuote = QUOTES_BANK[Math.floor(Math.random() * QUOTES_BANK.length)];
  appState.quote = randQuote;
  const quoteEl = document.getElementById('appreciation-quote-text');
  if (quoteEl) quoteEl.textContent = `"${appState.quote}"`;
}

function startOverFlow() {
  navigateToPage(1);
}

// --- TOAST NOTIFICATIONS ---
function showToast(msg) {
  const toastEl = document.getElementById('app-toast-alert');
  const toastText = document.getElementById('app-toast-text');
  
  if (!toastEl || !toastText) return;

  toastText.textContent = msg;
  toastEl.classList.add('show-toast');

  setTimeout(() => {
    toastEl.classList.remove('show-toast');
  }, 3200);
}
