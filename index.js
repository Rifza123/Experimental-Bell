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
import "./toolkit/set/string.prototype.js";
import jimp from "jimp"
await "./toolkit/set/global.js".r()

/*!-======[ Mudules Imports ]======-!*/
const readline = "readline".import()
const fs = "fs".import()
const chalk = "chalk".import()
const baileys = "baileys".import()
const pino = "pino".import()
const { Boom } = "boom".import();
const { Connecting } = await `${fol[8]}systemConnext.js`.r()
const { func } = await `${fol[0]}func.js`.r()
let {
    makeWASocket,
    useMultiFileAuthState,
  	DisconnectReason,
  	getContentType,
  	makeInMemoryStore,
  	getBinaryNodeChild, 
  	jidNormalizedUser
} = baileys;

/*!-======[ Functions Imports ]======-!*/
Data.utils = (await `${fol[1]}utils.js`.r()).default
Data.helper = (await `${fol[1]}client.js`.r()).default
Data.In = (await `${fol[1]}interactive.js`.r()).default
Data.reaction = (await `${fol[1]}reaction.js`.r()).default
Data.EventEmitter = (await `${fol[1]}events.js`.r()).default
Data.stubTypeMsg = (await `${fol[1]}stubTypeMsg.js`.r()).default

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
            auth: state,
            getMessage: async (key) => {
              let jid = jidNormalizedUser(key.remoteJid)
              let msg = await store.loadMessage(jid, key.id)
              return msg?.message || ""
            }
        });
        
        if (global.pairingCode && !Exp.authState.creds.registered) {
           const phoneNumber = await question(chalk.yellow('Please type your WhatsApp number : '));
           let code = await Exp.requestPairingCode(phoneNumber.replace(/[+ -]/g, ""));
           console.log(chalk.bold.rgb(255, 136, 0)(`\n  ╭────────────────────────────╮\n  │  ${chalk.yellow('Your Pairing Code:')} ${chalk.greenBright(code)}  │\n  ╰────────────────────────────╯\n            `)
           );
        }
        
        /*!-======[ INITIALIZE Exp Functions ]======-!*/
        Exp.func = new func({ Exp, store })
        
        Exp.profilePictureUrl = async (jid, type = 'image', timeoutMs) => {
            jid = jidNormalizedUser(jid)
            const result = await Exp.query({
                tag: 'iq',
                attrs: {
                    target: jid,
                    to: "@s.whatsapp.net",
                    type: 'get',
                    xmlns: 'w:profile:picture'
                },
                content: [
                    { tag: 'picture', attrs: { type, query: 'url' } }
                ]
            }, timeoutMs)

            const child = getBinaryNodeChild(result, 'picture')
            return child?.attrs?.url
        }

        Exp.setProfilePicture = async (id,buffer) => {
          try{
            id = jidNormalizedUser(id)
            const jimpread = await jimp.read(buffer);
            const min = jimpread.getWidth()
         	const max = jimpread.getHeight()
        	const cropped = jimpread.crop(0, 0, min, max)

            let buff = await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG)
            return await Exp.query({
				tag: 'iq',
				attrs: {
				    to: id,
					type:'set',
					xmlns: 'w:profile:picture'
				},
				content: [
					{
						tag: 'picture',
						attrs: { type: 'image' },
						content: buff
					}
				]
			})
          } catch (e) {
              throw new Error(e)
          }
        }

        /*!-======[ EVENTS Exp ]======-!*/
        Exp.ev.on('connection.update', async (update) => {
            await Connecting({ update, Exp, Boom, DisconnectReason, sleep, launch });
        });

        Exp.ev.on('creds.update', saveCreds);
        
        Exp.ev.on('messages.upsert', async ({
  			messages
  		}) => {
            const cht = {
                ...messages[0],
                id: messages[0].key.remoteJid
            }
            let isMessage = cht?.message
            let isStubType = cht?.messageStubType
  			if (!(isMessage || isStubType)) return;
  			if (cht.key.remoteJid === 'status@broadcast' && cfg.autoreadsw == true) {
  				await Exp.readMessages([cht.key]);
  				let typ = getContentType(cht.message);
  				console.log((/protocolMessage/i.test(typ)) ? `${cht.key.participant.split('@')[0]} Deleted story❗` : 'View user stories : ' + cht.key.participant.split('@')[0]);
  				return
  			}
  			 if (cht.key.remoteJid !== 'status@broadcast'){
  			     const exs = { cht, Exp, is: {}, store }
  			     await Data.utils(exs)
  			     
  			     if(isStubType) { 
  			       Data.stubTypeMsg(exs)
  			     } else { 
                  await Data.helper(exs);
                 }
             }
	    });

	    
	    store.bind(Exp.ev);
}
launch()