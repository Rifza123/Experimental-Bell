/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const { generateWAMessageFromContent } = 'baileys'.import();

/*!-======[ Functions Imports ]======-!*/
const { musixSearch } = await (fol[2] + 'musixsearch.js').r();
const { transcribe } = await (fol[2] + 'transcribe.js').r();
const { tmpFiles } = await (fol[0] + 'tmpfiles.js').r();
const { catbox } = await (fol[0] + 'catbox.js').r();
const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r();
const { EncryptJs } = await (fol[2] + 'encrypt.js').r();
const { compressVideo, compressImage } = await './toolkit/ffmpeg.js'.r();
const { ensureConnected: ensureLivechart } = await (fol[2] + 'livechart.js').r();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  let infos = Data.infos;
  let { sender, id } = cht;
  const { func } = Exp;

  ev.on(
    {
      cmd: ['compress', 'kompres'],
      listmenu: ['compress'],
      tag: 'tools',
      energy: 10,
      media: {
        type: ['image', 'video'],
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      await cht.edit(infos.tools.compress.start, _key, true);
      const isVideo = !!(is?.video || is?.quoted?.video || cht.type === 'video');

      if (isVideo) {
        let lastEditTime = 0;
        let spinnerIndex = 0;

        try {
          const res = await compressVideo(media, async (progress) => {
            const now = Date.now();
            if (now - lastEditTime >= 5000) {
              lastEditTime = now;
              const sp = Data.spinner[spinnerIndex++ % Data.spinner.length];
              const formatTime = (sec) => {
                const m = Math.floor(sec / 60).toString().padStart(2, '0');
                const s = Math.floor(sec % 60).toString().padStart(2, '0');
                return `${m}:${s}`;
              };
              const remainingStr = progress.remainingSeconds > 60
                ? `${Math.floor(progress.remainingSeconds / 60)}m ${progress.remainingSeconds % 60}s`
                : `${progress.remainingSeconds}s`;
              const bar = func.progressBar(progress.percentage);
              const text = infos.tools.compress.progress(
                sp,
                progress.percentage,
                bar,
                formatTime(progress.processedSeconds),
                formatTime(progress.duration),
                progress.speed,
                remainingStr
              );
              await cht.edit(text, _key, true);
            }
          });

          const caption = infos.tools.compress.successVideo(
            func.formatBytes(res.originalSize),
            func.formatBytes(res.compressedSize),
            func.formatBytes(Math.abs(res.savedSize)),
            res.savedPercent,
            `${res.duration.toFixed(0)}s`
          );

          await Exp.sendMessage(
            id,
            { video: res.buffer, caption },
            { quoted: cht }
          );
        } catch (err) {
          console.error(err);
          await cht.reply(infos.tools.compress.failed);
        }
      } else {
        try {
          const res = await compressImage(media);
          const caption = infos.tools.compress.successImage(
            func.formatBytes(res.originalSize),
            func.formatBytes(res.compressedSize),
            func.formatBytes(Math.abs(res.savedSize)),
            res.savedPercent
          );

          await Exp.sendMessage(
            id,
            { image: res.buffer, caption },
            { quoted: cht }
          );
        } catch (err) {
          console.error(err);
          await cht.reply(infos.tools.compress.failed);
        }
      }
    }
  );

  ev.on(
    {
      cmd: ['remini', 'hd'],
      listmenu: ['remini', 'hd'],
      tag: 'tools',
      energy: 30,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      await cht.edit('Bntr...', _key);
      let tph = await TermaiCdn(await func.minimizeImage(media));
      await cht.edit('Processing...', _key);
      let res = (
        await fetch(
          api.xterm.url +
            '/api/tools/remini?url=' +
            tph +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      await Exp.sendMessage(
        id,
        { image: { url: res.url }, caption: `Response Time: ${res.run_Time}` },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['tmpfile', 'tmpfiles'],
      listmenu: ['tmpfiles'],
      tag: 'tools',
      energy: 5,
      media: {
        type: ['image', 'sticker', 'audio', 'video'],
      },
    },
    async ({ media }) => {
      let tmp = await tmpFiles(media);
      await cht.edit(tmp, keys[sender]);
    }
  );

  ev.on(
    {
      cmd: ['catbox'],
      listmenu: ['catbox'],
      tag: 'tools',
      energy: 5,
      media: {
        type: ['image', 'sticker', 'audio', 'video', 'document'],
      },
    },
    async ({ media }) => {
      let tmp = await catbox(media);
      await cht.edit(tmp, keys[sender]);
    }
  );
  ev.on(
    {
      cmd: ['tourl'],
      listmenu: ['tourl', 'termaicdn'],
      tag: 'tools',
      energy: 5,
      media: {
        type: ['image', 'sticker', 'audio', 'video', 'document'],
      },
    },
    async ({ media }) => {
      let tmp = await TermaiCdn(media);
      await cht.edit(tmp, keys[sender]);
    }
  );

  ev.on(
    {
      cmd: [
        'img2prompt',
        'tomprompt',
        'imgtoprompt',
        'imagetoprompt',
        'image2prompt',
      ],
      listmenu: ['img2prompt'],
      tag: 'tools',
      energy: 28,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      await cht.edit('Bntr...', keys[sender]);
      let tph = await TermaiCdn(await func.minimizeImage(media));
      let dsc = await fetch(
        `${api.xterm.url}/api/img2txt/instant-describe?url=${tph}&key=${api.xterm.key}`
      ).then((response) => response.json());
      cht.reply(dsc.prompt);
    }
  );
  ev.on(
    {
      cmd: ['enhance', 'upscale'],
      listmenu: ['enhance', 'enhance list'],
      tag: 'tools',
      energy: 35,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      let type = cht.q ? cht.q : 'stdx4';
      if (cht.q == 'list') return cht.reply(infos.tools.enhance);
      if (
        cht.q &&
        ![
          'phox2',
          'phox4',
          'anix2',
          'anix4',
          'stdx2',
          'stdx4',
          'cf',
          'text',
        ].includes(cht.q)
      )
        return cht.reply(
          'Type tidak ada! mungkin salah ketik!\n\n' + infos.tools.enhance
        );
      await cht.edit('Uploading image...', _key, true);
      let imgurl = await TermaiCdn(await func.minimizeImage(media));
      let ai = await fetch(
        `${api.xterm.url}/api/tools/enhance/createTask?url=${imgurl}&type=${type}&key=${api.xterm.key}`
      ).then((response) => response.json());

      if (!ai.status) return cht.reply(ai.cht);
      while (true) {
        try {
          let s = await fetch(
            `${api.xterm.url}/api/tools/enhance/taskStatus?id=${ai.id}`
          ).then((response) => response.json());
          if (!s.status)
            return cht.reply(`Status: ${s?.status}\nMessage: Failed!`);
          let pVal = parseFloat(s?.progress) || 0;
          await cht.edit(
            `Status: ${s?.status}\n> \`[${func.progressBar(pVal)}] ${s?.progress}%\``,
            _key,
            true
          );
          if (s.task_status == 'failed') {
            return cht.reply(s.task_status);
          }
          if (s.task_status == 'done') {
            await Exp.sendMessage(
              id,
              { image: { url: s.output } },
              { quoted: cht }
            );
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } catch (e) {
          await cht.reply('TypeErr:' + e.message);
          break;
        }
      }
    }
  );

  ev.on(
    {
      cmd: ['ss', 'ssweb'],
      listmenu: ['ssweb'],
      tag: 'tools',
      energy: 7.5,
      urls: {
        msg: true,
      },
    },
    async () => {
      let q = is.quoted?.url || is.url;
      Exp.sendMessage(
        id,
        {
          image: {
            url:
              'https://image.thum.io/get/width/1900/crop/1000/fullpage/' + q[0],
          },
          caption: `Result✔️`,
        },
        { quoted: cht.reaction || cht }
      );
    }
  );

  ev.on(
    {
      cmd: [
        'musixsearch',
        'searchmusic',
        'whatmusic',
        'searchsong',
        'musicrecognition',
      ],
      listmenu: ['whatmusic'],
      tag: 'tools',
      energy: 10,
      media: {
        type: ['audio'],
      },
    },
    async ({ media }) => {
      await cht.edit('Bntar tak dengerin dulu...', keys[sender]);
      musixSearch(media).then((a) => cht.reply(a));
    }
  );

  ev.on(
    {
      cmd: ['audio2text', 'audio2txt', 'transcribe'],
      listmenu: ['transcribe'],
      tag: 'tools',
      energy: 25,
      media: {
        type: ['audio'],
      },
    },
    async ({ media }) => {
      transcribe(media).then((a) => cht.reply(a.text));
    }
  );

  ev.on(
    {
      cmd: ['getchid', 'getchannelid', 'getsaluranid', 'getidsaluran'],
      listmenu: ['getchid'],
      tag: 'tools',
      energy: 10,
      args: 'Kirimkan link ch nya!',
      //isQuoted: 'Reply pesan yang diteruskan dari saluran!',
    },
    async ({ args }) => {
      try {
        /*
        let res = (await store.loadMessage(id, cht.quoted.stanzaId)).message[
          cht.quoted.type
        ].contextInfo.forwardedNewsletterMessageInfo;
        if (!res) return cht.reply('Gagal, id saluran mungkin tidak tersedia');
        cht.edit(
          `[ *📡ID SALURAN/CH* ]` +
            `\nID Saluran: ${res.newsletterJid}` +
            `\nID Pesan: ${res.serverMessageId}`,
          keys[sender]
        );
        */

        let _id = args.match(/channel\/([^\/]+)/)?.[1];
        let d = await Exp.newsletterMetadata('invite', _id);

        let meta = d?.thread_metadata || {};

        let name = meta?.name?.text || '-';
        let desc = meta?.description?.text || '-';
        let subs = meta?.subscribers_count || '0';
        let verif =
          meta?.verification === 'VERIFIED'
            ? '✔️ Terverifikasi'
            : 'Tidak terverifikasi';
        let invite = meta?.invite || '-';
        let handle = meta?.handle || '-';
        let reaction = meta?.settings?.reaction_codes?.value || '-';
        let created = meta?.creation_time
          ? new Date(Number(meta.creation_time) * 1000).toLocaleString('id-ID')
          : '-';

        let text = `🆔 ID: ${d?.id || '-'}
📝 Nama: ${name}
🔖 Status: ${verif}
👥 Pengikut: ${subs}

🔗 Invite Code: ${invite}
#️⃣ Handle: ${handle}
💬 Reaction Setting: ${reaction}
⏱ Dibuat Pada: ${created}

📄 Deskripsi:
${desc}
`;

        let imageMessage = null;
        if (meta.preview?.direct_path) {
          imageMessage = await func
            .uploadToServer(
              'https://mmg.whatsapp.net' + meta.preview.direct_path
            )
            .catch(() => null);
        }
        if (!imageMessage) {
          imageMessage = await func
            .uploadToServer(fol[3] + 'bell.jpg')
            .catch(() => null);
        }

        if (cfg.button && imageMessage) {
          let _m = {
            interactiveMessage: {
              header: {
                title: '',
                imageMessage,
                hasMediaAttachment: true,
              },
              body: {
                text: '📡 Informasi Channel'.font('bold'),
              },
              footer: {
                text,
              },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'cta_copy',
                    buttonParamsJson: {
                      display_text: name,
                      id: 'bahlil',
                      copy_code: d?.id,
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
        if (keys[sender]) {
          await cht.edit('📡 Informasi Channel\n\n' + text, keys[sender]);
        } else {
          await cht.reply('📡 Informasi Channel\n\n' + text);
        }
      } catch (e) {
        cht.reply('Error get Channel id' + e.message);
      }
    }
  );

  ev.on(
    {
      cmd: ['colong', 'c'],
      listmenu: ['colong'],
      tag: 'tools',
      premium: true,
      isQuoted:
        'Reply pesan yang ingin anda colong(pesan button, sticker, document, atau pesan apaapun itu)!',
    },
    async ({ cht }) => {
      try {
        if (!cht.quoted) return;
        let res = ((await store.loadMessage(cht.id, cht.quoted.stanzaId)) || {})
          ?.message;
        if (!res)
          return cht.reply(
            'Pesan tersebut tidak ada dalam store!, pesan tersebut mungkin di kirimkan sebelum bot di restart'
          );
        let evaled = `Exp.relayMessage(cht.id, ${JSON.stringify(res, null, 2)}, {})`;

        let random = Math.floor(Math.random() * 10000);
        await eval(`ev.on({ 
             cmd: ['${random}'],
             listmenu: ['${random}'],
             tag: 'other'
         }, async({ cht }) => {
             ${evaled}
         })`);
        await sleep(3000);
        await cht.reply(
          `Code telah dikirimkan melalui chat pribadi!. Ketik .${random} Untuk melihat hasil`
        );
        await sleep(3000);
        await Exp.sendMessage(sender, { text: evaled }, { quoted: cht });
      } catch (e) {
        console.log(cht.quoted);
      }
    }
  );

  ev.on(
    {
      cmd: ['vocalremover', 'stems'],
      listmenu: ['vocalremover'],
      tag: 'tools',
      energy: 50,
      media: {
        type: ['audio'],
        msg: 'Mana audionya?',
      },
    },
    async ({ media }) => {
      await cht.edit('Tunggu ya, sabar', keys[sender]);
      let response = await fetch(
        `${api.xterm.url}/api/audioProcessing/stems?key=${api.xterm.key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          body: media,
        }
      );
      let a = (await response.json()).data;
      await Exp.sendMessage(
        id,
        { audio: { url: a[0].link }, mimetype: 'audio/mpeg' },
        { quoted: cht }
      );
      await Exp.sendMessage(
        id,
        { audio: { url: a[1].link }, mimetype: 'audio/mpeg' },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['enc', 'encryptjs', 'encrypt'],
      listmenu: ['encryptjs'],
      tag: 'tools',
      args: 'Mana code js nya?',
      energy: 2,
    },
    async () => {
      let res = await EncryptJs(cht.q);
      Exp.sendMessage(
        cht.id,
        {
          document: Buffer.from(res.data),
          mimetype: 'application/javascript',
          fileName: 'encrypt.js',
        },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['removebg'],
      listmenu: ['removebg'],
      tag: 'tools',
      energy: 15,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      await cht.edit('Bntr...', _key);
      let tph = await TermaiCdn(await func.minimizeImage(media));
      await cht.edit('Processing...', _key);
      let res = (
        await fetch(
          api.xterm.url +
            '/api/tools/image-removebg?url=' +
            tph +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json())
      ).data;
      await Exp.sendMessage(id, { image: { url: res.url } }, { quoted: cht });
    }
  );

  ev.on(
    {
      cmd: ['objectdetection'],
      listmenu: ['objectdetection'],
      tag: 'tools',
      energy: 15,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      await cht.edit('Bntr...', _key);
      let tph = await TermaiCdn(await func.minimizeImage(media));
      await cht.edit('Processing...', _key);
      let res = await fetch(
        api.xterm.url +
          '/api/tools/object-detection?url=' +
          tph +
          '&key=' +
          api.xterm.key
      ).then((a) => a.json());
      let result = `Status: ${res.status}\n`;
      result += `Image URL: ${res.url}\n\n`;

      res.DetectedObjects.forEach((object, index) => {
        result += `Object ${index + 1}:\n`;
        result += `  Label  : ${object.Label}\n`;
        result += `  Score  : ${(object.Score * 100).toFixed(2)}%\n`;
        result += `  Bounds :\n`;
        result += `    X     : ${object.Bounds.X}\n`;
        result += `    Y     : ${object.Bounds.Y}\n`;
        result += `    Width : ${object.Bounds.Width}\n`;
        result += `    Height: ${object.Bounds.Height}\n\n`;
      });
      await Exp.sendMessage(
        id,
        { image: { url: res.url }, caption: result },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['hextorgba', 'rgbatohex', 'change'],
      listmenu: ['hextorgba', 'rgbatohex'],
      tag: 'tools',
      args: 'Sertakan rgba atau hex untuk di konversi?',
      energy: 2,
    },
    async ({ args }) => {
      let [r, g, b, a] = args.match(/\((.*?)\)/)[1].split(',');
      if (/rgb/.test(args)) return cht.reply(func.rgbaToHex(r, g, b, a));
      func.hexToRgba(args);
    }
  );

  ev.on(
    {
      cmd: ['rch'],
      listmenu: ['rch'],
      tag: 'tools',
      energy: 110,
      args: 'Kirimkan link pesan channelnya!',
      premium: true,
      urls: {
        formats: ['https://whatsapp.com/channel/'],
        msg: true,
      },
    },
    async ({ args, cht, urls }) => {
      try {
        const url = new URL(urls[0]);
        const [, , _id, server_id] = url.pathname.split('/');
        let d = await Exp.newsletterMetadata('invite', _id);
        const reaction = args.match(
          /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu
        ) || ['😂', '😢', '👍', '😯', '🙏', '❤️'];

        let newsletterId = d.id;
        if (typeof ensureLivechart === 'function') {
          await ensureLivechart(5000);
        }
        cht.reply(
          (
            await {
              newsletterId,
              server_id,
              reaction,
            }.newsletterReact()
          ).String()
        );
      } catch (e) {
        console.error(e);
        cht.reply('❌ Terjadi error melakukan react.');
      }
    }
  );
  ev.on(
    {
      cmd: ['sitekey', 'getsitekey', 'sitekeyfinder'],
      listmenu: ['sitekey'],
      tag: 'tools',
      energy: 15,
      urls: {
        msg: true,
      },
    },
    async () => {
      let q = is.quoted?.url || is.url;
      let targetUrl = q[0];
      await cht.edit('🔍 Scanning sitekey...', keys[sender]);
      let res = await fetch(
        `${api.xterm.url}/api/tools/sitekey_finder?key=${api.xterm.key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: targetUrl }),
        }
      ).then((a) => a.json());
      if (res.status && res.data) {
        cht.reply(infos.tools.sitekey.result(res.data, res.details || {}));
      } else if (res.details && res.msg?.includes('busy')) {
        cht.reply(infos.tools.sitekey.busy);
      } else {
        cht.reply(infos.tools.sitekey.notFound(res.details || {}));
      }
    }
  );
}
