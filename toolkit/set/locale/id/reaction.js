let infos = Data.infos.reaction ??= {};

/* ---
   PENTING!
   Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.
--- */


infos.play = "Untuk melakukan play youtube menggunakan react, harap beri react kepada pesan yang berisi teks"
infos.download = "Saat ini kami belum bisa mengunduh url <url>\nList yang didukung:\n- <listurl>"
infos.translate = "Harap beri reaksi <emoji> ke pesan teks untuk menerjemahkan ke bahasa indonesia"
infos.delete = "Manghapus pesan menggunakan react khusus hanya untuk admin jika target bukan pesan yang saya kirimkan"

infos.menu = ` *[ LIST REACTION CMD ]*

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
    |🔗||📎||🏷️|
> _Mengupload media ke cdn dan merubahnya menjadi link._

*Guide:*
_*Beri reaksi ke pesan target dengan salah satu emoji di atas*_
`

