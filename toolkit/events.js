/*!-======[ Module Imports ]======-!*/
const { readdirSync } = "fs".import();
const path = "path".import()
let isLoad = false
/*!-======[ Fubctions Imports ]======-!*/
const { func } = await (fol[0]+"func.js").r();
const { ArchiveMemories } = await (fol[0] + "usr.js").r();
const { bgcolor } = await (fol[0]+"color.js").r();
const timestamp = () => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(new Date())
}

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
        try {
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
        } catch (error) {
            console.error(`${bgcolor("[ERROR]","red")} ${timestamp()}\n- Error in 'on' method:\nDetails: ${error.stack}`);
        }
    }

    async loadEventHandler(file) {
        try {
            if (Data.Events.has(file)) {
                const on = Data.Events.get(file);
                await on({ ...this, ev: this });
                return on;
            }

            const { default: on } = await `${fol[7] + file}`.r()
            await on({ ...this, ev: this });
            Data.Events.set(file, on);
            return on;
        } catch (error) {
            console.error(`${bgcolor("[ERROR]","red")} ${timestamp()}\n- Error loading event handler for file: ${fol[7] + file}\nDetails: ${error.stack}`)
            return null;
        }
    }

    async loadEventHandlers() {
        if(isLoad) return
        try {
            isLoad = true;
            this.eventFiles = readdirSync(fol[7]).filter(file => file.endsWith('.js'));
            for (const file of this.eventFiles) {
                await this.loadEventHandler(file);
            }
        } catch (error) {
            console.error(`${bgcolor("[ERROR]","red")} ${timestamp()}\n- Error loading event handlers:\nDetails: ${error.stack}`);
        }
    }

    async reloadEventHandlers() {
        try {
            this.eventFiles = readdirSync(fol[7]).filter(file => file.endsWith('.js'));
            for (const file of this.eventFiles) {
                Data.Events.delete(file);
                await this.loadEventHandler(file);
            }
        } catch (error) {
            console.error(`${bgcolor("[ERROR]","red")} ${timestamp()}\n- Error reloading event handlers:\nDetails: ${error.stack}`);
        }
    }

    async emit(event) {
        try {
            !isLoad && await this.loadEventHandlers()
            const eventFile = Data.events[event]?.eventFile;
            if (!eventFile) return;
            
            await this.loadEventHandler(eventFile);
            const ev = Data.events[event];
            if (!ev) return;
            let urls = (this.is.quoted?.url || this.is.url)?.length < 1 ? null : (this.is.quoted?.url || this.is.url)
            let args = this.cht?.q
            let cht = this.cht
            let media = null;

            if (this.cht.memories.energy < 1 && ev.energy) {
                return this.cht.reply(`Males😞\n⚡️Energy: ${this.cht.memories.energy}`);
            }

            if (ev.args && !this.cht.q) return this.cht.reply(ev.args);
            
            if (ev.media) {
                const { type, msg, etc } = ev.media;
                let mediaType = this.getMediaType();
                if (!type.includes(mediaType)) {
                    return this.cht.reply(msg || `Reply atau kirim ${type.join("/")} dengan caption: ${cht.msg}!`);
                }

                if (mediaType === "audio") {
                    if (etc && this.is.quoted?.audio?.seconds > etc.seconds) {
                        return this.cht.reply(`Audio tidak boleh lebih dari ${etc.seconds}detik`);
                    }
                }
                
                if (mediaType === "video") {
                    if (etc && this.is.quoted?.video?.seconds > etc.seconds) {
                        return this.cht.reply(`Video tidak boleh lebih dari ${etc.seconds}detik`);
                    }
                }
                
                if (mediaType === "sticker") {
                    if (etc && etc.isNoAnimated && this.is.quoted?.sticker?.isAnimated) {
                        return this.cht.reply("Sticker harus tipe Image!");
                    }
                    if (etc && etc.isAnimated && !this.is.quoted?.sticker?.isAnimated) {
                        return this.cht.reply("Sticker harus tipe Video!");
                    }
                    if (etc && etc.isAvatar && !this.is.quoted?.sticker?.isAvatar) {
                        return this.cht.reply("Sticker harus tipe Avatar!");
                    }
                }

                let download = this.is.quoted ? this.is.quoted.download : this.cht.download;
                let save = this.is.quoted ? this.is.quoted[mediaType] : this.cht[mediaType];
                media = ev.media.save
                    ? await this.Exp.func.downloadSave(save, mediaType)
                    : await download();
            }
            
            if (ev.urls) {
               if(!urls) return this.cht.reply(ev.urls.msg);
               if(ev.urls.formats){
                   let isFormatsUrl = urls.some(url => 
                       ev.urls.formats.some(keyword => url.toLowerCase().includes(keyword.toLowerCase()))
                   )
                   if(!isFormatsUrl) return this.cht.reply(`Url yang diberikan harus berupa url seperti:\n- ${ev.urls.formats.join("\n- ")}`)
               }
            }

            if (ev.energy) {
                await ArchiveMemories.reduceEnergy(this.cht.sender, ev.energy);
                await this.cht.reply(`-${ev.energy} Energy⚡`);
            }
            
            const resolves = { media, urls, args, cht }
            await ev.resolve(resolves);
            await func.addCmd();
            await func.addCMDForTop(event);
            return
        } catch (error) {
            return console.error(`${bgcolor("[ERROR]","red")} ${timestamp()}\n- Error emitting "${event}"`, error.stack);
        }
    }
}

export { EventEmitter };