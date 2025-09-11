let infos = (Data.infos.about ??= {});

infos.help =
  'Include the question you want to ask about this bot to get assistance.';

infos.energy = `
📌 *[Guide to Adding/Reducing Energy]*

You can add or reduce another user's energy using the following methods. Be sure to include the number, reply, or tag the user whose energy you want to change.

*🛠 Format:*
- *🔹 Command*: \`.addenergy\` or \`.reduceenergy\`
- *🔹 Energy Amount*: A number indicating how much energy you want to add or reduce

*💡 How to Use:*

🔸 *Method #1 - By Replying to the Target Message*  
   ➡️ Reply to the message of the user whose energy you want to modify, then send:
   - \`.addenergy [energy amount]\`
   - \`.reduceenergy [energy amount]\`
   
   _Example_: \`.addenergy 10\`

🔸 *Method #2 - By Tagging the Target*  
   ➡️ Use \`@username\` followed by \`|\` and the energy amount.
   - \`.addenergy @username|[energy amount]\`
   - \`.reduceenergy @username|[energy amount]\`
   
   _Example_: \`.addenergy @rifza|10\`

🔸 *Method #3 - By Using the Target's Phone Number*  
   ➡️ Include the full phone number followed by \`|\` and the energy amount.
   - \`.addenergy +62xxxxxxx|[energy amount]\`
   - \`.reduceenergy +62xxxxxxx|[energy amount]\`
   
   _Example_: \`.addenergy +62831xxxxxxx|10\`

⚠️ *[Note]*
- 🔄 Replace \`[energy amount]\` with the desired number.
- ✅ Make sure the target (username or number) is valid to avoid errors.
`;

infos.stablediffusion = `*[ HOW TO USE STABLEDIFFUSION (TXT2IMG) ]*

Command to generate an image from text: \`.txt2img <checkpoint>[<lora>]|<prompt>\`

📌 *Parameter Explanation:*
- \`<checkpoint>\`: The main model ID used to generate the image.
- \`<lora>\`: (Optional) Additional LoRA ID(s) to enrich style or detail in the image. You can use one or multiple LoRAs.
- \`<prompt>\`: Description or keywords of the image you want to generate.

---------------------------------
📝 *Command Format:*

▪︎ \`Without LoRA\` - if you don’t want to add any extra effects or styles:
- \`.txt2img <checkpoint>[]|<prompt>\`
  _Example_: \`.txt2img 1234[]|sunset, beach, high resolution\`

▪︎ \`With One LoRA\` - if you want to apply one LoRA style/effect:
- \`.txt2img <checkpoint>[<lora>]|<prompt>\`
  _Example_: \`.txt2img 1234[5678]|cyberpunk, neon lights, cityscape\`

▪︎ \`With Multiple LoRAs\` - if you want to apply multiple styles/effects:
- \`.txt2img <checkpoint>[<lora>,<lora>,...more loras]|<prompt>\`
  _Example_: \`.txt2img 1234[5678,91011]|fantasy world, medieval castle, dragon\`

---------------------------------
📖 *Full Example*: 
- \`.txt2img 1233[9380]|1girl, beautiful, futuristic, armored mecha\`
  _(Explanation)_:
  - **1233**: Main checkpoint ID used.
  - **9380**: LoRA ID to add specific style or detail.
  - **1girl, beautiful, futuristic, armored mecha**: The description for the desired image.

---------------------------------
🔍 *How to Search for Checkpoint or LoRA IDs*:
- To search for LoRA IDs: use the command \`.lorasearch <keyword>\`
  _Example_: \`.lorasearch cyberpunk\` to find cyberpunk-style LoRAs.

- To search for Checkpoint IDs: use the command \`.checkpointsearch <keyword>\`
  _Example_: \`.checkpointsearch anime\` to find anime-style checkpoint models.

---------------------------------
⚠️ *Important Notes*:
- Make sure the checkpoint and LoRA IDs used are valid so the command runs correctly.
- The \`<prompt>\` description can include additional details for more specific image results.

*[ ABOUT STABLEDIFFUSION ]*
- *Stable Diffusion is a generative AI model that transforms text descriptions into images. Using a diffusion technique, the model gradually creates images based on the input text, allowing for generation in specific styles or themes. With support for additional models like LoRA, users can further customize image details or effects. This model is open-source and widely used in digital art and creative design.*
`;

infos.helpList = `\`HELP/GUIDE LIST\`\n\n<keys>`;

infos.helpNotfound = `*Oops, we couldn't find the help you're looking for!*

Maybe you were searching for:
<top>`;

infos.antilink = `📌 *Bot Antilink Feature Usage Guide*

🔒 *1. Enable Antilink:*
   - Command: \`.antilink on\`
   - *Use this command to enable antilink protection in the group.*

🔓 *2. Disable Antilink:*
   - Command: \`.antilink off\`
   - *Use this command to disable antilink protection.*

➕ *3. Add a URL to the Antilink List:*
   - Command: \`.antilink add <link>\`
   - *Use this command to add a URL you want to block.*
   - Example: \`.antilink add https://wa.me\`

➖ *4. Remove a URL from the Antilink List:*
   - Command: \`.antilink del <link>\`
   - *Use this command to remove a URL from the block list.*
   - Example: \`.antilink del https://wa.me\`
   
📄 *5. Show the Antilink URL List:*
   - Command: \`.antilink list\`
   - *Use this command to view all blocked URLs.*
   - Example: \`.antilink list\`
`;

infos.antitoxic = `📌 *Bot Antitoxic Feature Usage Guide*

🔒 *1. Enable Antitoxic:*
   - Command: \`.antitoxic on\`
   - *Use this command to enable antitoxic protection in the group.*

🔓 *2. Disable Antitoxic:*
   - Command: \`.antitoxic off\`
   - *Use this command to disable antitoxic protection.*

➕ *3. Add a Word to the Antitoxic List:*
   - Command: \`.antitoxic add <word>\`
   - *Use this command to add a word you want to block.*
   - Example: \`.antitoxic add anjg\`

➖ *4. Remove a Word from the Antitoxic List:*
   - Command: \`.antitoxic del <word>\`
   - *Use this command to remove a word from the block list.*
   - Example: \`.antitoxic del anjg\`

📄 *5. Show the Antitoxic Word List:*
   - Command: \`.antitoxic list\`
   - *Use this command to view all blocked words.*
   - Example: \`.antitoxic list\`
`;

infos.tfenergy = `
    📌 *[ Guide to Transferring Energy ]*

*💡 How to Use:*

🔸 *Method #1 - By Replying to Target's Message*  
   ➡️ Reply to the message of the user you want to transfer energy to, then send:
   - \`.transfer [energy amount]\`
   
   _Example_: \`.transfer 10\`

🔸 *Method #2 - By Tagging the Target*  
   ➡️ Use \`@username\` followed by \`|\` and the energy amount.
   - \`.transfer @username|[energy amount]\`
   
   _Example_: \`.transfer @rifza|10\`

🔸 *Method #3 - By Using Target's Phone Number*  
   ➡️ Include the full phone number followed by \`|\` and the energy amount.
   - \`.transfer +62xxxxxxx|[energy amount]\`
   
   _Example_: \`.transfer +62831xxxxxxx|10\`

⚠️ *[Notes]*  
- ℹ️ Transferring energy will decrease your own energy and add it to the target's number.  
- ⚡ You must have enough energy to make a transfer.  
- 🔄 Replace \`[energy amount]\` with the number you want to transfer.  
- ✅ Make sure the target (username or number) is valid to avoid errors.  
`;
