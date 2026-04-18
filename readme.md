# Experimental-Bell

## Instalasi awal

1. Update package

```bash
apt update && apt upgrade
```

2. Install nodejs

```bash
apt install nodejs -y
```

3. Install ffmpeg (ini diperlukan untuk mengkonversi ke format webp terutama pada "stiker")

```bash
apt install ffmpeg -y
```

4. Install git

```bash
apt install git
```

5. Cloning repo

```bash
git clone https://github.com/Rifza123/Experimental-Bell.git
```

## Cara Pasang

### Prasyarat

1. Saat Anda mendapatkan kode sumber ini, pastikan untuk menginstal semua modul yang diperlukan dengan menjalankan perintah ini di terminal atau command prompt:

```bash
cd /halaman/mengarah/ke/Experimental-Bell
```

```bash
npm install
```

2. Setelah selesai menginstal, jalankan bot dengan perintah:

```bash
npm start
```

### Cara Menghubungkan ke Nomor WhatsApp

1. Setelah bot dijalankan, akan ada opsi untuk menghubungkan ke nomor WhatsApp Anda melalui QR atau pairing.

2. Jika Anda memilih QR, Anda memerlukan perangkat tambahan. Disarankan untuk menggunakan opsi pairing.

3. Jika Anda memilih pairing:
   - Masukkan nomor WhatsApp Anda, contoh: 62831109XXXXX.
   - Salin kode yang ditampilkan.
   - Buka WhatsApp Anda dan ikuti langkah-langkah berikut:
     - Klik titik tiga di kanan atas.
     - Pilih "Perangkat tertaut" > "Masuk dengan nomor telepon".
     - Masukkan kode yang Anda salin tadi.
     - Tunggu proses koneksi, ini bisa memakan waktu.

Jika mengalami kesulitan, coba hapus folder `lib/connection/session` dan jalankan ulang bot.

---

### Cara Mengimpor Modul

```javascript
const fs = 'fs'.import();
// Atau bisa gunakan await untuk mengatasi promise
//const fs = await "fs".import()
```

---

### Cara Mengimpor Fungsi

Impor fungsi selalu dimulai dari awal, jadi tidak perlu kembali mundur dengan cara `../../`. Semua dimulai dari awal!

Misalnya, jika kita ingin mengimpor `events.js` yang terletak di `./tolkit/events.js` dari `./helpers/client.js`, maka cara pengambilannya adalah:

```javascript
const events = await './tolkit/events.js'.r();
```

---

## ✨ Fitur Event Emitter Lanjutan

Eksperimen terbaru menambahkan kemampuan **rekayasa command** dengan memanfaatkan `ev.on()` dan `ev.emit()`.  
Fitur ini memungkinkan Anda **menjalankan event secara manual**, memodifikasi input secara dinamis, dan membuat alur **command interaktif** yang sangat berguna untuk sistem AI yang hemat code.

---

## 🚀 Menambahkan Event Baru

Berikut adalah bagian-bagian yang tersedia dalam events ini:

```javascript
ev.on(
  {
    cmd: [''], // Ini adalah cmd fitur yang digunakan sebagai pemanggil event, Anda bisa meletakkan banyak cmd
    listmenu: [''], // Bagian ini akan terlihat dalam menu
    tag: '', // Tag ini menentukan di menu bagian mana list menu akan ditempatkan
    energy: 7, // Harga penggunaan energi pada event ini
    premium: false, //Mengharuskan premium/tidak untuk menggunakan fitur ini
    args: 'Masukkan teks!', // Mengharuskan input teks/quoted teks
    badword: false, //Memblokir badword pada args
    media: {
      // Membutuhkan media
      type: ['audio'], // Membutuhkan media bertipe audio (tipe terdiri dari audio, document, video, image, sticker) bisa digunakn bersama did alam array
      msg: 'Reply audionya?', // Respon jika tidak ada audio yang di-reply
      etc: {
        // Lain-lain
        seconds: 360, // Maksimal audio 360 detik
        msg: 'Audio tidak boleh lebih dari 360 detik!', // Respon jika lebih dari 360 detik
      },
      save: false, // Jika true maka media akan disimpan dalam bentuk file audio.mp3
    },
    urls: {
      //Membutuhkan url
      formats: ['pinterest.com', 'pin.it'], //Format url
      msg: true, //respon message or msg: 'isi pesan balasan'
    },
    isMention: true, //Membutuhkan mention (tag/reply/input nomor)
    isQuoted: false, //membutuhkan quoted,
    onlyGame: ['tebakgambar', 'tebakanime'], //Jika anda menambahkan onlyGame, event ini hanya bisa digunakan saat bermain salah satu game dalam array
  },
  ({ media }) => {
    // media adalah kembalian dari media yang di-download,
    // jika save false maka media adalah buffer,
    // jika save true maka media adalah nama file yang tersimpan
  }
);
```

Tambahkan file baru di `./helpers/Events/` atau gunakan pola berikut di file mana saja:
Menambahkan atau mengubah file di dalam folder `./helpers/Events` secara otomatis terdeteksi.

```javascript
ev.on(
  {
    cmd: ['ai'], // Command pemicu
    listmenu: ['ai'], // Tampil di menu dengan nama AI
    tag: 'tools', // Kategori menu
    energy: 5, // Energi yang digunakan
  },
  async ({ cht }) => {
    await cht.reply('Hai! Ini adalah balasan dari event ai.');
  }
);
```

## ⚡ Menjalankan Emit & Memodifikasi Input

Anda bisa **memanggil event lain secara paksa** menggunakan `ev.emit()`.
Misalnya, kita ingin mengganti command dan pertanyaan (`cht.cmd` dan `cht.q`) sebelum menjalankan ulang event:

```javascript
// Ubah command & input
cht.cmd = 'ai';
cht.q = 'Hai';

// Jalankan event 'ai' dengan data yang sudah dimodifikasi
ev.emit('ai', { cht });
```

Dengan cara ini, Anda bisa:

- **Mengalihkan** user ke command lain.
- Menyusun **alur percakapan interaktif**.
- Membuat sistem **multi-step AI** atau chatbot yang fleksibel.

---

## 🧩 Contoh: AI Interactive

Berikut contoh nyata bagaimana event lain bisa memicu event tambahan:
//code ini diterapkan di ./helpers/interactive.js

```javascript
let _ai = await bell(text);
let config = _ai?.data || {};

switch (config?.cmd) {
  case 'sticker':
    await cht.reply(config?.msg || 'ok', { replyAi: false });
    return ev.emit('s');

  case 'afk':
    await cht.reply(config?.msg || 'ok', { replyAi: false });
    cht.q = config?.cfg?.reason;
    return ev.emit('afk');

  case 'bard':
    await cht.reply(config?.msg || 'ok', { replyAi: false });
    cht.q = config.cfg?.query;
    return ev.emit('bard');
}
```

Contoh di atas menunjukkan:

- **Rekayasa command**: `config.cmd` menentukan event mana yang dijalankan.
- **Pengubahan input**: `cht.q` bisa diisi ulang untuk menyesuaikan pertanyaan.

---

## 💡 Manfaat Utama

- 🔄 **Dynamic Flow**: Alihkan perintah ke event lain dengan input yang disesuaikan.
- 🕹️ **Command Engineering**: Mengatur logika kompleks (AI, game, dsb.) tanpa duplikasi kode.
- 🎯 **Interaktif**: Buat chatbot multi-tahap atau sistem cerdas.

---

## 🙌 Thanks to All Contributors

Terima kasih kepada semua yang telah berkontribusi dan mendukung pengembangan project ini.  
Setiap masukan, ide, dan bantuan sangat berarti!

### 🏆 Kontributor Utama

- **Azfir (rifza.p.p)**
  - [Instagram](https://www.instagram.com/rifza.p.p)
  - [GitHub](https://github.com/Rifza123)
  - [YouTube](https://www.youtube.com/@rifza)
  - [WhatsApp Channel](https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V)
  - **Peran:** Semua kontribusi utama, pengelolaan dan pengembangan penuh proyek.

### 🤝 Kontributor Lain

- **Hanif Skizo**
  - [Instagram](https://instagram.com/htr.ox)
  - **Kontribusi:** Penambahan fitur game _chess.js_.

- **Barr**
  - [Instagram](https://www.instagram.com/pler.curutt)
  - **Kontribusi:** Pembuatan modul **autoBackup (detector.js)**, **listUser (owner.js)** dan **antiimg/antivid/antidoct/antistk/antistkpck/antivoice**.

[![](https://contrib.rocks/image?repo=Rifza123/Experimental-Bell)](https://github.com/Rifza123/Experimental-Bell/graphs/contributors)

## 📄 License

[MIT](./LICENSE) © Rifza
