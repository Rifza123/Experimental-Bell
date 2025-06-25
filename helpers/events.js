/*!-======[ Messages ]======-!*/
let { messages } = Data.infos;

/*!-======[ Module Imports ]======-!*/
const { readdirSync } = 'fs'.import();
const path = 'path'.import();
let isLoad = false;
/*!-======[ Fubctions Imports ]======-!*/
const { ArchiveMemories } = await (fol[0] + 'usr.js').r();
const { bgcolor } = await (fol[0] + 'color.js').r();
const { GeminiImage } = await (fol[2] + 'gemini.js').r();

const timestamp = () => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(new Date());
};

export default class EventEmitter {
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
    let notmedia = ['conversation', 'extendedTextMessage'];
    return this.is.quoted && !notmedia.includes(this.is.quoted.type)
      ? { quoted: true, type: this.is.quoted.type }
      : this.is.reaction && !notmedia.includes(this.is.reaction.mtype)
        ? { quoted: false, type: this.is.reaction.mtype }
        : { quoted: false, type: this.cht.type };
  }

  on(eventMap, resolve) {
    try {
      if (typeof eventMap !== 'object' || Array.isArray(eventMap)) {
        throw new Error('Argumen pertama harus berupa objek');
      }
      const { cmd, energy, ...rest } = eventMap;
      if (!Array.isArray(cmd)) {
        throw new Error("'cmd' harus berupa array");
      }
      const stack = new Error().stack.split('\n');
      const callerLine = stack[2];
      const fileNameMatch = callerLine.match(/\((.*?):\d+:\d+\)/);
      let eventFile = path.basename(
        fileNameMatch ? fileNameMatch[1] : 'Unknown file'
      );
      cmd.forEach((event) => {
        Data.events[event] = { ...rest, resolve, energy, eventFile };
      });
    } catch (error) {
      console.error(
        `${bgcolor('[ERROR]', 'red')} ${timestamp()}\n- Error in 'on' method:\nDetails: ${error.stack}`
      );
    }
  }

  async loadEventHandler(file) {
    try {
      let on = Data.Events.get(file);
      if (!on) {
        const module = (await `${fol[7] + file}`.r()).default;
        on = module;
        Data.Events.set(file, on);
      }
      await on({ ...this, ev: this });
      return;
    } catch (error) {
      console.error(`[ERROR] load file: ${file}\n\nStack: ${error.stack}`);
      return;
    }
  }

  async loadEventHandlers() {
    if (isLoad) return;
    try {
      isLoad = true;
      if (this.eventFiles.length === 0) {
        this.eventFiles = readdirSync(fol[7]).filter((file) =>
          file.endsWith('.js')
        );
      }
      for (const file of this.eventFiles) {
        await this.loadEventHandler(file);
      }
    } catch (error) {
      console.error(`[ERROR] Loading Event Handlers:\n${error.stack}`);
    }
  }

  sendPremiumMsg(trial = true, trialAvailable = true) {
    const imageMessage = {
      text: messages.onlyPremium(trial, trialAvailable),
      contextInfo: {
        externalAdReply: {
          title: '🔒Only Premium',
          body: 'Hanya bisa digunakan oleh user premium!',
          thumbnailUrl: 'https://telegra.ph/file/b9cd3e450060c58ad29d9.jpg',
          mediaUrl: 'http://ẉa.me/6283110928302/8282282',
          sourceUrl: `https://wa.me/${owner[0].split('@')[0]}?text=Hello,+I+have+buy+🔑Premium`,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          mediaType: 1,
        },
      },
    };
    this.Exp.sendMessage(this.cht.id, imageMessage, { quoted: this.cht });
  }

  async reloadEventHandlers() {
    try {
      this.eventFiles = readdirSync(fol[7]).filter((file) =>
        file.endsWith('.js')
      );
      for (const file of this.eventFiles) {
        Data.Events.delete(file);
        await this.loadEventHandler(file);
      }
    } catch (error) {
      console.error(
        `${bgcolor('[ERROR]', 'red')} ${timestamp()}\n- Error reloading event handlers:\nDetails: ${error.stack}`
      );
    }
  }

  addQuestion(sender, cmd, accepts = []) {
    ArchiveMemories.setItem(sender, 'questionCmd', {
      emit: `${cmd}`,
      exp: Date.now() + 20000,
      accepts,
    });
  }
  async emit(event, opts) {
    try {
      !isLoad && (await this.loadEventHandlers());
      const eventFile = Data.events[event]?.eventFile;
      if (!eventFile) return;
      await this.loadEventHandler(eventFile);
      const ev = Data.events[event];
      if (!ev) return;
      let urls =
        this.cht.quoted?.url?.length > 0
          ? this.cht.quoted?.url
          : this.cht.url?.length > 0
            ? this.cht.url
            : this.is.quoted?.url?.length > 0
              ? this.is.quoted?.url
              : this.is.url?.length > 0
                ? this.is.url
                : [];

      let args = this.cht?.q;
      let sender = this.cht.sender;
      let user = sender.split('@')[0];
      let isPremium = Data.users[user]?.premium?.time
        ? Data.users[user]?.premium?.time >= Date.now()
        : false;
      let media = null;
      if (!isPremium && Data.users[user]?.premium?.time)
        Data.users[user].premium = { time: 0 };
      let trial = Data.users[user]?.claimPremTrial;
      let metadata = Data.preferences[this.cht?.id];
      let notAllowPlayGame = Data.infos?.group?.nallowPlayGame;

      let { func } = this.Exp;
      let max = 5;
      let interval = 5000; //5detik
      let cd = func.archiveMemories.getItem(sender, 'cooldown') || { use: 0 };
      if (!cd.reset || Date.now() >= cd.reset) {
        cd.use = 0;
        cd.reset = Date.now() + interval;
        delete cd.notice;
      }
      cd.use++;
      func.archiveMemories.setItem(sender, 'cooldown', cd);
      if (cd.use >= max) {
        !cd.notice &&
          (await this.cht.reply(
            `Tunggu ${func.formatDuration(cd.reset - Date.now()).seconds} detik lagi sebelum menggunakan fitur!`
          ));
        cd.notice = true;
        func.archiveMemories.setItem(sender, 'cooldown', cd);
        return;
      }

      const checks = [
        {
          condition: ev.isOwner && !this.is.owner,
          message:
            typeof ev.isOwner === 'boolean' ? messages.isOwner : ev.isOwner,
        },
        {
          condition: ev.isGroup && !this.is.group,
          message:
            typeof ev.isGroup === 'boolean' ? messages.isGroup : ev.isGroup,
        },
        {
          condition: ev.isAdmin && !(this.is.groupAdmins || this.is.owner),
          message:
            typeof ev.isAdmin === 'boolean' ? messages.isAdmin : ev.isAdmin,
        },
        {
          condition: ev.isBotAdmin && !this.is.botAdmin,
          message:
            typeof ev.isBotAdmin === 'boolean'
              ? messages.isBotAdmin
              : ev.isBotAdmin,
        },
        {
          condition: ev.isQuoted && !this.cht.quoted,
          message:
            typeof ev.isQuoted === 'boolean' ? messages.isQuoted : ev.isQuoted,
        },
        {
          condition: ev.tag == 'game' && !metadata.playgame && this.is.group,
          message: notAllowPlayGame,
        },
      ];

      for (const { condition, message } of checks) {
        if (condition) return this.cht.reply(message);
      }
      if (cfg.premium_mode && ev.premium && !isPremium)
        return this.sendPremiumMsg(trial, 'trial' in ev ? ev.trial : true);
      if (cfg.premium_mode && ev.premium && ev.trial === false) {
        cfg.first.trialPrem.time = cfg.first.trialPrem.time || '1 hari';
        if (
          !isNaN(this.cht.memories.claimPremTrial) &&
          Date.now() - this.cht.memories.claimPremTrial <
            func.parseTimeString(cfg.first.trialPrem.time)
        )
          return this.cht.reply(messages.isNotAvailableOnTrial);
      }

      if (
        ev.energy &&
        !isNaN(ev.energy) &&
        this.cht.memories.energy < ev.energy
      ) {
        return this.cht.reply(
          messages.isEnergy({
            uEnergy: this.cht.memories.energy,
            energy: ev.energy,
            charging: this.cht.memories.charging,
          })
        );
      }

      if (ev.args) {
        if (!this.cht.q) {
          this.addQuestion(sender, this.cht.cmd);
          return this.cht.reply(ev.args !== true ? ev.args : ev.isArgs);
        }
        const badword = Data.badwords.filter((a) => this.cht.q.includes(a));
        this.is.badword = badword.length > 0;
        if (ev.badword && this.is.badword)
          return this.cht.reply(
            func.tagReplacer(messages.isBadword, {
              badword: badword.join(', '),
            })
          );
      }

      if (ev.isMention && this.cht.mention.length < 1)
        return this.cht.reply(
          ev.isMention !== true ? ev.isMention : messages.isMention
        );

      if (ev.media) {
        const { type, msg, etc } = ev.media;
        let { type: mediaType, quoted: isQuotedMedia } = this.getMediaType();
        if (!type.includes(mediaType)) {
          this.addQuestion(sender, this.cht.cmd);
          return this.cht.reply(
            msg ||
              func.tagReplacer(messages.isMedia, {
                type: type.join('/'),
                caption: this.cht.msg,
              })
          );
        }

        if (mediaType === 'audio') {
          if (etc && this.is.quoted?.audio?.seconds > etc.seconds) {
            this.addQuestion(sender, this.cht.cmd);
            return this.cht.reply(
              func.tagReplacer(messages.isExceedsAudio, { second: etc.seconds })
            );
          }
        }

        if (mediaType === 'video') {
          if (etc && this.is.quoted?.video?.seconds > etc.seconds) {
            this.addQuestion(sender, this.cht.cmd);
            return this.cht.reply(
              func.tagReplacer(messages.isExceedsVideo, { second: etc.seconds })
            );
          }
        }

        if (mediaType === 'sticker') {
          if (etc && etc.isNoAnimated && this.is.quoted?.sticker?.isAnimated) {
            this.addQuestion(sender, this.cht.cmd);
            return this.cht.reply(
              etc.isNoAnimated !== true
                ? etc.isNoAnimated
                : messages.isNoAnimatedSticker
            );
          }
          if (etc && etc.isAnimated && !this.is.quoted?.sticker?.isAnimated) {
            this.addQuestion(sender, this.cht.cmd);
            return this.cht.reply(
              etc.isAnimated !== true
                ? etc.isAnimated
                : messages.isAnimatedSticker
            );
          }
          if (etc && etc.isAvatar && !this.is.quoted?.sticker?.isAvatar) {
            this.addQuestion(sender, this.cht.cmd);
            return this.cht.reply(
              etc.avatar !== true ? etc.avatar : messages.isAvatarSticker
            );
          }
        }

        let download = isQuotedMedia
          ? this.is.quoted.download
          : this.is?.reaction
            ? this.is.reaction.download
            : this.cht.download;
        let save = this.is.quoted
          ? this.is.quoted[mediaType]
          : this.is?.reaction
            ? this.is.reaction[mediaType]
            : this.cht[mediaType];
        media = ev.media.save
          ? await func.downloadSave(save, mediaType)
          : await download();

        /*
                  if(mediaType == "image"){
                    let prompt = `Kamu adalah AI yang berfungsi untuk mendeteksi apakah sebuah gambar mengandung sosok manusia berkulit gelap atau dengan postur berotot. Tugasmu adalah memberikan respons true jika gambar tersebut sesuai, dan false jika tidak. Jawaban harus berupa boolean (true atau false) tanpa penjelasan tambahan`
                    let ress = await GeminiImage(await func.minimizeImage(media), prompt)
                    console.log(ress)
                    if(ress.trim() == 'true') return this.cht.reply('Di larang mmebuat stiker dari gambar berisi orang berkulit hitam/jomok')
                  }
                */
      }

      if (ev.urls) {
        if (!(urls?.length > 0)) {
          this.addQuestion(sender, this.cht.cmd);
          return this.cht.reply(
            ev.urls.msg !== true ? ev.urls.msg : messages.isUrl
          );
        }
        if (ev.urls.formats) {
          let isFormatsUrl = urls.some((url) =>
            ev.urls.formats.some((keyword) =>
              url.toLowerCase().includes(keyword.toLowerCase())
            )
          );
          if (!isFormatsUrl) {
            this.addQuestion(sender, this.cht.cmd);
            return this.cht.reply(
              func.tagReplacer(messages.isFormatsUrl, {
                formats: ev.urls.formats.join('\n- '),
              })
            );
          }
        }
      }

      if (ev.energy) {
        await ArchiveMemories.reduceEnergy(this.cht.sender, ev.energy);
        await this.cht.reply(`-${ev.energy} Energy⚡`);
        await sleep(100);
      }

      const resolves = { media, urls, args, cht: this.cht };
      await ev.resolve(resolves);
      await func.addCmd();
      await func.addCMDForTop(event);
      return true;
    } catch (error) {
      console.error(
        `${bgcolor('[ERROR]', 'red')} ${timestamp()}\n- Error emitting "${event}"`,
        error.stack
      );
      return;
    }
  }
}
