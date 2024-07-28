/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Configurations ]======-!*/
let infos = cfg.menu.infos

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
   const { id } = cht
    const modes = {
        public: 'mode public',
        autotyping: 'auto typing',
        autoreadsw: 'auto read sw',
        autoreadpc: 'auto read pc',
        autoreadgc: 'auto read group'
    }

    ev.on({ 
        cmd: ['set'], 
        listmenu: ['set'],
        tag: "owner"
    }, () => {
        if (!is.owner) return cht.reply("Maaf, males nanggepin")
        if (!cht.q) return cht.reply(infos.set)

        const [t1, t2] = cht.q.split(" ")
        const mode = modes[t1]

        if (!mode) return

        if (t2 === "on") {
            if (global.cfg[t1]) return cht.reply(`Maaf, ${mode} sudah dalam mode on!`)
            global.cfg[t1] = true
            return cht.reply(`Sukses mengaktifkan ${mode}`)
        } else if (t2 === "off") {
            if (!global.cfg[t1]) return cht.reply(`Maaf, ${mode} sudah dalam mode off!`)
            global.cfg[t1] = false
            return cht.reply(`Sukses menonaktifkan ${mode}`)
        } else {
            cht.reply("on/off ?")
        }
    })
}