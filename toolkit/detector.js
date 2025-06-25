const chokidar = 'chokidar'.import();
const chalk = 'chalk'.import();
const path = 'path'.import();
const fs = 'fs'.import();
let { JadwalSholat } = await (fol[2] + 'jadwalsholat.js').r();

const conf = fol[3] + 'config.json';
const db = fol[5];
let config = JSON.parse(fs.readFileSync(conf));
let keys = Object.keys(config);

let onreload = false;
Data.notify = Data.notify || {
  every: 60,
  h: 0,
  first: !1,
};

export default async function detector({ Exp, store }) {
  const { func } = Exp;
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
    const watcher = chokidar.watch(path, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      usePolling: true,
      interval: 1000,
    });

    watcher.on('change', async (filePath) => {
      if (onreload) return;
      onreload = true;

      console.log(chalk.yellow(`File changed: ${filePath}`));
      setTimeout(async () => {
        await onChangeCallback(filePath);
        onreload = false;
      }, delay);
    });

    if (onUnlinkCallback) {
      watcher.on('unlink', async (filePath) => {
        console.log(chalk.yellow(`File deleted: ${filePath}`));
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

      for (const key of eventKeys) {
        const { eventFile } = Data.events[key];
        if (eventFile.includes(fileName)) {
          delete Data.events[key];
          console.log(chalk.red(`[ EVENT DELETED ] => ${key}`));
        }
      }
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
      Exp.func = new (await `${fol[0]}func.js`.r()).func({
        Exp,
        store,
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
      console.error('Error in key checker', e);
    }
  }

  async function schedule() {
    try {
      let chatDb = Object.entries(Data.preferences).filter(
        ([a, b]) => a.endsWith(from.group) && b.schedules?.length > 0
      );
      for (let [id, b] of chatDb) {
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
      }
    } catch (e) {
      console.error('Error in schedule', e);
    }
  }
  async function sholat() {
    try {
      let chatDb = Object.entries(Data.preferences).filter(
        ([a, b]) => a.endsWith(from.group) && b.jadwalsholat
      );
      for (let [id, b] of chatDb) {
        if (!(id in jadwal.groups)) await jadwal.init(id, b.jadwalsholat.v);
        let { status, data, db } = await jadwal.now(id);

        let { ramadhan, tutup } = b.jadwalsholat;

        let w = '5 menit';
        //console.log(data)
        if (data.now && !data.hasNotice) {
          let { participants, subject } = await func.getGroupMetadata(id, Exp);
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
      }
      for (let i of Object.keys(jadwal.groups)) {
        if (!chatDb.map((a) => a[0]).includes(i)) delete jadwal.groups[i];
      }
    } catch (e) {
      console.error('Error in jadwal sholat', e);
    }
  }

  async function saveData(name) {
    let data = name == 'cmd' ? Data.use.cmds : Data[name];
    if (Data.mongo) {
      await Data.mongo.db.set(name, data);
    } else {
      const filepath = (name === 'users' ? fol[6] : db) + name + '.json';
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    }
  }

  async function updateHargaInvestasi() {
    /*
        Terimakasih untuk Y*** yang telah meluangkan waktu
        dan berkontribusi untuk karya yang indah ini.
        Tidak ada credits, donasi, dan tidak ingin disebutkan namanya.
      */
    const inflasiAktif = Data.ShopRPG.inflasi?.PeningkatanInflasi;
    const now = Date.now();
    const selisih = now - (Data.ShopRPG.inflasi.evaluasiTerakhir || 0);
    if (selisih < 30 * 60 * 1000) return;

    const semuaUser = Object.entries(Data.users);
    const totalUser = semuaUser.length;
    if (totalUser === 0) return;
    /* const inflasiBot = 1.25
        Fungsi:
        - Ini adalah pengali utama untuk mengatur seberapa kuat inflasi mempengaruhi harga.
        - Semakin besar nilainya, semakin tajam perubahan harga (baik beli maupun jual).
        Contoh:
        # Kalau inflasiBot = 1.25, harga bisa naik 25% lebih cepat.
        # Kalau inflasiBot = 1.05, harga hanya naik 5% → lebih stabil dan lambat.
        Saran:
        Ubah ke 1.05 atau 1.01 kalau kamu ingin inflasi lambat.

        const koreksi = 1.1
        Fungsi:
        - Ini adalah faktor penyeimbang internal.
        - Koreksi digunakan untuk menyesuaikan kekuatan inflasi berdasarkan target dan data pengguna.
        - Sifatnya mirip inflasiBot, tapi lebih sebagai fine-tune agar inflasi tetap terjaga di kisaran stabil.
        Contoh:
        # Kalau koreksi = 1.1, hasil perhitungan akhir akan dikali 1.1 (jadi 10% lebih tinggi).
        Kalau koreksi = 1.0, hasilnya netral.
        Saran:
        Untuk membuat inflasi lambat, set ke 1.05 atau bahkan 1.00.

        const target = 100
        Fungsi:
        - Ini adalah jumlah rata-rata item per user yang dianggap ideal/stabil.
        - Jika stok rata-rata user melebihi target, harga akan turun (karena overstock).
        - Jika stok rata-rata di bawah target, harga akan naik (karena scarcity/langka).
        Contoh:
        # Kalau kamu set target = 100, dan rata-rata user punya 200 item → sistem anggap itu "kelebihan stok" → harga bisa diturunkan.
        Saran:
        Bisa disesuaikan tergantung jenis game.
        Misal:

        Untuk item umum → target = 100
        Untuk item langka → target = 10–50
        */
    const inflasiBot = 1.25;
    const koreksi = 1.1;
    const target = 100;

    for (const key of Object.keys(Data.ShopRPG.buy)) {
      if (!(key in Data.ShopRPG.hargaAwal)) delete Data.ShopRPG.buy[key];
    }
    for (const key of Object.keys(Data.ShopRPG.sell)) {
      if (!(key in Data.ShopRPG.hargaAwal)) delete Data.ShopRPG.sell[key];
    }

    for (const item in Data.ShopRPG.hargaAwal) {
      const harga = Data.ShopRPG.hargaAwal[item];
      if (!harga || typeof harga !== 'object') continue;

      if (!inflasiAktif) {
        if (typeof harga.beli === 'number') Data.ShopRPG.buy[item] = harga.beli;
        if (typeof harga.jual === 'number')
          Data.ShopRPG.sell[item] = harga.jual;
        continue;
      }

      let totalBarang = 0;
      for (const [, data] of semuaUser) {
        totalBarang += data[item] || 0;
      }

      const R = totalBarang / totalUser || 0;
      const selisihR = R - target;

      const F1 = Math.sqrt(Math.abs(selisihR));
      const F2 = Math.abs(Math.sin(R / 10));
      const F3 = Math.max(1, R / target);
      const F4 = R > 0 ? Math.log(R) : 0;
      const F5 = Math.tan((R / target) % (Math.PI / 2));
      const F6 = Math.abs(selisihR * F2);

      let Ftotal = F1 + F2 + F3 + F4 + F5 + F6;
      if (!Number.isFinite(Ftotal)) Ftotal = 1;
      const faktor = Ftotal * koreksi * inflasiBot;

      const stat = Data.ShopRPG.statistik[item] || {
        beli: 0,
        jual: 0,
      };

      // Harga beli: naik jika banyak permintaan
      if (typeof harga.beli === 'number') {
        const permintaan = (stat.beli + 1) / (stat.jual + 1);
        const faktorBeli = Math.max(
          0.5,
          Math.min(faktor * permintaan, faktor * 1.5)
        );
        Data.ShopRPG.buy[item] = Math.ceil(harga.beli * faktorBeli);
      }

      // Harga jual: turun jika banyak yang jual (kelebihan stok)
      if (typeof harga.jual === 'number') {
        const kelebihan = (stat.jual + 1) / (stat.beli + 1);
        const faktorJual = Math.max(0.3, Math.min(1 / kelebihan, 1)) * faktor;
        Data.ShopRPG.sell[item] = Math.floor(harga.jual * faktorJual);
      }
    }

    Data.ShopRPG.inflasi.evaluasiTerakhir = now;

    for (const key in Data.ShopRPG.diskon) {
      const d = Data.ShopRPG.diskon[key];
      const expired = d.expired || 0;
      const jumlah = d.jumlah;
      const isExpiredTime = expired > 0 && expired <= now;
      const isUsedUp = expired === 0 && jumlah !== null && jumlah <= 0;
      if (isExpiredTime || isUsedUp) {
        delete Data.ShopRPG.diskon[key];
      }
    }
  }

  //initialize available setup group jadwalsholat
  let jdwl = {};
  Object.entries(Data.preferences)
    .filter(([a, b]) => a.endsWith(from.group) && b.jadwalsholat)
    .forEach(([a, b]) => {
      jdwl[a] = b.jadwalsholat;
    });

  global.jadwal = new JadwalSholat(jdwl);

  cfg.keyChecker ??= true;
  keys['detector'] = setInterval(async () => {
    await sholat();
    await schedule();
    cfg.keyChecker && (await keyChecker());

    const DB = [
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
    ];

    try {
      for (let i of keys) {
        config[i] = global[i];
      }

      for (const name of DB) {
        await saveData(name);
      }

      await fs.writeFileSync(conf, JSON.stringify(config, null, 2));
      await updateHargaInvestasi();
    } catch (error) {
      console.error('Terjadi kesalahan dalam penulisan file', error);
    }
  }, 20000);
}
