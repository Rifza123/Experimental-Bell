/*!-======[ Module Imports ]======-!*/
const fs = "fs".import();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {

    ev.on({ 
        cmd: ['group'],
        listmenu: ['group <open/close>'],
        tag: 'group',
    }, async() => {
        if(!is.group) return cht.reply("Khusus group!")
        if(!is.groupAdmins) return cht.reply("Kamu bukan admin!")
        if(!is.botAdmin) return cht.reply("Aku bukan admin :(")
        if(!cht.q) return cht.reply("open/close?")
        let typ;
        if(["buka","open"].includes(cht.q)){
            typ = "not_announcement"
        } else if(["tutup","close"].includes(cht.q)){
            typ = "announcement"
        } else {
           return cht.reply("open/close?")
        }
        Exp.groupSettingUpdate(cht.id, typ)
    })
    
    ev.on({ 
        cmd: ['kick'],
        listmenu: ['kick'],
        tag: 'group'
    }, async() => {
        if(!is.group) return cht.reply("Khusus group!")
        if(!is.groupAdmins) return cht.reply("Kamu bukan admin!")
        if(!is.botAdmin) return cht.reply("Aku bukan admin :(")
        if(cht.mention){
            if(is.botMention) return msg.reply("Saya tidak ingin keluar!")
            Exp.groupParticipantsUpdate(cht.id, cht.mention, "remove")
        } else {
            let reply = `*Reply/tag target yang akan dikeluaran dari group!*\n\nExample: \n\n*Cara #1* => _Dengan reply pesan target_\n - ${order} \n \n*Cara #2* => _Dengan tag target_\n - ${order} @exports.rifza` 
            cht.reply(reply)
        }
	})

}
