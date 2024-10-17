const chalk = "chalk".import()
const Connecting = async ({ update, Exp, Boom, DisconnectReason, sleep, launch }) => {
    const { connection, lastDisconnect } = update;
  
        console.log(chalk.yellow.bold('【 CONNECTION 】') +' -> ', chalk.cyan.bold(connection));
    

    if (connection == 'close') {
        let statusCode = new Boom(lastDisconnect?.error)?.output.statusCode;

        switch (statusCode) {
            case DisconnectReason.badSession:
                console.log(`Maaf, file sesi dinonaktifkan. Silakan melakukan pemindaian ulang🙏`);
                Exp.logout();
                console.log('Menghubungkan kembali dalam 5 detik....');
                setTimeout(() => launch(), 5000);
                break;
            case DisconnectReason.connectionClosed:
                console.log("Koneksi terputus, mencoba menghubungkan kembali🔄");
                setTimeout(() => launch(), 5000);
                break;
            case DisconnectReason.connectionReplaced:
                console.log("Koneksi lain telah menggantikan, silakan tutup koneksi ini terlebih dahulu");
                process.exit();
                break;
            case DisconnectReason.restartRequired:
            case DisconnectReason.connectionLost:
                console.log("Terjadi kesalahan, menghubungkan kembali🔄");
                setTimeout(() => launch(), 5000);
                break;
            case DisconnectReason.loggedOut:
                console.log(`Perangkat keluar, silakan lakukan pemindaian ulang🔄`);
                process.exit();
                break;
            case DisconnectReason.timedOut:
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
