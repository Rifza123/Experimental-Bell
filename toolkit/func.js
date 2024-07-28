const { jidDecode, downloadContentFromMessage } = 'baileys'.import()
const fs = "fs".import()
const axios = "axios".import()
const https = 'https'.import()
const moment = "timezone".import()
const os = await "os".import()
const process = await "process".import()
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
const { ArchiveMemories } = await (fol[0] + "usr.js").r()
const { color, bgcolor } = await './toolkit/color.js'.r()

export class func {
    static async getSender(jid) {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let { user, server } = jidDecode(jid) || {}
            return user && server ? `${user}@${server}` : jid
        } else return jid
    }

    static getType(type) {
        return type === 'stickerMessage' ? 'sticker' :
               type === 'videoMessage' ? 'video' :
               type === 'liveLocationMessage' ? 'liveLocation' :
               type === 'locationMessage' ? 'location' :
               type === 'documentMessage' ? 'document' :
               type === 'audioMessage' ? 'audio' :
               type === 'imageMessage' ? 'image' :
               type === 'viewOnceMessage' ? 'viewOnce' :
               type
    }

    static getGroupAdmins(participants) {
        return participants.filter(participant => participant.admin !== null).map(participant => participant.id)
    }
    
    static async downloadSave(message, filename) {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)

        let buffer = Buffer.from([])        
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        
        let trueFileName = filename
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    static async download(message, MessageType) {
        const stream = await downloadContentFromMessage(message, MessageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }
    
    static tagReplacer(text, obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                text = this.tagReplacer(text, obj[key])
            } else if (typeof obj[key] === 'string') {
                const regex = new RegExp(`\\<${key}\\>`, 'g')
                text = text.replace(regex, obj[key])
            }
        }
        return text
    }
    
    static menuFormatter(data, frames, tags) {
        const normalizedData = {}
        Object.values(data).forEach(item => {
            const tag = item.tag
            if (!normalizedData[tag]) {
                normalizedData[tag] = new Set()
            }
            if (Array.isArray(item.listmenu)) {
                item.listmenu.forEach(menu => normalizedData[tag].add(menu))
            } else {
                normalizedData[tag].add(item.listmenu)
            }
        })

        Object.keys(normalizedData).forEach(tag => {
            normalizedData[tag] = Array.from(normalizedData[tag])
        })

        const generateOutput = (data,  { frames, tags, prefix }) => {
            let result = ''
            Object.keys(tags).forEach(tag => {
                if (data[tag] && data[tag].length > 0) {
                    result += `${frames.head}${frames.brackets[0]} ${tags[tag]} ${frames.brackets[1]}\n`
                    data[tag].forEach(menu => {
                        result += `${frames.body} ${prefix||"."}${menu}\n`
                    })
                    result += `${frames.foot}\n\n`
                }
            })
            return result.trim()
        }

        return generateOutput(normalizedData, frames, tags)
    }
    
    
   static getTotalCmd = () => {
		return JSON.parse(JSON.stringify(Data.use.cmds, null, 2))
   }
	
   static addCmd = () => {
		Data.use.cmds.total += 1
		fs.writeFileSync('./toolkit/db/cmd.json', JSON.stringify(Data.use.cmds, null, 2))
	}
   
   static addAiResponse = () => {
		Data.use.cmds.ai_response += 1
		fs.writeFileSync('./toolkit/db/cmd.json', JSON.stringify(Data.use.cmds, null, 2))
	}
	
   static addCMDForTop = async(NAMEQ) => {
		try {
			let cekhN = Data.use.cmds.cmd.find(i => i.name == NAMEQ) || false
			if (cekhN) {
				let cemed = Data.use.cmds.cmd.find(i => i.name == NAMEQ)
				var ussd = Data.use.cmds.cmd.indexOf(cemed)
				Data.use.cmds.cmd[ussd].use += 1
				Data.use.cmds.cmd[ussd].times = time
				fs.writeFileSync('./toolkit/db/cmd.json', JSON.stringify(Data.use.cmds, null, 2))
			} else {
				Data.use.cmds.cmd.push({
					name: NAMEQ,
					use: 1,
					times: time
				})
				await fs.writeFileSync('./toolkit/db/cmd.json', JSON.stringify(Data.use.cmds, null, 2))
			}
		} catch (e) {
			console.error(e)
		}
	}
    
    static cmds = () => {
		return Object.entries(Data.use.cmds.cmd).sort((a, b) => b[1].use - a[1].use)
	}
	
	static topCmd = (i = 10) => {
		const LIST_TOP = this.cmds().slice(0, i).map(([name, data]) => `${prefix}${data.name}(${data.use}) || ${data.times}`)
		return LIST_TOP
	}
	static getBuffer = async (url, options) => {
      return new Promise((resolve, reject) => {
        const chunks = []

        const stream = https.get(url, (response) => {
            response.on("data", (chunk) => {
                chunks.push(chunk)
            })

            response.on("end", () => {
                const buffer = Buffer.concat(chunks)
                resolve(buffer)
            })

            response.on("error", (error) => {
                reject(error)
            })
        })

        stream.on("error", (error) => {
            reject(error)
        })
      })
    }
    
    static compareTwoStrings(first, second) {
        first = first.replace(/\s+/g, '')
        second = second.replace(/\s+/g, '')

        if (first === second) return 1 
        if (first.length < 2 || second.length < 2) return 0

        let firstBigrams = new Map()
        for (let i = 0; i < first.length - 1; i++) {
            const bigram = first.substring(i, i + 2)
            const count = firstBigrams.has(bigram)
                ? firstBigrams.get(bigram) + 1
                : 1

            firstBigrams.set(bigram, count)
        }

        let intersectionSize = 0
        for (let i = 0; i < second.length - 1; i++) {
            const bigram = second.substring(i, i + 2)
            const count = firstBigrams.has(bigram)
                ? firstBigrams.get(bigram)
                : 0

            if (count > 0) {
                firstBigrams.set(bigram, count - 1)
                intersectionSize++
            }
        }

        return (2.0 * intersectionSize) / (first.length + second.length - 2)
    }

    static areArgsValid(mainString, targetStrings) {
        if (typeof mainString !== 'string') return false
        if (!Array.isArray(targetStrings)) return false
        if (!targetStrings.length) return false
        if (targetStrings.find(function (s) { return typeof s !== 'string' })) return false
        return true
    }

    static findBestMatch(mainString, targetStrings) {
        if (!this.areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings')

        const ratings = []
        let bestMatchIndex = 0

        for (let i = 0; i < targetStrings.length; i++) {
            const currentTargetString = targetStrings[i]
            const currentRating = this.compareTwoStrings(mainString, currentTargetString)
            ratings.push({ target: currentTargetString, rating: currentRating })
            if (currentRating > ratings[bestMatchIndex].rating) {
                bestMatchIndex = i
            }
        }

        const bestMatch = ratings[bestMatchIndex]

        return { ratings: ratings, bestMatch: bestMatch, bestMatchIndex: bestMatchIndex }
    }

    static searchSimilarStrings = async(query, data, threshold) => {
        return data.map((item, index) => {
            const similarity = this.compareTwoStrings(query, item.toLowerCase())
            return { item, similarity, index }
        }).filter(result => result.similarity >= threshold)
    }
    
    static newDate = () => {
        const now = moment.tz('Asia/Jakarta')
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const indoMonthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

        const dayName = dayNames[now.day()] 
        const indoDayName = dayNames[now.day()] 
        const indoMonthName = indoMonthNames[now.month()]
        const dayNumber = now.format('DD') 
        const year = now.format('YYYY') 
        const formattedTime = now.format('HH:mm:ss') 

        const wetonIndex = (now.day() + now.month() + now.year()) % 5
        const wetonNames = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']
        const wetonJawa = wetonNames[wetonIndex]

        const combinedResult = `${indoDayName} ${wetonJawa}, ${dayNumber} ${indoMonthName} ${year}, ${formattedTime}`
        return combinedResult
    }
    
    static archiveMemories = ArchiveMemories
    
    static dateFormatter = (time, timezone) => {
        const validTimezones = ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura']
        if(!validTimezones.includes(timezone)) return `Timezone invalid!, Look this: ${validTimezones.join(", ")}`
        const formatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: timezone || "Asia/Jakarta"
        })

        const date = new Date(time)
        return formatter.format(date)
    }
    static logMessage = (type, id, pushName, message) => {
        const form = bgcolor(`[ ${type} ]`, type === 'PRIVATE' ? 'yellow' : 'gray')
        return `${form} From: ${color(id, 'cyan')} | User: ${color(pushName, 'cyan')} | Msg: ${color(message, 'green')}`
    }
    static formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B'
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB'
        else return (bytes / 1073741824).toFixed(2) + ' GB'
    }
    
    static formatDuration(seconds) {
        const days = Math.floor(seconds / (24 * 3600))
        const hours = Math.floor((seconds % (24 * 3600)) / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = Math.floor(seconds % 60)
        const millis = Math.floor((seconds - Math.floor(seconds)) * 1000)
        return {
            days,
            hours,
            minutes,
            seconds: secs,
            milliseconds: millis
        }
    }

    static async getSystemStats() {
        const cpus = os.cpus()
        const cpuUsage = cpus.map((cpu, index) => {
            const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0)
            const idle = cpu.times.idle
            const usage = ((total - idle) / total) * 100
            return {
                cpu: index,
                model: cpu.model,
                speed: cpu.speed,
                usage: usage.toFixed(2) + '%'
            }
        })

        const totalMemory = os.totalmem()
        const freeMemory = os.freemem()
        const memoryUsage = {
            totalMemory: this.formatBytes(totalMemory),
            freeMemory: this.formatBytes(freeMemory),
            usedMemory: this.formatBytes(totalMemory - freeMemory)
        }
        
        const uptime = process.uptime();
        const processStats = {
            pid: process.pid,
            title: process.title,
            execPath: process.execPath,
            memoryUsage: {
                rss: this.formatBytes(process.memoryUsage().rss),
                heapTotal: this.formatBytes(process.memoryUsage().heapTotal),
                heapUsed: this.formatBytes(process.memoryUsage().heapUsed),
                external: this.formatBytes(process.memoryUsage().external)
            },
            runtime: this.formatDuration(uptime)
        }

        return {
            cpuUsage,
            memoryUsage,
            processStats
        }
    }
    
    static clearNumbers(text) {
        if(!text) return
        [
            /@\u2068\u202e\d+~\u2069/g,
            /@\d+/g,
            /@\(\d+\)/g,
            /@<\d+>/g
        ].forEach((pattern) => {
            text = text?.replace(pattern, '')
        })

        return text;
    }
}
