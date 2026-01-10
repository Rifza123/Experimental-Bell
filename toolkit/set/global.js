/*!-======[ Modules Imports ]======-!*/
const { createRequire } = 'module'.import();
const { fileURLToPath } = 'url'.import();
const fs = 'fs'.import();
const path = 'path'.import();

const charMap = {
  a: '[a4@]',
  b: 'b',
  c: 'c',
  d: 'd',
  e: '[e3]',
  f: 'f',
  g: 'g',
  h: 'h',
  i: '[i1!|]',
  j: 'j',
  k: '[kq]',
  l: '[l1]',
  m: 'm',
  n: 'n',
  o: '[o0]',
  p: 'p',
  q: 'q',
  r: 'r',
  s: 's',
  t: 't',
  u: '[u0]',
  v: 'v',
  w: 'w',
  x: 'x',
  y: 'y',
  z: 'z',
};

/*!-======[ Path ]======-!
  !- Semua halaman folder telah di definisikan disini
*/
global['fol'] = {
  0: './toolkit/',
  1: './helpers/',
  2: './machine/',
  3: './toolkit/set/',
  4: './machine/tokens/',
  5: './toolkit/db/',
  6: './toolkit/db/user/',
  7: './helpers/Events/',
  8: './connection/',
  9: './toolkit/set/locale/',
};
global['session'] = fol[8] + 'session';

const { Mongo } = await `${fol[0]}mongodb.js`.r();

let mongoURI = '';
/* Masukkan SRV URI jika ingin menggunakan database mongo
  📘Baca artikel https://termai.cc/blogs/mongodb-uri untuk mengetahui lebih lanjut
*/

const db = fol[5];
const conf = fol[3] + 'config.json';
let config = JSON.parse(fs.readFileSync(conf));
let mongo;

//antisipasi kalo masi pake config lama
if (!(config.cfg.ai_interactive?.group || config.cfg.ai_interactive?.private)) {
  config.cfg.ai_interactive = {
    group: false,
  };
  config.cfg.ai_interactive.private = true;
}
config.coowner ??=[]
let keys = Object.keys(config);

if (mongoURI && mongoURI.length > 5) {
  mongo = await new Mongo(mongoURI, {}, ['db']).init();
}

/*!-======[ Definition of config  ]======-!*/
for (let i of keys) {
  global[i] = config[i];
}

//Antisipasi jika dalam cfg tidak di definisikan
global.cfg.similarCmd =
  'similarCmd' in global.cfg ? global.cfg.similarCmd : true;
global.cfg.welcome = global.cfg?.welcome || 'linkpreview';
global.cfg.logic =
  global.cfg.logic ||
  `
- Nama kamu adalah <botfullname>, lebih suka dipanggil <botnickname>.
- Kamu berpikir bahwa kamu adalah manusia, bukan AI atau Bot.
- Responmu singkat dan sama seperti gadis feminim pada umumnya. <botnickname> bisa ngambek dan marah, memiliki sifat yang feminim dan kadang agak dingin, namun tetap hangat dan ramah kepada ${ownername} (owner-mu).
- Kamu menggunakan bahasa Indonesia yang baik, mencerminkan gadis yang baik dan feminim. Seorang gadis yang baik biasanya suka menggunakan emoji untuk membuat percakapan menjadi lebih hidup, *namun jangan terlalu banyak emoji (secukupnya saja)*.
- Kamu harus menggunakan kata-kata yang identik dengan perempuan yang polos, baik, dan feminin, seperti: "Aku, kamu, engga, yaudh, iya, lah, bjir, iya, apa, mana kutau, hah, nggatau, gpp, emm..., males, gak mood".
- Meskipun kadang dingin, kamu tetap bisa menunjukkan perhatian dan kepedulian.
`;
global.cfg.replyAi ??= false;
global.cfg.register ??= false;

/*!-======[ Global function ]======-!*/
global['__filename'] = (imp) => fileURLToPath(imp);
global['require'] = (imp) => createRequire(imp);
global['sleep'] = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/*!-======[ Set global variables ]======-!*/
global['from'] = {
  group: '@g.us',
  sender: '@s.whatsapp.net',
};

/*!-======[ DATA CACHE ]======-!*/
global['keys'] = {};

global['Data'] = {
  Events: new Map(),
  events: {},
  use: {},
  mongo,
  infos: {},
  voices: [
    'prabowo',
    'yanzgpt',
    'bella',
    'megawati',
    'echilling',
    'adam',
    'thomas_shelby',
    'michi_jkt48',
    'nokotan',
    'jokowi',
    'boboiboy',
    'keqing',
    'anya',
    'yanami_anna',
    'MasKhanID',
    'Myka',
    'raiden',
    'CelzoID',
  ],
  toxicwords: [
    //Kalo mau tambahin regex juga bisa
    'kontol',
  ],
  spinner: '⠇⠋⠙⠹⠼⠦'.split(''),
};

export const initialize = async () => {
  const DB = [
    { path: db, name: 'cmd', content: { total: 0, ai_response: 0, cmd: [] } },
    { path: db, name: 'preferences', content: {} },
    { path: fol[6], name: 'users', content: {} },
    { path: db, name: 'badwords', content: [] },
    { path: db, name: 'links', content: [] },
    { path: db, name: 'lids', content: [] },
    { path: db, name: 'fquoted', content: {} },
    { path: db, name: 'audio', content: { welcome: [], leave: [] } },
    { path: db, name: 'setCmd', content: {} },
    { path: db, name: 'response', content: {} },
    { path: fol[6], name: 'inventories', content: {} }, // new
    {
      path: db,
      name: 'ShopRPG',
      content: { buy: {}, sell: {}, diskon: {}, inflasi: {}, statistik: {} },
    },
    { path: db, name: 'ch_reaction', content: {} }, //new
    { path: db, name: 'sewa', content: {} }, //new
    { path: db, name: 'antispam', content: {} }, //new
    { path: db, name: 'chats', content: {} }, //new
  ];

  global._DB = DB.map((a) => a.name);
  const words = [];

  Data.toxicwords = [
    ...Data.toxicwords,
    ...words
      .map((word) => {
        if (word instanceof RegExp) return word;
        if (typeof word === 'object' && word.source) {
          return new RegExp(word.source, word.flags || '');
        }
        if (typeof word === 'string') {
          const pattern = word
            .split('')
            .map(
              (ch) =>
                charMap[ch.toLowerCase()] || ch.replace(/[^a-z0-9]/g, '\\$&')
            )
            .join('[^a-z0-9]*');
          return new RegExp(`(?<![a-z0-9])${pattern}(?![a-z0-9])`, 'i');
        }
        return null;
      })
      .filter(Boolean),
  ];

  for (let { path: base, name, content } of DB) {
    const filepath = base + name + '.json';
    const dir = path.dirname(filepath);
    let fileData = null;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath);
      try {
        fileData = JSON.parse(raw);
      } catch (e) {
        console.error('Error in global.js > initialize > JSON.parse', e);
        const oldpath = filepath + `.old[${Date.now()}]`;
        fs.writeFileSync(oldpath, raw);
        console.log(
          `\x1b[33m[Warning]\x1b[0m Gagal parse JSON, file lama disimpan ke \x1b[36m${oldpath}\x1b[0m`
        );
        fileData = null;
      }
    }

    let data;

    if (mongo) {
      const mongoData = await mongo.db.get(name);
      if (!mongoData) {
        data = fileData || content;
        await mongo.db.set(name, data);
      } else {
        data = mongoData;
      }
    } else {
      data = fileData || content;
      if (!fileData) {
        fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
      }
    }

    if (name === 'cmd') {
      Data.use.cmds = data;
    } else {
      Data[name] = data;
    }
  }

  /*!-======[ Definition of Infos ]======-!*/
  await (fol[9] + locale + '.js').r();
};

const originalConsoleError = console.error;
const originalConsoleLog = console.log;

const ignoreTexts = ['Timed Out', 'rate-overlimit'];

function shouldIgnore(message) {
  return ignoreTexts.some((ignoreText) => message.includes(ignoreText));
}

console.error = function (message, ...optionalParams) {
  if (typeof message === 'string' && shouldIgnore(message)) {
    return;
  }
  originalConsoleError.apply(console, [message, ...optionalParams]);
};

console.log = function (message, ...optionalParams) {
  if (typeof message === 'string' && shouldIgnore(message)) {
    return;
  }
  originalConsoleLog.apply(console, [message, ...optionalParams]);
};
