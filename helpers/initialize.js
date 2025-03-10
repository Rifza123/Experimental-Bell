import jimp from "jimp"
const {
  getBinaryNodeChild,
  generateMessageIDV2,
  generateWAMessageContent,
  getContentType,
  jidNormalizedUser
} = "baileys".import()
const { func } = await `${fol[0]}func.js`.r()

export default 
async function initialize({ Exp, store }) {
  try {
    const { sendMessage } = Exp

    Exp.func = new func({ Exp, store })
    
    Exp.number ??= Exp?.user?.id?.split(':')[0] + from.sender
                
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

    Exp.setProfilePicture = async (id,buffer) => {
      try{
        id = jidNormalizedUser(id)
        const jimpread = await jimp.read(buffer);
        const min = jimpread.getWidth()
        const max = jimpread.getHeight()
        const cropped = jimpread.crop(0, 0, min, max)
        
        let buff = await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG)
        return await Exp.query({
			tag: 'iq',
			attrs: {
			    ...(id.endsWith(from.group) ? { target: id }:{}),
			    to: "@s.whatsapp.net",
				type:'set',
				xmlns: 'w:profile:picture'
			},
			content: [
				{
					tag: 'picture',
					attrs: { type: 'image' },
					content: buff
				}
			]
		})
      } catch (e) {
        throw new Error(e)
      }
    }

    Exp.sendContacts = async(cht, numbers)=> {
      try {
        let contacts = []
        for(let i of numbers){
          let number = i.split("@")[0]
          let name = Exp.func.getName(number)
          let vcard = `BEGIN:VCARD
            VERSION:3.0
            N:${name}
            FN:${name}
            item1.TEL;waid=${number}:+${number}
            item1.X-ABLabel:Ponsel
            END:VCARD`
            .split("\n")
            .map(a => a.trim())
            .join("\n")
          contacts.push({
            vcard,
            displayName: name
          })
        }
        return await Exp.relayMessage(cht.id, {
          "contactsArrayMessage": {
            "displayName": "‎X-TERMAI",
            contacts,
            ...((cht.key && cht.sender) ? { contextInfo: {
                stanzaId: cht.key.id,
                participant: cht.sender,
                quotedMessage: cht
              }
            } : {})
          }
        }, {})
      } catch (e) {
        console.error("Error in Exp.sendContacts: "+ e)
        throw new Error(e)
      }
    }
    
    Exp.sendMessage = async(id, config, etc) => {
      let msg;
      
      if(config.ai && !id.endsWith(from.group)){
        let message = await generateWAMessageContent(config, { upload: Exp.waUploadToServer })
        let type = getContentType(message)
        if(etc){
           message[type].contextInfo = {
             stanzaId: etc.quoted?.key.id,
             participant: etc.quoted?.key.participant||etc.quoted?.key.remoteJid,
             quotedMessage: etc.quoted
           }
        } 
        msg = await Exp.relayMessage(id, 
        message,
        { 
          messageId: generateMessageIDV2(Exp.user.id), 
          additionalNodes: [
            {
              attrs: {
                biz_bot: '1'
              },
              tag: "bot"
            }
          ]
        })


      } else {
        return sendMessage(id, config, etc)
      }
      return { 
        key: { 
          id: msg,
          fromMe: true,
          remoteJid: id
        }
      }
    }
    
  } catch (e) {
    console.error("Error in Initialize.js: "+ e)
  }
}