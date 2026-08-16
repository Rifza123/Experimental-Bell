/*!-======[ Function Import ]======-!*/
let exif = await (fol[0] + 'exif.js').r();
let { convert } = exif;

const { tmpFiles } = await (fol[0] + 'tmpfiles.js').r();
const { processMedia } = await './toolkit/ffmpeg.js'.r();
const fs = await 'fs'.import();
const path = await 'path'.import();

function normalizeArgs(args) {
  if (!args) return [];
  args = args.trim();
  if (args.startsWith('[') && args.endsWith(']')) {
    try {
      return JSON.parse(args);
    } catch {}
  }
  let parts = args.split(/\s+/);
  let fixed = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '-af') {
      let chain = [];
      chain.push(parts[i]);
      i++;
      while (i < parts.length && !parts[i].startsWith('-')) {
        chain.push(parts[i]);
        i++;
      }
      fixed.push(chain.join(' '));
      i--;
      continue;
    }
    fixed.push(parts[i]);
  }
  return fixed;
}

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  const { id } = cht;
  const { func } = Exp;

  if (!cfg.menu.tags.converter) cfg.menu.tags.converter = '*<🔀 Converter>*';

  ev.on(
    {
      cmd: ['toimage', 'toimg'],
      listmenu: ['toimg'],
      tag: 'converter',
      energy: 4,
      media: {
        type: ['sticker'],
        etc: {
          //isNoAnimated:true
        },
      },
    },
    async ({ media }) => {
      Exp.sendMessage(id, { image: media }, { quoted: cht });
    }
  );

  ev.on(
    {
      cmd: ['tomp4', 'tovideo', 'togif'],
      listmenu: ['tomp4', 'tovideo', 'togif'],
      tag: 'converter',
      energy: 10,
      media: {
        type: ['sticker', 'video'],
        etc: {
          isAnimated: true,
        },
      },
    },
    async ({ media }) => {
      let res = await tmpFiles(media);
      let url =
        cht.type == 'video'
          ? res
          : await convert({
              url: res,
              from: 'webp',
              to: 'mp4',
            });
      console.log(cht.cmd, url);
      Exp.sendMessage(
        id,
        { video: { url }, gifPlayback: cht.cmd == 'togif' },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['webp2jpg', 'webptojpg', 'webp2png', 'webptopng'],
      listmenu: ['webp2jpg', 'webp2png'],
      tag: 'converter',
      energy: 10,
      media: {
        type: ['sticker', 'image'],
      },
    },
    async ({ media }) => {
      try {
        let res = await tmpFiles(media);
        let url = await convert({
          url: res,
          from: 'webp',
          to: cht.cmd.includes('jpg') ? 'jpg' : 'png',
        });
        Exp.sendMessage(id, { image: { url } }, { quoted: cht });
      } catch (e) {
        console.error(e);
        cht.reply('Failed!');
      }
    }
  );

  ev.on(
    {
      cmd: ['tomp3', 'toaudio', 'tovn'],
      listmenu: ['tomp3'],
      tag: 'converter',
      energy: 1,
      media: {
        type: ['video', 'audio'],
      },
    },
    async ({ media: audio }) => {
      Exp.sendMessage(
        id,
        { audio, mimetype: 'audio/mpeg', ptt: cht.cmd == 'tovn' },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: [
        'reverse',
        'bass',
        'volume',
        'slow',
        'fast',
        'reverb',
        'slowedreverb',
        'deep',
        'nightcore',
        'vaporwave',
        'chipmunk',
        'chorus',
        'flanger',
        'tremolo',
        'normalize',
        'echo',
      ],
      listmenu: [
        'reverse',
        'bass',
        'volume',
        'slow',
        'fast',
        'reverb',
        'slowedreverb',
        'deep',
        'nightcore',
        'vaporwave',
        'chipmunk',
        'chorus',
        'flanger',
        'tremolo',
        'normalize',
        'echo',
      ],
      tag: 'converter',
      energy: 5,
      media: { type: ['audio'] },
    },
    async ({ args, cht }) => {
      const audioPresets = {
        reverse: {
          a: () => '-af areverse -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame',
          b: false,
        },
        bass: {
          a: (g = 20) => `-af equalizer=f=94:width_type=o:width=2:g=${g}`,
          b: 'Gunakan: .bass [gain]\nContoh: `.bass 30`\nSemakin besar gain, semakin kuat bass.',
        },
        volume: {
          a: (mult = 2.0) =>
            `-af volume=${mult} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: 'Gunakan: .volume [angka]\nContoh: `.volume 3`\nAngka 1 = normal, 2 = 2x lebih keras.',
        },
        slow: {
          a: (tempo = 0.7) =>
            `-af atempo=${tempo} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: 'Gunakan: .slow [tempo]\nContoh: `.slow 0.5`\nNilai < 1 = lebih lambat, default 0.7.',
        },
        fast: {
          a: (tempo = 1.5) =>
            `-af atempo=${tempo} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: 'Gunakan: .fast [tempo]\nContoh: `.fast 2`\nNilai > 1 = lebih cepat, default 1.5.',
        },
        reverb: {
          a: (inGain = 0.8, outGain = 0.9, delay = 1000, decay = 0.3) =>
            `-af aecho=${inGain}:${outGain}:${delay}:${decay} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: `Gunakan: .reverb [inGain] [outGain] [delay(ms)] [decay]

Echo = satu atau beberapa pantulan yang jelas terdengar (kayak “halo… halo…”)
📌 Parameter:
- inGain  = seberapa keras suara asli (0.0 - 1.0, default 0.8)
- outGain = seberapa keras echo dibanding suara asli (0.0 - 1.0, default 0.9)
- delay   = jeda echo dalam milidetik (contoh: 1000 = 1 detik)
- decay   = seberapa cepat echo hilang (0.0 - 1.0, semakin kecil makin cepat hilang)

📝 Contoh:
.reverb 0.8 0.9 1000 0.3   → echo normal, delay 1 detik
.reverb 0.6 0.7 800 0.25  → echo lebih pelan & cepat hilang
.reverb 1 1 1500 0.9      → echo keras banget & panjang`,
        },

        slowedreverb: {
          a: (
            tempo = 0.85,
            inGain = 0.8,
            outGain = 0.9,
            delay = 1000,
            decay = 0.3
          ) =>
            `-af atempo=${tempo},aecho=${inGain}:${outGain}:${delay}:${decay} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: `Gunakan: .slowedreverb [tempo] [inGain] [outGain] [delay(ms)] [decay]

Echo = satu atau beberapa pantulan yang jelas terdengar (kayak “halo… halo…”)
📌 Parameter:
- tempo   = kecepatan audio (default 0.85, <1 lebih lambat, >1 lebih cepat)
- inGain  = seberapa keras suara asli (0.0 - 1.0)
- outGain = seberapa keras echo dibanding suara asli (0.0 - 1.0)
- delay   = jeda echo dalam ms
- decay   = seberapa cepat echo hilang

📝 Contoh:
.slowedreverb 0.85 0.8 0.9 1000 0.3  → slow + echo normal
.slowedreverb 0.7 0.6 0.7 800 0.25  → lebih lambat, echo cepat hilang
.slowedreverb 0.9 1 1 1500 0.8     → agak cepat, echo panjang & keras`,
        },
        deep: {
          a: (rate = 0.8) =>
            `-af asetrate=44100*${rate},aresample=44100,atempo=1 -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: `Gunakan: .deep [rate]
Contoh: .deep 0.8
Semakin kecil rate → suara makin berat dan dalam.`,
        },

        nightcore: {
          a: (tempo = 1.25) =>
            `-af asetrate=44100*1.25,aresample=44100,atempo=${tempo} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: `Gunakan: .nightcore [tempo]
Contoh: .nightcore 1.25
Pitch naik + tempo cepat → efek nightcore.`,
        },

        vaporwave: {
          a: (tempo = 0.85) =>
            `-af asetrate=44100*0.85,aresample=44100,atempo=${tempo} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: `Gunakan: .vaporwave [tempo]
Contoh: .vaporwave 0.85
Pitch turun + tempo lambat → efek chill/vaporwave.`,
        },

        chipmunk: {
          a: (tempo = 1.4) =>
            `-af asetrate=44100*1.5,aresample=44100,atempo=${tempo} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: `Gunakan: .chipmunk [tempo]
Contoh: .chipmunk 1.4
Nada tinggi + cepat → efek suara tupai/chipmunk.`,
        },

        chorus: {
          a: () =>
            `-af chorus=0.7:0.9:55:0.4:0.25:2 -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: false,
        },

        flanger: {
          a: () => `-af flanger -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: false,
        },

        tremolo: {
          a: (freq = 5, depth = 0.7) =>
            `-af tremolo=f=${freq}:d=${depth} -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: `Gunakan: .tremolo [freq] [depth]
Contoh: .tremolo 5 0.7
Volume bergetar, freq=kecepatan getar, depth=kedalaman.`,
        },

        normalize: {
          a: () => `-af loudnorm -ar 44100 -ac 2 -b:a 128k -codec:a libmp3lame`,
          b: false,
        },
      };
      const { a, b } = audioPresets[cht.cmd] || {};

      if (!args && b) return cht.reply(b);
      if (!a) return;
      args = args.split(' ').map((x) => {
        return x.includes('.') ? parseFloat(x) : parseInt(x);
      });

      ev.emit('ffmpeg', { args: a(...args) });
    }
  );

  ev.on(
    {
      cmd: ['ffmpeg'],
      media: {
        type: ['audio', 'video', 'sticker', 'image'],
      },
    },
    async ({ media, args }) => {
      try {
        let output = args?.split('--output=')?.[1]?.split(' ')?.[0];
        let { quoted, type: mtype } = ev.getMediaType();
        let type =
          mtype == 'sticker'
            ? 'webp'
            : mtype == 'image'
              ? 'png'
              : mtype == 'video'
                ? 'mp4'
                : 'mp3';

        const res = await processMedia(
          media,
          normalizeArgs(output ? args.replace('--output=' + output, '') : args),
          output || type
        );
        let mediaPayload = Buffer.isBuffer(res)
          ? res
          : (typeof res === 'string' ? { url: path.resolve(res) } : res);
        const sentMsg = await Exp.sendMessage(
          cht.id,
          {
            [mtype]: mediaPayload,
            ...(mtype !== 'audio' ? {} : { mimetype: 'audio/mpeg' }),
          },
          { quoted: cht }
        );
        if (typeof res === 'string') {
          const fp = path.resolve(res);
          if (fs.existsSync(fp)) {
            try { fs.unlinkSync(fp); } catch (e) {}
          }
        }
        return sentMsg;
      } catch (e) {
        cht.reply(String(e));
      }
    }
  );

  ev.on(
    {
      cmd: ['fixvideo', 'recodevideo'],
      listmenu: ['fixvideo'],
      tag: 'converter',
      energy: 5,
    },
    async ({ media }) => {
      try {
        if (cht?.quoted?.stanzaId) {
          let qCmds = Exp.func.archiveMemories.getItem(cht.sender, 'quotedQuestionCmd') || {};
          delete qCmds[cht.quoted.stanzaId];
          Exp.func.archiveMemories.setItem(cht.sender, 'quotedQuestionCmd', qCmds);
        }

        const startTime = Date.now();

        const renderProgressBar = (percent, length = 15) => {
          const p = Math.max(0, Math.min(100, percent || 0));
          const filled = Math.round((p / 100) * length);
          const empty = length - filled;
          const bar = '█'.repeat(filled) + '░'.repeat(empty);
          return `[${bar}] ${p.toFixed(2)}%`;
        };

        const buildStatusText = (percent) => {
          const bar = renderProgressBar(percent);
          if (!percent || percent <= 0) {
            return `⏱️ Memperoleh & memproses konversi ulang video H.264...\n\n${bar}\n\n> Estimasi sisa waktu: Menghitung...\n> Perkiraan selesai: Menghitung...`;
          }
          const elapsedMs = Date.now() - startTime;
          const estimatedTotalMs = (elapsedMs / percent) * 100;
          const targetCompletionTime = startTime + estimatedTotalMs;
          const etaMs = Math.max(0, Math.ceil(targetCompletionTime - Date.now()));

          const etaStr = Exp.func.parseMs ? Exp.func.parseMs(etaMs) : Math.ceil(etaMs / 1000) + 's';
          const fullDateStr = Exp.func.dateFormatter ? Exp.func.dateFormatter(targetCompletionTime, 'Asia/Jakarta') : '';
          const timeStr = fullDateStr ? (fullDateStr.split(' ')[1] || fullDateStr) + ' WIB' : 'sebentar lagi';

          return `⏱️ Memperoleh & memproses konversi ulang video H.264...\n\n${bar}\n\n> Estimasi sisa waktu: ${etaStr}\n> Perkiraan selesai: pukul ${timeStr}`;
        };

        const statusMsg = await cht.reply(
          buildStatusText(0),
          { replyAi: false }
        );

        let videoBuf = media || (await cht.quoted?.download?.().catch(() => null));
        if (!videoBuf) return cht.reply('❌ Balas video yang tidak dapat diputar dengan mengetik .fixvideo!');

        let lastUpdate = Date.now();
        let nextInterval = Math.floor(Math.random() * 2000) + 3000;

        const onProgress = async (percent) => {
          const now = Date.now();
          if (now - lastUpdate >= nextInterval) {
            lastUpdate = now;
            nextInterval = Math.floor(Math.random() * 2000) + 3000;
            if (statusMsg?.key) {
              Exp.sendMessage(cht.id, {
                text: buildStatusText(percent),
                edit: statusMsg.key,
              }).catch(() => {});
            }
          }
        };

        const res = await processMedia(
          videoBuf,
          ['-c:v', 'libx264', '-c:a', 'aac', '-threads', '1'],
          'mp4',
          null,
          onProgress
        );

        if (statusMsg?.key) {
          Exp.sendMessage(cht.id, {
            text: `⏱️ Memperoleh & memproses konversi ulang video H.264...\n\n${renderProgressBar(100)}\n\n> Selesai diproses!`,
            edit: statusMsg.key,
          }).catch(() => {});
        }

        return Exp.sendMessage(
          cht.id,
          {
            video: res,
            mimetype: 'video/mp4',
            caption: '✅ Video berhasil dikonversi ulang ke H.264/AAC MP4!',
          },
          { quoted: cht }
        );
      } catch (e) {
        cht.reply('❌ Gagal mengonversi video: ' + String(e));
      }
    }
  );
}
