/*!-======[ Function Import ]======-!*/
let exif = await (fol[0] + 'exif.js').r()
let { convert } = exif

const {
	tmpFiles
} = await (fol[0] + 'tmpfiles.js').r()

/*!-======[ Default Export Function ]======-!*/
export default async function on({
	cht,
	Exp,
	store,
	ev,
	is
}) {
	const {
		id
	} = cht
	const {
		func
	} = Exp

	if(!cfg.menu.tags.converter) cfg.menu.tags.converter = '*<🔀 Converter>*'
	

    ev.on({ 
        cmd: ['toimage','toimg'],
        listmenu: ['toimg'],
        tag: 'converter',
	    energy: 4,
        media: { 
           type: ["sticker"],
           etc: {
             //isNoAnimated:true
           }
        }
    }, async({ media }) => {
         Exp.sendMessage(id, { image: media }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['tomp4','tovideo','togif'],
        listmenu: ['tomp4','tovideo','togif'],
        tag: 'converter',
	    energy: 10,
        media: { 
           type: ["sticker","video"],
           etc: {
             isAnimated:true
           }
        }
    }, async({ media }) => {
         let res = await tmpFiles(media)
         let url = cht.type == 'video' ? res : await convert({
           url: res,
           from: "webp", to: "mp4"
         })
         Exp.sendMessage(id, { video: { url }, gifPlayback: cht.cmd == 'togif' }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['webp2jpg','webptojpg','webp2png','webptopng'],
        listmenu:  ['webp2jpg','webp2png'],
        tag: 'converter',
	    energy: 10,
        media: { 
           type: ["sticker","image"]
        }
    }, async({ media }) => {
      try {
         let res = await tmpFiles(media)
         let url = await convert({
           url: res,
           from: "webp", to: cht.cmd.includes("jpg") ? 'jpg':'png'
         })
         Exp.sendMessage(id, { image: { url } }, { quoted: cht })
      } catch (e) {
        console.error(e)
        cht.reply('Failed!')
      }
	})
	
	ev.on({ 
        cmd: ['tomp3','toaudio','tovn'],
        listmenu: ['tomp3'],
        tag: 'converter',
	    energy: 1,
        media: { 
           type: ['video','audio']
        }
    }, async({ media:audio }) => {
       Exp.sendMessage(id, { audio, mimetype: 'audio/mpeg', ptt: cht.cmd == 'tovn' }, { quoted: cht })
	})
	
}