let raw = 'https://c.termai.cc/json/';

let { Chess } = await (fol[2] + 'chess.js').r();
const chess = new Chess();

let exif = await (fol[0] + 'exif.js').r();

global.timeouts = global.timeouts || {};
cfg.hadiah = cfg.hadiah || {
  /* Set hadiah bukan disini tapi di config.json ya
   ini buat antisipasi aja kalo belum update config.json
 */

  tebakgambar: 35,
  susunkata: 25,
  family100: 75,
  tebakanime: 35,
  caklontong: 45,
  asahotak: 40,
  tebakjenaka: 30,
  tebakbendera: 35,
  tebaktebakan: 30,
  tebakjenaka: 35,
  tebaklirik: 40,
};

const baseUTPositions = [
  [-165, 128],
  [-103, 128],
  [-35, 128],
  [33, 128],
  [103, 128],
  [163, 145],
  [163, 63],
  [103, 63],
  [33, 63],
  [-35, 63],
  [-103, 63],
  [-165, 63],
  [-165, -6],
  [-103, -6],
  [-35, -6],
  [33, -6],
  [103, -6],
  [163, -6],
  [163, -75],
  [103, -75],
  [33, -75],
  [-35, -75],
  [-103, -75],
  [-165, -75],
  [-165, -128],
  [-103, -128],
  [-35, -128],
  [33, -128],
  [103, -128],
  [163, -132],
];

const getUTPos = (locate, usrIdx) => {
  let pos = locate > 30 ? 30 : locate < 1 ? 1 : locate;
  let base = baseUTPositions[pos - 1] || [0, 0];
  let offsets = [
    { dx: -10, dy: -10 },
    { dx: 10, dy: 10 },
    { dx: -10, dy: 10 },
    { dx: 10, dy: -10 },
  ];
  let off = offsets[(usrIdx - 1) % offsets.length];
  return {
    x: Math.round(208 + base[0] + off.dx - 14),
    y: Math.round(173 + base[1] + off.dy - 14),
  };
};

const renderUTBoard = async (bgPath, players) => {
  const { createCanvas, loadImage } = await '@napi-rs/canvas'.import();
  const canvas = createCanvas(416, 346);
  const ctx = canvas.getContext('2d');
  const bg = await loadImage(bgPath);
  ctx.drawImage(bg, 0, 0, 416, 346);

  const colors = ['#ff4d4d', '#3399ff', '#33cc33', '#ffaa00'];

  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    const pos = getUTPos(p.jalan, i + 1);
    try {
      const img = await loadImage(p.picture);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x + 14, pos.y + 14, 14, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, pos.x, pos.y, 28, 28);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(pos.x + 14, pos.y + 14, 14, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = colors[i % colors.length];
      ctx.stroke();

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(pos.x + 4, pos.y + 4, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), pos.x + 4, pos.y + 4);
    } catch (e) {}
  }

  return canvas.toBuffer('image/jpeg');
};

export default async function on({ Exp, cht, ev, chatDb, is }) {
  const { id } = cht;
  const { func } = Exp;
  const preferences = is?.jadibot
    ? ((Data.preferencesBot ??= {})[Exp.user.id.split(':')[0]] ??= {})
    : (Data.preferences ??= {});
  let {
    archiveMemories: memories,
    parseTimeString,
    clearSessionConfess,
    findSenderCodeConfess,
    formatDuration,
  } = func;

  function setQCmd(__id, players, emit) {
    for (let { id: _id } of players) {
      let qcmds =
        memories.getItem(_id + from.sender, 'quotedQuestionCmd') || {};
      qcmds[__id] = {
        emit,
        exp: Date.now() + 60000 * 4,
        accepts: [],
      };
      memories.setItem(_id + from.sender, 'quotedQuestionCmd', qcmds);
    }
  }

  let metadata = preferences[id];
  let game = metadata?.game || false;
  if (game) {
    let isEnd = Date.now() >= game.endTime;
    if (isEnd) delete metadata.game;
  }

  let hasGame = game
    ? `*Masih ada game yang aktif disini!*

- Game: ${game.type}
- Start Time: ${func.dateFormatter(game.startTime, 'Asia/Jakarta')}
- End Time: ${func.dateFormatter(game.endTime, 'Asia/Jakarta')}
- Creator: @${game.creator.id.split('@')[0]}
- Creator Name: ${game.creator.name}

Untuk memulai game baru:
_Tunggu game berakhir atau bisa dengan mengetik .cleargame atau .nyerah_
`
    : '';

  ev.on(
    {
      cmd: ['tebakgambar'],
      listmenu: ['tebakgambar'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 100;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      Data[cht.cmd] =
        Data[cht.cmd] ||
        (await fetch(raw + cht.cmd + '.json').then((a) => a.json()));
      let { img: url, answer, desc } = Data[cht.cmd].getRandom();
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };
      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let caption = `*TEBAK GAMBAR*

Apa jawaban dari soal ini

Petunjuk: ${desc}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(
        id,
        { image: { url }, caption },
        { quoted: cht }
      );
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['tebakbendera'],
      listmenu: ['tebakbendera'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 30;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      let countries = await fetch(
        'https://raw.githubusercontent.com/Rifza123/lib/refs/heads/main/db/countries.json'
      ).then((a) => a.json());
      let name = Object.values(countries).getRandom();
      let url = `https://raw.githubusercontent.com/Rifza123/lib/refs/heads/main/db/image/flags/${name.slugify()}.png`;
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer: name,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };
      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let caption = `*TEBAK BENDERA*

Bendera negara apa ini?

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(
        id,
        { image: { url }, caption },
        { quoted: cht }
      );
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['tebakanime'],
      listmenu: ['tebakanime'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 35;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      let res = await fetch(
        `${api.xterm.url}/api/random/anime?key=${api.xterm.key}`
      );

      if (!res.ok) {
        return cht.reply(
          `Cannot get data anime\nerr:\nRequest failed with status ${res.status}`
        );
      }

      let json = await res.json();

      let { namaCharacter, namaanime, season, tahun, sposies, linkGambar } =
        json.data;
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer: namaCharacter.toLowerCase().split(',')[0],
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };
      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let caption = `*TEBAK KARAKTER ANIME*

Siapa nama karakter anime ini?

\`Petunjuk:\`
- Anime: ${namaanime}
- Season: ${season}
- Tahun: ${tahun}
- Sposies: ${sposies}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(
        id,
        { image: { url: linkGambar }, caption },
        { quoted: cht }
      );
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${namaCharacter.toLowerCase().split(',')[0]}`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['susunkata'],
      listmenu: ['susunkata'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 30;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      Data[cht.cmd] =
        Data[cht.cmd] ||
        (await fetch(raw + cht.cmd + '.json').then((a) => a.json()));
      let { type, question, answer } = Data[cht.cmd].getRandom();
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };

      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let text = `*SUSUN KATA*

Susun ini menjadi kata yang benar

Tipe: ${type}
Kata: ${question}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht });
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['tebakjenaka'],
      listmenu: ['tebakjenaka'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 30;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      Data[cht.cmd] =
        Data[cht.cmd] ||
        (await fetch(raw + cht.cmd + '.json').then((a) => a.json()));
      let { type, question, jawaban: answer } = Data[cht.cmd].getRandom();
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };

      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let text = `*TEBAK JENAKA*

Jawablah pertanyaan ini dengan benar:
_${question}_

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht });
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['tebaklirik'],
      listmenu: ['tebaklirik'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 30;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      Data[cht.cmd] =
        Data[cht.cmd] ||
        (await fetch(raw + cht.cmd + '.json').then((a) => a.json()));
      let { question, answer } = Data[cht.cmd].getRandom();
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };

      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let text = `*TEBAK LIRIK*

Tebak kata yang hilang pada lirik berikut:
_${question}_

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht });
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['tebaktebakan'],
      listmenu: ['tebaktebakan'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 30;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      Data[cht.cmd] =
        Data[cht.cmd] ||
        (await fetch(raw + cht.cmd + '.json').then((a) => a.json()));
      let { question, answer } = Data[cht.cmd].getRandom();
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };

      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let text = `*TEBAK - TEBAKAN*

Jawablah pertanyaan ini dengan benar:
_${question}_

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht });
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['asahotak'],
      listmenu: ['asahotak'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 40;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      Data[cht.cmd] =
        Data[cht.cmd] ||
        (await fetch(raw + cht.cmd + '.json').then((a) => a.json()));
      let { type, question, jawaban: answer } = Data[cht.cmd].getRandom();
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };

      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let text = `*ASAH OTAK*

Jawablah pertanyaan ini dengan benar:
_${question}_

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht });
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['hint'],
      listmenu: ['hint'],
      tag: 'game',
      energy: 20,
      onlyGame: [
        'tebakgambar',
        'tebakanime',
        'susunkata',
        'caklontong',
        'tebakjenaka',
        'asahotak',
        'tebakbendera',
        'tebakjenaka',
        'tebaktebakan',
        'tebaklirik',
      ],
    },
    async () => {
      let { key } = await cht.reply(
        `Petunjuk: ${chatDb.game.answer
          .split('')
          .join(' ')
          .replace(/[aiueo]/gi, '_')}`
      );
      chatDb.game.id_message.push(Key.id);
    }
  );

  ev.on(
    {
      cmd: ['caklontong'],
      listmenu: ['caklontong'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 45;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000;
      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      Data[cht.cmd] =
        Data[cht.cmd] ||
        (await fetch(raw + cht.cmd + '.json').then((a) => a.json()));
      let {
        description,
        question,
        jawaban: answer,
      } = Data[cht.cmd].getRandom();
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        description,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };

      let formatDur = func.formatDuration(maxAge);
      let text = `*CAK LONTONG*

Jawablah pertanyaan ini:

_${question}_

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`;
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht });
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}
_${description}_
`);
        Exp.sendMessage(cht.id, { delete: key });
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['family100'],
      listmenu: ['family100'],
      tag: 'game',
      energy: 10,
    },
    async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 100;
      if ('game' in metadata) return cht.reply(hasGame);
      let maxAge = 60000 * 5;
      Data[cht.cmd] =
        Data[cht.cmd] ||
        (await fetch(raw + cht.cmd + '.json').then((a) => a.json()));
      let { question, answer } = Data[cht.cmd].getRandom();
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        question,
        answer,
        answered: {},
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender,
        },
        id_message: [],
      };

      let _key = keys[cht.sender];
      await cht.edit('Starting game...', _key);
      let formatDur = func.formatDuration(maxAge);
      let text = `*FAMILY 100*

Pertanyaan: *${question}*

Jawaban:
${answer.map((item, index) => `${index + 1}. ?? ${index == 0 ? '\`TOP SURVEY\`' : ''}`).join('\n')}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah:
${answer.map((item, index) => `${index + 1}. ${index == 0 ? '\`TOP SURVEY\`' : ''} ?? Energy⚡`).join('\n')}

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)

`;
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht });
      metadata.game.id_message.push(key.id);
      metadata.game.key = key;
      global.timeouts[id] = setTimeout(async () => {
        delete preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: 
${answer.map((item, index) => `${index + 1}. ${item} ${index == 0 ? '\`TOP SURVEY\`' : ''} (${((cfg.hadiah[cht.cmd] * (index == 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)`).join('\n')}
`);
        let { answered } = preferences[id].game;
        let answeredKey = Object.keys(answered);
        await sleep(1000);
        await Exp.sendMessage(cht.id, { delete: key });
        await sleep(1000);
        if (answeredKey.length > 0) {
          await cht.reply('Membagiakan semua hadiah yang didapat....🎁');
          Object.entries(answered).forEach(async ([_, ___]) => {
            let idx = answer.findIndex((item) => item == _);
            let gift = (
              (cfg.hadiah[type] * (idx === 0 ? 1 : 1.5)) /
              (idx + 1)
            ).toFixed();
            await func.archiveMemories['addEnergy'](__, gift);
          });
        }
      }, maxAge);
    }
  );

  ev.on(
    {
      cmd: ['cleargame'],
      listmenu: ['cleargame'],
      tag: 'game',
    },
    async () => {
      if ((!'game') in metadata)
        return cht.reply('Tidak ada game yang aktif disini!');
      await Exp.sendMessage(cht.id, { delete: metadata.game.key });
      clearTimeout(global.timeouts[id]);
      delete metadata.game;
      delete global.timeouts[id];
      cht.reply('Success✅');
    }
  );

  ev.on(
    {
      cmd: ['nyerah'],
      listmenu: ['nyerah'],
      tag: 'game',
    },
    async () => {
      if ((!'game') in metadata)
        return cht.reply('Tidak ada game yang aktif disini!');
      if (cht.sender !== game.creator.id)
        return cht.reply(
          'Hanya creator game yang dapat melaksanakan tindakan ini!'
        );
      await Exp.sendMessage(cht.id, { delete: metadata.game.key });
      clearTimeout(global.timeouts[id]);
      cht.reply(`*Anda menyerah!*
Jawaban: 
${Array.isArray(game.answer) ? game.answer.map((item, index) => `${index + 1}. ${item} ${index == 0 ? '\`TOP SURVEY\`' : ''} (${((cfg.hadiah[game.type] * (index == 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)`).join('\n') : game.answer}`);
      delete metadata.game;
      delete global.timeouts[id];
    }
  );

  ev.on(
    {
      cmd: ['chess'],
      listmenu: ['chess ♟️'],
      tag: 'game',
      //  energy: 35, opsional
    },
    async ({ args }) => {
      let _id1;
      const senderNumber = cht.sender.split('@')[0];
      const [action, param1] = (args || '').split(' ', 2);
      const chatId = cht.id;

      let games = preferences[cht.id]?.chess || {};
      /*
          [ '––『CREDIT THANKS TO』––' ]
          ┊ALLAH S.W.T.
          ┊RIFZA
          ┊Penyedia Modul
          ❏═•═━〈 SORRY WATERMARK
          ┊sorry ada watermark
          ┊donasi ovo/dana: ┊083147309847 (Hanif)
          ┊wa: 083147309847 (Hanif)
          ┊request fitur juga boleh
          ┊buat beli lauk dan nasi hehe
          ┊
          ┊Numpang ya bang, hehe.
          ┊  ###By: Hanif Skizo
          ┗–––––––––––––––––––––––––✦
        */
      if (!action) {
        return cht.reply(
          '❌ Gunakan perintah berikut:\n' +
            '• `.chess create <room>` - Buat game baru\n' +
            '• `.chess join <room>` - Gabung game\n' +
            '• `.chess start <room>` - Mulai game\n' +
            '• `.chess move <from>to<to>` - Lakukan langkah (contoh: e2>e4)\n' +
            '• `.chess delete <room>` - Hapus game\n' +
            '• `.chess help` - Bantuan perintah'
        );
      }

      if (action === 'help') {
        return cht.reply(
          '🌟 *Chess Game Commands:*\n\n' +
            '*chess create <room>* - Mulai permainan catur\n' +
            '*chess join <room>* - Bergabung dengan permainan\n' +
            '*chess start <room>* - Memulai permainan setelah 2 pemain bergabung\n' +
            '*chess move <from>to<to>* - Melakukan langkah (contoh: e2>e4)\n' +
            '*chess delete <room>* - Menghapus permainan\n\n' +
            '*Contoh:* \n' +
            '`chess create HanifRoom` - Membuat room bernama HanifRoom\n' +
            '`chess move e2 e4` - Melakukan langkah e2 ke e4'
        );
      }

      if (action === 'create') {
        if (!param1)
          return cht.reply(
            '❌ Harap masukkan nama room. Contoh: `.chess create HanifRoom`.'
          );
        if (param1 in games)
          return cht.reply('❌ Room sudah ada. Pilih nama lain.');

        games[param1] = {
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          players: [{ id: senderNumber, color: 'white' }],
          turn: 'white',
        };

        preferences[cht.id].chess = games;
        return cht.reply(
          `✅ Room "${param1}" berhasil dibuat!\nAnda berada di room ini sebagai Putih`
        );
      }

      if (action === 'join') {
        if (!param1)
          return cht.reply(
            '❌ Masukkan nama room. Contoh: `.chess join HanifRoom`.'
          );
        if (!games[param1]) return cht.reply('❌ Room tidak ditemukan.');
        if (games[param1].players.length >= 2)
          return cht.reply('⚠️ Room sudah penuh.');
        if (games[param1].players.some((a) => a.id.includes(senderNumber)))
          return cht.reply('Anda sudah join room ini!');
        games[param1].players.push({ id: senderNumber, color: 'black' });
        games[param1].players = [
          ...new Map(
            games[param1].players.map((item) => [item.id, item])
          ).values(),
        ];
        preferences[cht.id].chess = games;
        return cht.reply(
          `✅ Anda bergabung di room "${param1}" sebagai Hitam.`
        );
      }

      if (action === 'start') {
        if (!param1)
          return cht.reply(
            '❌ Masukkan nama room. Contoh: `.chess start HanifRoom`.'
          );
        const room = games[param1];
        if (!room) return cht.reply('❌ Room tidak ditemukan.');
        if (room.players.length < 2)
          return cht.reply('⚠️ Butuh dua pemain untuk memulai game.');

        const boardUrl = `https://chessboardimage.com/${room.fen}.png`;
        let { key: key1 } = await Exp.sendMessage(cht.id, {
          image: { url: boardUrl },
          caption: `🎲 Permainan dimulai! Giliran: ${room.turn.toUpperCase()}`,
        });
        setQCmd(key1.id, room.players, `${cht.cmd} move`);
        return;
      }

      if (action === 'move') {
        const [_, from, to, promotion] = args.toLowerCase().split(/\s+/); // buat promosi 🗿(e.g. e7 e8 q)

        if (!from || !to) {
          let { key: key1 } = await cht.reply(
            '❌ Format salah. Contoh penggunaan:\n' +
              '• `.chess move e2 e4` - Langkah biasa\n' +
              '• `.chess move e7 e8 q` - Promosi pion ke ratu'
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }

        const senderNumber = cht.sender.split('@')[0];

        const roomName = Object.keys(games).find((r) =>
          games[r].players.some((p) => p.id === senderNumber)
        );

        if (!roomName) {
          let { key: key1 } = await cht.reply(
            '❌ Anda belum bergabung dalam permainan!'
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }

        const room = games[roomName];

        try {
          chess.load(room.fen);
        } catch (error) {
          room.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
          preferences[cht.id].chess = games;
          return cht.reply('⚠️ Permainan direset ke posisi awal karena error!');
        }

        const player = room.players.find((p) => p.id === senderNumber);
        if (!player) {
          return cht.reply('❌ Anda bukan peserta dalam game ini!');
        }

        if (player.color !== room.turn) {
          let { key: key1 } = await cht.reply(
            `⏳ Bukan giliran Anda! Giliran ${room.turn.toUpperCase()}`
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }

        try {
          const moveOptions = { from, to };
          if (promotion) moveOptions.promotion = promotion[0].toLowerCase();

          const move = chess.move(moveOptions);
          if (!move) throw new Error('Langkah tidak valid!');

          room.fen = chess.fen();
          room.turn = chess.turn() === 'w' ? 'white' : 'black';
          preferences[cht.id].chess = games;
          // const encodedFEN = room.fen.replace(/ /g, '_');
          const boardUrl =
            `https://chessboardimage.com/${room.fen}` +
            (room.turn === 'black' ? '-flip.png' : '.png');

          let buff = await func.getBuffer(boardUrl);
          let res = await exif['writeExifImg'](buff, {
            packname: 'Chess',
            author: 'Ⓒ' + cht.pushName,
          });
          let { key: key } = await Exp.sendMessage(
            id,
            {
              sticker: {
                url: res,
              },
            },
            {
              quoted: cht,
            }
          );
          setQCmd(
            key.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
          let { key: key1 } = await cht.reply(
            `✅ Berhasil pindah ${from}➡️${to}\nGiliran ${room.turn.toUpperCase()}`
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
          /* 
           ### KALO MAU DIUBAH KE IMAGE ###
           await Exp.sendMessage(chatId, {
             image: { url: boardUrl},
             caption: `✅ Berhasil pindah ${from}→${to}\nGiliran ${room.turn.toUpperCase()}`
           });
          */
          if (chess.isCheckmate()) {
            delete games[roomName];
            preferences[cht.id].chess = games;
            return cht.reply(
              `🏆 SKAKMAT! Pemenang: ${player.color.toUpperCase()}`
            );
          }

          if (chess.isDraw()) {
            delete games[roomName];
            preferences[cht.id].chess = games;
            return cht.reply('🤝 PERMAINAN BERAKHIR REMIS!');
          }
        } catch (error) {
          // Detailed error messages
          let errorMessage = `❌ Gagal: ${error.message}\n`;

          if (error.message.includes('invalid square')) {
            errorMessage += 'Format posisi salah (contoh: e2)';
          } else if (error.message.includes('invalid move')) {
            errorMessage += 'Langkah tidak sesuai aturan catur';
          } else {
            errorMessage +=
              'Contoh: `.chess move e2 e4` atau `.chess move e7 e8 q`';
          }
          let { key: key1 } = await cht.reply(errorMessage);
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }
      }

      if (action === 'delete') {
        if (!param1)
          return cht.reply(
            '❌ Masukkan nama room. Contoh: `.chess delete HanifRoom`.'
          );
        if (!games[param1]) return cht.reply('❌ Room tidak ditemukan.');
        if (games[param1].players[0].id !== senderNumber)
          return cht.reply('Hanya pembuat room yang dapat menghapus sesi!');
        delete games[param1];
        preferences[cht.id].chess = games;
        return cht.reply(`✅ Room "${param1}" berhasil dihapus.`);
      }

      return cht.reply(
        '❌ Perintah tidak dikenal. Gunakan `.chess help` untuk melihat daftar perintah.'
      );
    }
  );

  ev.on(
    {
      cmd: ['sos'],
      //listmenu: ["sos"],
      // tag: "game",
      args: `Format: .sos <create/join/leave/theme/move> <room_name>`,
    },
    async ({ cht }) => {
      const [action, param1, param2] = (cht.q || '').split(' ');
      const chatId = cht.id;
      const senderNumber = cht.sender.split('@')[0];

      let sessions = preferences[chatId].sos || {};

      function formatBoard(board) {
        return (
          `\n${board[0]} | ${board[1]} | ${board[2]}\n` +
          `---------\n` +
          `${board[3]} | ${board[4]} | ${board[5]}\n` +
          `---------\n` +
          `${board[6]} | ${board[7]} | ${board[8]}\n`
        );
      }

      /* BELUM KELAR!!
          [ '––『CREDIT THANKS TO』––' ]
          ┊ALLAH S.W.T.
          ┊RIFZA
          ┊Penyedia Modul
          ❏═•═━〈 SORRY WATERMARK
          ┊sorry ada watermark
          ┊donasi ovo/dana: ┊083147309847 (Hanif)
          ┊wa: 083147309847 (Hanif)
          ┊request fitur juga boleh
          ┊buat beli lauk dan nasi hehe
          ┊
          ┊Numpang ya bang, hehe.
          ┊  ###By: Hanif Skizo
          ┗–––––––––––––––––––––––––✦
        */

      function checkGameStatus(board) {
        const winConditions = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8], // Baris
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8], // Kolom
          [0, 4, 8],
          [2, 4, 6], // Diagonal
        ];

        for (const condition of winConditions) {
          const [a, b, c] = condition;
          if (board[a] === board[b] && board[b] === board[c]) {
            return 'win';
          }
        }
        if (!board.some((cell) => typeof cell === 'number')) {
          return 'draw';
        }
        return 'ongoing';
      }

      if (!action) {
        return cht.reply(
          '❌ Gunakan perintah berikut:\n' +
            '• `.sos create <room>` - Buat game baru\n' +
            '• `.sos join <room>` - Gabung game\n' +
            '• `.sos leave` - Keluar dari game\n' +
            '• `.sos theme <1/2/3>` - Pilih tema simbol\n' +
            '• `.sos move <posisi>` - Letakkan simbol'
        );
      }

      if (action === 'theme') {
        if (!param1 || !['1', '2', '3'].includes(param1)) {
          return cht.reply(
            '❌ Harap pilih tema dengan angka 1, 2, atau 3. Contoh: `.sos theme 1`.\n' +
              'Tema yang tersedia:\n' +
              '1. 🧿(1) 👾(2)\n2. 🐱(1) 🐶(2)\n3. 🌋(1) 🏔️(2)'
          );
        }

        const themes = {
          1: ['🧿', '👾'],
          2: ['🐱', '🐶'],
          3: ['🌋', '🏔️'],
        };

        sessions.theme = themes[param1];
        preferences[chatId].sos = sessions;
        return cht.reply(
          `✅ Tema "${param1}" berhasil dipilih! Simbol: ${themes[param1][0]} (1) & ${themes[param1][1]} (2).`
        );
      }

      if (action === 'create') {
        if (!param1)
          return cht.reply(
            '❌ Harap masukkan nama room. Contoh: `.sos create HanifRoom`.'
          );
        if (sessions[param1])
          return cht.reply('❌ Room sudah ada. Pilih nama lain.');

        const symbols = sessions.theme || ['⭕', '❌'];
        sessions[param1] = {
          board: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          players: [{ id: senderNumber, symbol: symbols[0] }],
          turn: symbols[0],
        };
        preferences[chatId].sos = sessions;
        return cht.reply(`✅ Room "${param1}" berhasil dibuat!`);
      }

      if (action === 'join') {
        if (!param1)
          return cht.reply(
            '❌ Masukkan nama room. Contoh: `.sos join HanifRoom`.'
          );
        if (!sessions[param1]) return cht.reply('❌ Room tidak ditemukan.');
        if (sessions[param1].players.length >= 2)
          return cht.reply('❌ Room sudah penuh.');

        const symbols =
          sessions[param1].players[0].symbol === '⭕' ? '❌' : '⭕';
        sessions[param1].players.push({ id: senderNumber, symbol: symbols });
        preferences[chatId].sos = sessions;
        let { key: key1 } = await cht.reply(
          `✅ Anda bergabung dalam room "${param1}"!`
        );
        return setQCmd(
          key1.id,
          [{ id: cht.sender.split('@')[0] }],
          `${cht.cmd} move`
        );
      }

      if (action === 'leave') {
        const roomName = Object.keys(sessions).find((r) =>
          sessions[r].players.some((p) => p.id === senderNumber)
        );

        if (!roomName)
          return cht.reply('❌ Anda tidak berada di game mana pun.');

        delete sessions[roomName];
        preferences[chatId].sos = sessions;
        return cht.reply(`✅ Anda keluar dari room "${roomName}".`);
      }

      if (action === 'move') {
        if (!param1) {
          let { key: key1 } = await cht.reply(
            '❌ Masukkan posisi angka (1-9). Contoh: `.sos move 5`.'
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }

        const roomName = Object.keys(sessions).find((r) =>
          sessions[r].players.some((p) => p.id === senderNumber)
        );

        if (!roomName) {
          let { key: key1 } = await cht.reply(
            '❌ Anda belum bergabung dalam permainan!'
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }

        const room = sessions[roomName];
        const player = room.players.find((p) => p.id === senderNumber);

        if (!player) {
          let { key: key1 } = await cht.reply(
            '❌ Anda bukan peserta dalam game ini!'
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }
        if (room.turn !== player.symbol) {
          let { key: key1 } = await cht.reply(
            `⏳ Bukan giliran Anda! Giliran: ${room.turn}`
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }

        const position = parseInt(param1) - 1;
        if (isNaN(position) || position < 0 || position > 8) {
          let { key: key1 } = await cht.reply(
            '❌ Posisi tidak valid. Gunakan angka 1-9.'
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }

        if (typeof room.board[position] !== 'number') {
          let { key: key1 } = await cht.reply(
            '❌ Posisi sudah terisi. Pilih tempat lain.'
          );
          return setQCmd(
            key1.id,
            [{ id: cht.sender.split('@')[0] }],
            `${cht.cmd} move`
          );
        }

        room.board[position] = player.symbol;
        room.turn = player.symbol === '⭕' ? '❌' : '⭕';

        const status = checkGameStatus(room.board);

        let boardText = `🎲 *Papan Permainan:*\n${formatBoard(room.board)}`;

        if (status === 'win') {
          delete sessions[roomName];
          return cht.reply(`🏆 *${player.symbol} Menang!*\n${boardText}`);
        } else if (status === 'draw') {
          delete sessions[roomName];
          return cht.reply(`🤝 Permainan Seri!\n${boardText}`);
        }
        preferences[chatId].sos[roomName] = room;
        return cht.reply(`${boardText}\nGiliran: ${room.turn}`);
      }

      return cht.reply(
        '❌ Perintah tidak dikenal. Gunakan `.sos help` untuk melihat daftar perintah.'
      );
    }
  );

  let clearUTTimer = (id) => {
    global._ulartanggaTimers ??= {};
    if (global._ulartanggaTimers[id]) {
      clearTimeout(global._ulartanggaTimers[id]);
      delete global._ulartanggaTimers[id];
    }
  };

  ev.on(
    {
      cmd: ['ulartangga', 'ut', 'dadu', 'roll'],
      listmenu: ['ulartangga'],
      tag: 'game',
    },
    async () => {
      if (!is.group) return cht.reply(Data.infos.game.ulartanggaOnlyGroup);
      let chatDb = (preferences[cht.id] ??= {});
      let session = chatDb.ulartangga || Data.ulartangga?.[cht.id];

      let refreshSessionTimeout = (ses) => {
        if (!ses) return;
        clearUTTimer(cht.id);
        ses.lastActivity = Date.now();
        ses.exp = Date.now() + 600000;
        global._ulartanggaTimers[cht.id] = setTimeout(async () => {
          clearUTTimer(cht.id);
          if (chatDb.ulartangga && chatDb.ulartangga === ses) {
            let delKeys = ses.keys || [];
            let curStatus = ses.status;
            let curPlayers = ses.players || [];
            delete chatDb.ulartangga;
            if (Data.ulartangga?.[cht.id]) delete Data.ulartangga[cht.id];
            for (let kid of delKeys) {
              Exp.sendMessage(cht.id, {
                delete: {
                  remoteJid: cht.id,
                  fromMe: true,
                  id: kid,
                  participant: Exp.user?.id,
                },
              }).catch(() => {});
            }
            if (curStatus === 'playing' && curPlayers.length > 0) {
              let sorted = [...curPlayers].sort((a, b) => b.jalan - a.jalan);
              let winner = sorted[0];
              memories.setItem(
                winner.id,
                'energy',
                (memories.getItem(winner.id, 'energy') || 0) + 25
              );
              let winText = Data.infos.game.ulartanggaTimeoutWin(
                winner.id.split('@')[0],
                winner.jalan,
                25
              );
              Exp.sendMessage(cht.id, {
                text: winText,
                mentions: curPlayers.map((p) => p.id),
              }).catch(() => {});
            } else {
              Exp.sendMessage(cht.id, {
                text: Data.infos.game.ulartanggaTimeoutLobby,
              }).catch(() => {});
            }
          }
        }, 600000);
      };

      let now = Date.now();
      if (session) {
        let isExpired = session.exp
          ? now > session.exp
          : session.lastActivity
            ? now - session.lastActivity > 600000
            : false;
        let isCorrupted =
          !Array.isArray(session.players) ||
          session.players.length === 0 ||
          !session.status;
        if (isExpired || isCorrupted) {
          clearUTTimer(cht.id);
          let delKeys = session.keys || [];
          delete chatDb.ulartangga;
          if (Data.ulartangga?.[cht.id]) delete Data.ulartangga[cht.id];
          for (let kid of delKeys) {
            Exp.sendMessage(cht.id, {
              delete: {
                remoteJid: cht.id,
                fromMe: true,
                id: kid,
                participant: Exp.user?.id,
              },
            }).catch(() => {});
          }
          session = null;
        }
      }

      let getAvatar = async (jid) => {
        let targetJid =
          jid && jid.endsWith('@lid')
            ? (cht.key?.participantAlt || jid).replace(
                /@lid$/,
                '@s.whatsapp.net'
              )
            : jid;
        try {
          return await Promise.race([
            Exp.profilePictureUrl(targetJid, 'image'),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 2000)
            ),
          ]);
        } catch (e) {
          return 'https://telegra.ph/file/42d2a0e0881e349806028.jpg';
        }
      };

      if (!session) {
        let inputStr = (cht.q || cht.msg || '').trim();
        let hasAtInText =
          /@\d+/.test(cht.msg || '') ||
          (cht.msg || '').includes('@') ||
          /@\d+/.test(cht.q || '');
        let mentions = hasAtInText
          ? Array.from(new Set(cht.mention || [])).filter(
              (a) => a !== cht.sender
            )
          : [];
        let isCreateCmd =
          mentions.length > 0 ||
          /^(create|open|lobby|play|start|\.ut create|\.ut open|\.ut lobby)$/i.test(
            inputStr.toLowerCase()
          );

        if (!isCreateCmd) {
          let cap =
            `🐍 *GAME ULAR TANGGA* 🐍\n\n` +
            `Permainan papan Ular Tangga interaktif (2 - 4 Pemain).\n\n` +
            `🎮 *CARA MEMULAI PERMAINAN:*\n` +
            `• *.ut @tag*\n> Mengundang teman bermain\n` +
            `• *.ut create*\n> Membuka lobby umum di grup\n\n` +
            `📜 *COMMAND PERMAINAN:*\n` +
            `• *.ut join* / *join*\n> Bergabung ke lobby\n` +
            `• *.ut start*\n> Memulai game (Min 2 pemain)\n` +
            `• *.ut cancel* / *cancel*\n> Membatalkan lobby\n` +
            `• *🎲* / *.dadu* / *media dadu*\n> Melempar dadu (saat giliran)\n` +
            `• *.ut*\n> Cek status permainan\n` +
            `• *.delsesiut*\n> Hapus / menghentikan sesi (Pembuat / Admin)`;
          return cht.reply(cap);
        }

        if (mentions.length > 3) {
          return cht.reply(
            'Maksimal 3 orang yang dapat diundang (total 4 pemain)!'
          );
        }

        let ppCreator = await getAvatar(cht.sender);

        let players = [
          { id: cht.sender, jalan: 1, picture: ppCreator, setuju: true },
        ];

        for (let target of mentions) {
          let ppTarget = await getAvatar(target);
          players.push({
            id: target,
            jalan: 1,
            picture: ppTarget,
            setuju: false,
          });
        }

        session = {
          status: 'waiting',
          gilir: 0,
          creator: cht.sender,
          players,
          keys: [],
          hasInvites: mentions.length > 0,
          exp: Date.now() + 600000,
          lastActivity: Date.now(),
        };

        chatDb.ulartangga = session;
        Data.ulartangga = Data.ulartangga || {};
        Data.ulartangga[cht.id] = session;
        refreshSessionTimeout(session);

        if (mentions.length > 0) {
          let targetsNum = mentions.map((a) => a.split('@')[0]);
          return cht
            .question(
              Data.infos.game.ulartanggaInvite(
                cht.sender.split('@')[0],
                targetsNum
              ),
              {
                emit: 'ulartangga',
                sender: mentions[0],
                accepts: [
                  'join',
                  '.join',
                  '.ut join',
                  'cancel',
                  '.cancel',
                  '.ut cancel',
                  'start',
                  '.start',
                  '.ut start',
                ],
                exp: Date.now() + 600000,
              },
              { mentions: [cht.sender, ...mentions] }
            )
            .then((r) => {
              if (r?.key?.id) {
                session.keys = session.keys || [];
                session.keys.push(r.key.id);
                chatDb.ulartangga = session;
              }
            });
        } else {
          let cap = `🐍 *LOBBY PERMAINAN ULAR TANGGA* 🐍\n\n👤 *Pemain (1/4):*\n1. @${cht.sender.split('@')[0]}\n\n📜 *COMMAND PERMAINAN:*\n• *.ut join* / *join*\n> Bergabung ke lobby\n• *.ut start*\n> Memulai game (Min 2 pemain)\n• *.ut cancel* / *cancel*\n> Membatalkan lobby\n• *🎲* / *.dadu* / *media dadu*\n> Melempar dadu (saat game berjalan)\n• *.ut*\n> Cek status & giliran game\n• *.delsesiut*\n> Hapus / menghentikan sesi game (Pembuat / Admin)`;
          return cht
            .question(
              cap,
              {
                emit: 'ulartangga',
                exp: Date.now() + 600000,
              },
              { mentions: [cht.sender] }
            )
            .then((r) => {
              if (r?.key?.id) {
                session.keys = session.keys || [];
                session.keys.push(r.key.id);
                chatDb.ulartangga = session;
              }
            });
        }
      }

      let input = (cht.q || cht.msg || '').trim().toLowerCase();

      if (session.status === 'waiting') {
        session.lastActivity = Date.now();
        session.exp = Date.now() + 600000;
        if (/^(cancel|\.ut cancel|\.cancel|batal|\.batal)$/i.test(input)) {
          if (
            cht.sender === session.creator ||
            session.players.some((p) => p.id === cht.sender)
          ) {
            clearUTTimer(cht.id);
            let delKeys = session.keys || [];
            delete chatDb.ulartangga;
            if (Data.ulartangga?.[cht.id]) delete Data.ulartangga[cht.id];
            for (let kid of delKeys) {
              Exp.sendMessage(cht.id, {
                delete: {
                  remoteJid: cht.id,
                  fromMe: true,
                  id: kid,
                  participant: Exp.user?.id,
                },
              }).catch(() => {});
            }
            return cht.reply(Data.infos.game.ulartanggaDeclined);
          }
        }

        let isStartCmd = /^(start|\.ut start|\.start)$/i.test(input);

        if (isStartCmd) {
          if (cht.sender !== session.creator && !is.groupAdmins && !is.owner) {
            return cht.reply(
              `❌ Hanya Pembuat Game (@${session.creator.split('@')[0]}) yang dapat memulai permainan!`,
              { mentions: [session.creator] }
            );
          }
          let confirmedPlayers = session.players.filter((p) => p.setuju);
          if (confirmedPlayers.length < 2) {
            return cht.reply(Data.infos.game.ulartanggaMinPlayers);
          }
          session.players = confirmedPlayers;
          session.status = 'playing';
          session.gilir = 0;
          chatDb.ulartangga = session;
          refreshSessionTimeout(session);

          let daduMedia = is?.jadibot
            ? Data.jadibotDb?.[Exp?.user?.id?.split(':')[0]]?.daduMedia
            : Data.daduMedia;
          if (daduMedia?.message) {
            let isSticker =
              daduMedia.type === 'stickerMessage' ||
              daduMedia.type === 'sticker';
            let playerNums = session.players.map((p) => p.id.split('@')[0]);
            let notice = Data.infos.game.ulartanggaDaduMediaNotice(
              playerNums,
              isSticker
            );
            await Exp.sendMessage(
              cht.id,
              {
                text: notice,
                mentions: session.players.map((p) => p.id),
              },
              { quoted: cht }
            );
            await Exp.relayMessage(cht.id, daduMedia.message, {}).catch((e) =>
              console.error(e)
            );
          } else if (is.owner) {
            await cht.reply(
              '⚠️ Media dadu belum diset!\nOwner bisa mengaturnya dengan me-reply media (stiker/gambar/video/audio) lalu ketik: .set dadu'
            );
          }

          let buf = await renderUTBoard(
            './toolkit/set/ulartangga.jpg',
            session.players
          );

          let firstPlayer = session.players[0];
          let cap = Data.infos.game.ulartanggaStart(
            firstPlayer.id.split('@')[0],
            '🎲'
          );

          return cht
            .question(
              cap,
              {
                emit: 'ulartangga',
                sender: firstPlayer.id,
                accepts: ['🎲', 'dadu', '.dadu', 'roll', '.roll'],
                exp: Date.now() + 600000,
              },
              {
                image: buf,
                mentions: session.players.map((p) => p.id),
              }
            )
            .then((r) => {
              if (r?.key?.id) {
                session.keys = session.keys || [];
                session.keys.push(r.key.id);
                chatDb.ulartangga = session;
              }
            });
        }

        let isJoinCmd = /^(join|\.ut join|\.join)$/i.test(input);

        if (isJoinCmd) {
          let existingPlayer = session.players.find((p) => p.id === cht.sender);
          if (existingPlayer) {
            if (!existingPlayer.setuju) {
              existingPlayer.setuju = true;
            } else {
              return cht.reply(
                `@${cht.sender.split('@')[0]} Anda sudah berada di dalam lobby!`,
                { mentions: [cht.sender] }
              );
            }
          } else {
            if (session.players.length >= 4) {
              return cht.reply(Data.infos.game.ulartanggaFull);
            }
            let ppSender = await getAvatar(cht.sender);
            session.players.push({
              id: cht.sender,
              jalan: 1,
              picture: ppSender,
              setuju: true,
            });
          }

          chatDb.ulartangga = session;
          let confirmedPlayers = session.players.filter((p) => p.setuju);
          let allInvitedAccepted = session.players.every((p) => p.setuju);

          if (
            session.hasInvites &&
            allInvitedAccepted &&
            confirmedPlayers.length >= 2 &&
            session.players.length > 1
          ) {
            session.status = 'playing';
            session.gilir = 0;
            chatDb.ulartangga = session;
            refreshSessionTimeout(session);

            let daduMedia = is?.jadibot
              ? Data.jadibotDb?.[Exp?.user?.id?.split(':')[0]]?.daduMedia
              : Data.daduMedia;
            if (daduMedia?.message) {
              let isSticker =
                daduMedia.type === 'stickerMessage' ||
                daduMedia.type === 'sticker';
              let playerNums = session.players.map((p) => p.id.split('@')[0]);
              let notice = Data.infos.game.ulartanggaDaduMediaNotice(
                playerNums,
                isSticker
              );
              await Exp.sendMessage(
                cht.id,
                {
                  text: notice,
                  mentions: session.players.map((p) => p.id),
                },
                { quoted: cht }
              );
              await Exp.relayMessage(cht.id, daduMedia.message, {}).catch((e) =>
                console.error(e)
              );
            } else if (is.owner) {
              await cht.reply(
                '⚠️ Media dadu belum diset!\nOwner bisa mengaturnya dengan me-reply media (stiker/gambar/video/audio) lalu ketik: .set dadu'
              );
            }

            let buf = await renderUTBoard(
              './toolkit/set/ulartangga.jpg',
              session.players
            );

            let firstPlayer = session.players[0];
            let cap = Data.infos.game.ulartanggaStart(
              firstPlayer.id.split('@')[0],
              '🎲'
            );

            return cht
              .question(
                cap,
                {
                  emit: 'ulartangga',
                  sender: firstPlayer.id,
                  accepts: ['🎲', 'dadu', '.dadu', 'roll', '.roll'],
                  exp: Date.now() + 600000,
                },
                {
                  image: buf,
                  mentions: session.players.map((p) => p.id),
                }
              )
              .then((r) => {
                if (r?.key?.id) {
                  session.keys = session.keys || [];
                  session.keys.push(r.key.id);
                  chatDb.ulartangga = session;
                }
              });
          } else {
            refreshSessionTimeout(session);
            let msg = Data.infos.game.ulartanggaJoined(
              cht.sender.split('@')[0],
              confirmedPlayers.length
            );
            return cht.question(
              msg,
              {
                emit: 'ulartangga',
                exp: Date.now() + 600000,
              },
              { mentions: session.players.map((p) => p.id) }
            );
          }
        } else if (cht.cmd === 'ut' || cht.cmd === 'ulartangga') {
          refreshSessionTimeout(session);
          let playerList = session.players
            .map(
              (p, i) =>
                i +
                1 +
                '. @' +
                p.id.split('@')[0] +
                (p.setuju ? ' ✅' : ' ⏳ (Menunggu)')
            )
            .join('\n');
          let cap =
            `🐍 *LOBBY PERMAINAN ULAR TANGGA* 🐍\n\n` +
            `👤 *Pemain (` +
            session.players.length +
            `/4):*\n` +
            playerList +
            `\n\n📜 *COMMAND PERMAINAN:*\n` +
            `• *.ut join* / *join*\n> Bergabung ke lobby\n` +
            `• *.ut start*\n> Memulai game (Min 2 pemain)\n` +
            `• *.ut cancel* / *cancel*\n> Membatalkan lobby\n` +
            `• *.delsesiut*\n> Hapus / menghentikan sesi game (Pembuat / Admin)`;
          return cht.question(
            cap,
            {
              emit: 'ulartangga',
              exp: Date.now() + 600000,
            },
            { mentions: session.players.map((p) => p.id) }
          );
        }
      } else if (session.status === 'playing') {
        refreshSessionTimeout(session);

        let inputLower = (cht.q || cht.msg || '').trim().toLowerCase();
        let isExplicitStatusCmd = /^(ut|\.ut|ulartangga|\.ulartangga)$/i.test(
          inputLower
        );

        if (isExplicitStatusCmd) {
          let currPlayer = session.players[session.gilir];
          let playerList = session.players
            .map(
              (p, i) =>
                i +
                1 +
                '. @' +
                p.id.split('@')[0] +
                ' — Posisi: Kotak ' +
                p.jalan +
                (session.gilir === i ? ' ⬅️ (Giliran)' : '')
            )
            .join('\n');
          return cht.reply(
            '*[ Game Ular Tangga 🐍 ]*\n\n📊 *POSISI PEMAIN:*\n' +
              playerList +
              '\n\n📜 *COMMAND PERMAINAN:*\n' +
              '• *🎲* / *.dadu* / *media dadu*\n> Melempar dadu (saat giliran)\n' +
              '• *.ut*\n> Cek status & giliran game\n' +
              '• *.delsesiut*\n> Hapus / menghentikan sesi game (Pembuat / Admin)\n\n' +
              '🎯 *Giliran Sekarang:* @' +
              currPlayer.id.split('@')[0] +
              '\n\n• Kirim media dadu atau reply pesan ini dengan emoji dadu (🎲)',
            { mentions: session.players.map((p) => p.id) }
          );
        }

        let currPlayer = session.players[session.gilir];
        if (!currPlayer) {
          session.gilir = 0;
          currPlayer = session.players[0];
        }
        if (!currPlayer) {
          delete chatDb.ulartangga;
          if (Data.ulartangga?.[cht.id]) delete Data.ulartangga[cht.id];
          return cht.reply(
            '⚠️ Sesi Ular Tangga rusak/kadaluwarsa. Silahkan ketik .ut kembali.'
          );
        }
        if (cht.sender !== currPlayer.id) {
          return cht.reply(
            Data.infos.game.ulartanggaTurn(currPlayer.id.split('@')[0]),
            { mentions: [currPlayer.id] }
          );
        }

        let dice = Math.floor(Math.random() * 6) + 1;
        let tota = currPlayer.jalan + dice;
        if (tota > 30) {
          currPlayer.jalan = 30 - (tota - 30);
        } else {
          currPlayer.jalan += dice;
        }

        let rollMsg = Data.infos.game.ulartanggaRoll(
          currPlayer.id.split('@')[0],
          dice
        );

        let specialMsg = '';
        if (currPlayer.jalan === 3) {
          currPlayer.jalan += 19;
          specialMsg = Data.infos.game.ulartanggaLadder(
            currPlayer.id.split('@')[0],
            19
          );
        } else if (currPlayer.jalan === 5) {
          currPlayer.jalan += 3;
          specialMsg = Data.infos.game.ulartanggaLadder(
            currPlayer.id.split('@')[0],
            3
          );
        } else if (currPlayer.jalan === 11) {
          currPlayer.jalan += 15;
          specialMsg = Data.infos.game.ulartanggaLadder(
            currPlayer.id.split('@')[0],
            15
          );
        } else if (currPlayer.jalan === 17) {
          currPlayer.jalan -= 13;
          specialMsg = Data.infos.game.ulartanggaSnake(
            currPlayer.id.split('@')[0],
            13
          );
        } else if (currPlayer.jalan === 19) {
          currPlayer.jalan -= 12;
          specialMsg = Data.infos.game.ulartanggaSnake(
            currPlayer.id.split('@')[0],
            12
          );
        } else if (currPlayer.jalan === 20) {
          currPlayer.jalan += 9;
          specialMsg = Data.infos.game.ulartanggaLadder(
            currPlayer.id.split('@')[0],
            9
          );
        } else if (currPlayer.jalan === 21) {
          currPlayer.jalan -= 12;
          specialMsg = Data.infos.game.ulartanggaSnake(
            currPlayer.id.split('@')[0],
            12
          );
        } else if (currPlayer.jalan === 27) {
          currPlayer.jalan -= 26;
          specialMsg = Data.infos.game.ulartanggaSnake(
            currPlayer.id.split('@')[0],
            26
          );
        }

        let statusNotice = specialMsg ? '\n' + specialMsg : '';

        let buf = await renderUTBoard(
          './toolkit/set/ulartangga.jpg',
          session.players
        );

        if (tota === 30 || currPlayer.jalan >= 30) {
          memories.setItem(
            currPlayer.id,
            'energy',
            (memories.getItem(currPlayer.id, 'energy') || 0) + 25
          );
          await Exp.sendMessage(
            cht.id,
            {
              image: buf,
              caption:
                rollMsg +
                statusNotice +
                '\n\n' +
                Data.infos.game.ulartanggaWin(currPlayer.id.split('@')[0], 25),
              mentions: [currPlayer.id],
            },
            { quoted: cht }
          );
          clearUTTimer(cht.id);
          let delKeys = session.keys || [];
          delete chatDb.ulartangga;
          if (Data.ulartangga?.[cht.id]) delete Data.ulartangga[cht.id];
          for (let kid of delKeys) {
            Exp.sendMessage(cht.id, {
              delete: {
                remoteJid: cht.id,
                fromMe: true,
                id: kid,
                participant: Exp.user?.id,
              },
            }).catch(() => {});
          }
          return;
        }

        session.gilir = (session.gilir + 1) % session.players.length;
        chatDb.ulartangga = session;

        let nextPlayer = session.players[session.gilir];
        let cap = Data.infos.game.ulartanggaNextTurn(
          currPlayer.id.split('@')[0],
          nextPlayer.id.split('@')[0],
          statusNotice,
          rollMsg
        );

        return cht
          .question(
            cap,
            {
              emit: 'ulartangga',
              sender: nextPlayer.id,
              accepts: ['🎲', 'dadu', '.dadu', 'roll', '.roll'],
              exp: Date.now() + 600000,
            },
            {
              image: buf,
              mentions: [currPlayer.id, nextPlayer.id],
            }
          )
          .then((r) => {
            if (r?.key?.id) {
              session.keys = session.keys || [];
              session.keys.push(r.key.id);
              chatDb.ulartangga = session;
            }
          });
      }
    }
  );

  ev.on(
    {
      cmd: ['delsesiut', 'delulartangga'],
      listmenu: ['delsesiut'],
      tag: 'game',
    },
    async () => {
      let chatDb = (preferences[cht.id] ??= {});
      let session = chatDb.ulartangga || Data.ulartangga?.[cht.id];
      if (!session) return cht.reply(Data.infos.game.ulartanggaNoSession);
      let isCreator = cht.sender === session.creator;
      let isAdmin = is.groupAdmins || is.owner;
      if (!isCreator && !isAdmin) {
        return cht.reply(
          `❌ Hanya Pembuat Game (@${session.creator.split('@')[0]}) atau Admin Grup yang dapat menghapus sesi Ular Tangga!`,
          { mentions: [session.creator] }
        );
      }
      clearUTTimer(cht.id);
      let delKeys = session.keys || [];
      delete chatDb.ulartangga;
      if (Data.ulartangga?.[cht.id]) delete Data.ulartangga[cht.id];
      for (let kid of delKeys) {
        Exp.sendMessage(cht.id, {
          delete: {
            remoteJid: cht.id,
            fromMe: true,
            id: kid,
            participant: Exp.user?.id,
          },
        }).catch(() => {});
      }
      return cht.reply(Data.infos.game.ulartanggaDeleted);
    }
  );

  ev.on(
    {
      cmd: ['cek'],
      listmenu: [
        'cek femboy',
        'cek imut',
        'cek malas',
        'cek wibu',
        'cek psikopat',
        'cek kaya',
        'cek sabar',
        'cek pintar',
        'cek hoki',
        'cek overpower',
        'cek gacha',
        'cek karbit',
        'cek setia',
        'cek ganteng',
        'cek cantik',
        'cek jomblo',
      ],
      args: 'Mau cek apa? femboy atau imut ??',
      tag: 'CEK',
      energy: 15,
      premium: false,
    },
    async ({ cht, args }) => {
      const action = cht.cmd;

      const mentioned = cht.mention?.[0] || cht.sender;

      const targetName =
        mentioned === cht.sender
          ? cht.pushName || 'Kamu'
          : `@${mentioned.split('@')[0]}`;

      const percent = Math.floor(Math.random() * 101);

      let [mode] = args.split(' ');

      let title = `Cek ${mode}`;
      const DATA = {
        imut: [
          {
            min: 90,
            desc: 'IMUT BANGET! Kawaii~~ 🥺💕',
            img: 'https://c.termai.cc/i151/kXJq.jpg',
          },
          {
            min: 70,
            desc: 'Imutnya kebangetan! 😍',
            img: 'https://c.termai.cc/i134/rrfUp.jpg',
          },
          {
            min: 50,
            desc: 'Lumayan imut~ 🌸',
            img: 'https://c.termai.cc/i141/ALSB3Z.jpg',
          },
          {
            min: 30,
            desc: 'Ada imutnya dikit 😊',
            img: 'https://c.termai.cc/i152/0VDd.jpg',
          },
          {
            min: 0,
            desc: 'Ireng gitu mau jadi imut',
            img: 'https://c.termai.cc/i106/wfsw4.jpg',
          },
        ],
        femboy: [
          {
            min: 80,
            desc: 'FEMBOY DEWA 🔥💖',
            img: 'https://c.termai.cc/i191/3QyqZm.jpg',
          },
          {
            min: 60,
            desc: 'Femboy sejati 💅✨',
            img: 'https://c.termai.cc/i130/SefU0t.jpg',
          },
          {
            min: 40,
            desc: 'Lumayan femboy 😘',
            img: 'https://c.termai.cc/i165/k78.jpg',
          },
          {
            min: 20,
            desc: 'Ada aura lembutnya dikit~ 🌸',
            img: 'https://c.termai.cc/i123/GoiaZi.jpg',
          },
          {
            min: 0,
            desc: 'Cowok banget! 😎',
            img: 'https://c.termai.cc/i126/RAJp8om.jpg',
          },
        ],
        malas: [
          {
            min: 80,
            desc: 'Pemalas inimah',
            img: 'https://c.termai.cc/v166/VLLQUy.mp4',
          },
          {
            min: 60,
            desc: 'Malas tingkat lanjut',
            img: 'https://c.termai.cc/i193/PaeLfQd.jpg',
          },
          {
            min: 40,
            desc: 'Malas tingkat menengah',
            img: 'https://c.termai.cc/i126/P3RrQ4R.jpg',
          },
          {
            min: 20,
            desc: 'Mulai keliatan malas',
            img: 'https://c.termai.cc/i122/QDnH.jpg',
          },
          {
            min: 0,
            desc: 'Produktif banget inimah',
            img: 'https://c.termai.cc/i111/lGL.jpg',
          },
        ],
        wibu: [
          {
            min: 80,
            desc: 'Wibu Sejati',
            img: 'https://c.termai.cc/i168/n3jVgQ.jpg',
          },
          {
            min: 60,
            desc: 'Wibu Akut',
            img: 'https://c.termai.cc/i167/v0tCy.jpg',
          },
          {
            min: 40,
            desc: 'Wibu Bau Bawang',
            img: 'https://c.termai.cc/i161/b2m.jpg',
          },
          {
            min: 20,
            desc: 'Mulai kerasa aura wibunya',
            img: 'https://c.termai.cc/i122/iuTKy3.jpg',
          },
          {
            min: 0,
            desc: 'Normies inimah',
            img: 'https://c.termai.cc/i124/0ShP.jpg',
          },
        ],
        psikopat: [
          {
            min: 86,
            desc: 'PSIKOPAT AKUT! Jauhi! 😈',
            img: 'https://c.termai.cc/i125/cdje.jpg',
          },
          {
            min: 65,
            desc: 'Hati-hati sama orang ini 👀',
            img: 'https://c.termai.cc/i193/4N0h9Bf.jpg',
          },
          {
            min: 36,
            desc: 'Ada sisi gelapnya 🌑',
            img: 'https://c.termai.cc/i100/unWz.jpg',
          },
          {
            min: 15,
            desc: 'Sedikit misterius 🤔',
            img: 'https://c.termai.cc/i140/KfWi.jpg',
          },
          {
            min: 0,
            desc: 'Orang Baik  😇',
            img: 'https://c.termai.cc/i125/xl9hHpA.jpg',
          },
        ],
        kaya: [
          { min: 90, desc: 'Sultan! Crazy rich! 💎 👑' },
          { min: 70, desc: 'Tajir melintir! 💰 💎' },
          { min: 50, desc: 'Lumayan berada 💵 💰' },
          { min: 30, desc: 'Cukup lah buat hidup 😊 💵' },
          { min: 0, desc: 'Semangat nabung! 🙏 🪙' },
        ],
        pintar: [
          { min: 150, desc: 'JENIUS! Einstein level! 🧠✨' },
          { min: 130, desc: 'Sangat cerdas! 🎓' },
          { min: 110, desc: 'Di atas rata-rata! 👍' },
          { min: 90, desc: 'Normal, rata-rata 😊' },
          { min: 0, desc: 'Tetap semangat belajar! 📚' },
        ],
        sabar: [
          {
            min: 90,
            desc: 'Sabar level dewa! Zen master~ 🧘',
            img: 'https://c.termai.cc/i146/VrhP2.jpg',
          },
          {
            min: 70,
            desc: 'Sangat sabar! Terpuji 👏',
            img: 'https://c.termai.cc/i114/csJ.jpg',
          },
          {
            min: 50,
            desc: 'Cukup sabar 😊',
            img: 'https://c.termai.cc/i187/L8CI.jpg',
          },
          {
            min: 30,
            desc: 'Kadang emosian dikit ',
            img: 'https://c.termai.cc/i156/TID85.jpg',
          },
          {
            min: 0,
            desc: 'Gampang marah nih... 😤',
            img: 'https://c.termai.cc/i114/csJ.jpg',
          },
        ],
        overpower: [
          { min: 90, desc: 'OVERPOWER BANGET! LEGEND! 👑🔥' },
          { min: 70, desc: 'Kuat banget nih! 💪' },
          { min: 50, desc: 'Lumayan strong~ 😎' },
          { min: 30, desc: 'Biasa aja sih 🤔' },
          { min: 0, desc: 'Masih perlu latihan 📝' },
        ],
        hoki: [
          { min: 90, desc: 'HOKI DEWA! Main gacha pasti menang! 🍀✨' },
          { min: 70, desc: 'Hoki banget! 🎰' },
          { min: 50, desc: 'Lumayan hoki 🍀' },
          { min: 30, desc: 'Sedikit hoki 😊' },
          { min: 0, desc: 'Sabar ya, lagi apes 😅' },
        ],
        gacha: [
          { min: 90, desc: 'HOKI PARAH! SSR GUARANTEED! ✨💎' },
          { min: 70, desc: 'Lucky! Pasti dapet SR keatas! 🍀' },
          { min: 50, desc: 'Hoki-hoki dikit 😊' },
          { min: 30, desc: 'Hmm... pray harder! 🙏' },
          { min: 0, desc: 'SIAL! Nanti aja gachanya! 💔' },
        ],
        karbit: [
          {
            min: 90,
            desc: 'KARBIT SEJATI! Semua waifu diklaim punya sendiri 😭👑',
            img: 'https://c.termai.cc/i163/BLZjyB.jpg',
          },
          {
            min: 70,
            desc: 'Karbit parah! Baru muncul langsung di-claim 💀',
            img: 'https://c.termai.cc/i147/Alyg.jpg',
          },
          {
            min: 50,
            desc: 'Lumayan karbit, waifu favorit mulai banyak 😭',
            img: 'https://c.termai.cc/i182/RVK2q.jpg',
          },
          {
            min: 30,
            desc: 'Ada jiwa karbitnya dikit 😂',
            img: 'https://c.termai.cc/i182/RVK2q.jpg',
          },
          {
            min: 0,
            desc: 'Masih aman, belum banyak claim waifu 😇',
            img: 'https://c.termai.cc/i128/ncmORW.jpg',
          },
        ],
        setia: [
          {
            min: 90,
            desc: 'SETIA MATI! Idaman banget! 💍❤️',
            img: 'https://c.termai.cc/i141/ALSB3Z.jpg',
          },
          {
            min: 70,
            desc: 'Sangat setia! Patut dijaga 💖',
            img: 'https://c.termai.cc/i152/0VDd.jpg',
          },
          {
            min: 50,
            desc: 'Cukup setia kok 😊',
            img: 'https://c.termai.cc/i134/rrfUp.jpg',
          },
          {
            min: 30,
            desc: 'Mulai lirik-lirik yang lain 👀',
            img: 'https://c.termai.cc/i156/TID85.jpg',
          },
          {
            min: 0,
            desc: 'Buaya darat terdeteksi! 🐊💀',
            img: 'https://c.termai.cc/i106/wfsw4.jpg',
          },
        ],
        ganteng: [
          { min: 90, desc: 'GANTENG BANGET! Mirip idol K-Pop! ✨😎' },
          { min: 70, desc: 'Ganteng di atas rata-rata! 😎' },
          { min: 50, desc: 'Lumayan manis lah 😊' },
          { min: 30, desc: 'Manis dikit kalau senyum 😉' },
          { min: 0, desc: 'Yang penting hatinya baik! 😇' },
        ],
        cantik: [
          { min: 90, desc: 'CANTIK BANGET! Bidadari turun ke bumi! 🌸👑' },
          { min: 70, desc: 'Cantik mempesona! ✨💖' },
          { min: 50, desc: 'Manis dan enak dilihat 😊' },
          { min: 30, desc: 'Cantik natural dikit 🌸' },
          { min: 0, desc: 'Pesona dari dalam yang utama! 😇' },
        ],
        jomblo: [
          { min: 90, desc: 'JOMBLO ABADI! KTP-nya jomblo seumur hidup 😂' },
          { min: 70, desc: 'Jomblo berkarat tapi tetep santai 😎' },
          { min: 50, desc: 'Lagi nyaman sendiri dulu ☕' },
          { min: 30, desc: 'Ada yang lagi diincer nih 👀' },
          { min: 0, desc: 'Bukan jomblo, udah ada ayang! 👩‍❤️‍👨' },
        ],
      };
      if (!DATA[mode]) return cht.reply(`Cek ${mode} tidak ada!`);

      const getMatch = (type) => DATA[type].find((item) => percent >= item.min);

      let { desc, img } = getMatch(mode);

      const text =
        mentioned === cht.sender
          ? `╭━━━〔 ${title} 〕━━━⬣\n┃\n┃ 👤 @${mentioned.split('@')[0]}\n┃\n┃ 📊 Persentase: *${percent}%*\n┃\n┃ 💬 ${desc}\n┃\n╰━━━━━━━━━━━━━━━━⬣`
          : `╭━━━〔 ${title} 〕━━━⬣\n┃\n┃ 👤 Target: @${mentioned.split('@')[0]}\n┃\n┃ 📊 Persentase: *${percent}%*\n┃\n┃ 💬 ${desc}\n┃\n╰━━━━━━━━━━━━━━━━⬣`;
      Exp.sendMessage(
        cht.id,
        {
          [img ? 'image' : 'text']: img ? { url: img } : text,
          ...(img ? { caption: text } : {}),
          mentions: [mentioned],
        },
        {}
      );
    }
  );
}
