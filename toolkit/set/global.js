/*!-======[ Modules Imports ]======-!*/
const { createRequire } = 'module'.import()
const { fileURLToPath } = 'url'.import()
const fs = "fs".import()
const path = 'path'.import()

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
}
global['session'] = fol[8] + 'session';

const db = fol[5]
const conf = fol[3] + 'config.json'
let config = JSON.parse(fs.readFileSync(conf))
let keys = Object.keys(config)

//antisipasi kalo masi pake config lama
if(!(config.cfg.ai_interactive?.group || config.cfg.ai_interactive?.private)){
    config.cfg.ai_interactive = {
      group: false
    }
    config.cfg.ai_interactive.private = true
}

const files = [
    { path: db + 'cmd.json', content: { "total": 0, "ai_response": 0, "cmd": [] } },
    { path: db + 'preferences.json', content: {} },
    { path: fol[6] + 'users.json', content: {} },
    { path: db + 'badwords.json', content: [] },
    { path: db + 'links.json', content: [] },
    { path: db + 'fquoted.json', content: {} },
    { path: db + 'audio.json', content: { welcome:[], leave:[] } }
]

files.forEach(file => {
    if (!fs.existsSync(file.path)) {
        fs.writeFileSync(file.path, JSON.stringify(file.content, null, 2));
    }
})

/*!-======[ Definition of config  ]======-!*/
for (let i of keys){
  global[i] = config[i]
}

//Antisipasi jika dalam cfg.clgic tidak di definisikan
global.cfg.similarCmd = "similarCmd" in global.cfg ? global.cfg.similarCmd : true
global.cfg.welcome = global.cfg?.welcome || "linkpreview"
global.cfg.logic = global.cfg.logic || `
- Nama kamu adalah <botfullname>, lebih suka dipanggil <botnickname>.
- Kamu berpikir bahwa kamu adalah manusia, bukan AI atau Bot.
- Responmu singkat dan sama seperti gadis feminim pada umumnya. <botnickname> bisa ngambek dan marah, memiliki sifat yang feminim dan kadang agak dingin, namun tetap hangat dan ramah kepada ${ownername} (owner-mu).
- Kamu menggunakan bahasa Indonesia yang baik, mencerminkan gadis yang baik dan feminim. Seorang gadis yang baik biasanya suka menggunakan emoji untuk membuat percakapan menjadi lebih hidup, *namun jangan terlalu banyak emoji (secukupnya saja)*.
- Kamu harus menggunakan kata-kata yang identik dengan perempuan yang polos, baik, dan feminin, seperti: "Aku, kamu, engga, yaudh, iya, lah, bjir, iya, apa, mana kutau, hah, nggatau, gpp, emm..., males, gak mood".
- Meskipun kadang dingin, kamu tetap bisa menunjukkan perhatian dan kepedulian.
`

/*!-======[ Global function ]======-!*/
global['__filename'] = (imp)=> fileURLToPath(imp);
global['require'] = (imp)=> createRequire(imp);
global['sleep'] = async(ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };

/*!-======[ Set global variables ]======-!*/
global['from'] = {
    'group': '@g.us',
    'sender': '@s.whatsapp.net'
};

/*!-======[ DATA CACHE ]======-!*/
global["keys"] = {}

global["Data"] = {
    Events: new Map(),
    events: {},
    badwords: JSON.parse(fs.readFileSync(db + 'badwords.json')),
    links: JSON.parse(fs.readFileSync(db + 'links.json')),
    users: JSON.parse(fs.readFileSync(fol[6] + 'users.json')),
    audio: JSON.parse(fs.readFileSync(db + 'audio.json')),
    fquoted: JSON.parse(fs.readFileSync(db + 'fquoted.json')),
    preferences: JSON.parse(fs.readFileSync(db + 'preferences.json')),
    use: { 
        cmds: JSON.parse(fs.readFileSync(db + 'cmd.json'))
    },
    infos:{},
    voices: [
      "prabowo",
      "yanzgpt",
      "bella",
      "megawati",
      "echilling",
      "adam",
      "thomas_shelby",
      "michi_jkt48",
      "nokotan",
      "jokowi",
      "boboiboy",
      "keqing",
      "yanami_anna",
      "MasKhanID"
    ]
}

/*!-======[ Definition of Infos ]======-!*/
await fs.readdirSync(fol[9] + locale+"/")
  .filter(file => file.endsWith('.js')).forEach(async file => await (fol[9] + locale + "/" + file).r())

/*!-======[ Auto Update ]======-!*/
await (fol[0] + "detector.js").r();
setInterval(async() => {
    for(let i of keys){
      config[i] = global[i]
    }
    await fs.writeFileSync(conf, JSON.stringify(config, null, 2));
    await fs.writeFileSync(fol[6] + 'users.json', JSON.stringify(Data.users, null, 2))
    await fs.writeFileSync(db + 'preferences.json', JSON.stringify(Data.preferences, null, 2))
    await fs.writeFileSync(db + 'badwords.json', JSON.stringify(Data.badwords, null, 2))
    await fs.writeFileSync(db + 'links.json', JSON.stringify(Data.links, null, 2))
    await fs.writeFileSync(db + 'audio.json', JSON.stringify(Data.audio, null, 2))
    await fs.writeFileSync(db + 'fquoted.json', JSON.stringify(Data.fquoted, null, 2))
}, 15000);


const originalConsoleError = console.error;
const originalConsoleLog = console.log;

const ignoreTexts = ["Timed Out", "rate-overlimit"];

function shouldIgnore(message) {
  return ignoreTexts.some(ignoreText => message.includes(ignoreText));
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
