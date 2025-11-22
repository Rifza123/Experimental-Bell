const { default: WebSocket } = await import('ws');

let ws;
let reconnectTimeout;

function livechart() {
  ws = new WebSocket(
    'wss://api.termai.cc/ws/search/livechart?key=' + api.xterm.key
  );

  ws.on('open', () => {
    logLivechart('WebSocket connected, updating data every 1 hour', 'success');

    ws.pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 60000);
  });

  ws.on('message', async (msg) => {
    try {
      const parsed = JSON.parse(msg);
      switch (parsed.type) {
        case 'data':
          Data.livechart = parsed.data;
          logLivechart(
            `Received update: ${Object.keys(parsed.data).length} entries`
          );
          break;
      }
    } catch (err) {
      logLivechart(`Error parsing message: ${err.message}`, 'error');
    }
  });

  ws.on('error', (err) => {
    logLivechart(`WebSocket error: ${err.message}`, 'error');
  });

  ws.on('close', () => {
    logLivechart('WebSocket connection closed, retrying in 5s', 'warn');
    clearInterval(ws.pingInterval);

    clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(livechart, 5000);
  });
}

function logLivechart(msg, type = 'info') {
  const time = new Date().toLocaleTimeString('id-ID', { hour12: false });

  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    reset: '\x1b[0m',
  };

  const prefix =
    {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warn: '⚠️',
    }[type] || '📄';

  const color = colors[type] || colors.info;
  console.log(
    `${colors.reset}[${time}] ${color}[Livechart] ${prefix} ${msg}${colors.reset}`
  );
}

livechart();

export default true;
