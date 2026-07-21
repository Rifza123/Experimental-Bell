let {
  sesi,
  playerOnGame,
  dataPlayer,
  getPlayerById2,
  killWerewolf,
  unKillWerewolf,
  elixir,
  dreamySeer,
  sorcerer,
  hunt,
  unHunt,
  protectGuardian,
  unProtectGuardian,
} = await "./machine/werewolf.js".r();

export default async function on({ Exp, ev, cht, is }) {
  ev.on({ cmd: ["wwpc"], tag: "game", listmenu: ["wwpc"] }, async ({ args }) => {
    const sender = cht.sender;
    let chat = cht.id;
    Exp.werewolf = Exp.werewolf || {};
    let ww = Exp.werewolf;
    let room = sesi(chat, ww);
    let value = (args[0] || "").toLowerCase();
    let target = args[1];

    let same = {};
    let allPlayers = Object.values(ww).map((a) => a.player || []);
    let playerSessionMap = {};
    for (let players of allPlayers) for (let p of players) playerSessionMap[p.id] = p.sesi;
    if (!chat.endsWith("@g.us")) chat = playerSessionMap[sender];
    if (!chat || !ww[chat]) return cht.reply("Sesi game tidak ditemukan");

    for (let i = 0; i < ww[chat].player.length; i++) {
      if (!(ww[chat].player[i].role in same)) same[ww[chat].player[i].role] = [];
      same[ww[chat].player[i].role].push(ww[chat].player[i].id);
      same[ww[chat].player[i].role] = [...new Set(same[ww[chat].player[i].role])];
    }
    let myRole = dataPlayer(sender, ww)?.role;
    let sames = (same[myRole] || []).filter((a) => a !== sender);

    if (!playerOnGame(sender, ww)) return cht.reply("Kamu tidak dalam sesi game");
    if (dataPlayer(sender, ww).isdead === true) return cht.reply("Kamu sudah mati");
    if (!target || isNaN(target)) return cht.reply("Masukan nomor player. Contoh: .wwpc kill 1");

    let byId = getPlayerById2(sender, parseInt(target), ww);
    if (!byId) return cht.reply("Player tidak terdaftar");
    if (byId.db.isdead === true) return cht.reply("Player sudah mati");
    if (byId.db.id === sender && value !== "deffense") return cht.reply("Tidak bisa untuk diri sendiri");

    if (value === "kill") {
      const player = dataPlayer(sender, ww);
      if (player.role !== "werewolf" && !(player.role === "traitor" && player.isTraitorActive)) return cht.reply("Peran ini bukan untuk kamu");
      if (byId.db.role === "sorcerer") return cht.reply("Tidak bisa membunuh teman");
      let isAttack = dataPlayer(sender, ww)?.addedEffect;
      if (isAttack) unKillWerewolf(sender, parseInt(isAttack), ww);
      dataPlayer(sender, ww).status = true;
      killWerewolf(sender, parseInt(target), ww);
      dataPlayer(sender, ww).addedEffect = parseInt(target);
      await cht.reply(`Berhasil, target bunuh player ${parseInt(target)}`);
      for (let i of sames) await Exp.sendMessage(i, { text: `Werewolf memilih target ${parseInt(target)}`, mentions: [sender] });
      return;
    }

    if (value === "dreamy" || value === "seer") {
      if (dataPlayer(sender, ww).role !== "seer") return cht.reply("Peran ini bukan untuk kamu");
      if (dataPlayer(sender, ww).status) return cht.reply("Skill sudah dipakai malam ini");
      let role = dreamySeer(sender, parseInt(target), ww);
      dataPlayer(sender, ww).status = true;
      return cht.reply(`Player ${target} adalah ${role}`);
    }

    if (value === "deffense") {
      if (dataPlayer(sender, ww).role !== "guardian") return cht.reply("Peran ini bukan untuk kamu");
      let isProtect = dataPlayer(sender, ww)?.addedEffect;
      if (isProtect) unProtectGuardian(sender, parseInt(isProtect), ww);
      protectGuardian(sender, parseInt(target), ww);
      dataPlayer(sender, ww).status = true;
      dataPlayer(sender, ww).addedEffect = parseInt(target);
      return cht.reply(`Berhasil melindungi player ${target}`);
    }

    if (value === "sorcerer") {
      if (dataPlayer(sender, ww).role !== "sorcerer") return cht.reply("Peran ini bukan untuk kamu");
      if (dataPlayer(sender, ww).status) return cht.reply("Skill sudah dipakai malam ini");
      let role = sorcerer(sender, parseInt(target), ww);
      dataPlayer(sender, ww).status = true;
      return cht.reply(`Player ${target} adalah ${role}`);
    }

    if (value === "hunt") {
      if (dataPlayer(sender, ww).role !== "hunter") return cht.reply("Peran ini bukan untuk kamu");
      let isHunt = dataPlayer(sender, ww)?.addedEffect;
      if (isHunt) unHunt(sender, parseInt(isHunt), ww);
      hunt(sender, parseInt(target), ww);
      dataPlayer(sender, ww).status = true;
      dataPlayer(sender, ww).addedEffect = parseInt(target);
      return cht.reply(`Berhasil mencurigai player ${target}`);
    }

    if (value === "elixir") {
      if (dataPlayer(sender, ww).role !== "witch") return cht.reply("Bukan peranmu");
      if (!room || room.day == 1) return cht.reply("Tidak bisa digunakan malam pertama");
      if (!dataPlayer(sender, ww).witch.elixir) return cht.reply("Elixir habis");
      if (dataPlayer(sender, ww).status) return cht.reply("Sudah pakai potion malam ini");
      let idx = room.dead.indexOf(parseInt(target));
      if (idx === -1) return cht.reply("Player tidak mati malam ini");
      elixir(sender, parseInt(target), ww);
      room.dead.splice(idx, 1);
      dataPlayer(sender, ww).witch.elixir = false;
      dataPlayer(sender, ww).status = true;
      return cht.reply(`Elixir berhasil, player ${target} selamat`);
    }

    if (value === "poison") {
      if (dataPlayer(sender, ww).role !== "witch") return cht.reply("Bukan peranmu");
      if (!room || room.day == 1) return cht.reply("Tidak bisa digunakan malam pertama");
      if (!dataPlayer(sender, ww).witch.poison) return cht.reply("Poison habis");
      if (dataPlayer(sender, ww).status) return cht.reply("Sudah pakai potion malam ini");
      if (room.dead.includes(parseInt(target))) return cht.reply("Player sudah mati");
      room.dead.push(parseInt(target));
      dataPlayer(sender, ww).witch.poison = false;
      dataPlayer(sender, ww).status = true;
      return cht.reply(`Poison berhasil, player ${target} akan mati`);
    }

    return cht.reply("Perintah wwpc tidak dikenali");
  });
}
