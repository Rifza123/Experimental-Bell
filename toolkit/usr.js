const fs = "fs".import().promises;
const { role } = await `${fol[0]}role.js`.r()

export class ArchiveMemories {
    static add(userJid) {
        const userId = userJid.split("@")[0];
        let aut = cfg.first.autoai

        const userData = {
            chat: 1,
            role: role(1),
            energy: cfg.first.energy,
            chargingSpeed: cfg.first.chargingSpeed,
            chargeRate: cfg.first.chargeRate,
            maxCharge: cfg.first.maxCharge,
            flow: cfg.first.flow,
            coins: cfg.first.coins,
            charging: false,
            premium: { time:0 },
            autoai: { ...aut, use:0, reset:(Date.now()+parseFloat(aut.delay)), response:false },
            lastCharge: Date.now()
        };
        global.Data.users[userId] = userData;
        return userData;
    }

    static async get(userJid) {
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId];
        let aut = cfg.first.autoai
        if (!userData) {
            userData = this.add(userJid)
        }
        if(!userData?.premium) userData.premium = { time:0 }
        
        if(!userData?.autoai) userData.autoai = { ...aut, use:0, reset:Date.now()+parseFloat(aut.delay), response:false }

        let premium = userData.premium ? Date.now() < userData.premium.time : false

        try {
            userData.role = role(userData.chat);
            if (!userData.lastCharge || !userData.maxCharge || !userData.chargingSpeed || !userData.chargeRate) {
                userData = {
                    ...userData,
                    chargingSpeed: cfg.first.chargingSpeed,
                    chargeRate: cfg.first.chargeRate,
                    maxCharge: cfg.first.maxCharge,
                    lastCharge: Date.now()
                };
            }
            if (!userData.flow || !userData.coins) {
                userData = {
                    ...userData,
                    flow: cfg.first.flow,
                    coins: cfg.first.coins
                };
            }
            let { chargeRate, maxCharge } = userData
            if(premium && premium.maxCharge && premium.chargeRate){
                maxCharge = parseFloat(userData.maxCharge) + parseFloat(premium.maxCharge)
                chargeRate = parseFloat(userData.chargeRate) + parseFloat(premium.chargeRate)
            }
            if(userData.charging){
                const chargeAmount = this.chargeEnergy(userData.energy, userData.lastCharge, maxCharge, chargeRate, userData.chargingSpeed); 
                if (chargeAmount > 0) {
                    userData.energy += chargeAmount;
                    userData.lastCharge = Date.now();
                }
                if(userData.energy >= maxCharge){
                    userData.charging = false
                }
            }
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error processing user data:', error);
            throw error;
        }
    }

    static addEnergy(userJid, amount) {
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId];
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`);
            throw new Error(`User data for ${userJid} not found.`);
        }

        try {
            userData.energy += parseFloat(amount);
            userData.role = role(userData.chat); 
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error adding energy:', error);
            throw error;
        }
    }

    static reduceEnergy(userJid, amount) {
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId];
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`);
            throw new Error(`User data for ${userJid} not found.`);
        }

        try {
            userData.role = role(userData.chat); 
            let newEnergy = userData.energy - parseFloat(amount);
            userData.energy = newEnergy < 0 ? 0 : newEnergy;
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error reducing energy:', error);
            throw error;
        }
    }

    static addChat(userJid) {
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId];
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`);
            throw new Error(`User data for ${userJid} not found.`);
        }

        try {
            userData.chat += 1;
            userData.role = role(userData.chat); 
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error updating chat count:', error);
            throw error;
        }
    }
    
    static chargeEnergy(energy, lastChargeTime, maxCharge, chargeRate, chargingInterval) {
        const elapsedTime = Date.now() - parseFloat(lastChargeTime);
        const chargeIntervals = Math.floor(elapsedTime / chargingInterval);
        let chargeAmount = chargeIntervals * chargeRate;

        if (chargeAmount > maxCharge) {
            chargeAmount = maxCharge;
        }
        if ((chargeAmount + energy) > maxCharge) {
            chargeAmount = maxCharge - energy;
        }

        return chargeAmount;
    }
    
    static getItem(usr, item) {
        const userJid = String(usr)
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId]
        let items = {
          chat: 0,
          role: 0,
          energy: cfg.first.energy,
          chargingSpeed: cfg.first.chargingSpeed,
          chargeRate: cfg.first.chargeRate,
          maxCharge: cfg.first.maxCharge,
          flow: cfg.first.flow,
          coins: cfg.first.coins,
          fswaps: { list: [] }
        }
        if(!(item in userData)) {
            if(!(item in items)) return false
            userData[item] = items[item]
        }
        global.Data.users[userId] = userData;
        return userData[item]
    }
    
    static setItem(usr, item, value) {
        const userJid = String(usr)
        const userId = userJid.split("@")[0];
        global.Data.users[userId][item] = value;
        return global.Data.users[userId];
    }
    
    static delItem(usr, item) {
        const userJid = String(usr)
        const userId = userJid.split("@")[0];
            delete global.Data.users[userId][item]
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
                    console.error(`Error parsing JSON from file ${filePath}:`, parseError);
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
}
