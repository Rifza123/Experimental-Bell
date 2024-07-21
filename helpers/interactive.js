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
		let dangerous = cht.msg.slice(2)
		if(dangerous.trim().replace(/[ ]/g, "") == "rm-rf*") return cht.reply("Hah?")
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
            let config = _ai.data
            console.log(config)
            await Exp.func.addAiResponse()
            let noreply = false
            switch (config?.cmd) {
                case 'public':
                if(!is.owner) return cht.reply("Maaf, males nanggepin")
                    global.cfg.public = !0
                    return cht.reply("Berhasil mengubah mode menjadi public!")
                 break;
                case 'self':
                if(!is.owner) return cht.reply("Maaf, males nanggepin")
                    global.cfg.public = !1
                    await cht.reply("Berhasil mengubah mode menjadi self!")
                 break;
                 case 'voice':
                   await Exp.sendPresenceUpdate('recording', cht.id);
                   return Exp.sendMessage(cht.id, { audio: { url: `${api.xterm.url}/api/text2speech/bella?key=${api.xterm.key}&text=${config?.msg}`}, mimetype: "audio/mpeg", ptt: true }, { quoted: cht })
                 break;
                 case 'tiktok':
                 case 'pinterestdl':
                 case 'menu':
                    noreply = true
                    is.url = [config?.cfg?.url ?? ""]
                    await cht.reply(config?.msg ?? "ok")
                    return ev.emit(config?.cmd)
                 break;
                 
                 case 'ytm4a':
                 case 'ytmp4':
                    noreply = true
                    cht.cmd = config?.cmd
                    is.url = [config?.cfg.url]
                    await cht.reply(config?.msg ?? "ok")
                    return ev.emit(config?.cmd)
                 break;
                 case 'lora':
                    noreply = true
                    cht.q = "18|"+config?.cfg.prompt
                    await cht.reply(config?.msg ?? "ok")
                    return ev.emit(config?.cmd)
                 break;
                 case 'pinterest':
                    noreply = true
                    await cht.reply(config?.msg ?? "ok")
                    cht.q = config?.cfg.query
                    return ev.emit(config?.cmd)
                 break;
                 case 'closegroup':
                    noreply = true
                    cht.q = "close"
                    return ev.emit("group")
                 break;
                 case 'opengroup':
                    noreply = true
                    cht.q = "open"
                    return ev.emit("group")
                 break;
            }
            
            if(config?.energy){
                let conf = {}
                    conf.energy = /[+-]/.test(`${config?.energy}`) ? `${config?.energy}` : `+${config?.energy}`
                if(conf.energy.startsWith("-")){
                    conf.action = "reduceEnergy"
                } else {
                    conf.action = "addEnergy"
                }
                await Exp.func.archiveMemories[conf.action](cht.sender, parseInt(conf.energy.slice(1)))
                await cht.reply(config?.energy + " Energy⚡️")
                config.energyreply = true
            }
            if (config?.cmd !== "voice" && !noreply) {
                config?.msg && await cht[config?.energyreply ? "edit" : "reply"](config?.msg, key[cht.sender])
            }
        } catch (error) {
            console.error("Error parsing AI response:", error);
           // cht.reply(`Males ah`)
        }
	}
	
	
}