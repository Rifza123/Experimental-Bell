const chokidar = "chokidar".import();
const chalk = "chalk".import()
const path = "path".import()

const { EventEmitter } = await "./toolkit/events.js".r();

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
                    Data.helper = (await "./helpers/client.js".r()).default;
                    Data.In = (await "./helpers/interactive.js".r()).default;
                    Data.utils = (await "./helpers/utils.js".r()).default;
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
                await Data.ev.reloadEventHandlers();
                console.log(chalk.green('Event handlers reloaded successfully!'));
            } catch (error) {
                console.error(chalk.red('Error reloading event handlers:', error));
            }
            onreload = false;
        }, 2000);
    });

})();
