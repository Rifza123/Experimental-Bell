let infos = (Data.infos.reaction ??= {});

/* ---
   PENTING!
   Jangan ubah teks dalam tanda kurung <> karena merupakan format kunci.
--- */

infos.play =
  'To play YouTube using a reaction, please react to the message containing the text.';
infos.download =
  'Currently, we are unable to download the URL <url>\nSupported list:\n- <listurl>';
infos.translate =
  'Please react with <emoji> to the text message to translate it to Indonesian.';
infos.delete =
  'Delete message using a special react is only for admins if the target is not a message I sent.';

infos.menu = ` *[ LIST REACTION CMD ]*

- *Create Sticker*
    |🖨️||🖼️||🤳|
> _Convert the media reacted to into a sticker or vice versa._

- *Delete Message*
    |❌||🗑|
> _Delete the message that has been reacted to._

- *Kick user*
    |🦵||🦶|
> _Kicks the user who reacts._

- *YouTube Play Audio*
    |🎵||🎶||🎧||▶️|
> _ .play YouTube audio with the title from the message._

- *Media Downloader*
    |⬇️||📥|
> _Download media based on the URL in the message._

- *Web Screenshot*
    |📸||📷|
> _Take a screenshot of the URL in the message._

- *AI*
    |🔍||🔎|
> _Ask the AI by reacting to the message._

- *Listen to Message*
    |🔈||🔉||🔊||🎙️||🎤|
> _AI will read aloud the text message reacted to._

- *Translate Message*
    |🆔||🌐|
> _Translate the message reacted to into Indonesian._

- *Media Uploader*
    |🔗||📎||🏷️|
> _Upload media to CDN and convert it into a link._

- *Skin color changer*
    |🟥||🟧||🟨||🟩||🟦||🟪||⬛||⬜||🟫|
> _Change the skin color of people in images._

*Guide:*
_*React to the target message with one of the emojis above*_
`;
