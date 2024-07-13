/*!-======[ Modules Imports ]======-!*/
const { createRequire } = 'module'.import()
const { fileURLToPath } = 'url'.import()
const fs = "fs".import()
const path = 'path'.import()
const db = './toolkit/db/'
if (!fs.existsSync(db + 'cmd.json')) {//antisipasi jika terhapus/hilang
  	fs.writeFileSync(db + 'cmd.json', JSON.stringify({
  		"total": 0,
  		"ai_response": 0,
  		"cmd": []
  }, null, 2))
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

/*!-======[ Set bot information ]======-!*/
global['owner'] = [
    '6283110928302'
].map(a => a + from.sender);
global['botname'] = '(Experimental) -▪︎ Bella-AI';
global['botfullname'] = "Bella Clarissa"
global['botnickname'] = "Bella"
global['ownername'] = "rifza"

/*!-======[ Path ]======-!*/
global['session'] = './connection/session';
global['fol'] = {
    0: './toolkit/',
    1: './helpers/',
    2: './machine/',
    3: './toolkit/set/',
    4: './machine/tokens/',
    5: './toolkit/db/',
    6: './toolkit/db/user/',
}

/*!-======[ Set configuration ]======-!*/
global['cfg'] = {
    public: !0,
    ai_interactive: !0,
    autotyping: !1,
    first: {
        energy: 200
    },
    menu: {
        frames: {
            brackets: ["[","]"],
            head: '┌',
            body: '│⇨',
             foot: '└',
        },
        tags: {
            ai: '*<🧠Artificial Intelegen>*',
            downloader: '*<📥Media Downloader>*',
            group: '*<🏢Only Group!>*',
            maker: '*<🖨Maker>*',
            owner: '*<👤Only owner!>*',
            religion: '*<☪️Religion>*',
            game: '*<🎮Game>*',
            RPG: '*<🗺RPG Survival>*',
            tools: '*<🛠Tools>*',
            search: '*<🔍Search>*',
            art: '*<🌌Art Works>*',
            stablediffusion: '*<🫧Stable Diffusion (AI)>*',
            tts: '*<🗣Text To Speech (AI)>*',
            voice_changer: '*<🎙Voice Changer (AI)>*',
            other: '*<Others>*',
            bluearchive: '*<Blue Archive TTS (AI)*',
        },
        infos: {
        }
    }
};

global["api"] = {
    rifza: {
        key: "Bell409",
        url: "https://rifza.me"
    },
    xterm: {
        key: "Bell409",
        url: "https://ai.xterm.codes"
    }
}

/*!-======[ DATA CACHE ]======-!*/
global["Data"] = {
    use: { 
        cmds: JSON.parse(fs.readFileSync('./toolkit/db/cmd.json'))
    },
    events: {},
    Events: new Map()
}

/*!-======[ Cache Key Message ]======-!*/
global["key"] = {}

/*!-======[ Definition of Infos  ]======-!*/
await "./toolkit/set/infos.js".r()