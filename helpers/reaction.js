let urls = {
  tiktok: 'tiktok',
  youtu: 'youtube',
  instagram: 'instagram',
  'fb.watch': 'facebook',
  facebook: 'facebook',
  'pin.it': 'pinterest',
  pinterest: 'pinterest',
  mediafire: 'mediafire',
  xiaohongshu: 'rednote',
  'xhslink.com': 'rednote',
  'github.com': 'github',
  'spotify.com': 'spotify',
};
let infos = Data.infos;

export default async function react({ cht, Exp, store, is, ev }) {
  let { id } = cht;
  let { emoji, mtype, text, url, mention, key } = cht.reaction;
  let _url = url[0];
  let urltype =
    _url && Object.entries(urls).find(([keyword]) => _url.includes(keyword))
      ? urls[
          Object.entries(urls).find(([keyword]) => _url.includes(keyword))[0]
        ]
      : null;
  try {
    switch (emoji) {
      //hapus pesan
      case '🗑':
      case '❌':
        if (mention !== Exp.number && !is.groupAdmins && !is.owner)
          return cht.reply(infos.messages.isAdmin);
        if (!is.groupAdmins && !is.owner) {
          let qsender = (await store.loadMessage(id, key.id))?.message
            ?.extendedTextMessage?.contextInfo.quotedMessage?.sender;
          if (qsender && qsender !== cht.sender)
            return cht.reply(
              `*Anda tidak diizinkan menghapus pesan itu!*
\`Sebab:\`
${infos.others.readMore}
- Quoted pesan tersebut bukan berasal dari anda
- Anda bukan owner atau admin untuk mendapatkan izin khusus`,
              { replyAi: false }
            );
        }
        return cht.reaction.delete();
      
      //puter/download musik
      case '🎵':
      case '🎶':
      case '🎧':
      case '▶️':
        if (!text) return cht.reply(infos.reaction.play);
        cht.q = text;
        return ev.emit('play');
      
      //downloader
      case '📥':
      case '⬇️':
        if (!urltype)
          return cht.reply(
            Exp.func.tagReplacer(infos.reaction.download, {
              url: _url,
              listurl: [...new Set(Object.values(urls))].join('\n- '),
            })
          );
        is.url = url;
        cht.q = _url;
        let cmd = urltype == 'youtube' ? 'play' : urltype + 'dl';
        return ev.emit(cmd);
      
      //Ai gemini.google.com
      case '🔎':
      case '🔍':
        cht.q = text;
        return ev.emit('ai');
      
      //skrinsut link yg di reak
      case '📸':
      case '📷':
        is.url = url;
        return ev.emit('ss');
      
      //bacain teks pake vn(ai elevenlabs apinya bisa buy di termai.cc)
      case '🔈':
      case '🔉':
      case '🔊':
      case '🎙️':
      case '🎤':
        cht.cmd = cfg.ai_voice || 'bella';
        cht.q = text;
        return ev.emit(cht.cmd);
      
      //convert image ke stiker atau sebaliknya
      case '🖨️':
      case '🖼️':
      case '🤳🏻':
      case '🤳':
      case '🤳🏼':
      case '🤳🏽':
      case '🤳🏾':
      case '🤳🏿':
        if (mtype == 'sticker') return ev.emit('toimg');
        return ev.emit('s');
      
      //translate ke indo (pake ai)
      case '🌐':
      case '🆔':
        if (!text)
          return cht.reply(
            Exp.func.tagReplacer(infos.reaction.translate, { emoji }),
            { replyAi: false }
          );
        cht.q = 'Terjemahkan ke bahasa indonesia\n\n' + text;
        return ev.emit('gpt');
      
      //tourl
      case '🔗':
      case '📎':
      case '🏷️':
      case '📤':
      case '⬆️':
        return ev.emit('tourl');
      case '📋':
        return ev.emit('menu');
      
      //sepak all warna
      case '🦶':
      case '🦵':
      case '🦵🏻':
      case '🦵🏼':
      case '🦵🏽':
      case '🦵🏾':
      case '🦵🏿':
      case '🦿':
      case '🦶🏼':
      case '🦶🏽':
      case '🦶🏾':
      case '🦶🏿':
        cht.mention = [mention];
        cht.cmd = 'kick';
        return ev.emit('kick');
      
      //reak pengganti warna kulit orang
      case '🟥':
        cht.cmd = 'merahkan'
        return ev.emit(cht.cmd)
      case '🟧':
        cht.cmd = 'orenkan'
        return ev.emit(cht.cmd)
      case '🟨':
        cht.cmd = 'kuningkan'
        return ev.emit(cht.cmd)
      case '🟩':
        cht.cmd = 'hijaukan'
        return ev.emit(cht.cmd)
      case '🟦':
        cht.cmd = 'birukan'
        return ev.emit(cht.cmd)
      case '🟪':
        cht.cmd = 'ungukan'
        return ev.emit(cht.cmd)
      case '⬛':
        cht.cmd = 'hitamkan'
        return ev.emit(cht.cmd)
      case '⬜':
        cht.cmd = 'putihkan'
        return ev.emit(cht.cmd)
      case '🟫':
        cht.cmd = 'gelapkan'
        return ev.emit(cht.cmd)
    }
  } catch (error) {
    console.error('Error in reaction.js:', error);
  }
}
