const fs = 'fs'.import();
const cheerio = await 'cheerio'.import();

/**
 * !-======[ Experimentall ▪︎ Bell🦋 ]======-!
 * Coding by @rifza.p.p (code ini dibuat seluruhnya oleh Azfir/rifza.p.p)
 * ⚠️ *Dilarang menghapus credit ini!*
 * Pembuat kode pasti mengenali ciri khas karyanya.
 *
 * 🩵 Follow me on:
 * ▪︎ YouTube  : https://youtube.com/@rifza
 * ▪︎ GitHub   : https://github.com/Rifza123
 * ▪︎ Instagram: https://instagram.com/rifza.p.p
 * ▪︎ Threads  : https://www.threads.net/@rifza.p.p
 * ▪︎ Website  : https://xterm.tech
 *
 * Silakan pakai function ini agar member kalian tidak lupa beribadah.
 * Semoga bermanfaat!
 */
let cdn = 'https://c.termai.cc';
Data.audio = {
  ...Data.audio,
  adzan: 'adzan.'
    .repeat(4)
    .split('.')
    .map((a, i) => cdn + '/audio/' + a + (i + 1) + '.mp3')
    .slice(0, -1),
  adzan_subuh: 'adzan_subuh.'
    .repeat(4)
    .split('.')
    .map((a, i) => cdn + '/audio/' + a + (i + 1) + '.mp3')
    .slice(0, -1),
};

export class JadwalSholat {
  constructor(groups = {}, proxy = true) {
    if (cfg.proxy_url) delete cfg.proxy_url;
    this.groups = groups;
    cfg.proxies ??= [
      'https://thingproxy.freeboard.io/fetch/',
      'https://api.allorigins.win/raw?url=',
      'https://api.cors.lol/?url=',
    ];
    this.url = 'https://www.kompas.com/jadwal-sholat/';
  }

  async init(id, v = 'kab-bungo', opts = { ramadhan: false }) {
    try {
      Data.daerah =
        Data.daerah ||
        (await fetch(cdn + '/json/daerah.json').then((a) => a.json()));
      if (!Object.values(Data.daerah).flat().includes(v))
        return {
          status: false,
          msg: `Daerah "${v}" tidak ada dalam daftar!`,
          list: Object.values(Data.daerah).flat(),
        };
      let proxies = ['', ...cfg.proxies];
      for (let proxy of proxies) {
        try {
          let res = await fetch(proxy + this.url + v);
          if (!res.ok) continue;

          let html = await res.text();
          const $ = cheerio.load(html);

          let list = [];
          $(
            `#jadwal-${opts.ramadhan ? 'ramadhan' : 'sholat'} table tbody tr`
          ).each((index, element) => {
            let row = $(element)
              .find('td')
              .map((_, td) => $(td).text().trim())
              .get();
            if (row.length > 0) {
              if (!opts.ramadhan) {
                const dateMatch = row[0].match(/\d{2}\/\d{2}/);
                const dateOnly = dateMatch ? dateMatch[0].split('/')[0] : '';
                row = [
                  dateOnly,
                  dateMatch ? dateMatch[0] : '',
                  ...row.slice(1),
                ];
              }
              list.push(row);
            }
          });

          list = list.map((row) => {
            return Object.fromEntries(
              [
                'hari',
                'tanggal',
                ...(opts.ramadhan ? ['imsak'] : []),
                'subuh',
                'terbit',
                'dzuhur',
                'ashar',
                'magrib',
                'isya',
              ].map((key, index) => [key, row[index]])
            );
          });

          let timeZone = Data.daerah.wib.includes(v)
            ? 'Asia/Jakarta'
            : Data.daerah.wit.includes(v)
              ? 'Asia/Makassar'
              : 'Asia/Jayapura';
          if (id == 'no') return { status: true, data: list, timeZone };
          if (!(id in this.groups))
            this.groups[id] = { v, jadwal: list, timeZone, ...opts };
          return { status: true, data: list, db: this.groups[id] };
        } catch (e) {
          console.error(`[${proxy}] Error proxyng jadwalsholat.js > init`, e);
          continue;
        }
      }
      return { status: false, msg: `Failed to fetch using all proxies!` };
    } catch (e) {
      console.error('Error in jadwalsholat.js > init', e);
      return { status: false, msg: `jadwalsholat.js > init\nErr:${String(e)}` };
    }
  }

  async now(id) {
    Data.daerah =
      Data.daerah ||
      (await fetch(cdn + '/json/daerah.json').then((a) => a.json()));
    if (!id || !(id in this.groups))
      return {
        status: false,
        msg: 'id tidak ada dalam data, silahkan lakukan init terlebih dahulu',
      };
    let { timeZone, v, ramadhan } = this.groups[id];
    if (!Object.values(Data.daerah).flat().includes(v))
      return {
        status: false,
        msg: `Daerah "${v}" tidak ada dalam daftar!`,
        list: Object.values(Data.daerah).flat(),
      };

    if (!timeZone) {
      timeZone = this.groups[id].timezone = Data.daerah.wib.includes(v)
        ? 'Asia/Jakarta'
        : Data.daerah.wita.includes(v)
          ? 'Asia/Makassar'
          : 'Asia/Jayapura';
    }

    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const parts = formatter.formatToParts(new Date());
    const h = String(parts.find((p) => p.type === 'hour').value).padStart(
      2,
      '0'
    );
    const min = String(parts.find((p) => p.type === 'minute').value).padStart(
      2,
      '0'
    );
    const d = String(
      parseInt(parts.find((p) => p.type === 'day').value, 10)
    ).padStart(2, '0');
    const m = String(
      parseInt(parts.find((p) => p.type === 'month').value, 10)
    ).padStart(2, '0');

    let c = { hm: `${h}:${min}`, dm: `${d}/${m}` };
    this.groups[id].jadwal =
      this.groups[id].jadwal?.[0]?.tanggal?.split('/')?.[1] === m
        ? this.groups[id].jadwal
        : (await this.init(id, v)).data;
    this.groups[id].today =
      d == this.groups[id]?.today?.hari
        ? this.groups[id].today
        : this.groups[id].jadwal.find((a) => a.tanggal == c.dm);
    if (!this.groups[id].today) {
      await this.init(id, this.groups[id].v);
      this.groups[id].today = this.groups[id].jadwal.find(
        (a) => a.tanggal == c.dm
      );
    }
    let except = ['hari', 'tanggal', 'terbit', 'notice', 'imsak'];
    if (ramadhan) except = except.filter((a) => a !== 'imsak');
    let ktoday = Object.keys(this.groups[id]?.today || {}).filter(
      (a) => !except.some((b) => a.includes(b))
    );

    let waktu = ktoday.find((a) => {
      let [sh, sm] = this.groups[id]?.today?.[a]?.split(':').map(Number);
      return sh == h && parseInt(min) - sm <= 10 && parseInt(min) >= sm;
    });

    let hasNotice = Boolean(this.groups[id]?.today?.['notice-' + waktu]);
    if (waktu) this.groups[id].today['notice-' + waktu] = true;
    return {
      status: true,
      data: {
        today: this.groups[id].today,
        now: waktu || false,
        adzan:
          waktu == 'subuh'
            ? Data.audio.adzan_subuh.getRandom()
            : waktu
              ? Data.audio.adzan.getRandom()
              : null,
        hasNotice,
      },
      db: this.groups[id],
    };
  }
}
