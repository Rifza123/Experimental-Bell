/*!-======[ Module Imports ]======-!*/
const chalk = "chalk".import()

/*!-======[ Default Export Function ]======-!*/
export default

async function client({ Exp, store, cht, is }) {
   // if(cht.id == "120363203820002181@g.us") return
    try {
        if(cht.memories?.banned){
          if((cht.memories.banned * 1) > Date.now()) return
          Exp.func.archiveMemories.delItem(cht.sender, "banned")
        }
        if (Data.preferences[cht.id] === undefined) {
            Data.preferences[cht.id] = {}
        }
        if (Data.preferences[cht.id]?.ai_interactive === undefined) {
            if (is.group) {
                Data.preferences[cht.id].ai_interactive = cfg.ai_interactive.group
            } else {
                Data.preferences[cht.id].ai_interactive = cfg.ai_interactive.private
            }
        }
        let frmtEdMsg = cht?.msg?.length > 50 ? `\n${cht.msg}` : cht.msg
      
        if (!is.group && cht.msg) {
            global.cfg["autotyping"] && await Exp.sendPresenceUpdate('composing', cht.id)
            global.cfg["autoreadpc"] && await Exp.readMessages([cht.key])
            console.log(Exp.func.logMessage('PRIVATE', cht.id, cht.pushName, frmtEdMsg))
        }

        if (is.group && cht.msg) {
            global.cfg["autotyping"] && await Exp.sendPresenceUpdate('composing', cht.id)
            global.cfg["autoreadgc"] && await Exp.readMessages([cht.key])
            console.log(Exp.func.logMessage('GROUP', cht.id, cht.pushName, frmtEdMsg))
        }

        /*!-======[ Block Chat ]======-!*/
		const groupDb = is.group ? Data.preferences[cht.id] : {}
		let maxWarn = 3
	    
        if (global.cfg.public === false && !is.owner && !is.me) return
        
        if(is.antibot) {
            groupDb.warn = groupDb.warn || {}
            groupDb.warn[cht.sender] = groupDb.warn[cht.sender] || 1
            await cht.reply(`*Peringatan ke ${groupDb.warn[cht.sender]}⚠️*\n\nBot terdeteksi!, harap aktifkan mute di group ini atau ubah mode menjadi self!\n\n_Jika sudah di beri peringatan ${maxWarn} kali maka akan otomatis dikeluarkan!`)
            groupDb.warn[cht.sender]++
            if(groupDb.warn[cht.sender] > maxWarn){
              await cht.reply("Anda akan dikeluarkan karena tidak menonaktifkan bot hingga peringatan terakhir!")
              delete groupDb.warn[cht.sender]
              Exp.groupParticipantsUpdate(cht.id, [cht.sender], "remove")
            }
        }
        if(is.baileys||is.mute) return
        let exps = { Exp, store, cht, is }
        let ev = new Data.EventEmitter(exps)
        if(!Data.ev) Data.ev = ev
        if(cht.cmd){
            if(cfg.similarCmd && Data.events[cht.cmd] === undefined){
              let events = Object.keys(Data.events).filter(a => cht.cmd.length >= a.length && Math.abs(cht.cmd.length - a.length) <= 2)
              let similar = calcMinThreshold(cht.cmd)
              function calcMinThreshold(text) {
                const length = text.length;
                if (length <= 4) return 0.3;
                  else if (length <= 7) return 0.4;
                  else if (length <= 10) return 0.5;
                  else return 0.6;
                }
                
              cht.cmd = (Exp.func.getTopSimilar(await Exp.func.searchSimilarStrings(cht.cmd, events, similar))).item
            }
            ev.emit(cht.cmd)
        } else if(cht.reaction){
            Data.reaction({ ev, ...exps })
        } else {
            Data.In({ ev, ...exps })
        }

        /*!-======[ Chat Interactions Add ]======-!*/
        if (!cht.cmd && is.botMention) {
            await Exp.func.archiveMemories.addChat(cht.sender)
        }
    } catch (error) {
        console.error('Error in client.js:', error)
    }
    return
}
