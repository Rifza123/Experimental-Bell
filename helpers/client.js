/*!-======[ Module Imports ]======-!*/
const chalk = 'chalk'.import();

/*!-======[ Default Export Function ]======-!*/
export default async function client({ Exp, store, cht, is, chatDb, sewaDb }) {
  let { func } = Exp;
  let { archiveMemories: memories } = func;
  try {
    let m = store?.messages?.[cht.id] || {};
    m.idmsg ??= [];
    if (m.idmsg.includes(cht.key.id)) return;
    m.idmsg = [...m.idmsg, cht.key.id].slice(-7);

    if (cht.memories?.banned && !is.owner) {
      if (cht.memories.banned * 1 > Date.now()) return;
      memories.delItem(cht.sender, 'banned');
    }

    chatDb.ai_interactive ??= Data.preferences[cht.id].ai_interactive =
      cfg.ai_interactive[is.group ? 'group' : 'private'];
    let frmtEdMsg = cht.reaction
      ? cht.reaction.emoji
      : cht?.msg?.length > 50
        ? `\n${cht.msg}`
        : cht.msg;

    if (cht.msg || cht.reaction) {
      cfg['autotyping'] && (await Exp.sendPresenceUpdate('composing', cht.id));
      cfg[is.group ? 'autoreadgc' : 'autoreadpc'] &&
        (await Exp.readMessages([cht.key]));

      console.log(
        func.logMessage(
          is.group ? 'GROUP' : 'PRIVATE',
          is.group ? cht.id : cht.sender,
          func.getName(cht.sender),
          frmtEdMsg
        )
      );

      /* *pendataan total chat user* */
      Exp.addChat({ cht, is });

      if (cfg.antipc && !is.bypassOnlyGC && !is.group && !is.owner) {
        let text =
          `\`⚠️KAMU TELAH DI BLOKIR!⚠️\`` +
          '\n- *Bot dalam mode anti Private Chat!*' +
          '\n> _Setiap user yang menghubungi bot melalui private chat akan otomatis di blokir!_';
        await Exp.sendMessage(cht.id, { text });
        await Exp.updateBlockStatus(cht.id, 'block');
      }
    }

    /*!-======[ Block Chat ]======-!*/
    if (!cfg.public && !is.owner && !is.me && !is.offline) return;
    if (cfg.public === 'onlygc' && !is.group && !is.owner) return;
    if (cfg.public === 'onlypc' && is.group && !is.owner && !is.bypassOnlyGC)
      return;
    if (
      cfg.public === 'onlyjoingc' &&
      !is.owner &&
      cht.cmd &&
      cht.memories?.premium?.time < Date.now() &&
      cfg.gcurl?.length > 0
    ) {
      let isJoin;
      let list = cfg.gcurl.map((a) => `- ${a}`).join('\n');
      for (let i of cfg.gcurl) {
        let ii = i.split('/').slice(-1)?.[0]?.split('?')?.[0];
        keys[ii] ??= await Exp.groupGetInviteInfo(ii).then((a) => a.id);
        let mem = await func
          .getGroupMetadata(keys[ii])
          .then((a) =>
            a.participants.map(
              (a) => a[cht.sender.endsWith('@lid') ? 'lid' : 'id']
            )
          );
        if (mem.includes(cht.sender)) {
          isJoin = true;
          break;
        }
      }
      if (
        !isJoin &&
        (!cht.memories.cdIsJoin || cht.memories.cdIsJoin >= Date.now())
      ) {
        cht.memories.cdIsJoin = Date.now() + func.parseTimeString('10 menit');
        return cht.reply(Data.infos.client.onlyJoinGc.replace('<list>', list), {
          replyAi: false,
        });
      }
    }
    if (is.group && cfg.sewa && !Data.sewa[cht.id] && !is.owner) return;
    if (
      is.group &&
      cfg.sewa &&
      cht.id in Data.sewa &&
      (sewaDb.status == 'grace' ||
        sewaDb.status == 'expired' ||
        sewaDb.graceUntil) &&
      !is.owner
    )
      return;

    /*
      🔧 Handling LID (Linked ID / PC user)
      - getSender akan mencari ID dalam Data.lids
      - Jika user masih @lid, minta mereka bergabung ke grup dengan addressingMode @lid
      - func.getGroupMetadata otomatis menyimpan data peserta (lid -> id) ke Data.lids
    */

    if (!is.group && cht.sender.endsWith('@lid')) {
      let isJoin = false;
      let gcurl = Array.isArray(cfg.gcurl) ? cfg.gcurl : [];

      let urls = gcurl.length === 0 ? [] : gcurl;

      let metadata;

      if (urls.length > 0) {
        for (let url of urls) {
          let code = url.split('/').slice(-1)?.[0]?.split('?')?.[0];
          keys[code] ??= await Exp.groupGetInviteInfo(code).then((a) => a.id);
          metadata = await func.getGroupMetadata(keys[code]);

          let mem = metadata.participants.map((a) => a.lid);
          if (mem.includes(cht.sender)) {
            isJoin = true;
            break;
          }
        }
      }

      if (
        metadata?.addressingMode === 'lid' &&
        !isJoin &&
        (!cht.memories.cdIsJLid || cht.memories.cdIsJLid >= Date.now())
      ) {
        cht.memories.cdIsJLid = Date.now() + func.parseTimeString('10 menit');
        let listText = urls.map((a) => `- ${a}`).join('\n');

        await cht.reply(Data.infos.client.lidJoin.replace('<list>', listText), {
          replyAi: false,
        });
        await sleep(1000);
      }
    }

    let except = is.antiTagall || is.antibot || is.antilink;
    if ((is.baileys || is.mute || is.onlyadmin) && !except) return;

    const exps = { Exp, store, cht, is, chatDb, sewaDb };
    const ev = new Data.EventEmitter({ ...exps });
    Data.ev ??= ev;
    if (!is.offline && !is.afk && (cht.cmd || cht.reaction)) {
      let regmsg = Exp.checkRegisterNeeded({ cht, memories });
      if (regmsg === true) return;
      if (typeof regmsg == 'string' && Data.events[cht.cmd])
        return cht.reply(regmsg);
      cht.cmd &&
        (await Promise.all([
          'questionCmd' in cht.memories &&
            memories.delItem(cht.sender, 'questionCmd'),
          !regmsg &&
            (await ev.emit(cht.cmd, exps)) == 'NOTFOUND' &&
            cfg.didYouMean &&
            (async (cht) => {
              let didYouMean = await func
                .searchSimilarStrings(cht.cmd, Object.keys(Data.events), 0.5)
                .then((a) =>
                  a.map(
                    (res, idx) =>
                      `${idx + 1}. ${res.item} (kemiripan: ${(res.similarity * 100).toFixed(2)}%)`
                  )
                );

              didYouMean.length > 0 &&
                (await cht.react('🤔')) &&
                (await sleep(1000));
              didYouMean.length > 0 &&
                (await cht.reply(
                  `Maaf, command \`${cht.cmd}\` tidak ada dalam menu.\nMungkin yang kamu maksud:\n${didYouMean.join('\n')}`
                ));
            })(cht),
        ]));
      cht.reaction && (await Data.reaction({ ev, ...exps }));
    } else {
      await Data.In({ ev, ...exps });
    }

    /*!-======[ Chat Interactions Add ]======-!*/
    !cht.cmd && is.botMention && (await memories.addChat(cht.sender));

    await memories.setItem(cht.sender, 'name', cht.pushName);
    memories.setItem(cht.sender, 'lastChat', Date.now());
  } catch (error) {
    console.error('Error in client.js:', error);
  }
  return;
}
