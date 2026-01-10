/*!-======[ Module Imports ]======-!*/
const axios = 'axios'.import();
const fs = 'fs'.import();

/*!-======[ Functions Imports ]======-!*/
const { gpt } = await (fol[2] + 'gpt3.js').r();
const { deepseek } = await (fol[2] + 'deepseek.js').r();
const { GeminiImage } = await (fol[2] + 'gemini.js').r();
const { imageEdit } = await (fol[2] + 'imageEdit.js').r();
const { tmpFiles } = await (fol[0] + 'tmpfiles.js').r();
const { TermaiCdn } = await (fol[0] + 'cdn.termai.js').r();

let exif = await (fol[0] + 'exif.js').r();
let { convert } = exif;

/*!-======[ Default Export Function ]======-!*/
export default async function on({ Exp, ev, store, cht, ai, is }) {
  let infos = Data.infos;
  let { sender, id } = cht;
  const { func } = Exp;
  ev.on(
    {
      cmd: ['cover', 'covers'],
      listmenu: ['covers'],
      tag: 'voice_changer',
      energy: 70,
      premium: true,
      args: infos.ai.includeModel,
      media: {
        type: ['audio'],
        etc: {
          seconds: 360,
        },
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      await cht.edit(infos.messages.wait, _key, true);
      axios
        .post(
          `${api.xterm.url}/api/audioProcessing/voice-covers?model=${cht.q}&key=${api.xterm.key}`,
          media,
          {
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            responseType: 'stream',
          }
        )
        .then(async (response) => {
          response.data.on('data', async (chunk) => {
            const eventString = chunk.toString();
            const eventData = eventString.match(/data: (.+)/);

            if (eventData) {
              let data;
              try {
                data = JSON.parse(eventData[1]);
                console.log(data);
              } catch {
                data = {};
                await cht.reply(JSON.stringify(eventData, 0, 2));
              }
              switch (data.status) {
                case 'searching':
                case 'separating':
                case 'starting':
                case 'processing':
                case 'mixing':
                  data.msg && cht.edit(data.msg || '...', _key, true);
                  break;
                case 'success':
                  await Exp.sendMessage(
                    id,
                    { audio: { url: data.result }, mimetype: 'audio/mp4' },
                    { quoted: cht }
                  );
                  response.data.destroy();
                  break;
                case 'failed':
                  await cht.reply(infos.messages.failed);
                  response.data.destroy();
                  break;
                case 'reject':
                  cht.reply(data.msg);
                  response.data.destroy();
                  break;
              }
            }
          });
        })
        .catch((error) => {
          cht.edit(
            `Error: ${error.response ? error.response.data : error.message}`,
            _key
          );
        });
    }
  );

  /* DELETED 
  ev.on(
    {
      cmd: ['lora', 'sdlora'],
      listmenu: ['lora'],
      tag: 'stablediffusion',
      premium: true,
      energy: 10,
    },
    async () => {
      let [text1, text2] = cht.q ? cht.q.split('|') : [];
      if (!text1 || !text2)
        return cht.reply(`${infos.ai.payInstruction}\n ${infos.ai.lora}`);
      await cht.edit(infos.messages.wait, keys[sender]);
      await Exp.sendMessage(
        id,
        {
          image: {
            url:
              api.xterm.url +
              '/api/text2img/instant-lora?id=' +
              text1 +
              '&prompt=' +
              text2 +
              '&key=' +
              api.xterm.key,
          },
          caption: infos.ai.lora_models[parseInt(text1) - 1],
          ai: true,
        },
        { quoted: cht }
      );
    }
  );*/

  ev.on(
    {
      cmd: [
        'imglarger',
        'enlarger',
        'enlarge',
        'filters',
        'filter',
        'toanime',
        'jadianime',
        'jadinyata',
        'toreal',
      ],
      listmenu: ['toanime', 'filters', 'toreal'],
      tag: 'art',
      premium: true,
      energy: 50,
      media: {
        type: ['image'],
        save: false,
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      let tryng = 0;
      let type = 'anime2d';
      if (['filter', 'filters'].includes(cht.cmd)) {
        if (!cht.q) return cht.reply(infos.ai.filters);
        type = cht.q;
      } else if (['jadinyata', 'toreal'].includes(cht.cmd)) {
        type = 'anime2real';
      } else if (['imglarger', 'enlarger', 'enlarge'].includes(cht.cmd)) {
        type = 'enlarger';
      }
      let i = 0;
      await cht.edit(infos.messages.wait, _key, true);
      let tph = await TermaiCdn(await func.minimizeImage(media));
      try {
        let ai = await fetch(
          api.xterm.url +
            '/api/img2img/filters?action=' +
            type +
            '&url=' +
            tph +
            '&key=' +
            api.xterm.key
        ).then((a) => a.json());
        console.log(ai);
        if (!ai.status) return cht.reply(ai?.msg || 'Error!');
        while (tryng < 50) {
          if (i === Data.spinner.length) i = 0;
          let s = await fetch(
            api.xterm.url + '/api/img2img/filters/batchProgress?id=' + ai.id
          ).then((a) => a.json());
          await cht.edit(
            `${Data.spinner[i++]} ${s?.progress || 'Prepare...'}`,
            _key,
            true
          );
          if (s.status == 3) {
            return Exp.sendMessage(
              id,
              { image: { url: s.url }, ai: true },
              { quoted: cht }
            );
          }
          if (s.status == 4) {
            return cht.reply(infos.ai.failTryImage);
          }
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }
      } catch (e) {
        console.error(e);
        cht.reply(`Type-Err! :\n${e}`);
      }
    }
  );

  let i2i = ['img2img', 'i2i', 'image2image'];
  let isI2i = i2i.includes(cht.cmd);

  ev.on(
    {
      cmd: ['txt2img', 'text2img', 'stablediffusion', ...i2i],
      listmenu: ['text2img', 'img2img'],
      tag: 'stablediffusion',
      args: (isI2i ? infos.messages.replyOrSendImage : '') + infos.ai.txt2img,
      energy: 100,
    },
    async () => {
      const _key = keys[sender];
      const img =
        is.quoted.image ||
        is.image ||
        (is.sticker?.isAnimated || is.quoted.sticker?.isAnimated) == false;
      if (isI2i && !img) return cht.reply(replyOrSendImage + infos.ai.txt2img);
      let image = img
        ? await (is.image || is.sticker
            ? cht.download()
            : is.quoted?.image || is.quoted?.sticker
              ? cht.quoted.download()
              : false)
        : null;

      if (!cht.q) return cht.reply(infos.ai.txt2img);
      let [model, prompt, negative] = cht.q.split('|');
      if (!model.includes('[')) {
        return cht.reply(infos.ai.txt2img);
      }
      try {
        let modl = model.split('[')[0];
        let ckpt = modl.split('{')[0];
        let son = modl.split('{')?.[1]?.split('}')?.[0] || '';
        let rgx = /'/g;
        let json = JSON.parse(`{${son?.replace(rgx, '"')}}`);
        let loraPart = model.split('[')[1]?.split(']')?.[0];
        let loras = loraPart
          ? loraPart
              .split(',')
              .map((a) => ({ [a.split(':')[0]]: a.split(':')[1] || 0.7 }))
          : [];
        let as = model.split(']')[1];
        let asp = [
          '1:1',
          '9:16',
          '16:9',
          '3:4',
          '4:3',
          '2:3',
          '3:2',
          '21:9',
          '9:21',
          '5:4',
          '4:5',
          '18:9',
          '9:18',
          '16:10',
          '10:16',
        ];
        let aspect_ratio = as?.length > 1 ? as : '3:4';
        if (!aspect_ratio.includes(':'))
          return cht.reply(`*Invalid Aspect ratio!*\n\n${infos.ai.txt2img}`);
        if (!asp.includes(aspect_ratio))
          return cht.reply(
            `*Invalid aspect ratio!*\n\nList aspect ratio:\n- ${asp.join('\n- ')}`
          );
        if (!ckpt || (!img && !prompt))
          return cht.reply(
            `*Please input checkpoints & prompt!*\n\n${infos.ai.txt2img}`
          );
        await cht.edit(infos.messages.wait, _key, true);

        let [checkpointsResponse, lorasResponse] = await Promise.all([
          fetch(
            api.xterm.url +
              '/api/text2img/stablediffusion/list_checkpoints?key=' +
              api.xterm.key
          ),
          fetch(
            api.xterm.url +
              '/api/text2img/stablediffusion/list_loras?key=' +
              api.xterm.key
          ),
        ]);

        if (!checkpointsResponse.ok || !lorasResponse.ok) {
          return cht.reply(
            `HTTP error! status: ${checkpointsResponse.status} or ${lorasResponse.status}`
          );
        }

        let [checkpoints, loraModels] = await Promise.all([
          checkpointsResponse.json(),
          lorasResponse.json(),
        ]);

        let lora = loras.map((c) => ({
          model: loraModels[Object.keys(c)[0]].model,
          weight: Object.values(c)[0],
        }));

        let baseType = checkpoints[ckpt].baseType;
        let notSame = [];
        for (let i of loras) {
          if (loraModels[Object.keys(i)[0]].baseType !== baseType)
            notSame.push(i);
        }

        if (notSame.length > 0) {
          let notSameLora = notSame.map((a) => {
            return `[ ${a} ] [ ${loraModels[a].model} ] \`${loraModels[a].baseType}\``;
          });
          return cht.reply(
            func.tagReplacer(infos.ai.unsuitableModel, {
              baseType,
              notSameLora: notSameLora.join('\n'),
            }),
            { replyAi: false }
          );
        }

        if (is.sticker || is.quoted?.sticker) {
          let url = await tmpFiles(image);
          let cv = await convert({
            url,
            from: 'webp',
            to: 'png',
          });
          image = await func.getBuffer(cv);
        }

        let body = {
          checkpoint: checkpoints[ckpt].model,
          prompt: prompt || '',
          negativePrompt: negative || '',
          aspect_ratio,
          denoisingStrength: json.denoisingStrength || 0.65,
          styleFidelity: json.styleFidelity,
          lora,
          sampling: 'DPM++ 2M Karras',
          samplingSteps: 30,
          imageStrength: json.imageStrength || 0.45,
          cfgScale: json.cfgScale || 8,
          hiresFix: true,
          image: image ? await func.minimizeImage(image) : null,
        };

        console.log(body);

        let aiResponse = await fetch(
          `${api.xterm.url}/api/${isI2i ? 'img' : 'text'}2img/stablediffusion/createTask?key=${api.xterm.key}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        if (!aiResponse.ok) {
          console.log(await aiResponse.text());
          return cht.reply(
            `HTTP error! status: ${aiResponse.status}${aiResponse.status == 429 ? '\n_Rate limit reached! please check your limit apikey!_' : aiResponse.status == 403 ? '_Your apikey is invalid or expired! Please check .cekapikey for details your key' : ''}`
          );
        }

        let ai = await aiResponse.json();

        if (!ai.status) {
          console.log(ai);
          return cht.reply(infos.messages.failed);
        }

        let tryng = 0;
        let i = 0;
        while (tryng < 50) {
          tryng += 1;

          let sResponse = await fetch(
            `${api.xterm.url}/api/text2img/stablediffusion/taskStatus?id=${ai.id}`
          );

          if (!sResponse.ok) {
            return cht.reply(
              `HTTP error! status: ${sResponse.status}${aiResponse.status == 429 ? '\n_Rate limit reached! please check your limit apikey!_' : sResponse.status == 403 ? '_Your apikey is invalid or expired! Please check .cekapikey for details your key' : ''}`
            );
          }

          let s = await sResponse.json();
          if (i === Data.spinner.length) i = 0;
          if (s.taskStatus === 0) {
            await cht.edit(
              `${Data.spinner[i++]} \`\`\`Starting..\`\`\``,
              _key,
              true
            );
          } else if (s.taskStatus === 1) {
            await cht.edit(
              `${Data.spinner[i++]} Processing.... ${s.progress}%`,
              _key,
              true
            );
          } else if (s.taskStatus === 2) {
            const loraText =
              body.lora && body.lora.length
                ? body.lora
                    .map(
                      (l, i) => `  ${i + 1}. ${l.model} (Weight: ${l.weight})`
                    )
                    .join('\n')
                : '  None';
            console.log(s);
            return Exp.sendMessage(
              id,
              {
                image: {
                  url: s.result.url,
                },
                ...(isI2i
                  ? {
                      caption: `
Image2image Generation Detail:
${infos.others.readMore}

- Prompt: *${body.prompt || 'None'}*
- Negative Prompt: *${s.result.info.split('Negative prompt: ')[1]?.split('\n')[0]}*
- Checkpoint: ${body.checkpoint}
- LoRA(s):
${loraText}
- Sampling Method: ${body.sampling}
- Sampling Steps: ${body.samplingSteps}
- CFG Scale: ${body.cfgScale}`.trim(),
                    }
                  : {}),
                ai: true,
              },
              {
                quoted: cht,
              }
            );
          } else if (s.taskStatus === 3) {
            return cht.reply(infos.ai.failTryImage);
          }

          await new Promise((resolve) => setTimeout(resolve, 2500));
        }
      } catch (error) {
        console.log(error);
        cht.reply('Error: ' + error.message);
      }
    }
  );

  ev.on(
    {
      cmd: ['lorasearch', 'checkpointsearch'],
      listmenu: ['lorasearch', 'checkpointsearch'],
      tag: 'stablediffusion',
      energy: 3,
    },
    async () => {
      if (!cht.q) return cht.reply('Mau cari model apa?');
      fetch(
        `${api.xterm.url}/api/text2img/stablediffusion/list_${cht.cmd == 'lorasearch' ? 'loras' : 'checkpoints'}?key=${api.xterm.key}`
      ).then(async (a) => {
        let data = await a.json();
        func
          .searchSimilarStrings(
            cht.q.toLowerCase(),
            data.map((b) => b.model),
            0.3
          )
          .then(async (c) => {
            let txt = func.tagReplacer(infos.ai.findListModels, {
              type: cht.cmd == 'lorasearch' ? 'LORAS' : 'CHECKPOINTS',
              found: c.length,
              total: data.length,
              getCmd: cht.cmd == 'lorasearch' ? 'lora' : 'CHECKPOINT',
            });

            c.forEach((d) => {
              txt += `[ ${d.index} ] [ ${d.item} ] \`${data[d.index].baseType}\`\n`;
            });
            cht.reply(txt);
          });
      });
    }
  );

  ev.on(
    {
      cmd: ['getlora', 'getcheckpoint'],
      listmenu: ['getlora', 'getcheckpoint'],
      tag: 'stablediffusion',
      energy: 3,
    },
    async () => {
      if (!cht.q) return cht.reply('Harap masukan id nya!');
      if (isNaN(cht.q)) return cht.reply('Id harus berupa angka!');
      fetch(
        `${api.xterm.url}/api/text2img/stablediffusion/list_${cht.cmd == 'getlora' ? 'loras' : 'checkpoints'}?key=${api.xterm.key}`
      ).then(async (a) => {
        try {
          let data = await a.json();
          Exp.sendMessage(
            id,
            {
              image: { url: `${data[cht.q].preview}&key=${api.xterm.key}` },
              caption: data[cht.q].model,
            },
            { quoted: cht }
          );
        } catch (e) {
          console.log(e);
          cht.reply(infos.ai.notfound);
        }
      });
    }
  );

  ev.on(
    {
      cmd: ['luma', 'img2video', 'i2v'],
      listmenu: ['luma'],
      tag: 'ai',
      energy: 185,
      premium: true,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      const response = await axios.post(
        `${api.xterm.url}/api/img2video/luma?key=${api.xterm.key}${cht?.q ? '&prompt=' + cht.q : ''}`,
        await func.minimizeImage(media),
        {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          responseType: 'stream',
        }
      );

      let rsp = 'rfz';
      let i = 0;
      response.data.on('data', async (chunk) => {
        try {
          const eventString = chunk.toString();
          const eventData = eventString.match(/data: (.+)/);
          if (eventData && eventData[1]) {
            let data;
            try {
              data = JSON.parse(eventData[1]);
            } catch (e) {
              console.loc(eventData[1]);
              data = {};
            }
            console.log(data);
            if (i === Data.spinner.length) i = 0;
            switch (data.status) {
              case 'queueing':
              case 'generating':
              case 'processing':
                cht.edit(
                  `${Data.spinner[i++]} ${data.msg || 'Processing....'} ${data.progress ? data.progress + '%' : ''}`,
                  _key,
                  true
                );
                break;
              case 'failed':
                await cht.reply(data.msg);
                response.data.destroy();
                break;
              case 'completed':
                await Exp.sendMessage(
                  id,
                  {
                    video: { url: data.video.url },
                    mimetype: 'video/mp4',
                    ai: true,
                  },
                  { quoted: cht }
                );
                response.data.destroy();
                break;
              case 'reject':
                cht.reply(data.msg);
                response.data.destroy();
                break;
              default:
                console.log('Unknown status:', data);
            }
          }
        } catch (e) {
          console.error('Error processing chunk:', e.message);
          response.data.destroy();
          cht.reply('Err!!');
        }
      });
    }
  );

  ev.on(
    {
      cmd: ['bard', 'ai'],
      tag: 'ai',
      args: infos.ai.isQuery,
      listmenu: ['bard'],
      energy: 7,
    },
    async () => {
      let ai = await fetch(
        `${api.xterm.url}/api/chat/bard?query=${encodeURIComponent(cht.q)}&key=${api.xterm.key}`
      ).then((response) => response.json());

      cht.reply('[ BARD GOOGLE ]\n' + ai.chatUi, { ai: true, replyAi: false });
    }
  );

  ev.on(
    {
      cmd: ['gpt', 'gpt3'],
      tag: 'ai',
      args: infos.ai.isQuery,
      listmenu: ['gpt3'],
      energy: 7,
    },
    async () => {
      let res = await gpt(cht.q);
      cht.reply('[ GPT-3 ]\n' + res.response, { ai: true, replyAi: false });
    }
  );

  ev.on(
    {
      cmd: ['deepseek', 'deepseek-r1'],
      tag: 'ai',
      args: infos.ai.isQuery,
      listmenu: ['deepseek'],
      energy: 7,
    },
    async () => {
      let res = await deepseek(cht.q);
      cht.reply('[ DEEPSEEK-R1 ]\n' + res.response, {
        ai: true,
        replyAi: false,
      });
    }
  );

  ev.on(
    {
      cmd: ['bell', 'autoai', 'aichat', 'ai_interactive'],
      tag: 'ai',
      listmenu: ['autoai'],
    },
    async () => {
      function sendAiInfo() {
        Exp.sendMessage(
          id,
          {
            text: infos.ai.bell,
            contextInfo: {
              externalAdReply: {
                title: cht.pushName,
                body: 'Artificial Intelligence, The beginning of the robot era',
                thumbnailUrl:
                  'https://telegra.ph/file/e072d1b7d5fe75221a36c.jpg',
                sourceUrl: 'https://github.com/Rifza123',
                mediaUrl: `http://ẉa.me/6283110928302/9992828`,
                renderLargerThumbnail: true,
                showAdAttribution: true,
                mediaType: 1,
              },
            },
          },
          { quoted: cht }
        );
      }
      if (!cht.q) return sendAiInfo();
      Data.preferences[id] = Data.preferences[id] || {};
      let q = cht.q;
      let set = {
        on: {
          done: infos.ai.interactiveOn,
          value: true,
        },
        off: {
          done: infos.ai.interactiveOff,
          value: false,
        },
        'on-group': {
          done: infos.ai.interactiveOnGroup,
          owner: true,
          for: from.group,
          value: true,
        },
        'on-private': {
          done: infos.ai.interactiveOnPrivate,
          owner: true,
          for: from.sender,
          value: true,
        },
        'off-group': {
          done: infos.ai.interactiveOffGroup,
          owner: true,
          for: from.group,
          value: false,
        },
        'off-private': {
          done: infos.ai.interactiveOffPrivate,
          owner: true,
          for: from.sender,
          value: false,
        },
        'on-all': {
          done: infos.ai.interactiveOnAll,
          owner: true,
          for: 'all',
          value: true,
        },
        'off-all': {
          done: infos.ai.interactiveOffAll,
          owner: true,
          for: 'all',
          value: false,
        },
        'on-energy': {
          done: infos.ai.interactiveOnEnergy,
          owner: true,
          type: 'energy',
          value: true,
        },
        'off-energy': {
          done: infos.ai.interactiveOffEnergy,
          owner: true,
          type: 'energy',
          value: false,
        },
        'on-partResponse': {
          done: infos.ai.interactiveOnPartResponse,
          owner: true,
          type: 'partResponse',
          value: true,
        },
        'off-partResponse': {
          done: infos.ai.interactiveOffPartResponse,
          owner: true,
          type: 'partResponse',
          value: false,
        },
      }[q];

      let alls = Object.keys(Data.preferences);
      if (!set) return sendAiInfo();
      if (set.owner && !is.owner) return cht.reply(infos.messages.isOwner);
      if (id.endsWith(from.group) && !(is.groupAdmins || is.owner))
        return cht.reply(infos.messages.isAdmin);

      if (set.for) {
        let $config =
          set.for === from.group
            ? 'group'
            : set.for === from.sender
              ? 'private'
              : 'all';
        if ($config === 'all') {
          cfg.ai_interactive.group = set.value;
          cfg.ai_interactive.private = set.value;
        } else {
          cfg.ai_interactive[$config] = set.value;
        }
        alls =
          set.for === from.group
            ? alls.filter((a) => a.endsWith(from.group))
            : set.for === from.sender
              ? alls.filter((a) => a.endsWith(from.sender))
              : alls;
        for (let i of alls) {
          Data.preferences[i].ai_interactive = set.value;
        }
      } else if (set.type == 'energy') {
        cfg.ai_interactive.energy = set.value;
      } else if (set.type == 'partResponse') {
        cfg.ai_interactive.partResponse = set.value;
      } else {
        Data.preferences[id].ai_interactive = set.value;
      }

      cht.reply(set.done);
    }
  );

  ev.on(
    {
      cmd: ['resetaichat', 'clearsesichat'],
      tag: 'ai',
      listmenu: ['resetaichat'],
    },
    async () => {
      let ai = await fetch(
        `${api.xterm.url}/api/chat/logic-bell/reset?id=${cht.sender}&key=${api.xterm.key}`
      ).then((response) => response.json());
      cht.reply(ai.msg, { ai: true });
    }
  );

  ev.on(
    {
      cmd: ['animediff'],
      listmenu: ['animediff'],
      tag: 'stablediffusion',
      args: infos.ai.isPrompt,
      energy: 17,
    },
    async () => {
      let [text1, text2] = cht.q ? cht.q.split('|') : [];
      await cht.edit(infos.messages.wait, keys[sender]);
      await Exp.sendMessage(
        id,
        {
          image: {
            url:
              api.xterm.url +
              '/api/text2img/animediff?prompt=' +
              text1 +
              '&key=' +
              api.xterm.key +
              (text2 ? '&prompt=' + text2 : ''),
          },
          ai: true,
        },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['dalle3'],
      listmenu: ['dalle3'],
      tag: 'art',
      args: infos.ai.isPrompt,
      energy: 17,
      badword: true,
    },
    async ({ args }) => {
      await cht.edit(infos.messages.wait, keys[sender]);
      let url =
        api.xterm.url +
        '/api/text2img/dalle3?prompt=' +
        args +
        '&key=' +
        api.xterm.key;
      if (cfg.button) {
        let imageMessage = await func.uploadToServer(url);

        let _m = {
          interactiveMessage: {
            header: {
              title: '',
              imageMessage,
              hasMediaAttachment: true,
            },
            body: {
              text: '🖌️Dalle 3'.font('bold'),
            },
            footer: {
              text: `Prompt: ${args}`,
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: 'quick_reply',
                  buttonParamsJson: {
                    display_text: 'Re-Generate🔄 ',
                    id: `.dalle3 ${args}`,
                  }.String(),
                },
              ],
            },
            contextInfo: {
              stanzaId: cht.key.id,
              participant: cht.key.participant,
              quotedMessage: cht,
            },
          },
        };

        return Exp.relayMessage(cht.id, _m, {});
      }
      await Exp.sendMessage(
        id,
        {
          image: {
            url,
          },
          ai: true,
        },
        { quoted: cht }
      );
    }
  );

  ev.on(
    {
      cmd: ['geminiimage', 'geminiimg'],
      listmenu: ['geminiimage'],
      tag: 'ai',
      energy: 20,
      args: infos.ai.isQuery,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      let res = await GeminiImage(await func.minimizeImage(media), cht.q);
      console.log({ res });
      cht.reply(res, { ai: true, replyAi: false });
    }
  );

  ev.on(
    {
      cmd: ['clay', 'clayfilters', 'clayfilter', 'toclay'],
      listmenu: ['clayfilters'],
      tag: 'art',
      energy: 25,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      try {
        const _key = keys[sender];
        let url = await tmpFiles(media);
        await cht.edit(infos.messages.wait, _key);
        Exp.sendMessage(
          cht.id,
          {
            image: {
              url: `${api.xterm.url}/api/img2img/clay-filters?url=${url}&key=${api.xterm.key}`,
            },
          },
          { quoted: cht }
        );
      } catch (e) {
        await cht.reply('Failed!');
        throw new Error(e);
      }
    }
  );
  ev.on(
    {
      cmd: ['zombie', 'tozombie'],
      listmenu: ['tozombie'],
      tag: 'art',
      energy: 25,
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      try {
        const _key = keys[sender];
        let url = await tmpFiles(await func.minimizeImage(media));
        await cht.edit(infos.messages.wait, _key);
        Exp.sendMessage(
          cht.id,
          {
            image: {
              url: `${api.xterm.url}/api/img2img/to-zombie?url=${url}&key=${api.xterm.key}`,
            },
          },
          { quoted: cht }
        );
      } catch (e) {
        await cht.reply('Failed!');
        throw new Error(e);
      }
    }
  );

  ev.on(
    {
      cmd: ['songai', 'songgenerator'],
      listmenu: ['songgenerator'],
      tag: 'ai',
      energy: 70,
      premium: true,
      args: infos.ai.prompt,
    },
    async ({ media }) => {
      const _key = keys[sender];
      const prompt = cht.q;
      await cht.edit(infos.messages.wait, _key, true);
      axios({
        method: 'post',
        url: `${api.xterm.url}/api/audioProcessing/song-generator`,
        params: { prompt, key: api.xterm.key },
        responseType: 'stream',
      })
        .then((response) => {
          response.data.on('data', async (chunk) => {
            const eventString = chunk.toString();
            const eventData = eventString.match(/data: (.+)/);

            if (eventData) {
              const data = JSON.parse(eventData[1]);
              switch (data.status) {
                case 'queueing':
                case 'generating':
                  cht.edit(data.msg, _key, true);
                  break;
                case 'success':
                  const audio = {
                    text: data.result.lyrics,
                    ai: true,
                    contextInfo: {
                      externalAdReply: {
                        title: prompt,
                        body: data.result.tags,
                        thumbnailUrl: data.result.imageUrl,
                        sourceUrl: 'https://github.com/Rifza123',
                        mediaUrl: `http://ẉa.me/6283110928302/${Math.floor(Math.random() * 100000000000000000)}`,
                        renderLargerThumbnail: true,
                        showAdAttribution: true,
                        mediaType: 1,
                      },
                      forwardingScore: 999,
                      isForwarded: true,
                      forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363301254798220@newsletter',
                        serverMessageId: 152,
                      },
                    },
                  };
                  await Exp.sendMessage(id, audio, { quoted: cht });
                  await Exp.sendMessage(
                    id,
                    {
                      audio: { url: data.result.audioUrl },
                      mimetype: 'audio/mp4',
                    },
                    { quoted: cht }
                  );
                  response.data.destroy();
                  break;
                case 'failed':
                  cht.reply(infos.messages.failed);
                  response.data.destroy();
                  break;
                case 'reject':
                  cht.reply(data.msg);
                  response.data.destroy();
                  break;
              }
            }
          });
        })
        .catch((error) => {
          console.log(error);
          cht.edit(
            'Error:' + error.response ? error.response.data : error.message,
            _key
          );
        });
    }
  );

  ev.on(
    {
      cmd: ['faceswap'],
      listmenu: ['faceswap'],
      tag: 'ai',
      energy: 25,
      premium: true,
      media: {
        type: ['image'],
        msg: infos.ai.faceSwap(cht),
        save: false,
      },
    },
    async ({ media }) => {
      const _key = keys[sender];
      let face;
      let target;
      if (
        (is.image && !is.quoted?.image) ||
        (is.quoted?.image && !is.image) ||
        !Boolean(cht.cmd)
      ) {
        let usr = cht.sender.split('@')[0];
        let swps = func.archiveMemories.getItem(cht.sender, 'fswaps');
        if (swps.list.length < 1) {
          swps.list.push(await tmpFiles(media));
          swps.last = Date.now();
          func.archiveMemories.setItem(cht.sender, 'fswaps', swps);
          func.handleSessionExpiry({
            usr,
            cht,
            session: cht.cmd,
            time: 600000,
            key: 'fswaps',
          });
          return cht.reply(infos.ai.startedFaceswap);
        }
        if (swps.list.length >= 1) {
          swps.list[1] = await tmpFiles(media);
          swps.last = Date.now();
          console.log(swps.list[1]);
          func.archiveMemories.setItem(cht.sender, 'fswaps', swps);
        }
        func.handleSessionExpiry({
          usr,
          cht,
          session: cht.cmd,
          time: 600000,
          key: 'fswaps',
        });

        target = swps?.list?.[0];
        face = swps?.list?.[1];
      } else {
        target = await tmpFiles(media);
        face = is.url?.[0]
          ? is.url[0]
          : is?.image
            ? await tmpFiles(await cht.download())
            : false;
      }
      await cht.edit(infos.messages.wait, _key, true);
      axios({
        method: 'post',
        url: `${api.xterm.url}/api/img2img/faceswap`,
        params: { face, target, key: api.xterm.key },
        responseType: 'stream',
      })
        .then((response) => {
          response.data.on('data', async (chunk) => {
            const eventString = chunk.toString();
            const eventData = eventString.match(/data: (.+)/);

            if (eventData) {
              const data = JSON.parse(eventData[1]);
              switch (data.status) {
                case 'queueing':
                case 'generating':
                  cht.edit(data.msg, _key, true);
                  break;
                case 'success':
                  await Exp.sendMessage(
                    id,
                    { image: { url: data.result }, ai: true },
                    { quoted: cht }
                  );
                  response.data.destroy();
                  break;
                case 'failed':
                  cht.reply(data.msg || infos.messages.failed);
                  response.data.destroy();
                  break;
                case 'reject':
                  cht.reply(data.msg);
                  response.data.destroy();
                  break;

                default:
                  cht.reply(data.msg);
                  response.data.destroy();
              }
            }
          });
        })
        .catch((error) => {
          console.log(error);
          cht.edit(
            'Error:' + error.response ? error.response.data : error.message,
            _key
          );
        });
    }
  );

  ev.on(
    {
      cmd: ['faceswap-reset', 'faceswap-change'],
      listmenu: ['faceswap-reset', 'faceswap-change'],
      tag: 'ai',
      premium: true,
    },
    async () => {
      let usr = cht.sender.split('@')[0];
      let swps = func.archiveMemories.getItem(cht.sender, 'fswaps');
      let opts = cht.cmd.split('-')[1];
      if (swps.list.length < 1) return cht.reply(infos.ai.noSessionFaceswap);
      if (opts == 'reset') {
        func.archiveMemories.delItem(cht.sender, 'fswaps');
        cht.reply(infos.ai.successResetSessionFaceswap);
      } else {
        if (swps.list.length == 1) return cht.reply(infos.ai.cannotChangeFace);
        swps.list = [swps.list[1]];
        func.archiveMemories.setItem(cht.sender, 'fswaps', swps);
        cht.reply(infos.ai.successChangeFace);
      }
    }
  );

  ev.on(
    {
      cmd: ['babygenerator', 'buatanak'],
      tag: 'ai',
      listmenu: ['babygenerator'],
      premium: true,
    },
    async () => {
      const key = 'babygenerator';
      const time = 60000 * 5;
      const usr = cht.sender.split('@')[0];
      const isdb = func.archiveMemories.getItem(cht.sender, key);

      const list = ['father', 'mother'];
      const gen = ['boy', 'girl'];
      let db = isdb || {
        father: null,
        mother: null,
        gender: 0,
        last: Date.now(),
        messages_id: [],
      };

      if (Date.now() - db.last >= time)
        db = {
          father: null,
          mother: null,
          gender: 0,
          last: Date.now(),
          messages_id: [],
        };

      const _type = list.find(
        (a) =>
          (cht?.q && cht.q.trim().toLowerCase().includes(a)) ||
          (cht?.msg && cht.msg.trim().toLowerCase().includes(a))
      );
      const gender = gen.find(
        (a) =>
          (cht?.q && cht.q.trim().toLowerCase().includes(a)) ||
          (cht?.msg && cht.msg.trim().toLowerCase().includes(a))
      );

      const type = _type || (db.father ? 'mother' : 'father');
      const type2 = type === 'father' ? 'mother' : 'father';

      if (!isdb) save(db);
      db.last = Date.now();

      func.handleSessionExpiry({ usr, cht, session: cht.cmd, time, key });

      const img = is.quoted.image || is.image;
      const media = img
        ? await (is.image
            ? cht.download()
            : is.quoted?.image
              ? cht.quoted.download()
              : false)
        : null;

      let link;
      if (media) {
        try {
          link = await tmpFiles(media);
        } catch (err) {
          let { key: k } = await cht.reply(
            'Gagal mengunggah gambar. Coba lagi.'
          );
          db.messages_id.push(k.id);
          await save(db);
          return;
        }
      }
      if (link || db.father || db.mother) {
        if (!db.father && !db.mother) {
          db[type] = link;
          save(db);
          let { key: k } = await cht.reply(
            `Foto berhasil disimpan dalam sesi sebagai ${type} (${type === 'father' ? 'ayah' : 'ibu'}) ✅!\n\n` +
              `*Info*:\n- Foto berikutnya yang Anda kirimkan adalah sebagai ${type2} (${type2 === 'father' ? 'ayah' : 'ibu'})\n` +
              `- Anda dapat mengganti foto ${type} dengan cara mereply pesan ini dengan gambar ber-caption *${type}*\n\n` +
              `Silakan reply pesan ini dengan foto dan beri caption *mother* atau *father*.` +
              '_Jika tidak memiliki foto lain, bisa reply pesan ini dengan menuliskan *skip*_'
          );

          db.messages_id.push(k.id);
          await save(db);
          return;
        }
        if (link) db[type] = link;
        await save(db);

        if (!db.father || !db.mother) {
          if (
            (cht?.q && cht.q.toLowerCase().includes('skip')) ||
            (cht?.msg && cht.msg.toLowerCase().includes('skip'))
          ) {
            let { key: k } = await cht.reply('Ok');
            db.messages_id.push(k.id);
            if (db.father) {
              db.mother = db.father;
            } else {
              db.father = db.mother;
            }
          } else {
            let { key: k } = await cht.reply(
              'Anda masih belum mengirimkan foto lain!\n\n_Jika tidak punya, bisa reply pesan ini dengan menuliskan *skip*_'
            );
            db.messages_id.push(k.id);
            await save(db);
            return;
          }
        }

        if (db.gender === 0 && db.father && db.mother) {
          db.gender = null;
          let { key: k } = await cht.reply(
            'Apa gender bayi yang Anda inginkan?\n- *girl*\n- *boy*'
          );
          db.messages_id.push(k.id);
          await save(db);
          return;
        }

        if (!db.gender && !gender) {
          db.gender = 'random';
          await cht.reply(
            'Karena gender yang Anda masukkan tidak valid, gender akan diatur menjadi acak.'
          );
        } else if (gender) {
          db.gender = gender;
        }

        await cht.reply(
          `Sedang membuat wajah bayi masa depan Anda...\n\n- Gender: ${gender || db.gender}`
        );

        await func.archiveMemories.delItem(cht.sender, key);

        try {
          await Exp.sendMessage(
            cht.id,
            {
              image: {
                url: `${api.xterm.url}/api/img2img/baby-generator?father=${db.father}&mother=${db.mother}&gender=${gender || db.gender}&key=${api.xterm.key}`,
              },
              caption: `Ini adalah prediksi wajah bayi Anda di masa depan.\n\n_Untuk menggunakan fitur lagi ini silahkan mulai dari awal dengan mengetik .${cht.cmd}_`,
            },
            { quoted: cht }
          );
        } catch (err) {
          return cht.reply(
            'Gagal membuat prediksi bayi. Silakan coba lagi nanti.'
          );
        }
      } else {
        let { key: k } = await cht.reply(
          'Silakan reply pesan ini dengan foto dan beri caption *mother* atau *father*.'
        );
        db.messages_id.push(k.id);
        await save(db);
      }

      async function save(_db) {
        return func.archiveMemories.setItem(usr, key, _db);
      }
    }
  );

  ev.on(
    {
      cmd: ['imageedit', 'edit'],
      listmenu: ['imageedit'],
      tag: 'ai',
      energy: 30,
      args: 'Please input prompt (English recommended)!',
      media: {
        type: ['image'],
      },
    },
    async ({ media }) => {
      try {
        if (is.sticker || is.quoted?.sticker) {
          let url = await tmpFiles(media);
          let cv = await convert({
            url,
            from: 'webp',
            to: 'png',
          });
          media = await func.getBuffer(cv);
        }
        console.log({
          react: JSON.stringify(cht.reaction),
          cht: JSON.stringify(cht),
        });
        Exp.sendMessage(
          id,
          {
            image: await imageEdit(await func.minimizeImage(media), cht.q),
            ai: true,
          },
          { quoted: cht.reaction || cht }
        );
      } catch (e) {
        cht.reply('Failed!: ' + e.message);
      }
    }
  );

  let aifilters = {
    naruto:
      '1552[11850:0.7]|Naruto uzumaki, Anime Naruto, wearing a konoha headband',
    statue: '1552[469:0.9]|stone statue',
    disney3d: '1122[14072:0.85]|cartoon, disney cartoon, 3d, disney 3d cartoon',
    disney3d_ip: '1009[]|Disney 3d ip, disney pixar 3d ip character',
    jadipatung: '1552[469:0.9]|stone statue',
    disneypixar: '8[]|disney pixar, disney cartoon Pixar',
    disney: '1492[5617:0.8]',
    luffy: '1552[1662:0.8]|luffy, luffy one piece, wearing a straw hat ',
    cyberpunk: '1548[]|cyberpunk',
    wangdong: '1552[13077:0.9]',
    cartoon: '916[]',
  };

  ev.on(
    {
      cmd: Object.keys(aifilters),
      listmenu: Object.keys(aifilters),
      tag: 'art',
    },
    async () => {
      cht.q = aifilters[cht.cmd];
      cht.cmd = 'img2img';
      ev.emit(cht.cmd);
    }
  );

  let edits = Object.fromEntries([
    ...['hitamkan', 'irengkan', 'irengin'].map((k) => [
      k,
      'change skin color to black',
    ]),
    ...['putihkan', 'putihin'].map((k) => [k, 'change skin color to white']),
    ...['merahkan', 'merahin'].map((k) => [k, 'change skin color to red']),
    ...['orenkan', 'orenin', 'orany oranyekan'].map((k) => [
      k,
      'change skin color to orange',
    ]),
    ...['kuningkan', 'kuningin'].map((k) => [k, 'change skin color to yellow']),
    ...['hijaukan', 'hijauin'].map((k) => [k, 'change skin color to green']),
    ...['birukan', 'boruin'].map((k) => [k, 'change skin color to blue']),
    ...['ungukan', 'unguin'].map((k) => [k, 'change skin color to purple']),
    ...['gelapkan', 'gelapin'].map((k) => [k, 'change skin color to dark']),
    ...['jadibiru'].map((k) => [k, 'change skin color to blue']),
    ...['ironman'].map((k) => [
      k,
      'edit the image into Iron Man suit, helmet open showing the original face, keep the face highly accurate and similar to the input photo, cinematic lighting, detailed metallic armor, glowing arc reactor on the chest, realistic Marvel movie style',
    ]),
    ...['chibi'].map((k) => [
      k,
      'convert the image into cute chibi anime style, small body proportions, oversized head, large sparkling eyes, colorful soft shading, kawaii expression, pastel color palette, clean line art',
    ]),
    ...['ghibli'].map((k) => [
      k,
      'convert the image into Studio Ghibli style animation, soft hand-drawn colors, warm lighting, dreamy atmosphere, high detail background painting, expressive character design',
    ]),
    ...['tofigur', 'jadifigur'].map((k) => [
      k,
      'illustration of a 1/7 scale figure, highly detailed and realistic style, placed on a computer desk. the figure is mounted on a circular transparent acrylic base (no text or logos). on the computer screen, show the 3D modeling process of the same figure. next to the monitor, place a Tamiya-style toy packaging box with the original artwork printed on it. scene should look natural, clean, and photorealistic.',
    ]),
  ]);

  ev.on(
    {
      cmd: Object.keys(edits),
      listmenu: Object.keys(edits),
      tag: 'ai',
    },
    () => {
      cht.q = edits[cht.cmd];
      ev.emit('edit', { cht });
    }
  );

  ev.on(
    {
      cmd: ['finding'],
      listmenu: ['finding'],
      args: 'Harap sertakan nama orangnya!',
      media: {
        type: ['image'],
        msg: 'Kirim gambar dengan caption: .finding nama_orang',
        save: false,
      },
      tag: 'ai',
    },
    () => {
      cht.q = `create a Pixar-style movie poster inspired by Finding Nemo, underwater ocean background, colorful corals and fishes, cinematic lighting, text on the poster should say "Finding ${cht.q}" in bold Pixar-style font`;
      ev.emit('edit');
    }
  );
}
