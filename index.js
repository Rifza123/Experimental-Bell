/** !-======[ Experimentall ▪︎ Bell🦋 ]======-!
      * Coding by @rifza.p.p *     
      
      🩵 Follow ️me on :
      ▪︎ https://youtube.com/@rifza  
      ▪︎ https://github.com/Rifza123
      ▪︎ https://instagram.com/rifza.p.p?igshid=ZGUzMzM3NWJiOQ==
      ▪︎ https://www.threads.net/@rifza.p.p
      ▪︎ https://termai.cc
      ▪︎ https://xterm.tech
  */
/*!-======[ Preparing Configuration ]======-!*/
import './toolkit/set/prototype.js';
let { initialize } = await './toolkit/set/global.js'.r();

/*!-======[ Mudules Imports ]======-!*/
const path = 'path'.import();
const readline = 'readline'.import();
const fs = await 'fs/promises'.import();
const chalk = 'chalk'.import();
const baileys = 'baileys'.import();
const pino = 'pino'.import();
const { Boom } = 'boom'.import();
const { Connecting } = await `${fol[8]}systemConnext.js`.r();
const Event = (await 'events'.import()).default;
let { makeInMemoryStore } = await `${fol[0]}store.js`.r();
let { func } = await `${fol[0]}func.js`.r();

Event.defaultMaxListeners = 25;

let {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  getContentType,
  Browsers,
} = baileys;

await initialize(); //db
/*!-======[ Functions Imports ]======-!*/
let detector = (await (fol[0] + 'detector.js').r()).default;
Data.utils = (await `${fol[1]}utils.js`.r()).default;
Data.helper = (await `${fol[1]}client.js`.r()).default;
Data.In = (await `${fol[1]}interactive.js`.r()).default;
Data.reaction = (await `${fol[1]}reaction.js`.r()).default;
Data.EventEmitter = (await `${fol[1]}events.js`.r()).default;
Data.stubTypeMsg = (await `${fol[1]}stubTypeMsg.js`.r()).default;
Data.eventGame = (await `${fol[1]}eventGame.js`.r()).default;

Data.initialize = (await `${fol[1]}initialize.js`.r()).default;

let logger = pino({ level: 'silent' });
let store = makeInMemoryStore();
let Func = new func({ store });

let Exp, Detector;

global.debug = process.argv.includes('debug') || process.argv.includes('--debug');

if (global.debug) {
  console.log(chalk.bold.yellow('╔══════════════════════════════════════════════════╗'));
  console.log(chalk.bold.yellow('║') + chalk.bold.green('   🐞 DEBUG MODE AKTIF: MONITOR PESAN MASUK       ') + chalk.bold.yellow('║'));
  console.log(chalk.bold.yellow('╚══════════════════════════════════════════════════╝'));
}

function debugLogMessage(message, type = 'notify') {
  if (message?.key?.fromMe) return;
  try {
    const key = message?.key || {};
    const remoteJid = key.remoteJid || 'unknown';
    const isGroup = remoteJid.endsWith('@g.us');
    const isStatus = remoteJid === 'status@broadcast';
    const isNewsletter = remoteJid.endsWith('@newsletter');
    const chatType = isGroup ? 'GROUP' : isStatus ? 'STATUS' : isNewsletter ? 'CHANNEL' : 'PRIVATE';
    const sender = key.participant || message?.participant || remoteJid;
    const pushName = message?.pushName || '-';
    const msgType = getContentType(message?.message) || (message?.messageStubType ? `stubType:${message.messageStubType}` : 'unknown');
    const msgId = key.id || '-';
    const ts = message?.messageTimestamp;
    const timeStr = ts
      ? new Date((typeof ts === 'object' && ts.low ? ts.low : Number(ts)) * 1000).toLocaleString('id-ID')
      : new Date().toLocaleString('id-ID');

    console.log(chalk.bold.yellow(`\n┌─── [DEBUG] PESAN MASUK ──────────────────────────────────────────`));
    console.log(`${chalk.cyan('│')} ${chalk.bold('Event Type')}   : ${chalk.white(type)}`);
    console.log(`${chalk.cyan('│')} ${chalk.bold('Chat')}         : ${chalk.green(remoteJid)} ${chalk.gray(`(${chatType})`)}`);
    console.log(`${chalk.cyan('│')} ${chalk.bold('Sender')}       : ${chalk.green(sender)} ${chalk.gray(`[${pushName}]`)}`);
    console.log(`${chalk.cyan('│')} ${chalk.bold('Message ID')}   : ${chalk.white(msgId)}`);
    console.log(`${chalk.cyan('│')} ${chalk.bold('Message Type')} : ${chalk.magenta(msgType)}`);
    console.log(`${chalk.cyan('│')} ${chalk.bold('Waktu')}        : ${chalk.gray(timeStr)}`);
    console.log(chalk.yellow('├─── [ PAYLOAD LENGKAP ] ──────────────────────────────────────────'));
    try {
      if (typeof message.String === 'function') {
        console.log(message.String(2));
      } else {
        console.log(JSON.stringify(message, null, 2));
      }
    } catch {
      console.log(message);
    }
    console.log(chalk.yellow('└───────────────────────────────────────────────────────────────────\n'));
  } catch (err) {
    console.error('[DEBUG LOG ERROR]', err);
  }
}

async function launch() {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (text) =>
      new Promise((resolve) => rl.question(text, resolve));
    if (
      (await Func.exists(session)) &&
      !(await Func.exists(session + '/creds.json'))
    )
      await fs.rm(session, { recursive: true, force: true });
    if (!(await Func.exists(session + '/creds.json'))) {
      let quest = `\n${chalk.red.bold('╭──────────────────────────────────────────────────────╮')}\n${chalk.red.bold('│')} ${chalk.bold('❗️ Anda belum memiliki session ❗️')} ${chalk.red.bold('│')}\n${chalk.red.bold('╰──────────────────────────────────────────────────────╯')}\n            \n${chalk.green('🏷 Pilih salah satu dari opsi berikut untuk menautkan perangkat:')}\n${chalk.blue('▪︎ qr')}\n${chalk.blue('▪︎ pairing')}\n\n${chalk.yellow('* Ketik salah satu dari opsi di atas, contoh:')} ${chalk.blue.bold('pairing')}\n\n${chalk.yellow('Please type here: ')}`;

      await sleep(1000);
      const opsi = await question(quest);
      if (opsi == 'pairing') {
        global.pairingCode = true;
      } else if (opsi == 'qr') {
        global.pairingCode = false;
      } else {
        console.log(`Pilihan opsi tidak tersedia!`);
      }
    }

    let { state, saveCreds } = await useMultiFileAuthState(session);

    Exp = makeWASocket({
      logger,
      version: [
        2,
        3000,
        await fetch(
          'https://raw.githubusercontent.com/Rifza123/Experimental-Bell/refs/heads/master/version'
        )
          .then((a) => a.text())
          .then(async (t) =>
            /^\d+$/.test(t.trim())
              ? Number(t.trim())
              : Number((await fs.readFile('./version', 'utf8')).trim())
          )
          .catch(async () =>
            Number((await fs.readFile('./version', 'utf8')).trim())
          ),
      ],
      printQRInTerminal: !global.pairingCode,
      browser: Browsers.ubuntu('Chrome'),
      auth: state,
      retryRequestDelayMs: 5000,
      maxMsgRetryCount: 2,
      getMessage: async () => undefined,
      cachedGroupMetadata: (jid) => Func.metadata.get(jid),
      syncFullHistory: false,
    });

    const { groupMetadata } = Exp;
    Func.init({ Exp, groupMetadata });
    Func.metadata.init();
    Exp.func = Func;

    /*!-======[ Detect File Update ]======-!*/
    Detector ??= detector({ Exp, store });

    Exp.groupMetadata = async (id, update, force) =>
      Func.getGroupMetadata(id, update, force);

    if (global.pairingCode && !Exp.authState.creds.registered) {
      const phoneNumber = await question(
        chalk.yellow('Please type your WhatsApp number : ')
      );
      let code = await Exp.requestPairingCode(
        phoneNumber.replace(/[+ -]/g, ''),
        'TERMAICC'
      );
      console.log(
        chalk.bold.rgb(
          255,
          136,
          0
        )(
          `\n  ╭────────────────────────────╮\n  │  ${chalk.yellow('Your Pairing Code:')} ${chalk.greenBright(code)}  │\n  ╰────────────────────────────╯\n            `
        )
      );
    }

    /*!-======[ INITIALIZE ]======-!*/
    Data.initialize({ Exp, store }); //Exp function

    /*!-======[ EVENTS Exp ]======-!*/
    Exp.ev.on('connection.update', async (update) => {
      await Connecting({ update, Exp, Boom, DisconnectReason, sleep, launch });
      if (update.connection === 'open') {
        const { default: jadibot, checkExpiredJadibots } = await `${fol[1]}jadibot.js`.r();
        await checkExpiredJadibots().catch(e => console.error(e));
        Data.jadibot ??= {};
        for (let slot of Object.keys(Data.jadibot)) {
          const info = Data.jadibot[slot];
          if (info && info.botNumber) {
            console.log(`[AUTOLOAD] Reconnecting Jadibot: ${info.botNumber}`);
            jadibot({
              Exp,
              id: info.owner,
              botNumber: info.botNumber,
              pairing: false,
              expired: info.expired || 0,
            }).catch(e => console.error(e));
          }
        }
      }
    });

    Exp.ev.on('creds.update', saveCreds);
    Exp.ev.on('message-receipt.update', async (msg) => {
      /* console.log(msg)
     la  | [
0|bella  |   {
0|bella  |     key: {
0|bella  |       remoteJid: '120363145935286949@g.us',
0|bella  |       id: '3EB0B93C02C7C41AAE9549',
0|bella  |       fromMe: true,
0|bella  |       participant: '6283110928302@s.whatsapp.net'
0|bella  |     },
0|bella  |     receipt: {
0|bella  |       userJid: '6283110928302@s.whatsapp.net',
0|bella  |       readTimestamp: 1755108157
0|bella  |     }
0|bella  |   },
0|bella  |   {
0|bella  |     key: {
0|bella  |       remoteJid: '120363145935286949@g.us',
0|bella  |       id: '3EB0674A48121D16F94671',
0|bella  |       fromMe: true,
0|bella  |       participant: '6283110928302@s.whatsapp.net'
0|bella  |     },
0|bella  |     receipt: {
0|bella  |       userJid: '6283110928302@s.whatsapp.net',
0|bella  |       readTimestamp: 1755108157
0|bella  |     }
0|bella  |   }
0|bella  | ]*/
    });

    Exp.ev.on('messages.upsert', async ({ type, messages }) => {
      for (let message of messages) {
        if (global.debug && !message?.key?.fromMe) {
          debugLogMessage(message, type);
        }
        let isMeta =
          message?.key?.remoteJid?.includes('13135550002') ||
          message?.key?.remoteJid?.endsWith('@bot') ||
          message?.key?.participant?.includes('13135550002') ||
          message?.participant?.includes('13135550002');

        if (
          isMeta ||
          message?.message?.botForwardedMessage ||
          message?.message?.messageContextInfo?.botMetadata
        ) {
          if (message?.message) {
            const relayJson = JSON.stringify(
              message.message,
              (k, v) =>
                v instanceof Uint8Array ||
                Buffer.isBuffer(v) ||
                (v?.type === 'Buffer' && Array.isArray(v?.data))
                  ? Buffer.from(v?.data || v).toString('base64')
                  : v,
              2
            );
            console.log('[META_RELAY_PAYLOAD_JSON]\n' + relayJson);
          } else {
            const cleanStr = JSON.stringify(
              message,
              (k, v) =>
                v instanceof Uint8Array ||
                Buffer.isBuffer(v) ||
                (v?.type === 'Buffer' && Array.isArray(v?.data))
                  ? `<Buffer ${v.length || v.data?.length} bytes>`
                  : v,
              2
            );
            console.log('[META AI MSG JSON]\n' + cleanStr);
          }
          if (isMeta) continue;
        }
        const cht = {
          ...message,
          id: message?.key?.remoteJid,
        };
        // console.log(type, cht.String());
        let chatDb = Data.preferences[cht.id] || {};
        let sewaDb = Data.sewa[cht.id];
        let isMessage = cht?.message;
        let isStubType = cht?.messageStubType;
        let { messageTimestamp } = cht;
        if (
          typeof messageTimestamp == 'object' &&
          messageTimestamp.unsigned &&
          !isStubType
        )
          continue;
        if (!(isMessage || isStubType)) return;
        if (cht.key.remoteJid === 'status@broadcast') {
          if (cht.key.fromMe) return;
          if (!cfg.reactsw || typeof cfg.reactsw !== 'object')
            cfg.reactsw = {
              on: false,
              emojis: ['😍', '😂', '😬', '🤢', '🤮', '🥰', '😭'],
            };

          let participant =
            cht.key.remoteJidAlt ||
            cht.key.participant ||
            cht.participant ||
            '';
          let statusKey = {
            ...cht.key,
            participant: participant || cht.key.participant,
          };

          if (
            cfg.autoreadsw === true ||
            cfg.autoreadsw === 'on' ||
            cfg.autoreadsw === 'true'
          ) {
            try {
              await Exp.readMessages([statusKey]);
              let typ = getContentType(cht.message);
              let senderNum = participant
                ? participant.split('@')[0]
                : 'Unknown';
              console.log(
                /protocolMessage/i.test(typ)
                  ? `${senderNum} Deleted story❗`
                  : 'View user stories : ' + senderNum
              );
            } catch (err) {
              console.error('Error auto read SW:', err);
            }
          }

          if (cfg.reactsw && cfg.reactsw.on) {
            try {
              let { emojis } = cfg.reactsw;
              let validEmojis = (Array.isArray(emojis) ? emojis : []).filter(
                (e) => e && e !== '\uFE0F'
              );
              if (validEmojis.length === 0) {
                validEmojis = ['😍', '😂', '😬', '🤢', '🤮', '🥰', '😭'];
              }
              let textReact = validEmojis.getRandom();
              let myJid = Exp.user.id.split(':')[0] + '@s.whatsapp.net';
              let statusJidList = Array.from(
                new Set(
                  [
                    participant,
                    cht.key.participant,
                    cht.key.remoteJidAlt,
                    myJid,
                  ].filter(Boolean)
                )
              );

              await Exp.sendMessage(
                cht.id,
                { react: { key: cht.key, text: textReact } },
                { statusJidList }
              );
            } catch (err) {
              console.error('Error auto react SW:', err);
            }
          }

          return;
        } else {
          let exs = { cht: { ...cht }, Exp, is: {}, store, chatDb, sewaDb };
          let util = await Data.utils(exs);
          switch (util) {
            case 'NEXT':
              type == 'append'
                ? await Data.stubTypeMsg(exs)
                : type == 'notify'
                  ? await Data.helper(exs)
                  : console.log(`Unknown Type:${type}`, message);
              break;

            case 'ERROR':
              console.error(
                '\x1b[31mERROR in utils.js: cek error di atas, segera laporkan ke admin/owner\x1b[0m'
              );
              break;
            default:
            //console.log(util);
          }
        }
      }
    });

    Exp.ev.on('call', async ([c]) => {
      let { from, id, status } = c;
      if (status !== 'offer') return;
      cfg.call = cfg.call || { block: false, reject: false };
      let { block, reject } = cfg.call;
      if (reject) {
        await Exp.rejectCall(id, from);
        await Exp.sendMessage(from, { text: '⚠️JANGAN TELFON❗' });
      }
      if (block) {
        let text =
          `\`⚠️KAMU TELAH DI BLOKIR!⚠️\`` +
          '\n- *Menelfon tidak diizinkan karena sangat mengganggu aktivitas kami*' +
          '\n> _Untuk membuka blokir, silahkan hubungi owner!_';
        await Exp.sendMessage(from, { text });
        await Exp.sendContacts({ id: from }, owner);
        await sleep(2000);
        await Exp.updateBlockStatus(from, 'block');
      }
    });
    store.bind(Exp.ev);
  } catch (error) {
    console.error(error);
  }
}
launch();
process.on('uncaughtException', (e) => {
  console.error(e);
});
