const fs = "fs".import()
const chalk = "chalk".import()
const Connecting = async ({ update, Exp, Boom, DisconnectReason, sleep, launch }) => {
    const { connection, lastDisconnect, receivedPendingNotifications } = update;
    if (receivedPendingNotifications && !Exp.authState?.creds?.myAppStateKeyId) {
        Exp.ev.flush()
    }
        connection && console.log(chalk.yellow.bold('【 CONNECTION 】') +' -> ', chalk.cyan.bold(connection));
    

    if (connection == 'close') {
        let statusCode = new Boom(lastDisconnect?.error)?.output.statusCode;

        switch (statusCode) {
            case 405:
                console.log(`Maaf, file sesi dinonaktifkan. Silakan melakukan pemindaian ulang🙏`);
                Exp.logout();
                fs.unlinkSync(session + "/creds.json")
                console.log('Menghubungkan kembali dalam 5 detik....');
                setTimeout(() => launch(), 5000);
                break;
            case 418:
                console.log("Koneksi terputus, mencoba menghubungkan kembali🔄");
                setTimeout(() => launch(), 5000);
                break;
            case DisconnectReason.connectionReplaced:
                console.log("Koneksi lain telah menggantikan, silakan tutup koneksi ini terlebih dahulu");
                process.exit();
                break;
            case 502:
            case 503:
                console.log("Terjadi kesalahan, menghubungkan kembali🔄");
                setTimeout(() => launch(), 5000);
                break;
            case 401:
                console.log(`Perangkat keluar, silakan lakukan pemindaian ulang🔄`);
                fs.unlinkSync(session + "/creds.json")
                process.exit();
                break;
            case 515:
                console.log("Koneksi mencapai batas, harap muat ulang🔄");
                setTimeout(() => launch(), 5000);
                break;
            default:
                console.log("Terjadi kesalahan, menghubungkan kembali🔄");
                setTimeout(() => launch(), 5000);
        }
    }

    if (connection === 'open') {
        await sleep(5500);
        console.log('Terhubung✔️');
    }
}

export { Connecting };
