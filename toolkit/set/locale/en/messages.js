let infos = Data.infos.messages ??= {};

/* ---
   PENTING!
   Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.
--- */

/*!-======[ Default Message]======-!*/

infos.isGroup = "Group only!"
infos.isAdmin = "You’re not an admin!"
infos.isOwner = "You’re not the owner!"
infos.isBotAdmin = "I’m not an admin :("
infos.isQuoted = "Reply to the message!"
infos.isMedia = `!Reply or send <type> with caption: <caption>`
infos.isExceedsAudio = `Audio must not exceed <second> seconds`
infos.isExceedsVideo = `Video must not exceed <second> seconds`
infos.isNoAnimatedSticker = "Sticker must be of Image type!"
infos.isAnimatedSticker = "Sticker must be of Video type!"
infos.isAvatarSticker = "Sticker must be of Avatar type!"
infos.isArgs = "Please include text!"
infos.isBadword = `The word *<badword>* is not allowed!`
infos.isMention = `Include number/Reply/tag target`
infos.isUrl = "Please include a URL!"
infos.isFormatsUrl = "The provided URL must be in the format:\n- <formats>"

infos.wait = '```Wait...```'
infos.sending = "Sending..."
infos.failed = '```Failed❗️```'

infos.onlyNumber = "<value> must be a number!"


infos.hasClaimTrial = "You've claimed the trial!"
infos.hasPremiumTrial = "Can't claim trial, you are already premium!"
infos.isNotAvailableOnTrial = "*Free trial is not allowed to use this feature!*\n_This feature can only be used when you buy premium from the owner!_"

infos.isEnergy = ({ uEnergy, energy, charging }) => `
Lazy😞\n⚡️Energy: ${uEnergy}\nNeeds: ${energy}⚡\n\n${charging ? " Status: 🟢Charging" : "To charge energy: *Type .charge or .cas*" }
`.trim()

infos.onlyPremium = (trial) => `
Sorry, this feature is only available for premium users.\nType *.premium* for more information or click the preview image URL above to contact the owner.

*Haven't claimed Free Trial🤷🏻‍♀️?*
${Data.infos.others.readMore}
${!trial ? `*🎁Yay, you can still claim the trial!!*\nType *.freetrial* to claim a 1-day trial${available ? '': '_This feature cannot be used from the free trial_\n_You still need to purchase premium through the owner to get access to this feature!_'}` : "You have already claimed this bonus🙅🏻‍♀️"}`

/*!-======[ Premium ]======-!*/
infos.premium = (trial) => `
*Get access to use premium features!*

*\`Premium Benefits\`*
- Access to locked features✅️
- ⚡️Energy: +${cfg.first.trialPrem.energy}✅️
- Charge rate: +${cfg.first.trialPrem.chargeRate}✅️
- Max Charge: +${cfg.first.trialPrem.maxCharge}✅️
- Unlimited ChatbotAi✅️
 (Only valid while being a premium user)

*🔖Price list*:
#︎ 1Day
- Rp.2,000
#︎ 3Day
- Rp.5,000
#︎ 7Day
- Rp.10,000
#︎ 15Day
- Rp.20,000
#︎ 30Day
- Rp.35,000

*Haven’t claimed the Free Trial yet🤷🏻‍♀️?*
${Data.infos.others.readMore}
${!trial ? `*🎁Yay, you can still claim the trial!!*\nType *.freetrial* to claim a 1-day trial${available ? '': '_This feature cannot be used from the free trial_\n_You still need to purchase premium through the owner to get access to this feature!_'}` : "You have already claimed this bonus🙅🏻‍♀️"}`
