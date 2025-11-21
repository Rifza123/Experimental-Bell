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

export default async function on({ Exp, cht, ev, chatDb }) {
  const { id } = cht;
  const { func } = Exp;
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

  let metadata = Data.preferences[id];
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
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
        delete Data.preferences[id].game;
        delete global.timeouts[id];

        await cht.reply(`*WAKTU HABIS*

Jawaban: 
${answer.map((item, index) => `${index + 1}. ${item} ${index == 0 ? '\`TOP SURVEY\`' : ''} (${((cfg.hadiah[cht.cmd] * (index == 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)`).join('\n')}
`);
        let { answered } = Data.preferences[id].game;
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

      let games = Data.preferences[cht.id]?.chess || {};
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

        Data.preferences[cht.id].chess = games;
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
        Data.preferences[cht.id].chess = games;
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
          Data.preferences[cht.id].chess = games;
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
          Data.preferences[cht.id].chess = games;
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
            Data.preferences[cht.id].chess = games;
            return cht.reply(
              `🏆 SKAKMAT! Pemenang: ${player.color.toUpperCase()}`
            );
          }

          if (chess.isDraw()) {
            delete games[roomName];
            Data.preferences[cht.id].chess = games;
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
        Data.preferences[cht.id].chess = games;
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

      let sessions = Data.preferences[chatId].sos || {};

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
        Data.preferences[chatId].sos = sessions;
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
        Data.preferences[chatId].sos = sessions;
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
        Data.preferences[chatId].sos = sessions;
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
        Data.preferences[chatId].sos = sessions;
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
        Data.preferences[chatId].sos[roomName] = room;
        return cht.reply(`${boardText}\nGiliran: ${room.turn}`);
      }

      return cht.reply(
        '❌ Perintah tidak dikenal. Gunakan `.sos help` untuk melihat daftar perintah.'
      );
    }
  );
}
