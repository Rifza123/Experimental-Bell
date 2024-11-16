let infos = Data.infos.group ??= {};

/* ---
   PENTING!
   Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.
--- */

infos.settings = `Opsi yang tersedia:\n\n- <options>`

infos.kick_add = `*Sertakan nomor/Reply/tag target yang akan <cmd> dari group!*\n\nExample: \n\n*Cara #1* => _Dengan reply pesan target_\n - <prefix><cmd>\n \n*Cara #2* => _Dengan tag target_\n - <prefix><cmd> @rifza \n \n*Cara #2* => _Dengan nomor target_\n - <prefix><cmd> +62 831-xxxx-xxxx`

infos.on = (cmd, input) => `Berhasil ${cmd == "on" ? "mengaktifkan":"menonaktifkan"} *${input}* di group ini!`