/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { getContentType } = "baileys".import()

/*!-======[ Function Imports ]======-!*/
const { catbox } = await (fol[0] + 'catbox.js').r()

let Lists = {
  audio: Object.keys(Data.audio),
  fquoted: Object.keys(Data.fquoted)
}
/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {

   let infos = Data.infos
   const { func } = Exp

   const { id } = cht
    const options = {
        public: 'mode public',
        autotyping: 'auto typing',
        autoreadsw: 'auto read sw',
        autoreadpc: 'auto read pc',
        autoreadgc: 'auto read group',
        premium_mode: 'premium mode',
        similarCmd: 'similarity command'
    }

    function sendPremInfo({ _text, text }, cust=false, number){
        return Exp.sendMessage(number || id, {
            text:`${_text ? (_text + "\n\n" + text) : text}`,
                contextInfo: {
                    externalAdReply: {
                    title: !cust ? "🔐Premium Access!" : "🔓Unlocked Premium Access!",
                    body: !cust ? infos.owner.lockedPrem : "Sekarang kamu adalah user 🔑Premium, dapat menggunakan fitur² terkunci!",
                    thumbnailUrl: !cust ? 'https://telegra.ph/file/310c10300252b80e12305.jpg' : 'https://telegra.ph/file/ae815f35da7c5a2e38712.jpg',
                    mediaUrl: `http://ẉa.me/6283110928302/${!cust ? "89e838":"jeie337"}`,
                    sourceUrl: `https://wa.me/${owner[0].split("@")[0]}?text=Hello,+I+have+buy+🔑Premium`,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    mediaType: 1,
                },
                mentionedJid:cht.mention
            }
        }, { quoted: cht })
    }
    
    ev.on({ 
        cmd: ['set'], 
        listmenu: ['set'],
        tag: "owner",
        isOwner: true,
        args: infos.owner.set
    }, async () => {
        let fquotedKeys = Object.keys(Data.fquoted)
        const [t1, t2, t3] = cht.q.split(" ")
        

        const mode = options[t1] || (t1 == "fquoted" 
           ? `Success ${fquotedKeys.includes(t2) ? "change" : "add"} fake quoted ${t2}\n\nList fake quoted:\n\n- ${!fquotedKeys.includes(t2) ? [...fquotedKeys, t2].join("\n- ") : fquotedKeys.join("\n- ")}`
           : t1 == "welcome"
           ? `Successfully set welcome with type ${t2}`
           : t1 == "voice"
           ? infos.owner.successSetVoice
           : t1 == "logic"
           ? infos.owner.successSetLogic
           : t1 == "menu"
           ? infos.owner.successSetMenu
           : t1 == "lang" 
           ? true
           : false)

        if (!mode) return cht.reply(infos.owner.set)
        
        if(t1 == "fquoted"){
          if(!t2) return cht.reply(infos.owner.setFquoted)
          let json;
            if(t3) {
              json = cht.q.split(" ").slice(2).join("")
            } else if(is.quoted) {
              let { key } = await store.loadMessage(cht.id, cht.quoted.stanzaId); 
              let msg = { key }
              let qmsg = cht.message.extendedTextMessage.contextInfo.quotedMessage
              let type = getContentType(qmsg)
                if(type.includes("pollCreationMessage")){
                  msg.message = { pollCreationMessage: qmsg.pollCreationMessage || qmsg.pollCreationMessageV2 || qmsg.pollCreationMessageV3 }
                } else {
                  msg.message = qmsg
                }
              json = JSON.stringify(msg)
            }
            try {
              let obj = JSON.parse(json)
              Data.fquoted[t2] = obj
              cht.reply(mode)
            } catch (e) {
              cht.replyWithTag(infos.owner.checkJson, { e, rm: infos.others.readMore })
            }
        } else if(t1 == "welcome"){
          let list = ["linkpreview","order","product","image","text"]
          let tlist = `\`List type welcome yang tersedia:\`\n\n- ${list.join("\n- ")}`
          if(!t2) return cht.reply(tlist)
          if(!list.includes(t2)) return cht.reply(`*Type welcome _${t2}_ notfound!*\n\n${tlist}`)
          global.cfg.welcome = t2
          cht.reply(mode)
        } else if(t1 == "logic"){
          if(!t2) return cht.replyWithTag(infos.owner.setLogic, { logic: cfg.logic, botnickname, botfullname, cmd: cht.prefix + cht.cmd })
          let fullname = func.findValue("fullainame", cht.q)
          let nickname = func.findValue("nickainame", cht.q)
          let profile = func.findValue("profile", cht.q)||func.findValue("logic", cht.q)
          if(!profile || !nickname || !fullname) return cht.replyWithTag(infos.owner.setLogic, { logic: cfg.logic, botnickname, botfullname, cmd: cht.prefix + cht.cmd })
          global.botfullname = fullname
          global.botnickname = nickname
          global.cfg.logic = profile
          cht.replyWithTag(mode, { logic: cfg.logic })
        } else if(t1 == "menu"){
          let list = ["linkpreview","order","liveLocation","image","text"]
          let tlist = func.tagReplacer(infos.owner.listSetmenu, { list:list.join("\n- ") })
          if(!t2) return cht.reply(tlist)
          if(!list.includes(t2)) return cht.reply(`*Type menu _${t2}_ notfound!*\n\n${tlist}`)
          global.cfg.menu_type = t2
          cht.replyWithTag(mode, { menu:t2 })
          if(t2 == "liveLocation") cht.reply(infos.owner.menuLiveLocationInfo)
          
        } else if(t1 == "lang"){
          let langs = fs.readdirSync(fol[9])
          if(!langs.includes(t2)) return cht.reply(`\`List Language:\`\n\n- ${langs.join("\n- ")}\n\nExample:\n _${cht.prefix + cht.cmd} ${t1} ${langs[0]}_`)
          global.locale = t2
          const files = await fs.readdirSync(fol[9] + locale + "/").filter(file => file.endsWith('.js'));

          for (const file of files) {
            await (fol[9] + locale + "/" + file).r();
          }

          cht.replyWithTag(global.Data.infos.owner.succesSetLang, { lang: t2 })
        } else if(t1 == "voice"){
            let listv = "`LIST VOICES`\n- "+Data.voices.join("\n- ")
            if(!t2){
              func.archiveMemories.setItem(cht.sender, "questionCmd", { 
                emit: `${cht.cmd} ${t1}`,
                exp: Date.now() + 60000,
                accepts: Data.voices
              })
              return cht.reply(listv)
            }
            if(!Data.voices.includes(t2.trim())) return cht.reply("*[ VOICE NOTFOUND❗️ ]*\n\n`LIST VOICES`\n- "+Data.voices.join("\n- "))
            global.cfg.ai_voice = t2.trim()
            cht.replyWithTag(mode, { voice: global.cfg.ai_voice })
        } else {
          if (t2 === "on" || t2 === "true") {
            if (global.cfg[t1]) return cht.replyWithTag(infos.owner.isModeOn, { mode })
            global.cfg[t1] = true
            return cht.replyWithTag(infos.owner.isModeOnSuccess, { mode })
          } else if (t2 === "off" || t2 === "false") {
            if (!global.cfg[t1]) return cht.replyWithTag(infos.owner.isModeOff, { mode })
            global.cfg[t1] = false
            return cht.replyWithTag(infos.owner.isModeOffSuccess, { mode })
          } else {
            await cht.reply("on/off ?")
            func.archiveMemories.setItem(cht.sender, "questionCmd", { 
                emit: `${cht.cmd} ${t1}`,
                exp: Date.now() + 60000,
                accepts: ["on","off","true","false"]
            })
          }
        }
    })
    
    ev.on({ 
        cmd: ['setthumb'], 
        listmenu: ['setthumb'],
        media: {
            type: ["image"],
            save: false
        },
        tag: "owner",
        isOwner: true
    }, async ({ media }) => {
         await fs.writeFileSync(fol[3] + 'bell.jpg', media)
         cht.reply(infos.owner.successSetThumb)
    })
    
    ev.on({ 
        cmd: ['setpp'], 
        listmenu: ['setpp'],
        media: {
            type: ["image"],
            save: false
        },
        tag: "owner",
        isOwner: true
    }, async ({ media }) => {
          await cht.reply(infos.messages.wait)
          Exp.setProfilePicture(Exp.number,media)
          .then(a => cht.reply("Success...✅️"))
          .catch(e => cht.reply("TypeErr: " + e.message))
    })
    
    ev.on({ 
        cmd: ['badword'], 
        listmenu: ['badword'],
        args: func.tagReplacer(infos.owner.badword, { cmd: cht.prefix + cht.cmd }),
        isOwner: true,
        tag: "owner"
    }, async ({ media }) => {
         let [act, input] = cht.q.split("|")
         input = (input || cht.quoted?.text || "").split(",").map(a => a.trim()).filter(a => a.length > 1);

         if(act == "add"){
             if(input.length < 1) return cht.reply("Ex: .badword add|tes")
             Data.badwords = [...new Set([...Data.badwords, ...input])]
             cht.replyWithTag(infos.owner.successAddBadword, { input })
         } else if(act == "delete" || act == "d" || act == "del"){
             if(input.length < 1) return cht.reply("Ex: .badword delete|tes")
             input.forEach(word => {
                 Data.badwords = Data.badwords.filter(a => a !== word)
             })
             cht.replyWithTag(infos.owner.successDelBadword, { input })
         } else if(act == "list") {
             let list = "*[ LIST BADWORD ]*\n"
             for(let i of Data.badwords){
                 list += `\n - ${i}`
             }
             cht.reply(list)
         } else cht.replyWithTag(infos.owner.badwordActionNotfound, { cmd: cht.prefix + cht.cmd })
         
    })
    
    
    ev.on({ 
        cmd: ['getdata'], 
        listmenu: ['getdata'],
        isOwner: true,
        tag: "owner"
    }, async ({ media }) => {
        let [t1,t2,t3] = (cht.q||"").split(" ")
        
        let lists = Object.keys(Lists)
        
        if(!t1 && !lists.includes(t1)) return cht.reply(`\`LIST YANG TERSEDIA\`:\n- ${lists.join("\n- ")}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1||lists[0]||"<item>"}`)
        let lts = Lists[t1.toLowerCase()]
        if(!t2 && !lts.includes(t2)) return cht.reply(`\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n- ${lts.join("\n- ")}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1} ${lts[0]||"<item>"}`)
        let data = Data[t1.toLowerCase()][t2]
        if(t1 == "fquoted") cht.reply(JSON.stringify(data, null, 2))
        
        if(t1 == "audio") cht.reply(`\`LIST ${t1.toUpperCase()}\`:\n\n- ${data.join("\n- ")}\n\n> \`Untuk menghapus audio dalam daftar\`:\n ${cht.prefix + "deldata"} ${t1} ${t2||"<item>"} ${data[0]||"<item>"}`)
    })
    
    ev.on({ 
        cmd: ['deldata'], 
        listmenu: ['deldata'],
        isOwner: true,
        tag: "owner"
    }, async ({ media }) => {
        let [t1,t2,t3] = (cht.q||"").split(" ")
        
        let lists = Object.keys(Lists)
        
        if(!lists.includes(t1)) return cht.reply(`\`LIST YANG TERSEDIA\`:\n\n- ${lists.join("\n- ")}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1||lists[0]||"<item>"}`)
        let lts = Lists[t1.toLowerCase()]
        if(!lts.includes(t2)) return cht.reply(`\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n\n- ${lts.join("\n- ")}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1} ${lts[0]||"<item>"}`)
        let data = Data[t1.toLowerCase()][t2] || []
        if(t1 == "fquoted") {
          delete Data[t1.toLowerCase()][t2]
          cht.reply(`*Berhasil menghapus ${t2} dari dalam data ${t1}\n\n\`LIST ${t1.toUpperCase()} YANG TERSISA\`:\n- ${Object.keys(Data[t1.toLowerCase()]).join("\n- ")}`)
        } else 
        if(t1 == "audio") {
          if(!t3) return cht.reply(`▪︎ *Untuk menghapus list audio:*\n - _${cht.prefix + cht.cmd} ${t1} ${t2} ${data[0]}_\n\n ▪︎ *Untuk menghapus semua list audio dalam data ${t2}*:\n - _${cht.prefix + cht.cmd}\ ${t1} ${t2} all_\n\n\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n- ${data.join("\n- ")}`)
          if(t3 == "all") {
            delete Data[t1.toLowerCase()][t2]
            cht.reply(`*Berhasil menghapus data ${t2}*\n\n\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n\n- ${Object.keys(Data[t1.toLowerCase()]).join("\n- ")}`)
          } else {
          if(!data.includes(t3)) return cht.reply(`*Audio _${t3}_ tidak tersedia dalam data ${t2}*!\n\n\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n\n- ${data.join("\n- ")}`)
            Data[t1.toLowerCase()][t2] = data.filter(a => a !== t3)
            cht.reply(`*Berhasil menghapus ${t3} dari dalam data ${t1} > ${t2}*\n\n\`LIST ${t1.toUpperCase()} YANG TERSISA\`:\n\n- ${Data[t1.toLowerCase()][t2].join("\n- ")}`)
          }
        }
    })
    
    ev.on({ 
        cmd: ['setdata'], 
        listmenu: ['setdata'],
        isOwner: true,
        tag: "owner"
    }, async ({ media }) => {
        let [t1,t2,t3] = (cht.q||"").split(" ")
        
        let lists = Object.keys(Lists)
        if(!t1 && !lists.includes(t1)) return cht.reply(`\`LIST YANG TERSEDIA\`:\n- ${lists.join("\n- ")}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1||lists[0]||"<item>"}`)
        let lts = Lists[t1.toLowerCase()]
        let msg = t1 == "fquoted"
          ? `Sukses ${lts.includes(t2) ? "mengubah" : "menambahkan"} fake quoted ${t2}\n\n\`Contoh cara mengambil data\`:\n> ${prefix}getdata ${t1} ${t2}\n\nList fake quoted:\n\n- ${!lts.includes(t2) ? [...lts, t2].join("\n- ") : lts.join("\n- ")}`
          : t1 == "audio"
          ? infos.owner.audiolist
          : null
          
         if(t1 == "fquoted"){
          if(!(t3||cht.quoted)) return cht.reply(infos.owner.setFquoted.replace(/.set/g,".setdata"))
          let json;
            try {
            if(t3) {
              json = cht.q.split(" ").slice(2).join("")
            } else if(is.quoted) {
              let { key } = await store.loadMessage(cht.id, cht.quoted.stanzaId); 
              let msg = { key }
              let qmsg = cht.message.extendedTextMessage.contextInfo.quotedMessage
              let type = getContentType(qmsg)
                if(type.includes("pollCreationMessage")){
                  msg.message = { pollCreationMessage: qmsg.pollCreationMessage || qmsg.pollCreationMessageV2 || qmsg.pollCreationMessageV3 }
                } else {
                  msg.message = qmsg
                }
              json = JSON.stringify(msg)
            }
              let obj = JSON.parse(json)
              Data.fquoted[t2] = obj
              cht.reply(msg)
            } catch (e) {
              cht.reply(`Harap periksa kembali JSON Object anda!\n\nTypeError:\n${infos.others.readMore}\n> ${e}`)
            }
        }
        
        if(t1 == "audio"){
          if(!t2 && !lts.includes(t2)) return cht.reply(`\`LIST ${t1.toUpperCase()} YANG TERSEDIA\`:\n- ${lts.join("\n- ")}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} ${t1} ${lts[0]||"<item>"}`)
          if(!(t3||is.quoted?.audio)) return cht.reply(infos.owner.setAudio)
            Data.audio[t2] = Data.audio[t2] || []
            if(t3) {
              Data.audio[t2].push(t3)
              cht.replyWithTag(msg,
                { url: t3, list: t2 }
              )
            } else if(is.quoted?.audio) {
              let audio = await catbox(await cht.quoted.download())
              Data.audio[t2].push(audio)
              cht.replyWithTag(msg,
                { url: audio, list: t2 }
              )
            } else {
              cht.reply(infos.owner.setAudio)
            }
        }
        
    })
    
    ev.on({ 
        cmd: ['addenergy','kurangenergy'],
        listmenu: ['addenergy','kurangenergy'],
        args: infos.about.energy,
        tag: 'owner',
        isMention: infos.about.energy,
        isOwner: true
    }, async() => {
        let num = cht.q?.split("|")?.[1] || cht.q
        if(isNaN(num)) return cht.reply("Energy harus berupa angka!")
        let sender = cht.mention[0].split("@")[0]
        if(!(sender in Data.users)) return cht.reply(infos.owner.userNotfound)
        let user = await func.archiveMemories.get(cht.mention[0])
        let opts = {
            addenergy: {
                energy: () => (func.archiveMemories.addEnergy(sender, parseInt(num)).energy)
            },
            kurangenergy: {
                energy: () => (func.archiveMemories.reduceEnergy(sender, parseInt(num)).energy)
            }
        }
        user.energy = parseInt(opts[cht.cmd].energy())
        if(user.energy >= user.maxCharge){
            user.charging = false
        }
        const { default: ms } = await "ms".import()
        let max = user.maxCharge
        let energy = user.energy
        let _speed = user.chargingSpeed
        let rate = user.chargeRate
        let speed = ms(_speed)
        
        let txt = `*Berhasil men${cht.cmd == "addenergy" ? "ambahkan":"gurangi"} ${num} ⚡Energy ke @${sender}*`
            txt += "\n\n*[🔋] Energy*"
            txt += "\n⚡Energy: " + user.energy
            txt += `\n\n- Status: ${user.charging ? "🟢Charging" : " ⚫Discharging"}`
            txt += "\n- Charging Speed: ⚡" + rate + " Energy/" + speed
            txt += "\n- Max Charge: " + max
        Exp.sendMessage(cht.id, { text: txt, mentions: cht.mention }, { quoted: cht })
	})
	
    ev.on({ 
        cmd: ['premium','addpremium','addprem','delpremium','delprem','kurangpremium','kurangprem'],
        listmenu: ['premium'],
        tag: 'owner'
    }, async({ cht }) => {
        let isOwnerAccess = cht.cmd !== "premium";
        let text = isOwnerAccess ? infos.owner.premium_add : "";
        let trial = Data.users[cht.sender.split("@")[0]]?.claimPremTrial
        if (!isOwnerAccess) return sendPremInfo({ text:infos.messages.premium(trial) });
        if (!is.owner) return cht.reply("Maaf, males nanggepin")
        if (cht.mention.length < 1) return sendPremInfo({ text });
        if(!cht.quoted && !cht.q.includes("|")) return sendPremInfo({ _text: infos.owner.wrongFormat });
        let time = (cht.q ? cht.q.split("|")[1] : false) || cht.q || false;
        if (!time) return sendPremInfo({ text });
        let sender = cht.mention[0].split("@")[0];
        if (!(sender in Data.users)) return cht.reply(infos.owner.userNotfound);
        let user = await func.archiveMemories.get(cht.mention[0])
        if (["kurangprem","kurangpremium","delprem","delpremium"].includes(cht.cmd) && user.premium.time < Date.now()) {
            return cht.reply("Maaf, target bukan user premium!");
        }
        let premiumTime = func.parseTimeString(time);
        if (!premiumTime && !["delprem", "delpremium"].includes(cht.cmd)) {
            return sendPremInfo({ _text: infos.owner.wrongFormat, text });
        }
        if (!("premium" in user)) {
            user.premium = { time: 0 };
        }
        let date = user.premium.time < Date.now() ? Date.now() : user.premium.time;
        let formatDur = func.formatDuration(premiumTime || 0)
        let opts = {
            addpremium: {
                time: parseFloat(date) + parseFloat(premiumTime),
                msg:  `*Successfully increased premium duration! ✅️*\n ▪︎ User:\n- @${sender}\n ▪︎ Waktu ditambahkan: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`
            },
            addprem: {
                time: parseFloat(date) + parseFloat(premiumTime),
                msg:  `*Successfully increased premium duration✅️*\n ▪︎ User:\n- @${sender}\n ▪︎ Waktu ditambahkan: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`
            },
            kurangpremium: {
                time: parseFloat(date) - parseFloat(premiumTime),
                msg:  `*Successfully reduced premium duration✅️*\n ▪︎ User:\n- @${sender}\n ▪︎ Waktu dikurangi: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`
            },
            kurangprem: {
                time: parseFloat(date) - parseFloat(premiumTime),
                msg:  `*Successfully reduced premium duration!✅️*\n ▪︎ User:\n- @${sender}\n ▪︎ Waktu dikurangi: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`
            },
            delpremium: { 
                time:0,
                msg: `*Successfully delete user @${sender} from premium✅️*\n\n`
            },
            delprem: {
                time:0,
                msg: `*Successfully delete user @${sender} from premium✅️\n\n`
            }
        }
        if(premiumTime > 315360000000) return cht.reply("Maksimal waktu adalah 10 tahun!")
        user.premium.time = opts[cht.cmd].time
        if(cht.cmd.includes("delprem")) user.premium = { time:0 }
        let formatTimeDur = func.formatDuration(user.premium.time - Date.now())
        let claim = cfg.first.trialPrem
        let claims = Object.keys(claim)
        let prm = user.premium
        
        let txt = opts[cht.cmd].msg
            txt += `🔑Premium: ${user.premium.time >= Date.now() ? "yes":"no"}`
            if(user.premium.time >= Date.now()){
              user.premium = { ...claim, ...prm }
              let txc = "\n\n*🎁Bonus `(Berlaku selama premium)`*"
              for(let i of claims){
                  txc += `\n- ${i}: +${claim[i]}`
              }
              txt += `\n⏱️Expired after: ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms`
              txt += `\n🗓️Expired on: ${func.dateFormatter(user.premium.time, "Asia/Jakarta")}`
              txt += txc
            } else {
              txt += `\n⏱️Expired after: false`
              txt += `\n🗓️Expired on: false`
            }
        Data.users[sender] = user
        await sendPremInfo({ text:txt }, true)
        //sendPremInfo({ text:txt }, true, cht.mention[0])
    })
    
    ev.on({ 
        cmd: ['banned','unbanned'],
        listmenu: ['banned','unbanned'],
        tag: 'owner',
        isMention: infos.owner.banned,
        isOwner: true
    }, async() => {
        let user = await Exp.func.archiveMemories.get(cht.mention[0])
        console.log(user)
        let sender = cht.mention[0].split("@")[0];
        if(!cht.quoted && !cht.q.includes("|")) return cht.reply(infos.owner.banned)
        if(cht.cmd == "banned"){
          let time = (cht.args ? cht.args.split("|")[1] : false) || cht.args || false;
          if(!time) return cht.reply(infos.owner.banned)
          if (!(sender in Data.users)) return cht.reply("Nomor salah atau user tidak terdaftar!");
          let _time = func.parseTimeString(time)
           if (!("banned" in user)) {
            user.banned = 0
          }
          let date = (user.banned && (user.banned > Date.now())) ? user.banned:Date.now() 
          let bantime = (date +_time)
          console.log(bantime)
          let formatDur = func.formatDuration(_time|| 0)
          let ban = func.formatDuration(bantime - Date.now())
          await Exp.sendMessage(cht.mention[0], { text: func.tagReplacer(infos.owner.addBanned, { ...ban }) })
          await cht.reply(func.tagReplacer(infos.owner.bannedSuccess, { ...formatDur,sender }),  {mentions: cht.mention})
          await func.archiveMemories.setItem(sender, "banned", bantime)
        } else {
          await Exp.sendMessage(cht.mention[0], { text: infos.owner.delBanned })
          await cht.reply(func.tagReplacer(infos.owner.unBannedSuccess, { sender }), {mentions: cht.mention})
          func.archiveMemories.delItem(sender, "banned")
        }
        
    })
    
    ev.on({ 
        cmd: ['cekapikey'], 
        listmenu: ['cekapikey'],
        isOwner: true,
        tag: "owner"
    }, async ({ args }) => {
        if(!args) {
            await cht.reply("Please input key!")
            func.archiveMemories.setItem(cht.sender, "questionCmd", { 
                emit: `${cht.cmd}`,
                exp: Date.now() + 60000,
                accepts: []
            })
            return
        }
        let res = await fetch(api.xterm.url + "/api/tools/key-checker?key="+cht.q).then(a => a.json())
        const { limit, usage, totalHit, remaining, resetEvery, reset, expired, isExpired, features } = res.data;
        const resetTime = resetEvery.format
        const featuresList = Object.entries(features)
          .map(
            ([feature, details]) => 
              `🔹 **${feature}**:\n   - Maksimal: ${details.max} penggunaan/hari\n   - Hit Today: ${details.use} kali\n   - Total Hit: ${details.hit}\n`
          ).join("\n");

        cht.reply(`✅ **Status API Key**: ${isExpired ? "⛔ Kedaluwarsa" : "✅ Aktif"}\n🔒 **Batas Harian**: ${limit} hit\n📊 **Penggunaan Saat Ini**: ${usage} hit\n📈 **Total Hit**: ${totalHit} hit\n🟢 **Sisa Hit**: ${remaining} hit\n\n⏳ **Reset Limit**:\n   - **Waktu Reset**: ${reset}\n   - **Interval Reset**: ${resetTime.days} hari ${resetTime.hours} jam ${resetTime.minutes} menit ${resetTime.seconds} detik\n📅 **Masa Berlaku**:\n   - **Berakhir Pada**: ${expired}\n   - **Status Kedaluwarsa**: ${isExpired ? "✅ Sudah Kedaluwarsa" : "❌ Belum Kedaluwarsa"}\n\n✨ **Fitur yang Tersedia**:\n${featuresList}\n📌 **Catatan**: Gunakan API secara bijak dan sesuai dengan batas penggunaan.\n  `)
    })

}