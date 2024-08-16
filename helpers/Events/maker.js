/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Function Import ]======-!*/
let exif = await (fol[0] + 'exif.js').r()
const { tmpFiles } = await (fol[0] + 'tmpfiles.js').r()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    const { id } = cht
    ev.on({ 
        cmd: ['s', 'sticker', 'setiker','stiker'], 
        listmenu: ['sticker'],
        tag: "maker",
        energy: 5,
        media: { 
           type: ["image","video"],
           msg: `Reply gambar/video dengan caption ${cht.cmd} \n*(MAKSIMAL 10 DETIK!)*`,
           etc: {
              seconds: 10,
              msg: "Maksimal video 10 detik!"
           },
           save: false
        }
    }, async({ media }) => {
       let type = ev.getMediaType()
       let res = await exif[type == "image" ? "writeExifImg" : "writeExifVid"](media, {
				packname: 'My sticker',
				author: 'Ⓒ' + cht.pushName
			})
       Exp.sendMessage(id, { sticker: { url: res } }, { quoted: cht })
    })
    
    ev.on({ 
        cmd: ['smeme', 'stickermeme', 'stikermeme'], 
        listmenu: ['smeme'],
        tag: "maker",
        args: `Contoh: ${cht.msg} teks1|teks2`,
        energy: 7,
        media: { 
           type: ["image","sticker"],
           msg: `Reply gambar/sticker dengan caption ${cht.msg}`,
           save: false
        }
    }, async({ media }) => {
       let [txt1, txt2] = cht.q.split("|")
       let tmp = await tmpFiles(media)
        
       let buff = await Exp.func.getBuffer(`https://api.memegen.link/images/custom/${(txt2 ? txt1 : "_").replace(" ","_")}/${(txt2 ? txt2 : txt1).replace(" ","_")}.png?background=${tmp}`)
       let res = await exif["writeExifImg"](buff, {
				packname: 'My sticker',
				author: 'Ⓒ' + cht.pushName
			})
       Exp.sendMessage(id, { sticker: { url: res } }, { quoted: cht })
    })

}