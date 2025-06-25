/*!-======[ Module Imports ]======-!*/
const chalk = 'chalk'.import();

/*!-======[ Default Export Function ]======-!*/
export default async function client({ Exp, store, cht, is }) {
  let { func } = Exp;
  try {
    if (cht.memories?.banned && !is.owner) {
      if (cht.memories.banned * 1 > Date.now()) return;
      func.archiveMemories.delItem(cht.sender, 'banned');
    }

    Data.preferences[cht.id].ai_interactive ??= Data.preferences[
      cht.id
    ].ai_interactive = cfg.ai_interactive[is.group ? 'group' : 'private'];
    let frmtEdMsg = cht?.msg?.length > 50 ? `\n${cht.msg}` : cht.msg;

    if (cht.msg) {
      cfg['autotyping'] && (await Exp.sendPresenceUpdate('composing', cht.id));
      cfg[is.group ? 'autoreadgc' : 'autoreadpc'] &&
        (await Exp.readMessages([cht.key]));
      console.log(
        func.logMessage(
          is.group ? 'GROUP' : 'PRIVATE',
          cht.id,
          cht.pushName,
          frmtEdMsg
        )
      );
    }

    /*!-======[ Block Chat ]======-!*/
    if (!cfg.public && !is.owner && !is.me && !is.offline) return;
    if (cfg.public === 'onlygc' && !is.group && !is.owner) return;
    if (cfg.public === 'onlypc' && is.group && !is.owner) return;
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
        let ii = i.split('/').slice(-1)[0];
        keys[ii] ??= await Exp.groupGetInviteInfo(ii).then((a) => a.id);
        let mem = await func
          .getGroupMetadata(keys[ii], Exp)
          .then((a) => a.participants.map((a) => a.id));
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
        return cht.reply(
          `Anda harus bergabung ke salah satu grup dibawah sebelum dapat menggunakan bot!\n\`LIST INVITELINK\`\n${list}\n\n_Setelah bergabung harap tunggu selama 1 menit sebelum menggunakan bot!, data anggota grup hanya di perbarui setiap 1 menit sekali guna mengurangi rate-limit!_`
        );
      }
    }
    let except = is.antiTagall || is.antibot || is.antilink;
    if ((is.baileys || is.mute || is.onlyadmin) && !except) return;

    let exps = { Exp, store, cht, is };
    let ev = new Data.EventEmitter(exps);
    Data.ev ??= ev;
    if (!is.offline && !is.afk && (cht.cmd || cht.reaction)) {
      cht.cmd &&
        (await Promise.all([
          'questionCmd' in cht.memories &&
            func.archiveMemories.delItem(cht.sender, 'questionCmd'),
          ev.emit(cht.cmd),
        ]));
      cht.reaction && (await Data.reaction({ ev, ...exps }));
    } else {
      await Data.In({ ev, ...exps });
    }

    /*!-======[ Chat Interactions Add ]======-!*/
    !cht.cmd &&
      is.botMention &&
      (await func.archiveMemories.addChat(cht.sender));

    await func.archiveMemories.setItem(cht.sender, 'name', cht.pushName);
    func.archiveMemories.setItem(cht.sender, 'lastChat', Date.now());
  } catch (error) {
    console.error('Error in client.js:', error);
  }
  return;
}
