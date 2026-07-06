Data.infos ??= {};
/*
  ====== PENTING ! ======
  Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.


  ====== About.js ======
*/

Data.infos.about = {
  help: `Sertakan pertanyaan yang ingin Anda tanyakan terkait bot ini untuk mendapatkan bantuan`,

  helpList: `\`LIST PANDUAN/BANTUAN\`\n\n<keys>`,

  helpNotfound: `*Ups, kami tidak menemukan bantuan yang anda cari!*

Mungkin anda sedang mencari:
<top>`,

  energy: `
📌 *[Panduan Menambah/Mengurangi Energi]*

Anda dapat menambah atau mengurangi energi pengguna lain dengan beberapa metode berikut. Pastikan untuk menyertakan nomor, reply, atau tag pengguna yang akan ditambah/dikurangi energinya.

*🛠 Format:*
- *🔹 Command*: \`.addenergy\` atau \`.reduceenergy\`
- *🔹 Jumlah Energi*: Angka yang menunjukkan berapa banyak energi yang ingin ditambah/dikurangi

*💡 Cara Penggunaan:*

🔸 *Cara #1 - Dengan Reply Pesan Target*  
   ➡️ Balas pesan pengguna yang akan diubah energinya, lalu kirim:
   - \`.addenergy [jumlah energi]\`
   - \`.reduceenergy [jumlah energi]\`
   
   _Contoh_: \`.addenergy 10\`

🔸 *Cara #2 - Dengan Tag Target*  
   ➡️ Gunakan \`@username\` diikuti \`|\` dan jumlah energi.
   - \`.addenergy @username|[jumlah energi]\`
   - \`.reduceenergy @username|[jumlah energi]\`
   
   _Contoh_: \`.addenergy @rifza|10\`

🔸 *Cara #3 - Dengan Nomor Target*  
   ➡️ Sertakan nomor lengkap pengguna diikuti \`|\` dan jumlah energi.
   - \`.addenergy +62xxxxxxx|[jumlah energi]\`
   - \`.reduceenergy +62xxxxxxx|[jumlah energi]\`
   
   _Contoh_: \`.addenergy +62831xxxxxxx|10\`

⚠️ *[Catatan]*
- 🔄 Gantilah \`[jumlah energi]\` dengan angka sesuai kebutuhan.
- ✅ Pastikan target (username atau nomor) valid untuk menghindari kesalahan.
`,

  tfenergy: `
📌 *[ Panduan melakukan transfer Energy ]*

*💡 Cara Penggunaan:*

🔸 *Cara #1 - Dengan Reply Pesan Target*  
   ➡️ Balas pesan pengguna yang akan menerima energi, lalu kirim:
   - \`.transfer [jumlah energi]\`
   _Contoh_: \`.transfer 10\`

🔸 *Cara #2 - Dengan Tag Target*  
   ➡️ Gunakan \`@username\` diikuti jumlah energi.
   - \`.transfer @username|[jumlah energi]\`
   _Contoh_: \`.transfer @rifza|25\`

🔸 *Cara #3 - Dengan Nomor Target*  
   ➡️ Sertakan nomor lengkap pengguna diikuti jumlah energi.
   - \`.transfer +62xxxxxxx|[jumlah energi]\`
   _Contoh_: \`.transfer +62831xxxxxxx|50\`

⚠️ *[Catatan]*
- Energi akan dikurangi dari saldo Anda lalu ditambahkan ke target.
- Pastikan saldo energi Anda mencukupi.
`,

  stablediffusion: `*[ CARA PENGGUNAAN STABLEDIFFUSION (TXT2IMG) ]*

Command: \`.txt2img <checkpoint>[<lora>]|<prompt>\`

📌 *Penjelasan Parameter:*
- \`<checkpoint>\`: ID model utama.
- \`<lora>\`: (Opsional) ID tambahan (LoRA).
- \`<prompt>\`: Deskripsi gambar.

📝 *Format Command*:
- Tanpa Lora → \`.txt2img 1234[]|sunset, beach\`
- Dengan 1 Lora → \`.txt2img 1234[5678]|cyberpunk city\`
- Dengan banyak Lora → \`.txt2img 1234[5678,91011]|fantasy castle\`

🔍 *Mencari ID*:
- Cari Lora: \`.lorasearch cyberpunk\`
- Cari Checkpoint: \`.checkpointsearch anime\`

⚠️ Pastikan ID valid agar hasil sesuai.
`,

  antilink: `📌 *Panduan Penggunaan Fitur Antilink Bot*

🔒 Aktifkan: \`.antilink on\`
🔓 Nonaktifkan: \`.antilink off\`
➕ Tambah URL: \`.antilink add <link>\`
➖ Hapus URL: \`.antilink del <link>\`
📄 Lihat daftar: \`.antilink list\`
`,

  antitoxic: `📌 *Panduan Penggunaan Fitur Antitoxic Bot*

🔒 Aktifkan: \`.antitoxic on\`
🔓 Nonaktifkan: \`.antitoxic off\`
➕ Tambah kata: \`.antitoxic add <kata>\`
➖ Hapus kata: \`.antitoxic del <kata>\`
📄 Lihat daftar: \`.antitoxic list\`
`,
};

/*
  ====== Ai.js ======
*/
Data.infos.ai = {
  // ------- Messages -------
  isPrompt: '*Harap beri deskripsi gambarnya!*',
  notfound: 'Tidak ditemukan!',
  isQuery: 'Mau tanya apa?',
  prompt: 'Harap masukkan prompt!',
  includeModel: 'Sertakan modelnya!',
  interactiveOn: 'Berhasil!, ai_interactive telah diaktifkan dalam chat ini!',
  interactiveOff: 'Berhasil!, ai_interactive telah dimatikan dalam chat ini!',
  interactiveOnGroup:
    'Berhasil!, ai_interactive telah diaktifkan di semua grup!',
  interactiveOffGroup:
    'Berhasil!, ai_interactive telah dimatikan di semua chat group!',
  interactiveOnPrivate:
    'Berhasil!, ai_interactive telah diaktifkan di semua chat private!',
  interactiveOffPrivate:
    'Berhasil!, ai_interactive telah dimatikan di semua chat private!',
  interactiveOnAll: 'Berhasil!, ai_interactive telah diaktifkan di semua chat!',
  interactiveOffAll: 'Berhasil!, ai_interactive telah dimatikan di semua chat!',
  interactiveOnEnergy:
    'Berhasil!, sekarang energy bisa didapatkan dari interaksi!',
  interactiveOffEnergy:
    'Berhasil!, sekarang energy tidak akan bisa di dapat dari interaksi!',
  interactiveOffPartResponse: 'Berhasil menonaktifkan partResponse ai!',
  interactiveOnPartResponse:
    'Berhasil mengaktifkan part-response ai!, sekarang AI dapat memberikan balasan secara bertahap, menciptakan kesan yang lebih realistis.',
  failTryImage: 'Maaf terjadi kesalhan. coba gunakan gambar lain!',
  payInstruction: '*Perhatikan petunjuk berikut!*',

  // ------- Faceswap -------
  noSessionFaceswap: 'Tidak ada sesi faceswap',
  successResetSessionFaceswap: 'Berhasil mereset session faceswap!',
  cannotChangeFace: 'Tidak dapat merubah, hanya ada 1 gambar dalam sesi swap!',
  successChangeFace:
    'Berhasil menukar gambar target dengan gambar yang terakhir anda kirimkan sebagai face!',

  // ------- Lora -------
  lora_models: [
    'Donghua#01',
    'YunXi - PerfectWorld',
    'Sea God(Tang San,) - Douluo Dalu',
    'XiaoYiXian - Battle Throught The Heavens',
    'Angel God(Xian Renxue) - Douluo Dalu',
    "Sheng Cai'er - Throne Of Seal",
    'HuTao - Genshin Impact',
    'TangWutong - The Unrivaled Tang Sect',
    'CaiLin(Medusa) -BattleThroughtTheHeavens',
    'Elaina-MajoNoTabiTabi',
    'Jiang Nanan - TheUnrivaledTangSect',
    'Cailin(Queen Medusa) - BTTH [4KUltraHD]',
    'MaXiaoTao-TheUnrivaledTangSect',
    'YorForger-Spy x Family',
    'Boboiboy Galaxy',
    'Hisoka morow',
    'Ling Luochen ▪︎ The Unrivaled Tang Sect',
    'Tang Wutong ▪︎ The Unrivaled Tang Sect',
    'Huo Yuhao ▪︎ The Unrivaled Tang Sect',
  ],

  lora: function () {
    let text = `
*Perhatikan petunjuk berikut!*
 \`\`\`[ StableDiffusion - Lora++ ]\`\`\`

Penggunaan: <prefix><command> <ID>|<prompt>
Contoh: #lora 3|beautyfull cat with aesthetic jellyfish, sea god themes

 => _ID adalah nomor dari model yang tersedia di list_

_*silahkan lihat list model yang tersedia:*_

*[ID] [NAME]*`;
    for (let i = 0; i < this.lora_models.length; i++) {
      text += `\n[${i + 1}] [${this.lora_models[i]}]`;
    }
    return text;
  },

  unsuitableModel: `*Type Base Model tidak cocok❗*

_*checkpoint* dan lora harus menggunakan BaseType sama!_

Base Type: \`<baseType>\`

*List lora dengan base type yang tidak cocok:*

[ ID ] [ Name ] \`Base Type\`
<notSameLora>`,

  // ------- Filters -------
  filters: `*Harap masukan type nya!*
            
List Type:

▪︎ 3D:
- disney
- 3dcartoon
▪︎ Anime:
- anime2d
- maid
▪︎ Painting:
- colorfull
▪︎ Digital:
- steam

_Contoh: .filters steam_`,

  // ------- Txt2Img -------
  txt2img: `
*[ CARA PENGGUNAAN ]*
Param: \`.txt2img <checkpoint>[<lora>]|<prompt>\`

 ▪︎ \`Tanpa lora\`
-  .txt2img <checkpoint>[]|<prompt>

 ▪︎ \`1 lora\`
-  .txt2img <checkpoint>[<lora>]|<prompt>

 ▪︎ \`lebih dari 1 lora\`
- .txt2img <checkpoint>[<lora>,<lora>,...more lora]|<prompt>

 ▪︎ \`Cara custom rasio aspek\`
-  .txt2img <checkpoint>[<lora>]<aspect:ratio>|<prompt>
> Ex: txt2img 1233[9380]3:4|1girl, beautiful, futuristic, armored mecha*

--------------------------------------------------
 ▪︎ \`Contoh\`: 
- *.txt2img 1233[9380]|1girl, beautiful, futuristic, armored mecha*
--------------------------------------------------
 \`Searching id\`: 
 - lora: .lorasearch <query>
 - checkpoint: .checkpointsearch <query>
`,
  findListModels: `*[ <type> ]*
- Ditemukan: \`<found>\`
_Dari total <total> model_

- ketik *.get<getCmd> ID* untuk melihat detail

--------------------------------------------------------
[ ID ] | [ NAMA ] | \`Base Type\`
--------------------------------------------------------
<list>`,
  // ------- Faceswap Function -------
  faceSwap: (cht) => `
  \`Cara penggunaan Face Swap\`

[ OPSI A ] 
> (Cara biasa)

- Kirim gambar *target*
- Balas gambar *target* dengan mengirim gambar *wajah* dan sertakan caption *${cht.prefix + cht.cmd}*
- Atau, balas gambar *target* dengan mengetik perintah *${cht.prefix + cht.cmd}* <url gambar2>*.

_Gambar target akan diganti dengan wajah pada gambar kedua_

[ OPSI B ] 
> (Menggunakan sesi)

- Kirim gambar dengan caption *${cht.prefix + cht.cmd}* akan otomatis membuat sesi dan tersimpan sebagai gambar *target*
- Selanjutnya anda bisa me-reply pesan bot dengan gambar untuk mengganti wajah pada gambar target dengan gambar yang baru anda kirimkan dengan caption *${cht.prefix + cht.cmd}* atau tanpa caption(reply chatbot dengan gambar)

\`Kami juga menambahkan beberapa command yang dapat membantu anda untuk mengatur proses swapping\`
- *Untuk mereset dan menghapus sesi faceswap*
    - .faceswap-reset
     ~ Mereset sesi akan memulai ulang face swap

- *Untuk mengganti gambar target*
    - .faceswap-change
     ~ _Gambar terakhir yang anda kirimkan akan menjadi gambar target_

_Sesi akan otomatis terhapus jika lebih dari 10 menit tidak ada interaksi swap_
`,

  startedFaceswap: `Sesi berhasil dibuat. silahkan reply chatbot dengan gambar wajah.
Gambar pertama adalah gambar target yang akan diganti dengan wajah pada gambar berikutnya

- *Untuk mereset dan menghapus sesi faceswap*
    - .faceswap-reset
     ~ Mereset sesi akan memulai ulang face swap

- *Untuk mengganti gambar target*
    - .faceswap-change
     ~ _Gambar terakhir yang anda kirimkan akan menjadi gambar target_

_Sesi akan otomatis terhapus setelah 10 menit_
`,

  // ------- Auto Bell -------
  bell: `
!-======[ Auto Ai Response ]======-!

_List setting:_
 !-===(👥)> *All User*
- on
- off
    \`Jika di grup maka khusus admin/owner\`

 !-===(👤)> *Owner*
- on-group
    \`Aktif di semua group\`

- off-group
    \`Nonaktif di semua group\`

- on-private
    \`Aktif disemua private chat\`

- off-private
    \`Nonaktif disemua private chat\`

- on-all
    \`Aktif di semua chat\`

- off-all
    \`Nonaktif di semua chat\`

- on-energy
    \`Interaksi dapat menambah/mengurangi energy berdasarkan mood ai\`
    
- off-energy
    \`AI tidak dapat menambah/mengurangi energy\`

- on-partResponse
    \`AI dapat memberikan balasan secara bertahap, menciptakan kesan yang lebih realistis.\`
> Tidak disarankan untuk bot dengan jumlah pengguna, grup, atau interaksi yang tinggi.

- off-partResponse 
    \`Respon ai default\`

*Contoh:*
> .bell on
`,
};

/*
  ====== Group.js ======
*/
Data.infos.group = {
  settings: `Opsi yang tersedia:\n\n- <options>`,

  kick_add: `*Sertakan nomor/Reply/tag target yang akan <cmd> dari group!*\n\nExample: \n\n*Cara #1* => _Dengan reply pesan target_\n - <prefix><cmd>\n \n*Cara #2* => _Dengan tag target_\n - <prefix><cmd> @rifza \n \n*Cara #2* => _Dengan nomor target_\n - <prefix><cmd> +62 831-xxxx-xxxx`,

  on: (cmd, input) =>
    `Berhasil ${cmd === 'on' ? 'mengaktifkan' : 'menonaktifkan'} *${input}* di group ini!`,

  nallowPlayGame: `Bermain game tidak diizinkan disini!\n_Untuk mengizinkan bisa dengan mengetik *.on playgame* (hanya boleh dilakukan oleh admin/owner)_`,
};

/*
  ====== Messages.js ======
*/
Data.infos.messages = {
  // Default Message
  isGroup: 'Khusus group!',
  isAdmin: 'Kamu bukan admin!',
  isOwner: 'Kamu bukan owner!',
  isBotAdmin: 'Aku bukan admin :(',
  isQuoted: 'Reply pesan nya!',
  isMedia: `!Reply atau kirim <type> dengan caption: <caption>`,
  isExceedsAudio: `Audio tidak boleh lebih dari <second>detik`,
  isExceedsVideo: `Video tidak boleh lebih dari <second>detik`,
  isNoAnimatedSticker: 'Sticker harus type Image!',
  isAnimatedSticker: 'Sticker harus tipe Video!',
  isAvatarSticker: 'Sticker harus tipe Avatar!',
  isArgs: 'Harap sertakan teks!',
  isBadword: `Kata *<badword>* Tidak diizinkan!`,
  isMention: `Sertakan nomor/Reply/tag target`,
  isUrl: 'Harap sertakan url!',
  isFormatsUrl: 'Url yang diberikan harus berupa url seperti:\n- <formats>',
  replyOrSendImage: '*REPLY/KIRIM GAMBARNYA!!*\nFormat:\n\n',
  hasClaimTrial: 'Kamu sudah claim trial!',
  hasPremiumTrial: 'Tidak dapat claim trial, kamu sudah premium!',
  isNotAvailableOnTrial:
    '*Free trial tidak diizinkan menggunakan fitur ini!*\n_Fitur ini hanya dapat digunakan ketika anda membeli premium dari owner!_',

  wait: '```Bntr...```',
  sending: 'Lagi dikirim...',
  failed: '```Gagal❗️```',

  onlyNumber: '<value> harus berupa angka!',

  isEnergy: ({ uEnergy, energy, charging }) =>
    `
Males😞\n⚡️Energy: ${uEnergy}\nMembutuhkan: ${energy}⚡\n\n${
      charging
        ? ' Status: 🟢Charging'
        : 'Untuk mengisi energy: *Ketik .charge atau .cas*'
    }`.trim(),

  onlyPremium: (trial, available = true) => `
Maaf, fitur ini hanya bisa digunakan oleh user premium\nKetik *.premium* untuk info lebih lanjut atau bisa klik gambar preview url di atas untuk menghubungi owner

*Belum mengklaim Free Trial🤷🏻‍♀️?*
${Data.infos.others.readMore}
${
  !trial
    ? `*🎁Yey kamu masih bisa claim trial!!*\nKetik *.freetrial* untuk meng claim trial 1hari${
        available
          ? ''
          : '_Fitur ini tidak bisa digunakan dari free trial_\n_Anda tetap perlu membeli premium melalui owner untuk mendapatkan akses fitur ini!_'
      }`
    : 'Kamu sudah claim bonus ini🙅🏻‍♀️'
}`,

  // Premium Info
  premium: (trial, available = true) => `
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
${
  !trial
    ? `*🎁Yey kamu masih bisa claim trial!!*\nKetik *.freetrial* untuk meng claim trial 1hari${
        available
          ? ''
          : '_Fitur ini tidak bisa digunakan dari free trial_\n_Anda tetap perlu membeli premium melalui owner untuk mendapatkan akses fitur ini!_'
      }`
    : 'Kamu sudah claim bonus ini🙅🏻‍♀️'
}`,
};

/*
  ====== Others.js ======
*/
Data.infos.others = {
  noDetectViewOnce:
    'Ups, sepertinya saya tidak dapat mendeteksi pesan 1x lihat yang dikirim oleh orang tersebut!',

  // Read More
  readMore: '͏'.repeat(3646),
};

/*
  ====== Owner.js ======
*/
Data.infos.owner = {
  // ------- Messages -------
  succesSetLang: `*Berhasil merubah bahasa default ke bahasa:* \`<lang>\``,
  lockedPrem: 'Dapatkan akses premium untuk membuka fitur² terkunci',
  unBannedSuccess: `*Berhasil, user @<sender> telah dihapus di hapus dari banned`,
  delBanned: `Anda telah dihapus dari daftar banned!\n_Sekarang anda telah diizinkan kembali mengunakan bot_!`,

  bannedSuccess: `*Berhasil membanned user!*\n ▪︎ User:\n- @<sender>\n ▪︎ Waktu ditambahkan: \n- <days>hari <hours>jam <minutes>menit <seconds>detik <milliseconds>ms\n\n`,
  addBanned: `\`Anda telah diblokir dari bot❗️\`\nWaktu: <days>hari <hours>jam <minutes>menit <seconds>detik <milliseconds>ms`,

  successSetVoice: `Success✅️\n\n- Voice: _<voice>_`,
  successSetLogic: `Sukses mengubah logic ai chat✅️\n\n\`New Logic:\`\n<logic>`,

  userNotfound: 'Nomor salah atau user tidak terdaftar!',
  wrongFormat: '*❗Format salah, silahkan periksa kembali*',

  successDelBadword: `Berhasil menghapus <input> kedalam list badword!`,
  successSetThumb: 'Berhasil mengganti thumbnail menu!',
  successAddBadword: `Berhasil menambahkan <input> kedalam list badword!`,
  isModeOn: `Maaf, <mode> sudah dalam mode on!`,
  isModeOff: `Maaf, <mode> sudah dalam mode off!`,

  isModeOnSuccess: `Sukses mengaktifkan <mode>`,
  isModeOffSuccess: `Sukses menonaktifkan <mode>`,

  badword: `Mau add, delete atau lihat list?\nContoh: <cmd> add|tobrut`,
  badwordAddNotfound: `Action mungkin tidak ada dalam list!\n*List Action*: add, delete, list\n\n_Contoh: <cmd> add|tobrut_`,

  listSetmenu: `\`List type menu yang tersedia:\`\n\n- <list>`,
  successSetMenu: `Berhasil mengganti menu ke <menu>`,
  audiolist: `Sukses menambahkan audio ke dalam list <list>✅️\n\nAudio: <url>\n> Untuk melihat list silahkan ketik *.getdata audio <list>*`,
  menuLiveLocationInfo:
    '_Menu liveLocation tidak dapat terlihat di private chat. Harap pertimbangkan kembali untuk menggunakan menu ini_',
  checkJson: `Harap periksa kembali JSON Object anda!\n\nTypeError:\n<rm>\n> <e>`,

  // ------- Set Info -------
  set: `
[ PENGATURAN BOT ]

- public <on/off>
- autotyping <on/off>
- autoreadsw <on/off>
- autoreadpc <on/off>
- autoreadgc <on/of>
- similarCmd <on/off>
- premium_mode <on/of>
- editmsg <on/off>
- fquoted <name> <objek oratau quoted>
- logic <logic>
- lang <kode negara>
- voice <nama model>
- menu <tipe>
- call <off atau action>
- autoreactsw <off atau emojis>
- checkpoint <checkpoint_id>
- lora <lora_id>
- apikey <apikey>
- antitagowner <(on/off) atau balas pesan>
- keyChecker <on/off>
- chid <reply pesan (teruskan dari channel)>
- replyAi <on/off>
- register <on/off>
- autoBackup <on/off>
- font <style>
- didYouMean <on/off>
- energy_mode <on/off>
- button <on/off>
- inflasi <on/off>
- remoteReaction <on/off>
- linkpreview <on/off>

_Example: .set public on_`,

  premium_add: `
*Panduan untuk menambahkan/mengurangi waktu premium (Hanya bisa digunakan oleh owner!)*

*Opsi terdiri dari:*
- addprem (menambahkan waktu)
- kurangprem (mengurangi waktu)
- delprem (menghapus premium user)

*Bagaimana cara menggunakannya?*

_*Sertakan nomor/Reply/tag user target*_

Example: 
 - *#1* => _Dengan reply pesan target_
- .addprem 1d
- .kurangprem 1d
- .delprem

 - *#2* => _Dengan tag target_
- .kurangprem @rifza|1d
- .addprem @rifza|1d
- .delprem @rifza|1d
 
 - *#2* => _Dengan nomor target_
- .addprem +62 831-xxxx-xxxx|1d
- .kurangprem +62 831-xxxx-xxxx|1d
- .delprem +62 831-xxxx-xxxx|1d

*Unit Waktu yang Didukung:*
- s, second, seconds, detik
- m, minute, minutes, menit
- h, hour, hours, jam
- d, day, days, hari
- w, week, weeks, minggu

*Contoh lain terkait cara menggunakan dengan unit waktu yang berbeda:*
- .addprem @rifza|30 detik 
    ➡️ Menambahkan 30 detik.
- .addprem @rifza|1 menit 
    ➡️ Menambahkan 1 menit.
- .addprem @rifza|1 jam 15 detik 
    ➡️ Menambahkan 1 jam 15 detik.
- .addprem @rifza|2 hari 4 jam 
    ➡️ Menambahkan 2 hari 4 jam.
- .addprem @rifza|1 minggu 
    ➡️ Menambahkan 1 minggu.
- .addprem @rifza|1w 2d 3h 
    ➡️ Menambahkan 1 minggu 2 hari 3 jam.
- .addprem @rifza|1d 2h 30m 15s 
    ➡️ Menambahkan 1 hari 2 jam 30 menit 15 detik.

\`Semoga panduan ini dibaca dengan teiti agar tidak lagi menanyakan kepada admin terkait cara penggunaanya, terimakasih\`
`,

  setCall: `
\`Cara Penggunaan:\`
 ▪︎ .set call <off or action>
- Contoh: .set call reject

_Anda juga bisa menambahkan action lain dengan cara memberi tanda *+*_

Contoh: .set call reject+block

\`LIST ACTION\`
- reject (menolak panggilan)
- block (memblokir pemanggil)
`,
  successSetCall: 'Berhasil mengatur anti call!\nAction: <action>',
  successOffCall: 'Berhasil menonaktifkan anti call!',

  setAutoreactSw: `
\`Cara Penggunaan:\`

 ▪︎ .set autoreactsw <off or emojis>
- Contoh: .set autoreactsw 😀😂🤣😭😘🥰😍🤩🥳🤢🤮

_Anda bisa menambahkan emoji sebanyak-banyaknya_
`,
  successSetAutoreactSw: 'Berhasil mengatur Autoreact SW!\nEmoji: <action>',
  successOffAutoreactSw: 'Berhasil menonaktifkan Autoreact SW!',

  setHadiah: `
\`Cara Penggunaan:\`
 ▪︎ .set hadiah <Game> <Energy>
- Contoh: .set hadiah tebakgambar 60

\`LIST GAME\`
<game>
`,

  setFquoted: `
\`Contoh penggunaan:\`

- *Cara 1*
   ~ _Reply pesan dengan mengirimkan perintah *.set fquoted <name>_
     \`Contoh\`:
     - .set fquoted welcome

- *Cara 2*
   ~ _Kirimkan pesan dengan perintah *.set fquoted <name> <objek quoted>*_
     \`Contoh\`:
     - .set fquoted welcome {
    "key": {
      "fromMe": false,
      "participant": "0@whatsapp.net"
    },
    "message": {
      "conversation": "Termai"
    }
  }
`,

  setAudio: `
\`Contoh penggunaan:\`

- *Cara 1*
   ~ _Reply pesan dengan mengirimkan perintah *.set audio <name>*_
     \`Contoh\`:
     - .setdata audio welcome

- *Cara 2*
   ~ _Kirimkan pesan dengan perintah *.set audio <name> <url>*_
     \`Contoh\`:
     - .setdata audio welcome https://catbox.moe/xxxxxxx.mp3
`,

  delAudio: `
  ~ _Kirimkan pesan dengan perintah *.deldata audio <name> <url>*_
   \`Contoh\`:
   - .deldata audio welcome https://catbox.moe/xxxxxxx.mp3
`,

  setLogic: `*Untuk mengubah logic:*

_Kirimkan perintah *<cmd> logic* dengan format seperti berikut:_

<cmd> logic 
Nickainame: <your ai name>
Fullainame: <your nick ai name>
Profile: <Your Logic Here>

\`Logic saat ini:\`
Fullainame: <botfullname>
Nickainame: <botnickname>
Profile: <logic>`,

  banned: `*Panduan untuk melakukan banned user dengan jangka waktu tertentu (Hanya bisa digunakan oleh owner!)*

*Opsi:*
- banned (untuk banned user dengan durasi tertentu)
- unbanned (untuk menghapus banned user, tidak memerlukan durasi)

*Bagaimana cara menggunakannya?*

_*Sertakan nomor/Reply/tag user target*_

Contoh:
 - *#1* => _Dengan reply pesan target_
- .banned 1d
- .unbanned

 - *#2* => _Dengan tag target_
- .banned @rifza|1d
- .unbanned @rifza

 - *#3* => _Dengan nomor target_
- .banned +62 831-xxxx-xxxx|1d
- .unbanned +62 831-xxxx-xxxx

*Unit Waktu yang Didukung:*
- s, second, seconds, detik
- m, minute, minutes, menit
- h, hour, hours, jam
- d, day, days, hari
- w, week, weeks, minggu

*Contoh lain terkait cara menggunakan dengan unit waktu yang berbeda:*
- .banned @rifza|30 detik 
    ➡️ Melakukan banned selama 30 detik.
- .banned @rifza|1 menit 
    ➡️ Melakukan banned selama 1 menit.
- .banned @rifza|1 jam 15 detik 
    ➡️ Melakukan banned selama 1 jam 15 detik.
- .banned @rifza|2 hari 4 jam 
    ➡️ Melakukan banned selama 2 hari 4 jam.
- .banned @rifza|1 minggu 
    ➡️ Melakukan banned selama 1 minggu.
- .banned @rifza|1w 2d 3h 
    ➡️ Melakukan banned selama 1 minggu 2 hari 3 jam.
- .banned @rifza|1d 2h 30m 15s 
    ➡️ Melakukan banned selama 1 hari 2 jam 30 menit 15 detik.

\`Pastikan membaca panduan ini dengan teliti agar tidak perlu bertanya lebih lanjut kepada admin terkait cara penggunaannya. Terima kasih.\``,

  setRole: `*Panduan untuk mengubah role user (Hanya bisa digunakan oleh owner!)*

*Bagaimana cara menggunakannya?*

_*Sertakan nomor/Reply/tag user target*_

Contoh:
 - *#1* => _Dengan reply pesan target_
- .setrole 🎀Soulmate🦋

 - *#2* => _Dengan tag target_
- .setrole @rifza|🎀Soulmate🦋

 - *#3* => _Dengan nomor target_
- .setrole +62 831-xxxx-xxxx|🎀Soulmate🦋

\`LIST ROLE\`
<role>

\`Pastikan membaca panduan ini dengan teliti agar tidak perlu bertanya lebih lanjut kepada admin terkait cara penggunaannya. Terima kasih.\``,

  setAntiTagOwner: `**✦ PETUNJUK ANTI-TAG OWNER ✦**

• *Aktifkan fitur:*
Ketik \`.set antitagowner on\`

• *Nonaktifkan fitur:* 
Ketik \`.set antitagowner off\`

• *Atur respon saat owner di-tag:*
Balas pesan yang ingin dijadikan respon, lalu ketik:  
\`.set antitagowner\`
`,

  setReplyAi: `Cara Penggunaan:
 ▪︎ .set replyAi <true/on | false/off>
   Contoh: .set replyAi true

_Jika diaktifkan, semua balasan bot akan dimodifikasi sesuai dengan logic yang ada,
sehingga membuat reply terasa lebih natural._`,

  isReplyAiOn: `*Berhasil mengaktifkan \`replyAi\`!, sekarang semua balasan bot akan dimodifikasi sesuai dengan logic yang ada!
⚠️ *WARNING!* ⚠️\n\nFitur *replyAi* mungkin akan banyak menghabiskan kuota API GPT (termai.cc).\nGunakan dengan bijak, terutama jika memakai key dengan limit terbatas!`,

  isReplyAiOff: `Berhasil menonaktifkan *replyAi!*`,
  listusermode: '📋 Berikut daftar user dengan status <mode>',
  listusernull: '❌ Belum ada user dengan status <mode>',
  listuserhelp:
    '*❗ Berikut adalah daftar user yang tersedia*\n\n' +
    '⟡ listuser premium\n' +
    '⟡ listuser banned\n' +
    '⟡ listuser afk\n\n' +
    'Contoh:\n' +
    '.listuser afk',

  alightmotion: {
    send: `
📌 *[ Zelapi Premium Send ]*

Gunakan command ini untuk mengirim permintaan premium ke email target.

*🛠 Format:*
- \`.send <email>\`

*💡 Contoh:*
- \`.send target@gmail.com\`
`,

    verif: `
📌 *[ Zelapi Premium Verification ]*

Gunakan command ini untuk memverifikasi link premium untuk email target.

*🛠 Format:*
- \`.verif <email>|<link>\`

*💡 Contoh:*
- \`.verif target@gmail.com|https://alightcreative.com/auth/...\`
`,
  },
};

/*
  ====== Reaction.js ======
*/
Data.infos.reaction = {
  play: 'Untuk melakukan play youtube menggunakan react, harap beri react kepada pesan yang berisi teks',

  download:
    'Saat ini kami belum bisa mengunduh url <url>\nList yang didukung:\n- <listurl>',

  translate:
    'Harap beri reaksi <emoji> ke pesan teks untuk menerjemahkan ke bahasa indonesia',

  delete:
    'Manghapus pesan menggunakan react khusus hanya untuk admin jika target bukan pesan yang saya kirimkan',

  menu: ` *[ LIST REACTION CMD ]*

- *Membuat sticker*
    |🖨️||🖼️||🤳|
> _Mengubah media yang diberi react menjadi sticker atau sebaliknya_

- *Menghapus Pesan*
    |❌||🗑|
> _Menghapus pesan yang diberi react._

- *Kick user*
    |🦵||🦶|
> _Menendang/mengeluarkan pengguna yang di beri reaksi daru dalam grup._

- *Youtube Play Audio*
    |🎵||🎶||🎧||▶️|
> _ .play youtube audio dengan judul dari pesan._

- *Media Downloader*
    |⬇️||📥|
> _Mengunduh media berdasarkan url yang terdapat pada pesan._

- *Screenshot Web*
    |📸||📷|
> _Melakukan tangkapan layar pada url yang terdapat dalam pesan._

- *Ai*
    |🔍||🔎|
> _Tanyakan kepada ai dengan memberi reaksi ke dalam pesan._

- *Mendengarkan pesan*
    |🔈||🔉||🔊||🎙️||🎤|
> _Ai akan membacakan pesan teks yang diberi reaksi_

- *Menerjemahkan pesan*
    |🆔||🌐|
> _Menerjemahkan pesan yang diberi react ke bahasa indonesia._

- *Media uploader*
    |🔗||📎||🏷️||⬆️||📤|
> _Mengupload media ke cdn dan merubahnya menjadi link._

- *Pengubah warna kulit*
    |🟥||🟧||🟨||🟩||🟦||🟪||⬛||⬜||🟫|
> _Mengganti warna kulit orang dalam gambar._

*Guide:*
_*Beri reaksi ke pesan target dengan salah satu emoji di atas*_`,
  kickNotAllowed: `*Anda tidak diizinkan menghapus pesan itu!*
\`Sebab:\`
<readMore>
- Quoted pesan tersebut bukan berasal dari anda
- Anda bukan owner atau admin untuk mendapatkan izin khusus`,
};

/*
  ====== Tools.js ======
*/
Data.infos.tools = {
  enhance: `
*SILAHKAN PILIH TYPE YANG TERSEDIA!*
▪︎ Photo style
- phox2 
- phox4
▪︎ Anime style
- anix2
- anix4
▪︎ Standard
- stdx2
- stdx4
▪︎ Face Enhance
- cf
▪︎ Object text
- text

_Cara penggunaan: #enhance phox4_
`,
};

/*
  ====== Game.js ======
*/
Data.infos.game = {
  hasActive: (game, func) => `*Masih ada game yang aktif disini!*

- Game: ${game.type}
- Start Time: ${func.dateFormatter(game.startTime, 'Asia/Jakarta')}
- End Time: ${func.dateFormatter(game.endTime, 'Asia/Jakarta')}
- Creator: @${game.creator.id.split('@')[0]}
- Creator Name: ${game.creator.name}

Untuk memulai game baru:
_Tunggu game berakhir atau bisa dengan mengetik .cleargame atau .nyerah_
`,

  starting: `Memulai Permainan...`,

  tebakGambar: (desc, formatDur, metadata, func, cfg, cht) => `*TEBAK GAMBAR*

Apa jawaban dari soal ini

Petunjuk: ${desc}

Waktu menjawab: ${formatDur.minutes}menit ${formatDur.seconds}detik
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Hadiah: ${cfg.hadiah[cht.cmd]} Energy⚡

_*Kamu bisa menggunakan .hint untuk mendapatkan petunjuk jawaban*_

*Reply pesan game untuk menjawab*
> (Dimulai dari pesan ini)
`,

  timeUp: (answer) => `*WAKTU HABIS*

Jawaban: ${answer}`,
};

/*
  ====== Client.js ======
*/
Data.infos.client = {
  onlyJoinGc: `
Anda harus bergabung ke salah satu grup dibawah sebelum dapat menggunakan bot!

\`LIST INVITELINK\`
<list>

_Setelah bergabung harap tunggu selama 2 menit sebelum menggunakan bot!_
_Data anggota grup hanya diperbarui setiap 2 menit sekali guna mengurangi rate-limit._
`,

  lidJoin: `
Nomor asli Anda tidak dapat terdeteksi karena menggunakan @lid.
Silakan bergabung ke salah satu grup di bawah agar sistem dapat mengenali nomor Anda.
(Tanpa bergabung, data Anda hanya akan tersimpan sebagai @lid dan tidak lengkap)

\`LIST UNDANGAN GRUP\`
<list>

_Setelah bergabung, harap tunggu ±2 menit sebelum menggunakan bot._
_Data anggota grup diperbarui setiap 2 menit sekali untuk mengurangi beban server dan rate-limit._
`,

  registerNeeded: `
Anda belum terdaftar di database kami!
Silakan lakukan pendaftaran dengan mengetik *.register*
`,
};

/*
  ====== EventGame.js ======
*/
Data.infos.eventGame = {
  ended: `Game itu sudah berakhir!`,

  correct: (desc) =>
    `Selamat jawabanmu benar💯🥳🥳${desc ? `\n_${desc}_` : ''}`,

  bonus: `Hebat😳, Kamu menjawab kurang dari 10 detik!\n\`Bonus x2✅\`\n\n`,

  wrong: (formatDur) =>
    `Jawaban salah!!

Waktu tersisa: ${formatDur.minutes} menit ${formatDur.seconds} detik`,

  alreadyAnswered: (ans, user) => `Sudah dijawab oleh @${user.split('@')[0]}`,

  alreadyAnswered: (ans, user) => `Sudah dijawab oleh @${user.split('@')[0]}`,

  survey: `Survey membuktikan!...`,

  invalidAnswer: `Jawaban tidak valid!`,

  remainingTime: (formatDur) =>
    `\n\nWaktu tersisa: ${formatDur.minutes} menit ${formatDur.seconds} detik`,

  gameOver: `Game berakhir!\n_Membagiakan semua hadiah yang didapat....🎁_`,

  error: (err) =>
    `Terjadi kesalahan saat memproses game. Silakan coba lagi nanti.\nError: ${err}`,
};

/*
  ====== Events.js ======
*/
Data.infos.events = {
  cooldown: (formatDur) =>
    `Tunggu ${formatDur.seconds} detik lagi sebelum menggunakan fitur!`,
  cmdBlocked: (cmd) =>
    `Command \`${cmd}\` di blokir di group ini!\nUntuk membuka blokir, silahkan ketik .unbancmd ${cmd} (hanya bisa dilakukan oleh admin)`,
  onlyGame: (metadata, ev) =>
    `Kamu ${metadata.game?.type ? '' : 'tidak '}sedang bermain game \`${metadata?.game?.type || '!'}\`, Command ini hanya bisa digunakan ketika bermain game berikut:\n- ${ev?.onlyGame?.join('\n- ')}`,
  onlyPremiumBody: `Hanya bisa digunakan oleh user premium!`,
};

/*
  ====== Interactive.js ======
*/
Data.infos.interactive = {
  sessionEnded: (s1) =>
    `Sessi percakapan \`${s1.code?.toUpperCase()}\` telah berakhir!`,
  bannedTagAfk: (maxTag) =>
    `Kamu telah di banned dari bot selama 1 hari karena melakukan tag hingga ${maxTag}x`,
  bannedTagAfkPm: (tme, maxTag) =>
    `Anda telah di baned selama ${tme} karena terus melakuka tag hingga ${maxTag} kali❗️`,
  afkTagged: (tagAfk, func, sender, maxTag) =>
    `\`JANGAN TAG DIA❗\`\nDia sedang *AFK* dengan alasan: *${tagAfk.reason}*\nSejak ${func.dateFormatter(tagAfk.time, 'Asia/Jakarta')}\n\n*[ ⚠️INFO ]*\n_Jangan me-reply/tag orang yang sedang afk!._\n_*Kamu sudah mengetag dia sebanyak ${tagAfk.taggedBy[sender]}x!*_\n_Jika terus melakukan tag hingga ${maxTag}x, jika kamu melakukan tag atau balasan akan dibanned selama 1 hari!_`,
  afkBack: (sender, is, dur) =>
    `@${sender.split('@')[0]} *Telah kembali dari AFK!*\nSetelah ${is.afk.reason} selama ${dur.days > 0 ? dur.days + 'hari ' : ''}${dur.hours > 0 ? dur.hours + 'jam ' : ''}${dur.minutes > 0 ? dur.minutes + 'menit ' : ''}${dur.seconds > 0 ? dur.seconds + 'detik ' : ''}${dur.milisecondss > 0 ? dur.milisecondss + 'ms ' : ''}`,
  warn: `Bot terdeteksi!, harap aktifkan mute di group ini atau ubah mode menjadi self!`,
  kick: `Anda akan dikeluarkan karena tidak menonaktifkan bot hingga peringatan terakhir!`,
  antiDelete: (cht, func, deleted) =>
    `\`ANTI DELETE❗\`\n\n- User/Name: ${cht.sender.split('@')[0]} / ${func.getName(cht.sender)}\n- Type Pesan: ${deleted.type}`,
  antiDeleteNote: `Untuk menonaktifkan fitur ini, ketik *.off antidelete* (Hanya bisa dilakukan oleh admin atau owner)`,
  mentionWarn: `Kamu terdeteksi melakukan mention status di group ini! Mohon ikuti aturan grup untuk tidak melakukan mention di group ini!.`,
  mentionKick: `Kamu dikeluarkan dari grup karena melakukan tag/mention status group hingga peringatan terakhir!`,
  antilinkWarn: `Anda terdeteksi mengirimkan link!. Harap ikuti peraturan disini untuk tidak mengirim link!`,
  antilinkKick: `Anda dikeluarkan karena melanggar peraturan grup untuk tidak mengirim link hingga peringatan terakhir!`,
  antitoxicWarn: `Kamu terdeteksi menggunakan bahasa yang kasar atau tidak pantas! Mohon ikuti aturan grup dan hindari kata-kata yang menyinggung.`,
  antitoxicKick: `Kamu dikeluarkan dari grup karena menggunakan bahasa kasar atau tidak pantas hingga peringatan terakhir!`,
  tagallWarn: `Anda terdeteksi melakukan tagall/hidetag. Harap ikuti peraturan disini untuk tidak melakukan tagall/hidetag karena akan mengganggu member disini!`,
  tagallKick: `Anda dikeluarkan karena melanggar peraturan grup untuk tidak melakukan tagall/hidetag hingga peringatan terakhir!`,
  antiMediaWarn: `Anda terdeteksi mengirimkan <mediaType>. Harap ikuti peraturan disini untuk tidak mengirimkan <mediaType> di grub ini!`,
  antiMediaKick: `Anda dikeluarkan karena melanggar peraturan grup untuk tidak mengirimkan <mediaType> hingga peringatan terakhir!`,
  antiChWarn: `Anda terdeteksi mengirimkan pesan/link channel, harap ikuti peraturan group untuk tidak mengirimkan pesan/link channel!`,
  antiChKick: `Anda dikeluarkan karena melanggar peraturan grup untuk tidak mengirimkan pesan/link channel! hingga peringatan terakhir.`,
  limitExpired: (formatTimeDur, resetOn) =>
    `*Limit interaksi telah habis!*\n\n*Waktu tunggu:*\n- ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms\n🗓*Direset Pada:* ${resetOn}\n\n*Ingin interaksi tanpa batas?*\nDapatkan premium!, untuk info lebih lanjut ketik *.premium*`,
  notOwner: `Maaf, males nanggepin`,
  modePublic: `Berhasil mengubah mode menjadi public!`,
  modeSelf: `Berhasil mengubah mode menjadi public!`,
};
