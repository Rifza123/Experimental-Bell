let infos = global.cfg.menu.infos
let monospace = "```" 
let dark = "`"
/*!-======[ Lora Info ]======-!*/
infos.lora = `
*Perhatikan petunjuk berikut!*
 ${monospace}[ StableDiffusion - Lora++ ]${monospace}

Penggunaan: <prefix><command> <ID>|<prompt>
Contoh: #lora 3|beautyfull cat with aesthetic jellyfish, sea god themes

 => _ID adalah nomor dari model yang tersedia di list_

_*silahkan lihat list model yang tersedia:*_

*[ID] [NAME]*

[1] [Donghua#01]
[2] [YunXi - PerfectWorld]
[3] [Sea God(Tang San) - Douluo Dalu]
[4] [XiaoYiXian - Battle Throught The Heavens]
[5] [Angel God(Xian Renxue) - Douluo Dalu]
[6] [Sheng Cai'er - Throne Of Seal]
[7] [HuTao - Genshin Impact]
[8] [TangWutong - The Unrivaled Tang Sect]
[9] [CaiLin(Medusa) -BattleThroughtTheHeavens]
[10] [Elaina-MajoNoTabiTabi]
[11] [Jiang Nanan - TheUnrivaledTangSect]
[12] [Cailin(Queen Medusa) - BTTH [4KUltraHD]]
[13] [MaXiaoTao-TheUnrivaledTangSect]
[14] [YorForger-Spy x Family]
[15] [Boboiboy Galaxy]
[16] [Hisoka morow]
[17] [Ling Luochen ▪︎ The Unrivaled Tang Sect]
[18] [Tang Wutong ▪︎ The Unrivaled Tang Sect]
[19] [Huo Yuhao ▪︎ The Unrivaled Tang Sect]`,

/*!-======[ Enhance Info ]======-!*/
infos.enhance = `
*SILAHKAN PILIH TYPE YANG TERSEDIA!*
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

_Cara penggunaan: #enhance phox4_
`

/*!-======[ Set Info ]======-!*/

infos.set = `
[ BOT SETTING ]

- public <on/off>
- autotyping <on/off>
- autoreadsw <on/off>
- bell <on/off>
- autoreadpc <on/off>
- autoreadgc <on/of>

_Example: .set public true_`

/*!-======[ Filters Info ]======-!*/
infos.filters = `*Harap masukan type nya!*
            
List Type:

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

_Contoh: .filters steam_`

/*!-======[ Text To Image Info ]======-!*/
infos.txt2img = `
*[ CARA PENGGUNAAN ]*
Param: ${dark}.txt2img <checkpoint>[<lora>]|<prompt>${dark}

 ▪︎ ${dark}Tanpa lora${dark}
-  .txt2img <checkpoint>[]|<prompt>

 ▪︎ ${dark}1 lora${dark}
-  .txt2img <checkpoint>[<lora>]|<prompt>

 ▪︎ ${dark}lebih dari 1 lora${dark}
- .txt2img <checkpoint>[<lora>,<lora>,...more lora]|<prompt>
--------------------------------------------------
 ▪︎ ${dark}Contoh${dark}: 
- *.txt2img 1233[9380]|1girl, beautiful, futuristic, armored mecha*
--------------------------------------------------
 ${dark}Searching id${dark}: 
 - lora: .lorasearch <query>
 - checkpoint: .checkpointsearch <query>

`