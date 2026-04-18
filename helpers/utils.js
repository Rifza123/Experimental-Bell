const { proto, getContentType, generateWAMessage } = 'baileys'.import();

export default async function utils({ Exp, cht, is, store }) {
  try {
    Data.preferences[cht?.id] ??= {};
    Data.setCmd ??= {};

    const { func } = Exp;
    let { archiveMemories: memories } = func;

    const sender = await Exp.func['getSender'](
      cht?.participant ||
        cht?.key?.participant ||
        cht?.key?.remoteJid ||
        Exp?.user?.id ||
        '',
      { cht }
    );
    cht.sender = sender;
    cht.key.participantPn = cht.sender;
    cht.delete = async () =>
      Exp.sendMessage(cht.id, { delete: cht.key }).then((a) => undefined);

    const type = getContentType(cht?.message);
    const isProtocol = /^(protocolMessage)/.test(type);
    let isDelete = isProtocol && cht.message[type].type === 0;

    if (isProtocol && !isDelete) return 'SKIP';

    const msgType =
      type === 'extendedTextMessage'
        ? getContentType(cht?.message?.[type])
        : type;
    cht.type = Exp.func['getType'](msgType) || type;

    cht.quoted = cht?.message?.[type]?.contextInfo?.quotedMessage || false;

    cht.msg =
      cht.id === 'status@broadcast'
        ? null
        : Data.setCmd[
            cht?.message?.[type]?.fileSha256?.toString()?.to('utf16le')
          ] ||
          [
            { type: 'conversation', msg: cht?.message?.[type] },
            { type: 'extendedTextMessage', msg: cht?.message?.[type]?.text },
            { type: 'imageMessage', msg: cht?.message?.[type]?.caption },
            { type: 'videoMessage', msg: cht?.message?.[type]?.caption },
            { type: 'pollCreationMessageV3', msg: cht?.message?.[type]?.name },
            {
              type: 'ephemeralMessage',
              msg:
                cht?.message?.[type]?.message?.extendedTextMessage?.text ||
                cht?.message?.[type]?.message?.imageMessage?.caption,
            },
            { type: 'eventMessage', msg: cht?.message?.[type]?.description },
            {
              type: 'interactiveResponseMessage',
              msg: cht?.message?.[type]?.nativeFlowResponseMessage?.paramsJson
                ? JSON.parse(
                    cht.message?.[type].nativeFlowResponseMessage?.paramsJson
                  )?.id
                : null,
            },
            {
              type: 'templateButtonReplyMessage',
              msg: cht?.message?.[type]?.selectedId,
            },
            {
              type: 'buttonsResponseMessage',
              msg: cht?.message?.[type]?.selectedButtonId,
            },
          ].find((entry) => type === entry.type)?.msg ||
          null;

    cht.prefix = /^[.#‽٪]/.test(cht.msg) ? cht?.msg?.match(/^[.#‽٪]/gi) : '#';
    global.prefix = cht.prefix;
    //cht.msg = cht?.msg?.startsWith(cht.prefix) ? cht.msg: cht.prefix + cht.msg
    cht.cmd = cht?.msg?.startsWith(cht.prefix)
      ? await (async () => {
          let cmd = cht?.msg
            ?.slice(1)
            ?.toLowerCase()
            ?.trim()
            ?.split(/ +/)
            .shift();
          if (
            (cfg.similarCmd || cfg.didYouMean) &&
            Object.keys(Data.events).length !== 0 &&
            Data.events[cmd] === undefined
          ) {
            let events = Object.keys(Data.events).filter(
              (a) =>
                cmd.length >= a.length && Math.abs(cmd.length - a.length) <= 2
            );
            let similar = cfg.didYouMean
              ? 0.5
              : cmd.length <= 4
                ? 0.3
                : cmd.length <= 7
                  ? 0.4
                  : cmd.length <= 10
                    ? 0.5
                    : 0.6;
            return cfg.didYouMean
              ? cmd
              : func.getTopSimilar(
                  await func.searchSimilarStrings(cmd, events, similar)
                ).item;
          }
          return cmd;
        })()
      : null;
    cht.download = async () =>
      Exp.func.download(cht?.message?.[type], cht.type);

    cht[cht.type] = cht?.message?.[type];

    if (cht.type == 'reactionMessage') {
      let react = await store.loadMessage(cht.id, cht[cht.type].key.id);

      let rtype = getContentType(react?.message);
      let mtype = Exp.func['getType'](rtype);
      let rtext =
        rtype == 'conversation'
          ? react.message[rtype]
          : rtype === 'extendedTextMessage'
            ? react.message[rtype]?.text
            : rtype === 'imageMessage' || rtype === 'videoMessage'
              ? react.message[rtype]?.caption
              : type === 'interactiveResponseMessage'
                ? JSON.parse(
                    react?.message?.[rtype]?.nativeFlowResponseMessage
                      ?.paramsJson
                  )?.id
                : null;
      cht.reaction = Object.assign(
        {},
        {
          key: cht[cht.type]?.key,
          emoji: cht[cht.type]?.text,
          mtype,
          text: rtext,
          message: {
            conversation: cht[cht.type]?.text,
          },
          url: rtext ? func.parseLink(rtext) : [],
          mention: await Exp.func['getSender'](
            react?.participant ||
              react?.key?.participant ||
              react?.key?.remoteJid,
            { cht }
          ),
          download: async () =>
            Exp.func.download(react?.message?.[rtype], mtype),
          delete: async () =>
            Exp.sendMessage(cht.id, { delete: cht[cht.type]?.key }),
        }
      );
      cht.reaction[mtype] = react?.message?.[rtype];
    }
    if (cht.quoted) {
      const quotedParticipant = cht?.message?.[type]?.contextInfo?.participant;
      cht.quoted.sender = await Exp.func['getSender'](quotedParticipant, {
        cht,
      });
      cht.quoted.mtype = Object.keys(cht.quoted)[0];
      cht.quoted.type = Exp.func['getType'](cht.quoted.mtype);
      cht.quoted.memories = cfg?.register
        ? memories.has(cht.quoted.sender)
          ? await memories.get(cht.quoted.sender)
          : {}
        : await memories.get(cht.quoted.sender);
      cht.quoted[cht.quoted.type] = cht?.quoted?.[cht.quoted.mtype];
      cht.quoted.text =
        cht.quoted?.[cht.quoted.type]?.caption ||
        cht.quoted?.[cht.quoted.type]?.text ||
        cht.quoted?.conversation ||
        false;
      cht.quoted.url = cht.quoted.text ? func.parseLink(cht?.quoted?.text) : [];
      cht.quoted.download = async () =>
        Exp.func.download(cht.quoted?.[cht.quoted.type], cht.quoted.type);
      cht.quoted.stanzaId = cht?.message?.[type]?.contextInfo?.stanzaId;
      cht.quoted.delete = cht.quoted.del = async () =>
        Exp.sendMessage(cht.id, {
          delete: {
            ...(await store.loadMessage(cht.id, cht.quoted.stanzaId)).key,
            participant: cht.quoted.sender,
          },
        });
      cht.quoted.key = {
        remoteJid: cht.id,
        fromMe: cht.quoted.sender.includes(Exp.number),
        id: cht.quoted.stanzaId,
        participant: cht.quoted.sender,
      };
    }

    const args = cht?.msg?.trim()?.split(/ +/)?.slice(1);
    let q = args?.join(' ');
    cht.args = q;
    cht.q = String(q || cht?.quoted?.text || '').trim();
    cht.mention = await func.getMentions(cht);

    Exp.number = Exp?.user?.id?.split(':')[0] + from.sender;

    is.me = cht?.key?.fromMe || cht.sender == Exp.number;
    is.owner =
      global.owner.some((a) => {
        const jid = String(a)
          ?.split('@')[0]
          ?.replace(/[^0-9]/g, '');
        return jid && jid + from.sender === cht.sender;
      }) || is.me;
    is.coowner = global.coowner.some((a) => {
      const jid = String(a)
        ?.split('@')[0]
        ?.replace(/[^0-9]/g, '');
      return jid && jid + from.sender === cht.sender;
    });
    is.group = cht.id?.endsWith(from.group);
    const groupDb = is.group ? Data.preferences[cht.id] : {};
    if (is.group) {
      const groupMetadata = await Exp.groupMetadata(cht.id);
      Exp.groupMetdata = groupMetadata;
      Exp.groupMembers = groupMetadata.participants;
      Exp.groupName = groupMetadata.subject;
      Exp.groupAdmins = Exp.func.getGroupAdmins(groupMetadata.participants);
      is.botAdmin = Exp.groupAdmins.includes(Exp.number);
      is.groupAdmins = Exp.groupAdmins.includes(cht.sender);
    }
    cht.memories = cfg?.register
      ? memories.has(cht.sender)
        ? await memories.get(cht.sender, { is })
        : {}
      : await memories.get(cht.sender, { is });

    let url = cht?.msg ? func.parseLink(cht?.msg) : [];

    is.baileys = /^(3EB|BAE5|BELL409|Laurine|B1E)/.test(cht.key.id);
    is.botMention = cht?.mention?.includes(Exp.number);
    is.cmd = cht.cmd;
    is.sticker = cht.type === 'sticker';
    is.audio = cht.type === 'audio';
    is.image = cht.type === 'image';
    is.video = cht.type === 'video';
    is.document = cht.type === 'document';
    is.url = url;
    is.offline =
      'offline' in cfg &&
      typeof cfg.offline === 'object' &&
      !is.owner &&
      !is.group;
    is.memories = cht.memories;
    is.quoted = cht.quoted;
    is.reaction = cht.reaction;
    is.afk =
      is.group && memories.has(sender)
        ? memories.getItem(sender, 'afk')
        : false;
    is.mute = groupDb?.mute && !is.owner && !is.me;
    is.onlyadmin = groupDb?.onlyadmin && !is.owner && !is.me && !is.groupAdmins;
    is.antiTagall =
      groupDb?.antitagall &&
      cht.mention?.length >= 5 &&
      !is.owner &&
      !is.coowner &&
      !is.groupAdmins &&
      url?.length < 1;
    is.antibot =
      groupDb?.antibot &&
      !is.owner &&
      !is.coowner &&
      !is.groupAdmins &&
      is.baileys &&
      is.botAdmin;
    is.antilink =
      groupDb?.antilink &&
      url.length > 0 &&
      url.some((a) => groupDb?.links?.some((b) => a.includes(b))) &&
      !is.me &&
      !is.owner &&
      !is.coowner &&
      !is.groupAdmins &&
      is.botAdmin;
    is.antidelete =
      groupDb?.antidelete &&
      isDelete &&
      !is.me &&
      !is.owner &&
      !is.coowner &&
      !is.groupAdmins &&
      !is.baileys;
    is.autosticker =
      groupDb?.autosticker && (is.video || is.image) && !is.baileys;
    is.antitoxic =
      groupDb?.antitoxic &&
      cht?.msg?.length > 0 &&
      [...Data.toxicwords, ...groupDb.badwords].some((pattern) => {
        if (typeof pattern === 'string') {
          return cht.msg.toLowerCase().includes(pattern.toLowerCase());
        } else {
          return pattern.test(cht.msg);
        }
      }) &&
      !is.me &&
      !is.owner &&
      !is.coowner &&
      !is.groupAdmins &&
      is.botAdmin &&
      !is.baileys;
    is.autodownload =
      groupDb?.autodownload && !is.me && !is.baileys && is?.url?.length > 0;
    is.antitagsw =
      groupDb?.antitagsw &&
      !is.me &&
      !is.owner &&
      !is.coowner &&
      !is.groupAdmins &&
      cht.type == 'groupStatusMentionMessage';
    is.antiImage =
      groupDb?.antiimg &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins &&
      is.botAdmin &&
      cht.type == 'image';
    is.antiVideo =
      groupDb?.antivid &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins &&
      is.botAdmin &&
      cht.type == 'video';
    is.antiSticker =
      groupDb?.antistk &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins &&
      is.botAdmin &&
      cht.type == 'sticker';
    is.antiStickerPack =
      groupDb?.antistcpck &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins &&
      is.botAdmin &&
      cht.type == 'stickerPackMessage';
    is.antiAudio =
      groupDb?.antiaudio &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins &&
      is.botAdmin &&
      cht.type == 'audio';
    is.antiVoice =
      groupDb?.antivoice &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins &&
      is.botAdmin &&
      cht.type == 'audio' &&
      cht[cht.type]?.ptt;
    is.antiDoc =
      groupDb?.antidoct &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins &&
      is.botAdmin &&
      cht.type == 'document';

    is.antich = Boolean(
      groupDb?.antich &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins &&
      is.botAdmin &&
      (Object.values(cht?.message || {})?.[0]?.contextInfo
        ?.forwardedNewsletterMessageInfo ||
        is.url.find(
          (a) => a.includes('whatsapp.com') && a.includes('/channel')
        ))
    );

    is.bypassOnlyGC =
      !is.group &&
      (['confess', 'confessinfo'].includes(cht.cmd) ||
        cht.memories?.confess?.sess?.acc);

    is.blacklist =
      groupDb?.blacklist?.includes(cht.sender) &&
      !is.owner &&
      !is.coowner &&
      !is.me &&
      !is.groupAdmins;
    is.bancmd =
      cht.cmd &&
      groupDb?.cmdblocked?.includes(cht.cmd) &&
      !is.owner &&
      !is.coowner &&
      !is.me;

    is.spam =
      groupDb?.antispam &&
      !is.me &&
      !is.owner &&
      !is.coowner &&
      !is.groupAdmins &&
      is.group &&
      Data.antispam?.[cht.id]?.[cht.sender] &&
      Data.antispam[cht.id][cht.sender].count > 6 &&
      Date.now() - Data.antispam[cht.id][cht.sender].time <= 10000;
    cht.reply = async function (text, etc = {}, quoted = { quoted: true }) {
      try {
        // kalo cfg.replyAi = true bakal ngubah balasan pake AI
        let finalText =
          typeof cfg.font == 'string' && cfg.font !== 'normal'
            ? text.font(cfg.font)
            : text;
        const useAi = 'replyAi' in etc ? etc.replyAi : cfg.replyAi;

        if (useAi) {
          try {
            const { gpt } = await (fol[2] + 'gpt3.js').r();
            let query = `Kamu adalah sebuah alat transformasi teks, bukan asisten umum.
Tugasmu hanya satu: mengubah teks agar sesuai dengan profil karakter di bawah.

Profil Karakter:
${cfg.logic}

Instruksi Penting:
- Selalu terapkan gaya bicara, kepribadian, dan sifat sesuai profil.
- Jangan pernah menolak atau menjawab di luar instruksi.
- Jangan menambahkan penjelasan, catatan, atau kalimat lain.
- Hanya ubah gaya bahasanya, jangan ubah makna isi teks.
- Jawaban akhir WAJIB berupa hasil teks yang sudah diubah, tanpa tambahan apapun.

Teks asli: "${text}"

Balasan akhir (teks yang sudah diubah sesuai profil):`;
            let res = await gpt(query);
            if (res.response) finalText = res.response.trim();
          } catch (e) {
            console.error('Error repltAi:', e);
          }
        }

        if (quoted?.quoted) {
          quoted.quoted = cht?.reaction
            ? {
                key: {
                  fromMe: cht.key.fromMe,
                  participant: cht.sender,
                },
                message: {
                  conversation: cht.reaction.emoji,
                },
              }
            : cht;
        }

        const { key } = await Exp.sendMessage(
          cht.id,
          { text: finalText, ...etc },
          quoted
        );
        keys[cht.sender] = key;
        return { key };
      } catch (e) {
        console.error("Error in 'cht.reply'\n", e);
      }
    };

    cht.replyWithTag = async function (text, tag) {
      try {
        const { key } = await Exp.sendMessage(
          cht.id,
          { text: Exp.func.tagReplacer(text, tag) },
          { quoted: cht }
        );
        keys[cht.sender] = key;
        return { key };
      } catch (e) {
        console.error("Error in 'cht.replyWithTag'\n" + e);
      }
    };

    cht.edit = async function (text, key, force) {
      if (!('editmsg' in cfg)) cfg.editmsg = true;
      let msg = { text: text || '...' };
      if (cfg.editmsg || force) msg.edit = key;
      try {
        await Exp.sendMessage(cht.id, msg, { quoted: cht });
      } catch (e) {
        console.error("Error in 'cht.edit'\n" + e);
      }
    };

    cht.react = async function (text, _cht = null) {
      try {
        return Exp.sendMessage(cht.id, {
          react: {
            text,
            key: _cht ? _cht.key : cht.key,
          },
        });
      } catch (e) {
        console.error("Error in 'cht.react'\n" + e);
      }
    };

    cht.warnGc = async ({ id, type, warn, kick, max }) => {
      let t = type || 'antibot';
      let jid = id || cht.sender;
      groupDb.warn = groupDb.warn || {};
      groupDb.warn[jid] = groupDb.warn[jid] || {};
      groupDb.warn[jid][t] = groupDb.warn[jid][t] || {
        value: 1,
        reset: Date.now() + 8640000,
      };
      if (groupDb.warn[jid][t].reset < Date.now()) {
        groupDb.warn[jid][t] = { value: 1, reset: Date.now() + 8640000 };
      }
      if (groupDb.warn[jid][t].value > max) {
        await cht.reply(kick);
        delete groupDb.warn[jid][t];
        await Exp.groupParticipantsUpdate(cht.id, [jid], 'remove');
      } else {
        await cht.reply(
          `*Peringatan ke ${groupDb.warn[jid][t].value}⚠️*\n\n${warn}\n\n_Jika sudah di beri peringatan ${max} kali maka akan otomatis dikeluarkan!_`
        );
        groupDb.warn[jid][t].value++;
      }
      Data.preferences[cht.id] = groupDb;
    };
    cht.question = async (
      text,
      { emit, sender, exp, accepts, Keys, maxUse = 1 },
      etc = {}
    ) => {
      try {
        let { key } = await cht.reply(text, etc);
        let qcmds =
          memories.getItem(sender || cht.sender, 'quotedQuestionCmd') || {};
        qcmds[key.id] = {
          emit: emit || `${cht.cmd}`,
          exp: exp || Date.now() + 60000,
          Keys,
          use: 0,
          maxUse: Number(maxUse),
          accepts: accepts || [],
        };
        memories.setItem(sender || cht.sender, 'quotedQuestionCmd', qcmds);
        return qcmds[key.id];
      } catch (e) {
        console.error('cht.question', e);
        return String(e);
      }
    };
    return 'NEXT';
  } catch (error) {
    console.error('Error in utils:', error);
    return 'ERROR';
  }
}
