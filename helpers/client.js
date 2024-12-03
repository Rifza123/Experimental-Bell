/*!-======[ Module Imports ]======-!*/
const chalk = "chalk".import()

/*!-======[ Default Export Function ]======-!*/
export default

async function client({ Exp, store, cht, is }) {
   // if(cht.id == "120363203820002181@g.us") return
   let { func } = Exp
    try {
        if(cht.memories?.banned && !is.owner){
          if((cht.memories.banned * 1) > Date.now()) return
          func.archiveMemories.delItem(cht.sender, "banned")
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
            console.log(func.logMessage('PRIVATE', cht.id, cht.pushName, frmtEdMsg))
        }

        if (is.group && cht.msg) {
            global.cfg["autotyping"] && await Exp.sendPresenceUpdate('composing', cht.id)
            global.cfg["autoreadgc"] && await Exp.readMessages([cht.key])
            console.log(func.logMessage('GROUP', cht.id, cht.pushName, frmtEdMsg))
        }

        /*!-======[ Block Chat ]======-!*/
		const groupDb = is.group ? Data.preferences[cht.id] : {}
	    
        if (global.cfg.public === false && !is.owner && !is.me) return
        
        let except = is.antiTagall || is.antibot
        if((is.baileys||is.mute) && !except) return
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
                
              cht.cmd = (func.getTopSimilar(await func.searchSimilarStrings(cht.cmd, events, similar))).item
            }
            ev.emit(cht.cmd)
        } else if(cht.reaction){
            Data.reaction({ ev, ...exps })
        } else {
            Data.In({ ev, ...exps })
        }

        /*!-======[ Chat Interactions Add ]======-!*/
        if (!cht.cmd && is.botMention) {
            await func.archiveMemories.addChat(cht.sender)
        }
        await func.archiveMemories.setItem(cht.sender, "name", cht.pushName)
        func.archiveMemories.setItem(cht.sender, "lastChat", Date.now())
    } catch (error) {
        console.error('Error in client.js:', error)
    }
    return
}