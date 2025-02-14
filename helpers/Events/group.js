/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
   const { id, sender } = cht
   const { func } = Exp
   const { archiveMemories:memories, dateFormatter } = func
   let infos = Data.infos
   
    ev.on({ 
        cmd: ['group','resetlink','open','close','linkgc','setppgc'],
        listmenu: ['group <options>','resetlink','linkgc','open','close','setppgc'],
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
          unlocked: ["unlocked-change"],
          setdesc: ["setdesc","setdescription","setname","setsubject"],
          setpp: ["setppgc","setthumb","setpp"]
        }
        let k = Object.keys(opts)
        let text = func.tagReplacer(infos.group.settings, { options:Object.values(opts).flat().join("\n- ") })
        let [a, ..._b] = (cht.q||'').split(' ')
        let b = _b.join(' ')
        if(!Boolean(a)) a = cht.cmd

        opts[k[0]].includes(a) 
            ? Exp.groupSettingUpdate(id, "not_announcement")
        : opts[k[1]].includes(a) 
            ? Exp.groupSettingUpdate(id, "announcement")
        : opts[k[2]].includes(a) 
            ? cht.reply('https://chat.whatsapp.com/' + await Exp.groupInviteCode(cht.id))
        : opts[k[3]].includes(a) 
            ? Exp.groupRevokeInvite(cht.id)
        : opts[k[4]].includes(a) 
            ? Exp.groupSettingUpdate(id, "locked")
        : opts[k[5]].includes(a) 
            ? Exp.groupSettingUpdate(id, "unlocked")
        : opts[k[6]].includes(a) 
            ? Exp.groupSettingUpdate(id, !0)
        : opts[k[7]].includes(a) 
            ? Exp.groupSettingUpdate(id, !1)
        : opts[k[8]].includes(a) 
            ? (async(v)=> {
              let isDesc = ["setdesc","setdescription"].includes(a)
                
              if(!v){
                let exp = Date.now() + 60000 * 5
                let area = 'Asia/Jakarta'
                let date = dateFormatter(exp, area)
                let { key } = await cht.reply(`*Silahkan reply pesan ini dengan ${isDesc ? 'deskripsi':'nama' } group yang baru*\n> _Expired on ${date} (${area})_`)
                let qcmds = memories.getItem(sender, "quotedQuestionCmd") ||{}
                  qcmds[key.id] = {
                  emit: `${cht.cmd} ${a}`,
                  exp,
                  accepts: []
                }
                return memories.setItem(sender, "quotedQuestionCmd", qcmds)
              }
              Exp[`groupUpdate${isDesc ? 'Description': 'Subject' }`](cht.id, b)
            })(b)
        : opts[k[9]].includes(a) 
            ? (async()=> {
              let { quoted, type } = ev.getMediaType()
              if(!(is.image||is.quoted.image)) {
                let exp = Date.now() + 60000 * 5
                let area = 'Asia/Jakarta'
                let date = dateFormatter(exp, area)
                let { key } = await cht.reply(`*Silahkan reply pesan ini dengan foto yang akan dijadikan thumbnail/foto profile group!*\n> _Expired on ${date} (${area})_`)
                let qcmds = memories.getItem(sender, "quotedQuestionCmd") ||{}
                  qcmds[key.id] = {
                  emit: `${cht.cmd} setpp`,
                  exp,
                  accepts: []
                }
                return memories.setItem(sender, "quotedQuestionCmd", qcmds)
              }
              let media = quoted ? await cht.quoted.download() : await cht.download()
              await cht.reply(infos.messages.wait)
              Exp.setProfilePicture(cht.id,media).then(a => cht.reply("Success...✅️")).catch(e => cht.reply("TypeErr: " + e.message))
            })()
        : cht.reply(text);
        
        let accepts = Object.values(opts).flat()
        if(!accepts.includes(a)){
            func.archiveMemories.setItem(sender, "questionCmd", { 
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
         if(Data.preferences[id]["antitagall"]) return cht.reply("Tagall tidak di izinkan disini!")
         let mentions = Exp.groupMembers.map(a => a.id)
         let text = cht.cmd == "tagall" ? `\`${cht?.q ?? 'TAG ALL'}\`\n` : (cht.q||"")
         if(cht.cmd == "tagall"){
           for(let i = 0; i < mentions.length; i++){
             text += `\n${i+1}. @${mentions[i]?.split("@")[0]}`
           }
         }
        Exp.sendMessage(id, { text, mentions }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['jadwalsholat'],
        listmenu: ['jadwalsholat'],
        tag: 'religion',
        args: 'Silahkan input daerahnya!'
    }, async({ args }) => {
      let { status, data, msg, timeZone, list } = await jadwal.init('no', args)
      if(!status){
        func.archiveMemories.setItem(sender, "questionCmd", { 
           emit: `${cht.cmd}`,
          exp: Date.now() + 20000,
          accepts:[]
        })
        return cht.reply(`*${msg}*${list ? `\n\nList daerah:\n- ${list.join('\n- ')}`:''}`)
      }
      const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      const parts = formatter.formatToParts(new Date())
      const d = parts.find(p => p.type === 'day').value
      const m = parts.find(p => p.type === 'month').value

      let dm = `${d}/${m}`
      let a = data.find(a => a.tanggal == dm)
      let text = `*JADWAL SHOLAT*\n\nHari ini: *${func.dateFormatter(Date.now(), timeZone)}*\n- imsak: ${a.imsak}\n- subuh: ${a.subuh}\n- dzuhur: ${a.dzuhur}\n- ashar: ${a.ashar}\n- magrib: ${a.magrib}\n- isya: ${a.isya}\n\n*Jadwal bulan ini*:\n${infos.others.readMore}\n${data.map(a => ` \n 🗓️ \`${a.tanggal}\`\n- imsak: ${a.imsak}\n- subuh: ${a.subuh}\n- dzuhur: ${a.dzuhur}\n- ashar: ${a.ashar}\n- magrib: ${a.magrib}\n- isya: ${a.isya}\n`).join('\n')}`
      cht.reply(text)
	})
	
	ev.on({ 
        cmd: ['on','off'],
        listmenu: ['on','off'],
        tag: 'group',
        isGroup: true,
        isAdmin: true
    }, async() => {
        let [input,v,...etc] = cht.q?.trim().toLowerCase().split(' ')
        let actions = ["welcome","antilink","antitagall","mute","antibot","playgame","jadwalsholat"]
        let text = `Opsi yang tersedia:\n\n- ${actions.join("\n- ")}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} welcome`
        if(!actions.includes(input)){
          func.archiveMemories.setItem(sender, "questionCmd", { 
                emit: `${cht.cmd}`,
                exp: Date.now() + 60000,
                accepts: actions
          })
          return cht.reply(text)
        }
        let sets = Data.preferences[id]
            sets[input] = sets[input] || false
        let sholat = {}
        if(input == 'jadwalsholat' && cht.cmd == 'on'){
          if(!v) return cht.reply(`*Harap sertakan daerahnya!*
- Contoh: ${cht.prefix + cht.cmd +' jadwalsholat kab-bungo'}

_Anda juga bisa menyertakan type di sebelah input daerah untuk kebutuhan tertentu_

\`List type:\`
- ramadhan
> Untuk bulan ramadhan, ini akan sekaligus mengingatkan waktu imsak dan ucapan selamat berbuka saat adzan Maghrib berkumandang
- tutup
> otomatis menutup grup(selama 5 menit) saat tiba waktu sholat

- Contoh penggunaan type: .on jadwalsholat kab-bungo ramadhan tutup

_Jika sudah mengaktifkan jadwalsholat dengan tipe diatas, anda bisa memastikannya dengan .off jadwalsholat lalu meng-aktifkan kembali .on jadwalsholat tanpa menyertakan type_

> *❗Dengan teks ini, admin sangat berharap kepada user untuk membaca dengan teliti agar tidak menanyakan lagi!*`)
          let isOpt = false
          if(etc.length > 0){
            let acts = ['ramadhan', 'tutup']
            let notf = etc.find(a => !acts.includes(a))
            if(notf) return cht.reply(`Pilihan opsi ${notf} tidak tersedia!\n\nOpsi yang tersedia: ${acts.join(', ')}`)
            isOpt = true
          }
          let _txt = `${infos.group.on(cht.cmd, input)}`
          if(isOpt){
            _txt += `\n\n\`Type\`:`
            for(let i of etc){
              _txt += `\n- ${i}`
              sholat[i] = true
            }
          }
          let { status, msg, data, list, db } = await jadwal.init(id, v, sholat)
          if(!status) return cht.reply(`*${msg}*${list ? `\n\nList daerah:\n- ${list.join('\n- ')}`:''}`)
          sets['jadwalsholat'] = db
          return await cht.reply(_txt)
        } else {
          if(cht.cmd == "on" && sets[input]) return cht.reply(`*${input}* sudah aktif disini!`)
          if(cht.cmd !== "on" && !sets[input]) return cht.reply(`*${input}* sudah non-aktif disini!`)
            sets[input] = cht.cmd == "on"
          if(input =="antilink"){
            sets.links = sets.links ||["chat.whatsapp.com"]
          }
          if(input == 'jadwalsholat' && cht.cmd !== 'on') delete jadwal.groups[id]
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
    
    ev.on({ 
        cmd: ['afk'],
        listmenu: ['afk'],
        tag: 'group',
        isGroup: true,
    }, async({ args }) => {
      let alasan = args || "Tidak diketahui"
      if(alasan.length > 100) return cht.reply("Alasan tidak boleh lebih dari 100 karakter!")
      func.archiveMemories.setItem(sender, "afk", { 
        time: Date.now(),
        reason: alasan
      })
      cht.reply(`@${sender.split("@")[0]} Sekarang *AFK!*\n\n- Dengan alasan: ${alasan}\n- Waktu: ${func.dateFormatter(Date.now(), "Asia/Jakarta")}`, { mentions: [sender] })
    })
}
