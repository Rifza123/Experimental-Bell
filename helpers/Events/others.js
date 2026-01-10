/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const { downloadContentFromMessage } = 'baileys'.import();
const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r();
const { dashboard } = await (fol[2] + 'dashboard.js').r();
/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id } = cht;
  const { func } = Exp;
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
              text: '',
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
                newsletterJid: '120363301254798220@newsletter',
                newslettedName: 'Termai',
                serverMessageId: 152,
              },
            },
          },
        };

        Exp.relayMessage(cht.id, _m, {});
      } else if (cfg?.menu_type == 'text') {
        menu.text = text;
        await Exp.sendMessage(id, menu, { quoted: cht });
      } else if (cfg?.menu_type == 'image') {
        menu.image = fs.readFileSync(fol[3] + 'bell.jpg');
        menu.caption = text;
        await Exp.sendMessage(id, menu, { quoted: cht });
      } else if (cfg?.menu_type == 'video') {
        menu.video = {
          url: cfg.menu.video || 'https://c.termai.cc/v86/J剗K尿fY',
        };
        menu.caption = text;
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
                  newsletterJid: '120363301254798220@newsletter',
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
                  newsletterJid: '120363301254798220@newsletter',
                  newslettedName: 'Termai',
                  serverMessageId: 152,
                },
              },
            },
          },
          {}
        );
      } else {
        menu = {
          text,
          contextInfo: {
            externalAdReply: {
              title: cht.pushName,
              body: 'Artificial Intelligence, The beginning of the robot era',
              thumbnail: fs.readFileSync(fol[3] + 'bell.jpg'),
              sourceUrl: 'https://github.com/Rifza123',
              mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 100000000000000000)}`,
              renderLargerThumbnail: true,

              mediaType: 1,

              sourceId: 'IMAGE',
              sourceUrl: 'https://instagram.com/rifza.p.p',
            },
            forwardingScore: 19,
            isForwarded: true,
            forwardedNewsletterMessageInfo: cfg.chId || {
              newsletterJid: '120363301254798220@newsletter',
              newslettedName: 'Termai',
              serverMessageId: 152,
            },
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
}
