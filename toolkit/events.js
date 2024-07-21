/*!-======[ Module Imports ]======-!*/
const { readdirSync } = "fs".import();
const path = "path".import()
global.isLoad = false
/*!-======[ Fubctions Imports ]======-!*/
const { func } = await (fol[0]+"func.js").r();
const { ArchiveMemories } = await (fol[0] + "usr.js").r();

class EventEmitter {
    constructor({ Exp, store, cht, ai, is }) {
        this.Exp = Exp;
        this.store = store;
        this.cht = cht;
        this.ai = ai;
        this.is = is;
        this.eventFiles = [];
        this.dataEvents = Data.Events;
    }

    getMediaType() {
        let type = (this.is.image || this.is.quoted?.image) ? "image"
            : (this.is.audio || this.is.quoted?.audio) ? "audio"
            : (this.is.video || this.is.quoted?.video) ? "video"
            : (this.is.sticker || this.is.quoted?.sticker) ? "sticker"
            : (this.is.document || this.is.quoted?.document) ? "document"
            : "text";
        return type;
    }

    on(eventMap, resolve) {
        if (typeof eventMap !== 'object' || Array.isArray(eventMap)) {
            throw new Error('Argumen pertama harus berupa objek');
        }
        const { cmd, energy, ...rest } = eventMap;
        if (!Array.isArray(cmd)) {
            throw new Error('\'cmd\' harus berupa array');
        }
        const stack = new Error().stack.split('\n');
        const callerLine = stack[2];
        const fileNameMatch = callerLine.match(/\((.*?):\d+:\d+\)/);
        let eventFile = path.basename(fileNameMatch ? fileNameMatch[1] : 'Unknown file');
        cmd.forEach(event => {
            Data.events[event] = { ...rest, resolve, energy, eventFile };
        });
    }

    async loadEventHandler(file) {
        if (Data.Events.has(file)) {
            const on = Data.Events.get(file);
            await on({ ...this, ev: this });
            return on;
        }

        try {
            const { default: on } = await `${fol[7] + file}`.r();
            await on({ ...this, ev: this });
            Data.Events.set(file, on);
            return on;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async loadEventHandlers() {
        global.isLoad = true;
        this.eventFiles = readdirSync(fol[7]).filter(file => file.endsWith('.js'));
        for (const file of this.eventFiles) {
            await this.loadEventHandler(file);
        }
    }

    async reloadEventHandlers() {
        this.eventFiles = readdirSync(fol[7]).filter(file => file.endsWith('.js'));
        for (const file of this.eventFiles) {
            Data.Events.delete(file);
            await this.loadEventHandler(file);
        }
    }

    async emit(event) {
        const eventFile = Data.events[event]?.eventFile;
        if (!eventFile) return;

        await this.loadEventHandler(eventFile);
        const ev = Data.events[event];
        if (!ev) return;

        let media = null;

        await func.addCmd();
        await func.addCMDForTop(event);

        if (this.cht.memories.energy < 1 && ev.energy) {
            return this.cht.reply(`Males😞\n⚡️Energy: ${this.cht.memories.energy}`);
        }

        if (ev.args && !this.cht.q) {
            return this.cht.reply(ev.args);
        }

        if (ev.media) {
            const { type, msg, etc } = ev.media;
            let mediaType = this.getMediaType();
            if (!type.includes(mediaType)) {
                return this.cht.reply(msg);
            }

            if (mediaType === "audio") {
                if (!(this.is.image || this.is.quoted?.audio)) {
                    return this.cht.reply(msg);
                }
                if (etc && this.is.quoted?.audio?.seconds > etc.seconds) {
                    return this.cht.reply(etc.msg);
                }
            }

            let download = this.is.quoted ? this.is.quoted.download : this.cht.download;
            let save = this.is.quoted ? this.is.quoted[mediaType] : this.cht[mediaType];
            media = ev.media.save
                ? await this.Exp.func.downloadSave(save, mediaType)
                : await download();
        }

        if (ev.energy) {
            await ArchiveMemories.reduceEnergy(this.cht.sender, ev.energy);
            await this.cht.reply(`-${ev.energy} Energy⚡`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        ev.resolve({ media });
    }
}

export { EventEmitter };