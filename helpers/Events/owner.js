/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Configurations ]======-!*/
let infos = Data.infos

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {

   const { id } = cht
    const modes = {
        public: 'mode public',
        autotyping: 'auto typing',
        autoreadsw: 'auto read sw',
        autoreadpc: 'auto read pc',
        autoreadgc: 'auto read group',
        premium_mode: 'premium mode'
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
        tag: "owner"
    }, () => {
        if (!is.owner) return cht.reply("Maaf, males nanggepin")
        if (!cht.q) return cht.reply(infos.set)

        const [t1, t2] = cht.q.split(" ")
        const mode = modes[t1]

        if (!mode) return

        if (t2 === "on" || t2 === "true") {
            if (global.cfg[t1]) return cht.reply(`Maaf, ${mode} sudah dalam mode on!`)
            global.cfg[t1] = true
            return cht.reply(`Sukses mengaktifkan ${mode}`)
        } else if (t2 === "off" || t2 === "false") {
            if (!global.cfg[t1]) return cht.reply(`Maaf, ${mode} sudah dalam mode off!`)
            global.cfg[t1] = false
            return cht.reply(`Sukses menonaktifkan ${mode}`)
        } else {
            cht.reply("on/off ?")
        }
    })
    
    ev.on({ 
        cmd: ['setthumb'], 
        listmenu: ['setthumb'],
        media: {
            type: ["image"],
            save: false
        },
        tag: "owner"
    }, async ({ media }) => {
        if (!is.owner) return cht.reply("Maaf, males nanggepin")
         await fs.writeFileSync(fol[3] + 'bell.jpg', media)
         cht.reply("Berhasil mengganti thumbnail menu!")
    })
    
    ev.on({ 
        cmd: ['setpp'], 
        listmenu: ['setpp'],
        media: {
            type: ["image"],
            save: false
        },
        tag: "owner"
    }, async ({ media }) => {
        if (!is.owner) return cht.reply("Maaf, males nanggepin")
          Exp.setProfilePicture(media)
          .then(a => cht.reply("Success...✅️"))
          .catch(e => cht.reply("TypeErr: " + e.message))
    })
    
    ev.on({ 
        cmd: ['badword'], 
        listmenu: ['badword'],
        args: `Mau add, delete atau list?\nContoh: ${cht.msg} add|tobrut`,
        tag: "owner"
    }, async ({ media }) => {
        if (!is.owner) return cht.reply("Maaf, males nanggepin")
         let [act, input] = cht.q.split("|")
         input = (input || cht.quoted?.text || "").split(",").map(a => a.trim()).filter(a => a.length > 1);

         if(act == "add"){
             if(input.length < 1) return cht.reply("Contoh: .badword add|tes")
             Data.badwords = [...new Set([...Data.badwords, ...input])]
             cht.reply(`Berhasil menambahkan ${input} kedalam list badword!`)
         } else if(act == "delete" || act == "d" || act == "del"){
             if(input.length < 1) return cht.reply("Contoh: .badword delete|tes")
             input.forEach(word => {
                 Data.badwords = Data.badwords.filter(a => a !== word)
             })
             cht.reply(`Berhasil menghapus ${input} kedalam list badword!`)
         } else if(act == "list") {
             let list = "*[ LIST BADWORD ]*\n"
             for(let i of Data.badwords){
                 list += `\n - ${i}`
             }
             cht.reply(list)
         } else cht.reply(`Action mungkin tidak ada dalam list!\n*List Action*: add, delete, list\n\n_Contoh: ${cht.prefix + cht.cmd} add|tobrut_`)
         
    })
    
    ev.on({ 
        cmd: ['addenergy','kurangenergy'],
        listmenu: ['addenergy','kurangenergy'],
        args: `*Sertakan nomor/Reply/tag target yang akan di${cht.cmd == "addenergy" ? "tambahkan":"kurangi"} energy nya!*\n\nExample: \n\n*Cara #1* => _Dengan reply pesan target_\n - ${prefix + cht.cmd} 10 \n \n*Cara #2* => _Dengan tag target_\n - ${prefix + cht.cmd} @rifza|10 \n \n*Cara #2* => _Dengan nomor target_\n - ${prefix + cht.cmd} +62 831-xxxx-xxxx|10`,
        tag: 'owner'
    }, async() => {
        if(!is.owner) return cht.reply("Khusus owner!")
        if(cht.mention.length < 1) return cht.reply(`Sertakan nomor/Reply/tag target yang akan di${cht.cmd == "addenergy" ? "tambahkan":"kurangi"} energy nya!*\n\nExample: \n\n*Cara #1* => _Dengan reply pesan target_\n - ${prefix + cht.cmd} 10 \n \n*Cara #2* => _Dengan tag target_\n - ${prefix + cht.cmd} @rifza|10 \n \n*Cara #2* => _Dengan nomor target_\n - ${prefix + cht.cmd} +62 831-xxxx-xxxx|10`)
        let num = cht.q?.split("|")?.[1] || cht.q
        if(isNaN(num)) return cht.reply("Energy harus berupa angka!")
        let sender = cht.mention[0].split("@")[0]
        if(!(sender in Data.users)) return cht.reply("Nomor salah atau user tidak terdaftar!")
        let user = await Exp.func.archiveMemories.get(cht.mention[0])
        let opts = {
            addenergy: {
                energy: () => (Exp.func.archiveMemories.addEnergy(sender, parseInt(num)).energy)
            },
            kurangenergy: {
                energy: () => (Exp.func.archiveMemories.reduceEnergy(sender, parseInt(num)).energy)
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
        let text = isOwnerAccess ? infos.premium_add : "";
        let trial = Data.users[cht.sender.split("@")[0]]?.claimPremTrial
        if (!isOwnerAccess) return sendPremInfo({ text:infos.premium({ trial }) });
        if (!is.owner) return cht.reply("Maaf, males nanggepin")
        if (cht.mention.length < 1) return sendPremInfo({ text });
        if(!cht.quoted && !cht.q.includes("|")) return sendPremInfo({ _text: "*❗Format salah, silahkan periksa kembali*", text });
        let time = (cht.q ? cht.q.split("|")[1] : false) || cht.q || false;
        if (!time) return sendPremInfo({ text });
        let sender = cht.mention[0].split("@")[0];
        if (!(sender in Data.users)) return cht.reply("Nomor salah atau user tidak terdaftar!");
        let user = await Exp.func.archiveMemories.get(cht.mention[0])
        if (["kurangprem","kurangpremium","delprem","delpremium"].includes(cht.cmd) && user.premium.time < Date.now()) {
            return cht.reply("Maaf, target bukan user premium!");
        }
        let premiumTime = Exp.func.parseTimeString(time);
        if (!premiumTime && !["delprem", "delpremium"].includes(cht.cmd)) {
            return sendPremInfo({ _text: "*❗Format salah, silahkan periksa kembali*", text });
        }
        if (!("premium" in user)) {
            user.premium = { time: 0 };
        }
         let date = user.premium.time < Date.now() ? Date.now() : user.premium.time;
        let formatDur = Exp.func.formatDuration(premiumTime || 0)
        let opts = {
            addpremium: {
                time: parseFloat(date) + parseFloat(premiumTime),
                msg:  `*Berhasil menambah durasi premium!*\n ▪︎ User:\n- @${sender}\n ▪︎ Waktu ditambahkan: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`
            },
            addprem: {
                time: parseFloat(date) + parseFloat(premiumTime),
                msg:  `*Berhasil menambah durasi premium!*\n ▪︎ User:\n- @${sender}\n ▪︎ Waktu ditambahkan: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`
            },
            kurangpremium: {
                time: parseFloat(date) - parseFloat(premiumTime),
                msg:  `*Berhasil ngurangi durasi premium!*\n ▪︎ User:\n- @${sender}\n ▪︎ Waktu dikurangi: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`
            },
            kurangprem: {
                time: parseFloat(date) - parseFloat(premiumTime),
                msg:  `*Berhasil ngurangi durasi premium!*\n ▪︎ User:\n- @${sender}\n ▪︎ Waktu dikurangi: \n- ${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms\n\n`
            },
            delpremium: { 
                time:0,
                msg: `*Berhasil menghapus @${sender} dari premium!*\n\n`
            },
            delprem: {
                time:0,
                msg: `*Berhasil menghapus @${sender} dari premium!*\n\n`
            }
        }
        if(premiumTime > 315360000000) return cht.reply("Maksimal waktu adalah 10 tahun!")
        user.premium.time = opts[cht.cmd].time
        if(cht.cmd.includes("delprem")) user.premium = { time:0 }
        let formatTimeDur = Exp.func.formatDuration(user.premium.time - Date.now())
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
              txt += `\n🗓️Expired on: ${Exp.func.dateFormatter(user.premium.time, "Asia/Jakarta")}`
              txt += txc
            } else {
              txt += `\n⏱️Expired after: false`
              txt += `\n🗓️Expired on: false`
            }
        Data.users[sender] = user
        await sendPremInfo({ text:txt }, true)
        //sendPremInfo({ text:txt }, true, cht.mention[0])
    })

}
