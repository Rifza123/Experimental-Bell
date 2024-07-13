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
          if(t2 == "on"){
             if(global.cfg.public) return cht.reply("Maaf, bot sudah dalam mode public!")
             global.cfg.public = !0
             return cht.reply("Sukses merubah mode menjadi *public!*")
          } else if(t2 == "off") {
              if(!global.cfg.public) return cht.reply("Maaf, bot sudah dalam mode self")
              global.cfg.public = !1
              return cht.reply("Sukses merubah mode menjadi *self!*")
          } else {
              cht.reply("on/off ?")
          }
       } else if(t1 == "bell"){
          if(t2 == "on"){
             if(global.cfg.ai_interactive) return cht.reply("Maaf, bella sudh dalam mode on!")
             global.cfg.ai_interactive = !0
             return cht.reply("Sukses mengaktifkan auto response bella")
          } else if(t2 == "off"){
              if(!global.cfg.ai_interactive) return cht.reply("Maaf, bella sudh dalam mode off")
              global.cfg.ai_interactive = !1
              return cht.reply("Sukses menonaktifkan auto response bella")
          } else {
              cht.reply("on/off ?")
          }
       } else if(t1 == "autotyping"){
          if(t2 == "on"){
             if(global.cfg.autotyping) return cht.reply("Maaf, autotyping sudah mode on!")
             global.cfg.autotyping = !0
             return cht.reply("Sukses mengaktifkan auto typing")
          } else if(t2 == "off"){
              if(!global.cfg.autotyping) return cht.reply("Maaf, autotyping dalam mode off")
              global.cfg.autotyping = !1
              return cht.reply("Sukses menonaktifkan autotyping")
          } else {
              cht.reply("on/off ?")
          }
       } else if(t1 == "autoreadsw"){
          if(t2 == "on"){
             if(global.cfg.autoreadsw) return cht.reply("Maaf, autoreadsw sudah mode on!")
             global.cfg.autoreadsw = !0
             return cht.reply("Sukses mengaktifkan auto read sw")
          } else if(t2 == "off"){
              if(!global.cfg.autoreadsw) return cht.reply("Maaf, autoreadsw dalam mode off")
              global.cfg.autoreadsw = !1
              return cht.reply("Sukses menonaktifkan autoreadsw")
          } else {
              cht.reply("on/off ?")
          }
       }
    })

}
