/*!-======[ Module Imports ]======-!*/
const chalk = 'chalk'.import();

/*!-======[ Default Export Function ]======-!*/
export default async function client({ Exp, store, cht, is }) {
  let { func } = Exp;
  try {
    const chatDb = Data.preferences[cht.id] || {};
    let m = store.messages[cht.id];
    m.idmsg ??= [];
    if (m.idmsg.includes(cht.key.id)) return;
    m.idmsg = [...m.idmsg, cht.key.id].slice(-7);

    if (cht.memories?.banned && !is.owner) {
      if (cht.memories.banned * 1 > Date.now()) return;
      func.archiveMemories.delItem(cht.sender, 'banned');
    }

    chatDb.ai_interactive ??= Data.preferences[cht.id].ai_interactive =
      cfg.ai_interactive[is.group ? 'group' : 'private'];
    let frmtEdMsg = cht.reaction ? cht.reaction.emoji : cht?.msg?.length > 50 ? `\n${cht.msg}` : cht.msg;

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
        let ii = i.split('/').slice(-1)?.[0]?.split('?')?.[0];
        keys[ii] ??= await Exp.groupGetInviteInfo(ii).then((a) => a.id);
        let mem = await func
          .getGroupMetadata(keys[ii], Exp)
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
        return cht.reply(
          `Anda harus bergabung ke salah satu grup dibawah sebelum dapat menggunakan bot!\n\`LIST INVITELINK\`\n${list}\n\n_Setelah bergabung harap tunggu selama 2 menit sebelum menggunakan bot!, data anggota grup hanya di perbarui setiap 2 menit sekali guna mengurangi rate-limit!_`,
          { replyAi: false }
        );
      }
    }

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
          metadata = await func.getGroupMetadata(keys[code], Exp);

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

        await cht.reply(
          `Nomor asli Anda tidak dapat terdeteksi karena menggunakan @lid. 
Silakan bergabung ke salah satu grup di bawah agar sistem dapat mengenali nomor Anda. 
(Tanpa bergabung, data Anda hanya akan tersimpan sebagai @lid dan tidak lengkap)

\`LIST UNDANGAN GRUP\`
${listText}

_Setelah bergabung, harap tunggu ±2 menit sebelum menggunakan bot. 
Data anggota grup diperbarui setiap 2 menit sekali untuk mengurangi beban server dan rate-limit._`,
          { replyAi: false }
        );
        await sleep(1000);
      }
    }

    let except = is.antiTagall || is.antibot || is.antilink;
    if ((is.baileys || is.mute || is.onlyadmin) && !except) return;
    
    let exps = { Exp, store, cht, is, chatDb };
    let ev = new Data.EventEmitter(exps);
    Data.ev ??= ev;
    if (!is.offline && !is.afk && (cht.cmd || cht.reaction)) {
      if(cfg.register && !func.archiveMemories.has(cht.sender) && !['register','daftar'].includes(cht.cmd?.toLowerCase())) return cht.reply("Anda belum terdaftar di database kami!, silahkan lakukan pendaftaran dengan mengetik *.register*", { replyAi: false })
      cht.cmd &&
        (await Promise.all([
          'questionCmd' in cht.memories &&
            func.archiveMemories.delItem(cht.sender, 'questionCmd'),
          ev.emit(cht.cmd, exps),
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
