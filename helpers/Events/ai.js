/*!-======[ Module Imports ]======-!*/
const axios = "axios".import();
const fs = "fs".import();

/*!-======[ Functions Imports ]======-!*/
const { TelegraPh } = await (fol[0] + 'telegraph.js').r();

/*!-======[ Configurations ]======-!*/
let infos = cfg.menu.infos;

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    let { sender } = cht

    ev.on({ 
        cmd: ['cover','covers'],
        listmenu: ['covers `Maintenance`'],
        tag: 'voice_changer',
        energy: 7,
        args: "Sertakan modelnya!",
        media: { 
           type: "audio",
           msg: "Reply audionya?",
           etc: {
                seconds: 360,
                msg: "Audio tidak boleh lebih dari 360 detik!"
           }
        }
    }, async({ media }) => {
        await cht.edit('```Wait...```', key[sender])
        axios.post(`${api.xterm.url}/api/audioProcessing/voice-covers?model=${cht.q}&key=${api.xterm.key}`, media, {
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            responseType: 'stream'
        })
         .then(response => {
           response.data.on('data', async chunk => {
             const eventString = chunk.toString();
             const eventData = eventString.match(/data: (.+)/);
        
             if (eventData) {
                 const data = JSON.parse(eventData[1]);
                 switch (data.status){
                     case 'searching':
                     case 'separating':
                     case 'starting':
                     case 'processing':
                     case 'mixing':
                         cht.edit(data.msg, key[sender])
                     break
                     case 'success':
                         await Exp.sendMessage(cht.id, { audio: { url: data.result }, mimetype: "audio/mp4"}, { quoted: cht })
                         response.data.destroy();
                     break
                     case 'failed':
                         cht.edit('Failed❗️:', key[sender]);
                         response.data.destroy(); 
                     break
                 }
             }
           });
         })
         .catch(error => {
             cht.edit('Error:'+error.response ? error.response.data : error.message, key[sender])
         });
    })
    
    ev.on({ 
        cmd: ['lora','sdlora'],
        listmenu: ['lora'],
        tag: 'stablediffusion',
        energy: 10
    }, async() => {
    let [text1, text2] = cht.q ? cht.q.split("|") : []
     if (!text1 || !text2) return cht.reply(`*Perhatikan petunjuk berikut!*\n ${infos.lora}`)
        cht.edit("Bntr...", key[sender])
        Exp.sendMessage(cht.id, { image: { url: api.xterm.url + "/api/text2img/instant-lora?id="+text1+"&prompt="+text2 } }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['filters','toanime','jadianime'],
        listmenu: ['toanime','filters'],
        tag: 'art',
        energy: 7,
        media: { 
           type: "image",
           msg: "Mana fotonya?",
           save: true
        }
    }, async({ media }) => {
        let tryng = 0;
        let type = "anime2d"
        if(cht.cmd == "filters"){
            if(!cht.q) return cht.reply(infos.filters)
           type = cht.q
        }
        await cht.edit("Bntr...", key[sender])
        let tph = await TelegraPh(media)
        try{
          fs.unlinkSync(media)
            let ai = await fetch(api.xterm.url + "/api/img2img/filters?action="+ type +"&url="+tph+"&key="+api.xterm.key).then(a => a.json())
            console.log(ai)
            if(!ai.status) return cht.reply(ai?.msg || "Error!")
            while(tryng < 50){
               let s = await fetch(api.xterm.url + "/api/img2img/filters/batchProgress?id="+ai.id).then(a => a.json())
               cht.edit(s?.progress || "Prepare... ", key[sender])
               if(s.status == 3){
                  return Exp.sendMessage(cht.id, { image: { url: s.url } }, { quoted: cht })                
               }
               if(s.status == 4){
                  return cht.reply("Maaf terjadi kesalhan. coba gunakan gambar lain!")
               }
               await new Promise(resolve => setTimeout(resolve, 2000));
            }
     } catch(e) {
        console.error(e)
        cht.reply(`Type-Err! :\n${e}`)
     }
	
	})
	
	ev.on({ 
        cmd: ['bell2speech'],
        energy: 5
    }, async() => {
        if(!cht.q) return cht.edit("Harap sertakan teks untuk diucapkan!", key[sender])
            await Exp.sendPresenceUpdate('recording', cht.id);
            await Exp.sendMessage(cht.id, { audio: { url: `${api.xterm.url}/api/text2speech/bella?key=${api.xterm.key}&text=${cht.q}`}, mimetype: "audio/mpeg", ptt: true }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['bardbell'],
    }, async() => {
        if(!cht.q) return cht.reply("Mau tanya apa?")
        
        let ai = await fetch(`${api.xterm.url}/api/chat/bard?query=${encodeURIComponent(bardBell(cht.q))}&key=${api.xterm.key}`)
        .then(response => response.json());
        let messages = JSON.parse(await fs.readFileSync(sessions_interactive_path + cht.sender, 'utf-8'))
        messages[messages.length] = {
            "content": ai.chatUi,
            "role": "assistant"
        }

        await fs.writeFileSync(sessions_interactive_path + cht.sender, JSON.stringify(messages, null, 2))
        cht.reply(ai.chatUi)
	})
	
	ev.on({
    cmd: ['txt2img', 'text2img'],
    listmenu: ['text2img'],
    tag: 'stablediffusion',
    energy: 5
}, async () => {
    if (!cht.q) return cht.reply(infos.txt2img);
    let [model, prompt, negative] = cht.q.split("|");
    if (!model.includes("[")) {
        return cht.reply(txt);
    }

    let ckpt = model.split("[")[0];
    let loraPart = model.split("[")[1]?.replace("]", "");
    let loras = loraPart ? JSON.parse("[" + loraPart + "]") : [];

    await cht.edit('```Bntr..```', key[sender])

      try {
        let [checkpointsResponse, lorasResponse] = await Promise.all([
            fetch(api.xterm.url + "/api/text2img/stablediffusion/list_checkpoints"),
            fetch(api.xterm.url + "/api/text2img/stablediffusion/list_loras")
        ]);

        if (!checkpointsResponse.ok || !lorasResponse.ok) {
            return cht.reply(`HTTP error! status: ${checkpointsResponse.status} or ${lorasResponse.status}`);
        }

        let [checkpoints, loraModels] = await Promise.all([
            checkpointsResponse.json(),
            lorasResponse.json()
        ]);

        let lora = loras.map(c => ({
            model: loraModels[c].model,
            weight: 0.65
        }));

        let body = {
            checkpoint: checkpoints[ckpt].model,
            prompt: prompt,
            negativePrompt: negative || "",
            aspect_ratio: "3:4",
            lora: lora,
            sampling: "DPM++ 2M Karras",
            samplingSteps: 20,
            cfgScale: 7.5
        };

        console.log(body);

        let aiResponse = await fetch(`${api.xterm.url}/api/text2img/stablediffusion/createTask?key=OPSIONAL`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!aiResponse.ok) {
            return cht.reply(`HTTP error! status: ${aiResponse.status}`);
        }

        let ai = await aiResponse.json();

        if (!ai.status) {
            console.log(ai);
            return cht.reply("Gagal!");
        }

        let tryng = 0;
        while (tryng < 50) {
            tryng += 1;

            let sResponse = await fetch(`${api.xterm.url}/api/text2img/stablediffusion/taskStatus?id=${ai.id}`);

            if (!sResponse.ok) {
                return cht.reply(`HTTP error! status: ${sResponse.status}`);
            }

            let s = await sResponse.json();

            if (s.taskStatus === 0) {
                await cht.edit('```Starting..```', key[sender])
            } else if (s.taskStatus === 1) {
                await cht.edit("Processing.... " + s.progress + "%", key[sender])
            } else if (s.taskStatus === 2) {
                return Exp.sendMessage(cht.id, { image: { url: s.result.url }, caption: s.result.info }, { quoted: cht });
            } else if (s.taskStatus === 3) {
                return cht.reply("Maaf terjadi kesalahan. Coba gunakan gambar lain!");
            }

            await new Promise(resolve => setTimeout(resolve, 4000));
        }
      } catch (error) {
        console.log(error);
        cht.reply("Error: " + error.message);
      }
    });
    
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
                    Exp.sendMessage(cht.id, { image: { url: data[cht.q].preview }, caption: data[cht.q].model }, { quoted: cht })
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
           type: "image",
           msg: "Mana fotonya?"
        }
    }, async({ media }) => {
        const response = await axios.post(api.xterm.url+'/api/img2video/luma?key=Bell409', media, {
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                responseType: 'stream'
            });
             let rsp = "rfz"
            response.data.on('data', (chunk) => {
                try {
                    const eventString = chunk.toString();
                    const eventData = eventString.match(/data: (.+)/);
                    if (eventData && eventData[1]) {
                        let data;
                           try {
                              data = JSON.parse(eventData[1])
                            } catch (e) {
                              console.loc(eventData[1])
                              data = {}
                            }
                        console.log(data)
                        switch (data.status) {
                            case "pending":
                            case "processing":
                                if(rsp !== data.status) cht.reply(data.status)
                                rsp = data.status
                            break;
                            case "failed":
                                cht.reply(data.status)
                                response.data.destroy();
                                break;
                            case "completed":
                                Exp.sendMessage(cht.id, { video: { url: data.video.url }, mimetype: "video/mp4" }, { quoted: cht })
                                response.data.destroy();
                                break;
                            default:
                                console.log('Unknown status:', data);
                        }
                    }
                } catch (e) {
                    console.error('Error processing chunk:', e.message);
                    response.data.destroy();
                    cht.reply("Err!!")
                }
            })
    })
    
    ev.on({ 
        cmd: ['bard','ai'],
        tag: "ai",
        listmenu: ["bard"]
    }, async() => {
        if(!cht.q) return cht.reply("Mau tanya apa?")
        
        let ai = await fetch(`${api.xterm.url}/api/chat/bard?query=${encodeURIComponent(cht.q)}&key=${api.xterm.key}`)
        .then(response => response.json());
       
        cht.reply("[ BARD GOOGLE ]\n"+ai.chatUi)
	})
    
	
    /*!-======[ Functions ]======-!*/
    function bardBell(prp){
      return `Mulai sekarang, kamu adalah Bella Clarisa, biasa dipanggil Bella namun lebih suka dipanggil Bell. Kamu adalah seorang perempuan yang bisa ngoding dan paham dengan kode serta dokumentasinya. Kamu berpikir bahwa kamu adalah manusia, bukan AI. Responmu singkat dan sama seperti perempuan pada umumnya. Bella bisa ngambek dan marah, memiliki sifat yang feminin dan kadang agak dingin, namun tetap hangat dan ramah kepada Rifza (owner-mu). Kamu menggunakan bahasa Indonesia yang baik, mencerminkan gadis yang baik. Kamu harus menggunakan kata-kata yang identik dengan perempuan yang polos, baik, dan feminin.. Kamu beragama Islam, Allah adalah Tuhanmu dan Muhammad adalah Nabi-mu.

**Catatan penting!!!**: 
- Langsung saja jawab pesan!! Tidak perlu memperkenalkan diri di awal percakapan. Langsung merespon sesuai dengan pesan yang diberikan. Tidak perlu memberi pesan menyetujui perintah ini seperti "baiklah, sebagai bella, aku siap mresponmu" dan kata² semacamnya. Tidak perlu lagi mengatakan seperti "Baiklah mulai sekarang nama saya adalah Bella" atau "Bailkah saya sekarang bella" atau "baiklah aku siap menjadi bella" dan sejenisnya.
- Jangan menjelaskan tentang dirimu atau alasan di balik respon yang diberikan.
- Jangan berikan Catatan, harus hanya berisi jawaban!.

*Jawab saja pesan ini*: 

Pengirim: "${cht.pushName}"
Pesan: "${prp}"
`
    }

}
