const { exec } = await 'child'.import();
const { getContentType } = 'baileys'.import();
const util = await 'util'.import();
const _exec = util.promisify(exec);
const fs = 'fs'.import();
const moment = 'timezone'.import();
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss');
const { transcribe } = await (fol[2] + 'transcribe.js').r();
const { ai } = await `${fol[2]}reasoner.js`.r();

const maxCommandExpired = 7000;

export default async function In({ cht, Exp, store, is, ev }) {
  const { func } = Exp;
  let { archiveMemories: memories, parseTimeString } = func;
  let { sender } = cht;
  try {
    const commandExpired = memories.getItem(sender, 'commandExpired');
    let isPendingCmd =
      ['y', 'iy', 'iya', 'yakin', 'hooh', 'iye', 'iyh'].includes(
        cht?.msg?.toLowerCase()
      ) && Date.now() < commandExpired
        ? memories.getItem(sender, 'command')
        : false;
    cht.msg = isPendingCmd ? isPendingCmd : cht.msg;
    if (isPendingCmd) {
      await memories.delItem(sender, 'command');
      await memories.delItem(sender, 'commandExpired');
    }
    let quotedQuestionCmd = memories.getItem(sender, 'quotedQuestionCmd') || {};
    let questionCmd =
      quotedQuestionCmd[cht?.quoted?.stanzaId] ||
      memories.getItem(sender, 'questionCmd');
    let isQuestionCmd =
      questionCmd &&
      cht.quoted &&
      (quotedQuestionCmd[cht?.quoted?.stanzaId] ||
        String(cht.quoted.sender) === String(Exp.number))
        ? questionCmd.accepts.some((i) => i == cht?.msg?.toLowerCase()) ||
          questionCmd.accepts.length < 1
        : false;
    if (isQuestionCmd) {
      if (Date.now() > questionCmd.emit.exp) {
        if (quotedQuestionCmd?.[cht?.quoted?.stanzaId]) {
          delete quotedQuestionCmd[cht.quoted.stanzaId];
          memories.setItem(sender, 'quotedQuestionCmd', quotedQuestionCmd);
        } else {
          memories.delItem(sender, 'questionCmd');
        }
      }
    }
    let isMsg =
      !is?.cmd && !is?.me && !is?.baileys && cht.id !== 'status@broadcast';
    let isEval = cht?.msg?.startsWith('>');
    let isEvalSync = cht?.msg?.startsWith('=>');
    let isExec = cht?.msg?.startsWith('$');
    let danger = cht?.msg?.slice(2) || '';
    const sanitized = danger.replace(/\s/g, '');
    const dangerous = [
      'rm-rf',
      'rm-rf--no-preserve-root',
      'mkfs',
      'rm-f',
      'rm-drf',
      'wipe',
      'shred',
      'chmod-r777',
      'chown',
      'find/-name*.log-delete',
      '/*',
      '*.*',
      '*',
      '/.',
      '/..',
      '>/dev/null',
    ];

    const chatDb = Data.preferences[cht.id] || {};
    const isDangerous =
      dangerous.some((pattern) => sanitized.includes(pattern)) && !isPendingCmd;

    /*!-======[ Automatic Ai ]======-!*/
    let isBella =
      isMsg &&
      (chatDb?.ai_interactive || (is.group && is.owner)) &&
      !is?.document &&
      !is.baileys &&
      !is?.sticker &&
      ((cht?.msg
        ?.toLowerCase()
        .startsWith(
          botnickname.toLowerCase().slice(0, botnickname.length - 1)
        ) &&
        !cht?.me) ||
        cht?.msg?.toLowerCase().startsWith(botnickname.toLowerCase()) ||
        is?.botMention ||
        !is?.group ||
        (is?.owner &&
          cht?.msg
            ?.toLowerCase()
            .startsWith(
              botnickname.toLowerCase().slice(0, botnickname.length - 1)
            ) &&
          !cht?.me) ||
        (is?.owner && is?.botMention));
    let usr = sender.split('@')[0];

    let usr_swap = memories.getItem(usr, 'fswaps');
    let isSwap =
      usr_swap &&
      usr_swap?.list?.length > 0 &&
      is.image &&
      cht.quoted &&
      cht.quoted.sender == Exp.number &&
      !cht.msg;

    let usr_babygenerator = memories.getItem(usr, 'babygenerator');
    let isBabyGen =
      usr_babygenerator &&
      cht.quoted &&
      usr_babygenerator.messages_id.includes(cht.quoted.stanzaId) &&
      !cht.cmd;

    let isTagAfk =
      cht.mention?.length > 0 &&
      (cht.quoted ? true : cht.msg.includes('@')) &&
      cht.mention?.some((a) => memories.getItem(a, 'afk') && a !== sender) &&
      !is.me &&
      is.group;

    let isGame =
      'game' in chatDb && chatDb.game.id_message.includes(cht.quoted?.stanzaId);

    let isSalam = /^a?s?salamu+?a?laiku?u+?m/i.test(
      cht.msg
        ?.toLowerCase()
        .replace(/[\s]/g, '')
        .replace(/[^a-z]/g, '')
    );

    const conff = !is.group
      ? await (async (_id) => {
          let s1 = memories.getItem(_id, 'confess')?.sess || {};
          if (s1.target && s1.acc) {
            let dses = memories.getItem(s1.target, 'confess')?.sess || {};
            if (
              s1.last &&
              s1.max &&
              Date.now() - s1.last <= parseTimeString(s1.max) &&
              dses.target?.split('@')[0] === _id.split('@')[0]
            ) {
              return `${String(s1.target)?.split('@')[0] + from.sender}|${s1.code?.toUpperCase()}|${s1.inviter ? 'inviter' : 'participant'}|${s1.max}`;
            } else {
              await func.clearSessionConfess(_id, s1.target);
              await cht.reply(
                `Sessi percakapan \`${s1.code?.toUpperCase()}\` telah berakhir!`
              );
              return false;
            }
          }
          return false;
        })(sender)
      : false;
    let isConfess = Boolean(conff);
    let isAfkBack = Boolean(is.afk);
    let isAntiTagOwner =
      cfg.antitagowner &&
      !is.owner &&
      cht?.msg?.includes('@') &&
      cht.mention.some((m) => owner.some((o) => m.includes(o)));
    let Response = cht.msg
      ? Object.keys(Data.response).find(
          (a) => a == cht.msg.toLowerCase().replace(/ /g, '')
        )
      : null;
    let isResponse = Response in Data.response;

    switch (!0) {
      case isTagAfk:
        let maxTag = 10;
        let tagAfk = memories.getItem(cht.mention[0], 'afk');
        let userData = await memories.get(sender);
        tagAfk.taggedBy = tagAfk.taggedBy || {};
        if (!(sender in tagAfk.taggedBy)) tagAfk.taggedBy[sender] = 0;
        tagAfk.taggedBy[sender]++;
        if (tagAfk.taggedBy[sender] >= maxTag) {
          await cht.reply(
            `Kamu telah di banned dari bot selama 1 hari karena melakukan tag hingga ${maxTag}x`
          );
          delete tagAfk.taggedBy[sender];
          let tme = '1 Hari';
          let _time = parseTimeString(tme);
          if (!('banned' in userData)) {
            userData.banned = 0;
          }
          let date =
            userData.banned && userData.banned > Date.now()
              ? userData.banned
              : Date.now();
          let bantime = date + _time;
          await Exp.sendMessage(sender, {
            text: `Anda telah di baned selama ${tme} karena terus melakuka tag hingga ${maxTag} kali❗️`,
          });
          return memories.setItem(sender, 'banned', bantime);
        }
        //if(is.botAdmin) await cht.delete()

        let rsn = `\`JANGAN TAG DIA❗\`\nDia sedang *AFK* dengan alasan: *${tagAfk.reason}*\nSejak ${func.dateFormatter(tagAfk.time, 'Asia/Jakarta')}\n\n*[ ⚠️INFO ]*\n_Jangan me-reply/tag orang yang sedang afk!._\n_*Kamu sudah mengetag dia sebanyak ${tagAfk.taggedBy[sender]}x!*_\n_Jika terus melakukan tag hingga ${maxTag}x, jika kamu melakukan tag atau balasan akan dibanned selama 1 hari!_`;
        await cht.reply(rsn);
        memories.setItem(cht.mention[0], 'afk', tagAfk);
        break;
      case isAfkBack:
        let dur = func.formatDuration(Date.now() - is.afk.time);
        let text = `@${sender.split('@')[0]} *Telah kembali dari AFK!*\nSetelah ${is.afk.reason} selama ${dur.days > 0 ? dur.days + 'hari ' : ''}${dur.hours > 0 ? dur.hours + 'jam ' : ''}${dur.minutes > 0 ? dur.minutes + 'menit ' : ''}${dur.seconds > 0 ? dur.seconds + 'detik ' : ''}${dur.milisecondss > 0 ? dur.milisecondss + 'ms ' : ''}`;
        await cht.reply(text, {
          mentions: [sender],
        });
        memories.delItem(sender, 'afk');
        break;
      case is.antibot:
        cht.warnGc({
          type: 'antibot',
          warn: 'Bot terdeteksi!, harap aktifkan mute di group ini atau ubah mode menjadi self!',
          kick: 'Anda akan dikeluarkan karena tidak menonaktifkan bot hingga peringatan terakhir!',
          max: 5,
        });
        break;
      case is.antidelete:
        let deleted = await store.loadMessage(cht.id, cht[cht.type].key.id);
        await Data.utils({ cht: deleted, Exp, is: {}, store });
        let bodyText = `\`ANTI DELETE❗\`\n\n- User/Name: ${cht.sender.split('@')[0]} / ${func.getName(cht.sender)}\n- Type Pesan: ${deleted.type}`;
        let contextInfo = {
          stanzaId: deleted.key.id,
          participant:
            deleted.sender || deleted.key.participant || deleted.key.remoteJid,
          quotedMessage: deleted,
        };
        await Exp.relayMessage(
          cht.id,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  contextInfo,
                  body: {
                    text: bodyText,
                  },
                  footer: {
                    text: 'Untuk menonaktifkan fitur ini, ketik *.off antidelete* (Hanya bisa dilakukan oleh admin atau owner)',
                  },
                  carouselMessage: {},
                },
              },
            },
          },
          {}
        );
        let message = deleted.message;
        let type = getContentType(message);

        if (type == 'conversation') {
          message = {
            extendedTextMessage: {
              text: message[type],
            },
          };
          type = getContentType(message);
        }

        message[type].contextInfo = {
          isForwarded: true,
        };
        await Exp.relayMessage(cht.id, message, {});
        break;
      case is.antilink:
        await cht.warnGc({
          type: 'antilink',
          warn: 'Anda terdeteksi mengirimkan link!. Harap ikuti peraturan disini untuk tidak mengirim link!',
          kick: 'Anda akan dikeluarkan karena melanggar peraturan grup untuk tidak mengirim link hingga peringatan terakhir!',
          max: 3,
        });
        cht.delete();
        break;
      case is.antiTagall:
        await cht.warnGc({
          type: 'antitagall',
          warn: 'Anda terdeteksi melakukan tagall/hidetag. Harap ikuti peraturan disini untuk tidak melakukan tagall/hidetag karena akan mengganggu member disini!',
          kick: 'Anda akan dikeluarkan karena melanggar peraturan grup untuk tidak melakukan tagall/hidetag hingga peringatan terakhir!',
          max: 3,
        });
        cht.delete();
        break;
      case isEvalSync:
        if (!is?.owner) return;
        if (isDangerous) {
          memories.setItem(sender, 'command', cht.msg);
          memories.setItem(
            sender,
            'commandExpired',
            Date.now() + maxCommandExpired
          );
          return cht.reply('Yakin?');
        }
        try {
          let evsync = await eval(`(async () => { ${cht?.msg?.slice(3)} })()`);
          if (typeof evsync !== 'string') evsync = await util.inspect(evsync);
          cht.reply(evsync);
        } catch (e) {
          cht.reply(String(e));
        }
        break;

      case isEval:
        if (!is?.owner) return;
        if (isDangerous) {
          memories.setItem(sender, 'command', cht.msg);
          memories.setItem(
            sender,
            'commandExpired',
            Date.now() + maxCommandExpired
          );
          return cht.reply('Yakin?');
        }
        try {
          let evaled = await eval(cht?.msg?.slice(2));
          if (typeof evaled !== 'string') evaled = await util.inspect(evaled);
          if (evaled !== 'undefined') {
            cht.reply(evaled);
          }
        } catch (err) {
          cht.reply(String(err));
        }
        break;

      case isExec:
        if (!is?.owner) return;
        if (isDangerous) {
          memories.setItem(sender, 'command', cht.msg);
          memories.setItem(
            sender,
            'commandExpired',
            Date.now() + maxCommandExpired
          );
          return cht.reply('Yakin?');
        }
        let txt;
        try {
          const { stdout, stderr } = await _exec(cht?.msg?.slice(2));
          txt = stdout || stderr;
        } catch (error) {
          txt = `Error: ${error}`;
        }
        cht.reply(txt);
        break;
      case isQuestionCmd:
        let [cmd, ...q] = questionCmd.emit.split` `;
        cht.cmd = cmd;
        cht.isQuestionCmd = true;
        cht.q =
          q && q.length > 0
            ? `${q.join(' ')} ${cht.msg?.trim()}`.trim()
            : `${cht.msg?.trim()}`.trim();
        ev.emit(cmd);
        memories.delItem(sender, 'questionCmd');
        if (quotedQuestionCmd?.[cht?.quoted?.stanzaId]) {
          delete quotedQuestionCmd[cht.quoted.stanzaId];
          memories.setItem(sender, 'quotedQuestionCmd', quotedQuestionCmd);
        } else {
          memories.delItem(sender, 'questionCmd');
        }
        break;
      case is.offline:
        {
          global.offresponse = global.offresponse || {};
          global.offresponse[sender] = global.offresponse[sender] || 0;
          global.offresponse[sender]++;
          if (global.offresponse[sender] > cfg.offline.max) return;
          let chat = cht.msg || '';
          let isImage = is?.image
            ? true
            : is.quoted?.image
              ? cht.quoted.sender !== Exp.number
              : false;
          if (cht?.type === 'audio') {
            try {
              chat = (await transcribe(await cht?.download()))?.text || '';
            } catch (error) {
              console.error('Error transcribing audio:', error);
              chat = '';
            }
          }
          if (isImage) {
            let download = is.image ? cht?.download : cht?.quoted?.download;
            isImage = await func.minimizeImage(await download());
          }

          try {
            let _ai = await ai({
              text: chat,
              id: cht?.sender,
              fullainame: botfullname,
              nickainame: botnickname,
              senderName: cht?.pushName,
              ownerName: ownername,
              date: func.newDate(),
              role: `temennya ${ownername}`,
              msgtype: cht?.type,
              custom_profile: func.tagReplacer(
                `Kamu adalah asisten pemilikmu/ownermu yang bernama ${ownername}. Tugasmu adalah memberitahu siapa pun yang menghubungi bahwa ${ownername} sedang off karena alasan "${cfg.offline.reason}" dan telah offline sejak ${func.dateFormatter(cfg.offline.time, 'Asia/Jakarta')} jadi kamu bertugas untuk memberitahukan itu. Jika mereka bertanya tentang alasan ${ownername} offline, ulangi informasi yang sama dengan nada sopan.\n\n**Sifat dan kepribadianmu**:\n${cfg.logic}`,
                {
                  botfullname,
                  botnickname,
                }
              ),
              image: isImage,
              commands: [
                {
                  description:
                    'Jika perlu atau kamu sedang ingin membalas dengan suara',
                  output: {
                    cmd: 'voice',
                    msg: `Pesan di sini. Gunakan gaya bicara ${botnickname} yang menarik dan realistis, lengkap dengan tanda baca yang tepat agar terdengar hidup saat diucapkan.`,
                  },
                },
              ],
            });
            let config = _ai?.data || {};
            await func.addAiResponse();
            switch (config?.cmd) {
              case 'voice':
                try {
                  cfg.ai_voice = cfg.ai_voice || 'bella';
                  await Exp.sendPresenceUpdate('recording', cht?.id);
                  return Exp.sendMessage(
                    cht?.id,
                    {
                      audio: {
                        url: `${api.xterm.url}/api/text2speech/elevenlabs?key=${api.xterm.key}&text=${config?.msg}&voice=${cfg.ai_voice}&speed=0.9`,
                      },
                      mimetype: 'audio/mpeg',
                      ptt: true,
                    },
                    {
                      quoted: cht,
                    }
                  );
                } catch (e) {
                  return console.error(e.response);
                }
            }

            if (config?.cmd !== 'voice') {
              const method =
                cfg.editmsg && config?.energyreply ? 'edit' : 'reply';

              function isFormatMsg(lines) {
                const listRegex = /^[\d\w$&-]+\.\s?.+$/m;
                const symbolListRegex = /^[$\-&]\s?.+$/m;
                return lines
                  .split('\n')
                  .some(
                    (a) =>
                      listRegex.test(a.trim()) || symbolListRegex.test(a.trim())
                  );
              }

              if (config?.msg) {
                if (
                  cfg.ai_interactive?.partResponse &&
                  !config.msg.split('\n').some((a) => a.trim().startsWith('**'))
                ) {
                  let sp = config.msg.split('\n\n');
                  for (let line of sp) {
                    if (!line) return;
                    let isFormat = isFormatMsg(line);
                    if (!isFormat) {
                      let parts = line.split('. ');
                      for (let part of parts) {
                        let typing = part.length * 50;
                        await Exp.sendPresenceUpdate('composing', cht.id);
                        await sleep(typing);
                        await cht.reply(part.trim(), {
                          ai: true,
                        });
                        await sleep(2000);
                      }
                    } else {
                      let typing = line.length * 50;
                      await Exp.sendPresenceUpdate('composing', cht.id);
                      await sleep(typing);
                      await cht.reply(line.trim(), {
                        ai: true,
                      });
                      await sleep(2000);
                    }
                  }
                } else {
                  await cht['reply'](config.msg, {
                    ai: true,
                  });
                }
              }
            }
          } catch (error) {
            console.error('Offline: Error parsing AI response:', error);
          }
        }
        break;
      case isGame:
        Data.eventGame({
          cht,
          Exp,
          store,
          is,
          ev,
          chatDb,
        });
        break;

      case isSwap:
        is?.quoted?.image && delete is.quoted.image;
        cht.cmd = 'faceswap';
        ev.emit('faceswap');
        break;

      case isBabyGen:
        delete cht.q;
        ev.emit('babygenerator');
        break;

      case isConfess:
        {
          let [jid, code, _type, _max] = conff.split('|');
          let kcid1 = `confess|${sender.split('@')[0]}`;
          let kcid2 = `confess|${jid.split('@')[0]}`;

          let _text = `${cht.msg}` + `\n\n> ${code}`;
          let _mess = {
            contextInfo: {
              isForwarded: true,
            },
          };
          let { type } = ev.getMediaType();
          let value;
          let isText = ['conversation', 'extendedTextMessage'].includes(type);
          if (!isText) {
            value = await cht?.download();
            _mess['caption'] = _text;
          } else {
            type = 'text';
            value = _text;
          }
          _mess[type] = value;
          await Exp.sendMessage(
            jid,
            _mess,
            cht.quoted ? keys[kcid2] : undefined
          );
          await sleep(500);
          await Exp.sendMessage(cht.id, {
            react: {
              text: '📤',
              key: cht.key,
            },
          });
          keys[kcid1] = {
            quoted: {
              message: cht.message,
              key: cht.key,
            },
          };
        }
        break;

      case isBella:
        {
          let usr = sender.split('@')[0];
          let user = Data.users[usr];
          let premium = user?.premium ? Date.now() < user.premium.time : false;
          user.autoai.use += 1;
          if (Date.now() >= user?.autoai?.reset && !premium) {
            user.autoai.use = 0;
            user.autoai.reset = Date.now() + parseInt(user?.autoai?.delay);
            user.autoai.response = false;
          }
          if (user?.autoai?.use > user?.autoai?.max && !premium) {
            let formatTimeDur = func.formatDuration(
              user?.autoai?.reset - Date.now()
            );
            let resetOn = func.dateFormatter(
              user?.autoai?.reset,
              'Asia/Jakarta'
            );
            let txt = `*Limit interaksi telah habis!*\n\n*Waktu tunggu:*\n- ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms\n🗓*Direset Pada:* ${resetOn}\n\n*Ingin interaksi tanpa batas?*\nDapatkan premium!, untuk info lebih lanjut ketik *.premium*`;
            if (!user?.autoai?.response) {
              user.autoai.response = true;
              cht.reply(txt);
              return;
            } else {
              return;
            }
          }

          let chat = cht?.msg?.startsWith(botnickname.toLowerCase())
            ? cht?.msg?.slice(botnickname.length)
            : cht?.msg || '';
          let isImage = is?.image
            ? true
            : is.quoted?.image
              ? cht.quoted.sender !== Exp.number
              : false;
          if (cht?.type === 'audio') {
            try {
              chat = (await transcribe(await cht?.download()))?.text || '';
            } catch (error) {
              console.error('Error transcribing audio:', error);
              chat = '';
            }
          }
          if (isImage) {
            let download = is.image ? cht?.download : cht?.quoted?.download;
            isImage = await func.minimizeImage(await download());
          }
          chat = func.clearNumbers(chat);
          try {
            let _ai = await ai({
              text: chat,
              id: cht?.sender,
              fullainame: botfullname,
              nickainame: botnickname,
              senderName: cht?.pushName,
              ownerName: ownername,
              date: func.newDate(),
              role: cht?.memories?.role,
              msgtype: cht?.type,
              custom_profile: func.tagReplacer(cfg.logic, {
                botfullname,
                botnickname,
              }),
              image: isImage,
              commands: [
                {
                  description: 'Jika perlu direspon dengan suara',
                  output: {
                    cmd: 'voice',
                    msg: `Pesan di sini. Gunakan gaya bicara ${botnickname} yang menarik dan realistis, lengkap dengan tanda baca yang tepat agar terdengar hidup saat diucapkan.`,
                  },
                },
                {
                  description:
                    'Jika dalam pesan ada yang ingin memberikan donasi atau donate',
                  output: {
                    cmd: 'donasi',
                    msg: 'Isi pesan kamu seperti sedang memberikan metode pembayaran qris untuk donasi',
                  },
                },
                {
                  description:
                    'Jika dalam pesan ada link tiktok.com dan lalu diminta untuk mendownloadnya',
                  output: {
                    cmd: 'tiktok',
                    cfg: {
                      url: 'isi link tiktok yang ada dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika dalam pesan ada link instagram.com dan diminta untuk mendownloadnya',
                  output: {
                    cmd: 'ig',
                    cfg: {
                      url: 'isi link instagram yang ada dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah perintah/permintaan untuk mencarikan sebuah gambar',
                  output: {
                    cmd: 'pinterest',
                    cfg: {
                      query:
                        "isi gambar apa yang ingin dicari dalam pesan (tambahkan '--geser <jumlah>' di ujung query jika gambar yang diminta lebih dari satu!, contoh: ayam --geser 5)",
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah perintah untuk membuka/menutup group',
                  output: {
                    cmd: ['opengroup', 'closegroup'],
                  },
                },
                {
                  description:
                    'Jika pesan adalah perintah untuk menampilkan menu',
                  output: {
                    cmd: 'menu',
                  },
                },
                {
                  description:
                    'Jika pesan adalah meminta pap atau meminta foto kamu',
                  output: {
                    cmd: 'lora',
                    cfg: {
                      prompt:
                        'isi teks prompt yang menggambarkan tentang kamu, prompt yang menghasilkan gambar seolah-olah kamu itu sedang selfie ((tulis prompt dalam bahasa inggris))',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk mencarikan sebuah video',
                  output: {
                    cmd: 'ytmp4',
                    cfg: {
                      url: 'isi judul video yang diminta',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk memutar sebuah lagu',
                  output: {
                    cmd: 'ytm4a',
                    cfg: {
                      url: 'isi judul lagu yang diminta',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk membuatkan gambar',
                  output: {
                    cmd: 'txt2img',
                    cfg: {
                      prompt:
                        'isi teks prompt yang menggambarkan gambar yang diinginkan. Tulis dalam bahasa Inggris.',
                    },
                  },
                },
                {
                  description:
                    'Jika dalam pesan ada link pin.it atau pinterest.com dan diminta untuk mendownloadnya',
                  output: {
                    cmd: 'pinterestdl',
                    cfg: {
                      url: 'isi link instagram yang ada dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah perintah untuk mendownload menggunakan link youtube',
                  output: {
                    cmd: 'ytm4a',
                    cfg: {
                      url: 'isi link youtube yang ada dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk membuat sticker atau mengubah sebuah gambar menjadi sticker. (Abaikan isi konten pada gambar!)',
                  output: {
                    cmd: 'sticker',
                  },
                },
                {
                  description:
                    'Jika berisi pesan yang membutuhkan jawaban dari internet atau search engine',
                  output: {
                    cmd: 'bard',
                    cfg: {
                      query: 'isi pertanyaan yg dimaksud dalam pesan',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan melakukan pengeditan atau perubahan pada gambar',
                  output: {
                    cmd: 'img2img',
                    cfg: {
                      prompt:
                        'isi teks prompt yang menjelaskan perubahan yang diinginkan pada gambar. Tulis dalam bahasa Inggris',
                    },
                  },
                },
                {
                  description:
                    'Jika pesan adalah permintaan untuk mengubah gambar menjadi video atau melakukan penganimasian gambar',
                  output: {
                    cmd: 'img2video',
                    cfg: {
                      prompt:
                        'Jelaskan animasi atau transformasi video yang diinginkan dari gambar. Tentukan elemen seperti gerakan, transisi, atau efek. Tulis dalam bahasa Inggris.',
                    },
                  },
                },
              ],
            });
            let config = _ai?.data || {};
            await func.addAiResponse();
            let noreply = false;
            switch (config?.cmd) {
              case 'sticker':
                await cht.reply(config?.msg || 'ok');
                return ev.emit('s');
              case 'afk':
                await cht.reply(config?.msg || 'ok');
                cht.q = config?.cfg?.reason;
                return ev.emit('afk');
              case 'bard':
                await cht.reply(config?.msg || 'ok');
                cht.q = config.cfg?.query;
                return ev.emit('bard');
              case 'public':
                if (!is?.owner) return cht.reply('Maaf, males nanggepin');
                global.cfg.public = true;
                return cht.reply('Berhasil mengubah mode menjadi public!');
              case 'self':
                if (!is?.owner) return cht.reply('Maaf, males nanggepin');
                global.cfg.public = false;
                return cht.reply('Berhasil mengubah mode menjadi self!');
              case 'voice':
                try {
                  cfg.ai_voice = cfg.ai_voice || 'bella';
                  await Exp.sendPresenceUpdate('recording', cht?.id);
                  return Exp.sendMessage(
                    cht?.id,
                    {
                      audio: {
                        url: `${api.xterm.url}/api/text2speech/elevenlabs?key=${api.xterm.key}&text=${config?.msg}&voice=${cfg.ai_voice}&speed=0.9`,
                      },
                      mimetype: 'audio/mpeg',
                      ptt: true,
                    },
                    {
                      quoted: cht,
                    }
                  );
                } catch (e) {
                  console.log(e.response);
                }
              case 'donasi':
                noreply = true;
                return Exp.sendMessage(
                  cht.id,
                  {
                    image: {
                      url: 'https://files.catbox.moe/7wqoq2.jpg',
                    },
                    caption: config?.msg,
                  },
                  {
                    quoted: cht,
                  }
                );
              case 'tiktok':
              case 'pinterestdl':
              case 'menu':
              case 'ig':
                noreply = true;
                is.url = [config?.cfg?.url || ''];
                await cht.reply(config?.msg || 'ok');
                return ev.emit(config?.cmd);
              case 'ytm4a':
              case 'ytmp4':
                noreply = true;
                cht.cmd = config?.cmd;
                is.url = [config?.cfg?.url || ''];
                await cht.reply(config?.msg || 'ok');
                return ev.emit(config?.cmd);
              case 'lora':
                noreply = true;
                cfg.models = cfg.models || {
                  checkpoint: 1552,
                  loras: [2067],
                };
                let { checkpoint, loras } = cfg.models;
                cht.q = `${checkpoint}${JSON.stringify(loras)}|${config?.cfg?.prompt}|blurry, low quality, low resolution, deformed, distorted, poorly drawn, bad anatomy, bad proportions, unrealistic, oversaturated, underexposed, overexposed, watermark, text, logo, cropped, cluttered background, cartoonish, bad face, double face, abnormal`;
                await cht.reply(config?.msg || 'ok');
                return ev.emit('txt2img');
              case 'txt2img':
                cht.q = config?.cfg?.prompt || '';
                await cht.reply(config?.msg || 'ok');
                return ev.emit('dalle3');
              case 'img2img':
                cht.q = config?.cfg?.prompt || '';
                await cht.reply(config?.msg || 'ok');
                return ev.emit('edit');
              case 'pinterest':
                noreply = true;
                await cht.reply(config?.msg || 'ok');
                cht.q = config?.cfg?.query || '';
                return ev.emit(config?.cmd);
              case 'closegroup':
                noreply = true;
                cht.q = 'close';
                return ev.emit('group');
              case 'opengroup':
                noreply = true;
                cht.q = 'open';
                return ev.emit('group');
              case 'img2video':
                cht.q = config?.cfg?.prompt || '';
                await cht.reply(config?.msg || 'ok');
                return ev.emit('i2v');
            }

            if (config?.energy && cfg.ai_interactive.energy) {
              let conf = {};
              conf.energy = /[+-]/.test(`${config.energy}`)
                ? `${config.energy}`
                : `+${config.energy}`;
              if (conf.energy.startsWith('-')) {
                conf.action = 'reduceEnergy';
              } else {
                conf.action = 'addEnergy';
              }
              await memories[conf.action](
                cht?.sender,
                parseInt(conf.energy.slice(1))
              );
              await cht.reply(config.energy + ' Energy⚡️');
              config.energyreply = true;
            }
            if (config?.cmd !== 'voice' && !noreply) {
              const method =
                cfg.editmsg && config?.energyreply ? 'edit' : 'reply';

              function isFormatMsg(lines) {
                const listRegex = /^[\d\w$&-]+\.\s?.+$/m;
                const symbolListRegex = /^[$\-&]\s?.+$/m;
                return lines
                  .split('\n')
                  .some(
                    (a) =>
                      listRegex.test(a.trim()) || symbolListRegex.test(a.trim())
                  );
              }

              if (config?.msg) {
                if (
                  cfg.ai_interactive?.partResponse &&
                  !config.msg.split('\n').some((a) => a.trim().startsWith('**'))
                ) {
                  let sp = config.msg.split('\n\n');
                  for (let line of sp) {
                    if (!line) return;
                    let isFormat = isFormatMsg(line);
                    if (!isFormat) {
                      let parts = line.split('. ');
                      for (let part of parts) {
                        let typing = part.length * 50;
                        await Exp.sendPresenceUpdate('composing', cht.id);
                        await sleep(typing);
                        await cht.reply(part.trim());
                        await sleep(2000);
                      }
                    } else {
                      let typing = line.length * 50;
                      await Exp.sendPresenceUpdate('composing', cht.id);
                      await sleep(typing);
                      await cht.reply(line.trim());
                      await sleep(2000);
                    }
                  }
                } else {
                  await cht[method](config.msg, keys[sender]);
                }
              }
            }
          } catch (error) {
            console.error('Error parsing AI response:', error);
          }
        }
        break;
      case isSalam:
        cht.reply("Wa'alaikumussalaam...");
        break;

      case isAntiTagOwner:
        {
          let message = Data.response['tagownerresponse'];
          if (message) {
            let type = getContentType(message);
            message[type].contextInfo = {
              stanzaId: cht.key.id,
              participant: cht.key.participant || etc.quoted?.key.remoteJid,
              quotedMessage: cht,
            };
            Exp.relayMessage(cht.id, message, {});
          } else {
            cht.reply('😡');
          }
        }
        break;

      case isResponse:
        {
          let message = Data.response[Response];
          let type = getContentType(message);
          message[type].contextInfo = {
            stanzaId: cht.key.id,
            participant: cht.key.participant || etc.quoted?.key.remoteJid,
            quotedMessage: cht,
            mentionedJid: message[type]?.contextInfo?.mentionedJid,
          };
          Exp.relayMessage(cht.id, message, {});
        }
        break;
    }
  } catch (error) {
    console.error('Error in Interactive:', error);
  }
}
