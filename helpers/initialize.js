import jimp from 'jimp';
const {
  getBinaryNodeChild,
  generateMessageIDV2,
  generateWAMessageContent,
  getContentType,
  jidNormalizedUser,
} = 'baileys'.import();
const { func } = await `${fol[0]}func.js`.r();

let { generateWaveform, convertToOpus } = await './toolkit/ffmpeg.js'.r();
const { processMedia } = await './toolkit/ffmpeg.js'.r();

export default async function initialize({ Exp, store }) {
  try {
    const { sendMessage, relayMessage } = Exp;

    Exp.number ??= Exp?.user?.id?.split(':')[0] + from.sender;
    Exp.profilePictureUrl = async (jid, type = 'image', timeoutMs) => {
      jid = jidNormalizedUser(jid);
      const result = await Exp.query(
        {
          tag: 'iq',
          attrs: {
            target: jid,
            to: '@s.whatsapp.net',
            type: 'get',
            xmlns: 'w:profile:picture',
          },
          content: [{ tag: 'picture', attrs: { type, query: 'url' } }],
        },
        timeoutMs
      );

      const child = getBinaryNodeChild(result, 'picture');
      return child?.attrs?.url;
    };

    Exp.setProfilePicture = async (id, buffer) => {
      try {
        id = jidNormalizedUser(id);
        const jimpread = await jimp.read(buffer);
        const min = jimpread.getWidth();
        const max = jimpread.getHeight();
        const cropped = jimpread.crop(0, 0, min, max);

        let buff = await cropped
          .scaleToFit(720, 720)
          .getBufferAsync(jimp.MIME_JPEG);
        return await Exp.query({
          tag: 'iq',
          attrs: {
            ...(id.endsWith(from.group) ? { target: id } : {}),
            to: '@s.whatsapp.net',
            type: 'set',
            xmlns: 'w:profile:picture',
          },
          content: [
            {
              tag: 'picture',
              attrs: { type: 'image' },
              content: buff,
            },
          ],
        });
      } catch (e) {
        throw new Error(e);
      }
    };

    Exp.sendContacts = async (cht, numbers) => {
      try {
        let contacts = [];
        for (let i of numbers) {
          let number = i.split('@')[0];
          let name = Exp.func.getName(number);
          let vcard = `BEGIN:VCARD
            VERSION:3.0
            N:${name}
            FN:${name}
            item1.TEL;waid=${number}:+${number}
            item1.X-ABLabel:Ponsel
            END:VCARD`
            .split('\n')
            .map((a) => a.trim())
            .join('\n');
          contacts.push({
            vcard,
            displayName: name,
          });
        }
        return await Exp.relayMessage(
          cht.id,
          {
            contactsArrayMessage: {
              displayName: '‎X-TERMAI',
              contacts,
              ...(cht.key && cht.sender
                ? {
                    contextInfo: {
                      stanzaId: cht.key.id,
                      participant: cht.sender,
                      quotedMessage: cht,
                    },
                  }
                : {}),
            },
          },
          {}
        );
      } catch (e) {
        console.error('Error in Exp.sendContacts: ' + e);
        throw new Error(e);
      }
    };

    Exp.sendMessage = async (id, config, etc = {}) => {
      let msg;
      let buffer;
      const externalAd = config?.contextInfo?.externalAdReply;

      if (externalAd && !cfg.linkpreview)
        delete config.contextInfo.externalAdReply;

      let mtype = getContentType(config),
        isAI = !!config.ai && !id.endsWith(from.group),
        isPTT = config.ptt === true,
        isFooter = !!config.footer,
        isInteractive =
          mtype == 'interactiveMessage' ||
          isFooter ||
          config.nativeFlowMessage ||
          config.limited_time_offer;
      if (!isAI && !isPTT && !isInteractive && !isFooter) {
        etc.ephemeralExpiration = 86400;
        return sendMessage(id, config, etc);
      }

      if (isPTT && config.audio) {
        config.mimetype = 'audio/ogg; codecs=opus';

        const source = config.audio?.url
          ? await Exp.func.getBuffer(config.audio.url)
          : config.audio;

        buffer = await convertToOpus(Buffer.from(source));
        config.audio = buffer;
      }

      let message = await generateWAMessageContent(config, {
        upload: Exp.waUploadToServer,
      });
      let type = getContentType(message);

      let isMedia = /^(image|document|video)/.test(type);
      if (isInteractive && !config.audio) {
        message = {
          interactiveMessage: {
            header: {
              ...(isMedia
                ? {
                    hasMediaAttachment: true,
                    [type]: message[type],
                  }
                : {}),
            },
            body: {
              text: config.text || config.caption,
            },
            ...(isFooter
              ? {
                  footer: {
                    text: config.footer,
                  },
                }
              : {}),
            carouselMessage: {},
            ...(config.nativeFlowMessage || config.limited_time_offer
              ? {
                  nativeFlowMessage: {
                    ...(config.limited_time_offer ||
                    config.nativeFlowMessage?.messageParamsJson
                      ? {
                          ...config.limited_time_offer,
                          ...(config.nativeFlowMessage?.messageParamsJson ||
                            {}),
                        }.String()
                      : {}),
                    ...config.nativeFlowMessage,
                  },
                }
              : {}),
          },
        };
        type = 'interactiveMessage';
      }

      if (etc.quoted) {
        message[type].contextInfo = {
          stanzaId: etc.quoted.key.id,
          participant: etc.quoted.key.participant || etc.quoted.key.remoteJid,
          quotedMessage: etc.quoted,
          mentionedJid: config.mentionedJid || config.mentions || [],
        };
      }

      if (isPTT && buffer) {
        message[type].waveform = await generateWaveform(buffer);
      }

      const relayOptions =
        cfg.ai && !id.endsWith(from.group)
          ? {
              messageId: generateMessageIDV2(Exp.user.id),
              additionalNodes: [
                {
                  tag: 'bot',
                  attrs: { biz_bot: '1' },
                },
              ],
            }
          : {};

      msg = await Exp.relayMessage(id, message, relayOptions);

      return {
        key: {
          id: msg,
          fromMe: true,
          remoteJid: id,
        },
      };
    };

    Exp.groupSetMemberLabel = async (jid, label) => {
      const result = await Exp.relayMessage(
        jid,
        {
          protocolMessage: {
            type: 30,
            memberLabel: {
              label: label.slice(0, 30),
              labelTimestamp: Math.floor(Date.now() / 1000),
            },
          },
        },
        {
          additionalNodes: [
            {
              tag: 'meta',
              attrs: {
                tag_reason: 'user_update',
                appdata: 'member_tag',
              },
              content: undefined,
            },
          ],
        }
      );
      return result;
    };

    Exp.addChat = ({ cht, is }) => {
      try {
        let now = Date.now();
        let { sender, type } = cht;
        let _id = sender?.split('@')?.[0] || 'anomali';
        if (!type) type = 'text';
        Data.chats ??= {};
        Data.chats[_id] ??= {};
        let _data = Data.chats[_id];
        _data[type] ??= 0;
        _data.groups ??= {};

        if (!is.group) {
          _data[type]++;
          _data.lastSent = now;
        } else {
          _data.groups[cht.id] ??= {};
          _data.groups[cht.id][type] ??= 0;
          _data.groups[cht.id].lastSent = now;
          _data.groups[cht.id][type]++;
        }
      } catch (e) {
        console.error('Error in Exp.addChat:', e);
        throw new Error(e);
      }
    };

    Exp.checkRegisterNeeded = ({ cht, memories }) => {
      try {
        const sender = cht?.sender?.split('@')[0];
        const cmd = cht?.cmd?.toLowerCase();
        const now = Date.now();
        if (!cfg.register) return false;
        if (memories.has(cht.sender)) return false;
        if (['register', 'daftar'].includes(cmd)) return false;
        if (cht.reaction) return false;
        keys.lastSendRegisterMsg ??= {};
        const last = keys.lastSendRegisterMsg[sender];
        if (!last) {
          keys.lastSendRegisterMsg[sender] = now;
          return Data.infos.client.registerNeeded;
        }
        if (now - last <= 60_000) return true;
        keys.lastSendRegisterMsg[sender] = now;
        return Data.infos.client.registerNeeded;
      } catch (e) {
        console.error('Error in Exp.checkRegisterNeeded:', e);
        return false;
      }
    };
  } catch (e) {
    console.error('Error in Initialize.js: ' + e);
  }
}
