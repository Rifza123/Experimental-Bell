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

  absen: {
    guide: `📋 *PANDUAN FITUR ABSEN GROUP*

\`CARA MEMULAI ABSEN (ADMIN):\`
• \`.absen start <Judul> | <Durasi> | <MentionAll>\`
  > *Contoh:* \`.absen start Rapat Proyek | 30m | yes\`
  > *Durasi:* 15m, 30m, 1h, 2h (Default: 1h)
  > *MentionAll:* \`yes\` atau \`no\` (Default: \`yes\`)

\`CARA MENGISI ABSEN (MEMBER):\`
• \`.absen <NAMA_KAPITAL>\`
  > *Contoh:* \`.absen RIFZA\`
  > *Catatan:* Nama WAJIB menggunakan huruf besar/kapital semua.

\`CARA MENGHENTIKAN ABSEN (ADMIN):\`
• \`.absen stop\` atau \`.absen delete\`
  > Menghentikan sesi absen dan menampilkan laporan akhir.`,

    alreadyActive: `⚠️ *SESI ABSEN SEDANG AKTIF!*

Absen di grup ini masih berlangsung.
Ketik \`.absen stop\` untuk menghentikan terlebih dahulu sebelum membuat baru.`,

    notActive: `⚠️ *TIDAK ADA ABSEN AKTIF!*

Saat ini tidak ada sesi absen yang sedang berjalan di grup ini.
Admin dapat membuat absen baru dengan mengetik \`.absen start <Judul>\`.`,

    alreadySubmitted: `⚠️ *ANDA SUDAH ABSEN!*

Anda sudah terdaftar dalam daftar hadir sesi absen ini.`,

    mustCapital: `⚠️ *FORMAT NAMA SALAH!*

Pengisian nama absen **WAJIB** menggunakan **HURUF KAPITAL (BESAR) SEMUA**.
_Contoh benar:_ \`.absen RIFZA\`
_Contoh salah:_ \`.absen Rifza\` atau \`.absen rifza\``,

    onlyAdmin: `⚠️ *AKSES DITOLAK!*

Perintah ini hanya dapat dilakukan oleh **Admin Group**!`,

    started: (data) => `\`${data.groupName}\`
📌 *${data.title}*

📅 *Tanggal:* ${data.date}
⏰ *Waktu:* ${data.time} WIB

📝 *Daftar Hadir (Total: ${data.list.length}):*
${data.listText || '_Belum ada yang mengisi absen_'}

⏳ *Durasi:* ${data.durationText} (Berakhir pada ${data.expireTimeStr} WIB)
💡 *Ketik \`.absen <NAMA_KAPITAL>\` untuk mengisi absen*`,

    updated: (data) => `\`${data.groupName}\`
📌 *${data.title}*

📅 *Tanggal:* ${data.date}
⏰ *Waktu:* ${data.time} WIB

📝 *Daftar Hadir (Total: ${data.list.length}):*
${data.listText}

⏳ *Durasi:* ${data.durationText} (Berakhir pada ${data.expireTimeStr} WIB)
💡 *Ketik \`.absen <NAMA_KAPITAL>\` untuk mengisi absen*`,

    stopped: (data) => ({
      body: `\`${data.groupName}\`
📋 *LAPORAN HASIL ABSEN*
📌 *${data.title}*

📝 *Daftar Hadir (Total: ${data.list.length}):*
${data.listText || '_Tidak ada yang hadir_'}

❌ *Daftar Tidak Hadir (Total: ${data.absentList.length}):*
${data.absentText || '_Semua anggota hadir_'}`,
      footer: `Sesi absen telah dihentikan.`
    }),

    autoStopped: (data) => ({
      body: `\`${data.groupName}\`
📋 *LAPORAN HASIL ABSEN (WAKTU HABIS)*
📌 *${data.title}*

📝 *Daftar Hadir (Total: ${data.list.length}):*
${data.listText || '_Tidak ada yang hadir_'}

❌ *Daftar Tidak Hadir (Total: ${data.absentList.length}):*
${data.absentText || '_Semua anggota hadir_'}`,
      footer: `Waktu absen telah berakhir otomatis.`
    })
  }
};

/*
  ====== Messages.js ======
*/
Data.infos.messages = {
  termaiApiError: (err, cmd = '') => {
    const type = err?.type || 'API_ERROR';
    const msg = err?.apiMsg || err?.message || 'Terjadi kesalahan pada sistem API';
    if (type === 'FEATURE_LIMIT') {
      return (
        '⚠️ *LIMIT FITUR TERMAI API*\n\n' +
        '• ' + msg + '\n' +
        '> Silakan upgrade plan Anda atau tunggu API Key Anda reset esok hari.\n\n' +
        '🛒 *Beli / Upgrade Key:* https://termai.cc#pricing'
      );
    }
    if (type === 'KEY_LIMIT') {
      return (
        '⚠️ *LIMIT API KEY HABIS*\n\n' +
        '• Kuota penggunaan API Key Anda telah habis / rate limit tercapai.\n' +
        '> Silakan upgrade plan Anda atau tunggu API Key Anda reset esok hari.\n\n' +
        '🛒 *Beli / Upgrade Key:* https://termai.cc#pricing\n' +
        '🔑 *Set Key:* `.jadibot apikey <key_baru>`'
      );
    }
    if (type === 'EXPIRED') {
      return (
        '⚠️ *API KEY EXPIRED*\n\n' +
        '• Masa berlaku (expiration) API Key Anda telah berakhir.\n' +
        '> Silakan dapatkan API Key baru atau upgrade plan Anda di https://termai.cc#pricing\n\n' +
        '🔑 *Set Key:* `.jadibot apikey <key_baru>`'
      );
    }
    if (type === 'FORBIDDEN') {
      return (
        '⚠️ *AKSES DITOLAK*\n\n' +
        '• ' + msg + '\n\n' +
        '🔑 *Set Key:* `.jadibot apikey <key_baru>`'
      );
    }
    if (type === 'MAINTENANCE' || err?.status === 503) {
      return (
        '🛠️ *FITUR DALAM MAINTENANCE*\n\n' +
        '• ' + msg + '\n\n' +
        '💡 _Informasi pembaruan dapat dilihat di channel: https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V_'
      );
    }
    const status = err?.status || 500;
    if (msg.includes('id not found') || msg.includes('session not found')) {
      return 'ℹ️ Riwayat obrolan AI kamu belum ada atau sudah bersih.';
    }
    if (status < 500) {
      return 'ℹ️ ' + msg;
    }
    return (
      '⚠️ *GAGAL MEMPROSES PERMINTAAN*\n\n' +
      '• ' + msg
    );
  },
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

  formatPenggunaanJadibotNomorBot: () => 'Format Penggunaan: .jadibot [nomor]',
  nomorBotTidakValidInput: (cht, botNumber) => `Nomor bot ${botNumber} tidak valid!`,
  nomorTidakTerdaftarDiWhatsapp: (cht, botNumber) => `Nomor ${botNumber} tidak terdaftar di WhatsApp!`,
  jadibotSudahAktifNomorN: (botNumber, active) => `Bot dengan nomor ${botNumber} sudah aktif!`,
  nomorBotValidInputN: (cht, botNumber) => `Nomor bot ${botNumber} valid. Masukkan nomor owner:`,
  sesiJadibotKadaluarsaSilahkanUlangi: () => `Sesi jadibot telah kadaluarsa, silahkan ulangi!`,
  nomorOwnerTidakValidInput: (cht, ownerNumber) => `Nomor owner ${ownerNumber} tidak valid!`,
  nomorOwnerTidakTerdaftarDi: (cht, ownerNumber) => `Nomor owner ${ownerNumber} tidak terdaftar di WhatsApp!`,
  jadibotStartingBotNumberN: (original, botNumber, cht, ownerNumber) => `Memulai bot untuk nomor ${botNumber} dengan owner ${ownerNumber}...`,
  jadibotErrorSessionTelahDireset: (e) => `Terjadi kesalahan. Sesi telah direset.\n\nError: ${e}`,

  videoPlayHint: '> Video tidak dapat diputar? Reply pesan ini dengan ketik "y" atau .fixvideo',

  // Read More
  readMore: '͏'.repeat(3646),
};

Data.infos.jadibot = {
  menu: () =>
    '🤖 *JADIBOT MANAGER*\n' +
    '> Biaya tautkan bot baru: 1.500 energy\n\n' +
    '📱 *KONEKSI & MANAGEMENT*\n' +
    '• `.jadibot <nomor>`\n' +
    '> Tautkan bot baru\n\n' +
    '• `.jadibot relink`\n' +
    '> Tautkan ulang (Session aman)\n\n' +
    '• `.jadibot list`\n' +
    '> Lihat daftar bot aktif\n\n' +
    '• `.jadibot status`\n' +
    '> Cek status bot kamu\n\n' +
    '• `.jadibot restart`\n' +
    '> Restart koneksi bot\n\n' +
    '• `.jadibot stop`\n' +
    '> Hentikan sementara (Pause)\n\n' +
    '• `.jadibot delete`\n' +
    '> Hapus bot permanen\n\n' +
    '⚙️ *PENGATURAN & OWNER*\n' +
    '• `.jadibot apikey <key>`\n' +
    '> Set API Key Termai\n\n' +
    '• `.jadibot set public on/off`\n' +
    '> Mode bot public/private\n\n' +
    '• `.jadibot set prefix <symbol>`\n' +
    '> Set simbol prefix bot kamu\n\n' +
    '• `.jadibot addowner <nomor>`\n' +
    '> Tambah owner bot\n\n' +
    '• `.jadibot delowner <nomor>`\n' +
    '> Hapus owner bot\n\n' +
    '• `.jadibot listowner`\n' +
    '> Lihat daftar owner bot\n\n' +
    '🗄️ *DATABASE*\n' +
    '• `.jadibot db`\n' +
    '> Statistik database bot\n\n' +
    '• `.jadibot resetdb`\n' +
    '> Reset database bot',

  notFound: (target, isUserActive, activeBotsStr) =>
    '❌ *BOT TIDAK DITEMUKAN*\n' +
    (target
      ? `> Input "*${target}*" tidak cocok dengan Slot atau Nomor mana pun.\n\n`
      : isUserActive
      ? '> Kamu belum memiliki bot yang sedang aktif.\n\n'
      : '> Kamu belum memiliki bot yang terdaftar.\n\n') +
    '📌 *Cara Penggunaan:*\n' +
    '• `.jadibot relink/stop/restart/delete <slot>`\n' +
    '> Contoh: `.jadibot stop 1`\n\n' +
    '• `.jadibot relink/stop/restart/delete <nomor>`\n' +
    '> Contoh: `.jadibot stop 6281234567890`' +
    (activeBotsStr ? `\n\n> Slot Aktif: ${activeBotsStr}` : ''),

  alreadyConnected: (slot, botNumber) =>
    '⚠️ *BOT SUDAH TERHUBUNG & ONLINE*\n\n' +
    `• *Slot:* ${slot}\n` +
    `• *Nomor Bot:* ${botNumber}\n` +
    '• *Status:* Online & Aktif ✅\n\n' +
    '> Bot ini sedang aktif terhubung. Silakan logout terlebih dahulu jika ingin menautkan ulang:\n' +
    `• \`.jadibot logout ${slot}\` (Logout bot)\n` +
    `• \`.jadibot delete ${slot}\` (Hapus/Unlink bot)`,

  alreadyRegistered: (slot, botNumber, status) =>
    '⚠️ *NOMOR SUDAH TERDAFTAR*\n\n' +
    `• *Slot:* ${slot}\n` +
    `• *Nomor Bot:* ${botNumber}\n` +
    `• *Status:* ${status === 'offline' ? 'Nonaktif ⏸️' : status || 'Tidak Diketahui'}\n\n` +
    '> Nomor ini sudah terdaftar di slot kamu. Gunakan perintah berikut:\n' +
    `• \`.jadibot relink ${slot}\` (Hubungkan kembali)\n` +
    `• \`.jadibot delete ${slot}\` (Hapus & daftarkan ulang)`,

  accessDenied: (slot, botNumber, owner) =>
    '🚫 *AKSES DITOLAK*\n' +
    '> Kamu tidak memiliki izin untuk mengelola bot ini.\n\n' +
    `• *Slot:* ${slot}\n` +
    `• *Nomor Bot:* ${botNumber}\n` +
    `• *Owner Bot:* @${owner}`,

  stopped: (slot, botNumber) => ({
    body: '⏸️ *BOT DIHENTIKAN*\n\n' +
      `• *Slot:* ${slot}\n` +
      `• *Nomor Bot:* ${botNumber}\n` +
      '• *Status:* Nonaktif (Pause)',
    footer: `Ketik .jadibot restart ${slot} untuk mengaktifkan kembali`,
  }),

  deleted: (slot, botNumber) => ({
    body: '🗑️ *BOT DIHAPUS PERMANEN*\n\n' +
      `• *Slot:* ${slot}\n` +
      `• *Nomor Bot:* ${botNumber}\n` +
      '• *Status:* Sesi dan database telah dibersihkan.',
    footer: 'Ketik .jadibot <nomor> untuk menambahkan bot baru',
  }),

  restarted: (slot, botNumber) => ({
    body: '🔄 *RESTART BERHASIL*\n\n' +
      `• *Slot:* ${slot}\n` +
      `• *Nomor Bot:* ${botNumber}\n` +
      '• *Status:* Online & Terhubung Kembali ✅',
    footer: `Ketik .jadibot status ${slot} untuk cek rincian bot kamu`,
  }),

  restarting: (slot, botNumber) =>
    `⏳ *Sedang merestart bot Slot ${slot}...*\n📱 Nomor: ${botNumber}`,

  listHeader: (count) => `🤖 *DAFTAR BOT JADIBOT* (${count})\n\n`,
  listEmpty: '🤖 *DAFTAR JADIBOT*\n> Belum ada bot yang terdaftar saat ini.',
  listFooter: () => '',

  status: (info) => ({
    body: '🤖 *STATUS BOT KAMU*\n\n' +
      `• *Slot:* ${info.slot}\n` +
      `• *Nomor:* ${info.botNumber}\n` +
      `• *Owner:* @${info.owner}\n` +
      `• *Status:* ${info.statusText}\n` +
      `• *API Key:* ${info.hasApikey ? 'Custom Key ✅' : 'Default 🌐'}\n` +
      `• *Uptime:* ${info.uptimeText}\n` +
      `• *Reconnects:* ${info.reconnectCount}\n` +
      `• *Masa Aktif:* ${info.expiredText}\n\n` +
      (info.statusText.includes('Menghubungkan')
        ? '💡 *Status Menghubungkan... ?*\n' +
          `• \`.jadibot relink ${info.slot}\`\n` +
          '> Minta kode pairing baru\n\n' +
          `• \`.jadibot relink ${info.slot} qr\`\n` +
          '> Minta QR Code untuk di-scan\n\n' +
          `• \`.jadibot stop ${info.slot}\`\n` +
          '> Hentikan percobaan koneksi'
        : (info.statusText.includes('Offline') || info.statusText.includes('logged_out')
        ? '💡 *Bot Offline / Terputus?*\n' +
          `• \`.jadibot relink ${info.slot}\`\n` +
          '> Hubungkan kembali bot kamu\n\n' +
          `• \`.jadibot delete ${info.slot}\`\n` +
          '> Hapus dan unlink bot'
        : '💡 *Perintah Kontrol Bot Kamu:*\n' +
          '• `.jadibot apikey <key>`\n' +
          '> Set Termai API Key untuk bot kamu\n\n' +
          '• `.jadibot set public on/off`\n' +
          '> Pengaturan mode publik/privat bot kamu\n\n' +
          `• \`.jadibot restart ${info.slot}\`\n` +
          '> Restart koneksi bot kamu\n\n' +
          `• \`.jadibot stop ${info.slot}\`\n` +
          '> Hentikan sementara bot kamu\n\n' +
          `• \`.jadibot logout ${info.slot}\`\n` +
          '> Logout koneksi bot kamu\n\n' +
          `• \`.jadibot delete ${info.slot}\`\n` +
          '> Hapus/Unlink bot dari database')),
    footer: 'Ketik .jadibot untuk menu lengkap & perintah lainnya',
  }),

  apikeyGuide: (hasApikey, apikey) => ({
    body: '🗝️ *API KEY JADIBOT*\n\n' +
      `• *Status Key:* ${hasApikey ? 'Custom Key Active ✅' : 'Default Key 🌐'}\n` +
      `• *Key:* \`${apikey || 'DEFAULT'}\`\n\n` +
      '📌 *Cara Mengatur:*\n' +
      '• `.jadibot apikey <key_termai>`\n' +
      '> Set API Key Termai baru\n\n' +
      '• `.jadibot apikey reset`\n' +
      '> Reset ke API Key default',
    footer: 'Dapatkan API Key di termai.cc/dashboard',
  }),

  settingGuide: () => ({
    body: '⚙️ *PENGATURAN BOT*\n\n' +
      '• `.jadibot set public on/off`\n' +
      '> Mode public/private\n\n' +
      '• `.jadibot set prefix <simbol/off>`\n' +
      '> Set prefix bot kamu',
    footer: 'Ketik .jadibot untuk melihat semua perintah kontrol bot',
  }),

  dbStats: (info) => ({
    body: '🗄️ *DATABASE BOT*\n\n' +
      `• *Slot:* ${info.slot}\n` +
      `• *Nomor:* ${info.botNumber}\n` +
      `• *User Tersimpan:* ${info.userCount}\n` +
      `• *Grup/Chat:* ${info.prefCount}\n` +
      `• *Custom Response:* ${info.respCount}\n` +
      `• *Custom Command:* ${info.cmdCount}\n` +
      `• *API Key:* ${info.hasApikey ? 'Custom Key ✅' : 'Default 🌐'}\n` +
      `• *Prefix:* ${info.prefix === false ? 'Multi-Prefix' : info.prefix}\n` +
      `• *Mode:* ${info.isPublic ? 'Public' : 'Private'}`,
    footer: 'Ketik .jadibot resetdb untuk mereset database bot kamu',
  }),

  listOwner: (slot, owner, ownersStr) => ({
    body: '👑 *DAFTAR OWNER BOT*\n\n' +
      `• *Slot:* ${slot}\n` +
      `• *Main Owner:* @${owner}\n` +
      `• *Daftar Owner:* ${ownersStr}`,
    footer: `Ketik .jadibot addowner <nomor> atau .jadibot delowner <nomor> untuk kelola owner`,
  }),

  relinkHeader: (slot, botNumber, expiredText) =>
    '🔗 *TAUT ULANG BOT*\n\n' +
    `• *Slot:* ${slot}\n` +
    `• *Nomor Bot:* ${botNumber}\n` +
    `• *Sisa Masa Aktif:* ${expiredText}\n\n` +
    '> Meminta kode pairing baru, seluruh data & database bot tetap aman...',

  restrictedNested:
    '🚫 *AKSES DIBATASI*\n> Perintah untuk menautkan atau mengaitkan ulang bot (`.jadibot`) hanya dapat dilakukan melalui *Bot Utama* demi menjaga kestabilan server.',

  pairingCode: (realNumber, code, expireDate, slot) =>
    '🔑 *KODE PAIRING JADIBOT*\n\n' +
    `• *Nomor:* ${realNumber}\n` +
    `• *Kode:* \`\`\`${code}\`\`\`\n` +
    `• *Expired:* ${expireDate}\n` +
    '• *Timeout:* 2 Menit\n\n' +
    '📝 *Langkah Penautan:*\n' +
    '1. Buka WhatsApp di HP Jadibot\n' +
    '2. Menu (⋮) ➔ Perangkat Tertaut\n' +
    '3. Tautkan dengan Nomor Telepon\n' +
    '4. Masukkan kode di atas\n\n' +
    `> Slot ${slot}\n\n` +
    '💡 *Gagal menautkan dengan Pairing Code?*\n' +
    `> Balas pesan ini dengan *qr* atau ketik *.jadibot ${realNumber} qr* untuk menggunakan QR Code.`,

  qrCode: (realNumber, slot) =>
    '📷 *QR CODE JADIBOT*\n\n' +
    `• *Nomor:* ${realNumber}\n` +
    `• *Slot:* ${slot}\n` +
    '• *Timeout:* 45 Detik\n\n' +
    '📝 *Langkah Penautan:*\n' +
    '1. Buka WhatsApp di HP Jadibot\n' +
    '2. Menu (⋮) ➔ Perangkat Tertaut\n' +
    '3. Pindai / Scan QR Code gambar di atas\n\n' +
    '> Segera scan QR Code sebelum kadaluarsa.',

  connected: (slot, realNumber, isPublic, prefix, expiredText, energyInfo) =>
    '✅ *BOT TERHUBUNG*\n\n' +
    `• *Slot:* ${slot}\n` +
    `• *Nomor:* ${realNumber}\n` +
    `• *Mode:* ${isPublic ? 'Public' : 'Private'}\n` +
    `• *Prefix:* ${prefix === false ? 'Multi-Prefix' : prefix}\n` +
    `• *Masa Aktif:* ${expiredText}\n` +
    (energyInfo ? `• *Energy:* -${energyInfo.deducted} ⚡ (Sisa: ${energyInfo.remaining})\n` : '') +
    '\n📌 *Perintah Manajemen Bot:*\n' +
    '• `.jadibot` \n' +
    '> Tampilkan menu bantuan & kontrol bot kamu\n\n' +
    '• `.jadibot status` \n' +
    '> Cek rincian status & sisa masa aktif\n\n' +
    '• `.jadibot apikey <key>` \n' +
    '> Set Termai API Key untuk bot kamu\n\n' +
    '• `.jadibot set public on/off` \n' +
    '> Pengaturan mode publik/privat bot kamu\n\n' +
    '> Bot kamu siap digunakan!',

  waitingPairing: (realNumber, code, countdown) =>
    '⏳ *MENUNGGU PENAUTAN...*\n\n' +
    `• *Nomor:* ${realNumber}\n` +
    `• *Kode:* \`${code}\`\n` +
    `• *Sisa Waktu:* ${countdown} detik\n\n` +
    '> Segera masukkan kode di WhatsApp sebelum timeout.',
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

  listSetmenu: `\`List type menu yang tersedia:\`\n\n<list>`,
  richDisabled: 'Fitur rich belum aktif. Silahkan ketik .set rich on terlebih dahulu!',
  successSetMenu: `Berhasil mengganti menu ke <menu>`,
  audiolist: `Sukses menambahkan audio ke dalam list <list>✅️\n\nAudio: <url>\n> Untuk melihat list silahkan ketik *.getdata audio <list>*`,
  checkJson: `Harap periksa kembali JSON Object anda!\n\nTypeError:\n<rm>\n> <e>`,
  updatePreview: ({ files, recentFiles }) => {
    let listFiles = files.map((f) => `• \`${f.type}\`: ${f.path}`).join('\n');
    let warning = recentFiles.length > 0
      ? `\n\n⚠️ *PERINGATAN:*\nFile berikut baru-baru ini telah Anda ubah:\n${recentFiles.map((f) => `• ${f.path} (diubah ${f.timeAgo})`).join('\n')}\n> Update melalui link ini akan menimpa perubahan tersebut!`
      : '';
    return {
      body: `*[ 🛠️ ] PREVIEW UPDATE*\n\n📂 *Daftar Perubahan:*\n${listFiles}${warning}\n\nApakah Anda yakin ingin melanjutkan update ini? (y/n)`,
      footer: 'Ketik y untuk melanjutkan atau n untuk membatalkan',
    };
  },
  updateCancelled: '❌ *Update dibatalkan.*',
  updateExpired: '⏱️ *Sesi update telah kadaluwarsa.*',
  updateSuccess: 'Success ✅',
  setChidHelp: `*PANDUAN SET CHANNEL / SALURAN*

• *.set chid <link channel>*
> Masukkan tautan saluran WhatsApp.
• *.set chid* (Reply pesan terusan dari saluran)
> Teruskan pesan dari saluran target lalu balas pesan tersebut dengan .set chid`,
  setChidSuccess: (name, jid) =>
    `✅ *BERHASIL MENGATUR SALURAN*\n\n• *Nama Saluran:* ${name}\n• *ID Saluran:* ${jid}`,
  noChId: `⚠️ *ID Saluran belum diatur!*
> Silakan atur ID saluran terlebih dahulu dengan:
• .set chid <link channel>
• .set chid (Reply pesan yang diteruskan dari saluran)`,
  sendchHelp: `📤 *PANDUAN SEND TO CHANNEL*

Kirim berbagai jenis pesan ke saluran WhatsApp.

*Format Penggunaan:*
• *.sendch <teks>*
> Mengirim teks ke saluran default yang telah diset.
• *.sendch <id_channel@newsletter> <teks>*
> Mengirim teks ke ID saluran spesifik.
• *.sendch* (Reply teks/gambar/video/audio/stiker/dokumen)
> Meneruskan media/pesan yang dibalas ke saluran default.
• *.sendch <id_channel@newsletter>* (Reply media)
> Meneruskan media yang dibalas ke ID saluran spesifik.
• *.sendch <caption>* (Reply gambar/video)
> Mengirim media yang dibalas dengan caption kustom.`,
  sendchSuccess: (target, type) =>
    `✅ *BERHASIL TERKIRIM KE SALURAN*\n\n• *Saluran:* ${target}\n• *Tipe:* ${type}`,
  playchHelp: `🎙️ *PANDUAN PLAYCH (SEND VN TO CHANNEL)*

Kirim pesan suara (Voice Note / PTT) ke Saluran WhatsApp dengan membalas pesan audio.

*Format Penggunaan:*
• *.playch* (Reply audio / voice note)
> Mengirimkan audio/pesan suara yang dibalas ke saluran default sebagai VN (PTT).
• *.playch <id_channel@newsletter>* (Reply audio / voice note)
> Mengirimkan audio/pesan suara yang dibalas ke ID saluran spesifik sebagai VN (PTT).

_Contoh: Reply audio lalu ketik .playch atau .playch 120363205560908891@newsletter_`,
  playchSuccess: (target, title) =>
    `✅ *AUDIO BERHASIL DIKIRIM KE SALURAN*\n\n• *Saluran:* ${target}\n• *Tipe:* ${title}`,

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
- rich <on/off>
- inflasi <on/off>
- remoteReaction <on/off>
- linkpreview <on/off>
- dadu <reply media>
> Set media kustom sebagai dadu permainan Ular Tangga. Reply media (stiker/gambar/video/audio) lalu ketik .set dadu. Untuk menghapus: .set dadu off

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
  rdpHelp:
    '🖥️ *RDP MANAGER*\n\n' +
    '• .rdp on\n' +
    '> Aktifkan layanan RDP VPS\n\n' +
    '• .rdp off\n' +
    '> Matikan layanan RDP VPS\n\n' +
    '• .rdp status\n' +
    '> Cek status aktif RDP\n\n' +
    '• .rdp detail\n' +
    '> Tampilkan rincian host dan log',
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
  sitekey: {
    result: (sitekey, details) => {
      let text = `🔑 *SITEKEY FOUND*\n\n`;
      text += `• *Sitekey:* ${sitekey}\n`;
      text += `• *Source:* ${details.source}\n`;
      text += `• *Method:* ${details.method === 1 ? 'HTTP Fetch' : 'Puppeteer Browser'}\n`;
      text += `• *Puppeteer:* ${details.puppeteer_used ? 'Yes' : 'No'}\n`;
      text += `• *Duration:* ${details.duration_ms}ms\n`;
      if (details.found_in) text += `• *Found in:* ${details.found_in}\n`;
      text += `\n📊 *HTTP Scan*\n`;
      text += `• Fetched: ${details.http_scan?.performed ? 'Yes' : 'No'}\n`;
      if (details.http_scan?.status_code) text += `• Status: ${details.http_scan.status_code}\n`;
      if (details.http_scan?.html_length) text += `• HTML Length: ${details.http_scan.html_length.toLocaleString()} chars\n`;
      if (details.http_scan?.patterns_checked?.length) text += `• Patterns Checked: ${details.http_scan.patterns_checked.join(', ')}\n`;
      if (details.http_scan?.external_scripts_found) text += `• External Scripts: ${details.http_scan.external_scripts_scanned}/${details.http_scan.external_scripts_found} scanned\n`;
      if (details.browser_scan) {
        text += `\n🌐 *Browser Scan*\n`;
        text += `• Network Requests: ${details.browser_scan.network_requests_intercepted}\n`;
        text += `• DOM Scanned: ${details.browser_scan.dom_scanned ? 'Yes' : 'No'}\n`;
        text += `• Iframes Checked: ${details.browser_scan.iframes_checked ? 'Yes' : 'No'}\n`;
        if (details.browser_scan.dynamic_scripts_found) text += `• Dynamic Scripts: ${details.browser_scan.dynamic_scripts_scanned}/${details.browser_scan.dynamic_scripts_found} scanned\n`;
      }
      return text;
    },
    notFound: (details) => {
      let text = `❌ *SITEKEY NOT FOUND*\n\nTidak ditemukan Turnstile Sitekey pada website target.\n`;
      text += `\n• *Duration:* ${details.duration_ms}ms\n`;
      text += `• *Puppeteer:* ${details.puppeteer_used ? 'Yes' : 'No'}\n`;
      if (details.http_scan?.status_code) text += `• *HTTP Status:* ${details.http_scan.status_code}\n`;
      if (details.http_scan?.external_scripts_found) text += `• *Scripts Scanned:* ${details.http_scan.external_scripts_scanned}/${details.http_scan.external_scripts_found}\n`;
      if (details.http_scan?.error) text += `• *HTTP Error:* ${details.http_scan.error}\n`;
      if (details.browser_scan?.error) text += `• *Browser Error:* ${details.browser_scan.error}\n`;
      return text;
    },
    busy: 'ᤡ *SERVER BUSY*\n\nServer sedang sibuk memproses antrean browser. Silakan coba lagi dalam beberapa detik.',
  },
  compress: {
    start: '⏳ *MEMPROSES KOMPRESI*\n\nSedang menyiapkan media untuk dikompresi...',
    progress: (spinner, percentage, bar, processed, duration, speed, remaining) => {
      let text = `${spinner} *MENGOMPRESI VIDEO*\n\n`;
      text += `\`[${bar}] ${percentage.toFixed(1)}%\`\n\n`;
      text += `• *Durasi:* ${processed} / ${duration}\n`;
      text += `• *Kecepatan:* ${speed}x\n`;
      text += `• *Estimasi Sisa:* ${remaining}`;
      return text;
    },
    successVideo: (originalSize, compressedSize, savedSize, savedPercent, duration) => {
      let pct = parseFloat(savedPercent) || 0;
      let text = `✅ *KOMPRESI VIDEO SELESAI*\n\n`;
      text += `• *Ukuran Asli:* ${originalSize}\n`;
      text += `• *Ukuran Baru:* ${compressedSize}\n`;
      text += `• *Terkikis:* ${savedSize} (${pct >= 0 ? '-' : '+'}${Math.abs(pct).toFixed(1)}%)\n`;
      text += `• *Durasi:* ${duration}`;
      return text;
    },
    successImage: (originalSize, compressedSize, savedSize, savedPercent) => {
      let pct = parseFloat(savedPercent) || 0;
      let text = `✅ *KOMPRESI GAMBAR SELESAI*\n\n`;
      text += `• *Ukuran Asli:* ${originalSize}\n`;
      text += `• *Ukuran Baru:* ${compressedSize}\n`;
      text += `• *Terkikis:* ${savedSize} (${pct >= 0 ? '-' : '+'}${Math.abs(pct).toFixed(1)}%)`;
      return text;
    },
    failed: '❌ *KOMPRESI GAGAL*\n\nTerjadi kesalahan saat melakukan kompresi media.',
  },
  burik: {
    wait: '⏳ Memproses media burik...',
    success: (width) => `📉 *Media Burik* (${width}px)`,
    failed: '❌ Gagal memproses media burik.',
    refund: (energy) => `❌ Gagal memproses media burik.\n> Energy telah dikembalikan (+${energy}⚡)`,
  },
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

  ulartanggaInvite: (p1, targets) => `🐍 *UNDANGAN ULAR TANGGA* 🐍\n\n@${p1} mengundang: ${targets.map(a => '@' + a).join(', ')}\n\n📜 *COMMAND PERMAINAN:*\n• *.ut join* / *join*\n> Bergabung ke lobby\n• *.ut cancel* / *cancel*\n> Membatalkan lobby\n• *.ut start*\n> Memulai game (Min 2 pemain)\n• *🎲* / *.dadu* / *media dadu*\n> Melempar dadu (saat giliran)\n• *.ut*\n> Cek status & giliran game\n• *.delsesiut*\n> Hapus / menghentikan sesi game (Pembuat / Admin)`,
  ulartanggaJoined: (player, count) => `@${player} berhasil bergabung! (${count}/4 pemain)\n\n• Ketik *.ut start* untuk memulai permainan.\n• Ketik *.delsesiut* jika ingin menghapus/menghentikan sesi.`,
  ulartanggaFull: 'Ruang permainan Ular Tangga sudah penuh! (Maksimal 4 pemain)',
  ulartanggaMinPlayers: 'Permainan memerlukan minimal 2 pemain untuk dimulai!',
  ulartanggaHasSession: 'Masih ada permainan/lobby Ular Tangga di grup ini!\n\n• Ketik *.ut* untuk cek status permainan.\n• Ketik *.delsesiut* untuk menghentikan permainan.',
  ulartanggaOnlyGroup: 'Fitur ini hanya dapat digunakan di dalam grup!',
  ulartanggaTagTarget: 'Tag orang yang ingin Anda ajak bermain atau ketik .ulartangga untuk membuka lobby!',
  ulartanggaNoSelf: 'Anda tidak bisa mengundang diri sendiri!',
  ulartanggaDeclined: 'Permainan dibatalkan!',
  ulartanggaDaduMediaNotice: (players, isSticker) => `🎲 *DADU PERMAINAN*\n\nHalo ${players.map(p => '@' + p).join(' ')}! ${isSticker ? 'Simpan stiker dadu di bawah ini terlebih dahulu ya!' : 'Simpan media dadu di bawah ini terlebih dahulu ya!'}\nSaat giliran kamu, kamu bisa melempar dadu dengan:\n• Kirim media dadu ini langsung di grup\n• Atau reply pesan papan permainan dengan emoji dadu (🎲)\n• Atau kirim emoji 🎲 langsung di grup`,
  ulartanggaStart: (p1, dadu) => `*[ Game Ular Tangga 🐍 ]*\n\nPermainan dimulai!\nGiliran pertama: @${p1}\n\n• Kirim media dadu atau reply pesan ini dengan emoji dadu (🎲)\n\n> ℹ️ Ketik *.delsesiut* untuk menghentikan/menghapus permainan.`,
  ulartanggaNextTurn: (currPlayer, nextPlayer, statusNotice, rollMsg) => `${rollMsg}${statusNotice}\n\n*[ Game Ular Tangga 🐍 ]*\n\nGiliran selanjutnya: @${nextPlayer}\n\n• Kirim media dadu atau reply pesan ini dengan emoji dadu (🎲)\n\n> ℹ️ Ketik *.delsesiut* jika ingin menghentikan permainan`,
  ulartanggaRoll: (player, num) => `@${player} mendapat ${num} pada dadu 🎲`,
  ulartanggaTurn: (player) => `Tunggu giliran @${player}!\n\n• Kirim media dadu atau reply pesan giliran dengan emoji dadu (🎲)`,
  ulartanggaLadder: (player, diff) => `@${player} Naik tangga 🪜\n+${diff}`,
  ulartanggaSnake: (player, diff) => `@${player} Yaah kena ular 🐍 :(\n-${diff}`,
  ulartanggaWin: (player, limit) => `🎉 *PEMENANG ULAR TANGGA* 🎉\n\nSelamat @${player}!\nKamu berhasil mencapai garis finish pertama! 🏆\nMendapat : ${limit} Energy⚡`,
  ulartanggaTimeoutWin: (player, pos, limit) => `⏱️ *WAKTU HABIS (10 MENIT)* ⏱️\n\nTidak ada aktivitas permainan selama 10 menit.\nPermainan berakhir dan dimenangkan oleh pemain dengan posisi terjauh!\n\n🏆 *Pemenang:* @${player} (Kotak ${pos})\n🎁 *Hadiah:* +${limit} Energy⚡`,
  ulartanggaTimeoutLobby: '⏱️ *Lobby Ular Tangga dibatalkan otomatis karena tidak ada aktivitas selama 10 menit.*',
  ulartanggaNoSession: 'Tidak ada sesi permainan Ular Tangga di grup ini!\nKetik *.ut* atau *.ut @tag* untuk membuat permainan baru.',
  ulartanggaDeleted: 'Sesi permainan Ular Tangga berhasil dihapus!',
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
  antispamWarn: `Anda terdeteksi melakukan spam chat!. Harap ikuti peraturan grup untuk tidak melakukan spam!`,
  antispamKick: `Anda dikeluarkan karena melanggar peraturan grup untuk tidak melakukan spam chat hingga peringatan terakhir!`,
  limitExpired: (formatTimeDur, resetOn) =>
    `*Limit interaksi telah habis!*\n\n*Waktu tunggu:*\n- ${formatTimeDur.days}hari ${formatTimeDur.hours}jam ${formatTimeDur.minutes}menit ${formatTimeDur.seconds}detik ${formatTimeDur.milliseconds}ms\n🗓*Direset Pada:* ${resetOn}\n\n*Ingin interaksi tanpa batas?*\nDapatkan premium!, untuk info lebih lanjut ketik *.premium*`,
  notOwner: `Maaf, males nanggepin`,
  modePublic: `Berhasil mengubah mode menjadi public!`,
  modeSelf: `Berhasil mengubah mode menjadi public!`,
};
