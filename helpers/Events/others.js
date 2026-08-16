/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const { downloadContentFromMessage } = 'baileys'.import();
const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r();
const { dashboard } = await (fol[2] + 'dashboard.js').r();
const { default: jadibot, stopJadibot, listAllJadibots, getJadibotStatus, setJadibotApikey, setJadibotConfig, restartJadibot, getJadibotDb, resetJadibotDb, resolveJadibotSlot, checkExpiredJadibots } = await `${fol[1]}jadibot.js`.r();
/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id } = cht;
  const { func } = Exp;
  const { archiveMemories: memories } = func;
  let infos = Data.infos;

  ev.on(
    {
      cmd: ['menu'],
      listmenu: ['menu'],
      tag: 'other',
    },
    async ({ args: v }) => {
      let [args, type] = v?.split('--');
      let hit = func.getTotalCmd();
      let topcmd = func.topCmd(2);
      let events = Object.fromEntries(
        Object.entries(Data.events).filter(
          ([key, val]) =>
            !args || args.toLowerCase().includes(String(val.tag).toLowerCase())
        )
      );

      let eventKey = Object.keys(events);
      let totalCmd = eventKey.length;
      let head = `*[ INFO ]*\n- *${hit.total}* Hit Emitter\n- *${hit.ai_response}* Ai response\n\n*[ Relationship ]*\n- Status: *${cht.memories.role}*\n- Mood: ${cht.memories.energy}${cht.memories.energy < 10 ? '😪' : '⚡'}\n\n ▪︎ 『 \`Events On\` 』\n- Total: ${totalCmd}\n\n ▪︎ 『 \`Top Cmd \`』\n> ${'`'}${topcmd.join('`\n> `')}${'`'}\n\n`;
      let text =
        head +
        `${args.includes('reaction') ? '' : func.menuFormatter(events, { ...cfg.menu, ...cht }) + '\n'}${Data.infos.reaction.menu}`;
      let menu = {};
      if (cfg.button && cfg?.menu_type == 'buttonListImage') {
        keys['bell_jpg'] ??= await func.uploadToServer(
          fs.readFileSync(fol[3] + 'bell.jpg')
        );
        let quick_reply = [];
        for (let i of Object.values(Data.events)
          .map((a) => a.tag)
          .removeDuplicate()
          .clean()) {
          quick_reply.push({
            name: 'quick_reply',
            buttonParamsJson: {
              display_text: cfg.menu.tags[i],
              id: `.menu ${i} --content`,
            }.String(),
          });
        }

        let _m = {
          interactiveMessage: {
            header: {
              title: '',
              imageMessage: keys['bell_jpg'],
              hasMediaAttachment: true,
            },
            body: {
              text:
                type == 'content'
                  ? func.menuFormatter(events, { ...cfg.menu, ...cht })
                  : head,
            },
            footer: {
              text: '© Supported by termai.cc',
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'single_select',
                  buttonParamsJson: { has_multiple_buttons: true }.String(),
                },
                ...quick_reply,
              ],
              messageParamsJson: {
                limited_time_offer: {
                  text: 'Artificial Intelligence, The beginning of the robot era',
                  url: 'https://termai.cc',
                  copy_code: 'Termai',
                  expiration_time: Date.now() + func.parseTimeString('1 hari'),
                },
                bottom_sheet: {
                  in_thread_buttons_limit: 2,
                  divider_indices: [1, 2, 3, 4, 5, 999],
                  list_title: 'All Tag',
                  button_title: 'View List',
                },
              }.String(),
            },
            contextInfo: {
              stanzaId: cht.key.id,
              participant: cht.key.participant,
              quotedMessage: cht,
              forwardedNewsletterMessageInfo: cfg.chId || {
                newsletterJid: '120363205560908891@newsletter',
                newslettedName: 'Termai',
                serverMessageId: 152,
              },
            },
          },
        };

        Exp.relayMessage(cht.id, _m, {});
      } else if (cfg?.menu_type == 'text') {
        menu.text = text;
        menu.footer = '© Supported by termai.cc';
        await Exp.sendMessage(id, menu, { quoted: cht });
      } else if (cfg?.menu_type == 'image') {
        menu.image = fs.readFileSync(fol[3] + 'bell.jpg');
        menu.caption = text;
        menu.footer = '© Supported by termai.cc';
        await Exp.sendMessage(id, menu, { quoted: cht });
      } else if (cfg?.menu_type == 'video') {
        menu.video = {
          url: cfg.menu.video || 'https://c.termai.cc/v86/J剗K尿fY',
        };
        menu.caption = text;
        menu.footer = '© Supported by termai.cc';
        await Exp.sendMessage(id, menu, { quoted: cht });
      } else if (cfg?.menu_type == 'liveLocation') {
        await Exp.relayMessage(
          cht.id,
          {
            liveLocationMessage: {
              degreesLatitude: -76.01801,
              degreesLongitude: 22.662851,
              caption: text,
              contextInfo: {
                participant: cht.sender,
                quotedMessage: cht.message,
              },
            },
          },
          {}
        );
      } else if (cfg?.menu_type == 'order') {
        await Exp.relayMessage(
          cht.id,
          {
            orderMessage: {
              orderId: '530240676665078',
              status: 'INQUIRY',
              surface: 'CATALOG',
              ItemCount: 0,
              message: text,
              sellerJid: '6281374955605@s.whatsapp.net',
              token: 'AR6oiV5cQjZsGfjvfDwl0DXfnAE+OPRkWAQtFDaB9wxPlQ==',
              thumbnail: (await fs.readFileSync(fol[3] + 'bell.jpg')).toString(
                'base64'
              ),
            },
          },
          {}
        );
      } else if (cfg?.menu_type == 'gif') {
        let video = await func.uploadToServer(
          cfg.menu.video || 'https://c.termai.cc/v86/J剗K尿fY',
          'video'
        );
        await Exp.relayMessage(
          cht.id,
          {
            videoMessage: {
              ...video,
              gifPlayback: true,
              height: 520,
              width: 732,
              caption: text,
              contextInfo: {
                stanzaId: cht.key.id,
                participant: cht.sender,
                quotedMessage: cht.message,
                forwardingScore: 19,
                isForwarded: true,
                forwardedNewsletterMessageInfo: cfg.chId || {
                  newsletterJid: '120363205560908891@newsletter',
                  newslettedName: 'Termai',
                  serverMessageId: 152,
                },
              },
            },
          },
          {}
        );
      } else if (cfg?.menu_type == 'gif+linkpreview') {
        let video = await func.uploadToServer(
          cfg.menu.video || 'https://c.termai.cc/v86/J剗K尿fY',
          'video'
        );
        keys['thumbnailUrl'] ||= await TermaiCdn(
          fs.readFileSync(fol[3] + 'bell.jpg')
        );
        let { thumbnailUrl } = keys;

        await Exp.relayMessage(
          cht.id,
          {
            videoMessage: {
              ...video,
              gifPlayback: true,
              height: 520,
              width: 732,
              caption: text,
              mimetype: 'video/mp4',
              contextInfo: {
                stanzaId: cht.key.id,
                participant: cht.sender,
                quotedMessage: cht.message,
                forwardingScore: 19,
                isForwarded: true,
                externalAdReply: {
                  title: cht.pushName,
                  body: 'Artificial Intelligence, The beginning of the robot era',
                  thumbnailUrl,
                  sourceUrl: 'https://github.com/Rifza123',
                  mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 100000000000000000)}`,
                  renderLargerThumbnail: true,
                  mediaType: 1,
                  sourceType: 'ad',
                  sourceId: '1',
                  sourceUrl: 'https://instagram.com/rifza.p.p',
                },
                forwardedNewsletterMessageInfo: cfg.chId || {
                  newsletterJid: '120363205560908891@newsletter',
                  newslettedName: 'Termai',
                  serverMessageId: 152,
                },
              },
            },
          },
          {}
        );
      } else {
        const rawBuf = fs.readFileSync(fol[3] + 'bell.jpg');
        const { prepareWAMessageMedia } = await import('@whiskeysockets/baileys/lib/Utils/messages.js');
        const { imageMessage } = await prepareWAMessageMedia(
          { image: rawBuf },
          { upload: Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
        );

        menu = {
          text: `https://termai.cc\n` + text,
          linkPreview: {
            'matched-text': 'https://termai.cc',
            title: cht.pushName,
            description: 'Artificial Intelligence, The beginning of the robot era',
            jpegThumbnail: imageMessage?.jpegThumbnail ? Buffer.from(imageMessage.jpegThumbnail) : undefined,
            highQualityThumbnail: imageMessage
              ? {
                  ...imageMessage,
                  width: 1280,
                  height: 720,
                }
              : undefined,
          },
        };
        await Exp.sendMessage(id, menu, { quoted: cht });
      }
      Data.audio?.menu?.length > 0 &&
        type !== 'content' &&
        Exp.sendMessage(
          cht.id,
          {
            audio: { url: Data.audio.menu.getRandom() },
            mimetype: 'audio/mpeg',
          },
          { quoted: cht }
        );
    }
  );

  ev.on(
    {
      cmd: ['reaction', 'menureaction', 'reactionmenu'],
      listmenu: ['reactionmenu'],
      tag: 'other',
    },
    () => {
      cht.reply(infos.reaction.menu);
    }
  );

  ev.on(
    {
      cmd: ['rvome', 'rvo', 'getviewonce'],
      listmenu: ['getviewonce', 'rvome'],
      media: {
        type: ['image', 'video', 'audio'],
      },
      tag: 'others',
      premium: true,
      isAdmin: true,
      isMention: true,
      energy: 25,
    },
    async () => {
      try {
        let msg = cht.quoted;
        let type = cht.quoted.mtype;
        delete msg[type].viewOnce;
        Exp.relayMessage(cht.cmd == 'rvome' ? cht.sender : cht.id, msg, {});
      } catch (e) {
        console.error(e);
        cht.reply(infos.others.noDetectViewOnce);
      }
    }
  );

  ev.on(
    {
      cmd: ['d', 'del', 'delete'],
      listmenu: ['delete'],
      tag: 'other',
      isQuoted: true,
    },
    async () => {
      try {
        if (cht.quoted.sender !== Exp.number && !is.groupAdmins && !is.owner)
          return cht.reply(infos.messages.isAdmin);
        if (!is.groupAdmins && !is.owner) {
          let qsender = (await store.loadMessage(cht.id, cht.quoted.stanzaId))
            ?.message?.extendedTextMessage?.contextInfo.quotedMessage?.sender;
          if (qsender && qsender !== cht.sender)
            return cht.reply(`*Anda tidak diizinkan menghapus pesan itu!*
\`Sebab:\`
${infos.others.readMore}
- Quoted pesan tersebut bukan berasal dari anda
- Anda bukan owner atau admin untuk mendapatkan izin khusus`);
        }
        cht.quoted.delete();
      } catch {
        cht.reply(infos.messages.failed);
      }
    }
  );

  ev.on(
    {
      cmd: ['statistic', 'stats'],
      listmenu: ['stats'],
      tag: 'other',
    },
    async () => {
      const { cpuUsage, memoryUsage, processStats } =
        await func.getSystemStats();
      const runtimeText = processStats.runtime;

      const txt =
        cpuUsage
          .map(
            (cpu) =>
              `💻 *CPU ${cpu.cpu + 1}*\n` +
              `   Model: ${cpu.model}\n` +
              `   Usage: ${cpu.usage}\n`
          )
          .join('\n') +
        `🧠 *Memory Usage*\n` +
        `   Total: ${memoryUsage.totalMemory}\n` +
        `   Free: ${memoryUsage.freeMemory}\n` +
        `   Used: ${memoryUsage.usedMemory}\n` +
        `📊 *Process Memory Usage*\n` +
        `   RSS: ${processStats.memoryUsage.rss}\n` +
        `   Heap Total: ${processStats.memoryUsage.heapTotal}\n` +
        `   Heap Used: ${processStats.memoryUsage.heapUsed}\n` +
        `   External: ${processStats.memoryUsage.external}\n` +
        `🚀 *Speed*: ${processStats.speed}\n` +
        `🕒 *Runtime*\n` +
        `   ${runtimeText.days}d ${runtimeText.hours}h ${runtimeText.minutes}m ${runtimeText.seconds}s ${runtimeText.milliseconds}ms\n` +
        `🔧 *Process Info*\n` +
        `   PID: ${processStats.pid}\n` +
        `   Title: ${processStats.title}\n` +
        `   Exec Path: ${processStats.execPath}`;
      Exp.sendMessage(
        cht.id,
        { image: await dashboard(), caption: txt },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['totalpesan'],
      listmenu: true,
      tag: 'group',
    },
    async () => {
      let mention = cht.mention?.length > 0 ? cht.mention : null;

      let meta = is.group ? await Exp.groupMetadata(cht.id) : null;

      let header = is.group
        ? `📋Total Pesan di group ${meta?.subject || '-'}\n`
        : `📋Total pesan kamu\n`;

      if (!is.group) {
        const user = Data.chats[cht.sender.split('@')[0]];
        if (!user?.groups) return await cht.reply('Belum ada data pesan 🙂');

        const groups = Object.keys(user.groups);

        let arr = await Promise.all(
          groups.map(async (gid) => {
            const g = user.groups[gid];
            if (!g) return null;

            const subtotal = Object.keys(g).reduce(
              (n, t) => (t === 'lastSent' ? n : n + g[t]),
              0
            );

            const meta = await Exp.groupMetadata(gid);

            const det = Object.keys(g)
              .filter((t) => t !== 'lastSent')
              .map((t) => `  • ${t}: ${g[t]}`)
              .join('\n');

            const last = g.lastSent
              ? func.dateFormatter(g.lastSent, 'Asia/Jakarta')
              : '-';

            return {
              name: meta?.subject || gid,
              subtotal,
              det,
              last,
            };
          })
        );

        arr = arr.filter(Boolean).sort((a, b) => b.subtotal - a.subtotal);

        let teks = arr
          .map(
            (v, idx) =>
              `${idx + 1}. ${v.name} (total: ${v.subtotal})\n${v.det}\n  • lastSent: ${v.last}`
          )
          .join('\n\n');

        return await cht.reply(teks || 'Belum ada data pesan 🙂');
      }

      let arr = mention
        ? Object.keys(Data.chats).filter((a) =>
            mention.some((b) => String(a).includes(b.split('@')[0]))
          )
        : Object.keys(Data.chats);

      arr = await Promise.all(
        arr.map(async (userId) => {
          const user = Data.chats[userId];
          const group = user.groups?.[cht.id];
          if (!group) return null;

          const total = Object.keys(group).reduce(
            (n, t) => (t === 'lastSent' ? n : n + group[t]),
            0
          );

          const detail = Object.keys(group)
            .filter((t) => t !== 'lastSent')
            .map((t) => `  - ${t}: ${group[t]}`)
            .join('\n');

          const last = group.lastSent
            ? func.dateFormatter(group.lastSent, 'Asia/Jakarta')
            : '-';

          return {
            userId,
            total,
            detail,
            last,
          };
        })
      );

      arr = arr.filter(Boolean).sort((a, b) => b.total - a.total);

      let teks = arr
        .map(
          (v, idx) =>
            `${idx + 1}. @${v.userId.split('@')[0]} (total: ${v.total})\n${v.detail}\n  - lastSent: ${v.last}`
        )
        .join('\n\n');

      await cht.reply(teks ? header + teks : 'Belum ada data pesan 🙂');
    }
  );
  
  ev.on(
    {
      cmd: ["jadibot"],
      listmenu: [`jadibot`],
      tag: `jadibot`,
      premium: true,
    },
    async () => {
      try {
        let userEnergy = cht.memories.energy || 0;
        if (userEnergy < 1500) {
          return cht.reply(
            Data.infos.messages.isEnergy({
              uEnergy: userEnergy,
              energy: 1500,
              charging: cht.memories.charging,
            })
          );
        }
        const normalizeNumber = (num) => {
          if (!num) return ``;
          let raw = String(num).trim();
          let clean = raw.replace(/[^0-9]/g, ``);
          if (clean.startsWith(`0`)) {
            return `62` + clean.slice(1);
          }
          if (clean.length >= 10) {
            return clean;
          }
          return `62` + clean;
        };
        let senderNum = cht.sender ? cht.sender.split('@')[0].replace(/[^0-9]/g, '') : '';
        let action = cht.q ? cht.q.trim().toLowerCase() : '';
        let jdbLang = infos.jadibot || Data.infos.jadibot;
        let botName = global.botfullname || 'Jadibot';
        let replyJdb = (tpl, opts) => {
          return Exp.sendMessage(cht.id, {
            text: tpl.body,
            footer: tpl.footer,
            ...(opts?.mentionedJid ? { mentions: opts.mentionedJid } : {}),
          }, { quoted: cht });
        };

        if (action === "stop" || action === "logout" || action === "keluar" || action === "matikan" || action.startsWith("stop ") || action.startsWith("logout ") || action.startsWith("keluar ") || action.startsWith("matikan ")) {
          let parts = action.split(" ");
          let target = parts.slice(1).join(" ").trim() || null;
          let targetSlot = resolveJadibotSlot(target, senderNum);

          if (!targetSlot || !Data.jadibot?.[targetSlot]) {
            let activeBots = listAllJadibots();
            let activeBotsStr = activeBots.length > 0 ? activeBots.map(b => '#' + b.slot + ' (' + b.botNumber + ')').join(', ') : '';
            return cht.reply(jdbLang.notFound(target, true, activeBotsStr));
          }

          let info = Data.jadibot[targetSlot];
          let targetOwner = String(info.owner || '').replace(/[^0-9]/g, '');
          let targetOwners = (info.owners || []).map(o => String(o).replace(/[^0-9]/g, ''));
          if (!is.owner && targetOwner !== senderNum && !targetOwners.includes(senderNum)) {
            return cht.reply(
              jdbLang.accessDenied(targetSlot, info.botNumber, targetOwner),
              { mentions: [targetOwner + '@s.whatsapp.net'] }
            );
          }
          let ok = await stopJadibot({ slot: targetSlot, removeSession: false });
          if (ok) {
            return replyJdb(jdbLang.stopped(targetSlot, info.botNumber));
          } else {
            return cht.reply('❌ Gagal menghentikan bot Slot ' + targetSlot + '.');
          }
        }

        if (action === "delete" || action === "hapus" || action.startsWith("delete ") || action.startsWith("hapus ")) {
          let parts = action.split(" ");
          let target = parts.slice(1).join(" ").trim() || null;
          let targetSlot = resolveJadibotSlot(target, senderNum);

          if (!targetSlot || !Data.jadibot?.[targetSlot]) {
            let activeBots = listAllJadibots();
            let activeBotsStr = activeBots.length > 0 ? activeBots.map(b => '#' + b.slot + ' (' + b.botNumber + ')').join(', ') : '';
            return cht.reply(jdbLang.notFound(target, false, activeBotsStr));
          }

          let info = Data.jadibot[targetSlot];
          let targetOwner = String(info.owner || '').replace(/[^0-9]/g, '');
          let targetOwners = (info.owners || []).map(o => String(o).replace(/[^0-9]/g, ''));
          if (!is.owner && targetOwner !== senderNum && !targetOwners.includes(senderNum)) {
            return cht.reply(
              jdbLang.accessDenied(targetSlot, info.botNumber, targetOwner),
              { mentions: [targetOwner + '@s.whatsapp.net'] }
            );
          }
          let ok = await stopJadibot({ slot: targetSlot, removeSession: true });
          if (ok) {
            return replyJdb(jdbLang.deleted(targetSlot, info.botNumber, botName));
          } else {
            return cht.reply('❌ Gagal menghapus bot Slot ' + targetSlot + '.');
          }
        }

        if (action === "restart" || action === "mulaiulang" || action.startsWith("restart ") || action.startsWith("mulaiulang ")) {
          let parts = action.split(" ");
          let target = parts.slice(1).join(" ").trim() || null;
          let targetSlot = resolveJadibotSlot(target, senderNum);

          if (!targetSlot || !Data.jadibot?.[targetSlot]) {
            let activeBots = listAllJadibots();
            let activeBotsStr = activeBots.length > 0 ? activeBots.map(b => '#' + b.slot + ' (' + b.botNumber + ')').join(', ') : '';
            return cht.reply(jdbLang.notFound(target, false, activeBotsStr));
          }

          let info = Data.jadibot[targetSlot];
          let targetOwner = String(info.owner || '').replace(/[^0-9]/g, '');
          let targetOwners = (info.owners || []).map(o => String(o).replace(/[^0-9]/g, ''));
          if (!is.owner && targetOwner !== senderNum && !targetOwners.includes(senderNum)) {
            return cht.reply(
              jdbLang.accessDenied(targetSlot, info.botNumber, targetOwner),
              { mentions: [targetOwner + '@s.whatsapp.net'] }
            );
          }
          await cht.reply(jdbLang.restarting(targetSlot, info.botNumber));
          let ok = await restartJadibot({ Exp, cht, slot: targetSlot, owner: senderNum });
          if (ok) {
            return replyJdb(jdbLang.restarted(targetSlot, info.botNumber, botName));
          } else {
            return cht.reply('❌ Gagal merestart bot Slot ' + targetSlot + '.');
          }
        }

        if (action === "list" || action === "daftar") {
          await checkExpiredJadibots();
          let bots = listAllJadibots();
          if (!is.owner) {
            bots = bots.filter(b => String(b.owner).replace(/[^0-9]/g, '') === senderNum || (b.owners || []).map(o => String(o).replace(/[^0-9]/g, '')).includes(senderNum));
          }
          if (!bots || bots.length === 0) {
            return cht.reply(!is.owner ? jdbLang.notFound(null, false) : jdbLang.listEmpty);
          }
          let text = jdbLang.listHeader(bots.length);
          for (let b of bots) {
            text += '• *Slot ' + b.slot + '*\n';
            text += '  ├ 📱 Nomor: ' + b.botNumber + '\n';
            text += '  ├ 👤 Owner: @' + b.owner + '\n';
            text += '  ├ ⚡ Status: ' + b.statusText + '\n';
            text += '  ├ 🗝️ API Key: ' + (b.hasApikey ? 'Custom Key ✅' : 'Default 🌐') + '\n';
            text += '  ├ ⏱️ Uptime: ' + b.uptimeText + '\n';
            text += '  ╰ ⏳ Masa Aktif: ' + b.expiredText + '\n\n';
          }
          text += jdbLang.listFooter(botName);
          return cht.reply(text.trim(), { mentions: bots.map(b => b.owner + '@s.whatsapp.net') });
        }

        if (action === "status" || action === "info" || action === "cek" || action.startsWith("status ") || action.startsWith("info ") || action.startsWith("cek ")) {
          let parts = cht.q.trim().split(" ");
          let target = parts.slice(1).join(" ").trim() || null;
          let targetSlot = resolveJadibotSlot(target, senderNum);

          let resolvedInfo = null;
          if (!targetSlot || !Data.jadibot?.[targetSlot]) {
            let status = getJadibotStatus(senderNum);
            if (status.active) {
              resolvedInfo = status;
            } else {
              let activeBots = listAllJadibots();
              let activeBotsStr = activeBots.length > 0 ? activeBots.map(b => '#' + b.slot + ' (' + b.botNumber + ')').join(', ') : '';
              return cht.reply(jdbLang.notFound(target, false, activeBotsStr));
            }
          } else {
            let info = Data.jadibot[targetSlot];
            resolvedInfo = {
              slot: targetSlot,
              botNumber: info.botNumber,
              owner: info.owner,
              statusText: info.status === 'online' ? 'Online ✅' : (info.status === 'connecting' ? 'Menghubungkan... ⏳' : 'Offline ❌'),
              hasApikey: !!info.apikey,
              uptimeText: info.onlineSince ? func.parseMs(Date.now() - info.onlineSince) : '0s',
              reconnectCount: info.reconnectCount || 0,
              expiredText: info.expired && info.expired > Date.now() ? func.parseMs(info.expired - Date.now()) : 'Unlimited'
            };
          }

          let statusTpl = jdbLang.status(resolvedInfo, botName);
          return replyJdb(statusTpl, { mentionedJid: [resolvedInfo.owner + '@s.whatsapp.net'] });
        }

        if (action.startsWith("apikey ") || action.startsWith("setapikey ") || action === "apikey") {
          let status = getJadibotStatus(senderNum);
          if (!status.active && !is.owner) {
            return cht.reply("❌ Kamu tidak memiliki sub-bot!");
          }
          let parts = cht.q.trim().split(" ");
          let newKey = parts.slice(1).join(" ").trim();
          if (!newKey) {
            return replyJdb(jdbLang.apikeyGuide(status.hasApikey, status.apikey, botName));
          }
          if (newKey === "reset" || newKey === "delete" || newKey === "hapus") {
            setJadibotApikey({ slot: status.slot, owner: senderNum, apikey: "" });
            return cht.reply("✅ API Key sub-bot telah direset ke default!");
          }
          setJadibotApikey({ slot: status.slot, owner: senderNum, apikey: newKey });
          return cht.reply('✅ API Key sub-bot berhasil diset ke:\n`' + newKey + '`');
        }

        if (action.startsWith("set ") || action.startsWith("setting ")) {
          let status = getJadibotStatus(senderNum);
          if (!status.active && !is.owner) {
            return cht.reply("❌ Kamu tidak memiliki sub-bot!");
          }
          let parts = cht.q.trim().split(" ");
          let opt = (parts[1] || "").toLowerCase();
          let val = parts.slice(2).join(" ").trim();
          if (opt === "public") {
            let isPub = val === "on" || val === "true" || val === "1";
            setJadibotConfig({ slot: status.slot, owner: senderNum, key: "public", value: isPub });
            return cht.reply('✅ Mode bot diset ke: *' + (isPub ? "Public" : "Private") + '*');
          }
          if (opt === "prefix") {
            let pref = val === "false" || val === "off" ? false : val;
            setJadibotConfig({ slot: status.slot, owner: senderNum, key: "prefix", value: pref });
            return cht.reply('✅ Prefix bot diset ke: *' + (pref === false ? "Multi-Prefix" : pref) + '*');
          }
          return replyJdb(jdbLang.settingGuide(botName));
        }

        if (action === "db" || action === "database" || action === "dbstatus") {
          let status = getJadibotStatus(senderNum);
          if (!status.active && !is.owner) {
            return cht.reply("❌ Kamu tidak memiliki sub-bot!");
          }
          let dbInfo = getJadibotDb(senderNum);
          if (!dbInfo) {
            return cht.reply("❌ Database sub-bot tidak ditemukan!");
          }
          let userCount = Object.keys(dbInfo.db.users || {}).length;
          let prefCount = Object.keys(dbInfo.db.preferences || {}).length;
          let respCount = Object.keys(dbInfo.db.response || {}).length;
          let cmdCount = Object.keys(dbInfo.db.setCmd || {}).length;
          return replyJdb(jdbLang.dbStats({
            slot: dbInfo.slot,
            botNumber: dbInfo.botNumber,
            userCount,
            prefCount,
            respCount,
            cmdCount,
            hasApikey: !!dbInfo.db.apikey,
            prefix: dbInfo.db.prefix,
            isPublic: dbInfo.db.public
          }));
        }

        if (action === "cleardb" || action === "resetdb") {
          let status = getJadibotStatus(senderNum);
          if (!status.active && !is.owner) {
            return cht.reply("❌ Kamu tidak memiliki sub-bot!");
          }
          let ok = resetJadibotDb(senderNum);
          if (ok) {
            return cht.reply("🗑️ Database sub-bot berhasil direset ke kondisi bersih!");
          } else {
            return cht.reply("❌ Gagal mereset database sub-bot.");
          }
        }

        if (action.startsWith("addowner ") || action.startsWith("delowner ") || action === "listowner" || action === "owners") {
          let status = getJadibotStatus(senderNum);
          if (!status.active && !is.owner) {
            return cht.reply("❌ Kamu tidak memiliki sub-bot!");
          }
          let slot = status.slot;
          let info = Data.jadibot[slot];
          info.owners ??= [info.owner];
          let botNum = info.botNumber;
          Data.jadibotDb[botNum].owners ??= info.owners;

          if (action === "listowner" || action === "owners") {
            let ownersStr = info.owners.map(o => '@' + String(o).replace(/[^0-9]/g, '')).join(', ');
            return replyJdb(jdbLang.listOwner(slot, info.owner, ownersStr, botName), { mentionedJid: info.owners.map(o => String(o).replace(/[^0-9]/g, '') + '@s.whatsapp.net') });
          }

          let parts = cht.q.trim().split(" ");
          let target = normalizeNumber(parts.slice(1).join(" "));
          if (!target || target.length < 10) {
            return cht.reply("❌ Nomor target tidak valid!\n\nFormat: `.jadibot addowner 628xxx` atau `.jadibot delowner 628xxx`");
          }

          if (action.startsWith("addowner ")) {
            if (!info.owners.includes(target)) info.owners.push(target);
            if (!Data.jadibotDb[botNum].owners.includes(target)) Data.jadibotDb[botNum].owners.push(target);
            return cht.reply('✅ Berhasil menambahkan @' + target + ' sebagai owner sub-bot!', { mentions: [target + '@s.whatsapp.net'] });
          } else {
            if (target === info.owner) {
              return cht.reply("❌ Tidak dapat menghapus owner utama sub-bot!");
            }
            info.owners = info.owners.filter(o => o !== target);
            Data.jadibotDb[botNum].owners = Data.jadibotDb[botNum].owners.filter(o => o !== target);
            return cht.reply('✅ Berhasil menghapus @' + target + ' dari daftar owner sub-bot!', { mentions: [target + '@s.whatsapp.net'] });
          }
        }

        if (action === "relink" || action === "tautulang" || action.startsWith("relink ") || action.startsWith("tautulang ")) {
          if (Exp?.isJadibot || is?.jadibot) {
            return cht.reply(jdbLang.restrictedNested);
          }
          let isQrMode = action.endsWith(" qr") || action.includes(" qr") || cht.q.toLowerCase().includes("qr");
          let cleanQ = action.replace(/relink/gi, "").replace(/tautulang/gi, "").replace(/qr/gi, "").trim();
          let targetSlot = resolveJadibotSlot(cleanQ, senderNum);

          if (!targetSlot || !Data.jadibot?.[targetSlot]) {
            let activeBots = listAllJadibots();
            let activeBotsStr = activeBots.length > 0 ? activeBots.map(b => b.slot + ' (' + b.botNumber + ')').join(', ') : '';
            return cht.reply(jdbLang.notFound(cleanQ, false, activeBotsStr));
          }

          let info = Data.jadibot[targetSlot];
          let targetOwner = String(info.owner || '').replace(/[^0-9]/g, '');
          let targetOwners = (info.owners || []).map(o => String(o).replace(/[^0-9]/g, ''));
          if (!is.owner && targetOwner !== senderNum && !targetOwners.includes(senderNum)) {
            return cht.reply(
              jdbLang.accessDenied(targetSlot, info.botNumber, targetOwner),
              { mentions: [targetOwner + '@s.whatsapp.net'] }
            );
          }

          if (info.status === 'online') {
            return cht.reply(jdbLang.alreadyConnected(targetSlot, info.botNumber));
          }

          if (info.expired && info.expired > 0 && info.expired < Date.now()) {
            return cht.reply('❌ Masa aktif Bot (Slot ' + targetSlot + ') telah kadaluarsa! Silakan buat jadibot baru.');
          }

          let expiredText = info.expired ? func.parseMs(info.expired - Date.now()) : 'Unlimited';
          await cht.reply(jdbLang.relinkHeader(targetSlot, info.botNumber, expiredText));

          await jadibot({
            Exp,
            cht,
            id: targetOwner,
            botNumber: info.botNumber,
            pairing: !isQrMode,
            useQr: isQrMode,
            expired: info.expired || 0,
            userSender: cht.sender,
          });
          return;
        }

        if (!cht.q) {
          if (Exp?.isJadibot || is?.jadibot) {
            return cht.reply(jdbLang.restrictedNested);
          }
          return cht.reply(jdbLang.menu(botName));
        }

        if (Exp?.isJadibot || is?.jadibot) {
          return cht.reply(jdbLang.restrictedNested);
        }

        let isQrMode = action.endsWith(" qr") || action === "qr" || cht.q.toLowerCase().includes("qr") || (cht.quoted && cht.quoted.text && (cht.quoted.text.includes("PAIRING") || cht.quoted.text.includes("pairing")));
        let cleanQ = cht.q.replace(/qr/gi, "").trim();

        let inputTokens = cleanQ ? cleanQ.split(/\s+/) : [];
        let botNumber = '';
        let ownerNumber = senderNum;

        let fullNormalized = normalizeNumber(cleanQ);
        if (fullNormalized && fullNormalized.length >= 10 && fullNormalized.length <= 15) {
          botNumber = fullNormalized;
        } else if (inputTokens.length >= 2) {
          let lastToken = inputTokens[inputTokens.length - 1];
          let lastNum = normalizeNumber(lastToken);
          let firstPartNum = normalizeNumber(inputTokens.slice(0, inputTokens.length - 1).join(" "));
          if (firstPartNum && firstPartNum.length >= 10 && lastNum && lastNum.length >= 10) {
            botNumber = firstPartNum;
            ownerNumber = lastNum;
          } else {
            botNumber = fullNormalized || normalizeNumber(inputTokens[0]);
          }
        } else if (inputTokens.length === 1) {
          botNumber = fullNormalized || normalizeNumber(inputTokens[0]);
        }

        if (!botNumber && (isQrMode || cht.quoted)) {
          let targetSlot = resolveJadibotSlot(cleanQ, senderNum);
          if (targetSlot && Data.jadibot?.[targetSlot]) {
            botNumber = Data.jadibot[targetSlot].botNumber;
          } else {
            let status = getJadibotStatus(senderNum);
            if (status.active) botNumber = status.botNumber;
          }
        }

        if (!botNumber || botNumber.length < 10) {
          return cht.reply(
            typeof infos.others?.nomorBotTidakValidInput === "function"
              ? infos.others.nomorBotTidakValidInput(cht, botNumber)
              : `Nomor bot ${botNumber} tidak valid!`
          );
        }
        let isOnWhatsapp = (await Exp.onWhatsApp(botNumber))?.length > 0;
        if (!isOnWhatsapp) {
          return cht.reply(
            typeof infos.others?.nomorTidakTerdaftarDiWhatsapp === "function"
              ? infos.others.nomorTidakTerdaftarDiWhatsapp(cht, botNumber)
              : `Nomor ${botNumber} tidak terdaftar di WhatsApp!`
          );
        }
        const registeredDb = Data.jadibotDb?.[botNumber];
        const registeredSlot = Object.entries(Data.jadibot || {}).find(
          ([_, v]) => String(v?.botNumber) === String(botNumber)
        );

        let registeredOwner = registeredDb?.owner || registeredSlot?.[1]?.owner;
        let registeredOwners = (registeredDb?.owners || registeredSlot?.[1]?.owners || []).map(o => String(o).replace(/[^0-9]/g, ''));

        if (registeredOwner) {
          registeredOwner = String(registeredOwner).replace(/[^0-9]/g, '');
          if (!is.owner && registeredOwner !== senderNum && !registeredOwners.includes(senderNum)) {
            let slotNum = registeredSlot?.[0] || '1';
            return cht.reply(
              jdbLang.accessDenied(slotNum, botNumber, registeredOwner),
              { mentions: [registeredOwner + '@s.whatsapp.net'] }
            );
          }
        }

        if (registeredSlot) {
          let slotNum = registeredSlot[0];
          let slotStatus = registeredSlot[1]?.status;
          if (slotStatus === 'online') {
            return cht.reply(jdbLang.alreadyConnected(slotNum, botNumber));
          }
          return cht.reply(jdbLang.alreadyRegistered(slotNum, botNumber, slotStatus));
        }

        if (!is.owner) {
          const userEnergy = (await memories.getItem(cht.sender, 'energy')) ?? cht.memories?.energy ?? 0;
          if (userEnergy < 200) {
            return cht.reply(
              '⚡ *ENERGY TIDAK CUKUP*\n\n' +
              '• *Dibutuhkan:* 200 Energy\n' +
              `• *Energy Kamu:* ${userEnergy} Energy\n\n` +
              '> Kamu membutuhkan minimal *200 Energy* untuk menautkan bot.'
            );
          }
        }
        memories.setItem(cht.sender, `jadibot_sess`, null);
        memories.setItem(cht.sender, `questionCmd`, null);
        await cht.reply(
          typeof infos.others?.jadibotStartingBotNumberN === "function"
            ? infos.others.jadibotStartingBotNumberN(
                botNumber,
                botNumber,
                cht,
                ownerNumber
              )
            : `Memulai bot untuk nomor ${botNumber} dengan owner ${ownerNumber}...`
        );
        const expired = Date.now() + 30 * 24 * 60 * 60 * 1000;
        await jadibot({
          Exp,
          cht,
          id: ownerNumber,
          botNumber: botNumber,
          pairing: !isQrMode,
          useQr: isQrMode,
          expired: expired,
          userSender: cht.sender,
        });
      } catch (e) {
        console.error(`[JADIBOT CMD ERROR]`, e);
        memories.setItem(cht.sender, `jadibot_sess`, null);
        memories.setItem(cht.sender, `questionCmd`, null);
        return cht.reply(
          typeof infos.others?.jadibotErrorSessionTelahDireset === "function"
            ? infos.others.jadibotErrorSessionTelahDireset(e)
            : `Terjadi kesalahan. Sesi telah direset.\n\nError: ${e?.message || e}`
        );
      }
    },
  );
}
