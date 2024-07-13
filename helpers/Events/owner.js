/*!-======[ Module Imports ]======-!*/
const fs = "fs".import();

/*!-======[ Configurations ]======-!*/
let infos = cfg.menu.infos;

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {

    ev.on({ 
        cmd: ['set'], 
        listmenu: ['set'],
        tag: "owner"
    }, () => {
       if(!is.owner) return cht.reply("Maaf, males nanggepin")
       if(!cht.q) return cht.reply(infos.set)
       let t1 = cht.q.split(" ")[0]
       let t2 = cht.q.split(" ")[1]
       if(t1 == "public"){
          if(t2 == "true"){
             if(global.cfg.public) return cht.reply("Maaf, bot sudah dalam mode public!")
             global.cfg.public = !0
             return cht.reply("Sukses merubah mode menjadi *public!*")
          } else {
              if(!global.cfg.public) return cht.reply("Maaf, bot sudah dalam mode self")
              global.cfg.public = !1
              return cht.reply("Sukses merubah mode menjadi *self!*")
          }
       }
    })

}
