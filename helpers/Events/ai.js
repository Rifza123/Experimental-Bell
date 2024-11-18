/*!-======[ Module Imports ]======-!*/
const axios = "axios".import()
const fs = "fs".import()

/*!-======[ Functions Imports ]======-!*/
const { gpt } = await (fol[2] + "gpt3.js").r()
const { GeminiImage } = await (fol[2] + "gemini.js").r()
const { tmpFiles } = await (fol[0] + 'tmpfiles.js').r()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ Exp, ev, store, cht, ai, is }) {
    let infos = Data.infos
    let { sender, id } = cht
    const { func } = Exp
    ev.on({ 
        cmd: ['cover','covers'],
        listmenu: ['covers'],
        tag: 'voice_changer',
        energy: 70,
        premium: true,
        args: "Sertakan modelnya!",
        media: { 
           type: ["audio"],
           etc: {
                seconds: 360
           }
        }
    }, async({ media }) => {
        const _key = keys[sender]
        await cht.edit(infos.messages.wait, _key)
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
                         data.msg && cht.edit(data.msg, _key)
                     break
                     case 'success':
                         await Exp.sendMessage(id, { audio: { url: data.result }, mimetype: "audio/mp4"}, { quoted: cht })
                         response.data.destroy()
                     break
                     case 'failed':
                         cht.edit(infos.messages.failed, _key)
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
     if (!text1 || !text2) return cht.reply(`${infos.ai.payInstruction}\n ${infos.ai.lora}`)
        await cht.edit(infos.messages.wait, keys[sender])
        await Exp.sendMessage(id, { image: { url: api.xterm.url + "/api/text2img/instant-lora?id="+text1+"&prompt="+text2 + "&key=" + api.xterm.key }, caption: infos.ai.lora_models[parseInt(text1) - 1]}, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['imglarger','enlarger','enlarge','filters','filter','toanime','jadianime','jadinyata','toreal'],
        listmenu: ['toanime','filters','toreal'],
        tag: 'art',
        premium: true,
        energy: 50,
        media: { 
           type: ["image"],
           save: false
        }
    }, async({ media }) => {
        const _key = keys[sender]
        let tryng = 0
        let type = "anime2d"
        if(["filter","filters"].includes(cht.cmd)){
            if(!cht.q) return cht.reply(infos.ai.filters)
           type = cht.q
        } else if(["jadinyata","toreal"].includes(cht.cmd)){
           type = "anime2real"
        } else if(['imglarger','enlarger','enlarge'].includes(cht.cmd)){
           type = "enlarger"
        }
        await cht.edit(infos.messages.wait, _key)
        let tph = await tmpFiles(media)
        try{
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
                  return cht.reply(infos.ai.failTryImage)
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
        energy: 35,
        premium: false
    }, async () => {
    const _key = keys[sender]
    if (!cht.q) return cht.reply(infos.ai.txt2img)
    let [model, prompt, negative] = cht.q.split("|")
    if (!model.includes("[")) {
        return cht.reply(infos.ai.txt2img)
    }

    let ckpt = model.split("[")[0]
    let loraPart = model.split("[")[1]?.replace("]", "")
    let loras = loraPart ? JSON.parse("[" + loraPart + "]") : []

    await cht.edit(infos.messages.wait, _key)

      try {
        let [checkpointsResponse, lorasResponse] = await Promise.all([
            fetch(api.xterm.url + "/api/text2img/stablediffusion/list_checkpoints?key="+api.xterm.key),
            fetch(api.xterm.url + "/api/text2img/stablediffusion/list_loras?key="+api.xterm.key)
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

        let aiResponse = await fetch(`${api.xterm.url}/api/text2img/stablediffusion/createTask?key=${api.xterm.key}`, {
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
            return cht.reply(infos.messages.failed)
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
                return Exp.sendMessage(id, { image: { url: s.result.url } }, { quoted: cht })
            } else if (s.taskStatus === 3) {
                return cht.reply(infos.ai.failTryImage)
            }

            await new Promise(resolve => setTimeout(resolve, 2500))
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
	    energy: 3
    }, async() => {
        if(!cht.q) return cht.reply("Mau cari model apa?")
        fetch(`${api.xterm.url}/api/text2img/stablediffusion/list_${cht.cmd == "lorasearch" ? "loras" : "checkpoints"}?key=${api.xterm.key}`)
            .then(async a => {
                let data = (await a.json())
                func.searchSimilarStrings(cht.q.toLowerCase(),data.map(b=> b.model), 0.3)
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
	    energy: 3
    }, async() => {
        if(!cht.q) return cht.reply("Harap masukan id nya!")
        if(isNaN(cht.q)) return cht.reply("Id harus berupa angka!")
        fetch(`${api.xterm.url}/api/text2img/stablediffusion/list_${cht.cmd == "getlora" ? "loras" : "checkpoints"}?key=${api.xterm.key}`)
            .then(async a => {
                try{ 
                    let data = await a.json()
                    Exp.sendMessage(id, { image: { url: `${data[cht.q].preview}&key=${api.xterm.key}` }, caption: data[cht.q].model }, { quoted: cht })
                } catch (e){
                    console.log(e)
                    cht.reply(infos.ai.notfound)
                }
            })
	})
	
	ev.on({ 
        cmd: ['luma','img2video'], 
        listmenu: ['luma'],
        tag: "ai",
        energy: 185,
        premium: true,
        media: { 
           type: ["image"]
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
        args: infos.ai.isQuery,
        listmenu: ["bard"],
        energy: 7
    }, async() => {
        let ai = await fetch(`${api.xterm.url}/api/chat/bard?query=${encodeURIComponent(cht.q)}&key=${api.xterm.key}`)
        .then(response => response.json())
       
        cht.reply("[ BARD GOOGLE ]\n"+ai.chatUi)
	})
	
	ev.on({ 
        cmd: ['gpt','gpt3'],
        tag: "ai",
        args: infos.ai.isQuery,
        listmenu: ["gpt3"],
        energy: 7
    }, async() => {
        let res = await gpt(cht.q)
        cht.reply("[ GPT-3 ]\n"+res.response)
	})
	
    ev.on({ 
        cmd: ['bell', 'autoai', 'aichat', 'ai_interactive'],
        tag: "ai",
        listmenu: ["autoai"]
    }, async () => {
        function sendAiInfo(){
          Exp.sendMessage(id, {
            text: infos.ai.bell,
            contextInfo: { 
                externalAdReply: {
                    title: cht.pushName,
                    body: "Artificial Intelligence, The beginning of the robot era",
                    thumbnailUrl: "https://telegra.ph/file/e072d1b7d5fe75221a36c.jpg",
                    sourceUrl: "https://github.com/Rifza123",
                    mediaUrl: `http://ẉa.me/6283110928302/9992828`,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                    mediaType: 1,
                }
            }
          }, { quoted: cht })
        }
        if(!cht.q) return sendAiInfo()
        Data.preferences[id] = Data.preferences[id] || {}
        let q = cht.q
        let set = {
            "on": {
                "done": infos.ai.interactiveOn,
                "value": true
            },
            "off": {
                "done": infos.ai.interactiveOff,
                "value": false
            },
            "on-group": {
                "done": infos.ai.interactiveOnGroup,
                "owner": true,
                "for": from.group,
                "value": true
            },
            "on-private": {
                "done": infos.ai.interactiveOnPrivate,
                "owner": true,
                "for": from.sender,
                "value": true
            },
            "off-group": {
                "done": infos.ai.interactiveOffGroup,
                "owner": true,
                "for": from.group,
                "value": false
            },
            "off-private": {
                "done": infos.ai.interactiveOffPrivate,
                "owner": true,
                "for": from.sender,
                "value": false
            },
            "on-all": {
                "done": infos.ai.interactiveOnAll,
                "owner": true,
                "for": "all",
                "value": true
            },
            "off-all": {
                "done": infos.ai.interactiveOffAll,
                "owner": true,
                "for": "all",
                "value": false
            },
            "on-energy": {
                "done": infos.ai.interactiveOnEnergy,
                "owner": true,
                "type": "energy",
                "value": true
            },
            "off-energy": {
                "done": infos.ai.interactiveOffEnergy,
                "owner": true,
                "type": "energy",
                "value": false
            }
        }[q]

        let alls = Object.keys(Data.preferences)
        if (!set) return sendAiInfo()
        if (set.owner && !is.owner) return cht.reply(infos.messages.isOwner)
        if (id.endsWith(from.group) && !(is.groupAdmins || is.owner)) return cht.reply(infos.messages.isAdmin)

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
        } else if(set.type == "energy"){
            cfg.ai_interactive.energy = set.value
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
        tag: 'stablediffusion',
        args: infos.ai.isPrompt,
        energy: 17
    }, async() => {
    let [text1, text2] = cht.q ? cht.q.split("|") : []
        await cht.edit(infos.messages.wait, keys[sender])
        await Exp.sendMessage(id, { image: { url: api.xterm.url + "/api/text2img/animediff?prompt="+text1 + "&key=" + api.xterm.key + ( text2 ? "&prompt="+text2 : "") } }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['dalle3'],
        listmenu: ['dalle3'],
        tag: 'art',
        args: infos.ai.isPrompt,
        energy: 17,
        badword: true
    }, async() => {
    let [text1, text2] = cht.q ? cht.q.split("|") : []
        await cht.edit(infos.messages.wait, keys[sender])
        await Exp.sendMessage(id, { image: { url: api.xterm.url + "/api/text2img/dalle3?prompt="+text1 + "&key=" + api.xterm.key + ( text2 ? "&prompt="+text2 : "") } }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['geminiimage','geminiimg'], 
        listmenu: ['geminiimage'],
        tag: "ai",
        energy: 20,
        args: infos.ai.isQuery,
        media: { 
           type: ["image"]
        }
    }, async({ media }) => {
        let res = await GeminiImage(media, cht.q)
        cht.reply(res)
    })
	
	ev.on({ 
        cmd: ['songai','songgenerator'],
        listmenu: ['songgenerator'],
        tag: 'ai',
        energy: 70,
        premium: true,
        args: infos.ai.prompt
    }, async({ media }) => {
        const _key = keys[sender]
        const prompt = cht.q
        await cht.edit(infos.messages.wait, _key)
        axios({
                method: 'post',
                url: `${api.xterm.url}/api/audioProcessing/song-generator`,  
                params: { prompt, key: api.xterm.key },
                responseType: 'stream'
         })
         .then(response => {
           response.data.on('data', async chunk => {
             const eventString = chunk.toString()
             const eventData = eventString.match(/data: (.+)/)
        
             if (eventData) {
                 const data = JSON.parse(eventData[1])
                 switch (data.status){
                     case 'queueing':
                     case 'generating':
                         cht.edit(data.msg, _key)
                     break
                     case 'success':
                       const audio = {
                         text: data.result.lyrics,
                         contextInfo: { 
                             externalAdReply: {
                                 title: prompt,
                                 body: data.result.tags,
                                 thumbnailUrl: data.result.imageUrl,
                                 sourceUrl: "https://github.com/Rifza123",
                                 mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 100000000000000000)}`,
                                 renderLargerThumbnail: true,
                                 showAdAttribution: true,
                                 mediaType: 1,
                             },
                             forwardingScore: 999,
                             isForwarded: true,
                             forwardedNewsletterMessageInfo: {
                                 newsletterJid: "120363301254798220@newsletter",
                                 serverMessageId: 152
                             }
                         }
                       }
                       await Exp.sendMessage(id, audio, { quoted: cht })
                       await Exp.sendMessage(id, { audio: { url: data.result.audioUrl }, mimetype:"audio/mp4" }, { quoted: cht })
                       response.data.destroy()
                     break
                     case 'failed':
                         cht.edit(infos.messages.failed, _key)
                         response.data.destroy() 
                     break
                 }
             }
           })
         })
         .catch(error => {
             console.log(error)
             cht.edit('Error:'+error.response ? error.response.data : error.message, _key)
         })
    })
    
    ev.on({ 
        cmd: ['faceswap'],
        listmenu: ['faceswap'],
        tag: 'ai',
        energy: 25,
        premium: true,
        media: { 
           type: ["image"],
           msg: infos.ai.faceSwap(cht),
           save: false
        }
    }, async({ media }) => { 
        const _key = keys[sender]
        let face;
        let target;
        if ((is.image && !is.quoted?.image) || (is.quoted?.image && !is.image) || !Boolean(cht.cmd) ){
            let usr = cht.sender.split("@")[0]
            let swps = func.archiveMemories.getItem(cht.sender, "fswaps")
            if(swps.list.length < 1){
               swps.list.push(await tmpFiles(media))
               swps.last = Date.now()
               func.archiveMemories.setItem(cht.sender, "fswaps", swps)
               func.handleSessionExpiry({ usr, cht, session:cht.cmd, time: 600000 })
               return cht.reply(infos.ai.startedFaceswap)
            }
            if(swps.list.length >= 1){
               swps.list[1] = await tmpFiles(media)
               swps.last = Date.now()
               console.log(swps.list[1])
               func.archiveMemories.setItem(cht.sender, "fswaps", swps)
            }
            func.handleSessionExpiry({ usr, cht, session:cht.cmd, time: 600000 })
          
          target = swps?.list?.[0]
          face = swps?.list?.[1]
        } else {
          target = await tmpFiles(media)
          face = is.url?.[0] ? is.url[0] : is?.image ? await tmpFiles(await cht.download()) : false
        }
        await cht.edit(infos.messages.wait, _key)
        axios({
                method: 'post',
                url: `${api.xterm.url}/api/img2img/faceswap`,
                params: { face, target, key:api.xterm.key },
                responseType: 'stream'
            })
         .then(response => {
           response.data.on('data', async chunk => {
             const eventString = chunk.toString()
             const eventData = eventString.match(/data: (.+)/)
        
             if (eventData) {
                 const data = JSON.parse(eventData[1])
                 switch (data.status){
                     case 'queueing':
                     case 'generating':
                         cht.edit(data.msg, _key)
                     break
                     case 'success':
                       await Exp.sendMessage(id, { image: { url: data.result } }, { quoted: cht })
                       response.data.destroy()
                     break
                     case 'failed':
                         cht.edit(infos.messages.failed, _key)
                         response.data.destroy() 
                     break
                 }
             }
           })
         })
         .catch(error => {
             console.log(error)
             cht.edit('Error:'+error.response ? error.response.data : error.message, _key)
         })
    })
    
    ev.on({ 
        cmd: [
          'faceswap-reset',
          'faceswap-change',
        ],
        listmenu: ['faceswap-reset', 'faceswap-change'],
        tag: 'ai',
        premium: true,
    }, async() => { 
        let usr = cht.sender.split("@")[0]
        let swps = func.archiveMemories.getItem(cht.sender, "fswaps")
        let opts = cht.cmd.split("-")[1]
        if(swps.list.length < 1) return cht.reply(infos.ai.noSessionFaceswap)
        if(opts == "reset") {
          func.archiveMemories.delItem(cht.sender, "fswaps")
          cht.reply(infos.ai.successResetSessionFaceswap)
        } else {
          if(swps.list.length == 1) return cht.reply(infos.ai.cannotChangeFace)
          swps.list = [swps.list[1]]
          func.archiveMemories.setItem(cht.sender, "fswaps", swps)          
          cht.reply(infos.ai.successChangeFace)
        }
    })
}