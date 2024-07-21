/*!-======[ Module Imports ]======-!*/
const chalk = "chalk".import();
const { watch } = "fs".import();
const chokidar = "chokidar".import();
const { getBinaryNodeChild, jidNormalizedUser } = "baileys".import()
/*!-======[ Cache ]======-!*/
let is = {};

/*!-======[ Events Update ]======-!*/
const watcher = chokidar.watch(fol[7]);
let onreload = false;

/*!-======[ Default Export Function ]======-!*/
export default

async function client({ Exp, store, cht, In, func, ai, color, bgcolor, ArchiveMemories, EventEmitter, getContentType }) {
    let type = getContentType(cht.message);
    Exp.func = func;
    const msgType = type == "extendedTextMessage" ? getContentType(cht.message.extendedTextMessage) : type;
    cht.type = Exp.func['getType'](msgType);
    const sender = cht.participant || cht.key.participant || cht.key.remoteJid || Exp.user.id || '';
    cht.sender = await Exp.func['getSender'](sender);
    cht.quoted = cht.message[type]?.contextInfo?.quotedMessage || false;
    cht.msg = (type === 'conversation' && cht.message.conversation) ? cht.message.conversation :
        (type == 'extendedTextMessage') ? cht.message.extendedTextMessage.text :
        (type == 'imageMessage') && cht.message.imageMessage.caption ? cht.message.imageMessage.caption :
        (type == 'videoMessage') && cht.message.videoMessage.caption ? cht.message.videoMessage.caption :
        (type == "interactiveResponseMessage") ? JSON.parse(cht.message[type].nativeFlowResponseMessage?.paramsJson).id : '';
    cht.prefix = /^[.#‽٪]/.test(cht.msg) ? cht.msg.match(/^[.#‽٪]/gi) : '#';
    global.prefix = cht.prefix;
    cht.cmd = cht.msg.startsWith(cht.prefix) ? cht.msg.slice(1).toLowerCase().trim().split(/ +/).shift() : null;
    cht.memories = await ArchiveMemories.get(cht.sender);
    cht.download = async () => Exp.func.download(cht.message[type], cht.type);
    cht[Exp.func['getType'](cht.type)] = cht.message[type]
    if (cht.quoted) {
        const quotedParticipant = cht.message[type]?.contextInfo?.participant;
        cht.quoted.sender = await Exp.func['getSender'](quotedParticipant);
        cht.quoted.type = Object.keys(cht.quoted)[0];
        cht.quoted.memories = ArchiveMemories.get(cht.quoted.sender);
        cht.quoted.text = cht.quoted.extendedTextMessage?.text || cht.quoted?.conversation || false;
        cht.quoted.url = cht.quoted.text ? cht.quoted.text.match(/https?:\/\/[^\s]+/g) : null;
        cht.quoted[Exp.func['getType'](cht.quoted.type)] = cht.message.extendedTextMessage?.contextInfo?.quotedMessage[cht.quoted.type];
        cht.quoted.download = async () => Exp.func.download(cht.message.extendedTextMessage?.contextInfo?.quotedMessage[cht.quoted.type], Exp.func['getType'](cht.quoted.type));
    }

    const args = cht.msg.trim().split(/ +/).slice(1);
    cht.q = args.join(' ') || cht.quoted?.text || undefined;
    cht.mention = cht.message[type]?.contextInfo?.mentionedJid?.length > 0
        ? cht.message[type].contextInfo.mentionedJid
        : cht.message[type]?.contextInfo?.participant
            ? [cht.message[type].contextInfo.participant]
            : [];

    Exp.number = Exp.user.id.split(':')[0] + from.sender;

    is.owner = [Exp.number, ...global.owner].map(jid => jid.replace(/[^0-9]/g, '') + from.sender).includes(cht.sender);
    is.group = cht.id.endsWith(from.group);
    is.me = cht.key.fromMe;
    is.baileys = cht.key.id.startsWith('BAE5') && cht.key.id.length === 16;
    is.botMention = cht.mention.includes(Exp.number);
    is.cmd = cht.cmd;
    is.sticker = cht.type == "sticker";
    is.audio = cht.type == "audio";
    is.image = cht.type == "image";
    is.video = cht.type == "video";
    is.document = cht.type == "document";
    is.url = cht.msg.match(/https?:\/\/[^\s]+/g) || null;
    
    if (is.group) {
        const groupMetadata = await Exp.groupMetadata(cht.id);
        Exp.groupMetdata = groupMetadata;
        Exp.groupMembers = groupMetadata.participants;
        Exp.groupName = groupMetadata.subject;
        Exp.groupAdmins = Exp.func.getGroupAdmins(groupMetadata.participants);
        is.botAdmin = Exp.groupAdmins.includes(Exp.number) || false;
        is.groupAdmins = Exp.groupAdmins.includes(cht.sender);
    }

    is.memories = cht.memories;
    is.quoted = cht.quoted;
    Exp.profilePictureUrl = async(jid, type = 'image', timeoutMs) => {
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
    cht.reply = async function (text) {
        let { key } = await Exp.sendMessage(cht.id, { text: text }, { quoted: cht });
        global.key[cht.sender] = key;
        return { key };
    };

    cht.edit = async function (text, key) {
        await Exp.sendMessage(cht.id, { text: text, edit: key }, { quoted: cht });
        return;
    };

    if (!is.group && cht.msg) {
        global.cfg["autotyping"] && await Exp.sendPresenceUpdate('composing', cht.id);
        global.cfg["autoreadpc"] && await Exp.readMessages([cht.key])
        const prefix = bgcolor('[ PRV ]', 'red') + ' >';
        console.log(`${prefix} From: ${color(cht.pushName, 'cyan')} Conversation: ${color(cht.msg, 'green')}`);
    }

    if (is.group) {
        global.cfg["autoreadgc"] && await Exp.readMessages([cht.key])
        const prefix = bgcolor('[ GR ]', 'pink') + ' >';
        console.log(`${prefix} From: ${color(cht.id, 'cyan')} User: ${color(cht.pushName, 'cyan')} Conversation: ${color(cht.msg, 'green')}`);
    }
    
    /*!-======[ Block Chat ]======-!*/
    if (global.cfg.public == false && !is.owner && !is.me) return;

    const ev = new EventEmitter({ Exp, store, cht, ai, is });
    await ev.loadEventHandlers();

    cht.cmd && await ev.emit(cht.cmd);

     await In({ Exp, store, ev, cht, ai, is });
    /*!-======[ Chat Interactions Add ]======-!*/
    if (!cht.cmd || is.botMention) {
        ArchiveMemories.addChat(cht.sender);
    }
    
    /*!-======[ Events Update Detector ]======-!*/
    watcher.on('change', (path) => {
        if (onreload) return;
        onreload = true;
        setTimeout(async () => {
             try{ 
                 await ev.reloadEventHandlers();
             } catch {}
                 onreload = false;
             }, 2000); 
   });
}