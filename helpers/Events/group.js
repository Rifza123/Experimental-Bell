/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const baileys = 'baileys'.import();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is, chatDb }) {
  const { id, sender } = cht;
  const { func } = Exp;
  const { archiveMemories: memories, dateFormatter } = func;
  const dayMap = {
    minggu: 'sunday',
    senin: 'monday',
    selasa: 'tuesday',
    rabu: 'wednesday',
    kamis: 'thursday',
    jumat: 'friday',
    sabtu: 'saturday',
  };
  const reverseDayMap = Object.fromEntries(
    Object.entries(dayMap).map(([k, v]) => [v, k])
  );
  const { parseTimeString, formatDateTimeParts, getGroupMetadata } = Exp.func;
  let infos = Data.infos;

  ev.on(
    {
      cmd: ['group', 'resetlink', 'open', 'close', 'linkgc', 'setppgc'],
      listmenu: [
        'group <options>',
        'resetlink',
        'linkgc',
        'open',
        'close',
        'setppgc',
      ],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      isBotAdmin: true,
    },
    async () => {
      let opts = {
        open: ['buka', 'open'],
        close: ['tutup', 'close'],
        link: ['link', 'linkgroup', 'linkgc'],
        reset: ['resetlink', 'revokelink', 'revokeinvitelink'],
        locked: ['locked-change'],
        onephemeral: ['on-ephemeral'],
        offephemeral: ['off-ephemeral'],
        unlocked: ['unlocked-change'],
        setdesc: ['setdesc', 'setdescription', 'setname', 'setsubject'],
        setpp: ['setppgc', 'setthumb', 'setpp'],
      };
      let k = Object.keys(opts);
      let text = func.tagReplacer(infos.group.settings, {
        options: Object.values(opts).flat().join('\n- '),
      });
      let [a, ..._b] = (cht.q || '').split(' ');
      let b = _b.join(' ');
      if (!Boolean(a)) a = cht.cmd;

      opts[k[0]].includes(a)
        ? Exp.groupSettingUpdate(id, 'not_announcement')
        : opts[k[1]].includes(a)
          ? Exp.groupSettingUpdate(id, 'announcement')
          : opts[k[2]].includes(a)
            ? cht.reply(
                'https://chat.whatsapp.com/' +
                  (await Exp.groupInviteCode(cht.id))
              )
            : opts[k[3]].includes(a)
              ? Exp.groupRevokeInvite(cht.id)
              : opts[k[4]].includes(a)
                ? Exp.groupSettingUpdate(id, 'locked')
                : opts[k[5]].includes(a)
                  ? Exp.groupSettingUpdate(id, 'unlocked')
                  : opts[k[6]].includes(a)
                    ? Exp.groupSettingUpdate(id, !0)
                    : opts[k[7]].includes(a)
                      ? Exp.groupSettingUpdate(id, !1)
                      : opts[k[8]].includes(a)
                        ? (async (v) => {
                            let isDesc = ['setdesc', 'setdescription'].includes(
                              a
                            );

                            if (!v) {
                              let exp = Date.now() + 60000 * 5;
                              let area = 'Asia/Jakarta';
                              let date = dateFormatter(exp, area);
                              let { key } = await cht.reply(
                                `*Silahkan reply pesan ini dengan ${isDesc ? 'deskripsi' : 'nama'} group yang baru*\n> _Expired on ${date} (${area})_`
                              );
                              let qcmds =
                                memories.getItem(sender, 'quotedQuestionCmd') ||
                                {};
                              qcmds[key.id] = {
                                emit: `${cht.cmd} ${a}`,
                                exp,
                                accepts: [],
                              };
                              return memories.setItem(
                                sender,
                                'quotedQuestionCmd',
                                qcmds
                              );
                            }
                            Exp[
                              `groupUpdate${isDesc ? 'Description' : 'Subject'}`
                            ](cht.id, b);
                          })(b)
                        : opts[k[9]].includes(a)
                          ? (async () => {
                              let { quoted, type } = ev.getMediaType();
                              if (!(is.image || is.quoted.image)) {
                                let exp = Date.now() + 60000 * 5;
                                let area = 'Asia/Jakarta';
                                let date = dateFormatter(exp, area);
                                let { key } = await cht.reply(
                                  `*Silahkan reply pesan ini dengan foto yang akan dijadikan thumbnail/foto profile group!*\n> _Expired on ${date} (${area})_`
                                );
                                let qcmds =
                                  memories.getItem(
                                    sender,
                                    'quotedQuestionCmd'
                                  ) || {};
                                qcmds[key.id] = {
                                  emit: `${cht.cmd} setpp`,
                                  exp,
                                  accepts: [],
                                };
                                return memories.setItem(
                                  sender,
                                  'quotedQuestionCmd',
                                  qcmds
                                );
                              }
                              let media = quoted
                                ? await cht.quoted.download()
                                : await cht.download();
                              await cht.reply(infos.messages.wait);
                              Exp.setProfilePicture(cht.id, media)
                                .then((a) => cht.reply('Success...✅️'))
                                .catch((e) =>
                                  cht.reply('TypeErr: ' + e.message)
                                );
                            })()
                          : cht.reply(text);

      let accepts = Object.values(opts).flat();
      if (!accepts.includes(a)) {
        func.archiveMemories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd}`,
          exp: Date.now() + 60000,
          accepts,
        });
      }
    }
  );

  ev.on(
    {
      cmd: ['kick', 'add'],
      listmenu: ['kick', 'add'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      isMention: func.tagReplacer(infos.group.kick_add, {
        prefix: cht.prefix,
        cmd: cht.cmd,
      }),
      isBotAdmin: true,
    },
    async () => {
      if (is.botMention && cht.cmd == 'kick')
        return cht.reply('Saya tidak ingin keluar!');
      let { status } = (
        await Exp.groupParticipantsUpdate(
          id,
          await Promise.all(
            cht.mention.map((a) =>
              func.getSender(a, { lid: cht.cmd == 'kick' })
            )
          ),
          cht.cmd == 'kick' ? 'remove' : 'add'
        )
      )[0];
      if (status == 408)
        return cht.reply('Dia baru-baru saja keluar dari grub ini!');
      if (status == 409) return cht.reply('Dia sudah join!');
      if (status == 500) return cht.reply('Grub penuh!');
      if (status == 403)
        return cht.reply('Maaf, gabisa ditambah karna private acc');
    }
  );

  ev.on(
    {
      cmd: ['blacklist', 'unblacklist'],
      listmenu: ['unblacklist', 'blacklist'],
      tag: 'group',
      isMention: true,
      isBotAdmin: true,
      isAdmin: true,
    },
    async () => {
      try {
        let { mention, cmd } = cht;
        let admins = mention.filter((a) => Exp.groupAdmins.includes(a));
        let owners = mention.filter((a) =>
          global.owner
            .map((o) => `${String(o).split('@')[0]}@s.whatsapp.net`)
            .includes(a)
        );
        let excluded = mention
          .filter((a) => admins.includes(a) || owners.includes(a))
          .map((a) => {
            let roles = [];
            if (admins.includes(a)) roles.push('admin');
            if (owners.includes(a)) roles.push('owner');
            return `> @${a.split('@')[0]} tidak di-blacklist karena dia adalah ${roles.join(' & ')}`;
          });

        let filteredMention = mention.filter(
          (a) => !admins.includes(a) && !owners.includes(a) && a !== cht.sender
        );

        chatDb.blacklist ??= [];
        chatDb.blacklist =
          cmd === 'blacklist'
            ? [...new Set([...chatDb.blacklist, ...filteredMention])]
            : chatDb.blacklist.filter((id) => !filteredMention.includes(id));

        cht.reply(
          cmd === 'blacklist'
            ? `✅ Berhasil memblacklist ${filteredMention.map((a) => `@${a.split('@')[0]}`).join(', ')}\n${excluded.join('\n')}\n\n_*Pesan apa pun yang dikirim oleh pengguna yang masuk daftar blacklist akan dihapus secara otomatis.*_`
            : `♻️ Berhasil menghapus dari blacklist ${filteredMention.map((a) => `@${a.split('@')[0]}`).join(', ')}`,
          { mentions: mention }
        );
      } catch (e) {
        console.error(e);
      }
    }
  );

  ev.on(
    {
      cmd: ['getpp'],
      listmenu: ['getpp'],
      tag: 'group',
      isMention: true,
    },
    async () => {
      try {
        let pp = await Exp.profilePictureUrl(cht.mention[0]);
        Exp.sendMessage(cht.id, {
          image: {
            url: pp,
          },
        });
      } catch {
        cht.reply('Gabisa, keknya dia gapake pp');
      }
    }
  );

  ev.on(
    {
      cmd: ['getppgc'],
      listmenu: ['getppgc'],
      tag: 'group',
      isGroup: true,
    },
    async () => {
      try {
        let pp = await Exp.profilePictureUrl(cht.id);
        Exp.sendMessage(cht.id, {
          image: {
            url: pp,
          },
        });
      } catch {
        cht.reply('Gabisa, keknya dia gapake pp');
      }
    }
  );

  ev.on(
    {
      cmd: ['infogc', 'infogroup'],
      listmenu: ['infogc'],
      tag: 'group',
      isGroup: true,
    },
    async () => {
      try {
        let meta = Exp.groupMetdata;
        let pref = Data.preferences[cht.id];

        let topUsers = [];
        let topEnergy = await Promise.all(
          [
            ...(is.group
              ? Exp.groupMembers
              : Object.keys(Data.users).map((a) => ({
                  id: String(a),
                }))),
          ].map((a) => ({
            id: a.id,
            energy: memories.get(a.id)?.energy || 0,
          }))
        ).then((members) =>
          members
            .sort((a, b) => b.energy - a.energy)
            .slice(0, 10)
            .map((a, i) => {
              topUsers.push(a.id);
              let aid = a.id.includes('@') ? a.id.split('@')[0] : a.id;
              let name = func.getName(aid);
              let emoji =
                i === 0 ? '(🏆)' : i === 1 ? '(🥈)' : i === 2 ? '(🥉)' : '';
              return `${i + 1}. ${name.extractMentions().length == 0 ? name : name.slice(0, 5) + '****' + name.slice(-4)} \`${cht.cmd == 'topglobalenergy' ? aid.slice(0, 5) + '****' + aid.slice(-4) : aid}\` (${a.energy}⚡) ${emoji}`;
            })
            .join('\n')
        );
        let text = `📌 *${meta.subject || 'Tanpa Subjek'}*

🆔 *ID Grup:* ${meta.id || '-'}
🔢 *Addressing Mode:* ${meta.addressingMode || '-'}
📅 *Dibuat pada:* ${func.dateFormatter(meta.creation * 1000, 'Asia/Jakarta') || '-'}
👑 *Pembuat Grup:* ${meta.owner ? (await func.getSender(meta.owner, { cht })).split('@')[0] : 'Tak diketahui'}
✍️ *Penulis Subjek:* ${func.getName(await func.getSender(meta.subjectOwner, { cht })) || '-'} (${(await func.getSender(meta.subjectOwner, { cht }))?.split('@')[0] || '-'})
🕒 *Terakhir Subjek Diubah:* ${func.dateFormatter(meta.subjectTime * 1000, 'Asia/Jakarta') || '-'}
👥 *Jumlah Member:* ${meta.size || 0}

*isBotAdmin*: ${is.botAdmin ? '👑' : '❌'}

⚙️ *Pengaturan Grup:*
- Restrict: ${meta.restrict ? '✅ Ya' : '❌ Tidak'}
- Announce (Hanya Admin Bisa Chat): ${meta.announce ? '✅ Ya' : '❌ Tidak'}
- Persetujuan Join: ${meta.joinApprovalMode ? '✅ Ya' : '❌ Tidak'}
- Mode Tambah Member: ${meta.memberAddMode ? '✅ Ya' : '❌ Tidak'}
- Pesan Sementara: ${meta.ephemeralDuration ? meta.ephemeralDuration / 3600 + ' jam' : '❌ Nonaktif'}
- Antilink: ${pref.antilink ? '✅ Aktif' : '❌ Mati'}
- AntiTagAll/Hidetag: ${pref.antitagall ? '✅ Aktif' : '❌ Mati'}
- Welcome: ${pref.welcome ? '✅ Aktif' : '❌ Mati'}
- Play game: ${pref.playgame ? '✅ Aktif' : '❌ Mati'}
- Only Admin: ${pref.onlyadmin ? '✅ Aktif' : '❌ Mati'}
- Jadwal Sholat: ${pref.jadwalsholat ? '✅ Aktif' : '❌ Mati'}
- Mute: ${pref.mute ? '✅ Aktif' : '❌ Mati'}
- Anti Delete: ${pref.antidelete ? '✅ Aktif' : '❌ Mati'}
- Anti Tag Sw: ${pref.antitagsw ? '✅ Aktif' : '❌ Mati'}
- Antibot: ${pref.antibot ? '✅ Aktif' : '❌ Mati'}
- Auto AI: ${pref.ai_interactive ? '✅ Aktif' : '❌ Mati'}
- LiveChart: ${pref.livechart ? '✅ Aktif' : '❌ Mati'}
- Anti Image: ${pref.antiimg ? '✅ Aktif' : '❌ Mati'}
- Anti Video: ${pref.antivid ? '✅ Aktif' : '❌ Mati'}
- Anti Voice: ${pref.antivoice ? '✅ Aktif' : '❌ Mati'}
- Anti Document: ${pref.antidoct ? '✅ Aktif' : '❌ Mati'}
- Anti Sticker Pack: ${pref.antistkpck ? '✅ Aktif' : '❌ Mati'}
- Anti Audio: ${pref.antiaud ? '✅ Aktif' : '❌ Mati'}
- Antitoxic: ${pref.antitoxic ? '✅ Aktif' : '❌ Mati'}
- Livechart: ${pref.livechart ? '✅ Aktif' : '❌ Mati'}
- Autosticker: ${pref.autosticker ? '✅ Aktif' : '❌ Mati'}
- Auto Download: ${pref.autodownload ? '✅ Aktif' : '❌ Mati'}
- Anti Channel: ${pref.antich ? '✅ Aktif' : '❌ Mati'}
- Anti Spam: ${pref.antispam ? '✅ Aktif' : '❌ Mati'}
- Auto Back: ${pref.autoback ? '✅ Aktif' : '❌ Mati'}

🔗 *Grup Induk:* ${meta.linkedParent || 'Tidak ada'}

*List Admin*: 
- ${Exp.groupMembers
          .filter((a) => a.admin)
          .map(
            (a) => `${a.id.split('@')[0]}${a.admin == 'superadmin' ? '👑' : ''}`
          )
          .join('\n- ')}

📝 *Deskripsi:*
${meta.desc || '-'}

*TOP 10 ENERGY*
${topEnergy}
`;
        const info = {
          text,
          contextInfo: {
            externalAdReply: {
              title: cht.pushName,
              body: 'Info Group',
              thumbnailUrl: await Exp.profilePictureUrl(cht.id),
              sourceUrl: 'https://github.com/Rifza123',
              mediaUrl:
                'http://ẉa.me/6283110928302/' +
                Math.floor(Math.random() * 100000000000000000),
              renderLargerThumbnail: true,
              mediaType: 1,
            },
            forwardingScore: 19,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterName: 'Termai',
              newsletterJid: '120363301254798220@newsletter',
            },
          },
        };
        Exp.sendMessage(cht.id, info, { quoted: cht });
      } catch {}
    }
  );
  ev.on(
    {
      cmd: ['tagall', 'hidetag'],
      listmenu: ['tagall', 'hidetag'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
    },
    async () => {
      if (Data.preferences[id]['antitagall'])
        return cht.reply('Tagall tidak di izinkan disini!');
      let mentions = Exp.groupMembers.map((a) => a.id);
      let text =
        cht.cmd == 'tagall'
          ? `\`${cht?.q ? await func.replaceLidToPn(cht.q, cht) : 'TAG ALL'}\`\n`
          : cht.q || '';
      if (cht.cmd == 'tagall') {
        for (let i = 0; i < mentions.length; i++) {
          text += `\n${i + 1}. @${mentions[i]?.split('@')[0]}`;
        }
      }
      Exp.sendMessage(
        id,
        {
          text,
          mentions,
        },
        {
          quoted: cht,
        }
      );
    }
  );

  ev.on(
    {
      cmd: ['jadwalsholat'],
      listmenu: ['jadwalsholat'],
      tag: 'religion',
      args: 'Silahkan input daerahnya!',
    },
    async ({ args }) => {
      Data.daerah ??= await fetch('https://c.termai.cc/json/daerah.json').then(
        (a) => a.json()
      );
      let { status, data, msg, timeZone, list } = await jadwal.init(
        'no',
        func.getTopSimilar(
          await func.searchSimilarStrings(
            args,
            Object.values(Data.daerah).flat(),
            0.6
          )
        ).item || args
      );
      if (!status) {
        func.archiveMemories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd}`,
          exp: Date.now() + 20000,
          accepts: [],
        });
        return cht.reply(
          `*${msg}*${list ? `\n\nList daerah:\n- ${list.join('\n- ')}` : ''}`
        );
      }
      const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      const parts = formatter.formatToParts(new Date());
      const d = String(
        parseInt(parts.find((p) => p.type === 'day').value, 10)
      ).padStart(2, '0');
      const m = String(
        parseInt(parts.find((p) => p.type === 'month').value, 10)
      ).padStart(2, '0');

      let dm = `${d}/${m}`;
      let a = data.find((a) => a.tanggal == dm);
      console.log({ data, a, dm });
      let text = `*JADWAL SHOLAT*\n\nHari ini: *${func.dateFormatter(Date.now(), timeZone)}*\n- imsak: ${a.imsak || 'only ramadhan'}\n- subuh: ${a.subuh}\n- dzuhur: ${a.dzuhur}\n- ashar: ${a.ashar}\n- magrib: ${a.magrib}\n- isya: ${a.isya}\n\n*Jadwal bulan ini*:\n${infos.others.readMore}\n${data.map((a) => ` \n 🗓️ \`${a.tanggal}\`${a.imsak ? `\n- imsak: ${a.imsak}` : ''}\n- subuh: ${a.subuh}\n- dzuhur: ${a.dzuhur}\n- ashar: ${a.ashar}\n- magrib: ${a.magrib}\n- isya: ${a.isya}\n`).join('\n')}`;
      cht.reply(text);
    }
  );

  ev.on(
    {
      cmd: ['on', 'off'],
      listmenu: ['on', 'off'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
    },
    async () => {
      let isOn = cht.cmd == 'on';
      let [input, v, ...etc] = cht.q?.trim().toLowerCase().split(' ');
      let actions = [
        'welcome',
        'leave',
        'antilink',
        'antitagall',
        'mute',
        'antibot',
        'antiimg',
        'antivid',
        'antivoice',
        'antidoct',
        'antistk',
        'antistkpck',
        'antiaud',
        'playgame',
        'jadwalsholat',
        'onlyadmin',
        'antidelete',
        'livechart',
        'antitoxic',
        'autosticker',
        'autodownload',
        'antitagsw',
        'antich',
        'antispam',
        'autoback',
      ];
      let text = `Opsi yang tersedia:\n\n- ${actions.join('\n- ')}\n\n> Contoh:\n> ${cht.prefix + cht.cmd} welcome`;
      if (!actions.includes(input)) {
        func.archiveMemories.setItem(sender, 'questionCmd', {
          emit: `${cht.cmd}`,
          exp: Date.now() + 60000,
          accepts: actions,
        });
        return cht.reply(text);
      }
      let sets = Data.preferences[id];
      sets[input] = sets[input] || false;
      let sholat = {};
      if (input == 'jadwalsholat' && isOn) {
        Data.daerah ??= await fetch(
          'https://c.termai.cc/json/daerah.json'
        ).then((a) => a.json());
        if (!v)
          return cht.reply(`*Harap sertakan daerahnya!*
- Contoh: ${cht.prefix + cht.cmd + ' jadwalsholat kab-bungo'}

_Anda juga bisa menyertakan type di sebelah input daerah untuk kebutuhan tertentu_

\`List type:\`
- ramadhan
> Untuk bulan ramadhan, ini akan sekaligus mengingatkan waktu imsak dan ucapan selamat berbuka saat adzan Maghrib berkumandang
- tutup
> otomatis menutup grup(selama 5 menit) saat tiba waktu sholat

- Contoh penggunaan type: .on jadwalsholat kab-bungo ramadhan tutup

_Jika sudah mengaktifkan jadwalsholat dengan tipe diatas, anda bisa memastikannya dengan .off jadwalsholat lalu meng-aktifkan kembali .on jadwalsholat tanpa menyertakan type_

> *❗Dengan teks ini, admin sangat berharap kepada user untuk membaca dengan teliti agar tidak menanyakan lagi!*`);
        let isOpt = false;
        if (etc.length > 0) {
          let acts = ['ramadhan', 'tutup'];
          let notf = etc.find((a) => !acts.includes(a));
          if (notf)
            return cht.reply(
              `Pilihan opsi ${notf} tidak tersedia!\n\nOpsi yang tersedia: ${acts.join(', ')}`
            );
          isOpt = true;
        }
        let _txt = `${infos.group.on(cht.cmd, input)}`;
        if (isOpt) {
          _txt += `\n\n\`Type\`:`;
          for (let i of etc) {
            _txt += `\n- ${i}`;
            sholat[i] = true;
          }
        }
        let { status, msg, data, list, db } = await jadwal.init(
          id,
          func.getTopSimilar(
            await func.searchSimilarStrings(
              v,
              Object.values(Data.daerah).flat(),
              0.6
            )
          ).item || v,
          sholat
        );
        if (!status)
          return cht.reply(
            `*${msg}*${list ? `\n\nList daerah:\n- ${list.join('\n- ')}` : ''}`
          );
        sets['jadwalsholat'] = db;
        return await cht.reply(_txt);
      } else {
        if (isOn && sets[input])
          return cht.reply(`*${input}* sudah aktif disini!`);
        if (cht.cmd !== 'on' && !sets[input])
          return cht.reply(`*${input}* sudah non-aktif disini!`);
        if (input == 'welcome') {
          if (isOn) {
            sets.welcome = true;
            sets.leave = true;
          } else {
            sets.welcome = false;
          }
          return cht.reply(infos.group.on(cht.cmd, input));
        }
        sets[input] = isOn;
        if (input == 'antilink') {
          sets.links = sets.links || ['chat.whatsapp.com'];
        }
        if (input == 'antitoxic') {
          sets.badwords = sets.badwords || [];
        }
        if (input == 'jadwalsholat' && cht.cmd !== 'on')
          delete jadwal.groups[id];
      }

      let subInfo = '\n';
      if (input === 'leave' && !isOn) {
        subInfo +=
          ' 🔕 Mode *Leave* dinonaktifkan.\n' +
          '-  Bot tidak akan mengirimkan pesan notifikasi saat ada anggota keluar dari grup.\n' +
          '- Gunakan kembali perintah ini untuk mengaktifkannya.';
      } else if (input === 'leave' && isOn) {
        subInfo +=
          ' 🔔 Mode *Leave* diaktifkan.\n' +
          '- Bot akan otomatis mengirim pesan saat ada anggota keluar grup,\n' +
          '- bahkan jika fitur *Welcome* sedang nonaktif.';
      } else if (input == 'autoback') {
        subInfo +=
          '-  🔔 *AutoBack* diaktifkan.\n' +
          '- Jika ada member yang mengirim link grup WhatsApp, bot akan otomatis join ke grup tersebut, membalas dengan link grup ini, lalu keluar kembali.';
      } else {
        subInfo = false;
      }
      cht.reply(infos.group.on(cht.cmd, input), { footer: subInfo });
    }
  );

  ev.on(
    {
      cmd: ['antilink'],
      listmenu: ['antilink'],
      tag: 'group',
      args: infos.about.antilink,
      isGroup: true,
      isAdmin: true,
    },
    async ({ args }) => {
      let [action, ...etc] = args
        ?.trim()
        .split(/[,\s]+/)
        .filter(Boolean);
      let value = etc?.length > 0 ? etc : false;
      let sets = Data.preferences[cht.id];
      sets[cht.cmd] = sets[cht.cmd] || false;
      sets.links = sets.links || ['chat.whatsapp.com'];
      if (['on', 'off'].includes(action)) {
        if (action == 'on' && sets[cht.cmd])
          return cht.reply(`*${cht.cmd}* sudah aktif disini!`);
        if (action !== 'on' && !sets[cht.cmd])
          return cht.reply(`*${cht.cmd}* sudah non-aktif disini!`);
        sets[cht.cmd] = action == 'on';
        cht.reply(infos.group.on(action, cht.cmd));
      } else if (['add', 'del', 'delete'].includes(action)) {
        if (!value)
          return cht.reply('Please put link!\n\n' + infos.about.antilink);
        if (action == 'add') {
          sets.links.push(...value);
          sets.links = [...new Set(sets.links)];
          cht.reply(`✅ Success add link: ${value.join(', ')}`);
        } else {
          sets.links = sets.links.filter((w) => !value.includes(w));
          sets.links = [...new Set(sets.links)];
          cht.reply(`✅ Success delete link: ${value.join(', ')}`);
        }
      } else if (action == 'list') {
        cht.reply(
          `\`Group ID: ${cht.id}\`\n\n*Include links*\n- ${sets.links.join('\n- ')}`
        );
      } else {
        cht.reply(infos.about.antilink);
      }
    }
  );

  ev.on(
    {
      cmd: ['antitoxic'],
      listmenu: ['antitoxic'],
      tag: 'group',
      args: infos.about.antitoxic,
      isGroup: true,
      isAdmin: true,
    },
    async ({ args }) => {
      let [action, ...etc] = args
        ?.trim()
        .split(/[,\s]+/)
        .filter(Boolean);
      let value = etc?.length > 0 ? etc : false;
      let sets = Data.preferences[cht.id];
      sets[cht.cmd] = sets[cht.cmd] || false;
      sets.badwords = sets.badwords || [];
      if (['on', 'off'].includes(action)) {
        if (action == 'on' && sets[cht.cmd])
          return cht.reply(`*${cht.cmd}* sudah aktif disini!`);
        if (action !== 'on' && !sets[cht.cmd])
          return cht.reply(`*${cht.cmd}* sudah non-aktif disini!`);
        sets[cht.cmd] = action == 'on';
        cht.reply(infos.group.on(action, cht.cmd));
      } else if (['add', 'del', 'delete'].includes(action)) {
        if (!value)
          return cht.reply('Please put word!\n\n' + infos.about.antitoxic);
        if (action == 'add') {
          sets.badwords.push(...value);
          sets.badwords = [...new Set(sets.badwords)];
          cht.reply(`✅ Success add word: ${value.join(', ')}`);
        } else {
          sets.badwords = sets.badwords.filter((w) => !value.includes(w));
          sets.badwords = [...new Set(sets.badwords)];
          cht.reply(`✅ Success delete word: ${value.join(', ')}`);
        }
      } else if (action == 'list') {
        cht.reply(
          `\`Group ID: ${cht.id}\`\n\n*Include toxic word*\n- ${sets.badwords.join('\n- ')}`
        );
      } else {
        cht.reply(infos.about.antitoxic);
      }
    }
  );

  ev.on(
    {
      cmd: ['bancmd'],
      listmenu: ['bancmd', 'bancmd --list'],
      tag: 'group',
      args: `Sertalan command yang ingin di blokir di group ini!

\`Contoh\`:

${cht.msg} tiktokdl, ytdl`,
      isGroup: true,
      isAdmin: true,
    },
    async ({ args }) => {
      chatDb.cmdblocked ??= [];
      if (args.toLowerCase().includes('--list'))
        return cht.reply(
          `\`LIST CMD DIBLOKIR\`:\n- ${chatDb.cmdblocked.join('\n- ')}`
        );

      let words = args
        ?.trim()
        .split(/[,\s]+/)
        .filter(Boolean);

      let noblock = [];
      words.includes(cht.cmd) && unblock.push(cht.cmd);
      words = words.filter((a) => !a.includes(cht.cmd));
      chatDb.cmdblocked.push(...words);
      chatDb.cmdblocked = [...new Set(chatDb.cmdblocked)];
      let text = `Success memblokir *${words.join(', ')}* di group ini`;
      if (noblock.length > 0)
        text += `\n\`${noblock.join(', ')}\` tidak dapat di blokir!`;
      text += `\n_fitur apapun yang di blokir tidak akan dapat di gunakan di group ini!_`;
      cht.reply(text);
    }
  );

  ev.on(
    {
      cmd: ['unbancmd'],
      listmenu: ['unbancmd'],
      tag: 'group',
      args: `Sertakan command yang ingin di unblock di group ini!

  \`Contoh\`:

  ${cht.msg} tiktokdl, ytdl`,
      isGroup: true,
      isAdmin: true,
    },
    async ({ args }) => {
      let words = args
        ?.trim()
        .split(/[,\s]+/)
        .filter(Boolean);

      chatDb.cmdblocked ??= [];
      let notfound = [];

      let before = [...chatDb.cmdblocked];
      chatDb.cmdblocked = chatDb.cmdblocked.filter((cmd) => {
        if (words.includes(cmd)) return false;
        return true;
      });

      for (let w of words) {
        if (!before.includes(w)) notfound.push(w);
      }

      let unblocked = words.filter((w) => !notfound.includes(w));

      let text = '';
      if (unblocked.length > 0) {
        text += `Success membuka blokir *${unblocked.join(', ')}* di group ini`;
      }
      if (notfound.length > 0) {
        text += `\n\`${notfound.join(', ')}\` tidak ada di daftar blokir!`;
      }
      if (!text) text = 'Tidak ada command yang berhasil di unblock!';
      cht.reply(text);
    }
  );

  ev.on(
    {
      cmd: ['afk'],
      listmenu: ['afk'],
      tag: 'group',
      isGroup: true,
    },
    async ({ args, urls }) => {
      let alasan = args || 'Tidak diketahui';
      if (urls?.length > 0)
        return cht.reply('Alasan tidak boleh menggunakan link/promosi!');
      if (alasan.length > 100)
        return cht.reply('Alasan tidak boleh lebih dari 100 karakter!');
      if (args.extractMentions().length > 0 && args.includes('@'))
        return cht.reply('Ngapain afk alasannya sambil ngetag gitu?!');
      func.archiveMemories.setItem(sender, 'afk', {
        time: Date.now(),
        reason: alasan,
      });
      cht.reply(
        `@${sender.split('@')[0]} Sekarang *AFK!*\n\n- Dengan alasan: ${alasan}\n- Waktu: ${func.dateFormatter(Date.now(), 'Asia/Jakarta')}`,
        {
          mentions: [sender],
        }
      );
    }
  );

  let schedule = `Format: .${cht.cmd} type msg|action|hh:mm,Time/Zone  
\`*Type*\`: add, delete, list

# *MENAMBAH SCHEDULE*
- format: .${cht.cmd} add msg|action|hh:mm,Time/Zone
> _Contoh: .${cht.cmd} add Hai semua, udah malam nih, jadi grup aku tutup ya|tutup|22:00,Asia/Jakarta_ 
*Detail:*  
 ℹ️ \`msg\` adalah pesan yang akan dikirim saat bot menjalankan action sesuai jadwal yang telah ditentukan.  

 ℹ️ \`action\` adalah tindakan yang akan dilakukan oleh bot:  
  _List: close,tutup,open,buka,none,silent,-_
  > Keterangan:
- *close/tutup* → Menutup grup  
- *open/buka* → Membuka grup
- *none/silent/- → Hanya mengirimkan pesan 

 ℹ️ \`hh:mm,Time/Zone\` adalah waktu eksekusi berdasarkan zona waktu yang dipilih.  
- *Daftar TimeZone*: Asia/Jakarta, Asia/Makassar, Asia/Jayapura  

# *MENGHAPUS SCHEDULE*
- format: .${cht.cmd} delete time
> _Contoh: .${cht.cmd} delete 22:00

# *MELIHAT LIST SCHEDULE*
> .${cht.cmd} list

\`Kami sangat berharap panduan ini dibaca dengan teliti agar tidak lagi menanyakan kepada admin terkait cara penggunaanya, terimakasih\`
 `;

  function calculateSoon(timeZone, hh, mm) {
    let now = new Date();
    let formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    let [currentHour, currentMinute] = formatter
      .format(now)
      .split(':')
      .map(Number);

    let nowDate = new Date(
      new Date().toLocaleString('en-US', {
        timeZone,
      })
    );

    let targetDate = new Date(nowDate);
    targetDate.setHours(hh, mm, 0, 0);

    if (targetDate < nowDate) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    let diffMs = targetDate - nowDate;
    let diffMinutes = Math.floor(diffMs / 60000);
    let remainingHours = Math.floor(diffMinutes / 60);
    let remainingMinutes = diffMinutes % 60;
    return {
      remainingHours,
      remainingMinutes,
    };
  }
  ev.on(
    {
      cmd: ['schedule', 'schedules'],
      listmenu: ['schedules'],
      tag: 'group',
      args: schedule,
      isGroup: true,
      isAdmin: true,
      isBotAdmin: true,
    },
    async ({ args }) => {
      let [type, ...format] = args.split(' ');
      let q = format.join(' ')?.trim();
      chatDb.schedules ??= [];
      if (type == 'add') {
        let [msg, action, timezone] = q.split('|');
        let actions = {
          open: 'not_announcement',
          close: 'announcement',
          buka: 'not_announcement',
          tutup: 'announcement',
          none: '-',
          silent: '-',
          '-': '-',
        };
        if (!msg || !action || !timezone)
          return cht.reply(
            `*Harap masukkan ${!msg ? 'pesan' : !action ? 'action' : 'timezone'} nya!*\n\n${schedule}`
          );
        if (!actions[action])
          return cht.reply(
            `Action tidak tersedia, silahkan baca lagi!\n\n${schedule}`
          );
        let [time, zone] = timezone.split(',');
        if (!time)
          return cht.reply(`*Harap sertakan time nya!*\n\n${schedule}`);
        if (chatDb.schedules.find((a) => a.time == time))
          return cht.reply(
            `*Schedule dengan waktu ${time} sudah ada, harap gunakan waktu lain!*`
          );
        let [hh, mm] = time.split(':');

        if (!hh || !mm || isNaN(hh) || isNaN(mm))
          return cht.reply(`*Time tidak valid!*\n\n${schedule}`);
        if (!zone)
          return cht.reply(`*Harap sertakan Zona waktunya!*\n\n${schedule}`);
        let LSZone = ['Asia/Jakarta', 'Asia/Jayapura', 'Asia/Makassar'];

        let timeZone = func.getTopSimilar(
          await func.searchSimilarStrings(zone, LSZone, 0.7)
        ).item;
        if (!timeZone)
          return cht.reply(
            `*Zona waktu tidak valid, harap baca kembali!* \n\n${schedule}`
          );

        let { remainingHours, remainingMinutes } = calculateSoon(
          timeZone,
          hh,
          mm
        );

        chatDb.schedules.push({
          time,
          timeZone,
          msg,
          action: actions[action],
        });
        chatDb.schedules = chatDb.schedules
          .map(JSON.stringify)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(JSON.parse);
        cht.reply(
          `✅ Success menambahkan schedule!  \n\n🕒 Waktu: ${time}, ${timeZone}  \n⚡ Action: ${action}  \n💬 Pesan: ${msg}  \n\n_⏳ ${remainingHours} jam ${remainingMinutes} menit lagi._`
        );
      } else if (type == 'delete') {
        if (!q) return cht.reply(`*Harap sertakan time nya!*\n\n${schedule}`);
        let [hh, mm] = q.split(':');
        if (!hh || !mm || isNaN(hh) || isNaN(mm))
          return cht.reply(`*Time tidak valid!*\n\n${schedule}`);
        let fTime = chatDb.schedules.find((a) => a.time == q);
        if (!fTime)
          return cht.reply(`*Schedule dengan waku tersebut tidak ditemukan!*`);
        chatDb.schedules = chatDb.schedules.filter((a) => a.time !== q);
        cht.reply(`✅ Success menghapus schedule!\n🕒 Waktu: ${q}`);
      } else if (type == 'list') {
        if (chatDb.schedules.length < 1)
          return cht.reply('Tidak ada schedule yang aktif disini!');
        let txt = '*[ LIST SCHEDULE ]*\n';
        let l = 0;
        for (let i of chatDb.schedules) {
          l++;
          let [hh, mm] = i.time.split(':');
          let { remainingHours, remainingMinutes } = calculateSoon(
            i.timeZone,
            hh,
            mm
          );
          txt += `
# \`${i.time}, ${i.timeZone}\`
- ⚡ Action: ${i.action}
- 💬 Pesan: ${i.msg}
_⏳ ${remainingHours} jam ${remainingMinutes} menit lagi._
`;
        }

        cht.reply(txt);
      } else {
        cht.reply(`*Type tidak valid!*\n\n${schedule}`);
      }
    }
  );

  ev.on(
    {
      cmd: ['inviteinfo'],
      listmenu: ['inviteinfo'],
      tag: 'group',
      energy: 10,
      args: 'Masukkan link grup yang valid!',
    },
    async ({ args }) => {
      let inviteCodeMatch = args.match(/chat\.whatsapp\.com\/([\w-]+)/);
      if (!inviteCodeMatch)
        return cht.reply('Gunakan perintah ini dengan link grup yang valid!');

      let inviteCode = inviteCodeMatch[1];
      let groupInfo = await Exp.groupGetInviteInfo(inviteCode);
      let groupId = groupInfo.id;
      let isBotInGroup = false;
      let joinedGroups = await Exp.groupFetchAllParticipating();
      let groupData = isBotInGroup
        ? await Exp.groupMetadata(groupId)
        : groupInfo;

      if (joinedGroups[groupId]) {
        isBotInGroup = true;
      }

      let data = {
        id: groupData.id,
        name: groupData.subject,
        createdAt: func.dateFormatter(
          groupData.creation * 1000,
          'Asia/Jakarta'
        ),
        owner: groupData.owner
          ? `@${groupData.owner.split('@')[0]}`
          : 'Tidak diketahui',
        totalMembers: groupData.size || groupData.participants.length,
        admins: groupData.participants
          .filter((p) => p.admin)
          .map((p) => `@${p.id.split('@')[0]}`),
        totalAdmins: groupData.participants.filter((p) => p.admin).length,
        description: groupData.desc || 'Tidak ada deskripsi',
        isCommunity: groupData.isCommunity ? '✅ Ya' : '❌ Tidak',
        isAnnouncement: groupData.announce ? '✅ Ya' : '❌ Tidak',
        isRestricted: groupData.restrict ? '✅ Ya' : '❌ Tidak',
        joinApproval: groupData.joinApprovalMode ? '✅ Ya' : '❌ Tidak',
        ephemeralDuration: groupData.ephemeralDuration
          ? `${groupData.ephemeralDuration} detik`
          : 'Tidak aktif',
      };
      let text =
        `╭───────────────────\n` +
        `│ *Group Name:* ${data.name}\n` +
        `│ *ID Grup:* ${data.id}\n` +
        `│ *Dibuat Pada:* ${data.createdAt}\n` +
        `│ *Pembuat Grup:* ${data.owner}\n` +
        `│ *Total Anggota:* ${data.totalMembers}\n` +
        `│ *Total Admin:* ${data.totalAdmins}\n` +
        `╰───────────────────────────────\n\n` +
        `*Deskripsi Grup:*\n${data.description}\n\n` +
        `*Admin Grup:*\n${data.admins.length > 0 ? data.admins.join(', ') : 'Tidak ada admin'}\n\n` +
        `*Pengaturan Grup:*\n` +
        `- Komunitas: ${data.isCommunity}\n` +
        `- Pengumuman: ${data.isAnnouncement}\n` +
        `- Dibatasi: ${data.isRestricted}\n` +
        `- Persetujuan Join: ${data.joinApproval}\n` +
        `- Pesan Sementara: ${data.ephemeralDuration}\n` +
        `- *Link Group:* https://chat.whatsapp.com/${inviteCode}`;

      cht.reply(text, {
        mentions: groupData.participants.map((p) => p.id),
      });
    }
  );

  ev.on(
    {
      cmd: ['topenergy', 'topglobalenergy'],
      listmenu: ['topenergy', 'topglobalenergy'],
      tag: 'group',
    },
    async ({ args }) => {
      if (cht.cmd == 'topenergy' && !is.group)
        return cht.reply('Khusus group!');
      let topUsers = [];
      let topEnergy = await Promise.all(
        [
          ...(is.group && cht.cmd !== 'topglobalenergy'
            ? Exp.groupMembers
            : Object.keys(Data.users).map((a) => ({
                id: String(a),
              }))),
        ].map((a) => ({
          id: a.id,
          energy: memories.get(a.id)?.energy || 0,
        }))
      ).then((members) =>
        members
          .sort((a, b) => b.energy - a.energy)
          .slice(0, args && !isNaN(args) ? parseInt(args) * 1 : 10)
          .map((a, i) => {
            topUsers.push(a.id);
            let aid = a.id.includes('@') ? a.id.split('@')[0] : a.id;
            let name = func.getName(aid);
            let emoji =
              i === 0 ? '(🏆)' : i === 1 ? '(🥈)' : i === 2 ? '(🥉)' : '';
            return `${i + 1}. ${name.extractMentions().length == 0 ? name : name.slice(0, 5) + '****' + name.slice(-4)} \`${cht.cmd == 'topglobalenergy' ? aid.slice(0, 5) + '****' + aid.slice(-4) : aid}\` (${a.energy}⚡) ${emoji}`;
          })
          .join('\n')
      );
      let di =
        cht.cmd !== 'topglobalenergy'
          ? `DI GROUP \`${Exp.groupMetdata.subject}\``
          : `DARI TOTAL \`${Object.keys(Data.users).length} USERS\``;
      cht.reply(
        `*TOP ${args && !isNaN(args) ? parseInt(args) * 1 : 10} ENERGY TERBANYAK ${di}*\n\n${topEnergy}`
      );
    }
  );

  ev.on(
    {
      cmd: ['promote', 'demote'],
      listmenu: ['promote', 'demote'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      isMention: true,
      isBotAdmin: true,
    },
    async () => {
      try {
        if (is.botMention)
          return cht.reply(
            'Promote/demote ke diri sendiri tidak dapat dilakukan!'
          );
        await Exp.groupParticipantsUpdate(
          id,
          await Promise.all(
            cht.mention.map((a) => func.getSender(a, { lid: true }))
          ),
          cht.cmd
        );
        cht.reply(
          `Success ${cht.cmd} user @${cht.mention[0].replace(from.sender, '')}`,
          {
            mentions: cht.mention,
          }
        );
      } catch (e) {
        cht.reply(`Enggak bisa!${infos.others.readMore}\n\n${e}`);
      }
    }
  );

  ev.on(
    {
      cmd: ['opentime', 'closetime', 'schedule'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      isBotAdmin: true,
      listmenu: ['opentime', 'closetime', 'schedule'],
    },
    async () => {
      const { id, q, cmd } = cht;
      const preferences = (Data.preferences[id] ||= {});
      preferences.opentime ||= { weekly: {}, once: [] };
      preferences.closetime ||= { weekly: {}, once: [] };

      if (cmd === 'schedule' && q === 'info') {
        const now = new Date();
        const weekly = {
          ...preferences.opentime.weekly,
          ...preferences.closetime.weekly,
        };
        const once = [
          ...preferences.opentime.once,
          ...preferences.closetime.once,
        ];

        let info = '📅 Jadwal Mingguan:\n';
        for (const day in dayMap) {
          const key = dayMap[day];
          const openTimes = preferences.opentime.weekly[key] || [];
          const closeTimes = preferences.closetime.weekly[key] || [];
          if (openTimes.length || closeTimes.length) {
            info += `- ${day.charAt(0).toUpperCase() + day.slice(1)}:\n`;
            if (openTimes.length)
              info += `  🟢 Open: ${openTimes.join(', ')}\n`;
            if (closeTimes.length)
              info += `  🔴 Close: ${closeTimes.join(', ')}\n`;
          }
        }

        info += '\n📌 Jadwal Sekali Eksekusi:\n';
        once.forEach(({ time, action }) => {
          const remaining = Math.max(0, new Date(time) - now);
          const hours = Math.floor(remaining / 3600000);
          const minutes = Math.floor((remaining % 3600000) / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          info += `- ${action === 'open' ? '🟢 Open' : '🔴 Close'} dalam ${hours} jam ${minutes} menit ${seconds} detik\n`;
        });

        let nextEvent = [...once];
        for (const dayKey in dayMap) {
          const weekday = dayMap[dayKey];
          (preferences.opentime.weekly[weekday] || []).forEach((time) => {
            const [h, m] = time.split(':').map(Number);
            const next = new Date(now);
            next.setHours(h, m, 0, 0);
            if (next < now) next.setDate(next.getDate() + 1);
            nextEvent.push({ time: next.toISOString(), action: 'open' });
          });
          (preferences.closetime.weekly[weekday] || []).forEach((time) => {
            const [h, m] = time.split(':').map(Number);
            const next = new Date(now);
            next.setHours(h, m, 0, 0);
            if (next < now) next.setDate(next.getDate() + 1);
            nextEvent.push({ time: next.toISOString(), action: 'close' });
          });
        }

        nextEvent.sort((a, b) => new Date(a.time) - new Date(b.time));
        if (nextEvent.length) {
          const diff = new Date(nextEvent[0].time) - now;
          const hours = Math.floor(diff / 3600000);
          const minutes = Math.floor((diff % 3600000) / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          info += `\n⏳ Grup akan ${nextEvent[0].action === 'open' ? 'dibuka' : 'ditutup'} dalam ${hours} jam ${minutes} menit ${seconds} detik.`;
        }

        return cht.reply(info.trim());
      }

      if (cmd === 'schedule' && q.startsWith('delete')) {
        const args = q.split(/\s+/).slice(1);
        if (!args.length)
          return cht.reply('⚠️ Format salah. Contoh: .schedule delete Senin');

        let days = [];
        if (args[0].toLowerCase() === 'all') {
          days = Object.values(dayMap);
        } else if (args[0].includes('-')) {
          const [start, end] = args[0]
            .split('-')
            .map((d) => dayMap[d.toLowerCase()]);
          const allDays = Object.values(dayMap);
          const startIndex = allDays.indexOf(start);
          const endIndex = allDays.indexOf(end);
          if (startIndex < 0 || endIndex < 0)
            return cht.reply('⚠️ Nama hari tidak valid.');
          days = allDays.slice(startIndex, endIndex + 1);
        } else {
          const dayKey = dayMap[args[0].toLowerCase()];
          if (!dayKey) return cht.reply('⚠️ Nama hari tidak valid.');
          days = [dayKey];
        }

        const actionType = args[1]?.toLowerCase();
        const isOpen = actionType?.includes('open');
        const isClose = actionType?.includes('close');

        let count = 0;
        for (const day of days) {
          if (!isClose) {
            count += preferences.opentime.weekly[day]?.length || 0;
            delete preferences.opentime.weekly[day];
          }
          if (!isOpen) {
            count += preferences.closetime.weekly[day]?.length || 0;
            delete preferences.closetime.weekly[day];
          }
        }

        cht.reply(`✅ ${count} jadwal berhasil dihapus.`);
        Data.preferences[id] = preferences;
        return;
      }

      const action = cmd === 'opentime' ? 'opentime' : 'closetime';
      const schedule = preferences[action];

      const timeRegex = /\d{1,2}:\d{2}/;
      const durationRegex = /(hari|jam|menit|detik)/;

      if (durationRegex.test(q)) {
        const durationMs = parseTimeString(q);
        if (!durationMs)
          return cht.reply(
            '⚠️ Format durasi salah. Contoh: 1 hari 2 jam 30 menit'
          );

        const targetTime = new Date(Date.now() + durationMs);
        schedule.once.push({
          time: targetTime.toISOString(),
          action: action === 'opentime' ? 'open' : 'close',
        });

        cht.reply(
          `✅ Grup akan ${action === 'opentime' ? 'dibuka' : 'ditutup'} dalam ${q}`
        );
      } else if (timeRegex.test(q)) {
        const [timePart, ...dayParts] = q.split(/\s+/);
        const targetTime = timePart;

        let targetDays = [];
        if (dayParts.length === 0) {
          const today = new Date();
          const todayName = today
            .toLocaleDateString('id-ID', { weekday: 'long' })
            .toLowerCase();
          targetDays.push(dayMap[todayName]);
        } else if (dayParts[0].toLowerCase() === 'all') {
          targetDays = Object.values(dayMap);
        } else if (dayParts[0].includes('-')) {
          const [start, end] = dayParts[0]
            .split('-')
            .map((d) => dayMap[d.toLowerCase()]);
          const allDays = Object.values(dayMap);
          const startIndex = allDays.indexOf(start);
          const endIndex = allDays.indexOf(end);
          if (startIndex < 0 || endIndex < 0)
            return cht.reply('⚠️ Nama hari tidak valid.');
          targetDays = allDays.slice(startIndex, endIndex + 1);
        } else {
          targetDays = dayParts
            .map((d) => dayMap[d.toLowerCase()])
            .filter(Boolean);
          if (!targetDays.length) return cht.reply('⚠️ Nama hari tidak valid.');
        }

        for (const day of targetDays) {
          schedule.weekly[day] ||= [];
          if (!schedule.weekly[day].includes(targetTime)) {
            schedule.weekly[day].push(targetTime);
          }
        }

        cht.reply(
          `✅ Jadwal ${action === 'opentime' ? 'buka' : 'tutup'} grup disimpan untuk: ${targetDays.map((d) => reverseDayMap[d]).join(', ')} pukul ${targetTime}`
        );
      } else {
        cht.reply(
          '⚠️ Format salah. Contoh:\n.opentime 20:00\n.closetime 20:00 senin\n.opentime 1 hari 30 menit\n.schedule info\n.schedule delete senin'
        );
      }

      Data.preferences[id] = preferences;
    }
  );
  ev.on(
    {
      cmd: ['setwelcome', 'setleave'],
      listmenu: ['setwelcome', 'setleave'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      args: `format:
.setwelcome <type> <text>
.setleave <type> <text>

contoh:
.setwelcome image \`[ WELCOME ]\`

Hai <members>

Selamat datang di group 
> _*<subject>*_

<desc>

.setleave text \`[ GOOD BYE ]\`

Selamat tinggal <members>

List type yang tersedia:
- text
- image
- linkpreview
- order
- product

List tag yang bisa digunakan:
- <members> = mention anggota
- <subject> = nama group
- <desc> = deskripsi group
`,
    },
    async ({ args, cht }) => {
      let [type, ...etc] = args.split(' '),
        text = etc.join(' '),
        list = ['linkpreview', 'order', 'product', 'image', 'text'],
        validTag = ['subject', 'members', 'desc'],
        tlist = `\`List type yang tersedia:\`\n\n- ${list.join('\n- ')}`,
        cmdType = cht.cmd.includes('leave') ? 'leave' : 'welcome';

      if (!list.includes(type))
        return cht.reply(
          `❌ Type tidak tersedia\n\n${tlist}\ncontoh: .${cht.cmd} type textnya`
        );

      let taglist = func.getListTag(text);
      let ntfnd = taglist.filter((i) => !validTag.includes(i));

      if (ntfnd.length)
        return cht.reply(
          `⚠️ Tag *${ntfnd.join(', ')}* tidak valid!\n\nList tag yang tersedia:\n- ${validTag.join('\n- ')}`
        );

      if (cmdType === 'welcome') {
        chatDb.wtype = type.toLowerCase();
        if (etc.length > 0) chatDb.wtxt = text;
      } else {
        chatDb.ltype = type.toLowerCase();
        if (etc.length > 0) chatDb.ltxt = text;
      }

      cht.reply(
        `✅ Berhasil mengatur ${cmdType.charAt(0).toUpperCase() + cmdType.slice(1)}\n- Type: ${type}` +
          (etc.length > 0 ? `\n- Text: ${text}` : '')
      );
    }
  );

  ev.on(
    {
      cmd: ['pinchat', 'pinpesan'],
      listmenu: ['pinchat'],
      tag: 'group',
      isGroup: true,
      isAdmin: true,
      isQuoted: true,
      arg: 'Mau di pin berapa lama?',
      isBotAdmin: true,
    },
    async ({ args }) => {
      try {
        Exp.sendMessage(cht.id, {
          pin: cht.quoted.key,
          type: 1,
          time: func.parseTimeString(args) / 1000,
        });
      } catch (e) {
        cht.reply(`Enggak bisa!${infos.others.readMore}\n\n${e}`);
      }
    }
  );

  ev.on(
    { cmd: ['listsewa'], tag: 'owner', listmenu: true, isOwner: true },
    async () => {
      if (!cfg.sewa)
        return cht.reply(
          'Anda belum mengaktifkan sewa!, aktifkan dengan mengetik *.set sewa on* untuk mengizinkan fitur sewa'
        );
      Data.sewa ??= {};
      const now = Date.now();

      const entries = Object.entries(Data.sewa);
      if (!entries.length) return cht.reply('Belum ada data sewa aktif.');

      let text = `📋 *DAFTAR SEWA BOT*\n` + `──────────────────\n\n`;

      for (const [gid, v] of entries) {
        const md = func.metadata.get(gid)?.metadata;
        const name = md?.subject || gid;

        if (v.status === 'grace' && v.graceUntil) {
          const sisa = v.graceUntil - now;
          if (sisa <= 0) continue;

          const d = func.formatDuration(sisa);
          text +=
            `• ${name}\n` +
            `  ⏳ Status : *SUSPENDED ⚠️*\n` +
            `  🔒 Bot    : Nonaktif\n` +
            `  ⌛ Sisa   : ${d.days}h ${d.hours}j ${d.minutes}m ${d.seconds}d\n\n`;
          continue;
        }

        if (v.exp > now) {
          const sisa = v.exp - now;
          const d = func.formatDuration(sisa);

          text +=
            `• ${name}\n` +
            `  ✅ Status : *AKTIF*\n` +
            `  🔓 Bot    : Aktif\n` +
            `  ⌛ Sisa   : ${d.days}h ${d.hours}j ${d.minutes}m ${d.seconds}d\n\n`;
        }
      }

      cht.reply(text.trim());
    }
  );

  ev.on(
    {
      cmd: ['addsewa', 'kurangisewa', 'delsewa'],
      listmenu: true,
      tag: 'owner',
      isOwner: true,
    },
    async ({ args }) => {
      if (!cfg.sewa)
        return cht.reply(
          'Anda belum mengaktifkan sewa!, aktifkan dengan mengetik *.set sewa on* untuk mengizinkan fitur sewa'
        );
      try {
        let argsText = `*Panduan untuk menambahkan/menghapus/mengurangiwaktu/melihat list sewa (Hanya bisa digunakan oleh owner!)*

*Opsi terdiri dari:*
- .addsewa (menambahkan sewa)
- .kurangisewa (mengurangi waktu sewa)
- .delsewa (menghapus sewa)
- .listsewa (melihat list sewa)

*Bagaimana cara menggunakannya?*

> _AddSewa: *Sertakan id@g.us/link_grup* waktunya(contoh: 1jam)_
> _KurangiSewa: *Sertakan id@g.us/link_grup* waktunya(contoh: 1jam)_
> _DelSewa: *Sertakan id@g.us/link_grup/nama_grup*_

Example: 
 - *#1* => _Dengan menggunakan link_
- .addsewa https://chat.whatsapp.com/JLQVgObv8No5jNMIr38rc2 1hari12jam
- .kurangisewa https://chat.whatsapp.com/JLQVgObv8No5jNMIr38rc2 1hari12jam
- .delsewa https://chat.whatsapp.com/JLQVgObv8No5jNMIr38rc2

 - *#2* => _Dengan id grup yang akan di sewakan_
- .addsewa 120363030069992317@g.us 1hari12jam
- .kurangisewa 120363030069992317@g.us 1hari12jam
- .delsewa 120363030069992317@g.us
 
 - *#3* => _Dengan nama grup_
> Ini hanya bisa digunakan di fitur delsewa, karena metadata grub pasti tersimpan saat bot sudah join ke grub yang di sewakan sebelumnya.
- .delsewa Experimental-Bell

 - *#4* => _Tanpa menggunakan salah satu dari ketiga opsi diatas_
> Ini hanya bisa digunakan di dalam grup
- .addsewa 1hari12jam
- .kurangisewa 1hari12jam
- .delsewa

*Unit Waktu yang Didukung:*
- s, second, seconds, detik
- m, minute, minutes, menit
- h, hour, hours, jam
- d, day, days, hari
- w, week, weeks, minggu

*Contoh lain terkait cara menggunakan dengan unit waktu yang berbeda:*
- .addsewa <linkgroup> 30 detik 
    ➡️ Menambahkan 30 detik.
-  .addsewa <linkgroup> 1 menit 
    ➡️ Menambahkan 1 menit.
-  .addsewa <linkgroup> 1 jam 15 detik 
    ➡️ Menambahkan 1 jam 15 detik.
- .addsewa <linkgroup> 2 hari 4 jam 
    ➡️ Menambahkan 2 hari 4 jam.
-  .addsewa <linkgroup> 1 minggu 
    ➡️ Menambahkan 1 minggu.
-  .addsewa <linkgroup> 1w 2d 3h 
    ➡️ Menambahkan 1 minggu 2 hari 3 jam.
-  .addsewa <linkgroup> 1d 2h 30m 15s 
    ➡️ Menambahkan 1 hari 2 jam 30 menit 15 detik.

*_Bot otomatis bergabung ke grub sewa saat .addsewa pertamakali, jika sudah di sewakan maka akan menambah masa aktif sewa nya!_*

\`Semoga panduan ini dibaca dengan teiti agar tidak lagi menanyakan kepada admin terkait cara penggunaanya, terimakasih\`
`;
        args ||= '';
        let _id = null,
          groupInfo = null,
          groupName = null,
          now = Date.now(),
          inviteMatch = args.match(/chat\.whatsapp\.com\/([\w-]+)/),
          gusMatch = args.match(/(\d+@g\.us)/);

        if (inviteMatch) {
          try {
            groupInfo = await Exp.groupGetInviteInfo(inviteMatch[1]);
            _id = groupInfo?.id;
            args = args.replace(inviteMatch[1], '')
          } catch (e) {
            return await cht.reply(
              `Gagal mendapatkan rata group!\nErr: ${e.message}${e.message.includes('not-authorized') ? '\n> Bot di kick, jadi gabisa ngambil id dari linknya karena akses di blokir, delsewa pake id/nama grub aja kalo masih kesimpen metadata nya!' : ''}`
            );
          }
        } else if (gusMatch) {
          _id = gusMatch[1];
        } else if (cht.cmd === 'delsewa' && args) {
          await func.metadata.init();
          let vMeta = Object.values(func.metadata.all());
          const found = vMeta.find(
            (a) =>
              a?.metadata?.subject &&
              a.metadata.subject
                .trim()
                .toLowerCase()
                .includes(args.trim().toLowerCase())
          );
          _id = found?.metadata?.id || null;
          if (!_id) {
            let similar = await func.searchSimilarStrings(
              args.trim(),
              vMeta.map((a) => a.metadata.subject),
              0.5
            );

            if (!similar.length) {
              return cht.reply(`Grup *${args}* tidak ditemukan dalam data!`);
            }

            let list = similar
              .map((v, i) => {
                let percent = Math.round(v.similarity * 100);
                return `${i + 1}. ${v.item} (${percent}%)`;
              })
              .join('\n');

            return cht.reply(
              `Grup *${args}* tidak ditemukan dalam data!\n*Mungkin yang kamu maksud:*\n\n${list}`
            );
          }
        } else if (is.group) {
          _id = cht.id;
        }

        if (!_id) return cht.reply(argsText);
        
        const timestamp = func.parseTimeString(args);
        if (!timestamp && cht.cmd !== 'delsewa')
          return cht.reply('Waktu tidak valid!\n\n' + argsText);

        Data.sewa ??= {};
        let dataSewa = Data.sewa[_id];
        const metaDataObj = func.metadata.get(_id) || {},
          metadata = metaDataObj.metadata,
          lastMetadata = metaDataObj.timestamp,
          dur = cht.cmd == 'delsewa' ? {} : func.formatDuration(timestamp),
          waktu =
            `${dur.days ? `${dur.days}hari ` : ''}` +
            `${dur.hours ? `${dur.hours}jam ` : ''}` +
            `${dur.minutes ? `${dur.minutes}menit ` : ''}` +
            `${dur.seconds ? `${dur.seconds}detik` : ''}`.trim();
        function updateSewa(Data, _id, timestamp, now = Date.now()) {
          const sewa = Data.sewa[_id];

          if (sewa?.exp) {
            sewa.exp = now > sewa.exp ? now + timestamp : sewa.exp + timestamp;

            sewa.status = 'active';
            delete sewa.graceUntil;
          } else {
            Data.sewa[_id] = {
              exp: now + timestamp,
              status: 'active',
            };
          }

          return Data.sewa[_id];
        }

        switch (cht.cmd) {
          case 'addsewa': {
            const botInGroup = metadata?.participants?.some(
              (p) => p.id === Exp.number
            );

            if (!botInGroup) {
              if (!inviteMatch)
                return cht.reply(
                  'Sertakan link group!, bot belum tergabung di grup tersebut.'
                );
              updateSewa(Data, _id, timestamp);
              await Exp.groupAcceptInvite(inviteMatch[1]);
              await cht.reply('Berhasil bergabung✅');
              const expTime = dataSewa?.exp || now + timestamp;
              const endDate = new Date(expTime);
              const sisa = expTime - now;
              const dur = func.formatDuration(sisa);

              return await Exp.sendMessage(_id, {
                text:
                  `📌 *INFO BOT*\n\n` +
                  `Bot telah berhasil bergabung ke grup ini.\n\n` +
                  `🔒 Status: *Grup dalam masa sewa*\n` +
                  `🗓️ Tanggal berakhir: *${endDate.toLocaleString('id-ID')}*\n` +
                  `⏳ Berakhir dalam: *${
                    `${dur.days ? dur.days + ' hari ' : ''}` +
                    `${dur.hours ? dur.hours + ' jam ' : ''}` +
                    `${dur.minutes ? dur.minutes + ' menit ' : ''}` +
                    `${dur.seconds ? dur.seconds + ' detik' : ''}`.trim()
                  }*\n\n` +
                  `⚠️ *Catatan Penting:*\n` +
                  `Bot akan *otomatis keluar dari grup* setelah masa sewa berakhir.\n\n` +
                  `Jika ingin memperpanjang masa sewa,\n` +
                  `silakan hubungi *Owner Bot* sebelum waktu habis.`,
              });
            }

            updateSewa(Data, _id, timestamp);
            delete chatDb.mute;

            break;
          }

          case 'kurangisewa': {
            if (!dataSewa?.exp)
              return cht.reply('Grup ini belum memiliki sewa.');

            Data.sewa[_id].exp -= timestamp;
            break;
          }
          case 'delsewa': {
            if (!dataSewa) return cht.reply('Data sewa tidak ditemukan.');
            const expTime = Data.sewa[_id].exp;
            const expiredAt = new Date(expTime).toLocaleString('id-ID', {
              timeZone: 'Asia/Jakarta',
            });
            try {
              await Exp.sendMessage(_id, {
                text:
                  `📢 *INFO BOT*\n\n` +
                  `Masa sewa grup ini telah *di akhiri*.\n\n` +
                  `🗓️ Tanggal berakhir:\n` +
                  `• ${expiredAt}\n\n` +
                  `🔒 Bot akan otomatis keluar dari grup ini.\n` +
                  `Terima kasih telah menggunakan layanan bot.\n\n` +
                  `Jika ingin memperpanjang sewa,\n` +
                  `silakan hubungi *Owner Bot*.`,
              });

              await Exp.groupLeave(_id);
            } catch (e) {
              console.error(e);
            }
            delete Data.sewa[_id];
            func.metadata.delete(_id);

            break;
          }
        }

        if (!groupName) {
          if (groupInfo) groupName = groupInfo.subject;
          else if (metadata) groupName = metadata.subject;
          else groupName = _id;
        }

        cht.reply(
          cht.cmd === 'delsewa'
            ? `Sewa grup *${groupName}* berhasil dihapus.`
            : `Berhasil ${cht.cmd === 'addsewa' ? 'menambahkan' : 'mengurangi'} sewa di grub *${groupName}* selama *${waktu.trim()}*.`
        );
      } catch (e) {
        cht.reply(`Terjadi Kesalahan${infos.others.readMore}\n\n${e}`);
      }
    }
  );

  ev.on(
    {
      cmd: ['ceksewa'],
      listmenu: true,
      isGroup: true,
      isAdmin: true,
      tag: 'group',
    },
    async () => {
      if (!cfg.sewa)
        return cht.reply(
          'Anda belum mengaktifkan sewa!, aktifkan dengan mengetik *.set sewa on* untuk mengizinkan fitur sewa'
        );

      try {
        Data.sewa ??= {};
        const now = Date.now();
        const id = cht.id;

        let sewa = Data.sewa[id];

        if (!sewa) {
          return cht.reply(
            `🛑 *Grup ini tidak terdaftar sebagai sewa bot*\n\n` +
              `Silakan hubungi *Owner Bot* untuk menyewa.`
          );
        }

        let exp = sewa.exp;
        let graceUntil = sewa.graceUntil;

        if (exp <= now && !graceUntil) {
          return cht.reply(
            `⚠️ *Sewa grup ini sudah berakhir!*\n\n` +
              `Bot akan segera keluar dari grup ini.\n\n` +
              `Silakan hubungi *Owner Bot* untuk memperpanjang.`
          );
        }

        if (graceUntil && now <= graceUntil) {
          const sisaGrace = graceUntil - now;
          const durGrace = func.formatDuration(sisaGrace);

          return cht.reply(
            `⏳ *Status Sewa: Grace Period*\n\n` +
              `🔒 Akses bot sementara *dibatasi*\n` +
              `🗓️ Grace berakhir dalam:\n` +
              `• ${durGrace.days ? durGrace.days + ' hari ' : ''}` +
              `${durGrace.hours ? durGrace.hours + ' jam ' : ''}` +
              `${durGrace.minutes ? durGrace.minutes + ' menit ' : ''}` +
              `${durGrace.seconds ? durGrace.seconds + ' detik' : ''}`.trim() +
              `\n\nSilakan perpanjang sebelum grace habis 🙏`
          );
        }

        if (graceUntil && now > graceUntil) {
          return cht.reply(
            `❌ *Sewa & Grace Period Telah Berakhir*\n\n` +
              `Bot seharusnya sudah keluar dari grup ini.\n\n` +
              `Jika belum, silakan hubungi owner.`
          );
        }

        const sisa = exp - now;
        const dur = func.formatDuration(sisa);
        const endDate = new Date(exp).toLocaleString('id-ID', {
          timeZone: 'Asia/Jakarta',
        });

        return cht.reply(
          `✅ *STATUS SEWA GRUP*\n\n` +
            `🟢 Status: *Aktif*\n\n` +
            `🗓️ Berakhir pada:\n` +
            `• ${endDate}\n\n` +
            `⏳ Sisa waktu:\n` +
            `• ${dur.days ? dur.days + ' hari ' : ''}` +
            `${dur.hours ? dur.hours + ' jam ' : ''}` +
            `${dur.minutes ? dur.minutes + ' menit ' : ''}` +
            `${dur.seconds ? dur.seconds + ' detik' : ''}`.trim() +
            `\n\nTerima kasih telah menggunakan bot ini 🙏`
        );
      } catch (e) {
        console.error(e);
        cht.reply('Terjadi kesalahan saat memeriksa status sewa.');
      }
    }
  );
  
  ev.on(
    {
      cmd: ['upswgc', 'swgroup', 'swgc'],
      listmenu: ['swgc'],
      tag: 'group',
      isAdmin: true,
      isGroup: true
    },
    async ({ args }) => {
      try {
        let { quoted, type: mediaType } = ev.getMediaType(cht)
        let caption = args || null
        let messageSecret = await 'crypto'.import().then(a => a.randomBytes(32))

        await Exp.sendMessage(
          id,
          {
            react: {
              text: '📤', 
              key: cht.key 
            }
          }
        )
        
        let content = { text: caption || 'Haii semua!! yang buat sw ini adalah ' + cht.pushName }
        
        if (quoted && mediaType) {
          let media = await cht.quoted.download()
          switch (mediaType) {
            case 'sticker':
            case 'image':
            case 'video':
              content = { [mediaType]: media, caption }
              break
            case 'audio':
              content = { audio: media, mimetype: 'audio/mpeg', ptt: false }
              break
            }
          }

        let inside = await baileys.generateWAMessageContent(content, {
          upload: Exp.waUploadToServer,
        })

        const m = baileys.generateWAMessageFromContent(
          id,
          {
           groupStatusMessageV2: {
              message: {
                ...inside,
                messageContextInfo: { messageSecret },
              },
            },
          }, {}
        )

        await Exp.relayMessage(
          id,
          m.message, 
          { messageId: m.key.id }
        )
      
        await Exp.sendMessage(
          id,
          { 
            react: { 
              text: '✅',
              key: cht.key 
            }
          }
        )

        return cht.reply(`✅ Berhasil membuat status grup${caption ? `\ncaption: ${caption}` : ''}`)
      
      } catch (e) {
        return cht.reply("Gagal membuat status grup\n\n*Error:*\n" + e)
      }
    }
  )
}
