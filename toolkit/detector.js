const chokidar = 'chokidar'.import();
const chalk = 'chalk'.import();
const path = 'path'.import();
const { exec } = 'child'.import();
const fs = 'fs'.import();
let { JadwalSholat } = await (fol[2] + 'jadwalsholat.js').r();
const cacheSent = new Map();
const { default: moment } = await 'moment'.import();
const {
  getContentType,
  generateWAMessage,
  STORIES_JID,
  generateWAMessageFromContent,
} = 'baileys'.import();

const conf = fol[3] + 'config.json';
const db = fol[5];
let config = JSON.parse(fs.readFileSync(conf));
let keys = Object.keys(config);
let livechart = await (fol[2] + 'livechart.js').r();
let onreload = false;
Data.notify = Data.notify || {
  every: 60,
  h: 0,
  first: !1,
};
Data.queueMetadata ??= [];
const saving = new Set();

export default async function detector({ Exp, store }) {
  const { func } = Exp;
  livechart.default({ Exp });
  const reloadData = async (files) => {
    try {
      for (const [key, filePath] of Object.entries(files)) {
        Data[key] = (await filePath.r()).default;
      }
      Data.initialize({
        Exp,
        store,
      });
      console.log(chalk.green(`Helpers reloaded successfully!`));
    } catch (error) {
      console.error(chalk.red('Error reloading helpers:', error));
    }
  };

  const setupWatcher = (path, delay, onChangeCallback, onUnlinkCallback) => {
    let onreload = false;
    let recentlyUnlinked = new Set();

    const watcher = chokidar.watch(path, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      usePolling: true,
      interval: 500,
    });

    watcher.on('change', async (filePath) => {
      if (onreload) return;
      onreload = true;

      if (recentlyUnlinked.has(filePath)) {
        await new Promise((r) => setTimeout(r, 1000));
        recentlyUnlinked.delete(filePath);
      }

      console.log(chalk.yellow(`File changed: ${filePath}`));
      setTimeout(async () => {
        await onChangeCallback(filePath);
        onreload = false;
      }, delay);
    });

    if (onUnlinkCallback) {
      watcher.on('unlink', async (filePath) => {
        console.log(chalk.red(`File deleted: ${filePath}`));
        recentlyUnlinked.add(filePath);
        await onUnlinkCallback(filePath);
      });
    }
  };

  /*!-======[ Helpers Update detector ]======-!*/
  setupWatcher(path.resolve(fol[1], '**/*.js'), 1000, async (filePath) => {
    const files = {
      helper: `${fol[1]}client.js`,
      In: `${fol[1]}interactive.js`,
      utils: `${fol[1]}utils.js`,
      reaction: `${fol[1]}reaction.js`,
      EventEmitter: `${fol[1]}events.js`,
      stubTypeMsg: `${fol[1]}stubTypeMsg.js`,
      eventGame: `${fol[1]}eventGame.js`,
      initialize: `${fol[1]}initialize.js`,
    };
    await reloadData(files);
  });

  /*!-======[ Events Update Detector ]======-!*/
  setupWatcher(
    path.resolve(fol[7], '**/*.js'),
    2000,
    async () => {
      try {
        await Data?.ev?.reloadEventHandlers();
        console.log(chalk.green('Event handlers reloaded successfully!'));
      } catch (error) {
        console.error(chalk.red('Error reloading event handlers:', error));
      }
    },
    async (filePath) => {
      const fileName = path.basename(filePath);
      const eventKeys = Object.keys(Data.events);
      let exists = fs.existsSync('./helpers' + filePath.split('helpers')[1]);
      for (const key of eventKeys) {
        const { eventFile } = Data.events[key];

        if (eventFile.includes(fileName)) {
          console.log({
            exists,
            file: './helpers' + filePath.split('helpers')[1],
          });
          if (!exists) {
            delete Data.events[key];
          }
          console.log(
            chalk.red(`[ EVENT ${exists ? 'RELOADED' : 'DELETED'} ] => ${key}`)
          );
        }
      }
      await Data?.ev?.reloadEventHandlers();
    }
  );

  /*!-======[ Locale Update detector ]======-!*/
  setupWatcher(path.resolve(fol[9], '**/*.js'), 500, async (filePath) => {
    await filePath.r();
    console.log(chalk.yellow(`Locale file reloaded: ${filePath}`));
  });

  /*!-======[ Toolkit Update detector ]======-!*/
  setupWatcher(path.resolve(fol[0], '**/*.js'), 1000, async (filePath) => {
    try {
      let groupMetadata = Exp.func.groupMetadata;
      Exp.func = new (await `${fol[0]}func.js`.r()).func({
        Exp,
        store,
        groupMetadata,
      });
      console.log(chalk.green('Toolkit reloaded successfully!'));
    } catch (error) {
      console.error(chalk.red('Error reloading toolkit:', error));
    }
  });

  /*!-======[ Auto Update ]======-!*/
  async function keyChecker(url, key) {
    try {
      Data.notify.h++;
      if (Data.notify.h == 1 && Exp.authState) {
        let own = owner[0].split('@')[0] + from.sender;
        let res = await fetch(
          `${api.xterm.url}/api/tools/key-checker?key=${api.xterm.key}`
        );
        let inf =
          '\n\n> _Jika ini dirasa mengganggu, anda bisa menonaktifkan dengan mengetik *.set keyChecker off*_';
        if (!res.ok)
          return Exp.sendMessage(own, {
            text: `*[❗Notice ]*\n\`SERVER API ERROR\`\n Response status: ${res.status}${inf}`,
          });
        let { status, data, msg } = await res.json();
        if (!status) {
          await Exp.sendMessage(own, {
            text: `*[❗Notice ]*\n\`API KEY STATUS IS FALSE\`\n\n*Key*: ${api.xterm.key}\nMsg: ${msg}${inf}`,
          });
        } else {
          let {
            limit,
            usage,
            totalHit,
            remaining,
            resetEvery,
            reset,
            expired,
            isExpired,
            features,
          } = data;
          let interval =
            resetEvery.hours > 0
              ? String(new Date().getHours()) == String(Data.notify.reset)
              : String(new Date().getDate()) == String(Data.notify.reset);
          if (usage >= limit && (!Data.notify?.reset || interval)) {
            Data.notify.reset =
              resetEvery.hours > 0
                ? reset.split(' ')[1]?.split(':')[0]
                : reset.split('/')[0];
            await Exp.sendMessage(own, {
              text: `*[❗Notice ]*\n\`LIMIT GLOBAL HARIAN API KEY TELAH TERCAPAI\`\n\n*Today:* ${usage}\n*Total Hit*: ${totalHit}\n\n*Reset*: ${reset}${inf}`,
            });
          } else if (isExpired) {
            await Exp.sendMessage(own, {
              text: `*[❗Notice ]*\n\`API KEY EXPIRED\`\n\n*Key*: ${api.xterm.key}\n*Expired on*: ${expired}${inf}`,
            });
          } else {
            let kfeatures = Object.keys(features);
            for (let i of kfeatures) {
              let { ms, max, use, hit, lastReset } = features[i];
              if (
                use >= max &&
                (!Data.notify?.[i] || Date.now() >= Data.notify[i])
              ) {
                Data.notify[i] = lastReset
                  ? parseInt(lastReset) + parseInt(ms)
                  : Date.now() + parseInt(ms);
                let msg = i.includes('elevenlabs')
                  ? '> _Fitur text2speech *.elevenlabs* tidak dapat digunakan sebelum limit di reset!_'
                  : i.includes('filters')
                    ? '> _Fitur *.filters* seperti *.toanime* dan *.toreal* tidak dapat digunakan sebelum limit di reset!_'
                    : i.includes('luma')
                      ? '> _Fitur *.i2v* atau *.img2video* tidak dapat digunakan sebelum limit di reset!_'
                      : i.includes('logic-bell')
                        ? '_Auto ai chat tidak akan merespon/tidak dapat digunakan sebelum limit di reset!_'
                        : i.includes('enlarger')
                          ? '_Fitur *.enlarger* tidak dapat digunakan sebelum limit di reset!_'
                          : '';
                await Exp.sendMessage(own, {
                  text: `*[❗Notice ]*\n\`LIMIT FEATURE API KEY TELAH TERCAPAI\`\n\n*Feature*: \`${i.slice(1)}\`\n*Now*: ${use}\n*Max*: ${max}\n*Reset*: ${func.dateFormatter(Data.notify[i], 'Asia/Jakarta')}\n\n${msg}${inf}`,
                });
                await sleep(3000 + Math.floor(Math.random() * 2000));
              }
            }
          }
        }
      } else if (Data.notify.h >= Data.notify.every) {
        Data.notify.h = 0;
      }
    } catch (e) {
      console.error('Error in detector.js > keyChecker', e);
    }
  }

  async function schedule() {
    let chatDb = Object.entries(Data.preferences).filter(
      ([a, b]) => a.endsWith(from.group) && b.schedules?.length > 0
    );
    for (let [id, b] of chatDb) {
      try {
        let d;
        let n = b.schedules.findIndex((a) => {
          let {
            h,
            min,
            d: D,
          } = func.formatDateTimeParts(new Date(), a.timeZone);
          d = D;
          let [sh, sm] = a.time.split(':').map(Number);
          return (
            sh == h &&
            parseInt(min) - sm <= 10 &&
            parseInt(min) >= sm &&
            (!a.now || a.now !== d)
          );
        });
        if (n >= 0) {
          let s = b.schedules[n];
          if (!s.now || s.now !== d) {
            b.schedules[n].now = d;
            await Exp.relayMessage(
              id,
              {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      footer: {
                        text: s.msg,
                      },
                      carouselMessage: {},
                    },
                  },
                },
              },
              {}
            );
            await sleep(2000 + Math.floor(Math.random() * 1000));
            s.action !== '-' && (await Exp.groupSettingUpdate(id, s.action));
          }
        }
      } catch (e) {
        console.error('Error in detector.js > schedule', e);
        if (e.message.includes('forbidden')) delete Data.preferences[id];
      }
    }
  }
  async function sholat() {
    let chatDb = Object.entries(Data.preferences).filter(
      ([a, b]) => a.endsWith(from.group) && b.jadwalsholat
    );
    for (let [id, b] of chatDb) {
      try {
        if (!(id in jadwal.groups)) await jadwal.init(id, b.jadwalsholat.v);
        let { status, data, db } = await jadwal.now(id);

        let { ramadhan, tutup } = b.jadwalsholat;

        let w = '5 menit';
        //console.log(data)
        if (data.now && !data.hasNotice) {
          let { participants, subject } = await func.getGroupMetadata(id);
          let groupAdmins = func.getGroupAdmins(participants);
          let isBotAdmin = groupAdmins.includes(Exp.number);

          let emoji =
            {
              imsak: '🌄',
              subuh: '🌅',
              dzuhur: '☀️',
              ashar: '⏳',
              maghrib: '🌇',
              isya: '🌙',
            }[data.now] || '';
          let text =
            data.now == 'magrib' && ramadhan
              ? `*Hai seluruh umat Muslim yang berada di grup \`${subject}\`!*\n\nSelamat berbuka puasa 🍽️! Semoga puasanya diterima oleh Allah SWT.\nWaktu sholat *${data.now}${emoji}* di daerah ${b.jadwalsholat.v} sudah masuk! Jangan lupa menunaikan shalat tepat waktu.\n\n*"Allahumma laka shumtu wa bika aamantu wa ‘ala rizq-ika aftartu, bi rahmatika ya arhamar rahimin."*  \n(Ya Allah, kepada-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka. Dengan rahmat-Mu, wahai Tuhan yang Maha Pengasih).  \n\nSemoga Allah menerima ibadah kita semua. Aamiin.`
              : data.now == 'isya' && ramadhan
                ? `*Hai seluruh umat Muslim yang berada di grup \`${subject}\`!*\n\nWaktu sholat *${data.now}${emoji}* di wilayah ${b.jadwalsholat.v} telah masuk. Mari kita laksanakan sholat fardhu tepat waktu.\n\nBagi yang memiliki kesempatan, jangan lupa menunaikan sholat sunnah Tarawih.\n\nSemoga Allah SWT menerima amal ibadah kita semua. Aamiin.`
                : data.now == 'imsak'
                  ? `*Hai seluruh umat Muslim yang berada di grup \`${subject}\`!*\n\nWaktu *imsak* di daerah ${b.jadwalsholat.v} telah tiba!\nSilakan menyelesaikan santap sahurnya, dan bersiap untuk menunaikan ibadah puasa.`
                  : `*Hai seluruh umat muslim yang berada di group \`${subject}\`!*\n\nWaktu sholat *${data.now}${emoji}* di daerah ${b.jadwalsholat.v} sudah masuk!`;
          await Exp.relayMessage(
            id,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text,
                    },
                    footer: {
                      text:
                        data.now == 'imsak'
                          ? `*"Nawaitu shauma ghadin an adā’i fardhi syahri ramadhāna hadzihis sanati lillāhi ta‘ālā."*  
(Aku niat berpuasa esok hari untuk menunaikan kewajiban di bulan Ramadan tahun ini karena Allah Ta’ala).  

Semoga puasa kita diterima Allah dan diberikan kekuatan serta kelancaran sepanjang hari. Aamiin.`
                          : `Buat semua yang ada di daerah ${b.jadwalsholat.v}, yuk segera tunaikan sholat!${isBotAdmin && tutup ? `\n\n_Group akan ditutup selama ${w}_` : ''}`,
                    },
                    ...(['magrib'].includes(data.now)
                      ? {
                          contextIntfo: {
                            mentionedJid: participants,
                          },
                        }
                      : {}),
                    carouselMessage: {},
                  },
                },
              },
            },
            {}
          );

          if (isBotAdmin && tutup && data.now !== 'imsak') {
            await Exp.groupSettingUpdate(id, 'announcement');
            setTimeout(
              () => Exp.groupSettingUpdate(id, 'not_announcement'),
              func.parseTimeString(w)
            );
          }

          data.now !== 'imsak' &&
            (await Exp.sendMessage(id, {
              audio: {
                url: data.adzan,
              },
              mimetype: 'audio/mpeg',
              ptt: true,
            }));
          Data.preferences[id].jadwalsholat = db;
        }
        await sleep(2000 + Math.floor(Math.random() * 1000));
      } catch (e) {
        console.error('Error in detector.js > jadwalsholat', e);
        if (e.message.includes('forbidden')) delete Data.preferences[id];
      }
    }
    for (let i of Object.keys(jadwal.groups)) {
      if (!chatDb.map((a) => a[0]).includes(i)) delete jadwal.groups[i];
    }
  }

  async function saveData(name) {
    if (saving.has(name)) return;
    saving.add(name);

    try {
      let data = name === 'cmd' ? Data.use?.cmds : Data[name];

      if (data === undefined) {
        console.warn(
          `detector.js > saveData > [SAVE] ${name} undefined, skipped`
        );
        return;
      }

      if (Data.mongo) {
        await Data.mongo.db.set(name, data);
        return;
      }

      const baseDir = ['users', 'inventories'].includes(name) ? fol[6] : db;
      await fs.promises.mkdir(baseDir, { recursive: true });

      const filepath = path.resolve(baseDir, `${name}.json`);
      const tmp = filepath + '.tmp';

      let raw;
      try {
        raw = JSON.stringify(data, null, 2);
      } catch (e) {
        console.error(
          `Error in detector.js > saveData > STRINGIFY ERROR ${name}:`,
          e
        );
        return;
      }

      await fs.promises.writeFile(tmp, raw);
      await fs.promises.rename(tmp, filepath);
    } catch (e) {
      console.error(`Error in detector.js > saveData > SAVE ERROR ${name}:`, e);
    } finally {
      saving.delete(name);
    }
  }

  async function updateHargaInvestasi() {
    try {
      const inflasiAktif = cfg.rpg?.inflasi;
      cfg.rpg ??= {};
      cfg.rpg.target ??= 15;
      cfg.rpg.baseNaik ??= 0.25;
      cfg.rpg.baseTurun ??= 0.23;
      cfg.rpg.bonusUser ??= 0.05;
      cfg.rpg.userFactor ??= true;

      let { target, baseNaik, baseTurun, bonusUser, userFactor } =
        cfg.rpg || {};
      const now = Date.now();
      const selisih = now - (Data.ShopRPG.inflasi?.evaluasiTerakhir || 0);
      //console.log({ selisih, _selisih:selisih < 30 * 60 * 1000 })
      if (selisih < 30 * 60 * 1000 && Object.keys(Data.ShopRPG.buy).length > 3)
        return;

      const totalUser = Object.keys(Data.users).length;
      //console.log({ totalUser })
      if (totalUser === 0) return;

      if (!Data.ShopRPG) Data.ShopRPG = {};
      if (!Data.ShopRPG.buy) Data.ShopRPG.buy = {};
      if (!Data.ShopRPG.sell) Data.ShopRPG.sell = {};
      if (!Data.ShopRPG.diskon) Data.ShopRPG.diskon = {};
      cfg.rpg.hargaAwal ??= {
        energy: { beli: 100 },
        potion: { jual: 100, beli: 100 },
        kayu: { beli: 100 },
        diamond: { jual: 100, beli: 100 },
      };
      const hargaAwalCfg = cfg.rpg.hargaAwal || {};

      for (const item in hargaAwalCfg) {
        const harga = hargaAwalCfg[item];
        if (!harga) continue;
        if (!inflasiAktif) {
          if (harga.beli) Data.ShopRPG.buy[item] = harga.beli;
          if (harga.jual) Data.ShopRPG.sell[item] = harga.jual;
          continue;
        }

        let totalBarang = 0;
        if (['energy', 'flow', 'coins'].includes(item)) {
          for (const [, user] of Object.entries(Data.users)) {
            totalBarang += user[item] || 0;
          }
        } else {
          for (const [, inv] of Object.entries(Data.inventories)) {
            totalBarang += inv[item] || 0;
          }
        }

        const R = totalBarang / totalUser || 0;
        let faktor = 1;
        if (R < target) {
          faktor += baseNaik + (totalUser / userFactor) * bonusUser;
        } else if (R > target) {
          faktor -= baseTurun;
        }

        if (typeof harga.beli === 'number') {
          let hargaBeli = Math.max(1, Math.round(harga.beli * faktor));

          const d = Data.ShopRPG.diskon?.[item];
          if (d) {
            const expired = d.expired || 0;
            const sisa = d.jumlah;
            const masihAktif =
              (expired === 0 || expired > now) && (sisa === null || sisa > 0);

            if (masihAktif) {
              hargaBeli = Math.max(1, hargaBeli - d.potongan);
            } else {
              delete Data.ShopRPG.diskon[item];
            }
          }

          Data.ShopRPG.buy[item] = hargaBeli;
        }

        if (typeof harga.jual === 'number') {
          let hargaJual = Math.max(1, Math.round(harga.jual * faktor * 0.95));
          Data.ShopRPG.sell[item] = hargaJual;
        }
      }

      Data.ShopRPG.inflasi = {
        aktif: inflasiAktif,
        evaluasiTerakhir: now,
      };

      Data.ShopRPG.snapshot = {
        waktu: new Date().toISOString(),
        ringkas: {
          totalUser,
          itemTerkelola: Object.keys(hargaAwalCfg).length,
        },
      };

      const shopFile = path.resolve(fol[5], 'ShopRPG.json');
      fs.writeFileSync(shopFile, JSON.stringify(Data.ShopRPG, null, 2));

      // console.log("✅ updateHargaInvestasi, harga diperbarui sesuai stok.");
    } catch (e) {
      console.error('❌ Error in updateHargaInvestasi:', e);
      throw new Error(e);
    }
  }
  async function executeSchedules() {
    const now = new Date();
    const { formatDateTimeParts } = Exp.func;

    for (const [groupId, pref] of Object.entries(Data.preferences)) {
      const opentime = pref.opentime || { weekly: {}, once: [] };
      const closetime = pref.closetime || { weekly: {}, once: [] };

      // === Jadwal sekali (once) ===
      for (const [list, type] of [
        [opentime.once, 'open'],
        [closetime.once, 'close'],
      ]) {
        for (let i = 0; i < list.length; i++) {
          const sched = list[i];
          const schedTime = new Date(sched.time);
          const diff = schedTime - now;

          if (diff <= 0) {
            await Exp.groupSettingUpdate(
              groupId,
              type === 'open' ? 'not_announcement' : 'announcement'
            );

            if (type === 'close') {
              const hour = now.getHours();
              const msg =
                hour >= 20 || hour < 3
                  ? 'Grup telah ditutup, selamat beristirahat oyasumi...'
                  : 'Grup telah ditutup sesuai jadwal.';
              await Exp.sendMessage(groupId, { text: msg });
            }

            list.splice(i, 1);
            i--;
          } else if (!sched.warned && diff <= 300000 && type === 'close') {
            await Exp.sendMessage(groupId, {
              text: 'Grup akan ditutup dalam waktu 5 menit lagi...',
            });
            sched.warned = true;
          }
        }
      }

      // === Jadwal mingguan (weekly) ===
      const { h, min } = formatDateTimeParts(now);
      const today = now
        .toLocaleDateString('id-ID', { weekday: 'long' })
        .toLowerCase();
      const dayKey = {
        minggu: 'sunday',
        senin: 'monday',
        selasa: 'tuesday',
        rabu: 'wednesday',
        kamis: 'thursday',
        jumat: 'friday',
        sabtu: 'saturday',
      }[today];

      for (const [schedule, type] of [
        [opentime, 'open'],
        [closetime, 'close'],
      ]) {
        const times = schedule.weekly[dayKey] || [];
        for (let i = 0; i < times.length; i++) {
          const [sh, sm] = times[i].split(':').map(Number);
          const nowMinutes = h * 60 + min;
          const schedMinutes = sh * 60 + sm;
          const diffMinutes = schedMinutes - nowMinutes;

          if (nowMinutes === schedMinutes) {
            await Exp.groupSettingUpdate(
              groupId,
              type === 'open' ? 'not_announcement' : 'announcement'
            );

            if (type === 'close') {
              const msg =
                h >= 20 || h < 3
                  ? 'Grup telah ditutup, selamat beristirahat oyasumi...'
                  : 'Grup telah ditutup sesuai jadwal.';
              await Exp.sendMessage(groupId, { text: msg });
            }
          } else if (diffMinutes === 0 && type === 'close') {
            const diffSeconds =
              schedMinutes * 60 - (h * 3600 + min * 60 + now.getSeconds());
            if (diffSeconds > 0 && diffSeconds <= 300) {
              await Exp.sendMessage(groupId, {
                text: 'Grup akan ditutup dalam waktu 5 menit lagi...',
              });
            }
          }
        }
      }
    }
  }
  async function livechartNotifier() {
    if (!('livechart' in Data)) return;
    const data = Data.livechart || [];
    const now = moment().tz('Asia/Jakarta');

    const siapKirim = data.filter((item) => {
      const rilis = moment.tz(
        `${item.tanggal} ${item.time}`,
        'YYYY-MM-DD HH:mm',
        'Asia/Jakarta'
      );
      return rilis.isBetween(now.clone().subtract(20, 'minutes'), now);
    });

    if (!siapKirim.length) return;
    if (!Data.sent_livechart) Data.sent_livechart = {};

    for (const anime of siapKirim) {
      for (const [groupId, pref] of Object.entries(Data.preferences)) {
        try {
          if (!pref.livechart) continue;

          const key = `${anime.tanggal}|${anime.time}|${anime.link}`;
          if (Data.sent_livechart[groupId]?.includes(key)) continue;

          // === Pesan utama === // terserah mau nambah apa lagi cek aja dlu di dbnya
          const img = await Exp.func.uploadToServer(anime.poster);
          const caption = [
            `*${anime.title}*`,
            `_*Jam tayang:* ${anime.hari}, ${anime.tanggal} | ${anime.time}_`,
            `*Episode:* ${anime.episode}`,
            anime.genre?.length ? `*Genre:* ${anime.genre.join(', ')}` : null,
            anime.studio ? `*Studio:* ${anime.studio}` : null,
            anime.season ? `*Season:* ${anime.season}` : null,
            anime.tanggal_rilis
              ? `*Anime Rilis:* ${anime.tanggal_rilis}`
              : null,
          ]
            .filter(Boolean)
            .join('\n');

          const hasVideos = anime.videos?.length > 0;
          const buttons = hasVideos
            ? anime.videos.slice(0, 7).map((url, i) => ({
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text:
                    anime.videos.length === 1 ? 'Trailer' : `Trailer ${i + 1}`,
                  url,
                }),
              }))
            : [
                {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Lihat',
                    url: 'https://tinyurl.com/Lilia-Yukine',
                  }),
                },
              ];

          const card = {
            header: { imageMessage: img, hasMediaAttachment: true },
            body: { text: caption },
            footer: {
              text: anime.deskripsi || '',
            },
            nativeFlowMessage: { buttons },
          };

          const msg = generateWAMessageFromContent(
            groupId,
            {
              viewOnceMessage: {
                message: {
                  interactiveMessage: {
                    body: {
                      text: '*LIVE CHART📡*',
                    },
                    carouselMessage: { cards: [card], messageVersion: 1 },
                  },
                },
              },
            },
            {}
          );

          await Exp.relayMessage(groupId, msg.message, {
            messageId: msg.key.id,
          });

          if (!Data.sent_livechart[groupId]) Data.sent_livechart[groupId] = [];
          Data.sent_livechart[groupId].push(key);

          // === Visual === // block aja jika ga pengen di notif
          if (Array.isArray(anime.visuals) && anime.visuals.length > 0) {
            await new Promise((r) => setTimeout(r, 5000));

            const visualCards = await Promise.all(
              anime.visuals.map(async (vlink) => ({
                header: {
                  imageMessage: await Exp.func.uploadToServer(vlink),
                  hasMediaAttachment: true,
                },
                body: { text: '' },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'cta_url',
                      buttonParamsJson: JSON.stringify({
                        display_text: 'Lihat',
                        url: 'https://tinyurl.com/Lilia-Yukine',
                      }),
                    },
                  ],
                },
              }))
            );

            const visualMsg = generateWAMessageFromContent(
              groupId,
              {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      body: { text: 'LIVE CHART PREVIEW📡' },
                      carouselMessage: {
                        cards: visualCards,
                        messageVersion: 1,
                      },
                    },
                  },
                },
              },
              {}
            );

            await Exp.relayMessage(groupId, visualMsg.message, {
              messageId: visualMsg.key.id,
            });
          }

          await new Promise((r) => setTimeout(r, 20000));
        } catch (e) {
          console.error('[Livechart Notifier Error]:', e);
          if (e.message.includes('forbidden')) delete Data.preferences[groupId];
        }
      }
    }
  }

  async function autoBackup() {
    try {
      if (!cfg?.autoBackup) return;

      const now = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
      );

      const jam = now.getHours();
      const menit = now.getMinutes();
      const hari = now.getDate();

      if (jam === 21 && menit === 0) {
        if (cfg?.lastDayBackup == hari) return;
        cfg.lastDayBackup = hari;

        let b = './backup.tar.gz';
        let s = await Exp.func.createTarGz('./', b);
        if (!s.status) return console.log('[ AUTO BACKUP ] gagal:', s.msg);

        const dateStr = func.dateFormatter(Date.now(), 'Asia/Jakarta');
        const fileName = `${botnickname} || ${dateStr}.tar.gz`;

        const stats = fs.statSync(b);
        const fileSize = String(stats.size).toFormat();
        const caption =
          '乂  *A U T O  B A C K U P*\n\n' +
          `• *File name* : ${fileName}\n` +
          `• *File size* : ${fileSize}\n` +
          `• *Status* : ✅Suksess`;
        for (let i of owner) {
          try {
            let own = String(i).split('@')[0] + from.sender;
            await Exp.sendMessage(own, {
              document: { url: b },
              mimetype: 'application/zip',
              fileName,
              caption,
            });
            await sleep(5000);
          } catch (e) {
            console.warn(`Cannot send backupnya file to: ${i}`, e);
            continue;
          }
        }

        fs.unlinkSync(b);
        console.log(
          chalk.cyan(
            `[ AUTO BACKUP ] sukses mengirim backup (${fileName}, ${fileSize})`
          )
        );
      }
    } catch (e) {
      console.error('Error auto backup:', e);
      const text =
        '乂  *A U T O  B A C K U P*\n\n' + `*Error*:\n` + `- ${e.message}`;

      await Exp.sendMessage(own, {
        text,
      });
      throw new Error(e);
    }
  }

  async function cekSewa() {
    try {
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      for (const id of Object.keys(Data.sewa)) {
        const d = Data.sewa[id];
        if (!d?.exp) continue;

        if (d.exp > now) {
          if (d.granceUntil) delete d.granceUntil;
          d.status = 'active';
          continue;
        }

        if (!d.graceUntil) {
          d.graceUntil = now + ONE_DAY;
          d.status = 'grace';
          let { participants } = await func.getGroupMetadata(id);
          await Exp.sendMessage(id, {
            text:
              `⏳ *Masa Sewa Berakhir*\n\n` +
              `Sewa bot di grup ini telah *habis*.\n` +
              `Saat ini grup masuk *masa suspend selama 1 hari*.\n\n` +
              `📌 *Catatan penting:*\n` +
              `• Selama masa suspend, bot *tidak dapat digunakan*\n` +
              `• Silakan lakukan perpanjangan sebelum grace berakhir\n\n` +
              `Jika masa grace habis dan belum diperpanjang,\n` +
              `akses bot akan *dinonaktifkan sepenuhnya*.`,
            mentions: participants.map((a) => a.id),
          });

          continue;
        }

        if (d.graceUntil && now > d.graceUntil) {
          if (d.status !== 'expired') {
            d.status = 'expired';
            let { participants } = await func.getGroupMetadata(id);
            await Exp.sendMessage(id, {
              text:
                `⛔ *Sewa Berakhir Sepenuhnya*\n\n` +
                `Masa suspend telah *habis* dan sewa bot *tidak diperpanjang*.\n\n` +
                `❌ *Bot otomatis keluar dari grup ini!!*\n`,
              footer: `💬 Silakan hubungi owner untuk melakukan perpanjangan.`,
              mentions: participants.map((a) => a.id),
            });
            await sleep(1000);
            await func.metadata.delete(id);
            await Exp.groupLeave(id);
          }
        }
      }
    } catch (e) {
      console.error('Error in detector.js > cekSewa:', e);
    }
  }

  let jdwl = {};
  Object.entries(Data.preferences)
    .filter(([a, b]) => a.endsWith(from.group) && b.jadwalsholat)
    .forEach(([a, b]) => {
      jdwl[a] = b.jadwalsholat;
    });

  global.jadwal = new JadwalSholat(jdwl);

  cfg.keyChecker ??= true;
  keys['detector'] = setInterval(async () => {
    let start = Date.now();
    let total = 0;
    const errors = [];
    const success = [];

    const safeExec = async (fn, label) => {
      total++;
      const name = label || fn.name || 'anonymous';
      try {
        await fn();
        success.push(name);
        return true;
      } catch (err) {
        errors.push({ name, msg: err.message });
        return false;
      }
    };

    await safeExec(sholat);
    await safeExec(autoBackup);
    await safeExec(schedule);
    await safeExec(executeSchedules);
    await safeExec(() => cfg.keyChecker && keyChecker(), 'keyChecker');

    await safeExec(() => livechartNotifier(), 'livechartNotifier');

    await safeExec(() => {
      for (let i of keys) config[i] = global[i];
    }, 'syncKeys');

    const DB = global._DB || [
      'cmd',
      'preferences',
      'users',
      'badwords',
      'links',
      'fquoted',
      'audio',
      'setCmd',
      'response',
      'inventories',
      'ShopRPG',
      'lids',
    ];

    for (const name of DB) {
      const saved = await safeExec(() => saveData(name), `saveData:${name}`);
    }

    await safeExec(
      () =>
        fs.writeFileSync(path.resolve(conf), JSON.stringify(config, null, 2)),
      'writeConfig'
    );

    cfg.sewa && (await safeExec(cekSewa));
    await safeExec(updateHargaInvestasi);

    await safeExec(() => {
      let queue = Data.queueMetadata.shift();
      if (typeof queue?.run === 'function') return queue.run();
    }, 'queue.run');
    exec(
      `find . toolkit -type f \\( -name "output_*" -o -name "*.tmp" -o -name "*.bin" \\) -delete`,
      (err, stdout, stderr) => {
        if (err) {
          console.error('Error hapus file:', err.message);
          return;
        }
        if (stderr) console.log(stderr);
      }
    );
    if (errors.length > 0) {
      console.log(chalk.red(`\n[DETECTOR] ${errors.length} ERROR:`));
      for (let err of errors) {
        console.log(chalk.red(` - ${err.name}: ${err.msg}`));
      }
    } else {
      /*console.log(
        chalk.green(
          `[DETECTOR] OK (${success.length == total ? 'All' : success.length} tasks) ${Date.now() - start}ms`
        )
      );*/
    }
  }, 20000);
}
