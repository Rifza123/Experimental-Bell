/*!-======[ Module Imports ]======-!*/
const axios = 'axios'.import();

/*!-======[ Function Imports ]======-!*/
const { mediafireDl } = await (fol[0] + 'mediafire.js').r();
const { processMedia } = await './toolkit/ffmpeg.js'.r();
const fs = 'fs'.import();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  let infos = Data.infos;
  let { func } = Exp;
  let { archiveMemories: memories } = func;
  let { sender, id } = cht;

  ev.on(
    {
      cmd: ['pinterestdl', 'pindl'],
      listmenu: ['pinterestdl'],
      tag: 'downloader',
      urls: {
        formats: ['pinterest', 'pin'],
        msg: true,
      },
      energy: 7,
    },
    async ({ urls }) => {
      await cht.reply('```Processing...```');
      let p = (
        await fetch(
          api.xterm.url +
            '/api/downloader/pinterest?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      let pin = Object.values(p.videos)[0].url;
      Exp.sendMessage(
        id,
        { video: { url: pin }, mimetype: 'video/mp4' },
        { quoted: cht.reaction || cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['mediafire', 'mediafiredl'],
      listmenu: ['mediafire'],
      tag: 'downloader',
      urls: {
        formats: ['mediafire'],
        msg: true,
      },
      energy: 75,
    },
    async ({ urls }) => {
      const _key = keys[sender];

      await cht.edit('```Processing...```', _key);
      try {
        let m = await mediafireDl(urls[0]);
        let { headers } = await axios.get(m.link);
        let type = headers['content-type'];
        await cht.edit('Sending...', _key);
        await Exp.sendMessage(
          id,
          { document: { url: m.link }, mimetype: type, fileName: m.title },
          { quoted: cht.reaction || cht }
        );
      } catch (e) {
        await cht.edit('TypeErr: ' + e, _key);
      }
    }
  );

  ev.on(
    {
      cmd: [
        'tiktok',
        'tiktokdl',
        'tt',
        'ttaudio',
        'tiktokaudio',
        'ttvn',
        'tiktokvn',
      ],
      listmenu: ['tiktok', 'tiktokaudio'],
      tag: 'downloader',
      urls: {
        formats: ['tiktok', 'douyin'],
        msg: true,
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key);
      let isAudio = /^(vn|audio)/.test(cht.cmd);
      let data = (
        await fetch(
          api.xterm.url +
            '/api/downloader/tiktok?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;

      let text = '*!-======[ TIKTOK ]======-!*\n';
      text += `\nTitle: ${data.title}`;
      text += `\nAccount: ${data.author.nickname}`;
      text += `\nLikes: ${data.stats.diggCount}`;
      text += `\nComments: ${data.stats.commentCount}`;
      text += `\nPostTime: ${data.createTime}`;
      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: cht.pushName,
            body: 'Tiktok Downloader',
            thumbnailUrl: data.thumbnail,
            sourceUrl: 'https://github.com/Rifza123',
            mediaUrl:
              'http://ẉa.me/6283110928302/' +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: 'Termai',
            newsletterJid: '120363301254798220@newsletter',
          },
        },
      };
      await Exp.sendMessage(id, info, { quoted: cht });
      await cht.edit(infos.messages.sending, _key);
      let type = data.type;
      if (!isAudio && type == 'image') {
        for (let image of data.media) {
          await Exp.sendMessage(
            id,
            { image: { url: image.url } },
            { quoted: cht }
          );
        }
      }
      if (!isAudio && type == 'video') {
        await Exp.sendMessage(
          id,
          { video: { url: data.media[1].url } },
          { quoted: cht }
        );
      }
      await Exp.sendMessage(
        id,
        {
          audio: { url: data.audio.url },
          mimetype: 'audio/mpeg',
          ptt: cht.cmd.includes('vn'),
        },
        { quoted: cht.reaction || cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['spotify', 'spotdl', 'spodl'],
      listmenu: ['spotify'],
      tag: 'downloader',
      urls: {
        formats: ['spotify.com', 'open.spotify.com'],
        msg: true,
      },
      energy: 15,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key);
      let data = (
        await fetch(
          api.xterm.url +
            '/api/downloader/spotify?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      let duration = data.trackDuration;
      let m = Math.floor((duration % 3600) / 60);
      let s = duration % 60;
      let text = '*!-======[ Spotify🎵 ]======-!*\n';
      text += `\nTrack: ${data.trackName}`;
      text += `\nAccount: ${data.albumName}`;
      text += `\nAlbumReleaseDate: ${data.albumReleaseDate}`;
      text += `\nArtists: ${data.artists.join(', ')}`;
      text += `\nTrackDuration: ${m + ':' + s}`;
      text += `\nTrackPopularity: ${data.trackPopularity}`;
      text += `\nTrackUrl: ${data.trackUrl}`;
      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: cht.pushName,
            body: 'Spotify Downloader',
            thumbnailUrl: data.albumImageUrl,
            sourceUrl: 'https://github.com/Rifza123',
            mediaUrl:
              'http://ẉa.me/6283110928302/' +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: 'Termai',
            newsletterJid: '120363301254798220@newsletter',
          },
        },
      };
      await Exp.sendMessage(id, info, { quoted: cht });
      await cht.edit(infos.messages.sending, _key);
      await Exp.sendMessage(
        id,
        { audio: { url: data.downloadUrl }, mimetype: 'audio/mpeg' },
        { quoted: cht.reaction || cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['rednote', 'renotedl', 'xiaohongshu'],
      listmenu: ['rednote', 'xiaohongshu'],
      tag: 'downloader',
      urls: {
        formats: ['xhslink.com', 'xiaohongshu.com'],
        msg: true,
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key);

      let res = await await fetch(
        api.xterm.url +
          '/api/downloader/rednote?url=' +
          urls[0] +
          '&key=' +
          api.xterm.key
      ).then((a) => a.json());
      if (!res.status) return cht.reply(res.msg);
      let data = res.data;
      let text = '*!-======[ Rednote ]======-!*\n';
      text += `\nTitle: ${data.title}`;
      text += `\nAccount: ${data.user.nickName}`;
      text += `\nLikes: ${data.interactInfo.likedCount}`;
      text += `\nComments: ${data.commentCountL1}`;
      text += `\nPostTime: ${func.dateFormatter(data.time, 'Asia/Jakarta')}`;
      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: cht.pushName,
            body: 'Rednote Downloader',
            thumbnailUrl: data.images[0].url,
            sourceUrl: 'https://github.com/Rifza123',
            mediaUrl:
              'http://ẉa.me/6283110928302/' +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: 'Termai',
            newsletterJid: '120363301254798220@newsletter',
          },
        },
      };
      await Exp.sendMessage(id, info, { quoted: cht });
      await cht.edit(infos.messages.sending, _key);
      let type = data.type;
      if (type == 'image') {
        for (let image of data.images) {
          await Exp.sendMessage(
            id,
            {
              image: { url: image.url },
              // caption: image.width + 'x' + image.height,
            },
            { quoted: cht.reaction || cht }
          );
        }
      } else if (type == 'video') {
        await Exp.sendMessage(
          id,
          { video: { url: data.video.url } },
          { quoted: cht.reaction || cht }
        );
      }
    }
  );

  ev.on(
    {
      cmd: [
        'ytmp3',
        'ytm4a',
        'play',
        'ytmp4',
        'playvn',
        'dlvlink',
        'yts',
        'ytsearch',
      ],
      listmenu: ['ytmp3', 'ytm4a', 'play', 'ytmp4'],
      tag: 'downloader',
      badword: true,
      args: 'Harap sertakan url/judul videonya!',
      energy: 5,
    },
    async ({ args, urls }) => {
      const _key = keys[sender];
      let isDl = cht.cmd == 'dlvlink';
      let isYts = ['yts', 'ytsearch', 'play'].includes(cht.cmd);
      let q = urls?.[0] || args || null;
      let [dlink, json] = args.split('|||||');
      let item = json ? JSON.parse(json) : {};
      if (!q) return cht.reply('Harap sertakan url/judul videonya!');
      try {
        if (!isDl) {
          await cht.edit('Searching...', _key);
          let search = (
            await fetch(
              `${api.xterm.url}/api/search/youtube?query=${q}&key=${api.xterm.key}`
            ).then((a) => a.json())
          ).data;
          item = search.items[0];
          if (cfg.button && isYts) {
            let imageMessage = await func.uploadToServer(item.thumbnail);
            let paramJson = {
              title: `🔎Click and see all search results➡️`,
              has_multiple_buttons: true,
              sections: search.items.map((v, i) => ({
                title: `#${i + 1}. ${v.title}`,
                highlight_label: `${v.duration}`,
                rows: [
                  {
                    title: 'Download Audio/M4A 🎵',
                    description: 'Audio Biasa',
                    id: `.ytm4a ${v.url}`,
                  },
                  {
                    title: 'Download Audio/WAV 🎙️',
                    description: 'Voice Note',
                    id: `.playvn ${v.url}`,
                  },
                  {
                    title: 'Download Audio/MP4 📹',
                    description: 'Video',
                    id: `.ytmp4 ${v.url}`,
                  },
                  {
                    title: 'Download Audio/MP3 💽',
                    description: 'Audio MP3 (dalam bentuk dokumen)',
                    id: `.ytmp3 ${v.url}`,
                  },
                ],
              })),
            };

            let _m = {
              interactiveMessage: {
                header: {
                  title: '',
                  imageMessage,
                  hasMediaAttachment: true,
                },
                body: {
                  text: `🔍 YouTube Search\n${item.title}`.font('bold'),
                },

                footer: {
                  text: `👤 Channel: ${item.author?.name}\n⏱ Duration: ${item.duration}\n📅 Rilis: ${item.publishedAt}\n👁️ Views: ${item.viewCount.toLocaleString()}\n🔗 ${item.url}`,
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'single_select',
                      buttonParamsJson: '{"has_multiple_buttons":true}',
                    },
                    {
                      name: 'single_select',
                      buttonParamsJson: paramJson.String(),
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
        }
        let data = (
          await fetch(
            api.xterm.url +
              '/api/downloader/youtube?key=' +
              api.xterm.key +
              '&url=https://www.youtube.com/watch?v=' +
              item.id +
              '&type=' +
              (cht.cmd === 'ytmp4' ? 'mp4' : 'mp3')
          ).then((a) => a.json())
        ).data;

        if (cfg.button && !isDl && cht.cmd == 'ytmp4') {
          let downloads = data?.downloads || [];
          let imageMessage = await func.uploadToServer(data.thumb);
          let paramJson = {
            title: `📥 Pilih format download`,
            has_multiple_buttons: true,
            sections: [
              {
                title: `🎬 Video (MP4)`,
                rows: downloads.map((v) => ({
                  title:
                    `${v.resolution} ${v.ext.toUpperCase()} ${v.hasAudio ? '🔊' : ''}`.trim(),
                  description: `ITag: ${v.format_id} • FPS: ${v.fps} • ${v.note || ''}`,
                  id: `.dlvlink ${v.dlink}|||||${JSON.stringify(item)}`,
                })),
              },
            ],
          };

          // compose interactive message
          let _m = {
            interactiveMessage: {
              header: {
                title: '',
                imageMessage,
                hasMediaAttachment: true,
              },
              body: {
                text: `🎞 ${data.caption}`.font('bold'),
              },
              footer: {
                text: `⏱ Durasi: ${data.duration}\n📺 Source: YouTube\n🔗 ${data.link}`,
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'single_select',
                    buttonParamsJson: '{"has_multiple_buttons":true}',
                  },
                  {
                    name: 'single_select',
                    buttonParamsJson: paramJson.String(),
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

        await cht.edit('Downloading...', _key);

        let saved = isDl
          ? await func.saveToFile(dlink + '&isBaileys=true')
          : false;
        isDl && (await cht.edit('Converting...', _key));
        let converted = saved
          ? await processMedia(saved, ['-c:v', 'libx264', '-an'], 'mp4')
          : null;
        console.log(converted);
        let audio = {
          [cht.cmd === 'ytmp4' || isDl
            ? 'video'
            : cht.cmd === 'ytmp3'
              ? 'document'
              : 'audio']: isDl
            ? { url: converted }
            : await func.getBuffer(data.dlink),
          mimetype:
            isDl || cht.cmd === 'ytmp4'
              ? 'video/mp4'
              : cht.cmd === 'ytmp3'
                ? 'audio/mp3'
                : 'audio/mpeg',
          fileName:
            item.title +
            (cht.cmd === 'ytmp4' || cht.cmd == 'dlvlink' ? '.mp4' : '.mp3'),
          ptt: cht.cmd === 'playvn',
          contextInfo: {
            externalAdReply: {
              title: 'Title: ' + item.title,
              body: 'Channel: ' + item.creator,
              thumbnailUrl: item.thumbnail,
              sourceUrl: item.url,
              mediaUrl:
                'http://ẉa.me/6283110928302?text=Idmsg: ' +
                Math.floor(Math.random() * 100000000000000000),
              renderLargerThumbnail: false,
              showAdAttribution: true,
              mediaType: 2,
            },
          },
        };
        console.log(audio);
        await cht.edit('Sending...', _key);
        await Exp.sendMessage(cht.id, audio, { quoted: cht.reaction || cht });
        await cht.edit('Success...', _key);
        //  fs.unlinkSync(saved);
        //fs.unlinkSync(converted);
      } catch (e) {
        console.log(e);
        cht.reply("Can't download from that url!");
      }
    }
  );

  ev.on(
    {
      cmd: ['facebookdl', 'fb', 'fbdl', 'facebook'],
      listmenu: ['facebookdl'],
      tag: 'downloader',
      urls: {
        msg: true,
        formats: ['facebook', 'fb'],
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit('```Processing...```', _key);
      let f = (
        await fetch(
          api.xterm.url +
            '/api/downloader/facebook?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      await cht.edit('Sending...', _key);
      Exp.sendMessage(
        id,
        { video: { url: f.urls.sd }, mimetype: 'video/mp4', caption: f.title },
        { quoted: cht.reaction || cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['instagramdl', 'ig', 'igdl', 'instagram'],
      listmenu: ['instagramdl'],
      tag: 'downloader',
      urls: {
        msg: true,
        formats: ['instagram'],
      },
      energy: 5,
    },
    async ({ urls }) => {
      const _key = keys[sender];
      await cht.edit('```Processing...```', _key);
      let f = (
        await fetch(
          api.xterm.url +
            '/api/downloader/instagram?url=' +
            urls[0] +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      let text = '*!-======[ Instagram ]======-!*\n';
      text += `\nTitle: ${f.title}`;
      text += `\nAccount: ${f.accountName}`;
      text += `\nLikes: ${f.likes}`;
      text += `\nComments: ${f.comments}`;
      text += `\nPostTime: ${f.postingTime}`;
      text += `\nPostUrl: ${f.postUrl}`;
      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: cht.pushName,
            body: 'Instagram Downloader',
            thumbnailUrl: f.imageUrl,
            sourceUrl: 'https://github.com/Rifza123',
            mediaUrl:
              'http://ẉa.me/6283110928302/' +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            showAdAttribution: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: 'Termai',
            newsletterJid: '120363301254798220@newsletter',
          },
        },
      };
      await Exp.sendMessage(id, info, { quoted: cht.reaction || cht });
      let { content } = f;
      for (let i of content) {
        try {
          await Exp.sendMessage(
            id,
            { [i.type]: { url: i.url } },
            { quoted: cht.reaction || cht }
          );
        } catch (e) {
          console.log(e);
        }
      }
    }
  );

  ev.on(
    {
      cmd: ['gitclone'],
      listmenu: ['gitclone'],
      tag: 'downloader',
      urls: {
        formats: ['github.com'],
        msg: true,
      },
      energy: 2,
    },
    async () => {
      const repo = cht.q.split('https://github.com/')[1]?.replace('.git', '');
      const repoName = repo?.split('/')[1];
      const { default_branch } = await fetch(
        `https://api.github.com/repos/${repo}`
      ).then((res) => res.json());
      const zipUrl = `https://github.com/${repo}/archive/refs/heads/${default_branch}.zip`;
      Exp.sendMessage(
        cht.id,
        {
          document: { url: zipUrl },
          mimetype: 'application/zip',
          fileName: `${repoName}.zip`,
        },
        { quoted: cht.reaction || cht }
      ).catch((e) =>
        cht.reply(
          `[❗LINK ERROR ❗]\n\nExample : ${cht.prefix}${cht.cmd} https://github.com/adiwajshing/baileys.git`
        )
      );
    }
  );

  ev.on(
    {
      cmd: ['youtube', 'ytdl', 'youtubedl', 'youtubedownloader'],
      listmenu: ['youtube'],
      tag: 'downloader',
      badword: true,
      args: 'Harap sertakan url/judul videonya!',
    },
    async ({ args, urls }) => {
      let [url, _type] = args.split(' ');
      let type = _type?.toLowerCase();
      let auds = {
        mp3: 'ytmp3',
        m4a: 'ytm4a',
        audio: 'ytm4a',
        vn: 'playvn',
      };
      let videos = {
        mp4: 'ytmp4',
        video: 'ytmp4',
      };

      let audio = auds[type];
      let video = videos[type];
      console.log({ video, audio });
      if (!type) {
        memories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd} ${urls[0]}`,
          exp: Date.now() + 15000,
          accepts: [Object.keys(auds), Object.keys(videos)].flat(),
        });
        return cht.reply('audio/video?');
      }
      cht.cmd = audio || video;
      ev.emit(audio || video);
    }
  );
}
