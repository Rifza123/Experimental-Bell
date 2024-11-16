let urls = {
  "tiktok": "tiktok",
  "youtu": "youtube",
  "instagram": "instagram",
  "fb.watch": "facebook",
  "facebook": "facebook",
  "pin.it": "pinterest",
  "pinterest": "pinterest"
}
let infos = Data.infos

export default
async function react({ cht, Exp, store, is, ev }) {
    let { emoji, mtype, text, url, mention } = cht.reaction
    let _url = url[0]
    let urltype = _url && Object.entries(urls).find(([keyword]) => _url.includes(keyword))
      ? urls[Object.entries(urls).find(([keyword]) => _url.includes(keyword))[0]]
      : null
	try {
	    switch(emoji){
	       case "🗑":
	       case "❌":
	           if(mention !== Exp.number && !is.groupAdmins && !is.owner) return cht.reply(infos.reaction.download)
    		   return cht.reaction.delete()

		   case "🎵":
		   case "🎶":
		   case "🎧":
		   case "▶️":
		       if(!text) return cht.reply(infos.reaction.play)
		       cht.q = text
		       return ev.emit("play")
		   
		   case "📥":
		   case "⬇️":
		       if(!urltype) return cht.reply(Exp.func.tagReplacer(infos.reaction.download, { url:_url, listurl:[...new Set(Object.values(urls))].join("\n- ") }))
		       is.url = url
		       cht.q = _url
		       let cmd = urltype == "youtube" ? "play" : urltype + "dl"
		       return ev.emit(cmd)
		   
		   case "🔎":
	       case "🔍":
    	       cht.q = text
		       return ev.emit("ai")
		   
		   case "📸":
		   case "📷":
		       is.url = url
		       return ev.emit("ss")
		   
		   case "🔈":
		   case "🔉":
		   case "🔊":
		   case "🎙️":
		   case "🎤":
		       cht.cmd = cfg.ai_voice || "bella"
		       cht.q = text
		       return ev.emit(cht.cmd)
		   
		   case "🖨️":
		   case "🖼️":
		   case "🤳":
		       if(mtype == "sticker") return ev.emit("toimg")
		       return ev.emit("s")
		   
		   case "🌐":
		   case "🆔":
		       if(!text) return cht.reply(Exp.func.tagReplacer(infos.reaction.translate, { emoji }))
		       cht.q = "Terjemahkan ke bahasa indonesia\n\n" + text
		       return ev.emit("gpt")
		   
		   case "🔗":
		   case "📎":
		   case "🏷️":
		       return ev.emit("tourl")
		   
		   case "📋":
		       return ev.emit("menu")
		   case "🦶":
		   case "🦵":
		       cht.mention = [mention]
		       cht.cmd = "kick"
		       ev.emit("kick")
		       return 
	    }
	} catch (error) {
		console.error("Error in reaction.js:", error)
	}
}