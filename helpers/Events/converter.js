/*!-======[ Function Import ]======-!*/
let exif = await (fol[0] + 'exif.js').r();
let { convert } = exif;

const { tmpFiles } = await (fol[0] + 'tmpfiles.js').r();
const { processMedia, burikVideo, process16D, concatVideos, concatAudios } = await './toolkit/ffmpeg.js'.r();
const fs = await 'fs'.import();
const path = await 'path'.import();

function normalizeArgs(args) {
  if (!args) return [];
  if (Array.isArray(args)) return args;
  args = args.trim();
  if (args.startsWith('[') && args.endsWith(']')) {
    try {
      return JSON.parse(args);
    } catch {}
  }
  let parts = args.split(/\s+/);
  let fixed = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === '-af' || parts[i] === '-vf') {
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
  const { id, sender } = cht;
  const { func } = Exp;
  let infos = Data.infos;

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
      cmd: ['burik', 'burikkan'],
      listmenu: ['burik', 'burikkan'],
      tag: 'converter',
    },
    async ({ args }) => {
      let { type: mediaType } = ev.getMediaType();
      if (!['image', 'sticker', 'video'].includes(mediaType)) {
        return cht.reply('Balas atau kirim gambar, stiker, atau video dengan perintah .burik');
      }
      let width = parseInt(args || cht.q) || (mediaType === 'video' ? 96 : 50);
      ev.emit(mediaType === 'video' ? 'burik_video' : 'burik_image', {
        args: String(width),
      });
    }
  );

  ev.on(
    {
      cmd: ['burik_image'],
      energy: 1,
      media: {
        type: ['image', 'sticker'],
      },
    },
    async ({ media, args, cht }) => {
      try {
        let width = parseInt(args || cht.q) || 50;
        let res = await func.minimizeImage(media, {
          width,
        });
        Exp.sendMessage(cht.id, { image: res }, { quoted: cht });
      } catch (e) {
        console.error(e);
        await func.archiveMemories.addEnergy(cht.sender, 1);
        let msg = Data.infos?.tools?.burik?.refund ? Data.infos.tools.burik.refund(1) : (Data.infos?.tools?.burik?.failed || 'Failed!');
        cht.reply(msg);
      }
    }
  );

  ev.on(
    {
      cmd: ['burik_video'],
      energy: 10,
      media: {
        type: ['video'],
        etc: {
          seconds: 20,
        },
      },
    },
    async ({ media, args, cht }) => {
      try {
        let _key = keys[cht.sender];
        await cht.edit(Data.infos?.tools?.burik?.wait || '⏳ Memproses media burik...', _key, true);
        let width = parseInt(args || cht.q) || 96;
        let res = await burikVideo(media, { width });
        let caption = Data.infos?.tools?.burik?.success ? Data.infos.tools.burik.success(width) : `📉 *Media Burik* (${width}px)`;
        await Exp.sendMessage(cht.id, { video: res, caption }, { quoted: cht });
      } catch (e) {
        console.error(e);
        await func.archiveMemories.addEnergy(cht.sender, 10);
        let msg = Data.infos?.tools?.burik?.refund ? Data.infos.tools.burik.refund(10) : (Data.infos?.tools?.burik?.failed || 'Failed!');
        cht.reply(msg);
      }
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
        'stereo',
        'left',
        'right',
        '8d',
        'kirikanan',
        'bathroom',
        'bedroom',
        'hall',
        'jbl',
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
        'stereo',
        'left',
        'right',
        '8d',
        'kirikanan',
        'bathroom',
        'bedroom',
        'hall',
        'jbl',
      ],
      tag: 'converter',
      energy: 5,
      media: {
        type: ['audio', 'video'],
        etc: {
          seconds: 300,
        },
      },
    },
    async ({ args, cht }) => {
      let { type: mtype } = ev.getMediaType();
      let isVideo = mtype === 'video';
      const audioPresets = {
        reverse: {
          a: (isVideo) =>
            isVideo
              ? ['-vf', 'reverse', '-vcodec', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-af', 'areverse', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'areverse', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },
        bass: {
          a: (isVideo, g = 20) =>
            isVideo
              ? ['-c:v', 'copy', '-af', `equalizer=f=94:width_type=o:width=2:g=${g}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `equalizer=f=94:width_type=o:width=2:g=${g}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: 'Gunakan: .bass [gain]\nContoh: `.bass 30`\nSemakin besar gain, semakin kuat bass.',
        },
        volume: {
          a: (isVideo, mult = 2.0) =>
            isVideo
              ? ['-c:v', 'copy', '-af', `volume=${mult}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `volume=${mult}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: 'Gunakan: .volume [angka]\nContoh: `.volume 3`\nAngka 1 = normal, 2 = 2x lebih keras.',
        },
        slow: {
          a: (isVideo, tempo = 0.7) =>
            isVideo
              ? ['-vf', `setpts=${(1 / tempo).toFixed(4)}*PTS`, '-vcodec', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-af', `atempo=${tempo}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `atempo=${tempo}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: 'Gunakan: .slow [tempo]\nContoh: `.slow 0.5`\nNilai < 1 = lebih lambat, default 0.7.',
        },
        fast: {
          a: (isVideo, tempo = 1.5) =>
            isVideo
              ? ['-vf', `setpts=${(1 / tempo).toFixed(4)}*PTS`, '-vcodec', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-af', `atempo=${tempo}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `atempo=${tempo}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: 'Gunakan: .fast [tempo]\nContoh: `.fast 2`\nNilai > 1 = lebih cepat, default 1.5.',
        },
        reverb: {
          a: (isVideo, inGain = 0.8, outGain = 0.9, delay = 1000, decay = 0.3) =>
            isVideo
              ? ['-c:v', 'copy', '-af', `aecho=${inGain}:${outGain}:${delay}:${decay}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `aecho=${inGain}:${outGain}:${delay}:${decay}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
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
            isVideo,
            tempo = 0.85,
            inGain = 0.8,
            outGain = 0.9,
            delay = 1000,
            decay = 0.3
          ) =>
            isVideo
              ? ['-vf', `setpts=${(1 / tempo).toFixed(4)}*PTS`, '-vcodec', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-af', `atempo=${tempo},aecho=${inGain}:${outGain}:${delay}:${decay}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `atempo=${tempo},aecho=${inGain}:${outGain}:${delay}:${decay}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
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
          a: (isVideo, rate = 0.8) =>
            isVideo
              ? ['-vf', `setpts=${(1 / rate).toFixed(4)}*PTS`, '-vcodec', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-af', `asetrate=44100*${rate},aresample=44100,atempo=1`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `asetrate=44100*${rate},aresample=44100,atempo=1`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: `Gunakan: .deep [rate]
Contoh: .deep 0.8
Semakin kecil rate → suara makin berat dan dalam.`,
        },

        nightcore: {
          a: (isVideo, tempo = 1.25) =>
            isVideo
              ? ['-vf', `setpts=${(1 / (1.25 * tempo)).toFixed(4)}*PTS`, '-vcodec', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-af', `asetrate=44100*1.25,aresample=44100,atempo=${tempo}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `asetrate=44100*1.25,aresample=44100,atempo=${tempo}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: `Gunakan: .nightcore [tempo]
Contoh: .nightcore 1.25
Pitch naik + tempo cepat → efek nightcore.`,
        },

        vaporwave: {
          a: (isVideo, tempo = 0.85) =>
            isVideo
              ? ['-vf', `setpts=${(1 / (0.85 * tempo)).toFixed(4)}*PTS`, '-vcodec', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-af', `asetrate=44100*0.85,aresample=44100,atempo=${tempo}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `asetrate=44100*0.85,aresample=44100,atempo=${tempo}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: `Gunakan: .vaporwave [tempo]
Contoh: .vaporwave 0.85
Pitch turun + tempo lambat → efek chill/vaporwave.`,
        },

        chipmunk: {
          a: (isVideo, tempo = 1.4) =>
            isVideo
              ? ['-vf', `setpts=${(1 / (1.5 * tempo)).toFixed(4)}*PTS`, '-vcodec', 'libx264', '-preset', 'ultrafast', '-crf', '26', '-af', `asetrate=44100*1.5,aresample=44100,atempo=${tempo}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `asetrate=44100*1.5,aresample=44100,atempo=${tempo}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: `Gunakan: .chipmunk [tempo]
Contoh: .chipmunk 1.4
Nada tinggi + cepat → efek suara tupai/chipmunk.`,
        },

        chorus: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'chorus=0.7:0.9:55:0.4:0.25:2', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'chorus=0.7:0.9:55:0.4:0.25:2', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        flanger: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'flanger', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'flanger', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        tremolo: {
          a: (isVideo, freq = 5, depth = 0.7) =>
            isVideo
              ? ['-c:v', 'copy', '-af', `tremolo=f=${freq}:d=${depth}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `tremolo=f=${freq}:d=${depth}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: `Gunakan: .tremolo [freq] [depth]
Contoh: .tremolo 5 0.7
Volume bergetar, freq=kecepatan getar, depth=kedalaman.`,
        },

        normalize: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'loudnorm', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'loudnorm', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        echo: {
          a: (isVideo, inGain = 0.8, outGain = 0.9, delay = 1000, decay = 0.3) =>
            isVideo
              ? ['-c:v', 'copy', '-af', `aecho=${inGain}:${outGain}:${delay}:${decay}`, '-c:a', 'aac', '-b:a', '128k']
              : ['-af', `aecho=${inGain}:${outGain}:${delay}:${decay}`, '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: `Gunakan: .echo [inGain] [outGain] [delay(ms)] [decay]
Contoh: .echo 0.8 0.9 1000 0.3`,
        },

        stereo: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'extrastereo=m=2.5', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'extrastereo=m=2.5', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        left: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'aformat=channel_layouts=stereo,pan=stereo|c0=0*c0|c1=c1', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'aformat=channel_layouts=stereo,pan=stereo|c0=0*c0|c1=c1', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        right: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'aformat=channel_layouts=stereo,pan=stereo|c0=c0|c1=0*c1', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'aformat=channel_layouts=stereo,pan=stereo|c0=c0|c1=0*c1', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        '8d': {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'apulsator=hz=0.125', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'apulsator=hz=0.125', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        kirikanan: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'apulsator=hz=0.125', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'apulsator=hz=0.125', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        bathroom: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'aecho=0.8:0.9:40|60:0.5|0.4,highpass=f=200,lowpass=f=8000', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'aecho=0.8:0.9:40|60:0.5|0.4,highpass=f=200,lowpass=f=8000', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        bedroom: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'aecho=0.6:0.7:25|40:0.3|0.25,highpass=f=150,lowpass=f=9000', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'aecho=0.6:0.7:25|40:0.3|0.25,highpass=f=150,lowpass=f=9000', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        hall: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'aecho=0.8:0.9:800|1200:0.4|0.3,highpass=f=100', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'aecho=0.8:0.9:800|1200:0.4|0.3,highpass=f=100', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },

        jbl: {
          a: (isVideo) =>
            isVideo
              ? ['-c:v', 'copy', '-af', 'equalizer=f=45:width_type=o:width=2:g=15,equalizer=f=80:width_type=o:width=2:g=8,equalizer=f=120:width_type=o:width=2:g=5,equalizer=f=250:width_type=o:width=2:g=2,equalizer=f=3000:width_type=o:width=2:g=-5,equalizer=f=6000:width_type=o:width=2:g=-4,equalizer=f=9000:width_type=o:width=2:g=-3,volume=2.2,acompressor=threshold=-18dB:ratio=2,alimiter=limit=0.93', '-c:a', 'aac', '-b:a', '128k']
              : ['-af', 'equalizer=f=45:width_type=o:width=2:g=15,equalizer=f=80:width_type=o:width=2:g=8,equalizer=f=120:width_type=o:width=2:g=5,equalizer=f=250:width_type=o:width=2:g=2,equalizer=f=3000:width_type=o:width=2:g=-5,equalizer=f=6000:width_type=o:width=2:g=-4,equalizer=f=9000:width_type=o:width=2:g=-3,volume=2.2,acompressor=threshold=-18dB:ratio=2,alimiter=limit=0.93', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-codec:a', 'libmp3lame'],
          b: false,
        },
      };
      const { a, b } = audioPresets[cht.cmd] || {};

      if (!args && b) return cht.reply(b);
      if (!a) return;
      let parsedArgs = typeof args === 'string' && args
        ? args.split(' ').map((x) => (x.includes('.') ? parseFloat(x) : parseInt(x)))
        : Array.isArray(args)
          ? args
          : [];

      ev.emit('ffmpeg', { args: a(isVideo, ...parsedArgs) });
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
        let output = null;
        let finalArgs = args;
        if (Array.isArray(args)) {
          let outIdx = args.findIndex((x) => typeof x === 'string' && x.startsWith('--output='));
          if (outIdx !== -1) {
            output = args[outIdx].split('=')[1];
            finalArgs = args.filter((_, i) => i !== outIdx);
          }
        } else if (typeof args === 'string') {
          output = args.split('--output=')?.[1]?.split(' ')?.[0];
          finalArgs = output ? args.replace('--output=' + output, '') : args;
        }
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
          normalizeArgs(finalArgs),
          output || type
        );
        let mediaPayload = Buffer.isBuffer(res)
          ? res
          : typeof res === 'string'
            ? { url: path.resolve(res) }
            : res;
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
            try {
              fs.unlinkSync(fp);
            } catch (e) {}
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
          let qCmds =
            Exp.func.archiveMemories.getItem(cht.sender, 'quotedQuestionCmd') ||
            {};
          delete qCmds[cht.quoted.stanzaId];
          Exp.func.archiveMemories.setItem(
            cht.sender,
            'quotedQuestionCmd',
            qCmds
          );
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
          const etaMs = Math.max(
            0,
            Math.ceil(targetCompletionTime - Date.now())
          );

          const etaStr = Exp.func.parseMs
            ? Exp.func.parseMs(etaMs)
            : Math.ceil(etaMs / 1000) + 's';
          const fullDateStr = Exp.func.dateFormatter
            ? Exp.func.dateFormatter(targetCompletionTime, 'Asia/Jakarta')
            : '';
          const timeStr = fullDateStr
            ? (fullDateStr.split(' ')[1] || fullDateStr) + ' WIB'
            : 'sebentar lagi';

          return `⏱️ Memperoleh & memproses konversi ulang video H.264...\n\n${bar}\n\n> Estimasi sisa waktu: ${etaStr}\n> Perkiraan selesai: pukul ${timeStr}`;
        };

        const statusMsg = await cht.reply(buildStatusText(0), {
          replyAi: false,
        });

        let videoBuf =
          media || (await cht.quoted?.download?.().catch(() => null));
        if (!videoBuf)
          return cht.reply(
            '❌ Balas video yang tidak dapat diputar dengan mengetik .fixvideo!'
          );

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

  ev.on(
    {
      cmd: ['toptv', 'ptv'],
      listmenu: ['toptv'],
      tag: 'converter',
      energy: 5,
      media: {
        type: ['video'],
      },
    },
    async ({ media }) => {
      Exp.sendMessage(id, { video: media, ptv: true }, { quoted: cht });
    }
  );

  ev.on(
    {
      cmd: ['16d', '16daudio', 'stems16d'],
      listmenu: ['16d'],
      tag: 'converter',
      energy: 25,
      media: {
        type: ['audio', 'video'],
        etc: {
          seconds: 360,
        },
      },
    },
    async ({ media, args }) => {
      let isVideo = ev.getMediaType().type === 'video';
      await cht.edit(infos.converter?.stems16d?.wait || '⏳ *Sedang memisahkan audio & memproses filter 16D...*\n> Mohon tunggu sebentar ya.', keys[sender]);

      try {
        let audioToSeparate = media;
        if (isVideo) {
          audioToSeparate = await processMedia(media, ['-vn', '-ac', '2', '-b:a', '128k'], 'mp3');
        }

        let response = await fetch(
          `${api.xterm.url}/api/audioProcessing/stems?key=${api.xterm.key}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: audioToSeparate,
          }
        );

        let json = await response.json();
        if (!json.status || !json.data || json.data.length < 2) {
          return cht.reply(infos.converter?.stems16d?.failed || '❌ Gagal memproses pemisahan audio 16D.');
        }

        let instItem = json.data.find((x) => x.filename.includes('accompaniment') || x.filename.includes('inst')) || json.data[0];
        let vocItem = json.data.find((x) => x.filename.includes('vocals') || x.filename.includes('vocal')) || json.data[1];

        let [instRes, vocRes] = await Promise.all([
          fetch(instItem.link).then((r) => r.arrayBuffer()).then((b) => Buffer.from(b)),
          fetch(vocItem.link).then((r) => r.arrayBuffer()).then((b) => Buffer.from(b)),
        ]);

        let mode = typeof args === 'string' ? args.toLowerCase().trim() : '';
        let result = await process16D(instRes, vocRes, {
          mode,
          isVideo,
          videoSource: isVideo ? media : null,
        });

        let detectedMode = ['reverse', 'balik', 'kiri', 'left', 'swap', 'flip', 'r'].some((k) => mode.includes(k))
          ? 'reverse'
          : ['8d', 'motion', 'rotate', 'putar', 'spin', 'm'].some((k) => mode.includes(k))
            ? '8d'
            : 'default';

        let caption = infos.converter?.stems16d?.success?.(detectedMode) || '✨ *16D AUDIO FILTER*';

        if (isVideo) {
          await Exp.sendMessage(
            id,
            { video: result, mimetype: 'video/mp4', caption },
            { quoted: cht }
          );
        } else {
          await Exp.sendMessage(
            id,
            { audio: result, mimetype: 'audio/mpeg', ptt: false },
            { quoted: cht }
          );
        }
      } catch (err) {
        console.error(err);
        cht.reply(infos.converter?.stems16d?.failed || '❌ Gagal memproses pemisahan audio 16D.');
      }
    }
  );

  ev.on(
    {
      cmd: ['merge', 'concat', 'gabung', 'gabungmedia'],
      listmenu: ['merge'],
      tag: 'converter',
      energy: 5,
    },
    async ({ args }) => {
      let _key = keys[sender];
      let hasCurrentMedia = Boolean(cht?.video || cht?.audio || (cht?.msg && (cht.msg.videoMessage || cht.msg.audioMessage)));
      let hasQuotedMedia = Boolean(cht?.quoted?.video || cht?.quoted?.audio || (cht?.quoted?.msg && (cht.quoted.msg.videoMessage || cht.quoted.msg.audioMessage)));

      if (!hasCurrentMedia && !hasQuotedMedia) {
        return cht.reply(infos.converter?.merge?.noMedia || 'Balas atau kirim video/audio dengan perintah *.merge*');
      }

      let currentBuf = null;
      let currentType = null;
      let quotedBuf = null;
      let quotedType = null;

      try {
        if (hasCurrentMedia) {
          currentBuf = await cht.download().catch(() => null);
          currentType = cht.video || cht.msg?.videoMessage ? 'video' : 'audio';
        }
        if (hasQuotedMedia) {
          quotedBuf = await cht.quoted.download().catch(() => null);
          quotedType = cht.quoted.video || cht.quoted.msg?.videoMessage ? 'video' : 'audio';
        }

        if (quotedBuf && currentBuf) {
          let mediaType = quotedType === 'video' || currentType === 'video' ? 'video' : 'audio';
          await cht.edit(infos.converter?.merge?.wait || '⏳ *Sedang menggabungkan media...*', _key, true);

          let mergedBuf;
          if (mediaType === 'video') {
            mergedBuf = await concatVideos([quotedBuf, currentBuf]);
          } else {
            mergedBuf = await concatAudios([quotedBuf, currentBuf]);
          }

          let caption = (args || cht.q || '').trim();
          let sentMsg;

          if (mediaType === 'video') {
            sentMsg = await Exp.sendMessage(
              id,
              {
                video: mergedBuf,
                mimetype: 'video/mp4',
                ...(caption ? { caption } : {}),
                footer: infos.converter?.merge?.videoFooter || '- Balas video ini dengan video lain untuk menggabungkan lagi!',
              },
              { quoted: cht }
            );
          } else {
            sentMsg = await Exp.sendMessage(
              id,
              {
                audio: mergedBuf,
                mimetype: 'audio/mpeg',
                ptt: false,
              },
              { quoted: cht }
            );
          }

          if (sentMsg?.key?.id) {
            let qCmds = memories.getItem(sender, 'quotedQuestionCmd') || {};
            qCmds[sentMsg.key.id] = {
              key: { id: sentMsg.key.id },
              emit: 'merge',
              exp: Date.now() + func.parseTimeString('15 menit'),
              maxUse: 50,
              accepts: [],
            };
            memories.setItem(sender, 'quotedQuestionCmd', qCmds);
          }
          return;
        }

        if (quotedBuf && !currentBuf) {
          let mediaType = quotedType;
          let replyMsg = await cht.reply(
            infos.converter?.merge?.promptNext?.(mediaType) ||
              `📥 *${mediaType === 'video' ? 'VIDEO' : 'AUDIO'} PERTAMA TERSIMPAN*\n\n> Balas (reply) pesan ini dengan ${mediaType === 'video' ? 'video' : 'audio'} berikutnya untuk menggabungkan!`
          );

          if (replyMsg?.key?.id) {
            let qCmds = memories.getItem(sender, 'quotedQuestionCmd') || {};
            qCmds[replyMsg.key.id] = {
              key: { id: replyMsg.key.id },
              emit: 'merge',
              exp: Date.now() + func.parseTimeString('15 menit'),
              maxUse: 50,
              accepts: [],
            };
            memories.setItem(sender, 'quotedQuestionCmd', qCmds);
          }
          return;
        }

        if (currentBuf && !quotedBuf) {
          let replyMsg = await cht.reply(
            infos.converter?.merge?.promptNext?.(currentType) ||
              `📥 *${currentType === 'video' ? 'VIDEO' : 'AUDIO'} PERTAMA TERSIMPAN*\n\n> Balas (reply) pesan ini dengan ${currentType === 'video' ? 'video' : 'audio'} berikutnya untuk menggabungkan!`
          );

          if (replyMsg?.key?.id) {
            let qCmds = memories.getItem(sender, 'quotedQuestionCmd') || {};
            qCmds[replyMsg.key.id] = {
              key: { id: replyMsg.key.id },
              emit: 'merge',
              exp: Date.now() + func.parseTimeString('15 menit'),
              maxUse: 50,
              accepts: [],
            };
            memories.setItem(sender, 'quotedQuestionCmd', qCmds);
          }
          return;
        }
      } catch (err) {
        console.error('Merge error:', err);
        cht.reply(infos.converter?.merge?.failed || '❌ Gagal menggabungkan media. Pastikan format media valid dan kompatibel.');
      }
    }
  );
}
