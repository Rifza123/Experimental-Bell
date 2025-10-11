/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const axios = 'axios'.import();
const { generateWAMessageFromContent } = 'baileys'.import();
const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r();
let exif = await (fol[0] + 'exif.js').r();
let { convert } = exif;

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
  let { sender, id } = cht;
  let { func } = Exp;
  let infos = Data.infos;

  ev.on(
    {
      cmd: ['pin', 'pinterest', 'pinterestsearch'],
      listmenu: ['pinterest'],
      tag: 'search',
      args: 'Cari apa?',
      badword: true,
      energy: 5,
    },
    async () => {
      let [query, geser] = cht?.q?.split('--geser');
      let amount = parseInt(geser?.split(' ')?.[1] || 5);
      amount = amount > 15 ? 15 : amount < 1 ? 1 : amount;
      let res = await fetch(
        `${api.xterm.url}/api/search/pinterest-image?query=${query}&key=${api.xterm.key}`
      ).then((a) => a.json());
      let { data } = res || {};
      if (data.length < 1) return cht.reply('Tidak ditemukan!');
      if (typeof geser == 'string') {
        let cards = [];
        data = data.slice(0, amount);

        for (let i of data) {
          let img = await Exp.func.uploadToServer(i);
          cards.push({
            header: {
              imageMessage: img,
              hasMediaAttachment: true,
            },
            body: { text: `#${cards.length + 1}` },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'cta_url',
                  buttonParamsJson:
                    '{"display_text":"WhatsappChannel","url":"https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V","webview_presentation":null}',
                },
              ],
            },
          });
        }

        let msg = generateWAMessageFromContent(
          id,
          {
            viewOnceMessage: {
              message: {
                interactiveMessage: {
                  body: {
                    text: `Result from "${query?.trim()}"`,
                  },
                  carouselMessage: {
                    cards,
                    messageVersion: 1,
                  },
                },
              },
            },
          },
          {}
        );

        Exp.relayMessage(msg.key.remoteJid, msg.message, {
          messageId: msg.key.id,
        });
      } else {
        Exp.sendMessage(
          id,
          { image: { url: data.slice(0, 10).getRandom() } },
          { quoted: cht }
        );
      }
    }
  );

  ev.on(
    {
      cmd: ['pinstik', 'pinstick', 'pinstiker', 'pinsticker'],
      listmenu: ['pinsticker'],
      tag: 'search',
      energy: 5,
      args: `Mau cari sticker apa?`,
    },
    async ({ args }) => {
      try {
        let res = await fetch(
          `${api.xterm.url}/api/search/pinterest-image?query=${args}&key=${api.xterm.key}`
        ).then((a) => a.json());
        let { data } = res || {};
        if (data.length < 1) return cht.reply('Tidak ditemukan!');
        let url = await convert({
          url: data.slice(0, 20).getRandom(),
          from: 'jpg',
          to: 'webp',
        });
        let buff = await func.getBuffer(url);
        let s = await exif['writeExifImg'](
          buff,
          {
            packname: 'My sticker',
            author: 'Ⓒ' + cht.pushName,
          },
          true
        );
        Exp.sendMessage(
          id,
          {
            sticker: {
              url: s,
            },
          },
          {
            quoted: cht,
          }
        );
      } catch (e) {
        console.error(e);
        await cht.reply('Failed convert image to sticker!');
        throw new Error(e);
      }
    }
  );

  ev.on(
    {
      cmd: ['gis', 'image', 'gimage', 'googleimage', 'gimg', 'googleimg'],
      listmenu: ['googleimage'],
      tag: 'search',
      args: `Contoh: ${cht.msg} Xun'er`,
      badword: true,
      energy: 5,
    },
    async () => {
      try {
        let url = await fetch(
          api.xterm.url +
            '/api/search/google-image?query=' +
            encodeURIComponent(cht.q) +
            '&key=' +
            api.xterm.key
        ).then(async (a) => {
          if (!a.ok) throw new Error(`Fetch failed with status ${a.status}`);
          let res = await a.json();
          if (!res?.data) throw new Error('Response missing data');
          return res.data.getRandom();
        });

        await Exp.sendMessage(
          id,
          { image: { url }, caption: `Google image search: \`${cht.q}\`` },
          { quoted: cht }
        ).catch((err) =>
          cht.reply(`Failed sending image: ${err.message}\nURL: ${url}`)
        );
      } catch (err) {
        cht.reply(`❌ Error: ${err.message}`);
      }
    }
  );

  ev.on(
    {
      cmd: ['pinvid', 'pinterestvid', 'pinterestvideo'],
      listmenu: ['pinterestvideo'],
      tag: 'search',
      args: 'Cari apa?',
      badword: true,
      energy: 21,
    },
    async () => {
      try {
        let [query, geser] = cht?.q?.split('--geser');
        let amount = parseInt(geser?.split(' ')?.[1] || 5);
        amount = amount > 10 ? 10 : amount < 1 ? 1 : amount;

        await cht.edit(infos.messages.wait, keys[sender]);

        let data =
          (
            await fetch(
              api.xterm.url +
                '/api/search/pinterest-video?query=' +
                query +
                '&key=' +
                api.xterm.key
            ).then((a) => a.json())
          ).data?.pins || [];

        if (data.length < 1) return cht.reply('Video tidak ditemukan!');

        if (typeof geser == 'string') {
          let res = await fetch(
            `${api.xterm.url}/api/search/pinterest-image?query=${query}&key=${api.xterm.key}`
          ).then((a) => a.json());
          let cards = [];
          if (data) {
            data = data.slice(0, amount);

            for (let i of data) {
              let p = (
                await fetch(
                  api.xterm.url +
                    '/api/downloader/pinterest?url=' +
                    i.link +
                    '&key=' +
                    api.xterm.key
                ).then((a) => a.json())
              ).data;
              let _pin = Object.values(p.videos)[0].url;
              let vid = await Exp.func.uploadToServer(_pin, 'video');
              cards.push({
                header: {
                  videoMessage: vid,
                  hasMediaAttachment: true,
                },
                body: { text: i.title },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: 'cta_url',
                      buttonParamsJson:
                        '{"display_text":"WhatsappChannel","url":"https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V","webview_presentation":null}',
                    },
                  ],
                },
              });
            }

            let msg = generateWAMessageFromContent(
              id,
              {
                viewOnceMessage: {
                  message: {
                    interactiveMessage: {
                      body: {
                        text: `Result from "${query?.trim()}"`,
                      },
                      carouselMessage: {
                        cards,
                        messageVersion: 1,
                      },
                    },
                  },
                },
              },
              {}
            );

            Exp.relayMessage(msg.key.remoteJid, msg.message, {
              messageId: msg.key.id,
            });
          }
        } else {
          let pin = data[Math.floor(Math.random() * data.length)];
          let p = (
            await fetch(
              api.xterm.url +
                '/api/downloader/pinterest?url=' +
                pin.link +
                '&key=' +
                api.xterm.key
            ).then((a) => a.json())
          ).data;
          let _pin = Object.values(p.videos)[0].url;
          Exp.sendMessage(
            id,
            { video: { url: _pin }, caption: pin.title, mimetype: 'video/mp4' },
            { quoted: cht }
          );
        }
      } catch (e) {
        return cht.reply('TypeErr:' + e.message);
      }
    }
  );

  ev.on(
    {
      cmd: ['animesearch'],
      listmenu: ['animesearch'],
      tag: 'search',
      media: {
        type: ['image', 'sticker'],
        msg: `Reply gambar/sticker dengan caption ${cht.prefix}animesearch untuk mencari anime!`,
        save: false,
      },
      energy: 5,
    },
    async ({ media }) => {
      try {
        let link = await TermaiCdn(media);
        const apiUrl = `https://api.trace.moe/search?url=${encodeURIComponent(link)}`;

        const res = await fetch(apiUrl);
        const { result } = await res.json();

        if (!res.ok || !result || result.length < 1) {
          return cht.reply(
            '❌ Tidak ditemukan informasi anime untuk gambar yang diberikan.'
          );
        }

        const anime = result[0];
        const { anilist, filename, episode, similarity, video, image } = anime;

        const caption =
          `🎥 *Anime Found!* 🎥\n\n` +
          `📄 *Episode*: ${episode || 'Unknown'}\n` +
          `🔗 *Similarity*: ${(similarity * 100).toFixed(2)}%\n` +
          `🖼️ *Filename*: ${filename || 'Unknown'}\n\n` +
          `📺 \`Preview Video\`: ${video}\n` +
          `🌟 \`Anilist Link\`: https://anilist.co/anime/${anilist}`;

        await Exp.sendMessage(
          cht.id,
          { image: { url: image }, caption },
          { quoted: cht }
        );
        Exp.sendMessage(
          cht.id,
          {
            video: { url: video },
            caption: `📺 \`Preview Video\`: ${filename}`,
          },
          { quoted: cht }
        );
      } catch (error) {
        console.error(error);
        cht.reply(
          '❌ Terjadi kesalahan saat menghubungi API. Silakan coba lagi nanti.'
        );
      }
    }
  );

  ev.on(
    {
      cmd: ['roblox', 'robinfo', 'roblook'],
      listmenu: ['roblox'],
      tag: 'search',
      args: `Contoh: ${cht.msg} Simoon68`,
      badword: false,
      energy: 5,
    },
    async () => {
      try {
        cht.reply(`One moment please...`);

        const response = await axios.get(
          `https://altera-api.vercel.app/api/roblox?value=${encodeURIComponent(
            cht.q
          )}&key=A-CORE`
        );

        const { PrintToTerminal: user } = response.data;
        if (!user) {
          return cht.reply('User not found or API returned no data');
        }

        const {
          id,
          username,
          displayName,
          description,
          created,
          isBanned,
          isPremium,
          isVerified,
          status,
          presence = {},
          isOnline,
          lastLocation,
          avatarHeadshotUrl,
          avatarBustUrl,
          avatarFullUrl,
          avatar3dUrl,
          avatarAssets = [],
          avatarType,
          scales = {},
          bodyColors = {},
          emotes = [],
          currentlyWearing = [],
          outfits = [],
          previousUsernames = [],
          friendList = [],
          followerCount,
          friendsCount,
          followingCount,
          badges = [],
          gameBadges = [],
          groups = [],
          primaryGroup,
          inventory = [],
          collectibles = [],
          robux,
          games = [],
          userGames = [],
          favoriteGames = [],
          universeInfo = [],
          developedUniverses = [],
          accountAgeYears,
        } = user;

        const formatNumber = (num) =>
          num != null ? num.toLocaleString() : '0';

        const formatDate = (dateString) => {
          if (!dateString) return 'Unknown';
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        };

        let caption = `PROFILE INFORMATION\n`;
        caption += `├─ User ID: ${id || 'N/A'}\n`;
        caption += `├─ Display Name: ${displayName || 'N/A'}\n`;
        caption += `├─ Username: ${username || 'N/A'}\n`;
        caption += `├─ Status: ${status || 'No status set'}\n`;
        caption += `├─ Description: ${
          description || 'No description available'
        }\n`;
        caption += `├─ Created: ${created ? formatDate(created) : 'Unknown'}\n`;
        caption += `├─ Account Age: ${accountAgeYears || 'Unknown'} years\n`;
        caption += `├─ Banned: ${isBanned ? 'Yes' : 'No'}\n`;
        caption += `├─ Premium: ${isPremium ? 'Yes' : 'No'}\n`;
        caption += `├─ Verified: ${isVerified ? 'Yes' : 'No'}\n`;
        caption += `├─ Online: ${
          isOnline === true ? 'Yes' : isOnline === false ? 'No' : 'Unknown'
        }\n`;
        caption += `├─ Presence: ${
          presence.userPresenceType === 0
            ? 'Offline'
            : presence.userPresenceType === 1
              ? 'Online'
              : presence.userPresenceType === 2
                ? 'In Game'
                : 'Unknown'
        }\n`;
        caption += `├─ Last Location: ${lastLocation || 'Unknown'}\n`;
        caption += `└─ Robux Balance: ${formatNumber(robux)}\n\n`;

        caption += `SOCIAL STATISTICS\n`;
        caption += `├─ Followers: ${formatNumber(followerCount)}\n`;
        caption += `├─ Following: ${formatNumber(followingCount)}\n`;
        caption += `└─ Friends: ${formatNumber(friendsCount)}\n\n`;

        caption += `AVATAR INFORMATION\n`;
        caption += `├─ Type: ${avatarType || 'Unknown'}\n`;
        caption += `├─ Assets: ${formatNumber(avatarAssets.length)}\n`;
        caption += `├─ Emotes: ${formatNumber(emotes.length)}\n`;
        caption += `├─ Currently Wearing: ${formatNumber(
          currentlyWearing.length
        )}\n`;
        caption += `└─ Outfits: ${formatNumber(outfits.length)}\n\n`;

        if (bodyColors && Object.keys(bodyColors).length > 0) {
          caption += `BODY COLORS\n`;
          Object.entries(bodyColors).forEach(
            ([part, colorId], index, array) => {
              const partName = part
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
              const isLast = index === array.length - 1;
              caption += `${isLast ? '└─' : '├─'} ${partName}: ${colorId}\n`;
            }
          );
          caption += `\n`;
        }

        if (scales && Object.keys(scales).length > 0) {
          caption += `AVATAR SCALES\n`;
          Object.entries(scales).forEach(([scale, value], index, array) => {
            const scaleName = scale
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());
            const isLast = index === array.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${scaleName}: ${value}\n`;
          });
          caption += `\n`;
        }

        if (avatarAssets.length > 0) {
          caption += `AVATAR ASSETS (${avatarAssets.length})\n`;
          avatarAssets.forEach((asset, index) => {
            const isLast = index === avatarAssets.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${
              asset.name
            } (${asset.assetType.name})\n`;
          });
          caption += `\n`;
        }

        if (emotes.length > 0) {
          caption += `EMOTES (${emotes.length})\n`;
          emotes.forEach((emote, index) => {
            const isLast = index === emotes.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${
              emote.assetName
            } (Position: ${emote.position})\n`;
          });
          caption += `\n`;
        }

        if (outfits.length > 0) {
          caption += `OUTFITS (${outfits.length})\n`;
          outfits.forEach((outfit, index) => {
            const isLast = index === outfits.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${
              outfit.name
            } ${outfit.isEditable ? '(Editable)' : '(Not Editable)'}\n`;
          });
          caption += `\n`;
        }

        if (groups.length > 0) {
          caption += `GROUPS (${groups.length})\n`;
          if (primaryGroup) {
            caption += `├─ Primary Group: ${primaryGroup.group.name}\n`;
            caption += `└─ Primary Role: ${primaryGroup.role.name}\n\n`;
          }

          groups.forEach((group, index) => {
            const isLast = index === groups.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${
              group.group.name
            }\n`;
            if (!isLast) {
              caption += `│   ├─ ID: ${group.group.id}\n`;
              caption += `│   ├─ Members: ${formatNumber(
                group.group.memberCount
              )}\n`;
              caption += `│   ├─ Role: ${group.role.name}\n`;
              caption += `│   ├─ Rank: ${group.role.rank}\n`;
              caption += `│   └─ Verified: ${
                group.group.hasVerifiedBadge ? 'Yes' : 'No'
              }\n`;
            } else {
              caption += `    ├─ ID: ${group.group.id}\n`;
              caption += `    ├─ Members: ${formatNumber(
                group.group.memberCount
              )}\n`;
              caption += `    ├─ Role: ${group.role.name}\n`;
              caption += `    ├─ Rank: ${group.role.rank}\n`;
              caption += `    └─ Verified: ${
                group.group.hasVerifiedBadge ? 'Yes' : 'No'
              }\n`;
            }
          });
          caption += `\n`;
        }

        if (badges.length > 0) {
          caption += `OFFICIAL BADGES (${badges.length})\n`;
          badges.forEach((badge, index) => {
            const isLast = index === badges.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${badge.name}\n`;
            if (!isLast) {
              caption += `│   └─ ${badge.description}\n`;
            } else {
              caption += `    └─ ${badge.description}\n`;
            }
          });
          caption += `\n`;
        }

        if (gameBadges.length > 0) {
          caption += `GAME BADGES (${gameBadges.length})\n`;
          gameBadges.forEach((badge, index) => {
            const isLast = index === gameBadges.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${badge.name}\n`;
            if (!isLast) {
              caption += `│   ├─ Description: ${badge.description}\n`;
              caption += `│   ├─ Creator: ${badge.creator.name}\n`;
              caption += `│   ├─ Awarded: ${formatNumber(
                badge.statistics.awardedCount
              )} times\n`;
              caption += `│   └─ Created: ${formatDate(badge.created)}\n`;
            } else {
              caption += `    ├─ Description: ${badge.description}\n`;
              caption += `    ├─ Creator: ${badge.creator.name}\n`;
              caption += `    ├─ Awarded: ${formatNumber(
                badge.statistics.awardedCount
              )} times\n`;
              caption += `    └─ Created: ${formatDate(badge.created)}\n`;
            }
          });
          caption += `\n`;
        }

        caption += `GAMES & CREATIONS\n`;
        caption += `├─ Games Created: ${formatNumber(games.length)}\n`;
        caption += `├─ Published Games: ${formatNumber(userGames.length)}\n`;
        caption += `├─ Favorite Games: ${formatNumber(favoriteGames.length)}\n`;
        caption += `├─ Universes: ${formatNumber(universeInfo.length)}\n`;
        caption += `└─ Developed Universes: ${formatNumber(
          developedUniverses.length
        )}\n\n`;

        if (games.length > 0) {
          caption += `CREATED GAMES (${games.length})\n`;
          games.forEach((game, index) => {
            const isLast = index === games.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${game.name}\n`;
            if (!isLast) {
              caption += `│   ├─ Description: ${
                game.description || 'No description'
              }\n`;
              caption += `│   ├─ Visits: ${formatNumber(game.placeVisits)}\n`;
              caption += `│   ├─ Created: ${
                game.created ? formatDate(game.created) : 'Unknown'
              }\n`;
              caption += `│   └─ Updated: ${
                game.updated ? formatDate(game.updated) : 'Unknown'
              }\n`;
            } else {
              caption += `    ├─ Description: ${
                game.description || 'No description'
              }\n`;
              caption += `    ├─ Visits: ${formatNumber(game.placeVisits)}\n`;
              caption += `    ├─ Created: ${
                game.created ? formatDate(game.created) : 'Unknown'
              }\n`;
              caption += `    └─ Updated: ${
                game.updated ? formatDate(game.updated) : 'Unknown'
              }\n`;
            }
          });
          caption += `\n`;
        }

        if (favoriteGames.length > 0) {
          caption += `FAVORITE GAMES (${favoriteGames.length})\n`;
          favoriteGames.forEach((game, index) => {
            const isLast = index === favoriteGames.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${game.name}\n`;
            if (!isLast) {
              caption += `│   ├─ Creator: ${game.creator.name}\n`;
              caption += `│   ├─ Visits: ${formatNumber(game.placeVisits)}\n`;
              caption += `│   └─ Created: ${
                game.created ? formatDate(game.created) : 'Unknown'
              }\n`;
            } else {
              caption += `    ├─ Creator: ${game.creator.name}\n`;
              caption += `    ├─ Visits: ${formatNumber(game.placeVisits)}\n`;
              caption += `    └─ Created: ${
                game.created ? formatDate(game.created) : 'Unknown'
              }\n`;
            }
          });
          caption += `\n`;
        }

        if (friendList.length > 0) {
          const validFriends = friendList.filter(
            (friend) => friend.id > 0 && friend.name
          );
          caption += `FRIENDS (${validFriends.length})\n`;
          validFriends.forEach((friend, index) => {
            const isLast = index === validFriends.length - 1;
            const displayName =
              friend.displayName !== friend.name
                ? ` (${friend.displayName})`
                : '';
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${
              friend.name
            }${displayName}\n`;
            if (!isLast) {
              caption += `│   └─ ID: ${friend.id}\n`;
            } else {
              caption += `    └─ ID: ${friend.id}\n`;
            }
          });
          caption += `\n`;
        }

        if (previousUsernames.length > 0) {
          caption += `NAME HISTORY (${previousUsernames.length})\n`;
          previousUsernames.forEach((name, index) => {
            const isLast = index === previousUsernames.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${name}\n`;
          });
          caption += `\n`;
        }

        if (inventory.length > 0) {
          caption += `INVENTORY ITEMS: ${formatNumber(inventory.length)}\n\n`;
        }

        if (collectibles.length > 0) {
          caption += `COLLECTIBLES: ${formatNumber(collectibles.length)}\n\n`;
        }

        if (universeInfo.length > 0) {
          caption += `UNIVERSE INFORMATION\n`;
          universeInfo.forEach((universe, index) => {
            const isLast = index === universeInfo.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${universe.name}\n`;
            if (!isLast) {
              caption += `│   ├─ Creator: ${universe.creator.name}\n`;
              caption += `│   ├─ Visits: ${formatNumber(universe.visits)}\n`;
              caption += `│   ├─ Max Players: ${universe.maxPlayers}\n`;
              caption += `│   └─ Created: ${formatDate(universe.created)}\n`;
            } else {
              caption += `    ├─ Creator: ${universe.creator.name}\n`;
              caption += `    ├─ Visits: ${formatNumber(universe.visits)}\n`;
              caption += `    ├─ Max Players: ${universe.maxPlayers}\n`;
              caption += `    └─ Created: ${formatDate(universe.created)}\n`;
            }
          });
          caption += `\n`;
        }

        caption += `ACCOUNT SUMMARY\n`;
        caption += `├─ Total Games Created: ${formatNumber(games.length)}\n`;
        caption += `├─ Total Published Games: ${formatNumber(
          userGames.length
        )}\n`;
        caption += `├─ Total Favorite Games: ${formatNumber(
          favoriteGames.length
        )}\n`;
        caption += `├─ Total Friends: ${formatNumber(
          friendsCount?.length || 0
        )}\n`;
        caption += `├─ Total Groups: ${formatNumber(groups.length)}\n`;
        caption += `├─ Total Badges: ${formatNumber(
          badges.length + gameBadges.length
        )}\n`;
        caption += `├─ Total Assets: ${formatNumber(avatarAssets.length)}\n`;
        caption += `└─ Total Outfits: ${formatNumber(outfits.length)}\n\n`;

        caption += `Made by Altera Family\n`;

        caption += `${new Date().toLocaleString()} - v0.1.0`;

        const avatarUrl =
          avatarHeadshotUrl || avatarBustUrl || avatarFullUrl || avatar3dUrl;

        await Exp.sendMessage(
          cht?.id,
          {
            image: { url: avatarUrl },
            caption: caption,
            contextInfo: {
              externalAdReply: {
                title: `${displayName || username}`,
                body: `@${username}`,
                thumbnailUrl: avatarUrl,
                sourceUrl: `https://www.roblox.com/users/${id}/profile`,
                mediaType: 1,
              },
            },
          },
          { quoted: cht }
        );
      } catch (error) {
        console.error('Roblox API Error:', error);

        const errorMessage = `Failed to fetch Roblox profile\n\nError: ${error.message}\n\nPlease check the username and try again.`;

        cht.reply(errorMessage);
      }
    }
  );

  ev.on(
    {
      cmd: ['github', 'gitinfo', 'gitlook'],
      listmenu: ['github'],
      tag: 'search',
      args: `Contoh: ${cht.msg} Chizuru`,
      badword: false,
      energy: 5,
    },
    async () => {
      try {
        cht.reply(`One moment please...`);

        const response = await axios.get(
          `https://altera-api.vercel.app/api/github?user=${encodeURIComponent(
            cht.q
          )}&key=A-CORE`
        );

        const { PrintToTerminal: data } = response.data;
        if (!data || !data.profile) {
          return cht.reply('User not found or API returned no data');
        }

        const {
          profile,
          companies,
          followers,
          following,
          repositories,
          organizations,
          gists,
          events,
        } = data;

        const formatDate = (dateString) => {
          if (!dateString) return 'Unknown';
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        };

        const getAccountAge = (createdAt) => {
          if (!createdAt) return 'Unknown';
          const created = new Date(createdAt);
          const now = new Date();
          const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
          const diffYears = Math.floor(diffDays / 365);
          if (diffYears > 0)
            return `${diffYears} year${
              diffYears > 1 ? 's' : ''
            } (${diffDays} days)`;
          return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        };

        const formatNumber = (num) => num?.toLocaleString() || '0';

        let caption = `PROFILE INFORMATION\n`;
        caption += `├─ User ID: ${profile.id}\n`;
        caption += `├─ Display Name: ${profile.name || 'Not set'}\n`;
        caption += `├─ Username: @${profile.login}\n`;
        caption += `├─ Bio: ${profile.bio || 'No biography'}\n`;
        caption += `├─ Company: ${profile.company || 'Not specified'}\n`;
        caption += `├─ Location: ${profile.location || 'Not specified'}\n`;
        caption += `├─ Email: ${profile.email || 'Not public'}\n`;
        caption += `├─ Blog: ${profile.blog || 'Not provided'}\n`;
        caption += `├─ Twitter: ${profile.twitter_username || 'Not linked'}\n`;
        caption += `├─ Hireable: ${profile.hireable ? 'Yes' : 'No'}\n`;
        caption += `├─ Site Admin: ${profile.site_admin ? 'Yes' : 'No'}\n`;
        caption += `├─ Account Created: ${formatDate(profile.created_at)}\n`;
        caption += `└─ Account Age: ${getAccountAge(profile.created_at)}\n\n`;

        caption += `ACCOUNT STATISTICS\n`;
        caption += `├─ Public Repositories: ${formatNumber(
          profile.public_repos
        )}\n`;
        caption += `├─ Public Gists: ${formatNumber(profile.public_gists)}\n`;
        caption += `├─ Followers: ${formatNumber(profile.followers)}\n`;
        caption += `└─ Following: ${formatNumber(profile.following)}\n\n`;

        if (companies?.length > 0) {
          caption += `COMPANIES & ORGANIZATIONS (${companies.length})\n`;
          companies.forEach((company, index) => {
            const isLast = index === companies.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${
              company.name || company.login
            }\n`;
            if (!isLast)
              caption += `│   ├─ Bio: ${company.bio || 'No description'}\n`;
            else caption += `    ├─ Bio: ${company.bio || 'No description'}\n`;
            if (!isLast)
              caption += `│   ├─ Repos: ${formatNumber(
                company.public_repos
              )}\n`;
            else
              caption += `    ├─ Repos: ${formatNumber(
                company.public_repos
              )}\n`;
            if (!isLast)
              caption += `│   └─ Created: ${formatDate(company.created_at)}\n`;
            else
              caption += `    └─ Created: ${formatDate(company.created_at)}\n`;
          });
          caption += `\n`;
        }

        if (repositories?.length > 0) {
          caption += `REPOSITORIES (${repositories.length})\n`;
          const sortedRepos = repositories.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          );

          sortedRepos.forEach((repo, index) => {
            const isLast = index === repositories.length - 1;
            const prefix = isLast ? '└─' : '├─';
            const fork = repo.fork ? ' (Fork)' : '';

            caption += `${prefix} ${index + 1}. ${repo.name}${fork}\n`;
            if (!isLast) {
              caption += `│   ├─ Description: ${
                repo.description || 'No description'
              }\n`;
              caption += `│   ├─ Language: ${
                repo.language || 'Not specified'
              }\n`;
              caption += `│   ├─ Stars: ${formatNumber(
                repo.stargazers_count
              )} | Forks: ${formatNumber(repo.forks_count)}\n`;
              caption += `│   └─ Updated: ${formatDate(repo.updated_at)}\n`;
            } else {
              caption += `    ├─ Description: ${
                repo.description || 'No description'
              }\n`;
              caption += `    ├─ Language: ${
                repo.language || 'Not specified'
              }\n`;
              caption += `    ├─ Stars: ${formatNumber(
                repo.stargazers_count
              )} | Forks: ${formatNumber(repo.forks_count)}\n`;
              caption += `    └─ Updated: ${formatDate(repo.updated_at)}\n`;
            }
          });
          caption += `\n`;
        }

        if (followers?.length > 0) {
          caption += `FOLLOWERS (${followers.length})\n`;
          followers.forEach((follower, index) => {
            const isLast = index === followers.length - 1;
            const type =
              follower.type === 'Organization' ? ' (Organization)' : '';
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${
              follower.login
            }${type}\n`;
          });
          caption += `\n`;
        }

        if (following?.length > 0) {
          caption += `FOLLOWING (${following.length})\n`;
          following.forEach((user, index) => {
            const isLast = index === following.length - 1;
            const type = user.type === 'Organization' ? ' (Organization)' : '';
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${
              user.login
            }${type}\n`;
          });
          caption += `\n`;
        }

        if (organizations?.length > 0) {
          caption += `ORGANIZATIONS (${organizations.length})\n`;
          organizations.forEach((org, index) => {
            const isLast = index === organizations.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${org.login}\n`;
          });
          caption += `\n`;
        }

        if (gists?.length > 0) {
          caption += `PUBLIC GISTS (${gists.length})\n`;
          gists.forEach((gist, index) => {
            const isLast = index === gists.length - 1;
            caption += `${isLast ? '└─' : '├─'} ${index + 1}. ${gist.id}\n`;
          });
          caption += `\n`;
        }

        if (events?.length > 0) {
          caption += `RECENT ACTIVITY (${events.length} events)\n`;
          const recentEvents = events.slice(0, 15);
          recentEvents.forEach((event, index) => {
            const isLast = index === recentEvents.length - 1;
            let activity = '';

            switch (event.type) {
              case 'WatchEvent':
                activity = `Starred ${event.repo.name}`;
                break;
              case 'ForkEvent':
                activity = `Forked ${event.repo.name}`;
                break;
              case 'PushEvent':
                activity = `Pushed to ${event.repo.name}`;
                break;
              case 'CreateEvent':
                activity = `Created ${event.repo.name}`;
                break;
              case 'IssueCommentEvent':
                activity = `Commented on ${event.repo.name}`;
                break;
              default:
                activity = `${event.type} ${event.repo.name}`;
            }

            caption += `${isLast ? '└─' : '├─'} ${formatDate(
              event.created_at
            )}\n`;
            if (!isLast) caption += `│   └─ ${activity}\n`;
            else caption += `    └─ ${activity}\n`;
          });
          if (events.length > 15)
            caption += `└─ ... and ${events.length - 15} more activities\n`;
          caption += `\n`;
        }

        caption += `ACCOUNT SUMMARY\n`;
        caption += `├─ Total Repositories: ${formatNumber(
          profile.public_repos
        )}\n`;
        caption += `├─ Total Gists: ${formatNumber(profile.public_gists)}\n`;
        caption += `├─ Total Followers: ${formatNumber(profile.followers)}\n`;
        caption += `├─ Total Following: ${formatNumber(profile.following)}\n`;
        caption += `├─ Companies/Orgs: ${formatNumber(
          companies?.length || 0
        )}\n`;
        caption += `├─ Organizations: ${formatNumber(
          organizations?.length || 0
        )}\n`;
        caption += `└─ Recent Activities: ${formatNumber(
          events?.length || 0
        )}\n\n`;

        caption += `Made by Altera Family\n`;
        caption += `${new Date().toLocaleString()} - v0.1.0`;

        await Exp.sendMessage(
          cht?.id,
          {
            image: { url: profile.avatar_url },
            caption: caption,
            contextInfo: {
              externalAdReply: {
                title: `${profile.name}`,
                body: `@${profile.login}`,
                thumbnailUrl: profile.avatar_url,
                sourceUrl: profile.html_url,
                mediaType: 1,
              },
            },
          },
          { quoted: cht }
        );
      } catch (error) {
        console.error('GitHub API Error:', error);

        const errorMessage = `Failed to fetch GitHub profile\n\nError: ${error.message}\n\nPlease check the username and try again.`;

        cht.reply(errorMessage);
      }
    }
  );

  ev.on(
    {
      cmd: ['liriksearch', 'lyrics', 'lirik'],
      listmenu: ['lirik'],
      tag: 'search',
      args: `Contoh: ${cht.msg} Selendang Biru`,
      energy: 15,
    },
    async ({ args }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key);

      let { data, status, msg } = await fetch(
        api.xterm.url +
          '/api/search/lyrics?query=' +
          args +
          '&key=' +
          api.xterm.key
      ).then((a) => a.json());
      if (!status) return cht.reply(msg);

      let duration = data.track_length;
      let m = Math.floor((duration % 3600) / 60);
      let s = duration % 60;

      let text = '*!-======[ Lyrics 🎶 ]======-!*\n';
      text += `\n🎵 *Judul:* ${data.track_name}`;
      text += `\n👨‍🎤 *Penyanyi:* ${data.artist_name}`;
      text += `\n💽 *Album:* ${data.album_name}`;
      text += `\n📅 *Rilis:* ${data.first_release_date}`;
      text += `\n⏱️ *Durasi:* ${m}:${s.toString().padStart(2, '0')}`;
      text += `\n🔗 *URL:* ${data.track_share_url}`;
      text += `\n\n📝 *Lyrics:*\n${data.lyrics}`;

      const info = {
        text,
        contextInfo: {
          externalAdReply: {
            title: data.track_name,
            body: data.artist_name,
            thumbnailUrl: data.album_coverart_350x350,
            sourceUrl: data.track_share_url,
            mediaUrl:
              'http://wa.me/6283110928302/' +
              Math.floor(Math.random() * 100000000000000000),
            renderLargerThumbnail: true,
            mediaType: 1,
          },
          forwardingScore: 19,
          isForwarded: true,
          forwardedNewsletterMessageInfo: cfg.chId || {
            newsletterName: 'Termai',
            newsletterJid: '120363301254798220@newsletter',
          },
        },
      };

      await Exp.sendMessage(id, info, { quoted: cht });
      await cht.edit(infos.messages.done, _key);
    }
  );
}