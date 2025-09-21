const { WAMessageStubType: StubType } = 'baileys'.import();
let infos = Data.infos;

export default async function stub({ Exp, cht }) {

  let { func } = Exp

  switch (cht?.messageStubType) {
      case StubType.GROUP_PARTICIPANT_ADD:
      await func.getGroupMetadata(cht.id, Exp, true)
      {
        if (!Data.preferences[cht.id]?.welcome) return;
        let newMember = await Promise.all(
          cht.messageStubParameters?.map(async (a) => {
            return await Exp.func.getSender(a, { cht });
          }) || []
        );

        let members = newMember.map((a) => `@${a.split('@')[0]}`).join(', ');
        let group = await Exp.groupMetadata(cht.id);
        let pp;
        try {
          pp = await Exp.profilePictureUrl(newMember[0]);
        } catch {
          pp = 'https://files.catbox.moe/7e4y9f.jpg';
        }
        let text =
          `\`[ WELCOME ]\`

Hai ${members}

Selamat datang di group 
> _*${group.subject}*_
` +
          (group?.desc
            ? `
*Harap baca dan patuhi peraturan disini ya:*
${infos.readMore}
${group.desc}`
            : '');

        if (cfg.welcome == 'text') {
          cht.reply(
            text,
            { mentions: newMember },
            { quoted: Data.fquoted?.welcome }
          );
        } else if (cfg.welcome == 'linkpreview') {
          let welcome = {
            text,

            contextInfo: {
              externalAdReply: {
                title:
                  'Hai ' + newMember.map((a) => Exp.func.getName(a)).join(', '),
                body: `Selamat datang di group ${group.subject}`,
                thumbnailUrl: pp,
                sourceUrl: 'https://github.com/Rifza123',
                mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 100000000000000000)}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363301254798220@newsletter',
                serverMessageId: 152,
              },
              mentionedJid: newMember,
            },
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        } else if (cfg.welcome == 'image') {
          let welcome = {
            image: { url: pp },
            mentions: newMember,
            caption: text,
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        } else if (cfg.welcome == 'order') {
          Exp.relayMessage(
            cht.id,
            {
              orderMessage: {
                orderId: '530240676665078',
                status: 'INQUIRY',
                surface: 'CATALOG',
                ItemCount: 0,
                message: `Hai ${members}`,
                totalCurrencyCode: `Selamat datang di group ${group.subject}`,
                sellerJid: '6281374955605@s.whatsapp.net',
                token: 'AR6oiV5cQjZsGfjvfDwl0DXfnAE+OPRkWAQtFDaB9wxPlQ==',
                thumbnail: await Buffer.from(
                  await fetch(pp).then((a) => a.arrayBuffer())
                ).toString('base64'),
              },
            },
            {}
          );
        } else if (cfg.welcome == 'product') {
          Exp.relayMessage(
            cht.id,
            {
              productMessage: {
                product: {
                  productImage: await Exp.func.uploadToServer(pp),
                  productId: '8080277038663215',
                  title: `Hai ${members}`,
                  description: `Hai ${members}`,
                  currencyCode: 'TERMAI',
                  priceAmount1000: `Selamat datang di group ${group.subject}`,
                  productImageCount: 8,
                },
                businessOwnerJid: '6281374955605@s.whatsapp.net',
                contextInfo: {
                  expiration: 86400,
                  ephemeralSettingTimestamp: '1723572108',
                  disappearingMode: {
                    initiator: 'CHANGED_IN_CHAT',
                    trigger: 'ACCOUNT_SETTING',
                  },
                },
              },
            },
            {}
          );
        } else {
          let welcome = {
            text,
            mentions: newMember,
            contextInfo: {
              externalAdReply: {
                title:
                  'Hai ' + newMember.map((a) => Exp.func.getName(a)).join(', '),
                body: `Selamat datang di group ${group.subject}`,
                thumbnailUrl: pp,
                sourceUrl: 'https://github.com/Rifza123',
                mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 100000000000000000)}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363301254798220@newsletter',
                serverMessageId: 152,
              },
            },
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        }

        Data.audio?.welcome?.length > 0 &&
          Exp.sendMessage(
            cht.id,
            {
              audio: { url: Data.audio.welcome.getRandom() },
              mimetype: 'audio/mpeg',
            },
            { quoted: Data.fquoted?.welcome }
          );
      }
      break;

      case StubType.GROUP_PARTICIPANT_REMOVE:
      case StubType.GROUP_PARTICIPANT_LEAVE:
        func.getGroupMetadata(cht.id, Exp, true)
      {
        let oldMember = await Promise.all(
          cht.messageStubParameters?.map(async (a) => {
            return await Exp.func.getSender(a, { cht });
          }) || []
        );
        if (oldMember.includes(Exp.number)) {
          delete Data.preferences[cht.id];
          return;
        }
        if (!Data.preferences[cht.id]?.welcome) return;
        let members = oldMember.map((a) => `@${a?.split('@')[0]}`).join(', ');
        let group = await Exp.groupMetadata(cht.id);
        let pp;
        try {
          pp = await Exp.profilePictureUrl(oldMember[0]);
        } catch {
          pp = 'https://files.catbox.moe/7e4y9f.jpg';
        }
        let text = `\`[ GOOD BYE ]\`

Selamat tinggal ${members}`;
        cfg.welcome = cfg?.welcome || 'linkpreview';

        if (cfg.welcome == 'text') {
          cht.reply(
            text,
            { mentions: oldMember },
            { quoted: Data.fquoted?.welcome }
          );
        } else if (cfg.welcome == 'linkpreview') {
          let welcome = {
            text,
            contextInfo: {
              externalAdReply: {
                title:
                  'Byee ' +
                  oldMember.map((a) => Exp.func.getName(a)).join(', '),
                body: `Selamat tinggal dari group ${group.subject}`,
                thumbnailUrl: pp,
                sourceUrl: 'https://github.com/Rifza123',
                mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 100000000000000000)}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363301254798220@newsletter',
                serverMessageId: 152,
              },
              mentionedJid: oldMember,
            },
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        } else if (cfg.welcome == 'image') {
          let welcome = {
            image: { url: pp },
            mentions: oldMember,
            caption: text,
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        } else if (cfg.welcome == 'order') {
          Exp.relayMessage(
            cht.id,
            {
              orderMessage: {
                orderId: '530240676665078',
                status: 'INQUIRY',
                surface: 'CATALOG',
                ItemCount: 0,
                message: `Byee ${members}`,
                totalCurrencyCode: `Selamat tinggal dari group ${group.subject}`,
                sellerJid: '6281374955605@s.whatsapp.net',
                token: 'AR6oiV5cQjZsGfjvfDwl0DXfnAE+OPRkWAQtFDaB9wxPlQ==',
                thumbnail: await Buffer.from(
                  await fetch(pp).then((a) => a.arrayBuffer())
                ).toString('base64'),
              },
            },
            {}
          );
        } else if (cfg.welcome == 'product') {
          Exp.relayMessage(
            cht.id,
            {
              productMessage: {
                product: {
                  productImage: await Exp.func.uploadToServer(pp),
                  productId: '8080277038663215',
                  title: `Hai ${members}`,
                  description: `Byee ${members}`,
                  currencyCode: 'TERMAI',
                  priceAmount1000: `Selamat tinggal dari group ${group.subject}`,
                  productImageCount: 8,
                },
                businessOwnerJid: '6281374955605@s.whatsapp.net',
                contextInfo: {
                  expiration: 86400,
                  ephemeralSettingTimestamp: '1723572108',
                  disappearingMode: {
                    initiator: 'CHANGED_IN_CHAT',
                    trigger: 'ACCOUNT_SETTING',
                  },
                },
              },
            },
            {}
          );
        } else {
          let welcome = {
            text,
            mentions: oldMember,
            contextInfo: {
              externalAdReply: {
                title:
                  'Byee ' +
                  oldMember.map((a) => Exp.func.getName(a)).join(', '),
                body: `Selamat tinggal dari group ${group.subject}`,
                thumbnailUrl: pp,
                sourceUrl: 'https://github.com/Rifza123',
                mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 100000000000000000)}`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
              forwardingScore: 19,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363301254798220@newsletter',
                serverMessageId: 152,
              },
            },
          };
          await Exp.sendMessage(cht.id, welcome, {
            quoted: Data.fquoted?.welcome,
          });
        }

        Data.audio?.leave?.length > 0 &&
          Exp.sendMessage(
            cht.id,
            {
              audio: { url: Data.audio.leave.getRandom() },
              mimetype: 'audio/mpeg',
            },
            { quoted: Data.fquoted?.welcome }
          );
      }
      break;
      
      
      case StubType.GROUP_CREATE:
      case StubType.GROUP_CHANGE_SUBJECT:
      case StubType.GROUP_CHANGE_ICON:
      case StubType.GROUP_CHANGE_INVITE_LINK:
      case StubType.GROUP_CHANGE_DESCRIPTION:
      case StubType.GROUP_CHANGE_RESTRICT:
      case StubType.GROUP_CHANGE_ANNOUNCE:
      case StubType.GROUP_PARTICIPANT_PROMOTE:
      case StubType.GROUP_PARTICIPANT_DEMOTE:
      case StubType.GROUP_PARTICIPANT_INVITE:
      case StubType.GROUP_PARTICIPANT_CHANGE_NUMBER:
      case StubType.GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE:
      case StubType.GROUP_CHANGE_NO_FREQUENTLY_FORWARDED:
      case StubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
      case StubType.GROUP_BOUNCED:
      case StubType.GROUP_INVITE_LINK_GROWTH_LOCKED:
      case StubType.COMMUNITY_LINK_PARENT_GROUP:
      case StubType.COMMUNITY_LINK_SIBLING_GROUP:
      case StubType.COMMUNITY_LINK_SUB_GROUP:
      case StubType.COMMUNITY_UNLINK_PARENT_GROUP:
      case StubType.COMMUNITY_UNLINK_SIBLING_GROUP:
      case StubType.COMMUNITY_UNLINK_SUB_GROUP:
      case StubType.GROUP_PARTICIPANT_ACCEPT:
      case StubType.GROUP_PARTICIPANT_LINKED_GROUP_JOIN:
      case StubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST:
      case StubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_MODE:
      case StubType.INTEGRITY_UNLINK_PARENT_GROUP:
      case StubType.COMMUNITY_PARENT_GROUP_DELETED:
      case StubType.COMMUNITY_LINK_PARENT_GROUP_MEMBERSHIP_APPROVAL:
      case StubType.GROUP_PARTICIPANT_JOINED_GROUP_AND_PARENT_GROUP:
      case StubType.COMMUNITY_PARENT_GROUP_SUBJECT_CHANGED:
      case StubType.SUB_GROUP_INVITE_RICH:
      case StubType.SUB_GROUP_PARTICIPANT_ADD_RICH:
      case StubType.COMMUNITY_LINK_PARENT_GROUP_RICH:
      case StubType.GROUP_MEMBER_ADD_MODE:
      case StubType.GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD:
      case StubType.COMMUNITY_ALLOW_MEMBER_ADDED_GROUPS:
      case StubType.LINKED_GROUP_CALL_START:
      case StubType.EMPTY_SUBGROUP_CREATE:
      case StubType.SUBGROUP_ADMIN_TRIGGERED_AUTO_ADD_RICH:
      case StubType.GROUP_CHANGE_RECENT_HISTORY_SHARING:
      case StubType.SUGGESTED_SUBGROUP_ANNOUNCE:
      case StubType.COMMUNITY_DEACTIVATE_SIBLING_GROUP:
      case StubType.COMMUNITY_SUB_GROUP_VISIBILITY_HIDDEN:
      case StubType.GROUP_MEMBER_LINK_MODE:
        await func.getGroupMetadata(cht.id, Exp, true)
      break
  }
}
