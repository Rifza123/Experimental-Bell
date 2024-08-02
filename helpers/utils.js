import jimp from "jimp";

const { func } = await "./toolkit/func.js".r()
const { getBinaryNodeChild, jidNormalizedUser, getContentType } = "baileys".import()

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
        
        Exp.func = func

        const type = getContentType(cht?.message)
        const msgType = type === "extendedTextMessage" ? getContentType(cht?.message?.extendedTextMessage) : type
        cht.type = Exp.func['getType'](msgType)

        const sender = cht?.participant || cht?.key?.participant || cht?.key?.remoteJid || Exp?.user?.id || ''
        cht.sender = await Exp.func['getSender'](sender)

        cht.quoted = cht?.message?.[type]?.contextInfo?.quotedMessage || false

        cht.msg = (cht.id == "status@broadcast") ? null :
            (type === 'conversation' && cht?.message?.conversation) ? cht.message.conversation :
            (type === 'extendedTextMessage') ? cht?.message?.extendedTextMessage?.text :
            (type === 'imageMessage' && cht?.message?.imageMessage?.caption) ? cht.message.imageMessage.caption :
            (type === 'videoMessage' && cht?.message?.videoMessage?.caption) ? cht.message.videoMessage.caption :
            (type === "interactiveResponseMessage") ? JSON.parse(cht?.message?.[type]?.nativeFlowResponseMessage?.paramsJson)?.id : null

        cht.prefix = /^[.#‽٪]/.test(cht.msg) ? cht?.msg?.match(/^[.#‽٪]/gi) : '#'
        global.prefix = cht.prefix

        cht.cmd = cht?.msg?.startsWith(cht.prefix) ? cht?.msg?.slice(1)?.toLowerCase()?.trim()?.split(/ +/).shift() : null

        cht.memories = await Exp.func.archiveMemories.get(cht.sender)

        cht.download = async () => Exp.func.download(cht?.message?.[type], cht.type)

        cht[Exp.func['getType'](cht.type)] = cht?.message?.[type]

        if (cht.quoted) {
            const quotedParticipant = cht?.message?.[type]?.contextInfo?.participant
            cht.quoted.sender = await Exp.func['getSender'](quotedParticipant)
            cht.quoted.type = Object.keys(cht.quoted)[0]
            cht.quoted.memories = await Exp.func.archiveMemories.get(cht.quoted.sender)
            cht.quoted.text = cht?.quoted?.extendedTextMessage?.text || cht?.quoted?.conversation || false
            cht.quoted.url = cht.quoted.text ? cht?.quoted?.text?.match(/https?:\/\/[^\s]+/g) : null
            cht.quoted[await Exp.func['getType'](cht.quoted.type)] = cht?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[cht.quoted.type]
            cht.quoted.download = async () => Exp.func.download(cht?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.[cht.quoted.type], Exp.func['getType'](cht.quoted.type))
            cht.quoted.stanzaId = cht?.message?.extendedTextMessage?.contextInfo?.stanzaId
            cht.quoted.delete = async () => Exp.sendMessage(cht.id, { delete: { ...(await store.loadMessage(cht.id, cht.quoted.stanzaId)).key, participant: cht.quoted.sender }})
            
        }

        const args = cht?.msg?.trim()?.split(/ +/)?.slice(1)
        cht.q = args?.join(' ') || cht?.quoted?.text || undefined
        cht.mention = cht.q && (cht.q.extractMentions()).length > 0
           ? cht.q.extractMentions()
              : cht?.message?.[type]?.contextInfo?.mentionedJid?.length > 0
                 ? cht.message[type].contextInfo.mentionedJid
                    : cht?.message?.[type]?.contextInfo?.participant
                      ? [cht.message[type].contextInfo.participant]
                    : []

        Exp.number = Exp?.user?.id?.split(':')[0] + from.sender

        is.group = cht.id?.endsWith(from.group)
        is.me = cht?.key?.fromMe
        is.owner = [Exp.number, ...global.owner].map(jid => jid.replace(/[^0-9]/g, '') + from.sender).includes(cht.sender) || is.me
        is.baileys = (cht?.key?.id?.startsWith('BAE5') || cht?.key?.id?.startsWith('BELL409')) && cht?.key?.id?.length === 16
        is.botMention = cht?.mention?.includes(Exp.number)
        is.cmd = cht.cmd
        is.sticker = cht.type === "sticker"
        is.audio = cht.type === "audio"
        is.image = cht.type === "image"
        is.video = cht.type === "video"
        is.document = cht.type === "document"
        is.url = cht?.msg?.match(/https?:\/\/[^\s]+/g) || null

        if (is.group) {
            const groupMetadata = await Exp.groupMetadata(cht.id)
            Exp.groupMetdata = groupMetadata
            Exp.groupMembers = groupMetadata.participants
            Exp.groupName = groupMetadata.subject
            Exp.groupAdmins = Exp.func.getGroupAdmins(groupMetadata.participants)
            is.botAdmin = Exp.groupAdmins.includes(Exp.number)
            is.groupAdmins = Exp.groupAdmins.includes(cht.sender)
        }

        is.memories = cht.memories
        is.quoted = cht.quoted
        
        Exp.profilePictureUrl = async (jid, type = 'image', timeoutMs) => {
            jid = jidNormalizedUser(jid)
            const result = await Exp.query({
                tag: 'iq',
                attrs: {
                    target: jid,
                    to: "@s.whatsapp.net",
                    type: 'get',
                    xmlns: 'w:profile:picture'
                },
                content: [
                    { tag: 'picture', attrs: { type, query: 'url' } }
                ]
            }, timeoutMs)

            const child = getBinaryNodeChild(result, 'picture')
            return child?.attrs?.url
        }

        Exp.setProfilePicture = async (buffer) => {
          try{
            const jimpread = await jimp.read(buffer);
            const result = jimpread.getWidth() > jimpread.getHeight() ? jimpread.resize(550, jimp.AUTO) : jimpread.resize(jimp.AUTO, 650)
            let buff = await result.getBufferAsync(jimp.MIME_JPEG)
            return await Exp.query({ tag: 'iq', 
                 attrs: { to: Exp.number, type:'set', xmlns: 'w:profile:picture' },
                 content: [
                   { 
                     tag: 'picture', 
                     attrs: { 
                       type: 'image' 
                     }, 
                     content: buff
                   }
                 ]
            })
          } catch (e) {
              throw new Error(e)
          }
        }

        cht.reply = async function (text) {
            const { key } = await Exp.sendMessage(cht.id, { text }, { quoted: cht })
            keys[cht.sender] = key
            return { key }
        }

        cht.edit = async function (text, key) {
            await Exp.sendMessage(cht.id, { text, edit: key }, { quoted: cht })
        }

    } catch (error) {
        console.error("Error in utils:", error)
    }
}
