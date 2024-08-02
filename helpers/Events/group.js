/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
   const { id } = cht
    ev.on({ 
        cmd: ['group'],
        listmenu: ['group <open/close>'],
        tag: 'group',
    }, async() => {
        if(!is.group) return cht.reply("Khusus group!")
        if(!is.groupAdmins) return cht.reply("Kamu bukan admin!")
        if(!is.botAdmin) return cht.reply("Aku bukan admin :(")
        if(!cht.q) return cht.reply("open/close?")
        let typ
        if(["buka","open"].includes(cht.q)){
            typ = "not_announcement"
        } else if(["tutup","close"].includes(cht.q)){
            typ = "announcement"
        } else {
           return cht.reply("open/close?")
        }
        Exp.groupSettingUpdate(id, typ)
    })
    
    ev.on({ 
        cmd: ['kick','add'],
        listmenu: ['kick','add'],
        tag: 'group'
    }, async() => {
        if(!is.group) return cht.reply("Khusus group!")
        if(!is.groupAdmins) return cht.reply("Kamu bukan admin!")
        if(!is.botAdmin) return cht.reply("Aku bukan admin :(")
        if(cht.mention.length > 0){
            if(is.botMention && cht.cmd == "kick") return msg.reply("Saya tidak ingin keluar!")
            Exp.groupParticipantsUpdate(id, cht.mention, cht.cmd == "kick"? "remove" : "add")
        } else {
            let reply = `*Sertakan nomor/Reply/tag target yang akan ${cht.cmd} dari group!*\n\nExample: \n\n*Cara #1* => _Dengan reply pesan target_\n - ${prefix + cht.cmd} \n \n*Cara #2* => _Dengan tag target_\n - ${prefix + cht.cmd} @rifza \n \n*Cara #2* => _Dengan nomor target_\n - ${prefix + cht.cmd} +62 831-xxxx-xxxx` 
            cht.reply(reply)
        }
	})
	
	ev.on({ 
        cmd: ['getpp'],
        listmenu: ['getpp'],
        tag: 'group'
    }, async() => {
        if(cht.mention.length > 0){
            if(is.botMention && cht.cmd == "kick") return msg.reply("Saya tidak ingin keluar!") 
                Exp.sendMessage(cht.id, { image: { url: await Exp.profilePictureUrl(cht.mention[0]) }})
                .catch(e => cht.reply("Gabisa, keknya dia gapake pp"))
        } else {
            let reply = `*Sertakan nomor/Reply/tag target yang akan ambil pp nya!*\n\nExample: \n\n*Cara #1* => _Dengan reply pesan target_\n - ${prefix + cht.cmd} \n \n*Cara #2* => _Dengan tag target_\n - ${prefix + cht.cmd} @rifza \n \n*Cara #2* => _Dengan nomor target_\n - ${prefix + cht.cmd} +62 831-xxxx-xxxx` 
            cht.reply(reply)
        }
	})

}
