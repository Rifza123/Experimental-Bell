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

const db = fol[0] + 'db/'
const conf = fol[3] + 'config.json'
let cmds = JSON.parse(fs.readFileSync(db + 'cmd.json'))
let config = JSON.parse(fs.readFileSync(conf))
let keys = Object.keys(config)

//antisipasi jika terhapus/hilang
if (!fs.existsSync(db + 'cmd.json')) {
  	fs.writeFileSync(db + 'cmd.json', JSON.stringify({
  		"total": 0,
  		"ai_response": 0,
  		"cmd": []
  }, null, 2))
}

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
global["Data"] = {
    use: { 
        cmds
    },
    events: {},
    Events: new Map()
}

/*!-======[ Cache Key Message ]======-!*/
global["key"] = {}

/*!-======[ Definition of Infos  ]======-!*/
await (fol[3] + "infos.js").r()

/*!-======[ Auto Update config.json ]======-!
   !- Setiap perubahan pada config yang terdapat pada global akan disimpan secara permanen setiap 30 detik
*/
setInterval(async() => {
    for(let i of keys){
      config[i] = global[i]
    }
    await fs.writeFileSync(conf, JSON.stringify(config, null, 2));
}, 30000);