/*!-======[ Module Imports ]======-!*/
const fs = "fs".import()
/*!-======[ Function Import ]======-!*/

let exif = await (fol[0] + 'exif.js').r()
const {
	TermaiCdn
} = await (fol[0] + 'cdn.termai.js').r()

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
	ev.on({
		cmd: ['s', 'sticker', 'setiker', 'stiker'],
		listmenu: ['sticker'],
		tag: "maker",
		energy: 5,
		media: {
			type: ["image", "video"],
			etc: {
				seconds: 10
			},
			save: false
		}
	}, async ({
		media
	}) => {
		let type = ev.getMediaType()
		let res = await exif[type == "image" ? "writeExifImg" : "writeExifVid"](media, {
			packname: 'My sticker',
			author: 'Ⓒ' + cht.pushName
		})
		Exp.sendMessage(id, {
			sticker: {
				url: res
			}
		}, {
			quoted: cht
		})
	})
	
	ev.on({
		cmd: ['swm', 'stickerwm', 'setikerwm', 'stikerwm', 'colongstiker','colongstc','colongsticker'],
		listmenu: ['stickerwm','swm'],
		tag: "maker",
		energy: 15,
		media: {
			type: ["image", "video", "sticker"],
			etc: {
				seconds: 10
			},
			save: false
		},
		args: "Sertakan teks sebagai wm pada sticker!"
	}, async ({
		media,
		args: packname
	}) => {
		let type = ev.getMediaType()
		let res = await exif[(type == "image" || !is.quoted?.sticker?.isAnimated) ? "writeExifImg" : "writeExifVid"](media, {
			packname,
			author: 'Ⓒ' + cht.pushName
		}, is.quoted?.sticker)
		Exp.sendMessage(id, {
			sticker: {
				url: res
			}
		}, {
			quoted: cht
		})
	})

	ev.on({
		cmd: ['smeme', 'stickermeme', 'stikermeme'],
		listmenu: ['smeme'],
		tag: "maker",
		args: `Example: ${cht.msg} teks1|teks2`,
		energy: 7,
		media: {
			type: ["image", "sticker"],
			save: false
		}
	}, async ({
		media
	}) => {
		let [txt1, txt2] = cht.q.split("|")
		let tmp = await TermaiCdn(media)
        let ats = (txt2 ? txt1 : "_").replace(/ /g,"_")
        let bwh = (txt2 ? txt2 : txt1).replace(/ /g, "_")
        let buff = await func.getBuffer(`https://api.memegen.link/images/custom/${ats}/${bwh}.png?background=${tmp}`)
		let res = await exif["writeExifImg"](buff, {
			packname: 'My sticker',
			author: 'Ⓒ' + cht.pushName
		})
		Exp.sendMessage(id, {
			sticker: {
				url: res
			}
		}, {
			quoted: cht
		})
	})

	ev.on({
		cmd: ['qc', 'quoted'],
		listmenu: ['qc'],
		tag: "maker",
		energy: 7
	}, async ({
		args
	}) => {
		const colors = {
			pink: "#f68ac9",
			blue: "#6cace4",
			red: "#f44336",
			green: "#4caf50",
			yellow: "#ffeb3b",
			purple: "#9c27b0",
			darkblue: "#0d47a1",
			lightblue: "#03a9f4",
			grey: "#9e9e9e",
			orange: "#ff9800",
			black: "#000000",
			white: "#ffffff",
			teal: "#008080",
			lightred: "#FFC0CB",
			brown: "#A52A2A",
			salmon: "#FFA07A",
			magenta: "#FF00FF",
			tan: "#D2B48C",
			wheat: "#F5DEB3",
			deeppink: "#FF1493",
			fire: "#B22222",
			skyblue: "#00BFFF",
			brightorange: "#FF7F50",
			lightskyblue: "#1E90FF",
			hotpink: "#FF69B4",
			skybluegreen: "#87CEEB",
			seagreen: "#20B2AA",
			darkred: "#8B0000",
			redorange: "#FF4500",
			cyan: "#48D1CC",
			darkpurple: "#BA55D3",
			mossgreen: "#00FF7F",
			darkgreen: "#008000",
			midnightblue: "#191970",
			darkorange: "#FF8C00",
			blackishpurple: "#9400D3",
			fuchsia: "#FF00FF",
			darkmagenta: "#8B008B",
			darkgrey: "#2F4F4F",
			peachpuff: "#FFDAB9",
			darkcrimson: "#DC143C",
			goldenrod: "#DAA520",
			gold: "#FFD700",
			silver: "#C0C0C0"
		};
		if (!args) return cht.reply(`Example: ${cht.prefix+cht.cmd} pink hello\n\nColor list:\n- ${Object.keys(colors).join("\n- ")}`)

		let [color, ...message] = args.split(' ');
		message = message.join(' ') || args;

		let avatar;
		try {
			avatar = await Exp.profilePictureUrl(cht.quoted?.sender || cht.sender, 'image');
		} catch {
			avatar = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
		}

		const json = {
			type: 'quote',
			format: 'png',
			backgroundColor: colors[color] || "#ffffff",
			width: 700,
			height: 580,
			scale: 2,
			messages: [{
				entities: [],
				avatar: true,
				from: {
					id: 1,
					name: cht.pushName,
					photo: {
						url: avatar
					}
				},
				text: message,
				'm.replyMessage': {}
			}]
		};

		"axios".import().post("https://bot.lyo.su/quote/generate", json, {
			headers: {
				"Content-Type": "application/json"
			}
		}).then(async res => {
			const buff = Buffer.from(res.data.result.image, 'base64');
			let ress = await exif["writeExifImg"](buff, {
				packname: 'My sticker',
				author: 'Ⓒ' + cht.pushName
			})
			Exp.sendMessage(id, {
				sticker: {
					url: ress
				}
			}, {
				quoted: cht
			})
		});
	})
	
	ev.on({
		cmd: ['brat', 'bart', 'bratgenerator'],
		listmenu: ['brat'],
		tag: "maker",
		energy: 5,
		args: `Example: ${cht.msg} halo`
	}, async ({ args }) => {
	    let brat = [
	      "https://brat.xtermai.xyz/?text="
	    ]
	    let token = String(Date.now()).to('base64').to('charCode').to('base64').to('utf16le')
        let buff = await func.getBuffer(brat.getRandom() + encodeURIComponent(args) + '&token='+token)
		let res = await exif["writeExifImg"](buff, {
			packname: 'My brat sticker',
			author: 'Ⓒ' + cht.pushName
		})
		Exp.sendMessage(id, {
			sticker: {
				url: res
			}, ai:true
		}, {
			quoted: cht
		})
	})
	
	ev.on({
		cmd: ['bratv','bratvid','bartvideo','bratvideogenerator','bratvideo','bartv','bartvideogenerator'],
		listmenu: ['bratvideo'],
		tag: "maker",
		energy: 20,
		args: `Example: ${cht.msg} halo aku bella`
	}, async () => {
	    let token = String(Date.now()).to('base64').to('charCode').to('base64').to('utf16le')
        
        let buff = await func.getBuffer(`https://brat.xtermai.xyz/animate?text=${encodeURIComponent(cht.q)}&token=${token}`)
		let res = await exif["writeExifVid"](buff, {
			packname: 'My brat sticker',
			author: 'Ⓒ' + cht.pushName
		})
		Exp.sendMessage(id, {
			sticker: {
				url: res
			}, ai:true
		}, {
			quoted: cht
		})
	})
	
	ev.on({
		cmd: ['emojimix'],
		listmenu: ['emojimix'],
		tag: "maker",
		energy: 10,
		args: `Example: ${cht.msg} 😭+😂`
	}, async ({ args }) => {
	    let [a,b] = args.split("+")
	    if(!a||!b) return cht.reply(`Example: .${cht.cmd} 😭+😂`)
	    let r = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyC-P6_qz3FzCoXGLk6tgitZo4jEJ5mLzD8&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(a)}_${encodeURIComponent(b)}`).then(a => a.json())
	    let { results:res } = r
	    if(res.length < 1) return cht.reply("Unsupported emoji!")
	    for(let i of res){
	      let buff = await func.getBuffer(i.url)
		  let res = await exif["writeExifImg"](buff, {
			packname: 'My emojimix sticker',
			author: 'Ⓒ' + cht.pushName
		  })
		  Exp.sendMessage(id, {
			sticker: {
				url: res
			}, ai:true
		  }, {
			quoted: cht
		  })
		  
		}
	})
	
}