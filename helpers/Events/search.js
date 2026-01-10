/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const { generateWAMessageFromContent } = 'baileys'.import();
const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r();
let exif = await (fol[0] + 'exif.js').r();
let { convert } = exif;

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  let { sender, id } = cht;
  let { func } = Exp;
  let infos = Data.infos;

  ev.on(
    {
      cmd: ['pin', 'pinterest', 'pinterestsearch'],
      listmenu: ['pinterest'],
      tag: 'search',
      args: 'Cari apa?',
      badword: true,
      energy: 5,
    },
    async () => {
      let [query, geser] = cht?.q?.split('--geser');
      let amount = parseInt(geser?.split(' ')?.[1] || 5);
      amount = amount > 15 ? 15 : amount < 1 ? 1 : amount;
      let res = await fetch(
        `${api.xterm.url}/api/search/pinterest-image?query=${query}&key=${api.xterm.key}`
      ).then((a) => a.json());
      let { data } = res || {};
      if (data.length < 1) return cht.reply('Tidak ditemukan!');
      if (typeof geser == 'string') {
        let cards = [];
        data = data.slice(0, amount);

        for (let i of data) {
          let img = await Exp.func.uploadToServer(i);
          cards.push({
            header: {
              imageMessage: img,
              hasMediaAttachment: true,
            },
            body: { text: `#${cards.length + 1}` },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson:
                    '{"display_text":"WhatsappChannel","url":"https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V","webview_presentation":null}',
                },
              ],
            },
          });
        }

        let msg = generateWAMessageFromContent(
          id,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  body: {
                    text: `Result from "${query?.trim()}"`,
                  },
                  carouselMessage: {
                    cards,
                    messageVersion: 1,
                  },
                },
              },
            },
          },
          {}
        );

        Exp.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      } else {
        if (cfg.button) {
          let imageMessage = await func.uploadToServer(data.getRandom());

          let _m = {
            interactiveMessage: {
              header: {
                title: '',
                imageMessage,
                hasMediaAttachment: true,
              },
              body: {
                text: '🔍 Pinterest Search'.font('bold'),
              },
              footer: {
                text: `Query: ${query}`,
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'quick_reply',
                    buttonParamsJson: {
                      display_text: 'Next ➡️',
                      id: `.pin ${query}`,
                    }.String(),
                  },
                ],
              },
              contextInfo: {
                stanzaId: cht.key.id,
                participant: cht.key.participant,
                quotedMessage: cht,
              },
            },
          };

          return Exp.relayMessage(cht.id, _m, {});
        }
        Exp.sendMessage(
          id,
          { image: { url: data.slice(0, 10).getRandom() } },
          { quoted: cht }
        );
      }
    }
  );

  ev.on(
    {
      cmd: ['pinstik', 'pinstick', 'pinstiker', 'pinsticker'],
      listmenu: ['pinsticker'],
      tag: 'search',
      energy: 5,
      args: `Mau cari sticker apa?`,
    },
    async ({ args }) => {
      try {
        let res = await fetch(
          `${api.xterm.url}/api/search/pinterest-image?query=${args}&key=${api.xterm.key}`
        ).then((a) => a.json());
        let { data } = res || {};
        if (data.length < 1) return cht.reply('Tidak ditemukan!');
        let url = await convert({
          url: data.slice(0, 20).getRandom(),
          from: 'jpg',
          to: 'webp',
        });
        let buff = await func.getBuffer(url);
        let s = await exif['writeExifImg'](
          buff,
          {
            packname: 'My sticker',
            author: 'Ⓒ' + cht.pushName,
          },
          true
        );
        Exp.sendMessage(
          id,
          {
            sticker: {
              url: s,
            },
          },
          {
            quoted: cht,
          }
        );
      } catch (e) {
        console.error(e);
        await cht.reply('Failed convert image to sticker!');
        throw new Error(e);
      }
    }
  );

  ev.on(
    {
      cmd: ['gis', 'image', 'gimage', 'googleimage', 'gimg', 'googleimg'],
      listmenu: ['googleimage'],
      tag: 'search',
      args: `Contoh: ${cht.msg} Xun'er`,
      badword: true,
      energy: 5,
    },
    async () => {
      try {
        let url = await fetch(
          api.xterm.url +
            '/api/search/google-image?query=' +
            encodeURIComponent(cht.q) +
            '&key=' +
            api.xterm.key
        ).then(async (a) => {
          if (!a.ok) throw new Error(`Fetch failed with status ${a.status}`);
          let res = await a.json();
          if (!res?.data) throw new Error('Response missing data');
          return res.data.getRandom();
        });

        if (cfg.button) {
          let imageMessage = await func.uploadToServer(url);

          let _m = {
            interactiveMessage: {
              header: {
                title: '',
                imageMessage,
                hasMediaAttachment: true,
              },
              body: {
                text: '🔍 Google Image Search'.font('bold'),
              },
              footer: {
                text: `Query: ${cht.q}`,
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'quick_reply',
                    buttonParamsJson: {
                      display_text: 'Next ➡️',
                      id: `.image ${cht.q}`,
                    }.String(),
                  },
                ],
              },
              contextInfo: {
                stanzaId: cht.key.id,
                participant: cht.key.participant,
                quotedMessage: cht,
              },
            },
          };

          return Exp.relayMessage(cht.id, _m, {});
        }

        await Exp.sendMessage(
          id,
          { image: { url }, caption: `Google image search: \`${cht.q}\`` },
          { quoted: cht }
        ).catch((err) =>
          cht.reply(`Failed sending image: ${err.message}\nURL: ${url}`)
        );
      } catch (err) {
        cht.reply(`❌ Error: ${err.message}`);
      }
    }
  );

  ev.on(
    {
      cmd: ['pinvid', 'pinterestvid', 'pinterestvideo'],
      listmenu: ['pinterestvideo'],
      tag: 'search',
      args: 'Cari apa?',
      badword: true,
      energy: 21,
    },
    async () => {
      try {
        let [query, geser] = cht?.q?.split('--geser');
        let amount = parseInt(geser?.split(' ')?.[1] || 5);
        amount = amount > 10 ? 10 : amount < 1 ? 1 : amount;

        await cht.edit(infos.messages.wait, keys[sender]);

        let data =
          (
            await fetch(
              api.xterm.url +
                '/api/search/pinterest-video?query=' +
                query +
                '&key=' +
                api.xterm.key
            ).then((a) => a.json())
          ).data?.pins || [];

        if (data.length < 1) return cht.reply('Video tidak ditemukan!');

        if (typeof geser == 'string') {
          let res = await fetch(
            `${api.xterm.url}/api/search/pinterest-image?query=${query}&key=${api.xterm.key}`
          ).then((a) => a.json());
          let cards = [];
          if (data) {
            data = data.slice(0, amount);

            for (let i of data) {
              let p = (
                await fetch(
                  api.xterm.url +
                    '/api/downloader/pinterest?url=' +
                    i.link +
                    '&key=' +
                    api.xterm.key
                ).then((a) => a.json())
              ).data;
              let _pin = Object.values(p.videos)[0].url;
              let vid = await Exp.func.uploadToServer(_pin, 'video');
              cards.push({
                header: {
                  videoMessage: vid,
                  hasMediaAttachment: true,
                },
                body: { text: i.title },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'cta_url',
                      buttonParamsJson:
                        '{"display_text":"WhatsappChannel","url":"https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V","webview_presentation":null}',
                    },
                  ],
                },
              });
            }

            let msg = generateWAMessageFromContent(
              id,
              {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      body: {
                        text: `Result from "${query?.trim()}"`,
                      },
                      carouselMessage: {
                        cards,
                        messageVersion: 1,
                      },
                    },
                  },
                },
              },
              {}
            );

            Exp.relayMessage(msg.key.remoteJid, msg.message, {
              messageId: msg.key.id,
            });
          }
        } else {
          let pin = data[Math.floor(Math.random() * data.length)];
          let p = (
            await fetch(
              api.xterm.url +
                '/api/downloader/pinterest?url=' +
                pin.link +
                '&key=' +
                api.xterm.key
            ).then((a) => a.json())
          ).data;
          let _pin = Object.values(p.videos)[0].url;
          if (cfg.button) {
            let videoMessage = await func.uploadToServer(_pin, 'video');

            let _m = {
              interactiveMessage: {
                header: {
                  title: '',
                  videoMessage,
                  hasMediaAttachment: true,
                },
                body: {
                  text:
                    '🔍 Pinterest Video Search'.font('bold') +
                    `\nTitle: *${pin.title}*`,
                },
                footer: {
                  text: `Query: ${query}`,
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'quick_reply',
                      buttonParamsJson: {
                        display_text: 'Next ➡️',
                        id: `.${cht.cmd} ${query}`,
                      }.String(),
                    },
                  ],
                },
                contextInfo: {
                  stanzaId: cht.key.id,
                  participant: cht.key.participant,
                  quotedMessage: cht,
                },
              },
            };

            return Exp.relayMessage(cht.id, _m, {});
          }
          Exp.sendMessage(
            id,
            { video: { url: _pin }, caption: pin.title, mimetype: 'video/mp4' },
            { quoted: cht }
          );
        }
      } catch (e) {
        return cht.reply('TypeErr:' + e.message);
      }
    }
  );

  ev.on(
    {
      cmd: ['animesearch'],
      listmenu: ['animesearch'],
      tag: 'search',
      media: {
        type: ['image', 'sticker'],
        msg: `Reply gambar/sticker dengan caption ${cht.prefix}animesearch untuk mencari anime!`,
        save: false,
      },
      energy: 5,
    },
    async ({ media }) => {
      try {
        let link = await TermaiCdn(media);
        const apiUrl = `https://api.trace.moe/search?url=${encodeURIComponent(link)}`;

        const res = await fetch(apiUrl);
        const { result } = await res.json();

        if (!res.ok || !result || result.length < 1) {
          return cht.reply(
            '❌ Tidak ditemukan informasi anime untuk gambar yang diberikan.'
          );
        }

        const anime = result[0];
        const { anilist, filename, episode, similarity, video, image } = anime;

        const caption =
          `🎥 *Anime Found!* 🎥\n\n` +
          `📄 *Episode*: ${episode || 'Unknown'}\n` +
          `🔗 *Similarity*: ${(similarity * 100).toFixed(2)}%\n` +
          `🖼️ *Filename*: ${filename || 'Unknown'}\n\n` +
          `📺 \`Preview Video\`: ${video}\n` +
          `🌟 \`Anilist Link\`: https://anilist.co/anime/${anilist}`;

        await Exp.sendMessage(
          cht.id,
          { image: { url: image }, caption },
          { quoted: cht }
        );
        Exp.sendMessage(
          cht.id,
          {
            video: { url: video },
            caption: `📺 \`Preview Video\`: ${filename}`,
          },
          { quoted: cht }
        );
      } catch (error) {
        console.error(error);
        cht.reply(
          '❌ Terjadi kesalahan saat menghubungi API. Silakan coba lagi nanti.'
        );
      }
    }
  );

  ev.on(
    {
      cmd: ['liriksearch', 'lyrics', 'lirik'],
      listmenu: ['lirik'],
      tag: 'search',
      args: `Contoh: ${cht.msg} Selendang Biru`,
      energy: 15,
    },
    async ({ args }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key);

      let { data, status, msg } = await fetch(
        api.xterm.url +
          '/api/search/lyrics?query=' +
          args +
          '&key=' +
          api.xterm.key
      ).then((a) => a.json());
      if (!status) return cht.reply(msg);

      let duration = data.track_length;
      let m = Math.floor((duration % 3600) / 60);
      let s = duration % 60;

      let text = '*!-======[ Lyrics 🎶 ]======-!*\n';
      text += `\n🎵 *Judul:* ${data.track_name}`;
      text += `\n👨‍🎤 *Penyanyi:* ${data.artist_name}`;
      text += `\n💽 *Album:* ${data.album_name}`;
      text += `\n📅 *Rilis:* ${data.first_release_date}`;
      text += `\n⏱️ *Durasi:* ${m}:${s.toString().padStart(2, '0')}`;
      text += `\n🔗 *URL:* ${data.track_share_url}`;
      text += `\n\n📝 *Lyrics:*\n${data.lyrics}`;

      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: data.track_name,
            body: data.artist_name,
            thumbnailUrl: data.album_coverart_350x350,
            sourceUrl: data.track_share_url,
            mediaUrl:
              'http://wa.me/6283110928302/' +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: cfg.chId || {
            newsletterName: 'Termai',
            newsletterJid: '120363301254798220@newsletter',
          },
        },
      };

      await Exp.sendMessage(id, info, { quoted: cht });
      await cht.edit(infos.messages.done, _key);
    }
  );

  ev.on(
    {
      cmd: ['ttsr', 'tiktoksearch', 'ttsearch'],
      listmenu: ['tiktoksearch'],
      tag: 'search',
      args: `Cari video apa?`,
      energy: 10,
    },
    async ({ args }) => {
      try {
        let params = new URLSearchParams({ query: args, key: api.xterm.key });
        let res = await fetch(api.xterm.url + '/api/search/tiktok?' + params);
        if (!res.ok)
          return cht.reply(`❗*Failed*\nAPI response status: ${res.status}`);
        let { data, msg, status } = await res.json();

        if (!status) return cht.reply(msg);
        let text = '';
        let Keys = {};
        for (let i = 0; i < data.length; i++) {
          const v = data[i];
          Keys[i + 1] = v.link;
          text +=
            `${i + 1}. ${v.title?.trim() || '-'}\n` +
            `   👤 ${v.author_name} (@${v.author_username})\n` +
            `   ⏱ Durasi: ${v.duration}s\n` +
            `   👁 Views: ${v.stats?.views?.toLocaleString() || 0}\n` +
            `   ❤️ Like: ${v.stats?.like?.toLocaleString() || 0}\n` +
            `   🔗 ${v.link}\n\n`;
        }

        cht.question(
          `🎶 *Tiktok Search*\n${text}`,
          {
            emit: 'tiktok',
            sender: cht.sender,
            exp: Date.now() + func.parseTimeString('5 menit'),
            accepts: Object.keys(Keys),
            Keys,
            maxUse: 10,
          },
          {
            footer: `- Balas pesan ini dengan angka 1 sampai ${data.length} untuk mengunduh!\n_Kamu bisa melakukannya selama 5 menit dan maksimal ${data.length}x (hanya berlaku untuk @${cht.sender.split('@')[0]})_`,
            mentions: [cht.sender],
          }
        );
      } catch (e) {
        cht.reply(`❗*Failed*\n${Data.infos.others.readMore} ${e}`);
      }
    }
  );
}
