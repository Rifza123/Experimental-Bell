# Experimental-Bell (Bella Clarissa)

> Framework bot WhatsApp interaktif modern berbasis **EventEmitter** dan bertenaga **Termai API** (`api.termai.cc`), dirancang dengan performa tinggi, arsitektur modular tanpa build-step, sistem **Jadibot (Sub-Bot)** multi-slot independen, interaksi AI cerdas, dan manajemen energi adaptif.

---

## 📑 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Arsitektur & Struktur Direktori](#-arsitektur--struktur-direktori)
- [Prasyarat Sistem](#-prasyarat-sistem)
- [Panduan Instalasi & Menjalankan Bot](#-panduan-instalasi--menjalankan-bot)
  - [Instalasi di Linux / VPS (Ubuntu/Debian)](#1-instalasi-di-linux--vps-ubuntudebian)
  - [Instalasi di Termux (Android)](#2-instalasi-di-termux-android)
  - [Konfigurasi Awal (`config.json`)](#3-konfigurasi-awal-configjson)
  - [Menghubungkan WhatsApp (Pairing / QR)](#4-menghubungkan-whatsapp-pairing--qr)
  - [Manajemen Proses (PM2)](#5-manajemen-proses-pm2)
- [Panduan Pengembangan Fitur (`ev.on`)](#-panduan-pengembangan-fitur-evon)
  - [Struktur & Opsi Filter Event](#struktur--opsi-filter-event)
  - [Payload Argumen Handler](#payload-argumen-handler)
  - [Contoh Implementasi Event](#contoh-implementasi-event)
- [Rekayasa Command & AI Interactive Routing (`ev.emit`)](#-rekayasa-command--ai-interactive-routing-evemit)
- [Konfigurasi Bot (`.set`)](#-konfigurasi-bot-set)
- [Sistem Jadibot (Sub-Bot Engine)](#-sistem-jadibot-sub-bot-engine)
- [Sistem Pembaruan Sistem (OTA Update)](#-sistem-pembaruan-sistem-ota-update)
- [Sistem Lokalisasi & Standar Format Pesan](#-sistem-lokalisasi--standar-format-pesan)
- [Livechart Cloud & Sistem Tiket](#-livechart-cloud--sistem-tiket)
- [Kontributor & Lisensi](#-kontributor--lisensi)

---

## ✨ Fitur Utama

- **Modern Baileys Socket**: Menggunakan fork Baileys yang disederhanakan tanpa TypeScript build overhead, mendukung penuh CommonJS dan ESM.
- **Modular Event Emitter dengan Hot-Reload**: Setiap modul di dalam `helpers/Events/` dipindai secara otomatis. Perubahan file di-hot-reload tanpa perlu mematikan atau me-restart bot.
- **Native Jadibot (Sub-Bot Engine)**: Mendukung penautan multi-nomor WhatsApp dalam satu server proses, dilengkapi isolasi database, custom API key, custom prefix, custom logic AI, custom voice, dan media dadu per bot.
- **AI Interactive Routing**: Engine pemrosesan bahasa alami yang mampu memetakan maksud pesan pengguna secara cerdas dan mendelegasikannya ke sub-event yang sesuai via `ev.emit`.
- **Flexible Multi-Level Energy System**: Konsumsi energi adaptif dengan dukungan `continue: true` — membuka menu, daftar filter, atau panduan tidak memotong energi, deduksi hanya dieksekusi saat proses utama berjalan.
- **Adaptive Multi-Menu UI/UX**: Pilihan variasi menu lengkap (Button, List Section, Product, Rich Response, dan Teks Murni) dengan sistem fallback teks interaktif berbasis nomor (`quotedQuestionCmd`).
- **Sistem Lokalisasi Terpusat (i18n)**: Dukungan multi-bahasa (`id.js` & `en.js`) dengan template pesan dinamis dan integrasi footer native WhatsApp.
- **Livechart Real-Time WebSocket**: Koneksi real-time ke cloud Termai untuk sinkronisasi notifikasi rilis, remote reaction saluran WhatsApp, dan monitoring status.
- **OTA System Updates**: Pembaruan file langsung dari repository GitHub via `.checkupdate` & `.update` dengan visualisasi hierarki berkas (tree emoji).

---

## 📂 Arsitektur & Struktur Direktori

```text
├── connection/               # Handler koneksi Baileys & Jadibot socket
│   ├── jadibot.js            # Engine koneksi dan auth sesi Jadibot
│   └── systemConnext.js      # Inisialisasi koneksi utama bot
├── helpers/                  # Core handler & middleware internal
│   ├── Events/               # Direktori event listener modular (Hot-Reload)
│   │   ├── ai.js             # Fitur AI chat, vision, image gen, audio, i2v
│   │   ├── converter.js      # Konversi format media (stiker, audio, vn, video)
│   │   ├── downloader.js     # Media downloader (TikTok, YouTube, IG, dll)
│   │   ├── game.js           # Engine game interaktif (Ular Tangga, tebak-tebakan)
│   │   ├── group.js          # Manajemen administrasi grup WhatsApp
│   │   ├── maker.js          # Image manipulation & visual meme generator
│   │   ├── others.js         # Menu, statistik, runtime, afk, info sistem
│   │   ├── owner.js          # Kontrol bot, evaluasi, .set, backup, updater
│   │   ├── relationship.js   # Fitur interaksi sosial & relationship
│   │   ├── rpg.js            # Engine game RPG survival, crafting, inventory
│   │   ├── search.js         # Fitur pencarian informasi & web scraping
│   │   ├── tools.js          # Utilitas umum, OCR, AI enhancers, web tools
│   │   └── werewolf.js       # Game Werewolf multi-player
│   ├── client.js             # Message parser & helper payload WhatsApp
│   ├── events.js             # EventEmitter core dispatcher & validator
│   ├── initialize.js         # State loader, session preparer, permission checker
│   ├── interactive.js        # AI intent classifier & action dispatcher
│   ├── jadibot.js            # Jadibot controller, lifecycle, & manager
│   ├── reaction.js           # Auto-reaction handler & keyword detector
│   ├── stubTypeMsg.js        # WhatsApp system stub message handler
│   └── utils.js              # Helper fungsi operasional umum
├── machine/                  # Background service, AI engine, WebSocket client
│   ├── dashboard.js          # Generator grafis status server & memori
│   ├── livechart.js          # WebSocket client ke cloud server Termai
│   └── ...                   # Engine modul machine AI spesifik
├── toolkit/                  # Basis utilitas, database, dan setelan
│   ├── db/                   # Penyimpanan database lokal JSON
│   ├── set/                  # Konfigurasi bot, asset, & lokalisasi
│   │   ├── config.json       # File konfigurasi utama
│   │   ├── global.js         # Global variable setter
│   │   └── locale/           # Direktori bahasa (id.js & en.js)
│   └── func.js               # Library helper utilitas bawaan
├── index.js                  # Entry point utama aplikasi
└── package.json              # Definisi dependensi & metadata project
```

---

## ⚙️ Prasyarat Sistem

- **Node.js**: Versi `18.x` atau lebih baru (`v20.x` / `v21.x` LTS direkomendasikan).
- **FFmpeg**: Diperlukan untuk manipulasi audio, video, dan konversi stiker animasi WebP.
- **ImageMagick / WebP Tools**: Untuk rendering grafis dan optimasi stiker.
- **Git**: Untuk instalasi dan sinkronisasi source code.
- **RAM**: Minimal 512 MB (direkomendasikan 1 GB+ untuk multi-jadibot).

---

## 🚀 Panduan Instalasi & Menjalankan Bot

### 1. Instalasi di Linux / VPS (Ubuntu/Debian)

```bash
# Update repository & install paket pendukung
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm ffmpeg git imagemagick -y

# Clone repository
git clone https://github.com/Rifza123/Experimental-Bell.git
cd Experimental-Bell

# Install dependensi Node.js
npm install
```

### 2. Instalasi di Termux (Android)

```bash
# Update paket Termux
pkg update && pkg upgrade -y
pkg install nodejs-lts ffmpeg git imagemagick -y

# Clone repository
git clone https://github.com/Rifza123/Experimental-Bell.git
cd Experimental-Bell

# Install dependensi
npm install
```

### 3. Konfigurasi Awal (`config.json`)

Buka dan sesuaikan berkas `toolkit/set/config.json`:

```json
{
  "owner": ["62831xxxxxxxx"],
  "coowner": ["62812xxxxxxxx"],
  "botname": "Bella Clarissa",
  "botfullname": "Experimental-Bell",
  "ownername": "rifza",
  "locale": "id",
  "cfg": {
    "public": true,
    "listSection": true,
    "premium_mode": true,
    "energy_mode": true
  },
  "api": {
    "xterm": {
      "key": "YOUR_TERMAI_API_KEY",
      "url": "https://api.termai.cc"
    }
  }
}
```

> **Catatan API Key:** Dapatkan API Key melalui [termai.cc](https://termai.cc) untuk mengaktifkan seluruh fitur AI, generator media, dan layanan backend bot.

### 4. Menghubungkan WhatsApp (Pairing / QR)

Jalankan bot melalui terminal:

```bash
npm start
```

1. Terminal akan menampilkan prompt pemilihan metode penautan (**Pairing Code** atau **QR Code**).
2. Pilih opsi **Pairing Code** (direkomendasikan).
3. Masukkan nomor WhatsApp bot dengan format kode negara (contoh: `62831109xxxxx`).
4. Masukkan kode 8 digit yang muncul di terminal ke WhatsApp Anda:
   - Buka WhatsApp di ponsel ➔ **Perangkat Tertaut** ➔ **Tautkan Perangkat** ➔ **Tautkan dengan nomor telepon saja**.
5. Tunggu proses otentikasi hingga sesi tersimpan di folder `session/`.

> **Troubleshooting Sesi:** Jika koneksi terputus atau terjadi corrupt session, hapus folder `session/` lalu jalankan ulang bot.

### 5. Manajemen Proses (PM2)

Gunakan PM2 untuk menjaga bot tetap berjalan di latar belakang (background) dan auto-restart saat server reboot:

```bash
# Install PM2 secara global
npm install -g pm2

# Jalankan bot dengan PM2
pm2 start index.js --name "bell"

# Simpan state PM2
pm2 save
pm2 startup
```

---

## 🛠️ Panduan Pengembangan Fitur (`ev.on`)

Pengembangan fitur bot menggunakan sistem **EventEmitter** terintegrasi. Cukup tambahkan file baru di dalam folder `helpers/Events/` atau daftarkan listener pada file yang sudah ada. Berkas akan otomatis terdeteksi dan di-hot-reload saat disimpan.

### Struktur & Opsi Filter Event

```javascript
ev.on(
  {
    cmd: ['namacmd', 'alias'],     // Daftar kata kunci pemanggil command
    listmenu: ['namacmd'],        // Nama yang akan ditampilkan pada .menu
    tag: 'tools',                 // Kategori menu (ai, tools, downloader, game, dll)
    energy: 5,                    // Biaya energi per eksekusi
    premium: false,               // Set true jika command khusus pengguna premium
    isOwner: false,               // Set true jika command khusus Owner
    isCoOwner: false,             // Set true jika command khusus Co-Owner
    isGroup: false,               // Batasi hanya bisa digunakan di dalam grup
    isPrivate: false,             // Batasi hanya bisa digunakan di private chat
    args: 'Sertakan query pencarian!', // Pesan balasan jika argumen kosong
    media: {                      // Filter kebutuhan media
      type: ['image', 'video'],   // Tipe media yang diterima (image, video, audio, sticker, document)
      msg: 'Kirim/reply gambar!', // Pesan balasan jika media tidak ditemukan
      etc: {
        seconds: 60,              // Batas durasi maksimal (untuk video/audio)
        msg: 'Durasi maksimal 60 detik!'
      },
      save: false                 // Set true jika ingin media otomatis disimpan ke disk
    },
    urls: {                       // Filter format URL
      formats: ['instagram.com', 'tiktok.com'],
      msg: 'Sertakan URL yang valid!'
    },
    isMention: false,             // Memerlukan mention / tag / reply user
    isQuoted: false,              // Memerlukan pesan yang di-reply (quote)
    badword: false,               // Memblokir eksekusi jika argumen mengandung kata kasar
    onlyGame: false,              // Batasi hanya bisa dipanggil saat sesi game aktif
    continue: false               // Set true untuk alur multi-step tanpa potong energi di awal
  },
  async ({ cht, Exp, is, chatDb, userDb, args, media, urls, continue: cont }) => {
    // Logika fitur ditulis di sini
  }
);
```

### Payload Argumen Handler

Setiap callback event menerima satu objek konteks dengan properti berikut:

| Parameter | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `cht` | `Object` | Objek pesan terurai (teks, sender, id, quote, prefix, command, helper reply) |
| `Exp` | `Object` | Instance socket Baileys WhatsApp bot |
| `is` | `Object` | Flag boolean status (`is.owner`, `is.group`, `is.premium`, `is.jadibot`, dll) |
| `chatDb` | `Object` | Referensi database memori percakapan grup/chat saat ini |
| `userDb` | `Object` | Referensi database pengguna pengirim |
| `args` | `String` | String teks argumen setelah pemanggilan command |
| `media` | `Buffer\|String` | Buffer file media (atau path file jika `save: true`) |
| `urls` | `Array` | Daftar URL yang diekstrak dari pesan |
| `continue` | `Function` | Callback untuk memotong energi secara manual pada alur multi-step |

### Contoh Implementasi Event

#### 1. Command Sederhana (Teks & Utilitas)

```javascript
ev.on(
  {
    cmd: ['say', 'echo'],
    listmenu: ['say'],
    tag: 'tools',
    args: 'Tuliskan teks yang ingin diucapkan bot!',
    energy: 1,
  },
  async ({ cht, args }) => {
    await cht.reply(args);
  }
);
```

#### 2. Command Pengolah Media (Converter Stiker)

```javascript
ev.on(
  {
    cmd: ['s', 'sticker', 'stiker'],
    listmenu: ['stiker'],
    tag: 'converter',
    media: {
      type: ['image', 'video'],
      msg: 'Balas atau kirim gambar/video dengan caption .s untuk dijadikan stiker!',
      etc: {
        seconds: 15,
        msg: 'Durasi video untuk stiker maksimal 15 detik!',
      },
    },
    energy: 2,
  },
  async ({ cht, Exp, media }) => {
    let sticker = await Exp.func.toSticker(media, {
      packname: cfg.botname,
      author: cfg.ownername,
    });
    await Exp.sendMessage(cht.id, { sticker }, { quoted: cht });
  }
);
```

#### 3. Command Interaktif Multi-Step dengan `continue: true`

```javascript
ev.on(
  {
    cmd: ['hdvid', 'enhancevideo'],
    listmenu: ['hdvid'],
    tag: 'tools',
    media: {
      type: ['video'],
      msg: 'Kirim atau balas video yang ingin ditingkatkan kualitasnya!',
    },
    energy: 15,
    continue: true, // Energi tidak dipotong saat menu opsi ditampilkan
  },
  async ({ cht, args, media, continue: cont }) => {
    let options = ['uhd', '4k', '2k', 'hd', 'repair', 'color'];
    let selected = args.trim().toLowerCase();

    if (!options.includes(selected)) {
      return cht.reply(
        `🎬 *PILIHAN RESOLUSI VIDEO*\n\n` +
        `Pilihan yang tersedia:\n` +
        options.map((o) => `• .hdvid ${o}`).join('\n') +
        `\n\n> Balas video dengan menyertakan resolusi di atas.`
      );
    }

    // Potong energi setelah input diverifikasi dan proses dimulai
    await cont();
    await cht.reply('⏳ *Sedang memproses video...*');
    // Eksekusi API enhancer...
  }
);
```

---

## ⚡ Rekayasa Command & AI Interactive Routing (`ev.emit`)

Bot mendukung **rekayasa command dinamis** menggunakan `ev.emit()`. Anda dapat memodifikasi command (`cht.cmd`) dan argumen pertanyaan (`cht.q`) lalu mengeksekusi ulang event target secara programatik:

```javascript
// Mengalihkan pesan percakapan natural ke command AI internal
cht.cmd = 'ai';
cht.q = 'Jelaskan cara kerja fotosintesis secara singkat';
ev.emit('ai', { cht });
```

Pola ini diterapkan pada `helpers/interactive.js` untuk membuat chatbot NLP yang mampu memanggil berbagai fungsi tools, converter, downloader, dan game secara otomatis berdasarkan maksud teks pengguna.

---

## ⚙️ Konfigurasi Bot (`.set`)

Owner dapat mengatur seluruh perilaku bot secara instan menggunakan perintah `.set <opsi> <nilai>`:

| Opsi Pengaturan | Pilihan Nilai | Fungsi & Deskripsi |
| :--- | :--- | :--- |
| `public` | `on` / `off` | Mengubah mode akses bot (Publik atau Hanya Owner) |
| `autotyping` | `on` / `off` | Mengaktifkan indikator mengetik otomatis saat merespons |
| `autoreadsw` | `on` / `off` | Membaca status (story) WhatsApp secara otomatis |
| `autoreadpc` | `on` / `off` | Membaca pesan masuk di private chat secara otomatis |
| `autoreadgc` | `on` / `off` | Membaca pesan masuk di grup chat secara otomatis |
| `similarCmd` | `on` / `off` | Koreksi otomatis saat user salah mengetik command mirip |
| `premium_mode`| `on` / `off` | Mode proteksi fitur khusus pengguna premium |
| `editmsg` | `on` / `off` | Menggunakan efek edit pesan (`cht.edit`) pada respon bertahap |
| `register` | `on` / `off` | Mewajibkan pengguna mendaftar (`.register`) sebelum menggunakan bot |
| `didYouMean` | `on` / `off` | Memberikan saran command jika perintah tidak ditemukan |
| `font` | `1 - 30` / `off` | Mengubah gaya font teks respon bot secara global |
| `energy_mode` | `on` / `off` | Mengaktifkan/menonaktifkan sistem pembatasan energi bot |
| `button` | `on` / `off` | Mengaktifkan komponen WhatsApp Button pada menu |
| `rich` | `on` / `off` | Mengaktifkan format tampilan Meta AI Rich Response |
| `remoteReaction` | `on` / `off` | Mengaktifkan respon reaksi saluran otomatis via WebSocket |
| `linkpreview` | `on` / `off` | Menyertakan cuplikan link preview pada respon menu |
| `listSection` | `on` / `off` | Mengontrol pengiriman menu interaktif List Section vs Teks Quoted |
| `dadu` | `reply media` / `off` | Mengatur media kustom (stiker/gambar/video) sebagai dadu Ular Tangga |

---

## 🤖 Sistem Jadibot (Sub-Bot Engine)

Engine Jadibot memungkinkan pengguna menautkan nomor WhatsApp mereka ke bot utama sebagai sub-bot mandiri dengan sesi terisolasi.

### Perintah Pengelolaan Jadibot

```text
• .jadibot <nomor>
> Tautkan bot baru menggunakan metode Pairing Code (contoh: .jadibot 62831xxx)

• .jadibot <nomor> qr
> Tautkan bot baru menggunakan pemindaian QR Code

• .jadibot status
> Periksa rilis status, sisa masa aktif, dan slot bot kamu

• .jadibot apikey <key>
> Pasang Termai API Key kustom khusus untuk bot kamu

• .jadibot set public on/off
> Pengaturan mode akses publik atau privat untuk bot kamu

• .jadibot prefix <prefix/off>
> Pengaturan simbol prefix khusus untuk bot kamu (atau multi-prefix)

• .jadibot logic <teks_logic>
> Kustomisasi kepribadian dan prompt instruksi AI untuk bot kamu

• .jadibot voice <nama_voice>
> Mengubah model suara AI Text-to-Speech untuk bot kamu

• .jadibot restart <slot>
> Menjalankan ulang sub-bot pada slot tertentu

• .jadibot stop <slot>
> Menghentikan sementara sub-bot pada slot tertentu

• .jadibot delete <slot>
> Menghapus sesi sub-bot dan membersihkan data slot
```

---

## 🔄 Sistem Pembaruan Sistem (OTA Update)

Bot dilengkapi sistem pembaruan Over-The-Air (OTA) langsung dari repository resmi tanpa perlu clone ulang atau akses manual ke terminal:

1. **Pengecekan Rilis**:
   ```text
   .checkupdate
   ```
   Bot akan memindai versi terbaru ke server, memeriksa perbedaan berkas lokal, dan menampilkan notifikasi pembaruan beserta pratinjau hierarki berkas:
   ```text
   📂 File Changed:
   ├── ✏️ `./machine/livechart.js`
   ├── ✏️ `./helpers/events.js`
   ├── ✏️ `./helpers/initialize.js`
   └── ➕ `./helpers/Events/minigames.js`
   ```
2. **Konfirmasi Pembaruan**:
   - Cukup balas (*quote reply*) pesan notifikasi update tersebut dengan mengetik **`y`** atau **`ya`**.
   - Sesi konfirmasi tersimpan secara aman berbasis ID pesan hingga 2 hari.
3. **Pembaruan Berkas Spesifik**:
   ```text
   .update <URL_RAW_GITHUB>
   ```

---

## 🌐 Sistem Lokalisasi & Standar Format Pesan

Seluruh respon teks disimpan terpusat di `toolkit/set/locale/id.js` (Bahasa Indonesia) dan `toolkit/set/locale/en.js` (Bahasa Inggris).

### Standar Format Pesan WhatsApp:
- **Format Deskripsi Komando**: Tulis nama command pada baris tersendiri, diikuti baris deskripsi dengan awalan `> ` untuk format *quote subtext*:
  ```text
  • .jadibot <nomor>
  > Tautkan bot baru menggunakan Pairing Code
  ```
- **Judul & Seksi**: Gunakan emoji dan huruf kapital tebal (contoh: `📱 *KONEKSI & MANAGEMENT*`).
- **Native WhatsApp Footer**: Gunakan properti `footer` bawaan `Exp.sendMessage`:
  ```javascript
  Exp.sendMessage(cht.id, { text: 'Pesan utama', footer: 'Teks footer polos' }, { quoted: cht });
  ```

---

## 📡 Livechart Cloud & Sistem Tiket

- **Livechart WebSocket**: Bot terhubung secara real-time ke WebSocket server Termai untuk sinkronisasi broadcast rilis dan status jaringan.
- **Sistem Tiket Bantuan Developer**:
  - Kirim laporan bug/kendala langsung ke developer:
    ```text
    .ticket <deskripsi kendala yang dialami>
    ```
  - Cek tiket aktif Anda:
    ```text
    .ticket list
    ```
  - Balas pesan tanggapan dari developer untuk melanjutkan sesi diskusi tiket secara langsung.

---

## 👥 Kontributor

Terima kasih kepada seluruh kontributor yang telah berpartisipasi dalam pengembangan project ini:

[![Contributors](https://contrib.rocks/image?repo=Rifza123/Experimental-Bell)](https://github.com/Rifza123/Experimental-Bell/graphs/contributors)

- **Azfir (rifza.p.p)** — *Lead Developer & Creator*  
  [GitHub](https://github.com/Rifza123) • [YouTube](https://www.youtube.com/@rifza) • [Instagram](https://www.instagram.com/rifza.p.p) • [WhatsApp Channel](https://whatsapp.com/channel/0029VaauxAt4Y9li9UtlCu1V)
- **Hanif skizo** — *Kontribusi Engine Game (chess.js)*
- **Barr** — *Kontribusi Auto-Backup Daemon*

---

## 📄 Lisensi

Project ini dilisensikan di bawah [MIT License](./LICENSE) © Rifza.
