const {
	exec
} = await "child".import()
const util = await "util".import()
const _exec = util.promisify(exec);
const fs = "fs".import()
const moment = "timezone".import()
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
const { transcribe } = await (fol[2] + 'transcribe.js').r()

export default 
async function In({ cht, Exp, store, ev, ai, is }) {
    let isMsg = !is.cmd && !is.me && !is.baileys
    let isEval = cht.msg.startsWith('>')
    let isEvalSync = cht.msg.startsWith('=>')
    let isExec = cht.msg.startsWith('$')
    let isBella = isMsg && cfg.ai_interactive && !is.document && !is.sticker && (
        (cht.msg.toLowerCase().startsWith(botnickname.toLowerCase().slice(0, botnickname.length - 1)) && !cht.me) || 
        cht.msg.toLowerCase().startsWith(botnickname.toLowerCase()) || 
        is.botMention ||
        !is.group ||
        (is.owner && cht.msg.toLowerCase().startsWith(botnickname.toLowerCase().slice(0, botnickname.length - 1)) && !cht.me) || 
        (is.owner && is.botMention)
    )

	if (isEvalSync) {
		if (!is.owner) return
		try {
		    let evsync = await eval(`(async () => { ${cht.msg.slice(3)} })()`)
		    if (typeof evsync !== 'string') evsync = await util.inspect(evsync)
			cht.reply(evsync)
		} catch (e) {
			cht.reply(String(e))
		}
	}
	else if (isEval) {
		if (!is.owner) return
		try {
			let evaled = await eval(cht.msg.slice(2))
			if (typeof evaled !== 'string') evaled = await util.inspect(evaled)
			if(evaled !== "undefined") { cht.reply(evaled) }
		} catch (err) {
			cht.reply(String(err))
		}
	}
	else if (isExec) {
		if (!is.owner) return
		if(cht.msg.slice(2).includes("rm -rf *")) return cht.reply("Mau hapus aku? jahat bgt anjg!😡")
		let txt;
		try {
            const { stdout, stderr } = await _exec(cht.msg.slice(2));
            txt = stdout || stderr;
        } catch (error) {
            txt = `Error: ${error}`
        }
		console.log(txt)
		cht.reply(txt)
	}
	
	else if (isBella) {
        let chat = cht.msg.startsWith(botnickname.toLowerCase()) ? cht.msg.slice(botnickname.length) : cht.msg
        if(cht.type == "audio") {
            try{
                chat = (await transcribe(await cht.download())).text
            } catch { 
                chat = ""
            }
        }
	    console.log(chat)
	    try {
	        let _ai = await ai({ 
               text: chat,
               id: cht.sender, 
               fullainame: botfullname,
               nickainame: botnickname, 
               senderName: cht.pushName, 
               ownerName: ownername,
               date: Exp.func.newDate(),
               role: cht.memories.role,
               msgtype: cht.type,
               _logic: false
            })
            let cfg = _ai.data
            console.log(cfg)
            let noreply = false
            switch (cfg.cmd) {
                case 'public':
                if(!is.owner) return cht.reply("Maaf, males nanggepin")
                    global.cfg.public = !0
                    cht.reply("Berhasil mengubah mode menjadi public!")
                 break;
                case 'self':
                if(!is.owner) return cht.reply("Maaf, males nanggepin")
                    global.cfg.public = !1
                    cht.reply("Berhasil mengubah mode menjadi self!")
                 break;
                 case 'voice':
                        await Exp.sendPresenceUpdate('recording', cht.id);
                        await Exp.sendMessage(cht.id, { audio: { url: `${api.xterm.url}/api/text2speech/bella?key=${api.xterm.key}&text=${cfg.msg}`}, mimetype: "audio/mpeg", ptt: true }, { quoted: cht })
                 break;
                 case 'tiktok':
                 case 'pinterestdl':
                 case 'menu':
                    noreply = true
                    is.url = [cfg?.cfg?.url ?? ""]
                    await cht.reply(cfg?.msg ?? "ok")
                    ev.emit(cfg.cmd)
                 break;
                 
                 case 'ytm4a':
                 case 'ytmp4':
                    noreply = true
                    cht.cmd = cfg.cmd
                    is.url = [cfg.cfg.url]
                    await cht.reply(cfg.msg ?? "ok")
                    ev.emit(cfg.cmd)
                 break;
                 case 'lora':
                    noreply = true
                    cht.q = "18|"+cfg.cfg.prompt
                    await cht.reply(cfg.msg ?? "ok")
                    await new Promise(resolve => setTimeout(resolve, 300));
                    ev.emit(cfg.cmd)
                 break;
                 case 'pinterest':
                    noreply = true
                    await cht.reply(cfg?.msg ?? "ok")
                    cht.q = cfg.cfg.query
                    ev.emit(cfg.cmd)
                 break;
                 case 'closegroup':
                    noreply = true
                    cht.q = "close"
                    ev.emit("group")
                 break;
                 case 'opengroup':
                    noreply = true
                    cht.q = "open"
                    await new Promise(resolve => setTimeout(resolve, 200));
                    ev.emit("group")
                 break;
            }
            
            if(cfg.energy){
                let conf = {}
                    conf.energy = /[+-]/.test(`${cfg.energy}`) ? `${cfg.energy}` : `+${cfg.energy}`
                if(conf.energy.startsWith("-")){
                    conf.action = "reduceEnergy"
                } else {
                    conf.action = "addEnergy"
                }
                await Exp.func.archiveMemories[conf.action](cht.sender, parseInt(conf.energy.slice(1)))
                await cht.reply(cfg.energy + " Energy⚡️")
                cfg.energyreply = true
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            if (cfg.cmd !== "voice" && !noreply) {
                cfg.msg && await cht[cfg.energyreply ? "edit" : "reply"](cfg.msg, key[cht.sender])
            }
        } catch (error) {
            console.error("Error parsing AI response:", error);
           // cht.reply(`Males ah`)
        }
	}
	
	function logic(){
	    return fs.readFileSync(fol[3] + "logic.txt", "utf8")
	}
}