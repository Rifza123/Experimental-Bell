let ghurl = "https://raw.githubusercontent.com/Rifza123/lib/refs/heads"

let raw = {
  tebakgambar: ghurl + "/main/db/game/tebakgambar.json",
  susunkata: ghurl + "/main/db/game/susunkata.json",
  family100: ghurl + "/main/db/game/family100.json",
  
}

global.timeouts = global.timeouts || {}
cfg.hadiah = cfg.hadiah || {

 /* Set hadiah bukan disini tapi di config.json ya
   ini buat antisipasi aja kalo belum update config.json
 */
   
  tebakgambar: 35,
  susunkata: 25,
  family100: 75
}

export default 
async function on({Exp, cht, ev }) {
    const { id } = cht
    const { func } = Exp
    
    let metadata = Data.preferences[id]
    let game = metadata?.game || false
    if(game){
      let isEnd = Date.now() >= game.endTime
      if(isEnd) delete metadata.game
    }
    
    let hasGame = game ? `*Masih ada game yang aktif disini!*

- Game: ${game.type}
- Start Time: ${func.dateFormatter(game.startTime, "Asia/Jakarta")}
- End Time: ${func.dateFormatter(game.endTime, "Asia/Jakarta")}
- Creator: @${game.creator.id.split("@")[0]}
- Creator Name: ${game.creator.name}

Untuk memulai game baru:
_Tunggu game berakhir atau bisa dengan mengetik .cleargame atau .nyerah_
` : ""

    ev.on({
        cmd: ["tebakgambar"],
        listmenu: ["tebakgambar"],
        tag: "game",
        energy: 10
    }, async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 100
      if("game" in metadata) return cht.reply(hasGame)
      let maxAge = 60000
      Data[cht.cmd] = Data[cht.cmd] || await fetch(raw[cht.cmd]).then(a => a.json())
      let { img:url, answer, desc } = Data[cht.cmd].getRandom()
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender
        },
        id_message: []
      }
      let _key = keys[cht.sender]
      await cht.edit("Starting game...", _key)
      let formatDur = func.formatDuration(maxAge)
      let caption = `*TEBAK GAMBAR*

Apa jawaban dari soal ini

Petunjuk: ${desc}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`
      let { key } = await Exp.sendMessage(id, { image: { url }, caption }, { quoted: cht })
      metadata.game.id_message.push(key.id)
      metadata.game.key = key
      global.timeouts[id] = setTimeout(async()=> {
        delete Data.preferences[id].game
        delete global.timeouts[id]

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`)
      Exp.sendMessage(cht.id, { delete: key })
      }, maxAge)
    });
    
    ev.on({
        cmd: ["susunkata"],
        listmenu: ["susunkata"],
        tag: "game",
        energy: 10
    }, async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 100
      if("game" in metadata) return cht.reply(hasGame)
      let maxAge = 60000
      Data[cht.cmd] = Data[cht.cmd] || await fetch(raw[cht.cmd]).then(a => a.json())
      let { type, question, answer } = Data[cht.cmd].getRandom()
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        answer,
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender
        },
        id_message: []
      }

      let _key = keys[cht.sender]
      await cht.edit("Starting game...", _key)
      let formatDur = func.formatDuration(maxAge)
      let text = `*SUSUN KATA*

Susun ini menjadi kata yang benar

Tipe: ${type}
Kata: ${question}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht })
      metadata.game.id_message.push(key.id)
      metadata.game.key = key
      global.timeouts[id] = setTimeout(async()=> {
        delete Data.preferences[id].game
        delete global.timeouts[id]

        await cht.reply(`*WAKTU HABIS*

Jawaban: ${answer}`)
      Exp.sendMessage(cht.id, { delete: key })
      }, maxAge)
    });
    
    ev.on({
        cmd: ["family100"],
        listmenu: ["family100"],
        tag: "game",
        energy: 10
    }, async () => {
      cfg.hadiah[cht.cmd] = cfg.hadiah[cht.cmd] || 100
      if("game" in metadata) return cht.reply(hasGame)
      let maxAge = 60000 * 5
      Data[cht.cmd] = Data[cht.cmd] || await fetch(raw[cht.cmd]).then(a => a.json())
      let { question, answer } = Data[cht.cmd].getRandom()
      metadata.game = {
        type: cht.cmd,
        startTime: Date.now(),
        endTime: Date.now() + maxAge,
        question,
        answer,
        answered: {},
        energy: cfg.hadiah[cht.cmd],
        creator: {
          name: cht.pushName,
          id: cht.sender
        },
        id_message: []
      }

      let _key = keys[cht.sender]
      await cht.edit("Starting game...", _key)
      let formatDur = func.formatDuration(maxAge)
      let text = `*FAMILY 100*

Pertanyaan: *${question}*

Jawaban:
${answer.map((item, index) => `${index + 1}. ?? ${index == 0 ? "\`TOP SURVEY\`" : ''}`).join("\n")}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, "Asia/Jakarta")}

Hadiah:
${answer.map((item, index) => `${index + 1}. ${index == 0 ? "\`TOP SURVEY\`" : ''} ?? Energy⚡`).join("\n")}

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)

`
      let { key } = await Exp.sendMessage(id, { text }, { quoted: cht })
      metadata.game.id_message.push(key.id)
      metadata.game.key = key
      global.timeouts[id] = setTimeout(async()=> {
        delete Data.preferences[id].game
        delete global.timeouts[id]

        await cht.reply(`*WAKTU HABIS*

Jawaban: 
${answer.map((item, index) => `${index + 1}. ${item} ${index == 0 ? "\`TOP SURVEY\`" : ''} (${((cfg.hadiah[cht.cmd] * (index == 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)`).join("\n")}
`)
        let { answered } = Data.preferences[id].game
        let answeredKey = Object.keys(answered)
        await sleep(1000)
        await Exp.sendMessage(cht.id, { delete: key })
        await sleep(1000)
        if(answeredKey.length > 0){
          await cht.reply("Membagiakan semua hadiah yang didapat....🎁")
          Object.entries(answered).forEach(async([_,___]) => {
            let idx = answer.findIndex(item => item == _)
            let gift = ((cfg.hadiah[type] * (idx === 0 ? 1 : 1.5)) / (idx + 1)).toFixed()
            await func.archiveMemories["addEnergy"](__, gift)
          })
        }
      }, maxAge)
    });
    
    ev.on({
        cmd: ["cleargame"],
        listmenu: ["cleargame"],
        tag: "game"
    }, async () => {
      if((!"game" in metadata)) return cht.reply("Tidak ada game yang aktif disini!")
      await Exp.sendMessage(cht.id, { delete: metadata.game.key })
      clearTimeout(global.timeouts[id])
      delete metadata.game
      delete global.timeouts[id]
      cht.reply("Success✅")
    })
    
    ev.on({
        cmd: ["nyerah"],
        listmenu: ["nyerah"],
        tag: "game"
    }, async () => {
      if((!"game" in metadata)) return cht.reply("Tidak ada game yang aktif disini!")
      if(cht.sender !== game.creator.id) return cht.reply("Hanya creator game yang dapat melaksanakan tindakan ini!")
      await Exp.sendMessage(cht.id, { delete: metadata.game.key })
      clearTimeout(global.timeouts[id])
      cht.reply(`*Anda menyerah!*
Jawaban: 
${Array.isArray(game.answer) ? game.answer.map((item, index) => `${index + 1}. ${item} ${index == 0 ? "\`TOP SURVEY\`" : ''} (${((cfg.hadiah[game.type] * (index == 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)`).join("\n") : game.answer}`)
      delete metadata.game
      delete global.timeouts[id]
    })
}