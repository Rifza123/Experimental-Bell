let infos = Data.infos



/*!-======[ Default Export Function ]======-!*/
export default 
async function on({ Exp, ev, store, cht, ai, is }) {
  let helps = {
    "menambah energy": infos.about?.energy,
    "mengurangi energy": infos.about?.energy,
    "menambah premium": infos.owner?.premium_add,
    "mengurangi premium": infos.owner?.premium_add,
    "txt2img stablediffusion": infos.about?.stablediffusion,
    "antilink": infos.about?.antilink,
    "memblokir atau membanned user": infos.owner.banned,
    "mengatur logic ai profile": infos.owner?.setLogic,
    "cara menggunakan faceswap": infos.ai.faceSwap(cht)
  }
 
    const { func } = Exp
    ev.on({ 
        cmd: ['help','guide','panduan','cara'],
        listmenu: ['help','guide','cara']
    }, async({ args }) => {
       let hkeys = Object.keys(helps)
       if(!args) {
         func.archiveMemories.setItem(cht.sender, "questionCmd", { 
            emit: `${cht.cmd}`,
            exp: Date.now() + 60000,
            accepts: []
          })
         return cht.reply(infos.about.help)
       }
       if(args == "list") return cht.replyWithTag(infos.about.helpList, { keys: `- ${hkeys.join("\n- ")}` })
       let shelps = await func.searchSimilarStrings(args, hkeys, 0.05)
       let top = (func.getTopSimilar(shelps)).item
       let findhelps = await func.searchSimilarStrings(args, hkeys, 0.2)
       let find = (func.getTopSimilar(findhelps)).item
       if(findhelps.length < 1) return cht.replyWithTag(infos.about.helpNotfound, { top: `- ${top}` })
     cht.reply(helps[find])
    })
  
}