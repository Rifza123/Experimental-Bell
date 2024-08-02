/*!-======[ Module Imports ]======-!*/
const axios = "axios".import()
const fs = "fs".import()

/*!-======[ Functions Imports ]======-!*/
const { TelegraPh } = await (fol[0] + 'telegraph.js').r()
const { gpt } = await (fol[2] + "gpt3.js").r()
/*!-======[ Configurations ]======-!*/
let infos = cfg.menu.infos
/*!-======[ Default Export Function ]======-!*/
export default async function on({ Exp, ev, store, cht, ai, is }) {
    let { sender, id } = cht
    ev.on({ 
        cmd: ['cover','covers'],
        listmenu: ['covers `Maintenance`'],
        tag: 'voice_changer',
        energy: 7,
        args: "Sertakan modelnya!",
        media: { 
           type: ["audio"],
           msg: "Reply audionya?",
           etc: {
                seconds: 360
           }
        }
    }, async({ media }) => {
        const _key = keys[sender]
        await cht.edit('```Wait...```', _key)
        axios.post(`${api.xterm.url}/api/audioProcessing/voice-covers?model=${cht.q}&key=${api.xterm.key}`, media, {
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            responseType: 'stream'
        })
         .then(response => {
           response.data.on('data', async chunk => {
             const eventString = chunk.toString()
             const eventData = eventString.match(/data: (.+)/)
        
             if (eventData) {
                 const data = JSON.parse(eventData[1])
                 switch (data.status){
                     case 'searching':
                     case 'separating':
                     case 'starting':
                     case 'processing':
                     case 'mixing':
                         cht.edit(data.msg, _key)
                     break
                     case 'success':
                         await Exp.sendMessage(id, { audio: { url: data.result }, mimetype: "audio/mp4"}, { quoted: cht })
                         response.data.destroy()
                     break
                     case 'failed':
                         cht.edit('Failed❗️:', _key)
                         response.data.destroy() 
                     break
                 }
             }
           })
         })
         .catch(error => {
             cht.edit('Error:'+error.response ? error.response.data : error.message, _key)
         })
    })
    
    ev.on({ 
        cmd: ['lora','sdlora'],
        listmenu: ['lora'],
        tag: 'stablediffusion',
        energy: 10
    }, async() => {
    let [text1, text2] = cht.q ? cht.q.split("|") : []
    console.log({ text1, text2 })
     if (!text1 || !text2) return cht.reply(`*Perhatikan petunjuk berikut!*\n ${infos.lora}`)
        await cht.edit("Bntr...", keys[sender])
        await Exp.sendMessage(id, { image: { url: api.xterm.url + "/api/text2img/instant-lora?id="+text1+"&prompt="+text2 + "&key=" + api.xterm.key } }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['filters','filter','toanime','jadianime','jadinyata','toreal'],
        listmenu: ['toanime','filters','toreal'],
        tag: 'art',
        energy: 7,
        media: { 
           type: ["image"],
           msg: "Mana fotonya?",
           save: true
        }
    }, async({ media }) => {
        const _key = keys[sender]
        let tryng = 0
        let type = "anime2d"
        if(["filter","filters"].includes(cht.cmd)){
            if(!cht.q) return cht.reply(infos.filters)
           type = cht.q
        } else if(["jadinyata","toreal"].includes(cht.cmd)){
           type = "anime2real"
        }
        await cht.edit("Bntr...", _key)
        let tph = await TelegraPh(media)
        try{
          fs.unlinkSync(media)
            let ai = await fetch(api.xterm.url + "/api/img2img/filters?action="+ type +"&url="+tph+"&key="+api.xterm.key).then(a => a.json())
            console.log(ai)
            if(!ai.status) return cht.reply(ai?.msg || "Error!")
            while(tryng < 50){
               let s = await fetch(api.xterm.url + "/api/img2img/filters/batchProgress?id="+ai.id).then(a => a.json())
               cht.edit(s?.progress || "Prepare... ", _key)
               if(s.status == 3){
                  return Exp.sendMessage(id, { image: { url: s.url } }, { quoted: cht })                
               }
               if(s.status == 4){
                  return cht.reply("Maaf terjadi kesalhan. coba gunakan gambar lain!")
               }
               await new Promise(resolve => setTimeout(resolve, 2000))
            }
     } catch(e) {
        console.error(e)
        cht.reply(`Type-Err! :\n${e}`)
     }
	
	})
	
	ev.on({
        cmd: ['txt2img', 'text2img'],
        listmenu: ['text2img'],
        tag: 'stablediffusion',
        energy: 5
    }, async () => {
    const _key = keys[sender]
    if (!cht.q) return cht.reply(infos.txt2img)
    let [model, prompt, negative] = cht.q.split("|")
    if (!model.includes("[")) {
        return cht.reply(txt)
    }

    let ckpt = model.split("[")[0]
    let loraPart = model.split("[")[1]?.replace("]", "")
    let loras = loraPart ? JSON.parse("[" + loraPart + "]") : []

    await cht.edit('```Bntr..```', _key)

      try {
        let [checkpointsResponse, lorasResponse] = await Promise.all([
            fetch(api.xterm.url + "/api/text2img/stablediffusion/list_checkpoints"),
            fetch(api.xterm.url + "/api/text2img/stablediffusion/list_loras")
        ])

        if (!checkpointsResponse.ok || !lorasResponse.ok) {
            return cht.reply(`HTTP error! status: ${checkpointsResponse.status} or ${lorasResponse.status}`)
        }

        let [checkpoints, loraModels] = await Promise.all([
            checkpointsResponse.json(),
            lorasResponse.json()
        ])

        let lora = loras.map(c => ({
            model: loraModels[c].model,
            weight: 0.65
        }))

        let body = {
            checkpoint: checkpoints[ckpt].model,
            prompt: prompt,
            negativePrompt: negative || "",
            aspect_ratio: "3:4",
            lora: lora,
            sampling: "DPM++ 2M Karras",
            samplingSteps: 20,
            cfgScale: 7.5
        }

        console.log(body)

        let aiResponse = await fetch(`${api.xterm.url}/api/text2img/stablediffusion/createTask?key=OPSIONAL`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        if (!aiResponse.ok) {
            return cht.reply(`HTTP error! status: ${aiResponse.status}`)
        }

        let ai = await aiResponse.json()

        if (!ai.status) {
            console.log(ai)
            return cht.reply("Gagal!")
        }

        let tryng = 0
        while (tryng < 50) {
            tryng += 1

            let sResponse = await fetch(`${api.xterm.url}/api/text2img/stablediffusion/taskStatus?id=${ai.id}`)

            if (!sResponse.ok) {
                return cht.reply(`HTTP error! status: ${sResponse.status}`)
            }

            let s = await sResponse.json()

            if (s.taskStatus === 0) {
                await cht.edit('```Starting..```', _key)
            } else if (s.taskStatus === 1) {
                await cht.edit("Processing.... " + s.progress + "%", _key)
            } else if (s.taskStatus === 2) {
                return Exp.sendMessage(id, { image: { url: s.result.url }, caption: s.result.info }, { quoted: cht })
            } else if (s.taskStatus === 3) {
                return cht.reply("Maaf terjadi kesalahan. Coba gunakan gambar lain!")
            }

            await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (error) {
        console.log(error)
        cht.reply("Error: " + error.message)
      }
    })
    
    ev.on({ 
        cmd: ['lorasearch','checkpointsearch'],
        listmenu: ['lorasearch','checkpointsearch'],
        tag: 'stablediffusion',
	    energy: 1
    }, async() => {
        if(!cht.q) return cht.reply("Mau cari model apa?")
        fetch(api.xterm.url + "/api/text2img/stablediffusion/list_"+(cht.cmd == "lorasearch" ? "LORAS" : "CHECKPOINTS").toLowerCase())
            .then(async a => {
                let data = (await a.json())
                Exp.func.searchSimilarStrings(cht.q.toLowerCase(),data.map(b=> b.model), 0.3)
                    .then(async c => {
                        let txt = "*[ "+ (cht.cmd == "lorasearch" ? "LORAS" : "CHECKPOINTS") +" ]*\n"
                        txt += "- Find: `"+c.length+ "`\n"
                        txt += "_Dari total "+ data.length +" models_\n\n- ketik *.get" + (cht.cmd == "lorasearch" ? "lora" : "CHECKPOINT") + " ID* untuk melihat detail\n"
                        txt += "--------------------------------------------------------\n[ `ID` ] | `NAME`\n--------------------------------------------------------\n"
                        c.forEach(d => {
                            txt += "[ `"+ d.index + "` ] => " + d.item + "\n"
                        })
                   cht.reply(txt)
                })
            })
	})
	
	ev.on({ 
        cmd: ['getlora','getcheckpoint'],
        listmenu: ['getlora','getcheckpoint'],
        tag: 'stablediffusion',
	    energy: 1
    }, async() => {
        if(!cht.q) return cht.reply("Harap masukan id nya?")
        if(isNaN(cht.q)) return cht.reply("Id harus berupa angka!")
        fetch(api.xterm.url + "/api/text2img/stablediffusion/list_"+(cht.cmd == "getlora" ? "LORAS" : "CHECKPOINTS").toLowerCase())
            .then(async a => {
                try{ 
                    let data = await a.json()
                    Exp.sendMessage(id, { image: { url: data[cht.q].preview }, caption: data[cht.q].model }, { quoted: cht })
                } catch (e){
                    console.log(e)
                    cht.reply("Tidak ditemukan!")
                }
            })
	})
	
	ev.on({ 
        cmd: ['luma','img2video'], 
        listmenu: ['luma'],
        tag: "ai",
        energy: 185,
        media: { 
           type: ["image"],
           msg: "Mana fotonya?"
        }
    }, async({ media }) => {
        const _key = keys[sender]
        const response = await axios.post(`${api.xterm.url}/api/img2video/luma?key=${api.xterm.key}${cht?.q ? ("&prompt=" + cht.q) : ""}`, media, {
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                responseType: 'stream'
            })
             let rsp = "rfz"
            response.data.on('data', (chunk) => {
                try {
                    const eventString = chunk.toString()
                    const eventData = eventString.match(/data: (.+)/)
                    if (eventData && eventData[1]) {
                        let data
                           try {
                              data = JSON.parse(eventData[1])
                            } catch (e) {
                              console.loc(eventData[1])
                              data = {}
                            }
                        console.log(data)
                        switch (data.status) {
                            case "processing":
                                cht.edit(("Processing.... " + data.progress + "%"), _key)
                            break
                            case "failed":
                                cht.reply(data.status)
                                response.data.destroy()
                                break
                            case "completed":
                                Exp.sendMessage(id, { video: { url: data.video.url }, mimetype: "video/mp4" }, { quoted: cht })
                                response.data.destroy()
                                break
                            default:
                                console.log('Unknown status:', data)
                        }
                    }
                } catch (e) {
                    console.error('Error processing chunk:', e.message)
                    response.data.destroy()
                    cht.reply("Err!!")
                }
            })
    })
    
    ev.on({ 
        cmd: ['bard','ai'],
        tag: "ai",
        args: "Mau tanya apa?",
        listmenu: ["bard"]
    }, async() => {
        let ai = await fetch(`${api.xterm.url}/api/chat/bard?query=${encodeURIComponent(cht.q)}&key=${api.xterm.key}`)
        .then(response => response.json())
       
        cht.reply("[ BARD GOOGLE ]\n"+ai.chatUi)
	})
	
	ev.on({ 
        cmd: ['gpt','gpt3'],
        tag: "ai",
        args: "Mau tanya apa?",
        listmenu: ["gpt3"]
    }, async() => {
        let res = await gpt(cht.q)
        cht.reply("[ GPT-3 ]\n"+res.response)
	})
	
    ev.on({ 
        args: infos.bell,
        cmd: ['bell', 'autoai', 'aichat', 'ai_interactive'],
        tag: "ai",
        listmenu: ["autoai"]
    }, async () => {
        Data.preferences[id] = Data.preferences[id] || {}
        let q = cht.q
        let set = {
            "on": {
                "done": "Berhasil!, ai_interactive telah diaktifkan dalam chat ini!",
                "value": true
            },
            "off": {
                "done": "Berhasil!, ai_interactive telah dimatikan dalam chat ini!",
                "value": false
            },
            "on-group": {
                "done": "Berhasil!, ai_interactive telah diaktifkan di semua grup!",
                "owner": true,
                "for": from.group,
                "value": true
            },
            "on-private": {
                "done": "Berhasil!, ai_interactive telah diaktifkan di semua chat private!",
                "owner": true,
                "for": from.sender,
                "value": true
            },
            "off-group": {
                "done": "Berhasil!, ai_interactive telah dimatikan di semua chat group!",
                "owner": true,
                "for": from.group,
                "value": false
            },
            "off-private": {
                "done": "Berhasil!, ai_interactive telah dimatikan di semua chat private!",
                "owner": true,
                "for": from.sender,
                "value": false
            },
            "on-all": {
                "done": "Berhasil!, ai_interactive telah diaktifkan di semua chat!",
                "owner": true,
                "for": "all",
                "value": true
            },
            "off-all": {
                "done": "Berhasil!, ai_interactive telah dimatikan di semua chat!",
                "owner": true,
                "for": "all",
                "value": false
            }
        }[q]

        let alls = Object.keys(Data.preferences)
        if (!set) return cht.reply(infos.bell)
        if (set.owner && !is.owner) return cht.reply("Khusus Owner!")
        if (id.endsWith(from.group) && !(is.groupAdmins || is.owner)) return cht.reply("Khusus Admin!")

        if (set.for) {
            let $config = set.for === from.group ? "group" :
                set.for === from.sender ? "private" :
                "all"
            if ($config === "all") {
                cfg.ai_interactive.group = set.value
                cfg.ai_interactive.private = set.value
            } else {
                cfg.ai_interactive[$config] = set.value
            }
            alls = set.for === from.group ? alls.filter(a => a.endsWith(from.group)) :
                set.for === from.sender ? alls.filter(a => a.endsWith(from.sender)) :
                alls
            for (let i of alls) {
                Data.preferences[i].ai_interactive = set.value
            }
        } else {
            Data.preferences[id].ai_interactive = set.value
        }
        cht.reply(set.done)
    })
    
	ev.on({ 
        cmd: ['resetaichat','clearsesichat'],
        tag: "ai",
        listmenu: ["resetaichat"]
    }, async() => {
        let ai = await fetch(`${api.xterm.url}/api/chat/logic-bell/reset?id=${cht.sender}&key=${api.xterm.key}`)
        .then(response => response.json())
        cht.reply(ai.msg)
	})
	
	ev.on({ 
        cmd: ['animediff'],
        listmenu: ['animediff'],
        tag: 'ai',
        args: "*Harap beri deskripsi gambarnya!*",
        energy: 10
    }, async() => {
    let [text1, text2] = cht.q ? cht.q.split("|") : []
        await cht.edit("Bntr...", keys[sender])
        await Exp.sendMessage(id, { image: { url: api.xterm.url + "/api/text2img/animediff?prompt="+text1 + "&key=" + api.xterm.key + ( text2 ? "&prompt="+text2 : "") } }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['dalle3'],
        listmenu: ['dalle3'],
        tag: 'ai',
        args: "*Harap beri deskripsi gambarnya!*",
        energy: 10
    }, async() => {
    let [text1, text2] = cht.q ? cht.q.split("|") : []
        await cht.edit("Bntr...", keys[sender])
        await Exp.sendMessage(id, { image: { url: api.xterm.url + "/api/text2img/dalle3?prompt="+text1 + "&key=" + api.xterm.key + ( text2 ? "&prompt="+text2 : "") } }, { quoted: cht })
	})
	
}