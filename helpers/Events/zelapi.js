/*!-======[ Default Export Function ]======-!*/
export default async function on({ cht, Exp, ev, is }) {
  const { zelapi } = api;

  ev.on(
    {
      cmd: ['zelsend'],
      listmenu: ['zelsend'],
      tag: 'owner',
      isOwner: true,
      args: Data.infos.owner.zelsend,
    },
    async ({ args }) => {
      await cht.reply(Data.infos.messages.wait);
      try {
        let res = await fetch(`${zelapi.url}/api/v1/premium/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${zelapi.key}`,
          },
          body: JSON.stringify({ email: args.trim() }),
        });
        let json = await res.json();
        cht.reply(`*[ ZELAPI SEND ]*\n\n${JSON.stringify(json, null, 2)}`);
      } catch (e) {
        console.error('Error in zelsend:', e);
        cht.reply('TypeErr: ' + e.message);
      }
    }
  );

  ev.on(
    {
      cmd: ['zelverif'],
      listmenu: ['zelverif'],
      tag: 'owner',
      isOwner: true,
      args: Data.infos.owner.zelverif,
    },
    async ({ args }) => {
      let [email, link] = args.split('|');
      if (!email || !link) return cht.reply(Data.infos.owner.zelverif);
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
