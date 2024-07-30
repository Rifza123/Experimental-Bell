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
const fs = "fs".import(); 
// Atau bisa gunakan await untuk mengatasi promise
//const fs = await "fs".import()
```

---

### Cara Mengimpor Fungsi

Impor fungsi selalu dimulai dari awal, jadi tidak perlu kembali mundur dengan cara `../../`. Semua dimulai dari awal!

Misalnya, jika kita ingin mengimpor `events.js` yang terletak di `./tolkit/events.js` dari `./helpers/client.js`, maka cara pengambilannya adalah:

```javascript
const events = await "./tolkit/events.js".r()
```

---

### Pendefinisian Fitur pada Event Emitter

Menambahkan atau mengubah file di dalam folder `./helpers/Events` secara otomatis terdeteksi.

Berikut adalah bagian-bagian yang tersedia dalam events ini:

```javascript
ev.on({
    cmd: [''], // Cmd fitur yang digunakan sebagai pemanggil event, bisa banyak cmd
    listmenu: [''], // Akan terlihat dalam menu
    tag: "", // Menentukan di menu bagian mana list menu akan ditempatkan
    energy: 7, // Harga penggunaan energi pada event ini
    args: false,
    /*args: "Masukkan teks!", // Mengharuskan input teks/quoted teks
    */
    media: false,
    /*media: { // Membutuhkan media
        type: ["audio"], // Membutuhkan media bertipe audio (bisa audio, document, video, image, sticker)
        msg: "Reply audionya?", // Respon jika tidak ada audio yang di-reply
        etc: { // Lain-lain
            seconds: 360, // Maksimal audio 360 detik
        },
        save: false // Jika true maka media akan disimpan dalam bentuk file audio.mp3
    },*/
    /*media: { // Membutuhkan media
        type: ["sticker"], // Membutuhkan media bertipe sticker (bisa audio, document, video, image, sticker)
        msg: "Reply stickernya?", // Respon jika tidak ada sticker yang di-reply
        etc: { // Lain-lain
            isAnimated: false, // Mengharuskan sticker bertipe video
            isNoAnimated: false, // Mengharuskan sticker bertipe image
            isAvatar: false, // Mengharuskan sticker bertipe avatar
        },
        save: false // Jika true maka media akan disimpan dalam bentuk file sticker.webp
    },*/
    urls: false,
    /*urls: { // Memerlukan url
        msg: "Harap berikan link!", // Respon jika args bukan link
        formats: ["mediafire"] // Menentukan format apa yang terdapat pada url
    }*/
}, ({ args, media, urls }) => {
    // media adalah hasil download media, 
    // jika save false maka media adalah buffer,
    // jika save true maka media adalah nama file yang tersimpan
    // urls adalah hasil (array berisi url) dari pesan (args) yang diterima
    
    // Tambahkan fungsi disini
    /* contoh:
      cht.reply("Ok")
    */
});
```