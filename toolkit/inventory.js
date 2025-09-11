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

  static setDefaults(target, defaults) {
    for (let key in defaults) {
      const defVal = defaults[key];

      if (Array.isArray(defVal)) {
        target[key] ??= [];
        for (const defItem of defVal) {
          const idKey = defItem.nama ? 'nama' : defItem.name ? 'name' : null;
          if (!idKey) continue;

          const exists = target[key].some(
            (item) => item[idKey] === defItem[idKey]
          );
          if (!exists) {
            target[key].push(defItem);
          }
        }
      } else if (typeof defVal === 'object' && defVal !== null) {
        target[key] ??= {};
        this.setDefaults(target[key], defVal);
      } else {
        target[key] ??= defVal;
      }
    }
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
    cfg.rpg ??= {};

    this.setDefaults(cfg.rpg, {
      inflasi: true,
      target: 15,
      baseNaik: 0.25,
      baseTurun: 0.23,
      bonusUser: 0.05,
      userFactor: 85,
      daftar: true,
      healt: 100,
      potion: 5,
      kayu: 75,
      iron: 20,
      gold: 0,
      diamond: 0,

      crate: {
        common: 0,
        uncommon: 0,
        mythic: 0,
        epic: 0,
        legendary: 0,
      },

      item: {
        armor: {},
        pickaxe: {},
        sword: {},
        ax: {},
        fishing_hook: {},
      },

      mancing: [{ nama: 'ikan', icon: '🐟', rate: 50 }],

      berburu: [
        { nama: 'ayam', icon: '🐔', rate: 50 },
        { nama: 'sapi', icon: '🐄', rate: 30 },
        { nama: 'domba', icon: '🐑', rate: 15 },
        { nama: 'kambing', icon: '🐑', rate: 5 },
      ],

      miningItems: {
        batu: { label: 'Batu', rate: 100 },
        coal: { label: 'Coal', rate: 20 },
        iron: { label: 'Besi', rate: 10 },
        copper: { label: 'Tembaga', rate: 8 },
        perak: { label: 'Perak', rate: 5 },
        timah: { label: 'Timah', rate: 4 },
        quartz: { label: 'Quartz', rate: 3 },
        gold: { label: 'Emas', rate: 2 },
        jade: { label: 'Jade', rate: 0.2 },
        emerald: { label: 'Emerald', rate: 0.2 },
        ruby: { label: 'Ruby', rate: 0.15 },
        sapphire: { label: 'Sapphire', rate: 0.1 },
        amethyst: { label: 'Amethyst', rate: 0.1 },
        obsidian: { label: 'Obsidian', rate: 0.05 },
        platinum: { label: 'Platinum', rate: 0.05 },
        diamond: { label: 'Diamond', rate: 0.01 },
      },

      hargaAwal: {
        energy: { beli: 7500 },
        potion: { beli: 100000, jual: 65000 },
        kayu: { beli: 25000, jual: 20000 },
        diamond: { beli: 500000, jual: 42000 },
        apel: { beli: 15000, jual: 12500 },
        ikan: { beli: 10000, jual: 8000 },
        ayam: { beli: 25000, jual: 20000 },
        crate_common: { beli: 50000, jual: 40000 },
        crate_uncommon: { beli: 150000, jual: 120000 },
        coal: { beli: 30000, jual: 24000 },
        iron: { beli: 80000, jual: 65000 },
        perak: { beli: 120000, jual: 100000 },
        gold: { beli: 200000, jual: 170000 },
        copper: { beli: 15000, jual: 10000 },
        timah: { beli: 20000, jual: 15000 },
        quartz: { beli: 35000, jual: 28000 },
        emerald: { beli: 300000, jual: 250000 },
        ruby: { beli: 400000, jual: 350000 },
        sapphire: { beli: 350000, jual: 300000 },
        amethyst: { beli: 250000, jual: 200000 },
        platinum: { beli: 600000, jual: 550000 },
        jade: { beli: 100000, jual: 80000 },
        obsidian: { beli: 250000, jual: 200000 },
        kepiting: { beli: 60000, jual: 48000 },
        gurita: { beli: 100000, jual: 85000 },
        lobster: { beli: 180000, jual: 150000 },
        udang: { beli: 80000, jual: 65000 },
        sapi: { beli: 250000, jual: 210000 },
        domba: { beli: 200000, jual: 170000 },
        kambing: { beli: 220000, jual: 190000 },
        babi: { beli: 180000, jual: 150000 },
        crate_mythic: { beli: 600000, jual: 520000 },
        crate_epic: { beli: 1200000, jual: 1000000 },
        crate_legendary: { beli: 2500000, jual: 2200000 },
      },
    });

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

    this.setDefaults(userData, {
      nama: false,
      umur: false,
      sn: false,

      healt: _default.healt,
      potion: _default.potion,
      kayu: _default.kayu,

      coal: 0,
      perak: 0,
      iron: _default.iron,
      gold: _default.gold,
      diamond: _default.diamond,

      apel: 0,

      ikan: 0,
      babi: 0,
      kepiting: 0,
      gurita: 0,
      lobster: 0,
      udang: 0,
      sapi: 0,
      kambing: 0,
      domba: 0,
      ayam: 0,

      crate: {},

      item: {},
    });

    return userData;
  }
}
