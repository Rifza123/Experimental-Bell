let infos = Data.infos.owner ??= {}; 


  /*/------- 
   MESSAGES
/*/

infos.succesSetLang = `*Berhasil merubah bahasa default ke bahasa:* \`<lang>\``
infos.lockedPrem =  "Dapatkan akses premium untuk membuka fitur² terkunci"
infos.unBannedSuccess = `*Berhasil, user @<sender> telah dihapus di hapus dari banned`
infos.delBanned = `Anda telah dihapus dari daftar banned!\n_Sekarang anda telah diizinkan kembali mengunakan bot_!`

infos.bannedSuccess = `*Berhasil membanned user!*\n ▪︎ User:\n- @<sender>\n ▪︎ Waktu ditambahkan: \n- <days>hari <hours>jam <minutes>menit <seconds>detik <milliseconds>ms\n\n`
infos.addBanned = `\`Anda telah diblokir dari bot❗️\`\nWaktu: <days>hari <hours>jam <minutes>menit <seconds>detik <milliseconds>ms`

infos.successSetVoice = `Success✅️\n\n- Voice: _<voice>_`
infos.successSetLogic = `Sukses mengubah logic ai chat✅️\n\n\`New Logic:\`\n<logic>`

infos.userNotfound = "Nomor salah atau user tidak terdaftar!"
infos.wrongFormat = "*❗Format salah, silahkan periksa kembali*"

infos.successDelBadword = `Berhasil menghapus <input> kedalam list badword!`
infos.successSetThumb = "Berhasil mengganti thumbnail menu!"
infos.successAddBadword = `Berhasil menambahkan <input> kedalam list badword!`

infos.isModeOn = `Maaf, <mode> sudah dalam mode on!`
infos.isModeOff = `Maaf, <mode> sudah dalam mode off!`

infos.isModeOnSuccess = `Sukses mengaktifkan <mode>`
infos.isModeOffSuccess = `Sukses menonaktifkan <mode>`

infos.badword = `Mau add, delete atau lihat list?\nContoh: <cmd> add|tobrut`
infos.badwordAddNotfound = `Action mungkin tidak ada dalam list!\n*List Action*: add, delete, list\n\n_Contoh: <cmd> add|tobrut_`

infos.listSetmenu = `\`List type menu yang tersedia:\`\n\n- <list>`
infos.successSetMenu = `Berhasil mengganti menu ke <menu>`
infos.audiolist = `Sukses menambahkan audio ke dalam list <list>✅️\n\nAudio: <url>\n> Untuk melihat list silahkan ketik *.getdata audio <list>*`
infos.menuLiveLocationInfo = "_Menu liveLocation tidak dapat terlihat di private chat. Harap pertimbangkan kembali untuk menggunakan menu ini_"
infos.checkJson = `Harap periksa kembali JSON Object anda!\n\nTypeError:\n<rm>\n> <e>`

/*!-======[ Set Info ]======-!*/
infos.set = `
[ PENGATURAN BOT ]

- public <on/off>
- autotyping <on/off>
- autoreadsw <on/off>
- autoreadpc <on/off>
- autoreadgc <on/of>
- similarCmd <on/off>
- premium_mode <on/of>
- editmsg <on/off>
- fquoted <name> <object or quoted>
- welcome <type>
- logic <logic>
- lang <Country Code>
- voice <modelname>
- menu <type>

_Example: .set public on_`

infos.premium_add = `
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
`


infos.setFquoted = `
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
`

infos.setAudio = `
\`Contoh penggunaan:\`

- *Cara 1*
   ~ _Reply pesan dengan mengirimkan perintah *.set audio <name>*_
     \`Contoh\`:
     - .setdata audio welcome

- *Cara 2*
   ~ _Kirimkan pesan dengan perintah *.set audio <name> <url>*_
     \`Contoh\`:
     - .setdata audio welcome https://catbox.moe/xxxxxxx.mp3
`

infos.delAudio = `
  ~ _Kirimkan pesan dengan perintah *.deldata audio <name> <url>*_
   \`Contoh\`:
   - .deldata audio welcome https://catbox.moe/xxxxxxx.mp3
`

infos.setLogic = `*Untuk mengubah logic:*

_Kirimkan perintah *<cmd> logic* dengan format seperti berikut:_

<cmd> logic 
Nickainame: <your ai name>
Fullainame: <your nick ai name>
Profile: <Your Logic Here>

\`Logic saat ini:\`
Fullainame: <botfullname>
Nickainame: <botnickname>
Profile: <logic>`

infos.banned = `*Panduan untuk melakukan banned user dengan jangka waktu tertentu (Hanya bisa digunakan oleh owner!)*

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

\`Pastikan membaca panduan ini dengan teliti agar tidak perlu bertanya lebih lanjut kepada admin terkait cara penggunaannya. Terima kasih.\``

