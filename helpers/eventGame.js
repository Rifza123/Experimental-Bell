function calcMinThreshold(text) {
  const length = text.length;
    if (length <= 4) return 0.3;
    else if (length <= 7) return 0.4;
    else if (length <= 10) return 0.5;
    else return 0.6;
}

export default async function game({ cht, Exp, store, is, ev, chatDb }) {
  let similar = calcMinThreshold(cht.msg)
  
  let metadata = Data.preferences[cht.id]
  let { game } = chatDb
  let { type, question, answer, answered, startTime, endTime, energy, key } = game
  const { func } = Exp
  let isEnd = Date.now() >= endTime
  if(isEnd) {
    delete metadata.game
    return cht.reply("Game itu sudah berakhir!")
  }
  try {
    let formatDur = func.formatDuration(endTime - Date.now())
    switch (type) {
      case "tebakgambar":
      case "susunkata": {
        let userAnswer = cht.msg.trim().toLowerCase()
        if (userAnswer === answer.trim().toLowerCase()) {
          await cht.reply(`Selamat jawabanmu benar💯🥳🥳`)

          let isSmart = Date.now() - startTime < 10000
          let bonusMessage = isSmart
            ? `Hebat😳, Kamu menjawab kurang dari 10 detik!\n\`Bonus x2✅\`\n\n`
            : ""
          let finalEnergy = isSmart ? energy * 2 : energy

          await func.archiveMemories["addEnergy"](cht.sender, finalEnergy)
          await cht.reply(`${bonusMessage}+${finalEnergy} Energy⚡`)

          clearTimeout(timeouts[cht.id])
          Exp.sendMessage(cht.id, { delete: key })
          delete Data.preferences[cht.id].game
          delete timeouts[cht.id]
        } else {
          let { key:Key } = await cht.reply(
            `Jawaban salah!!

Waktu tersisa: ${formatDur.minutes} menit ${formatDur.seconds} detik`
          )
          metadata.game.id_message.push(Key.id)
        }
        break
      }

      case "family100": {
        let _answer = answer.filter(a => cht.msg.length >= a.length)
        cht.msg = (func.getTopSimilar(await func.searchSimilarStrings(cht.msg, answer, similar))).item || "xtermaixyz"
        let userAnswer = cht.msg?.trim()?.toLowerCase()
        let answeredKey = Object.keys(answered)

        if (answered[userAnswer]) {
          return cht.reply(
            `Sudah dijawab oleh @${answered[userAnswer].split("@")[0]}`,
            { mentions: [answered[userAnswer]] }
          )
        }
        let { key: key2 } = await cht.reply("Survey membuktikan!...")
        metadata.game.id_message.push(key2.id)
        let idx = _answer.findIndex(v => v == userAnswer)
        if (idx === -1) {
          let { key:Key } = await cht.reply(`Jawaban tidak valid!`, { edit: key2 })
          metadata.game.id_message.push(Key.id)
        } else {
          answered[userAnswer] = cht.sender
        }        

        let resultText = `*${question}*\n\n` +
          answer
            .map((item, index) => {
              let isAnswered = answered[item]
              return `${index + 1}. ${
                isAnswered ? item : "??"
              } ${index === 0 ? "`TOP SURVEY`" : ""} ${
                isAnswered
                  ? `+(${((cfg.hadiah[type] * (index === 0 ? 1 : 1.5)) / (index + 1)).toFixed()} Energy⚡)\n- _@${
                      isAnswered.split("@")[0]
                    }_`
                  : ""
              }`
            })
            .join("\n")
            
        let isAnswerAll = answer.length == Object.keys(answered).length
        if(!isAnswerAll){
          resultText += `\n\nWaktu tersisa: ${formatDur.minutes} menit ${formatDur.seconds} detik`
        }
        
        let { key:Key } = await cht.reply(resultText, { mentions: Object.values(answered) })
        !isAnswerAll && metadata.game.id_message.push(Key.id)
        if(isAnswerAll) {
          await cht.reply("Game berakhir!\n_Membagiakan semua hadiah yang didapat....🎁_")
          delete Data.preferences[cht.id].game
          Object.entries(answered).forEach(async ([answerKey, user]) => {
            let idx = answer.findIndex(item => item === answerKey);
            if (idx === -1) {
              console.warn(`Jawaban "${answerKey}" tidak ditemukan dalam daftar answer.`);
              return;
            }
            let gift = ((cfg.hadiah[type] * (idx === 0 ? 1 : 1.5)) / (idx + 1)).toFixed();
            await func.archiveMemories["addEnergy"](user, gift);
          })

          clearTimeout(timeouts[cht.id])
        }
        break
      }
    }
  } catch (error) {
    console.error("Error in eventGame.js:", error)
    await cht.reply(`Terjadi kesalahan saat memproses game. Silakan coba lagi nanti.\nError: ${error}`)
  }
}
