let infos = Data.infos.ai ??= {};


  /*/------- 
   MESSAGES
/*/

infos.isPrompt = "*Please describe the image!*"
infos.notfound = "Not found!"
infos.isQuery = "Please input with query!"
infos.prompt = "Please input prompt!"

infos.interactiveOn = "Success! ai_interactive has been enabled in this chat!";
infos.interactiveOff = "Success! ai_interactive has been disabled in this chat!";
infos.interactiveOnGroup = "Success! ai_interactive has been enabled in all groups!";
infos.interactiveOffGroup = "Success! ai_interactive has been disabled in all group chats!";
infos.interactiveOnPrivate = "Success! ai_interactive has been enabled in all private chats!";
infos.interactiveOffPrivate = "Success! ai_interactive has been disabled in all private chats!";
infos.interactiveOnAll = "Success! ai_interactive has been enabled in all chats!";
infos.interactiveOffAll = "Success! ai_interactive has been disabled in all chats!";
infos.interactiveOnEnergy = "Success! energy can now be earned from interactions!";
infos.interactiveOffEnergy = "Success! energy can no longer be earned from interactions!";
infos.failTryImage = "Sorry, there was an error. Please try using another image!"
infos.payInstruction = "*Please pay attention to the following instructions!*"

infos.noSessionFaceswap = "No faceswap session found";
infos.successResetSessionFaceswap = "Successfully reset the faceswap session!";
infos.cannotChangeFace = "Cannot swap, there is only 1 image in the swap session!";
infos.successChangeFace = "Successfully swapped the target image with the last image you sent as the face!";

/*!-======[ Lora Info ]======-!*/
infos.lora_models = [
  'Donghua#01',
  'YunXi - PerfectWorld',
  'Sea God(Tang San) - Douluo Dalu',
  'XiaoYiXian - Battle Throught The Heavens',
  'Angel God(Xian Renxue) - Douluo Dalu',
  "Sheng Cai'er - Throne Of Seal",
  'HuTao - Genshin Impact',
  'TangWutong - The Unrivaled Tang Sect',
  'CaiLin(Medusa) -BattleThroughtTheHeavens',
  'Elaina-MajoNoTabiTabi',
  'Jiang Nanan - TheUnrivaledTangSect',
  'Cailin(Queen Medusa) - BTTH [4KUltraHD]',
  'MaXiaoTao-TheUnrivaledTangSect',
  'YorForger-Spy x Family',
  'Boboiboy Galaxy',
  'Hisoka morow',
  'Ling Luochen ▪︎ The Unrivaled Tang Sect',
  'Tang Wutong ▪︎ The Unrivaled Tang Sect',
  'Huo Yuhao ▪︎ The Unrivaled Tang Sect'
]

infos.lora = `
*Please follow the instructions below!*
 \`\`\`[ StableDiffusion - Lora++ ]\`\`\`

Usage: <prefix><command> <ID>|<prompt>
Example: #lora 3|beautiful cat with aesthetic jellyfish, sea god themes

 => _ID is the number of the model available in the list_

_*please check the available model list:*_

*[ID] [NAME]*
`
for(let _=0;_<infos.lora_models.length;_++){
  infos.lora += `\n[${_+1}] [${infos.lora_models[_]}]`
}

/*!-======[ Filters Info ]======-!*/
infos.filters = `*Please enter the type!*
            
List of Types:

▪︎ 3D:
- disney
- 3dcartoon
▪︎ Anime:
- anime2d
- maid
▪︎ Painting:
- colorfull
▪︎ Digital:
- steam

_Example: .filters steam_`

/*!-======[ Text To Image Info ]======-!*/
infos.txt2img = `
*[ HOW TO USE ]*
Param: \`.txt2img <checkpoint>[<lora>]|<prompt>\`

 ▪︎ \`Without lora\`
-  .txt2img <checkpoint>[]|<prompt>

 ▪︎ \`1 lora\`
-  .txt2img <checkpoint>[<lora>]|<prompt>

 ▪︎ \`More than 1 lora\`
- .txt2img <checkpoint>[<lora>,<lora>,...more lora]|<prompt>
--------------------------------------------------
 ▪︎ \`Example\`: 
- *.txt2img 1233[9380]|1girl, beautiful, futuristic, armored mecha*
--------------------------------------------------
 \`Searching id\`: 
 - lora: .lorasearch <query>
 - checkpoint: .checkpointsearch <query>

`

infos.faceSwap = (cht) => {
  return `
  \`How to use Face Swap\`

[ OPTION A ] 
> (Regular method)

- Send the *target* image
- Reply to the *target* image by sending the *face* image and include the caption *${cht.prefix + cht.cmd}*
-  Or, reply to the *target* image by typing the command *${cht.prefix + cht.cmd}* <url image2>*.

_The target image will be replaced with the face from the second image._


[ OPTION B ] 
> (Using a session)

- Send an image with the caption *${cht.prefix + cht.cmd}* which will automatically create a session and be saved as the *target* image
- Then you can reply to the bot's message with a new image to swap the face of the target image with the new image you send, with or without the caption (just reply to the chatbot with the image)

 \`We also added some commands that can help you manage the swapping process\`
- *To reset and delete the face swap session*
    - .faceswap-reset
     ~ Resetting the session will restart the face swap

- *To change the target image*
    - .faceswap-change
     ~ _The last image you sent will become the target image_

_The session will automatically be deleted if there is no swap interaction for more than 10 minutes_
`
} 

infos.startedFaceswap = `
**Session created successfully. Please reply to the chatbot with a face image.**  
The first image will be the target image, which will be replaced by the face in the following image.

- *To reset and delete the faceswap session*
    - \`.faceswap-reset\`
     ~ Resetting the session will restart face swap.

- *To change the target image*
    - \`.faceswap-change\`
     ~ _The last image you sent will become the target image_

_The session will automatically be deleted after 10 minutes._
`.trim()

infos.bell = `
!-======[ Auto AI Response ]======-!

_List of settings:_
 !-===(👥)> *All Users*
- on
- off
    \`If in a group, only for admin/owner\`

 !-===(👤)> *Owner*
- on-group
    \`Active in all groups\`

- off-group
    \`Inactive in all groups\`

- on-private
    \`Active in all private chats\`

- off-private
    \`Inactive in all private chats\`

- on-all
    \`Active in all chats\`

- off-all
    \`Inactive in all chats\`

*Example:*
> .bell on
`
