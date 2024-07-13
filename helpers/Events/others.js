/*!-======[ Module Imports ]======-!*/
const fs = "fs".import();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {

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
        Exp.sendMessage(cht.id, menu, { quoted: cht })
    })

}
