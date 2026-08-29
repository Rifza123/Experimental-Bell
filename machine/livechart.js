const { default: WebSocket } = await import('ws');

let hasErrorLogged = false;
const ky = '__livechart_ws__';
keys[ky] = Object.assign(
  {
    ws: null,
    interval: null,
    watchdogInterval: null,
    reconnectTimeout: null,
    connectTimeout: null,
    lastActivity: 0,
    retryCount: 0,
    isConnected: true,
    boundExp: null,
    connectWs: null,
  },
  keys[ky]
);
const RCH_SPAM_LIMIT = 60;
const RCH_SPAM_WINDOW = 60_000;
const RCH_ALERT_COOLDOWN = 5 * 60_000;

Data.ch_reaction ??= {};

const stats = Data.ch_reaction;

Object.assign(stats, {
  startedAt: stats.startedAt ?? new Date().toISOString(),
  totalReact: stats.totalReact ?? 0,
  reactSuccess: stats.reactSuccess ?? 0,
  reactError: stats.reactError ?? 0,
  lastSuccess: stats.lastSuccess ?? null,
  lastError: stats.lastError ?? null,

  perType: stats.perType ?? {},

  reactsByHour: stats.reactsByHour ?? {},

  reactsByDate: stats.reactsByDate ?? {
    daily: {},
    weekly: {},
    monthly: {},
    yearly: {},
  },

  spamGuard: stats.spamGuard ?? {
    hits: [],
    lastAlert: 0,
  },
});
const pruneObjectByDateKey = (obj, keepDays = 7) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - keepDays);
  const minKey = cutoff.toISOString().slice(0, 10);

  for (const k in obj) {
    if (k < minKey) delete obj[k];
  }
};

const pruneHourBuckets = (obj) => {
  const limit = Date.now() - 24 * 60 * 60 * 1000;
  for (const h in obj) {
    if (new Date(h + ':00:00').getTime() < limit) {
      delete obj[h];
    }
  }
};

function checkRchSpam({ Exp }) {
  const now = Date.now();
  const guard = stats.spamGuard;

  guard.hits.push(now);

  guard.hits = guard.hits.filter((t) => now - t <= RCH_SPAM_WINDOW);

  if (guard.hits.length >= RCH_SPAM_LIMIT) {
    if (now - guard.lastAlert >= RCH_ALERT_COOLDOWN) {
      guard.lastAlert = now;

      Exp.sendMessage(global.owner[0].split('@')[0] + from.sender, {
        text:
          `⚠️ *[remote] Reaction Channel SPAM TERDETEKSI*\n\n` +
          `Jumlah: ${guard.hits.length} react\n` +
          `Window: ${RCH_SPAM_WINDOW / 1000}s\n` +
          `Waktu: ${Exp.func.dateFormatter(now, 'Asia/Jakarta')}\n\n
            > Terlalu banyak melakukan reaksi ke channel, nonaktifkan dengan ketik *.set remoteReaction off* jika diperlukan`,
      });
    }
    return true;
  }
  return false;
}

const getDateKey = () => new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
const getWeekKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const week = Math.ceil(
    ((d - new Date(year, 0, 1)) / 86400000 +
      new Date(year, 0, 1).getDay() +
      1) /
      7
  );
  return `${year}-W${week}`;
};
const getMonthKey = () => new Date().toISOString().slice(0, 7); // 'YYYY-MM'
const getYearKey = () => new Date().getFullYear().toString();

const getHourKey = () => {
  const d = new Date();
  return d.toISOString().slice(0, 13);
};

function livechart({ Exp } = {}) {
  if (Exp) {
    keys[ky].boundExp = Exp;
    if (Exp.ev && (!keys[ky].hasBoundListener || keys[ky].lastExp !== Exp)) {
      keys[ky].lastExp = Exp;
      keys[ky].hasBoundListener = true;
      Exp.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open') {
          keys[ky].boundExp = Exp;
          connectWs();
        }
      });
    }
  }

  const connectWs = () => {
    const prev = keys[ky];
    if (prev.ws) {
      if (prev.ws.readyState === WebSocket.OPEN) {
        return;
      }
      if (prev.ws.readyState === WebSocket.CONNECTING) {
        return;
      }
      try {
        prev.ws.terminate();
      } catch {}
      prev.ws = null;
    }

    if (prev.reconnectTimeout) {
      clearTimeout(prev.reconnectTimeout);
      prev.reconnectTimeout = null;
    }
    if (prev.connectTimeout) {
      clearTimeout(prev.connectTimeout);
      prev.connectTimeout = null;
    }

    cfg.remoteReaction ??= true;
    Data.ch_reaction ??= {};
    const currentMonthKey = getMonthKey();
    let stats = Data.ch_reaction;

    Object.assign(stats, {
      startedAt: stats.startedAt ?? new Date().toISOString(),
      totalReact: stats.totalReact ?? 0,
      reactsByHour: stats.reactsByHour ?? {},
      reactsByDate: stats.reactsByDate ?? {
        daily: {},
        weekly: {},
        monthly: {},
        yearly: {},
      },
      perType: stats.perType ?? {},
      reactSuccess: stats.reactSuccess ?? 0,
      reactError: stats.reactError ?? 0,
      lastSuccess: stats.lastSuccess ?? null,
      lastError: stats.lastError ?? null,
      monthKey: stats.monthKey ?? currentMonthKey,
    });

    if (cfg.remoteReaction) {
      logLivechart(
        'Remote Reaction aktif. Bot bisa ikut react ke channel jika ada event tertentu.\n' +
          'Jika tidak ingin ikut, ketik: .set remoteReaction off',
        'info'
      );
    } else {
      logLivechart(
        'Remote Reaction nonaktif. Bot tidak akan ikut react ke channel.',
        'warn'
      );
    }

    const ws = new WebSocket(
      'wss://api.termai.cc/ws/search/livechart?key=' + api.xterm.key
    );

    keys[ky].ws = ws;

    keys[ky].connectTimeout = setTimeout(() => {
      if (ws.readyState === WebSocket.CONNECTING) {
        logLivechart('WebSocket connection timed out (10s), terminating...', 'warn');
        try {
          ws.terminate();
        } catch {}
      }
    }, 10000);

    ws.on('open', () => {
      if (keys[ky].connectTimeout) {
        clearTimeout(keys[ky].connectTimeout);
        keys[ky].connectTimeout = null;
      }
      keys[ky].retryCount = 0;
      keys[ky].lastActivity = Date.now();
      hasErrorLogged = false;
      logLivechart('WebSocket connected', 'success');

      if (keys[ky].interval) {
        clearInterval(keys[ky].interval);
      }
      keys[ky].interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(JSON.stringify({ type: 'ping' }));
          } catch {}
          if (Date.now() - keys[ky].lastActivity > 45000) {
            logLivechart('WebSocket ping-pong timeout (>45s unresponsive), terminating...', 'warn');
            try {
              ws.terminate();
            } catch {}
          }
        }
      }, 15000);
    });

    ws.on('message', async (msg) => {
      keys[ky].lastActivity = Date.now();
      try {
        const parsed = JSON.parse(msg);

        if (parsed.type === 'ping') {
          if (ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(JSON.stringify({ type: 'pong' }));
            } catch {}
          }
          return;
        }

        if (parsed.type === 'pong') {
          return;
        }

        switch (parsed.type) {
          case 'data':
            Data.livechart = parsed.data;
            logLivechart(
              `Received update: ${Object.keys(parsed.data).length} entries`
            );
            break;

          case 'rch': {
            if (!cfg.remoteReaction) return;
            const currentExp = keys[ky].boundExp || Exp;
            if (!currentExp) return;
            const { newsletterId, server_id, reaction } = parsed.data || {};

            if (checkRchSpam({ Exp: currentExp })) {
              logLivechart(
                '[remote] Reaction Channel skipped (spam detected)',
                'warn'
              );
              return;
            }

            try {
              await currentExp.newsletterReactMessage(newsletterId, server_id, reaction);

              const now = Date.now();
              const hourKey = getHourKey();
              const dateKey = getDateKey();

              stats.totalReact++;
              stats.reactSuccess++;
              stats.lastSuccess = currentExp.func.dateFormatter(now, 'Asia/Jakarta');

              stats.perType[reaction] ??= { count: 0, last: null };
              stats.perType[reaction].count++;
              stats.perType[reaction].last = now;

              stats.reactsByHour[hourKey] ??= { count: 0 };
              stats.reactsByHour[hourKey].count++;
              pruneHourBuckets(stats.reactsByHour);

              stats.reactsByDate.daily[dateKey] ??= { count: 0 };
              stats.reactsByDate.daily[dateKey].count++;
              pruneObjectByDateKey(stats.reactsByDate.daily, 7);

              stats.reactsByDate.weekly[getWeekKey()] ??= { count: 0 };
              stats.reactsByDate.weekly[getWeekKey()].count++;

              stats.reactsByDate.monthly[getMonthKey()] ??= { count: 0 };
              stats.reactsByDate.monthly[getMonthKey()].count++;

              stats.reactsByDate.yearly[getYearKey()] ??= { count: 0 };
              stats.reactsByDate.yearly[getYearKey()].count++;
              Data.ch_reaction = stats;
              logLivechart(
                `📡[Remote] react ${reaction} → ${newsletterId}`,
                'info'
              );
            } catch (e) {
              stats.reactError++;
              stats.lastError = currentExp.func.dateFormatter(
                Date.now(),
                'Asia/Jakarta'
              );
              Data.ch_reaction = stats;
              logLivechart(String(e), 'error');
            }
            break;
          }
        }
      } catch (err) {
        console.error(err);
        if (!hasErrorLogged) {
          hasErrorLogged = true;
          logLivechart(`Invalid JSON message`, 'error');
        }
      }
    });

    ws.on('error', (err) => {
      if (!hasErrorLogged) {
        hasErrorLogged = true;
        logLivechart(`WebSocket error: ${err.message}`, 'error');
      }
    });

    ws.on('close', () => {
      if (keys[ky].connectTimeout) {
        clearTimeout(keys[ky].connectTimeout);
        keys[ky].connectTimeout = null;
      }
      if (keys[ky].interval) {
        clearInterval(keys[ky].interval);
        keys[ky].interval = null;
      }

      if (keys[ky].ws === ws) {
        keys[ky].ws = null;
      }

      keys[ky].retryCount = Math.min((keys[ky].retryCount || 0) + 1, 5);
      const delayMs = Math.min(3000 * Math.pow(1.5, keys[ky].retryCount - 1), 15000);

      logLivechart(`WebSocket closed, reconnecting in ${(delayMs / 1000).toFixed(1)}s`, 'warn');
      if (keys[ky].reconnectTimeout) {
        clearTimeout(keys[ky].reconnectTimeout);
      }
      keys[ky].reconnectTimeout = setTimeout(() => {
        connectWs();
      }, delayMs);
    });
  };

  keys[ky].connectWs = connectWs;

  if (!keys[ky].watchdogInterval) {
    keys[ky].watchdogInterval = setInterval(() => {
      const current = keys[ky].ws;
      if (!current || current.readyState === WebSocket.CLOSED || current.readyState === WebSocket.CLOSING) {
        connectWs();
      }
    }, 20000);
  }

  connectWs();
}

async function ensureConnected(timeoutMs = 6000) {
  const state = keys[ky];
  if (state?.ws && state.ws.readyState === WebSocket.OPEN) {
    return true;
  }
  if (typeof state?.connectWs !== 'function') {
    livechart();
  } else if (!state?.ws || state.ws.readyState >= 2) {
    state.retryCount = 0;
    state.connectWs();
  }
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (keys[ky]?.ws && keys[ky].ws.readyState === WebSocket.OPEN) {
      return true;
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return keys[ky]?.ws?.readyState === WebSocket.OPEN;
}

livechart.ensureConnected = ensureConnected;

process.on('exit', () => {
  try {
    if (keys[ky]?.ws) {
      keys[ky].ws.terminate();
    }
  } catch {}
});

function logLivechart(msg, type = 'info') {
  const time = new Date().toLocaleTimeString('id-ID', { hour12: false });

  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m',
  };

  const prefix =
    {
      info: 'ℹ️',
      success: '✅',
      warn: '⚠️',
      error: '❌',
    }[type] || '📄';

  console.log(
    `${colors.reset}[${time}] ${colors[type] || colors.info}[Livechart] ${prefix} ${msg}${colors.reset}`
  );
}

export { ensureConnected };
export default livechart;
