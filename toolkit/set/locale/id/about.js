let infos = Data.infos.about ??= {};

infos.help = "Sertakan pertanyaan yang ingin Anda tanyakan terkait bot ini untuk mendapatkan bantuan"

infos.energy = `
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
`

infos.stablediffusion = `*[ CARA PENGGUNAAN STABLEDIFFUSION (TXT2IMG) ]*

Command untuk menghasilkan gambar dengan teks: \`.txt2img <checkpoint>[<lora>]|<prompt>\`
📌 *Penjelasan Parameter:*
- \`<checkpoint>\`: ID model utama yang akan digunakan untuk menghasilkan gambar.
- \`<lora>\`: (Opsional) ID tambahan untuk memperkaya gaya atau detail gambar. Bisa menggunakan satu atau lebih Lora.
- \`<prompt>\`: Deskripsi atau kata kunci gambar yang ingin dihasilkan.

---------------------------------
📝 *Format Command:*

▪︎ \`Tanpa Lora\` - jika tidak ingin menambahkan efek atau gaya dari Lora:
- \`.txt2img <checkpoint>[]|<prompt>\`
  _Contoh_: \`.txt2img 1234[]|sunset, beach, high resolution\`

▪︎ \`Dengan 1 Lora\` - jika ingin menambahkan satu efek/gaya Lora:
- \`.txt2img <checkpoint>[<lora>]|<prompt>\`
  _Contoh_: \`.txt2img 1234[5678]|cyberpunk, neon lights, cityscape\`

▪︎ \`Dengan Banyak Lora\` - jika ingin menambahkan beberapa efek/gaya Lora sekaligus:
- \`.txt2img <checkpoint>[<lora>,<lora>,...more lora]|<prompt>\`
  _Contoh_: \`.txt2img 1234[5678,91011]|fantasy world, medieval castle, dragon\`

---------------------------------
📖 *Contoh Lengkap*: 
- \`.txt2img 1233[9380]|1girl, beautiful, futuristic, armored mecha\`
  _(Penjelasan)_:
  - **1233**: ID checkpoint utama yang digunakan.
  - **9380**: ID Lora untuk menambahkan detail tertentu.
  - **1girl, beautiful, futuristic, armored mecha**: Deskripsi untuk hasil gambar.

---------------------------------
🔍 *Cara Mencari ID Checkpoint atau Lora*:
- Untuk mencari ID Lora: gunakan command \`.lorasearch <kata kunci>\`
  _Contoh_: \`.lorasearch cyberpunk\` untuk mencari gaya Lora bertema cyberpunk.
  
- Untuk mencari ID Checkpoint: gunakan command \`.checkpointsearch <kata kunci>\`
  _Contoh_: \`.checkpointsearch anime\` untuk mencari model checkpoint bertema anime.

---------------------------------
⚠️ *Catatan Penting*:
- Pastikan ID checkpoint dan Lora yang digunakan valid agar command dapat berjalan dengan baik.
- Deskripsi pada \`<prompt>\` dapat mencakup detail tambahan untuk hasil yang lebih spesifik.

*[ INFORMASI TENTANG STABLEDIFFUSION ]*
- *Stable Diffusion adalah model AI generatif yang mengubah teks deskripsi menjadi gambar. Menggunakan teknik *diffusion*, model ini secara bertahap menghasilkan gambar berdasarkan input teks yang diberikan, memungkinkan pembuatan gambar dengan gaya atau tema tertentu. Dengan dukungan model tambahan seperti LoRA, pengguna dapat menyesuaikan detail atau efek gambar lebih lanjut. Model ini bersifat open-source dan banyak digunakan dalam seni digital dan desain kreatif.*
`

infos.helpList = `\`LIST PANDUAN/BANTUAN\`\n\n<keys>`

infos.helpNotfound = `*Ups kami tidak menemukan bantuan yang anda cari!*

Mungkin anda sedang mencari:
<top>`

infos.antilink = `📌 *Panduan Penggunaan Fitur Antilink Bot*

🔒 *1. Mengaktifkan Antilink:*
   - Perintah: \`.antilink on\`
   - *Gunakan perintah ini untuk mengaktifkan proteksi antilink pada grup.*

🔓 *2. Menonaktifkan Antilink:*
   - Perintah: \`.antilink off\`
   - *Gunakan perintah ini untuk menonaktifkan proteksi antilink.*

➕ *3. Menambah URL ke Daftar Antilink:*
   - Perintah: \`.antilink add <link>\`
   - *Gunakan perintah ini untuk menambahkan URL yang ingin diblokir.*
   - Contoh: \`.antilink add https://wa.me\`

➖ *4. Menghapus URL dari Daftar Antilink:*
   - Perintah: \`.antilink del <link>\`
   - *Gunakan perintah ini untuk menghapus URL dari daftar blokir.*
   - Contoh: \`.antilink del https://wa.me\`
`