let infos = Data.infos.messages ??= {};

/* ---
   PENTING!
   Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.
--- */

/*!-======[ Default Message]======-!*/
infos.isGroup = "Khusus group!"
infos.isAdmin = "Kamu bukan admin!"
infos.isOwner = "Kamu bukan owner!"
infos.isBotAdmin = "Aku bukan admin :("
infos.isQuoted = "Reply pesan nya!"
infos.isMedia = `!Reply atau kirim <type> dengan caption: <caption>`
infos.isExceedsAudio = `Audio tidak boleh lebih dari <second>detik`
infos.isExceedsVideo = `Video tidak boleh lebih dari <second>detik`
infos.isNoAnimatedSticker = "Sticker harus type Image!"
infos.isAnimatedSticker = "Sticker harus tipe Video!"
infos.isAvatarSticker = "Sticker harus tipe Avatar!"
infos.isArgs = "Harap sertakan teks!"
infos.isBadword = `Kata *<badword>* Tidak diizinkan!`
infos.isMention = `Sertakan nomor/Reply/tag target`
infos.isUrl = "Harap sertakan url!"
infos.isFormatsUrl = "Url yang diberikan harus berupa url seperti:\n- <formats>"

infos.hasClaimTrial = "Kamu sudah claim trial!"
infos.hasPremiumTrial = "Tidak dapat claim trial, kamu sudah premium!"

infos.wait = '```Bntr...```'
infos.sending = "Lagi dikirim..."
infos.failed = '```Gagal❗️```'

infos.isEnergy = ({ uEnergy,energy,charging }) => `
Males😞\n⚡️Energy: ${uEnergy}\nMembutuhkan: ${energy}⚡\n\n${charging ? " Status: 🟢Charging" : "Untuk mengisi energy: *Ketik .charge atau .cas*" }
`.trim()

infos.onlyPremium = (trial) => `
Maaf, fitur ini hanya bisa digunakan oleh user premium\nKetik *.premium* untuk info lebih lanjut atau bisa klik gambar preview url di atas untuk menghubungi owner

*Belum mengklaim Free Trial🤷🏻‍♀️?*
${Data.infos.others.readMore}
${!trial ? "*🎁Yey kamu masih bisa claim trial!!*\nKetik *.freetrial* untuk mengclaim trial 1hari" : "Kamu sudah claim bonus ini🙅🏻‍♀️"}`.trim()

/*!-======[ Premium ]======-!*/
infos.premium = (trial) => `
*Dapatkan akses untuk menggunakan fitur² premium!*

*\`Manfaat premium\`*
- Akses fitur terkunci✅️
- ⚡️Energy: +${cfg.first.trialPrem.energy}✅️
- Charge rate: +${cfg.first.trialPrem.chargeRate}✅️
- Max Charge: +${cfg.first.trialPrem.maxCharge}✅️
- ChatbotAi Tanpa batas✅️
 (Hanya berlaku selama menjadi user premium)

*🔖Price list*:
#︎ 1Day
- Rp.2.000
#︎ 3Day
- Rp.5.000
#︎ 7Day
- Rp.10.000
#︎ 15Day
- Rp.20.000
#︎ 30Day
- Rp.35.000

*Belum mengklaim Free Trial🤷🏻‍♀️?*
${Data.infos.others.readMore}
${!trial ? "*🎁Yey kamu masih bisa claim trial!!*\nKetik *.freetrial* untuk meng claim trial 1hari" : "Kamu sudah claim bonus ini🙅🏻‍♀️"}`

