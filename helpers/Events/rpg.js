/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const path = 'path'.import();

export default async function on({ cht, ev, Exp }) {
  const { id, sender } = cht;
  const { func } = Exp;
  const { archiveMemories: memories, inventory } = func;
  let inv = inventory.get(sender);
  const user = cht.memories;

  let { berburu, mancing, miningItems, hargaAwal } =
    func.inventory.initCfg().rpg;

  ev.on(
    {
      cmd: ['daftar', 'register'],
      tag: 'RPG',
      listmenu: ['daftar', 'register'],
    },
    async () => {
      try {
        const input = (cht.q || '').trim();
        const invData = await inventory.get(sender);
        if (invData && invData.sn) {
          const namaExist = invData.nama || 'Tidak diketahui';
          const umurExist = invData.umur || 'Tidak diketahui';
          const snExist = invData.sn;

          return cht.reply(
            `❗ Kamu sudah Terdaftar\n\n` +
              `╭━━━━━━━━━━━━┈ ❋ཻུ۪۪⸙\n` +
              `│ *Nama* : *${namaExist}*\n` +
              `│ *Umur* : *${umurExist}* Tahun\n` +
              `│ *Nomor* : *${sender.split('@')[0]}*\n` +
              `│ *Nomor SN* : *${snExist}*\n` +
              `╰━━━━━━━━━━━━┈ ❋ཻུ۪۪⸙`
          );
        }

        const parts = input.split(/[|,./#$&\s]+/).filter(Boolean);
        if (parts.length < 2) {
          return cht.reply(
            `❌ Gunakan format: .daftar Nama Umur\nContoh: .daftar Lilia Yukine 17`
          );
        }

        const umur = parseInt(parts.pop());
        const nama = parts.join(' ').trim();

        if (isNaN(umur)) return cht.reply(`❌ Umur harus berupa angka.`);
        if (umur < 8)
          return cht.reply(`❌ Umur kamu terlalu muda untuk mendaftar.`);
        if (umur > 50)
          return cht.reply(`❌ Umur kamu terlalu tua untuk mendaftar.`);

        const sn = await func.generateSN();
        await memories.add(sender);
        await memories.setItem(sender, 'nama', nama);
        await memories.setItem(sender, 'umur', umur);
        await memories.setItem(sender, 'sn', sn);

        await inventory.setItem(sender, 'nama', nama);
        await inventory.setItem(sender, 'umur', umur);
        await inventory.setItem(sender, 'sn', sn);
        return cht.reply(
          `╭━━━━━━━━━━━━┈ ❋ཻུ۪۪⸙\n` +
            `│ *「 VERIFIKASI BERHASIL 」*\n` +
            `│ Kamu berhasil terdaftar!\n` +
            `╰┬────────────┈ ⳹\n` +
            `┌┤◦➛ *Nama* : *${nama}*\n` +
            `││◦➛ *Umur* : *${umur}* Tahun\n` +
            `││◦➛ *Nomor* : *${sender.split('@')[0]}*\n` +
            `││◦➛ *Nomor SN* : *${sn}*\n` +
            `╰━━━━━━━━━━━━┈ ❋ཻུ۪۪⸙`
        );
      } catch (err) {
        console.error('Error di .daftar:', err);
        return cht.reply('❌ Terjadi kesalahan saat pendaftaran.');
      }
    }
  );

  ev.on(
    {
      cmd: ['ceksn'],
      listmenu: ['ceksn'],
      tag: 'RPG',
    },
    async () => {
      const user = Data.inventories[sender];
      if (!user || !user.sn) {
        return cht.reply(
          `❌ Kamu belum punya SN. Silakan daftar dulu dengan .daftar`,
          { replyAi: false }
        );
      }
      return cht.reply(`🔑 SN Kamu: *${user.sn}*\nJaga baik-baik SN ini!`);
    }
  );

  ev.on({ cmd: ['unreg'], tag: 'RPG' }, async () => {
    try {
      const userInv = await inventory.get(sender);
      const userGlobal = Data.users?.[sender.split('@')[0]];

      if (!userInv || !userInv.sn) {
        return cht.reply(
          `kamu belum terdaftar.\nGunakan perintah *.daftar Nama Umur* untuk mendaftar.`
        );
      }

      const inputSN = (cht.q || '').trim();
      if (!inputSN) {
        return cht.reply(`SN belum dimasukkan.\nContoh: .unreg ${userInv.sn}`);
      }
      if (inputSN !== userInv.sn) {
        return cht.reply(
          `nomor SN tidak cocok!\nGunakan SN yang benar: *${userInv.sn}*`
        );
      }

      const nama = userInv.nama || userGlobal?.name || 'Tidak diketahui';
      const sn = userInv.sn;
      delete Data.inventories[sender];
      const key = sender.split('@')[0];
      if (Data.users?.[key]) delete Data.users[key];

      return cht.reply(
        `╭━━━━━━━━━━━━┈ ❋ཻུ۪۪⸙\n` +
          `│ *「 DATA DIHAPUS 」*\n` +
          `│ Data kamu telah dihapus dari Database!\n` +
          `│\n` +
          `│◦➛ *Nama* : *${nama}*\n` +
          `│◦➛ *Nomor SN* : *${sn}*\n` +
          `│\n` +
          `│ Gunakan *.daftar Nama Umur* untuk mendaftar kembali.\n` +
          `╰━━━━━━━━━━━━┈ ❋ཻུ۪۪⸙`
      );
    } catch (err) {
      console.error('Error di .unreg:', err);
      return cht.reply(`❌ Terjadi kesalahan saat menghapus akun.`);
    }
  });
  ///////////

  ev.on(
    {
      cmd: ['shop'],
      listmenu: ['shop'],
      tag: 'RPG',
    },
    async () => {
      try {
        const lines = [];
        const now = Date.now();

        lines.push(`🏦 *Toko RPG — Shop Menu*\n`);
        lines.push(
          `Perintah:\n.buy / .beli <item> <jumlah>\n.sell / .jual <item> <jumlah>\n.shop untuk melihat semua daftar\n`
        );

        lines.push(`╔═══════『 𝐇𝐚𝐫𝐠𝐚 𝐁𝐞𝐥𝐢 』═══════╗`);

        for (const item in Data.ShopRPG.buy) {
          let harga = Data.ShopRPG.buy[item];
          if (!harga) continue;

          const d = Data.ShopRPG.diskon?.[item];
          let line = `║ ${item} = `;

          let diskonAktif = false;

          if (d) {
            const expired = d.expired ?? 0;
            const sisa = d.jumlah ?? null;
            const potongan = d.potongan ?? 0;

            diskonAktif =
              (expired === 0 || expired > now) && (sisa === null || sisa > 0);

            if (
              (expired > 0 && expired <= now) ||
              (sisa !== null && sisa <= 0)
            ) {
              delete Data.ShopRPG.diskon[item];
            }

            if (diskonAktif) {
              const hargaDiskon = Math.max(1, harga - potongan);
              const persenDiskon = Math.round(
                100 - (hargaDiskon / harga) * 100
              );

              let waktuStr =
                expired === 0
                  ? 'Permanent'
                  : (() => {
                      const dur = func.formatDuration(expired - now);
                      return `${dur.hours}j ${dur.minutes}m`;
                    })();

              let sisaStr = sisa === null ? '∞' : sisa;

              line += `~${harga}~ ➯ *${hargaDiskon}* (-${persenDiskon}% | ${sisaStr} | ${waktuStr})`;
              lines.push(line);
              continue;
            }
          }

          line += `*${harga}*`;
          lines.push(line);
        }

        lines.push(`╚════════════════════════╝\n`);

        lines.push(`╔═══════『 𝐇𝐚𝐫𝐠𝐚 𝐉𝐮𝐚𝐥 』═══════╗`);

        for (const item in Data.ShopRPG.sell) {
          let harga = Data.ShopRPG.sell[item];
          if (!harga) continue;

          lines.push(`║ ${item} = *${harga}*`);
        }

        lines.push(`╚════════════════════════╝`);

        return Exp.sendMessage(
          cht.id,
          { text: lines.join('\n') },
          { quoted: cht }
        );
      } catch (e) {
        console.error('❌ Error di .shop:', e);
        return cht.reply('Terjadi error saat menampilkan shop.');
      }
    }
  );
  ev.on(
    {
      cmd: ['buy', 'beli', 'sell', 'jual'],
      listmenu: ['buy', 'beli', 'sell', 'jual'],
      tag: 'RPG',
    },
    async () => {
      if (!cht.q) {
        let now = Date.now();

        let shopBuy = Object.entries(Data.ShopRPG.buy)
          .map(([item, base]) => {
            let d = Data.ShopRPG.diskon?.[item];

            if (!d) return `• ${item} — ${base} coins`;

            let expired = Number(d.expired ?? 0);
            let sisa = d.jumlah != null ? Number(d.jumlah) : null;
            let potongan = Number(d.potongan ?? 0);

            let aktif =
              (expired === 0 || expired > now) && (sisa === null || sisa > 0);

            if (!aktif) return `• ${item} — ${base} coins`;

            let diskon = Math.max(1, base - potongan);
            let persen = Math.round(100 - (diskon / base) * 100);

            return `• ${item} — ~${base}~ → *${diskon}* coins (-${persen}%)`;
          })
          .join('\n');

        let shopSell = Object.entries(Data.ShopRPG.sell)
          .map(([k, v]) => `• ${k} — ${v} coins`)
          .join('\n');

        return cht.reply(
          `🛒 *SHOP RPG — BELI & JUAL*\n\n` +
            `✨ Cara pakai:\n` +
            `• .buy potion 3\n` +
            `• .sell diamond 2\n` +
            `• .buy iron all\n\n` +
            `📥 Bisa dibeli:\n${shopBuy}\n\n` +
            `📤 Bisa dijual:\n${shopSell}\n\n` +
            `Gunakan angka atau "all" ✨`
        );
      }

      const [itemRaw, jumlahRaw] = (cht.q || '').trim().split(/[\s|.,]+/);
      const jumlahStr = jumlahRaw?.toLowerCase();
      const item = itemRaw?.toLowerCase();

      if (!item) return cht.reply(`Contoh: .${cht.cmd} potion 2`);

      const isBuy = ['buy', 'beli'].includes(cht.cmd);

      const hargaNormal = isBuy
        ? Data.ShopRPG.buy[item]
        : Data.ShopRPG.sell[item];

      if (!hargaNormal)
        return cht.reply(
          `⚠️ Item *"${item}"* tidak tersedia untuk di${
            isBuy ? 'beli' : 'jual'
          }.`
        );

      let user = (await func.archiveMemories.get(cht.sender)) || {};
      let inv = (await func.inventory.get(cht.sender)) || {};

      user.coins ??= 0;
      user.flow ??= 0;
      user.energy ??= 0;

      const isUserItem = ['coins', 'flow', 'energy'].includes(item);
      if (!isUserItem) inv[item] ??= 0;

      let jumlah;
      if (jumlahStr === 'all') {
        jumlah = isBuy
          ? Math.floor(user.coins / hargaNormal)
          : isUserItem
            ? user[item]
            : inv[item];
      } else jumlah = Math.max(1, parseInt(jumlahStr) || 1);

      if (jumlah < 1)
        return cht.reply(
          `Jumlah ${isBuy ? 'pembelian' : 'penjualan'} tidak valid.`
        );
      if (isBuy) {
        let total = 0;
        let diskonInfo = '';

        let diskon = Data.ShopRPG.diskon?.[item];

        let sisa =
          diskon && typeof diskon.jumlah === 'number' ? diskon.jumlah : null;

        let expired = diskon?.expired ?? 0;
        let potongan = diskon?.potongan ?? 0;

        for (let i = 0; i < jumlah; i++) {
          let aktif =
            diskon &&
            (expired === 0 || expired > Date.now()) &&
            (sisa === null || sisa > 0);

          let hargaItem = aktif
            ? Math.max(1, hargaNormal - potongan)
            : hargaNormal;

          total += hargaItem;

          if (aktif && sisa !== null) sisa--;
        }

        if (user.coins < total)
          return cht.reply(
            `💸 Coins kamu kurang.\nCoins: *${user.coins}*\nTotal harga: *${total}*`
          );

        user.coins -= total;

        if (isUserItem) {
          user[item] += jumlah;
          await func.archiveMemories.setItem(cht.sender, item, user[item]);
        } else {
          inv[item] += jumlah;
          await func.inventory.setItem(cht.sender, item, inv[item]);
        }

        Data.ShopRPG.statistik ??= {};
        Data.ShopRPG.statistik[item] ??= { beli: 0, jual: 0 };
        Data.ShopRPG.statistik[item].beli += jumlah;

        await func.archiveMemories.setItem(cht.sender, 'coins', user.coins);

        if (diskon) {
          if (sisa !== null && sisa <= 0) delete Data.ShopRPG.diskon[item];
          else Data.ShopRPG.diskon[item].jumlah = sisa;
        }

        if (diskon)
          diskonInfo = `\n🎁 Diskon aktif\nPotongan: *${potongan} coins*\nSisa kuota: *${sisa ?? '∞'}*`;

        return cht.reply(
          `✨ *Pembelian Berhasil!*\n\n` +
            `🛒 Item: *${item}*\n` +
            `📦 Jumlah: *${jumlah}*\n` +
            `💰 Total: *${total} coins*\n\n` +
            `Coins sekarang: *${user.coins}*\n` +
            `Stok: *${isUserItem ? user[item] : inv[item]}* ${item}\n` +
            diskonInfo +
            `\n\nSelamat ya~ (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧`
        );
      }

      const stok = isUserItem ? user[item] : inv[item];

      if (stok < jumlah)
        return cht.reply(
          `⚠️ Stok kamu kurang.\nPunya: *${stok}* ${item}\nButuh: *${jumlah}*`
        );

      const total = hargaNormal * jumlah;

      if (isUserItem) {
        user[item] -= jumlah;
        await func.archiveMemories.setItem(cht.sender, item, user[item]);
      } else {
        inv[item] -= jumlah;
        await func.inventory.setItem(cht.sender, item, inv[item]);
      }

      user.coins += total;

      Data.ShopRPG.statistik ??= {};
      Data.ShopRPG.statistik[item] ??= { beli: 0, jual: 0 };
      Data.ShopRPG.statistik[item].jual += jumlah;

      await func.archiveMemories.setItem(cht.sender, 'coins', user.coins);

      return cht.reply(
        `💵 *Penjualan Berhasil!*\n\n` +
          `📤 Item: *${item}*\n` +
          `📦 Jumlah: *${jumlah}*\n` +
          `💰 Diterima: *${total} coins*\n\n` +
          `Coins sekarang: *${user.coins}*\n` +
          `Sisa stok: *${isUserItem ? user[item] : inv[item]}* ${item}\n\n` +
          `Lumayan kan~ ʕ⁠っ⁠•⁠ᴥ⁠•⁠ʔ⁠っ`
      );
    }
  );

  ev.on(
    {
      cmd: ['upgrade'],
      listmenu: ['upgrade'],
      tag: 'RPG',
      args: `Upgrade item atau energy kamu.

Contoh:
.upgrade pickaxe

Biaya:
- Item (pickaxe, ax, sword, fishing_hook, armor): coins, mulai dari 27.750 naik 80% tiap level.
- Energy: 1 flow → +100 maxCharge & +200 premium.maxCharge
- RateCharge: 1 flow → -1 Hours Waktu pengisian energy`,
    },
    async () => {
      const sender = cht.sender;
      const target = cht.q?.toLowerCase();

      if (!target)
        return cht.reply('Contoh: *.upgrade pickaxe* atau *.upgrade energy*');

      // === GET DATA USER DAN INVENTORIES ===
      let user = await func.archiveMemories.get(sender);
      let inv = await func.inventory.get(sender);

      if (target === 'energy') {
        const flow = user.flow || 0;
        if (flow < 1)
          return cht.reply(
            `Flow kamu tidak cukup.\nDibutuhkan: 1 flow\nFlow kamu: ${flow}`
          );

        const maxCharge = user.maxCharge || 200;
        const premiumMaxCharge = user.premium?.maxCharge || 1000;
        const newMax = maxCharge + 100;
        const newPrem = premiumMaxCharge + 200;
        user.flow = flow - 1;
        user.maxCharge = newMax;
        user.premium.maxCharge = newPrem;

        await func.archiveMemories.setItem(sender, 'flow', user.flow);
        await func.archiveMemories.setItem(sender, 'maxCharge', newMax);
        await func.archiveMemories.setItem(
          sender,
          'premium.maxCharge',
          newPrem
        );

        return Exp.sendMessage(
          cht.id,
          {
            text:
              `✅ Upgrade Energy Berhasil!\n\n` +
              `• Max Charge (Free): ${maxCharge} ➜ ${newMax}\n` +
              `• Max Charge (Premium): ${premiumMaxCharge} ➜ ${newPrem}\n` +
              `• Flow dikurangi 1 (sisa: ${user.flow})`,
          },
          { quoted: cht }
        );
      }

      if (target === 'ratecharge') {
        const flow = user.flow || 0;
        if (flow < 1)
          return cht.reply(
            `Flow kamu tidak cukup.\nDibutuhkan: 1 flow\nFlow kamu: ${flow}`
          );

        const maxCharge = user.maxCharge || 200;
        const premiumMaxCharge = user.premium?.maxCharge || 1000;
        const speed = user.chargingSpeed || 1000;
        let currentTime = (maxCharge / user.chargeRate) * (speed / 1000 / 3600);
        let currentTimePrem =
          (premiumMaxCharge / user.premium.chargeRate) * (speed / 1000 / 3600);
        let newTime = Math.max(1, currentTime - 1);
        let newTimePrem = Math.max(1, currentTimePrem - 1);
        let newRate = (maxCharge / (newTime * 3600)) * (1000 / speed);
        let newRatePrem =
          (premiumMaxCharge / (newTimePrem * 3600)) * (1000 / speed);

        user.flow = flow - 1;
        user.chargeRate = newRate;
        user.premium.chargeRate = newRatePrem;

        await func.archiveMemories.setItem(sender, 'flow', user.flow);
        await func.archiveMemories.setItem(sender, 'chargeRate', newRate);
        await func.archiveMemories.setItem(
          sender,
          'premium.chargeRate',
          newRatePrem
        );

        return Exp.sendMessage(
          cht.id,
          {
            text:
              `✅ Upgrade RateCharge Berhasil!\n\n` +
              `• Free: ${currentTime.toFixed(1)} jam ➜ ${newTime.toFixed(1)} jam (Rate: ${user.chargeRate.toFixed(6)})\n` +
              `• Premium: ${currentTimePrem.toFixed(1)} jam ➜ ${newTimePrem.toFixed(1)} jam (Rate: ${user.premium.chargeRate.toFixed(6)})\n` +
              `• Flow dikurangi 1 (sisa: ${user.flow})`,
          },
          { quoted: cht }
        );
      }

      const allowedItems = ['pickaxe', 'sword', 'ax', 'fishing_hook', 'armor'];
      if (!allowedItems.includes(target))
        return cht.reply(
          'Item tidak bisa di-upgrade. Gunakan: pickaxe, sword, ax, fishing_hook, armor'
        );

      const itemData = inv.item?.[target];
      if (!itemData) return cht.reply(`Kamu belum memiliki *${target}*.`);

      let level = itemData.level || itemData.ketahanan || 1;
      let nextLevel = level + 1;

      const cost = Math.floor(27750 * Math.pow(1.8, level - 1));
      const coins = user.coins || 0;

      if (coins < cost) {
        return cht.reply(
          `Coins kamu tidak cukup.\nBiaya: ${cost} coins\nCoins kamu: ${coins}`
        );
      }

      user.coins -= cost;

      if (target === 'armor') {
        itemData.ketahanan = nextLevel;
      } else {
        itemData.level = nextLevel;
      }

      let bonusText = '';
      const chances = {
        maxDurability: 0.3,
        cooldown: target !== 'armor' && itemData.cooldown > 600000 ? 0.15 : 0,
        lucky: target === 'pickaxe' ? 0.05 : 0,
        armor: target === 'armor' ? 0.05 : 0,
      };

      const bonusCandidates = Object.entries(chances)
        .filter(([_, prob]) => Math.random() < prob)
        .map(([key]) => key);

      if (bonusCandidates.length > 0) {
        const chosen =
          bonusCandidates[Math.floor(Math.random() * bonusCandidates.length)];
        if (chosen === 'cooldown') {
          const reduction = Math.floor(func.getRandomValue(1000, 2001));
          itemData.cooldown = Math.max(600000, itemData.cooldown - reduction);
          bonusText += `Cooldown -${reduction}ms, `;
        } else if (chosen === 'maxDurability') {
          const bonus =
            target === 'armor' ? Math.floor(func.getRandomValue(10, 51)) : 5;
          itemData.maxDurability += bonus;
          itemData.durability = itemData.maxDurability;
          bonusText += `maxDurability +${bonus}, `;
        } else if (chosen === 'lucky') {
          itemData.lucky = (itemData.lucky || 0) + 1;
          bonusText += `Lucky +1, `;
        } else if (chosen === 'armor') {
          const bonus = Math.floor(func.getRandomValue(10, 51));
          itemData.ketahanan += 1;
          itemData.maxDurability += bonus;
          itemData.durability = itemData.maxDurability;
          bonusText += `Ketahanan +1, maxDurability +${bonus}, `;
        }
      }

      inv.item[target] = itemData;

      await func.archiveMemories.setItem(sender, 'coins', user.coins);
      await func.inventory.setItem(sender, 'item', inv.item);

      let teks = `✅ Upgrade berhasil!\nItem: ${target}\n`;
      teks += `Level: ${level} ➜ ${nextLevel}\n`;
      teks += `Biaya: -${cost} coins\n`;
      teks += `Total coins sekarang: ${user.coins}\n`;
      if (bonusText) teks += bonusText.trim().replace(/, $/, '');

      Exp.sendMessage(
        cht.id,
        {
          text: teks,
        },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['repair'],
      listmenu: ['repair'],
      tag: 'RPG',
      args: `Gunakan fitur repair untuk memperbaiki item kamu.

Contoh:
.repair pickaxe

Biaya:
- 100 coins per 1 durability

Hanya berlaku untuk:
- pickaxe
- ax
- sword
- fishing_hook`,
    },
    async () => {
      const itemToRepair = cht.q?.toLowerCase();
      if (!itemToRepair) return cht.reply('Contoh: *.repair pickaxe*');

      const allowedItems = ['pickaxe', 'ax', 'sword', 'fishing_hook'];
      if (!allowedItems.includes(itemToRepair)) {
        return cht.reply(
          'Item tidak bisa diperbaiki. Gunakan: pickaxe / ax / sword / fishing_hook'
        );
      }

      let user = (await func.archiveMemories.get(sender)) || {};
      let inv = (await func.inventory.get(sender)) || {};

      const itemData = inv.item?.[itemToRepair];
      if (!itemData) return cht.reply(`Kamu belum memiliki *${itemToRepair}*.`);

      const { durability, maxDurability } = itemData;
      if (durability >= maxDurability) {
        return cht.reply(`*${itemToRepair}* kamu sudah dalam kondisi Baik.`);
      }

      const durabilityToAdd = maxDurability - durability;
      const cost = durabilityToAdd * 100;
      const userCoins = user.coins || 0;

      if (userCoins < cost) {
        return cht.reply(
          `Coins kamu tidak cukup.\nBiaya repair: ${cost} coins\nCoins kamu: ${userCoins}`
        );
      }

      user.coins -= cost;
      itemData.durability = maxDurability;
      inv.item[itemToRepair] = itemData;

      await func.archiveMemories.setItem(sender, 'coins', user.coins);
      await func.inventory.setItem(sender, 'item', inv.item);

      const text =
        `*Repair berhasil!*\n` +
        `Item: ${itemToRepair}\n` +
        `Durability: ${durability} ➜ ${maxDurability}\n` +
        `Biaya: -${cost} coins\n` +
        `Sisa coins: ${user.coins}`;

      Exp.sendMessage(id, { text }, { quoted: cht });
    }
  );

  ev.on(
    {
      cmd: ['diskon'],
      listmenu: ['diskon'],
      tag: 'owner',
      isOwner: true,
    },
    async () => {
      const input = (cht.q || '')
        .replace(/[|.,]+/g, ' ')
        .split(' ')
        .filter((x) => x);
      if (input.length < 2) {
        return cht.reply(
          `Format: .diskon <item> <potongan> [jumlah]\nContoh:\n• .diskon potion 1000\n• .diskon potion 1000 10`
        );
      }

      const [itemRaw, potonganRaw, jumlahRaw] = input;
      const item = itemRaw.toLowerCase();
      const potongan = parseInt(potonganRaw);
      const jumlah = jumlahRaw ? parseInt(jumlahRaw) : null;

      const hargaObj = hargaAwal[item];
      if (!hargaObj || typeof hargaObj.beli !== 'number') {
        return cht.reply(
          `Item "${item}" tidak memiliki harga beli, tidak bisa diberi diskon.`
        );
      }

      const baseHarga = Data.ShopRPG.buy[item] || hargaObj.beli;
      if (isNaN(potongan) || potongan < 1)
        return cht.reply(`Potongan harus berupa angka positif.`);
      if (potongan >= baseHarga)
        return cht.reply(
          `Potongan tidak boleh lebih besar atau sama dengan harga (${baseHarga}).`
        );

      for (const i in Data.ShopRPG.diskon) {
        const d = Data.ShopRPG.diskon[i];
        const expired = d.expired || 0;
        const sisa = d.jumlah;
        const sudahHabis =
          (expired > 0 && expired <= Date.now()) ||
          (sisa !== null && sisa <= 0);
        if (sudahHabis) delete Data.ShopRPG.diskon[i];
      }

      const diskonBaru = {
        potongan,
        jumlah: jumlah && !isNaN(jumlah) ? jumlah : Infinity,
        expired: jumlah ? 0 : Date.now() + 5 * 60 * 60 * 1000,
      };

      Data.ShopRPG.diskon[item] = diskonBaru;

      const hargaDiskon = Math.max(1, baseHarga - potongan);
      const persen = Math.round(100 - (hargaDiskon / baseHarga) * 100);

      let pesan;
      if (jumlah) {
        pesan = `✅ Diskon diterapkan untuk ${jumlah} unit "${item}"\nHarga: ~${baseHarga}~ → Off ${persen}% ⇨ *${hargaDiskon}*`;
      } else {
        const dur = func.formatDuration(diskonBaru.expired - Date.now());
        pesan = `✅ Diskon aktif untuk "${item}" selama 10 jam\nHarga: ~${baseHarga}~ → Off ${persen}% ⇨ *${hargaDiskon}*\nSisa waktu: ${dur.hours} jam ${dur.minutes} menit`;
      }

      return cht.reply(pesan);
    }
  );

  ev.on(
    {
      cmd: ['hapusdiskon', 'deldiskon'],
      listmenu: ['hapusdiskon', 'deldiskon'],
      tag: 'owner',
      isOwner: true,
    },
    async () => {
      try {
        const item = (cht.q || '').trim().toLowerCase();

        if (!item)
          return cht.reply(
            `Format:\n.hapusdiskon <item>\n\nContoh:\n• .hapusdiskon potion\n• .hapusdiskon all`
          );

        Data.ShopRPG.diskon ??= {};

        let keys = Object.keys(Data.ShopRPG.diskon);

        if (!keys.length)
          return cht.reply(`❌ Saat ini tidak ada diskon yang aktif.`);

        if (item === 'all') {
          Data.ShopRPG.diskon = {};
          return cht.reply(
            `🗑️ Semua diskon berhasil dihapus.\nToko kembali ke harga normal.`
          );
        }

        if (!Data.ShopRPG.diskon[item])
          return cht.reply(
            `⚠️ Tidak ada diskon yang aktif untuk item "${item}".`
          );

        delete Data.ShopRPG.diskon[item];

        return cht.reply(
          `✅ Diskon untuk item "${item}" berhasil dihapus.\nSekarang kembali ke harga normal.`
        );
      } catch (e) {
        console.error('❌ Error di hapusdiskon:', e);
        return cht.reply(`Terjadi error saat menghapus diskon.`);
      }
    }
  );

  ev.on(
    {
      cmd: ['cekdiskon', 'diskonlist'],
      listmenu: ['cekdiskon', 'diskonlist'],
      tag: 'RPG',
    },
    async () => {
      try {
        let data = Data.ShopRPG.diskon || {};
        let keys = Object.keys(data);

        if (!keys.length)
          return cht.reply(`❌ Saat ini tidak ada diskon yang aktif.`);

        let lines = [];
        lines.push(`🎁 *Daftar Diskon Aktif di Toko RPG*\n`);

        let now = Date.now();
        let countValid = 0;

        for (let item of keys) {
          let d = data[item];
          if (!d) continue;

          let expired = d.expired || 0;
          let sisa = d.jumlah;
          let potongan = d.potongan || 0;

          let base = Data.ShopRPG.buy[item];
          if (!base) continue;

          let aktif =
            (expired === 0 || expired > now) && (sisa === null || sisa > 0);

          if (!aktif) {
            delete Data.ShopRPG.diskon[item];
            continue;
          }

          countValid++;

          let hargaDiskon = Math.max(1, base - potongan);
          let persen = Math.round(100 - (hargaDiskon / base) * 100);

          let waktuStr = `∞`;
          if (expired > 0) {
            let dur = func.formatDuration(expired - now);
            waktuStr = `${dur.hours}j ${dur.minutes}m`;
          }

          let sisaStr = sisa === null ? '∞' : sisa;

          lines.push(
            `• *${item}*\n` +
              `  Harga: ~${base}~ → *${hargaDiskon}* (-${persen}%)\n` +
              `  Sisa kuota: *${sisaStr}*\n` +
              `  Sisa waktu: *${waktuStr}*\n`
          );
        }

        if (!countValid)
          return cht.reply(`❌ Semua diskon sudah habis / expired.`);

        return cht.reply(lines.join('\n'));
      } catch (e) {
        console.error('❌ Error di cekdiskon:', e);
        return cht.reply(`Terjadi error saat membaca daftar diskon.`);
      }
    }
  );

  ev.on(
    {
      cmd: ['claim'],
      listmenu: ['claim'],
      tag: 'RPG',
    },
    async () => {
      let user = (await memories.get(sender)) || {};
      let inv = (await inventory.get(sender)) || {};

      user.cooldown ??= {};
      user.premium ??= {};
      user.energy ??= 0;
      user.coins ??= 0;
      user.flow ??= 0;
      inv.crate ??= {};

      const isPremium = (user.premium.time || 0) > Date.now();
      const now = Date.now();
      const CLAIM_COOLDOWN = 36000000;

      const nextClaim = user.cooldown.claim || 0;
      if (now < nextClaim) {
        const sisa = nextClaim - now;
        const dur = func.formatDuration(sisa);
        return cht.reply(
          `Kamu sudah klaim sebelumnya!\nTunggu ${dur.hours} jam ${dur.minutes} menit ${dur.seconds} detik lagi.`
        );
      }

      user.cooldown.claim = now + CLAIM_COOLDOWN;
      await memories.setItem(sender, 'cooldown', user.cooldown);
      const baseEnergy = Math.floor(func.getRandomValue(50, 501));
      let bonusEnergy = 0;
      if (Math.random() < 0.4) {
        const bonusRate = isPremium
          ? func.getRandomValue(0, 0.25)
          : func.getRandomValue(0, 0.15);
        bonusEnergy = Math.floor(baseEnergy * bonusRate);
      }
      const totalEnergy = baseEnergy + bonusEnergy;
      user.energy += totalEnergy;
      await memories.setItem(sender, 'energy', user.energy);

      const dropBonus = isPremium ? 0.03 : -0.05;
      let dropPool = [
        { type: 'flow', rate: 0.0003, min: 1, max: 1, premiumOnly: false },
        {
          type: 'premium_bonus',
          rate: 0.03,
          min: 30,
          max: 720,
          premiumOnly: true,
        },
        {
          type: 'crate.legendary',
          rate: 0.01 + dropBonus,
          min: 1,
          max: 5,
          premiumOnly: true,
        },
        {
          type: 'crate.epic',
          rate: 0.05 + dropBonus,
          min: 1,
          max: 10,
          premiumOnly: true,
        },
        {
          type: 'crate.mythic',
          rate: 0.1 + dropBonus,
          min: 5,
          max: 25,
          premiumOnly: true,
        },
        {
          type: 'crate.uncommon',
          rate: 0.15 + dropBonus,
          min: 10,
          max: 40,
          premiumOnly: false,
        },
        {
          type: 'crate.common',
          rate: 0.2 + dropBonus,
          min: 10,
          max: 40,
          premiumOnly: false,
        },
        {
          type: 'diamond',
          rate: 0.04 + dropBonus,
          min: 10,
          max: 40,
          premiumOnly: true,
        },
        {
          type: 'gold',
          rate: 0.07 + dropBonus,
          min: 30,
          max: 70,
          premiumOnly: true,
        },
        {
          type: 'iron',
          rate: 0.1 + dropBonus,
          min: 50,
          max: 300,
          premiumOnly: false,
        },
        {
          type: 'kayu',
          rate: 0.13 + dropBonus,
          min: 100,
          max: 1000,
          premiumOnly: false,
        },
        {
          type: 'potion',
          rate: 0.1 + dropBonus,
          min: 10,
          max: 50,
          premiumOnly: true,
        },
        {
          type: 'coins',
          rate: 0.2 + dropBonus,
          min: 1000,
          max: 10000,
          premiumOnly: false,
        },
      ].filter((r) => !r.premiumOnly || isPremium);

      let rewardGiven = '(Tidak ada drop kali ini)';
      for (let reward of dropPool) {
        if (Math.random() < reward.rate) {
          if (reward.type === 'premium_bonus') {
            const minutes = Math.floor(
              func.getRandomValue(reward.min, reward.max + 1)
            );
            const ms = minutes * 60 * 1000;
            const newTime = Math.max(user.premium.time || now, now) + ms;
            user.premium.time = newTime;
            await memories.setItem(sender, 'premium', user.premium);

            rewardGiven = `🎁 Bonus Premium +${minutes} menit`;
            break;
          } else {
            let amount = Math.floor(
              func.getRandomValue(reward.min, reward.max + 1)
            );
            amount = Math.floor(amount * (isPremium ? 1.3 : 0.9));

            if (reward.type.startsWith('crate.')) {
              const key = reward.type.split('.')[1];
              inv.crate[key] = (inv.crate[key] || 0) + amount;
              await inventory.setItem(sender, 'crate', inv.crate);
            } else if (['coins', 'flow'].includes(reward.type)) {
              user[reward.type] += amount;
              await memories.setItem(sender, reward.type, user[reward.type]);
            } else {
              inv[reward.type] = (inv[reward.type] || 0) + amount;
              await inventory.setItem(sender, reward.type, inv[reward.type]);
            }

            rewardGiven = `${reward.type.replace('crate.', 'Crate ')} +${amount}`;
            break;
          }
        }
      }

      let teks = `✅ Klaim Berhasil!\n`;
      teks += `Status: ${isPremium ? 'Premium' : 'Biasa'}\n`;
      teks += `+ Energy: ${baseEnergy}${bonusEnergy ? ` + ${bonusEnergy} bonus` : ''}\n`;
      teks += `+ Hadiah: ${rewardGiven}\n`;
      teks += `Coins: ${user.coins}|Flow: ${user.flow}`;

      Exp.sendMessage(id, { text: teks }, { quoted: cht });
    }
  );

  ev.on(
    {
      cmd: ['craft'],
      listmenu: ['craft'],
      tag: 'RPG',
      args: `Panduan Craft:
Contoh: .craft pickaxe
Daftar: pickaxe, ax, sword, fishing_hook, armor`,
    },
    async () => {
      const itemToCraft = cht.q?.toLowerCase();

      const resep = {
        pickaxe: {
          iron: 5,
          kayu: 3,
          data: {
            maxDurability: 10,
            durability: 10,
            level: 1,
            lucky: 0,
            cooldown: 3600000,
          },
        },
        ax: {
          iron: 4,
          kayu: 2,
          data: {
            maxDurability: 10,
            durability: 10,
            level: 1,
            cooldown: 3600000,
          },
        },
        sword: {
          iron: 6,
          kayu: 2,
          data: {
            maxDurability: 10,
            durability: 10,
            level: 1,
            cooldown: 3600000,
          },
        },
        fishing_hook: {
          iron: 3,
          kayu: 3,
          data: {
            maxDurability: 10,
            durability: 10,
            level: 1,
            cooldown: 3600000,
          },
        },
        armor: {
          iron: 10,
          kayu: 5,
          data: {
            maxDurability: 300,
            durability: 300,
            ketahanan: 1,
          },
        },
      };

      const bahan = resep[itemToCraft];
      if (!bahan) {
        return cht.reply(
          `Item tidak ditemukan.\nGunakan: pickaxe / ax / sword / armor / fishing_hook`
        );
      }

      inv.item ??= {};
      if (inv.item[itemToCraft]) {
        return cht.reply(
          `Kamu sudah memiliki *${itemToCraft}*.\nTidak bisa membuat dua kali.`
        );
      }

      const userIron = inv.iron || 0;
      const userKayu = inv.kayu || 0;

      if (userIron < bahan.iron || userKayu < bahan.kayu) {
        return cht.reply(
          `Bahan tidak cukup untuk membuat *${itemToCraft}*!\n` +
            `Dibutuhkan:\n- Iron: ${bahan.iron} (kamu punya: ${userIron})\n- Kayu: ${bahan.kayu} (kamu punya: ${userKayu})`
        );
      }

      inv.iron -= bahan.iron;
      inv.kayu -= bahan.kayu;
      inv.item[itemToCraft] = bahan.data;

      await inventory.setItem(sender, 'iron', inv.iron);
      await inventory.setItem(sender, 'kayu', inv.kayu);
      await inventory.setItem(sender, 'item', inv.item);
      const detail = Object.entries(bahan.data)
        .map(([k, v]) => {
          let formatDur = k == 'cooldown' ? func.formatDuration(v) : false;
          return `- ${k}: ${formatDur ? `${formatDur.days}hari ${formatDur.hours}jam ${formatDur.minutes}menit ${formatDur.seconds}detik ${formatDur.milliseconds}ms` : v}`;
        })
        .join('\n');

      const text =
        `*Berhasil membuat:* ${itemToCraft}\n` +
        `- Iron: -${bahan.iron}\n- Kayu: -${bahan.kayu}\n\n` +
        `*Detail item:*\n${detail}`;

      Exp.sendMessage(
        id,
        {
          text,
        },
        {
          quoted: cht,
        }
      );
    }
  );

  ev.on(
    {
      cmd: ['mining'],
      listmenu: ['mining'],
      tag: 'RPG',
    },
    async () => {
      const now = Date.now();
      const pickaxe = inv.item?.pickaxe;
      const armor = inv.item?.armor;

      if (inv.healt <= 0)
        return cht.reply(
          `❤️ Kamu sedang sekarat!\nGunakan *.heal* terlebih dahulu.`
        );
      if (!pickaxe)
        return cht.reply(
          'Kamu belum punya pickaxe. Gunakan `.craft pickaxe` dulu.'
        );
      if (pickaxe.durability <= 0)
        return cht.reply(
          'Pickaxe kamu rusak. Gunakan *.repair pickaxe* terlebih dahulu.'
        );

      const cooldown = pickaxe.cooldown || 3600000;
      const lastUsed = user.cooldown?.mining || 0;
      const remaining = cooldown - (now - lastUsed);

      if (remaining > 0) {
        const dur = func.formatDuration(remaining);
        return cht.reply(
          `⏳ Tunggu *${dur.minutes}m ${dur.seconds}s* lagi untuk menambang.`
        );
      }

      pickaxe.durability = Math.max(0, pickaxe.durability - 1);

      const level = pickaxe.level || 1;
      const luck = pickaxe.lucky || 0;
      const nama = user.name || 'Player';

      const miningItems = cfg.rpg.miningItems;

      const hasil = {};
      let totalDrop = 0;

      for (const [name, drop] of Object.entries(miningItems)) {
        let rate = drop.rate || 0;
        rate += level * 0.5;
        rate += luck * 0.3;
        if (rate > 100) rate = 100;

        let dropValue = 0;

        if (rate >= 100) {
          const minAmount = Math.max(1, Math.floor(level / 2));
          const maxAmount = Math.max(minAmount + 1, level);
          dropValue = Math.floor(func.getRandomValue(minAmount, maxAmount));
        } else {
          if (Math.random() * 100 < rate) {
            const maxRoll = Math.max(1, Math.ceil(rate));
            dropValue = Math.floor(
              func.getRandomValue(1, Math.min(maxRoll, drop.max || 2))
            );
          }
        }

        if (dropValue > 0) {
          hasil[name] = (hasil[name] || 0) + dropValue;
          inv[name] = (inv[name] || 0) + dropValue;
          totalDrop += dropValue;
        }
      }

      const lukaMenambang = [
        'Terjatuh di dalam tambang gelap',
        'Luka oleh alat pertambangan',
        'Batuan jatuh menimpa',
        'Tersengat listrik saat menambang',
        'Terkunci di dalam tambang',
        'Kehabbisan oksigen di dalam tambang',
        'Luka oleh pecahan kaca',
        'Ketiban bebatuan saat menambang',
        'Mengalami runtuhan tambang',
        'Tergelincir di lorong tambang',
        'Terjebak di bawah tumpukan batuan',
        'Terperangkap dalam lubang sempit',
        'Ketiban alat berat saat menambang',
        'Terjatuh dari ketinggian di dalam tambang',
        'Kehabisan makanan dan air di dalam tambang',
        'Mengalami keracunan gas tambang',
        'Terperosok ke dalam lubang tambang',
        'Luka oleh ledakan di dalam tambang',
        'Tersandung kabel listrik di dalam tambang',
        'Luka oleh bahan kimia tambang',
        'Terkurung di dalam tambang terbengkalai',
        'Terjebak dalam terowongan tambang yang runtuh',
        'Tersengat aliran air di dalam tambang',
        'Luka oleh alat bor tambang',
        'Terkunci di dalam ruang bawah tanah',
        'Kecelakaan kereta bawah tanah',
        'Tergantung di dalam terowongan tambang',
        'Terjatuh dari jembatan di dalam tambang',
        'Terkunci di dalam kabin lift tambang',
        'Luka oleh mesin penggali di dalam tambang',
      ];
      const kejadianLuka =
        lukaMenambang[Math.floor(Math.random() * lukaMenambang.length)];

      let luka = false,
        dmg = 0,
        absorbed = 0,
        healtLoss = 0;
      if (Math.random() < 0.5) {
        luka = true;
        dmg = func.getRandomValue(5, 35);
        const ketahanan = armor?.ketahanan || 0;
        const absorb = Math.min(ketahanan * 10, 90);
        absorbed = Math.round(dmg * (absorb / 100));
        healtLoss = dmg - absorbed;

        inv.healt = Math.max(0, inv.healt - healtLoss);
        if (armor) {
          armor.durability -= absorbed;
          armor.durability = Math.max(0, armor.durability);
        }
      }

      inv.item.pickaxe = pickaxe;
      user.cooldown ??= {};
      user.cooldown.mining = now;

      await inventory.setItem(sender, 'item', inv.item);
      await memories.setItem(sender, 'cooldown', user.cooldown);
      await inventory.setItem(sender, 'healt', inv.healt);
      for (const [name] of Object.entries(miningItems)) {
        if (inv[name] !== undefined) {
          await inventory.setItem(sender, name, inv[name]);
        }
      }

      const persentase = (a, b) => Math.floor((a / b) * 100);
      const durPickaxe = persentase(pickaxe.durability, pickaxe.maxDurability);
      const durArmor = armor
        ? persentase(armor.durability, armor.maxDurability)
        : 0;

      let text = `*⛏️ Hasil Mining:*\n`;
      for (const [name, drop] of Object.entries(miningItems)) {
        const val = hasil[name];
        if (val > 0) text += `- ${drop.label}: +${val}\n`;
      }

      text += `\n*Peralatan:*\n- Pickaxe: ${durPickaxe}% durability\n`;
      if (armor) text += `- Armor: ${durArmor}% durability\n`;

      if (luka) {
        text += `\n\n*⚠️ ${kejadianLuka}*\n- Total Damage: ${dmg}\n- Ditahan Armor: ${absorbed}\n- Damage ke Healt: -${healtLoss} HP\n- Sisa HP: ${inv.healt}/100`;
      }

      if (durPickaxe <= 30) {
        text += `\n\n⚠️ *Pickaxe kamu hampir rusak!* Segera *.repair pickaxe* sebelum hancur.`;
      }
      if (armor && durArmor <= 30) {
        text += `\n\n⚠️ *Armor kamu hampir hancur!* Repair sekarang sebelum tidak bisa melindungi.`;
      }

      if (inv.healt === 0) {
        text += `\n\n❤️ Kamu terluka parah! Gunakan *.heal* sebelum lanjut menambang.`;
      }

      const imageMessage = {
        text,
        contextInfo: {
          externalAdReply: {
            title: `${nama} Menambang dengan pickaxe level ${pickaxe.level}`,
            body: 'Hasil tambang hari ini',
            thumbnailUrl: 'https://telegra.ph/file/393ac131253fd6420c696.jpg',
            mediaUrl: 'https://wa.me/6282324853300',
            renderLargerThumbnail: true,
            showAdAttribution: true,
            mediaType: 1,
          },
        },
      };

      Exp.sendMessage(id, imageMessage, {
        quoted: cht,
      });
    }
  );

  ev.on(
    {
      cmd: ['berburu', 'hunting'],
      listmenu: ['berburu'],
      tag: 'RPG',
    },
    async () => {
      const now = Date.now();
      const armor = inv.item?.armor;
      const sword = inv.item?.sword;
      const nama = inv.name || 'Player';

      if (inv.healt <= 0)
        return cht.reply(
          `❤️ Kamu sedang sekarat!\nGunakan *.heal* terlebih dahulu.`
        );
      if (!sword)
        return cht.reply(
          'Kamu belum punya sword. Gunakan `.craft sword` dulu.'
        );
      if (sword.durability <= 0)
        return cht.reply(
          'Sword kamu rusak. Gunakan *.repair sword* terlebih dahulu.'
        );

      const swordLv = sword.level || 1;
      const cdMin = 10 + (swordLv - 1) * 5;
      const cdMax = 20 + (swordLv - 1) * 5;
      const cooldownTime = func.getRandomValue(cdMin, cdMax) * 60000;
      const lastUsed = user.cooldown?.berburu || 0;
      const remaining = cooldownTime - (now - lastUsed);
      if (remaining > 0) {
        const dur = func.formatDuration(remaining);
        return cht.reply(
          `⏳ Tunggu *${dur.minutes}m ${dur.seconds}s* lagi untuk berburu.`
        );
      }

      sword.durability = Math.max(0, sword.durability - 1);

      // Lokasi random
      const lokasiList = [
        {
          nama: 'Hutan rimba',
          image: './storage_cabinets/image/rimba.jpg',
        },
        {
          nama: 'Hutan tropis',
          image: 'https://telegra.ph/file/50c7f99957cd916e5219f.jpg',
        },
        {
          nama: 'Padang rumput',
          image: 'https://telegra.ph/file/6a38c841ff55bfad707e8.jpg',
        },
        {
          nama: 'Hutan afrika',
          image: 'https://telegra.ph/file/43eeb99324a0aa8bbbf4c.jpg',
        },
        {
          nama: 'Pegunungan',
          image: 'https://telegra.ph/file/c09bf0b46be87c09aa20c.jpg',
        },
      ];
      const lokasi = lokasiList[Math.floor(Math.random() * lokasiList.length)];

      const minJumlah = 5 + (swordLv - 1) * 5;
      const maxJumlah = 15 + (swordLv - 1) * 5;
      let total =
        Math.floor(Math.random() * (maxJumlah - minJumlah + 1)) + minJumlah;

      const hasil = {};
      for (const h of berburu) {
        hasil[h.nama] = 0;
        inv[h.nama] = inv[h.nama] || 0;
      }

      while (total > 0) {
        let roll = Math.random() * 100;
        let acc = 0;
        let target = berburu[0];
        for (let h of berburu) {
          acc += h.rate;
          if (roll <= acc) {
            target = h;
            break;
          }
        }
        const jumlah = Math.min(total, Math.floor(Math.random() * 3) + 1);
        hasil[target.nama] += jumlah;
        inv[target.nama] += jumlah;
        total -= jumlah;
      }

      // Luka
      const lukaList = [
        'Terpeleset akar pohon',
        'Diserang binatang buas',
        'Jatuh dari tebing',
        'Tersesat di hutan',
        'Tertusuk duri tajam',
      ];
      let luka = false,
        kejadian = '',
        dmg = 0,
        absorbed = 0,
        healtLoss = 0;
      if (Math.random() < 0.5) {
        luka = true;
        kejadian = lukaList[Math.floor(Math.random() * lukaList.length)];
        dmg = func.getRandomValue(5, 35);
        const ketahanan = armor?.ketahanan || 0;
        absorbed = Math.floor((dmg * Math.min(ketahanan * 10, 90)) / 100);
        healtLoss = dmg - absorbed;
        inv.healt = Math.max(0, inv.healt - healtLoss);
        if (armor) armor.durability = Math.max(0, armor.durability - absorbed);
      }

      user.cooldown ??= {};
      user.cooldown.berburu = now;
      inv.item.sword = sword;
      if (armor) inv.item.armor = armor;

      await memories.setItem(sender, 'cooldown', user.cooldown);
      await inventory.setItem(sender, 'healt', inv.healt);
      await inventory.setItem(sender, 'item', inv.item);
      for (const h of berburu) {
        await inventory.setItem(sender, h.nama, inv[h.nama]);
      }

      // === Caption hasil ===
      let caption = `_[ HASIL BURUAN ]_\n`;
      for (const h of berburu) {
        if (hasil[h.nama] > 0) {
          caption += `\n*${h.icon}${h.nama.charAt(0).toUpperCase() + h.nama.slice(1)}* : ${hasil[h.nama]}`;
        }
      }

      caption += `\n\n_[ INFO ]_\n`;
      caption += `*Lokasi* : ${lokasi.nama}\n`;
      caption += luka
        ? `*Terluka* : ${kejadian}, darah -${healtLoss}${armor ? ` (ditahan armor -${absorbed})` : ''}\n`
        : `*Terluka* : Tidak\n`;
      caption += `*Sisa darah* : ${Math.floor(inv.healt)}/100\n`;

      if (sword.durability <= 3) {
        caption += `\n\n⚠️ *Sword kamu hampir rusak!* Segera *.repair sword*.`;
      }

      const imageMessage = {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: `${nama} Berburu di ${lokasi.nama}`,
            body: 'Hasil buruan hari ini',
            thumbnailUrl: lokasi.image,
            mediaUrl: 'https://wa.me/6282324853300',
            renderLargerThumbnail: true,
            showAdAttribution: true,
            mediaType: 1,
          },
        },
      };

      Exp.sendMessage(id, imageMessage, {
        quoted: cht,
      });
    }
  );

  ev.on(
    {
      cmd: ['mancing', 'fishing'],
      listmenu: ['mancing'],
      tag: 'RPG',
    },
    async () => {
      const now = Date.now();
      const pancing = inv.item?.fishing_hook;
      const nama = user.name || 'Player';

      if (!pancing)
        return cht.reply(
          'Kamu belum punya pancing. Gunakan `.craft fishing_hook` dulu.'
        );
      if (pancing.durability <= 0)
        return cht.reply(
          'Pancing kamu rusak. Gunakan `.repair fishing_hook* terlebih dahulu.'
        );

      const cooldown = pancing.cooldown || 3600000;
      const lastUsed = user.cooldown?.mancing || 0;
      const remaining = cooldown - (now - lastUsed);
      if (remaining > 0) {
        const dur = func.formatDuration(remaining);
        return cht.reply(
          `⏳ Tunggu *${dur.minutes}m ${dur.seconds}s* lagi untuk mancing.`
        );
      }

      pancing.durability = Math.max(0, pancing.durability - 1);

      const fishingLv = pancing.level || 1;
      const minJumlah = 5 + (fishingLv - 1) * 5;
      const maxJumlah = 15 + (fishingLv - 1) * 5;
      let total =
        Math.floor(Math.random() * (maxJumlah - minJumlah + 1)) + minJumlah;

      const hasil = {};
      for (const i of mancing) {
        hasil[i.nama] = 0;
        inv[i.nama] = inv[i.nama] || 0;
      }

      while (total > 0) {
        let roll = Math.random() * 100;
        let acc = 0;
        let target = mancing[0];
        for (let i of mancing) {
          acc += i.rate;
          if (roll <= acc) {
            target = i;
            break;
          }
        }
        const jumlah = Math.min(total, Math.floor(Math.random() * 3) + 1);
        hasil[target.nama] += jumlah;
        inv[target.nama] += jumlah;
        total -= jumlah;
      }

      user.cooldown ??= {};
      user.cooldown.mancing = now;
      inv.item.fishing_hook = pancing;

      await memories.setItem(sender, 'cooldown', user.cooldown);
      await inventory.setItem(sender, 'item', inv.item);
      for (const i of mancing) {
        await inventory.setItem(sender, i.nama, inv[i.nama]);
      }

      let caption = `_[ HASIL MANCING ]_\n`;
      for (const i of mancing) {
        if (hasil[i.nama] > 0) {
          caption += `\n*${i.icon}${i.nama.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}* : ${hasil[i.nama]}`;
        }
      }

      caption += `\n\n_[ INFO ]_\n`;
      caption += `*Lokasi* : Hutan Amazon (sementara)\n`;
      caption += `*Sisa durability pancing* : ${pancing.durability}/${pancing.maxDurability}\n`;

      if (pancing.durability <= 3) {
        caption += `\n\n⚠️ *Pancing kamu hampir rusak!* Segera *.repair fishing_hook*.`;
      }

      const imageMessage = {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: `${nama} sedang memancing...`,
            body: 'Hasil mancing hari ini',
            thumbnailUrl: 'https://telegra.ph/file/875ddd96a57f525502149.jpg',
            mediaUrl: 'https://wa.me/6282324853300',
            renderLargerThumbnail: true,
            showAdAttribution: true,
            mediaType: 1,
          },
        },
      };

      Exp.sendMessage(id, imageMessage, {
        quoted: cht,
      });
    }
  );

  ev.on(
    {
      cmd: ['heal'],
      listmenu: ['heal'],
      tag: 'RPG',
    },
    async () => {
      const potions = inv.potion || 0;
      const healt = inv.healt || 0;

      if (potions <= 0) {
        return cht.reply(
          `⚠️ Kamu tidak punya potion untuk menyembuhkan diri.\nGunakan .buy potion atau cari di misi.`
        );
      }

      if (healt >= 100) {
        return cht.reply(
          `❤️ Healt kamu sudah penuh (${healt}/100). Tidak perlu menyembuhkan.`
        );
      }

      const healAmount = func.getRandomValue(20, 55);
      const newHealt = Math.min(100, healt + healAmount);
      const restored = newHealt - healt;

      inv.potion = potions - 1;
      inv.healt = newHealt;

      await inventory.setItem(sender, 'potion', inv.potion);
      await inventory.setItem(sender, 'healt', inv.healt);

      const text =
        `❤️ Kamu telah menggunakan 1 potion.\n` +
        `• HP dipulihkan: +${restored} HP\n` +
        `• Healt sekarang: ${newHealt}/100\n` +
        `• Sisa potion: ${inv.potion}`;

      Exp.sendMessage(
        id,
        {
          text,
        },
        {
          quoted: cht,
        }
      );
    }
  );

  ev.on(
    { cmd: ['opencrate', 'open'], listmenu: true, tag: 'RPG' },
    async ({ args }) => {
      let inv = await func.inventory.get(sender);
      let usr = await func.archiveMemories.get(sender);

      inv.crate ??= {};

      let crates = Object.keys(inv.crate);
      let hasCrate = crates.length > 0;

      let txtcrate = hasCrate
        ? `📦 *Crate yang kamu punya*\n\n` +
          crates.map((a) => `• ${a} (${inv.crate[a]})`).join('\n') +
          `\n\nContoh:\n${cht.prefix + cht.cmd} ${crates[0]} 3`
        : `❗ Kamu belum punya crate apapun`;

      if (!hasCrate) return cht.reply(txtcrate);

      let [t, a] = (args || '').toLowerCase().split(/\s+/);
      if (!t) return cht.reply(txtcrate);

      let pool = cfg.rpg.cratePool?.[t];
      if (!pool) return cht.reply('⚠️ Crate tidak ditemukan.');

      let owned = inv.crate[t] || 0;
      if (owned < 1) return cht.reply('❗ Crate kamu kurang.');

      let n = a === 'all' ? owned : Math.min(+a || 1, owned);

      if (n < 1) return cht.reply('❗ Jumlah tidak valid.');

      let results = {};
      let bonusScore = 0;

      let txt = `📦 *OPEN CRATE — ${t.toUpperCase()} x${n}*\n\n🎉 Hadiah yang kamu dapet:\n`;

      while (n--) {
        let r = Math.random() * 100,
          s = 0,
          o;

        for (let i of pool)
          if ((s += i.rate) >= r) {
            o = i;
            break;
          }

        if (!o?.item) continue;

        let q = ((Math.random() * (o.max - o.min + 1)) | 0) + o.min;
        let k = o.item;

        if (o.rate <= 15) bonusScore += 3;
        else if (o.rate <= 30) bonusScore += 2;
        else bonusScore += 1;

        if (k === 'premium') {
          usr.premium ??= {};
          usr.premium.time =
            Math.max(Date.now(), usr.premium.time || 0) + q * 60000;

          results[`⭐ Premium (${q}m)`] =
            (results[`⭐ Premium (${q}m)`] || 0) + 1;
          continue;
        }

        if (k.startsWith('crate_')) {
          let x = k.slice(6);
          inv.crate[x] = (inv.crate[x] || 0) + q;

          results[`📦 ${x}`] = (results[`📦 ${x}`] || 0) + q;
          continue;
        }

        (k in usr ? usr : inv)[k] = ((k in usr ? usr[k] : inv[k]) || 0) + q;

        let icon =
          k === 'coins'
            ? '💰'
            : k === 'diamond'
              ? '💎'
              : k === 'gold'
                ? '🥇'
                : k === 'iron'
                  ? '⛏️'
                  : k === 'flow'
                    ? '🔥'
                    : k === 'potion'
                      ? '🧪'
                      : '🎁';

        results[`${icon} ${k}`] = (results[`${icon} ${k}`] || 0) + q;
      }

      inv.crate[t] -= Math.min(inv.crate[t], +a || 1, owned);

      for (let [k, v] of Object.entries(results)) txt += `• ${k} +${v}\n`;

      txt += `\n`;

      let mood =
        bonusScore >= 10
          ? `Gila sih… hoki banget kamu hari ini ༎ຶ⁠‿⁠༎ຶ`
          : bonusScore >= 6
            ? `Lumayan hoki juga ya (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧`
            : bonusScore >= 3
              ? `Masih aman lah ʕ⁠´⁠•⁠ ⁠ᴥ⁠•̥⁠\`⁠ʔ`
              : `Gapapa ya cuma dapet itu… coba lagi nanti (⁠ ⁠；⁠∀⁠；⁠)`;

      txt += `Selamat ya~ ✨\n${mood}`;

      await func.inventory.set(sender, inv);
      await func.archiveMemories.set(sender, usr);

      Exp.sendMessage(id, { text: txt }, { quoted: cht });
    }
  );
}
