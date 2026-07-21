const fs = 'fs'.import()
const baileys = 'baileys'.import()
const pino = 'pino'.import()
const { Boom } = 'boom'.import()
const { Connecting } = await `${fol[8]}systemConnext.js`.r()
let { makeInMemoryStore } = await `${fol[0]}store.js`.r()
let { func } = await `${fol[0]}func.js`.r()

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
      expired: expired || 0,
      public: false,
      prefix: false,
    }
  } else {
    Data.jadibot[slot].owner = ownerNum
    if (expired) Data.jadibot[slot].expired = expired
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

  try {
    const sock = Data.jadibotSocket?.[num]
    if (sock?.logout) await sock.logout().catch(() => {})
    if (sock?.end) sock.end(new Error('STOP_JADIBOT'))
  } catch {}

  if (removeSession && num) {
    const path = `./connection/${num}`
    try {
      if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true, force: true })
      }
    } catch {}
  }

  delete Data.jadibot[slot]
  if (ownerNum && Data.jadibotMap?.[ownerNum] === slot) {
    delete Data.jadibotMap[ownerNum]
  }
  if (Data.jadibotSocket?.[num]) {
    delete Data.jadibotSocket[num]
  }

  console.log(`[JADIBOT] Stopped: ${num} (Slot ${slot})`)
  return true
}

async function jadibot({ Exp, cht, id, botNumber, pairing = false, expired = 0, userSender = null }) {
  let cleanupTimer = null
  let countdownInterval = null
  let slot = null

  try {
    const ownerNum = String(id || '').replace(/[^0-9]/g, '')
    if (!ownerNum) throw new Error('Owner ID tidak valid!')

    const argNumber = String(botNumber || '').replace(/[^0-9]/g, '')
    const sessionPath = `./connection/${argNumber || ownerNum}`

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
    const store = makeInMemoryStore()
    const Func = new func({ store })

    const _Exp = makeWASocket({
  logger,
  version: [2, 3000, await fetch("https://raw.githubusercontent.com/Rifza123/Experimental-Bell/refs/heads/master/version").then(a => a.text())],
      printQRInTerminal: !global.pairingCode,
  browser: Browsers.ubuntu('Chrome'),
  auth: state,
  printQRInTerminal: !pairing,
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

    _Exp.jadibotSlot = slot
    _Exp.isJadibot = true
    _Exp.jadibotOwner = ownerNum
    _Exp.jadibotNumber = realNumber
    Data.jadibotSocket[realNumber] = _Exp
    if (pairing && !_Exp.authState.creds.registered && !_Exp._pairingSent) {
      _Exp._pairingSent = true

      await sleep(600)
      const code = await _Exp.requestPairingCode(realNumber, 'YUKISUOU')
      const expireAt = Date.now() + 2 * 60 * 1000
      const expireDate = new Date(expireAt).toLocaleTimeString('id-ID')

      const { key } = await cht.reply(
        '╭─❒ *「 Kode Pairing 」*\n' +
        '│\n' +
        '├ 📱 *Nomor:* ' + realNumber + '\n' +
        '├ 🔑 *Kode:*\n' +
        '│ ```' + code + '```\n' +
        '│\n' +
        '├ ⏰ *Expired:* ' + expireDate + '\n' +
        '├ ⚠️ *Timeout:* 2 menit\n' +
        '│\n' +
        '├ 📝 *Cara Pairing:*\n' +
        '│ • Buka WhatsApp\n' +
        '│ • Menu (⋮) → Perangkat Tertaut\n' +
        '│ • Tautkan dengan Nomor Telepon\n' +
        '│ • Masukkan kode di atas\n' +
        '│\n' +
        '╰❒ _Slot #' + slot + '_'
      )

      _Exp._pairingMessageKey = key
      let countdown = 120 // 2 menit
      countdownInterval = setInterval(async () => {
        countdown -= 30

        if (_Exp.authState.creds.registered) {
          clearInterval(countdownInterval)
          
          let expiredText = 'Unlimited ∞'
          if (expired && expired > Date.now()) {
            const remaining = expired - Date.now()
            expiredText = func.parseMs(remaining)
          }

          try {
            await cht.edit(
              '*Jadibot Berhasil Terhubung!*\n\n' +
              `*Nomor:* ${realNumber}\n` +
              `*Slot:* #${slot}\n` +
              `🌐 *Mode:* ${Data.jadibot[slot].public ? 'Public' : 'Private'}\n` +
              `*Prefix:* ${Data.jadibot[slot].prefix === false ? 'Multi-Symbol' : Data.jadibot[slot].prefix}\n` +
              `*Expired:* ${expiredText}\n\n` +
              '_Bot kamu sudah siap digunakan!_ ',
              key
            )
          } catch {}
        } else if (countdown > 0) {
          try {
            await cht.edit(
              '⏳ *Menunggu Pairing...*\n\n' +
              `📱 *Nomor:* ${realNumber}\n` +
              `🔑 *Kode:* \`${code}\`\n\n` +
              `⏰ *Sisa Waktu:* ${countdown} detik\n\n` +
              '_Segera lakukan pairing sebelum timeout._',
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
            expired: Data.jadibot?.[slot]?.expired || 0,
          }),
      })

      if (update.connection === 'open') {
        if (!_Exp._energyDeducted && userSender) {
          _Exp._energyDeducted = true
          const curEnergy = func.archiveMemories.getItem(userSender, 'energy') || 0
          func.archiveMemories.setItem(userSender, 'energy', Math.max(0, curEnergy - 200))
        }
        if (cleanupTimer) {
          clearTimeout(cleanupTimer)
          cleanupTimer = null
        }
        if (countdownInterval) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
        
        console.log(`[JADIBOT] Connected: ${realNumber} (Slot ${slot})`)
      }

      if (update.connection === 'close') {
        const reason = update?.lastDisconnect?.error?.output?.statusCode
        if (reason === DisconnectReason.loggedOut) {
          if (cleanupTimer) {
            clearTimeout(cleanupTimer)
            cleanupTimer = null
          }
          if (countdownInterval) {
            clearInterval(countdownInterval)
            countdownInterval = null
          }
          await stopJadibot({ slot, removeSession: true })
          console.log(`[JADIBOT] Logged out: ${realNumber}`)
        }
      }
    })

    _Exp.ev.on('creds.update', saveCreds)

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
        Data.preferencesBot ??= {}
        Data.preferencesBot[botNum] ??= {}

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
    const isOnline = !!Data.jadibotSocket?.[info.botNumber]
    
    let expiredText = 'Unlimited ∞'
    let isExpired = false
    if (info.expired && info.expired > 0) {
      if (info.expired < Date.now()) {
        expiredText = 'Expired ❌'
        isExpired = true
      } else {
        const remaining = info.expired - Date.now()
        expiredText = func.parseMs(remaining)
      }
    }
    
    return {
      slot: Number(slot),
      botNumber: info.botNumber,
      owner: info.owner,
      expired: info.expired || 0,
      expiredText,
      isExpired,
      public: info.public,
      prefix: info.prefix,
      isOnline,
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
  const isOnline = !!Data.jadibotSocket?.[info.botNumber]
  
  let expiredText = 'Unlimited ∞'
  let isExpired = false
  if (info.expired && info.expired > 0) {
    if (info.expired < Date.now()) {
      expiredText = 'Expired ❌'
      isExpired = true
    } else {
      const remaining = info.expired - Date.now()
      expiredText = func.parseMs(remaining)
    }
  }
  
  return {
    active: true,
    slot,
    botNumber: info.botNumber,
    owner: info.owner,
    expired: info.expired || 0,
    expiredText,
    isExpired,
    public: info.public,
    prefix: info.prefix,
    isOnline,
  }
}

export default jadibot