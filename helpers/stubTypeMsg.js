const { WAMessageStubType: StubType } = 'baileys'.import();
let infos = Data.infos;

export default async function stubTypeMsg({ Exp, cht, sewaDb }) {
  try {
    //console.log({ sewaDb, id: cht.id, sewadb2: Data.sewa[cht.id] }, JSON.stringify(Data.sewa,0,2))
    let { func } = Exp,
      chatDb = Data.preferences[cht.id],
      { wtype, ltype } = chatDb;
    const group = await func.getGroupMetadata(cht.id);

    //console.log({ group })
    const getSenders = async (cht) =>
      Promise.all(
        (cht.messageStubParameters || []).map((a) => {
          let _a = a;
          if (typeof a === 'string') {
            try {
              const parsed = JSON.parse(a);
              _a = parsed?.phoneNumber || parsed?.id || parsed;
            } catch {
              _a = a;
            }
          }

          if (typeof a === 'object' && a !== null) {
            _a = a.phoneNumber || a.id || a;
          }
          if (typeof _a !== 'string') {
            console.debug('_a is not String', { _a }.String());
            return _a;
          }
          return func.getSender(_a, { cht });
        })
      );

    //console.log({ getSenders: await getSenders(cht) })
    const _members = await getSenders(cht);
    const admin = cht?.participant;
    let members = _members.map((a) => `@${a?.split('@')[0]}`).join(', ');
    //console.log({ _members, members })
    let pp = await Exp.profilePictureUrl(_members[0]).catch(
      () => 'https://files.catbox.moe/7e4y9f.jpg'
    );

    const sendMsg = async (id, msg, q = Data.fquoted?.welcome) =>
      Exp.sendMessage(id, msg, q ?? { quoted: q });
    const relayMsg = (id, msg) => Exp.relayMessage(id, msg, {});
    const thumb = async () =>
      Buffer.from(await fetch(pp).then((a) => a.arrayBuffer())).toString(
        'base64'
      );
    const genText = (type, members, subject, desc, mode) =>
      func.tagReplacer(
        chatDb[mode == 'welcome' ? 'wtxt' : 'ltxt'] ||
          (mode == 'welcome'
            ? `\`[ WELCOME ]\`\n\nHai <members>\n\nSelamat datang di group \n> _*<subject>*_\n\n<desc>\n`
            : `\`[ GOOD BYE ]\`\n\nSelamat tinggal <members>`),
        { members, subject, desc: desc ? `\n${infos.readMore}\n${desc}` : '' }
      );
    let Manager = async (cht) => {
      const stubName =
        typeof cht.messageStubType === 'string'
          ? cht.messageStubType
          : Object.keys(StubType).find(
              (k) => StubType[k] === cht.messageStubType
            );
      console.log(
        `${func.color.yellow('[GROUP_METADATA_TRIGGER]')} ` +
          `${func.color.white('Event:')} ${func.color.cyan(stubName)}`
      );

      return await func.getGroupMetadata(cht.id, true);
    };
    //console.log({ genText: genText(wtype, members, group.subject, group.desc, 'welcome') })
    let stubType =
      typeof cht.messageStubType == 'string'
        ? StubType[cht.messageStubType]
        : cht.messageStubType;
    switch (stubType) {
      case StubType.GROUP_PARTICIPANT_ADD:
      case StubType.GROUP_PARTICIPANT_ADD_REQUEST_JOIN: {
        await func.getGroupMetadata(cht.id, true);
        if (!Data.preferences[cht.id]?.welcome) return;
        let text = genText(
          wtype,
          members,
          group.subject,
          group.desc,
          'welcome'
        );
        const msgBase = {
          mentions: _members,
          contextInfo: {
            externalAdReply: {
              title:
                'Hai ' + _members.map((a) => Exp.func.getName(a)).join(', '),
              body: `Selamat datang di group ${group.subject}`,
              thumbnailUrl: pp,
              sourceUrl: 'https://github.com/Rifza123',
              mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 1e17)}`,
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
        if (wtype == 'text')
          cht.reply(
            text,
            { mentions: _members },
            { quoted: Data.fquoted?.welcome }
          );
        else if (wtype == 'linkpreview')
          await sendMsg(cht.id, { text, ...msgBase });
        else if (wtype == 'image')
          await sendMsg(cht.id, {
            image: { url: pp },
            caption: text,
            mentions: _members,
          });
        else if (wtype == 'order')
          relayMsg(cht.id, {
            orderMessage: {
              orderId: '530240676665078',
              status: 'INQUIRY',
              surface: 'CATALOG',
              ItemCount: 0,
              message: `Hai ${members}`,
              totalCurrencyCode: `Selamat datang di group ${group.subject}`,
              sellerJid: '6281374955605@s.whatsapp.net',
              token: 'AR6oiV5cQjZsGfjvfDwl0DXfnAE+OPRkWAQtFDaB9wxPlQ==',
              thumbnail: await thumb(),
            },
          });
        else if (wtype == 'product')
          relayMsg(cht.id, {
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
          });
        else await sendMsg(cht.id, { text, ...msgBase });
        Data.audio?.welcome?.length &&
          sendMsg(cht.id, {
            audio: { url: Data.audio.welcome.getRandom() },
            mimetype: 'audio/mpeg',
          });
        break;
      }

      case StubType.GROUP_PARTICIPANT_REMOVE:
      case StubType.GROUP_PARTICIPANT_LEAVE: {
        func.getGroupMetadata(cht.id, true);
        if (_members.includes(Exp.number))
          return delete Data.preferences[cht.id];
        if (
          'leave' in chatDb
            ? !chatDb?.leave
            : !Data.preferences[cht.id]?.welcome
        )
          return;
        let text = genText(ltype, members, group.subject, group.desc, 'leave');
        ltype ||= 'linkpreview';
        const msgBase = {
          mentions: _members,
          contextInfo: {
            externalAdReply: {
              title:
                'Byee ' + _members.map((a) => Exp.func.getName(a)).join(', '),
              body: `Selamat tinggal dari group ${group.subject}`,
              thumbnailUrl: pp,
              sourceUrl: 'https://github.com/Rifza123',
              mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 1e17)}`,
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
        if (ltype == 'text')
          cht.reply(
            text,
            { mentions: _members },
            { quoted: Data.fquoted?.welcome }
          );
        else if (ltype == 'linkpreview')
          await sendMsg(cht.id, { text, ...msgBase });
        else if (ltype == 'image')
          await sendMsg(cht.id, {
            image: { url: pp },
            caption: text,
            mentions: _members,
          });
        else if (ltype == 'order')
          relayMsg(cht.id, {
            orderMessage: {
              orderId: '530240676665078',
              status: 'INQUIRY',
              surface: 'CATALOG',
              ItemCount: 0,
              message: `Byee ${members}`,
              totalCurrencyCode: `Selamat tinggal dari group ${group.subject}`,
              sellerJid: '6281374955605@s.whatsapp.net',
              token: 'AR6oiV5cQjZsGfjvfDwl0DXfnAE+OPRkWAQtFDaB9wxPlQ==',
              thumbnail: await thumb(),
            },
          });
        else if (ltype == 'product')
          relayMsg(cht.id, {
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
          });
        else await sendMsg(cht.id, { text, ...msgBase });
        Data.audio?.leave?.length &&
          sendMsg(cht.id, {
            audio: { url: Data.audio.leave.getRandom() },
            mimetype: 'audio/mpeg',
          });
        break;
      }

      case StubType.GROUP_PARTICIPANT_PROMOTE: {
        Manager(cht);

        await Exp.sendMessage(cht.id, {
          text: `*ℹ️Promote Admin* 

${members} baru aja dipromosikan menjadi admin oleh @${admin.split('@')[0]} ✨

Selamat yaaa~ sekarang resmi jadi admin(๑˃ᴗ˂)ﻭ 💖`,
          mentions: [..._members, admin],
        });
        break;
      }

      case StubType.GROUP_PARTICIPANT_DEMOTE: {
        Manager(cht);

        await Exp.sendMessage(cht.id, {
          text: `⚠️ *Demote Admin*

Maaf yaa ${members}, kamu baru aja diberhentiin dari jabatan admin oleh @${admin.split('@')[0]} (｡•́︿•̀｡)
Sekarang kamu udah bukan admin lagi ya…`,
          mentions: [..._members, admin],
        });
        break;
      }

      case StubType.GROUP_CREATE:
        {
          let meta = await Manager(cht),
            { participants } = meta,
            mentions = participants.map((a) => a.id);

          if (cfg.sewa) {
            let now = Date.now();

            if (!sewaDb) {
              chatDb.mute = true;
              await Exp.sendMessage(cht.id, {
                text: `❌ *BELUM TERDAFTAR SEWA*

Heii (｡•́︿•̀｡)
Saat ini bot belum aktif di grup ini ya…

Kalau ingin menggunakan bot, silakan sewa terlebih dahulu 💖✨
Hubungi owner di bawah ini yaa ( ˘͈ᵕ˘͈ )♡`,
                mentions,
              });

              await Exp.sendContacts(cht, owner);
              return;
            }

            if (typeof sewaDb !== 'object') sewaDb = {};

            if (sewaDb.exp) {
              sewaDb.exp ??= now;

              if (sewaDb.graceUntil) {
                if (typeof sewaDb.graceUntil !== 'number')
                  sewaDb.graceUntil = Date.now();

                if (now >= sewaDb.graceUntil) {
                  sewaDb.graceUntil =
                    Date.now() + func.parseTimeString('5 menit');
                  sewaDb.status = 'grace';

                  await Exp.sendMessage(cht.id, {
                    text: `⏳ *Masa Sewa Telah Berakhir*

Halo semuanya (˘•ω•˘)
Bot sebelumnya pernah disewa di grup ini, tapi belum diperpanjang ya…

Bot akan keluar dalam *5 menit* kalau belum ada perpanjangan~
Kalau masih mau dipakai, langsung hubungi owner yaa (๑˃ᴗ˂)ﻭ💗`,
                    mentions,
                  });
                }
              }
            }
          }
        }
        break;

      case StubType.GROUP_CHANGE_SUBJECT:
      case StubType.GROUP_CHANGE_ICON:
      case StubType.GROUP_CHANGE_INVITE_LINK:
      case StubType.GROUP_CHANGE_DESCRIPTION:
      case StubType.GROUP_CHANGE_RESTRICT:
      case StubType.GROUP_CHANGE_ANNOUNCE:
      case StubType.GROUP_PARTICIPANT_INVITE:
      case StubType.GROUP_PARTICIPANT_CHANGE_NUMBER:
      case StubType.GROUP_ANNOUNCE_MODE_MESSAGE_BOUNCE:
      case StubType.GROUP_CHANGE_NO_FREQUENTLY_FORWARDED:
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
        Manager(cht);
        break;
    }
  } catch (e) {
    console.error('Error in stubTypeMsg:', e);
  }
}
