const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const RANKING_FILE = path.join(__dirname, 'ranking.json');

// Helper to get initial ranking data (starts empty as requested)
function getInitialRanking() {
  return [];
}

// Read ranking from file
function readRanking() {
  if (!fs.existsSync(RANKING_FILE)) {
    const initial = getInitialRanking();
    fs.writeFileSync(RANKING_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const data = fs.readFileSync(RANKING_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse ranking file, resetting...', e);
    const initial = getInitialRanking();
    fs.writeFileSync(RANKING_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
}

// Write ranking to file
function writeRanking(data) {
  fs.writeFileSync(RANKING_FILE, JSON.stringify(data, null, 2));
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // CORS Headers for API requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // API Route: GET /api/ranking
  if (url.pathname === '/api/ranking' && req.method === 'GET') {
    const ranking = readRanking();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(ranking));
    return;
  }

  // API Route: POST /api/ranking
  if (url.pathname === '/api/ranking' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const { name, score, comment } = payload;
        
        if (typeof score !== 'number') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid score' }));
          return;
        }

        const dateStr = new Date().toLocaleDateString('ja-JP', {
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '/'); // e.g. 06/09

        const newEntry = {
          name: (name || '名無しのハト').slice(0, 8),
          score: score,
          comment: (comment || '').slice(0, 20),
          date: dateStr
        };

        let ranking = readRanking();
        ranking.push(newEntry);
        ranking.sort((a, b) => b.score - a.score);
        ranking = ranking.slice(0, 100);
        writeRanking(ranking);

        const newRank = ranking.findIndex(entry => 
          entry.name === newEntry.name && 
          entry.score === newEntry.score && 
          entry.comment === newEntry.comment && 
          entry.date === newEntry.date
        ) + 1;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ranking, rank: newRank }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
  
  // Security check: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🕊️ ハトの糞ゲー (PIGEON CRAP GAME) Server 🕊️`);
  console.log(`Running at http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- GET  /api/ranking`);
  console.log(`- POST /api/ranking`);
  console.log(`=========================================`);
});
