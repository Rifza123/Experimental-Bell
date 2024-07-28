/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()

/*!-======[ Function Import ]======-!*/
let exif = await (fol[0] + 'exif.js').r()

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    const { id } = cht
    ev.on({ 
        cmd: ['s', 'sticker', 'setiker'], 
        listmenu: ['sticker'],
        tag: "maker",
        energy: 1,
        media: { 
           type: ["image","video"],
           msg: `Reply gambar/video/sticker dengan caption ${cht.cmd} \n*(MAKSIMAL 10 DETIK!)*`,
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
    

}