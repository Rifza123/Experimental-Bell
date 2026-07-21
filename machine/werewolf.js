import toMs from "ms";
import { generateWAMessageFromContent } from "@whiskeysockets/baileys";

/*
let thumb1 =
    "https://user-images.githubusercontent.com/72728486/235344562-4677d2ad-48ee-419d-883f-e0ca9ba1c7b8.jpg"
let thumb2 =
    "https://user-images.githubusercontent.com/72728486/235344861-acdba7d1-8fce-41b8-adf6-337c818cda2b.jpg"
let thumb3 =
    "https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg"
let thumb4 =
    "https://user-images.githubusercontent.com/72728486/235354619-6ad1cabd-216c-4c7c-b7c2-3a564836653a.jpg"
let thumb5 =
    "https://user-images.githubusercontent.com/72728486/235365156-cfab66ce-38b2-4bc7-90d7-7756fc320e06.jpg"
let thumb6 =
    "https://user-images.githubusercontent.com/72728486/235365148-35b8def7-c1a2-451d-a2f2-6b6a911b37db.jpg"

import jimp from "jimp"

const resize = async (image, width, height) => {
    const read = await jimp.read(image)
    const data = await read.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
    return data
}
*/
var a;
var b;
var d;
var e;
var f;
var textnya;
var idd;
var room;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function emoji_role(role) {
  if (role === "warga") {
    return "👱‍♂️";
  } else if (role === "seer") {
    return "👳";
  } else if (role === "guardian") {
    return "👼";
  } else if (role === "sorcerer") {
    return "🔮";
  } else if (role === "werewolf") {
    return "🐺";
  } else if (role === "hunter") {
    return "🏹";
  } else if (role === "witch") {
    return "🧙";
  } else if (role === "traitor") {
    return "🕵️";
  } else if (role === "lycan") {
    return "🐺‍🧑";
  } else {
    return "";
  }
}

// #######################

const findObject = (obj = {}, key, value) => {
  const result = [];
  const recursiveSearch = (obj = {}) => {
    if (!obj || typeof obj !== "object") {
      return;
    }
    if (obj[key] === value) {
      result.push(obj);
    }
    Object.keys(obj).forEach(function (k) {
      recursiveSearch(obj[k]);
    });
  };
  recursiveSearch(obj);
  return result;
};

// Sesi
const sesi = (from, data) => {
  if (!data[from]) return false;
  return data[from];
};

// Memastikan player tidak dalam sesi game apapun
const playerOnGame = (sender, data) => {
  let result = findObject(data, "id", sender);
  let index = false;
  if (result?.length === 0) {
    return index;
  } else {
    index = true;
  }
  return index;
};

// cek apakah player sudah dalam room
const playerOnRoom = (sender, from, data) => {
  let result = findObject(data, "id", sender);
  let index = false;
  if (result?.length > 0 && result[0].sesi === from) {
    index = true;
  } else {
    return index;
  }
  return index;
};

// get data player
const dataPlayer = (sender, data) => {
  let result = findObject(data, "id", sender);
  let index = false;
  if (result?.length > 0 && result[0].id === sender) {
    index = result[0];
  } else {
    return index;
  }
  return index;
};

// get data player by id
const dataPlayerById = (id, data) => {
  let result = findObject(data, "number", id);
  let index = false;
  if (result?.length > 0 && result[0].number === id) {
    index = result[0];
  } else {
    return index;
  }
  return index;
};

// keluar game
const playerExit = (from, id, data) => {
  room = sesi(from, data);
  if (!room) return false;
  const indexPlayer = room.player.findIndex((i) => i.id === id);
  room.player.splice(indexPlayer, 1);
};

// get player id
const getPlayerById = (from, sender, id, data) => {
  room = sesi(from, data);
  if (!room) return false;
  const indexPlayer = room.player.findIndex((i) => i.number === id);
  if (indexPlayer === -1) return false;
  return {
    index: indexPlayer,
    sesi: room.player[indexPlayer].sesi,
    db: room.player[indexPlayer],
  };
};

// get player id 2
const getPlayerById2 = (sender, id, data) => {
  let result = findObject(data, "id", sender);
  if (result?.length > 0 && result[0].id === sender) {
    let from = result[0].sesi;
    room = sesi(from, data);
    if (!room) return false;
    const indexPlayer = room.player.findIndex((i) => i.number === id);
    if (indexPlayer === -1) return false;
    return {
      index: indexPlayer,
      sesi: room.player[indexPlayer].sesi,
      db: room.player[indexPlayer],
    };
  }
};

// werewolf kill
const killWerewolf = (sender, id, data) => {
  let idww = parseInt(String(sender).split("@")[0]);
  let result = getPlayerById2(sender, id, data);
  let result1 = getPlayerById2(sender, idww, data);

  if (!result) return false;
  let { index, sesi, db } = result;
  let { index: index2, sesi: sesi2, db: db2 } = result1;
  if (data[sesi].player[index].number === id) {
    if (db.effect.includes("guardian")) {
      data[sesi].guardian.push(parseInt(id));
    }
    if (db.effect.includes("elixir")) {
      data[sesi].elixir.push(parseInt(id));
    }
    if (db2.effect.includes("hunt")) {
      data[sesi].hunt.push(idww);
    }
    data[sesi].dead.push(parseInt(id));
  }
};
const unKillWerewolf = (sender, id, data) => {
  let result = getPlayerById2(sender, id, data);
  if (!result) return false;
  let { index, sesi, db } = result;
  data[sesi].dead = data[sesi].dead.filter((a) => a !== parseInt(id));
};

// seer dreamy
const dreamySeer = (sender, id, data) => {
  let result = getPlayerById2(sender, id, data);
  if (!result) return false;
  let { index, sesi, db } = result;
  if (data[sesi].player[index].role === "werewolf") {
    data[sesi].seer = true;
  }
  let role = data[sesi].player[index].role;
  return role == "lycan" ? "werewolf" : role;
};

// seer dreamy
const sorcerer = (sender, id, data) => {
  let result = getPlayerById2(sender, id, data);
  if (!result) return false;
  let { index, sesi, db } = result;
  let role = data[sesi].player[index].role;
  return role == "lycan" ? "werewolf" : role;
};

// guardian protect
const protectGuardian = (sender, id, data) => {
  let result = getPlayerById2(sender, id, data);
  if (!result) return false;
  let { index, sesi, db } = result;
  data[sesi].player[index].effect.push("guardian");
};

const unProtectGuardian = (sender, id, data) => {
  let result = getPlayerById2(sender, id, data);
  if (!result) return false;
  let { index, sesi, db } = result;
  data[sesi].player[index].effect = data[sesi].player[index].effect.filter(
    (a) => a !== "guardian"
  );
};

const elixir = (sender, id, data) => {
  let result = getPlayerById2(sender, id, data);
  if (!result) return false;
  let { index, sesi, db } = result;
  data[sesi].player[index].effect.push("elixir");
};

const hunt = (sender, id, data) => {
  let result = getPlayerById2(sender, id, data);
  if (!result) return false;
  let { index, sesi, db } = result;
  data[sesi].player[index].effect.push("hunt");
};

const unHunt = (sender, id, data) => {
  let result = getPlayerById2(sender, id, data);
  if (!result) return false;
  let { index, sesi, db } = result;
  data[sesi].player[index].effect = data[sesi].player[index].effect.filter(
    (a) => a !== "hunt"
  );
};

// pengacakan role
const roleShuffle = (array) => {
  let currentIndex = array?.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

// memberikan role ke player
const roleChanger = (from, id, role, data) => {
  room = sesi(from, data);
  if (!room) return false;
  var index = room.player.findIndex((i) => i.id === id);
  if (index === -1) return false;
  room.player[index].role = role;
};

const checkTraitorActivation = async (room, conn) => {
  const werewolvesAlive = room.player.filter(
    (p) => p.role === "werewolf" && !p.isdead
  );
  if (werewolvesAlive.length === 0) {
    const traitor = room.player.find(
      (p) => p.role === "traitor" && !p.isdead && !p.isTraitorActive
    );
    if (traitor) {
      traitor.isTraitorActive = true;

      await conn.sendMessage(traitor.id, {
        text: "Semua werewolf telah mati! Kamu sekarang menjadi werewolf dan bisa membunuh warga lain. Tapi identitasmu tetap sebagai traitor.",
      });
      if (conn && room.room) {
        const allPlayers = room.player.map((p) => p.id);
        conn.sendMessage(room.room, {
          text: "⚠️ Seorang pengkhianat telah berubah menjadi Werewolf! Waspadalah!",
          mentions: allPlayers,
        });
      }
    }
  }
};

// memberikan peran ke semua player
const roleAmount = (from, data) => {
  const result = sesi(from, data);
  if (!result) return false;

  const count = result.player?.length || 0;

  if (count === 4) {
    return {
      werewolf: 1,
      seer: 1,
      guardian: 1,
      hunter: 0,
      witch: 0,
      traitor: 0,
      lycan: 0,
      sorcerer: 0,

      warga: 1,
    };
  } else if (count === 5) {
    return {
      werewolf: 1,
      seer: 1,
      guardian: 1,
      hunter: 0,
      witch: 0,
      traitor: 0,
      lycan: 0,
      sorcerer: 0,

      warga: 2,
    };
  } else if (count >= 6 && count <= 7) {
    return {
      werewolf: 2,
      seer: 1,
      guardian: 1,
      hunter: 0,
      witch: 0,
      traitor: 0,
      lycan: 0,
      sorcerer: 0,

      warga: count - 4,
    };
  } else if (count >= 8 && count <= 9) {
    return {
      werewolf: 2,
      seer: 1,
      hunter: 1,
      witch: 1,
      traitor: 1,
      guardian: 0,
      lycan: 0,
      sorcerer: 0,

      warga: count - 6,
    };
  } else if (count >= 10 && count <= 12) {
    return {
      werewolf: 2,
      seer: 1,
      guardian: 1,
      hunter: 1,
      witch: 1,
      traitor: 1,
      lycan: 1,
      sorcerer: 0,

      warga: count - 8,
    };
  } else if (count === 13) {
    return {
      werewolf: 2,
      seer: 1,
      guardian: 2,
      hunter: 1,
      witch: 1,
      traitor: 1,
      lycan: 1,
      sorcerer: 1,

      warga: 3,
    };
  } else if (count === 14) {
    return {
      werewolf: 2,
      seer: 2,
      guardian: 2,
      hunter: 1,
      witch: 1,
      traitor: 1,
      lycan: 1,
      sorcerer: 1,

      warga: 3,
    };
  } else if (count === 15) {
    return {
      werewolf: 3,
      seer: 2,
      guardian: 2,
      hunter: 1,
      witch: 1,
      traitor: 1,
      lycan: 1,
      sorcerer: 1,

      warga: 3,
    };
  } else {
    return {
      werewolf: 1,
      seer: 1,
      guardian: 1,
      hunter: 0,
      witch: 0,
      traitor: 0,
      lycan: 0,
      sorcerer: 0,

      warga: Math.max(0, count - 3),
    };
  }
};

const roleGenerator = (from, data) => {
  const room = sesi(from, data);
  if (!room) return false;

  const role = roleAmount(from, data);
  const roles = [
    "werewolf",
    "seer",
    "guardian",
    "warga",
    "sorcerer",
    "hunter",
    "witch",
    "traitor",
    "lycan",
    "mayor",
  ];

  for (const r of roles) {
    const jumlah = role[r] || 0;
    for (let i = 0; i < jumlah; i++) {
      const player = room.player.filter((x) => x.role === false);
      const list = roleShuffle(player);
      if (!list || list.length === 0) return false;
      const random = Math.floor(Math.random() * list.length);
      roleChanger(from, list[random].id, r, data);
    }
  }

  shortPlayer(from, data);
};

// add cooldown
const addTimer = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  room.cooldown = Date.now() + toMs(60 + "s");
};

// merubah status room, dalam permainan
const startGame = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  room.status = true;
};

// rubah hari
const changeDay = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  if (room.time === "pagi") {
    room.time = "voting";
  } else if (room.time === "malem") {
    room.time = "pagi";
    room.day += 1;
  } else if (room.time === "voting") {
    room.time = "malem";
  }
};

// hari voting
const dayVoting = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  if (room.time === "malem") {
    room.time = "voting";
  } else if (room.time === "pagi") {
    room.time = "voting";
  }
};

// voting
const vote = (from, id, sender, data) => {
  room = sesi(from, data);
  if (!room) return false;
  const idGet = room.player.findIndex((i) => i.id === sender);
  if (idGet === -1) return false;
  const indexPlayer = room.player.findIndex((i) => i.number === id);
  if (indexPlayer === -1) return false;
  if (idGet !== -1) {
    room.player[idGet].isvote = true;
  }
  room.player[indexPlayer].vote += 1;
};

// hasil voting
const voteResult = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  room.player.sort((a, b) => (a.vote < b.vote ? 1 : -1));
  if (room.player[0].vote === 0) return 0;
  if (room.player[0].vote === room.player[1].vote) return 1;
  return room.player[0];
};

// vote killing
const voteKill = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  room.player.sort((a, b) => (a.vote < b.vote ? 1 : -1));
  if (room.player[0].vote === 0) return 0;
  if (room.player[0].vote === room.player[1].vote) return 1;
  room.player[0].isdead = true;
};

// voting reset
const resetVote = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  for (let i = 0; i < room.player?.length; i++) {
    room.player[i].vote = 0;
  }
};

const voteDone = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  room.voting = false;
};

const voteStart = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  room.voting = true;
};

// clear vote
const clearAllVote = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  for (let i = 0; i < room.player?.length; i++) {
    room.player[i].vote = 0;
    room.player[i].isvote = false;
  }
};

// clearAll
const clearAll = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  room.dead = [];
  room.seer = false;
  room.guardian = [];
  room.elixir = [];
  room.hunt = [];
  room.voting = false;
};

// clear all status player
const clearAllSTATUS = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  for (let i = 0; i < room.player?.length; i++) {
    room.player[i].effect = [];
  }
};

const skillOn = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  for (let i = 0; i < room.player?.length; i++) {
    room.player[i].status = false;
    room.player[i].addedEffect = false;
  }
};

const skillOff = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  for (let i = 0; i < room.player?.length; i++) {
    room.player[i].status = true;
  }
};

const playerHidup = (data) => {
  const hasil = data.player.filter((x) => x.isdead === false);
  return hasil?.length;
};

const playerMati = (data) => {
  const hasil = data.player.filter((x) => x.isdead === true);
  return hasil?.length;
};

// get player win
const getWinner = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  const werewolvesAlive = room.player.filter(
    (p) =>
      (p.role === "werewolf" && !p.isdead) ||
      (p.role === "traitor" && p.isTraitorActive && !p.isdead)
  );
  var ww = werewolvesAlive.length;
  var orang_baek = 0;
  for (let i = 0; i < room.player?.length; i++) {
    if (room.player[i].isdead === false) {
      if (
        room.player[i].role === "werewolf" ||
        room.player[i].role === "sorcerer"
      ) {
        ww += 1;
      } else if (
        room.player[i].role === "warga" ||
        room.player[i].role === "guardian" ||
        room.player[i].role === "seer"
      ) {
        orang_baek += 1;
      }
    }
  }
  if (room.voting) {
    b = voteResult(from, data);
    if (b != 0 && b != 1) {
      if (b.role === "werewolf" || b.role === "sorcerer") {
        ww -= 1;
      } else if (
        b.role === "warga" ||
        b.role === "seer" ||
        b.role === "guardian"
      ) {
        orang_baek -= 1;
      }
    }
  }

  let aliveHunters = room.player.filter(
    (p) => p.isdead === false && p.role === "hunter"
  ).length;
  if (ww === 1 && orang_baek === 0 && aliveHunters === 1) {
    room.iswin = true;
    return {
      voting: room.voting,
      status: true,
    };
  }
  if (ww === 0) {
    room.iswin = true;
    return {
      voting: room.voting,
      status: true,
    };
  } else if (ww === orang_baek) {
    room.iswin = false;
    return {
      voting: room.voting,
      status: false,
    };
  } else if (orang_baek === 0) {
    room.iswin = false;
    return {
      voting: room.voting,
      status: false,
    };
  } else {
    return {
      voting: room.voting,
      status: null,
    };
  }
};

// shorting
const shortPlayer = (from, data) => {
  room = sesi(from, data);
  if (!room) return false;
  room.player.sort((a, b) => a.number - b.number);
};

// werewolf killing
const killww = (from, id, data) => {
  room = sesi(from, data);
  let idHunted = room.player.findIndex(
    (a) => a.effect.includes("hunt") && a.role == "werewolf"
  );

  let isHunted = idHunted >= 0;
  if (!room) return false;
  for (let j = 0; j < room.dead?.length; j++) {
    idd = getPlayerById(from, room.player[0].id, room.dead[j], data);
    if (!idd) return false;
    if (room.player[idd.index].effect.includes("guardian")) return;

    room.player[isHunted ? idHunted : idd.index].isdead = true;
  }
};

const pagii = (data, data2) => {
  if (data?.dead?.length < 1) {
    return `*⌂ W E R E W O L F - G A M E*\n\nMentari telah terbit, tidak ada korban berjatuhan malam ini, warga kembali melakukan aktifitasnya seperti biasa.\n60 detik tersisa sebelum waktu penentuan, para warga dipersilahkan untuk berdiskusi\n*Hari ke ${data.day}*`;
  } else {
    a = "";
    d = "";
    _h = "";
    _el = "";
    e = [];
    f = [];
    h = [];
    el = [];
    const winner = getWinner(data.room, data2);
    for (let i = 0; i < data.dead?.length; i++) {
      b = data.player.findIndex((x) => x.number === data.dead[i]);
      if (data.player[b].effect.includes("guardian")) {
        e.push(data.player[b].id);
      } else if (data.player[b].effect.includes("hunt")) {
        h.push(data.player[b].id);
      } else {
        f.push(data.player[b].id);
      }
    }
    for (let i = 0; i < f?.length; i++) {
      if (i === f?.length - 1) {
        if (f?.length > 1) {
          a += ` dan @${f[i].replace("@s.whatsapp.net", "")}`;
        } else {
          a += `@${f[i].replace("@s.whatsapp.net", "")}`;
        }
      } else if (i === f?.length - 2) {
        a += `@${f[i].replace("@s.whatsapp.net", "")}`;
      } else {
        a += `@${f[i].replace("@s.whatsapp.net", "")}, `;
      }
    }
    for (let i = 0; i < e?.length; i++) {
      if (i === e?.length - 1) {
        if (e?.length > 1) {
          d += ` dan @${e[i].replace("@s.whatsapp.net", "")}`;
        } else {
          d += `@${e[i].replace("@s.whatsapp.net", "")}`;
        }
      } else if (i === e?.length - 2) {
        d += `@${e[i].replace("@s.whatsapp.net", "")}`;
      } else {
        d += `@${e[i].replace("@s.whatsapp.net", "")}, `;
      }
    }
    for (let i = 0; i < h?.length; i++) {
      if (i === h?.length - 1) {
        if (h?.length > 1) {
          _h += ` dan @${h[i].replace("@s.whatsapp.net", "")}`;
        } else {
          _h += `@${h[i].replace("@s.whatsapp.net", "")}`;
        }
      } else if (i === h?.length - 2) {
        _h += `@${h[i].replace("@s.whatsapp.net", "")}`;
      } else {
        _h += `@${h[i].replace("@s.whatsapp.net", "")}, `;
      }
    }
    for (let i = 0; i < el?.length; i++) {
      if (i === el?.length - 1) {
        if (el?.length > 1) {
          _el += ` dan @${el[i].replace("@s.whatsapp.net", "")}`;
        } else {
          _el += `@${el[i].replace("@s.whatsapp.net", "")}`;
        }
      } else if (i === el?.length - 2) {
        _el += `@${el[i].replace("@s.whatsapp.net", "")}`;
      } else {
        _el += `@${el[i].replace("@s.whatsapp.net", "")}, `;
      }
    }
    textnya = `*⌂ W E R E W O L F - G A M E*\n\nPagi telah tiba, warga desa menemukan ${
      data.dead?.length > 1 ? "beberapa" : "1"
    } mayat di tumpukan puing dan darah berceceran. ${
      a ? a + " telah mati! " : ""
    }${
      d?.length > 1
        ? ` ${d} hampir dibunuh, namun *Guardian Angel* berhasil melindunginya.`
        : ""
    }

    ${
      _el?.length > 1
        ? ` ${_el} hampir dibunuh, namun *Witch* berhasil melindunginya menggunakan elixir.`
        : ""
    }

${_h} adalah *Werewolf* yang berhasil dibunuh oleh *Hunter*.

${
  winner
    ? ""
    : "Tak terasa hari sudah siang, matahari tepat di atas kepala, terik panas matahari membuat suasana menjadi riuh, warga desa mempunyai 60 detik untuk berdiskusi"
}\n*Hari ke ${data.day}*`;
    return textnya;
  }
};

async function pagi(conn, x, data) {
  skillOff(x.room, data);
  let ment = [];
  for (let i = 0; i < x.player?.length; i++) {
    ment.push(x.player[i].id);
  }
  shortPlayer(x.room, data);
  killww(x.room, x.dead, data);
  shortPlayer(x.room, data);
  changeDay(x.room, data);
  if (!x.room) return;
  await conn.sendMessage(x.room, {
    text: `\`W E R E W O L F\`\n\n${pagii(x, data)}`,
  });

  checkTraitorActivation(x, conn);
}

async function voting(conn, x, data) {
  //vote informasi
  let row = [];
  let ment = [];
  if (!x?.player?.length) return;
  voteStart(x.room, data);
  textnya =
    "*⌂ W E R E W O L F - G A M E*\n\nSenja telah tiba. Seluruh warga berkumpul di balai desa untuk memilih siapa yang akan dieksekusi. Sebagian warga terlihat sibuk menyiapkan alat penyiksaan untuk malam ini. Kalian mempunyai waktu selama 60 detik untuk memilih! Hati-hati, ada penghianat diantara kalian!\n\n*L I S T - P L A Y E R*:\n";
  shortPlayer(x.room, data);

  let sect = [];
  for (let ii = 0; ii < x?.player?.length; ii++) {
    if (x.player[ii].isdead === true) continue;
    sect.push(`Vote Player ${x.player[ii].number}`);
  }

  for (let i = 0; i < x?.player?.length; i++) {
    textnya += `(${x.player[i].number}) @${x.player[i].id.replace(
      "@s.whatsapp.net",
      ""
    )} ${x.player[i].isdead === true ? `☠️ ${x.player[i].role}` : ""}\n`;
  }

  let svote = x.player.filter((i) => i.role !== "werewolf");

  dayVoting(x.room, data);
  clearAll(x.room, data);
  clearAllSTATUS(x.room, data);
  if (!x.room) return;
  await conn.sendMessage(x.room, {
    text: textnya,
    mentions: textnya.extractMentions(),
  });
  return conn.sendMessage(x.room, {
    poll: {
      name: "`*W E R E W O L F*`",
      values: sect,
    },
  });
}
async function votingMayor(conn, x, data) {
  if (!x?.player?.length) return;
  x.mayorStatus = "voting";
  let textnya =
    "*⌂ W E R E W O L F - PEMILIHAN MAYOR*\n\nSebelum permainan dimulai, silakan pilih satu pemain yang akan menjadi Mayor!\nGunakan *.ww voteMayor nomor* atau pilih di polling berikut.\n\n*LIST PLAYER:*\n";
  let sect = [];
  for (let i = 0; i < x.player.length; i++) {
    textnya += `(${x.player[i].number}) @${x.player[i].id.replace(
      "@s.whatsapp.net",
      ""
    )}\n`;
    sect.push(`Vote Mayor Player ${x.player[i].number}`);
  }
  await conn.sendMessage(x.room, {
    text: textnya,
    mentions: textnya.extractMentions(),
  });
  let { key } = await conn.sendMessage(x.room, {
    poll: {
      name: "`*PILIH MAYOR*`",
      values: sect,
    },
  });
  x.mayorPollKey = key;

  setTimeout(async () => {
    await conn.sendMessage(x.room, {
      delete: key,
      participant: conn.user.id.replace(/:\d+/, ""),
    });
  }, 60000);
}

async function sendHasilVoteMayor(conn, x) {
  let text = "`📋 HASIL VOTE MAYOR`\n\n*LIST PLAYER:*\n";
  // x.mayorVotes: { senderId: idx }
  let count = {};

  for (let i = 0; i < x.player.length; i++) {
    text += `(${x.player[i].number}) @${x.player[i].id.replace(
      "@s.whatsapp.net",
      ""
    )}\n`;
  }

  text += "\n*DETAIL VOTE:*\n";
  for (let sender in x.mayorVotes) {
    let idx = x.mayorVotes[sender];
    let player = x.player[idx];
    if (!player) continue;
    count[idx] = (count[idx] || 0) + 1;
    text += `@${sender.replace("@s.whatsapp.net", "")} memilih (${
      player.number
    }) @${player.id.replace("@s.whatsapp.net", "")}\n`;
  }
  if (Object.keys(x.mayorVotes).length === 0) {
    text += "_Belum ada yang memilih mayor._\n";
  } else {
    const sortedResult = Object.entries(count).sort((a, b) => b[1] - a[1]);
    text += "\n*REKAP VOTE:*\n";
    for (const [idx, total] of sortedResult) {
      const player = x.player[Number(idx)];
      if (!player) continue;
      text += `(${player.number}) @${player.id.replace(
        "@s.whatsapp.net",
        ""
      )} : *${total} vote*\n`;
    }
  }
  await conn.sendMessage(x.room, {
    text,
    mentions: x.player.map((a) => a.id),
  });
}
async function sendHasilVote(conn, x) {
  let text = "`📋HASIL VOTE`\n";
  for (let i of x.player) {
    text += `👤Player  *${i.number}* 
     - ${
       i.vote > 0
         ? `memvoting player \`${i.vote}\``
         : "_tidak melakukan voting_"
     }\n`;
  }
  if (!x.room) return;

  return conn.sendMessage(x.room, {
    text,
    mentions: x.player.map((a) => a.id),
  });
}

async function malam(conn, x, data) {
  var hasil_vote = voteResult(x.room, data);
  if (!x.room) return;
  if (hasil_vote === 0) {
    textnya = `*⌂ W E R E W O L F - G A M E*\n\nTerlalu bimbang menentukan pilihan. Warga pun pulang ke rumah masing-masing, tidak ada yang dieksekusi hari ini. Bulan bersinar terang, malam yang mencekam telah datang. Semoga tidak ada yang mati malam ini. Pemain malam hari: kalian punya 60 detik untuk beraksi!`;
    await sendHasilVote(conn, x);
    await sleep(5000);
    return conn
      .sendMessage(x.room, { text: `\`W E R E W O L F\`\n\n${textnya}` })
      .then(() => {
        changeDay(x.room, data);
        voteDone(x.room, data);
        resetVote(x.room, data);
        clearAllVote(x.room, data);
        if (getWinner(x.room, data).status != null)
          return win(x, 1, conn, data);
      });
  } else if (hasil_vote === 1) {
    await sendHasilVote(conn, x);
    await sleep(5000);
    textnya = `*⌂ W E R E W O L F - G A M E*\n\nWarga desa telah memilih, namun hasilnya seri.\n\nBintang memancarkan cahaya indah malam ini, warga desa beristirahat di kediaman masing masing. Pemain malam hari: kalian punya 60 detik untuk beraksi!`;
    return conn
      .sendMessage(x.room, { text: `\`W E R E W O L F\`\n\n${textnya}` })
      .then(() => {
        changeDay(x.room, data);
        voteDone(x.room, data);
        resetVote(x.room, data);
        clearAllVote(x.room, data);
        if (getWinner(x.room, data).status != null)
          return win(x, 1, conn, data);
      });
  } else if (hasil_vote != 0 && hasil_vote != 1) {
    await sendHasilVote(conn, x);
    await sleep(5000);
    if (hasil_vote.role === "werewolf") {
      textnya = `*⌂ W E R E W O L F - G A M E*\n\nWarga desa telah memilih dan sepakat @${hasil_vote.id.replace(
        "@s.whatsapp.net",
        ""
      )} dieksekusi mati.\n\n@${hasil_vote.id.replace(
        "@s.whatsapp.net",
        ""
      )} adalah ${hasil_vote.role} ${emoji_role(hasil_vote.role)}`;
      voteKill(x.room, data);

      checkTraitorActivation(x, conn);

      let ment = [];
      ment.push(hasil_vote.id);
      return await conn
        .sendMessage(x.room, { text: `\`W E R E W O L F\`\n\n${textnya}` })
        .then(() => {
          changeDay(x.room, data);
          voteDone(x.room, data);
          resetVote(x.room, data);
          clearAllVote(x.room, data);
          if (getWinner(x.room, data).status != null)
            return win(x, 1, conn, data);
        });
    } else {
      await sendHasilVote(conn, x);
      await sleep(5000);
      textnya = `*⌂ W E R E W O L F - G A M E*\n\nWarga desa telah memilih dan sepakat @${hasil_vote.id.replace(
        "@s.whatsapp.net",
        ""
      )} dieksekusi mati.\n\n@${hasil_vote.id.replace(
        "@s.whatsapp.net",
        ""
      )} adalah ${hasil_vote.role} ${emoji_role(
        hasil_vote.role
      )}\n\nBulan bersinar terang malam ini, warga desa beristirahat di kediaman masing masing. Pemain malam hari: kalian punya 60 detik untuk beraksi!`;
      voteKill(x.room, data);
      checkTraitorActivation(x, conn);
      let ment = [];
      ment.push(hasil_vote.id);
      return await conn
        .sendMessage(x.room, { text: `\`W E R E W O L F\`\n\n${textnya}` })
        .then(() => {
          changeDay(x.room, data);
          voteDone(x.room, data);
          resetVote(x.room, data);
          clearAllVote(x.room, data);
          if (getWinner(x.room, data).status != null)
            return win(x, 1, conn, data);
        });
    }
  }
}

async function skill(conn, x, data) {
  skillOn(x.room, data);
  if (getWinner(x.room, data).status != null || x.win != null) {
    return win(x, 1, conn, data);
  } else {
    if (!x) return;
    if (!x.player) return;
    if (x.win != null) return;
    let tok1 = "\n";
    let tok2 = "\n";
    let membernya = [];
    shortPlayer(x.room, data);
    for (let i = 0; i < x?.player?.length; i++) {
      tok1 += `(${x.player[i].number}) @${x.player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )}${x.player[i].isdead === true ? " ☠️" : ""}\n`;
      membernya.push(x.player[i].id);
    }
    for (let i = 0; i < x?.player?.length; i++) {
      tok2 += `(${x.player[i].number}) @${x.player[i].id.replace(
        "@s.whatsapp.net",
        ""
      )} ${
        x.player[i].role === "werewolf" || x.player[i].role === "sorcerer"
          ? `${x.player[i].isdead === true ? ` ☠️` : ` ${x.player[i].role}`}`
          : " "
      }\n`;
      membernya.push(x.player[i].id);
    }
    for (let i = 0; i < x?.player?.length; i++) {
      if (x.player[i].role === "werewolf") {
        if (x.player[i].isdead != true) {
          textnya = `Silahkan pilih salah satu orang yang ingin kamu makan pada malam hari ini\n*LIST PLAYER*:\n${tok2}\n\nKetik *.wwpc kill nomor* untuk membunuh player`;

          let sect = [];
          for (let ii = 0; ii < x?.player?.length; ii++) {
            if (x.player[ii].isdead === true) continue;
            sect.push(`Kill Player ${x.player[ii].number}`);
          }
          await conn.sendMessage(x.player[i].id, {
            text: textnya,
            mentions: textnya.extractMentions(),
          });
          let { key } = await conn.sendMessage(x.player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = conn.werewolf[x.room].player;
          conn.werewolf[x.room].player = dataPlayer.map((a) => {
            if (a.id == x.player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            conn.sendMessage(x.player[i].id, {
              delete: key,
              participant: conn.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
      } else if (x.player[i].role === "warga") {
        if (x.player[i].isdead != true) {
          textnya = `*⌂ W E R E W O L F - G A M E*\n\nSebagai seorang warga berhati-hatilah, mungkin kamu adalah target selanjutnya.\n*LIST PLAYER*:${tok1}`;

          await conn.sendMessage(x.player[i].id, {
            text: textnya,
            mentions: membernya,
          });
        }
      } else if (x.player[i].role === "seer") {
        if (x.player[i].isdead != true) {
          textnya = `Baiklah, siapa yang ingin kamu lihat peran nya kali ini.\n*LIST PLAYER*:${tok1}\n\nKetik *.wwpc dreamy nomor* untuk melihat role player`;

          let sect = [];
          for (let ii = 0; ii < x?.player?.length; ii++) {
            if (x.player[ii].isdead === true) continue;
            sect.push(`Dreamy Player ${x.player[ii].number}`);
          }
          await conn.sendMessage(x.player[i].id, {
            text: textnya,
            mentions: textnya.extractMentions(),
          });
          let { key } = await conn.sendMessage(x.player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = conn.werewolf[x.room].player;
          conn.werewolf[x.room].player = dataPlayer.map((a) => {
            if (a.id == x.player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            conn.sendMessage(x.player[i].id, {
              delete: key,
              participant: conn.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
      } else if (x.player[i].role === "guardian") {
        if (x.player[i].isdead != true) {
          textnya = `Kamu adalah seorang*Guardian*, lindungi para warga, silahkan pilih salah 1 player yang ingin kamu lindungi\n*LIST PLAYER*:${tok1}\n\nKetik *.deffense player nomor* untuk melindungi player`;

          let sect = [];
          for (let ii = 0; ii < x?.player?.length; ii++) {
            if (x.player[ii].isdead === true) continue;
            sect.push(`Deffense Player ${x.player[ii].number}`);
          }
          await conn.sendMessage(x.player[i].id, {
            text: textnya,
            mentions: textnya.extractMentions(),
          });
          let { key } = await conn.sendMessage(x.player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = conn.werewolf[x.room].player;
          conn.werewolf[x.room].player = dataPlayer.map((a) => {
            if (a.id == x.player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            conn.sendMessage(x.player[i].id, {
              delete: key,
              participant: conn.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
      } else if (x.player[i].role === "sorcerer") {
        if (x.player[i].isdead != true) {
          textnya = `Baiklah, lihat apa yang bisa kamu buat, silakan pilih 1 orang yang ingin kamu buka identitasnya\n*LIST PLAYER*:${tok2}\n\nKetik *.wwpc sorcerer nomor* untuk melihat role player`;

          let sect = [];
          for (let ii = 0; ii < x?.player?.length; ii++) {
            if (x.player[ii].isdead === true) continue;
            sect.push(`Sorcerer Player ${x.player[ii].number}`);
          }
          await conn.sendMessage(x.player[i].id, {
            text: textnya,
            mentions: textnya.extractMentions(),
          });
          let { key } = await conn.sendMessage(x.player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = conn.werewolf[x.room].player;
          conn.werewolf[x.room].player = dataPlayer.map((a) => {
            if (a.id == x.player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            conn.sendMessage(x.player[i].id, {
              delete: key,
              participant: conn.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
      } else if (x.player[i].role === "hunter") {
        if (x.player[i].isdead != true) {
          textnya = `Kamu adalah seorang *Hunter*, curigai salah satu orang sebagai werewolf!\n*LIST PLAYER*:${tok1}\n\nKetik *.hunt player nomor* untuk mencurigai player`;

          let sect = [];
          for (let ii = 0; ii < x?.player?.length; ii++) {
            if (x.player[ii].isdead === true) continue;
            sect.push(`Hunt Player ${x.player[ii].number}`);
          }
          await conn.sendMessage(x.player[i].id, {
            text: textnya,
            mentions: textnya.extractMentions(),
          });
          let { key } = await conn.sendMessage(x.player[i].id, {
            poll: {
              name: "`*W E R E W O L F*`",
              values: sect,
            },
          });

          let dataPlayer = conn.werewolf[x.room].player;
          conn.werewolf[x.room].player = dataPlayer.map((a) => {
            if (a.id == x.player[i].id) {
              a.key = key;
            }
            return a;
          });
          setTimeout(() => {
            conn.sendMessage(x.player[i].id, {
              delete: key,
              participant: conn.user.id.replace(/:\d+/, ""),
            });
          }, 60000);
        }
      }
    }
  }
}

async function win(x, t, conn, data) {
  if (!x.room) return;
  const sesinya = x.room;
  if (getWinner(x.room, data).status === false || x.iswin === false) {
    textnya = `*W E R E W O L F - W I N*\n\nTEAM WEREWOLF\n\n`;
    let ment = [];
    for (let i = 0; i < x?.player?.length; i++) {
      if (x.player[i].role === "sorcerer" || x.player[i].role === "werewolf") {
        textnya += `${x.player[i].number}) @${x.player[i].id.replace(
          "@s.whatsapp.net",
          ""
        )}\n     *Role* : ${x.player[i].role}\n\n`;
        ment.push(x.player[i].id);
      }
    }
    return await conn
      .sendMessage(x.room, { text: `\`W E R E W O L F\`\n\n${textnya}` })
      .then(() => {
        delete data[x.room];
      });
  } else if (getWinner(x.room, data).status === true) {
    textnya = `*T E A M - W A R G A - W I N*\n\nTEAM WARGA\n\n`;
    let ment = [];
    for (let i = 0; i < x?.player?.length; i++) {
      if (
        x.player[i].role === "warga" ||
        x.player[i].role === "guardian" ||
        x.player[i].role === "seer"
      ) {
        textnya += `${x.player[i].number}) @${x.player[i].id.replace(
          "@s.whatsapp.net",
          ""
        )}\n     *Role* : ${x.player[i].role}\n\n`;
        ment.push(x.player[i].id);
      }
    }
    return await conn
      .sendMessage(x.room, { text: `\`W E R E W O L F\`\n\n${textnya}` })
      .then(() => {
        delete data[x.room];
      });
  }
}

// playing
async function run(conn, id, data) {
  while (getWinner(id, data).status === null) {
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await pagi(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await voting(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await malam(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await skill(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) break;
  }
  await win(sesi(id, data), 1, conn, data);
}

async function run_vote(conn, id, data) {
  while (getWinner(id, data).status === null) {
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await voting(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await malam(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await skill(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await pagi(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) break;
  }
  await win(sesi(id, data), 1, conn, data);
}

async function run_malam(conn, id, data) {
  while (getWinner(id, data).status === null) {
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await skill(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await pagi(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await voting(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await malam(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) break;
  }
  await win(sesi(id, data), 1, conn, data);
}

async function run_pagi(conn, id, data) {
  while (getWinner(id, data).status === null) {
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await pagi(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await voting(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await malam(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await skill(conn, sesi(id, data), data);
    }
    if (getWinner(id, data).status != null) {
      win(getWinner(id, data), 1, conn, data);
      break;
    } else {
      await sleep(60000);
    }
    if (getWinner(id, data).status != null) break;
  }
  await win(sesi(id, data), 1, conn, data);
}

export {
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
  unKillWerewolf,
  killww,
  dreamySeer,
  sorcerer,
  protectGuardian,
  unProtectGuardian,
  hunt,
  unHunt,
  elixir,
  roleShuffle,
  roleChanger,
  roleAmount,
  roleGenerator,
  addTimer,
  startGame,
  playerHidup,
  playerMati,
  vote,
  sendHasilVoteMayor,
  votingMayor,
  voteResult,
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
  checkTraitorActivation,
};
