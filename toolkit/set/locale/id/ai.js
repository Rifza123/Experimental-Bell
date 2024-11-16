let infos = Data.infos.ai ??= {};


  /*/------- 
   MESSAGES
/*/

infos.isPrompt = "*Harap beri deskripsi gambarnya!*"
infos.notfound = "Tidak ditemukan!"
infos.isQuery = "Mau tanya apa?"
infos.prompt = "Harap masukkan prompt!"

infos.interactiveOn = "Berhasil!, ai_interactive telah diaktifkan dalam chat ini!"
infos.interactiveOff = "Berhasil!, ai_interactive telah dimatikan dalam chat ini!"
infos.interactiveOnGroup = "Berhasil!, ai_interactive telah diaktifkan di semua grup!"
infos.interactiveOffGroup = "Berhasil!, ai_interactive telah dimatikan di semua chat group!"
infos.interactiveOnPrivate = "Berhasil!, ai_interactive telah diaktifkan di semua chat private!"
infos.interactiveOffPrivate = "Berhasil!, ai_interactive telah dimatikan di semua chat private!"
infos.interactiveOnAll = "Berhasil!, ai_interactive telah diaktifkan di semua chat!"
infos.interactiveOffAll = "Berhasil!, ai_interactive telah dimatikan di semua chat!"
infos.interactiveOnEnergy = "Berhasil!, sekarang energy bisa didapatkan dari interaksi!"
infos.interactiveOffEnergy = "Berhasil!, sekarang energy tidak akan bisa di dapat dari interaksi!"
infos.failTryImage = "Maaf terjadi kesalhan. coba gunakan gambar lain!"
infos.payInstruction = "*Perhatikan petunjuk berikut!*"

//Faceswap
infos.noSessionFaceswap = "Tidak ada sesi faceswap"
infos.successResetSessionFaceswap = "Berhasil mereset session faceswap!"
infos.cannotChangeFace = "Tidak dapat merubah, hanya ada 1 gambar dalam sesi swap!"
infos.successChangeFace = "Berhasil menukar gambar target dengan gambar yang terakhir anda kirimkan sebagai face!"

/*!-======[ Lora Info ]======-!*/
infos.lora_models = [
  'Donghua#01',
  'YunXi - PerfectWorld',
  'Sea God(Tang San) - Douluo Dalu',
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
  'Huo Yuhao ▪︎ The Unrivaled Tang Sect'
]
infos.lora = `
*Perhatikan petunjuk berikut!*
 \`\`\`[ StableDiffusion - Lora++ ]\`\`\`

Penggunaan: <prefix><command> <ID>|<prompt>
Contoh: #lora 3|beautyfull cat with aesthetic jellyfish, sea god themes

 => _ID adalah nomor dari model yang tersedia di list_

_*silahkan lihat list model yang tersedia:*_

*[ID] [NAME]*
`
for(let _=0;_<infos.lora_models.length;_++){
  infos.lora += `\n[${_+1}] [${infos.lora_models[_]}]`
}

/*!-======[ Filters Info ]======-!*/
infos.filters = `*Harap masukan type nya!*
            
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

_Contoh: .filters steam_`

/*!-======[ Text To Image Info ]======-!*/
infos.txt2img = `
*[ CARA PENGGUNAAN ]*
Param: \`.txt2img <checkpoint>[<lora>]|<prompt>\`

 ▪︎ \`Tanpa lora\`
-  .txt2img <checkpoint>[]|<prompt>

 ▪︎ \`1 lora\`
-  .txt2img <checkpoint>[<lora>]|<prompt>

 ▪︎ \`lebih dari 1 lora\`
- .txt2img <checkpoint>[<lora>,<lora>,...more lora]|<prompt>
--------------------------------------------------
 ▪︎ \`Contoh\`: 
- *.txt2img 1233[9380]|1girl, beautiful, futuristic, armored mecha*
--------------------------------------------------
 \`Searching id\`: 
 - lora: .lorasearch <query>
 - checkpoint: .checkpointsearch <query>

`

infos.faceSwap = (cht) => {
  return `
  \`Cara penggunaan Face Swap\`

[ OPSI A ] 
> (Cara biasa)

- Kirim gambar *target*
- Balas gambar *target* dengan mengirim gambar *wajah* dan sertakan caption *${cht.prefix + cht.cmd}*
-  Atau, balas gambar *target* dengan mengetik perintah *${cht.prefix + cht.cmd}* <url gambar2>*.

_Gambar target akan diganti dengan wajah pafa gambar kedua_


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
     ~ _Gambar terakhir yang anda kirimkan 
       akan menjadi gambar target_

_Sesi akan otomatis terhapus jika lebih dari 10 menit tidak ada interaksi swap_
`
}

infos.startedFaceswap = `Sesi berhasil dibuat. silahkan reply chatbot dengan gambar wajah.
Gambar pertama adalah gambar target yang akan diganti dengan wajah pada gambar berikutnya

- *Untuk mereset dan menghapus sesi faceswap*
    - .faceswap-reset
     ~ Mereset sesi akan memulai ulang face swap

- *Untuk mengganti gambar target*
    - .faceswap-change
     ~ _Gambar terakhir yang anda kirimkan 
       akan menjadi gambar target_

_Sesi akan otomatis terhapus setelah 10 menit_
`

/*!-======[ Auto Bell info ]======-!*/
infos.bell = `
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
    
*Contoh:*
> .bell on
`