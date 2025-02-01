let infos = Data.infos.owner ??= {}; 

  /*/------- 
   MESSAGES
/*/
infos.succesSetLang = `*Successfully changed the default language to:* \`<lang>\``
infos.unBannedSuccess = `*Success! The user @<sender> has been removed from the banned list*`
infos.delBanned = `You have been removed from the banned list!\n_You are now allowed to use the bot again!_`

infos.bannedSuccess = `*Successfully banned the user!*\n ▪︎ User:\n- @<sender>\n ▪︎ Duration added:\n- <days>days <hours>hours <minutes>minutes <seconds>seconds <milliseconds>ms\n\n`
infos.addBanned = `\`You have been blocked from the bot❗️\`\nDuration: <days>days <hours>hours <minutes>minutes <seconds>seconds <milliseconds>ms`

infos.successSetVoice = `Success✅️\n\n- Voice: _<voice>_`
infos.successSetLogic = `Success change logic ai chat✅️\n\n\`New Logic:\`\n<logic>`

infos.userNotfound = "Wrong number or user not registered❗️"
infos.wrongFormat = "*❗Incorrect format, please check again*"

infos.successDelBadword = `Successfully deleted<input> into the badword list! `
infos.successSetThumb = "Successfully changed menu thumbnail!"
infos.successAddBadword = `Successfully added<input> into the list badword!`

infos.isModeOn = `Sory, <mode> already in on mode!`
infos.isModeOff = `Sory, <mode> already in off mode!`

infos.isModeOnSuccess = `Successful activation <mode>`
infos.isModeOffSuccess = `Successfully disabled <mode>`

infos.badword = `Want to add, delete or view the list?\nExample:<cmd> add|tobrut`
infos.badwordAddNotfound = `Action may not be in the list!\n*List Action*: add, delete, list\n\n_Example:<cmd> add|tobrut_`

infos.listSetmenu = `\`List of available menu types:\`\n\n- <list>`
infos.successSetMenu = `Successfully changed the menu to <menu>`
infos.lockedPrem =  "Get premium access to unlock locked features!"

infos.audiolist = `Successfully added audio to the list<list> ✅️\n\nAudio:<url> \n> To see the list please type *.getdata audio<list> *`
infos.menuLiveLocationInfo = "_The liveLocation menu is not visible in private chat. Please reconsider using this menu._"
infos.checkJson = `Please double check the JSON Object anda!\n\nTypeError:\n<rm>\n> <e>`
 
/*!-======[ Set Info ]======-!*/
infos.set = `
[ BOT SETTING ]

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
- call <off or action>
- autoreactsw <off or emojis>
- checkpoint <checkpoint_id>
- lora <lora_id>

_Example: .set public on_`

infos.setCall = `
\`How to Use:\`
 ▪︎ .set call <off or action>
- Example: .set call reject

_You can also add another action by using the *+* sign_

Example: .set call reject+block

\`LIST ACTION\`
- reject (decline the call)
- block (block the caller)
`
infos.successSetCall = "Successfully set anti call!\nAction: <action>"
infos.successOffCall = "Successfully turned off anti call!"

infos.setAutoreactSw = `
\`How to use:\`

 ▪︎ .set autoreactsw <off or emojis>
- Contoh: .set autoreactsw 😀😂🤣😭😘🥰😍🤩🥳🤢🤮

_You can add as many emojis as you like_
`
infos.successSetAutoreactSw = "Successfully setup Autoreact SW!\nEmoji: <action>"
infos.successOffAutoreactSw = "Successfully disabled Autoreact SW!"

infos.setHadiah = `
\`How to Use:\`
▪︎ .set hadiah <Game> <Energy>
- Example: .set hadiah tebakgambar 60

\`LIST GAME\`
<game>
`

infos.premium_add = `
*Guide to Adding/Removing Premium Time (Owner-Only Feature)*

*Options available:*
- addprem (to add time)
- kurangprem (to reduce time)
- delprem (to remove premium status)

*How to use it?*

_*Include number/Reply/tag the target user*_

Examples:
 - *#1* => _By replying to the target's message_
- .addprem 1d
- .kurangprem 1d
- .delprem

 - *#2* => _By tagging the target_
- .kurangprem @rifza|1d
- .addprem @rifza|1d
- .delprem @rifza|1d
 
 - *#3* => _By entering the target's number_
- .addprem +62 831-xxxx-xxxx|1d
- .kurangprem +62 831-xxxx-xxxx|1d
- .delprem +62 831-xxxx-xxxx|1d

*Supported Time Units:*
- s, second, seconds
- m, minute, minutes
- h, hour, hours
- d, day, days
- w, week, weeks

*Examples of using different time units:*
- .addprem @rifza|30 seconds 
    ➡️ Adds 30 seconds.
- .addprem @rifza|1 minute 
    ➡️ Adds 1 minute.
- .addprem @rifza|1 hour 15 seconds 
    ➡️ Adds 1 hour 15 seconds.
- .addprem @rifza|2 days 4 hours 
    ➡️ Adds 2 days 4 hours.
- .addprem @rifza|1 week 
    ➡️ Adds 1 week.
- .addprem @rifza|1w 2d 3h 
    ➡️ Adds 1 week 2 days 3 hours.
- .addprem @rifza|1d 2h 30m 15s 
    ➡️ Adds 1 day 2 hours 30 minutes 15 seconds.

\`Please read this guide carefully to avoid needing further assistance from the admin. Thank you.\``

infos.setFquoted = `
\`Usage Examples:\`

- *Method 1*
   ~ _Reply to a message by sending the command *.set fquoted <name>_
     \`Example\`:
     - .set fquoted welcome

- *Method 2*
   ~ _Send a message with the command *.set fquoted <name> <quoted object>*_
     \`Example\`:
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
\`Usage Examples:\`

- *Method 1*
   ~ _Reply to a message by sending the command *.set audio <name>*_
     \`Example\`:
     - .setdata audio welcome

- *Method 2*
   ~ _Send a message with the command *.set audio <name> <url>*_
     \`Example\`:
     - .setdata audio welcome https://catbox.moe/xxxxxxx.mp3
     `

infos.delAudio = `
~ _Send a message with the command *.deldata audio <name> <url>*_
   \`Example\`:
   - .deldata audio welcome https://catbox.moe/xxxxxxx.mp3
`

infos.setLogic = `
*To modify the logic:*

_Send the command *<cmd> logic* in the following format:_

<cmd> logic 
Nickainame: <your AI name>
Fullainame: <your AI nickname>
Profile: <Your Logic Here>

\`Current Logic:\`
Fullainame: <botfullname>
Nickainame: <botnickname>
Profile: <logic>
`

infos.banned = `
*Guide for Temporarily Banning a User (Owner-Only Feature)*

*Options:*
- banned (to ban a user for a specified duration)
- unbanned (to remove a user's ban, no duration required)

*How to use it?*

_*Include number/Reply/tag the target user*_

Examples:
 - *#1* => _By replying to the target's message_
- .banned 1d
- .unbanned

 - *#2* => _By tagging the target_
- .banned @rifza|1d
- .unbanned @rifza

 - *#3* => _By entering the target's number_
- .banned +62 831-xxxx-xxxx|1d
- .unbanned +62 831-xxxx-xxxx

*Supported Time Units:*
- s, second, seconds
- m, minute, minutes
- h, hour, hours
- d, day, days
- w, week, weeks

*Other examples using different time units:*
- .banned @rifza|30 seconds 
    ➡️ Bans for 30 seconds.
- .banned @rifza|1 minute 
    ➡️ Bans for 1 minute.
- .banned @rifza|1 hour 15 seconds 
    ➡️ Bans for 1 hour 15 seconds.
- .banned @rifza|2 days 4 hours 
    ➡️ Bans for 2 days 4 hours.
- .banned @rifza|1 week 
    ➡️ Bans for 1 week.
- .banned @rifza|1w 2d 3h 
    ➡️ Bans for 1 week 2 days 3 hours.
- .banned @rifza|1d 2h 30m 15s 
    ➡️ Bans for 1 day 2 hours 30 minutes 15 seconds.

\`Please read this guide carefully to avoid needing further assistance from the admin. Thank you.\`
`

infos.setRole = `*Panduan untuk mengubah role user (Hanya bisa digunakan oleh owner!)*

*Bagaimana cara menggunakannya?*

_*Sertakan nomor/Reply/tag user target*_

Contoh:
 - *#1* => _Dengan reply pesan target_
- .setrole 🎀Soulmate🦋

 - *#2* => _Dengan tag target_
- .setrole @rifza|🎀Soulmate🦋

 - *#3* => _Dengan nomor target_
- .setrole +62 831-xxxx-xxxx|🎀Soulmate🦋

\`LIST ROLE\`
<role>

\`Pastikan membaca panduan ini dengan teliti agar tidak perlu bertanya lebih lanjut kepada admin terkait cara penggunaannya. Terima kasih.\``

