/*!-======[ Default Export Function ]======-!*/
const { default:gtts } = await (fol[2] + "gtts.js").r()
const { exec } = "child".import()
const fs = "fs".import()

const leanguages = {
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'ca': 'Catalan',
  'zh': 'Chinese',
  'zh-cn': 'Chinese (Mandarin/China)',
  'zh-tw': 'Chinese (Mandarin/Taiwan)',
  'zh-yue': 'Chinese (Cantonese)',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'en-au': 'English (Australia)',
  'en-uk': 'English (United Kingdom)',
  'en-us': 'English (United States)',
  'eo': 'Esperanto',
  'fi': 'Finnish',
  'fr': 'French',
  'de': 'German',
  'el': 'Greek',
  'ht': 'Haitian Creole',
  'hi': 'Hindi',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'id': 'Indonesian',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'la': 'Latin',
  'lv': 'Latvian',
  'mk': 'Macedonian',
  'no': 'Norwegian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'pt-br': 'Portuguese (Brazil)',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sr': 'Serbian',
  'sk': 'Slovak',
  'es': 'Spanish',
  'es-es': 'Spanish (Spain)',
  'es-us': 'Spanish (United States)',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'ta': 'Tamil',
  'th': 'Thai',
  'tr': 'Turkish',
  'vi': 'Vietnamese',
  'cy': 'Welsh'
}

export default async function on({ Exp, ev, store, cht, ai, is }) {
    let config = new URLSearchParams({ speed: 1, pitch: 0.55 })
    let txtreply = `List voice models:\n${Data.voices.join("\n")}\nContoh: _.elevenlabs prabowo|halo_`	

    let txtreply2 = `List leanguage:\n${Object.keys(leanguages).map(a => "- "+a+" [ "+ leanguages[a] +" ]").join("\n")}\n\nContoh: _.gtts id|halo_`	

    let { sender, id } = cht
    ev.on({ 
        cmd: Data.voices.map(a => a.toLowerCase()), //tambah voice di global.js
        listmenu: Data.voices,
        energy: 15,
        args: "Harap sertakan teks untuk diucapkan!",
        tag: "tts"
    }, async() => {
        await Exp.sendPresenceUpdate('recording', cht.id);
        let v = cht.cmd.startsWith("bell") ? "bella" : cht.cmd == "myka" ? "Myka" : cht.cmd
        Exp.sendMessage(id, { audio: { url: `${api.xterm.url}/api/text2speech/elevenlabs?voice=${v}&key=${api.xterm.key}&text=${cht.q}&${config}`}, mimetype: "audio/mpeg", ai: true }, { quoted: cht })
	})
   
	ev.on({ 
        cmd: ['elevenlabs'],
        listmenu: ['elevenlabs'],
        energy: 15,
        args: txtreply,
        tag: "tts"
    }, async() => {
        let [voice,text] = cht.q.split("|")
        if(!Data.voices.includes(voice)) return cht.reply(txtreply)
        if(!text) return cht.reply(txtreply)
        await Exp.sendPresenceUpdate('recording', cht.id);
        Exp.sendMessage(id, { audio: { url: `${api.xterm.url}/api/text2speech/elevenlabs?voice=${voice}&key=${api.xterm.key}&text=${text}`}, mimetype: "audio/mpeg", ai: true }, { quoted: cht })
	})
	
	ev.on({ 
        cmd: ['gtts'],
        listmenu: ['gtts'],
        energy: 1,
        args: txtreply2,
        tag: "tts"
    }, async() => {
        let [voice,text] = cht.q.split("|")
        if(!(voice in leanguages)) return cht.reply(txtreply2)
        if(!text) return cht.reply(txtreply2)
        await Exp.sendPresenceUpdate('recording', cht.id)
        let tts = gtts(voice)
        let name = `${Math.random()}.mp3`
        let output = `${Math.random()}.opus`
        await tts.save(name, text, function(){
          exec(`ffmpeg -i ${name} -ar 48000 -vn -c:a libopus ${output}`, async () => {
            await Exp.sendMessage(cht.id, { audio: { url: "./"+output }, mimetype: "audio/mpeg" })
            await fs.unlinkSync(name)
            fs.unlinkSync(output)
          })
        })
	})
}