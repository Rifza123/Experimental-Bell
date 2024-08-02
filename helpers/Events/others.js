/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { downloadContentFromMessage } = "baileys".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    const { id } = cht
    ev.on({ 
        cmd: ['menu'],
        listmenu: ['menu'],
        tag: 'other' 
    }, () => {
        let hit = Exp.func.getTotalCmd()
        let topcmd =  Exp.func.topCmd(2)
        let head = `*[ INFO ]*\n- *${hit.total}* Hit Emitter\n- *${hit.ai_response}* Ai response\n\n*[ Relationship ]*\n- Status: *${cht.memories.role}*\n- Mood: ${cht.memories.energy}${cht.memories.energy < 10 ? "😪":"⚡"}\n\n ▪︎ 『 Top Cmd 』\n> ${"`"}${topcmd.join("`\n> `")}${"`"}\n\n`
        const menu = {
            text: head + Exp.func.menuFormatter(Data.events, { ...cfg.menu, ...cht }),
            contextInfo: { 
                externalAdReply: {
                    title: cht.pushName,
                    body: "Artificial Intelligence, The beginning of the robot era",
                    thumbnail: fs.readFileSync(fol[3] + "bell.jpg"),
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
                    serverMessageId: 152
                }
            }
        }
        Exp.sendMessage(id, menu, { quoted: cht })
    })
    
    ev.on({ 
        cmd: ['rvo','getviewonce'],
        listmenu: ['getviewonce'],
        tag: 'baileys',
        energy: 25
    }, async() => {
       if (!(is?.owner || is?.admin)) return cht.reply("Maaf, males nanggepin. ini khusus owner/admin kalo di grup")
         if(cht.mention.length < 1) return cht.reply("Reply/tag orangnya!")
        let ab = store.messages[id].array.filter(a => a.key.participant.includes(cht.mention[0]) && (a.message?.viewOnceMessageV2 || a.message?.viewOnceMessageV2Extension))
        if(ab.length == 0) return cht.reply("Org itu tak pernah mengirimkan foto/video 1xlihat!")
        for(let aa of ab){
            let thay = {
                msg: aa.message.viewOnceMessageV2?.message?.imageMessage || aa.message.viewOnceMessageV2?.message?.videoMessage || aa.message.viewOnceMessageV2Extension?.message?.audioMessage,
                type: aa.message.viewOnceMessageV2?.message?.imageMessage ? "image" : aa.message.viewOnceMessageV2?.message?.videoMessage ? "video" : "audio"
            }
            let stream = await downloadContentFromMessage(thay.msg,thay.type)
            let buffer = Buffer.from([])
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk])
            }
            let mssg = {}
            thay.type == "audio" && (mssg.ptt = true)
            await Exp.sendMessage(id, {  [thay.type]: buffer, ...mssg }, { quoted:aa })
        }
    })
    
    ev.on({ 
        cmd: ['d','del','delete'],
        listmenu: ['delete'],
        tag: 'other'
    }, async() => {
        if(!cht.quoted) return cht.reply("Reply pesan nya!")
        if(cht.quoted.sender !== Exp.number && !is.groupAdmins && !is.owner) return cht.reply("Khusus admin!")
        try{
           cht.quoted.delete()
        } catch {
           cht.reply("Gagal!, mungkin aku bukan admin :)")
        }
    })
    
    ev.on({ 
        cmd: ['statistic','stats'],
        listmenu: ['stats'],
        tag: 'other'
    }, async() => {
    const { cpuUsage, memoryUsage, processStats } = await Exp.func.getSystemStats()
    const runtimeText = processStats.runtime;
        
    const txt = cpuUsage.map(cpu => 
        `💻 *CPU ${cpu.cpu + 1}*\n` 
      + `   Model: ${cpu.model}\n`
      + `   Usage: ${cpu.usage}\n`
    ).join('\n')
        + `🧠 *Memory Usage*\n` 
        + `   Total: ${memoryUsage.totalMemory}\n` 
        + `   Free: ${memoryUsage.freeMemory}\n` 
        + `   Used: ${memoryUsage.usedMemory}\n` 
        + `📊 *Process Memory Usage*\n` 
        + `   RSS: ${processStats.memoryUsage.rss}\n` 
        + `   Heap Total: ${processStats.memoryUsage.heapTotal}\n` 
        + `   Heap Used: ${processStats.memoryUsage.heapUsed}\n` 
        + `   External: ${processStats.memoryUsage.external}\n` 
        + `🕒 *Runtime*\n` 
        + `   ${runtimeText.days}d ${runtimeText.hours}h ${runtimeText.minutes}m ${runtimeText.seconds}s ${runtimeText.milliseconds}ms\n` 
        + `🔧 *Process Info*\n` 
        + `   PID: ${processStats.pid}\n` 
        + `   Title: ${processStats.title}\n` 
        + `   Exec Path: ${processStats.execPath}`;
        return cht.reply(txt)
    })




}
