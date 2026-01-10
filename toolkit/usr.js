const fs = 'fs'.import().promises;

export class ArchiveMemories {
  static add(userJid) {
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    let aut = cfg.first.autoai;
    const userData = this.init(userJid, true);
    global.Data.users[userId] = userData;
    return userData;
  }

  static set(userJid, data) {
    if (!data) return 'Data required';
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    if (cfg.register && !this.has(userId)) return false;
    global.Data.users[userId] = data;
    return data;
  }

  static has(userJid) {
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    return userId in Data.users;
  }

  static get(userJid, { is } = {}) {
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    if (cfg.register && !this.has(userId)) return {};
    let userData = this.init(userJid);
    let aut = cfg.first.autoai;
    if (!userData) {
      userData = this.add(userJid);
    }
    if (!userData?.premium) userData.premium = { time: 0 };

    if (!userData?.autoai)
      userData.autoai = {
        ...aut,
        use: 0,
        reset: Date.now() + parseFloat(aut.delay),
        response: false,
      };

    let premium =
      userData.premium && Date.now() < userData.premium.time
        ? userData.premium
        : false;

    try {
      let roles = [];
      if (is?.owner) roles.push('Owner');
      if (is?.groupAdmin) roles.push('Admin Group');
      if (premium) roles.push('User Premium');
      let hubungan = userData.role?.split(',')[0] || 'asing';
      userData.role = [hubungan, ...roles].join(', ');
      if (!userData.energy) userData.energy = 0;
      if (
        !userData.lastCharge ||
        !userData.maxCharge ||
        !userData.chargingSpeed ||
        !userData.chargeRate
      ) {
        userData = {
          ...userData,
          chargingSpeed: cfg.first.chargingSpeed,
          chargeRate: cfg.first.chargeRate,
          maxCharge: cfg.first.maxCharge,
          lastCharge: Date.now(),
        };
      }
      if (!userData.flow || !userData.coins) {
        userData = {
          ...userData,
          flow: cfg.first.flow,
          coins: cfg.first.coins,
        };
      }

      let { chargeRate, maxCharge } = userData;

      if (premium && premium.maxCharge && premium.chargeRate) {
        maxCharge =
          parseFloat(userData.maxCharge) + parseFloat(premium.maxCharge);
        chargeRate =
          parseFloat(userData.chargeRate) + parseFloat(premium.chargeRate);
      }
      if (userData.charging) {
        const chargeAmount = this.chargeEnergy(
          userData.energy,
          userData.lastCharge,
          maxCharge,
          chargeRate,
          userData.chargingSpeed
        );
        if (chargeAmount > 0) {
          userData.energy += chargeAmount;
          userData.lastCharge = Date.now();
        }
        if (userData.energy >= maxCharge) {
          userData.charging = false;
        }
      }
      this.set(userJid, userData);
      return userData;
    } catch (error) {
      console.error('Error processing user data:', error);
      throw error;
    }
  }

  static addEnergy(userJid, amount) {
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    let userData = this.get(userJid);

    if (!userData) {
      console.error(`User data for ${userJid} not found.`);
      throw new Error(`User data for ${userJid} not found.`);
    }

    try {
      userData.energy += parseFloat(amount);
      this.set(userJid, userData);
      return userData;
    } catch (error) {
      console.error('Error adding energy:', error);
      throw error;
    }
  }

  static reduceEnergy(userJid, amount) {
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    let userData = this.get(userJid);

    if (!userData) {
      console.error(`User data for ${userJid} not found.`);
      throw new Error(`User data for ${userJid} not found.`);
    }

    try {
      let newEnergy = userData.energy - parseFloat(amount);
      userData.energy = newEnergy < 0 ? 0 : newEnergy;
      this.set(userJid, userData);
      return userData;
    } catch (error) {
      console.error('Error reducing energy:', error);
      throw error;
    }
  }

  static addChat(userJid) {
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    let userData = this.get(userJid);

    if (!userData) {
      console.error(`User data for ${userJid} not found.`);
      throw new Error(`User data for ${userJid} not found.`);
    }

    try {
      userData.chat += 1;
      this.set(userJid, userData);
      return userData;
    } catch (error) {
      console.error('Error updating chat count:', error);
      throw error;
    }
  }

  static chargeEnergy(
    energy,
    lastChargeTime,
    maxCharge,
    chargeRate,
    chargingInterval
  ) {
    const elapsedTime = Date.now() - parseFloat(lastChargeTime);
    const chargeIntervals = Math.floor(elapsedTime / chargingInterval);
    let chargeAmount = chargeIntervals * chargeRate;

    if (chargeAmount > maxCharge) {
      chargeAmount = maxCharge;
    }
    if (chargeAmount + energy > maxCharge) {
      chargeAmount = maxCharge - energy;
    }

    return chargeAmount;
  }

  static getItem(usr, item) {
    const userJid = String(usr).replace(/[+ -]/g, '');
    const userId = userJid.split('@')[0];

    let userData = this.clearExpiredData(this.get(userJid));

    const defaultItems = {
      role: 'orang asing',
      energy: cfg.first.energy,
      chargingSpeed: cfg.first.chargingSpeed,
      chargeRate: cfg.first.chargeRate,
      maxCharge: cfg.first.maxCharge,
      flow: cfg.first.flow,
      coins: cfg.first.coins,
      fswaps: { list: [] },
    };

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

  static clearExpiredData(userData) {
    const now = Date.now();

    if (userData.quotedQuestionCmd) {
      Object.keys(userData.quotedQuestionCmd).forEach((key) => {
        if (userData.quotedQuestionCmd[key].exp < now) {
          delete userData.quotedQuestionCmd[key];
        }
      });

      if (Object.keys(userData.quotedQuestionCmd).length === 0) {
        delete userData.quotedQuestionCmd;
      }
    }

    if (userData.confess && Array.isArray(userData.confess.sent)) {
      userData.confess.sent = userData.confess.sent.filter(
        (item) => item.exp >= now
      );
    }

    if (userData.confess && Array.isArray(userData.confess.inbox)) {
      userData.confess.inbox = userData.confess.inbox.filter(
        (item) => item.exp >= now
      );
    }

    if (
      userData.confess &&
      Object.keys(userData.confess).every((key) => {
        const value = userData.confess[key];
        return Array.isArray(value)
          ? value.length === 0
          : Object.keys(value).length === 0;
      })
    ) {
      delete userData.confess;
    }

    if (userData.commandExpired && userData.commandExpired < now) {
      delete userData.command;
      delete userData.commandExpired;
    }

    Object.keys(userData).forEach((key) => {
      const value = userData[key];
      if (value && typeof value === 'object' && 'exp' in value) {
        if (value.exp < now) {
          delete userData[key];
        }
      }
    });

    return userData;
  }

  static setItem(usr, item, value) {
    const userJid = String(usr).replace(/[+ -]/g, '');
    const userId = userJid.split('@')[0];

    if (!(userId in global.Data.users)) {
      this.set(userJid, {});
    }

    let userData = this.get(userJid);

    const keys = item.split('.');
    let current = userData;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) current[key] = {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;

    this.set(userJid, userData);
    return global.Data.users[userId];
  }

  static delItem(usr, item) {
    const userJid = String(usr).replace(/[+ -]/g, '');
    const userId = userJid.split('@')[0];
    if (!(userId in global.Data.users)) return false;

    const keys = item.split('.');
    let current = this.get(userJid);
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) return false;
      current = current[key];
    }
    delete current[keys[keys.length - 1]];
    this.set(userJid, current);
    return global.Data.users[userId];
  }

  static async combineAllUserFiles() {
    try {
      let files = await fs.readdir(fol[6]);
      let combinedData = {};

      for (let file of files) {
        let filePath = path.join(fol[6], file);
        let fileContent;

        try {
          fileContent = await fs.readFile(filePath, 'utf8');
        } catch (readError) {
          console.error(`Error reading file ${filePath}:`, readError);
          continue;
        }

        try {
          let userData = JSON.parse(fileContent);
          combinedData[file] = userData;
        } catch (parseError) {
          console.error(
            `Error parsing JSON from file ${filePath}:`,
            parseError
          );
          continue;
        }
      }

      await fs.writeFile('users.json', JSON.stringify(combinedData, null, 2));
      console.log('All user data combined successfully!');
    } catch (error) {
      console.error('Error combining user files:', error);
      throw error;
    }
  }

  static init(userJid, New = false) {
    /**
     * Inisialisasi konfigurasi default data user
     *
     * Untuk memastikan setiap user memiliki data yang lengkap
     **/
    const userId = String(userJid).replace(/[+ -]/g, '').split('@')[0];
    if (!(userId in global.Data.users) && !New) return false;
    let aut = cfg.first.autoai;
    let userData = Data.users[userId] || {};
    userData.chat ??= 1;
    userData.role ??= 'Orang Asing';
    userData.energy ??= cfg.first.energy;
    userData.chargingSpeed ??= cfg.first.chargingSpeed;
    userData.chargeRate ??= cfg.first.chargeRate;
    userData.maxCharge ??= cfg.first.maxCharge;
    userData.charging ??= false;
    userData.premium ??= { time: 0 };
    userData.autoai ??= {
      ...aut,
      use: 0,
      reset: Date.now() + parseFloat(aut.delay),
      response: false,
    };
    userData.lastCharge ??= Date.now();
    userData.cooldown ??= {};
    userData.cooldown.claim ??= 0;
    return userData;
  }
}
