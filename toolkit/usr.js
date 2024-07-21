const fs = "fs".import().promises;
const { role } = await './toolkit/role.js'.r();

export class ArchiveMemories {
    static async add(userJid) {
        const userId = userJid.split("@")[0];
        const userData = {
            chat: 1,
            role: await role(1),
            energy: cfg.first.energy,
            chargingSpeed: 1800000,
            chargeRate: 10,
            maxCharge: 200,
            lastCharge: Date.now()
        };
        global.Data.users[userId] = userData;
        return userData;
    }

    static async get(userJid) {
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId];
        
        if (!userData) {
            await this.add(userJid);
            userData = global.Data.users[userId];
        }

        try {
            userData.role = await role(userData.chat);
            if (!userData.lastCharge || !userData.maxCharge || !userData.chargingSpeed || !userData.chargeRate) {
                userData = {
                    ...userData,
                    chargingSpeed: 3600000,
                    chargeRate: 10,
                    maxCharge: 200,
                    lastCharge: Date.now()
                };
            }
            const chargeAmount = await this.chargeEnergy(userData.energy, userData.lastCharge, userData.maxCharge, userData.chargeRate, userData.chargingSpeed);
            if (chargeAmount > 0) {
                userData.energy += chargeAmount;
                userData.lastCharge = Date.now();
            }
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error processing user data:', error);
            throw error;
        }
    }

    static async addEnergy(userJid, amount) {
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId];
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`);
            throw new Error(`User data for ${userJid} not found.`);
        }

        try {
            userData.energy += parseInt(amount);
            userData.role = await role(userData.chat);
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error adding energy:', error);
            throw error;
        }
    }

    static async reduceEnergy(userJid, amount) {
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId];
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`);
            throw new Error(`User data for ${userJid} not found.`);
        }

        try {
            userData.role = await role(userData.chat);
            let newEnergy = userData.energy - parseInt(amount);
            userData.energy = newEnergy < 0 ? 0 : newEnergy;
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error reducing energy:', error);
            throw error;
        }
    }

    static async addChat(userJid) {
        const userId = userJid.split("@")[0];
        let userData = global.Data.users[userId];
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`);
            throw new Error(`User data for ${userJid} not found.`);
        }

        try {
            userData.chat += 1;
            userData.role = await role(userData.chat);
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error updating chat count:', error);
            throw error;
        }
    }
    
    static async chargeEnergy(energy, lastChargeTime, maxCharge, chargeRate, chargingInterval) {
        const elapsedTime = Date.now() - parseInt(lastChargeTime);
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
