export default async function on({ cht, Exp, ev }) {
  ev.on(
    {
      cmd: ['reloadevents'],
      listmenu: ['reloadevents'],
      isOwner: true,
      tag: 'owner',
    },
    async ({ args }) => {
      await ev.reloadEventHandlers();
      cht.reply('Success✅, All Events have been reloaded!');
    }
  );
}
