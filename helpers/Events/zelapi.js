/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, ev, is }) {
  const { zelapi } = global.api;

  ev.on(
    {
      cmd: ['send'],
      listmenu: ['send'],
      tag: 'alightmotion',
      isOwner: true,
      args: Data.infos.alightmotion.send,
    },
    async ({ args }) => {
      let email = args.trim();
      await cht.reply(Data.infos.messages.wait);
      try {
        let res = await fetch(`${zelapi.url}/api/v1/premium/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${zelapi.key}`,
          },
          body: JSON.stringify({ email }),
        });
        let json = await res.json();
        if (json.status) {
          await Exp.func.archiveMemories.setItem(cht.sender, 'lastZelEmail', email);
        }
        cht.reply(`*[ ZELAPI SEND ]*\n\n${JSON.stringify(json, null, 2)}`);
      } catch (e) {
        console.error('Error in zelsend:', e);
        cht.reply('TypeErr: ' + e.message);
      }
    }
  );

  ev.on(
    {
      cmd: ['verif'],
      listmenu: ['verif'],
      tag: 'alightmotion',
      isOwner: true,
      args: Data.infos.alightmotion.verif,
    },
    async ({ args }) => {
      let [email, link] = args.split('|');
      if (!link && args.startsWith('http')) {
        link = args.trim();
        email = cht.memories.lastZelEmail;
      }

      if (!email || !link) return cht.reply(Data.infos.alightmotion.verif);

      await cht.reply(Data.infos.messages.wait);
      try {
        let res = await fetch(`${zelapi.url}/api/v1/premium/verif`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${zelapi.key}`,
          },
          body: JSON.stringify({ email: email.trim(), link: link.trim() }),
        });
        let json = await res.json();
        cht.reply(`*[ ZELAPI VERIF ]*\n\n${JSON.stringify(json, null, 2)}`);
      } catch (e) {
        console.error('Error in zelverif:', e);
        cht.reply('TypeErr: ' + e.message);
      }
    }
  );
}
