const chokidar = "chokidar".import();
const chalk = "chalk".import()
const path = "path".import()

let onreload = false;

(async () => {
    /*!-======[ Helpers Update detector ]======-!*/
    const watcherHelpers = chokidar.watch(fol[1] + '**/*.js', {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });

    watcherHelpers.on('change', (filePath) => {
        const fileName = path.basename(filePath);
        console.log(chalk.yellow(`File changed: ${fol[1] + fileName}`));

        if (onreload) return;
        onreload = true;
        setTimeout(async () => {
            try {
                    Data.helper = (await `${fol[1]}client.js`.r()).default;
                    Data.In = (await `${fol[1]}interactive.js`.r()).default;
                    Data.utils = (await `${fol[1]}utils.js`.r()).default;
                    Data.reaction = (await `${fol[1]}reaction.js`.r()).default;
                    Data.EventEmitter = (await `${fol[1]}events.js`.r()).default
                    Data.stubTypeMsg = (await `${fol[1]}stubTypeMsg.js`.r()).default
                console.log(chalk.green(`Helper ${fileName} reloaded successfully!`));
            } catch (error) {
                console.error(chalk.red(`Error reloading ${fileName}:`, error));
            }
            onreload = false;
        }, 1000);
    });

    /*!-======[ Events Update Detector ]======-!*/
    const watcherEvents = chokidar.watch(fol[7], {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });

    watcherEvents.on('change', (filePath) => {
        const fileName = path.basename(filePath);
        console.log(chalk.yellow(`File changed: ${fol[7] + fileName}`));

        if (onreload) return;
        onreload = true;
        setTimeout(async () => {
            try {
                await Data?.ev?.reloadEventHandlers();
                console.log(chalk.green('Event handlers reloaded successfully!'));
            } catch (error) {
                console.error(chalk.red('Error reloading event handlers:', error));
            }
            onreload = false;
        }, 2000);
    })
    
    watcherEvents.on('unlink', (filePath) => {
      console.log(`File telah dihapus: ${filePath}`);
        const fileName = path.basename(filePath);
        console.log(chalk.yellow(`File delete ${fol[7] + fileName}`))
        let keyEv = Object.keys(Data.events)
        for(let i of keyEv){
            let { eventFile } = Data.events[i]
            let fileEv = eventFile.includes("?") ? eventFile.split("?")[0] : eventFile
            if(fileName == fileEv) {
              delete Data.events[i]
              console.log(chalk.red(`[ EVENT RELOAD ] => ${i}`))
            }
        }
    });
    
    const watcherLocale = chokidar.watch(fol[9] + locale + '/**/*.js', {
        ignored: /(^|[\/\\])\../,
        persistent: true
    });

    watcherLocale.on('change', async(filePath) => {
        const fileName = path.basename(filePath);
            console.log(chalk.yellow(`File changed: ${fol[9] +locale+ "/" + fileName}`));
            await (fol[9] + locale + "/" + fileName).r()
            return
    })

})();
