const fs = 'fs'.import();
const chalk = 'chalk'.import();
const qrcode = await 'qrcode'.import();

const Connecting = async ({
  update,
  Exp,
  Boom,
  DisconnectReason,
  sleep,
  launch,
}) => {
  let spinner = Data.spinner;
  let i = 0;
  global.spinnerInterval =
    global.spinnerInterval ||
    setInterval(() => {
      process.stdout.write(`\r${spinner[i++]}`);
      if (i === spinner.length) i = 0;
    }, 150);
  const { connection, lastDisconnect, receivedPendingNotifications, qr } =
    update;

  console.log(chalk.gray(`[DEBUG UPDATE] keys: ${Object.keys(update).join(', ')}`));

  if (receivedPendingNotifications && !Exp.authState?.creds?.myAppStateKeyId) {
    console.log('Flushed');
    Exp.ev.flush();
  }
  if (connection) {
    console.log(
      chalk.yellow.bold('【 CONNECTION 】') + ' -> ',
      chalk.cyan.bold(connection)
    );
  }

  if (qr) console.log(await qrcode.toString(qr, { type: 'terminal' }));
  if (connection == 'close') {
    let err = lastDisconnect?.error;
    let statusCode = new Boom(err)?.output?.statusCode;
    console.log(chalk.red.bold(`[DEBUG DISCONNECT] statusCode: ${statusCode}`));
    console.log(chalk.red(`[DEBUG DISCONNECT ERROR]`), err);

    global._disconnectRecord = {
      disconnectedAt: Date.now(),
      statusCode,
      errorMsg: err?.message || 'Connection lost'
    };

    switch (statusCode) {
      case 405:
        console.log(
          `Maaf, file sesi dinonaktifkan. Silakan melakukan pemindaian ulang🙏`
        );
        Exp.logout();
        console.log('Menghubungkan kembali dalam 5 detik....');
        clearInterval(spinnerInterval);
        setTimeout(() => launch(), 5000);
        break;
      case 418:
        console.log('Koneksi terputus, mencoba menghubungkan kembali🔄');
        clearInterval(spinnerInterval);
        setTimeout(() => launch(), 5000);
        break;
      case DisconnectReason.connectionReplaced:
        console.log(
          'Koneksi lain telah menggantikan, silakan tutup koneksi ini terlebih dahulu'
        );
        clearInterval(spinnerInterval);
        process.exit();
        break;
      case 502:
      case 503:
        console.log('Terjadi kesalahan, menghubungkan kembali🔄');
        clearInterval(spinnerInterval);
        setTimeout(() => launch(), 5000);
        break;
      case 401:
        console.log(`Perangkat keluar, silakan lakukan pemindaian ulang🔄`);
        try {
          if (fs.existsSync(session)) {
            fs.rmSync(session, { recursive: true, force: true });
          }
        } catch (e) {}
        clearInterval(spinnerInterval);
        process.exit();
        break;
      case 515:
        console.log('Koneksi mencapai batas, harap muat ulang🔄');
        clearInterval(spinnerInterval);
        setTimeout(() => launch(), 5000);
        break;
      default:
        console.log('Terjadi kesalahan, menghubungkan kembali🔄');
        clearInterval(spinnerInterval);
        setTimeout(() => launch(), 5000);
    }
  }

  if (connection === 'open') {
    await sleep(5500);
    clearInterval(spinnerInterval);
    console.log('Terhubung✔️');

    if (global._disconnectRecord) {
      try {
        const d = global._disconnectRecord;
        const downtimeMs = Date.now() - d.disconnectedAt;
        if (downtimeMs >= 5000) {
          const ownerList = Data?.owner || [];
          const primaryOwner = ownerList[0];
          if (primaryOwner) {
            const ownerJid = primaryOwner.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            const downtimeSec = Math.round(downtimeMs / 1000);
            const durationStr =
              downtimeSec >= 60
                ? `${Math.floor(downtimeSec / 60)} menit ${downtimeSec % 60} detik`
                : `${downtimeSec} detik`;

            const reasonMap = {
              408: 'Connection Lost (408)',
              428: 'Connection Closed (428)',
              440: 'Connection Replaced (440)',
              500: 'Bad Session (500)',
              502: 'Bad Gateway (502)',
              503: 'Unavailable Service (503)',
              515: 'Restart Required (515)',
              401: 'Logged Out (401)',
              405: 'Session Disabled (405)',
              418: 'Disconnected (418)'
            };
            const reasonStr = reasonMap[d.statusCode] || `Error Code: ${d.statusCode || 'Unknown'}`;

            const timeStr = new Date().toLocaleTimeString('id-ID');
            const text = Data.infos?.reconnectAlert
              ? Data.infos.reconnectAlert(durationStr, reasonStr, timeStr)
              : `⚠️ *LAPORAN PEMULIHAN KONEKSI BOT*\n\n• *Status:* 🟢 *Tersambung Kembali*\n• *Waktu Pulih:* ${timeStr} WIB\n• *Penyebab:* ${reasonStr}\n• *Durasi Downtime:* ${durationStr}`;

            await Exp.sendMessage(ownerJid, { text });
          }
        }
      } catch (e) {
      } finally {
        global._disconnectRecord = null;
      }
    }
  }
};

export { Connecting };
