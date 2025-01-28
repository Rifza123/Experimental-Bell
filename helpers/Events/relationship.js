/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { default: ms } = await "ms".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    const { id, sender } = cht
    const { func } = Exp
    let { archiveMemories:memories, parseTimeString, clearSessionConfess, findSenderCodeConfess, formatDuration } = func
    const infos = Data.infos 
    let time = "3 hari"

    const energy = async (en)=> {
       memories.reduceEnergy(sender, en);
       await cht.reply(`-${en} Energy⚡`)
       if (cht.memories.energy < en) {
         await cht.reply(infos.messages.isEnergy({ uEnergy: cht.memories.energy, energy:en, charging:cht.memories.charging }))
         return false
       }
       return true 
    }
     
    function sendPremInfo({ _text, text }, cust=false, number){
        return Exp.sendMessage(number || id, {
            text:`${_text ? (_text + "\n\n" + text) : text}`,
                contextInfo: {
                    externalAdReply: {
                    title: !cust ? "🔐Premium Access!" : "🔓Unlocked Premium Access!",
                    body: !cust ?  "Dapatkan akses premium untuk membuka fitur² terkunci" : "Sekarang kamu adalah user 🔑Premium, dapat menggunakan fitur² terkunci!",
                    thumbnailUrl: !cust ? 'https://telegra.ph/file/310c10300252b80e12305.jpg' : 'https://telegra.ph/file/ae815f35da7c5a2e38712.jpg',
                    mediaUrl: `http://ẉa.me/6283110928302/${!cust ? "89e838":"jeie337"}`,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    mediaType: 1,
                },
                mentionedJid:cht.mention
            }
        }, { quoted: cht })
    }
    
    ev.on({ 
        cmd: ['status','profil','profile','relationship'],
        listmenu: ['profile'],
        tag: 'relationship'
    }, async() => {
        let user = await memories.get(sender)
        if (!("premium" in user)) {
            user.premium = { time: 0 };
        }
        let premiumTime = user.premium.time - Date.now()
        let formatDur = formatDuration(premiumTime)
        let speed = ms(user.chargingSpeed)
        let url
        try {
            url = await Exp.profilePictureUrl(sender)
        } catch {
            url = "https://telegra.ph/file/fddb61dda9e76235b8857.jpg"
        }
        
        let bonus = {
            chargeRate: user.premium?.chargeRate || 0,
            maxCharge: user.premium?.maxCharge || 0,
        }
        let txt = "*!-====[ Profile ]====-!*\n"
            txt += "\nNama: " + cht.pushName
            txt += "\nRole: " + user.role
            txt += "\nChatting: " + user.chat
            txt += "\n⚡Energy: " + user.energy
        //    txt += "\n🌀Flow: " + user.flow //(coming soon)
        //    txt += "\n🪙Coins : " + user.coins //(coming soon)
            txt += `\n🔑Premium: ${user.premium.time >= Date.now() ? "yes":"no"}`
            if(user.premium.time >= Date.now()){
              txt += `\n⏱️Expired after: ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms`
              txt += `\n🗓️Expired on: ${func.dateFormatter(user.premium.time, "Asia/Jakarta")}`
            } else {
              txt += `\n⏱️Expired after: false`
              txt += `\n🗓️Expired on: false`
            }
            txt += "\n\n ▪︎ *[🔋] Energy*"
            txt += `\n- Status: ${user.charging ? "🟢Charging" : " ⚫Discharging"}`
            txt += "\n- Charging Speed: ⚡" + (parseFloat(user.chargeRate) + parseFloat(bonus.chargeRate)) + "/" + speed
            txt += "\n- Max Charge: " + (parseFloat(user.maxCharge) + parseFloat(bonus.maxCharge))
            txt += "\n- Last Charge: " + func.dateFormatter(user.lastCharge, "Asia/Jakarta")
        const menu = {
            text: txt,
            contextInfo: { 
                externalAdReply: {
                    title: cht.pushName,
                    body: "Artificial Intelligence, The beginning of the robot era",
                    thumbnailUrl: url,
                    sourceUrl: "https://github.com/Rifza123",
                    mediaUrl: "http://ẉa.me/6283110928302/"+Math.floor(Math.random() * 100000000000000000),
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    mediaType: 1,
                },
                forwardingScore: 19,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363301254798220@newsletter",
                }
            }
        }
        Data.users[sender.split("@")[0]] = user
        Exp.sendMessage(id, menu, { quoted: cht })
    })
    
    ev.on({ 
        cmd: ['charge','cas'],
        listmenu: ['charge'],
        tag: 'relationship'
    }, async() => {
        let user = await memories.get(sender)
        
        let bonus = {
            chargeRate: user.premium?.chargeRate || 0,
            maxCharge: user.premium?.maxCharge || 0,
        }
        let max = (parseFloat(user.maxCharge) + parseFloat(bonus.maxCharge))
        let energy = user.energy
        let _speed = user.chargingSpeed
        let rate = (parseFloat(user.chargeRate) + parseFloat(bonus.chargeRate))
        let speed = ms(_speed)
        let charg = max - energy
        let charge = (charg / rate) * _speed
        let est = Date.now() + charge
        let estimate = ms(charge)
        let finish = func.dateFormatter(est, "Asia/Jakarta")
        if(!user.charging){
            if(user.energy < max){
                user.charging = true
                user.lastCharge = Date.now()
            } else {
                user.charging = false
            }
        }        
        let txt = "*[🔋] Energy*"
            txt += "\n⚡Energy: " + user.energy
            txt += `\n\n- Status: ${user.charging ? "🟢Charging" : " ⚫Full"}`
            txt += "\n- Charging Speed: ⚡" + rate + "/" + speed
            txt += "\n- Max Charge: " + max
            if(user.charging){
                txt += "\n- Estimate: " + estimate
                txt += "\n- Finish: " + finish
            } else {
                txt += "\n- Last Charge: " + func.dateFormatter(user.lastCharge, "Asia/Jakarta")
            }
          Data.users[sender.split("@")[0]] = user
        const mess = {
            text: txt,
            contextInfo: { 
                externalAdReply: {
                    title: cht.pushName,
                    body: "Artificial Intelligence, The beginning of the robot era",
                    thumbnailUrl: user.charging ? "https://telegra.ph/file/bdbdba007e7c85e6f42f5.jpg":"https://telegra.ph/file/69da6d06dcdfd82057352.jpg",
                    sourceUrl: "https://github.com/Rifza123",
                    mediaUrl: `http://ẉa.me/6283110928302/${user.charging ? "2733":"2734"}`,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    mediaType: 1,
                }
            }
        }
        Exp.sendMessage(id, mess, { quoted: cht })
        
    })
    
    ev.on({ 
        cmd: ['mmmmmmining'],
       // listmenu: ['mining'],
        //tag: 'relationship'
    }, async() => {
        const imageMessage = {
            text: "MINING PREVIEW",
            contextInfo: {
                externalAdReply: {
                    thumbnailUrl: 'https://telegra.ph/file/5d6315a9b27bbc3d89c54.jpg',
                    mediaUrl: "http://ẉa.me/6283110928302/"+Math.floor(Math.random() * 100000000000000000),
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    mediaType: 1,
                },
            }
        }
        Exp.sendMessage(id, imageMessage, { quoted: cht })
    })
    
    
    ev.on({ 
        cmd: ['freetrial','claimtrial'],
        listmenu: ['freetrial'],
        tag: 'relationship'
    }, async() => {
        let usr = sender.split("@")[0]
        let user = Data.users[usr]
        let premium = user.premium ? Date.now() < user.premium.time : false
        let claim = cfg.first.trialPrem
        claim.time = claim.time || "1 hari"
        let claims = Object.keys(claim)
        let prm = user.premium
        if(user?.claimPremTrial) return cht.reply(infos.messages.hasClaimTrial)
        let txc = "*🎁Bonus `(Berlaku selama premium)`*"
        if(premium) return cht.reply(infos.messages.hasPremiumTrial)
            user.premium = { ...claim, ...prm }
            user["energy"] += parseFloat(claim["energy"])            
            for(let i of claims){
                txc += `\n- ${i}: +${claim[i]}`
            }
            user.energy += parseFloat(claim.energy)
            user.claimPremTrial = Date.now()
            user.premium.time = Date.now() + parseTimeString(claim.time)
        Data.users[usr] = user
        let formatTimeDur = formatDuration(user.premium.time - Date.now())
     
        let txt = "*Successfully claimed Premium free trial ✅️\n\n"
            txt += `🔑Premium: ${user.premium.time >= Date.now() ? "yes":"no"}`
            txt += `\n⏱️Expired after: ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms`
            txt += `\n🗓️Expired on: ${func.dateFormatter(user.premium.time, "Asia/Jakarta")}\n\n`
            txt += txc
        await sendPremInfo({ text:txt }, true)
    })
    
    let exconfes = `Format: \n`+
        `- .${cht.cmd} \`Nama Kamu\` | \`Nomor Tujuan\` | \`Isi Pesan\` \n\n` +
        `> *Examle: .${cht.cmd} Rahasia|628xxxxxxxxxx|hay.*\n`
        
    ev.on({
      cmd: [
        "confess","confes",
        "menfess","menfess"
      ],
      listmenu: ["confess"],
      tag: "relationship",
      }, async ({ args }) => {
        if(!args){
          let { key } = await cht.reply(exconfes)
          let qcmds = memories.getItem(sender, "quotedQuestionCmd") ||{}
             qcmds[key.id] = {
                  emit: `${cht.cmd}`,
                  exp: Date.now() + 30000,
                  accepts: []
             }
             memories.setItem(sender, "quotedQuestionCmd", qcmds)
        }
        const _key = keys[sender];
        const [AB,BC,...CD] = args?.split("|")||[]
        let _name = AB?.trim()?.toLowerCase()
        let trgt = BC?.replace(/[+ -]/g, "").split("@")[0]
        let _message = CD?.join("")
        let _Sender = findSenderCodeConfess(trgt)
        let fquoted = "menfess" in Data.fquoted ? { quoted: Data.fquoted.menfess } : undefined 
        
        switch(_name){
          /*
            @Handle Block
          */
          case "block":
            try {
              if(!BC){
                memories.setItem(sender, "questionCmd", { 
                  emit: `${cht.cmd} block|`,
                  exp: Date.now() + 30000,
                  accepts: []
                })
                return cht.reply("Kirimkan code nya!", _key)
              }
              if(!_Sender) return cht.reply("Code salah atau mungkin sudah kadaluarsa")
              if(!(await energy(10))) return
              await memories.get(_Sender)
              let dbcf = memories.getItem(sender, "confess")
              dbcf.block.push(_Sender)
              dbcf.block = [...new Set(dbcf.block)]
              memories.setItem(sender, "confess", dbcf)
              cht.reply(`\`Berhasil memblokir orang yang mengirimkan confess dengan code ini✅\`
Sekarang orang tidak dapat mengirimkan pesan confess kepada anda.

_Untuk membuka blokir bisa mengetik .confess unblock|code atau nomor telepon_
              `)
            } catch (e) {
              console.error(e)
              cht.reply("Terjadi kesalahan saat memblokir user❗")
            }
          break          
          
          /*
            @Handle UnBlock
          */
          case "unblock":
            try {
              if(!BC){
                memories.setItem(sender, "questionCmd", { 
                  emit: `${cht.cmd} unblock|`,
                  exp: Date.now() + 30000,
                  accepts: []
                })
                return cht.reply("Kirimkan code/nomor nya!", _key)
              }
              let Sender = Boolean(_Sender) ? _Sender : (!isNaN(trgt) || String(trgt).length > 6) ? trgt : false
              
              let nvalid = "Code salah atau mungkin sudah kadaluarsa"
              if(!Sender) return cht.reply(nvalid);
              (!isNaN(trgt) || String(trgt).length >= 6) && await memories.get(Sender)
              let dbcf = memories.getItem(sender, "confess")
              let nmes = Boolean(_Sender) ? `Orang yang mengirimkan code tidak ada dalam daftar blokir!`:`User @${Sender} tidak ada dalam daftar blokir!`
              if(!dbcf||!dbcf.block.includes(_Sender)) return cht.reply(nmes, { mentions: [Sender+from.sender]})
              if(!(await energy(10))) return
              dbcf.block = dbcf.block.filter(a => !a.includes(Sender))
              memories.setItem(sender, "confess", dbcf)
              let unmes = Boolean(_Sender) ? `Berhasil menghapus orang yang mengirimkan code ini dari daftar blokir!`:`Berhasil menghapus user @${Sender} dari daftar blokir!`
              cht.reply(unmes, { mentions: [Sender+from.sender]})
            } catch (e) {
              console.error(e)
              cht.reply("Terjadi kesalahan saat membuka blokir user❗")
            }
          break          
                    
          /*
            @Handle Decline
          */
          case "no":
          case "tidak": {
               let S1 = cht.memories.confess ||{}
               let { target:t, code } = S1.sess
               if(!t) return cht.reply("Sesi percakapan tidak ditemukan❗")
               let target = String(t)
               let S2 = memories.getItem(target, "confess")||{}
               let t1 = target.split("@")[0]+from.sender
               let t2 = cht.sender
               await cht.reply("Anda menolak, sesi dibatalkan!")
               await Exp.sendMessage(t1, { text: "Orang itu menolak untuk menghubungkan!" }, fquoted)
               S1.sess = {}
               S2.sess = {}
               await memories.setItem(sender, "confess", S1)
               await memories.setItem(t1, "confess", S2)
               if(timeouts[code]) await clearTimeout(timeouts[code])
          }
          break
          
          /*
            @Handle Accept
          */
          case "iya": case "gak":  
          case "ya": case "ngga":  
          case "yes": case "gk": 
          case "iy": case "g": 
          case "y": case "no": 
          case "tidak": case "n":
          case "ga": {
               let { target:t, code } = cht.memories?.confess?.sess || {}
               if(!t) return cht.reply("Sesi percakapan tidak ditemukan❗")
               let target = String(t)
               let t1 = target.split("@")[0]+from.sender
               let t2 = cht.sender
               let S1 = memories.getItem(sender, "confess") || { sent:[], inbox:[], block: [], sess: {} }          
               let S2 = memories.getItem(target, "confess") || { sent:[], inbox:[], block: [], sess: {} }          
               let { sess:ses1 }= S1||{}
               let { sess:ses2 } = S2||{}
               
               ses1.start = Date.now()
               ses1.last = Date.now()
               ses1.acc = true
               
               ses2.start = Date.now()
               ses2.last = Date.now()
               ses2.acc = true
               
               await memories.setItem(sender, "confess", S1)
               await memories.setItem(target, "confess", S2)
               let text = `*Berhasil terhubung ✅*\n\n- CODE: \`${String(code).toUpperCase()}\`\n\n- _Untuk keluar, kamu bisa ketik .confess exit_`
               
               await cht.reply(text)
               text += `\n- Sessi ini akan otomatis berakhir jika anda tidak mengirim pesan lebih dari ${ses1.max}`
               await Exp.sendMessage(t1, { text }, fquoted)         
               if(timeouts[code]) await clearTimeout(timeouts[code])
                timeouts[code] = setTimeout(async()=> {
                 await Exp.sendMessage(t1, { text: "Sesi berakhir!"}, fquoted)  
                 await sleep(500)        
                 await cht.reply("Sesi berakhir!")
                 await clearSessionConfess(t1, t2)
               }, parseTimeString(ses1?.max))           
               
          }
          break
          
          /*
            @Handle Exit
          */
          case "exit": {
               let S1 = cht.memories.confess || { sent:[], inbox:[], block: [], sess: {} }               
               let { target:t, code, acc:acc1 } = S1.sess || {}
               let S2 = memories.getItem(t, "confess") || { sent:[], inbox:[], block: [], sess: {} }
               let { target:tt, acc:acc2 } = S2?.sess || {}
               
               if(!t||!tt) return cht.reply("Sesi percakapan tidak ditemukan❗")
               let t1 = t.split("@")[0]+from.sender
               let t2 = tt.split("@")[0]+from.sender
               let isConnect = acc1 && acc2 && t2 == cht.sender
               await clearSessionConfess(t1,t2)
               !isConnect && await cht.reply("Sesi percakapan tidak terhubung, sessi berhasil dihapus!")
               isConnect && await cht.reply("Anda keluar dari percakapan ini!\n_Sesi berakhir_")
               await Exp.sendMessage(t1, { text: "Orang itu telah keluar dari percakapan ini!\n_Sesi berakhir_" }, fquoted)
               if(timeouts[code]) await clearTimeout(timeouts[code])
          }
          break
          
          /*
            @Handle Reply
          */
          case "balas":
          case "reply": {
            if(!BC){
                memories.setItem(sender, "questionCmd", { 
                  emit: `${cht.cmd} balas|`,
                  exp: Date.now() + 60000,
                  accepts: []
                })
                return cht.reply("Kirimkan code nya!", _key)
            }
            if(!_Sender) return cht.reply("Code salah atau mungkin sudah kadaluarsa")
            let t1 = _Sender.split("@")[0]+from.sender        
            let s1 = memories.getItem(sender, "confess") || { sent:[], inbox:[], block: [], sess: {} }
            let isFound = s1.inbox.find(a => a.code == trgt.trim().toUpperCase())
            let isFoundSent = s1.sent.find(a => a.code == trgt.trim().toUpperCase())
            if(isFoundSent) return cht.reply("Tidak dapat membalas!, pesan dengan code itu dikirimkan oleh anda!")
            if(!isFound) return cht.reply("Tidak dapat membalas, code tersebut tidak ada dalam inbox confess anda!")
            if(isFound.reply) return cht.reply("Pesan tersebut sudah anda balas!")
            
             if(!_message) {
               memories.setItem(sender, "questionCmd", { 
                  emit: `${cht.cmd} balas|${trgt}|`,
                  exp: Date.now() + 120000,
                  accepts: []
                })
               return cht.reply("Silahkan tuliskan pesan balasannya")
             }
             
             await memories.get(t1)//detect and added
             let { quoted, type } = ev.getMediaType()
             let isText = ["conversation","extendedTextMessage"].includes(type)
             let isNotAllowedMedia = ["sticker","audio","document"].includes(type)
             if(isNotAllowedMedia) return cht.edit(`${type} tidak diizinkan disini!`, _key)
             if(!(await energy(35))) return
             let message = { 
               contextInfo: {
                 isForwarded: true,
                 mentionedJid: [sender]
               },
             }
             let value;
             let balas = `\`CONFESS\` *dengan code ${trgt} mengirimkan balasan📩*

- User: @${sender.split("@")[0]}

\`*_BALASAN:_*\`
  ───────────────────────
${_message}
  ───────────────────────`
              if(!isText){
                value = quoted ? await cht.quoted.download() : await cht.download()
                message["caption"] = balas
              } else {
                type = "text"
                value = balas
              }
              message[type] = value 
              //await cht.reply(JSON.stringify({ t1, message, quoted }, null, 2))
              await Exp.sendMessage(t1, message, fquoted)
              await cht.reply("Sukses mengirimkan balasan!")
              let i1 = s1.inbox.findIndex(a => a.code == trgt.trim().toUpperCase())
              s1.inbox[i1].reply = true 
              await memories.setItem(sender, "confess", s1)
              await memories.setItem(t1, "confess", s2)
           }
          break
          
          /*
            @Handle Connect 
          */
          case "connect": {
            try {
              if(!BC){
                memories.setItem(sender, "questionCmd", { 
                  emit: `${cht.cmd} connect|`,
                  exp: Date.now() + 30000,
                  accepts: []
                })
                return cht.reply("Kirimkan code/nomor nya!", _key)
              }
              let Sender = Boolean(_Sender) ? _Sender : (!isNaN(trgt) || String(trgt).length > 6) ? trgt : false
              if(!Sender) return cht.reply("Code salah atau mungkin sudah kadaluarsa")
              if(Sender == sender.split("@")[0]) return cht.reply("Tidak dapat tersambung, code ini mengarah ke nomor anda sendiri!")
              
              await memories.get(Sender)
              let s1 = JSON.parse(JSON.stringify(memories.getItem(sender, "confess") || { sent:[], inbox:[], block: [], sess: {} }));
              let s2 = JSON.parse(JSON.stringify(memories.getItem(Sender, "confess") || { sent:[], inbox:[], block: [], sess: {} }));

              let { sess:ses1 } = s1 ||{}
              let { sess:ses2 } = s2 ||{}
              if(ses1?.target){
                if(ses2?.acc){
                let { sess:dses } = memories.getItem(ses1.target, "confess") || { sent:[], inbox:[], block: [], sess: {} }
                
                  if(ses1.last && ses1.max && ((Date.now() - ses1?.last) <= parseTimeString(ses1?.max)) && dses.max && dses.last && dses?.target?.split("@")[0] == cht.sender.split("@")[0] && ((Date.now() - dses?.last) <= parseTimeString(dses?.max))) {
                    return cht.reply(`Kamu telah tersambung dalam sesi percakapan dengan code \`${ses1.code?.toUpperCase()}\``)
                  } else {
                    ses1 = {}
                  }
                } else {
                  if(ses1.max && ses1.start && ((Date.now() - ses1.start) <= parseTimeString(ses1?.max))) {
                      return cht.reply(`Kamu sedang ${ses2.inviter ? "menya":"disa"}mbungkan dengan percakapan itu!`)
                    }
                }
              }
              if(ses2?.target){
                if(ses2?.target?.split("@")[0] !== cht.sender.split("@")[0]){
                  if(ses2.acc){
                    if(ses2.last && ses2.max && ((Date.now() - ses2?.last) <= parseTimeString(ses2?.max))){
                      return cht.reply("Orang itu telah tersambung dalam sesi percakapan lain!")
                    } 
                    ses2 = {}
                    
                  } else {
                    if(ses2.max && ses2.start && ((Date.now() - ses2.start) <= parseTimeString(ses2.max))) {
                      return cht.reply(`Orang itu sedang ${ses2.inviter ? "menya":"disa"}mbungkan dengan percakapan lain!`)
                    }
                    ses2 = {}
                  }
                } else {
                  if(ses2.acc){
                   if(ses2.last && ses2.max && ((Date.now() - ses2?.last) <= parseTimeString(ses2?.max))){
                      return cht.reply("Kamu telah tersambung dalam percakapan ini!!")
                    } 
                    ses2 = {}
                    
                  } else {
                    ses2 = {}
                  }
                }
              }
              if(!(await energy(25))) return
              
                /*start: Date.now(),
                 exp: 0,
                 target: null,
                 acc: false,
                 inviter: null*/
              ses1 = {
                target: Sender,
                start: Date.now(),
                acc: false,
                inviter: true,
                code: `${trgt.toUpperCase()}`,
                max: "5 menit"
              };
              
              ses2 = {
                target: sender.split("@")[0],
                start: Date.now(),
                acc: false,
                inviter: false,
                code: `${trgt.toUpperCase()}`,
                max: "5 menit"
              };
              
              await memories.setItem(sender, "confess.sess", ses1);
              await memories.setItem(Sender, "confess.sess", ses2);

              await cht.reply("*Menghubungkan...*\n\n_Proses ini mungkin akan memakan waktu..._")
              let headConfess = trgt.length >= 7 ? "`SESEORANG INGIN TERHUBUNG DENGAN ANDS MELALUI CHAT ANONYMOUS (CONFESS)`":`\`CONFESS DENGAN CODE [${trgt.toUpperCase()}] INGIN TERHUBUNG DENGAN ANDA\`` 
              
              let message = { 
               text: `${headConfess}

\`INFO\` 
- Reply pesan ini dengan mengetik *YA* \`untuk menghubungkan\`
- Reply pesan ini dengan mengetik *TIDAK* \`untuk menolak\`

_Untuk menjawab, anda harus mereply pesan ini!_
_Kami akan menunggu balasan anda selama 5 menit_
`,
               contextInfo: {
                 isForwarded: true,
                 mentionedJid: [sender]
               },
             }
             let { key: key1 } = await Exp.sendMessage(Sender+from.sender, message, fquoted)
             let qcmds = memories.getItem(Sender, "quotedQuestionCmd") ||{}
             qcmds[key1.id] = {
                  emit: `${cht.cmd}`,
                  exp: Date.now() + 60000 * 5,
                  accepts: [
                    "iya",
                    "ya",
                    "yes",
                    "iy",
                    "y",
                    "tidak",
                    "gak",
                    "ngga",
                    "gk",
                    "g",
                    "no",
                    "n"
                  ]
             }
             memories.setItem(Sender, "quotedQuestionCmd", qcmds)
             
             if(timeouts[ses1.code]) await clearTimeout(timeouts[ses1.code])
             timeouts[ses1.code] = setTimeout(async()=> {
               Exp.sendMessage(Sender+from.sender, { delete: key1 })          
               await cht.reply("Tidak dapat terhubung!")
               await clearSessionConfess(Sender, sender)
             }, parseTimeString(ses1?.max))
            } catch (e) {
              console.error(e)
              cht.reply("Terjadi kesalahan saat menghubungkan ke target❗")
            }
          }
          break
          
          default:
            let isOnWhatsapp = BC && (await Exp.onWhatsApp(trgt)).length > 0
            if(cht.isQuestionCmd) {
              if(!BC){
                memories.setItem(sender, "questionCmd", { 
                  emit: `${cht.cmd} ${AB}|`,
                  exp: Date.now() + 120000,
                  accepts: []
                })
                return cht.reply("Kirimkan nomor target yang akan dikirimi pesan rahasia!")
              } else if(!_message){
                if(!isOnWhatsapp) return cht.reply("Nomor tersebut tidak terdaftar di whatsapp!")
                memories.setItem(sender, "questionCmd", { 
                  emit: `${cht.cmd} ${AB}|${BC}|`,
                  exp: Date.now() + 120000,
                  accepts: []
                })
                return cht.reply("Baik silahkan tulis pesan yang akan dikirimkan\n_Anda juga bisa menyertakan media seperti video/gambar dengan mereply pesan ini_")
              }
            }
            if(!BC||!_message) return cht.edit(exconfes, _key)      
            if(trgt == sender.split("@")[0]) return cht.reply("Tidak dapat mengirim confess ke nomor anda sendiri!")
            if(!isOnWhatsapp) return cht.reply("Nomor tersebut tidak terdaftar di whatsapp!")
                            
            let _target = trgt + from.sender
            if(isNaN(trgt)||String(trgt).length <= 6) return cht.edit("Invalid target number", _key)
            await memories.get(_target)
            let { quoted, type } = ev.getMediaType()
            let isText = ["conversation","extendedTextMessage"].includes(type)
            let isNotAllowedMedia = ["sticker","audio","document"].includes(type)
            if(isNotAllowedMedia) return cht.edit(`${type} tidak diizinkan disini!`, _key)
            if(!(await energy(45))) return
            let message = { }
            let value;
        
            const code = Math.random().toString(36).slice(-6).toUpperCase().slice(0, [3,4,5,6].getRandom())
            const msg = ` 
  ╭─━━━━━━━━━━━━━━━─╮
  │ 📩 *Pesan Rahasia* 📩 │
  ╰─━━━━━━━━━━━━━━━─╯
  CODE: ${code}
  Pengirim: ${AB}
  
  \`PESAN:\`

${_message}
 
   ───────────────────────
${infos.others.readMore}
\`INFO\` 
 ♦ Jika pesan ini dirasa mengganggu, anda bisa memblokir pengirim agar tidak mengirimkan confess seperti ini lagi dengan mengetik *.${cht.cmd} block|${code}*

- Anda bisa melanjutkan percakapan ini secara anonym melalui bot ini kepada pengirim dengan mengetik *.${cht.cmd} connect|${code}*
- Anda juga bisa mengirimkan balasan dengan mengetik *.confess balas|${code}|_teks balasan_*
- Untuk mengetahui siapa pengirimnya, ketik *.confessinfo ${code}.* 

_Code ${code} akan dihapus dalam kurun waktu ${time}_
  `;
        
            if(!isText){
              value = quoted ? await cht.quoted.download() : await cht.download()
              message["caption"] = msg
            } else {
              type = "text"
              value = msg
            }
            message[type] = value 
            try {
              let s1= memories.getItem(sender, "confess") || {
               sent:[],
               inbox:[],
               block: [],
               sess: {
                 /*start: Date.now(),
                 exp: 0,
                 target: null,
                 acc: false,
                 inviter: null*/
               }
              }
              let s2 = memories.getItem(_target, "confess") || {
               sent:[],
               inbox:[],
               block: [],
               sess: {
                 /*start: Date.now(),
                 exp: 0,
                 target: null,
                 acc: false,
                 inviter: null*/
               }
              }
              
              if(s2.block.includes(sender.split("@")[0])) return cht.reply("Kamu tidak dapat mengirimkan pesan rahasia ke orang itu karna kamu telah di blokir olehnya❗")

              s1.sent.push({ code, exp: Date.now() + parseTimeString(time) })
              s2.inbox.push({ code, exp: Date.now() + parseTimeString(time) })
              await memories.setItem(sender, "confess", s1)
              await memories.setItem(_target, "confess", s2)
          
              await Exp.sendMessage(_target, message, fquoted)
             return cht.reply(`✅ Pesan rahasia berhasil dikirim!\n- Code: \`${code}\``);
           } catch (error) {
             console.error(error);
             cht.reply("❌ Terjadi kesalahan saat mengirim pesan.");
           }
       }      
    })
       
    ev.on({ 
        cmd: [
          "confessinfo", "checkconfess",
          "menfessinfo", "checkmenfess"
        ],
       listmenu: ['confessinfo'],
       tag: 'relationship',
       premium: true,
       trial: false
    }, async({ args }) => {
            
      if(!args) {
        memories.setItem(sender, "questionCmd", { 
          emit: `${cht.cmd}`,
          exp: Date.now() + 30000,
          accepts: []
        })
        return cht.reply("Silahkan input code nya!")
      }
      let Sender = findSenderCodeConfess(args.trim().toUpperCase())
      let user = memories.get(Sender)

      if(!Sender) return cht.reply("Code salah atau mungkin sudah kadaluarsa")
      let conf = memories.getItem(Sender, "confess")
      let code = conf.sent.find(a => a.exp >= Date.now())
      let _code = code.code
      let sentAt = func.dateFormatter(code.exp - parseTimeString(time), "Asia/Jakarta")
      if(!code) {
        conf.sent = conf.sent.filter(a => a.exp <= Date.now()) 
        memories.setItem(Sender, "confess", conf)
        return cht.reply("Code salah atau mungkin sudah kadaluarsa")
      }
      cht.reply(`\`BERHASIL MENDAPATKAN DATA PENGIRIM\`✅

 *[ CODE: ${args} ]*
- Sent At: ${sentAt}

- Sender: @${Sender}
- Name: ${func.getName(Sender)}
- Number: ${Sender}
- Link: https://wa.me/${Sender}
- Last Online: ${func.dateFormatter(cht.memories.lastChat, "Asia/Jakarta")}`, { mentions: [Sender.split("@")[0]+from.sender] })
    })
    
}