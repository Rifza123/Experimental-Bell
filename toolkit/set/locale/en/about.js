let infos = Data.infos.about ??= {};

infos.help = "Include any questions you would like to ask regarding this bot to get help."

infos.energy = `
📌 *[Guide for Adding/Reducing Energy]*

You can add or reduce another user’s energy using the following methods. Make sure to include the number, reply, or tag of the user whose energy will be adjusted.

*🛠 Format:*
- *🔹 Command*: \`.addenergy\` or \`.reduceenergy\`
- *🔹 Energy Amount*: The number indicating how much energy to add or reduce

*💡 Usage Instructions:*

🔸 *Method #1 - By Replying to the Target’s Message*  
   ➡️ Reply to the message of the user whose energy will be adjusted, then send:
   - \`.addenergy [energy amount]\`
   - \`.reduceenergy [energy amount]\`
   
   _Example_: \`.addenergy 10\`

🔸 *Method #2 - By Tagging the Target*  
   ➡️ Use \`@username\` followed by \`|\` and the energy amount.
   - \`.addenergy @username|[energy amount]\`
   - \`.reduceenergy @username|[energy amount]\`
   
   _Example_: \`.addenergy @rifza|10\`

🔸 *Method #3 - By Using the Target’s Number*  
   ➡️ Include the user’s full number followed by \`|\` and the energy amount.
   - \`.addenergy +62xxxxxxx|[energy amount]\`
   - \`.reduceenergy +62xxxxxxx|[energy amount]\`
   
   _Example_: \`.addenergy +62831xxxxxxx|10\`

⚠️ *[Note]*
- 🔄 Replace \`[energy amount]\` with the desired number.
- ✅ Make sure the target (username or number) is valid to avoid errors.
` 

infos.stablediffusion = `*[ HOW TO USE STABLEDIFFUSION (TXT2IMG) ]*

Command to generate images with text: \`.txt2img <checkpoint>[<lora>]|<prompt>\`
📌 *Parameter Explanation:*
- \`<checkpoint>\`: The main model ID used to generate the image.
- \`<lora>\`: (Optional) Additional ID to enhance style or details in the image. Can use one or more Lora IDs.
- \`<prompt>\`: Description or keywords for the desired image.

---------------------------------
📝 *Command Format:*

▪︎ \`Without Lora\` - if you don’t want to add Lora effects or styles:
- \`.txt2img <checkpoint>[]|<prompt>\`
  _Example_: \`.txt2img 1234[]|sunset, beach, high resolution\`

▪︎ \`With 1 Lora\` - if you want to add one Lora effect/style:
- \`.txt2img <checkpoint>[<lora>]|<prompt>\`
  _Example_: \`.txt2img 1234[5678]|cyberpunk, neon lights, cityscape\`

▪︎ \`With Multiple Loras\` - if you want to add several Lora effects/styles:
- \`.txt2img <checkpoint>[<lora>,<lora>,...more lora]|<prompt>\`
  _Example_: \`.txt2img 1234[5678,91011]|fantasy world, medieval castle, dragon\`

---------------------------------
📖 *Full Example*: 
- \`.txt2img 1233[9380]|1girl, beautiful, futuristic, armored mecha\`
  _(Explanation)_:
  - **1233**: Main checkpoint ID used.
  - **9380**: Lora ID to add specific details.
  - **1girl, beautiful, futuristic, armored mecha**: Description for the image result.

---------------------------------
🔍 *How to Find Checkpoint or Lora IDs*:
- To search for a Lora ID: use the command \`.lorasearch <keyword>\`
  _Example_: \`.lorasearch cyberpunk\` to find Lora styles with a cyberpunk theme.
  
- To search for a Checkpoint ID: use the command \`.checkpointsearch <keyword>\`
  _Example_: \`.checkpointsearch anime\` to find checkpoints with an anime theme.

---------------------------------
⚠️ *Important Notes*:
- Ensure the checkpoint and Lora IDs used are valid for the command to work properly.
- Descriptions in the \`<prompt>\` can include additional details for more specific results.

*[ ABOUT STABLEDIFFUSION ]*
- *Stable Diffusion is a generative AI model that transforms text descriptions into images. Using diffusion techniques, this model gradually creates images based on given text input, allowing image generation with specific styles or themes. With support for additional models like LoRA, users can further customize image details or effects. This model is open-source and widely used in digital art and creative design.*
`


infos.helpList = `\`GUIDE/HELP LIST\`\n\n<keys>`

infos.helpNotfound = `*Oops we didn't find the help you were looking for!* 

Maybe you're looking for: 
<top>`

infos.antilink = `📌 *Antilink Feature Usage Guide*

🔒 *1. Activating Antilink:*
   - Command: \`.antilink on\`
   - *Use this command to activate the antilink protection in the group.*

🔓 *2. Deactivating Antilink:*
   - Command: \`.antilink off\`
   - *Use this command to deactivate the antilink protection.*

➕ *3. Adding URLs to the Antilink List:*
   - Command: \`.antilink add <link>\`
   - *Use this command to add a URL that you want to block.*
   - Example: \`.antilink add https://wa.me\`

➖ *4. Removing URLs from the Antilink List:*
   - Command: \`.antilink del <link>\`
   - *Use this command to remove a URL from the block list.*
   - Example: \`.antilink del https://wa.me\`
`
