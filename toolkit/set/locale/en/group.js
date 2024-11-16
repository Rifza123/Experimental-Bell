let infos = Data.infos.group ??= {};

/* ---
   PENTING!
   Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.
--- */

infos.settings = `Available options :\n\n- <options>`

infos.kick_add = `*Include the number/Reply/tag of the target to be <cmd> from the group!*\n\nExample: \n\n*Method #1* => _By replying to the target's message_\n - <prefix><cmd>\n \n*Method #2* => _By tagging the target_\n - <prefix><cmd> @rifza \n \n*Method #3* => _By using the target's number_\n - <prefix><cmd> +62 831-xxxx-xxxx`

infos.on = (cmd, input) => `Success ${cmd == "on" ? "activate":"disable"} *${input}* in this group!`
