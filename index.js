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
await import ("./toolkit/set/string.prototype.js")
await "./toolkit/set/global.js".r()

/*!-======[ Mudules Imports ]======-!*/
const readline = "readline".import()
const fs = "fs".import()
const chalk = "chalk".import()
const baileys = "baileys".import()
const pino = "pino".import()
let { Boom } = "boom".import();
const NodeCache = "nodecache".import()

/*!-======[ Functions Imports ]======-!*/
Data.helper = (await "./helpers/client.js".r()).default
Data.utils = (await "./helpers/utils.js".r()).default
Data.In = (await "./helpers/interactive.js".r()).default
let { Connecting } = await "./connection/systemConnext.js".r()

let {
    makeWASocket,
    useMultiFileAuthState,
  	DisconnectReason,
  	getContentType,
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
        const Exp = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !global.pairingCode,
            browser: ['Chrome (Linux)', global["botname"], '1.0.0'],
            auth: state
        });
        
         if (global.pairingCode && !Exp.authState.creds.registered) {
            const phoneNumber = await question(chalk.yellow('Please type your WhatsApp number : '));
            let code = await Exp.requestPairingCode(phoneNumber.replace(/[+ -]/g, ""));
            console.log(chalk.bold.rgb(255, 136, 0)(`\n  ╭────────────────────────────╮\n  │  ${chalk.yellow('Your Pairing Code:')} ${chalk.greenBright(code)}  │\n  ╰────────────────────────────╯\n            `)
            );
          }        
        Exp.ev.on('connection.update', async (update) => {
            await Connecting({ update, Exp, Boom, DisconnectReason, sleep, launch });
        });

        Exp.ev.on('creds.update', saveCreds);
        
        Exp.ev.on('messages.upsert', async ({
  			messages
  		}) => {
  			const mess = messages[0]
            const cht = {
                ...mess,
                id: mess.key.remoteJid
            }
  			if (!cht.message) return;
  			if (cht.key.remoteJid === 'status@broadcast' && cfg.autoreadsw == true) {
  				await Exp.readMessages([cht.key]);
  				let typ = getContentType(cht.message);
  				console.log((/protocolMessage/i.test(typ)) ? `${cht.key.participant.split('@')[0]} Deleted story❗` : 'View user stories : ' + cht.key.participant.split('@')[0]);
  				return
  			}
  			 if (cht.key.remoteJid !== 'status@broadcast'){
  			     const exs = { cht, Exp, is: {}, store }
  			     await Data.utils(exs)
                 await Data.helper(exs);
             }
	});
	store.bind(Exp.ev);
}
launch()

