const { proto, getContentType, generateWAMessage } = 'baileys'.import();

export default async function utils({ Exp, cht, is, store }) {
  try {
    Data.preferences[cht.id] ??= {};
    Data.setCmd ??= {};

    const { func } = Exp;
    let { archiveMemories: memories } = func;

    const sender =
      cht?.participant ||
      cht?.key?.participant ||
      cht?.key?.remoteJid ||
      Exp?.user?.id ||
      '';
    cht.sender = await Exp.func['getSender'](sender, { cht });
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
          ].find((entry) => type === entry.type)?.msg ||
          null;

    cht.prefix = /^[.#‽٪]/.test(cht.msg) ? cht?.msg?.match(/^[.#‽٪]/gi) : '#';
    global.prefix = cht.prefix;

    cht.cmd = cht?.msg?.startsWith(cht.prefix)
      ? await (async () => {
          let cmd = cht?.msg
            ?.slice(1)
            ?.toLowerCase()
            ?.trim()
            ?.split(/ +/)
            .shift();
          if (
            cfg.similarCmd &&
            Object.keys(Data.events).length !== 0 &&
            Data.events[cmd] === undefined
          ) {
            let events = Object.keys(Data.events).filter(
              (a) =>
                cmd.length >= a.length && Math.abs(cmd.length - a.length) <= 2
            );
            let similar =
              cmd.length <= 4
                ? 0.3
                : cmd.length <= 7
                  ? 0.4
                  : cmd.length <= 10
                    ? 0.5
                    : 0.6;
            return func.getTopSimilar(
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
          url: rtext
            ? (
                rtext?.match(/https?:\/\/[^\s)]+/g) ||
                rtext?.match(
                  /(https?:\/\/)?[^\s]+\.(com|watch|net|org|it|xyz|id|co|io|ru|uk|kg|gov|edu|dev|tech|codes|ai|shop|me|info|online|store|biz|pro|aka|moe)(\/[^\s]*)?/gi
                ) ||
                []
              ).map((url) =>
                (url.startsWith('http') ? url : 'https://' + url).replace(
                  /['"`]/g,
                  ''
                )
              )
            : [],
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
      cht.quoted.memories = await memories.get(cht.quoted.sender);
      cht.quoted[cht.quoted.type] = cht?.quoted?.[cht.quoted.mtype];
      cht.quoted.text =
        cht.quoted?.[cht.quoted.type]?.caption ||
        cht.quoted?.[cht.quoted.type]?.text ||
        cht.quoted?.conversation ||
        false;
      cht.quoted.url = cht.quoted.text
        ? (
            cht?.quoted?.text?.match(/https?:\/\/[^\s)]+/g) ||
            cht?.quoted?.text?.match(
              /(https?:\/\/)?[^\s]+\.(com|watch|net|org|it|xyz|id|co|io|ru|uk|kg|gov|edu|dev|tech|codes|ai|shop|me|info|online|store|biz|pro|aka|moe)(\/[^\s]*)?/gi
            ) ||
            []
          ).map((url) =>
            (url.startsWith('http') ? url : 'https://' + url).replace(
              /['"`]/g,
              ''
            )
          )
        : [];
      cht.quoted.download = async () =>
        Exp.func.download(cht.quoted?.[cht.quoted.type], cht.quoted.type);
      cht.quoted.stanzaId = cht?.message?.[type]?.contextInfo?.stanzaId;
      cht.quoted.delete = async () =>
        Exp.sendMessage(cht.id, {
          delete: {
            ...(await store.loadMessage(cht.id, cht.quoted.stanzaId)).key,
            participant: cht.quoted.sender,
          },
        });
    }

    const args = cht?.msg?.trim()?.split(/ +/)?.slice(1);
    let q = args?.join(' ');
    cht.args = q;
    cht.q = await String(q || cht?.quoted?.text || '').trim();
    cht.mention = await Promise.all(
      (q && cht.q.extractMentions().length > 0
        ? cht.q.extractMentions().filter((a) => {
            const n = a?.split('@')[0];
            return n && n.length > 5 && n.length <= 15;
          })
        : cht?.message?.[type]?.contextInfo?.mentionedJid?.length > 0
          ? cht.message[type].contextInfo.mentionedJid
          : cht?.message?.[type]?.contextInfo?.participant
            ? [cht.message[type].contextInfo.participant]
            : []
      ).map((m) => Exp.func['getSender'](m, { cht }))
    );

    Exp.number = Exp?.user?.id?.split(':')[0] + from.sender;

    is.me = cht?.key?.fromMe || cht.sender == Exp.number;
    is.owner =
      global.owner.some((a) => {
        const jid = String(a)
          ?.split('@')[0]
          ?.replace(/[^0-9]/g, '');
        return jid && jid + from.sender === cht.sender;
      }) || is.me;

    is.group = cht.id?.endsWith(from.group);
    const groupDb = is.group ? Data.preferences[cht.id] : {};
    if (is.group) {
      const groupMetadata = await Exp.func.getGroupMetadata(cht.id, Exp);
      Exp.groupMetdata = groupMetadata;
      Exp.groupMembers = groupMetadata.participants;
      Exp.groupName = groupMetadata.subject;
      Exp.groupAdmins = Exp.func.getGroupAdmins(groupMetadata.participants);
      is.botAdmin = Exp.groupAdmins.includes(Exp.number);
      is.groupAdmins = Exp.groupAdmins.includes(cht.sender);
    }
    cht.memories = await memories.get(cht.sender, { is });

    let url = cht?.msg
      ? (
          cht?.msg?.match(/https?:\/\/[^\s)]+/g) ||
          cht?.msg?.match(
            /(https?:\/\/)?[^\s]+\.(com|watch|net|org|it|xyz|id|co|io|ru|uk|kg|gov|edu|dev|tech|codes|ai|shop|me|info|online|store|biz|pro|aka|moe)(\/[^\s]*)?/gi
          ) ||
          []
        ).map((url) =>
          (url.startsWith('http') ? url : 'https://' + url).replace(
            /['"`]/g,
            ''
          )
        )
      : [];

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
    is.afk = is.group ? memories.getItem(sender, 'afk') : false;
    is.mute = groupDb?.mute && !is.owner && !is.me;
    is.onlyadmin = groupDb?.onlyadmin && !is.owner && !is.me && !is.groupAdmins;
    is.antiTagall =
      groupDb?.antitagall &&
      cht.mention?.length >= 5 &&
      !is.owner &&
      !is.groupAdmins &&
      url?.length < 1;
    is.antibot =
      groupDb?.antibot &&
      !is.owner &&
      !is.groupAdmins &&
      is.baileys &&
      is.botAdmin;
    is.antilink =
      groupDb?.antilink &&
      url.length > 0 &&
      url.some((a) => groupDb?.links?.some((b) => a.includes(b))) &&
      !is.me &&
      !is.owner &&
      !is.groupAdmins &&
      is.botAdmin;
    is.antidelete =
      groupDb?.antidelete &&
      isDelete &&
      !is.me &&
      !is.owner &&
      !is.groupAdmins &&
      !is.baileys;

    cht.reply = async function (text, etc = {}, quoted = { quoted: true }) {
      try {
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

        const { key } = await Exp.sendMessage(cht.id, { text, ...etc }, quoted);
        keys[cht.sender] = key;
        return { key };
      } catch (e) {
        console.error("Error in 'cht.reply'\n" + e);
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
    return 'NEXT';
  } catch (error) {
    console.error('Error in utils:', error);
    return 'ERROR';
  }
}
