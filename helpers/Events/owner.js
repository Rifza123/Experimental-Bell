/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const path = 'path'.import();
const {
  getContentType,
  generateWAMessage,
  STORIES_JID,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
} = 'baileys'.import();

/*!-======[ Function Imports ]======-!*/
const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r();

let Lists = {
  audio: Object.keys(Data.audio),
  fquoted: Object.keys(Data.fquoted),
};

const roles = {
  /* 
  Role ini berdasarkan role default dari role.js
  kalo mau ubah ini wajib ubah role.js terlebih dahulu 
*/
  'Gak kenal': 0,
  'Baru kenal': 10,
  'Temen biasa': 31,
  'Temen Ngobrol': 51,
  'Temen Gosip': 101,
  'Temen Lama': 151,
  'Temen Hangout': 301,
  'Temen Deket': 351,
  'Temen Akrab': 501,
  'Temen Baik': 651,
  Sahabat: 801,
  'Sahabat Deket': 1351,
  'Sahabat Sejati': 3201,
  Pacar: 4551,
  '🎀Soulmate🦋': 10001,
};

let keyroles = Object.keys(roles);

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  let infos = Data.infos;
  const { func } = Exp;
  const { getDirectoriesRecursive, archiveMemories: memories } = func;
  const { id, sender } = cht;
  const preferences = is?.jadibot
    ? ((Data.preferencesBot ??= {})[Exp.user.id.split(':')[0]] ??= {})
    : (Data.preferences ??= {});

  function sendPremInfo({ _text, text }, cust = false, number) {
    return Exp.sendMessage(
      number || id,
      {
        text: `${_text ? _text + '\n\n' + text : text}`,
        contextInfo: {
          externalAdReply: {
            title: !cust ? '🔐Premium Access!' : '🔓Unlocked Premium Access!',
            body: !cust
              ? infos.owner.lockedPrem
              : 'Sekarang kamu adalah user 🔑Premium, dapat menggunakan fitur² terkunci!',
            thumbnailUrl: !cust
              ? 'https://telegra.ph/file/310c10300252b80e12305.jpg'
              : 'https://telegra.ph/file/ae815f35da7c5a2e38712.jpg',
            mediaUrl: `http://ẉa.me/6283110928302/${!cust ? '89e838' : 'jeie337'}`,
            sourceUrl: `https://wa.me/${owner[0].split('@')[0]}?text=Hello,+I+have+buy+🔑Premium`,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            mediaType: 1,
          },
          mentionedJid: cht.mention,
        },
      },
      { quoted: cht }
    );
  }

  ev.on(
    {
      cmd: ['set'],
      listmenu: ['set'],
      tag: 'owner',
      isOwner: true,
    },
    async ({ args, urls }) => {
      try {
        if (!args) {
          const isWsConnected = keys['__livechart_ws__']?.ws?.readyState === 1;
          const ownerSection = infos.owner?.statsOwnerSection
            ? infos.owner.statsOwnerSection({
                version: cfg.version || '1.0.0',
                isWsConnected,
              })
            : null;
          let txt = infos.owner.set;
          if (ownerSection) {
            txt += '\n\n' + (typeof ownerSection === 'object' && ownerSection?.body ? ownerSection.body : ownerSection);
          }
          return cht.reply(txt);
        }
        let fquotedKeys = Object.keys(Data.fquoted);
        let [t1, t2, t3, t4] = args.split(' ');
        const options = {
          public: 'mode public',
          autotyping: 'auto typing',
          autoreadsw: 'auto read sw',
          autoreadpc: 'auto read pc',
          autoreadgc: 'auto read group',
          premium_mode: 'premium mode',
          editmsg: 'edit message',
          similarCmd: 'similarity command',
          antitagowner: 'Anti Tag Owner',
          register: 'register mode',
          keyChecker: 'Auto detector apikey',
          autoBackup: 'Auto Backup (21.00 WIB)',
          didYouMean: 'DidYouMean',
          font: 'font style',
          energy_mode: 'Energy Mode',
          button: 'Button',
          rich: 'Rich Response Meta AI',
          remoteReaction: 'remoteReaction',
          linkpreview: 'linkpreview',
          listSection: 'List Section',
          sewa: 'sewa',
          antipc: 'antipc',
          dadu: 'media dadu ulartangga',
        };
        let optKey = Object.keys(options).find((k) => k.toLowerCase() === t1?.toLowerCase());
        if (optKey) t1 = optKey;
        if (!options[t1] && t1.includes('\n')) {
          t1 = t1.split('\n')[0];
        }
        let on = ['on', 'true'],
          off = ['off', 'false'],
          isOn = on.includes(t2),
          isOff = off.includes(t2),
          isOnly = ['onlypc', 'onlygc', 'onlyjoingc'].includes(t2);

        if (is?.jadibot) {
          const slot = is.jadibotId;
          const botNum = Exp.user.id.split(':')[0];
          Data.jadibotDb ??= {};
          Data.jadibotDb[botNum] ??= {};

          if (t1 === 'dadu') {
            Data.jadibotDb[botNum].setCmd ??= {};
            if (isOff || t2 === 'del' || t2 === 'delete' || t2 === 'off') {
              if (Data.jadibotDb[botNum].daduMedia?.sha256) {
                delete Data.jadibotDb[botNum].setCmd[
                  Data.jadibotDb[botNum].daduMedia.sha256
                ];
              }
              delete Data.jadibotDb[botNum].daduMedia;
              return cht.reply('✅ Media dadu bot kamu berhasil dihapus!');
            }
            let { quoted, type } = ev.getMediaType();
            if (!type)
              return cht.reply(
                `Reply pesan media (stiker, gambar, video, audio, dll) dengan caption: ${cht.prefix}set dadu`
              );
            let mediaObj = quoted ? cht.quoted : cht;
            let sha256 = mediaObj[type]?.fileSha256?.toString()?.to('utf16le');
            let msgContent = (
              await store.loadMessage(cht.id, mediaObj.stanzaId || cht.key.id)
            )?.message ||
              mediaObj.message || { [type + 'Message']: mediaObj[type] };

            if (Data.jadibotDb[botNum].daduMedia?.sha256) {
              delete Data.jadibotDb[botNum].setCmd[
                Data.jadibotDb[botNum].daduMedia.sha256
              ];
            }
            if (sha256) Data.jadibotDb[botNum].setCmd[sha256] = '.dadu';
            Data.jadibotDb[botNum].daduMedia = {
              sha256,
              type,
              message: msgContent,
            };
            return cht.reply(
              `✅ Media dadu berhasil diset!\n- Type: ${type}\n\nSaat permainan Ular Tangga dimulai, media ini akan dikirim sebagai dadu.\nPemain cukup kirim ulang media ini saat gilirannya untuk melempar dadu.${type === 'stickerMessage' || type === 'sticker' ? '\n\n> ℹ️ Karena media berupa stiker, pemain harus menyimpan stiker terlebih dahulu sebelum bisa mengirimnya.' : ''}`
            );
          }
          if (t1 === 'public') {
            let isPub = isOn || t2 === 'public';
            if (isOff) isPub = false;
            Data.jadibot[slot].public = isPub;
            Data.jadibotDb[botNum].public = isPub;
            return cht.reply(
              `✅ Mode Sub-Bot diset ke: *${isPub ? 'Public' : 'Private'}*`
            );
          }
          if (t1 === 'apikey') {
            if (!t2) return cht.reply('Silahkan masukkan API Key!');
            Data.jadibot[slot].apikey = t2.trim();
            Data.jadibotDb[botNum].apikey = t2.trim();
            Exp.apiKey = t2.trim();
            return cht.reply(
              `✅ API Key Sub-Bot berhasil diset ke: \`${t2.trim()}\``
            );
          }
          if (t1 === 'prefix') {
            let pref = isOff ? false : t2 || false;
            Data.jadibot[slot].prefix = pref;
            Data.jadibotDb[botNum].prefix = pref;
            return cht.reply(
              `✅ Prefix Sub-Bot diset ke: *${pref === false ? 'Multi-Prefix' : pref}*`
            );
          }
          if (t1 === 'logic') {
            let profile =
              func.findValue('profile', cht.q) ||
              func.findValue('logic', cht.q) ||
              t2;
            Data.jadibotDb[botNum].logic = profile;
            return cht.reply(`✅ AI Logic Sub-Bot berhasil diperbarui!`);
          }
          if (t1 === 'voice') {
            if (!t2)
              return cht.reply('`LIST VOICES`\n- ' + Data.voices.join('\n- '));
            Data.jadibotDb[botNum].ai_voice = t2.trim();
            return cht.reply(`✅ AI Voice Sub-Bot diset ke: *${t2.trim()}*`);
          }
          if (options[t1]) {
            Data.jadibotDb[botNum][t1] = isOn ? true : isOff ? false : t2;
            return cht.reply(
              `✅ Setting *${options[t1]}* pada Sub-Bot diset ke: *${t2}*`
            );
          }
          return cht.reply(
            `❌ Setting \`${t1}\` tidak tersedia atau diset khusus untuk sub-bot.`
          );
        }

        let mode =
          options[t1] ||
          (t1 == 'fquoted'
            ? `Success ${fquotedKeys.includes(t2) ? 'change' : 'add'} fake quoted ${t2}\n\nList fake quoted:\n\n- ${!fquotedKeys.includes(t2) ? [...fquotedKeys, t2].join('\n- ') : fquotedKeys.join('\n- ')}`
            : t1 == 'voice'
              ? infos.owner.successSetVoice
              : t1 == 'logic'
                ? infos.owner.successSetLogic
                : t1 == 'menu'
                  ? infos.owner.successSetMenu
                  : t1 == 'lang'
                    ? true
                    : t1 == 'call'
                      ? infos.owner.setCall
                      : t1 == 'hadiah'
                        ? infos.owner.setHadiah
                        : t1 == 'autoreactsw'
                          ? infos.owner.setAutoreactSw
                          : t1 == 'lora'
                            ? `Example: .${cht.cmd} ${t1} 2067`
                            : t1 == 'checkpoint'
                              ? `Example: .${cht.cmd} ${t1} 1552`
                              : t1 == 'apikey'
                                ? true
                                : t1 == 'chid'
                                  ? true
                                  : t1 == 'replyAi'
                                    ? infos.owner.setReplyAi
                                    : false);

        if (!mode) return cht.reply(infos.owner.set);
        switch (t1) {
          case 'fquoted':
            {
              if (!t2) return cht.reply(infos.owner.setFquoted);
              let json;
              if (t3) {
                json = cht.q.split(' ').slice(2).join('');
              } else if (is.quoted) {
                let { key } = await store.loadMessage(
                  cht.id,
                  cht.quoted.stanzaId
                );
                let msg = { key };
                let qmsg =
                  cht.message.extendedTextMessage.contextInfo.quotedMessage;
                let type = getContentType(qmsg);
                if (type.includes('pollCreationMessage')) {
                  msg.message = {
                    pollCreationMessage:
                      qmsg.pollCreationMessage ||
                      qmsg.pollCreationMessageV2 ||
                      qmsg.pollCreationMessageV3,
                  };
                } else {
                  msg.message = qmsg;
                }
                json = JSON.stringify(msg);
              }
              try {
                let obj = JSON.parse(json);
                Data.fquoted[t2] = obj;
                cht.reply(mode);
              } catch (e) {
                cht.replyWithTag(infos.owner.checkJson, {
                  e,
                  rm: infos.others.readMore,
                });
              }
            }
            break;
          case 'logic':
            {
              if (!t2)
                return cht.replyWithTag(infos.owner.setLogic, {
                  logic: cfg.logic,
                  botnickname,
                  botfullname,
                  cmd: cht.prefix + cht.cmd,
                });
              let fullname = func.findValue('fullainame', cht.q);
              let nickname = func.findValue('nickainame', cht.q);
              let profile =
                func.findValue('profile', cht.q) ||
                func.findValue('logic', cht.q);
              if (!profile || !nickname || !fullname)
                return cht.replyWithTag(infos.owner.setLogic, {
                  logic: cfg.logic,
                  botnickname,
                  botfullname,
                  cmd: cht.prefix + cht.cmd,
                });
              global.botfullname = fullname;
              global.botnickname = nickname;
              global.cfg.logic = profile;
              cht.replyWithTag(mode, { logic: cfg.logic });
            }
            break;
          case 'menu':
            {
              let menuDescriptions = {
                buttonImage: 'Pesan ButtonV2 header gambar dengan list menu di body',
                'buttonImage+footer': 'Pesan ButtonV2 header gambar dengan list menu di footer',
                rich: 'Pesan Meta AI Rich Card (richResponseMessage) dengan heading, banner & CTA',
                product: 'Pesan card produk katalog dengan foto bot dan teks menu di footer',
                buttonListProduct: 'Pesan interaktif header produk dengan tombol dropdown list kategori',
                buttonListImage: 'Pesan interaktif header gambar dengan tombol dropdown list kategori',
                linkpreview: 'Pesan teks dengan link preview website dan thumbnail besar',
                gif: 'Pesan video animasi looping (GIF) dengan teks menu',
                'gif+linkpreview': 'Pesan animasi GIF dengan preview kartu ad reply',
                video: 'Pesan video dengan caption teks menu',
                order: 'Pesan invoice/order katalog WhatsApp',
                liveLocation: 'Pesan lokasi langsung (live location) dengan teks menu',
                image: 'Pesan gambar foto bot dengan caption teks menu',
                text: 'Pesan teks polos tanpa media',
              };
              let list = Object.keys(menuDescriptions);
              let formattedList = list
                .map((key) => `• ${key}\n> ${menuDescriptions[key]}`)
                .join('\n\n');
              let tlist = func.tagReplacer(infos.owner.listSetmenu, {
                list: formattedList,
              });
              if (!t2) {
                return cht.question(tlist, {
                  emit: `${cht.cmd} ${t1}`,
                  exp: Date.now() + 60000,
                  accepts: list,
                });
              }
              if (!list.includes(t2))
                return cht.reply(`Tipe menu ${t2} tidak ditemukan!\n\n${tlist}`);
              if ((t2 === 'rich' || t2.includes('rich')) && !cfg.rich)
                return cht.reply(infos.owner.richDisabled);
              if ((t2.includes('button') || t2.includes('interactive')) && !cfg.button)
                return cht.reply(
                  'Fitur button belum aktif. Silahkan ketik .set button on terlebih dahulu!'
                );
              global.cfg.menu_type = t2;
              let etc = {};
              if (t2.includes('linkpreview')) {
                if ('linkpreview' in cfg && cfg.linkpreview !== true) {
                  etc.footer = 'Linkpreview dalam mode off, menu akan menjadi pesan teks biasa tanpa preview.';
                } else {
                  etc.footer = 'Menu mungkin tidak terlihat di beberapa versi WhatsApp terbaru.';
                }
              }
              cht.reply(func.tagReplacer(mode, { menu: t2 }), etc);
              if (t2 == 'liveLocation')
                cht.reply(infos.owner.menuLiveLocationInfo);
            }
            break;
          case 'lang':
            {
              let langs = fs
                .readdirSync(fol[9])
                .filter((a) => a.endsWith('js'))
                .map((a) => a.split('.js')[0]);
              if (!langs.includes(t2))
                return cht.reply(
                  `\`List Language:\`\n\n- ${langs.join('\n- ')}\n\nExample:\n _${cht.prefix + cht.cmd} ${t1} ${langs[0]}_`
                );
              global.locale = t2;
              await (fol[9] + locale + '.js').r();

              cht.replyWithTag(global.Data.infos.owner.succesSetLang, {
                lang: t2,
              });
            }
            break;
          case 'voice':
            {
              let listv = '`LIST VOICES`\n- ' + Data.voices.join('\n- ');
              if (!t2) {
                return cht.question(listv, {
                  emit: `${cht.cmd} ${t1}`,
                  exp: Date.now() + 60000,
                  accepts: Data.voices,
                });
              }
              if (!Data.voices.includes(t2.trim()))
                return cht.reply(
                  '*[ VOICE NOTFOUND❗️ ]*\n\n`LIST VOICES`\n- ' +
                    Data.voices.join('\n- ')
                );
              global.cfg.ai_voice = t2.trim();
              cht.replyWithTag(mode, { voice: global.cfg.ai_voice });
            }
            break;
          case 'call':
            {
              if (!t2) return cht.reply(mode);
              cfg.call = cfg.call || { block: false, reject: false };
              let listaction = Object.keys(cfg.call);
              let actions = t2.split('+');
              let notfound = actions.find(
                (a) => ![...off, ...listaction].includes(a)
              );
              if (notfound)
                return cht.reply(
                  `Action \`${notfound}\` tidak ada dalam list!\n\n${mode}`
                );
              for (let i of listaction) {
                global.cfg.call[i] = actions.includes(i);
              }
              cht.replyWithTag(
                infos.owner[isOff ? 'successOffCall' : 'successSetCall'],
                { action: t2 }
              );
            }
            break;
          case 'hadiah':
            {
              if (!t2)
                return cht.replyWithTag(mode, {
                  game: `- ${Object.keys(cfg.hadiah).join('\n- ')}`,
                });
              if (!Object.keys(cfg.hadiah).includes(t2))
                return cht.replyWithTag(
                  `*Game \`${t2}\` tidak tersedia!*\n\n${mode}`,
                  { game: `- ${Object.keys(cfg.hadiah).join('\n- ')}` }
                );
              if (!t3)
                return cht.replyWithTag(
                  '*Harap sertakan jumlah energy!*\n\n' + mode,
                  { game: `- ${Object.keys(cfg.hadiah).join('\n- ')}` }
                );
              if (isNaN(t3))
                return cht.replyWithTag(infos.messages.onlyNumber, {
                  value: 'Energy',
                });
              cfg.hadiah[t2] = parseInt(t3);
              cht.reply(
                `Success set hadiah energy *${t2}* to ${parseInt(t3)} Energy⚡`
              );
            }
            break;
          case 'autoreactsw':
            {
              if (!t2) return cht.reply(mode);
              let isEmoji =
                /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/gu.test(t2);
              if (!cfg.reactsw)
                cfg.reactsw = {
                  on: false,
                  emojis: ['😍', '😂', '😬', '🤢', '🤮', '🥰', '😭'],
                };

              if (isOff) {
                cfg.reactsw = false;
                return cht.reply(
                  infos.owner[
                    isOff ? 'successOffAutoreactSw' : 'successSetAutoreactSw'
                  ]
                );
              }
              if (!isEmoji)
                return cht.reply(
                  '`input mengandung karakter yang bukan emoji atau emoji tidak valid`\n\n' +
                    mode
                );
              let emojis =
                typeof Intl !== 'undefined' && Intl.Segmenter
                  ? [...new Intl.Segmenter().segment(t2)].map((s) => s.segment)
                  : t2.match(/(\p{Emoji_Presentation}|\p{Emoji}\uFE0F+)/gu) || [
                      ...t2,
                    ];
              cfg.reactsw = { on: true, emojis };
              return cht.reply(
                infos.owner.successSetAutoreactSw.replace(
                  '<action>',
                  '\n- ' + emojis.join('\n- ')
                )
              );
            }
            break;
          case 'lora':
            {
              if (!t2) return cht.reply(mode);
              let [a, ...b] = args.split(' ');
              if (b.some((v) => isNaN(v)))
                return cht.replyWithTag(infos.messages.onlyNumber, {
                  value: t1,
                });
              let lora = b.map((v) => parseInt(v));
              cfg.models = cfg.models || { checkpoint: 1552, loras: [2067] };
              cfg.models['loras'] = lora;
              cht.reply('Success ✅');
            }
            break;
          case 'checkpoint':
            {
              if (!t2) return cht.reply(mode);
              if (isNaN(t2))
                return cht.replyWithTag(infos.messages.onlyNumber, {
                  value: t1,
                });
              cfg.models = cfg.models || { checkpoint: 1552, loras: [2067] };
              cfg.models['checkpoint'] = parseInt(t2);
              cht.reply('Success ✅');
            }
            break;
          case 'public':
            {
              if (isOn) {
                global.cfg[t1] = true;
              } else if (isOff) {
                global.cfg[t1] = false;
              } else if (isOnly) {
                let vv = t2.trim().toLowerCase();
                mode = `mode ${vv}`;
                global.cfg[t1] = vv;
                let iAdL = `\n\n## *Jika anda ingin menambahkan linkgroup lain*
- Ketik: \`.addlinkgc linknya\`

## *Untuk menghapus linkgroup*
- Ketik: \`.dellinkgc linknya\`

## *Untuk melihat linkgroup*
- Ketik: \`.listlinkgc\`
`;
                if (vv == 'onlyjoingc') {
                  if (!cfg.gcurl) {
                    if (!t3) {
                      await cht.question(
                        `Mode *Public* telah diubah menjadi *Only Join GC*. Dalam mode ini pengguna non-premium harus bergabung ke grup yang Anda tentukan sebelum dapat menggunakan bot.\n\n*Namun, karena Anda belum menambahkan link grup, mode ini belum dapat berfungsi.*\nUntuk mengaktifkannya, balas pesan ini dengan mengirimkan link grup Anda.\n\n_Kirimkan dalam waktu kurang dari 1 menit._`,
                        {
                          emit: `${cht.cmd} ${t1} ${t2}`,
                          exp: Date.now() + 60000,
                          accepts: [],
                        }
                      );
                    } else {
                      let isFormatsUrl = urls.some((url) =>
                        url.toLowerCase().includes('https://chat.whatsapp.com')
                      );
                      if (!isFormatsUrl) {
                        let wt =
                          '\n_Kirimkan ulang dalam waktu kurang dari 1 menit_';

                        return cht.question(
                          func.tagReplacer(infos.messages.isFormatsUrl, {
                            formats: '- https://chat.whatsapp.com',
                          }) + wt,
                          {
                            emit: `${cht.cmd} ${t1} ${t2}`,
                            exp: Date.now() + 60000,
                            accepts: [],
                          }
                        );
                      }
                      cfg.gcurl ??= [];
                      cfg.gcurl = [...new Set([...cfg.gcurl, ...urls])];
                      let list = cfg.gcurl.map((a) => `- ${a}`).join('\n');

                      return cht.reply(
                        `Link grup berhasil ditambahkan!\n\`LIST INVITELINK\`\n${list}\n\nMode *Only Join GC* sekarang aktif. Pengguna non-premium harus bergabung ke salah satu grup diatas sebelum dapat menggunakan bot.\n_Terima kasih telah menambahkan link grup._${iAdL}`
                      );
                    }
                  } else {
                    let list = cfg.gcurl.map((a) => `- ${a}`).join('\n');
                    return cht.reply(
                      `${func.tagReplacer(infos.owner.isModeOnSuccess, { mode })}!\n\n\`LIST INVITELINK\`\n${list}\n\nMode *Only Join GC* sekarang aktif. Pengguna non-premium harus bergabung ke salah satu grup diatas sebelum dapat menggunakan bot${iAdL}`
                    );
                  }
                }
              } else {
                return cht.question('on/off/onlygc/onlypc/onlyjoingc ?', {
                  emit: `${cht.cmd} ${t1}`,
                  exp: Date.now() + 60000,
                  accepts: [
                    'on',
                    'off',
                    'true',
                    'false',
                    'onlygc',
                    'onlypc',
                    'onlyjoingc',
                  ],
                });
              }
              return cht.replyWithTag(
                isOff
                  ? infos.owner.isModeOffSuccess
                  : infos.owner.isModeOnSuccess,
                { mode }
              );
            }
            break;
          case 'apikey':
            {
              if (!t2) {
                return cht.question('Silahkan input apikeynya!', {
                  emit: `${cht.cmd} ${t1}`,
                  exp: Date.now() + 20000,
                  accepts: [],
                });
              }
              api.xterm.key = t2.trim();
              cht.reply(`Success set apikey xtermai!\nKey: ${t2}`);
            }
            break;
          case 'chid':
            {
              let urlCandidate =
                (is.url && is.url.length > 0 ? is.url[0] : null) ||
                (is.quoted?.url && is.quoted.url.length > 0 ? is.quoted.url[0] : null) ||
                (typeof t2 === 'string' && t2.includes('channel/') ? t2 : null);

              let inviteCode =
                urlCandidate?.match(/channel\/([^\/\s\?]+)/)?.[1] ||
                (typeof t2 === 'string' && t2.trim().length >= 10 && !t2.includes(' ') && !t2.startsWith('http')
                  ? t2.trim()
                  : null);

              if (inviteCode) {
                try {
                  let d = await Exp.newsletterMetadata('invite', inviteCode);
                  if (d?.id) {
                    let meta = d?.thread_metadata || {};
                    let name = meta?.name?.text || '-';
                    cfg.menu.chId = {
                      newsletterJid: d.id,
                      serverMessageId: 2025,
                      newsletterName: name,
                      newslettedName: name,
                    };
                    cfg.chId = cfg.menu.chId;
                    return cht.reply(infos.owner.setChidSuccess(name, d.id));
                  }
                } catch (e) {
                  return cht.reply('❌ Gagal mengambil metadata channel: ' + (e.message || e));
                }
              }

              let fwdInfo = null;
              if (is.quoted) {
                let quotedRaw =
                  cht?.message?.[cht.type]?.contextInfo?.quotedMessage;
                let qMtype = cht.quoted?.mtype || (quotedRaw ? Object.keys(quotedRaw)[0] : null);
                fwdInfo =
                  quotedRaw?.[qMtype]?.contextInfo?.forwardedNewsletterMessageInfo ||
                  cht.quoted?.contextInfo?.forwardedNewsletterMessageInfo ||
                  cht.quoted?.[cht.quoted?.type]?.contextInfo?.forwardedNewsletterMessageInfo;

                if (!fwdInfo && cht.quoted.stanzaId) {
                  try {
                    let loaded = await store.loadMessage(id, cht.quoted.stanzaId);
                    if (loaded?.message) {
                      let qType = getContentType(loaded.message);
                      fwdInfo = loaded.message?.[qType]?.contextInfo?.forwardedNewsletterMessageInfo;
                    }
                  } catch {}
                }
              }

              if (!fwdInfo) {
                fwdInfo = cht?.message?.[cht.type]?.contextInfo?.forwardedNewsletterMessageInfo;
              }

              if (fwdInfo?.newsletterJid) {
                let name = fwdInfo.newsletterName || '-';
                let jid = fwdInfo.newsletterJid;
                cfg.menu.chId = {
                  newsletterJid: jid,
                  serverMessageId: fwdInfo.serverMessageId || 2025,
                  newsletterName: name,
                  newslettedName: name,
                };
                cfg.chId = cfg.menu.chId;
                return cht.reply(infos.owner.setChidSuccess(name, jid));
              }

              return cht.reply(infos.owner.setChidHelp);
            }
            break;
          case 'antitagowner':
            {
              if (t2) {
                if (!(isOff || isOn))
                  return cht.reply(infos.owner.setAntiTagOwner);
                cfg['antitagowner'] = isOn;
                return cht.replyWithTag(
                  isOff
                    ? infos.owner.isModeOffSuccess
                    : infos.owner.isModeOnSuccess,
                  { mode }
                );
              } else {
                if (!cht.quoted) return cht.reply(infos.owner.setAntiTagOwner);
                let res = (await store.loadMessage(id, cht.quoted.stanzaId))
                  ?.message;
                Data.response['tagownerresponse'] = res || { ...cht.quoted };
                cht.reply(
                  `Success set antitagowner!\nType: ${cht.quoted.type}`
                );
              }
            }
            break;
          case 'replyAi':
            {
              if (t2) {
                if (!(isOff || isOn))
                  return cht.reply(infos.owner.setAntiTagOwner);
                cfg['replyAi'] = isOn;
                return cht.reply(
                  isOn ? infos.owner.isReplyAiOn : infos.owner.isReplyAiOff
                );
              } else {
                await cht.question('on/off ?', {
                  emit: `${cht.cmd} ${t1}`,
                  exp: Date.now() + 60000,
                  accepts: ['on', 'off', 'true', 'false'],
                });
              }
            }
            break;
          case 'font':
            {
              let style = [
                'normal',
                'script',
                'bold',
                'italic',
                'boldItalic',
                'bubble',
                'double',
                'monospace',
              ];
              if (!style.includes(t2))
                return cht.reply(`List style: ${style.join(', ')}`);
              cfg.font = t2;
              return cht.reply(`Success set font style: _${t2}_`);
            }
            break;
          case 'inflasi': {
            cfg.rpg.inflasi = isOn;
            return cht.replyWithTag(
              isOff
                ? infos.owner.isModeOffSuccess
                : infos.owner.isModeOnSuccess,
              { mode }
            );
          }
          case 'linkpreview':
            {
              if (isOff) {
                global.cfg[t1] = isOn;
                await cht.reply(
                  `*Link Preview berhasil dinonaktifkan* ✅\n` +
                    `> Pesan yang dikirim menggunakan link preview akan difilter dan dikirim tanpa tampilan preview.`
                );
              }
              if (isOn) {
                global.cfg[t1] = isOn;
                await cht.reply(
                  `*Link Preview berhasil diaktifkan* ✅\n` +
                    `> Beberapa fitur yang menggunakan link preview mungkin tidak tampil di WhatsApp versi terbaru.\n` +
                    `> Jika pesan tidak terlihat, silakan nonaktifkan kembali fitur ini.`
                );
              }
            }
            break;
          case 'remoteReaction':
            {
              global.cfg[t1] = isOn;

              if (isOn) {
                await cht.reply(
                  `✅ *Remote Reaction Channel Diaktifkan*\n` +
                    `\n\n` +
                    `*_Untuk melihat detail statistik ketik .rch.info_*\n\n` +
                    `> Fitur ini merupakan bagian dari ekosistem *Bella* dan berjalan secara remote via *WebSocket*.\n` +
                    `\n` +
                    `> Fitur ini *eksklusif*, hanya dapat digunakan oleh sesama *bot Bella*\n` +
                    `> yang sama-sama mengaktifkan \`remoteReaction\`.\n` +
                    `\n` +
                    `> Reaction *tidak berjalan terus-menerus*.\n` +
                    `> Fitur hanya aktif pada momen tertentu, yaitu saat *user premium*\n` +
                    `> dengan *energy mencukupi* sedang menggunakan fitur *react channel*.\n` +
                    `\n` +
                    `> Pada kondisi tersebut, *bot Anda dapat melakukan reaction secara otomatis*\n` +
                    `> mengikuti perintah yang dikirim dari pusat.\n` +
                    `\n` +
                    `> Semua bot yang mengaktifkan \`remoteReaction\` akan ikut bereaksi.\n` +
                    `> Jumlah bot dan aktivitas reaction dapat dipantau secara *real-time*\n` +
                    `> dan terlihat di *console/log*.\n` +
                    `\n` +
                    `> Jika aktivitas reaction sedang ramai, disarankan untuk *menonaktifkan fitur ini*.\n` +
                    `> Setiap reaction yang dilakukan bot akan tercatat di log.\n` +
                    `\n` +
                    `> *Owner memiliki kontrol penuh* untuk memutus akses fitur ini.\n` +
                    `> Jika terjadi masalah, semua bot akan berhenti menerima perintah reaction.\n\n`
                );
              } else if (isOff) {
                await cht.reply(
                  `*Remote Reaction Channel dinonaktifkan* ✅\n` +
                    `> Sistem tidak lagi mengirim atau menerima reaction channel secara otomatis\n` +
                    `> Catatan: fitur *.reactch/.rch* tidak lagi dapat digunakan\n` +
                    `> Atifkan kembali kapan saja jika diperlukan.`
                );
              } else {
                await cht.question('on/off ?', {
                  emit: `${cht.cmd} ${t1}`,
                  exp: Date.now() + 60000,
                  accepts: ['on', 'off', 'true', 'false'],
                });
              }
            }
            break;

          case 'antipc':
            {
              global.cfg[t1] = isOn;

              if (isOn) {
                await cht.reply(
                  `✅ *Anti Private Chat Aktif*\n` +
                    `_Mulai sekarang, setiap pengguna yang memakai bot melalui private chat akan otomatis diblokir._`
                );
              } else if (isOff) {
                await cht.reply(
                  `✅ *Anti Private Chat Dinonaktifkan*\n` +
                    `_Sekarang bot dapat digunakan di private chat tanpa memblokir pengguna._`
                );
              } else {
                await cht.question('on/off ?', {
                  emit: `${cht.cmd} ${t1}`,
                  exp: Date.now() + 60000,
                  accepts: ['on', 'off', 'true', 'false'],
                });
              }
            }
            break;

          case 'dadu':
            {
              Data.setCmd ??= {};
              if (isOff || t2 === 'del' || t2 === 'delete' || t2 === 'off') {
                if (Data.daduMedia?.sha256) {
                  delete Data.setCmd[Data.daduMedia.sha256];
                }
                delete Data.daduMedia;
                return cht.reply('✅ Media dadu bot utama berhasil dihapus!');
              }
              let { quoted, type } = ev.getMediaType();
              if (!type)
                return cht.reply(
                  `Reply pesan media (stiker, gambar, video, audio, dll) dengan caption: ${cht.prefix}set dadu`
                );
              let mediaObj = quoted ? cht.quoted : cht;
              let sha256 = mediaObj[type]?.fileSha256
                ?.toString()
                ?.to('utf16le');
              let msgContent = (
                await store.loadMessage(cht.id, mediaObj.stanzaId || cht.key.id)
              )?.message ||
                mediaObj.message || { [type + 'Message']: mediaObj[type] };

              if (Data.daduMedia?.sha256) {
                delete Data.setCmd[Data.daduMedia.sha256];
              }
              if (sha256) Data.setCmd[sha256] = '.dadu';
              Data.daduMedia = {
                sha256,
                type,
                message: msgContent,
              };
              return cht.reply(
                `✅ Media dadu berhasil diset!\n- Type: ${type}\n\nSaat permainan Ular Tangga dimulai, media ini akan dikirim sebagai dadu.\nPemain cukup kirim ulang media ini saat gilirannya untuk melempar dadu.${type === 'stickerMessage' || type === 'sticker' ? '\n\n> ℹ️ Karena media berupa stiker, pemain harus menyimpan stiker terlebih dahulu sebelum bisa mengirimnya.' : ''}`
              );
            }
            break;

          default:
            if (isOn) {
              if (
                t1 == 'button' &&
                !(await '@whiskeysockets/baileys/lib/Socket/messages-send.js'
                  .import()
                  .then((a) => a.makeMessagesSocket + '')
                  .then((a) => a.includes('interactiveMessage')))
              )
                return cht.reply(
                  'Your baileys not support interactive button!'
                );
              if (global.cfg[t1])
                return cht.replyWithTag(infos.owner.isModeOn, { mode });
              global.cfg[t1] = true;
              return cht.replyWithTag(infos.owner.isModeOnSuccess, { mode });
            }
            if (isOff) {
              if (!global.cfg[t1] && t1 in cfg)
                return cht.replyWithTag(infos.owner.isModeOff, { mode });
              global.cfg[t1] = false;
              return cht.replyWithTag(
                isOff
                  ? infos.owner.isModeOffSuccess
                  : infos.owner.isModeOnSuccess,
                { mode }
              );
            }
            await cht.question('on/off ?', {
              emit: `${cht.cmd} ${t1}`,
              exp: Date.now() + 60000,
              accepts: ['on', 'off', 'true', 'false'],
            });
        }
      } catch (e) {
        console.error(e);
        cht.reply(`TypeErr: ${e.message}`);
      }
    }
  );

  let setmedia = ['setthumb', 'setvideo'];
  ev.on(
    {
      cmd: setmedia,
      listmenu: setmedia,
      media: {
        type: ['image', 'video'],
        save: false,
      },
      tag: 'owner',
      isOwner: true,
    },
    async ({ media }) => {
      if (is?.jadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      await cht.reply(infos.messages.wait);
      let text = infos.owner.successSetThumb;
      if (cht.cmd == 'setthumb') {
        await fs.writeFileSync(fol[3] + 'bell.jpg', media);
      } else {
        cfg.menu.video = await TermaiCdn(media);
        text = text.replace('thumbnail', 'video');
      }
      cht.reply(text);
    }
  );

  ev.on(
    {
      cmd: ['setpp'],
      listmenu: ['setpp'],
      media: {
        type: ['image'],
        save: false,
      },
      tag: 'owner',
      isOwner: true,
    },
    async ({ media }) => {
      if (is?.jadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      await cht.reply(infos.messages.wait);
      Exp.setProfilePicture(Exp.number, media)
        .then((a) => cht.reply('Success...✅️'))
        .catch((e) => cht.reply('TypeErr: ' + e.message));
    }
  );

  ev.on(
    {
      cmd: ['badword'],
      listmenu: ['badword'],
      args: func.tagReplacer(infos.owner.badword, {
        cmd: cht.prefix + cht.cmd,
      }),
      isOwner: true,
      tag: 'owner',
    },
    async ({ media }) => {
      let [act, input] = cht.q.split('|');
      input = (input || cht.quoted?.text || '')
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 1);

      if (act == 'add') {
        if (input.length < 1) return cht.reply('Ex: .badword add|tes');
        Data.badwords = [...new Set([...Data.badwords, ...input])];
        cht.replyWithTag(infos.owner.successAddBadword, { input });
      } else if (act == 'delete' || act == 'd' || act == 'del') {
        if (input.length < 1) return cht.reply('Ex: .badword delete|tes');
        input.forEach((word) => {
          Data.badwords = Data.badwords.filter((a) => a !== word);
        });
        cht.replyWithTag(infos.owner.successDelBadword, { input });
      } else if (act == 'list') {
        let list = '*[ LIST BADWORD ]*\n';
        for (let i of Data.badwords) {
          list += `\n - ${i}`;
        }
        cht.reply(list);
      } else
        cht.replyWithTag(infos.owner.badwordAddNotfound, {
          cmd: cht.prefix + cht.cmd,
        });
    }
  );

  ev.on(
    {
      cmd: ['getdata'],
      listmenu: ['getdata'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ media }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let [t1, t2, t3] = (cht.q || '').split(' ');

      let lists = Object.keys(Lists);

      if (!t1 && !lists.includes(t1))
        return cht.reply(
          `\`LIST YANG TERSEDIA\`:\n- ${lists.join('\n- ')}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1 || lists[0] || '<item>'}`
        );
      let lts = Lists[t1.toLowerCase()];
      if (!t2 && !lts.includes(t2))
        return cht.reply(
          `\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n- ${lts.join('\n- ')}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1} ${lts[0] || '<item>'}`
        );
      let data = Data[t1.toLowerCase()][t2];
      if (t1 == 'fquoted') cht.reply(JSON.stringify(data, null, 2));

      if (t1 == 'audio')
        cht.reply(
          `\`LIST ${t1.toUpperCase()}\`:\n\n- ${data.join('\n- ')}\n\n> \`Untuk menghapus audio dalam daftar\`:\n ${cht.prefix + 'deldata'} ${t1} ${t2 || '<item>'} ${data[0] || '<item>'}`
        );
    }
  );

  ev.on(
    {
      cmd: ['deldata'],
      listmenu: ['deldata'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ media }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let [t1, t2, t3] = (cht.q || '').split(' ');

      let lists = Object.keys(Lists);

      if (!lists.includes(t1))
        return cht.reply(
          `\`LIST YANG TERSEDIA\`:\n\n- ${lists.join('\n- ')}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1 || lists[0] || '<item>'}`
        );
      let lts = Lists[t1.toLowerCase()];
      if (!lts.includes(t2))
        return cht.reply(
          `\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n\n- ${lts.join('\n- ')}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1} ${lts[0] || '<item>'}`
        );
      let data = Data[t1.toLowerCase()][t2] || [];
      if (t1 == 'fquoted') {
        delete Data[t1.toLowerCase()][t2];
        cht.reply(
          `*Berhasil menghapus ${t2} dari dalam data ${t1}\n\n\`LIST ${t1.toUpperCase()} YANG TERSISA\`:\n- ${Object.keys(Data[t1.toLowerCase()]).join('\n- ')}`
        );
      } else if (t1 == 'audio') {
        if (!t3)
          return cht.reply(
            `▪︎ *Untuk menghapus list audio:*\n - _${cht.prefix + cht.cmd} ${t1} ${t2} ${data[0]}_\n\n ▪︎ *Untuk menghapus semua list audio dalam data ${t2}*:\n - _${cht.prefix + cht.cmd}\ ${t1} ${t2} all_\n\n\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n- ${data.join('\n- ')}`
          );
        if (t3 == 'all') {
          delete Data[t1.toLowerCase()][t2];
          cht.reply(
            `*Berhasil menghapus data ${t2}*\n\n\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n\n- ${Object.keys(Data[t1.toLowerCase()]).join('\n- ')}`
          );
        } else {
          if (!data.includes(t3))
            return cht.reply(
              `*Audio _${t3}_ tidak tersedia dalam data ${t2}*!\n\n\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n\n- ${data.join('\n- ')}`
            );
          Data[t1.toLowerCase()][t2] = data.filter((a) => a !== t3);
          cht.reply(
            `*Berhasil menghapus ${t3} dari dalam data ${t1} > ${t2}*\n\n\`LIST ${t1.toUpperCase()} YANG TERSISA\`:\n\n- ${Data[t1.toLowerCase()][t2].join('\n- ')}`
          );
        }
      }
    }
  );

  ev.on(
    {
      cmd: ['setdata'],
      listmenu: ['setdata'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ media }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let [t1, t2, t3] = (cht.q || '').split(' ');

      let lists = Object.keys(Lists);
      if (!t1 && !lists.includes(t1))
        return cht.reply(
          `\`LIST YANG TERSEDIA\`:\n- ${lists.join('\n- ')}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1 || lists[0] || '<item>'}`
        );
      let lts = Lists[t1.toLowerCase()];
      let msg =
        t1 == 'fquoted'
          ? `Sukses ${lts.includes(t2) ? 'mengubah' : 'menambahkan'} fake quoted ${t2}\n\n\`Contoh cara mengambil data\`:\n> ${prefix}getdata ${t1} ${t2}\n\nList fake quoted:\n\n- ${!lts.includes(t2) ? [...lts, t2].join('\n- ') : lts.join('\n- ')}`
          : t1 == 'audio'
            ? infos.owner.audiolist
            : null;

      if (t1 == 'fquoted') {
        if (!(t3 || cht.quoted))
          return cht.reply(infos.owner.setFquoted.replace(/.set/g, '.setdata'));
        let json;
        try {
          if (t3) {
            json = cht.q.split(' ').slice(2).join('');
          } else if (is.quoted) {
            let { key } = await store.loadMessage(cht.id, cht.quoted.stanzaId);
            let msg = { key };
            let qmsg =
              cht.message.extendedTextMessage.contextInfo.quotedMessage;
            let type = getContentType(qmsg);
            if (type.includes('pollCreationMessage')) {
              msg.message = {
                pollCreationMessage:
                  qmsg.pollCreationMessage ||
                  qmsg.pollCreationMessageV2 ||
                  qmsg.pollCreationMessageV3,
              };
            } else {
              msg.message = qmsg;
            }
            json = JSON.stringify(msg);
          }
          let obj = JSON.parse(json);
          Data.fquoted[t2] = obj;
          cht.reply(msg);
        } catch (e) {
          cht.reply(
            `Harap periksa kembali JSON Object anda!\n\nTypeError:\n${infos.others.readMore}\n> ${e}`
          );
        }
      }

      if (t1 == 'audio') {
        if (!t2 && !lts.includes(t2))
          return cht.reply(
            `\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n- ${lts.join('\n- ')}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1} ${lts[0] || '<item>'}`
          );
        if (!(t3 || is.quoted?.audio)) return cht.reply(infos.owner.setAudio);
        Data.audio[t2] = Data.audio[t2] || [];
        if (t3) {
          Data.audio[t2].push(t3);
          cht.replyWithTag(msg, { url: t3, list: t2 });
        } else if (is.quoted?.audio) {
          let audio = await TermaiCdn(await cht.quoted.download());
          Data.audio[t2].push(audio);
          cht.replyWithTag(msg, { url: audio, list: t2 });
        } else {
          cht.reply(infos.owner.setAudio);
        }
      }
    }
  );

  ev.on(
    {
      cmd: ['addenergy', 'kurangenergy'],
      listmenu: ['addenergy', 'kurangenergy'],
      args: infos.about.energy,
      tag: 'owner',
      isMention: infos.about.energy,
      isOwner: true,
    },
    async () => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let num = cht.q?.split('|')?.[1] || cht.q;
      if (isNaN(num)) return cht.reply('Energy harus berupa angka!');
      let sender = cht.mention[0].split('@')[0];
      if (!(sender in Data.users)) return cht.reply(infos.owner.userNotfound);
      let user = await func.archiveMemories.get(cht.mention[0]);
      let opts = {
        addenergy: {
          energy: () =>
            func.archiveMemories.addEnergy(sender, parseInt(num)).energy,
        },
        kurangenergy: {
          energy: () =>
            func.archiveMemories.reduceEnergy(sender, parseInt(num)).energy,
        },
      };
      user.energy = parseInt(opts[cht.cmd].energy());
      if (user.energy >= user.maxCharge) {
        user.charging = false;
      }
      const { default: ms } = await 'ms'.import();
      let max = user.maxCharge;
      let energy = user.energy;
      let _speed = user.chargingSpeed;
      let rate = user.chargeRate;
      let speed = ms(_speed);

      let txt = `*Berhasil men${cht.cmd == 'addenergy' ? 'ambahkan' : 'gurangi'} ${num} ⚡Energy ke @${sender}*`;
      txt += '\n\n*[🔋] Energy*';
      txt += '\n⚡Energy: ' + user.energy;
      txt += `\n\n- Status: ${user.charging ? '🟢Charging' : ' ⚫Discharging'}`;
      txt += '\n- Charging Speed: ⚡' + rate + ' Energy/' + speed;
      txt += '\n- Max Charge: ' + max;
      Exp.sendMessage(
        cht.id,
        { text: txt, mentions: cht.mention },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: [
        'premium',
        'addpremium',
        'addprem',
        'delpremium',
        'delprem',
        'kurangpremium',
        'kurangprem',
      ],
      listmenu: ['premium'],
      tag: 'owner',
    },
    async ({ cht }) => {
      let isOwnerAccess = cht.cmd !== 'premium';
      if (isOwnerAccess && (is?.jadibot || Exp?.isJadibot))
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let text = isOwnerAccess ? infos.owner.premium_add : '';
      let trial = Data.users[cht.sender.split('@')[0]]?.claimPremTrial;
      if (!isOwnerAccess)
        return sendPremInfo({ text: infos.messages.premium(trial) });
      if (!is.owner) return cht.reply('Maaf, males nanggepin');
      if (cht.mention.length < 1) return sendPremInfo({ text });
      if (!cht.quoted && !cht.q.includes('|'))
        return sendPremInfo({ _text: infos.owner.wrongFormat, text });
      let time = (cht.q ? cht.q.split('|')[1] : false) || cht.q || false;
      if (!time) return sendPremInfo({ text });
      let Sender = cht.mention[0].split('@')[0];
      if (!(Sender in Data.users)) return cht.reply(infos.owner.userNotfound);
      let user = await func.archiveMemories.get(cht.mention[0]);
      if (
        ['kurangprem', 'kurangpremium', 'delprem', 'delpremium'].includes(
          cht.cmd
        ) &&
        user.premium.time < Date.now()
      ) {
        return cht.reply('Maaf, target bukan user premium!');
      }
      let premiumTime = func.parseTimeString(time);
      if (!premiumTime && !['delprem', 'delpremium'].includes(cht.cmd)) {
        return sendPremInfo({ _text: infos.owner.wrongFormat, text });
      }
      if (!('premium' in user)) {
        user.premium = { time: 0 };
      }
      let date =
        user.premium.time < Date.now() ? Date.now() : user.premium.time;
      let formatDur = func.formatDuration(premiumTime || 0);
      let opts = {
        addpremium: {
          time: parseFloat(date) + parseFloat(premiumTime),
          msg: `*Successfully increased premium duration! ✅️*\n ▪︎ User:\n- @${Sender}\n ▪︎ Waktu ditambahkan: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`,
        },
        addprem: {
          time: parseFloat(date) + parseFloat(premiumTime),
          msg: `*Successfully increased premium duration✅️*\n ▪︎ User:\n- @${Sender}\n ▪︎ Waktu ditambahkan: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`,
        },
        kurangpremium: {
          time: parseFloat(date) - parseFloat(premiumTime),
          msg: `*Successfully reduced premium duration✅️*\n ▪︎ User:\n- @${Sender}\n ▪︎ Waktu dikurangi: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`,
        },
        kurangprem: {
          time: parseFloat(date) - parseFloat(premiumTime),
          msg: `*Successfully reduced premium duration!✅️*\n ▪︎ User:\n- @${Sender}\n ▪︎ Waktu dikurangi: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`,
        },
        delpremium: {
          time: 0,
          msg: `*Successfully delete user @${Sender} from premium✅️*\n\n`,
        },
        delprem: {
          time: 0,
          msg: `*Successfully delete user @${Sender} from premium✅️\n\n`,
        },
      };
      if (premiumTime > 315360000000)
        return cht.reply('Maksimal waktu adalah 10 tahun!');
      user.premium.time = opts[cht.cmd].time;
      user.claimPremTrial = true;
      if (cht.cmd.includes('delprem')) user.premium = { time: 0 };
      let formatTimeDur = func.formatDuration(user.premium.time - Date.now());
      let claim = cfg.first.trialPrem;
      let claims = Object.keys(claim);
      let prm = user.premium;

      let txt = opts[cht.cmd].msg;
      txt += `🔑Premium: ${user.premium.time >= Date.now() ? 'yes' : 'no'}`;
      if (user.premium.time >= Date.now()) {
        user.premium = { ...claim, ...prm };
        if (['addpremium', 'addprem'].includes(cht.cmd)) {
          user.energy =
            (parseFloat(user.energy) || 0) + parseFloat(claim.energy || 0);
        }
        let txc = '\n\n*🎁Bonus `(Berlaku selama premium)`*';
        for (let i of claims) {
          txc += `\n- ${i}: +${claim[i]}`;
        }
        txt += `\n⏱️Expired after: ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms`;
        txt += `\n🗓️Expired on: ${func.dateFormatter(user.premium.time, 'Asia/Jakarta')}`;
        txt += txc;
      } else {
        txt += `\n⏱️Expired after: false`;
        txt += `\n🗓️Expired on: false`;
      }
      Data.users[Sender] = user;
      await sendPremInfo({ text: txt }, true);
      //sendPremInfo({ text:txt }, true, cht.mention[0])
    }
  );

  ev.on(
    {
      cmd: ['banned', 'unbanned'],
      listmenu: ['banned', 'unbanned'],
      tag: 'owner',
      isMention: infos.owner.banned,
      isOwner: true,
    },
    async () => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let user = await Exp.func.archiveMemories.get(cht.mention[0]);
      let Sender = cht.mention[0].split('@')[0];
      if (!cht.quoted && !cht.q.includes('|') && cht.cmd == 'banned')
        return cht.reply(infos.owner.banned);
      if (!Sender)
        return cht.reply(
          'Harap reply/tag/sertakan nomor yang ingin di unbanned!\n\n' +
            infos.owner.banned
        );
      if (cht.cmd == 'banned') {
        let time =
          (cht.args ? cht.args.split('|')[1] : false) || cht.args || false;
        if (!time) return cht.reply(infos.owner.banned);
        if (!(Sender in Data.users))
          return cht.reply('Nomor salah atau user tidak terdaftar!');
        let _time = func.parseTimeString(time);
        if (!('banned' in user)) {
          user.banned = 0;
        }
        let date =
          user.banned && user.banned > Date.now() ? user.banned : Date.now();
        let bantime = date + _time;
        let formatDur = func.formatDuration(_time || 0);
        let ban = func.formatDuration(bantime - Date.now());
        await Exp.sendMessage(cht.mention[0], {
          text: func.tagReplacer(infos.owner.addBanned, { ...ban }),
        });
        await cht.reply(
          func.tagReplacer(infos.owner.bannedSuccess, {
            ...formatDur,
            sender: Sender,
          }),
          { mentions: cht.mention }
        );
        await func.archiveMemories.setItem(Sender, 'banned', bantime);
      } else {
        await Exp.sendMessage(cht.mention[0], { text: infos.owner.delBanned });
        await cht.reply(
          func.tagReplacer(infos.owner.unBannedSuccess, { sender: Sender }),
          { mentions: cht.mention }
        );
        func.archiveMemories.delItem(Sender, 'banned');
      }
    }
  );

  const getCekApiKeyLinkPreview = async () => {
    if (!keys['cekapikey_lp_media']) {
      try {
        let rawBuf = await Exp.func.getBuffer('https://c.termai.cc/i138/SqHbc.png');
        let resMedia = await prepareWAMessageMedia(
          { image: rawBuf },
          { upload: Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
        );
        if (resMedia?.imageMessage) {
          keys['cekapikey_lp_media'] = resMedia.imageMessage;
          keys['cekapikey_lp_thumb'] = rawBuf;
        }
      } catch {}
    }
    let imgMsg = keys['cekapikey_lp_media'];
    return {
      'matched-text': 'https://termai.cc',
      title: '🔑 Termai API • Key Checker & Usage Status',
      description: 'Pantau sisa kuota hit, limit harian, dan masa aktif API Key',
      jpegThumbnail: imgMsg?.jpegThumbnail
        ? Buffer.from(imgMsg.jpegThumbnail)
        : keys['cekapikey_lp_thumb'] || undefined,
      highQualityThumbnail: imgMsg
        ? {
            ...imgMsg,
            width: 1280,
            height: 720,
          }
        : undefined,
    };
  };

  ev.on(
    {
      cmd: ['cekapikey'],
      listmenu: ['cekapikey'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args: arg }) => {
      let args = arg || api.xterm.key;
      let res = await fetch(
        api.xterm.url + '/api/tools/key-checker?key=' + args
      ).then((a) => a.json());
      let text = infos.owner?.cekapikeyFormat
        ? infos.owner.cekapikeyFormat(res.data)
        : `🔑 *STATUS TERMAI API KEY*\n\n• *Status:* ${res?.data?.isExpired ? '⛔ Kedaluwarsa' : '🟢 Aktif'}`;

      let linkPreview = await getCekApiKeyLinkPreview();
      return Exp.sendMessage(
        cht.id,
        {
          text: `https://termai.cc\n` + text,
          linkPreview,
        },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['backup'],
      listmenu: ['backup'],
      isOwner: true,
      isCoOwner: false,
      tag: 'owner',
    },
    async ({ args }) => {
      if (is?.jadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      try {
        await cht.reply('Proses backup dimulai...');
        let b = './backup.tar.gz';
        let s = await Exp.func.createTarGz('./', b);
        if (!s.status) return cht.reply(s.msg);
        await cht.edit(
          `File backup sedang dikirim${is.group ? ' melalui private chat...' : '...'}`,
          keys[sender]
        );
        await Exp.sendMessage(
          sender,
          {
            document: { url: b },
            mimetype: 'application/zip',
            fileName: `${path.basename(path.resolve('./'))} || ${Exp.func.dateFormatter(Date.now(), 'Asia/Jakarta')}.tar.gz`,
            ai: true,
          },
          { quoted: cht }
        );
        await cht.reply(
          `*Proses backup selesai✅️*${is.group ? '\nFile telah dikirimkan melalui chat pribadi' : ''}`
        );
        fs.unlinkSync(b);
      } catch (e) {
        console.error(e);
        cht.reply(JSON.stringify(e, 0, 2));
      }
    }
  );

  ev.on(
    {
      cmd: ['csesi', 'clearsesi', 'clearsession', 'clearsessi'],
      listmenu: ['clearsesi'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      if (is?.jadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      await cht.reply('Clearing session...');
      let sessions = fs.readdirSync(session).filter((a) => a !== 'creds.json');
      //const perStep = Math.ceil(sessions.length / 5)
      for (let i = 0; i < sessions.length; i++) {
        await sleep(250);
        fs.unlinkSync(session + '/' + sessions[i]);
        /*
        if ((i + 1) % perStep === 0 || i + 1 === sessions.length) {
          const progress = Math.round(((i + 1) / sessions.length) * 100)
          cht.edit(`Progress: ${progress}%`, keys[sender], true)
         }
         */
      }
      cht.reply('Success clearing session✅️');
    }
  );

  ev.on(
    {
      cmd: ['setrole', 'setroleuser'],
      listmenu: ['setrole'],
      tag: 'owner',
      isMention: func.tagReplacer(infos.owner.setRole, {
        role: `- ${keyroles.join('\n- ')}`,
      }),
      isOwner: true,
    },
    async () => {
      if (!cht.quoted && !cht.q.includes('|'))
        return cht.replyWithTag(infos.owner.setRole, {
          role: `- ${keyroles.join('\n- ')}`,
        });
      let Sender = cht.quoted
        ? cht.quoted.sender
        : cht.mention[0] ||
          (cht.q.includes('|')
            ? cht.q
                .split('|')[0]
                .trim()
                .replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            : null);
      if (!Sender)
        return cht.replyWithTag(infos.owner.setRole, {
          role: `- ${keyroles.join('\n- ')}`,
        });
      let role = (
        cht.quoted ? cht.q : cht.q.includes('|') ? cht.q.split('|')[1] : cht.q
      )?.trim();
      let targetJid = Sender.includes('@')
        ? Sender
        : Sender + '@s.whatsapp.net';
      let memories = await func.archiveMemories.setItem(
        targetJid,
        'role',
        role
      );
      await cht.reply(
        `✅ Berhasil memperbarui status hubungan/role *@${targetJid.split('@')[0]}* menjadi *${role}*`,
        { mentions: [targetJid] }
      );
    }
  );

  ev.on(
    {
      cmd: ['offline', 'online'],
      listmenu: ['offline <alasan>', 'online'],
      tag: 'owner',
      isOwner: true,
      isCoOwner: false,
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let reason = args || 'Tidak diketahui';
      if (cht.cmd == 'offline') {
        global.offresponse = {};
        cfg.offline = {
          reason,
          time: Date.now(),
          max: 10,
        };
        cht.reply(
          `@${sender.split('@')[0]} Sekarang *OFFLINE!*\n\n- Dengan alasan: ${reason}\n- Waktu: ${func.dateFormatter(Date.now(), 'Asia/Jakarta')}`,
          { mentions: [sender] }
        );
      } else {
        delete cfg.offline;
        delete global.offresponse;
        cht.reply(`@${sender.split('@')[0]} Telah kembali online ✅`, {
          mentions: [sender],
        });
      }
    }
  );

  ev.on(
    {
      cmd: ['addowner', 'delowner'],
      listmenu: ['addowner', 'delowner'],
      isOwner: true,
      isCoOwner: false,
      isMention: true,
    },
    ({ args }) => {
      let mention = cht.mention.map((a) => String(a.split('@')[0]));
      if (is?.jadibot) {
        const slot = is.jadibotId;
        const botNum = Exp.user.id.split(':')[0];
        Data.jadibot[slot].owners ??= [Data.jadibot[slot].owner];
        Data.jadibotDb[botNum].owners ??= Data.jadibot[slot].owners;
        if ('addowner' === cht.cmd) {
          mention.forEach((m) => {
            if (!Data.jadibot[slot].owners.includes(m))
              Data.jadibot[slot].owners.push(m);
            if (!Data.jadibotDb[botNum].owners.includes(m))
              Data.jadibotDb[botNum].owners.push(m);
          });
        } else {
          Data.jadibot[slot].owners = Data.jadibot[slot].owners.filter(
            (a) => !mention.includes(String(a).split('@')[0])
          );
          Data.jadibotDb[botNum].owners = Data.jadibotDb[botNum].owners.filter(
            (a) => !mention.includes(String(a).split('@')[0])
          );
        }
        return cht.reply(
          `Success ${'addowner' === cht.cmd ? 'add' : 'delete'} owner jadibot ${mention.map((a) => '@' + a).join(', ')}!`,
          { mentions: cht.mention }
        );
      }
      owner =
        'addowner' == cht.cmd
          ? [...owner, ...mention]
          : owner.filter((a) => !mention.includes(String(a).split('@')[0]));
      cht.reply(
        `Success ${'addowner' == cht.cmd ? 'add' : 'delete'} owner ${mention.map((a) => '@' + a).join(', ')}!`,
        { mentions: cht.mention }
      );
    }
  );
  ev.on(
    {
      cmd: ['addcoowner', 'delcoowner'],
      listmenu: ['addcoowner', 'delcoowner'],
      isOwner: true,
      isCoOwner: false,
      isMention: true,
    },
    ({ args }) => {
      let mention = cht.mention.map((a) => String(a.split('@')[0]));
      if (is?.jadibot) {
        const slot = is.jadibotId;
        const botNum = Exp.user.id.split(':')[0];
        Data.jadibot[slot].coowners ??= [];
        Data.jadibotDb[botNum].coowners ??= [];
        if ('addcoowner' === cht.cmd) {
          mention.forEach((m) => {
            if (!Data.jadibot[slot].coowners.includes(m))
              Data.jadibot[slot].coowners.push(m);
            if (!Data.jadibotDb[botNum].coowners.includes(m))
              Data.jadibotDb[botNum].coowners.push(m);
          });
        } else {
          Data.jadibot[slot].coowners = Data.jadibot[slot].coowners.filter(
            (a) => !mention.includes(String(a).split('@')[0])
          );
          Data.jadibotDb[botNum].coowners = Data.jadibotDb[
            botNum
          ].coowners.filter((a) => !mention.includes(String(a).split('@')[0]));
        }
        return cht.reply(
          `Success ${'addcoowner' === cht.cmd ? 'add' : 'delete'} coowner jadibot ${mention.map((a) => '@' + a).join(', ')}!`,
          { mentions: cht.mention }
        );
      }
      coowner =
        'addcoowner' == cht.cmd
          ? [...coowner, ...mention]
          : coowner.filter((a) => !mention.includes(String(a).split('@')[0]));
      cht.reply(
        `Success ${'addcoowner' == cht.cmd ? 'add' : 'delete'} coowner ${mention.map((a) => '@' + a).join(', ')}!`,
        { mentions: cht.mention }
      );
    }
  );

  const getUpdateLinkPreview = async () => {
    if (!keys['update_lp_media']) {
      try {
        let rawBuf = await Exp.func.getBuffer('https://c.termai.cc/i116/M0PLc.png');
        let resMedia = await prepareWAMessageMedia(
          { image: rawBuf },
          { upload: Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
        );
        if (resMedia?.imageMessage) {
          keys['update_lp_media'] = resMedia.imageMessage;
          keys['update_lp_thumb'] = rawBuf;
        }
      } catch {}
    }
    let imgMsg = keys['update_lp_media'];
    return {
      'matched-text': 'https://termai.cc',
      title: '🔔 Experimental-Bell • System Update',
      description: 'Termai Ecosystem • Cumulative Update Engine',
      jpegThumbnail: imgMsg?.jpegThumbnail
        ? Buffer.from(imgMsg.jpegThumbnail)
        : keys['update_lp_thumb'] || undefined,
      highQualityThumbnail: imgMsg
        ? {
            ...imgMsg,
            width: 1280,
            height: 720,
          }
        : undefined,
    };
  };

  ev.on(
    {
      cmd: ['update', 'checkupdate'],
      listmenu: ['update', 'checkupdate'],
      tag: 'owner',
      isOwner: true,
      isCoOwner: false,
    },
    async ({ urls }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');

      let input = (cht.q || cht.msg || '').trim().toLowerCase();

      if (cht.cmd === 'checkupdate' || input === 'check' || input === 'cek') {
        try {
          await cht.reply('⏳ *Memeriksa pembaruan ke server Termai...*');
          let updateInfo = await global.checkUpdate();
          if (!updateInfo || !updateInfo.hasUpdate) {
            return cht.reply(`✅ *Bot Anda sudah menggunakan versi terbaru (v${updateInfo?.currentVersion || cfg.version || '1.0.0'}).*`);
          }

          if (updateInfo.isMajorGap) {
            let majorText = Data.infos?.updateMajorNotify
              ? Data.infos.updateMajorNotify({
                  version: updateInfo.latestVersion,
                  currentVersion: updateInfo.currentVersion,
                  pendingCount: updateInfo.pendingReleasesCount,
                  files: updateInfo.files || [],
                  changelog: updateInfo.changelogs,
                })
              : `> ⚠️ *UPDATE NOTIFICATION (MAJOR)*\n\n` +
                `• *Versi Baru:* *v${updateInfo.latestVersion}*\n` +
                `• *Versi Bot Anda:* *v${updateInfo.currentVersion}*\n` +
                `• *Total Rilis Tertinggal:* ${updateInfo.pendingReleasesCount} update\n` +
                `• *Total Berkas:* ${(updateInfo.files || []).length} file unik\n\n` +
                (updateInfo.changelogs ? `📋 *Catatan Perubahan:*\n${updateInfo.changelogs}\n\n` : '') +
                `_Versi bot Anda tertinggal cukup jauh. Disarankan untuk melakukan git pull atau clone ulang script terbaru agar seluruh struktur sinkron._\n\n` +
                `🌐 *Repository:* https://github.com/Rifza123/Experimental-Bell`;
            let linkPreview = await getUpdateLinkPreview();
            return Exp.sendMessage(
              cht.id,
              {
                text: `https://termai.cc\n` + majorText,
                linkPreview,
              },
              { quoted: cht }
            );
          }

          let rawUrls = updateInfo.files || [];
          let fols = await (Exp.func?.getDirectoriesRecursive?.() || []);
          let urlPath = rawUrls
            .map((link) => {
              try {
                const { pathname, host } = new URL(link);
                let f = (
                  host === 'raw.githubusercontent.com'
                    ? pathname.split('heads/')[1]
                    : pathname
                )
                  ?.split('/')
                  ?.slice(1)
                  ?.join('/')
                  ?.split('/');
                const filename = f.slice(-1)[0];
                if (!filename) return null;
                const _path = f.slice(0, -1).join('/');

                for (const folder of fols) {
                  const folderPath = folder.split('./')[1].slice(0, -1);
                  if (folderPath.includes(_path) && _path) {
                    return [link, `${folder}${filename}`];
                  }
                  if (
                    ['index.js', 'package', 'readme.md'].some((a) =>
                      filename.includes(a)
                    )
                  ) {
                    return [link, `./${filename}`];
                  }
                }
                return null;
              } catch {
                return null;
              }
            })
            .filter(Boolean);

          let fileTree = urlPath.map(([url, fpath]) => ({
            type: fs.existsSync(fpath) ? 'modified' : 'new',
            path: fpath,
            url
          }));

          let text = Data.infos?.updateNotify
            ? Data.infos.updateNotify({
                version: updateInfo.latestVersion,
                currentVersion: updateInfo.currentVersion,
                pendingCount: updateInfo.pendingReleasesCount,
                files: rawUrls,
                fileTree,
                changelog: updateInfo.changelogs,
              })
            : `> 🔔 *UPDATE NOTIFICATION*\n\n` +
              `• *Versi Baru:* *v${updateInfo.latestVersion}* (Saat ini: *v${updateInfo.currentVersion || '1.0.0'}*)\n` +
              (updateInfo.pendingReleasesCount > 1 ? `• *Total Rilis Kumulatif:* ${updateInfo.pendingReleasesCount} update\n` : '') +
              `• *Total Berkas:* ${rawUrls.length} file unik\n\n` +
              (updateInfo.changelogs ? `📋 *Catatan Perubahan:*\n${updateInfo.changelogs}\n\n` : '') +
              `📂 *File Changed:*\n${fileTree.map((f, i) => `${i === fileTree.length - 1 ? '└──' : '├──'} \`${f.type}\`: ${f.path}`).join('\n')}\n\n` +
              `💡 *CARA MENERAPKAN PEMBARUAN:*\n` +
              `• Balas (quote / reply) pesan ini dengan *y* saat bot sedang aktif/online.\n` +
              `• Perintah tetap bekerja meski bot sempat di-restart atau dalam jangka waktu lama.\n` +
              `• Alternatif update manual: Ketik *.checkupdate* lalu balas *y*, atau gunakan *.update <link>*.\n` +
              `• Ketik *n* atau *batal* untuk membatalkan update.`;

          let linkPreview = await getUpdateLinkPreview();
          let sentMsg = await Exp.sendMessage(
            cht.id,
            {
              text: `https://termai.cc\n` + text,
              linkPreview,
            },
            { quoted: cht }
          );

          if (sentMsg?.key?.id && rawUrls.length > 0) {
            Data.quotedQuestionCmd ??= {};
            Data.quotedQuestionCmd[sentMsg.key.id] = {
              key: { id: sentMsg.key.id },
              emit: `update ${rawUrls.join(' ')}`,
              exp: Date.now() + 2 * 24 * 60 * 60 * 1000,
              accepts: ['y', 'ya', 'yes'],
              Keys: { y: '', ya: '', yes: '' },
              use: 0,
              maxUse: 1,
            };
          }
          return sentMsg;
        } catch (err) {
          return cht.reply(`❌ *Gagal memeriksa update:* ${err.message}`);
        }
      }

      let isConfirm = ['y', 'ya', 'yes'].includes(input);
      let isCancel = ['n', 'no', 'batal', 'cancel'].includes(input);

      Data.pendingUpdate ??= {};
      let pending = Data.pendingUpdate[cht.sender] || memories.getItem(cht.sender, 'pendingUpdate');

      if (isCancel) {
        if (pending) {
          delete Data.pendingUpdate[cht.sender];
          memories.delItem(cht.sender, 'pendingUpdate');
          return cht.reply(Data.infos.owner.updateCancelled);
        }
      }

      if (isConfirm) {
        let urlPath = pending?.urlPath;

        if (!urlPath || !Array.isArray(urlPath) || urlPath.length === 0) {
          try {
            await cht.reply('⏳ *Memeriksa dan menyiapkan pembaruan sistem...*');
            let updateInfo = await global.checkUpdate();
            if (!updateInfo || !updateInfo.hasUpdate) {
              return cht.reply(`✅ *Bot Anda sudah menggunakan versi terbaru (v${updateInfo?.currentVersion || cfg.version || '1.0.0'}).*`);
            }
            let rawUrls = updateInfo.files || [];
            let fols = await (Exp.func?.getDirectoriesRecursive?.() || []);
            urlPath = rawUrls
              .map((link) => {
                try {
                  const { pathname, host } = new URL(link);
                  let f = (
                    host === 'raw.githubusercontent.com'
                      ? pathname.split('heads/')[1]
                      : pathname
                  )
                    ?.split('/')
                    ?.slice(1)
                    ?.join('/')
                    ?.split('/');
                  const filename = f.slice(-1)[0];
                  if (!filename) return null;
                  const _path = f.slice(0, -1).join('/');

                  for (const folder of fols) {
                    const folderPath = folder.split('./')[1].slice(0, -1);
                    if (folderPath.includes(_path) && _path) {
                      return [link, `${folder}${filename}`];
                    }
                    if (
                      ['index.js', 'package', 'readme.md'].some((a) =>
                        filename.includes(a)
                      )
                    ) {
                      return [link, `./${filename}`];
                    }
                  }
                  return null;
                } catch {
                  return null;
                }
              })
              .filter(Boolean);
          } catch (e) {
            return cht.reply(`❌ *Gagal memuat sesi update:* ${e.message}`);
          }
        }

        if (!urlPath || urlPath.length === 0) {
          return cht.reply('❌ Tidak ada berkas pembaruan yang dapat diproses saat ini.');
        }

        delete Data.pendingUpdate[cht.sender];
        memories.delItem(cht.sender, 'pendingUpdate');

        await cht.reply('Updating...');
        let changed = `*📂File Changed:*`;
        let modifed = '';
        let newfile = '';
        let failed = '\n*❗Failed:*';
        let text;
        let i = 0;

        for (let [url, fpath] of urlPath) {
          if (i === Data.spinner.length) i = 0;
          let res = await fetch(url);
          if (!res.ok) {
            failed += `\n- ${url}\n> Failed to fetch url`;
            continue;
          }
          let isExists = fs.existsSync(fpath);
          if (isExists) {
            modifed += `\n- \`modifed\`: ${fpath}`;
          } else {
            newfile += `\n- \`new\`: ${fpath}`;
          }
          if (path.basename(fpath) === 'global.js') {
            let oldContent = fs.existsSync(fpath)
              ? fs.readFileSync(fpath, 'utf8')
              : '';
            let oldMongo = '';

            let match = oldContent.match(
              /let\s+mongoURI\s*=\s*['"`](.*?)['"`]/
            );
            if (match) {
              oldMongo = match[1];
            }

            let buff = await res.text();

            if (oldMongo) {
              buff = buff.replace(
                /let\s+mongoURI\s*=\s*['"`](.*?)['"`]\s*;/,
                `let mongoURI = '${oldMongo}';`
              );
            }

            fs.writeFileSync(fpath, buff);
          } else {
            let buff = await res.text();
            fs.writeFileSync(fpath, buff);
          }

          text = `*${Data.spinner[i++]}[ 🛠️ ] UPDATE*\n\n${changed}${modifed}${newfile}\n`;
          await cht.edit(text, keys[sender]);
          await sleep(750);
        }

        if (failed.length > 12) text += failed;
        await cht.edit(text, keys[sender]);
        return cht.reply(Data.infos.owner.updateSuccess);
      }

      urls ??= [];
      if (urls.length === 0 && cht.q) {
        urls = func.parseLink(cht.q);
      }

      if (!urls || urls.length === 0) {
        return cht.question(Data.infos.isUrl, {
          emit: 'update',
          accepts: [],
          exp: Date.now() + 60000,
        });
      }

      let allowedFormats = [
        'c.termai.cc',
        'cdn.xtermai.xyz',
        'pastebin.com',
        'raw.githubusercontent.com',
      ];

      let isAllowed = urls.some((url) =>
        allowedFormats.some((fmt) =>
          url.toLowerCase().includes(fmt.toLowerCase())
        )
      );

      if (!isAllowed) {
        return cht.reply(
          func.tagReplacer(Data.infos.isFormatsUrl, {
            formats: allowedFormats.join('\n- '),
          })
        );
      }

      if (urls[0].includes('pastebin.com') || urls[0].includes('c.termai.cc')) {
        let _text = await fetch(
          urls[0].replace(
            /pastebin\.com\/(?!raw\/)(\w+)/,
            'pastebin.com/raw/$1'
          )
        ).then((a) => a.text());
        urls = _text
          ? (
              _text?.match(/https?:\/\/[^\s)]+/g) ||
              _text?.match(
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
      }

      let fols = await getDirectoriesRecursive();
      let failed = '\n*❗Failed:*';
      let urlPath = urls
        .map((link) => {
          const { pathname, host } = new URL(link);
          let isValidHost = [
            'c.termai.cc',
            'cdn.xtermai.xyz',
            'raw.githubusercontent.com',
          ].includes(host);
          if (!isValidHost) {
            failed += `\n- ${link}\n> Invalid host url`;
            return null;
          }
          let f = (
            host === 'raw.githubusercontent.com'
              ? pathname.split('heads/')[1]
              : pathname
          )
            ?.split('/')
            ?.slice(1)
            ?.join('/')
            ?.split('/');
          const filename = f.slice(-1)[0];

          if (!filename) {
            failed += `\n- ${link}\n> File empty`;
            return null;
          }

          const _path = f.slice(0, -1).join('/');

          for (const folder of fols) {
            const folderPath = folder.split('./')[1].slice(0, -1);

            if (folderPath.includes(_path) && _path) {
              return [link, `${folder}${filename}`];
            }

            if (
              [
                'index.js',
                'package',
                'readme.md',
                'prettierignore',
                'prettierrc',
              ].some((a) => filename.includes(a))
            ) {
              return [link, `./${filename}`];
            }
          }
          failed += `\n- Unknown error URL(${link})`;
          return null;
        })
        .filter(Boolean);

      if (urlPath.length === 0) {
        return cht.reply(
          '❌ Tidak ada berkas valid yang ditemukan dari URL yang diberikan!' +
            (failed.length > 12 ? failed : '')
        );
      }

      let files = [];
      let recentFiles = [];
      let now = Date.now();

      for (let [url, fpath] of urlPath) {
        let isExists = fs.existsSync(fpath);
        if (isExists) {
          files.push({ type: 'modified', path: fpath });
          try {
            let stat = fs.statSync(fpath);
            let diffMs = now - stat.mtimeMs;
            if (diffMs < 86400000) {
              let sec = Math.floor(diffMs / 1000);
              let min = Math.floor(sec / 60);
              let hr = Math.floor(min / 60);
              let timeAgo =
                hr > 0
                  ? `${hr} jam ${min % 60} menit yang lalu`
                  : min > 0
                    ? `${min} menit yang lalu`
                    : `${sec} detik yang lalu`;
              recentFiles.push({ path: fpath, timeAgo });
            }
          } catch {}
        } else {
          files.push({ type: 'new', path: fpath });
        }
      }

      Data.pendingUpdate[cht.sender] = {
        urlPath,
        exp: Date.now() + 120000,
      };

      let previewTpl = Data.infos.owner.updatePreview({ files, recentFiles });
      return cht.question(
        previewTpl.body,
        {
          emit: 'update',
          accepts: ['y', 'ya', 'yes', 'n', 'no', 'batal', 'cancel'],
          Keys: {
            y: 'y',
            ya: 'y',
            yes: 'y',
            n: 'n',
            no: 'n',
            batal: 'n',
            cancel: 'n',
          },
          exp: Date.now() + 120000,
        },
        { footer: previewTpl.footer }
      );
    }
  );

  /*ev.on(
    {
      cmd: ['upswgc'],
      listmenu: ['upswgc'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      let [txt, _type] = cht.q.split('--');

      let text = txt || cht.quoted.text || '';
      let { quoted, type } = ev.getMediaType();
      let isText = ['conversation', 'extendedTextMessage'].includes(type);
      let message = {};

      let value;

      if (!isText) {
        value = quoted ? await cht.quoted.download() : await cht.download();
        message['caption'] = text;
      } else {
        type = 'text';
        value = text;
      }
      message[type] = value;
      let msg = await generateWAMessage(STORIES_JID, message, {
        upload: Exp.waUploadToServer,
      });

      let { message: _msg, key } = msg;

      let groups = [];
      if (txt.endsWith(from.group)) _type = txt;
      if (_type == 'all') {
        groups = new Set(
          [
            store.chats
              .all()
              .map((a) => a.id)
              .filter((a) => a.endsWith(from.group)),
            Object.keys(Data.preferences).filter((a) => a.endsWith(from.group)),
          ].flat()
        );
      } else if (_type?.endsWith(from.group)) groups.push(_type);
      else if (is.group) {
        groups.push(cht.id);
      } else {
        return cht.reply('Sertakan id groupnya!');
      }

      await cht.reply('Uploading to stories..');
      for (let ID of groups) {
        await Exp.relayMessage(STORIES_JID, _msg, {
          messageId: key.id,
          statusJidList: (
            await func.getGroupMetadata(ID, Exp)
          ).participants.map((a) => a.id),
          additionalNodes: [
            {
              tag: 'meta',
              attrs: {},
              content: [
                {
                  tag: 'mentioned_users',
                  attrs: {},
                  content: [
                    {
                      tag: 'to',
                      attrs: { jid: ID },
                      content: undefined,
                    },
                  ],
                },
              ],
            },
          ],
        });

        //await Exp.sendMessage(ID, { text: 'Success' }, { quoted: msg })
        let mmm = await generateWAMessageFromContent({
          [ID.endsWith(from.group)
            ? 'groupStatusMentionMessage'
            : 'statusMentionMessage']: {
            message: {
              protocolMessage: {
                key,
                type: 25,
              },
            },
          },
        });
        await Exp.relayMessage(ID, mmm.message, {
          additionalNodes: [
            {
              tag: 'meta',
              attrs: { is_status_mention: 'true' },
              content: undefined,
            },
          ],
        });
      }
    }
  ); */

  ev.on(
    {
      cmd: ['addrespon', 'setresponse', 'setrespon', 'adresponse'],
      listmenu: ['addrespon'],
      isQuoted: `Reply pesan! dengan caption: ${cht.prefix + cht.cmd} <teks>`,
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let res = (await store.loadMessage(id, cht.quoted.stanzaId)).message;
      Data.response[args.toLowerCase()?.replace(/ /g, '')] = res;
      cht.reply(
        `Success set response!\n- Type: ${cht.quoted.type}\n\n_Pesan dengan teks "*${args}*" akan direspon dengan pesan tersebut!_\n\n> ℹ️ Untuk melihat list response, ketik: ${cht.prefix}listresponse\n> ℹ️ Untuk menghapus response, ketik: ${cht.prefix}delresponse <teks yang direspon>`
      );
    }
  );

  ev.on(
    {
      cmd: ['delrespon', 'delresponse'],
      listmenu: ['delrespon'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      delete Data.response[args.toLowerCase()?.replace(/ /g, '')];
      cht.reply(`Success delete response "*${args}*"`);
    }
  );

  ev.on(
    {
      cmd: ['listrespon', 'listresponse'],
      listmenu: ['listresponse'],
      isOwner: true,
      tag: 'owner',
    },
    () => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let res = Object.keys(Data.response || {});
      let t = 0;
      let tx = '*LIST RESPONSE*\n';
      for (let i of res) {
        t++;
        tx += `\n${t}. \`${i}\`\n- type: \`${Object.keys(Data.response[i])[0]}\``;
      }
      cht.reply(
        `${tx}\n\n> ℹ️ Untuk menghapus response, ketik: ${cht.prefix}delresponse <teks yang direspon>`
      );
    }
  );

  ev.on(
    {
      cmd: ['setcmd'],
      listmenu: ['setcmd'],
      media: {
        type: ['image', 'sticker', 'video', 'audio', 'document'],
        save: false,
      },
      tag: 'owner',
      args: `Reply pesan media! dengan caption: ${cht.prefix + cht.cmd} <command>`,
      isOwner: true,
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let { quoted, type } = ev.getMediaType();
      Data.setCmd[
        (quoted ? cht.quoted : cht)[type].fileSha256.toString().to('utf16le')
      ] = args;
      cht.reply(`Success set cmd!\n- Type: ${type}\n- Command: ${args}`);
    }
  );

  ev.on(
    {
      cmd: ['delcmd'],
      listmenu: ['delcmd'],
      media: {
        type: ['image', 'sticker', 'video', 'audio', 'document'],
        save: false,
      },
      tag: 'owner',
      args: `Reply pesan media! dengan caption: ${cht.prefix + cht.cmd}`,
      isOwner: true,
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let { quoted, type } = ev.getMediaType();
      let cmd =
        Data.setCmd[
          (quoted ? cht.quoted : cht)[type].fileSha256.toString().to('utf16le')
        ];
      await cht.reply(
        `Success delete cmd!\n- Type: ${type}\n- Command: ${cmd}`
      );
      delete Data.setCmd[
        (quoted ? cht.quoted : cht)[type].fileSha256.toString().to('utf16le')
      ];
    }
  );

  ev.on(
    {
      cmd: ['addlinkgc', 'dellinkgc'],
      listmenu: ['addlinkgc', 'dellinkgc'],
      tag: 'owner',
      args: `Sertakan linkgroupnya!`,
      urls: {
        formats: ['https://chat.whatsapp.com'],
        msg: true,
      },
      isOwner: true,
    },
    async ({ urls }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      cfg.gcurl ??= [];
      let url = urls.map((a) => `- ${a}`).join('\n');
      if (cht.cmd == 'addlinkgc') {
        cfg.gcurl = [...new Set([...cfg.gcurl, ...urls])];
      } else {
        cfg.gcurl = cfg.gcurl.filter((a) => !cfg.gcurl.includes(a));
      }
      cht.reply(
        `Berhasil men${cht.cmd == 'addlinkgc' ? 'ambahkan' : 'ghapus'} url✅\n\n${url}`
      );
    }
  );

  ev.on(
    {
      cmd: ['listlinkgc'],
      listmenu: ['listlinkgc'],
      tag: 'owner',
      isOwner: true,
    },
    () => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      cfg.gcurl ??= [];
      let url =
        cfg.gcurl.length > 0
          ? cfg.gcurl.map((a) => `- ${a}`).join('\n')
          : `_❗Tidak ada linkgroup yang tersedia!_\n\n## *Jika anda ingin menambahkan linkgroup*\n- Ketik: \`.addlinkgc linknya\``;
      cht.reply(`*LIST LINK GROUP*\n\n${url}`);
    }
  );

  ev.on(
    {
      cmd: ['masuk', 'join'],
      listmenu: ['masuk', 'join'],
      isOwner: true,
      args: 'Masukkan linknya!',
      urls: {
        formats: ['https://chat.whatsapp.com'],
        msg: 'Itu bukan link group!',
      },
    },
    async () => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      try {
        await Exp.groupAcceptInvite(
          cht.q.split('/').slice(-1)?.[0]?.split('?')?.[0]
        );
        cht.reply('success✅');
      } catch (e) {
        console.error(e);
        cht.reply('TypeErr: ' + e.message);
      }
    }
  );

  ev.on(
    {
      cmd: ['leave', 'keluar'],
      listmenu: ['leave'],
      isOwner: true,
    },
    async ({ args, urls }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      try {
        let y = [
          'y',
          'ya',
          'iy',
          'iya',
          'hooh',
          "ho'oh",
          'iye',
          'yo',
          'iyo',
          'yup',
          'iyup',
          'nggeh',
          'yakin',
        ];
        let cyk = args.split('--')?.[1]?.trim();
        let q = cyk
          ? args.split('-- ' + cyk)[0]
          : urls?.[0] || args?.split(' ')[0];
        let gid = q.split('@')?.[0]?.trim();
        let idgc =
          q && !isNaN(gid) ? gid : is.group ? id?.split('@')[0] : false;
        let yakin = y.includes(cyk?.toLowerCase());
        const host = q?.split('://')?.[1]?.split('/')?.[0];
        let isLinkGc = 'chat.whatsapp.com'.includes(host);
        let inviteCodeMatch = q.match(/chat\.whatsapp\.com\/([\w-]+)/);
        let ki = 'Kirimkan link';
        let dmpi = 'dengan mereply pesan ini';
        let inviteCode = inviteCodeMatch?.[1];

        let qdata = {
          exp: Date.now() + 60000,
          accepts: y,
        };

        if (!is.group) {
          if (!((idgc && !isNaN(idgc)) || isLinkGc)) {
            return cht.question(`${ki}/id groupnya ${dmpi}!`, {
              emit: cht.cmd,
              ...qdata,
            });
          }
        }
        if (idgc && isNaN(idgc)) {
          return cht.question(`${ki}/id groupnya ${dmpi}!`, {
            emit: cht.cmd,
            ...qdata,
          });
        }
        if (!idgc && !isLinkGc) {
          return cht.question(`${ki}/id groupnya ${dmpi}!`, {
            emit: cht.cmd,
            ...qdata,
          });
        }

        if (!inviteCodeMatch && isLinkGc) {
          return cht.question(`${ki} yang valid ${dmpi}!`, {
            emit: cht.cmd,
            ...qdata,
          });
        }

        let gcid;
        if (inviteCodeMatch) {
          let groupInfo = await Exp.groupGetInviteInfo(inviteCode);
          gcid = groupInfo.id;
        } else if (idgc && !isNaN(idgc)) {
          gcid = idgc + from.group;
        } else {
          gcid = id;
        }

        if (!cyk) {
          let meta = await func.getGroupMetadata(gcid);
          return cht.question(
            `Yakin ingin keluar dari group \`${meta.subject}\`?`,
            { emit: `${cht.cmd} ${q} --`, ...qdata }
          );
        }
        if (yakin) {
          await cht.reply('Sedang keluar...');
          await sleep(3000);
          await Exp.groupLeave(gcid);
        }
      } catch (e) {
        cht.reply('TypeErr: ' + e.message);
      }
    }
  );

  ev.on(
    {
      cmd: ['listgc', 'listgroup'],
      listmenu: ['listgroup'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let tx = 'Mengecek semua nama group yang terdaftar...';
      await cht.reply(tx);
      let gc = Object.keys(preferences).filter((a) => a.includes(from.group));
      let g = `*LIST GROUP*\n`;
      let perStep = Math.ceil(gc.length / 5);

      for (let i = 0; i < gc.length; i++) {
        try {
          if ((i + 1) % perStep === 0 || i + 1 === gc.length) {
            const progress = Math.round(((i + 1) / gc.length) * 100);
            cht.edit(`${tx}\nProgress: ${progress}%`, keys[sender], true);
          }
          await sleep(750 + Math.floor(Math.random() * 800));
          let meta = await func.getGroupMetadata(gc[i], Exp);
          g += `\n${i + 1}. ${meta.subject}`;
        } catch (e) {
          console.error(e);
        }
      }
      cht.reply(g);
    }
  );

  ev.on(
    {
      cmd: ['resetenergy'],
      listmenu: ['resetenergy'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args, cht }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let act = {
        y: `✅ Berhasil mereset semua *energy user* menjadi default (⚡${cfg.first.energy}).`,
        n: '❌ Ok gajadi, energi tidak direset.',
      };

      let cmd = (args || '').trim().toLowerCase();

      switch (cmd) {
        case 'y':
          let count = 0;
          for (let id in Data.users) {
            try {
              Data.users[id].energy = cfg.first.energy;
              count++;
            } catch {
              continue;
            }
          }
          cht.reply(`${act.y}\nTotal user direset: *${count}*`);
          break;

        case 'n':
          cht.reply(act.n);
          break;

        default:
          cht.question(
            `⚡ *Reset Energy Confirmation*\n\nReply dan Ketik:\n- *y* untuk mengonfirmasi reset energi semua user.\n- *n* untuk membatalkan.`,
            { emit: `${cht.cmd}`, exp: Date.now() + 60000, accepts: ['y', 'n'] }
          );
          break;
      }
    }
  );

  ev.on(
    {
      cmd: ['listuser'],
      listmenu: ['listuser'],
      tag: 'owner',
      isOwner: true,
      args: 'Mau liat list user apa sayang? user premium, user afk atau user banned',
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let now = Date.now();
      let mode = args.includes('afk')
        ? 'afk'
        : args.includes('premium')
          ? 'premium'
          : args.includes('banned')
            ? 'banned'
            : null;

      if (!mode) {
        return reply(infos.owner.listuserhelp);
      }

      let afkInf = func.tagReplacer(infos.owner.listusermode, { mode: 'afk' });
      let premInf = func.tagReplacer(infos.owner.listusermode, {
        mode: 'premium',
      });
      let banInf = func.tagReplacer(infos.owner.listusermode, {
        mode: 'banned',
      });

      let nullAfk = func.tagReplacer(infos.owner.listusernull, { mode: 'afk' });
      let nullPrem = func.tagReplacer(infos.owner.listusernull, {
        mode: 'premium',
      });
      let nullBan = func.tagReplacer(infos.owner.listusernull, {
        mode: 'banned',
      });

      let list = [];
      for (const [id, user] of Object.entries(Data.users)) {
        if (mode === 'afk' && user.afk?.time) {
          let dur = func.formatDuration(now - user.afk.time);
          let lamaAfk =
            `${dur.days > 0 ? dur.days + 'd ' : ''}` +
            `${dur.hours > 0 ? dur.hours + 'h ' : ''}` +
            `${dur.minutes > 0 ? dur.minutes + 'm ' : ''}` +
            `${dur.seconds > 0 ? dur.seconds + 's ' : ''}`;

          list.push({
            id,
            name: user.name || id,
            reason: user.afk.reason,
            lamaAfk: lamaAfk.trim(),
          });
        }

        if (mode === 'premium' && user.premium?.time > now) {
          list.push({
            id,
            name: user.name || id,
            role: user.role,
            expPrem: new Date(user.premium.time).toLocaleString('id-ID'),
          });
        }

        if (mode === 'banned' && user.banned && user.banned > now) {
          let dur = func.formatDuration(user.banned - now);
          let sisa =
            `${dur.days > 0 ? dur.days + 'd ' : ''}` +
            `${dur.hours > 0 ? dur.hours + 'h ' : ''}` +
            `${dur.minutes > 0 ? dur.minutes + 'm ' : ''}` +
            `${dur.seconds > 0 ? dur.seconds + 's ' : ''}`;
          list.push({
            id,
            name: user.name || id,
            until: new Date(user.banned).toLocaleString('id-ID'),
            remaining: sisa.trim(),
          });
        }
      }

      if (list.length === 0) {
        return reply(
          mode === 'afk'
            ? `${nullAfk}`
            : mode === 'premium'
              ? `${nullPrem}`
              : `${nullBan}`
        );
      }

      let teks =
        mode === 'afk'
          ? `${afkInf}\n\n`
          : mode === 'premium'
            ? `${premInf}\n\n`
            : `${banInf}\n\n`;

      list.forEach((u, i) => {
        teks += `${i + 1}. ${u.id}\n`;
        teks += `    • Nama : ${u.name}\n`;
        if (mode === 'afk') {
          teks += `    • Lama afk : ${u.lamaAfk}\n`;
          teks += `    • Alasan : ${u.reason}\n\n`;
        } else if (mode === 'premium') {
          teks += `    • Role : ${u.role?.split(',')[0]}\n`;
          teks += `    • Expired : ${u.expPrem}\n\n`;
        } else if (mode === 'banned') {
          teks += `    • Banned sampai : ${u.until}\n`;
          teks += `    • Sisa waktu : ${u.remaining}\n\n`;
        }
      });

      teks += `Total \`${list.length} user\``;

      await cht.reply(teks);
    }
  );

  ev.on(
    {
      cmd: ['getcmd', 'getevents'],
      listmenu: ['getevents'],
      tag: 'owner',
      isOwner: true,
      args: 'Mau ambil code events apa?',
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      let cmd = args.trim().toLowerCase();
      let event = Data.events[cmd];
      let didYouMean =
        !event &&
        (await func
          .searchSimilarStrings(cmd, Object.keys(Data.events), 0.4)
          .then((a) =>
            a.map(
              (res, idx) =>
                `${idx + 1}. ${res.item} (kemiripan: ${(res.similarity * 100).toFixed(2)}%)`
            )
          ));
      if (!event)
        return cht.reply(
          `Event Code "${cmd}" tidak ada!` +
            (didYouMean?.length > 0
              ? `\n\n*Mungkin yang kamu maksud:*\n- ${didYouMean.join('\n- ')}`
              : '')
        );
      let eventKeys = Object.keys(event).filter(
          (a) => !['eventFile', 'resolve'].includes(a)
        ),
        eventObj = { cmd: [cmd] };
      for (var key of eventKeys) {
        eventObj[key] = event[key];
      }
      let text =
        `ev.on(${eventObj.String()},\n` + String(event.resolve) + `\n)`;
      cht.reply(text);
    }
  );

  ev.on(
    {
      cmd: ['unblock', 'block'],
      listmenu: ['unblock', 'block'],
      isOwner: true,
      isMention: true,
      tag: 'owner',
    },
    async () => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      await Exp.updateBlockStatus(cht.mention[0], cht.cmd);
      cht.reply(
        `Success mem${cht.cmd == 'block' ? '' : 'buka '}blokir user ${cht.mention[0].split('@')[0]}✅`
      );
    }
  );

  ev.on(
    {
      cmd: ['rch.info', 'rch.stats'],
      listmenu: ['rch.info'],
      isOwner: true,
      tag: 'owner',
    },
    () => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      const d = Data.ch_reaction || {};

      const text =
        '📊 *STATISTIK REMOTE REACTION*\n\n' +
        '🔹 Ringkasan\n' +
        '• Mulai dicatat : ' +
        (d.startedAt
          ? new Date(d.startedAt).toLocaleString('id-ID', { hour12: false })
          : '-') +
        '\n' +
        '• Total   : ' +
        (d.totalReact ?? 0) +
        '\n' +
        '• Success      : ' +
        (d.reactSuccess ?? 0) +
        '\n' +
        '• Gagal         : ' +
        (d.reactError ?? 0) +
        '\n\n' +
        '🕒 Aktivitas Terakhir\n' +
        '• Last sukses : ' +
        (d.lastSuccess || '-') +
        '\n' +
        '• Last error  : ' +
        (d.lastError || '-') +
        '\n\n' +
        (d.perType && Object.keys(d.perType).length
          ? '😊 Detail Reaction\n' +
            Object.keys(d.perType)
              .map((e) => {
                const v = d.perType[e];
                return (
                  '• ' +
                  e +
                  ' → ' +
                  v.count +
                  'x (' +
                  (v.last
                    ? new Date(v.last).toLocaleString('id-ID', {
                        hour12: false,
                      })
                    : '-') +
                  ')'
                );
              })
              .join('\n') +
            '\n\n'
          : '') +
        (d.reactsByHour && Object.keys(d.reactsByHour).length
          ? '⏱ Statistik Waktu\n' +
            (() => {
              const h = Object.keys(d.reactsByHour).sort().pop(); // 2025-12-21T05
              const jam = h.split('T')[1] + ':00';
              return (
                '• Aktivitas terakhir(jam) ' +
                jam +
                ' WIB (' +
                d.reactsByHour[h].count +
                ' reaction)'
              );
            })() +
            '\n\n'
          : '') +
        (d.reactsByDate
          ? '📅 Rekap Periode\n' +
            (() => {
              let s = '';
              const dd = d.reactsByDate.daily || {};
              const ww = d.reactsByDate.weekly || {};
              const mm = d.reactsByDate.monthly || {};
              const yy = d.reactsByDate.yearly || {};

              const ld = Object.entries(dd).pop();
              const lw = Object.entries(ww).pop();
              const lm = Object.entries(mm).pop();
              const ly = Object.entries(yy).pop();

              if (ld) s += '• Harian (' + ld[0] + ') : ' + ld[1].count + '\n';
              if (lw) s += '• Mingguan (' + lw[0] + ') : ' + lw[1].count + '\n';
              if (lm) s += '• Bulanan (' + lm[0] + ') : ' + lm[1].count + '\n';
              if (ly) s += '• Tahunan (' + ly[0] + ') : ' + ly[1].count + '\n';

              return s;
            })() +
            '\n'
          : '') +
        (d.spamGuard
          ? '🛡 Anti-Spam\n' +
            '• Hit : ' +
            (d.spamGuard.hits?.length ?? 0) +
            '\n' +
            '• Alert terakhir : ' +
            (d.spamGuard.lastAlert
              ? new Date(d.spamGuard.lastAlert).toLocaleString('id-ID', {
                  hour12: false,
                })
              : 'Belum pernah')
          : '');
      cht.reply(text);
    }
  );

  ev.on(
    {
      cmd: ['q', 'quoted', 'qpc', 'quotedpc'],
      listmenu: ['q', 'qpc'],
      isOwner: true,
      isQuoted:
        '*Reply pesannya!*\n' +
        'Sertakan juga angka untuk menentukan seberapa dalam quoted diambil.\n' +
        'Contoh: .qpc 2',

      tag: 'owner',
    },
    async ({ args }) => {
      if (is?.jadibot || Exp?.isJadibot)
        return cht.reply('🚫 Fitur ini hanya dapat diakses melalui Bot Utama!');
      function deepFind(o, key = 'contextInfo', max = 5) {
        if (!o || typeof o !== 'object' || !max) return null;
        if (o[key]) return o[key];
        for (const k in o) {
          const r = deepFind(o[k], key, max - 1);
          if (r) return r;
        }
        return null;
      }

      let jid = cht.cmd.includes('pc') ? cht.sender : cht.id;
      let current = await store.loadMessage(cht.id, cht.quoted?.key?.id);

      let depth = Number(args) || 100;
      let deep = 0;
      let stopped = 'max-depth';
      let lastKey = current?.key;

      for (; deep < depth && current; ) {
        deep++;
        const ctx = deepFind(current.message, 'key', 4);

        if (!ctx?.stanzaId || !ctx?.participant) {
          stopped = 'no-quoted';
          break;
        }

        const next = await store.loadMessage(ctx.participant, ctx.stanzaId);
        if (!next) {
          stopped = 'end-quoted';
          break;
        }

        current = next;
        lastKey = next.key;
      }
      await Exp.relayMessage(jid, current.message, {});
      await Exp.sendMessage(
        jid,
        {
          text:
            ` 🔍 *Quoted Info*\n` +
            ` • Requested Depth : ${depth}\n` +
            ` • Reached Depth : ${deep}\n` +
            ` • Stop Reason : ${stopped}\n` +
            ` • Final ID : ${lastKey?.id}\n\n` +
            `\`CODE\`:\n` +
            infos.others.readMore +
            JSON.stringify(current.message, 0, 2),
        },
        { quoted: current.message }
      );
    }
  );

  ev.on(
    {
      cmd: ['rdp'],
      listmenu: ['rdp'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      const { exec } = await 'child_process'.import();
      const action = (args || '').trim().toLowerCase();
      if (
        !['on', 'off', 'start', 'stop', 'status', 'detail'].includes(action)
      ) {
        return cht.reply(infos.owner.rdpHelp);
      }
      exec('/usr/local/bin/rdp ' + action, (err, stdout, stderr) => {
        let res = (stdout || stderr || 'Done').trim();
        cht.reply(res);
      });
    }
  );

  ev.on(
    {
      cmd: ['sendch', 'upch'],
      listmenu: ['sendch'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      let customJid = null;
      let textArgs = (args || '').trim();
      let firstWord = textArgs.split(/\s+/)[0] || '';

      if (
        firstWord.endsWith('@newsletter') ||
        (firstWord.startsWith('120363') && /^\d+$/.test(firstWord))
      ) {
        customJid = firstWord.endsWith('@newsletter')
          ? firstWord
          : firstWord + '@newsletter';
        textArgs = textArgs.slice(firstWord.length).trim();
      }

      let chJid = customJid || cfg.menu?.chId?.newsletterJid || cfg.chId?.newsletterJid;
      let chName = customJid ? chJid : (cfg.menu?.chId?.newsletterName || cfg.chId?.newsletterName || chJid);
      if (!chJid) return cht.reply(infos.owner.noChId);

      let getChLink = async (jid) => {
        try {
          if (cfg.menu?.chId?.newsletterJid === jid && cfg.menu?.chId?.invite) {
            return `https://whatsapp.com/channel/${cfg.menu.chId.invite}`;
          }
          let meta = await Exp.newsletterMetadata('jid', jid).catch(() => null);
          let invite = meta?.thread_metadata?.invite || meta?.invite;
          if (invite) {
            if (cfg.menu?.chId?.newsletterJid === jid) {
              cfg.menu.chId.invite = invite;
            }
            return `https://whatsapp.com/channel/${invite}`;
          }
        } catch {}
        return null;
      };

      if (is.quoted) {
        let qType = cht.quoted.type;
        if (['image', 'video'].includes(qType)) {
          let buffer = await cht.quoted.download();
          let isPtv = Boolean(cht.quoted.video?.ptv || cht.quoted.mtype === 'ptvMessage');
          if (isPtv) {
            await Exp.sendMessage(chJid, {
              video: buffer,
              ptv: true,
            });
            let chLink = await getChLink(chJid);
            return cht.reply(infos.owner.sendchSuccess(chName, 'Video Note (PTV)', chLink));
          }
          let caption = textArgs || cht.quoted.text || '';
          await Exp.sendMessage(chJid, {
            [qType]: buffer,
            caption: caption || undefined,
          });
          let chLink = await getChLink(chJid);
          return cht.reply(infos.owner.sendchSuccess(chName, qType === 'image' ? 'Gambar' : 'Video', chLink));
        }

        if (qType === 'audio') {
          let buffer = await cht.quoted.download();
          await Exp.sendMessage(chJid, {
            audio: buffer,
            ptt: true,
          });
          let chLink = await getChLink(chJid);
          return cht.reply(infos.owner.sendchSuccess(chName, 'Voice Note (PTT)', chLink));
        }

        if (qType === 'sticker') {
          let buffer = await cht.quoted.download();
          await Exp.sendMessage(chJid, { sticker: buffer });
          let chLink = await getChLink(chJid);
          return cht.reply(infos.owner.sendchSuccess(chName, 'Stiker', chLink));
        }

        if (qType === 'document') {
          let buffer = await cht.quoted.download();
          await Exp.sendMessage(chJid, {
            document: buffer,
            mimetype: cht.quoted.document?.mimetype || 'application/octet-stream',
            fileName: cht.quoted.document?.fileName || 'document',
          });
          let chLink = await getChLink(chJid);
          return cht.reply(infos.owner.sendchSuccess(chName, 'Dokumen', chLink));
        }

        if (qType === 'conversation' || qType === 'extendedTextMessage') {
          let textToSend = textArgs || cht.quoted.text || '';
          if (textToSend) {
            await Exp.sendMessage(chJid, { text: textToSend });
            let chLink = await getChLink(chJid);
            return cht.reply(infos.owner.sendchSuccess(chName, 'Teks', chLink));
          }
        }

        let quotedRaw =
          cht?.message?.[cht.type]?.contextInfo?.quotedMessage ||
          cht.quoted?.message ||
          cht.quoted;
        if (!quotedRaw && cht.quoted.stanzaId) {
          try {
            let loaded = await store.loadMessage(id, cht.quoted.stanzaId);
            if (loaded?.message) {
              quotedRaw = loaded.message;
            }
          } catch {}
        }

        if (quotedRaw) {
          await Exp.relayMessage(chJid, quotedRaw, {});
          let chLink = await getChLink(chJid);
          return cht.reply(infos.owner.sendchSuccess(chName, 'Relay Message', chLink));
        }

        let textToSend = textArgs || cht.quoted.text || '';
        if (textToSend) {
          await Exp.sendMessage(chJid, { text: textToSend });
          let chLink = await getChLink(chJid);
          return cht.reply(infos.owner.sendchSuccess(chName, 'Teks', chLink));
        }
      }

      if (textArgs) {
        await Exp.sendMessage(chJid, { text: textArgs });
        let chLink = await getChLink(chJid);
        return cht.reply(infos.owner.sendchSuccess(chName, 'Teks', chLink));
      }

      return cht.reply(infos.owner.sendchHelp);
    }
  );

  ev.on(
    {
      cmd: ['playch', 'playvnch'],
      listmenu: ['playch'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      let customJid = null;
      let textArgs = (args || '').trim();
      let firstWord = textArgs.split(/\s+/)[0] || '';

      if (
        firstWord.endsWith('@newsletter') ||
        (firstWord.startsWith('120363') && /^\d+$/.test(firstWord))
      ) {
        customJid = firstWord.endsWith('@newsletter')
          ? firstWord
          : firstWord + '@newsletter';
      }

      let chJid =
        customJid ||
        cfg.menu?.chId?.newsletterJid ||
        cfg.chId?.newsletterJid;
      let chName = customJid
        ? chJid
        : cfg.menu?.chId?.newsletterName ||
          cfg.chId?.newsletterName ||
          chJid;
      if (!chJid) return cht.reply(infos.owner.noChId);

      let isAudioQuoted =
        is.quoted &&
        (cht.quoted.type === 'audio' ||
          cht.quoted.mimetype?.includes('audio') ||
          cht.quoted.ptt);

      if (!isAudioQuoted) {
        return cht.reply(infos.owner.playchHelp);
      }

      let buffer = await cht.quoted.download();
      if (!buffer) return cht.reply('❌ Gagal mengunduh audio!');

      await Exp.sendMessage(chJid, {
        audio: buffer,
        ptt: true,
      });

      let getChLink = async (jid) => {
        try {
          if (cfg.menu?.chId?.newsletterJid === jid && cfg.menu?.chId?.invite) {
            return `https://whatsapp.com/channel/${cfg.menu.chId.invite}`;
          }
          let meta = await Exp.newsletterMetadata('jid', jid).catch(() => null);
          let invite = meta?.thread_metadata?.invite || meta?.invite;
          if (invite) {
            if (cfg.menu?.chId?.newsletterJid === jid) {
              cfg.menu.chId.invite = invite;
            }
            return `https://whatsapp.com/channel/${invite}`;
          }
        } catch {}
        return null;
      };

      let chLink = await getChLink(chJid);
      return cht.reply(
        infos.owner.playchSuccess(chName, 'Voice Note (PTT)', chLink)
      );
    }
  );

  ev.on(
    {
      cmd: ['ticket', 'report'],
      listmenu: ['ticket'],
      tag: 'owner',
      isOwner: true,
      isCoOwner: false,
    },
    async () => {
      const getTicketLinkPreview = async () => {
        if (!keys['ticket_lp_media']) {
          try {
            let rawBuf = await Exp.func.getBuffer('https://c.termai.cc/i135/fZ6dc.png');
            let resMedia = await prepareWAMessageMedia(
              { image: rawBuf },
              { upload: Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
            );
            if (resMedia?.imageMessage) {
              keys['ticket_lp_media'] = resMedia.imageMessage;
              keys['ticket_lp_thumb'] = rawBuf;
            }
          } catch {}
        }
        let imgMsg = keys['ticket_lp_media'];
        return {
          'matched-text': 'https://termai.cc',
          title: '🎫 Helpdesk & Developer Support',
          description: 'Termai Support & Developer Ticket System',
          jpegThumbnail: imgMsg?.jpegThumbnail
            ? Buffer.from(imgMsg.jpegThumbnail)
            : keys['ticket_lp_thumb'] || undefined,
          highQualityThumbnail: imgMsg
            ? {
                ...imgMsg,
                width: 1280,
                height: 720,
              }
            : undefined,
        };
      };

      let q = (cht.q || '').trim();
      if (!q || q === 'help' || q === 'menu') {
        let helpTpl = infos.owner.ticketHelp;
        let text = typeof helpTpl === 'object' && helpTpl?.body ? helpTpl.body : helpTpl;
        let linkPreview = await getTicketLinkPreview();
        return Exp.sendMessage(
          cht.id,
          {
            text: `https://termai.cc\n` + text,
            linkPreview,
          },
          { quoted: cht }
        );
      }

      let lowerQ = q.toLowerCase();

      if (q === 'list' || q === 'my') {
        let senderNumber = String(cht.sender || '').replace(/[^0-9]/g, '');
        try {
          let tickets = await global.listTickets(senderNumber);
          if (!tickets || tickets.length === 0) {
            return cht.reply(infos.owner.ticketListEmpty);
          }
          let text = infos.owner.ticketList(tickets);
          let linkPreview = await getTicketLinkPreview();
          return Exp.sendMessage(
            cht.id,
            {
              text: `https://termai.cc\n` + text,
              linkPreview,
            },
            { quoted: cht }
          );
        } catch (e) {
          return cht.reply(infos.owner.ticketFailed(e.message));
        }
      }

      if (lowerQ.startsWith('check ') || lowerQ.startsWith('status ') || lowerQ.startsWith('info ') || /^#?tck-[a-z0-9]+/i.test(q)) {
        let ticketId = q.replace(/^(check|status|info)\s+/i, '').trim();
        try {
          let ticket = await global.getTicket(ticketId);
          let text = infos.owner.ticketDetail(ticket);
          let linkPreview = await getTicketLinkPreview();
          return Exp.sendMessage(
            cht.id,
            {
              text: `https://termai.cc\n` + text,
              linkPreview,
            },
            { quoted: cht }
          );
        } catch (e) {
          return cht.reply(infos.owner.ticketFailed(e.message));
        }
      }

      if (lowerQ.startsWith('close ') || lowerQ.startsWith('tutup ')) {
        let ticketId = q.replace(/^(close|tutup)\s+/i, '').trim();
        try {
          let res = await global.updateTicketUser({ ticketId, actionType: 'close' });
          let linkPreview = await getTicketLinkPreview();
          return Exp.sendMessage(
            cht.id,
            {
              text: `https://termai.cc\n` + infos.owner.ticketCloseSuccess(res.ticketId || ticketId),
              linkPreview,
            },
            { quoted: cht }
          );
        } catch (e) {
          return cht.reply(infos.owner.ticketFailed(e.message));
        }
      }

      if (lowerQ.startsWith('reopen ') || lowerQ.startsWith('buka ')) {
        let ticketId = q.replace(/^(reopen|buka)\s+/i, '').trim();
        try {
          let res = await global.updateTicketUser({ ticketId, actionType: 'reopen' });
          let linkPreview = await getTicketLinkPreview();
          return Exp.sendMessage(
            cht.id,
            {
              text: `https://termai.cc\n` + infos.owner.ticketReopenSuccess(res.ticketId || ticketId),
              linkPreview,
            },
            { quoted: cht }
          );
        } catch (e) {
          return cht.reply(infos.owner.ticketFailed(e.message));
        }
      }

      if (lowerQ.startsWith('reply ') || lowerQ.startsWith('balas ')) {
        let cleanText = q.replace(/^(reply|balas)\s+/i, '').trim();
        let ticketId = cleanText.includes('|')
          ? cleanText.split('|')[0].trim()
          : cleanText.split(/\s+/)[0].trim();
        let replyText = cleanText.includes('|')
          ? cleanText.split('|').slice(1).join('|').trim()
          : cleanText.split(/\s+/).slice(1).join(' ').trim();

        if (!ticketId || !replyText) {
          return cht.reply('Format salah. Gunakan: .ticket reply <ID_Tiket> | <pesan>');
        }

        try {
          let res = await global.updateTicketUser({ ticketId, actionType: 'reply', replyText });
          let linkPreview = await getTicketLinkPreview();
          return Exp.sendMessage(
            cht.id,
            {
              text: `https://termai.cc\n` + infos.owner.ticketReplySuccess(res.ticketId || ticketId),
              linkPreview,
            },
            { quoted: cht }
          );
        } catch (e) {
          return cht.reply(infos.owner.ticketFailed(e.message));
        }
      }

      let category = 'bug';
      let subject = '';
      let message = '';
      const validCategories = ['bug', 'error', 'feature', 'question', 'account', 'general'];

      if (q.includes('|')) {
        let parts = q.split('|').map((s) => s.trim()).filter(Boolean);
        if (parts.length >= 3) {
          let first = parts[0].toLowerCase();
          category = validCategories.includes(first) ? first : 'bug';
          subject = parts[1];
          message = parts.slice(2).join(' | ');
        } else if (parts.length === 2) {
          let headTokens = parts[0].split(/\s+/);
          let firstToken = headTokens[0].toLowerCase();
          if (validCategories.includes(firstToken)) {
            category = firstToken;
            subject = headTokens.slice(1).join(' ') || parts[1];
            message = parts[1];
          } else {
            category = 'bug';
            subject = parts[0];
            message = parts[1];
          }
        } else {
          message = parts[0];
          subject = message.slice(0, 40);
        }
      } else {
        let tokens = q.split(/\s+/);
        let firstToken = tokens[0].toLowerCase();
        if (validCategories.includes(firstToken) && tokens.length > 1) {
          category = firstToken;
          message = tokens.slice(1).join(' ');
          subject = message.slice(0, 40) + (message.length > 40 ? '...' : '');
        } else {
          category = 'bug';
          message = q;
          subject = q.slice(0, 40) + (q.length > 40 ? '...' : '');
        }
      }

      if (!subject) subject = message.slice(0, 40) + (message.length > 40 ? '...' : '') || 'Laporan Tiket';
      if (!message) message = subject;

      await cht.reply(infos.owner.ticketSending);

      try {
        let senderNumber = String(cht.sender || '').replace(/[^0-9]/g, '');
        let res = await global.createTicket({
          category,
          subject,
          message,
          senderNumber,
          senderJid: cht.sender,
        });

        let linkPreview = await getTicketLinkPreview();
        return Exp.sendMessage(
          cht.id,
          {
            text: `https://termai.cc\n` + infos.owner.ticketSuccess(res.ticketId, category, subject),
            linkPreview,
          },
          { quoted: cht }
        );
      } catch (err) {
        return cht.reply(infos.owner.ticketFailed(err.message));
      }
    }
  );

  ev.on(
    {
      cmd: ['dm', 'chatadmin'],
      tag: 'owner',
      isOwner: true,
      isCoOwner: false,
    },
    async () => {
      let rawText = cht.q || cht.msg || '';
      let q = rawText.trim().toLowerCase();
      if (['end', 'close', 'stop', '.dm end', '.dm close'].includes(q)) {
        if (!Data.activeDmSession) {
          return cht.reply('Tidak ada sesi obrolan aktif saat ini.');
        }
        await global.sendDmEnd({ sessionId: Data.activeDmSession.sessionId });
        Data.activeDmSession = null;
        let tpl = infos.owner.dmClosed;
        return Exp.sendMessage(cht.id, { text: tpl.body || tpl, footer: tpl.footer }, { quoted: cht });
      }

      if (Data.pendingDmSession) {
        if (['y', 'ya', 'yes', 'accept', 'ok', 'oke'].includes(q)) {
          await global.sendDmConsent({ sessionId: Data.pendingDmSession.sessionId, accepted: true });
          Data.activeDmSession = { sessionId: Data.pendingDmSession.sessionId, active: true };
          Data.pendingDmSession = null;
          let tpl = infos.owner.dmAccepted;
          return Exp.sendMessage(cht.id, { text: tpl.body || tpl, footer: tpl.footer }, { quoted: cht });
        }
        if (['n', 'no', 'tidak', 'reject', 'batal', 'cancel'].includes(q)) {
          await global.sendDmConsent({ sessionId: Data.pendingDmSession.sessionId, accepted: false });
          Data.pendingDmSession = null;
          let tpl = infos.owner.dmRejected;
          return Exp.sendMessage(cht.id, { text: tpl.body || tpl, footer: tpl.footer }, { quoted: cht });
        }
      }

      if (Data.activeDmSession) {
        if (rawText) {
          await global.sendDmReply({ sessionId: Data.activeDmSession.sessionId, text: rawText });
          return cht.reply('✅ *Pesan diteruskan ke Admin Termai.*');
        }
        let tpl = infos.owner.dmAccepted;
        return Exp.sendMessage(cht.id, { text: tpl.body || tpl, footer: tpl.footer }, { quoted: cht });
      }

      return cht.reply('Belum ada sesi obrolan aktif dari Admin Termai.');
    }
  );

  ev.on(
    {
      cmd: ['infoupdate', 'updateinfo', 'detailupdate'],
      listmenu: ['infoupdate'],
      tag: 'owner',
      isOwner: true,
      isCoOwner: false,
    },
    async () => {
      let tpl = infos.owner.infoUpdateHelp;
      let text = typeof tpl === 'object' && tpl?.body ? tpl.body : tpl;
      let linkPreview = await getUpdateLinkPreview();
      return Exp.sendMessage(
        cht.id,
        {
          text: `https://termai.cc\n` + text,
          linkPreview,
        },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['infoticket', 'ticketinfo', 'detailticket'],
      listmenu: ['infoticket'],
      tag: 'owner',
      isOwner: true,
      isCoOwner: false,
    },
    async () => {
      let tpl = infos.owner.infoTicketHelp;
      let text = typeof tpl === 'object' && tpl?.body ? tpl.body : tpl;
      if (!keys['ticket_lp_media']) {
        try {
          let rawBuf = await Exp.func.getBuffer('https://c.termai.cc/i135/fZ6dc.png');
          let resMedia = await prepareWAMessageMedia(
            { image: rawBuf },
            { upload: Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
          );
          if (resMedia?.imageMessage) {
            keys['ticket_lp_media'] = resMedia.imageMessage;
            keys['ticket_lp_thumb'] = rawBuf;
          }
        } catch {}
      }
      let imgMsg = keys['ticket_lp_media'];
      let linkPreview = {
        'matched-text': 'https://termai.cc',
        title: '🎫 Helpdesk & Developer Support System',
        description: 'Termai Support & Developer Ticket Architecture',
        jpegThumbnail: imgMsg?.jpegThumbnail
          ? Buffer.from(imgMsg.jpegThumbnail)
          : keys['ticket_lp_thumb'] || undefined,
        highQualityThumbnail: imgMsg
          ? {
              ...imgMsg,
              width: 1280,
              height: 720,
            }
          : undefined,
      };
      return Exp.sendMessage(
        cht.id,
        {
          text: `https://termai.cc\n` + text,
          linkPreview,
        },
        { quoted: cht }
      );
    }
  );
}
