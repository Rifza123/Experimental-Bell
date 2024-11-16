/*!-======[ Default Export Function ]======-!*/
export default async function on({ Exp, ev, store, cht, ai, is }) {

    let { sender, id } = cht
    ev.on({ 
        cmd: Data.voices.map(a => a.toLowerCase()), //tambah voice di global.js
        listmenu: Data.voices,
        energy: 15,
        args: "Harap sertakan teks untuk diucapkan!",
        tag: "tts"
    }, async() => {
        await Exp.sendPresenceUpdate('recording', cht.id);
        let v = cht.cmd.startsWith("bell") ? "bella" : cht.cmd == "maskhanid" ? "MasKhanID" : cht.cmd
        Exp.sendMessage(id, { audio: { url: `${api.xterm.url}/api/text2speech/elevenlabs?voice=${v}&key=${api.xterm.key}&text=${cht.q}`}, mimetype: "audio/mpeg" }, { quoted: cht })
	})
   
    let txtreply = `List voice models:\n${Data.voices.join("\n")}\nContoh: _.elevenlabs prabowo|halo_`	
	ev.on({ 
        cmd: ['elevenlabs'],
        listmenu: ['elevenlabs'],
        energy: 15,
        args: txtreply,
        tag: "tts"
    }, async() => {
        let [voice,text] = cht.q.split("|")
        if(!Data.voices.includes(voice)) return cht.reply(txtreply)
        if(!text) return cht.reply(txtreply)
        await Exp.sendPresenceUpdate('recording', cht.id);
        Exp.sendMessage(id, { audio: { url: `${api.xterm.url}/api/text2speech/elevenlabs?voice=${voice}&key=${api.xterm.key}&text=${text}`}, mimetype: "audio/mpeg" }, { quoted: cht })
	})
}