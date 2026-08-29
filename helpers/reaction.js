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
  const { func } = Exp;
  let { emoji, mtype, text, url, mention, key } = cht.reaction;
  let _url = url[0];

  const emit = async (Ev, cmd, extra = {}, opts = {}) => {
    let c = { cmd, msg: cht.prefix + cmd, ...extra };
    for (let i of Object.keys(c)) {
      cht[i] = c[i];
    }
    return Ev.emit(cmd, opts);
  };

  let urltype =
    _url && Object.entries(urls).find(([keyword]) => _url.includes(keyword))
      ? urls[
          Object.entries(urls).find(([keyword]) => _url.includes(keyword))[0]
        ]
      : null;

  try {
    switch (emoji) {
      case '🗑':
      case '❌':
        if (mention !== Exp.number && !is.groupAdmins && !is.owner)
          return cht.reply(infos.messages.isAdmin);

        if (!is.groupAdmins && !is.owner) {
          let qsender = (await store.loadMessage(id, key.id))?.message
            ?.extendedTextMessage?.contextInfo?.quotedMessage?.sender;

          if (qsender && qsender !== cht.sender)
            return cht.reply(
              func.tagReplacer(infos.reaction.kickNotAllowed, {
                readMore: infos.others.readMore,
              }),
              { replyAi: false }
            );
        }
        return cht.reaction.delete();

      case '🎵':
      case '🎶':
      case '🎧':
      case '▶️':
      case '▶':
        if (!text) return cht.reply(infos.reaction.play);
        return emit(ev, 'playvn', { q: text }, { silent: true });

      case '📥':
      case '⬇️':
      case '⬇':
        if (!urltype)
          return cht.reply(
            Exp.func.tagReplacer(infos.reaction.download, {
              url: _url,
              listurl: [...new Set(Object.values(urls))].join('\n- '),
            })
          );
        return emit(ev, urltype == 'youtube' ? 'playvn' : urltype + 'dl', {
          q: _url,
          url,
          is,
        });

      case '🔎':
      case '🔍':
        return emit(ev, 'ai', { q: text });

      case '📸':
      case '📷':
        return emit(ev, 'ss', { url, is });

      case '🔈':
      case '🔉':
      case '🔊':
      case '🎙️':
      case '🎙':
      case '🎤':
        return emit(ev, cfg.ai_voice || 'bella', { q: text }, { silent: true });

      //convert image ke stiker atau sebaliknya
      case '🖨️':
      case '🖼️':
      case '🤳🏻':
      case '🤳':
      case '🤳🏼':
      case '🤳🏽':
      case '🤳🏾':
      case '🤳🏿':
        return mtype == 'sticker' ? ev.emit(ev, 'toimg') : emit(ev, 's');

      //translate ke indo (pake ai)
      case '🌐':
      case '🆔':
        if (!text)
          return cht.reply(
            Exp.func.tagReplacer(infos.reaction.translate, { emoji }),
            { replyAi: false }
          );
        return emit(ev, 'gpt', {
          q: 'Terjemahkan ke bahasa indonesia\n\n' + text,
        });

      //tourl
      case '🔗':
      case '📎':
      case '🏷️':
      case '📤':
      case '⬆️':
        return emit(ev, 'tourl');

      case '📋':
        return ev.emit(ev, 'menu');

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
        return emit(ev, 'kick', { mention: [mention] });

      //reak pengganti warna kulit orang
      case '🟥':
        return emit(ev, 'merahkan');
      case '🟧':
        return emit(ev, 'orenkan');
      case '🟨':
        return emit(ev, 'kuningkan');
      case '🟩':
        return emit(ev, 'hijaukan');
      case '🟦':
        return emit(ev, 'birukan');
      case '🟪':
        return emit(ev, 'ungukan');
      case '⬛':
        return emit(ev, 'hitamkan');
      case '⬜':
        return emit(ev, 'putihkan');
      case '🟫':
        return emit(ev, 'gelapkan');
    }
  } catch (error) {
    console.error('Error in reaction.js:', error);
  }
}
