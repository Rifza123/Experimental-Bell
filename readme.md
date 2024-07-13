# Experimental-Bell

## Cara Pasang

### Prasyarat
Pastikan Anda memiliki Node.js dan npm terinstal di komputer Anda.

1. Saat Anda mendapatkan kode sumber ini, pastikan untuk menginstal semua modul yang diperlukan dengan menjalankan perintah ini di terminal atau command prompt:

```bash
cd /halaman/mengarah/ke/Experimental-Bell
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

### Cara Mengimpor Modul dengan Berbeda

#### Contoh 1
```javascript
const fs = "fs".import(); 
// Tidak menggunakan await karena sudah didefinisikan di string.prototype.js
```

#### Contoh 2
```javascript
const fetch = await "node-fetch".import();
// Gunakan await untuk modul yang belum didefinisikan di prototype
```

---

### Cara Mengimpor Fungsi dengan Berbeda

Impor fungsi selalu dimulai dari awal, jadi tidak perlu kembali mundur dengan cara `../../`. Semua dimulai dari awal!

Misalnya, jika kita ingin mengimpor `events.js` yang terletak di `./tolkit/events.js` dari `./helpers/client.js`, maka cara pengambilannya adalah:

```javascript
const events = await "./tolkit/events.js".r()
```

---

### Penggunaan Event Emitter sebagai Alternatif case

Menambahkan atau mengubah file di dalam folder `./helpers/Events` secara otomatis terdeteksi.

Berikut adalah bagian-bagian yang tersedia dalam events ini:

```javascript
ev.on({
    cmd: [''], // Ini adalah cmd fitur yang digunakan sebagai pemanggil event, Anda bisa meletakkan banyak cmd
    listmenu: [''], // Bagian ini akan terlihat dalam menu
    tag: "", // Tag ini menentukan di menu bagian mana list menu akan ditempatkan
    energy: 7, // Harga penggunaan energi pada event ini
    args: "Masukkan teks!", // Mengharuskan input teks/quoted teks
    media: { // Membutuhkan media
        type: "audio", // Membutuhkan media bertipe audio, tipe terdiri dari audio, document, video, image, sticker
        msg: "Reply audionya?", // Respon jika tidak ada audio yang di-reply
        etc: { // Lain-lain
            seconds: 360, // Maksimal audio 360 detik
            msg: "Audio tidak boleh lebih dari 360 detik!" // Respon jika lebih dari 360 detik
        },
        save: false // Jika true maka media akan disimpan dalam bentuk file audio.mp3
    }
}, ({ media }) => {
    // media adalah kembalian dari media yang di-download, 
    // jika save false maka media adalah buffer,
    // jika save true maka media adalah nama file yang tersimpan
});
```