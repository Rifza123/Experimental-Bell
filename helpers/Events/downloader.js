/*!-======[ Module Imports ]======-!*/
const axios = "axios".import();

/*!-======[ Function Imports ]======-!*/
const { mediafireDl } = await (fol[0] + 'mediafire.js').r();

/*!-======[ Configurations ]======-!*/
let infos = cfg.menu.infos;

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    let { sender } = cht
    
    ev.on({ 
      cmd: ['pinterestdl', 'pindl'], 
      listmenu: ['pinterestdl'], 
      tag: 'downloader',
      args: "Mana linknya?",
      energy: 5
    }, async () => {
        let q = is.quoted?.url || is.url;
        await cht.reply('```Processing...```')
        let p = (await fetch(api.xterm.url + "/api/downloader/pinterest?url=" + q + "&key=" + api.xterm.key).then(a => a.json())).data
        let pin = Object.values(p.videos)[0].url;
        Exp.sendMessage(cht.id, { video: { url: pin }, mimetype: "video/mp4" }, { quoted: cht });
    });
    
    ev.on({ 
      cmd: ['mediafire', 'mediafiredl'], 
      listmenu: ['mediafire'], 
      tag: 'downloader',
      args: "Mana linknya?",
      energy: 8 
    }, async () => {
        const _key = key[sender]
        let q = is.quoted?.url || is.url;
        if (!q) return cht.reply("Mana linknya?");
        await cht.edit('```Processing...```', _key)
        try {
            let m = await mediafireDl(q);
            await cht.edit("Checking media type...", _key)
            let { headers } = await axios.get(m.link);
            let type = headers["content-type"];
            await cht.edit("Sending...", _key )
            await Exp.sendMessage(cht.id, { document: { url: m.link }, mimetype: type, fileName: m.title }, { quoted: cht });
            await cht.edit("Success", _key )
        } catch (e) {
            await cht.edit("TypeErr: " + e, _key )
        }
    });

    ev.on({ 
      cmd: ['tiktok', 'tiktokdl', 'tt'], 
      listmenu: ['tiktok', 'ttdl'], 
      tag: 'downloader',
      args: "Mana linknya?",
      energy: 4 
    }, async () => {
        const _key = key[sender]
        if(!(is.quoted?.url || is.url)) return cht.reply("Mana urlnya?")
        let url = is.quoted?.url || is.url 
        if(!(url ? url[0].includes("tiktok.com") : false)) return cht.reply("Itu bukan link tiktok!")
        await cht.edit("Bntr..", _key)
        let data = (await fetch(api.xterm.url + "/api/downloader/tiktok?url=" + url[0] + "&key=" + api.xterm.key).then(a => a.json())).data;
        await cht.edit("Lagi dikirim...", _key);
        let type = data.type;
        if (type == 'image') {
            for (let image of data.media) {
                await Exp.sendMessage(cht.id, { image: { url: image.url } }, { quoted: cht });
            }
        } else if (type == 'video') {
            await Exp.sendMessage(cht.id, { video: { url: data.media[1].url } }, { quoted: cht });
        }
        await cht.edit("Dah tuh", _key);
    });

    ev.on({ 
      cmd: ['ytmp3', 'ytm4a', 'play', 'ytmp4'],
      listmenu: ['ytmp3', 'ytm4a', 'play', 'ytmp4'],
      tag: 'downloader',
      args: "Mana linknya?",
      energy: 4 
    }, async () => {
        const _key = key[sender]
        let q = is.quoted?.url || is.url || (typeof cht.q !== 'undefined' ? [cht.q] : null);
        if (!q) return cht.reply('Harap sertakan url/judul videonya!');
        try {
            await cht.edit("Searching...", _key)
            let search = (await fetch(api.xterm.url + "/api/search/youtube?query=" + q[0] + "&key=" + api.xterm.key).then(a => a.json())).data;
            await cht.edit("Downloading...", _key)
            let data = (await fetch(api.xterm.url + "/api/downloader/youtube?url=" + q[0] + "&type=" + (cht.cmd === "ytmp4" ? "mp4" : "mp3") + "&key=" + api.xterm.key).then(a => a.json())).data;
            let item = search.items[0];
            
            let audio = {
                [cht.cmd === "ytmp4" ? "video" : "audio"]: { url: data.dlink },
                mimetype: cht.cmd === "ytmp4" ? "video/mp4" : "audio/mpeg",
                fileName: item.title + (cht.cmd === "ytmp4" ? ".mp4" : ".mp3"),
                ptt: cht.cmd === "play",
                contextInfo: {
                    externalAdReply: {
                        title: "Title: " + item.title,
                        body: "Channel: " + item.creator,
                        thumbnailUrl: item.thumbnail,
                        sourceUrl: item.url,
                        mediaUrl: "http://ẉa.me/6283110928302?text=Idmsg: " + Math.floor(Math.random() * 100000000000000000),
                        renderLargerThumbnail: false,
                        showAdAttribution: true,
                        mediaType: 2,
                    },
                },
            };
            await cht.edit("Sending...", _key)
            await Exp.sendMessage(cht.id, audio, { quoted: cht });
        } catch (e) {
            console.log(e);
            cht.reply("TypeErr: " + e);
        }
    });
}
