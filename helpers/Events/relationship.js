/*!-======[ Module Imports ]======-!*/
const fs = "fs".import();
const { default: ms } = await "ms".import()
/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, store, ev, is }) {
    ev.on({ 
        cmd: ['status','profil','profile','relationship'],
        listmenu: ['profile'],
        tag: 'relationship'
    }, async() => {
        let speed = ms(cht.memories.chargingSpeed)
        
        let txt = "*!-====[ Profile ]====-!*\n"
            txt += "\nNama: " + cht.pushName
            txt += "\nRole: " + cht.memories.role
            txt += "\nChatting: " + cht.memories.chat
            txt += "\nEnergy: (⚡️)" + cht.memories.energy
            txt += "\n\n ▪︎ *[🔋] Boost*"
            txt += "\n- isCharging: " + (cht.memories.energy< cht.memories.maxCharge)
            txt += "\n- Charging Speed: (⚡)" + cht.memories.chargeRate + " Energy/" + speed
            txt += "\n- Max Charge: " + cht.memories.maxCharge
            txt += "\n- Last Charge: " + Exp.func.dateFormatter(cht.memories.lastCharge)
        cht.reply(txt)
    })
    
}