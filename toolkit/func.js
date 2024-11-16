const { jidDecode, downloadContentFromMessage, generateWAMessageContent } = 'baileys'.import()
const fs = "fs".import()
const axios = "axios".import()
const https = 'https'.import()
const moment = "timezone".import()
const os = await "os".import()
const process = await "process".import()
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
const { ArchiveMemories } = await (fol[0] + "usr.js").r()
const { color, bgcolor } = await `${fol[0]}color.js`.r()
const Jimp = (await "jimp".import()).default
const cache = new Map();
const CACHE_DURATION = 1 * 60 * 1000;

export class func {
    constructor({ Exp, store }) {
        this.Exp = Exp
        this.store = store;
    }
    async getSender(jid) {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let { user, server } = jidDecode(jid) || {}
            return user && server ? `${user}@${server}` : jid
        } else return jid
    }

    getType = (type) => {
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

    getGroupAdmins = (participants) => {
        return participants.filter(participant => participant.admin !== null).map(participant => participant.id)
    }
    
    getGroupMetadata = async (chtId, Exp) => {
        const currentTime = Date.now();
        if (cache.has(chtId) && (currentTime - cache.get(chtId).timestamp < CACHE_DURATION)) {
            return cache.get(chtId).metadata;
        }
        const groupMetadata = await Exp.groupMetadata(chtId);
        cache.set(chtId, {
            metadata: groupMetadata,
            timestamp: currentTime
        });
        if (cache.size > 100) {
            const keysToRemove = [...cache.keys()].slice(0, cache.size - 100);
            keysToRemove.forEach(key => cache.delete(key));
        }
        return groupMetadata;
    };
    
    async downloadSave(message, filename) {
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

    async download(message, MessageType) {
        const stream = await downloadContentFromMessage(message, MessageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }
    
    tagReplacer(text, obj) {
        return text.replace(/<([^>]+)>/g, (_, tag) => {
            return obj[tag] !== undefined ? obj[tag] : `<${tag}>`;
        });
    }

    
    menuFormatter(data, frames, tags) {
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
    
    
   getTotalCmd = () => {
		return JSON.parse(JSON.stringify(Data.use.cmds, null, 2))
   }
	
   addCmd = () => {
		Data.use.cmds.total += 1
		fs.writeFileSync(`${fol[5]}cmd.json`, JSON.stringify(Data.use.cmds, null, 2))
	}
   
   addAiResponse = () => {
		Data.use.cmds.ai_response += 1
		fs.writeFileSync(`${fol[5]}cmd.json`, JSON.stringify(Data.use.cmds, null, 2))
	}
	
   addCMDForTop = async(NAMEQ) => {
		try {
			let cekhN = Data.use.cmds.cmd.find(i => i.name == NAMEQ) || false
			if (cekhN) {
				let cemed = Data.use.cmds.cmd.find(i => i.name == NAMEQ)
				var ussd = Data.use.cmds.cmd.indexOf(cemed)
				Data.use.cmds.cmd[ussd].use += 1
				Data.use.cmds.cmd[ussd].times = time
				fs.writeFileSync(`${fol[5]}cmd.json`, JSON.stringify(Data.use.cmds, null, 2))
			} else {
				Data.use.cmds.cmd.push({
					name: NAMEQ,
					use: 1,
					times: time
				})
				await fs.writeFileSync(`${fol[5]}cmd.json`, JSON.stringify(Data.use.cmds, null, 2))
			}
		} catch (e) {
			console.error(e)
		}
	}
    
    cmds = () => {
		return Object.entries(Data.use.cmds.cmd).sort((a, b) => b[1].use - a[1].use)
	}
	
	topCmd = (i = 10) => {
		const LIST_TOP = this.cmds().slice(0, i).map(([name, data]) => `${prefix}${data.name}(${data.use}) || ${data.times}`)
		return LIST_TOP
	}
	getBuffer = async (url, options) => {
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
    
    compareTwoStrings(first, second) {
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

    areArgsValid(mainString, targetStrings) {
        if (typeof mainString !== 'string') return false
        if (!Array.isArray(targetStrings)) return false
        if (!targetStrings.length) return false
        if (targetStrings.find(function (s) { return typeof s !== 'string' })) return false
        return true
    }

    findBestMatch(mainString, targetStrings) {
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

    searchSimilarStrings = async(query, data, threshold) => {
        return data.map((item, index) => {
            const similarity = this.compareTwoStrings(query, item.toLowerCase())
            return { item, similarity, index }
        }).filter(result => result.similarity >= threshold)
    }
    
    getTopSimilar = (arr) => arr.reduce((highest, item) => item.similarity > highest.similarity ? item : highest, { similarity: -Infinity })
    
    newDate = () => {
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
    
    archiveMemories = ArchiveMemories
    toZeroIfInfinity(value) {
    return Number.isFinite(value) ? value : 0;
  }

  parseNumber(milliseconds) {
    return {
      days: Math.trunc(milliseconds / 86_400_000),
      hours: Math.trunc(milliseconds / 3_600_000 % 24),
      minutes: Math.trunc(milliseconds / 60_000 % 60),
      seconds: Math.trunc(milliseconds / 1000 % 60),
      milliseconds: Math.trunc(milliseconds % 1000),
      microseconds: Math.trunc(this.toZeroIfInfinity(milliseconds * 1000) % 1000),
      nanoseconds: Math.trunc(this.toZeroIfInfinity(milliseconds * 1e6) % 1000),
    };
  }

  parseBigint(milliseconds) {
    return {
      days: milliseconds / 86_400_000n,
      hours: milliseconds / 3_600_000n % 24n,
      minutes: milliseconds / 60_000n % 60n,
      seconds: milliseconds / 1000n % 60n,
      milliseconds: milliseconds % 1000n,
      microseconds: 0n,
      nanoseconds: 0n,
    };
  }

   formatDuration = (milliseconds) => {
      switch (typeof milliseconds) {
        case 'number': {
          if (Number.isFinite(milliseconds)) {
            return this.parseNumber(milliseconds);
          }
          break;
        }

        case 'bigint': {
          return this.parseBigint(milliseconds);
        }
      }

      throw new TypeError('Expected a finite number or bigint');
   }
    getRandomValue = (min, max) => min + Math.random() * (max - min);
    
    dateFormatter = (time, timezone) => {
        const validTimezones = ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura']
        if (!validTimezones.includes(timezone)) {
             return `Timezone invalid!, Look this: ${validTimezones.join(", ")}`
        }
        const options = { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
        const formatter = new Intl.DateTimeFormat('en-GB', options)
        const parts = formatter.formatToParts(new Date(time))

        const day = parts.find(part => part.type === 'day').value
        const month = parts.find(part => part.type === 'month').value
        const year = parts.find(part => part.type === 'year').value
        const hours = parts.find(part => part.type === 'hour').value
        const minutes = parts.find(part => part.type === 'minute').value
        const seconds = parts.find(part => part.type === 'second').value

        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
        return formattedDate
    }

    logMessage = (type, id, pushName, message) => {
        const form = bgcolor(`[ ${type} ]`, type === 'PRIVATE' ? 'orange' : 'gray')
        return `${form} From: ${color(id, 'cyan')} | User: ${color(pushName, 'cyan')} | Msg: ${color(message, 'green')}`
    }
    formatBytes = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB'
        else return (bytes / 1073741824).toFixed(2) + ' GB'
    }
    

    getSystemStats = async() => {
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
        
        const uptime = process.uptime() * 1000;
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
            speed: (performance.now() - performance.now()).toFixed(6) * -1,
            runtime: this.formatDuration(uptime)
        }

        return {
            cpuUsage,
            memoryUsage,
            processStats
        }
    }
    
    clearNumbers = (text) => {
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
    
   parseTimeString = (timeStr) => {
        const timeUnits = {
            's': 1000,
            'second': 1000,
            'seconds': 1000,
            'detik': 1000,
            'm': 60000,
            'minute': 60000,
            'minutes': 60000,
            'menit': 60000,
            'h': 3600000,
            'hour': 3600000,
            'hours': 3600000,
            'jam': 3600000,
            'd': 86400000,
            'day': 86400000,
            'days': 86400000,
            'hari': 86400000,
            'w': 604800000,
            'week': 604800000,
            'weeks': 604800000,
            'minggu': 604800000,
            'mo': 2592000000,
            'month': 2592000000,
            'bulan': 2592000000,
            'y': 31536000000,
            'year': 31536000000,
            'tahun': 31536000000
        };

        const regex = /(\d+)\s*(second|seconds|detik|minute|minutes|menit|hour|hours|jam|day|days|hari|week|weeks|minggu|month|mo|bulan|year|years|tahun|s|m|h|d|w|y)/gi;
        let totalMilliseconds = 0;
        let matches;
        let matchFound = false;
        while ((matches = regex.exec(timeStr)) !== null) {
            matchFound = true;
            const value = parseInt(matches[1]);
            if (isNaN(value)) {
                return false;
            }
            const unit = matches[2].toLowerCase();
            if (!timeUnits[unit]) {
                return false;
            }
            totalMilliseconds += value * timeUnits[unit];
        }
        if (!matchFound || totalMilliseconds === 0 || isNaN(totalMilliseconds)) {
            return false;
        }
        return totalMilliseconds;
   }
   getRandomItem = (items) => {
       const random = Math.random()
       let cumulativeProbability = 0

       for (const [item, probability] of Object.entries(items)) {
           cumulativeProbability += probability
           if (random < cumulativeProbability) {
               return item
           }
       }
   }
   
  handleSessionExpiry = ({ usr, cht, session, time }) => {
    setTimeout(() => {
      if(session == "faceswap") {
        let swps = Data.users[usr]?.fswaps || { list: [], last: Date.now() };
        let expiredSwap = (Date.now() - swps.last) >= time;
          if (expiredSwap) {
            delete Data.users[usr].fswaps;
            cht.reply("Sesi faceswap telah berakhir");
          }
      }
    }, parseInt(time) + 10000);
  }
  
  rgbaToHex(r, g, b, a = 1) {
    let hex = '#' + [r, g, b].map(component => {
      return component.toString(16).padStart(2, '0');
    }).join('');
    if (a < 1) {
      let alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
      hex += alphaHex;
    }
    return hex;
  }

  hexToRgba(hex) {
    hex = hex.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }
  
  getName(id) {
    return (Object.values(this.store.messages).flatMap(a => a.array).filter(a => a.key?.participant == id.extractMentions()?.[0])?.[0]?.pushName || id.split("@")[0])
  }
  
  async uploadToServer(url, type="image") {
    return Object.values(await generateWAMessageContent({ [type]: { url }, }, { upload: this.Exp.waUploadToServer }))[0]
  }
  
  findValue(searchKey, text) {
    const formattedText = text.replace(/(\w+):\s*([^\n]+)/g, (match, key, value) => `${key.toLowerCase()}: ${value}`);
    const regex = new RegExp(`${searchKey.toLowerCase()}:\\s*([\\s\\S]*?)(?=\\n\\w+:|$)`, 'i');
    const match = formattedText.match(regex);
    return match ? match[1].trim() : null;
  }

}
