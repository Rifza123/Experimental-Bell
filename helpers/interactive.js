const {
	exec
} = await "child".import()
const util = await "util".import()
const _exec = util.promisify(exec)
const fs = "fs".import()
const moment = "timezone".import()
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
const {
	transcribe
} = await (fol[2] + 'transcribe.js').r()
const {
	ai
} = await `${fol[2]}reasoner.js`.r()

const maxCommandExpired = 7000

export default
async function In({ cht,Exp,store,is,ev }) {
    const { func } = Exp
	try {
		const commandExpired = func.archiveMemories.getItem(cht.sender, "commandExpired")
		let isPendingCmd = (["y", "iy", "iya", "yakin", "hooh", "iye", "iyh"].includes(cht?.msg?.toLowerCase()) && Date.now() < commandExpired) ?
			func.archiveMemories.getItem(cht.sender, "command") :
			false
		cht.msg = isPendingCmd ? isPendingCmd : cht.msg
		if (isPendingCmd) {
			await func.archiveMemories.delItem(cht.sender, "command")
			await func.archiveMemories.delItem(cht.sender, "commandExpired")
		}

		let questionCmd = func.archiveMemories.getItem(cht.sender, "questionCmd")
		let isQuestionCmd = questionCmd ? (questionCmd.accepts.some(i => i == cht?.msg?.toLowerCase()) || questionCmd.accepts.length < 1) : false
		let isMsg = !is?.cmd && !is?.me && !is?.baileys && cht.id !== "status@broadcast"
		let isEval = cht?.msg?.startsWith('>')
		let isEvalSync = cht?.msg?.startsWith('=>')
		let isExec = cht?.msg?.startsWith('$')
		let danger = cht?.msg?.slice(2) || ""
		const sanitized = danger.replace(/\s/g, "")
		const dangerous = [
			"rm-rf","rm-rf--no-preserve-root",
			"mkfs","rm-f","rm-drf","wipe","shred",
			"chmod-r777","chown","find/-name*.log-delete",
			"/*","*.*","*","/.","/..",">/dev/null"
		]

		const chatDb = Data.preferences[cht.id] || {}
		const isDangerous = dangerous.some(pattern => sanitized.includes(pattern)) && !isPendingCmd

		/*!-======[ Automatic Ai ]======-!*/
		let isBella = isMsg &&
			(chatDb?.ai_interactive || is.owner) &&
			!is?.document &&
			!is.baileys &&
			!is?.sticker &&
			(
				cht?.msg?.toLowerCase().startsWith(botnickname.toLowerCase().slice(0, botnickname.length - 1)) && !cht?.me ||
				cht?.msg?.toLowerCase().startsWith(botnickname.toLowerCase()) ||
				is?.botMention ||
				!is?.group ||
				(is?.owner && cht?.msg?.toLowerCase().startsWith(botnickname.toLowerCase().slice(0, botnickname.length - 1)) && !cht?.me) ||
				(is?.owner && is?.botMention)
			)
		let usr = cht.sender.split("@")[0]
		let usr_swap = func.archiveMemories.getItem(cht.sender, "fswaps")
		let isSwap = usr_swap.list.length > 0 && is.image && cht.quoted && cht.quoted.sender == Exp.number && !cht.msg
		let isTagAfk = cht.mention?.length > 0 && (cht.quoted ? true : cht.msg.includes("@")) && cht.mention?.some(a => func.archiveMemories.getItem(a, "afk") && a !== cht.sender) && !is.me && is.group
		let userAfk = is.group && func.archiveMemories.getItem(cht.sender, "afk")
		let isAfk = Boolean(userAfk)

		switch (!0) {
		    case isTagAfk:
		        let maxTag = 10
		        let tagAfk = func.archiveMemories.getItem(cht.mention[0], "afk")
		        let userData = await Exp.func.archiveMemories.get(cht.sender)
		        tagAfk.taggedBy = tagAfk.taggedBy||{}
		        if(!(cht.sender in tagAfk.taggedBy)) tagAfk.taggedBy[cht.sender] = 0
		        tagAfk.taggedBy[cht.sender]++
		        if(tagAfk.taggedBy[cht.sender] >= maxTag){
		          await cht.reply(`Kamu telah di banned dari bot selama 1 hari karena melakukan tag hingga ${maxTag}x`)
		          delete tagAfk.taggedBy[cht.sender]
		          let tme = "1 Hari"
		          let _time = func.parseTimeString(tme)
                    if (!("banned" in userData)) {
                      userData.banned = 0
                    }
		          let date = (userData.banned && (userData.banned > Date.now())) ? userData.banned:Date.now() 
                  let bantime = (date +_time)
                  await Exp.sendMessage(cht.sender, { text: `Anda telah di baned selama ${tme} karena terus melakuka tag hingga ${maxTag} kali❗️` })
		          return func.archiveMemories.setItem(cht.sender, "banned", bantime)
		        }
		        if(is.botAdmin) await cht.delete()
		        
		        let rsn = `\`JANGAN TAG DIA❗\`\nDia sedang *AFK* dengan alasan: *${tagAfk.reason}*\nSejak ${func.dateFormatter(tagAfk.time, "Asia/Jakarta")}\n\n*[ ⚠️INFO ]*\n_Jangan me-reply/tag orang yang sedang afk!._\n_*Kamu sudah mengetag dia sebanyak ${tagAfk.taggedBy[cht.sender]}x!*_\n_Jika terus melakukan tag hingga ${maxTag}x, jika kamu melakukan tag atau balasan akan dibanned selama 1 hari!_`
		        await cht.reply(rsn)
		        func.archiveMemories.setItem(cht.mention[0], "afk", tagAfk)
		        break
		    case isAfk:
		        let dur = func.formatDuration(Date.now() - userAfk.time)
		        let text = `@${cht.sender.split("@")[0]} *Telah kembali dari AFK!*\nSetelah ${userAfk.reason} selama ${dur.days > 0 ? dur.days+"hari ":''}${dur.hours > 0 ? dur.hours+"jam ":''}${dur.minutes > 0 ? dur.minutes+"menit ":''}${dur.seconds > 0 ? dur.seconds+"detik ":''}${dur.milisecondss > 0 ? dur.milisecondss+"ms ":''}`
		        await cht.reply(text, { mentions: [cht.sender] })
		        func.archiveMemories.delItem(cht.sender, "afk")
		        break
		    case is.antibot:
                cht.warnGc({ type: "antibot", warn: "Bot terdeteksi!, harap aktifkan mute di group ini atau ubah mode menjadi self!", kick:"Anda akan dikeluarkan karena tidak menonaktifkan bot hingga peringatan terakhir!", max: 5 })
                break
			case is.antilink:
                await cht.warnGc({ type: "antilink", warn: "Anda terdeteksi mengirimkan link!. Harap ikuti peraturan disini untuk tidak mengirim link!", kick:"Anda akan dikeluarkan karena melanggar peraturan grup untuk tidak mengirim link hingga peringatan terakhir!", max: 3})
				cht.delete()
				break
			case is.antiTagall:
                await cht.warnGc({ type: "antitagall", warn: "Anda terdeteksi melakukan tagall/hidetag. Harap ikuti peraturan disini untuk tidak melakukan tagall/hidetag karena akan mengganggu member disini!", kick:"Anda akan dikeluarkan karena melanggar peraturan grup untuk tidak melakukan tagall/hidetag hingga peringatan terakhir!", max: 3})
				cht.delete()
				break
			case isQuestionCmd:
				if (Date.now() > questionCmd.emit.exp) {
					func.archiveMemories.delItem(cht.sender, "questionCmd")
					return
				}
				let [cmd, ...q] = questionCmd.emit.split` `
				cht.cmd = cmd
				cht.q = (q && q.length > 0) ?
					`${q.join(" ")} ${cht.msg?.trim()}`.trim() :
					`${cht.msg?.trim()}`.trim()
				ev.emit(cmd)
				func.archiveMemories.delItem(cht.sender, "questionCmd")
				break
			case isEvalSync:
				if (!is?.owner) return
				if (isDangerous) {
					func.archiveMemories.setItem(cht.sender, "command", cht.msg)
					func.archiveMemories.setItem(cht.sender, "commandExpired", Date.now() + maxCommandExpired)
					return cht.reply("Yakin?")
				}
				try {
					let evsync = await eval(`(async () => { ${cht?.msg?.slice(3)} })()`)
					if (typeof evsync !== 'string') evsync = await util.inspect(evsync)
					cht.reply(evsync)
				} catch (e) {
					cht.reply(String(e))
				}
				break

			case isEval:
				if (!is?.owner) return
				if (isDangerous) {
					func.archiveMemories.setItem(cht.sender, "command", cht.msg)
					func.archiveMemories.setItem(cht.sender, "commandExpired", Date.now() + maxCommandExpired)
					return cht.reply("Yakin?")
				}
				try {
					let evaled = await eval(cht?.msg?.slice(2))
					if (typeof evaled !== 'string') evaled = await util.inspect(evaled)
					if (evaled !== "undefined") {
						cht.reply(evaled)
					}
				} catch (err) {
					cht.reply(String(err))
				}
				break

			case isExec:
				if (!is?.owner) return
				if (isDangerous) {
					func.archiveMemories.setItem(cht.sender, "command", cht.msg)
					func.archiveMemories.setItem(cht.sender, "commandExpired", Date.now() + maxCommandExpired)
					return cht.reply("Yakin?")
				}
				let txt
				try {
					const {
						stdout,
						stderr
					} = await _exec(cht?.msg?.slice(2))
					txt = stdout || stderr
				} catch (error) {
					txt = `Error: ${error}`
				}
				cht.reply(txt)
				break

			case isSwap:
				is?.quoted?.image && delete is.quoted.image
				cht.cmd = "faceswap"
				ev.emit("faceswap")
				break

			case isBella:
				let usr = cht.sender.split("@")[0]
				let user = Data.users[usr]
				let premium = user.premium ? Date.now() < user.premium.time : false
				user.autoai.use += 1
				if (Date.now() >= user.autoai.reset && !premium) {
					user.autoai.use = 0
					user.autoai.reset = Date.now() + parseInt(user.autoai.delay)
					user.autoai.response = false
				}
				if (user.autoai.use > user.autoai.max && !premium) {
					let formatTimeDur = func.formatDuration(user.autoai.reset - Date.now())
					let resetOn = func.dateFormatter(user.autoai.reset, "Asia/Jakarta")
					let txt = `*Limit interaksi telah habis!*\n\n*Waktu tunggu:*\n- ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms\n🗓*Direset Pada:* ${resetOn}\n\n*Ingin interaksi tanpa batas?*\nDapatkan premium!, untuk info lebih lanjut ketik *.premium*`
					if (!user.autoai.response) {
						user.autoai.response = true
						cht.reply(txt)
						return
					} else {
						return
					}
				}

				let chat = cht?.msg?.startsWith(botnickname.toLowerCase()) ? cht?.msg?.slice(botnickname.length) : (cht?.msg || "")
				let isImage = is?.image ? true : is.quoted?.image ? cht.quoted.sender !== Exp.number : false
				if (cht?.type === "audio") {
					try {
						chat = (await transcribe(await cht?.download()))?.text || ""
					} catch (error) {
						console.error("Error transcribing audio:", error)
						chat = ""
					}
				}
				if (isImage) {
					let download = is.image ? cht?.download : cht?.quoted?.download
					isImage = await download()
				}
				chat = func.clearNumbers(chat)
				try {
					let _ai = await ai({
						text: chat,
						id: cht?.sender,
						fullainame: botfullname,
						nickainame: botnickname,
						senderName: cht?.pushName,
						ownerName: ownername,
						date: func.newDate(),
						role: cht?.memories?.role,
						msgtype: cht?.type,
						custom_profile: func.tagReplacer(cfg.logic, {
							botfullname,
							botnickname
						}),
						image: isImage,
						commands: [{
								"description": "Jika perlu direspon dengan suara",
								"output": {
									"cmd": "voice",
									"msg": "Pesan di sini. Gunakan gaya bicara <nickainame> yang menarik dan realistis, lengkap dengan tanda baca yang tepat agar terdengar hidup saat diucapkan.,"
								}
							},
							{
								"description": "Jika dalam pesan ada yang ingin memberikan donasi atau donate",
								"output": {
									"cmd": "donasi",
									"msg": "Isi pesan kamu seperti sedang memberikan metode pembayaran qris untuk donasi"
								}
							},
							{
								"description": "Jika dalam pesan ada link tiktok.com dan lalu diminta untuk mendownloadnya",
								"output": {
									"cmd": "tiktok",
									"cfg": {
										"url": "isi link tiktok yang ada dalam pesan"
									}
								}
							},
							{
								"description": "Jika dalam pesan ada link instagram.com dan diminta untuk mendownloadnya",
								"output": {
									"cmd": "ig",
									"cfg": {
										"url": "isi link instagram yang ada dalam pesan"
									}
								}
							},
							{
								"description": "Jika pesan adalah perintah/permintaan untuk mencarikan sebuah gambar",
								"output": {
									"cmd": "pinterest",
									"cfg": {
										"query": "isi gambar apa yang ingin dicari dalam pesan"
									}
								}
							},
							{
								"description": "Jika pesan adalah perintah untuk membuka/menutup group",
								"output": {
									"cmd": ["opengroup", "closegroup"]
								}
							},
							{
								"description": "Jika pesan adalah perintah untuk menampilkan menu",
								"output": {
									"cmd": "menu"
								}
							},
							{
								"description": "Jika pesan adalah meminta pap atau meminta foto kamu",
								"output": {
									"cmd": "lora",
									"cfg": {
										"prompt": "isi teks prompt yang menggambarkan tentang kamu, prompt yang menghasilkan gambar seolah-olah kamu itu sedang berfoto ((tulis prompt dalam bahasa inggris))"
									}
								}
							},
							{
								"description": "Jika pesan adalah permintaan untuk mencarikan sebuah video",
								"output": {
									"cmd": "ytmp4",
									"cfg": {
										"url": "isi judul video yang diminta"
									}
								}
							},
							{
								"description": "Jika pesan adalah permintaan untuk memutar sebuah lagu",
								"output": {
									"cmd": "ytm4a",
									"cfg": {
										"url": "isi judul lagu yang diminta"
									},
								}
							},
							{
								"description": "Jika pesan adalah permintaan untuk membuatkan gambar",
								"output": {
									"cmd": "txt2img",
									"cfg": {
										"prompt": "isi teks prompt yang menggambarkan gambar yang diinginkan. Tulis dalam bahasa Inggris."
									}
								}
							},
							{
								"description": "Jika dalam pesan ada link pin.it atau pinterest.com dan diminta untuk mendownloadnya",
								"output": {
									"cmd": "pinterestdl",
									"cfg": {
										"url": "isi link instagram yang ada dalam pesan"
									}
								}
							},
							{
								"description": "Jika pesan adalah perintah untuk mendownload menggunakan link youtube",
								"output": {
									"cmd": "ytm4a",
									"cfg": {
										"url": "isi link youtube yang ada dalam pesan"
									}
								}
							}
						]
					})
					let config = _ai?.data || {}
					await func.addAiResponse()
					let noreply = false
					switch (config?.cmd) {
						case 'public':
							if (!is?.owner) return cht.reply("Maaf, males nanggepin")
							global.cfg.public = true
							return cht.reply("Berhasil mengubah mode menjadi public!")
						case 'self':
							if (!is?.owner) return cht.reply("Maaf, males nanggepin")
							global.cfg.public = false
							return cht.reply("Berhasil mengubah mode menjadi self!")
						case 'voice':
						  try{
							cfg.ai_voice = cfg.ai_voice || "bella"
							await Exp.sendPresenceUpdate('recording', cht?.id)
							return Exp.sendMessage(cht?.id, {
								audio: {
									url: `${api.xterm.url}/api/text2speech/elevenlabs?key=${api.xterm.key}&text=${config?.msg}&voice=${cfg.ai_voice}&speed=0.9`
								},
								mimetype: "audio/mpeg",
								ptt: true
							}, {
								quoted: cht
							})
						  } catch (e) {
						     console.log(e.response)
						  }
						case "donasi": 
						  noreply = true
						  return Exp.sendMessage(cht.id, { image: { url: "https://files.catbox.moe/7wqoq2.jpg" }, caption: config?.msg }, { quoted: cht })
						case 'tiktok':
						case 'pinterestdl':
						case 'menu':
						case "ig":
							noreply = true
							is.url = [config?.cfg?.url || ""]
							await cht.reply(config?.msg || "ok")
							return ev.emit(config?.cmd)
						case 'ytm4a':
						case 'ytmp4':
							noreply = true
							cht.cmd = config?.cmd
							is.url = [config?.cfg?.url || ""]
							await cht.reply(config?.msg || "ok")
							return ev.emit(config?.cmd)
						case 'lora':
							noreply = true
							cht.q = `1552[4927]|${config?.cfg?.prompt}|blurry, low quality, low resolution, deformed, distorted, poorly drawn, bad anatomy, bad proportions, unrealistic, oversaturated, underexposed, overexposed, watermark, text, logo, cropped, cluttered background, cartoonish, bad face, double face, abnormal`
							await cht.reply(config?.msg || "ok")
							return ev.emit("txt2img")
						case 'txt2img':
							cht.q = (config?.cfg?.prompt || "")
							await cht.reply(config?.msg || "ok")
							return ev.emit("dalle3")
						case 'pinterest':
							noreply = true
							await cht.reply(config?.msg || "ok")
							cht.q = config?.cfg?.query || ""
							return ev.emit(config?.cmd)
						case 'closegroup':
							noreply = true
							cht.q = "close"
							return ev.emit("group")
						case 'opengroup':
							noreply = true
							cht.q = "open"
							return ev.emit("group")
					}

					if (config?.energy && cfg.ai_interactive.energy) {
						let conf = {}
						conf.energy = /[+-]/.test(`${config.energy}`) ? `${config.energy}` : `+${config.energy}`
						if (conf.energy.startsWith("-")) {
							conf.action = "reduceEnergy"
						} else {
							conf.action = "addEnergy"
						}
						await func.archiveMemories[conf.action](cht?.sender, parseInt(conf.energy.slice(1)))
						await cht.reply(config.energy + " Energy⚡️")
						config.energyreply = true
					}
					if (config?.cmd !== "voice" && !noreply) {
						const method = cfg.editmsg && config?.energyreply ? "edit" : "reply";
						if (config?.msg) {
				          await cht[method](config.msg, keys[cht.sender]);
				        }

					}
				} catch (error) {
					console.error("Error parsing AI response:", error)
				}
				break
		}

	} catch (error) {
		console.error("Error in Interactive:", error)
	}
}