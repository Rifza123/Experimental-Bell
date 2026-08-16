import jimp from 'jimp';
const {
  getBinaryNodeChild,
  generateMessageIDV2,
  generateWAMessageContent,
  getContentType,
  jidNormalizedUser,
  prepareWAMessageMedia,
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
      const isNotice = typeof config?.text === 'string' && (
        config.text.includes('Energy⚡') ||
        config.text.includes('⏱️Wait...') ||
        config.text.includes('Bntr...') ||
        config.text.includes('Cooldown') ||
        config.text.includes('Pesan API:')
      );

      if (config?.footer && (config?.audio || config?.document || config?.sticker))
        delete config.footer;

      const externalAd = config?.contextInfo?.externalAdReply;

      if (externalAd) {
        delete config.contextInfo.externalAdReply;
        if (
          cfg.linkpreview &&
          typeof config?.text === 'string' &&
          !config.image &&
          !config.video &&
          !config.document &&
          !config.audio &&
          !config.sticker &&
          !config.linkPreview
        ) {
          if (!config.text.includes('https://termai.cc')) {
            config.text = `https://termai.cc\n` + config.text;
          }
          let thumbBuffer;
          if (externalAd.thumbnail && Buffer.isBuffer(externalAd.thumbnail)) {
            thumbBuffer = externalAd.thumbnail;
          } else if (externalAd.thumbnailUrl) {
            try {
              thumbBuffer = await Exp.func.getBuffer(externalAd.thumbnailUrl);
            } catch {}
          }
          if (!thumbBuffer) {
            try {
              thumbBuffer = fs.readFileSync(fol[3] + 'bell.jpg');
            } catch {}
          }
          let imageMessage;
          if (thumbBuffer) {
            try {
              const resMedia = await prepareWAMessageMedia(
                { image: thumbBuffer },
                { upload: Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
              );
              imageMessage = resMedia?.imageMessage;
            } catch {}
          }
          config.linkPreview = {
            'matched-text': 'https://termai.cc',
            title: externalAd.title || Exp.user?.name || 'Termai',
            description:
              externalAd.body ||
              'Artificial Intelligence, The beginning of the robot era',
            jpegThumbnail: imageMessage?.jpegThumbnail
              ? Buffer.from(imageMessage.jpegThumbnail)
              : thumbBuffer || undefined,
            highQualityThumbnail: imageMessage || undefined,
          };
        }
      }

      let mtype = getContentType(config),
        isAI = !!config.ai && !id.endsWith(from.group),
        isPTT = config.ptt === true,
        isFooter = !!config.footer,
        isLinkPreview = !!config.linkPreview,
        isInteractive =
          mtype == 'interactiveMessage' ||
          isFooter ||
          config.nativeFlowMessage ||
          config.limited_time_offer;
      if (!isAI && !isPTT && !isInteractive && !isFooter && !isLinkPreview) {
        etc.ephemeralExpiration = 8640000;
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

      if (type === 'extendedTextMessage' && message?.extendedTextMessage) {
        let ext = message.extendedTextMessage;
        if (config.linkPreview || ext.matchedText || ext.thumbnailDirectPath) {
          let ts = String(Math.floor(Date.now() / 1000));
          ext.previewType = 'NONE';
          ext.inviteLinkGroupTypeV2 = 'DEFAULT';
          ext.thumbnailHeight = ext.thumbnailHeight || 1080;
          ext.thumbnailWidth = ext.thumbnailWidth || 1080;
          if (ext.thumbnailDirectPath && !ext.faviconMMSMetadata) {
            try {
              if (!keys['termai_favicon_media']) {
                const favRes = await prepareWAMessageMedia(
                  { image: { url: 'https://c.termai.cc/i170/88Oj.png' } },
                  { upload: Exp.waUploadToServer, mediaTypeOverride: 'thumbnail-link' }
                );
                if (favRes?.imageMessage) {
                  keys['termai_favicon_media'] = {
                    thumbnailDirectPath: favRes.imageMessage.directPath,
                    thumbnailSha256: favRes.imageMessage.fileSha256,
                    thumbnailEncSha256: favRes.imageMessage.fileEncSha256,
                    mediaKey: favRes.imageMessage.mediaKey,
                    mediaKeyTimestamp: String(favRes.imageMessage.mediaKeyTimestamp || ts),
                  };
                }
              }
              if (keys['termai_favicon_media']) {
                ext.faviconMMSMetadata = keys['termai_favicon_media'];
              }
            } catch {}

            ext.faviconMMSMetadata ||= {
              thumbnailDirectPath: ext.thumbnailDirectPath,
              thumbnailSha256: ext.thumbnailSha256,
              thumbnailEncSha256: ext.thumbnailEncSha256,
              mediaKey: ext.mediaKey,
              mediaKeyTimestamp: ext.mediaKeyTimestamp || ts,
            };
          }
        }
      }

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
          ...(config.contextInfo || {}),
          stanzaId: etc.quoted.key.id,
          participant: etc.quoted.key.participant || etc.quoted.key.remoteJid,
          quotedMessage: etc.quoted,
          mentionedJid: config.mentionedJid || config.mentions || [],
        };
      } else if (config.contextInfo) {
        message[type].contextInfo = {
          ...(message[type].contextInfo || {}),
          ...config.contextInfo,
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
