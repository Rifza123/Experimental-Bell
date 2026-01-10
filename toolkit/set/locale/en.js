Data.infos ??= {};
/*
  ====== IMPORTANT! ======
  Do not change text inside angle brackets <> because it's a key format.


  ====== About.js ======
*/

Data.infos.about = {
  help: `Include the question you want to ask about this bot to get help`,

  helpList: `\`HELP/GUIDE LIST\`\n\n<keys>`,

  helpNotfound: `*Oops, we couldn’t find the help you are looking for!*

Maybe you are looking for:
<top>`,

  energy: `
📌 *[Guide to Add/Reduce Energy]*

You can add or reduce another user's energy with the following methods. Make sure to include the number, reply, or tag of the user whose energy will be added/reduced.

*🛠 Format:*
- *🔹 Command*: \`.addenergy\` or \`.reduceenergy\`
- *🔹 Amount of Energy*: The number showing how much energy you want to add/reduce

*💡 How to Use:*

🔸 *Method #1 - By Replying Target Message*  
   ➡️ Reply to the user's message then send:
   - \`.addenergy [amount]\`
   - \`.reduceenergy [amount]\`
   
   _Example_: \`.addenergy 10\`

🔸 *Method #2 - By Tagging Target*  
   ➡️ Use \`@username\` followed by \`|\` and the energy amount.
   - \`.addenergy @username|[amount]\`
   - \`.reduceenergy @username|[amount]\`
   
   _Example_: \`.addenergy @rifza|10\`

🔸 *Method #3 - By Target Number*  
   ➡️ Include full phone number followed by \`|\` and the energy amount.
   - \`.addenergy +62xxxxxxx|[amount]\`
   - \`.reduceenergy +62xxxxxxx|[amount]\`
   
   _Example_: \`.addenergy +62831xxxxxxx|10\`

⚠️ *[Note]*
- 🔄 Replace \`[amount]\` with a number as needed.
- ✅ Make sure the target (username or number) is valid to avoid errors.
`,

  tfenergy: `
📌 *[ Guide to Transfer Energy ]*

*💡 How to Use:*

🔸 *Method #1 - By Replying Target Message*  
   ➡️ Reply to the user who will receive energy, then send:
   - \`.transfer [amount]\`
   _Example_: \`.transfer 10\`

🔸 *Method #2 - By Tagging Target*  
   ➡️ Use \`@username\` followed by the energy amount.
   - \`.transfer @username|[amount]\`
   _Example_: \`.transfer @rifza|25\`

🔸 *Method #3 - By Target Number*  
   ➡️ Include the full number followed by the energy amount.
   - \`.transfer +62xxxxxxx|[amount]\`
   _Example_: \`.transfer +62831xxxxxxx|50\`

⚠️ *[Note]*
- Energy will be deducted from your balance then added to the target.
- Make sure your energy balance is sufficient.
`,

  stablediffusion: `*[ HOW TO USE STABLEDIFFUSION (TXT2IMG) ]*

Command: \`.txt2img <checkpoint>[<lora>]|<prompt>\`

📌 *Parameter Explanation:*
- \`<checkpoint>\`: Main model ID.
- \`<lora>\`: (Optional) Additional ID (LoRA).
- \`<prompt>\`: Image description.

📝 *Command Format*:
- Without Lora → \`.txt2img 1234[]|sunset, beach\`
- With 1 Lora → \`.txt2img 1234[5678]|cyberpunk city\`
- With multiple Lora → \`.txt2img 1234[5678,91011]|fantasy castle\`

🔍 *Finding ID*:
- Search Lora: \`.lorasearch cyberpunk\`
- Search Checkpoint: \`.checkpointsearch anime\`

⚠️ Make sure IDs are valid for proper results.
`,

  antilink: `📌 *Guide for Bot Antilink Feature*

🔒 Enable: \`.antilink on\`
🔓 Disable: \`.antilink off\`
➕ Add URL: \`.antilink add <link>\`
➖ Remove URL: \`.antilink del <link>\`
📄 View list: \`.antilink list\`
`,

  antitoxic: `📌 *Guide for Bot Antitoxic Feature*

🔒 Enable: \`.antitoxic on\`
🔓 Disable: \`.antitoxic off\`
➕ Add word: \`.antitoxic add <word>\`
➖ Remove word: \`.antitoxic del <word>\`
📄 View list: \`.antitoxic list\`
`,
};

/*
  ====== Ai.js ======
*/
Data.infos.ai = {
  // ------- Messages -------
  isPrompt: '*Please provide the image description!*',
  notfound: 'Not found!',
  isQuery: 'What do you want to ask?',
  prompt: 'Please enter a prompt!',

  interactiveOn: 'Success! ai_interactive has been enabled in this chat!',
  interactiveOff: 'Success! ai_interactive has been disabled in this chat!',
  interactiveOnGroup: 'Success! ai_interactive has been enabled in all groups!',
  interactiveOffGroup:
    'Success! ai_interactive has been disabled in all group chats!',
  interactiveOnPrivate:
    'Success! ai_interactive has been enabled in all private chats!',
  interactiveOffPrivate:
    'Success! ai_interactive has been disabled in all private chats!',
  interactiveOnAll: 'Success! ai_interactive has been enabled in all chats!',
  interactiveOffAll: 'Success! ai_interactive has been disabled in all chats!',
  interactiveOnEnergy: 'Success! now energy can be obtained from interaction!',
  interactiveOffEnergy:
    'Success! now energy cannot be obtained from interaction!',
  interactiveOffPartResponse: 'Successfully disabled AI partResponse!',
  interactiveOnPartResponse:
    'Successfully enabled AI part-response! Now AI can reply gradually, creating a more realistic impression.',
  failTryImage: 'Sorry, an error occurred. Try using another image!',
  payInstruction: '*Please pay attention to the following instructions!*',

  // ------- Faceswap -------
  noSessionFaceswap: 'No faceswap session found',
  successResetSessionFaceswap: 'Successfully reset faceswap session!',
  cannotChangeFace: 'Cannot swap, only 1 image available in swap session!',
  successChangeFace:
    'Successfully swapped target image with the last image you sent as face!',

  // ------- Lora -------
  lora_models: [
    'Donghua#01',
    'YunXi - PerfectWorld',
    'Sea God (Tang San) - Douluo Dalu',
    'XiaoYiXian - Battle Through The Heavens',
    'Angel God (Xian Renxue) - Douluo Dalu',
    "Sheng Cai'er - Throne Of Seal",
    'HuTao - Genshin Impact',
    'TangWutong - The Unrivaled Tang Sect',
    'CaiLin (Medusa) - Battle Through The Heavens',
    'Elaina - Majo no Tabi Tabi',
    'Jiang Nanan - The Unrivaled Tang Sect',
    'Cailin (Queen Medusa) - BTTH [4KUltraHD]',
    'MaXiaoTao - The Unrivaled Tang Sect',
    'Yor Forger - Spy x Family',
    'Boboiboy Galaxy',
    'Hisoka Morow',
    'Ling Luochen ▪︎ The Unrivaled Tang Sect',
    'Tang Wutong ▪︎ The Unrivaled Tang Sect',
    'Huo Yuhao ▪︎ The Unrivaled Tang Sect',
  ],

  lora: function () {
    let text = `
*Please pay attention to the following instructions!*
 \`\`\`[ StableDiffusion - Lora++ ]\`\`\`

Usage: <prefix><command> <ID>|<prompt>
Example: #lora 3|beautiful cat with aesthetic jellyfish, sea god themes

 => _ID is the number of the model available in the list_

_*please check the available model list:*_

*[ID] [NAME]*`;
    for (let i = 0; i < this.lora_models.length; i++) {
      text += `\n[${i + 1}] [${this.lora_models[i]}]`;
    }
    return text;
  },

  // ------- Filters -------
  filters: `*Please enter the type!*
            
List of Types:

▪︎ 3D:
- disney
- 3dcartoon
▪︎ Anime:
- anime2d
- maid
▪︎ Painting:
- colorful
▪︎ Digital:
- steam

_Example: .filters steam_`,

  // ------- Txt2Img -------
  txt2img: `
*[ HOW TO USE ]*
Param: \`.txt2img <checkpoint>[<lora>]|<prompt>\`

 ▪︎ \`Without lora\`
-  .txt2img <checkpoint>[]|<prompt>

 ▪︎ \`1 lora\`
-  .txt2img <checkpoint>[<lora>]|<prompt>

 ▪︎ \`More than 1 lora\`
- .txt2img <checkpoint>[<lora>,<lora>,...more lora]|<prompt>

 ▪︎ \`Custom aspect ratio\`
-  .txt2img <checkpoint>[<lora>]<aspect:ratio>|<prompt>
> Ex: txt2img 1233[9380]3:4|1girl, beautiful, futuristic, armored mecha*

--------------------------------------------------
 ▪︎ \`Example\`: 
- *.txt2img 1233[9380]|1girl, beautiful, futuristic, armored mecha*
--------------------------------------------------
 \`Searching id\`: 
 - lora: .lorasearch <query>
 - checkpoint: .checkpointsearch <query>
`,

  // ------- Faceswap Function -------
  faceSwap: (cht) => `
  \`How to use Face Swap\`

[ OPTION A ] 
> (Normal way)

- Send *target* image
- Reply to *target* image by sending a *face* image with caption *${cht.prefix + cht.cmd}*
- Or, reply to *target* image by typing command *${cht.prefix + cht.cmd}* <url of 2nd image>*.

_The target image will be replaced with the face from the second image_

[ OPTION B ] 
> (Using session)

- Send image with caption *${cht.prefix + cht.cmd}* → this will automatically create a session and save it as the *target* image
- Next, you can reply to the bot message with another image to replace the face on the target image with the new one you send (with caption *${cht.prefix + cht.cmd}* or no caption)

\`We also added some commands to help manage the swapping process\`
- *To reset and delete faceswap session*
    - .faceswap-reset
     ~ Reset session will restart face swap

- *To change target image*
    - .faceswap-change
     ~ _The last image you sent will become the target image_

_Session will be automatically deleted if no swap interaction within 10 minutes_
`,

  startedFaceswap: `Session successfully created. Please reply to the chatbot with a face image.
The first image is the target that will be replaced with the face from the next image.

- *To reset and delete faceswap session*
    - .faceswap-reset
     ~ Reset session will restart face swap

- *To change target image*
    - .faceswap-change
     ~ _The last image you sent will become the target image_

_Session will be automatically deleted after 10 minutes_
`,

  // ------- Auto Bell -------
  bell: `
!-======[ Auto Ai Response ]======-!

_List of settings:_
 !-===(👥)> *All Users*
- on
- off
    \`If in group, only admin/owner can use\`

 !-===(👤)> *Owner*
- on-group
    \`Enable in all groups\`

- off-group
    \`Disable in all groups\`

- on-private
    \`Enable in all private chats\`

- off-private
    \`Disable in all private chats\`

- on-all
    \`Enable in all chats\`

- off-all
    \`Disable in all chats\`

- on-energy
    \`Interaction can increase/decrease energy depending on AI mood\`
    
- off-energy
    \`AI cannot increase/decrease energy\`

- on-partResponse
    \`AI can reply gradually, creating a more realistic impression.\`
> Not recommended for bots with many users, groups, or heavy interaction.

- off-partResponse 
    \`Default AI response\`

*Example:*
> .bell on
`,
};

/*
  ====== Group.js ======
*/
Data.infos.group = {
  settings: `Available options:\n\n- <options>`,

  kick_add: `*Include number/Reply/tag of the target to <cmd> from group!*\n\nExample: \n\n*Method #1* => _By replying to target message_\n - <prefix><cmd>\n \n*Method #2* => _By tagging target_\n - <prefix><cmd> @rifza \n \n*Method #3* => _By target number_\n - <prefix><cmd> +62 831-xxxx-xxxx`,

  on: (cmd, input) =>
    `Successfully ${cmd === 'on' ? 'enabled' : 'disabled'} *${input}* in this group!`,

  nallowPlayGame: `Playing games is not allowed here!\n_To allow it type *.on playgame* (only admin/owner can do this)_`,
};

/*
  ====== Messages.js ======
*/
Data.infos.messages = {
  // Default Message
  isGroup: 'Group only!',
  isAdmin: 'You are not an admin!',
  isOwner: 'You are not the owner!',
  isBotAdmin: 'I am not admin :(',
  isQuoted: 'Reply to the message!',
  isMedia: `!Reply or send <type> with caption: <caption>`,
  isExceedsAudio: `Audio must not be more than <second> seconds`,
  isExceedsVideo: `Video must not be more than <second> seconds`,
  isNoAnimatedSticker: 'Sticker must be type Image!',
  isAnimatedSticker: 'Sticker must be type Video!',
  isAvatarSticker: 'Sticker must be type Avatar!',
  isArgs: 'Please include text!',
  isBadword: `Word *<badword>* is not allowed!`,
  isMention: `Include number/Reply/tag target`,
  isUrl: 'Please include url!',
  isFormatsUrl: 'Url must be like:\n- <formats>',

  hasClaimTrial: 'You already claimed trial!',
  hasPremiumTrial: 'Cannot claim trial, you are already premium!',
  isNotAvailableOnTrial:
    '*Free trial is not allowed to use this feature!*\n_This feature can only be used when you purchase premium from owner!_',

  wait: '```Wait...```',
  sending: 'Sending...',
  failed: '```Failed❗️```',

  onlyNumber: '<value> must be a number!',

  isEnergy: ({ uEnergy, energy, charging }) =>
    `
Lazy😞\n⚡️Energy: ${uEnergy}\nRequired: ${energy}⚡\n\n${
      charging
        ? ' Status: 🟢Charging'
        : 'To recharge energy: *Type .charge or .cas*'
    }`.trim(),

  onlyPremium: (trial, available = true) => `
Sorry, this feature is only for premium users\nType *.premium* for more info or click preview image above to contact owner

*Haven’t claimed Free Trial🤷🏻‍♀️?*
${Data.infos.others.readMore}
${
  !trial
    ? `*🎁Yay you can still claim trial!!*\nType *.freetrial* to claim 1 day trial${
        available
          ? ''
          : '_This feature cannot be used from free trial_\n_You still need to buy premium from owner for full access!_'
      }`
    : 'You already claimed this bonus🙅🏻‍♀️'
}`,

  // Premium Info
  premium: (trial, available = true) => `
*Get access to use premium features!*

*\`Premium Benefits\`*
- Access locked features ✅️
- ⚡️Energy: +${cfg.first.trialPrem.energy}✅️
- Charge rate: +${cfg.first.trialPrem.chargeRate}✅️
- Max Charge: +${cfg.first.trialPrem.maxCharge}✅️
- Unlimited ChatbotAi ✅️
 (Only valid while premium)

*🔖Price list*:
#︎ 1Day
- Rp.2.000
#︎ 3Day
- Rp.5.000
#︎ 7Day
- Rp.10.000
#︎ 15Day
- Rp.20.000
#︎ 30Day
- Rp.35.000

*Haven’t claimed Free Trial🤷🏻‍♀️?*
${Data.infos.others.readMore}
${
  !trial
    ? `*🎁Yay you can still claim trial!!*\nType *.freetrial* to claim 1 day trial${
        available
          ? ''
          : '_This feature cannot be used from free trial_\n_You still need to buy premium from owner for full access!_'
      }`
    : 'You already claimed this bonus🙅🏻‍♀️'
}`,
};

/*
  ====== Others.js ======
*/
Data.infos.others = {
  noDetectViewOnce:
    'Oops, it looks like I cannot detect the view-once message sent by that person!',

  // Read More
  readMore: '͏'.repeat(3646),
};

/*
  ====== Owner.js ======
*/
Data.infos.owner = {
  // ------- Messages -------
  succesSetLang: `*Successfully changed default language to:* \`<lang>\``,
  lockedPrem: 'Get premium access to unlock locked features',
  unBannedSuccess: `*Success, user @<sender> has been removed from banned list`,
  delBanned: `You have been removed from banned list!\n_You are now allowed to use the bot again_!`,

  bannedSuccess: `*Successfully banned user!*\n ▪︎ User:\n- @<sender>\n ▪︎ Added time: \n- <days>d <hours>h <minutes>m <seconds>s <milliseconds>ms\n\n`,
  addBanned: `\`You have been blocked from the bot❗️\`\nDuration: <days>d <hours>h <minutes>m <seconds>s <milliseconds>ms`,

  successSetVoice: `Success✅️\n\n- Voice: _<voice>_`,
  successSetLogic: `Success changed ai chat logic✅️\n\n\`New Logic:\`\n<logic>`,

  userNotfound: 'Wrong number or user not registered!',
  wrongFormat: '*❗Wrong format, please check again*',

  successDelBadword: `Successfully deleted <input> from badword list!`,
  successSetThumb: 'Successfully changed menu thumbnail!',
  successAddBadword: `Successfully added <input> to badword list!`,
  isModeOn: `Sorry, <mode> already on!`,
  isModeOff: `Sorry, <mode> already off!`,

  isModeOnSuccess: `Success enabled <mode>`,
  isModeOffSuccess: `Success disabled <mode>`,

  badword: `Do you want add, delete or view list?\nExample: <cmd> add|tobrut`,
  badwordAddNotfound: `Action may not exist in the list!\n*List Action*: add, delete, list\n\n_Example: <cmd> add|tobrut_`,

  listSetmenu: `\`List of available menu types:\`\n\n- <list>`,
  successSetMenu: `Successfully changed menu to <menu>`,
  audiolist: `Success added audio to list <list>✅️\n\nAudio: <url>\n> To see the list type *.getdata audio <list>*`,
  menuLiveLocationInfo:
    '_Menu liveLocation cannot be viewed in private chat. Please reconsider using this menu_',
  checkJson: `Please check your JSON Object again!\n\nTypeError:\n<rm>\n> <e>`,

  // ------- Set Info -------
  set: `
[ BOT SETTINGS ]

- public <on/off>
- autotyping <on/off>
- autoreadsw <on/off>
- autoreadpc <on/off>
- autoreadgc <on/off>
- similarCmd <on/off>
- premium_mode <on/off>
- editmsg <on/off>
- fquoted <name> <object or reply quoted>
- logic <logic>
- lang <country code>
- voice <model name>
- menu <type>
- call <off or action>
- autoreactsw <off or emojis>
- checkpoint <checkpoint_id>
- lora <lora_id>
- apikey <apikey>
- antitagowner <(on/off) or reply msg>
- keyChecker <on/off>
- chid <reply message (forward from channel)>
- replyAi <on/off>
- register <on/off>
- autoBackup <on/off>
- font <style>
- didYouMean <on/off>
- energy_mode <on/off>
- button <on/off>
- inflasi <on/off>
- remoteReaction <on/off>
- linkpreview <on/off>

_Example: .set public on_`,

  premium_add: `
*Guide to add/reduce premium time (Owner only!)*

*Options:*
- addprem (add time)
- kurangprem (reduce time)
- delprem (remove premium)

*How to use?*

_*Include number/Reply/tag target user*_

Example: 
 - *#1* => _By reply to target message_
- .addprem 1d
- .kurangprem 1d
- .delprem

 - *#2* => _By tag target_
- .kurangprem @rifza|1d
- .addprem @rifza|1d
- .delprem @rifza|1d
 
 - *#3* => _By number target_
- .addprem +62 831-xxxx-xxxx|1d
- .kurangprem +62 831-xxxx-xxxx|1d
- .delprem +62 831-xxxx-xxxx|1d

*Supported Units:*
- s, second, seconds
- m, minute, minutes
- h, hour, hours
- d, day, days
- w, week, weeks

*Other usage examples with different units:*
- .addprem @rifza|30 seconds 
    ➡️ Add 30s.
- .addprem @rifza|1 minute 
    ➡️ Add 1m.
- .addprem @rifza|1 hour 15 seconds 
    ➡️ Add 1h 15s.
- .addprem @rifza|2 days 4 hours 
    ➡️ Add 2d 4h.
- .addprem @rifza|1 week 
    ➡️ Add 1w.
- .addprem @rifza|1w 2d 3h 
    ➡️ Add 1w 2d 3h.
- .addprem @rifza|1d 2h 30m 15s 
    ➡️ Add 1d 2h 30m 15s.

\`Please read this guide carefully so you don’t need to ask admin again, thank you\`
`,

  setCall: `
\`How to Use:\`
 ▪︎ .set call <off or action>
- Example: .set call reject

_You can also add other actions by using *+*_

Example: .set call reject+block

\`LIST ACTION\`
- reject (reject call)
- block (block caller)
`,
  successSetCall: 'Successfully set anti call!\nAction: <action>',
  successOffCall: 'Successfully disabled anti call!',

  setAutoreactSw: `
\`How to Use:\`

 ▪︎ .set autoreactsw <off or emojis>
- Example: .set autoreactsw 😀😂🤣😭😘🥰😍🤩🥳🤢🤮

_You can add unlimited emojis_
`,
  successSetAutoreactSw: 'Successfully set Autoreact SW!\nEmoji: <action>',
  successOffAutoreactSw: 'Successfully disabled Autoreact SW!',

  setHadiah: `
\`How to Use:\`
 ▪︎ .set hadiah <Game> <Energy>
- Example: .set hadiah tebakgambar 60

\`LIST GAME\`
<game>
`,

  setFquoted: `
\`Usage examples:\`

- *Method 1*
   ~ _Reply message with command *.set fquoted <name>_
     \`Example\`:
     - .set fquoted welcome

- *Method 2*
   ~ _Send command *.set fquoted <name> <object quoted>*_
     \`Example\`:
     - .set fquoted welcome {
    "key": {
      "fromMe": false,
      "participant": "0@whatsapp.net"
    },
    "message": {
      "conversation": "Hello"
    }
  }
`,

  setAudio: `
\`Usage examples:\`

- *Method 1*
   ~ _Reply message with command *.set audio <name>*_
     \`Example\`:
     - .setdata audio welcome

- *Method 2*
   ~ _Send command *.set audio <name> <url>*_
     \`Example\`:
     - .setdata audio welcome https://catbox.moe/xxxxxxx.mp3
`,

  delAudio: `
  ~ _Send command *.deldata audio <name> <url>*_
   \`Example\`:
   - .deldata audio welcome https://catbox.moe/xxxxxxx.mp3
`,

  setLogic: `*To change logic:*

_Send command *<cmd> logic* with format:_

<cmd> logic 
Nickainame: <your ai name>
Fullainame: <your nick ai name>
Profile: <Your Logic Here>

\`Current Logic:\`
Fullainame: <botfullname>
Nickainame: <botnickname>
Profile: <logic>`,

  banned: `*Guide to ban user with specific duration (Owner only!)*

*Options:*
- banned (ban user with duration)
- unbanned (remove ban, no duration needed)

*How to use?*

_*Include number/Reply/tag target user*_

Example:
 - *#1* => _By reply to target message_
- .banned 1d
- .unbanned

 - *#2* => _By tag target_
- .banned @rifza|1d
- .unbanned @rifza

 - *#3* => _By number target_
- .banned +62 831-xxxx-xxxx|1d
- .unbanned +62 831-xxxx-xxxx

*Supported Units:*
- s, second, seconds
- m, minute, minutes
- h, hour, hours
- d, day, days
- w, week, weeks

*Other usage examples with different units:*
- .banned @rifza|30s 
- .banned @rifza|1m 
- .banned @rifza|1h 15s 
- .banned @rifza|2d 4h 
- .banned @rifza|1w 
- .banned @rifza|1w 2d 3h 
- .banned @rifza|1d 2h 30m 15s 

\`Please read carefully so you don’t need to ask again. Thanks.\``,

  setRole: `*Guide to change user role (Owner only!)*

*How to use?*

_*Include number/Reply/tag target user*_

Example:
 - *#1* => _By reply to target message_
- .setrole 🎀Soulmate🦋

 - *#2* => _By tag target_
- .setrole @rifza|🎀Soulmate🦋

 - *#3* => _By number target_
- .setrole +62 831-xxxx-xxxx|🎀Soulmate🦋

\`LIST ROLE\`
<role>

\`Please read carefully so you don’t need to ask admin again. Thanks.\``,

  setAntiTagOwner: `**✦ ANTI-TAG OWNER GUIDE ✦**

• *Enable feature:*
Type \`.set antitagowner on\`

• *Disable feature:* 
Type \`.set antitagowner off\`

• *Set response when owner is tagged:*
Reply to the message you want as response, then type:  
\`.set antitagowner\`
`,

  setReplyAi: `How to Use:
 ▪︎ .set replyAi <true/on | false/off>
   Example: .set replyAi true

_When enabled, all bot replies will be modified based on logic,
making replies feel more natural._`,

  isReplyAiOn: `*Successfully enabled \`replyAi\`! Now all replies will be modified with logic!
⚠️ *WARNING!* ⚠️\n\n*replyAi* feature may consume a lot of GPT API quota.\nUse wisely, especially if using limited key!`,

  isReplyAiOff: `Successfully disabled *replyAi!*`,
  listusermode: '📋 Here’s the list of users with <mode> status',
  listusernull: '❌ No users with <mode> status yet',
  listuserhelp:
    '*❗ Here is a list of users available*\n\n' +
    '⟡ listuser premium\n' +
    '⟡ listuser banned\n' +
    '⟡ listuser afk\n\n' +
    'Example:\n' +
    '.listuser afk',
};

/*
  ====== Reaction.js ======
*/
Data.infos.reaction = {
  play: 'To play YouTube using react, please react to a message that contains text',

  download:
    'Currently we cannot download url <url>\nSupported list:\n- <listurl>',

  translate:
    'Please react with <emoji> to a text message to translate into Indonesian',

  delete:
    'Deleting messages using react is only for admin if the target is not my own message',

  menu: ` *[ LIST REACTION CMD ]*

- *Make sticker*
    |🖨️||🖼️||🤳|
> _Convert reacted media into sticker or reverse_

- *Delete Message*
    |❌||🗑|
> _Delete reacted message._

- *Kick user*
    |🦵||🦶|
> _Kick user that was reacted in group._

- *YouTube Play Audio*
    |🎵||🎶||🎧||▶️|
> _ .play YouTube audio with title from message._

- *Media Downloader*
    |⬇️||📥|
> _Download media based on url in message._

- *Screenshot Web*
    |📸||📷|
> _Take screenshot of url in message._

- *Ai*
    |🔍||🔎|
> _Ask ai by reacting to a message._

- *Read message aloud*
    |🔈||🔉||🔊||🎙️||🎤|
> _Ai will read aloud the text reacted message_

- *Translate message*
    |🆔||🌐|
> _Translate reacted message to Indonesian._

- *Media uploader*
    |🔗||📎||🏷️||⬆️||📤|
> _Upload media to cdn and convert into link._

- *Skin color changer*
    |🟥||🟧||🟨||🟩||🟦||🟪||⬛||⬜||🟫|
> _Change skin color of people in image._

*Guide:*
_*React to target message with one of emojis above*_`,
};

/*
  ====== Tools.js ======
*/
Data.infos.tools = {
  enhance: `
*PLEASE CHOOSE AVAILABLE TYPE!*
▪︎ Photo style
- phox2 
- phox4
▪︎ Anime style
- anix2
- anix4
▪︎ Standard
- stdx2
- stdx4
▪︎ Face Enhance
- cf
▪︎ Object text
- text

_Usage: #enhance phox4_
`,
};

/*
  ====== Game.js ======
*/
Data.infos.game = {
  hasActive: (game, func) => `*There is still an active game here!*

- Game: ${game.type}
- Start Time: ${func.dateFormatter(game.startTime, 'Asia/Jakarta')}
- End Time: ${func.dateFormatter(game.endTime, 'Asia/Jakarta')}
- Creator: @${game.creator.id.split('@')[0]}
- Creator Name: ${game.creator.name}

To start new game:
_Wait until game ends or type .cleargame or .nyerah_
`,

  starting: `Starting the game...`,

  tebakGambar: (
    desc,
    formatDur,
    metadata,
    func,
    cfg,
    cht
  ) => `*GUESS THE PICTURE*

What is the answer for this question?

Hint: ${desc}

Answer time: ${formatDur.minutes} minutes ${formatDur.seconds} seconds
End Time: ${func.dateFormatter(metadata.game.endTime, 'Asia/Jakarta')}

Reward: ${cfg.hadiah[cht.cmd]} Energy⚡

_*You can use .hint to get answer hint*_

*Reply to game message to answer*
> (Starts from this message)
`,

  timeUp: (answer) => `*TIME'S UP*

Answer: ${answer}`,
};

/*
  ====== Client.js ======
*/
Data.infos.client = {
  onlyJoinGc: `
You must join one of the groups below before you can use the bot!

\`INVITELINK LIST\`
<list>

_After joining, please wait 2 minutes before using bot!_
_Group member data is only updated every 2 minutes to reduce rate-limit._
`,

  lidJoin: `
Your real number cannot be detected because using @lid.
Please join one of the groups below so the system can recognize your number.
(Without joining, your data will only be saved as @lid and incomplete)

\`GROUP INVITE LIST\`
<list>

_After joining, please wait ±2 minutes before using bot._
_Group member data is updated every 2 minutes to reduce server load and rate-limit._
`,

  registerNeeded: `
You are not registered in our database!
Please register by typing *.register*
`,
};

/*
  ====== EventGame.js ======
*/
Data.infos.eventGame = {
  ended: `That game has already ended!`,

  correct: (desc) =>
    `Congratulations, your answer is correct💯🥳🥳${desc ? `\n_${desc}_` : ''}`,

  bonus: `Awesome😳, You answered in less than 10 seconds!\n\`Bonus x2✅\`\n\n`,

  wrong: (formatDur) =>
    `Wrong answer!!

Remaining time: ${formatDur.minutes} minutes ${formatDur.seconds} seconds`,

  alreadyAnswered: (ans, user) => `Already answered by @${user.split('@')[0]}`,

  survey: `Survey says!...`,

  invalidAnswer: `Invalid answer!`,

  remainingTime: (formatDur) =>
    `\n\nRemaining time: ${formatDur.minutes} minutes ${formatDur.seconds} seconds`,

  gameOver: `Game over!\n_Distributing all rewards obtained....🎁_`,

  error: (err) =>
    `An error occurred while processing game. Please try again later.\nError: ${err}`,
};

/*
  ====== Events.js ======
*/
Data.infos.events = {
  cooldown: (formatDur) =>
    `Wait ${formatDur.seconds} more seconds before using this feature!`,
  cmdBlocked: (cmd) =>
    `Command \`${cmd}\` is blocked in this group!\nTo unblock, type .unbancmd ${cmd} (only admin can do this)`,
  onlyGame: (metadata, ev) =>
    `You are ${metadata.game?.type ? '' : 'not '}playing game \`${metadata?.game?.type || '!'}\`, This command can only be used while playing these games:\n- ${ev?.onlyGame?.join('\n- ')}`,
  onlyPremiumBody: `Only available for premium users!`,
};

/*
  ====== Interactive.js ======
*/
Data.infos.interactive = {
  sessionEnded: (s1) =>
    `Conversation session \`${s1.code?.toUpperCase()}\` has ended!`,
  bannedTagAfk: (maxTag) =>
    `You have been banned from the bot for 1 day because you tagged ${maxTag}x`,
  bannedTagAfkPm: (tme, maxTag) =>
    `You have been banned for ${tme} because you kept tagging up to ${maxTag} times❗️`,
  afkTagged: (tagAfk, func, sender, maxTag) =>
    `\`DO NOT TAG HIM❗\`\nHe is *AFK* for the reason: *${tagAfk.reason}*\nSince ${func.dateFormatter(tagAfk.time, 'Asia/Jakarta')}\n\n*[ ⚠️ INFO ]*\n_Do not reply or tag someone who is AFK!_\n_*You have tagged him ${tagAfk.taggedBy[sender]}x!*_\n_If you continue up to ${maxTag}x, you will be banned for 1 day!_`,

  afkBack: (sender, is, dur) =>
    `@${sender.split('@')[0]} *has returned from AFK!*\nReason: ${is.afk.reason}\nDuration: ${dur.days > 0 ? dur.days + 'd ' : ''}${dur.hours > 0 ? dur.hours + 'h ' : ''}${dur.minutes > 0 ? dur.minutes + 'm ' : ''}${dur.seconds > 0 ? dur.seconds + 's ' : ''}${dur.milliseconds > 0 ? dur.milliseconds + 'ms ' : ''}`,
  warn: `Bot detected! please enable mute in this group or change mode to self!`,
  kick: `You will be removed because you didn’t disable bot until last warning!`,
  antiDelete: (cht, func, deleted) =>
    `\`ANTI DELETE❗\`\n\n- User / Name: ${cht.sender.split('@')[0]} / ${func.getName(cht.sender)}\n- Message Type: ${deleted.type}\n- Message has been deleted but recovered by anti-delete system.`,
  antiDeleteNote: `To disable this feature, type *.off antidelete* (Only admin/owner can do this)`,
  mentionWarn: `You were detected mentioning status in this group! Please follow group rules not to mention in this group!`,
  mentionKick: `You were kicked from group for tagging/mentioning group status until last warning!`,
  antilinkWarn: `You were detected sending a link! Please follow rules here not to send links!`,
  antilinkKick: `You were kicked for breaking group rule by sending links until last warning!`,
  antitoxicWarn: `You were detected using rude or inappropriate language! Please follow group rules and avoid offensive words.`,
  antitoxicKick: `You were kicked from group for using rude or inappropriate language until last warning!`,
  tagallWarn: `You were detected using tagall/hidetag. Please follow rules not to use tagall/hidetag because it disturbs members!`,
  tagallKick: `You were kicked from group for breaking rules by using tagall/hidetag until last warning!`,
  antiMediaWarn: `You are detected sending <mediaType>. Please follow the rules here and do not send <mediaType> in this group!`,
  antiMediaKick: `You have been removed for violating the group rules by sending <mediaType> after the final warning!`,

  limitExpired: (formatTimeDur, resetOn) =>
    `*Interaction limit expired!*\n\n*Waiting time:*\n- ${formatTimeDur.days}d ${formatTimeDur.hours}h ${formatTimeDur.minutes}m ${formatTimeDur.seconds}s ${formatTimeDur.milliseconds}ms\n🗓*Reset On:* ${resetOn}\n\n*Want unlimited interaction?*\nGet premium!, type *.premium* for more info`,
  notOwner: `Sorry, not gonna respond`,
  modePublic: `Successfully changed mode to public!`,
  modeSelf: `Successfully changed mode to self!`,
};
