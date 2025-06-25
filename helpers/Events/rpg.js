/*!-======[ Module Imports ]======-!*/
const fs = 'fs'.import();
const path = 'path'.import();

export default async function on({ cht, ev, Exp }) {
  const { id, sender } = cht;
  const { func } = Exp;
  const { archiveMemories: memories, inventory } = func;
  let inv = inventory.get(sender);
  const user = cht.memories;

  let { berburu, mancing, miningDrops, hargaAwal } =
    func.inventory.initCfg().rpg;

  ev.on(
    {
      cmd: ['infinity'],
      listmenu: ['infinity'],
      tag: 'Debug',
      isOwner: true,
    },
    async () => {
      const inf = 9999999;
      const fields = [
        'coins',
        'healt',
        'potion',
        'kayu',
        'iron',
        'gold',
        'diamond',
      ];

      for (const f of fields) {
        inv[f] = inf;
        await inventory.setItem(sender, f, inf);
      }

      if (inv.crate) {
        for (const tipe in inv.crate) {
          inv.crate[tipe] = inf;
        }
        await inventory.setItem(sender, 'crate', inv.crate);
      }
      if (inv.item) {
        for (const alat in inv.item) {
          const i = inv.item[alat];
          if (i?.durability) i.durability = inf;
          if (i?.maxDurability) i.maxDurability = inf;
        }
        await inventory.setItem(sender, 'item', inv.item);
      }
      if (inv.buah) for (const x in inv.buah) inv.buah[x] = inf;
      if (inv.makanan) for (const x in inv.makanan) inv.makanan[x] = inf;
      if (inv.tanaman) for (const x in inv.tanaman) inv.tanaman[x] = inf;
      await inventory.setItem(sender, 'buah', inv.buah);
      await inventory.setItem(sender, 'makanan', inv.makanan);
      await inventory.setItem(sender, 'tanaman', inv.tanaman);

      return cht.reply(
        '♾️ Infinity mode aktif (9999999)! Semua resource utama kamu ditingkatkan.'
      );
    }
  );

  ev.on(
    {
      cmd: ['shop'],
      listmenu: ['shop'],
      tag: 'RPG',
    },
    async () => {
      const lines = [];

      lines.push(`🏦 *Toko RPG - Shop Menu*\n`);
      lines.push(
        `Perintah:\n.buy / .beli <item> <jumlah>\n.sell / .jual <item> <jumlah>\n.shop untuk melihat semua daftar\n`
      );

      lines.push(`╔═══════『 𝐇𝐚𝐫𝐠𝐚 𝐁𝐞𝐥𝐢 』═══════╗`);
      for (const item in hargaAwal) {
        const hargaObj = hargaAwal[item];
        if (!hargaObj?.beli) continue;

        const harga = Data.ShopRPG.buy[item] || hargaObj.beli;
        const HargaAwal = hargaObj.beli;
        const diskon = Data.ShopRPG.diskon[item];

        let line = `║ ${item} = `;
        const selisih = harga - HargaAwal;
        const panah = selisih > 0 ? '⬆︎' : selisih < 0 ? '⬇︎' : '';

        if (diskon) {
          const aktif =
            diskon.expired === 0
              ? diskon.jumlah > 0
              : diskon.expired > Date.now();
          if (aktif) {
            const hargaDiskon = Math.max(1, harga - diskon.potongan);
            const persenDiskon = Math.round(100 - (hargaDiskon / harga) * 100);
            const waktuSisa =
              diskon.expired > 0
                ? func.formatDuration(diskon.expired - Date.now())
                : null;

            const sisaStr = waktuSisa
              ? ` (sisa: ${waktuSisa.hours} jam ${waktuSisa.minutes} menit)`
              : '';

            line += `~${harga} Off ${persenDiskon}%~ ➯ *${hargaDiskon}*${sisaStr}`;
            lines.push(line);
            continue;
          }
        }

        line += panah ? `*${harga}${panah}*` : `*${harga}*`;
        lines.push(line);
      }
      lines.push(`╚════════════════════════╝\n`);

      lines.push(`╔═══════『 𝐇𝐚𝐫𝐠𝐚 𝐉𝐮𝐚𝐥 』═══════╗`);
      for (const item in hargaAwal) {
        const hargaObj = hargaAwal[item];
        if (!hargaObj?.jual) continue;

        const harga = Data.ShopRPG.sell[item] || hargaObj.jual;
        const HargaAwal = hargaObj.jual;
        const selisih = harga - HargaAwal;
        const panah = selisih > 0 ? '⬆︎' : selisih < 0 ? '⬇︎' : '';

        lines.push(`║ ${item} = *${harga}${panah}*`);
      }
      lines.push(`╚════════════════════════╝`);

      return Exp.sendMessage(
        cht.id,
        {
          text: lines.join('\n'),
        },
        {
          quoted: cht,
        }
      );
    }
  );

  ev.on(
    {
      cmd: ['buy', 'beli', 'sell', 'jual'],
      listmenu: ['buy', 'beli', 'sell', 'jual'],
      tag: 'RPG',
    },
    async () => {
      const [itemRaw, jumlahRaw] = (cht.q || '').trim().split(/[\s|.,]+/);
      const jumlahStr = jumlahRaw?.toLowerCase();
      const item = itemRaw?.toLowerCase();
      if (!item) return cht.reply(`Contoh: .${cht.cmd} potion 2`);

      const isBuy = ['buy', 'beli'].includes(cht.cmd);
      const HargaAwal = hargaAwal[item];
      if (!hargaAwal || typeof HargaAwal !== 'object')
        return cht.reply(`Item "${item}" tidak tersedia.`);

      const harga = isBuy ? Data.ShopRPG.buy[item] : Data.ShopRPG.sell[item];
      if (!harga)
        return cht.reply(
          `Item "${item}" tidak bisa di${isBuy ? 'beli' : 'jual'}.`
        );

      inv.coins ??= 0;
      inv[item] ??= 0;

      let jumlah;
      if (jumlahStr === 'all') {
        jumlah = isBuy ? Math.floor(inv.coins / harga) : inv[item];
      } else {
        jumlah = Math.max(1, parseInt(jumlahStr) || 1);
      }

      if (jumlah < 1)
        return cht.reply(
          `Jumlah ${isBuy ? 'pembelian' : 'penjualan'} tidak valid.`
        );

      // === BELI ===
      if (isBuy) {
        let total = 0;
        let sisaDiskon = Data.ShopRPG.diskon[item]?.jumlah;
        const potongan = Data.ShopRPG.diskon[item]?.potongan || 0;
        const expired = Data.ShopRPG.diskon[item]?.expired || 0;

        // Hitung harga total dengan sisa diskon
        for (let i = 0; i < jumlah; i++) {
          const pakaiDiskon =
            sisaDiskon &&
            (sisaDiskon > 0 || sisaDiskon === null) &&
            (expired === 0 || expired > Date.now());
          const hargaSatuan = pakaiDiskon
            ? Math.max(1, harga - potongan)
            : harga;
          total += hargaSatuan;
          if (pakaiDiskon && sisaDiskon !== null) sisaDiskon--;
        }

        if (inv.coins < total)
          return cht.reply(
            `Koinmu tidak cukup untuk membeli ${jumlah} ${item}.\nSaldo: ${inv.coins}, Harga total: ${total}`
          );

        // Eksekusi pembelian
        inv.coins -= total;
        inv[item] += jumlah;

        Data.ShopRPG.statistik[item] ??= {
          beli: 0,
          jual: 0,
        };
        Data.ShopRPG.statistik[item].beli += jumlah;

        // Perbarui diskon
        if (Data.ShopRPG.diskon[item]) {
          if (Data.ShopRPG.diskon[item].jumlah !== null) {
            Data.ShopRPG.diskon[item].jumlah -= jumlah;
            if (Data.ShopRPG.diskon[item].jumlah <= 0)
              delete Data.ShopRPG.diskon[item];
          }
          if (
            Data.ShopRPG.diskon[item].expired &&
            Data.ShopRPG.diskon[item].expired <= Date.now()
          ) {
            delete Data.ShopRPG.diskon[item];
          }
        }

        await inventory.setItem(cht.sender, 'coins', inv.coins);
        await inventory.setItem(cht.sender, item, inv[item]);

        return cht.reply(
          `✨ *Pembelian Berhasil!*
Kamu membeli *${jumlah}* ${item}
Menggunakan: *${total}* coins
Sisa coins kamu sekarang: *${inv.coins}*
Terima kasih telah berbelanja!`
        );
      }

      // === JUAL ===
      if (inv[item] < jumlah)
        return cht.reply(
          `Kamu hanya punya ${inv[item]} ${item}, tidak cukup untuk dijual.`
        );

      const total = harga * jumlah;
      inv.coins += total;
      inv[item] -= jumlah;

      Data.ShopRPG.statistik[item] ??= {
        beli: 0,
        jual: 0,
      };
      Data.ShopRPG.statistik[item].jual += jumlah;

      const fileText = fs.readFileSync('./helpers/Events/rpg.js', 'utf-8');
      const updatedText = fileText
        .replace(/diskon: \{[\s\S]*?\},\n  inflasi:/, () => {
          const diskonText = JSON.stringify(
            Data.ShopRPG.diskon,
            null,
            2
          ).replace(/"([^"]+)":/g, '$1:');
          return `diskon: ${diskonText},\n  inflasi:`;
        })
        .replace(/statistik: \{[\s\S]*?\}\n\}/, () => {
          const statistikText = JSON.stringify(
            Data.ShopRPG.statistik,
            null,
            2
          ).replace(/"([^"]+)":/g, '$1:');
          return `statistik: ${statistikText}\n}`;
        });
      fs.writeFileSync('./helpers/Events/rpg.js', updatedText);

      await inventory.setItem(cht.sender, 'coins', inv.coins);
      await inventory.setItem(cht.sender, item, inv[item]);

      return cht.reply(
        `✅ *Penjualan Berhasil!*
Kamu menjual *${jumlah}* ${item}
Mendapatkan: *${total}* coins
Total coins kamu sekarang: *${inv.coins}*
Terima kasih telah berdagang!`
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
.upgrade energy

Biaya:
- Item (pickaxe, ax, sword, fishing_hook, armor): coins, mulai dari 27.750 naik 80% tiap level.
- Energy: 1 flow → +100 maxCharge & +200 premium.maxCharge`,
    },
    async () => {
      const target = cht.q?.toLowerCase();
      if (!target)
        return cht.reply('Contoh: *.upgrade pickaxe* atau *.upgrade energy*');

      if (target === 'energy') {
        const flow = inventory.flow || 0;
        if (flow < 1)
          return cht.reply(
            `Flow kamu tidak cukup.\nDibutuhkan: 1 flow\nFlow kamu: ${flow}`
          );

        const maxCharge = user.maxCharge || 200;
        const premiumMaxCharge = user.premium?.maxCharge || 1000;

        const newMax = maxCharge + 100;
        const newPrem = premiumMaxCharge + 200;
        inventory.flow = flow - 1;

        await func.archiveMemories.setItem(sender, 'flow', inventory.flow);
        await func.archiveMemories.setItem(sender, 'maxCharge', newMax);
        await func.archiveMemories.setItem(
          sender,
          'premium.maxCharge',
          newPrem
        );

        return Exp.sendMessage(
          id,
          {
            text:
              `✅ Upgrade Energy Berhasil!\n\n` +
              `• Max Charge (Free): ${maxCharge} ➜ ${newMax}\n` +
              `• Max Charge (Premium): ${premiumMaxCharge} ➜ ${newPrem}\n` +
              `• Flow dikurangi 1 (sisa: ${inventory.flow})`,
          },
          {
            quoted: cht,
          }
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
      const coins = inv.coins || 0;
      if (coins < cost) {
        return cht.reply(
          `Coins kamu tidak cukup.\nBiaya: ${cost} coins\nCoins kamu: ${coins}`
        );
      }

      inv.coins -= cost;

      if (target === 'armor') {
        itemData.ketahanan = nextLevel;
      } else {
        itemData.level = nextLevel;
      }

      // === Bonus Random ===
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

      await inventory.setItem(sender, 'coins', inv.coins);
      await inventory.setItem(sender, 'item', inv.item);

      let teks = `✅ Upgrade berhasil!\nItem: ${target}\n`;
      teks += `Level: ${level} ➜ ${nextLevel}\n`;
      teks += `Biaya: -${cost} coins\n`;
      if (bonusText) teks += bonusText.trim().replace(/, $/, '');

      Exp.sendMessage(
        id,
        {
          text: teks,
        },
        {
          quoted: cht,
        }
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

      const itemData = inv.item?.[itemToRepair];

      if (!itemData) return cht.reply(`Kamu belum memiliki *${itemToRepair}*.`);

      const { durability, maxDurability } = itemData;
      if (durability >= maxDurability) {
        return cht.reply(`*${itemToRepair}* kamu sudah dalam kondisi Baik.`);
      }

      const durabilityToAdd = maxDurability - durability;
      const cost = durabilityToAdd * 100;
      const userCoins = inv.coins || 0;

      if (userCoins < cost) {
        return cht.reply(
          `Coins kamu tidak cukup.\nBiaya repair: ${cost} coins\nCoins kamu: ${userCoins}`
        );
      }

      inv.coins -= cost;
      itemData.durability = maxDurability;
      inv.item[itemToRepair] = itemData;

      await inventory.setItem(sender, 'coins', inv.coins);
      await inventory.setItem(sender, 'item', inv.item);

      const text =
        `*Repair berhasil!*\n` +
        `Item: ${itemToRepair}\n` +
        `Durability: ${durability} ➜ ${maxDurability}\n` +
        `Biaya: -${cost} coins`;

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
        expired: jumlah ? 0 : Date.now() + 5 * 60 * 60 * 1000, // 5 jam
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
      cmd: ['claim'],
      listmenu: ['claim'],
      tag: 'RPG',
    },
    async () => {
      const isPremium = (user.premium?.time || 0) > Date.now();
      const now = Date.now();
      const CLAIM_COOLDOWN = 36000000;

      const nextClaim = user.cooldown.claim;
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
      let totalEnergy = baseEnergy;
      if (func.getRandomValue(0, 1) < 0.4) {
        const bonusRate = isPremium
          ? func.getRandomValue(0, 0.25)
          : func.getRandomValue(0, 0.15);
        bonusEnergy = Math.floor(baseEnergy * bonusRate);
        totalEnergy += bonusEnergy;
      }
      await memories.setItem(
        sender,
        'energy',
        (user.energy || 0) + totalEnergy
      );

      // ——— Drop pool lengkap
      const dropBonus = isPremium ? 0.03 : -0.05;
      let dropPool = [
        {
          type: 'flow',
          rate: 0.0003,
          min: 1,
          max: 1,
          premiumOnly: false,
        },
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
      ];

      dropPool = dropPool.filter((r) => !r.premiumOnly || isPremium);

      let rewardGiven = null;
      for (let reward of dropPool) {
        if (func.getRandomValue(0, 1) < reward.rate) {
          if (reward.type === 'premium_bonus') {
            const minutes = Math.floor(
              func.getRandomValue(reward.min, reward.max + 1)
            );
            const ms = minutes * 60 * 1000;
            const newTime = Math.max(user.premium.time || now, now) + ms;
            user.premium.time = newTime;
            memories.setItem(sender, 'premium', user.premium);

            const dur = func.formatDuration(newTime - now);
            const exp = func.dateFormatter(newTime, 'Asia/Jakarta');

            rewardGiven = `🎁 Bonus Premium +${minutes} menit\n⏱️Expired after: ${dur.hours} jam ${dur.minutes} menit ${dur.seconds} detik\n🗓️Expired on: ${exp}`;
            break;
          } else {
            let amount = Math.floor(
              func.getRandomValue(reward.min, reward.max + 1)
            );
            const adjust = isPremium ? 1.3 : 0.9;
            amount = Math.floor(amount * adjust);

            if (reward.type.startsWith('crate.')) {
              const key = reward.type.split('.')[1];
              inv.crate[key] = (inv.crate[key] || 0) + amount;
            } else {
              inv[reward.type] = (inv[reward.type] || 0) + amount;
            }

            rewardGiven = `${reward.type.replace('crate.', 'Crate ')} +${amount}`;
            break;
          }
        }
      }

      inventory.setItem(sender, 'crate', inv.crate);
      inventory.setItem(sender, 'coins', inv.coins || 0);
      inventory.setItem(sender, 'potion', inv.potion || 0);
      inventory.setItem(sender, 'kayu', inv.kayu || 0);
      inventory.setItem(sender, 'iron', inv.iron || 0);
      inventory.setItem(sender, 'gold', inv.gold || 0);
      inventory.setItem(sender, 'diamond', inv.diamond || 0);
      inventory.setItem(sender, 'flow', inv.flow || 0);

      let teks = `✅ Klaim Berhasil!\n`;
      teks += `Status: ${isPremium ? 'Premium' : 'Biasa'}\n`;
      teks += `+ Energy: ${baseEnergy}${bonusEnergy ? ` + ${bonusEnergy} bonus` : ''}\n`;
      teks += rewardGiven
        ? `+ Hadiah: ${rewardGiven}`
        : `(Tidak ada drop kali ini)`;

      Exp.sendMessage(
        id,
        {
          text: teks,
        },
        {
          quoted: cht,
        }
      );
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

      // Kurangi bahan & tambahkan item
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

      // === Makanan
      inv.makanan ??= {};
      inv.makanan.roti ??= 0;

      const roti = inv.makanan.roti;
      let makanUsed = 0;
      let penalty = 0;

      const minBase = 10 + (level - 1) * 5;
      const maxBase = 20 + (level - 1) * 5;
      const base = func.getRandomValue(minBase, maxBase);

      let bonusLuck = 0;
      if (luck > 0) {
        const minLucky = 5 + (luck - 1) * 10;
        const maxLucky = 25 + (luck - 1) * 10;
        bonusLuck = func.getRandomValue(minLucky, maxLucky);
      }

      let total = base + bonusLuck;

      if (roti > 0) {
        makanUsed = Math.min(func.getRandomValue(5, 15), Math.floor(roti));
        inv.makanan.roti = Math.max(0, inv.makanan.roti - makanUsed);
        total = Math.floor(total * 1.5);
      } else {
        penalty = Math.floor(total * 0.3);
        total = Math.floor(total - penalty);
      }

      const hasil = {};
      for (const drop of miningDrops) {
        let dropValue = 0;
        if (drop.multiplier != null) {
          dropValue = Math.floor(total * drop.multiplier);
        } else if (drop.rate) {
          const chance = Math.min(drop.rate * level, drop.maxRate);
          dropValue = Math.random() < chance ? 1 : 0;
        }
        hasil[drop.name] = dropValue;
        inv[drop.name] = (inv[drop.name] || 0) + dropValue;
      }

      // === Luka Tambang
      const lukaMenambang = [
        'Terjatuh di dalam tambang gelap',
        'Luka oleh alat pertambangan',
        'Batuan jatuh menimpa',
        'Tersengat listrik saat menambang',
        'Terkunci di dalam tambang',
        'Kehabisan oksigen di dalam tambang',
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

      // === Simpan
      inv.item.pickaxe = pickaxe;
      user.cooldown ??= {};
      user.cooldown.mining = now;

      await inventory.setItem(sender, 'item', inv.item);
      await memories.setItem(sender, 'cooldown', user.cooldown);
      await inventory.setItem(sender, 'healt', inv.healt);
      await inventory.setItem(sender, 'makanan', inv.makanan);
      for (const drop of miningDrops) {
        await inventory.setItem(sender, drop.name, inv[drop.name]);
      }

      const persentase = (a, b) => Math.floor((a / b) * 100);
      const durPickaxe = persentase(pickaxe.durability, pickaxe.maxDurability);
      const durArmor = armor
        ? persentase(armor.durability, armor.maxDurability)
        : 0;

      let text = `*⛏️ Hasil Mining:*\n`;
      for (const drop of miningDrops) {
        const val = hasil[drop.name];
        if (val > 0) text += `- ${drop.label}: +${val} \n`;
      }

      text += `\n*Peralatan:*\n- Pickaxe: ${durPickaxe}% durability\n`;
      if (armor) text += `- Armor: ${durArmor}% durability\n`;
      /*  if (penalty) text += `\n• Penalti: -${penalty} (karena tidak makan)`
		  if (makanUsed) text += `\n• Roti dikonsumsi: ${makanUsed}` */

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

      // Caption hasil
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

      const healAmount = func.getRandomValue(15, 35); // Bisa diatur sesuai balance
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

  //
}
