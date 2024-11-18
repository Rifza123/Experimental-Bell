const { getContentType } = "baileys".import()

export default 
async function utils({ Exp, cht, is, store }) {
    try {
        Object.assign(is, {
            owner: false,
            group: false,
            me: false,
            baileys: false,
            botMention: false,
            cmd: null,
            sticker: false,
            audio: false,
            image: false,
            video: false,
            document: false,
            url: null,
            memories: null,
            quoted: null,
        })
        
        const sender = cht?.participant || cht?.key?.participant || cht?.key?.remoteJid || Exp?.user?.id || ''
        cht.sender = await Exp.func['getSender'](sender)
        cht.delete = async () => Exp.sendMessage(cht.id, { delete: cht.key }).then(a => undefined)
        
        const type = getContentType(cht?.message)
        const msgType = type === "extendedTextMessage" ? getContentType(cht?.message?.extendedTextMessage) : type
        cht.type = Exp.func['getType'](msgType) || type

        cht.quoted = cht?.message?.[type]?.contextInfo?.quotedMessage || false

        cht.msg = (cht.id === "status@broadcast") 
            ? null 
            : ([
               { type: 'conversation', msg: cht?.message?.conversation },
               { type: 'extendedTextMessage', msg: cht?.message?.extendedTextMessage?.text },
               { type: 'imageMessage', msg: cht?.message?.imageMessage?.caption },
               { type: 'videoMessage', msg: cht?.message?.videoMessage?.caption },
               { type: "interactiveResponseMessage", msg: cht?.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson 
                    ? JSON.parse(cht.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id 
                    : null }
            ].find(entry => type === entry.type)?.msg) || null

        cht.prefix = /^[.#‽٪]/.test(cht.msg) ? cht?.msg?.match(/^[.#‽٪]/gi) : '#'
        global.prefix = cht.prefix

        cht.cmd = cht?.msg?.startsWith(cht.prefix) ? cht?.msg?.slice(1)?.toLowerCase()?.trim()?.split(/ +/).shift() : null

        cht.memories = await Exp.func.archiveMemories.get(cht.sender)

        cht.download = async () => Exp.func.download(cht?.message?.[type], cht.type)

        cht[cht.type] = cht?.message?.[type]

		if(cht.type == "reactionMessage"){
		  let react = await store.loadMessage(cht.id, cht[cht.type].key.id)
		  let rtype = getContentType(react?.message)
		  let mtype = Exp.func['getType'](rtype)
		  let rtext = rtype == "conversation" ? react.message[rtype]
              : rtype === 'extendedTextMessage' ? react.message[rtype]?.text
              : (rtype === 'imageMessage' || rtype === 'videoMessage') ? react.message[rtype]?.caption 
              : (type === "interactiveResponseMessage") ? JSON.parse(react?.message?.[rtype]?.nativeFlowResponseMessage?.paramsJson)?.id : null
		  cht.reaction = {
		    key: cht[cht.type]?.key,
		    emoji: cht[cht.type]?.text,
		    mtype,
		    text: rtext,
		    url: rtext?.match(/https?:\/\/[^\s]+/g)?.flatMap(url => url.match(/https?:\/\/[^\s)]+/g) || []) ?? [],
		    mention: await Exp.func['getSender'](react?.participant || react?.key?.participant || react?.key?.remoteJid ),
            download: async () => Exp.func.download(react?.message?.[rtype], mtype),
            delete: async () => Exp.sendMessage(cht.id, { delete: cht[cht.type]?.key }),
		  }
		  cht.reaction[mtype] = react?.message?.[rtype]
		}
		
        if (cht.quoted) {
            const quotedParticipant = cht?.message?.[type]?.contextInfo?.participant
            cht.quoted.sender = await Exp.func['getSender'](quotedParticipant)
            cht.quoted.mtype = Object.keys(cht.quoted)[0]
            cht.quoted.type = Exp.func['getType'](cht.quoted.mtype)
            cht.quoted.memories = await Exp.func.archiveMemories.get(cht.quoted.sender)
            cht.quoted.text = cht?.quoted?.[type]?.text || cht?.quoted?.conversation || false
            cht.quoted.url = cht?.quoted?.text ? cht?.quoted?.text?.match(/https?:\/\/[^\s]+/g)?.flatMap(url => url.match(/https?:\/\/[^\s)]+/g) || []) ?? [] : null
            cht.quoted[cht.quoted.type] = cht?.quoted?.[cht.quoted.mtype]
            cht.quoted.download = async () => Exp.func.download(cht.quoted?.[cht.quoted.type], cht.quoted.type)
            cht.quoted.stanzaId = cht?.message?.[type]?.contextInfo?.stanzaId
            cht.quoted.delete = async () => Exp.sendMessage(cht.id, { delete: { ...(await store.loadMessage(cht.id, cht.quoted.stanzaId)).key, participant: cht.quoted.sender }})
           
        }

        const args = cht?.msg?.trim()?.split(/ +/)?.slice(1)
        let q = args?.join(' ')
        cht.args = q
        cht.q = (String(q || cht?.quoted?.text || '')).trim()
        cht.mention = q && (cht.q.extractMentions()).length > 0
           ? cht.q.extractMentions()
              : cht?.message?.[type]?.contextInfo?.mentionedJid?.length > 0
                 ? cht.message[type].contextInfo.mentionedJid
                    : cht?.message?.[type]?.contextInfo?.participant
                       ? [cht.message[type].contextInfo.participant]
                         : []

        Exp.number = Exp?.user?.id?.split(':')[0] + from.sender

        is.group = cht.id?.endsWith(from.group)
        is.me = cht?.key?.fromMe
        is.owner =  global.owner.some(a => { const jid = a?.split("@")[0]?.replace(/[^0-9]/g, ''); return jid && (jid + from.sender === cht.sender) }) || is.me
		const groupDb = is.group ? Data.preferences[cht.id] : {}

        is.baileys = ["3EB","BAE5","BELL409","B1E"].some(a => cht?.key?.id.startsWith(a))
        is.botMention = cht?.mention?.includes(Exp.number)
        is.cmd = cht.cmd
        is.sticker = cht.type === "sticker"
        is.audio = cht.type === "audio"
        is.image = cht.type === "image"
        is.video = cht.type === "video"
        is.document = cht.type === "document"
        is.url = cht?.msg?.match(/https?:\/\/[^\s]+/g)?.flatMap(url => url.match(/https?:\/\/[^\s)]+/g) || []) ?? []
        is.mute = groupDb?.mute && !is.owner

        if (is.group) {
            const groupMetadata = await Exp.func.getGroupMetadata(cht.id,Exp)
            Exp.groupMetdata = groupMetadata
            Exp.groupMembers = groupMetadata.participants
            Exp.groupName = groupMetadata.subject
            Exp.groupAdmins = Exp.func.getGroupAdmins(groupMetadata.participants)
            is.botAdmin = Exp.groupAdmins.includes(Exp.number)
            is.groupAdmins = Exp.groupAdmins.includes(cht.sender)
        }
	    is.antibot = groupDb.antibot && !is.owner && !is.admin && is.baileys && is.botAdmin

        is.memories = cht.memories
        is.quoted = cht.quoted
        is.reaction = cht.reaction
        
        cht.reply = async function (text, etc={},quoted={ quoted: true }) {
          try {
            if(quoted?.quoted){
              quoted.quoted = cht?.reaction ? {
               key: {
                 fromMe: cht.key.fromMe,
                 participant: cht.sender
               },
               message: {
                conversation: cht.reaction.emoji,
               }
	   		  } : cht
	   		}
              
            const { key } = await Exp.sendMessage(cht.id, { text, ...etc }, quoted)
            keys[cht.sender] = key
            return { key }
          } catch (e) {
            console.error("Error in 'cht.reply'\n"+e)
          }
        }
        
        cht.replyWithTag = async function (text, tag) {
          try {
            const { key } = await Exp.sendMessage(cht.id, { text: Exp.func.tagReplacer(text, tag) }, { quoted: cht })
            keys[cht.sender] = key
            return { key }
          } catch (e) {
            console.error("Error in 'cht.replyWithTag'\n"+e)
          }
        }

        cht.edit = async function (text, key) {
          try {
            await Exp.sendMessage(cht.id, { text:text||"...", edit: key }, { quoted: cht })
          } catch (e) {
            console.error("Error in 'cht.edit'\n"+e)
          }
        }

    } catch (error) {
        console.error("Error in utils:", error)
    }
    return
}
