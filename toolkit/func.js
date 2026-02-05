const {
  jidDecode,
  downloadContentFromMessage,
  generateWAMessageContent,
  getBinaryNodeChild,
  getBinaryNodeChildren,
  getContentType,
} = 'baileys'.import();
const fs = 'fs'.import();
const axios = 'axios'.import();
const https = 'https'.import();
const http = await 'http'.import();
const moment = 'timezone'.import();
const path = 'path'.import();
const zlib = await 'zlib'.import();
const stream = await 'stream'.import();
const { pipeline } = stream;
const { spawn, exec } = 'child'.import();
const os = await 'os'.import();
const process = await 'process'.import();
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss');
const { ArchiveMemories } = await (fol[0] + 'usr.js').r();
const { Inventory } = await (fol[0] + 'inventory.js').r();
const { color, bgcolor } = await `${fol[0]}color.js`.r();
const { URL } = await 'url'.import();
const groupDir = './toolkit/db/groups/';
if (!fs.existsSync(groupDir)) {
  fs.mkdirSync(groupDir, { recursive: true });
}
/*const cache = new Map();
const CACHE_DURATION = 1 * 60 * 1000;
*/
let METADATA_RETRIEVAL_DISTANCE = 15000;

async function getDirectoriesRecursive(
  dir = './',
  ignoredDirs = ['node_modules', '.git', '.config', '.npm', '.pm2', 'test.fio']
) {
  const items = await fs.promises.readdir(dir, { withFileTypes: true });

  return (
    await Promise.all(
      items
        .filter(
          (item) => item.isDirectory() && !ignoredDirs.includes(item.name)
        )
        .map(async (item) => {
          const folderPath = `./${path.join(dir, item.name)}/`;
          return [
            folderPath,
            ...(await getDirectoriesRecursive(
              path.join(dir, item.name),
              ignoredDirs
            )),
          ];
        })
    )
  ).flat();
}

export class func {
  constructor({ Exp, store, groupMetadata }) {
    this.Exp = Exp;
    this.store = store;
    this.groupMetadata = groupMetadata;
    this._metadata = {
      init: false,
    };
  }

  init(config) {
    if (typeof config !== 'object') return 'Invalid Object!';
    for (let i of Object.keys(config)) {
      this[i] = config[i];
    }
    return this;
  }

  normalizeSender(jid) {
    return jid.split('@')[0].split(':')[0] + '@' + jid.split('@')[1];
  }

  async getSender(jid, { cht, lid = false }) {
    if (!jid) return jid;
    const { Exp } = this;
    let { user, server } = jidDecode(jid) || {};
    let { participant, participantAlt, remoteJid, remoteJidAlt } =
      cht?.key || {};
    if (/:\d+@/gi.test(jid)) {
      jid = user && server ? `${user}@${server}` : jid;
    }
    const isGroup = cht?.id?.endsWith('@g.us');
    let Alt = remoteJidAlt || participantAlt;
    const isSenderCht = [
      participant,
      participantAlt,
      remoteJid,
      remoteJidAlt,
    ].some((a) => a?.split('@')[0] === user);

    try {
      if (cht && Alt && isSenderCht) {
        const { server: serverAlt } = jidDecode(Alt) || {};
        !isGroup &&
          serverAlt === 's.whatsapp.net' &&
          server === 'lid' &&
          this.lid({ lid: jid, id: Alt || jid });

        return this.normalizeSender(
          server === 'lid' ? (lid ? jid : Alt || jid) : lid ? Alt : jid
        );
      }

      let meta = isGroup ? await this.getGroupMetadata(cht.id) : null;
      //console.log(meta)
      let participants =
        meta?.adressingMode == 'lid' ? meta.participants : this.lid();

      let v = participants.find(
        (a) =>
          (a.id || '').split('@')[0] === user ||
          (a.lid || '').split('@')[0] === user
      );
      //console.log({ v })
      if (!v) {
        participants = this.lid();
        v = participants.find(
          (a) =>
            (a.id || '').split('@')[0] === user ||
            (a.lid || '').split('@')[0] === user
        );
        //console.log({ v2: v })
      }

      if (!v) return this.normalizeSender(jid);
      if (lid) return this.normalizeSender(v.lid || jid);
      return this.normalizeSender(v.id || jid);
    } catch (e) {
      console.error('Error in func > getSender:', e);
      return this.normalizeSender(jid);
    }
  }

  async getMentions(cht, lid = false) {
    const type = getContentType(cht?.message);
    const ctx = cht?.message?.[type]?.contextInfo || {};

    return Promise.all(
      (cht.q && cht.q.extractMentions().length > 0
        ? cht.q.extractMentions().filter((a) => {
            const n = a?.split('@')[0];
            return n && n.length > 5 && n.length <= 15;
          })
        : ctx.mentionedJid?.length > 0
          ? ctx.mentionedJid
          : ctx.participantPn || ctx.participant
            ? [ctx.participantPn || ctx.participant]
            : []
      ).map((m) => this.getSender(m, { lid, cht }))
    );
  }

  getType = (type) => {
    return type === 'stickerMessage'
      ? 'sticker'
      : type === 'videoMessage'
        ? 'video'
        : type === 'liveLocationMessage'
          ? 'liveLocation'
          : type === 'locationMessage'
            ? 'location'
            : type === 'documentMessage'
              ? 'document'
              : type === 'audioMessage'
                ? 'audio'
                : type === 'imageMessage'
                  ? 'image'
                  : type === 'viewOnceMessage'
                    ? 'viewOnce'
                    : type === 'viewOnceMessageV2'
                      ? 'viewOnce'
                      : type;
  };

  getGroupAdmins = (participants) => {
    return participants
      .filter((participant) => participant.admin !== null)
      .map((participant) => participant.id);
  };

  lid(data) {
    if (!data) return Data.lids;

    const items = Array.isArray(data) ? data : [data];
    let added = 0;
    let skipped = 0;
    let errors = [];

    const oldData = JSON.parse(JSON.stringify(Data.lids));

    for (let item of items) {
      if (!item || typeof item !== 'object') {
        errors.push('❌ Input harus object { lid, id } atau array object');
        skipped++;
        continue;
      }

      if (!item.lid || !item.id) {
        errors.push(
          `⚠️ Item tidak valid: ${JSON.stringify(item)} (wajib ada 'lid' & 'id')`
        );
        skipped++;
        continue;
      }

      const exists = Data.lids.findIndex(
        (x) => x.lid === item.lid && x.id === item.id
      );

      if (exists === -1) {
        Data.lids.push({ lid: item.lid, id: item.id });
        added++;
      } else {
        skipped++;
      }
    }

    const newData = Data.lids;

    const summary =
      `\x1b[36m[LID Manager]\x1b[0m ` +
      `${added > 0 ? `\x1b[32m✅ Ditambahkan: ${added}\x1b[0m` : ''}` +
      `${skipped > 0 ? ` \x1b[34m➜ Dilewati: ${skipped}\x1b[0m` : ''}` +
      `${errors.length ? ` \x1b[33m⚠️ Error: ${errors.length}\x1b[0m` : ''}`;

    this.deepDiff({
      oldData,
      newData,
    });

    return summary.trim();
  }

  async replaceLidToPn(text, cht) {
    const lids = text.extractMentions().map((a) => a.split('@')[0] + '@lid');
    const results = await Promise.all(
      lids.map(async (lid) => {
        const id = lid.split('@')[0];
        const newVal = (await this.getSender(lid, { cht })).split('@')[0];
        text = text.replace(new RegExp(id, 'g'), newVal);
        return newVal;
      })
    );
    return text;
  }

  metadata = {
    init: () => {
      if (!this._metadata.init) {
        for (let file of this.metadata.keys()) {
          const id = file.replace(/\.json$/, '');
          this._metadata[id] = this.metadata.get(id);
        }
        this._metadata.init = true;
      }
    },

    has: (id) => {
      return fs.existsSync(groupDir + id + '.json');
    },

    keys: () => {
      return fs.readdirSync(groupDir);
    },

    set: (id, data) => {
      try {
        let meta = this._metadata[id] || { metadata: {} };
        let { metadata: oldData } = meta;
        console.log(
          `${this.color.blue('[GROUP_METADATA_MANAGER]')}\n` +
            `  ${this.color.white('Group :')} ${this.color.cyan(data.metadata.subject)}\n` +
            `  ${this.color.white('Changes:')}\n`,
          this.deepDiff({
            oldData,
            newData: data.metadata,
            type: 'text',
          })
        );

        this._metadata[id] = data;
        fs.writeFileSync(groupDir + id + '.json', JSON.stringify(data));
        return true;
      } catch (e) {
        console.error(`Error in metadata > set > ${id}`, e);
        return false;
      }
    },

    delete: (id) => {
      if (this._metadata[id]) {
        delete this._metadata[id];
      }

      try {
        if (this.metadata.has(id)) {
          fs.unlinkSync(groupDir + id + '.json');
          return true;
        }
      } catch (e) {
        console.error(`Error in metadata > delete > ${id}`, e);
      }
      return false;
    },

    get: (id) => {
      if (this._metadata[id]) return this._metadata[id];

      try {
        if (this.metadata.has(id)) {
          const raw = fs.readFileSync(groupDir + id + '.json', 'utf-8');
          return JSON.parse(raw);
        }
      } catch (e) {
        console.error(`Error in metadata > get > ${id}, resetting...`, e);

        this.metadata.delete(id);

        return this._metadata[id];
      }

      return this._metadata[id];
    },

    all: () => {
      this.metadata.init();
      return Object.fromEntries(
        Object.entries(this._metadata).filter(
          ([_, v]) => v && typeof v === 'object' && !Array.isArray(v)
        )
      );
    },
  };

  getGroupMetadata = async (chtId, update = false, force = false) => {
    this.metadata.init();
    let hasData = this.metadata.has(chtId);
    let now = Date.now();
    let metadata = this.metadata.get(chtId);
    /*
      if (hasData && now - metadata.timestamp < CACHE_DURATION) {
        return metadata.metadata;
      }
    */
    if (hasData && !update) return metadata.metadata;
    //console.log({ chtId, update, force })
    if (hasData && !force) {
      let index = Data.queueMetadata.findIndex((a) => a.id == chtId);

      if (index >= 0) {
        //biar gak duplikat, 1 grup 1x update aja
        Data.queueMetadata[index].run = () =>
          this.getGroupMetadata(chtId, true, true);
      } else {
        //masukin ke queue biar gak kena limit
        Data.queueMetadata.push({
          id: chtId,
          run: () => this.getGroupMetadata(chtId, true, true),
        });

        console.log(
          `${this.color.blue('[GROUP_METADATA_MANAGER]')}\n` +
            `  Queue: ${chtId}\n` +
            `  Status: Waiting`
        );
      }

      return metadata.metadata;
    }

    let groupMetadata;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        groupMetadata = await this.groupMetadata(chtId);
        break;
      } catch (err) {
        console.error(
          `getGroupMetadata: percobaan ${attempt} gagal saat get`,
          err
        );
        if (attempt === 2) throw err;
        await sleep(5000);
      }
    }

    if (groupMetadata.addressingMode == 'lid') {
      const group = await getBinaryNodeChild(
        await this.Exp.query({
          tag: 'iq',
          attrs: {
            type: 'get',
            xmlns: 'w:g2',
            to: chtId,
          },
          content: [{ tag: 'query', attrs: { request: 'interactive' } }],
        }),
        'group'
      );

      groupMetadata.participants = await getBinaryNodeChildren(
        group,
        'participant'
      ).map(({ attrs }) => {
        return {
          id: attrs.phone_number,
          lid: attrs.lid || attrs.jid,
          admin: attrs.type || null,
        };
      });
      console.log(this.lid(groupMetadata.participants));
    }

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        this.metadata.set(chtId, {
          metadata: groupMetadata,
          timestamp: now,
        });
        break;
      } catch (err) {
        console.error(
          `getGroupMetadata: percobaan ${attempt} gagal saat set metadata`,
          err
        );
        if (attempt === 2) throw err;
      }
    }
    return groupMetadata;
  };

  async downloadSave(message, filename) {
    const mime = message.mimetype || '';
    const messageType = message.mtype
      ? message.mtype.replace(/Message/gi, '')
      : mime.split('/')[0];

    const stream = await downloadContentFromMessage(message, messageType);

    const writeStream = fs.createWriteStream(filename);

    for await (const chunk of stream) {
      writeStream.write(chunk);
    }

    await new Promise((resolve, reject) => {
      writeStream.end(resolve);
      writeStream.on('error', reject);
    });

    return filename;
  }

  async download(message, MessageType) {
    const stream = await downloadContentFromMessage(message, MessageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  }

  tagReplacer(text, obj) {
    return text.replace(/<([^>]+)>/g, (_, tag) => {
      return obj[tag] !== undefined ? obj[tag] : `<${tag}>`;
    });
  }
  getListTag(text) {
    return [...text.matchAll(/<([^>]+)>/g)].map((m) => m[1]);
  }

  menuFormatter(data, framesConfig) {
    const { frames, tags: tagNames, prefix = '.' } = framesConfig;

    const normalized = {};
    for (const item of Object.values(data || {})) {
      if (!item || !item.tag) continue;

      const tag = item.tag;
      if (!normalized[tag]) normalized[tag] = new Set();

      let menus = item.listmenu;

      if (menus === true) menus = item.cmd;
      if (!menus) continue;

      if (Array.isArray(menus)) {
        menus.forEach((m) => m && normalized[tag].add(m));
      } else {
        normalized[tag].add(menus);
      }
    }

    Object.keys(normalized).forEach((tag) => {
      normalized[tag] = Array.from(normalized[tag]);
    });

    const orderedTags = [
      ...Object.keys(tagNames || {}),
      ...Object.keys(normalized).filter((t) => !(tagNames || {})[t]),
    ];

    let result = '';

    orderedTags.forEach((tag) => {
      const menus = normalized[tag];
      if (!menus || !menus.length) return;

      const displayName = tagNames?.[tag] || `*<${tag}>*`;

      result += `${frames.head}${frames.brackets[0]} ${displayName} ${frames.brackets[1]}\n`;

      menus.forEach((menu) => {
        result += `${frames.body} ${prefix}${menu}\n`;
      });

      result += `${frames.foot}\n\n`;
    });

    return result.trim();
  }

  getTotalCmd = () => {
    return JSON.parse(JSON.stringify(Data.use.cmds, null, 2));
  };

  addCmd = () => {
    Data.use.cmds.total += 1;
    fs.writeFileSync(
      `${fol[5]}cmd.json`,
      JSON.stringify(Data.use.cmds, null, 2)
    );
  };

  addAiResponse = () => {
    Data.use.cmds.ai_response += 1;
    fs.writeFileSync(
      `${fol[5]}cmd.json`,
      JSON.stringify(Data.use.cmds, null, 2)
    );
  };

  addCMDForTop = async (NAMEQ) => {
    try {
      let cekhN = Data.use.cmds.cmd.find((i) => i.name == NAMEQ) || false;
      if (cekhN) {
        let cemed = Data.use.cmds.cmd.find((i) => i.name == NAMEQ);
        var ussd = Data.use.cmds.cmd.indexOf(cemed);
        Data.use.cmds.cmd[ussd].use += 1;
        Data.use.cmds.cmd[ussd].times = time;
        fs.writeFileSync(
          `${fol[5]}cmd.json`,
          JSON.stringify(Data.use.cmds, null, 2)
        );
      } else {
        Data.use.cmds.cmd.push({
          name: NAMEQ,
          use: 1,
          times: time,
        });
        await fs.writeFileSync(
          `${fol[5]}cmd.json`,
          JSON.stringify(Data.use.cmds, null, 2)
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  cmds = () => {
    return Object.entries(Data.use.cmds.cmd).sort(
      (a, b) => b[1].use - a[1].use
    );
  };

  topCmd = (i = 10) => {
    const LIST_TOP = this.cmds()
      .slice(0, i)
      .map(
        ([name, data]) => `${prefix}${data.name}(${data.use}) || ${data.times}`
      );
    return LIST_TOP;
  };

  async getBuffer(url, options = {}, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;

      const req = client.get(url, options, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          if (maxRedirects === 0) {
            return reject(new Error('Too many redirects'));
          }

          const redirectUrl = new URL(
            response.headers.location,
            url
          ).toString();
          return resolve(
            this.getBuffer(redirectUrl, options, maxRedirects - 1)
          );
        }

        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      });

      req.on('error', reject);
    });
  }

  async saveToFile(url, filePath, options = {}, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
      if (!filePath) filePath = './toolkit/db/' + Date.now() + '.bin';
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;

      const req = client.get(url, options, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          if (maxRedirects === 0)
            return reject(new Error('Too many redirects'));

          const redirectUrl = new URL(
            response.headers.location,
            url
          ).toString();
          return resolve(
            this.saveToFile(redirectUrl, filePath, options, maxRedirects - 1)
          );
        }

        if (response.statusCode !== 200) {
          return reject(new Error(`HTTP status ${response.statusCode}`));
        }

        const fileStream = fs.createWriteStream(filePath);

        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close(() => {
            setTimeout(() => {
              fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                  console.error('Gagal hapus file:', err);
                }
              });
            }, 60000 * 5);

            resolve(filePath);
          });
        });

        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => reject(err));
        });

        response.on('error', reject);
      });

      req.on('error', reject);
    });
  }

  compareTwoStrings(first, second) {
    first = first.replace(/\s+/g, '');
    second = second.replace(/\s+/g, '');

    if (first === second) return 1;
    if (first.length < 2 || second.length < 2) return 0;

    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

      firstBigrams.set(bigram, count);
    }

    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2);
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

      if (count > 0) {
        firstBigrams.set(bigram, count - 1);
        intersectionSize++;
      }
    }

    return (2.0 * intersectionSize) / (first.length + second.length - 2);
  }

  areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== 'string') return false;
    if (!Array.isArray(targetStrings)) return false;
    if (!targetStrings.length) return false;
    if (
      targetStrings.find(function (s) {
        return typeof s !== 'string';
      })
    )
      return false;
    return true;
  }

  findBestMatch(mainString, targetStrings) {
    if (!this.areArgsValid(mainString, targetStrings))
      throw new Error(
        'Bad arguments: First argument should be a string, second should be an array of strings'
      );

    const ratings = [];
    let bestMatchIndex = 0;

    for (let i = 0; i < targetStrings.length; i++) {
      const currentTargetString = targetStrings[i];
      const currentRating = this.compareTwoStrings(
        mainString,
        currentTargetString
      );
      ratings.push({ target: currentTargetString, rating: currentRating });
      if (currentRating > ratings[bestMatchIndex].rating) {
        bestMatchIndex = i;
      }
    }

    const bestMatch = ratings[bestMatchIndex];

    return {
      ratings: ratings,
      bestMatch: bestMatch,
      bestMatchIndex: bestMatchIndex,
    };
  }

  searchSimilarStrings = async (query, data, threshold) => {
    return data
      .map((item, index) => {
        const similarity = this.compareTwoStrings(query, item.toLowerCase());
        return { item, similarity, index };
      })
      .filter((result) => result.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);
  };

  getTopSimilar = (arr) =>
    arr.reduce(
      (highest, item) =>
        item.similarity > highest.similarity ? item : highest,
      { similarity: -Infinity }
    );

  newDate = () => {
    const now = moment.tz('Asia/Jakarta');
    const dayNames = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    const indoMonthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    const dayName = dayNames[now.day()];
    const indoDayName = dayNames[now.day()];
    const indoMonthName = indoMonthNames[now.month()];
    const dayNumber = now.format('DD');
    const year = now.format('YYYY');
    const formattedTime = now.format('HH:mm:ss');

    const wetonIndex = (now.day() + now.month() + now.year()) % 5;
    const wetonNames = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const wetonJawa = wetonNames[wetonIndex];

    const combinedResult = `${indoDayName} ${wetonJawa}, ${dayNumber} ${indoMonthName} ${year}, ${formattedTime}`;
    return combinedResult;
  };

  archiveMemories = ArchiveMemories;
  toZeroIfInfinity(value) {
    return Number.isFinite(value) ? value : 0;
  }

  parseNumber(milliseconds) {
    return {
      days: Math.trunc(milliseconds / 86_400_000),
      hours: Math.trunc((milliseconds / 3_600_000) % 24),
      minutes: Math.trunc((milliseconds / 60_000) % 60),
      seconds: Math.trunc((milliseconds / 1000) % 60),
      milliseconds: Math.trunc(milliseconds % 1000),
      microseconds: Math.trunc(
        this.toZeroIfInfinity(milliseconds * 1000) % 1000
      ),
      nanoseconds: Math.trunc(this.toZeroIfInfinity(milliseconds * 1e6) % 1000),
    };
  }

  parseBigint(milliseconds) {
    return {
      days: milliseconds / 86_400_000n,
      hours: (milliseconds / 3_600_000n) % 24n,
      minutes: (milliseconds / 60_000n) % 60n,
      seconds: (milliseconds / 1000n) % 60n,
      milliseconds: milliseconds % 1000n,
      microseconds: 0n,
      nanoseconds: 0n,
    };
  }

  formatDuration = (milliseconds) => {
    switch (typeof milliseconds) {
      case 'number': {
        if (Number.isFinite(milliseconds)) {
          return this.parseNumber(milliseconds);
        }
        break;
      }

      case 'bigint': {
        return this.parseBigint(milliseconds);
      }
    }

    throw new TypeError('Expected a finite number or bigint');
  };
  getRandomValue = (min, max) => min + Math.random() * (max - min);

  dateFormatter = (time, timezone) => {
    const validTimezones = ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'];
    if (!validTimezones.includes(timezone)) {
      return `Timezone invalid!, Look this: ${validTimezones.join(', ')}`;
    }
    const options = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(new Date(time));

    const day = parts.find((part) => part.type === 'day').value;
    const month = parts.find((part) => part.type === 'month').value;
    const year = parts.find((part) => part.type === 'year').value;
    const hours = parts.find((part) => part.type === 'hour').value;
    const minutes = parts.find((part) => part.type === 'minute').value;
    const seconds = parts.find((part) => part.type === 'second').value;

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };

  logMessage = (type, id, pushName, message) => {
    const form = bgcolor(`[ ${type} ]`, type === 'PRIVATE' ? 'orange' : 'gray');
    return `${form} From: ${color(id, 'cyan')} | User: ${color(pushName, 'cyan')} | Msg: ${color(message, 'green')}`;
  };
  formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    else return (bytes / 1073741824).toFixed(2) + ' GB';
  };

  getSystemStats = async () => {
    const cpus = os.cpus();
    const cpuUsage = cpus.map((cpu, index) => {
      const total = Object.values(cpu.times).reduce(
        (acc, time) => acc + time,
        0
      );
      const idle = cpu.times.idle;
      const usage = ((total - idle) / total) * 100;
      return {
        cpu: index,
        model: cpu.model,
        speed: cpu.speed,
        usage: usage.toFixed(2) + '%',
      };
    });

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = {
      totalMemory: this.formatBytes(totalMemory),
      freeMemory: this.formatBytes(freeMemory),
      usedMemory: this.formatBytes(totalMemory - freeMemory),
    };

    const uptime = process.uptime() * 1000;
    const processStats = {
      pid: process.pid,
      title: process.title,
      execPath: process.execPath,
      memoryUsage: {
        rss: this.formatBytes(process.memoryUsage().rss),
        heapTotal: this.formatBytes(process.memoryUsage().heapTotal),
        heapUsed: this.formatBytes(process.memoryUsage().heapUsed),
        external: this.formatBytes(process.memoryUsage().external),
      },
      speed: (performance.now() - performance.now()).toFixed(6) * -1,
      runtime: this.formatDuration(uptime),
    };

    return {
      cpuUsage,
      memoryUsage,
      processStats,
    };
  };

  clearNumbers = (text) => {
    if (!text) return;
    [/@\u2068\u202e\d+~\u2069/g, /@\d+/g, /@\(\d+\)/g, /@<\d+>/g].forEach(
      (pattern) => {
        text = text?.replace(pattern, '');
      }
    );

    return text;
  };

  parseTimeString = (timeStr) => {
    const timeUnits = {
      s: 1000,
      second: 1000,
      seconds: 1000,
      detik: 1000,
      m: 60000,
      minute: 60000,
      minutes: 60000,
      menit: 60000,
      h: 3600000,
      hour: 3600000,
      hours: 3600000,
      jam: 3600000,
      d: 86400000,
      day: 86400000,
      days: 86400000,
      hari: 86400000,
      w: 604800000,
      week: 604800000,
      weeks: 604800000,
      minggu: 604800000,
      mo: 2592000000,
      month: 2592000000,
      bulan: 2592000000,
      y: 31536000000,
      year: 31536000000,
      tahun: 31536000000,
    };

    const regex =
      /(\d+)\s*(second|seconds|detik|minute|minutes|menit|hour|hours|jam|day|days|hari|week|weeks|minggu|month|mo|bulan|year|years|tahun|s|m|h|d|w|y)/gi;
    let totalMilliseconds = 0;
    let matches;
    let matchFound = false;
    while ((matches = regex.exec(timeStr)) !== null) {
      matchFound = true;
      const value = parseInt(matches[1]);
      if (isNaN(value)) {
        return false;
      }
      const unit = matches[2].toLowerCase();
      if (!timeUnits[unit]) {
        return false;
      }
      totalMilliseconds += value * timeUnits[unit];
    }
    if (!matchFound || totalMilliseconds === 0 || isNaN(totalMilliseconds)) {
      return false;
    }
    return totalMilliseconds;
  };
  getRandomItem = (items) => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const [item, probability] of Object.entries(items)) {
      cumulativeProbability += probability;
      if (random < cumulativeProbability) {
        return item;
      }
    }
  };

  handleSessionExpiry = (
    { usr, cht, session, time, key },
    onExpiry = async () => {}
  ) => {
    if (!global.timeouts) global.timeouts = {};
    if (timeouts[key + usr]) clearTimeout(timeouts[key + usr]);
    timeouts[key + usr] = setTimeout(
      async () => {
        let swps = Data.users[usr][key] || { last: Date.now() };
        let expired = Date.now() - swps.last >= time;
        if (expired) {
          delete Data.users[usr][key];
          await cht.reply(`Sesi ${session} telah berakhir`);
          await onExpiry();
        }
      },
      parseInt(time) + 10000
    );
  };

  rgbaToHex(r, g, b, a = 1) {
    let hex =
      '#' +
      [r, g, b]
        .map((component) => {
          return component.toString(16).padStart(2, '0');
        })
        .join('');
    if (a < 1) {
      let alphaHex = Math.round(a * 255)
        .toString(16)
        .padStart(2, '0');
      hex += alphaHex;
    }
    return hex;
  }

  hexToRgba(hex) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }

  getName(id) {
    return (
      Object.values(this.store.messages)
        .flatMap((a) => a.array)
        .filter((a) => a.key?.participant == id.extractMentions()?.[0])?.[0]
        ?.pushName ||
      ArchiveMemories.getItem(id, 'name') ||
      id.split('@')[0]
    );
  }

  async uploadToServer(media, type = 'image') {
    media =
      typeof media == 'string' && media.startsWith('http')
        ? { url: media }
        : media;
    return Object.values(
      await generateWAMessageContent(
        { [type]: media },
        { upload: this.Exp.waUploadToServer }
      )
    )[0];
  }

  findValue(searchKey, text) {
    const formattedText = text.replace(
      /(\w+):\s*([^\n]+)/g,
      (match, key, value) => `${key.toLowerCase()}: ${value}`
    );
    const regex = new RegExp(
      `${searchKey.toLowerCase()}:\\s*([\\s\\S]*?)(?=\\n\\w+:|$)`,
      'i'
    );
    const match = formattedText.match(regex);
    return match ? match[1].trim() : null;
  }

  async createTarGz(source, output) {
    return new Promise((resolve, reject) => {
      let sourceFolder = path.resolve(source);
      let outputPath = path.resolve(output);
      const tarFilePath = outputPath.replace(/\.gz$/, '');

      const excludeArgs = [
        "--exclude='node_modules'",
        "--exclude='.git'",
        "--exclude='.npm'",
        "--exclude='connection/session/*'",
        "--exclude='connection/session/**'",
      ].join(' ');

      const credsPath = path.join(
        sourceFolder,
        'connection',
        'session',
        'creds.json'
      );
      const relativeCreds = `${path.basename(sourceFolder)}/connection/session/creds.json`;

      const appendCreds = fs.existsSync(credsPath)
        ? `&& tar --append -f ${tarFilePath} -C ${path.dirname(sourceFolder)} ${relativeCreds}`
        : '';

      const tarCmd = `
      tar ${excludeArgs} -cf ${tarFilePath} -C ${path.dirname(sourceFolder)} ${path.basename(sourceFolder)} \
      ${appendCreds}
    `;

      exec(tarCmd, (err, stdout, stderr) => {
        if (err) {
          return reject({
            status: false,
            msg: `Terjadi kesalahan saat membuat file tar: ${stderr}`,
          });
        }

        const input = fs.createReadStream(tarFilePath);
        const outputStream = fs.createWriteStream(outputPath);
        const gzip = zlib.createGzip();

        input.pipe(gzip).pipe(outputStream);

        outputStream.on('finish', () => {
          fs.unlinkSync(tarFilePath);
          resolve({
            status: true,
            msg: `Backup selesai! File tar.gz: ${outputPath}`,
          });
        });

        outputStream.on('error', (err) => {
          reject({
            status: false,
            msg: `Terjadi kesalahan saat membuat file gzip: ${err.message}`,
          });
        });
      });
    });
  }

  async generateSN(length = 16) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sn = '';
    for (let i = 0; i < length; i++) {
      sn += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return sn;
  }

  formatDateTimeParts(date, timeZone = 'Asia/Jakarta', code = 'id-ID') {
    const formatter = new Intl.DateTimeFormat(code, {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    return {
      h: parts.find((p) => p.type === 'hour').value,
      min: parts.find((p) => p.type === 'minute').value,
      d: parseInt(parts.find((p) => p.type === 'day').value, 10),
      m: parts.find((p) => p.type === 'month').value,
    };
  }

  clearSessionConfess = async (_, __) => {
    let _default = { sent: [], inbox: [], block: [], sess: {} };
    let a = (await ArchiveMemories.getItem(_, 'confess')) || _default;
    let b = (await ArchiveMemories.getItem(__, 'confess')) || _default;
    a.sess = b.sess = {};
    await ArchiveMemories.setItem(_, 'confess', a);
    await ArchiveMemories.setItem(__, 'confess', b);
    return { a, b };
  };

  findSenderCodeConfess = (code, type = 'sent') => {
    return Object.keys(Data.users).find((a) => {
      const item = ArchiveMemories.getItem(a, 'confess');
      return item?.[type]?.some((b) => b.code === code?.trim().toUpperCase());
    });
  };

  async minimizeImage(inputBuffer, { width = 1024, quality = 3 } = {}) {
    return new Promise((resolve, reject) => {
      const args = [
        '-loglevel',
        'error',
        '-i',
        'pipe:0',
        '-vf',
        `scale='min(${width},iw)':-2`,
        '-q:v',
        quality,
        '-f',
        'image2',
        'pipe:1',
      ];

      const ffmpeg = spawn('ffmpeg', args, { stdio: ['pipe', 'pipe', 'pipe'] });

      const chunks = [];

      ffmpeg.stdout.on('data', (chunk) => chunks.push(chunk));
      ffmpeg.stderr.on('data', (data) => process.stderr.write(data));

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (err) => reject(err));

      ffmpeg.stdin.write(inputBuffer);
      ffmpeg.stdin.end();
    });
  }

  getDirectoriesRecursive = getDirectoriesRecursive;
  inventory = Inventory;

  color = {
    reset: (str) => `\x1b[0m${str}\x1b[0m`,
    bold: (str) => `\x1b[1m${str}\x1b[0m`,
    dim: (str) => `\x1b[2m${str}\x1b[0m`,
    italic: (str) => `\x1b[3m${str}\x1b[0m`,
    underline: (str) => `\x1b[4m${str}\x1b[0m`,
    inverse: (str) => `\x1b[7m${str}\x1b[0m`,
    hidden: (str) => `\x1b[8m${str}\x1b[0m`,
    strike: (str) => `\x1b[9m${str}\x1b[0m`,

    black: (str) => `\x1b[30m${str}\x1b[0m`,
    red: (str) => `\x1b[31m${str}\x1b[0m`,
    green: (str) => `\x1b[32m${str}\x1b[0m`,
    yellow: (str) => `\x1b[33m${str}\x1b[0m`,
    blue: (str) => `\x1b[34m${str}\x1b[0m`,
    magenta: (str) => `\x1b[35m${str}\x1b[0m`,
    cyan: (str) => `\x1b[36m${str}\x1b[0m`,
    white: (str) => `\x1b[37m${str}\x1b[0m`,

    brightBlack: (str) => `\x1b[90m${str}\x1b[0m`,
    brightRed: (str) => `\x1b[91m${str}\x1b[0m`,
    brightGreen: (str) => `\x1b[92m${str}\x1b[0m`,
    brightYellow: (str) => `\x1b[93m${str}\x1b[0m`,
    brightBlue: (str) => `\x1b[94m${str}\x1b[0m`,
    brightMagenta: (str) => `\x1b[95m${str}\x1b[0m`,
    brightCyan: (str) => `\x1b[96m${str}\x1b[0m`,
    brightWhite: (str) => `\x1b[97m${str}\x1b[0m`,
  };

  deepDiff({ oldData, newData, path = 'root', type = 'log' }) {
    const changes = [];

    const joinPath = (base, key, isArray) =>
      isArray ? `${base}[${key}]` : `${base}.${key}`;

    const isObject = (v) => typeof v === 'object' && v !== null;

    if (newData === undefined && oldData !== undefined) {
      changes.push({
        type: 'removed',
        path,
        old: oldData,
        note: '[Root missing in newData]',
      });
    } else if (oldData === undefined && newData !== undefined) {
      changes.push({
        type: 'added',
        path,
        new: newData,
        note: '[Root added]',
      });
    } else {
      const diff = (a, b, p) => {
        if (!isObject(a) || !isObject(b)) {
          if (a !== b) {
            changes.push({ type: 'changed', path: p, old: a, new: b });
          }
          return;
        }

        if (Array.isArray(a) || Array.isArray(b)) {
          const maxLen = Math.max(a?.length || 0, b?.length || 0);
          for (let i = 0; i < maxLen; i++) {
            const oldChild = a?.[i];
            const newChild = b?.[i];
            const nextPath = joinPath(p, i, true);

            if (i >= (a?.length || 0)) {
              changes.push({ type: 'added', path: nextPath, new: newChild });
            } else if (i >= (b?.length || 0)) {
              changes.push({ type: 'removed', path: nextPath, old: oldChild });
            } else if (isObject(oldChild) && isObject(newChild)) {
              diff(oldChild, newChild, nextPath);
            } else if (oldChild !== newChild) {
              changes.push({
                type: 'changed',
                path: nextPath,
                old: oldChild,
                new: newChild,
              });
            }
          }
          return;
        }

        const keys = new Set([
          ...Object.keys(a || {}),
          ...Object.keys(b || {}),
        ]);
        for (const key of keys) {
          const oldChild = a?.[key];
          const newChild = b?.[key];
          const nextPath = joinPath(p, key, false);

          if (!(key in (b || {}))) {
            changes.push({ type: 'removed', path: nextPath, old: oldChild });
          } else if (!(key in (a || {}))) {
            changes.push({ type: 'added', path: nextPath, new: newChild });
          } else if (isObject(oldChild) && isObject(newChild)) {
            diff(oldChild, newChild, nextPath);
          } else if (oldChild !== newChild) {
            changes.push({
              type: 'changed',
              path: nextPath,
              old: oldChild,
              new: newChild,
            });
          }
        }
      };

      diff(oldData, newData, path);
    }

    if (!changes.length) {
      //console.log(this.color.blue('[NO CHANGES] Data sama persis'));
      return;
    }

    const fmt = (v) => {
      if (v === null) return 'null';
      if (Array.isArray(v)) return `Array(${v.length})`;
      if (typeof v === 'object') return `Object(${Object.keys(v).length})`;
      return JSON.stringify(v);
    };
    let text = '=== DIFF RESULT ===';
    console.log(this.color.yellow(text));
    for (const c of changes) {
      switch (c.type) {
        case 'added':
          {
            let typeChanges = `${this.color.green('[ADDED]')} ${this.color.cyan(c.path)} → ${this.color.green(fmt(c.new))}`;
            if (type == 'text') {
              text += `\n${typeChanges}`;
            } else {
              console.log(typeChanges);
            }
          }
          break;
        case 'removed':
          {
            let typeChanges = `${this.color.red('[REMOVED]')} ${this.color.cyan(c.path)} ← ${this.color.red(fmt(c.old))} ${c.note ? this.color.magenta(c.note) : ''}`;
            if (type == 'text') {
              text += `\n${typeChanges}`;
            } else {
              console.log(typeChanges);
            }
          }
          break;
        case 'changed':
          {
            let typeChanges = `${this.color.yellow('[CHANGED]')} ${this.color.cyan(c.path)} : ${this.color.red(fmt(c.old))} → ${this.color.green(fmt(c.new))}`;
            if (type == 'text') {
              text += `\n${typeChanges}`;
            } else {
              console.log(typeChanges);
            }
          }
          break;
      }
    }
    if (type == 'text') return text;
  }

  parseLink(args = '') {
    return (
      args.match(
        /(https?:\/\/)?[^\s]+\.(com|net|org|edu|gov|mil|int|info|biz|pro|name|xyz|id|co|io|ai|app|dev|tech|cloud|online|site|store|shop|blog|me|tv|live|fun|lol|icu|top|click|link|digital|media|news|press|wiki|work|agency|software|systems|network|email|services|support|solutions|group|company|finance|capital|investments|ventures|trade|exchange|market|academy|school|college|university|health|care|clinic|hospital|pharmacy|legal|law|attorney|accountant|tax|consulting|engineering|construction|property|realestate|house|homes|rent|auction|energy|solar|green|eco|bio|farm|food|restaurant|cafe|bar|coffee|pizza|beer|wine|fashion|style|beauty|makeup|hair|spa|salon|fitness|gym|sport|football|basketball|tennis|golf|racing|motor|auto|car|bike|travel|tour|vacation|holiday|hotel|hostel|flight|air|sea|cruise|space|science|tech|ai|ml|data|crypto|blockchain|nft|web3|dao)(\/[^\s]*)?/gi
      ) ||
      args?.match(/https?:\/\/[^\s)]+/g) ||
      []
    ).map((url) =>
      (url.startsWith('http') ? url : 'https://' + url).replace(/['"`<>]/g, '')
    );
  }
}
