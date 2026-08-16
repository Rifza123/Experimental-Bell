const fs = 'fs'.import()
const baileys = 'baileys'.import()
const pino = 'pino'.import()
const { Boom } = 'boom'.import()
const { Connecting } = await `${fol[8]}systemConnext.js`.r()
let { makeInMemoryStore } = await `${fol[0]}store.js`.r()
let { func: FuncClass } = await `${fol[0]}func.js`.r()
const defaultFunc = new FuncClass({})

let {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
} = baileys

let logger = pino({ level: 'silent' })

function jidToNumber(jid = '') {
  try {
    return String(jid).split(':')[0].replace(/[^0-9]/g, '')
  } catch {
    return ''
  }
}

function getFreeSlot() {
  Data.jadibot ??= {}
  const used = Object.keys(Data.jadibot).map(Number)
  let slot = 1
  while (used.includes(slot)) slot++
  return slot
}

function registerSlot({ ownerNum, botNumber, expired }) {
  Data.jadibot ??= {}
  Data.jadibotMap ??= {}

  let slot = Object.keys(Data.jadibot).find(
    k => String(Data.jadibot[k]?.botNumber || '') === String(botNumber)
  )

  if (!slot) {
    slot = getFreeSlot()
    Data.jadibot[slot] = {
      botNumber,
      owner: ownerNum,
      owners: [ownerNum],
      coowners: [],
      expired: expired || 0,
      public: false,
      prefix: false,
      apikey: '',
    }
  } else {
    Data.jadibot[slot].owner = ownerNum
    Data.jadibot[slot].owners ??= [ownerNum]
    Data.jadibot[slot].coowners ??= []
    if (expired) Data.jadibot[slot].expired = expired
    Data.jadibot[slot].apikey ??= ''
  }

  Data.jadibotMap[ownerNum] = Number(slot)
  return Number(slot)
}

export async function stopJadibot({ slot, owner, botNumber, removeSession = true }) {
  Data.jadibot ??= {}
  Data.jadibotMap ??= {}

  if (!slot) {
    if (botNumber) {
      const num = String(botNumber).replace(/[^0-9]/g, '')
      slot = Object.keys(Data.jadibot).find(k => Data.jadibot[k]?.botNumber === num)
    } else if (owner) {
      const own = String(owner).replace(/[^0-9]/g, '')
      slot = Data.jadibotMap?.[own]
    }
  }

  slot = Number(slot || 0)
  if (!slot || !Data.jadibot?.[slot]) return false

  const num = String(Data.jadibot[slot]?.botNumber || '').replace(/[^0-9]/g, '')
  const ownerNum = String(Data.jadibot[slot]?.owner || '').replace(/[^0-9]/g, '')
  const ownersList = (Data.jadibot[slot]?.owners || []).map(o => String(o).replace(/[^0-9]/g, ''))

  if (owner) {
    const own = String(owner).replace(/[^0-9]/g, '')
    if (ownerNum !== own && !ownersList.includes(own)) return false
  }

  try {
    const sock = Data.jadibotSocket?.[num]
    if (sock?.logout) await sock.logout().catch(() => {})
    if (sock?.end) sock.end(new Error('STOP_JADIBOT'))
  } catch {}

  if (removeSession) {
    if (num) {
      const path = `./connection/${num}`
      try {
        if (fs.existsSync(path)) {
          fs.rmSync(path, { recursive: true, force: true })
        }
      } catch {}
      if (Data.jadibotDb?.[num]) delete Data.jadibotDb[num]
      if (Data.preferencesBot?.[num]) delete Data.preferencesBot[num]
    }
    delete Data.jadibot[slot]
    if (ownerNum && Data.jadibotMap?.[ownerNum] === slot) {
      delete Data.jadibotMap[ownerNum]
    }
  } else {
    if (Data.jadibot[slot]) {
      Data.jadibot[slot].status = 'offline'
      Data.jadibot[slot].onlineSince = null
    }
  }

  if (Data.jadibotSocket?.[num]) {
    delete Data.jadibotSocket[num]
  }

  console.log(`[JADIBOT] Stopped & cleaned: ${num} (Slot ${slot})`)
  return true
}

export async function checkExpiredJadibots() {
  Data.jadibot ??= {}
  const now = Date.now()
  let count = 0
  for (const slot of Object.keys(Data.jadibot)) {
    const info = Data.jadibot[slot]
    if (info && info.expired && info.expired > 0 && now > info.expired) {
      console.log(`[JADIBOT EXPIRED] Deleting expired sub-bot slot #${slot} (${info.botNumber})`)
      await stopJadibot({ slot: Number(slot), removeSession: true })
      count++
    }
  }
  return count
}

setInterval(() => {
  checkExpiredJadibots().catch(() => {})
}, 10 * 60 * 1000)

async function jadibot({ Exp, cht, id, botNumber, pairing = false, useQr = false, expired = 0, userSender = null }) {
  if (Exp?.isJadibot) {
    console.log(`[JADIBOT] Blocked nested jadibot request on sub-bot (${Exp.jadibotNumber || 'sub-bot'})`)
    try {
      if (cht && cht.reply) {
        await cht.reply(Data.infos.jadibot.restrictedNested)
      }
    } catch {}
    return null
  }

  let cleanupTimer = null
  let countdownInterval = null
  let slot = null

  try {
    const ownerNum = String(id || '').replace(/[^0-9]/g, '')
    if (!ownerNum) throw new Error('Owner ID tidak valid!')

    const argNumber = String(botNumber || '').replace(/[^0-9]/g, '')
    const sessionPath = `./connection/${argNumber || ownerNum}`

    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true })
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
    const store = makeInMemoryStore()
    const Func = new FuncClass({ store })

    const _Exp = makeWASocket({
  logger,
  version: [2, 3000, await fetch("https://raw.githubusercontent.com/Rifza123/Experimental-Bell/refs/heads/master/version").then(a => a.text())],
      printQRInTerminal: false,
  browser: Browsers.ubuntu('Chrome'),
  auth: state,
  retryRequestDelayMs: 7000,
  maxMsgRetryCount: 5,
  getMessage: async () => undefined,
  cachedGroupMetadata: (jid) => Func.metadata.get(jid),
  syncFullHistory: false,
})

    const meJid = state?.creds?.me?.id || _Exp?.user?.id || ''
    const realNumber = jidToNumber(meJid) || argNumber

    if (!realNumber || realNumber.length < 8) {
      throw new Error('Nomor jadibot tidak valid: ' + (realNumber || 'EMPTY'))
    }

    const realSessionPath = `./connection/${realNumber}`
    if (sessionPath !== realSessionPath) {
      if (!fs.existsSync(realSessionPath)) {
        fs.mkdirSync(realSessionPath, { recursive: true })
      }
      if (fs.existsSync(sessionPath) && sessionPath !== `./connection/${realNumber}`) {
        const files = fs.readdirSync(sessionPath)
        for (const f of files) {
          try {
            fs.renameSync(`${sessionPath}/${f}`, `${realSessionPath}/${f}`)
          } catch {}
        }
      }
    }

    Data.jadibotSocket ??= {}
    if (Data.jadibotSocket[realNumber]) {
  try {
    await Data.jadibotSocket[realNumber].logout().catch(()=>{})
  } catch {}
  delete Data.jadibotSocket[realNumber]
}

    const { groupMetadata } = _Exp
    Func.init({ Exp: _Exp, groupMetadata })
    Func.metadata.init()

    _Exp.groupMetadata = (gid) => Func.getGroupMetadata(gid, _Exp)
    _Exp.func = Func

    Data.initialize({ Exp: _Exp, store })
    Data.jadibot ??= {}
    Data.jadibotMap ??= {}

    slot = registerSlot({ ownerNum, botNumber: realNumber, expired })
    Data.jadibot[slot].status = 'connecting'
    Data.jadibot[slot].reconnectCount = (Data.jadibot[slot].reconnectCount || 0) + 1

    _Exp.jadibotSlot = slot
    _Exp.isJadibot = true
    _Exp.jadibotOwner = ownerNum
    _Exp.jadibotNumber = realNumber
    _Exp.apiKey = Data.jadibot[slot]?.apikey || ''
    Data.jadibotSocket[realNumber] = _Exp
    if (pairing && !_Exp.authState.creds.registered && !_Exp._pairingSent) {
      _Exp._pairingSent = true

      await sleep(1500)
      try {
        const code = await _Exp.requestPairingCode(realNumber, 'YUKISUOU')
        const expireAt = Date.now() + 2 * 60 * 1000
        const expireDate = new Date(expireAt).toLocaleTimeString('id-ID')
        const jdbLang = Data.infos.jadibot

        const { key } = await cht.reply(
          jdbLang.pairingCode(realNumber, code, expireDate, slot)
        )

        _Exp._pairingMessageKey = key
        let countdown = 120
        countdownInterval = setInterval(async () => {
          countdown -= 30

          if (_Exp.authState.creds.registered) {
            clearInterval(countdownInterval)
            
            let expiredText = 'Unlimited ∞'
            if (expired && expired > Date.now()) {
              const remaining = expired - Date.now()
              expiredText = defaultFunc.parseMs(remaining)
            }

            try {
              await cht.edit(
                jdbLang.connected(slot, realNumber, Data.jadibot[slot].public, Data.jadibot[slot].prefix, expiredText, _Exp._energyInfo),
                key
              )
            } catch {}
          } else if (countdown > 0) {
            try {
              await cht.edit(
                jdbLang.waitingPairing(realNumber, code, countdown),
                key
              )
            } catch {}
          }
        }, 30000) 

        cleanupTimer = setTimeout(async () => {
          if (!_Exp.authState.creds.registered) {
            clearInterval(countdownInterval)
            console.log(`[JADIBOT] Timeout: ${realNumber}`)
            
            try {
              await stopJadibot({ slot, removeSession: true })
              
              await cht.edit(
                '⛔ *Jadibot Dibatalkan*\n\n' +
                `📱 *Nomor:* ${realNumber}\n` +
                `❌ *Alasan:* Timeout (2 menit)\n\n` +
                '🗑️ Session telah dihapus otomatis.\n' +
                '_Silakan coba lagi jika ingin menggunakan jadibot._',
                key
              )
            } catch (e) {
              console.error('[JADIBOT] Cleanup error:', e)
            }
          }
        }, 2 * 60 * 1000)
      } catch (err) {
        console.error('[JADIBOT] Pairing Code request failed:', err)
        try {
          await cht.reply(
            '❌ *GAGAL MEMINTA KODE PAIRING*\n\n' +
            `• *Nomor:* ${realNumber}\n` +
            `• *Penyebab:* ${err.message || 'Koneksi ke server WhatsApp gagal'}\n\n` +
            '💡 *Saran:* Coba lagi beberapa saat lagi atau gunakan QR Code:\n' +
            `• \`.jadibot ${realNumber} qr\``
          )
        } catch {}
      }
    }

    _Exp.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr && !_Exp.authState.creds.registered && cht && cht.id && !_Exp._qrSent) {
        _Exp._qrSent = true
        try {
          const QRCode = await 'qrcode'.import()
          const qrBuffer = await QRCode.toBuffer(qr, { scale: 8 })
          const jdbLang = Data.infos.jadibot
          try {
            const imageMessage = await Exp.func.uploadToServer(qrBuffer, 'image')
            const interactiveMsg = {
              interactiveMessage: {
                header: {
                  title: '',
                  imageMessage,
                  hasMediaAttachment: true,
                },
                body: {
                  text: jdbLang.qrCode(realNumber, slot),
                },
                footer: {
                  text: 'Klik tombol di bawah jika QR kadaluarsa',
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'quick_reply',
                      buttonParamsJson: JSON.stringify({
                        display_text: 'Generate Ulang QR 🔄',
                        id: `.jadibot ${realNumber} qr`,
                      }),
                    },
                  ],
                },
                contextInfo: {
                  stanzaId: cht?.key?.id,
                  participant: cht?.sender,
                  quotedMessage: cht,
                },
              },
            }
            await Exp.relayMessage(cht.id, interactiveMsg, {})
          } catch (btnErr) {
            console.error('[JADIBOT] Relay interactive QR failed, sending plain image:', btnErr)
            await Exp.sendMessage(cht.id, { image: qrBuffer, caption: jdbLang.qrCode(realNumber, slot) }, { quoted: cht })
          }
        } catch (e) {
          console.error('[JADIBOT] QR Code generation error:', e)
        }
      }

      if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        if (reason === 401 || reason === DisconnectReason.loggedOut) {
          if (cleanupTimer) clearTimeout(cleanupTimer);
          if (countdownInterval) clearInterval(countdownInterval);
          if (Data.jadibot?.[slot]) Data.jadibot[slot].status = 'logged_out';
          if (Data.jadibotSocket?.[realNumber]) delete Data.jadibotSocket[realNumber];

          const sessionPath = `./connection/${realNumber}`;
          try {
            if (fs.existsSync(sessionPath)) {
              fs.rmSync(sessionPath, { recursive: true, force: true });
            }
          } catch {}
          console.log(`[JADIBOT] Logged out: ${realNumber}`);

          if (cht && cht.id && !_Exp._disconnectedNotified) {
            _Exp._disconnectedNotified = true;
            const errorMsg = '❌ *PENAUTAN LOGGED OUT*\n\n' +
              `• *Nomor:* ${realNumber}\n` +
              `• *Slot:* ${slot}\n` +
              '• *Penyebab:* Sesi terputus / tautan perangkat dikeluarkan dari WhatsApp HP.\n\n' +
              `💡 *Solusi:* Ketik \`.jadibot relink ${slot}\` untuk minta kode pairing baru.`;
            if (useQr || !_Exp._pairingMessageKey) {
              await Exp.sendMessage(cht.id, { text: errorMsg }, { quoted: cht }).catch(() => {});
            } else {
              try {
                await cht.edit(errorMsg, _Exp._pairingMessageKey);
              } catch {
                await Exp.sendMessage(cht.id, { text: errorMsg }, { quoted: cht }).catch(() => {});
              }
            }
          }
          return;
        }

        if (!_Exp.authState.creds.registered && (Data.jadibot?.[slot]?.reconnectCount || 0) > 3) {
          if (Data.jadibot?.[slot]) Data.jadibot[slot].status = 'offline';
          console.log(`[JADIBOT] Unregistered reconnect limit reached for ${realNumber} (Slot ${slot})`);

          if (cht && cht.id && !_Exp._disconnectedNotified) {
            _Exp._disconnectedNotified = true;
            const timeoutMsg = '⛔ *PENAUTAN GAGAL / TIMEOUT*\n\n' +
              `• *Nomor:* ${realNumber}\n` +
              `• *Slot:* ${slot}\n` +
              '• *Penyebab:* Gagal terhubung ke WhatsApp setelah beberapa kali percobaan.\n\n' +
              `💡 *Solusi:* Minta kode pairing/QR baru dengan:\n` +
              `• \`.jadibot relink ${slot}\`\n` +
              `• \`.jadibot relink ${slot} qr\``;
            if (useQr || !_Exp._pairingMessageKey) {
              await Exp.sendMessage(cht.id, { text: timeoutMsg }, { quoted: cht }).catch(() => {});
            } else {
              try {
                await cht.edit(timeoutMsg, _Exp._pairingMessageKey);
              } catch {
                await Exp.sendMessage(cht.id, { text: timeoutMsg }, { quoted: cht }).catch(() => {});
              }
            }
          }
          return;
        }
        if (Data.jadibot?.[slot]) {
          Data.jadibot[slot].status = 'connecting';
        }
        setTimeout(() => {
          jadibot({
            Exp,
            cht: null,
            id: _Exp.jadibotOwner,
            botNumber: _Exp.jadibotNumber,
            pairing,
            useQr,
            expired: Data.jadibot?.[slot]?.expired || 0,
          });
        }, 5000);
      }

      if (update.connection === 'open') {
        if (Data.jadibot?.[slot]) {
          Data.jadibot[slot].status = 'online';
          Data.jadibot[slot].onlineSince = Date.now();
        }
        if (!_Exp._energyDeducted && userSender) {
          _Exp._energyDeducted = true;
          try {
            const res = defaultFunc.archiveMemories.reduceEnergy(userSender, 1500);
            const newEnergy = res?.energy ?? 0;
            _Exp._energyInfo = { deducted: 1500, remaining: newEnergy };
          } catch (e) {
            console.error('[JADIBOT] Energy deduction error:', e);
          }
        }
        if (cleanupTimer) {
          clearTimeout(cleanupTimer);
          cleanupTimer = null;
        }
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
        console.log(`[JADIBOT] Connected: ${realNumber} (Slot ${slot})`);

        if (cht && cht.id && !_Exp._connectedNotified) {
          _Exp._connectedNotified = true;
          let expiredText = 'Unlimited ∞';
          if (expired && expired > Date.now()) {
            const remaining = expired - Date.now();
            expiredText = defaultFunc.parseMs(remaining);
          }
          const jdbLang = Data.infos.jadibot;
          const connectedText = jdbLang.connected(
            slot,
            realNumber,
            Data.jadibot[slot]?.public,
            Data.jadibot[slot]?.prefix,
            expiredText,
            _Exp._energyInfo
          );

          if (useQr || !_Exp._pairingMessageKey) {
            await Exp.sendMessage(cht.id, { text: connectedText }, { quoted: cht }).catch(() => {});
          } else {
            try {
              await cht.edit(connectedText, _Exp._pairingMessageKey);
            } catch {
              await Exp.sendMessage(cht.id, { text: connectedText }, { quoted: cht }).catch(() => {});
            }
          }
        }
      }
    })

    _Exp.ev.on('creds.update', async () => {
      try {
        const targetDir = `./connection/${_Exp.jadibotNumber || realNumber || argNumber}`
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true })
        }
        await saveCreds()
      } catch (err) {
        if (err?.code !== 'ENOENT') {
          console.error('[JADIBOT] saveCreds error:', err)
        }
      }
    })

    _Exp.ev.on('messages.upsert', async ({ type, messages }) => {
      for (let message of messages) {
        const chtx = { ...message, id: message?.key?.remoteJid }

        const isMsg = chtx?.message
        const isStub = chtx?.messageStubType
        const ts = chtx.messageTimestamp

        if (typeof ts === 'object' && ts?.unsigned && !isStub) continue
        if (!(isMsg || isStub)) continue
        if (chtx.key.remoteJid === 'status@broadcast') continue

        const botNum = _Exp.jadibotNumber
        Data.jadibotDb ??= {}
        Data.jadibotDb[botNum] ??= {
          users: {},
          preferences: {},
          owners: Data.jadibot?.[slot]?.owners || [ownerNum],
          coowners: Data.jadibot?.[slot]?.coowners || [],
          apikey: Data.jadibot?.[slot]?.apikey || '',
          prefix: Data.jadibot?.[slot]?.prefix ?? false,
          public: Data.jadibot?.[slot]?.public ?? false,
          response: {},
          setCmd: {},
          badwords: [],
          links: []
        }
        Data.preferencesBot ??= {}
        Data.preferencesBot[botNum] ??= Data.jadibotDb[botNum].preferences

        const chatDb = (Data.preferencesBot[botNum][chtx.id] ??= {})
        const sewaDb = Data.sewa?.[chtx.id]

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
        }

        const util = await Data.utils(exs)

        if (util === 'NEXT') {
          type === 'append'
            ? await Data.stubTypeMsg(exs)
            : type === 'notify'
              ? await Data.helper(exs)
              : null
        }
      }
    })

    store.bind(_Exp.ev)
    return _Exp

  } catch (e) {
    console.error('[JADIBOT ERROR]', e)
    
    if (cleanupTimer) {
      clearTimeout(cleanupTimer)
      cleanupTimer = null
    }
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }
    if (slot) {
      await stopJadibot({ slot, removeSession: true })
    }
    
    try {
      await cht?.reply('❌ *Jadibot Error*\n\n```' + e.message + '```')
    } catch {}
    
    return null
  }
}


export function listAllJadibots() {
  Data.jadibot ??= {}
  return Object.keys(Data.jadibot).map(slot => {
    const info = Data.jadibot[slot]
    const sock = Data.jadibotSocket?.[info.botNumber]
    const isOnline = info.status === 'online' && !!sock && sock?.ws?.readyState !== 3 && sock?.ws?.readyState !== 2
    
    let expiredText = 'Unlimited ∞'
    let isExpired = false
    if (info.expired && info.expired > 0) {
      if (info.expired < Date.now()) {
        expiredText = 'Expired ❌'
        isExpired = true
      } else {
        const remaining = info.expired - Date.now()
        expiredText = defaultFunc.parseMs(remaining)
      }
    }
    
    let statusText = info.status === 'logged_out' ? '🟠 Logged Out (.jadibot relink)' : '🔴 Offline'
    if (isOnline) {
      statusText = '🟢 Online'
    } else if (info.status === 'connecting') {
      statusText = '🟡 Connecting...'
    }

    let uptimeText = '-'
    if (isOnline && info.onlineSince) {
      const elapsed = Date.now() - info.onlineSince
      uptimeText = defaultFunc.parseMs(elapsed)
    }

    return {
      slot: Number(slot),
      botNumber: info.botNumber,
      owner: info.owner,
      owners: info.owners || [info.owner],
      expired: info.expired || 0,
      expiredText,
      isExpired,
      public: info.public,
      prefix: info.prefix,
      apikey: info.apikey || '',
      hasApikey: !!info.apikey,
      isOnline,
      statusText,
      uptimeText,
      reconnectCount: info.reconnectCount || 0,
    }
  })
}

export function getJadibotStatus(ownerNum) {
  const num = String(ownerNum).replace(/[^0-9]/g, '')
  const slot = Data.jadibotMap?.[num]
  
  if (!slot || !Data.jadibot?.[slot]) {
    return { active: false }
  }
  
  const info = Data.jadibot[slot]
  const sock = Data.jadibotSocket?.[info.botNumber]
  const isOnline = info.status === 'online' && !!sock && sock?.ws?.readyState !== 3 && sock?.ws?.readyState !== 2
  
  let expiredText = 'Unlimited ∞'
  let isExpired = false
  if (info.expired && info.expired > 0) {
    if (info.expired < Date.now()) {
      expiredText = 'Expired ❌'
      isExpired = true
    } else {
      const remaining = info.expired - Date.now()
      expiredText = defaultFunc.parseMs(remaining)
    }
  }
  
  let statusText = info.status === 'logged_out' ? '🟠 Logged Out (.jadibot relink)' : '🔴 Offline'
  if (isOnline) {
    statusText = '🟢 Online'
  } else if (info.status === 'connecting') {
    statusText = '🟡 Connecting...'
  }

  let uptimeText = '-'
  if (isOnline && info.onlineSince) {
    const elapsed = Date.now() - info.onlineSince
    uptimeText = defaultFunc.parseMs(elapsed)
  }

  return {
    active: true,
    slot,
    botNumber: info.botNumber,
    owner: info.owner,
    owners: info.owners || [info.owner],
    expired: info.expired || 0,
    expiredText,
    isExpired,
    public: info.public,
    prefix: info.prefix,
    apikey: info.apikey || '',
    hasApikey: !!info.apikey,
    isOnline,
    statusText,
    uptimeText,
    reconnectCount: info.reconnectCount || 0,
  }
}

export function setJadibotApikey({ slot, owner, apikey }) {
  Data.jadibot ??= {}
  Data.jadibotMap ??= {}
  if (!slot && owner) {
    const own = String(owner).replace(/[^0-9]/g, '')
    slot = Data.jadibotMap?.[own]
  }
  slot = Number(slot || 0)
  if (!slot || !Data.jadibot?.[slot]) return false

  Data.jadibot[slot].apikey = String(apikey || '').trim()
  const botNumber = Data.jadibot[slot].botNumber
  if (botNumber && Data.jadibotSocket?.[botNumber]) {
    Data.jadibotSocket[botNumber].apiKey = Data.jadibot[slot].apikey
  }
  return true
}

export function setJadibotConfig({ slot, owner, key, value }) {
  Data.jadibot ??= {}
  Data.jadibotMap ??= {}
  if (!slot && owner) {
    const own = String(owner).replace(/[^0-9]/g, '')
    slot = Data.jadibotMap?.[own]
  }
  slot = Number(slot || 0)
  if (!slot || !Data.jadibot?.[slot]) return false

  Data.jadibot[slot][key] = value
  return true
}

export async function restartJadibot({ Exp, cht, slot, owner }) {
  Data.jadibot ??= {}
  Data.jadibotMap ??= {}
  if (!slot && owner) {
    const own = String(owner).replace(/[^0-9]/g, '')
    slot = Data.jadibotMap?.[own]
  }
  slot = Number(slot || 0)
  if (!slot || !Data.jadibot?.[slot]) return false

  const info = Data.jadibot[slot]
  const botNumber = info.botNumber
  const ownerNum = info.owner
  const expired = info.expired || 0

  await stopJadibot({ slot, removeSession: false })
  await new Promise(res => setTimeout(res, 1000))

  return await jadibot({
    Exp,
    cht,
    id: ownerNum,
    botNumber,
    pairing: false,
    expired,
  })
}

export function getJadibotDb(ownerNum) {
  const num = String(ownerNum).replace(/[^0-9]/g, '')
  const slot = Data.jadibotMap?.[num]
  if (!slot || !Data.jadibot?.[slot]) return null
  const botNumber = Data.jadibot[slot].botNumber
  Data.jadibotDb ??= {}
  Data.jadibotDb[botNumber] ??= {
    users: {},
    preferences: {},
    apikey: Data.jadibot[slot].apikey || '',
    prefix: Data.jadibot[slot].prefix ?? false,
    public: Data.jadibot[slot].public ?? false,
    response: {},
    setCmd: {},
    badwords: [],
    links: []
  }
  return {
    slot,
    botNumber,
    db: Data.jadibotDb[botNumber]
  }
}

export function resetJadibotDb(ownerNum) {
  const info = getJadibotDb(ownerNum)
  if (!info) return false
  Data.jadibotDb[info.botNumber] = {
    users: {},
    preferences: {},
    apikey: Data.jadibot[info.slot]?.apikey || '',
    prefix: Data.jadibot[info.slot]?.prefix ?? false,
    public: Data.jadibot[info.slot]?.public ?? false,
    response: {},
    setCmd: {},
    badwords: [],
    links: []
  }
  Data.preferencesBot ??= {}
  Data.preferencesBot[info.botNumber] = Data.jadibotDb[info.botNumber].preferences
  return true
}

export function resolveJadibotSlot(target, senderNum) {
  Data.jadibot ??= {}
  if (Object.keys(Data.jadibot).length === 0) return null

  if (target) {
    const raw = String(target).trim().replace(/[^0-9]/g, "")
    if (raw && Data.jadibot[raw]) {
      return Number(raw)
    }
    const foundByNumber = Object.keys(Data.jadibot).find(k => {
      const bNum = String(Data.jadibot[k]?.botNumber || '').replace(/[^0-9]/g, "")
      const oNum = String(Data.jadibot[k]?.owner || '').replace(/[^0-9]/g, "")
      return bNum === raw || oNum === raw || (bNum && raw && bNum.endsWith(raw)) || (bNum && raw && raw.endsWith(bNum))
    })
    if (foundByNumber) return Number(foundByNumber)
  }

  if (senderNum) {
    const sNum = String(senderNum).replace(/[^0-9]/g, "")
    const foundBySender = Object.keys(Data.jadibot).find(k => {
      const oNum = String(Data.jadibot[k]?.owner || '').replace(/[^0-9]/g, "")
      const owners = (Data.jadibot[k]?.owners || []).map(o => String(o).replace(/[^0-9]/g, ""))
      return oNum === sNum || owners.includes(sNum)
    })
    if (foundBySender) return Number(foundBySender)
  }

  return null
}

export default jadibot