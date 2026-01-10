/*
  Siapapun anda yang menulis kode ini, Kami berterimakasih dan menghargai karya ini
*/

const { createCanvas } = await '@napi-rs/canvas'.import();
const os = await 'os'.import();
const axios = 'axios'.import();
const { performance } = await 'perf_hooks'.import();
const { execSync } = 'child'.import();

function ensureRoundRect(ctx) {
  if (typeof ctx.roundRect === 'function') return;
  ctx.roundRect = function (x, y, w, h, r) {
    const radius = typeof r === 'number' ? { tl: r, tr: r, br: r, bl: r } : r;
    this.beginPath();
    this.moveTo(x + radius.tl, y);
    this.lineTo(x + w - radius.tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + radius.tr);
    this.lineTo(x + w, y + h - radius.br);
    this.quadraticCurveTo(x + w, y + h, x + w - radius.br, y + h);
    this.lineTo(x + radius.bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - radius.bl);
    this.lineTo(x, y + radius.tl);
    this.quadraticCurveTo(x, y, x + radius.tl, y);
    this.closePath();
    return this;
  };
}

async function runSpeedTest() {
  let downloadSpeed = 0,
    uploadSpeed = 0;

  try {
    const dlStart = performance.now();
    const dlRes = await axios.get(
      'https://speed.cloudflare.com/__down?bytes=10000000',
      {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      }
    );
    const dlTime = (performance.now() - dlStart) / 1000;
    downloadSpeed = dlRes.data.byteLength / (dlTime || 1);
  } catch {
    downloadSpeed = 0;
  }

  try {
    const upData = '0'.repeat(1024 * 1024);
    const upStart = performance.now();
    await axios.post('https://speed.cloudflare.com/__up', upData, {
      headers: { 'Content-Length': upData.length },
      timeout: 20000,
    });
    const upTime = (performance.now() - upStart) / 1000;
    uploadSpeed = upData.length / (upTime || 1);
  } catch {
    uploadSpeed = 0;
  }

  const format = (bytesPerSec) => {
    const mbps = (bytesPerSec * 8) / (1024 * 1024);
    return mbps >= 1
      ? `${mbps.toFixed(2)} Mbps`
      : `${(mbps * 1000).toFixed(2)} Kbps`;
  };

  return { dl: format(downloadSpeed), ul: format(uploadSpeed) };
}
async function Latency(samples = 3) {
  let total = 0;

  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    await axios.get('https://speed.cloudflare.com/cdn-cgi/trace', {
      timeout: 5000,
      headers: { 'Cache-Control': 'no-cache' },
    });
    total += performance.now() - start;
  }

  return total / samples;
}

function size(b) {
  const s = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(b || 1) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(2)} ${s[i]}`;
}

function fmtTime(sec) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function getDiskUsageLinux() {
  const df = execSync('df -B1 / | tail -1').toString().trim().split(/\s+/);
  const total = parseInt(df[1] || '0');
  const used = parseInt(df[2] || '0');
  const pct = parseInt(String(df[4] || '0').replace('%', ''));
  return { total, used, pct: isNaN(pct) ? 0 : pct };
}

function getDiskUsageFallback() {
  return { total: 0, used: 0, pct: 50 };
}

function buildDashboardImage(stats) {
  const {
    cpuPercent,
    cpuCores,
    cpuName,
    cpuSpeed,
    memPercent,
    usedMem,
    totalMem,
    freeMem,
    diskPercent,
    diskUsed,
    latency,
    netStats,
    botUptime,
    serverUptime,
  } = stats;

  const W = 1280;
  const H = 720;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ensureRoundRect(ctx);

  const C = {
    bg: '#000000',
    card: 'rgba(16,14,25,0.85)',
    stroke: 'rgba(152,152,219,0.3)',
    text: 'rgba(255,255,255,0.9)',
    subtext: 'rgba(255,255,255,0.6)',
    blue: 'rgba(79, 209, 255, 0.8)',
    green: 'rgba(12, 206, 107, 0.8)',
    purple: 'rgba(108, 92, 231, 0.8)',
    cyan: 'rgba(56, 189, 248, 1)',
  };

  function box(x, y, w, h, radius = 10) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fillStyle = C.card;
    ctx.fill();
    ctx.strokeStyle = C.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function circleGraph(x, y, r, pct, color, label, sub) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = C.stroke;
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.beginPath();
    const start = -Math.PI / 2;
    const end = start + Math.PI * 2 * (pct / 100);
    ctx.arc(x, y, r, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.textAlign = 'center';
    ctx.fillStyle = C.text;
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`${pct}%`, x, y + 8);

    ctx.fillStyle = C.subtext;
    ctx.font = 'bold 14px monospace';
    ctx.fillText(label, x, y + r + 30);
    ctx.fillStyle = color;
    ctx.font = '12px monospace';
    ctx.fillText(sub, x, y + r + 50);
    ctx.textAlign = 'left';
  }

  function barGraph(x, y, w, h, pct, color, label) {
    ctx.fillStyle = C.subtext;
    ctx.font = '12px monospace';
    ctx.fillText(label, x, y - 8);

    ctx.textAlign = 'right';
    ctx.fillText(`${pct}%`, x + w, y - 8);
    ctx.textAlign = 'left';

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, h / 2);
    ctx.fillStyle = C.stroke;
    ctx.fill();

    const fillW = Math.max(10, w * (pct / 100));
    ctx.beginPath();
    ctx.roundRect(x, y, fillW, h, h / 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = C.purple;
  ctx.font = 'bold 24px monospace';
  ctx.fillText('SYSTEM MONITOR', 40, 50);
  ctx.fillStyle = C.subtext;
  ctx.font = '16px monospace';
  ctx.fillText('Real-Time Performance Dashboard', 40, 75);

  ctx.textAlign = 'right';
  ctx.fillStyle = C.green;
  ctx.font = 'bold 20px monospace';
  ctx.fillText(`${latency.toFixed(2)}ms`, W - 40, 50);
  ctx.fillStyle = C.subtext;
  ctx.font = '12px monospace';
  ctx.fillText('LATENCY', W - 40, 70);
  ctx.textAlign = 'left';

  const boxY = 110;
  const boxW = 280;
  const boxH = 220;
  const gap = 26;

  box(40, boxY, boxW, boxH);
  circleGraph(
    40 + boxW / 2,
    boxY + 90,
    55,
    cpuPercent,
    C.blue,
    'CPU USAGE',
    `${cpuCores} Cores`
  );

  box(40 + boxW + gap, boxY, boxW, boxH);
  circleGraph(
    40 + boxW + gap + boxW / 2,
    boxY + 90,
    55,
    memPercent,
    C.green,
    'MEMORY',
    size(usedMem)
  );

  box(40 + (boxW + gap) * 2, boxY, boxW, boxH);
  circleGraph(
    40 + (boxW + gap) * 2 + boxW / 2,
    boxY + 90,
    55,
    diskPercent,
    C.purple,
    'STORAGE',
    size(diskUsed)
  );

  const netX = 40 + (boxW + gap) * 3;
  box(netX, boxY, boxW, boxH);
  ctx.fillStyle = C.cyan;
  ctx.font = 'bold 18px monospace';
  ctx.fillText('NETWORK SPEED', netX + 20, boxY + 40);

  ctx.fillStyle = C.subtext;
  ctx.font = '14px monospace';
  ctx.fillText('⬇ Download', netX + 20, boxY + 90);
  ctx.fillStyle = C.text;
  ctx.font = 'bold 22px monospace';
  ctx.fillText(netStats.dl, netX + 20, boxY + 115);

  ctx.fillStyle = C.subtext;
  ctx.font = '14px monospace';
  ctx.fillText('⬆ Upload', netX + 20, boxY + 160);
  ctx.fillStyle = C.text;
  ctx.font = 'bold 22px monospace';
  ctx.fillText(netStats.ul, netX + 20, boxY + 185);

  const pillY = 360;
  const pillH = 60;
  const pills = [
    { l: 'HOSTNAME', v: os.hostname(), c: C.blue },
    { l: 'PLATFORM', v: `${os.platform()} (${os.arch()})`, c: C.green },
    { l: 'BOT UPTIME', v: botUptime, c: C.purple },
    { l: 'SERVER UP', v: serverUptime, c: C.cyan },
    { l: 'NODEJS', v: process.version, c: C.blue },
  ];
  const pillW = (W - 80 - gap * (pills.length - 1)) / pills.length;

  pills.forEach((p, i) => {
    const px = 40 + (pillW + gap) * i;
    box(px, pillY, pillW, pillH, 8);

    ctx.beginPath();
    ctx.arc(px + 20, pillY + 30, 4, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.fill();

    ctx.fillStyle = C.subtext;
    ctx.font = '10px monospace';
    ctx.fillText(p.l, px + 35, pillY + 22);

    ctx.fillStyle = C.text;
    ctx.font = 'bold 14px monospace';
    ctx.fillText(p.v, px + 35, pillY + 45);
  });

  const perfY = 450;
  const perfH = 250;
  box(40, perfY, W - 80, perfH);

  ctx.fillStyle = C.text;
  ctx.font = 'bold 18px monospace';
  ctx.fillText('SYSTEM PERFORMANCE', 70, perfY + 40);
  ctx.fillStyle = C.subtext;
  ctx.font = '14px monospace';
  ctx.fillText('Real-time resource monitoring', 70, perfY + 60);

  const barX = 70;
  const barStartY = perfY + 100;
  const barW2 = 500;

  barGraph(barX, barStartY, barW2, 10, cpuPercent, C.blue, 'CPU Load');
  barGraph(
    barX,
    barStartY + 40,
    barW2,
    10,
    memPercent,
    C.green,
    'Memory Usage'
  );
  barGraph(
    barX,
    barStartY + 80,
    barW2,
    10,
    diskPercent,
    C.purple,
    'Disk Usage'
  );
  const latPct = Math.min((latency / 1000) * 100, 100);
  barGraph(
    barX,
    barStartY + 120,
    barW2,
    10,
    Math.round(latPct),
    C.cyan,
    'System Latency'
  );

  const infoX = 700;
  const infoY = perfY + 100;

  const details = [
    { k: 'OS Release', v: os.release() },
    { k: 'CPU Model', v: cpuName },
    { k: 'CPU Speed', v: cpuSpeed },
    { k: 'Total Memory', v: size(totalMem) },
    { k: 'Free Memory', v: size(freeMem) },
  ];

  details.forEach((d, i) => {
    const dy = infoY + i * 25;
    ctx.fillStyle = C.subtext;
    ctx.font = '14px monospace';
    ctx.fillText(d.k, infoX, dy);

    ctx.fillStyle = C.text;
    ctx.font = 'bold 14px monospace';
    ctx.fillText(d.v, infoX + 200, dy);
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = C.subtext;
  ctx.font = 'italic 12px monospace';
  //ctx.fillText(`Dashboard Generated: ${new Date().toLocaleString()}`, W / 2, H - 15);

  return canvas.toBuffer('image/png');
}

export async function dashboard() {
  const netStats = await runSpeedTest();

  const cpus = os.cpus();
  const cpuName = (cpus?.[0]?.model || 'Unknown CPU').split(' @')[0].trim();
  const cpuSpeed = (cpus?.[0]?.speed || 0) + ' MHz';
  const cpuCores = cpus.length || 1;

  const cpuLoad = os.loadavg?.()[0] ?? 0;
  const cpuPercent = Math.min(Math.floor((cpuLoad / cpuCores) * 100), 100);

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memPercent = Math.round((usedMem / totalMem) * 100);

  let diskTotal = 0,
    diskUsed = 0,
    diskPercent = 0;
  try {
    const d = getDiskUsageLinux();
    diskTotal = d.total;
    diskUsed = d.used;
    diskPercent = d.pct;
  } catch {
    const d = getDiskUsageFallback();
    diskTotal = d.total;
    diskUsed = d.used;
    diskPercent = d.pct;
  }

  const botUptime = fmtTime(process.uptime());
  const serverUptime = fmtTime(os.uptime());

  const tStart = process.hrtime();
  const diff = process.hrtime(tStart);
  const latency = await Latency();

  return buildDashboardImage({
    cpuPercent,
    cpuCores,
    cpuName,
    cpuSpeed,
    memPercent,
    usedMem,
    totalMem,
    freeMem,
    diskPercent,
    diskUsed,
    diskTotal,
    latency,
    netStats,
    botUptime,
    serverUptime,
  });
}
