/*!-======[ Module Imports ]======-!*/
const { readdirSync } = "fs".import();

/*!-======[ Fubctions Imports ]======-!*/
const { func } = await "./toolkit/func.js".r();
const { ArchiveMemories } = await "./toolkit/usr.js".r();

class EventEmitter {
    constructor({ Exp, cht, is }) {
        this.Exp = Exp;
        this.c = cht;
        this.is = is;
        this.eventFiles = [];
        this.dataEvents = Data.Events
    }

    on(eventMap, resolve) {
        if (typeof eventMap !== 'object' || Array.isArray(eventMap)) {
            throw new Error('Argumen pertama harus berupa objek');
        }
        const { cmd, energy, ...rest } = eventMap;
        if (!Array.isArray(cmd)) {
            throw new Error('\'cmd\' harus berupa array');
        }

        cmd.forEach(event => {
            Data.events[event] = { ...rest, resolve, energy };
        });
    }

    async emit(event) {
        const ev = Data.events[event];
        if (!ev) return;
        let media = null;
        await func.addCmd();
        await func.addCMDForTop(event);
        if (this.c.memories.energy < 1 && ev.energy) {
            return this.c.reply(`Males😞\n⚡️Energy: ${this.c.memories.energy}`);
        }
        if (ev.args && !this.c.q) return this.c.reply(ev.args);
        if (ev.media) {
            const { type, msg, etc } = ev.media;
            if (type === "image" && !this.is.quoted?.image) return this.c.reply(msg);
            if (type === "audio") {
                if (!this.is.quoted?.audio) return this.c.reply(msg);
                if (etc && this.is.quoted?.audio?.seconds > etc.seconds) return this.c.reply(etc.msg);
            }
            media = ev.media.save
                ? await this.Exp.func.downloadSave(this.is.quoted[type], type)
                : await this.c.quoted.download();
        }

        if (ev.energy) {
            await ArchiveMemories.reduceEnergy(this.c.sender, ev.energy);
            await this.c.reply(`-${ev.energy} Energy⚡`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        ev.resolve({ media });
    }
    
    async loadEventHandler(file, exported) {
        if (!Data.Events.has(file)) {
            const { default: on } = await `./helpers/Events/${file}`.r();
            Data.Events.set(file, on);
        }
    }

    async loadEventHandlers(exported) {
        this.eventFiles = readdirSync('./helpers/Events').filter(file => file.endsWith('.js'));
        for (const file of this.eventFiles) {
            await this.loadEventHandler(file, exported);
            let on = this.dataEvents.get(file);
            await on(exported);
        }
    }
    
    async reloadEventHandlers(exported) {
        this.eventFiles = readdirSync('./helpers/Events').filter(file => file.endsWith('.js'));
        for (const file of this.eventFiles) {
            Data.Events.delete(file);
            await this.loadEventHandler(file, exported);
            let on = Data.Events.get(file);
            await on(exported);
        }
    }
}

export { EventEmitter };