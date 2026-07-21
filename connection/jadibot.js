const fs = 'fs'.import();
const baileys = 'baileys'.import();
const pino = 'pino'.import();
const { Boom } = 'boom'.import();
const { Connecting } = await `${fol[8]}systemConnext.js`.r();
let { makeInMemoryStore } = await `${fol[0]}store.js`.r();
let { func } = await `${fol[0]}func.js`.r();

let { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } =
  baileys;

let logger = pino({ level: 'silent' });

function jidToNumber(jid = '') {
  try {
    return String(jid)
      .split(':')[0]
      .replace(/[^0-9]/g, '');
  } catch {
    return '';
  }
}

function getFreeSlot() {
  Data.jadibot ??= {};
  const used = Object.keys(Data.jadibot).map(Number);
  let slot = 1;
  while (used.includes(slot)) slot++;
  return slot;
}

function registerSlot({ ownerNum, botNumber }) {
  Data.jadibot ??= {};
  Data.jadibotMap ??= {};

  let slot = Object.keys(Data.jadibot).find(
    (k) => String(Data.jadibot[k]?.botNumber || '') === String(botNumber)
  );

  if (!slot) {
    slot = getFreeSlot();
    Data.jadibot[slot] = {
      botNumber,
      owner: ownerNum,
      login: 0,
      public: true,
    };
  } else {
    Data.jadibot[slot].owner = ownerNum;
  }

  Data.jadibotMap[ownerNum] = Number(slot);

  return Number(slot);
}

export async function stopJadibot({
  slot,
  owner,
  botNumber,
  removeSession = true,
}) {
  Data.jadibot ??= {};
  Data.jadibotMap ??= {};

  if (!slot) {
    if (botNumber) {
      const num = String(botNumber).replace(/[^0-9]/g, '');
      slot = Object.keys(Data.jadibot).find(
        (k) => Data.jadibot[k]?.botNumber === num
      );
    } else if (owner) {
      const own = String(owner).replace(/[^0-9]/g, '');
      slot = Data.jadibotMap?.[own];
    }
  }

  slot = Number(slot || 0);
  if (!slot || !Data.jadibot?.[slot]) return false;

  const num = String(Data.jadibot[slot]?.botNumber || '').replace(
    /[^0-9]/g,
    ''
  );
  const ownerNum = String(Data.jadibot[slot]?.owner || '').replace(
    /[^0-9]/g,
    ''
  );

  try {
    const sock = Data.jadibotSocket?.[num];
    if (sock?.logout) {
      try {
        await sock.logout();
      } catch {}
    }
    if (sock?.end) {
      try {
        sock.end(new Error('STOP_JADIBOT'));
      } catch {}
    }
  } catch {}

  if (removeSession && num) {
    const path = `./connection/${num}`;
    try {
      if (fs.existsSync(path))
        fs.rmSync(path, { recursive: true, force: true });
    } catch {}
  }

  delete Data.jadibot[slot];
  if (ownerNum && Data.jadibotMap?.[ownerNum] === slot)
    delete Data.jadibotMap[ownerNum];

  if (Data.jadibotSocket?.[num]) delete Data.jadibotSocket[num];

  return true;
}

async function jadibot({ Exp, cht, id, botNumber, pairing = false }) {
  try {
    const ownerNum = String(id || '').replace(/[^0-9]/g, '');

    if (!ownerNum) {
      throw new Error('Owner ID tidak valid!');
    }

    const argNumber = String(botNumber || '').replace(/[^0-9]/g, '');
    const sessionPath = `./connection/${argNumber || ownerNum}`; // sementara, nanti dibenerin setelah creds kebaca

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const store = makeInMemoryStore();
    const Func = new func({ store });

    const _Exp = makeWASocket({
      logger,
      browser: Browsers.ubuntu('Chrome'),
      auth: state,
      printQRInTerminal: !pairing,
      retryRequestDelayMs: 5000,
      maxMsgRetryCount: 2,
      getMessage: async () => undefined,
      cachedGroupMetadata: (jid) => Func.metadata.get(jid),
      syncFullHistory: false,
    });

    const meJid = state?.creds?.me?.id || _Exp?.user?.id || '';
    const realNumber = jidToNumber(meJid) || argNumber;

    if (!realNumber || realNumber.length < 8) {
      throw new Error('Nomor jadibot tidak valid: ' + (realNumber || 'EMPTY'));
    }

    const realSessionPath = `./connection/${realNumber}`;
    if (sessionPath !== realSessionPath) {
      try {
        if (!fs.existsSync(realSessionPath))
          fs.mkdirSync(realSessionPath, { recursive: true });

        if (
          fs.existsSync(sessionPath) &&
          sessionPath !== './connection/' + realNumber
        ) {
          const files = fs.readdirSync(sessionPath);
          for (const f of files) {
            try {
              fs.renameSync(`${sessionPath}/${f}`, `${realSessionPath}/${f}`);
            } catch {}
          }
        }
      } catch {}
    }

    Data.jadibotSocket ??= {};
    if (Data.jadibotSocket[realNumber]) {
      return _Exp;
    }

    const { groupMetadata } = _Exp;
    Func.init({ Exp: _Exp, groupMetadata });
    Func.metadata.init();

    _Exp.groupMetadata = (gid) => Func.getGroupMetadata(gid, _Exp);
    _Exp.func = Func;

    Data.initialize({ Exp: _Exp, store });
    Data.jadibot ??= {};
    Data.jadibotMap ??= {};

    const slot = registerSlot({ ownerNum, botNumber: realNumber });

    _Exp.jadibotSlot = slot;
    _Exp.isJadibot = true;
    _Exp.jadibotOwner = ownerNum;
    _Exp.jadibotNumber = realNumber;

    Data.jadibotSocket[realNumber] = _Exp;

    if (pairing && !_Exp.authState.creds.registered && !_Exp._pairingSent) {
      _Exp._pairingSent = true;

      await sleep(600);
      const code = await _Exp.requestPairingCode(realNumber, 'YUKISUOU');

      const expireAt = Date.now() + 2 * 60 * 1000;
      const expireDate = new Date(expireAt).toLocaleTimeString('id-ID');

      await cht.reply(
        ' *Kode Pairing Jadibot*\n\n' +
          ' *Nomor:* ' +
          realNumber +
          '\n' +
          ' *Kode:*\n```' +
          code +
          '```\n\n' +
          '⏳ Kode akan kedaluwarsa pada: ' +
          expireDate +
          '\n' +
          'Jika tidak digunakan dalam 2 menit, sesi jadibot akan otomatis ditutup.'
      );

      setTimeout(
        async () => {
          if (!_Exp.authState.creds.registered) {
            try {
              await stopJadibot({ slot });
              await cht.reply(
                '⛔ Pairing kadaluwarsa. Jadibot otomatis dihentikan.'
              );
            } catch {}
          }
        },
        2 * 60 * 1000
      );
    }
    _Exp.ev.on('connection.update', async (update) => {
      await Connecting({
        update,
        Exp: _Exp,
        Boom,
        DisconnectReason,
        sleep,

        launch: () =>
          jadibot({
            Exp,
            cht,
            id: _Exp.jadibotOwner,
            botNumber: _Exp.jadibotNumber,
            pairing,
          }),
      });

      if (update.connection === 'open') {
        if (Data.jadibot?.[slot]) Data.jadibot[slot].login = Date.now();
      }

      if (update.connection === 'close') {
        const reason = update?.lastDisconnect?.error?.output?.statusCode;
        if (reason === DisconnectReason.loggedOut) {
          try {
            await stopJadibot({ slot, removeSession: false });
          } catch {}
        }
      }
    });

    _Exp.ev.on('creds.update', saveCreds);

    _Exp.ev.on('messages.upsert', async ({ type, messages }) => {
      for (let message of messages) {
        const chtx = { ...message, id: message?.key?.remoteJid };

        const isMsg = chtx?.message;
        const isStub = chtx?.messageStubType;
        const ts = chtx.messageTimestamp;

        if (typeof ts === 'object' && ts?.unsigned && !isStub) continue;
        if (!(isMsg || isStub)) continue;
        if (chtx.key.remoteJid === 'status@broadcast') continue;

        const chatDb = (Data.preferences[chtx.id] ||= {});
        const sewaDb = Data.sewa?.[chtx.id];

        const exs = {
          cht: chtx,
          Exp: _Exp,
          is: {
            jadibot: true,
            jadibotId: slot,
            public: Data.jadibot?.[slot]?.public ?? cfg.public,
          },
          store,
          chatDb,
          sewaDb,
        };

        const util = await Data.utils(exs);

        if (util === 'NEXT') {
          type === 'append'
            ? await Data.stubTypeMsg(exs)
            : type === 'notify'
              ? await Data.helper(exs)
              : null;
        }
      }
    });

    store.bind(_Exp.ev);
    return _Exp;
  } catch (e) {
    console.error('[JADIBOT ERROR]', e);
    try {
      await cht.reply('Jadibot error:\n```' + e.message + '```');
    } catch {}
    return null;
  }
}

export default jadibot;
