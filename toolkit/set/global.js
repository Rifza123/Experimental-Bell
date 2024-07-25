/*!-≈≈≈≈≈[
   !- Script ini mengutamakan efisiensi dan penghematan code
*/

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
    8: './connection/'
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
//antisipasi jika terhapus/hilang
if (!fs.existsSync(db + 'cmd.json')) {
  	fs.writeFileSync(db + 'cmd.json', JSON.stringify({
  		"total": 0,
  		"ai_response": 0,
  		"cmd": []
  }, null, 2))
};
if (!fs.existsSync(db + 'preferences.json')) {
  	fs.writeFileSync(db + 'preferences.json', JSON.stringify({}))
};

if (!fs.existsSync(fol[6] + 'users.json')) {
  	fs.writeFileSync(fol[6]  + 'users.json', JSON.stringify({}, null, 2))
};

let users = JSON.parse(fs.readFileSync(fol[6] + 'users.json'));
let cmds = JSON.parse(fs.readFileSync(db + 'cmd.json'));
let preferences = JSON.parse(fs.readFileSync(db + 'preferences.json'));

/*!-======[ Definition of config  ]======-!*/
for (let i of keys){
  global[i] = config[i]
}

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
    users,
    preferences,
    use: { 
        cmds
    }
}

/*!-======[ Definition of Infos ]======-!*/
await (fol[3] + "infos.js").r()

/*!-======[ Auto Update ]======-!*/
await (fol[0] + "detector.js").r();
setInterval(async() => {
    for(let i of keys){
      config[i] = global[i]
    }
    await fs.writeFileSync(conf, JSON.stringify(config, null, 2));
    await fs.writeFileSync(fol[6] + 'users.json', JSON.stringify(Data.users, null, 2))
    await fs.writeFileSync(db + 'preferences.json', JSON.stringify(Data.preferences, null, 2))
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
