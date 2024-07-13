  /** !-======[ Experimentall ▪︎ Bell🦋 ]======-!
      * Coding by @rifza.p.p *     
      
      🩵 Follow ️me on :
      ▪︎ https://youtube.com/@rifza  
      ▪︎ https://github.com/Rifza123
      ▪︎ https://instagram.com/rifza.p.p?igshid=ZGUzMzM3NWJiOQ==
      ▪︎ https://www.threads.net/@rifza.p.p
      ▪︎ https://xterm.tech
  */
/*!-======[ Preparing Configuration ]======-!*/
await import("./toolkit/set/string.prototype.js")
await "./toolkit/set/global.js".r()

/*!-======[ Mudules Imports ]======-!*/
const readline = "readline".import()
const fs = "fs".import()
const chalk = "chalk".import()
const baileys = "baileys".import()
const pino = "pino".import()
const NodeCache = "nodecache".import()
let { Boom } = "boom".import();

/*!-======[ Functions Imports ]======-!*/
const { EventEmitter } = await "./toolkit/events.js".r();
const { ArchiveMemories } = await "./toolkit/usr.js".r();
const { color, bgcolor } = await './toolkit/color.js'.r();
const { ai } = await "./machine/reasoner.js".r();
const { func } = await "./toolkit/func.js".r();
let { Connecting } = await "./connection/systemConnext.js".r()

let {
    makeWASocket,
    useMultiFileAuthState,
  	DisconnectReason,
  	getContentType,
  	fetchLatestBaileysVersion,
  	makeInMemoryStore
} = baileys;


let store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

async function launch() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (text) => new Promise((resolve) => rl.question(text, resolve));
    if(fs.existsSync(session) && !fs.existsSync(session + "/creds.json")) await fs.rmdir(session, { recursive: true }, (err) => {} )   
    if (!fs.existsSync(session + "/creds.json")) {
    let quest = `\n${chalk.red.bold('╭──────────────────────────────────────────────────────╮')}\n${chalk.red.bold('│')} ${chalk.bold('❗️ Anda belum memiliki session ❗️')} ${chalk.red.bold('│')}\n${chalk.red.bold('╰──────────────────────────────────────────────────────╯')}\n            \n${chalk.green('🏷 Pilih salah satu dari opsi berikut untuk menautkan perangkat:')}\n${chalk.blue('▪︎ qr')}\n${chalk.blue('▪︎ pairing')}\n\n${chalk.yellow('* Ketik salah satu dari opsi di atas, contoh:')} ${chalk.blue.bold('pairing')}\n\n${chalk.yellow('Please type here: ')}`;
 
        await sleep(1000)
        const opsi = await question(quest);
  	    if (opsi == "pairing") {
  			global.pairingCode = true
  		} else if (opsi == "qr") {
  			global.pairingCode = false
  		} else {
  			console.log(`Pilihan opsi tidak tersedia!`)
  		}
  	}
  	
  	let { state, saveCreds } = await useMultiFileAuthState(session);
    
    let { version } = fetchLatestBaileysVersion();
        const msgRetryCounterCache = new NodeCache();
        const Exp = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !global.pairingCode,
            browser: ['Chrome (Linux)', global["botname"], '1.0.0'],
            auth: state,
            generateHighQualityLinkPreview: true,
            msgRetryCounterCache
        });
        
         if (global.pairingCode && !Exp.authState.creds.registered) {
            const phoneNumber = await question(chalk.yellow('Please type your WhatsApp number : '));
            let code = await Exp.requestPairingCode(phoneNumber.replace(/[+ -]/g, ""));
            console.log(chalk.bold.rgb(255, 136, 0)(`\n  ╭────────────────────────────╮\n  │  ${chalk.yellow('Your Pairing Code:')} ${chalk.greenBright(code)}  │\n  ╰────────────────────────────╯\n            `)
            );
          }        
        Exp.ev.on('connection.update', async (update) => {
            Connecting({ update, Exp, Boom, DisconnectReason, sleep, launch });
        });

        Exp.ev.on('creds.update', saveCreds);
        store.bind(Exp.ev);
        
        Exp.ev.on('messages.upsert', async ({
  			messages
  		}) => {
  	    	const { default: helper } = await "./helpers/client.js".r()
  	    	const { default: In } = await "./helpers/interactive.js".r();

  			const cht = messages[0];
  			      cht.id = cht.key.remoteJid
  			if (!cht.message) return;
  			if (cht.key.remoteJid === 'status@broadcast' && cfg.autoreadsw == true) {
  				Exp.readMessages([cht.key]);
  				let typ = getContentType(cht.message);
  				console.log((/protocolMessage/i.test(typ)) ? `${cht.key.participant.split('@')[0]} Deleted story❗` : 'View user stories : ' + cht.key.participant.split('@')[0]);
  			}
  			await helper({Exp, store, cht, In, func, ai, color, bgcolor, ArchiveMemories, EventEmitter, getContentType})
  		});
}
launch()
process.on('uncaughtException', console.log);