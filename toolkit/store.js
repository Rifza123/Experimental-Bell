export const makeInMemoryStore = () => {
  let messages = {};

  const loadMessage = async (jir, id) => {
    return messages[jir]
      ? (messages[jir].array || []).find((a) => a.key.id == id)
      : null;
  };
  const bind = (ev) => {
    ev.on('messages.upsert', ({ messages: Messages }) => {
      const cht = {
        ...Messages[0],
        id: Messages[0].key.remoteJid,
      };
      messages[cht.id] ||= {
        array: [],
      };
      messages[cht.id].array.push(cht);
    });
  };
  return {
    messages,
    bind,
    loadMessage,
  };
};
