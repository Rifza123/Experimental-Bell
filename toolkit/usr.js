const fs = "fs".import().promises;
const { role } = await `${fol[0]}role.js`.r()

export class ArchiveMemories {
    static add(userJid) {
        const userId = String(userJid).replace(/[+ -]/g, "").split("@")[0]
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

    static async get(userJid, { is }={}) {
        const userId = String(userJid).replace(/[+ -]/g, "").split("@")[0]
        let userData = global.Data.users[userId]
        let aut = cfg.first.autoai
        if (!userData) {
            userData = this.add(userJid)
        }
        if(!userData?.premium) userData.premium = { time:0 }
        
        if(!userData?.autoai) userData.autoai = { ...aut, use:0, reset:Date.now()+parseFloat(aut.delay), response:false }

        let premium = (userData.premium && Date.now() < userData.premium.time) ? userData.premium : false

        try {
            let roles = [role(userData.chat)]
            is?.owner && roles.push('owner')
            is?.groupAdmin && roles.push('admin group')
            premium && roles.push('user premium')
            userData.role = roles.join(', ')
            if(!userData.energy) userData.energy = 0
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
                const chargeAmount = this.chargeEnergy(userData.energy, userData.lastCharge, maxCharge, chargeRate, userData.chargingSpeed) 
                if (chargeAmount > 0) {
                    userData.energy += chargeAmount;
                    userData.lastCharge = Date.now()
                }
                if(userData.energy >= maxCharge){
                    userData.charging = false
                }
            }
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error processing user data:', error)
            throw error;
        }
    }

    static addEnergy(userJid, amount) {
        const userId = String(userJid).replace(/[+ -]/g, "").split("@")[0]
        let userData = global.Data.users[userId]
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`)
            throw new Error(`User data for ${userJid} not found.`)
        }

        try {
            userData.energy += parseFloat(amount)
            userData.role = role(userData.chat) 
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error adding energy:', error)
            throw error;
        }
    }

    static reduceEnergy(userJid, amount) {
        const userId = String(userJid).replace(/[+ -]/g, "").split("@")[0]
        let userData = global.Data.users[userId]
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`)
            throw new Error(`User data for ${userJid} not found.`)
        }

        try {
            userData.role = role(userData.chat) 
            let newEnergy = userData.energy - parseFloat(amount)
            userData.energy = newEnergy < 0 ? 0 : newEnergy;
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error reducing energy:', error)
            throw error;
        }
    }

    static addChat(userJid) {
        const userId = String(userJid).replace(/[+ -]/g, "").split("@")[0]
        let userData = global.Data.users[userId]
        
        if (!userData) {
            console.error(`User data for ${userJid} not found.`)
            throw new Error(`User data for ${userJid} not found.`)
        }

        try {
            userData.chat += 1;
            userData.role = role(userData.chat) 
            global.Data.users[userId] = userData;
            return userData;
        } catch (error) {
            console.error('Error updating chat count:', error)
            throw error;
        }
    }
    
    static chargeEnergy(energy, lastChargeTime, maxCharge, chargeRate, chargingInterval) {
        const elapsedTime = Date.now() - parseFloat(lastChargeTime)
        const chargeIntervals = Math.floor(elapsedTime / chargingInterval)
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
        const userJid = String(usr).replace(/[+ -]/g, "")
        const userId = userJid.split("@")[0]
        if (!(userId in global.Data.users)) return false;

        let userData = this.clearExpiredData(global.Data.users[userId])

        const defaultItems = {
            chat: 0,
            role: 0,
            energy: cfg.first.energy,
            chargingSpeed: cfg.first.chargingSpeed,
            chargeRate: cfg.first.chargeRate,
            maxCharge: cfg.first.maxCharge,
            flow: cfg.first.flow,
            coins: cfg.first.coins,
            fswaps: { list: [] },
        };

        const value = item.split('.').reduce((acc, key) => acc && acc[key], userData)

        if (value === undefined) {
            const defaultValue = item.split('.').reduce((acc, key) => acc && acc[key], defaultItems)
            if (defaultValue === undefined) return false;
            this.setItem(usr, item, defaultValue) 
            return defaultValue;
        }
        return value;
    }
    
    static clearExpiredData(userData) {
       const now = Date.now()

       if (userData.quotedQuestionCmd) {
          Object.keys(userData.quotedQuestionCmd).forEach((key) => {
              if (userData.quotedQuestionCmd[key].exp < now) {
                  delete userData.quotedQuestionCmd[key]
              }
          })

          if (Object.keys(userData.quotedQuestionCmd).length === 0) {
              delete userData.quotedQuestionCmd;
          }
       }
  
       if (userData.confess && Array.isArray(userData.confess.sent)) {
          userData.confess.sent = userData.confess.sent.filter((item) => item.exp >= now)
       }
  
       if (userData.confess && Array.isArray(userData.confess.inbox)) {
          userData.confess.inbox = userData.confess.inbox.filter((item) => item.exp >= now)
       }
  
       if (userData.confess &&
          Object.keys(userData.confess).every((key) => {
             const value = userData.confess[key]
              return Array.isArray(value) ? value.length === 0 : Object.keys(value).length === 0;
          })
       ) {
          delete userData.confess;
       }
  
       if (userData.commandExpired && userData.commandExpired < now) {
          delete userData.command;
          delete userData.commandExpired;
       }
      
       Object.keys(userData).forEach((key) => {
          const value = userData[key]
          if (value && typeof value === "object" && "exp" in value) {
              if (value.exp < now) {
                  delete userData[key]
              }
          }
       })

       return userData
    }

    static setItem(usr, item, value) {
        const userJid = String(usr).replace(/[+ -]/g, "")
        const userId = userJid.split("@")[0]
        if (!(userId in global.Data.users)) {
            global.Data.users[userId] = {}
        }

        const keys = item.split('.')
        let current = global.Data.users[userId]
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            if (!(key in current)) current[key] = {}
            current = current[key]
        }
        current[keys[keys.length - 1]] = value
        return global.Data.users[userId]
    }

    static delItem(usr, item) {
        const userJid = String(usr).replace(/[+ -]/g, "")
        const userId = userJid.split("@")[0]
        if (!(userId in global.Data.users)) return false

        const keys = item.split('.')
        let current = global.Data.users[userId]
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            if (!(key in current)) return false
            current = current[key]
        }
        delete current[keys[keys.length - 1]]
        return global.Data.users[userId]
    }

    
    static async combineAllUserFiles() {
        try {
            let files = await fs.readdir(fol[6])
            let combinedData = {};

            for (let file of files) {
                let filePath = path.join(fol[6], file)
                let fileContent;
                
                try {
                    fileContent = await fs.readFile(filePath, 'utf8')
                } catch (readError) {
                    console.error(`Error reading file ${filePath}:`, readError)
                    continue; 
                }

                try {
                    let userData = JSON.parse(fileContent)
                    combinedData[file] = userData;
                } catch (parseError) {
                    console.error(`Error parsing JSON from file ${filePath}:`, parseError)
                    continue; 
                }
            }

            await fs.writeFile('users.json', JSON.stringify(combinedData, null, 2))
            console.log('All user data combined successfully!')
        } catch (error) {
            console.error('Error combining user files:', error)
            throw error;
        }
    }
}
