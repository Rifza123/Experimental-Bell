/*!-======[ Module Imports ]======-!*/
const chalk = "chalk".import()

/*!-======[ Default Export Function ]======-!*/
export default

async function client({ Exp, store, cht, is }) {
   let { func } = Exp
    try {
        if(cht.memories?.banned && !is.owner){
          if((cht.memories.banned * 1) > Date.now()) return
          func.archiveMemories.delItem(cht.sender, "banned")
        }
        
        Data.preferences[cht.id].ai_interactive ??= Data.preferences[cht.id].ai_interactive = cfg.ai_interactive[is.group ? 'group': 'private']
        let frmtEdMsg = cht?.msg?.length > 50 ? `\n${cht.msg}` : cht.msg
      
        if (cht.msg) {
          cfg["autotyping"] && await Exp.sendPresenceUpdate('composing', cht.id)
          cfg[is.group ? "autoreadgc" : "autoreadpc"] && await Exp.readMessages([cht.key])
          console.log(func.logMessage(is.group ? 'GROUP' : 'PRIVATE', cht.id, cht.pushName, frmtEdMsg))
        }

        /*!-======[ Block Chat ]======-!*/
		const groupDb = is.group ? Data.preferences[cht.id] : {}
	    
        if (!cfg.public && !is.owner && !is.me && !is.offline) return
        if (cfg.public === "onlygc" && !is.group) return
        if (cfg.public === "onlypc" && is.group) return

        
        let except = is.antiTagall || is.antibot
        if((is.baileys||is.mute) && !except) return

        let exps = { Exp, store, cht, is }
        let ev = new Data.EventEmitter(exps)
        Data.ev ??= ev

        if (!is.offline && !is.afk && (cht.reaction || Boolean(await ev.emit(cht.cmd)))){
          "questionCmd" in cht.memories && await func.archiveMemories.delItem(cht.sender, "questionCmd");        
          cht.reaction && await Data.reaction({ ev, ...exps });
        } else {
          await Data.In({ ev, ...exps });
        }

        /*!-======[ Chat Interactions Add ]======-!*/
        !cht.cmd && is.botMention && await func.archiveMemories.addChat(cht.sender)
        
        await func.archiveMemories.setItem(cht.sender, "name", cht.pushName)
        func.archiveMemories.setItem(cht.sender, "lastChat", Date.now())
    } catch (error) {
        console.error('Error in client.js:', error)
    }
    return
}