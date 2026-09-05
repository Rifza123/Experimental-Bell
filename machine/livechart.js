const { default: WebSocket } = await import('ws');
const { prepareWAMessageMedia } = await import('@whiskeysockets/baileys/lib/Utils/messages.js');
const fs = await import('fs');

let pkgVer = '2.7.0';
try {
  let pkgData = JSON.parse(fs.default.readFileSync('./package.json', 'utf8'));
  if (pkgData?.version) pkgVer = pkgData.version;
} catch {}

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

const pendingTicketCallbacks = (keys[ky].pendingTicketCallbacks ??= new Map());

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
          keys[ky].sendRegister?.();
          connectWs();
        }
      });
    }
  }

  const connectWs = () => {
    const prev = keys[ky];
    if (prev.ws) {
      if (prev.ws.readyState === WebSocket.OPEN) {
        keys[ky].sendRegister?.();
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
      keys[ky].isRegistered = false;
      hasErrorLogged = false;
      logLivechart('WebSocket connected', 'success');

      const sendRegister = () => {
        if (ws.readyState !== WebSocket.OPEN) return;
        try {
          const currentExp = keys[ky].boundExp || Exp;
          const botNumber = String(currentExp?.number || currentExp?.user?.id?.split(':')[0] || '').replace(/[^0-9]/g, '');
          if (!botNumber) return;
          const ownerNumber = String(global.owner?.[0] || botNumber).replace(/[^0-9]/g, '');
          const regData = JSON.stringify({
            botNumber,
            ownerNumber,
            version: cfg?.version || pkgVer,
            botName: cfg.botname || 'Bella Clarissa'
          }).encryptPayload();
          const token = (botNumber + ownerNumber).generateWsToken();
          ws.send(JSON.stringify({
            action: 'register',
            token,
            payload: regData
          }));
        } catch (e) {}
      };

      keys[ky].sendRegister = sendRegister;
      sendRegister();

      if (keys[ky].interval) {
        clearInterval(keys[ky].interval);
      }
      keys[ky].interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.send(JSON.stringify({ type: 'ping' }));
          } catch {}
          if (!keys[ky].isRegistered) {
            sendRegister();
          }
          if (Date.now() - keys[ky].lastActivity > 90000) {
            logLivechart('WebSocket ping-pong timeout (>90s unresponsive), terminating...', 'warn');
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
        const rawStr = typeof msg === 'string' ? msg : msg?.toString('utf8');
        if (!rawStr) return;
        const parsed = JSON.parse(rawStr);

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
          case 'registered':
            keys[ky].isRegistered = true;
            logLivechart(`Bot authenticated on TermaiApi (Bot: +${parsed.botNumber})`, 'success');
            break;

          case 'data':
            Data.livechart = parsed.data;
            logLivechart(
              `Received update: ${Object.keys(parsed.data).length} entries`
            );
            break;

          case 'rch': {
            const currentExp = keys[ky].boundExp || Exp;
            const { newsletterId, server_id, reaction, reqId } = parsed.data || {};

            const sendReactRes = (status, error = null) => {
              if (reqId && ws && ws.readyState === WebSocket.OPEN) {
                try {
                  ws.send(JSON.stringify({
                    action: 'react_res',
                    reqId,
                    status,
                    error
                  }));
                } catch {}
              }
            };

            if (!cfg.remoteReaction) {
              sendReactRes(false, 'remoteReaction_disabled');
              return;
            }
            if (!currentExp) {
              sendReactRes(false, 'exp_unavailable');
              return;
            }

            if (checkRchSpam({ Exp: currentExp })) {
              logLivechart(
                '[remote] Reaction Channel skipped (spam detected)',
                'warn'
              );
              sendReactRes(false, 'spam_detected');
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
              sendReactRes(true);
            } catch (e) {
              stats.reactError++;
              stats.lastError = currentExp.func.dateFormatter(
                Date.now(),
                'Asia/Jakarta'
              );
              Data.ch_reaction = stats;
              logLivechart(String(e), 'error');
              sendReactRes(false, e?.message || String(e));
            }
            break;
          }

          case 'error': {
            if (pendingTicketCallbacks.size > 0) {
              for (const [cbId, callback] of pendingTicketCallbacks) {
                callback({ status: false, msg: parsed.msg || 'Terjadi kesalahan' });
                pendingTicketCallbacks.delete(cbId);
                break;
              }
            }
            break;
          }

          case 'ticket_created':
          case 'get_ticket_res':
          case 'list_tickets_res':
          case 'user_update_ticket_res':
          case 'update_check_res': {
            const reqId = parsed.reqId;
            if (reqId && pendingTicketCallbacks.has(reqId)) {
              const cb = pendingTicketCallbacks.get(reqId);
              pendingTicketCallbacks.delete(reqId);
              cb(parsed);
            } else {
              for (const [cbId, callback] of pendingTicketCallbacks) {
                callback(parsed);
                pendingTicketCallbacks.delete(cbId);
                break;
              }
            }
            break;
          }

          case 'broadcast_update': {
            const rel = parsed.data;
            if (!rel || !rel.version) break;
            const currentExp = keys[ky].boundExp || Exp;
            if (!currentExp) break;
            const memories = currentExp?.func?.archiveMemories || Exp?.func?.archiveMemories;
            if (!memories) break;

            const ownerList = Array.isArray(global.owner) ? global.owner : [global.owner].filter(Boolean);
            const ownerJids = [...new Set(ownerList.map((num) => String(num).replace(/[^0-9]/g, '') + '@s.whatsapp.net'))];
            if (ownerJids.length === 0 && currentExp.number) {
              ownerJids.push(String(currentExp.number).replace(/[^0-9]/g, '') + '@s.whatsapp.net');
            }

            const rawUrls = rel.files || [];

            let fols = await (currentExp.func?.getDirectoriesRecursive?.() || Exp.func?.getDirectoriesRecursive?.() || []);
            let urlPath = rawUrls
              .map((link) => {
                try {
                  const { pathname, host } = new URL(link);
                  let f = (
                    host === 'raw.githubusercontent.com'
                      ? pathname.split('heads/')[1]
                      : pathname
                  )
                    ?.split('/')
                    ?.slice(1)
                    ?.join('/')
                    ?.split('/');
                  const filename = f.slice(-1)[0];
                  if (!filename) return null;
                  const _path = f.slice(0, -1).join('/');

                  for (const folder of fols) {
                    const folderPath = folder.split('./')[1].slice(0, -1);
                    if (folderPath.includes(_path) && _path) {
                      return [link, `${folder}${filename}`];
                    }
                    if (
                      ['index.js', 'package', 'readme.md'].some((a) =>
                        filename.includes(a)
                      )
                    ) {
                      return [link, `./${filename}`];
                    }
                  }
                  return null;
                } catch {
                  return null;
                }
              })
              .filter(Boolean);

            let fileTree = urlPath.map(([url, fpath]) => ({
              type: (fs.existsSync || fs.default?.existsSync || (() => true))(fpath) ? 'modified' : 'new',
              path: fpath,
              url
            }));

            if (!keys['update_lp_media']) {
              try {
                let rawBuf = await (currentExp?.func?.getBuffer || Exp.func.getBuffer)('https://c.termai.cc/i116/M0PLc.png');
                let resMedia = await prepareWAMessageMedia(
                  { image: rawBuf },
                  { upload: currentExp.waUploadToServer || Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
                );
                if (resMedia?.imageMessage) {
                  keys['update_lp_media'] = resMedia.imageMessage;
                  keys['update_lp_thumb'] = rawBuf;
                }
              } catch {}
            }

            let imgMsg = keys['update_lp_media'];
            let linkPreview = {
              'matched-text': 'https://termai.cc',
              title: `🔔 Experimental-Bell • Update Notification v${rel.version || 'Latest'}`,
              description: 'Termai Ecosystem • Cumulative Update Engine',
              jpegThumbnail: imgMsg?.jpegThumbnail
                ? Buffer.from(imgMsg.jpegThumbnail)
                : keys['update_lp_thumb'] || undefined,
              highQualityThumbnail: imgMsg
                ? {
                    ...imgMsg,
                    width: 1280,
                    height: 720,
                  }
                : undefined,
            };

            let majorText = Data.infos?.updateMajorNotify
              ? Data.infos.updateMajorNotify({
                  version: rel.version,
                  currentVersion: rel.currentVersion,
                  pendingCount: rel.pendingCount,
                  files: rawUrls,
                  fileTree,
                  changelog: rel.changelog,
                })
              : `> ⚠️ *UPDATE NOTIFICATION (MAJOR)*\n\n` +
                `• *Versi Baru:* *v${rel.version}*\n` +
                `• *Versi Bot Anda:* *v${rel.currentVersion || 'Lama'}*\n` +
                `• *Total Rilis Tertinggal:* ${rel.pendingCount || 1} update\n` +
                `• *Total Berkas:* ${rawUrls.length} file unik\n\n` +
                (rel.changelog ? `📋 *Catatan Perubahan:*\n${rel.changelog}\n\n` : '') +
                `_Versi bot Anda tertinggal cukup jauh. Disarankan untuk melakukan git pull atau clone ulang script terbaru agar seluruh struktur sinkron._\n\n` +
                `🌐 *Repository:* https://github.com/Rifza123/Experimental-Bell`;

            let text = Data.infos?.updateNotify
              ? Data.infos.updateNotify({
                  version: rel.version,
                  currentVersion: rel.currentVersion,
                  pendingCount: rel.pendingCount,
                  files: rawUrls,
                  fileTree,
                  changelog: rel.changelog,
                })
              : `> 🔔 *UPDATE NOTIFICATION*\n\n` +
                `• *Versi Baru:* *v${rel.version}* (Saat ini: *v${rel.currentVersion || '1.0.0'}*)\n` +
                (rel.pendingCount > 1 ? `• *Total Rilis Kumulatif:* ${rel.pendingCount} update\n` : '') +
                `• *Total Berkas:* ${rawUrls.length} file unik\n\n` +
                (rel.changelog ? `📋 *Catatan Perubahan:*\n${rel.changelog}\n\n` : '') +
                `📂 *File Changed:*\n${fileTree.map((f, i) => `${i === fileTree.length - 1 ? '└──' : '├──'} \`${f.type}\`: ${f.path}`).join('\n')}\n\n` +
                `_💡 Balas pesan ini dengan *y* untuk menerapkan pembaruan, atau ketik *.update* dengan link di atas._`;

            for (const ownerJid of ownerJids) {
              let notifiedUpdates = memories.getItem(ownerJid, 'notifiedUpdates') || {};
              if (typeof notifiedUpdates !== 'object') notifiedUpdates = {};
              if (notifiedUpdates[rel.version]) continue;

              notifiedUpdates[rel.version] = Date.now();
              memories.setItem(ownerJid, 'notifiedUpdates', notifiedUpdates);

              if (rel.isMajorGap) {
                await currentExp.sendMessage(ownerJid, {
                  text: majorText,
                  contextInfo: {
                    externalAdReply: {
                      title: `Experimental-Bell • Major Update v${rel.version || 'New'}`,
                      body: 'Pembaruan besar tersedia! Silakan perbarui script Anda.',
                      thumbnailUrl: 'https://c.termai.cc/i145/P3a.png',
                      sourceUrl: 'https://github.com/Rifza123/Experimental-Bell',
                      mediaUrl: 'https://github.com/Rifza123/Experimental-Bell',
                      renderLargerThumbnail: true,
                      showAdAttribution: true,
                      mediaType: 1,
                    },
                    forwardedNewsletterMessageInfo: cfg.chId || {
                      newsletterJid: '120363205560908891@newsletter',
                      newslettedName: 'Termai',
                      serverMessageId: 152,
                    },
                  },
                });
              } else {
                let sentMsg = await currentExp.sendMessage(ownerJid, {
                  text: `https://termai.cc\n` + text,
                  linkPreview,
                });
                if (sentMsg?.key?.id && rawUrls.length > 0) {
                  Data.quotedQuestionCmd ??= {};
                  Data.quotedQuestionCmd[sentMsg.key.id] = {
                    key: { id: sentMsg.key.id },
                    emit: `update ${rawUrls.join(' ')}`,
                    exp: Date.now() + 2 * 24 * 60 * 60 * 1000,
                    accepts: ['y', 'ya', 'yes'],
                    Keys: { y: '', ya: '', yes: '' },
                    use: 0,
                    maxUse: 1,
                  };
                  Data.pendingReleaseVersion = rel.version;
                }
              }
            }
            break;
          }

          case 'ticket_update': {
            const t = parsed.data;
            if (!t) break;
            const currentExp = keys[ky].boundExp || Exp;
            if (!currentExp) break;
            const targetNum = String(t.senderNumber || t.targetJid || t.senderJid || '').replace(/[^0-9]/g, '');
            const targetJid = targetNum + '@s.whatsapp.net';

            let text = Data.infos?.ticketUpdateNotify
              ? Data.infos.ticketUpdateNotify(t)
              : `📬 *UPDATE STATUS TIKET*\n\n• *ID Tiket:* *#${t.ticketId || t.id}*\n• *Status:* *${t.status?.toUpperCase()}*\n\n` +
                (t.adminReply ? `💬 *Tanggapan Developer:*\n> ${t.adminReply.replace(/\n/g, '\n> ')}\n\n` : '') +
                `────────────────────────\n_💡 Balas (quote) pesan ini langsung untuk merespons tim developer._`;

            try {
              try {
                keys['ticket_link_preview_media'] ??= await (async () => {
                  const rawBuf = fs.readFileSync(fol[3] + 'bell.jpg');
                  const { imageMessage } = await prepareWAMessageMedia(
                    { image: rawBuf },
                    { upload: currentExp.waUploadToServer || Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
                  );
                  return imageMessage;
                })();

                const imageMessage = keys['ticket_link_preview_media'];
                const statusLabel =
                  t.status === 'resolved'
                    ? 'Selesai (Resolved)'
                    : t.status === 'in_progress'
                      ? 'Sedang Ditangani (In Progress)'
                      : t.status === 'closed'
                        ? 'Ditutup (Closed)'
                        : 'Terbuka (Open)';

                await currentExp.sendMessage(targetJid, {
                  text: `https://termai.cc\n` + text,
                  linkPreview: {
                    'matched-text': 'https://termai.cc',
                    title: `Tiket #${t.ticketId || t.id} • ${statusLabel}`,
                    description: 'Termai AI Developer Support System',
                    jpegThumbnail: imageMessage?.jpegThumbnail
                      ? Buffer.from(imageMessage.jpegThumbnail)
                      : undefined,
                    highQualityThumbnail: imageMessage
                      ? {
                          ...imageMessage,
                          width: 1280,
                          height: 720,
                        }
                      : undefined,
                  },
                });
              } catch (err) {
                await currentExp.sendMessage(targetJid, { text });
              }
            } catch (sendErr) {
              try {
                const ownerList = Data?.owner || [];
                const primaryOwner = ownerList[0];
                if (primaryOwner) {
                  const ownerJid = primaryOwner.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                  const failText = Data.infos?.ticketDeliveryFailed
                    ? Data.infos.ticketDeliveryFailed(t.ticketId || t.id, targetNum, sendErr.message)
                    : `⚠️ *GAGAL MENGIRIM NOTIFIKASI TIKET*\n\n• *ID Tiket:* *#${t.ticketId || t.id}*\n• *Nomor Tujuan:* +${targetNum}\n• *Penyebab:* ${sendErr.message || 'Error tidak diketahui'}\n\n_Pesan pembaruan tetap tersimpan di database sistem._`;
                  await (keys[ky].boundExp || Exp).sendMessage(ownerJid, { text: failText });
                }
              } catch (e) {}
            }
            break;
          }

          case 'dm_request': {
            const reqData = parsed.data;
            if (!reqData || !reqData.sessionId) break;
            const currentExp = keys[ky].boundExp || Exp;
            if (!currentExp) break;

            Data.pendingDmSession = {
              sessionId: reqData.sessionId,
              adminName: reqData.adminName || 'Admin Termai',
              exp: Date.now() + 300000,
            };

            const ownerNum = String(global.owner?.[0] || currentExp.number || '').replace(/[^0-9]/g, '');
            const ownerJid = ownerNum + '@s.whatsapp.net';
            let tpl = Data.infos?.owner?.dmRequestPrompt?.(reqData.adminName || 'Admin Termai') || {
              body: `🔔 *PERMINTAAN SESI OBROLAN ADMIN TERMAI*\n\nAdmin *${reqData.adminName || 'Termai'}* mengajak Anda untuk memulai sesi obrolan langsung.\n\nKetik *y* untuk menerima atau *n* untuk menolak.`,
              footer: 'Permintaan ini berlaku selama 5 menit',
            };

            await currentExp.sendMessage(ownerJid, {
              text: tpl.body || tpl,
              footer: tpl.footer,
            });
            break;
          }

            case 'dm_message': {
              const msgData = parsed.data;
              if (!msgData || !msgData.text) break;
              const currentExp = keys[ky].boundExp || Exp;
              if (!currentExp) break;

              const ownerNum = String(global.owner?.[0] || currentExp.number || '').replace(/[^0-9]/g, '');
              const ownerJid = ownerNum + '@s.whatsapp.net';
              let text = `💬 *[Admin Termai - ${msgData.adminName || 'Admin'}]*\n\n${msgData.text}\n\n_Balas pesan ini untuk merespon langsung_`;
              await currentExp.sendMessage(ownerJid, {
                text,
                footer: 'Sesi Obrolan Aktif (Ketik .dm end untuk selesai)',
              });
              break;
            }

            case 'dm_closed': {
              Data.activeDmSession = null;
              Data.pendingDmSession = null;
              const currentExp = keys[ky].boundExp || Exp;
              if (!currentExp) break;

              const ownerNum = String(global.owner?.[0] || currentExp.number || '').replace(/[^0-9]/g, '');
              const ownerJid = ownerNum + '@s.whatsapp.net';
              let text = `⏹️ *SESI OBROLAN DITUTUP*\n\nSesi obrolan dengan Admin Termai telah diakhiri.`;
              await currentExp.sendMessage(ownerJid, {
                text,
                footer: 'Sistem Obrolan Termai',
              });
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

    ws.on('close', (code, reason) => {
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

      logLivechart(`WebSocket closed with code ${code} (${reason ? reason.toString() : 'no reason'}), reconnecting in ${(delayMs / 1000).toFixed(1)}s`, 'warn');
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

global.createTicket = native(async function ({ category, subject, message, senderNumber, senderJid }) {
  const ws = keys[ky]?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new Error('Koneksi livechart server belum terhubung. Silakan coba lagi sebentar lagi.');
  }

  const currentExp = keys[ky].boundExp || Exp;
  const botNumber = String(currentExp?.number || currentExp?.user?.id?.split(':')[0] || '').replace(/[^0-9]/g, '');
  const ownerNumber = String(global.owner?.[0] || botNumber).replace(/[^0-9]/g, '');

  const ticketData = JSON.stringify({
    category: category || 'bug',
    subject: subject || 'Laporan Masalah',
    message,
    senderNumber,
    senderJid
  }).encryptPayload();

  const token = (botNumber + ownerNumber).generateWsToken();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingTicketCallbacks.delete(reqId);
      reject(new Error('Batas waktu pembuatan tiket habis (Timeout)'));
    }, 15000);

    const reqId = Date.now().toString();
    pendingTicketCallbacks.set(reqId, (response) => {
      clearTimeout(timeout);
      if (response.status) {
        resolve(response);
      } else {
        reject(new Error(response.msg || 'Gagal membuat tiket'));
      }
    });

    ws.send(JSON.stringify({
      action: 'create_ticket',
      token,
      payload: ticketData
    }));
  });
}, 'createTicket');

global.getTicket = native(async function (ticketId) {
  const ws = keys[ky]?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new Error('Koneksi livechart server belum terhubung. Silakan coba lagi sebentar lagi.');
  }

  const reqId = Date.now().toString() + Math.random().toString(36).slice(2, 6);
  const payload = JSON.stringify({ ticketId, reqId }).encryptPayload();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingTicketCallbacks.delete(reqId);
      reject(new Error('Batas waktu pengecekan tiket habis (Timeout)'));
    }, 15000);

    pendingTicketCallbacks.set(reqId, (response) => {
      clearTimeout(timeout);
      if (response.status) {
        resolve(response.ticket);
      } else {
        reject(new Error(response.msg || 'Tiket tidak ditemukan'));
      }
    });

    ws.send(JSON.stringify({
      action: 'get_ticket',
      payload
    }));
  });
}, 'getTicket');

global.listTickets = native(async function (senderNumber) {
  const ws = keys[ky]?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new Error('Koneksi livechart server belum terhubung. Silakan coba lagi sebentar lagi.');
  }

  const reqId = Date.now().toString() + Math.random().toString(36).slice(2, 6);
  const payload = JSON.stringify({ senderNumber, reqId }).encryptPayload();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingTicketCallbacks.delete(reqId);
      reject(new Error('Batas waktu pengambilan daftar tiket habis (Timeout)'));
    }, 15000);

    pendingTicketCallbacks.set(reqId, (response) => {
      clearTimeout(timeout);
      if (response.status) {
        resolve(response.tickets || []);
      } else {
        reject(new Error(response.msg || 'Gagal memuat daftar tiket'));
      }
    });

    ws.send(JSON.stringify({
      action: 'list_tickets',
      payload
    }));
  });
}, 'listTickets');

global.updateTicketUser = native(async function ({ ticketId, actionType, replyText }) {
  const ws = keys[ky]?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new Error('Koneksi livechart server belum terhubung. Silakan coba lagi sebentar lagi.');
  }

  const reqId = Date.now().toString() + Math.random().toString(36).slice(2, 6);
  const payload = JSON.stringify({ ticketId, actionType, replyText, reqId }).encryptPayload();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingTicketCallbacks.delete(reqId);
      reject(new Error('Batas waktu pembaruan tiket habis (Timeout)'));
    }, 15000);

    pendingTicketCallbacks.set(reqId, (response) => {
      clearTimeout(timeout);
      if (response.status) {
        resolve(response);
      } else {
        reject(new Error(response.msg || 'Gagal memperbarui tiket'));
      }
    });

    ws.send(JSON.stringify({
      action: 'user_update_ticket',
      payload
    }));
  });
}, 'updateTicketUser');

global.checkUpdate = native(async function () {
  const ws = keys[ky]?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    throw new Error('Koneksi livechart server belum terhubung. Silakan coba lagi sebentar lagi.');
  }

  const botVersion = cfg?.version || pkgVer;
  const reqId = Date.now().toString() + Math.random().toString(36).slice(2, 6);
  const payload = JSON.stringify({ version: botVersion, reqId }).encryptPayload();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      pendingTicketCallbacks.delete(reqId);
      reject(new Error('Batas waktu pengecekan update habis (Timeout)'));
    }, 15000);

    pendingTicketCallbacks.set(reqId, (response) => {
      clearTimeout(timeout);
      if (response.status && response.data) {
        resolve(response.data);
      } else {
        reject(new Error(response.msg || 'Gagal memeriksa update'));
      }
    });

    ws.send(JSON.stringify({
      action: 'check_update',
      payload
    }));
  });
}, 'checkUpdate');

global.sendDmConsent = native(async function ({ sessionId, accepted }) {
  const ws = keys[ky]?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;

  const currentExp = keys[ky].boundExp || Exp;
  const botNumber = String(currentExp?.number || currentExp?.user?.id?.split(':')[0] || '').replace(/[^0-9]/g, '');
  const ownerNumber = String(global.owner?.[0] || botNumber).replace(/[^0-9]/g, '');

  const payload = JSON.stringify({ sessionId, accepted }).encryptPayload();
  const token = (botNumber + ownerNumber).generateWsToken();

  ws.send(JSON.stringify({
    action: 'dm_consent',
    token,
    payload
  }));
  return true;
}, 'sendDmConsent');

global.sendDmReply = native(async function ({ sessionId, text }) {
  const ws = keys[ky]?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;

  const currentExp = keys[ky].boundExp || Exp;
  const botNumber = String(currentExp?.number || currentExp?.user?.id?.split(':')[0] || '').replace(/[^0-9]/g, '');
  const ownerNumber = String(global.owner?.[0] || botNumber).replace(/[^0-9]/g, '');

  const payload = JSON.stringify({ sessionId, text }).encryptPayload();
  const token = (botNumber + ownerNumber).generateWsToken();

  ws.send(JSON.stringify({
    action: 'dm_reply',
    token,
    payload
  }));
  return true;
}, 'sendDmReply');

global.sendDmEnd = native(async function ({ sessionId }) {
  const ws = keys[ky]?.ws;
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;

  const currentExp = keys[ky].boundExp || Exp;
  const botNumber = String(currentExp?.number || currentExp?.user?.id?.split(':')[0] || '').replace(/[^0-9]/g, '');
  const ownerNumber = String(global.owner?.[0] || botNumber).replace(/[^0-9]/g, '');

  const payload = JSON.stringify({ sessionId }).encryptPayload();
  const token = (botNumber + ownerNumber).generateWsToken();

  ws.send(JSON.stringify({
    action: 'dm_end',
    token,
    payload
  }));
  return true;
}, 'sendDmEnd');

export { ensureConnected };
export default livechart;
