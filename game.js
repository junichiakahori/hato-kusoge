/**
 * HATO PANIC (ハト・パニック)
 * Core Game Script
 */

// --- GLOBAL ERROR HANDLER FOR MOBILE/DESKTOP DEBBUGING ---
window.addEventListener('error', function(e) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'absolute';
  errDiv.style.top = '0';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.padding = '15px';
  errDiv.style.background = '#ff4757';
  errDiv.style.color = 'white';
  errDiv.style.fontFamily = 'monospace';
  errDiv.style.fontSize = '12px';
  errDiv.style.zIndex = '99999';
  errDiv.style.boxSizing = 'border-box';
  errDiv.innerHTML = '<strong>Game Error occurred:</strong><br>' + e.message + '<br>at ' + e.filename + ':' + e.lineno + ':' + e.colno;
  document.body.appendChild(errDiv);
});

// --- CanvasRenderingContext2D.roundRect Polyfill ---
if (typeof CanvasRenderingContext2D.prototype.roundRect !== 'function') {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (typeof r === 'undefined') {
      r = 0;
    }
    if (typeof r === 'number') {
      r = [r, r, r, r];
    } else if (Array.isArray(r)) {
      if (r.length === 1) r = [r[0], r[0], r[0], r[0]];
      else if (r.length === 2) r = [r[0], r[1], r[0], r[1]];
      else if (r.length === 3) r = [r[0], r[1], r[2], r[1]];
    } else {
      r = [0, 0, 0, 0];
    }
    
    this.beginPath();
    this.moveTo(x + r[0], y);
    this.lineTo(x + w - r[1], y);
    this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
    this.lineTo(x + w, y + h - r[2]);
    this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
    this.lineTo(x + r[3], y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
    this.lineTo(x, y + r[0]);
    this.quadraticCurveTo(x, y, x + r[0], y);
    this.closePath();
    return this;
  };
}

// --- AUDIO SYNTHESIZER (Web Audio API) ---
class GameAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFlap() {
    if (this.muted || !this.ctx) return;
    this.resume();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playCoo() {
    if (this.muted || !this.ctx) return;
    this.resume();
    
    const now = this.ctx.currentTime;
    // Coo has a double sound: "coo-cooo" (クルックー)
    // First short coo
    this.synthCooSound(now, 0.1, 230, 250);
    // Second longer coo
    this.synthCooSound(now + 0.18, 0.22, 220, 260);
  }

  synthCooSound(startTime, duration, startFreq, endFreq) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(startFreq - 10, startTime + duration);
    
    gain.gain.setValueAtTime(0.01, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + duration * 0.2);
    gain.gain.linearRampToValueAtTime(0.1, startTime + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0.01, startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playEat() {
    if (this.muted || !this.ctx) return;
    this.resume();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playPoop() {
    if (this.muted || !this.ctx) return;
    this.resume();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playSplat() {
    if (this.muted || !this.ctx) return;
    this.resume();
    
    const now = this.ctx.currentTime;
    
    // Noise buffer for splat sound (squishy)
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Low pass filter to make it sound squishy
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(80, now + 0.15);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noise.start();
    noise.stop(now + 0.15);
  }

  playDamage() {
    if (this.muted || !this.ctx) return;
    this.resume();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.25);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    this.resume();
    
    const now = this.ctx.currentTime;
    const notes = [300, 260, 220, 180];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      
      gain.gain.setValueAtTime(0.2, now + idx * 0.15);
      gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.15 + 0.18);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.18);
    });
  }
}

const audio = new GameAudio();

// --- STATE MANAGEMENT & CONSTANTS ---
const GAME_WIDTH = 540;
const GAME_HEIGHT = 960;

const STATE = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAMEOVER: 'gameover',
  SHOP: 'shop'
};

const SKINS = {
  normal: { colorBody: '#a5b1c2', colorWing: '#778ca3', colorNeck: '#2bcbba', name: '普通のハト', scale: 1, poopCap: 5, poopReloadMult: 1, crumbScoreMult: 1, staminaMaxMult: 1, speedMult: 1 },
  golden: { colorBody: '#fed330', colorWing: '#f7b731', colorNeck: '#fffa65', name: 'ゴールデンハト', scale: 1, poopCap: 5, poopReloadMult: 1, crumbScoreMult: 2, staminaMaxMult: 1, speedMult: 1, particle: 'gold' },
  cyber: { colorBody: '#18dcff', colorWing: '#17c0eb', colorNeck: '#fffa65', name: 'サイバーハト', scale: 1, poopCap: 8, poopReloadMult: 1.5, crumbScoreMult: 1, staminaMaxMult: 1, speedMult: 1, particle: 'cyber' },
  shadow: { colorBody: '#3d3d3d', colorWing: '#1e272e', colorNeck: '#ff4757', name: 'シャドウハト', scale: 1.05, poopCap: 5, poopReloadMult: 1, crumbScoreMult: 1, staminaMaxMult: 1.3, speedMult: 1.25, particle: 'shadow' }
};

// --- DATA MODEL (LocalStorage saved) ---
let gameData = {
  crumbs: 0,
  highScore: 0,
  activeSkin: 'normal',
  unlockedSkins: ['normal'],
  upgrades: {
    stamina: 1, // Max stamina multiplier
    poop: 1,    // Max poop ammo
    speed: 1    // Max move speed
  }
};

function loadGameData() {
  const saved = localStorage.getItem('hato_panic_data');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      gameData = { ...gameData, ...parsed };
      // Handle backward compatible check for upgraded arrays
      if (!gameData.unlockedSkins.includes('normal')) {
        gameData.unlockedSkins.push('normal');
      }
    } catch (e) {
      console.error('Failed to parse save game data', e);
    }
  }
}

function saveGameData() {
  localStorage.setItem('hato_panic_data', JSON.stringify(gameData));
}

// Supabase Configuration
// ご自身のSupabaseプロジェクトのURLとAnon Keyをここに設定してください。
// 設定されるまでは自動的にブラウザのLocalStorageを利用するフォールバックモードで動作します。
const SUPABASE_URL = 'https://shyplemeslmxvchbrhyy.supabase.co';
const SUPABASE_KEY = 'your-anon-public-key';

const isSupabaseConfigured = SUPABASE_KEY !== 'your-anon-public-key' && SUPABASE_KEY !== '';

// Automatically sanitize URL in case user copies with trailing slash or '/rest/v1/'
const SUPABASE_BASE_URL = (() => {
  let url = SUPABASE_URL.trim();
  if (url.endsWith('/')) url = url.slice(0, -1);
  if (url.endsWith('/rest/v1')) url = url.slice(0, -8);
  if (url.endsWith('/')) url = url.slice(0, -1);
  return url;
})();

let rankingData = [];

function getInitialRanking() {
  return [];
}

// Convert ISO timestamp from Supabase to MM/DD format
function formatSupabaseDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}/${d}`;
}

function loadRanking(callback) {
  if (!isSupabaseConfigured) {
    // LocalStorage Fallback mode
    const stored = localStorage.getItem('hato_ranking_data');
    if (stored) {
      try {
        rankingData = JSON.parse(stored);
      } catch (e) {
        rankingData = getInitialRanking();
      }
    } else {
      rankingData = getInitialRanking();
    }
    if (callback) callback(rankingData);
    return;
  }

  const url = `${SUPABASE_BASE_URL}/rest/v1/ranking?select=name,score,comment,created_at&order=score.desc&limit=100`;
  fetch(url, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error('Supabase request error');
      return response.json();
    })
    .then(data => {
      rankingData = data.map(item => ({
        name: item.name,
        score: parseInt(item.score),
        comment: item.comment || '',
        date: formatSupabaseDate(item.created_at)
      }));
      localStorage.setItem('hato_ranking_data', JSON.stringify(rankingData));
      if (callback) callback(rankingData);
    })
    .catch(error => {
      console.warn('Failed to load ranking from Supabase, using local fallback:', error);
      const stored = localStorage.getItem('hato_ranking_data');
      if (stored) {
        try {
          rankingData = JSON.parse(stored);
        } catch (e) {
          rankingData = getInitialRanking();
        }
      } else {
        rankingData = getInitialRanking();
      }
      if (callback) callback(rankingData);
    });
}

function checkRankingQualification(playerScore) {
  if (rankingData.length < 100) return true;
  rankingData.sort((a, b) => b.score - a.score);
  return playerScore > rankingData[99].score;
}

function registerRankingScore(name, playerScore, comment, callback) {
  if (!isSupabaseConfigured) {
    // LocalStorage Fallback mode
    const dateStr = new Date().toLocaleDateString('ja-JP', {
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');

    const newEntry = {
      name: (name || 'ハト').slice(0, 8),
      score: playerScore,
      comment: (comment || '').slice(0, 20),
      date: dateStr
    };

    rankingData.push(newEntry);
    rankingData.sort((a, b) => b.score - a.score);
    rankingData = rankingData.slice(0, 100);
    localStorage.setItem('hato_ranking_data', JSON.stringify(rankingData));

    const newRank = rankingData.findIndex(entry => 
      entry.name === newEntry.name && 
      entry.score === newEntry.score && 
      entry.comment === newEntry.comment && 
      entry.date === newEntry.date
    ) + 1;

    if (callback) callback(newRank);
    return;
  }

  const url = `${SUPABASE_BASE_URL}/rest/v1/ranking`;
  const payload = {
    name: (name || 'ハト').slice(0, 8),
    score: playerScore,
    comment: (comment || '').slice(0, 20)
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) throw new Error('Supabase insert error');
      return response.json();
    })
    .then(() => {
      // Re-fetch updated scores to determine final player rank
      loadRanking(() => {
        const newRank = rankingData.findIndex(entry => 
          entry.name === payload.name && 
          entry.score === payload.score && 
          entry.comment === payload.comment
        ) + 1;
        if (callback) callback(newRank || 100);
      });
    })
    .catch(error => {
      console.warn('Failed to submit ranking to Supabase, using local fallback:', error);
      const dateStr = new Date().toLocaleDateString('ja-JP', {
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/');

      const newEntry = {
        name: (name || 'ハト').slice(0, 8),
        score: playerScore,
        comment: (comment || '').slice(0, 20),
        date: dateStr
      };

      rankingData.push(newEntry);
      rankingData.sort((a, b) => b.score - a.score);
      rankingData = rankingData.slice(0, 100);
      localStorage.setItem('hato_ranking_data', JSON.stringify(rankingData));

      const newRank = rankingData.findIndex(entry => 
        entry.name === newEntry.name && 
        entry.score === newEntry.score && 
        entry.comment === newEntry.comment && 
        entry.date === newEntry.date
      ) + 1;

      if (callback) callback(newRank);
    });
}

function populateLeaderboard(highlightRank = -1) {
  const tbody = document.getElementById('leaderboard-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (rankingData.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 11px;">まだランキングデータがありません。<br>最初の登録者になろう！ 🏆</td>`;
    tbody.appendChild(tr);
    return;
  }

  rankingData.forEach((entry, idx) => {
    const rank = idx + 1;
    const tr = document.createElement('tr');
    if (rank === highlightRank) {
      tr.className = 'highlight';
    }

    let rankDisplay = rank;
    if (rank === 1) rankDisplay = '🥇 1';
    else if (rank === 2) rankDisplay = '🥈 2';
    else if (rank === 3) rankDisplay = '🥉 3';

    tr.innerHTML = `
      <td>${rankDisplay}</td>
      <td>${escapeHTML(entry.name)}</td>
      <td>${entry.score}</td>
      <td style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHTML(entry.comment || '')}">${escapeHTML(entry.comment || '')}</td>
      <td>${entry.date}</td>
    `;
    tbody.appendChild(tr);

    if (rank === highlightRank) {
      setTimeout(() => {
        tr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// --- CANVAS SETUP ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// --- INPUT HANDLER ---
const keys = {};
let touchInput = { left: false, right: false, up: false, down: false, flap: false, poop: false };

// Dynamic virtual joystick state
const joystick = {
  active: false,
  touchId: null,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  maxRadius: 55, // canvas units
  deadzone: 8    // canvas units
};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  audio.init(); // Init audio on key press
  if (e.code === 'Space' && currentGameState === STATE.PLAYING) {
    e.preventDefault(); // Stop scrolling space
  }
});
window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// Setup Mobile Touch Events & Dynamic Virtual Joystick
const setupMobileControls = () => {
  const btnFlap = document.getElementById('ctrl-flap');
  const btnPoop = document.getElementById('ctrl-poop');

  const setupButton = (btn, stateKey) => {
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      audio.init();
      touchInput[stateKey] = true;
    });
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      touchInput[stateKey] = false;
    });
    // Fallback mouse events for desktop testing of mobile UI
    btn.addEventListener('mousedown', () => {
      audio.init();
      touchInput[stateKey] = true;
    });
    btn.addEventListener('mouseup', () => {
      touchInput[stateKey] = false;
    });
  };

  setupButton(btnFlap, 'flap');
  setupButton(btnPoop, 'poop');

  // --- Dynamic Virtual Joystick Event Listeners ---
  canvas.addEventListener('touchstart', (e) => {
    if (currentGameState !== STATE.PLAYING) return;
    if (joystick.active) return;

    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const cssX = touch.clientX - rect.left;
      const cssY = touch.clientY - rect.top;

      const canvasX = (cssX / rect.width) * canvas.width;
      const canvasY = (cssY / rect.height) * canvas.height;

      // Only activate if touched on the left half of the screen
      if (canvasX < canvas.width / 2) {
        joystick.active = true;
        joystick.touchId = touch.identifier;
        joystick.startX = canvasX;
        joystick.startY = canvasY;
        joystick.currentX = canvasX;
        joystick.currentY = canvasY;
        audio.init();
        break;
      }
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!joystick.active) return;

    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystick.touchId) {
        if (e.cancelable) e.preventDefault();

        const cssX = touch.clientX - rect.left;
        const cssY = touch.clientY - rect.top;

        const canvasX = (cssX / rect.width) * canvas.width;
        const canvasY = (cssY / rect.height) * canvas.height;

        let dx = canvasX - joystick.startX;
        let dy = canvasY - joystick.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > joystick.maxRadius) {
          dx = (dx / dist) * joystick.maxRadius;
          dy = (dy / dist) * joystick.maxRadius;
        }

        joystick.currentX = joystick.startX + dx;
        joystick.currentY = joystick.startY + dy;

        // Reset direction outputs
        touchInput.left = false;
        touchInput.right = false;
        touchInput.up = false;
        touchInput.down = false;

        if (dist > joystick.deadzone) {
          const threshold = 12;
          if (dx < -threshold) touchInput.left = true;
          if (dx > threshold) touchInput.right = true;
          if (dy < -threshold) touchInput.up = true;
          if (dy > threshold) touchInput.down = true;
        }
        break;
      }
    }
  }, { passive: false });

  const endJoystick = (e) => {
    if (!joystick.active) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystick.touchId) {
        joystick.active = false;
        joystick.touchId = null;
        touchInput.left = false;
        touchInput.right = false;
        touchInput.up = false;
        touchInput.down = false;
        break;
      }
    }
  };

  canvas.addEventListener('touchend', endJoystick, { passive: true });
  canvas.addEventListener('touchcancel', endJoystick, { passive: true });

  // --- Mouse emulation of the virtual joystick (for desktop testing) ---
  let isMouseDragging = false;

  canvas.addEventListener('mousedown', (e) => {
    if (currentGameState !== STATE.PLAYING) return;
    if (e.button !== 0) return; // Left click only

    const rect = canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    const canvasX = (cssX / rect.width) * canvas.width;
    const canvasY = (cssY / rect.height) * canvas.height;

    // Only activate on left half
    if (canvasX < canvas.width / 2) {
      isMouseDragging = true;
      joystick.active = true;
      joystick.startX = canvasX;
      joystick.startY = canvasY;
      joystick.currentX = canvasX;
      joystick.currentY = canvasY;
      audio.init();
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isMouseDragging || !joystick.active) return;

    const rect = canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    const canvasX = (cssX / rect.width) * canvas.width;
    const canvasY = (cssY / rect.height) * canvas.height;

    let dx = canvasX - joystick.startX;
    let dy = canvasY - joystick.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > joystick.maxRadius) {
      dx = (dx / dist) * joystick.maxRadius;
      dy = (dy / dist) * joystick.maxRadius;
    }

    joystick.currentX = joystick.startX + dx;
    joystick.currentY = joystick.startY + dy;

    touchInput.left = false;
    touchInput.right = false;
    touchInput.up = false;
    touchInput.down = false;

    if (dist > joystick.deadzone) {
      const threshold = 12;
      if (dx < -threshold) touchInput.left = true;
      if (dx > threshold) touchInput.right = true;
      if (dy < -threshold) touchInput.up = true;
      if (dy > threshold) touchInput.down = true;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isMouseDragging) {
      isMouseDragging = false;
      joystick.active = false;
      touchInput.left = false;
      touchInput.right = false;
      touchInput.up = false;
      touchInput.down = false;
    }
  });
};

// --- GAME OBJECTS & SYSTEMS ---
let currentGameState = STATE.MENU;
let score = 0;
let levelCrumbs = 0;
let scrollX = 0;
let gameSpeed = 3.5;
let minGameSpeed = 3.5;
let maxGameSpeed = 8;
let gameTime = 0;

// Pigeon (Player) Definition
class Pigeon {
  constructor() {
    this.x = 120;
    this.y = 350;
    this.vx = 0;
    this.vy = 0;
    this.radius = 20;
    
    // Stats calculated from levels and active skin
    this.maxStamina = 100;
    this.stamina = 100;
    this.poopMax = 5;
    this.poopAmmo = 5;
    this.speedMult = 1;
    
    this.wingAngle = 0;
    this.wingDirection = 1;
    this.isFlapping = false;
    this.flapTimer = 0;
    this.headBob = 0;
    this.headBobDir = 1;
    this.rotation = 0;
    
    this.hurtTimer = 0;
    this.perchedOn = null; // Landmark object if perching
    
    this.poopReloadTimer = 0;
    this.cooingTimer = Math.random() * 200 + 100;
  }

  reset() {
    this.x = 120;
    this.y = 350;
    this.vx = 0;
    this.vy = 0;
    this.hurtTimer = 0;
    this.perchedOn = null;
    this.wingAngle = 0;
    this.rotation = 0;
    
    this.refreshStats();
    this.stamina = this.maxStamina;
    this.poopAmmo = this.poopMax;
    this.poopReloadTimer = 0;
  }

  refreshStats() {
    const skin = SKINS[gameData.activeSkin] || SKINS.normal;
    // Base values + level upgrades
    this.maxStamina = 100 * (1 + (gameData.upgrades.stamina - 1) * 0.15) * skin.staminaMaxMult;
    this.poopMax = (skin.poopCap) + (gameData.upgrades.poop - 1);
    this.speedMult = (1 + (gameData.upgrades.speed - 1) * 0.1) * skin.speedMult;
  }

  flap() {
    if (this.stamina <= 0) return;
    this.vy = -5.8;
    this.isFlapping = true;
    this.flapTimer = 8;
    this.perchedOn = null;
    this.stamina -= 3; // Flapping costs stamina
    if (this.stamina < 0) this.stamina = 0;
    audio.playFlap();
    
    // Feathers particles
    for (let i = 0; i < 2; i++) {
      particles.push(new FeatherParticle(this.x - 10, this.y + 5, -2 + Math.random() * -2, -1 + Math.random() * 2, gameData.activeSkin));
    }
  }

  poop() {
    if (this.poopAmmo <= 0 || this.perchedOn) return;
    this.poopAmmo--;
    audio.playPoop();
    
    const skin = SKINS[gameData.activeSkin];
    const bulletType = skin === SKINS.cyber ? 'cyber' : (skin === SKINS.golden ? 'gold' : 'normal');
    poopBullets.push(new PoopBullet(this.x, this.y + 12, this.vx * 0.5, 4, bulletType));
  }

  update() {
    const skin = SKINS[gameData.activeSkin] || SKINS.normal;

    // Bob head and blink animation logic
    if (this.perchedOn) {
      this.headBob += 0.08 * this.headBobDir;
      if (Math.abs(this.headBob) > 2) this.headBobDir *= -1;
    } else {
      this.headBob += 0.15 * this.headBobDir;
      if (Math.abs(this.headBob) > 3) this.headBobDir *= -1;
    }

    // Cooing logic
    this.cooingTimer--;
    if (this.cooingTimer <= 0) {
      audio.playCoo();
      this.cooingTimer = Math.random() * 300 + 200; // Reset
      // Float bubble text
      particles.push(new TextBubbleParticle(this.x, this.y - 25, "クルックー♪", "#fff"));
    }

    // Flash/Hurt logic
    if (this.hurtTimer > 0) {
      this.hurtTimer--;
    }

    // Wing flapping animation
    if (this.isFlapping) {
      this.wingAngle += 0.6 * this.wingDirection;
      if (Math.abs(this.wingAngle) > 0.8) {
        this.wingDirection *= -1;
      }
      this.flapTimer--;
      if (this.flapTimer <= 0) {
        this.isFlapping = false;
        this.wingAngle = 0;
      }
    } else if (this.perchedOn) {
      this.wingAngle = -0.5; // Folded wings
    } else {
      // Gliding wing pose
      this.wingAngle = Math.sin(gameTime * 0.08) * 0.15;
    }

    // Skin special idle trails
    if (skin.particle && Math.random() < 0.15) {
      particles.push(new GlowParticle(this.x - 15, this.y + (Math.random() * 10 - 5), skin.particle));
    }

    // IF PERCHED
    if (this.perchedOn) {
      this.vx = 0;
      this.vy = 0;
      this.x = this.perchedOn.x + this.perchedOn.width / 2;
      this.y = this.perchedOn.y - this.radius + 5;
      this.rotation = 0;

      // Recover stamina and ammo rapidly
      if (this.stamina < this.maxStamina) {
        this.stamina += 0.8;
        if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
      }
      this.poopReloadTimer += skin.poopReloadMult;
      if (this.poopReloadTimer >= 60) {
        if (this.poopAmmo < this.poopMax) {
          this.poopAmmo++;
        }
        this.poopReloadTimer = 0;
      }
      
      // Controls while perched: Up/W to stay, Space or Down to drop
      if (keys['Space'] || touchInput.flap) {
        this.flap();
        touchInput.flap = false; // Consume tap
      }
      return;
    }

    // PHYSICS & FLIGHT
    // Input Handling
    let moveX = 0;
    if (keys['ArrowLeft'] || keys['KeyA'] || touchInput.left) moveX = -1;
    if (keys['ArrowRight'] || keys['KeyD'] || touchInput.right) moveX = 1;

    let moveY = 0;
    if (keys['ArrowUp'] || keys['KeyW'] || touchInput.up) moveY = -1;
    if (keys['ArrowDown'] || keys['KeyS'] || touchInput.down) moveY = 1;

    // Movement speed settings
    const speed = 4.5 * this.speedMult;
    this.vx = moveX * speed;

    const vertSpeed = 3.5 * this.speedMult;

    // Flapping
    const spacePressed = keys['Space'] || touchInput.flap;
    if (spacePressed && !this.wasSpacePressed) {
      this.flap();
    }
    this.wasSpacePressed = spacePressed;
    if (touchInput.flap) touchInput.flap = false; // Reset mobile trigger immediately

    // Pooping (Down / S are now movement, so poop is Z / X / Shift)
    const poopPressed = keys['KeyZ'] || keys['KeyX'] || keys['ShiftLeft'] || keys['ShiftRight'] || touchInput.poop;
    if (poopPressed && !this.wasPoopPressed) {
      this.poop();
    }
    this.wasPoopPressed = poopPressed;
    if (touchInput.poop) touchInput.poop = false;

    // Land on wire logic (when pressing Up/W or sliding near wire)
    const upPressed = keys['ArrowUp'] || keys['KeyW'] || touchInput.up;

    // Glide vs Fall physics
    if (this.stamina > 0) {
      if (moveY !== 0) {
        this.vy = moveY * vertSpeed;
        this.stamina -= 0.08; // Steering vertically takes a tiny bit of extra stamina
      } else {
        // Glide physics: constant slow sink rate
        if (this.vy < 0.8) {
          this.vy += 0.22; // gravity to slow down upward thrust
        } else {
          this.vy = 0.8; // constant slow glide sink rate
        }
      }
    } else {
      // Out of stamina: fall fast
      this.vy += 0.35; // strong gravity
      if (this.vy > 8) this.vy = 8; // terminal velocity
    }
    
    // Position Update
    this.x += this.vx;
    this.y += this.vy;
    
    // Bounds check
    if (this.x < this.radius) this.x = this.radius;
    if (this.x > GAME_WIDTH - this.radius) this.x = GAME_WIDTH - this.radius;
    
    // Sky boundary
    if (this.y < this.radius) {
      this.y = this.radius;
      this.vy = 0;
    }

    // Ground collision (Game Over)
    if (this.y > GAME_HEIGHT - 65 - this.radius) {
      this.y = GAME_HEIGHT - 65 - this.radius;
      this.vy = 0;
      this.stamina = 0; // Out of stamina on ground
      triggerGameOver();
    }

    // Passive stamina loss in flight
    this.stamina -= 0.05;
    if (this.stamina < 0) this.stamina = 0;

    // Passive poop reloading (slower than perching)
    this.poopReloadTimer += 0.2 * skin.poopReloadMult;
    if (this.poopReloadTimer >= 60) {
      if (this.poopAmmo < this.poopMax) {
        this.poopAmmo++;
      }
      this.poopReloadTimer = 0;
    }

    // Calculate rotation based on velocities
    this.rotation = this.vy * 0.04;
    if (this.rotation > 0.6) this.rotation = 0.6;
    if (this.rotation < -0.4) this.rotation = -0.4;
  }

  takeDamage(amount) {
    if (this.hurtTimer > 0) return; // Invincible brief period
    this.stamina -= amount;
    this.hurtTimer = 45; // blink frames
    audio.playDamage();

    // Spawn loss of feathers
    for (let i = 0; i < 6; i++) {
      particles.push(new FeatherParticle(
        this.x, this.y, 
        (Math.random() - 0.5) * 6, 
        (Math.random() - 0.5) * 6 - 2, 
        gameData.activeSkin
      ));
    }

    if (this.stamina <= 0) {
      this.stamina = 0;
      triggerGameOver();
    }
  }

  draw() {
    if (this.hurtTimer > 0 && Math.floor(gameTime / 4) % 2 === 0) {
      return; // Skip drawing to blink
    }

    const skin = SKINS[gameData.activeSkin] || SKINS.normal;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Direction (always looking right, but slight horizontal offset)
    const dir = 1;

    // Pink feet
    ctx.fillStyle = '#ff8282';
    ctx.beginPath();
    ctx.ellipse(-6, 16, 3, 5, Math.PI/6, 0, Math.PI*2);
    ctx.ellipse(4, 16, 3, 5, -Math.PI/6, 0, Math.PI*2);
    ctx.fill();

    // Tail Feathers
    ctx.fillStyle = skin.colorWing;
    ctx.beginPath();
    ctx.moveTo(-16, 6);
    ctx.lineTo(-28, 14);
    ctx.lineTo(-24, 0);
    ctx.closePath();
    ctx.fill();

    // Body (Pigeon blue/grey oval)
    ctx.fillStyle = skin.colorBody;
    ctx.beginPath();
    ctx.ellipse(0, 4, 18, 13, 0, 0, Math.PI*2);
    ctx.fill();

    // Neck ring (teal metallic green sheen)
    ctx.fillStyle = skin.colorNeck;
    ctx.beginPath();
    ctx.ellipse(8, -6, 8, 7, Math.PI/4, 0, Math.PI*2);
    ctx.fill();

    // Head
    ctx.fillStyle = skin.colorBody;
    ctx.beginPath();
    ctx.arc(12, -12, 9, 0, Math.PI*2);
    ctx.fill();

    // Beak (gold/yellow)
    ctx.fillStyle = '#ffb8b8';
    ctx.beginPath();
    ctx.moveTo(19, -15);
    ctx.lineTo(26, -12);
    ctx.lineTo(19, -9);
    ctx.closePath();
    ctx.fill();

    // Eye (orange outer, black inner)
    ctx.fillStyle = '#ff7675';
    ctx.beginPath();
    ctx.arc(13, -14, 2.5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(13.5, -14, 1.2, 0, Math.PI*2);
    ctx.fill();
    
    // Head Bobbing Beak Spot (white cere)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(18, -14, 1.5, 0, Math.PI*2);
    ctx.fill();

    // Wing
    ctx.save();
    ctx.translate(-4, -1);
    ctx.rotate(this.wingAngle);
    ctx.fillStyle = skin.colorWing;
    ctx.beginPath();
    ctx.ellipse(0, 2, 12, 7, -Math.PI/12, 0, Math.PI*2);
    ctx.fill();
    // Accent wing feathers lines
    ctx.strokeStyle = '#2d3436';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-6, 2);
    ctx.lineTo(6, 0);
    ctx.moveTo(-6, 5);
    ctx.lineTo(4, 3);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}

// Poop Bullet
class PoopBullet {
  constructor(x, y, vx, vy, type) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = type === 'cyber' ? 5 : (type === 'gold' ? 6 : 5);
    this.type = type;
    this.gravity = 0.25;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    
    // Spawn drip particles
    if (Math.random() < 0.2) {
      let dripCol = '#ffffff';
      if (this.type === 'gold') dripCol = '#fed330';
      if (this.type === 'cyber') dripCol = '#18dcff';
      particles.push(new DripParticle(this.x, this.y, dripCol));
    }
  }

  draw() {
    ctx.save();
    if (this.type === 'gold') {
      ctx.fillStyle = '#fed330';
      ctx.shadowColor = '#fed330';
      ctx.shadowBlur = 8;
    } else if (this.type === 'cyber') {
      ctx.fillStyle = '#18dcff';
      ctx.shadowColor = '#18dcff';
      ctx.shadowBlur = 8;
    } else {
      ctx.fillStyle = '#ffffff'; // White bird poop outer
    }

    ctx.beginPath();
    // Tear shape
    ctx.moveTo(this.x, this.y - this.radius);
    ctx.quadraticCurveTo(this.x + this.radius, this.y + this.radius * 0.5, this.x, this.y + this.radius);
    ctx.quadraticCurveTo(this.x - this.radius, this.y + this.radius * 0.5, this.x, this.y - this.radius);
    ctx.closePath();
    ctx.fill();

    // Inner core color
    if (this.type === 'normal') {
      ctx.fillStyle = '#8a6d3b'; // Brown poop core
      ctx.beginPath();
      ctx.arc(this.x - 1, this.y + 1, this.radius * 0.5, 0, Math.PI*2);
      ctx.fill();
    } else if (this.type === 'cyber') {
      ctx.fillStyle = '#0a3d62';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// --- LANDMARKS / WIRE GRID ---
class Landmark {
  constructor(x, type) {
    this.x = x;
    this.type = type; // 'pole', 'lamp', 'sign'
    this.width = 40;
    this.height = type === 'pole' ? 320 : 180;
    this.y = GAME_HEIGHT - 65 - this.height;
  }

  update() {
    this.x -= gameSpeed;
  }

  draw() {
    ctx.save();
    ctx.strokeStyle = '#2f3542';
    ctx.fillStyle = '#57606f';
    ctx.lineWidth = 3;

    if (this.type === 'pole') {
      // Telephone Pole
      ctx.fillRect(this.x + 16, this.y, 8, this.height);
      ctx.strokeRect(this.x + 16, this.y, 8, this.height);
      
      // Horizontal crossbars
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(this.x, this.y + 15, this.width, 6);
      ctx.fillRect(this.x + 4, this.y + 35, this.width - 8, 6);
      
      // Insulators (white knobs)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.x + 2, this.y + 9, 4, 6);
      ctx.fillRect(this.x + 34, this.y + 9, 4, 6);
      ctx.fillRect(this.x + 6, this.y + 29, 4, 6);
      ctx.fillRect(this.x + 30, this.y + 29, 4, 6);

    } else if (this.type === 'lamp') {
      // Streetlight
      ctx.fillStyle = '#3f4654';
      ctx.fillRect(this.x + 18, this.y, 4, this.height);
      
      // Curved lamp arm
      ctx.beginPath();
      ctx.moveTo(this.x + 20, this.y);
      ctx.quadraticCurveTo(this.x + 20, this.y - 20, this.x - 10, this.y - 20);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#3f4654';
      ctx.stroke();

      // Light shade
      ctx.fillStyle = '#747d8c';
      ctx.fillRect(this.x - 16, this.y - 24, 16, 8);
      
      // Glow bulb
      ctx.fillStyle = '#ffeaa7';
      ctx.shadowColor = '#ffeaa7';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(this.x - 8, this.y - 14, 5, 3, 0, 0, Math.PI*2);
      ctx.fill();

    }
    ctx.restore();
  }
}

// Telephone wires connecting poles
class Wire {
  constructor(y) {
    this.y = y; // Height of the wire
  }

  draw() {
    ctx.save();
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 1.5;
    
    // Draw wire sagging across the screen
    ctx.beginPath();
    ctx.moveTo(0, this.y);
    ctx.quadraticCurveTo(GAME_WIDTH / 2, this.y + 12, GAME_WIDTH, this.y);
    ctx.stroke();
    
    ctx.restore();
  }
}

// --- ENEMIES ---
// Crow (flies horizontally, bobs)
class Crow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.speed = 2 + Math.random() * 2;
    this.bobFreq = 0.05 + Math.random() * 0.05;
    this.bobAmp = 15;
    this.startY = y;
    this.wingCycle = 0;
  }

  update() {
    this.x -= (gameSpeed + this.speed);
    this.y = this.startY + Math.sin(gameTime * this.bobFreq) * this.bobAmp;
    this.wingCycle += 0.2;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Body (dark crow violet-black)
    ctx.fillStyle = '#2f3542';
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI*2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(-11, -5, 7, 0, Math.PI*2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#ffa502';
    ctx.beginPath();
    ctx.moveTo(-18, -6);
    ctx.lineTo(-24, -3);
    ctx.lineTo(-18, 0);
    ctx.closePath();
    ctx.fill();

    // Red eye (mean looking)
    ctx.fillStyle = '#ff4757';
    ctx.beginPath();
    ctx.arc(-12, -7, 1.5, 0, Math.PI*2);
    ctx.fill();

    // Wings Flapping (draw polygon or ellipses)
    ctx.fillStyle = '#1e272e';
    ctx.beginPath();
    const wingY = Math.sin(this.wingCycle) * 12;
    ctx.ellipse(2, 0, 8, Math.abs(wingY), Math.PI/6 * (wingY > 0 ? 1 : -1), 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }
}

// Cat (waits on ground, pounces when pigeon gets close)
class Cat {
  constructor(x) {
    this.x = x;
    this.y = GAME_HEIGHT - 65 - 24; // sitting on ground
    this.width = 32;
    this.height = 24;
    this.pouncing = false;
    this.vy = 0;
    this.vx = 0;
    this.crouching = false;
    this.crouchTimer = 0;
    this.radius = 18;
    this.color = ['#ff7f50', '#a4b0be', '#333333'][Math.floor(Math.random() * 3)];
    this.hasScreamed = false;
  }

  update() {
    // Normal scroll
    if (!this.pouncing && !this.crouching) {
      this.x -= gameSpeed;
      
      // Check distance to pigeon
      const dx = pigeon.x - this.x;
      const dy = pigeon.y - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // If pigeon is within pouncing range horizontally and overhead
      if (this.x < GAME_WIDTH + 50 && dx < 220 && dx > -50 && pigeon.y < this.y - 50) {
        this.crouching = true;
        this.crouchTimer = 25; // crouch before jump
      }
    } else if (this.crouching) {
      this.x -= gameSpeed;
      this.crouchTimer--;
      if (this.crouchTimer <= 0) {
        this.crouching = false;
        this.pouncing = true;
        
        // JUMP! Aim at pigeon's current height
        this.vy = -12 - Math.random() * 4;
        this.vx = -1 - Math.random() * 2;
      }
    } else if (this.pouncing) {
      // Pounce action
      this.vy += 0.4; // gravity on cat
      this.x += this.vx - gameSpeed;
      this.y += this.vy;

      if (!this.hasScreamed && Math.abs(pigeon.x - this.x) < 100) {
        this.hasScreamed = true;
        // Spawn meow reaction bubble
        particles.push(new TextBubbleParticle(this.x, this.y - 15, "ニャー！🐾", "#ff4757"));
      }

      // Hit ground
      if (this.y > GAME_HEIGHT - 65 - 24) {
        this.y = GAME_HEIGHT - 65 - 24;
        this.vy = 0;
        this.vx = 0;
        this.pouncing = false;
        this.hasScreamed = false;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + 16, this.y + 12);
    
    // Draw body
    ctx.fillStyle = this.color;
    
    if (this.crouching) {
      // Squashed body
      ctx.fillRect(-18, 2, 34, 10);
      // Head low
      ctx.beginPath();
      ctx.arc(-14, 0, 8, 0, Math.PI*2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(-18, -6); ctx.lineTo(-17, 2); ctx.lineTo(-12, -2);
      ctx.moveTo(-12, -6); ctx.lineTo(-11, 2); ctx.lineTo(-7, -2);
      ctx.fill();
    } else {
      // Normal/Jump shape
      ctx.beginPath();
      ctx.ellipse(0, 0, 16, 11, this.vy * 0.05, 0, Math.PI*2);
      ctx.fill();
      
      // Legs
      ctx.fillRect(-12, 6, 4, 6);
      ctx.fillRect(8, 6, 4, 6);

      // Head
      ctx.beginPath();
      ctx.arc(-12, -6, 9, 0, Math.PI*2);
      ctx.fill();
      
      // Ears
      ctx.beginPath();
      ctx.moveTo(-17, -13); ctx.lineTo(-15, -4); ctx.lineTo(-10, -9);
      ctx.moveTo(-10, -13); ctx.lineTo(-9, -4); ctx.lineTo(-5, -9);
      ctx.fill();
      
      // Face details
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-14, -7, 1.5, 0, Math.PI*2);
      ctx.arc(-10, -7, 1.5, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#ff7f50';
      ctx.fillRect(-12, -5, 1, 1); // Nose

      // Tail
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.quadraticCurveTo(24, -10 + Math.sin(gameTime*0.15)*5, 20, -18);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// --- COLLECTIBLES (Breadcrumbs & Beans) ---
class Breadcrumb {
  constructor(x, y, isBean = false) {
    this.x = x;
    this.y = y;
    this.isBean = isBean;
    this.radius = isBean ? 9 : 7;
    this.pulse = Math.random() * Math.PI;
  }

  update() {
    this.x -= gameSpeed;
    this.pulse += 0.08;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Scale pulse effect
    const scale = 1 + Math.sin(this.pulse) * 0.12;
    ctx.scale(scale, scale);

    if (this.isBean) {
      // Green bean
      ctx.fillStyle = '#2ed573';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 4, Math.PI/4, 0, Math.PI*2);
      ctx.fill();
      // Glow
      ctx.shadowColor = '#2ed573';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      // Golden bread crumb
      ctx.fillStyle = '#ffa502';
      ctx.beginPath();
      // Hexagon / irregular shape crumb
      ctx.moveTo(0, -6);
      ctx.lineTo(6, -3);
      ctx.lineTo(5, 4);
      ctx.lineTo(-2, 6);
      ctx.lineTo(-6, 1);
      ctx.lineTo(-4, -4);
      ctx.closePath();
      ctx.fill();
      
      // Crumb details
      ctx.fillStyle = '#ff7f50';
      ctx.beginPath();
      ctx.arc(-2, -1, 1.5, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// --- TARGETS (Pedestrians & Cars) ---
const REACT_TEXTS = [
  'ぎゃああ！😱', '最悪だー！💢', '何するんだコラ！😡', 
  'ウンがついた…？✨', 'お気に入りの服が😭', 
  'またハトか！🐦', 'うわっちゃ！💦'
];

class Pedestrian {
  constructor(x) {
    this.x = x;
    this.y = GAME_HEIGHT - 65 - 42; // Standing height
    this.width = 24;
    this.height = 42;
    this.speed = 1 + Math.random() * 1.2;
    this.walkCycle = Math.random() * Math.PI;
    this.splatted = false;
    this.splatTimer = 0;
    this.splatColor = '#ffffff';
    this.reactionText = '';
    
    // Custom appearance
    this.type = Math.floor(Math.random() * 4); // 4 styles
    this.colorHat = ['#ff4757', '#2ed573', '#1e272e', 'none'][Math.floor(Math.random() * 4)];
    this.colorShirt = ['#54a0ff', '#f39c12', '#9b59b6', '#1dd1a1'][Math.floor(Math.random() * 4)];
  }

  update() {
    this.x -= (gameSpeed + this.speed);
    this.walkCycle += 0.15;
    
    if (this.splatted) {
      this.speed = 0.2; // Slow down in shock
      this.splatTimer--;
      if (this.splatTimer <= 0) {
        this.splatted = false;
        this.reactionText = '';
      }
    }
  }

  hitByPoop(poopType) {
    if (this.splatted) return; // Already hit recently
    this.splatted = true;
    this.splatTimer = 180; // 3 seconds reaction
    
    let points = 100;
    this.splatColor = '#ffffff';
    if (poopType === 'gold') {
      points = 300;
      this.splatColor = '#fed330';
    } else if (poopType === 'cyber') {
      points = 200;
      this.splatColor = '#18dcff';
    }
    
    score += points;
    audio.playSplat();
    
    // Pick random reaction text
    this.reactionText = REACT_TEXTS[Math.floor(Math.random() * REACT_TEXTS.length)];

    // Float points text
    particles.push(new TextBubbleParticle(this.x + 10, this.y - 20, `+${points}`, this.splatColor, 20));
    
    // Splat splatter particles
    for (let i = 0; i < 8; i++) {
      particles.push(new SplatParticle(
        this.x + 12 + (Math.random() * 6 - 3), 
        this.y + 4 + (Math.random() * 6 - 3), 
        (Math.random() - 0.5) * 5, 
        (Math.random() - 1) * 4, 
        this.splatColor
      ));
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    const legAngle = Math.sin(this.walkCycle) * 12;

    // Drawing legs (stick-like but smooth)
    ctx.strokeStyle = '#2f3542';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    // Leg 1
    ctx.moveTo(8, 30);
    ctx.lineTo(8 - legAngle*0.5, 42);
    // Leg 2
    ctx.moveTo(16, 30);
    ctx.lineTo(16 + legAngle*0.5, 42);
    ctx.stroke();

    // Torso (Shirt)
    ctx.fillStyle = this.colorShirt;
    ctx.fillRect(4, 14, 16, 18);
    ctx.strokeStyle = '#2f3542';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 14, 16, 18);

    // Head
    ctx.fillStyle = '#ffdbb5';
    ctx.beginPath();
    ctx.arc(12, 7, 7, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();

    // Hair or Hat
    if (this.colorHat !== 'none') {
      ctx.fillStyle = this.colorHat;
      ctx.beginPath();
      ctx.arc(12, 4, 7.5, Math.PI, 0); // half dome hat
      ctx.fill();
      ctx.fillRect(4, 3, 16, 2); // visor
    }

    // Splat overlay if hit
    if (this.splatted) {
      ctx.fillStyle = this.splatColor;
      ctx.shadowColor = this.splatColor;
      ctx.shadowBlur = this.splatTimer > 150 ? 5 : 0;
      
      // Splat mess on head/body
      ctx.beginPath();
      ctx.arc(12, 3, 5, 0, Math.PI*2);
      ctx.arc(7, 5, 3, 0, Math.PI*2);
      ctx.arc(17, 4, 3.5, 0, Math.PI*2);
      ctx.fill();
      
      // Small dripping down body
      ctx.fillRect(10, 8, 3, 10);
      ctx.fillRect(7, 14, 2, 6);
      
      // Draw Reaction Text Bubble
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#2f3542';
      ctx.lineWidth = 1.5;
      
      const textWidth = ctx.measureText(this.reactionText).width;
      const bubbleW = textWidth + 12;
      const bubbleH = 20;
      const bubbleX = 12 - bubbleW / 2;
      const bubbleY = -30;
      
      ctx.beginPath();
      ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 6);
      // Triangle pointer pointing to head
      ctx.moveTo(12 - 4, bubbleY + bubbleH);
      ctx.lineTo(12, bubbleY + bubbleH + 5);
      ctx.lineTo(12 + 4, bubbleY + bubbleH);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#2f3542';
      ctx.font = '10px var(--font-game)';
      ctx.textAlign = 'center';
      ctx.fillText(this.reactionText, 12, bubbleY + 14);
    }

    ctx.restore();
  }
}

// Car Target
class Car {
  constructor(x) {
    this.x = x;
    this.y = GAME_HEIGHT - 65 - 28; // Driving lane
    this.width = 65;
    this.height = 28;
    this.speed = 1.5 + Math.random() * 2;
    this.color = ['#ff4757', '#54a0ff', '#1dd1a1', '#feca57'][Math.floor(Math.random() * 4)];
    this.splatted = false;
    this.splatTimer = 0;
    this.splatColor = '#ffffff';
    this.splatX = 0;
  }

  update() {
    this.x -= (gameSpeed + this.speed);
    if (this.splatted) {
      this.splatTimer--;
      if (this.splatTimer <= 0) {
        this.splatted = false;
      }
    }
  }

  hitByPoop(poopType) {
    if (this.splatted) return;
    this.splatted = true;
    this.splatTimer = 180;
    this.splatX = 20 + Math.random() * 25; // hit position on windshield
    this.splatColor = poopType === 'gold' ? '#fed330' : (poopType === 'cyber' ? '#18dcff' : '#ffffff');
    
    const points = 150;
    score += points;
    audio.playSplat();
    
    // Float score
    particles.push(new TextBubbleParticle(this.x + this.splatX, this.y - 15, `+${points}`, this.splatColor, 20));
    
    // Splat particles
    for (let i = 0; i < 6; i++) {
      particles.push(new SplatParticle(
        this.x + this.splatX + (Math.random() * 6 - 3), 
        this.y + 4 + (Math.random() * 6 - 3), 
        (Math.random() - 0.5) * 6, 
        (Math.random() - 1) * 3, 
        this.splatColor
      ));
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Wheels
    ctx.fillStyle = '#2f3542';
    ctx.beginPath();
    ctx.arc(14, 28, 7, 0, Math.PI*2);
    ctx.arc(50, 28, 7, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#a4b0be';
    ctx.beginPath();
    ctx.arc(14, 28, 3, 0, Math.PI*2);
    ctx.arc(50, 28, 3, 0, Math.PI*2);
    ctx.fill();

    // Lower Body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(0, 8, this.width, 18, 5);
    ctx.fill();
    ctx.strokeStyle = '#2f3542';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Cabin/Windshield dome
    ctx.fillStyle = '#70a1ff'; // Windshield blue
    ctx.beginPath();
    ctx.roundRect(12, 0, 38, 12, 4);
    ctx.fill();
    ctx.stroke();
    
    // Windshield center strut
    ctx.strokeStyle = '#2f3542';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(31, 0); ctx.lineTo(31, 12);
    ctx.stroke();

    // Headlights/Taillights
    ctx.fillStyle = '#ffeaa7'; // Front yellow light (facing left)
    ctx.fillRect(0, 11, 4, 4);
    ctx.fillStyle = '#ff7675'; // Rear red tail light
    ctx.fillRect(this.width - 4, 11, 4, 4);

    // Splat overlay on windshield
    if (this.splatted) {
      ctx.fillStyle = this.splatColor;
      ctx.shadowColor = this.splatColor;
      ctx.shadowBlur = this.splatTimer > 150 ? 5 : 0;
      
      ctx.beginPath();
      ctx.arc(this.splatX, 5, 7, 0, Math.PI*2);
      ctx.arc(this.splatX - 4, 3, 4, 0, Math.PI*2);
      ctx.arc(this.splatX + 4, 6, 5, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// --- PARTICLES ---
let particles = [];

class GlowParticle {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.vx = -gameSpeed - (0.5 + Math.random() * 1.5);
    this.vy = (Math.random() - 0.5) * 2;
    this.alpha = 1;
    this.decay = 0.02 + Math.random() * 0.03;
    this.type = type;
    this.size = 2 + Math.random() * 4;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    if (this.type === 'gold') {
      ctx.fillStyle = '#ffd32a';
      ctx.shadowColor = '#ffd32a';
    } else if (this.type === 'cyber') {
      ctx.fillStyle = '#00d8d6';
      ctx.shadowColor = '#00d8d6';
    } else { // shadow
      ctx.fillStyle = '#8c7ae6';
      ctx.shadowColor = '#8c7ae6';
    }
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

class FeatherParticle {
  constructor(x, y, vx, vy, skinType) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.15;
    this.alpha = 1.0;
    this.decay = 0.015 + Math.random() * 0.02;
    this.scale = 0.6 + Math.random() * 0.8;
    this.color = (SKINS[skinType] || SKINS.normal).colorWing;
  }

  update() {
    this.vy += 0.08; // slow drift gravity
    this.vx *= 0.98; // wind resistance
    this.x += this.vx - gameSpeed * 0.2;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = this.alpha;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 3, 0, 0, Math.PI*2);
    ctx.fill();
    
    // Spine of feather
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.lineTo(7, 0);
    ctx.stroke();
    
    ctx.restore();
  }
}

class SplatParticle {
  constructor(x, y, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 2 + Math.random() * 3;
    this.color = color;
    this.alpha = 1.0;
    this.decay = 0.02 + Math.random() * 0.03;
  }

  update() {
    this.vy += 0.2; // gravity
    this.x += this.vx - gameSpeed * 0.3;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

class DripParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.alpha = 1;
    this.decay = 0.05;
  }

  update() {
    this.y += 0.5; // slow drip
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

class TextBubbleParticle {
  constructor(x, y, text, color, life = 45) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1.0;
    this.maxLife = life;
    this.life = life;
  }

  update() {
    this.y -= 0.6; // rise up
    this.x -= gameSpeed * 0.5; // drift with background
    this.life--;
    this.alpha = this.life / this.maxLife;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    ctx.font = 'bold 11px var(--font-game)';
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// --- ENTITY LISTS ---
let landmarks = [];
let wires = [];
let enemies = [];
let collectibles = [];
let pedestrians = [];
let poopBullets = [];

let pigeon = new Pigeon();

// --- SPAWN LOGIC ---
let nextSpawnTimers = {
  landmark: 150,
  enemy: 120,
  collectible: 80,
  pedestrian: 100
};

function spawnSystems() {
  // Spawn poles/lamps and build wires dynamically
  nextSpawnTimers.landmark--;
  if (nextSpawnTimers.landmark <= 0) {
    const type = Math.random() < 0.6 ? 'pole' : 'lamp';
    const landmark = new Landmark(GAME_WIDTH + 50, type);
    landmarks.push(landmark);
    nextSpawnTimers.landmark = 160 + Math.random() * 150;
  }

  // Spawn Crows & Cats
  nextSpawnTimers.enemy--;
  if (nextSpawnTimers.enemy <= 0) {
    const isCat = Math.random() < 0.45;
    if (isCat) {
      enemies.push(new Cat(GAME_WIDTH + 50));
    } else {
      // Crow heights: between top and powerline
      const crowY = 60 + Math.random() * 550;
      enemies.push(new Crow(GAME_WIDTH + 50, crowY));
    }
    nextSpawnTimers.enemy = 120 + Math.random() * 140 - (gameSpeed * 5); // Speeds up spawn
  }

  // Spawn breadcrumbs & green beans
  nextSpawnTimers.collectible--;
  if (nextSpawnTimers.collectible <= 0) {
    const isBean = Math.random() < 0.15; // 15% green bean
    // Random height in air or on ground/wire height
    const itemY = 80 + Math.random() * 650;
    collectibles.push(new Breadcrumb(GAME_WIDTH + 50, itemY, isBean));
    nextSpawnTimers.collectible = 60 + Math.random() * 90;
  }

  // Spawn Pedestrians and Cars
  nextSpawnTimers.pedestrian--;
  if (nextSpawnTimers.pedestrian <= 0) {
    const isCar = Math.random() < 0.35;
    if (isCar) {
      pedestrians.push(new Car(GAME_WIDTH + 100));
    } else {
      pedestrians.push(new Pedestrian(GAME_WIDTH + 50));
    }
    nextSpawnTimers.pedestrian = 80 + Math.random() * 130;
  }
}

// Reset entire play state
function resetGamePlay() {
  score = 0;
  levelCrumbs = 0;
  scrollX = 0;
  gameSpeed = minGameSpeed;
  gameTime = 0;
  
  landmarks = [];
  wires = [];
  enemies = [];
  collectibles = [];
  pedestrians = [];
  poopBullets = [];
  particles = [];

  pigeon.reset();

  // Pre-spawn wires at three levels
  wires.push(new Wire(GAME_HEIGHT - 65 - 180)); // lower wire
  wires.push(new Wire(GAME_HEIGHT - 65 - 320)); // middle wire
  wires.push(new Wire(GAME_HEIGHT - 65 - 460)); // upper wire
  
  // Initial spawn timers
  nextSpawnTimers = {
    landmark: 20,
    enemy: 180,
    collectible: 40,
    pedestrian: 30
  };
}

// --- COLLISION LOGIC ---
function checkCollisions() {
  // 1. Pigeon perching on wires/landmarks
  // Only check if falling and pressing W/Up
  const landingKey = keys['ArrowUp'] || keys['KeyW'];
  if (landingKey && !pigeon.perchedOn && pigeon.vy > 0) {
    // Check telephone pole tops or lamp heads first
    for (let pole of landmarks) {
      const poleLeft = pole.x;
      const poleRight = pole.x + pole.width;
      const poleTop = pole.y;
      
      // If pigeon footprint aligns
      if (pigeon.x > poleLeft && pigeon.x < poleRight &&
          Math.abs(pigeon.y + pigeon.radius - poleTop) < 18) {
        pigeon.perchedOn = pole;
        pigeon.vy = 0;
        break;
      }
    }
    
    // If not perched on pole, check raw wire snapping
    if (!pigeon.perchedOn) {
      for (let wire of wires) {
        if (Math.abs(pigeon.y + pigeon.radius - wire.y) < 10) {
          // snap to wire
          pigeon.perchedOn = {
            x: pigeon.x - 20,
            y: wire.y,
            width: 40
          };
          pigeon.vy = 0;
          break;
        }
      }
    }
  }

  // If perching, bypass other collisions
  if (pigeon.perchedOn) return;

  // 2. Pigeon eats breadcrumbs
  for (let i = collectibles.length - 1; i >= 0; i--) {
    const item = collectibles[i];
    const dx = pigeon.x - item.x;
    const dy = pigeon.y - item.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance < pigeon.radius + item.radius) {
      // Eat bread!
      audio.playEat();
      const skin = SKINS[gameData.activeSkin] || SKINS.normal;
      
      if (item.isBean) {
        // Green bean = full stamina and poop ammo
        pigeon.stamina = pigeon.maxStamina;
        pigeon.poopAmmo = pigeon.poopMax;
        score += 250 * skin.crumbScoreMult;
        levelCrumbs += 5; // beans give 5 crumbs
        
        particles.push(new TextBubbleParticle(item.x, item.y, "STAMINA MAX! ⚡", "#2ed573", 60));
      } else {
        // Bread crumb = reload 1 poop, restore some stamina, add 1 crumb
        pigeon.stamina = Math.min(pigeon.maxStamina, pigeon.stamina + 20);
        levelCrumbs += 1;
        score += 50 * skin.crumbScoreMult;
        
        if (pigeon.poopAmmo < pigeon.poopMax) {
          pigeon.poopAmmo++;
        }
        particles.push(new TextBubbleParticle(item.x, item.y, `🍞 +${1 * skin.crumbScoreMult}`, '#ffa502'));
      }
      
      // Remove item
      collectibles.splice(i, 1);
    }
  }

  // 3. Pigeon hits enemy hazards (crows, cat swipe)
  for (let enemy of enemies) {
    let enemyRadius = enemy.radius || 15;
    
    // Offset bounding box check for jumping cats
    let enemyX = enemy.x;
    let enemyY = enemy.y;
    if (enemy instanceof Cat) {
      enemyX += 16;
      enemyY += 12;
    }
    
    const dx = pigeon.x - enemyX;
    const dy = pigeon.y - enemyY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance < pigeon.radius + enemyRadius) {
      // OUCH! Damage
      pigeon.takeDamage(25); // takes 25 damage (reduces stamina)
      
      // Bump pigeon away slightly
      pigeon.vy = -3;
      pigeon.vx = -4;
    }
  }

  // 4. Poop bullets hit targets on ground
  for (let i = poopBullets.length - 1; i >= 0; i--) {
    const bullet = poopBullets[i];
    
    // Bounds check
    if (bullet.y > GAME_HEIGHT - 65) {
      // Hit ground splat!
      audio.playSplat();
      let splatCol = bullet.type === 'gold' ? '#fed330' : (bullet.type === 'cyber' ? '#18dcff' : '#ffffff');
      
      // Splat particles
      for (let p = 0; p < 5; p++) {
        particles.push(new SplatParticle(bullet.x, GAME_HEIGHT - 65, (Math.random() - 0.5) * 4, -1.5 - Math.random() * 2, splatCol));
      }
      
      poopBullets.splice(i, 1);
      continue;
    }

    // Check pedestrians or cars collision
    for (let target of pedestrians) {
      const hitBoxLeft = target.x;
      const hitBoxRight = target.x + target.width;
      const hitBoxTop = target.y;
      const hitBoxBottom = target.y + target.height;

      if (bullet.x > hitBoxLeft && bullet.x < hitBoxRight &&
          bullet.y > hitBoxTop && bullet.y < hitBoxBottom) {
        
        target.hitByPoop(bullet.type);
        poopBullets.splice(i, 1);
        break;
      }
    }
  }
}

// --- RENDERING PARALLAX & ENVIRONMENT ---
function drawSky(time) {
  // Sky color shifts to warm gradient depending on time (simulating progressive sunset)
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  grad.addColorStop(0, '#090e17');
  grad.addColorStop(0.5, '#111b2d');
  grad.addColorStop(1, '#1e2d4a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Far star sparkles
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  for (let i = 0; i < 20; i++) {
    const sx = (i * 123 + scrollX * 0.05) % GAME_WIDTH;
    const sy = (i * 45) % (GAME_HEIGHT - 120);
    const size = Math.abs(Math.sin((gameTime + i*10) * 0.05)) * 1.5;
    ctx.fillRect(sx, sy, size, size);
  }

  // Draw background clouds (Parallax layer 1)
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i < 5; i++) {
    const cx = (i * 350 - scrollX * 0.25) % (GAME_WIDTH + 200) - 100;
    const cy = 60 + i * 25;
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI*2);
    ctx.arc(cx + 40, cy - 10, 45, 0, Math.PI*2);
    ctx.arc(cx + 80, cy, 30, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawCityscape() {
  // Parallax layer 2 (Skyscrapers silhouettes)
  ctx.fillStyle = '#101726';
  
  for (let i = 0; i < 12; i++) {
    const w = 70 + (i % 3) * 30;
    const h = 250 + (i % 4) * 110;
    const x = (i * 110 - scrollX * 0.5) % (GAME_WIDTH + w) - w;
    const y = GAME_HEIGHT - 65 - h;
    
    ctx.fillRect(x, y, w, h);
    
    // Draw some simple bright neon windows inside buildings
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let wx = x + 10; wx < x + w - 10; wx += 20) {
      for (let wy = y + 15; wy < y + h - 20; wy += 35) {
        if ((wx + wy) % 3 === 0) {
          ctx.fillStyle = 'rgba(241, 196, 15, 0.15)'; // glowing yellow window
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        }
        ctx.fillRect(wx, wy, 8, 12);
      }
    }
    ctx.fillStyle = '#101726'; // return color
  }

  // Tokyo Tower or antenna in background (far right)
  const towerX = (600 - scrollX * 0.4) % (GAME_WIDTH + 150) - 100;
  ctx.strokeStyle = '#101726';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(towerX, GAME_HEIGHT - 65);
  ctx.lineTo(towerX + 15, GAME_HEIGHT - 65 - 300);
  ctx.lineTo(towerX + 30, GAME_HEIGHT - 65);
  ctx.stroke();
  ctx.fillStyle = '#ff4757'; // red indicator blink
  if (Math.floor(gameTime / 30) % 2 === 0) {
    ctx.beginPath();
    ctx.arc(towerX + 15, GAME_HEIGHT - 65 - 302, 3, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawForegroundCity() {
  // Street ground floor background
  ctx.fillStyle = '#1e272e'; // dark pavement shadow
  ctx.fillRect(0, GAME_HEIGHT - 65, GAME_WIDTH, 65);

  // Sidewalk curb line
  ctx.strokeStyle = '#384854';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, GAME_HEIGHT - 65);
  ctx.lineTo(GAME_WIDTH, GAME_HEIGHT - 65);
  ctx.stroke();

  // Dark road stripes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 3;
  ctx.setLineDash([20, 30]);
  ctx.beginPath();
  ctx.moveTo(0 - (scrollX % 50), GAME_HEIGHT - 25);
  ctx.lineTo(GAME_WIDTH + 50, GAME_HEIGHT - 25);
  ctx.stroke();
  ctx.setLineDash([]); // clear dash
}

function drawJoystick() {
  if (!joystick.active) return;

  ctx.save();

  // Draw base (outer ring)
  ctx.beginPath();
  ctx.arc(joystick.startX, joystick.startY, joystick.maxRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(22, 26, 37, 0.55)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw crosshair indicators (faint)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(joystick.startX - joystick.maxRadius, joystick.startY);
  ctx.lineTo(joystick.startX + joystick.maxRadius, joystick.startY);
  ctx.moveTo(joystick.startX, joystick.startY - joystick.maxRadius);
  ctx.lineTo(joystick.startX, joystick.startY + joystick.maxRadius);
  ctx.stroke();

  // Draw stick (inner knob) with neon glow
  ctx.beginPath();
  ctx.arc(joystick.currentX, joystick.currentY, 20, 0, Math.PI * 2);
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(0, 242, 254, 0.6)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.95)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

// --- STATE UPDATES & GUI MENUS ---
function updateHUD() {
  const scoreEl = document.getElementById('hud-score');
  const crumbsEl = document.getElementById('hud-crumbs');
  const staminaFill = document.getElementById('stamina-fill');
  const poopFill = document.getElementById('poop-fill');
  const poopCount = document.getElementById('poop-count');

  if (scoreEl) {
    scoreEl.textContent = String(score).padStart(5, '0');
  }
  if (crumbsEl) {
    crumbsEl.textContent = levelCrumbs;
  }

  // Stamina fill %
  if (staminaFill) {
    const pct = Math.max(0, Math.min(100, (pigeon.stamina / pigeon.maxStamina) * 100));
    staminaFill.style.width = `${pct}%`;
  }

  // Poop fill %
  if (poopFill) {
    const pct = Math.max(0, Math.min(100, (pigeon.poopAmmo / pigeon.poopMax) * 100));
    poopFill.style.width = `${pct}%`;
    poopCount.textContent = `${pigeon.poopAmmo}/${pigeon.poopMax}`;
  }
}

function triggerGameOver() {
  if (currentGameState === STATE.GAMEOVER) return;
  currentGameState = STATE.GAMEOVER;
  
  audio.playGameOver();

  // Update total crumbs
  gameData.crumbs += levelCrumbs;
  
  // High score check
  if (score > gameData.highScore) {
    gameData.highScore = score;
  }
  
  saveGameData();

  // Reset tab view state to Results tab
  document.getElementById('tab-results').classList.add('active');
  document.getElementById('tab-leaderboard').classList.remove('active');
  document.getElementById('tab-content-results').classList.remove('hidden');
  document.getElementById('tab-content-leaderboard').classList.add('hidden');

  // Show Game Over Overlay
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-crumbs').textContent = levelCrumbs;
  document.getElementById('high-score').textContent = gameData.highScore;

  // Load ranking from server, check qualification and populate leaderboard
  loadRanking(() => {
    const isQualified = checkRankingQualification(score);
    const registerBox = document.getElementById('ranking-register-box');
    const commentInput = document.getElementById('player-comment-input');
    if (isQualified) {
      document.getElementById('player-name-input').value = '';
      if (commentInput) commentInput.value = '';
      if (registerBox) registerBox.classList.remove('hidden');
    } else {
      if (registerBox) registerBox.classList.add('hidden');
    }
    populateLeaderboard();
  });

  document.getElementById('hud').classList.add('hidden');
  document.getElementById('mobile-controls').classList.add('hidden');
  document.getElementById('game-over-screen').classList.remove('hidden');
}

// --- SHOP / UPGRADES ACTIONS ---
function initShopUI() {
  const shopCrumbs = document.getElementById('shop-crumb-count');
  if (shopCrumbs) {
    shopCrumbs.textContent = gameData.crumbs;
  }

  // Renders all upgrade elements
  const renderUpgrades = () => {
    // Stamina Level
    const lvlStamina = document.getElementById('lvl-stamina');
    if (lvlStamina) lvlStamina.textContent = gameData.upgrades.stamina;
    const btnStamina = document.querySelector('[data-upgrade="stamina"] .upgrade-btn');
    if (btnStamina) {
      const cost = 15 * gameData.upgrades.stamina;
      if (gameData.upgrades.stamina >= 5) {
        btnStamina.textContent = 'MAX';
        btnStamina.classList.add('maxed');
      } else {
        btnStamina.textContent = `🍞 ${cost}`;
        btnStamina.classList.remove('maxed');
      }
    }

    // Poop Capacity Level
    const lvlPoop = document.getElementById('lvl-poop');
    if (lvlPoop) lvlPoop.textContent = gameData.upgrades.poop;
    const btnPoop = document.querySelector('[data-upgrade="poop"] .upgrade-btn');
    if (btnPoop) {
      const cost = 20 * gameData.upgrades.poop;
      if (gameData.upgrades.poop >= 5) {
        btnPoop.textContent = 'MAX';
        btnPoop.classList.add('maxed');
      } else {
        btnPoop.textContent = `🍞 ${cost}`;
        btnPoop.classList.remove('maxed');
      }
    }

    // Fly Speed Level
    const lvlSpeed = document.getElementById('lvl-speed');
    if (lvlSpeed) lvlSpeed.textContent = gameData.upgrades.speed;
    const btnSpeed = document.querySelector('[data-upgrade="speed"] .upgrade-btn');
    if (btnSpeed) {
      const cost = 25 * gameData.upgrades.speed;
      if (gameData.upgrades.speed >= 5) {
        btnSpeed.textContent = 'MAX';
        btnSpeed.classList.add('maxed');
      } else {
        btnSpeed.textContent = `🍞 ${cost}`;
        btnSpeed.classList.remove('maxed');
      }
    }
  };

  // Render skin cards state (lock, unlock, select)
  const renderSkins = () => {
    const cards = document.querySelectorAll('.skin-card');
    cards.forEach(card => {
      const skinId = card.getAttribute('data-skin');
      const skinBtn = card.querySelector('.skin-btn');
      
      card.classList.remove('active', 'locked');

      if (gameData.activeSkin === skinId) {
        card.classList.add('active');
        skinBtn.textContent = '使用中';
        skinBtn.disabled = true;
        skinBtn.className = 'skin-btn select-btn';
      } else if (gameData.unlockedSkins.includes(skinId)) {
        skinBtn.textContent = '選ぶ';
        skinBtn.disabled = false;
        skinBtn.className = 'skin-btn select-btn';
      } else {
        card.classList.add('locked');
        const cost = card.getAttribute('data-cost');
        skinBtn.textContent = `🍞 ${cost}`;
        skinBtn.disabled = false;
        skinBtn.className = 'skin-btn unlock-btn';
      }
    });
  };

  renderUpgrades();
  renderSkins();

  // Click handler for unlocking/selecting skins
  document.querySelectorAll('.skin-card').forEach(card => {
    const btn = card.querySelector('.skin-btn');
    // Remove cloned listener workaround:
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      audio.init();
      const skinId = card.getAttribute('data-skin');
      const cost = parseInt(card.getAttribute('data-cost') || '0', 10);

      if (gameData.unlockedSkins.includes(skinId)) {
        // Just select it
        gameData.activeSkin = skinId;
        saveGameData();
        renderSkins();
      } else {
        // Buy skin
        if (gameData.crumbs >= cost) {
          gameData.crumbs -= cost;
          gameData.unlockedSkins.push(skinId);
          gameData.activeSkin = skinId;
          saveGameData();
          shopCrumbs.textContent = gameData.crumbs;
          renderSkins();
          audio.playEat(); // Buy sound
        } else {
          alert('パンくずが足りません！');
        }
      }
    });
  });

  // Upgrades event bindings
  document.querySelectorAll('.upgrade-item').forEach(item => {
    const btn = item.querySelector('.upgrade-btn');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
      audio.init();
      const type = item.getAttribute('data-upgrade');
      const currentLvl = gameData.upgrades[type];
      
      if (currentLvl >= 5) return; // Maxed out

      let cost = 0;
      if (type === 'stamina') cost = 15 * currentLvl;
      if (type === 'poop') cost = 20 * currentLvl;
      if (type === 'speed') cost = 25 * currentLvl;

      if (gameData.crumbs >= cost) {
        gameData.crumbs -= cost;
        gameData.upgrades[type]++;
        saveGameData();
        shopCrumbs.textContent = gameData.crumbs;
        renderUpgrades();
        audio.playEat();
      } else {
        alert('パンくずが足りません！');
      }
    });
  });
}

// --- BUTTONS EVENTS SETUP ---
function setupUIEvents() {
  // Main start button
  document.getElementById('btn-start').addEventListener('click', () => {
    audio.init();
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    
    // Check if touch display needed
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.getElementById('mobile-controls').classList.remove('hidden');
    }

    currentGameState = STATE.PLAYING;
    resetGamePlay();
  });

  // Shop navigation
  document.getElementById('btn-shop-open').addEventListener('click', () => {
    audio.init();
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('shop-screen').classList.remove('hidden');
    currentGameState = STATE.SHOP;
    initShopUI();
  });

  document.getElementById('btn-shop-close').addEventListener('click', () => {
    audio.init();
    document.getElementById('shop-screen').classList.add('hidden');
    document.getElementById('title-screen').classList.remove('hidden');
    currentGameState = STATE.MENU;
  });

  // Restart Button
  document.getElementById('btn-restart').addEventListener('click', () => {
    audio.init();
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.getElementById('mobile-controls').classList.remove('hidden');
    }
    currentGameState = STATE.PLAYING;
    resetGamePlay();
  });

  // Back to Menu Button
  document.getElementById('btn-menu-back').addEventListener('click', () => {
    audio.init();
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('title-screen').classList.remove('hidden');
    currentGameState = STATE.MENU;
  });

  // Mute Audio Toggle
  document.getElementById('btn-audio-toggle').addEventListener('click', () => {
    audio.init();
    audio.muted = !audio.muted;
    document.getElementById('btn-audio-toggle').textContent = audio.muted ? '🔇' : '🔊';
  });

  // --- Game Over Tabs & Leaderboard Event Handlers ---
  const tabResults = document.getElementById('tab-results');
  const tabLeaderboard = document.getElementById('tab-leaderboard');
  const contentResults = document.getElementById('tab-content-results');
  const contentLeaderboard = document.getElementById('tab-content-leaderboard');

  if (tabResults && tabLeaderboard) {
    tabResults.addEventListener('click', () => {
      audio.init();
      tabResults.classList.add('active');
      tabLeaderboard.classList.remove('active');
      contentResults.classList.remove('hidden');
      contentLeaderboard.classList.add('hidden');
    });

    tabLeaderboard.addEventListener('click', () => {
      audio.init();
      tabLeaderboard.classList.add('active');
      tabResults.classList.remove('active');
      contentLeaderboard.classList.remove('hidden');
      contentResults.classList.add('hidden');
      populateLeaderboard();
    });
  }

  // Submit high score to ranking
  const btnSubmit = document.getElementById('btn-submit-score');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      audio.init();
      const nameInput = document.getElementById('player-name-input');
      const commentInput = document.getElementById('player-comment-input');
      const playerName = (nameInput ? nameInput.value.trim() : '') || 'ハト';
      const playerComment = commentInput ? commentInput.value.trim() : '';

      // Disable button during submission to prevent duplicate clicks
      btnSubmit.disabled = true;
      btnSubmit.textContent = '送信中...';

      // Register the score
      registerRankingScore(playerName, score, playerComment, (rank) => {
        // Re-enable button
        btnSubmit.disabled = false;
        btnSubmit.textContent = '登録 🏆';

        // Refresh table and highlight player rank
        populateLeaderboard(rank);

        // Hide registration panel
        const registerBox = document.getElementById('ranking-register-box');
        if (registerBox) registerBox.classList.add('hidden');

        // Switch to Leaderboard tab
        if (tabLeaderboard && tabResults && contentLeaderboard && contentResults) {
          tabLeaderboard.classList.add('active');
          tabResults.classList.remove('active');
          contentLeaderboard.classList.remove('hidden');
          contentResults.classList.add('hidden');
        }
      });
    });
  }
}

// --- MAIN GAME LOOP ---
function gameLoop() {
  gameTime++;

  // Clear Canvas
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (currentGameState === STATE.PLAYING) {
    // 1. SCROLLING ENVIRONMENT BACKGROUNDS
    scrollX += gameSpeed;
    
    // Gradually speed up game as score increases
    gameSpeed = minGameSpeed + Math.min(maxGameSpeed - minGameSpeed, score * 0.0001);

    // Draw Parallax Layers
    drawSky();
    drawCityscape();

    // 2. SPAWN NEW ENTITIES
    spawnSystems();

    // 3. UPDATE ENTITIES
    // Update Wires (fixed levels, just render)
    for (let wire of wires) {
      wire.draw();
    }

    // Update Landmarks (Telephone poles)
    for (let i = landmarks.length - 1; i >= 0; i--) {
      const lm = landmarks[i];
      lm.update();
      lm.draw();
      // Remove offscreen
      if (lm.x < -100) {
        if (pigeon.perchedOn === lm) {
          pigeon.perchedOn = null;
        }
        landmarks.splice(i, 1);
      }
    }

    // Update Collectibles
    for (let i = collectibles.length - 1; i >= 0; i--) {
      const item = collectibles[i];
      item.update();
      item.draw();
      if (item.x < -40) {
        collectibles.splice(i, 1);
      }
    }

    // Update Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.update();
      enemy.draw();
      if (enemy.x < -60) {
        enemies.splice(i, 1);
      }
    }

    // Update Pedestrians/Cars
    for (let i = pedestrians.length - 1; i >= 0; i--) {
      const ped = pedestrians[i];
      ped.update();
      ped.draw();
      if (ped.x < -100) {
        pedestrians.splice(i, 1);
      }
    }

    // Update Poop Bullets
    for (let i = poopBullets.length - 1; i >= 0; i--) {
      const bullet = poopBullets[i];
      bullet.update();
      bullet.draw();
      // bounds checks already handled inside checkCollisions splats, but safety:
      if (bullet.x < -40 || bullet.x > GAME_WIDTH + 40) {
        poopBullets.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0 || (p.life !== undefined && p.life <= 0)) {
        particles.splice(i, 1);
      }
    }

    // Update Pigeon Player
    pigeon.update();
    pigeon.draw();

    // 4. CHECK COLLISIONS
    checkCollisions();

    // 5. UPDATE SCORE & HUD
    score++; // points passive survival
    updateHUD();

    // Draw foreground pavement
    drawForegroundCity();
    
    // Draw virtual touch joystick
    drawJoystick();

  } else {
    // MENU OR SHOP RENDERING - Draw nice animated background screen on canvas
    scrollX += 0.5; // very slow scroll
    drawSky();
    drawCityscape();
    
    // Draw wire decorations on title
    ctx.save();
    ctx.strokeStyle = '#1e272e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 420);
    ctx.quadraticCurveTo(GAME_WIDTH / 2, 435, GAME_WIDTH, 420);
    ctx.stroke();
    ctx.restore();

    // Draw some birds floating in title screen
    ctx.fillStyle = '#101726';
    for (let i = 0; i < 4; i++) {
      const bx = (i * 300 + gameTime * 0.4) % (GAME_WIDTH + 100) - 50;
      const by = 180 + Math.sin((gameTime + i * 50) * 0.03) * 15;
      ctx.beginPath();
      // simple wings flap silhouette
      const wing = Math.sin(gameTime * 0.1 + i) * 6;
      ctx.moveTo(bx, by);
      ctx.lineTo(bx - 10, by - wing);
      ctx.lineTo(bx - 2, by + 2);
      ctx.lineTo(bx + 10, by - wing);
      ctx.closePath();
      ctx.fill();
    }
    
    drawForegroundCity();
  }

  // Schedule Next Frame
  requestAnimationFrame(gameLoop);
}

// --- INIT APP ---
window.addEventListener('load', () => {
  loadGameData();
  loadRanking();
  setupUIEvents();
  setupMobileControls();
  
  // Start loop
  requestAnimationFrame(gameLoop);
});
