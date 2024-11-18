/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
   const { id } = cht
   const { func } = Exp
   let infos = Data.infos
   
    ev.on({ 
        cmd: ['group','resetlink','open','close','linkgc'],
        listmenu: ['group <options>','resetlink','linkgc','open','close'],
        tag: 'group',
        isGroup: true,
        isAdmin: true,
        isBotAdmin: true,
    }, async() => {
        let opts = {
          open: ["buka", "open"],
          close: ["tutup", "close"],
          link: ["link","linkgroup","linkgc"],
          reset: ["resetlink","revokelink","revokeinvitelink"],
          locked: ["locked-change"],
          onephemeral: ["on-ephemeral"],
          offephemeral: ["off-ephemeral"],
          unlocked: ["unlocked-change"]
        }
        let text = func.tagReplacer(infos.group.settings, { options:Object.values(opts).flat().join("\n- ") })
        if(!cht.q) cht.q = cht.cmd

        opts["open"].includes(cht.q) 
            ? Exp.groupSettingUpdate(id, "not_announcement")
        : opts["close"].includes(cht.q) 
            ? Exp.groupSettingUpdate(id, "announcement")
        : opts["link"].includes(cht.q) 
            ? cht.reply('https://chat.whatsapp.com/' + await Exp.groupInviteCode(cht.id))
        : opts["reset"].includes(cht.q) 
            ? Exp.groupRevokeInvite(cht.id)
        : opts["locked"].includes(cht.q) 
            ? Exp.groupSettingUpdate(id, "locked")
        : opts["unlocked"].includes(cht.q) 
            ? Exp.groupSettingUpdate(id, "unlocked")
        : opts["onephemeral"].includes(cht.q) 
            ? Exp.groupSettingUpdate(id, !0)
        : opts["offephemeral"].includes(cht.q) 
            ? Exp.groupSettingUpdate(id, !1)
        : cht.reply(text);
        
        let accepts = Object.values(opts).flat()
        if(!accepts.includes(cht.q)){
            func.archiveMemories.setItem(cht.sender, "questionCmd", { 
                emit: `${cht.cmd}`,
                exp: Date.now() + 60000,
                accepts
            })
		}

    })
    
    ev.on({ 
        cmd: ['kick','add'],
        listmenu: ['kick','add'],
        tag: 'group',
        isGroup: true,
        isAdmin: true,
        isMention: func.tagReplacer(infos.group.kick_add, { prefix: cht.prefix, cmd: cht.cmd }),
        isBotAdmin: true
    }, async() => {
            if(is.botMention && cht.cmd == "kick") return cht.reply("Saya tidak ingin keluar!")
            let { status } = (await Exp.groupParticipantsUpdate(id, cht.mention, cht.cmd == "kick"? "remove" : "add"))[0]
            if(status == 408) return cht.reply('Dia baru-baru saja keluar dari grub ini!')
            if(status == 409) return cht.reply('Dia sudah join!')
            if(status == 500) return cht.reply('Grub penuh!')
            if(status == 403) return cht.reply("Maaf, gabisa ditambah karna private acc")
	})
	
	ev.on({ 
        cmd: ['getpp'],
        listmenu: ['getpp'],
        tag: 'group',
        isMention: true
    }, async() => {
      try { 
        let pp = await Exp.profilePictureUrl(cht.mention[0])
        Exp.sendMessage(cht.id, { image: { url: pp}})
      } catch { 
         cht.reply("Gabisa, keknya dia gapake pp")
      }
	})
	
	ev.on({ 
        cmd: ['tagall','hidetag'],
        listmenu: ['tagall','hidetag'],
        tag: 'group',
        isGroup: true,
        isAdmin: true
    }, async() => {
         let mentions = Exp.groupMembers.map(a => a.id)
         let text = cht.cmd == "tagall" ? `\`${cht?.q ?? 'TAG ALL'}\`\n` : (cht.q||"")
         if(cht.cmd == "tagall"){
           for(let i = 0; i < mentions.length; i++){
             text += `\n${i+1}. @${mentions[i]?.split("@")[0]}`
           }
         }
        Exp.sendMessage(cht.id, { text, mentions }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['on','off'],
        listmenu: ['on','off'],
        tag: 'group',
        isGroup: true,
        isAdmin: true
    }, async() => {
        let input = cht.q?.trim().toLowerCase()
        let actions = ["welcome","antilink","antitagall","mute","antibot"]
        let text = `Opsi yang tersedia:\n\n- ${actions.join("\n- ")}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} welcome`
        if(!actions.includes(input)){
          func.archiveMemories.setItem(cht.sender, "questionCmd", { 
                emit: `${cht.cmd}`,
                exp: Date.now() + 60000,
                accepts: actions
          })
          return cht.reply(text)
        }
        console.log(cht.cmd)
        let sets = Data.preferences[cht.id]
            sets[input] = sets[input] || false
        if(cht.cmd == "on" && sets[input]) return cht.reply(`*${input}* sudah aktif disini!`)
        if(cht.cmd !== "on" && !sets[input]) return cht.reply(`*${input}* sudah non-aktif disini!`)
            sets[input] = cht.cmd == "on"
            if(input =="antilink"){
              sets.links = sets.links ||["chat.whatsapp.com"]
            }
        cht.reply(infos.group.on(cht.cmd, input))
	})
	ev.on({ 
        cmd: ['antilink'],
        listmenu: ['antilink'],
        tag: 'group',
        args: infos.about.antilink,
        isGroup: true,
        isAdmin: true
    }, async({ args }) => {
       let [action, ...etc] = args.split(" ")
       let value = etc?.join(" ")
       let sets = Data.preferences[cht.id]
            sets[cht.cmd] = sets[cht.cmd] || false
            sets.links = sets.links||["chat.whatsapp.com"]
       if(["on","off"].includes(action)){
         if(action == "on" && sets[cht.cmd]) return cht.reply(`*${cht.cmd}* sudah aktif disini!`)
         if(action !== "on" && !sets[cht.cmd]) return cht.reply(`*${cht.cmd}* sudah non-aktif disini!`)
         sets[cht.cmd] = action =="on"
         cht.reply(infos.group.on(action, cht.cmd))
       } else if(["add","del","delete"].includes(action)){
         if(!value) return cht.reply("Please put link!\n\n"+infos.about.antilink)
         if(action == "add"){
           sets.links.push(value)
           sets.links = [...new Set(sets.links)]
           cht.reply(`Success add link ${value}`)
         } else {
           sets.links = [...new Set(sets.links.filter(a => a !== value))]
           cht.reply(`Success delete link ${value}`)
         }
       } else if(action == "list"){
           cht.reply(`\`Group ID: ${cht.id}\`\n\n*Include links*\n- ${sets.links.join("\n- ")}`)
       } else {
         cht.reply(infos.about.antilink)
       }
    })
    
}
