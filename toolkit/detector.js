const chokidar = "chokidar".import()
const chalk = "chalk".import()
const path = "path".import()
const fs = "fs".import()

const conf = fol[3] + 'config.json'
const db = fol[5]
let config = JSON.parse(fs.readFileSync(conf))
let keys = Object.keys(config)

let onreload = false;

export default 
async function detector({ Exp, store }) {
    const reloadData = async (files) => {
        try {
            for (const [key, filePath] of Object.entries(files)) {
                Data[key] = (await filePath.r()).default;
            }
            Data.initialize({ Exp, store })
            console.log(chalk.green(`Helpers reloaded successfully!`))
        } catch (error) {
            console.error(chalk.red('Error reloading helpers:', error))
        }
    }
    
    const setupWatcher = (path, delay, onChangeCallback, onUnlinkCallback) => {
        const watcher = chokidar.watch(path, { ignored: /(^|[\/\\])\../, persistent: true })

        watcher.on('change', async (filePath) => {
            if (onreload) return;
            onreload = true;

            console.log(chalk.yellow(`File changed: ${filePath}`))
            setTimeout(async () => {
                await onChangeCallback(filePath)
                onreload = false;
            }, delay)
        })

        if (onUnlinkCallback) {
            watcher.on('unlink', async (filePath) => {
                console.log(chalk.yellow(`File deleted: ${filePath}`))
                await onUnlinkCallback(filePath)
            })
        }
    };

    /*!-======[ Helpers Update detector ]======-!*/
    setupWatcher(fol[1] + '**/*.js', 1000, async (filePath) => {
        const files = {
            helper: `${fol[1]}client.js`,
            In: `${fol[1]}interactive.js`,
            utils: `${fol[1]}utils.js`,
            reaction: `${fol[1]}reaction.js`,
            EventEmitter: `${fol[1]}events.js`,
            stubTypeMsg: `${fol[1]}stubTypeMsg.js`,
            eventGame: `${fol[1]}eventGame.js`,
            initialize: `${fol[1]}initialize.js`,
        };
        await reloadData(files)
    })

    /*!-======[ Events Update Detector ]======-!*/
    setupWatcher(fol[7], 2000, async () => {
        try {
            await Data?.ev?.reloadEventHandlers()
            console.log(chalk.green('Event handlers reloaded successfully!'))
        } catch (error) {
            console.error(chalk.red('Error reloading event handlers:', error))
        }
    }, async (filePath) => {
        const fileName = path.basename(filePath)
        const eventKeys = Object.keys(Data.events)

        for (const key of eventKeys) {
            const { eventFile } = Data.events[key];
            if (eventFile.includes(fileName)) {
                delete Data.events[key];
                console.log(chalk.red(`[ EVENT DELETED ] => ${key}`))
            }
        }
    })
    
    /*!-======[ Locale Update detector ]======-!*/
    setupWatcher(fol[9] + locale + '/**/*.js', 500, async (filePath) => {
        await filePath.r()
        console.log(chalk.yellow(`Locale file reloaded: ${filePath}`))
    })
    
    /*!-======[ Toolkit Update detector ]======-!*/
    setupWatcher(fol[0] + '**/*.js', 1000, async (filePath) => {
        try {
            Exp.func = new (await `${fol[0]}func.js`.r()).func({ Exp, store })
            console.log(chalk.green('Toolkit reloaded successfully!'))
        } catch (error) {
            console.error(chalk.red('Error reloading toolkit:', error))
        }
    })
    
    /*!-======[ Auto Update ]======-!*/
    setInterval(async() => {
      for(let i of keys){
        config[i] = global[i]
      }
      await fs.writeFileSync(conf, JSON.stringify(config, null, 2))
      await fs.writeFileSync(fol[6] + 'users.json', JSON.stringify(Data.users, null, 2))
      await fs.writeFileSync(db + 'preferences.json', JSON.stringify(Data.preferences, null, 2))
      await fs.writeFileSync(db + 'badwords.json', JSON.stringify(Data.badwords, null, 2))
      await fs.writeFileSync(db + 'links.json', JSON.stringify(Data.links, null, 2))
      await fs.writeFileSync(db + 'audio.json', JSON.stringify(Data.audio, null, 2))
      await fs.writeFileSync(db + 'fquoted.json', JSON.stringify(Data.fquoted, null, 2))
    }, 15000)

}
