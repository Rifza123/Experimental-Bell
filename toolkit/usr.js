const fs = "fs".import().promises;
const { role } = await './toolkit/role.js'.r();

export class ArchiveMemories {

    static async add(somebody) {
        const obj = {
           chat: 1,
           role: role(1),
           energy: cfg.first.energy
        };
        await fs.writeFile(fol[6] + somebody, JSON.stringify(obj, null, 2));
        return obj;
    }

    static async get(somebody) {
        let status = false;
        let stats = await fs.stat(fol[6] + somebody).catch(() => false);
        if (!stats) return status;

        let usr = await fs.readFile(fol[6] + somebody, 'utf8');
        if (!usr) {
            console.error(`File ${fol[6] + somebody} is empty or not found.`);
            return null; // or handle accordingly
        }

        try {
            let arc = JSON.parse(usr);
            arc.role = await role(arc.chat);
            if(!arc.lastCharge){
                arc.lastCharge = Date.now()
                await fs.writeFile(fol[6] + somebody, JSON.stringify(arc, null, 2));
            }
            let charge = await this.chargeEnergy(arc.energy, arc.lastCharge)
            if(charge >= 5){
                arc.energy += charge
                arc.lastCharge = Date.now()
                await fs.writeFile(fol[6] + somebody, JSON.stringify(arc, null, 2));
            }
            return arc;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.error('File content:', usr);
            throw error; 
        }
    }

    static async addEnergy(somebody, jmlh) {
        let usr = await fs.readFile(fol[6] + somebody, 'utf8');
        if (!usr) {
            console.error(`File ${fol[6] + somebody} is empty or not found.`);
            throw new Error(`File ${fol[6] + somebody} is empty or not found.`);
        }

        try {
            let arc = JSON.parse(usr);
            arc.energy += parseInt(jmlh);
            arc.role = await role(arc.chat);
            await fs.writeFile(fol[6] + somebody, JSON.stringify(arc, null, 2));
            return arc;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.error('File content:', usr);
            throw error;
        }
    }

    static async reduceEnergy(somebody, jmlh) {
        let usr = await fs.readFile(fol[6] + somebody, 'utf8');
        if (!usr) {
            console.error(`File ${fol[6] + somebody} is empty or not found.`);
            throw new Error(`File ${fol[6] + somebody} is empty or not found.`);
        }

        try {
            let arc = JSON.parse(usr);
            arc.role = await role(arc.chat);
            let newEnergy = arc.energy - parseInt(jmlh);
            arc.energy = newEnergy < 0 ? 0 : newEnergy;
            await fs.writeFile(fol[6] + somebody, JSON.stringify(arc, null, 2));
            return arc;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.error('File content:', usr);
            throw error;
        }
    }

    static async addChat(somebody) {
        let usr = await fs.readFile(fol[6] + somebody, 'utf8');
        if (!usr) {
            console.error(`File ${fol[6] + somebody} is empty or not found.`);
            throw new Error(`File ${fol[6] + somebody} is empty or not found.`);
        }

        try {
            let arc = JSON.parse(usr);
            arc.chat += 1;
            arc.role = await role(arc.chat);
            await fs.writeFile(fol[6] + somebody, JSON.stringify(arc, null, 2));
            return arc;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.error('File content:', usr);
            throw error
        }
    }
    
    static async chargeEnergy(energy, time) {
        let maxCharge = 200
        let chargeRate = 10
        let interval = 5 * 60000;

        let elapsedTime = Date.now() - parseInt(time);

        let intervals = Math.floor(elapsedTime / interval)

        let charge = intervals * chargeRate

        if (charge > maxCharge) {
            charge = maxCharge
        }
        if((charge + energy) > maxCharge){
           charge = maxCharge - energy
        }
        return charge
    }
}
