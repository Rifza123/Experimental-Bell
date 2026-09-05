import jimp from 'jimp';
import crypto from 'crypto';
const {
  getBinaryNodeChild,
  generateMessageIDV2,
  generateWAMessageContent,
  generateWAMessageFromContent,
  generateWAMessage,
  getContentType,
  jidNormalizedUser,
  prepareWAMessageMedia,
} = 'baileys'.import();
const { func } = await `${fol[0]}func.js`.r();

let { generateWaveform, convertToOpus } = await './toolkit/ffmpeg.js'.r();
const { processMedia } = await './toolkit/ffmpeg.js'.r();

const injectMessageMentions = (message) => {
  if (!message || typeof message !== 'object') return message;

  if (typeof message.conversation === 'string') {
    const mentions = message.conversation.mentions();
    if (mentions.length > 0) {
      message.extendedTextMessage = {
        text: message.conversation,
        contextInfo: {
          mentionedJid: mentions,
        },
      };
      delete message.conversation;
    }
  }

  if (message.extendedTextMessage) {
    const text = message.extendedTextMessage.text || '';
    const ctx = message.extendedTextMessage.contextInfo || {};
    if (!ctx.mentionedJid || ctx.mentionedJid.length === 0) {
      const mentions = text.mentions();
      if (mentions.length > 0) {
        message.extendedTextMessage.contextInfo = {
          ...ctx,
          mentionedJid: mentions,
        };
      }
    }
  }

  for (const key of [
    'imageMessage',
    'videoMessage',
    'documentMessage',
    'audioMessage',
  ]) {
    if (message[key]) {
      const text = message[key].caption || '';
      const ctx = message[key].contextInfo || {};
      if (!ctx.mentionedJid || ctx.mentionedJid.length === 0) {
        const mentions = text.mentions();
        if (mentions.length > 0) {
          message[key].contextInfo = {
            ...ctx,
            mentionedJid: mentions,
          };
        }
      }
    }
  }

  if (message.interactiveMessage) {
    const text =
      message.interactiveMessage.body?.text ||
      message.interactiveMessage.header?.title ||
      '';
    const ctx = message.interactiveMessage.contextInfo || {};
    if (!ctx.mentionedJid || ctx.mentionedJid.length === 0) {
      const mentions = text.mentions();
      if (mentions.length > 0) {
        message.interactiveMessage.contextInfo = {
          ...ctx,
          mentionedJid: mentions,
        };
      }
    }
  }

  const inner =
    message.viewOnceMessage?.message ||
    message.viewOnceMessageV2?.message ||
    message.ephemeralMessage?.message ||
    message.documentWithCaptionMessage?.message;
  if (inner) {
    injectMessageMentions(inner);
  }

  return message;
};

const injectRichResponseMessage = (message) => {
  if (!message || typeof message !== 'object') return false;
  if (!cfg.rich) return false;

  let rich =
    message?.richResponseMessage ||
    message?.botForwardedMessage?.richResponseMessage ||
    message?.botForwardedMessage?.message?.richResponseMessage ||
    message?.protocolMessage?.editedMessage?.richResponseMessage ||
    message?.protocolMessage?.editedMessage?.botForwardedMessage?.message
      ?.richResponseMessage ||
    message?.botForwardedMessage?.message?.protocolMessage?.editedMessage
      ?.richResponseMessage ||
    message?.botForwardedMessage?.message?.protocolMessage?.editedMessage
      ?.botForwardedMessage?.message?.richResponseMessage;

  if (!rich) return false;

  if (typeof rich.messageType === 'string' || !rich.messageType) {
    const map = {
      AI_RICH_RESPONSE_TYPE_STANDARD: 1,
      AI_RICH_RESPONSE_TYPE_CAROUSEL: 2,
    };
    rich.messageType = map[rich.messageType] || 1;
  }

  if (rich.sections && !rich.unifiedResponse) {
    rich.unifiedResponse = { data: { sections: rich.sections } };
    delete rich.sections;
  }

  if (rich.unifiedResponse?.data) {
    try {
      let decodedJson = null;
      if (
        typeof rich.unifiedResponse.data === 'object' &&
        rich.unifiedResponse.data !== null
      ) {
        decodedJson = rich.unifiedResponse.data;
      } else if (typeof rich.unifiedResponse.data === 'string') {
        const rawStr = rich.unifiedResponse.data.trim();
        if (rawStr.startsWith('{') || rawStr.startsWith('[')) {
          decodedJson = JSON.parse(rawStr);
        } else {
          try {
            decodedJson = JSON.parse(
              Buffer.from(rawStr, 'base64').toString('utf8')
            );
          } catch {
            decodedJson = null;
          }
        }
      }

      if (decodedJson) {
        if (Array.isArray(decodedJson)) {
          decodedJson = { sections: decodedJson };
        }
        decodedJson.response_id ??= ''.uuid();

        rich.unifiedResponse.data = Buffer.from(
          JSON.stringify(decodedJson)
        ).toString('base64');
      }
    } catch {}
  }

  if (Array.isArray(rich.submessages)) {
    const subMap = {
      AI_RICH_RESPONSE_IMAGE: 1,
      AI_RICH_RESPONSE_TEXT: 2,
      AI_RICH_RESPONSE_TABLE: 4,
      AI_RICH_RESPONSE_CODE: 5,
      AI_RICH_RESPONSE_REELS: 9,
    };
    for (let sub of rich.submessages) {
      if (typeof sub.messageType === 'string' || !sub.messageType) {
        sub.messageType =
          subMap[sub.messageType] ||
          (sub.gridImageMetadata
            ? 1
            : sub.codeMetadata
              ? 5
              : sub.tableMetadata
                ? 4
                : sub.contentItemsMetadata
                  ? 9
                  : 2);
      }
    }
  } else {
    rich.submessages = [];
  }

  rich.contextInfo ??= {};
  if (
    rich.contextInfo.forwardOrigin === 'META_AI' ||
    typeof rich.contextInfo.forwardOrigin === 'string'
  ) {
    rich.contextInfo.forwardOrigin = 4;
  }
  rich.contextInfo.isForwarded ??= true;
  rich.contextInfo.forwardingScore ??= 1;
  rich.contextInfo.forwardedAiBotMessageInfo ??= {
    botJid: '867051314767696@bot',
  };
  rich.contextInfo.botMessageSharingInfo ??= {
    botEntryPointOrigin: 'AI_TAB',
    forwardScore: 1,
  };

  message.messageContextInfo ??= {};
  if (!message.messageContextInfo.messageSecret) {
    delete message.messageContextInfo.messageSecret;
    message.messageContextInfo.deviceListMetadata ??= {};
    message.messageContextInfo.deviceListMetadataVersion ??= 2;
    message.messageContextInfo.botMetadata ??= {};
    message.messageContextInfo.botMetadata.messageDisclaimerText ??= '';
    message.messageContextInfo.botMetadata.verificationMetadata =
      {}.verificationMetadata();
    message.messageContextInfo.botMetadata.botResponseId ??= ''.uuid();
  }

  if (message.richResponseMessage) {
    message.botForwardedMessage = {
      message: {
        richResponseMessage: rich,
      },
    };
    delete message.richResponseMessage;
  } else if (message.botForwardedMessage?.richResponseMessage) {
    message.botForwardedMessage.message = {
      richResponseMessage: rich,
    };
    delete message.botForwardedMessage.richResponseMessage;
  }

  return true;
};

const extractListSectionItems = (im) => {
  const buttons = im?.nativeFlowMessage?.buttons || [];
  let items = [];
  for (let b of buttons) {
    let params = null;
    if (typeof b?.buttonParamsJson === 'string') {
      try {
        params = JSON.parse(b.buttonParamsJson);
      } catch {}
    } else if (typeof b?.buttonParamsJson === 'object' && b.buttonParamsJson !== null) {
      params = b.buttonParamsJson;
    }
    if (params) {
      if (Array.isArray(params.sections)) {
        for (let sec of params.sections) {
          let secTitle = sec.title || '';
          if (Array.isArray(sec.rows)) {
            for (let row of sec.rows) {
              items.push({
                title: row.title || row.header || '',
                description: row.description || '',
                id: row.id || row.rowId || '',
                sectionTitle: secTitle,
              });
            }
          }
        }
      } else if (Array.isArray(params.rows)) {
        for (let row of params.rows) {
          items.push({
            title: row.title || row.header || '',
            description: row.description || '',
            id: row.id || row.rowId || '',
            sectionTitle: params.title || '',
          });
        }
      }
    }
    if (b?.name === 'quick_reply' && params && (params.display_text || params.id)) {
      items.push({
        title: params.display_text || params.id,
        description: '',
        id: params.id || params.display_text,
        sectionTitle: '',
      });
    }
  }
  return items;
};

const isListSectionMessage = (im) => {
  if (!im?.nativeFlowMessage?.buttons) return false;
  const buttons = im.nativeFlowMessage.buttons;
  if (buttons.some((b) => b?.name === 'single_select')) return true;
  for (let b of buttons) {
    if (!b?.buttonParamsJson) continue;
    try {
      const p =
        typeof b.buttonParamsJson === 'string'
          ? JSON.parse(b.buttonParamsJson)
          : b.buttonParamsJson;
      if (Array.isArray(p?.sections) && p.sections.length > 0) return true;
      if (Array.isArray(p?.rows) && p.rows.length > 0) return true;
    } catch {}
  }
  return false;
};

const normalizeContextInfo = (ctx, quoted) => {
  let contextInfo = ctx ? { ...ctx } : {};
  if (quoted) {
    contextInfo.stanzaId = contextInfo.stanzaId || quoted.key?.id || quoted.stanzaId;
    contextInfo.participant = contextInfo.participant || quoted.key?.participant || quoted.sender || quoted.key?.remoteJid;
    contextInfo.quotedMessage = contextInfo.quotedMessage || quoted.message || (quoted.msg || quoted.text ? { conversation: quoted.msg || quoted.text } : undefined);
  }
  if (contextInfo.quotedMessage) {
    if (contextInfo.quotedMessage.message) {
      contextInfo.quotedMessage = contextInfo.quotedMessage.message;
    } else if (
      !contextInfo.quotedMessage.conversation &&
      !contextInfo.quotedMessage.extendedTextMessage &&
      !contextInfo.quotedMessage.imageMessage &&
      !contextInfo.quotedMessage.videoMessage &&
      !contextInfo.quotedMessage.documentMessage &&
      !contextInfo.quotedMessage.audioMessage &&
      !contextInfo.quotedMessage.stickerMessage &&
      (contextInfo.quotedMessage.msg || contextInfo.quotedMessage.text)
    ) {
      contextInfo.quotedMessage = {
        conversation: contextInfo.quotedMessage.msg || contextInfo.quotedMessage.text,
      };
    }
  }
  return Object.keys(contextInfo).length > 0 ? contextInfo : undefined;
};

const parseTitle = (str) =>
  (str || '')
    .replace(
      /^[#\s]*\[?\d+\]?[\.\)\:\-]\s*|^\[\d+\]\s*|^#\d+\s+|^[#\s]*\d+\s*-\s*/,
      ''
    )
    .trim();

const unwrapInteractiveMessage = (message, options = {}) => {
  if (!message || typeof message !== 'object') return message;

  let im =
    message.interactiveMessage ||
    message.viewOnceMessage?.message?.interactiveMessage ||
    message.viewOnceMessageV2?.message?.interactiveMessage;

  if (im) {
    const isList = isListSectionMessage(im);
    const listNotice =
      Data.infos?.others?.listSectionNotice ||
      'ℹ️ Jika menu list ini tidak berfungsi atau gagal muncul karena kebijakan WhatsApp, nonaktifkan fitur ini dengan: .set listSection off (Khusus Owner)';

    if (isList && cfg.listSection !== false) {
      im.footer = im.footer || {};
      if (im.footer.text) {
        if (!im.footer.text.includes('listSection off')) {
          im.footer.text = `${im.footer.text}\n${listNotice}`;
        }
      } else {
        im.footer.text = listNotice;
      }
    }

    if (!cfg.button || (isList && cfg.listSection === false)) {
      const header = im.header || {};
      const title = header.title ? `*${header.title}*\n\n` : '';
      const subtitle = header.subtitle ? `_${header.subtitle}_\n\n` : '';
      const body = im.body?.text || '';

      let rawCtx =
        im.contextInfo ||
        message.viewOnceMessage?.message?.contextInfo ||
        message.viewOnceMessage?.contextInfo ||
        message.viewOnceMessageV2?.message?.contextInfo ||
        message.viewOnceMessageV2?.contextInfo ||
        message.contextInfo;
      const contextInfo = normalizeContextInfo(rawCtx, options?.quoted);

      let listItems = isList ? extractListSectionItems(im) : [];
      let textList = '';
      let Keys = {};
      let questionData = null;

      if (listItems.length > 0) {
        let currentSec = null;
        for (let i = 0; i < listItems.length; i++) {
          let item = listItems[i];
          let num = i + 1;
          Keys[String(num)] = item.id;
          if (item.sectionTitle && item.sectionTitle !== currentSec) {
            currentSec = item.sectionTitle;
            let cleanSec = parseTitle(currentSec) || currentSec;
            if (cleanSec) {
              textList += `\n*${cleanSec}*\n`;
            }
          }
          let cleanTitle = parseTitle(item.title) || item.title;
          let desc = item.description ? `\n> ${item.description}` : '';
          textList += `${num}. *${cleanTitle}*${desc}\n`;
        }
        questionData = {
          Keys,
          accepts: Object.keys(Keys),
        };
      }

      const instruction =
        listItems.length > 0
          ? `\n\n- Balas pesan ini dengan angka 1 sampai ${listItems.length} untuk memilih!`
          : '';
      const footer = im.footer?.text ? `\n\n${im.footer.text}` : '';
      const contentBody =
        listItems.length > 0
          ? (body ? `${body}\n\n` : '') + textList.trim()
          : body;
      const fullText =
        `${title}${subtitle}${contentBody}${instruction}${footer}`.trim();

      let unwrappedPayload;
      if (header.hasMediaAttachment && header.imageMessage) {
        unwrappedPayload = {
          imageMessage: {
            ...header.imageMessage,
            caption: fullText,
            ...(contextInfo ? { contextInfo } : {}),
          },
        };
      } else if (header.hasMediaAttachment && header.videoMessage) {
        unwrappedPayload = {
          videoMessage: {
            ...header.videoMessage,
            caption: fullText,
            ...(contextInfo ? { contextInfo } : {}),
          },
        };
      } else if (header.hasMediaAttachment && header.documentMessage) {
        unwrappedPayload = {
          documentMessage: {
            ...header.documentMessage,
            caption: fullText,
            ...(contextInfo ? { contextInfo } : {}),
          },
        };
      } else {
        unwrappedPayload = {
          extendedTextMessage: {
            text: fullText,
            ...(contextInfo ? { contextInfo } : {}),
          },
        };
      }

      if (questionData) {
        return {
          payload: unwrappedPayload,
          questionData,
        };
      }
      return unwrappedPayload;
    }
  }

  if (message.buttonsMessage && !cfg.button) {
    const bm = message.buttonsMessage;
    const body = bm.contentText || '';
    const footer = bm.footerText ? `\n\n${bm.footerText}` : '';
    const fullText = `${body}${footer}`.trim();
    const contextInfo = normalizeContextInfo(bm.contextInfo || message.contextInfo, options?.quoted);

    if (bm.imageMessage) {
      return {
        imageMessage: {
          ...bm.imageMessage,
          caption: fullText,
          ...(contextInfo ? { contextInfo } : {}),
        },
      };
    }
    if (bm.videoMessage) {
      return {
        videoMessage: {
          ...bm.videoMessage,
          caption: fullText,
          ...(contextInfo ? { contextInfo } : {}),
        },
      };
    }
    if (bm.documentMessage) {
      return {
        documentMessage: {
          ...bm.documentMessage,
          caption: fullText,
          ...(contextInfo ? { contextInfo } : {}),
        },
      };
    }
    return {
      extendedTextMessage: {
        text: fullText,
        ...(contextInfo ? { contextInfo } : {}),
      },
    };
  }

  if (message.templateMessage && !cfg.button) {
    const tm =
      message.templateMessage.hydratedTemplate ||
      message.templateMessage.hydratedFourRowTemplate ||
      message.templateMessage.fourRowTemplate;
    if (tm) {
      const title = tm.hydratedTitleText ? `*${tm.hydratedTitleText}*\n\n` : '';
      const body = tm.hydratedContentText || tm.contentText || '';
      const footer =
        tm.hydratedFooterText || tm.footerText
          ? `\n\n${tm.hydratedFooterText || tm.footerText}`
          : '';
      const fullText = `${title}${body}${footer}`.trim();
      const contextInfo = normalizeContextInfo(tm.contextInfo || message.contextInfo, options?.quoted);

      if (tm.imageMessage) {
        return {
          imageMessage: {
            ...tm.imageMessage,
            caption: fullText,
            ...(contextInfo ? { contextInfo } : {}),
          },
        };
      }
      if (tm.videoMessage) {
        return {
          videoMessage: {
            ...tm.videoMessage,
            caption: fullText,
            ...(contextInfo ? { contextInfo } : {}),
          },
        };
      }
      if (tm.documentMessage) {
        return {
          documentMessage: {
            ...tm.documentMessage,
            caption: fullText,
            ...(contextInfo ? { contextInfo } : {}),
          },
        };
      }
      return {
        extendedTextMessage: {
          text: fullText,
          ...(contextInfo ? { contextInfo } : {}),
        },
      };
    }
  }

  return message;
};

export default async function initialize({ Exp, store }) {
  try {
    const { sendMessage, relayMessage } = Exp;

    Exp.relayMessage = async (jid, message, options = {}) => {
      const targetMsgId = options.messageId || generateMessageIDV2();
      options.messageId = targetMsgId;

      const unwrapRes = unwrapInteractiveMessage(message, options);
      let listQData = null;
      if (
        unwrapRes &&
        typeof unwrapRes === 'object' &&
        unwrapRes.payload &&
        unwrapRes.questionData
      ) {
        message = unwrapRes.payload;
        listQData = unwrapRes.questionData;
      } else {
        message = unwrapRes;
      }

      if (listQData) {
        Data.quotedQuestionCmd ??= {};
        Data.quotedQuestionCmd[targetMsgId] = {
          key: { id: targetMsgId },
          emit: '',
          exp: Date.now() + 10 * 60 * 1000,
          Keys: listQData.Keys,
          use: 0,
          maxUse: 999999,
          accepts: listQData.accepts,
          allUsers: true,
        };
      }

      injectMessageMentions(message);
      const isRich = injectRichResponseMessage(message);
      const isEdit = Boolean(
        message?.protocolMessage ||
          message?.botForwardedMessage?.message?.protocolMessage ||
          message?.botForwardedMessage?.protocolMessage
      );

      if (isRich && !isEdit) {
        const fullMsg = await generateWAMessageFromContent(
          jid,
          message,
          {
            messageId: options.messageId || generateMessageIDV2(),
          }
        );

        const res = await relayMessage.call(
          Exp,
          jid,
          fullMsg.message,
          {
            messageId: fullMsg.key.id,
            ...options,
          }
        );

        if (options.edit !== false) {
          try {
            const editMsg = await generateWAMessageFromContent(
              jid,
              {
                botForwardedMessage: {
                  message: {
                    protocolMessage: {
                      key: {
                        remoteJid: jid,
                        fromMe: true,
                        id: fullMsg.key.id,
                      },
                      type: 14,
                      editedMessage: fullMsg.message,
                    },
                  },
                },
              },
              {
                messageId: generateMessageIDV2(),
              }
            );
            await relayMessage.call(Exp, jid, editMsg.message, {
              messageId: editMsg.key.id,
            });
          } catch (e) {}
        }

        return res;
      }

      return relayMessage.call(Exp, jid, message, options);
    };

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

      if (typeof config === 'string') config = { text: config };
      else if (typeof config === 'object' && config !== null) {
        if (config.body && !config.text) {
          config.text = config.body;
        }
      }
      const rawText = typeof config?.text === 'string' ? config.text : typeof config?.caption === 'string' ? config.caption : '';
      const autoMentions = typeof rawText.mentions === 'function' ? rawText.mentions() : [];

      if (autoMentions.length > 0) {
        if (
          !config?.mentions &&
          !config?.mentionedJid &&
          !config?.contextInfo?.mentionedJid
        ) {
          config.mentions = autoMentions;
          if (config.contextInfo) {
            config.contextInfo.mentionedJid = autoMentions;
          }
        }
      }

      if (Array.isArray(config?.album) || Array.isArray(config?.albumMessage)) {
        const items = config.album || config.albumMessage;
        const imgCount = items.filter(
          (a) => a && ('image' in a || a.image)
        ).length;
        const vidCount = items.filter(
          (a) => a && ('video' in a || a.video)
        ).length;

        let parentMsg = await generateWAMessageFromContent(
          id,
          {
            messageContextInfo: {
              messageSecret: crypto.randomBytes(32),
            },
            albumMessage: {
              expectedImageCount: imgCount,
              expectedVideoCount: vidCount,
              ...(config.contextInfo
                ? { contextInfo: config.contextInfo }
                : {}),
            },
          },
          {
            userJid: jidNormalizedUser(Exp.user?.id || ''),
            quoted: etc.quoted,
            upload: Exp.waUploadToServer,
          }
        );

        if (etc.quoted) {
          parentMsg.message.albumMessage.contextInfo = {
            ...(parentMsg.message.albumMessage.contextInfo || {}),
            stanzaId: etc.quoted.key.id,
            participant: etc.quoted.key.participant || etc.quoted.key.remoteJid,
            quotedMessage: etc.quoted,
            mentionedJid:
              config.mentionedJid || config.mentions || autoMentions || [],
          };
        }

        await Exp.relayMessage(id, parentMsg.message, {
          messageId: parentMsg.key.id,
        });

        for (let item of items) {
          if (config.contextInfo && !item.contextInfo) {
            item = { ...item, contextInfo: config.contextInfo };
          }
          const mediaMsg = await generateWAMessage(id, item, {
            upload: Exp.waUploadToServer,
            userJid: jidNormalizedUser(Exp.user?.id || ''),
          });
          mediaMsg.message.messageContextInfo = {
            messageSecret: crypto.randomBytes(32),
            messageAssociation: {
              associationType: 1,
              parentMessageKey: parentMsg.key,
            },
          };
          await Exp.relayMessage(id, mediaMsg.message, {
            messageId: mediaMsg.key.id,
          });
        }

        return parentMsg;
      }

      const isNotice =
        typeof config?.text === 'string' &&
        (config.text.includes('Energy⚡') ||
          config.text.includes('⏱️Wait...') ||
          config.text.includes('Bntr...') ||
          config.text.includes('Cooldown') ||
          config.text.includes('Pesan API:'));

      if (
        config?.footer &&
        (config?.audio || config?.document || config?.sticker)
      )
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
                {
                  upload: Exp.waUploadToServer,
                  mediaTypeOverride: 'thumbnail-link',
                }
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

      if (config.linkPreview && config.footer) {
        delete config.footer;
      }

      let mtype = getContentType(config),
        isAI = !!config.ai && !id.endsWith(from.group),
        isPTT = config.ptt === true,
        isFooter = !!config.footer && !config.linkPreview,
        isLinkPreview = !!config.linkPreview,
        isInteractive =
          mtype == 'interactiveMessage' ||
          (isFooter && !isLinkPreview) ||
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
        ...etc,
        jid: id,
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
                  {
                    upload: Exp.waUploadToServer,
                    mediaTypeOverride: 'thumbnail-link',
                  }
                );
                if (favRes?.imageMessage) {
                  keys['termai_favicon_media'] = {
                    thumbnailDirectPath: favRes.imageMessage.directPath,
                    thumbnailSha256: favRes.imageMessage.fileSha256,
                    thumbnailEncSha256: favRes.imageMessage.fileEncSha256,
                    mediaKey: favRes.imageMessage.mediaKey,
                    mediaKeyTimestamp: String(
                      favRes.imageMessage.mediaKeyTimestamp || ts
                    ),
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
          mentionedJid:
            config.mentionedJid ||
            config.mentions ||
            message[type]?.contextInfo?.mentionedJid ||
            autoMentions ||
            [],
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

    Exp.sendAlbum = async (id, medias, etc = {}) => {
      return Exp.sendMessage(id, { album: medias }, etc);
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
