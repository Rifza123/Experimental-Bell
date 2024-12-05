/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
const { generateWAMessageFromContent } = "baileys".import()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    let { sender, id } = cht
    let infos = Data.infos

    ev.on({ 
        cmd: ['pin','pinterest','pinterestsearch'],
        listmenu: ['pinterest'],
        tag: 'search',
        args: "Cari apa?",
        badword: true,
        energy: 5
    }, async() => {
        let [ query, geser ] = cht?.q?.split("--geser")
        let amount = parseInt(geser?.split(" ")?.[1]||5)
            amount = amount > 15 ? 15 : amount < 1 ? 1 : amount
        if(typeof geser == "string"){
          let res = await fetch(`${api.xterm.url}/api/search/pinterest-image?query=${query}&key=${api.xterm.key}`).then(a => a.json())
          let { data } = res||{}
          let cards = []
          if(data){
            data = data.slice(0, amount)
 
            for(let i of data){
               let img = await Exp.func.uploadToServer(i)
               cards.push({
                 header: {
                    imageMessage: img,
                    hasMediaAttachment: true,
                 },
                 body: { text: `#${cards.length+1}` },
                 nativeFlowMessage: {
                     buttons: [
                     {
                       name: "cta_url",
                       buttonParamsJson: '{"display_text":"WhatsappChannel","url":"https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V","webview_presentation":null}',
                     },
                   ],
                 },
               })
            }
            
            let msg = generateWAMessageFromContent(id,
              {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      body: {
                        text: `Result from "${query?.trim()}"`
                      },
                      carouselMessage: {
                        cards,
                        messageVersion: 1,
                      },
                    },
                  },
                },
            }, {})
            
            Exp.relayMessage(msg.key.remoteJid, msg.message, {
              messageId: msg.key.id,
            })
          }
        } else {
          Exp.sendMessage(id, { image: { url: api.rifza.url + "/api/pinterest-v2?query="+query } }, { quoted: cht })
        }
	})
	
	ev.on({ 
        cmd: ['gis','image','gimage','googleimage','gimg','googleimg'],
        listmenu: ['googleimage'],
        tag: 'search',
        args: `Contoh: ${cht.msg} Xun'er`,
        badword: true,
        energy: 5
    }, async() => {
        let url = await await fetch(api.xterm.url + "/api/search/google-image?query=rule34 "+cht.q).then(async a => (await a.json()).data.getRandom())
        Exp.sendMessage(id, { image: { url, }, caption: `Google image search: \`${cht.q}\`` }, { quoted: cht })
        .catch(()=> cht.reply(`Failed downloading url: ${url}`))
	})
	
	ev.on({ 
        cmd: ['pinvid','pinterestvid','pinterestvideo'],
        listmenu: ['pinterestvideo'],
        tag: 'search',
        args: "Cari apa?",
        badword: true,
        energy: 21
    }, async() => {
        try {
        let [ query, geser ] = cht?.q?.split("--geser")
        let amount = parseInt(geser?.split(" ")?.[1]||5)
            amount = amount > 10 ? 10 : amount < 1 ? 1 : amount
        
        await cht.edit(infos.messages.wait, keys[sender])

        let data = (await fetch(api.xterm.url + "/api/search/pinterest-video?query=" + query + "&key=" + api.xterm.key).then(a => a.json())).data?.pins ||[]

        if(data.length < 1) return cht.reply("Video tidak ditemukan!")

        if(typeof geser == "string"){
          let res = await fetch(`${api.xterm.url}/api/search/pinterest-image?query=${query}&key=${api.xterm.key}`).then(a => a.json())
          let cards = []
          if(data){
            data = data.slice(0, amount)
 
            for(let i of data){
               let p = (await fetch(api.xterm.url + "/api/downloader/pinterest?url=" + i.link + "&key=" + api.xterm.key).then(a => a.json())).data
               let _pin = Object.values(p.videos)[0].url
               let vid = await Exp.func.uploadToServer(_pin, "video")
               cards.push({
                 header: {
                    videoMessage: vid,
                    hasMediaAttachment: true,
                 },
                 body: { text: i.title },
                 nativeFlowMessage: {
                     buttons: [
                     {
                       name: "cta_url",
                       buttonParamsJson: '{"display_text":"WhatsappChannel","url":"https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V","webview_presentation":null}',
                     },
                   ],
                 },
               })
            }
            
            let msg = generateWAMessageFromContent(id,
              {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      body: {
                        text: `Result from "${query?.trim()}"`
                      },
                      carouselMessage: {
                        cards,
                        messageVersion: 1,
                      },
                    },
                  },
                },
            }, {})
            
            Exp.relayMessage(msg.key.remoteJid, msg.message, {
              messageId: msg.key.id,
            })
          }
        } else {
        
          let pin = data[Math.floor(Math.random() * data.length)]
          let p = (await fetch(api.xterm.url + "/api/downloader/pinterest?url=" + pin.link + "&key=" + api.xterm.key).then(a => a.json())).data
          let _pin = Object.values(p.videos)[0].url
          Exp.sendMessage(id, { video: { url: _pin }, caption: pin.title, mimetype: "video/mp4"}, { quoted: cht })                
        }
        
        } catch (e){
           return cht.reply("TypeErr:" + e.message)
        }
	})

}
