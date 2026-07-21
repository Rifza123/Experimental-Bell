import jimp from "jimp";
// [ Thumbnail ]
let thumb =
  "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg";
const resize = async (image, width, height) => {
  const read = await jimp.read(image);
  const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
  return data;
};

let {
  emoji_role,
  sesi,
  playerOnGame,
  playerOnRoom,
  playerExit,
  dataPlayer,
  dataPlayerById,
  getPlayerById,
  getPlayerById2,
  killWerewolf,
  killww,
  dreamySeer,
  sorcerer,
  protectGuardian,
  roleShuffle,
  roleChanger,
  roleAmount,
  roleGenerator,
  addTimer,
  startGame,
  playerHidup,
  playerMati,
  vote,
  voteResult,
  sendHasilVoteMayor,
  votingMayor,
  clearAllVote,
  getWinner,
  win,
  pagi,
  malam,
  skill,
  voteStart,
  voteDone,
  voting,
  run,
  run_vote,
  run_malam,
  run_pagi,
} = await "./machine/werewolf.js".r();

/*!-======[ Default Export Function ]======-!*/
export default async function on({ Exp, ev, store, cht, ai, is }) {
  let { func } = Exp
  ev.on(
    {
      cmd: ['ww'],
      tags: "game",
      listmenu: ['ww'],
    },
    async ({ args }) => {
      const sender = cht.sender;
      const chat = cht.id;
  Exp.werewolf = Exp.werewolf ? Exp.werewolf : {};
  const ww = Exp.werewolf ? Exp.werewolf : {};
  const data = ww[chat];
  let Args = args.split(" ")
  const value = (Args[0] || "");
  const target = Args[1];

  // [ Membuat Room ]
  if (value === "create") {
    if (chat in ww) return cht.reply("Group masih dalam sesi permainan");
    if (playerOnGame(sender, ww) === true)
      return cht.reply("Kamu masih dalam sesi game");
    ww[chat] = {
      room: chat,
      owner: sender,
      status: false,
      iswin: null,
      cooldown: null,
      day: 0,
      time: "malem",
      player: [],
      dead: [],
      elixir: [],
      hunt: [],
      voting: false,
      seer: false,
      guardian: [],
      mayorStatus: null,
      mayorVotes: {},
      mayor: null,
      mayorPollKey: null,
    };
    await cht.reply("Room berhasil dibuat, ketik *.ww join* untuk bergabung");

    // [ Join sesi permainan ]
  } else if (value === "join") {
    if (!(chat in ww)) {
      if (playerOnGame(sender, ww) === true)
        return cht.reply("Kamu masih dalam sesi game");
      ww[chat] = {
        room: chat,
        owner: sender,
        status: false,
        iswin: null,
        cooldown: null,
        day: 0,
        time: "malem",
        player: [],
        dead: [],
        voting: false,
        seer: false,
        guardian: [],
        elixir: [],
        hunt: [],
        mayorStatus: null,
        mayorVotes: {},
        mayor: null,
        mayorPollKey: null,
      };
      await cht.reply("Room berhasil dibuat, ketik *.ww join* untuk bergabung");
    }
    if (!ww[chat]) return cht.reply("Belum ada sesi permainan");
    if (ww[chat].status === true)
      return cht.reply("Sesi permainan sudah dimulai");
    if (ww[chat].player.length > 16)
      return cht.reply("Maaf jumlah player telah penuh");
    if (playerOnRoom(sender, chat, ww) === true)
      return cht.reply("Kamu sudah join dalam room ini");
    if (playerOnGame(sender, ww) === true)
      return cht.reply("Kamu masih dalam sesi game");
    let data = {
      id: sender,
      number: ww[chat].player.length + 1,
      sesi: chat,
      status: false,
      role: false,
      effect: [],
      vote: 0,
      isdead: false,
      isvote: false,
      isMayor: false,
      isTraitorActive: false,
      witch: { elixir: true, poison: true },
    };
    ww[chat].player.push(data);
    let player = [];
    let text = `\n*Werewolf - Pemain*\n\n`;
    for (let i = 0; i < ww[chat].player.length; i++) {
      text += `${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )}\n`;
      player.push(ww[chat].player[i].id);
    }
    text += "\nJumlah Pemain Minimal Adalah 5 Dan Maximal 15";
    Exp.sendMessage(
      cht.id,
      {
        text: text.trim(),
        mentions: player,
      },
      {
        quoted: cht,
      }
    );

    // [ Game Play ]
  } else if (value === "start") {
    if (!(chat in ww))
      ww[chat] = {
        room: chat,
        owner: sender,
        status: false,
        iswin: null,
        cooldown: null,
        day: 0,
        time: "malem",
        player: [],
        dead: [],
        voting: false,
        seer: false,
        guardian: [],
        elixir: [],
        hunt: [],
        mayorStatus: null,
        mayorVotes: {},
        mayor: null,
        mayorPollKey: null,
      };
    if (ww[chat].player.length === 0)
      return cht.reply("Room belum memiliki player");
    if (ww[chat].player.length < 4)
      return cht.reply("Maaf jumlah player belum memenuhi syarat");
    if (playerOnRoom(sender, chat, ww) === false)
      return cht.reply("Kamu belum join dalam room ini");
    if (ww[chat].cooldown > 0) {
      if (ww[chat].time === "voting") {
        clearAllVote(chat, ww);
        addTimer(chat, ww);
        return await run_vote(Exp, chat, ww);
      } else if (ww[chat].time === "malem") {
        clearAllVote(chat, ww);
        addTimer(chat, ww);
        return await run_malam(Exp, chat, ww);
      } else if (ww[chat].time === "pagi") {
        clearAllVote(chat, ww);
        addTimer(chat, ww);
        return await run_pagi(Exp, chat, ww);
      }
    }
    if (ww[chat].status === true)
      return cht.reply(
        "*Permainan akan segera dimulai*\nSetiap pemain dimohon untuk bersiap - siap"
      );
    let list1 = "";
    let list2 = "";
    let player = [];
    await sleep(3000);
    if (
      !ww[chat].mayor ||
      !ww[chat].mayorStatus ||
      ww[chat].mayorStatus !== "done"
    ) {
      ww[chat].mayorVotes = {};
      await votingMayor(Exp, ww[chat], ww);
      await cht.reply(
        "Fase pemilihan Mayor dimulai! Silakan vote di polling atau ketik *.ww voteMayor nomor*."
      );
      await sleep(60000);
      await sendHasilVoteMayor(Exp, ww[chat]);

      let count = {};
      Object.values(ww[chat].mayorVotes).forEach((i) => {
        count[i] = (count[i] || 0) + 1;
      });
      if (!Object.keys(count).length) {
        let randomMayorIdx = Math.floor(Math.random() * ww[chat].player.length);
        ww[chat].player[randomMayorIdx].isMayor = true;
        ww[chat].mayorStatus = "done";
        ww[chat].mayor = ww[chat].player[randomMayorIdx].id;
        await Exp.sendMessage(chat, {
          text: `Belum ada vote mayor masuk, jadi mayor dipilih secara acak: @${
            ww[chat].player[randomMayorIdx].id.replace("@s.whatsapp.net", "")
          }.\nPermainan akan segera dimulai.`,
          mentions: [ww[chat].player[randomMayorIdx].id],
        });
      } else {
        let maxVote = Math.max(...Object.values(count));
        let mayorIdx = Number(Object.keys(count).find((i) => count[i] === maxVote));
        ww[chat].player[mayorIdx].isMayor = true;
        ww[chat].mayorStatus = "done";
        ww[chat].mayor = ww[chat].player[mayorIdx].id;
        await Exp.sendMessage(chat, {
          text: `Mayor terpilih adalah @${ww[chat].player[mayorIdx].id.replace(
            "@s.whatsapp.net",
            ""
          )}!\nPermainan akan segera dimulai.`,
          mentions: [ww[chat].player[mayorIdx].id],
        });
      }
      await sleep(3000);
    }
    // Lanjutkan ke roleGenerator, startGame, dst.
    await cht.reply("System sedang mengacak rols untuk masing-masing pemain...");
    await sleep(10000);
    roleGenerator(chat, ww);
    await cht.reply("Sistem sudah mengacak role, silahkan cek private chat kamu");
    addTimer(chat, ww);
    startGame(chat, ww);
    for (let i = 0; i < ww[chat].player.length; i++) {
      list1 += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )}\n`;
      player.push(ww[chat].player[i].id);
    }
    for (let i = 0; i < ww[chat].player.length; i++) {
      list2 += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )} ${
        ww[chat].player[i].role === "werewolf" ||
        ww[chat].player[i].role === "sorcerer"
          ? `[${ww[chat].player[i].role}]`
          : ""
      }\n`;
      player.push(ww[chat].player[i].id);
    }
    let same = {};
    for (let i = 0; i < ww[chat].player.length; i++) {
      // [ Werewolf ]
      if (!(ww[chat].player[i].role in same))
        same[ww[chat].player[i].role] = [];
      same[ww[chat].player[i].role].push(ww[chat].player[i].id);
      same[ww[chat].player[i].role] = [
        ...new Set(same[ww[chat].player[i].role]),
      ];
      if (ww[chat].player[i].role === "werewolf") {
        if (ww[chat].player[i].isdead != true) {
          var text = `Hai ${func.getName(
            ww[chat].player[i].id
          )}, Kamu Telah Dipilih Untuk Memerankan *Werewolf* ${emoji_role(
            "werewolf"
          )} Pada Permainan Kali Ini, Silahkan Pilih Salah Satu Player Yang Ingin Kamu Makan Pada Malam Hari Ini\n*List Pemain*:\n${list2}\n\nKetik *.wwpc kill nomor* Untuk Memakan Player`;
          let sect = [];
          for (let ii = 0; ii < ww[chat].player.length; ii++) {
            sect.push(`Kill Player ${ww[chat].player[ii].number}`);
          }
          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: text.extractMentions(),
          });
          let { key } = await Exp.sendMessage(ww[chat].player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = Exp.werewolf[chat].player;
          Exp.werewolf[chat].player = dataPlayer.map((a) => {
            if (a.id == ww[chat].player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            Exp.sendMessage(ww[chat].player[i].id, {
              delete: key,
              participant: Exp.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }

        // [ villager ]
      } else if (ww[chat].player[i].role === "warga") {
        if (ww[chat].player[i].isdead != true) {
          let text = `*Werewolf - Game*\n\nHai ${func.getName(
            ww[chat].player[i].id
          )} Peran Kamu Adalah *Warga Desa* ${emoji_role(
            "warga"
          )}, Tetap Waspada, Mungkin *Werewolf* Akan Memakanmu Malam Uni, Silakan Masuk Kerumah Masing Masing.\n*List Pemain*:\n${list1}`;
          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: player,
          });
        }

        // [ Lycan ]
      } else if (ww[chat].player[i].role === "lycan") {
        if (ww[chat].player[i].isdead != true) {
          let text = `*Werewolf - Game*\n\nHai ${func.getName(
            ww[chat].player[i].id
          )} Peran Kamu Adalah *Lycan* ${emoji_role(
            "lycan"
          )}, Lycan hanyalah warga biasa, namun jika kamu di terawang maka kamu akan terlihat sebagai werewolf.\nTetap Waspada, Mungkin *Werewolf* Akan Memakanmu Malam Uni, Silakan Masuk Kerumah Masing Masing.\n*List Pemain*:\n${list1}`;
          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: player,
          });
        }
      } else if (ww[chat].player[i].role === "traitor") {
        if (ww[chat].player[i].isdead != true) {
          let text = `*Werewolf - Game*\n\nHai ${func.getName(
            ww[chat].player[i].id
          )} Peran Kamu Adalah *Traitor* ${emoji_role(
            "traitor"
          )}, Traitor hanyalah warga biasa, namun jika semua werewolf telah mati, maka kamu akan menjadi werewolf.\nTetap Waspada, Mungkin *Werewolf* Akan Memakanmu Malam Uni, Silakan Masuk Kerumah Masing Masing.\n*List Pemain*:\n${list1}`;
          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: player,
          });
        }

        // [ Penerawangan ]
      } else if (ww[chat].player[i].role === "seer") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hai ${func.getName(
            ww[chat].player[i].id
          )} Kamu Telah Terpilih Untuk Menjadi *Penerawang* ${emoji_role(
            "seer"
          )}. Dengan Sihir Yang Kamu Punya, Kamu Bisa Mengetahui Peran Pemain Yang Kamu Pilih.\n*List Pemain*:\n${list1}\n\nKetik *.wwpc dreamy nomor* Untuk Melihat Peran Pemain`;

          let sect = [];
          for (let ii = 0; ii < ww[chat].player.length; ii++) {
            sect.push(`Seer Player ${ww[chat].player[ii].number}`);
          }

          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: text.extractMentions(),
          });
          let { key } = await Exp.sendMessage(ww[chat].player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = Exp.werewolf[chat].player;
          Exp.werewolf[chat].player = dataPlayer.map((a) => {
            if (a.id == ww[chat].player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            Exp.sendMessage(ww[chat].player[i].id, {
              delete: key,
              participant: Exp.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
      } else if (ww[chat].player[i].role === "witch") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hai ${func.getName(
            ww[chat].player[i].id
          )} Kamu Telah Terpilih Untuk Menjadi *Penyihir* ${emoji_role(
            "witch"
          )}. Kamu memiliki 2 potions/ramuan yaitu elixir dan poison. Masing - masing berjumlah 1
Elixir berfungsi untuk melindungi player dari serangan werewolf dan sebagainya.
Poison berfungsi untuk meracuni player, baik warga ataupun werewolf. Poison dapat menjadi pedang bermata dua, untuk itu mohon bijak menggunakannya.
Kamu hanya dapat menggunakan 1 potionsnya pada malam hari. Namun kamu tidak dapat menggunakannya pada malam pertama.\n*List Pemain*:\n${list1}\n\nKetik *.wwpc elixir/poison nomor* Untuk Menggunakan Potion`;

          let sect = [];
          for (let ii = 0; ii < ww[chat].player.length; ii++) {
            sect.push(`Poison ${ww[chat].player[ii].number}`);
            sect.push(`Elixir ${ww[chat].player[ii].number}`);
          }

          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: text.extractMentions(),
          });
          let { key } = await Exp.sendMessage(ww[chat].player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = Exp.werewolf[chat].player;
          Exp.werewolf[chat].player = dataPlayer.map((a) => {
            if (a.id == ww[chat].player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            Exp.sendMessage(ww[chat].player[i].id, {
              delete: key,
              participant: Exp.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
        // [ Guardian ]
      } else if (ww[chat].player[i].role === "guardian") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hai ${func.getName(
            ww[chat].player[i].id
          )} Kamu Terpilih Untuk Memerankan *Malaikat Pelindung* ${emoji_role(
            "guardian"
          )}, Dengan Kekuatan Yang Kamu Miliki, Kamu Bisa Melindungi Para Warga, Silahkan Pilih Salah 1 Player Yang Ingin Kamu Lindungi\n*List Pemain*:\n${list1}\n\nKetik *.wwpc deff nomor* Untuk Melindungi Pemain`;
          let sect = [];
          for (let ii = 0; ii < ww[chat].player.length; ii++) {
            sect.push(`Deffense Player ${ww[chat].player[ii].number}`);
          }

          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: text.extractMentions(),
          });
          let { key } = await Exp.sendMessage(ww[chat].player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = Exp.werewolf[chat].player;
          Exp.werewolf[chat].player = dataPlayer.map((a) => {
            if (a.id == ww[chat].player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            Exp.sendMessage(ww[chat].player[i].id, {
              delete: key,
              participant: Exp.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }

        // [ Sorcerer ]
      } else if (ww[chat].player[i].role === "sorcerer") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hai ${func.getName(
            ww[chat].player[i].id
          )} Kamu Terpilih Sebagai Penyihir ${emoji_role(
            "sorcerer"
          )}, Dengan Kekuasaan Yang Kamu Punya, Kamu Bisa Membuka Identitas Para Pemain, Silakan Pilih 1 Pemain Yang Ingin Kamu Buka Identitasnya\n*List Pemain*:\n${list2}\n\nKetik *.wwpc sorcerer nomor* Untuk Melihat Peran Pemain`;
          let sect = [];
          for (let ii = 0; ii < ww[chat].player.length; ii++) {
            sect.push(`Sorcerer Player ${ww[chat].player[ii].number}`);
          }

          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: text.extractMentions(),
          });
          let { key } = await Exp.sendMessage(ww[chat].player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = Exp.werewolf[chat].player;
          Exp.werewolf[chat].player = dataPlayer.map((a) => {
            if (a.id == ww[chat].player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            Exp.sendMessage(ww[chat].player[i].id, {
              delete: key,
              participant: Exp.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
      } else if (ww[chat].player[i].role === "hunter") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hai ${func.getName(
            ww[chat].player[i].id
          )}! Kamu adalah *Hunter* ${emoji_role("hunter")}.
Setiap malam kamu boleh memilih satu pemain yang kamu curigai sebagai *Werewolf*. Namun, kamu hanya akan *menembak/membunuh* pemain tersebut jika kamu mati.\n
Ketik: *.wwpc hunt nomor* untuk memilih target curiga.\n*List Pemain:*:\n${list2}`;

          let sect = ww[chat].player.map((p) => `Curigai Player ${p.number}`);
          await Exp.sendMessage(ww[chat].player[i].id, {
            text,
            mentions: text.extractMentions(),
          });
          let { key } = await Exp.sendMessage(ww[chat].player[i].id, {
            poll: { name: "`*HUNTER*`", values: sect },
          });

          Exp.werewolf[chat].player = Exp.werewolf[chat].player.map((p) => {
            if (p.id == ww[chat].player[i].id) p.key = key;
            return p;
          });

          setTimeout(() => {
            Exp.sendMessage(ww[chat].player[i].id, {
              delete: key,
              participant: Exp.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
      } else if (ww[chat].player[i].role === "witch") {
        if (ww[chat].player[i].isdead != true) {
          if (!ww[chat].player[i].witch) {
            ww[chat].player[i].witch = { elixir: true, poison: true };
          }

          if (ww[chat].malam != 1) {
            let potionText = `Hai ${func.getName(
              ww[chat].player[i].id
            )}! Kamu adalah *Witch* ${emoji_role("witch")}.
Kamu punya 2 ramuan: *Elixir* (hidupkan 1 orang) dan *Poison* (bunuh 1 orang).
Kamu hanya bisa menggunakan 1 ramuan per malacht. Sisa:
- Elixir: ${ww[chat].player[i].witch.elixir ? "✅" : "❌"}
- Poison: ${ww[chat].player[i].witch.poison ? "✅" : "❌"}\n
Gunakan *.wwpc elixir nomor* atau *.wwpc poison nomor*\n*List Pemain:*:\n${list2}`;

            await Exp.sendMessage(ww[chat].player[i].id, {
              text: potionText,
              mentions: Exp.parseMention(potionText),
            });
          }
        }
      } else if (ww[chat].player[i].role === "traitor") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hai ${func.getName(
            ww[chat].player[i].id
          )}! Kamu adalah *Traitor* ${emoji_role("traitor")}.
Kamu terlihat seperti warga biasa. Namun, jika semua Werewolf mati, kamu akan otomatis berubah menjadi *Werewolf* dan bergabung ke tim jahat.`;

          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: text.extractMentions(),
          });
        }
      } else if (ww[chat].player[i].role === "lycan") {
        if (ww[chat].player[i].isdead != true) {
          let text = `Hai ${func.getName(
            ww[chat].player[i].id
          )}! Kamu adalah *Lycan* ${emoji_role("lycan")}.
Kamu adalah warga biasa, tapi jika kamu diterawang oleh Seer, kamu akan terlihat seperti *tim jahat*!`;

          await Exp.sendMessage(ww[chat].player[i].id, {
            text: text,
            mentions: text.extractMentions(),
          });
        }
      }
    }
    let sames = Object.keys(same);
    for (let i of sames) {
      let samed = same[i];
      if (samed.length > 1) {
        for (let ii of samed) {
          let _ment = samed.filter((a) => a !== ii);
          let ment = _ment.map((a) => `@${a.split("@")[0]}`).join(", ");
          let text = `Player ${ment} adalah temanmu, dia juga seorang ${i}. Kamu dapat bekerja sama dengan ${
            samed.length > 2 ? "mereka" : "nya"
          } ${i == "werewolf" ? " dan kamu tidak dapat membunuhnya" : "."}`;
          await Exp.sendMessage(ii, {
            text,
            mentions: samed,
          });
        }
      }
    }
    await Exp.sendMessage(chat, {
      text: "*Werewolf - Game*\n\nGame Telah Dimulai, Para Pemain Akan Memerankan Perannya Masing Masing, Silahkan Cek Chat Pribadi Untuk Melihat Peran Kalian. Berhati-Hatilah Para Sarga, Mungkin Malam Ini Kamu Akan Di Ewe Brutal",
      mentions: player,
    });
    await run(Exp, chat, ww);
  } else if (value === "voteMayor") {
    if (!ww[chat] || ww[chat].mayorStatus !== "voting")
      return cht.reply("Fase pemilihan Mayor belum dimulai.");
    if (!target || isNaN(target))
      return cht.reply("Masukkan nomor player yang valid.");
    let idx = ww[chat].player.findIndex((p) => p.number == target);
    if (idx === -1) return cht.reply("Nomor player tidak ditemukan.");
    ww[chat].mayorVotes = ww[chat].mayorVotes || {};
    ww[chat].mayorVotes[sender] = idx;
    await cht.reply(`Vote Mayor kamu untuk player ${args[0]} telah dicatat.`);
  } else if (value === "vote") {
    if (!ww[chat]) return cht.reply("Belum Ada Sesi Permainan");
    if (ww[chat].status === false)
      return cht.reply("Sesi Permainan Belum Dimulai");
    if (ww[chat].time !== "voting") return cht.reply("Sesi Voting Belum Dimulai");
    if (playerOnRoom(sender, chat, ww) === false)
      return cht.reply("Kamu Bukan Pemain");
    if (dataPlayer(sender, ww).isdead === true)
      return cht.reply("Kamu Sudah Mati");
    if (!target || target.length < 1) return cht.reply("Masukan Nomor Pemain");
    if (isNaN(target)) return cht.reply("Gunakan Hanya Nomor");

    let b = getPlayerById(chat, sender, parseInt(target), ww);
    if (b.db.isdead === true) return cht.reply(`Pemain ${target} Sudah Mati.`);
    if (ww[chat].player.length < parseInt(target)) return cht.reply("Invalid");
    if (getPlayerById(chat, sender, parseInt(target), ww) === false)
      return cht.reply("Pemain Tidak Terdaftar!");
    vote(chat, parseInt(target), sender, ww);
    let isupdate = dataPlayer(sender, ww).isvote === false;
    let mvt = isupdate
      ? ": mevoting player"
      : ": mengganti votingnya ke player";
    let TXT = `*[ VOTE WW UPDATE ]*\n`;
    TXT += `Anda(Player ${dataPlayer(sender, ww).number}) ${mvt} *${target}*`;
    await Exp.sendMessage(sender, {
      text: TXT,
    });
    /*for (let i = 0; i < ww[chat].player.length; i++) { 
             let TXT = `*[ VOTE WW UPDATE ]*\n`
             TXT += `\nPlayer ${dataPlayer(sender, ww).number} ${mvt} *${target}*`
             await Exp.sendMessage(ww[chat].player[i].id, { 
                 text: TXT
             })
         }*/
    return true;
  } else if (value == "left") {
    if (!ww[chat]) return cht.reply("Tidak Ada Sesi Permainan");
    if (playerOnRoom(sender, chat, ww) === false)
      return cht.reply("Kamu Tidak Dalam Sesi Permainan");
    if (ww[chat].status === true)
      return cht.reply("Permainan Sudah Dimulai, Kamu Tidak Bisa Keluar");
    cht.reply(`@${sender.split("@")[0]} Keluar Dari Permainan`, {
      withTag: true,
    });
    playerExit(chat, sender, ww);
  } else if (value === "delete") {
    if (!ww[chat]) return cht.reply("Tidak Ada Sesi Permainan");
    cht.reply("Sesi Permainan Berhasil Dihapus").then(() => {
      delete ww[chat];
    });
  } else if (value === "player") {
    if (!ww[chat]) return cht.reply("Tidak Ada Sesi Permainan");
    if (playerOnRoom(sender, chat, ww) === false)
      return cht.reply("Kamu Tidak Dalam Sesi Permainan");
    if (ww[chat].player.length === 0)
      return cht.reply("Sesi Permainan Belum Memiliki Pemain");
    let player = [];
    let text = "\n*Werewolf - Game*\n\nList Pemain:\n";
    for (let i = 0; i < ww[chat].player.length; i++) {
      text += `(${ww[chat].player[i].number}) @${ww[chat].player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )} ${
        ww[chat].player[i].isdead === true
          ? `☠️ ${ww[chat].player[i].role}`
          : ""
      }\n`;
      player.push(ww[chat].player[i].id);
    }
    Exp.sendMessage(
      cht.id,
      {
        text: text,
        mentions: player,
      },
      {
        quoted: cht,
      }
    );
  } else if (value === "guide") {
    let player = [];
    if (ww[chat]?.player) {
      for (let i = 0; i < ww[chat].player.length; i++) {
        player.push(ww[chat].player[i].id);
      }
    }

    let text = `ℹ️ *Panduan Permainan Werewolf*

1. Buat room dengan *.ww create* lalu pemain bergabung dengan *.ww join*.
2. Setelah cukup pemain (min. 5, max. 15), mulai game dengan *.ww start*.
3. Pemilihan Mayor: Semua pemain memilih satu Mayor yang akan memiliki hak suara ganda saat voting.
4. Role dibagikan secara acak ke setiap pemain melalui chat pribadi.
5. Permainan terbagi menjadi dua fase: Malam (role menggunakan skill) dan Siang (diskusi & voting).
6. Setiap malam, role dengan skill khusus dapat menggunakan kemampuannya.
7. Siang hari, semua pemain berdiskusi dan melakukan voting untuk mengeksekusi pemain yang dicurigai.
8. Permainan berakhir jika salah satu kubu (Werewolf atau Warga) memenuhi kondisi kemenangan.

*Daftar Role & Kemampuan:*
- *Werewolf 🐺*: Setiap malam memilih satu pemain untuk dimakan. Tidak bisa membunuh sesama werewolf.
- *Warga 👱‍♂️*: Tidak memiliki skill khusus, bertahan hidup dan berdiskusi.
- *Mayor 👑*: Dipilih di awal game, suaranya saat voting bernilai 2x lipat.
- *Seer 🔮*: Setiap malam dapat menerawang satu pemain untuk mengetahui perannya. *.wwpc dreamy nomor*
- *Guardian 🛡️*: Setiap malam dapat melindungi satu pemain dari serangan. *.wwpc deffense nomor*
- *Hunter 🎯*: Dapat memilih satu pemain untuk dibawa mati jika dirinya dibunuh oleh werewolf. *.wwpc hunt nomor*
- *Witch 🧙‍♀️*: Memiliki 2 potion: Elixir (hidupkan 1 pemain yang mati malam itu) & Poison (racuni 1 pemain). Hanya bisa pakai 1 potion per malam, tidak bisa digunakan malam pertama. *.wwpc elixir nomor* atau *.wwpc poison nomor*
- *Traitor 🕵️*: Awalnya warga biasa, akan menjadi werewolf jika semua werewolf asli mati. Akan diumumkan ke semua pemain saat aktif.
- *Lycan 🐺👱‍♂️*: Terlihat sebagai werewolf jika diterawang Seer, tapi sebenarnya warga biasa.
- *Sorcerer 🧙*: Setiap malam dapat mengetahui role satu pemain. *.wwpc sorcerer nomor*

*Perintah Utama:*
- *.ww create* — Membuat room baru
- *.ww join* — Bergabung ke room
- *.ww start* — Memulai permainan
- *.ww vote nomor* — Voting siang hari
- *.ww voteMayor nomor* — Voting pemilihan Mayor/kepala desa
- *.wwpc [skill] nomor* — Menggunakan skill role di malam hari (lihat daftar role di atas)

*Catatan Penting:*
- Setiap role hanya bisa menggunakan skill sekali per malam.
- Witch hanya bisa menggunakan satu potion per malam, dan tidak bisa di malam pertama.
- Traitor akan aktif otomatis jika semua werewolf mati.
- Mayor dipilih sebelum game dimulai, dan suaranya bernilai ganda saat voting.
- Jangan membocorkan role ke pemain lain di luar game!

Selamat bermain, gunakan strategi dan diskusi untuk menang!`
    Exp.sendMessage(
      cht.id,
      {
        text: text,
        mentions: player,
      },
      {
        quoted: cht,
      }
    );
  } else {
    let text = `\n*Werewolf - Game*\n\nPermainan Sosial Yang Berlangsung Dalam Beberapa Putaran/Ronde. Para Pemain Dituntut Untuk Mencari Seorang Penjahat Yang Ada Dipermainan. Para Pemain Diberi Waktu, Peran, Serta Kemampuannya Masing-masing Untuk Bermain Permainan Ini\n\n*List Perintah*\n`;
    text += ` _*• ww guide* (Panduan Bermain Werewolf)_\n`;
    text += ` _*• ww create* (Membuat Sesi Game)_\n`;
    text += ` _*• ww join* (Untuk Mengikuti Game)_\n`;
    text += ` _*• ww start* (Memulai Game)_\n`;
    text += ` _*• ww left* (Keluar Dari Game)_\n`;
    text += ` _*• ww delete* (Menghapus Game)_\n`;
    text += ` _*• ww player* (Meihat Pemain)_\n`;
    text += `\nPermainan Ini Dapat Dimainkan Dari 5 Sampai 15 Orang.`;
    Exp.sendMessage(
      cht.id,
      {
        text: text.trim(),
      },
      {
        quoted: cht,
      }
    );
  }
    }
  );
}
