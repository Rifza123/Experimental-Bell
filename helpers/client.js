/*!-======[ Module Imports ]======-!*/
const chalk = "chalk".import()

/*!-======[ Function Imports ]======-!*/
const { EventEmitter } = await "./toolkit/events.js".r()

/*!-======[ Default Export Function ]======-!*/
export default

async function client({ Exp, store, cht, is }) {
    try {
        
        if (!(cht.id in Data.preferences)) {
            Data.preferences[cht.id] = {}
        }
        if (!("ai_interactive" in Data.preferences[cht.id])) {
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
        if (global.cfg.public === false && !is.owner && !is.me) return
        if(is.baileys) return
        let exps = { Exp, store, cht, is }
        let ev = Data.ev = new EventEmitter(exps)

        if(cht.cmd){
           await ev.emit(cht.cmd)
        } else {
            await Data.In({ ev, ...exps })
        }

        /*!-======[ Chat Interactions Add ]======-!*/
        if (!cht.cmd || is.botMention) {
            await Exp.func.archiveMemories.addChat(cht.sender)
        }
        return
    } catch (error) {
        console.error('Error in client.js:', error)
        return
    }
}
