const {
  jidDecode,
  downloadContentFromMessage,
  generateWAMessageContent,
  getBinaryNodeChild,
  getBinaryNodeChildren,
} = 'baileys'.import();
const fs = 'fs'.import();
const axios = 'axios'.import();
const https = 'https'.import();
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
const Jimp = (await 'jimp'.import()).default;
const cache = new Map();
const CACHE_DURATION = 1 * 60 * 1000;

async function getDirectoriesRecursive(
  dir = './',
  ignoredDirs = ['node_modules', '.git', '.config', '.npm', '.pm2']
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
  constructor({ Exp, store }) {
    this.Exp = Exp;
    this.store = store;
  }

  async getSender(jid, { cht }) {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let { user, server } = jidDecode(jid) || {};
      jid = user && server ? `${user}@${server}` : jid;
    }
    if (jid.endsWith('@lid')) {
      try {
        let { participants } = await this.getGroupMetadata(cht.id, this.Exp);

        let lid = participants.find((a) => a.lid == jid);
        return lid?.id || jid;
      } catch (e) {
        console.error('Error in func > getSender:', e);
      }
    }
    return jid;
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

  getGroupMetadata = async (chtId, Exp) => {
    const currentTime = Date.now();
    if (
      cache.has(chtId) &&
      currentTime - cache.get(chtId).timestamp < CACHE_DURATION
    ) {
      return cache.get(chtId).metadata;
    }
    let groupMetadata = await Exp.groupMetadata(chtId);
    if (groupMetadata.addressingMode == 'lid') {
      const group = await getBinaryNodeChild(
        await Exp.query({
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
    }
    cache.set(chtId, {
      metadata: groupMetadata,
      timestamp: currentTime,
    });
    if (cache.size > 100) {
      const keysToRemove = [...cache.keys()].slice(0, cache.size - 100);
      keysToRemove.forEach((key) => cache.delete(key));
    }
    return groupMetadata;
  };

  async downloadSave(message, filename) {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, '')
      : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);

    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    let trueFileName = filename;
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
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

  menuFormatter(data, frames, tags) {
    const normalizedData = {};
    Object.values(data).forEach((item) => {
      const tag = item.tag;
      if (!normalizedData[tag]) {
        normalizedData[tag] = new Set();
      }
      if (Array.isArray(item.listmenu)) {
        item.listmenu.forEach((menu) => normalizedData[tag].add(menu));
      } else {
        normalizedData[tag].add(item.listmenu);
      }
    });

    Object.keys(normalizedData).forEach((tag) => {
      normalizedData[tag] = Array.from(normalizedData[tag]);
    });

    const generateOutput = (data, { frames, tags, prefix }) => {
      let result = '';
      Object.keys(tags).forEach((tag) => {
        if (data[tag] && data[tag].length > 0) {
          result += `${frames.head}${frames.brackets[0]} ${tags[tag]} ${frames.brackets[1]}\n`;
          data[tag].forEach((menu) => {
            result += `${frames.body} ${prefix || '.'}${menu}\n`;
          });
          result += `${frames.foot}\n\n`;
        }
      });
      return result.trim();
    };

    return generateOutput(normalizedData, frames, tags);
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
  getBuffer = async (url, options) => {
    return new Promise((resolve, reject) => {
      const chunks = [];

      const stream = https.get(url, (response) => {
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });

        response.on('error', (error) => {
          reject(error);
        });
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  };

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
      .filter((result) => result.similarity >= threshold);
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

  async uploadToServer(url, type = 'image') {
    return Object.values(
      await generateWAMessageContent(
        { [type]: { url } },
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
      const tarFilePath = outputPath.replace('.gz', '');

      exec(
        `tar --exclude='node_modules' --exclude='.git' --exclude='.npm' -cf ${tarFilePath} -C ${path.dirname(sourceFolder)} ${path.basename(sourceFolder)}`,
        (err, stdout, stderr) => {
          if (err) {
            return reject({
              status: false,
              msg: `Terjadi kesalahan saat membuat file tar: ${stderr}`,
            });
          }

          const input = fs.createReadStream(tarFilePath);
          const output = fs.createWriteStream(outputPath);
          const gzip = zlib.createGzip();

          input.pipe(gzip).pipe(output);

          output.on('finish', () => {
            fs.unlinkSync(tarFilePath);
            resolve({
              status: true,
              msg: `Backup selesai! File tar.gz: ${outputPath}`,
            });
          });

          output.on('error', (err) => {
            reject({
              status: false,
              msg: `Terjadi kesalahan saat membuat file gzip: ${err.message}`,
            });
          });
        }
      );
    });
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

  async minimizeImage(
    inputBuffer,
    { width = 1024, quality = 3 } = {}
  ) {
    return new Promise((resolve, reject) => {
      const args = [
        '-loglevel', 'error',
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
}
