const fs = 'fs'.import().promises;

export class Inventory {
  static add(userJid) {
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    const userData = this.init(userJid, true);
    global.Data.inventories[userId] = userData;
    return userData;
  }

  static set(userJid, data) {
    if (!data) return 'Data required';
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    global.Data.inventories[userId] = data;
    return data;
  }

  static get(userJid) {
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    let userData = this.init(userJid);
    if (!userData) {
      userData = this.add(userJid);
    }
    return userData;
  }

  static getItem(usr, item) {
    const userJid = String(usr).replace(/[+ -]/g, '');
    const userId = userJid.split('@')[0];
    if (!(userId in global.Data.inventories)) return false;

    let userData = this.get(usr);

    const defaultItems = this.initCfg();

    const value = item
      .split('.')
      .reduce((acc, key) => acc && acc[key], userData);

    if (value === undefined) {
      const defaultValue = item
        .split('.')
        .reduce((acc, key) => acc && acc[key], defaultItems);
      if (defaultValue === undefined) return false;
      this.setItem(usr, item, defaultValue);
      return defaultValue;
    }
    return value;
  }

  static setItem(usr, item, value) {
    const userJid = String(usr).replace(/[+ -]/g, '');
    const userId = userJid.split('@')[0];

    const keys = item.split('.');
    let current = this.get(usr);
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) current[key] = {};
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    let set = this.set(usr, current);
    return set;
  }

  static delItem(usr, item) {
    const userJid = String(usr).replace(/[+ -]/g, '');
    const userId = userJid.split('@')[0];
    if (!(userId in global.Data.inventories)) return false;

    const keys = item.split('.');
    let current = global.Data.inventories[userId];
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) return false;
      current = current[key];
    }
    delete current[keys[keys.length - 1]];
    let set = this.set(usr, current);
    return set;
  }

  static initCfg() {
    /**
     * Inisialisasi konfigurasi default cfg
     *
     * Fungsi ini digunakan untuk menetapkan nilai awal (default) dari berbagai
     * properti yang diperlukan, termasuk:
     * - Resource awal pemain (kayu, iron, gold, diamond, dll.)
     * - Stok awal item dan peti
     * - Konfigurasi modular seperti mancing, berburu, dan mining
     * - Harga awal item tertentu
     *
     * Tujuannya adalah agar struktur data `cfg` tetap konsisten dan aman digunakan saat ada pembaruan pada bagian ini
     *
     * NOTE:
     * - Konfigurasi ini hanya dijalankan sekali (saat pertama kali `cfg` diakses).
     * - Tidak menimpa konfigurasi yang sudah ada.
     */
    cfg.rpg = cfg.rpg || {};
    cfg.rpg.flow ??= 1;
    cfg.rpg.coins ??= 1;
    cfg.rpg.healt ??= 100;
    cfg.rpg.potion ??= 5;
    cfg.rpg.kayu ??= 75;
    cfg.rpg.iron ??= 20;
    cfg.rpg.gold ??= 0;
    cfg.rpg.diamond ??= 0;
    cfg.rpg.crate ??= {};
    cfg.rpg.crate.common ??= 0;
    cfg.rpg.crate.uncommon ??= 0;
    cfg.rpg.crate.mythic ??= 0;
    cfg.rpg.crate.epic ??= 0;
    cfg.rpg.crate.legendary ??= 0;
    cfg.rpg.item ??= {};
    cfg.rpg.item.armor ??= {};
    cfg.rpg.item.pickaxe ??= {};
    cfg.rpg.item.sword ??= {};
    cfg.rpg.item.ax ??= {};
    cfg.rpg.item.fishing_hook ??= {};
    cfg.rpg ??= {};
    cfg.rpg.mancing ??= [
      {
        nama: 'ikan',
        icon: '🐟',
        rate: 50,
      },
    ];

    cfg.rpg.berburu ??= [
      {
        nama: 'ayam',
        icon: '🐔',
        rate: 50,
      },
      {
        nama: 'sapi',
        icon: '🐄',
        rate: 30,
      },
      {
        nama: 'domba',
        icon: '🐑',
        rate: 15,
      },
      {
        nama: 'kambing',
        icon: '🐑',
        rate: 5,
      },
    ];

    cfg.rpg.miningDrops ??= [
      {
        name: 'iron',
        label: 'Besi',
        rate: 1.0,
        multiplier: 0.6,
      },
      {
        name: 'gold',
        label: 'Emas',
        rate: 0.037,
        multiplier: 0.3,
      },
      {
        name: 'diamond',
        label: 'Berlian',
        rate: 0.008,
        multiplier: null,
        maxRate: 0.08,
      },
    ];

    cfg.rpg.hargaAwal = {
      energy: { beli: 100 },
      potion: { jual: 100, beli: 100 },
      kayu: { beli: 100 },
      diamond: { jual: 100, beli: 100 },
    };
    return cfg;
  }

  static init(userJid, New = false) {
    /**
     * Inisialisasi konfigurasi default data user
     *
     * Untuk memastikan setiap user memiliki data yang lengkap
     */
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    if (!(userId in global.Data.inventories) && !New) return false;

    let _default = this.initCfg().rpg;
    const userData = global.Data.inventories[userId] || {};

    userData.flow ??= _default.flow;
    userData.coins ??= _default.coins;
    userData.healt ??= _default.healt;
    userData.potion ??= _default.potion;
    userData.kayu ??= _default.kayu;
    userData.iron ??= _default.iron;
    userData.gold ??= _default.gold;
    userData.diamond ??= _default.diamond;

    userData.apel ??= 0;
    userData.roti ??= 0;
    userData.daging ??= 0;
    userData.gandum ??= 0;
    userData.ikan ??= 0;
    userData.sapi ??= 0;
    userData.kambing ??= 0;
    userData.domba ??= 0;
    userData.ayam ??= 0;

    userData.crate ??= {};

    userData.item ??= {};

    return userData;
  }
}
