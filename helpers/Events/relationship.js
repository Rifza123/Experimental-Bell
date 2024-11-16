/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { default: ms } = await "ms".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    const { id } = cht
    const { func } = Exp
    const infos = Data.infos 
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
        let user = await func.archiveMemories.get(cht.sender)
        if (!("premium" in user)) {
            user.premium = { time: 0 };
        }
        let premiumTime = user.premium.time - Date.now()
        let formatDur = func.formatDuration(premiumTime)
        let speed = ms(user.chargingSpeed)
        let url
        try {
            url = await Exp.profilePictureUrl(cht.sender)
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
        Data.users[cht.sender.split("@")[0]] = user
        Exp.sendMessage(id, menu, { quoted: cht })
    })
    
    ev.on({ 
        cmd: ['charge','cas'],
        listmenu: ['charge'],
        tag: 'relationship'
    }, async() => {
        let user = await func.archiveMemories.get(cht.sender)
        
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
          Data.users[cht.sender.split("@")[0]] = user
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
        let usr = cht.sender.split("@")[0]
        let user = Data.users[usr]
        let premium = user.premium ? Date.now() < user.premium.time : false
        let claim = cfg.first.trialPrem
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
            user.claimPremTrial = true
            user.premium.time = Date.now() + 86400000
        Data.users[usr] = user
        let formatTimeDur = func.formatDuration(user.premium.time - Date.now())
     
        let txt = "*Successfully claimed Premium free trial ✅️\n\n"
            txt += `🔑Premium: ${user.premium.time >= Date.now() ? "yes":"no"}`
            txt += `\n⏱️Expired after: ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms`
            txt += `\n🗓️Expired on: ${func.dateFormatter(user.premium.time, "Asia/Jakarta")}\n\n`
            txt += txc
        await sendPremInfo({ text:txt }, true)
    })
    
}