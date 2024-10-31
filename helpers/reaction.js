let urls = {
  "tiktok": "tiktok",
  "youtu": "youtube",
  "instagram": "instagram",
  "fb.watch": "facebook",
  "facebook": "facebook",
  "pin.it": "pinterest",
  "pinterest": "pinterest"
}
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
	           if(mention !== Exp.number && !is.groupAdmins && !is.owner) return cht.reply("Manghapus pesan menggunakan react khusus hanya untuk admin jika target bukan pesan yang saya kirimkan")
    		   return cht.reaction.delete()

		   case "🎵":
		   case "🎶":
		   case "🎧":
		   case "▶️":
		       if(!text) return cht.reply("Untuk melakukan play youtube menggunakan react, harao beri react kepada pesan yang berisi teks")
		       cht.q = text
		       return ev.emit("play")
		   
		   case "📥":
		   case "⬇️":
		       if(!urltype) return cht.reply(`Saat ini kami belum bisa mengunduh url ${_url}\nList yang didukung:\n- ${[...new Set(Object.values(urls))].join("\n -")}`)
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
		       cht.cmd = "bella"
		       cht.q = text
		       return ev.emit(cht.cmd)
		   
		   case "🖨️":
		   case "🖼️":
		   case "🤳":
		       if(mtype == "sticker") return ev.emit("toimg")
		       return ev.emit("s")
		   
		   case "🌐":
		   case "🆔":
		       if(!text) return cht.reply(`Harap beri reaksi ${emoji} ke pesan teks untuk menerjemahkan ke bahasa indonesia`)
		       cht.q = "Terjemahkan ke bahasa indonesia\n\n" + text
		       return ev.emit("gpt")
		   
		   case "🔗":
		   case "📎":
		   case "🏷️":
		       return ev.emit("tourl")
	    }
	} catch (error) {
		console.error("Error in reaction.js:", error)
	}
}