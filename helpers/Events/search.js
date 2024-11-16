/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

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
        Exp.sendMessage(id, { image: { url: api.rifza.url + "/api/pinterest-v2?query="+cht.q } }, { quoted: cht })
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
        await cht.edit(infos.messages.wait, keys[sender])
        let pint = (await fetch(api.xterm.url + "/api/search/pinterest-video?query=" + cht.q + "&key=" + api.xterm.key).then(a => a.json())).data
        if(pint.pins.length < 1) return cht.reply("Video tidak ditemukan!")
        let pin = pint.pins[Math.floor(Math.random() * pint.pins.length)]
        let p = (await fetch(api.xterm.url + "/api/downloader/pinterest?url=" + pin.link + "&key=" + api.xterm.key).then(a => a.json())).data
        let _pin = Object.values(p.videos)[0].url
        Exp.sendMessage(id, { video: { url: _pin }, caption: pin.title, mimetype: "video/mp4"}, { quoted: cht })                
        } catch (e){
           return cht.reply("TypeErr:" + e.message)
        }
	})

}
