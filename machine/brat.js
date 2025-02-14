const { playwright } = await (fol[2]+'playwright.js').r()

export const brat = async(text) => {
  try {
    let res = await playwright(`
const { chromium } = require('playwright');

(async () => {
    async function createBrowserInstance() {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        await context.route('**/*', (route) => {
            const url = route.request().url();
            if (url.endsWith('.png') || url.endsWith('.jpg') || url.includes('google-analytics')) {
                return route.abort();
            }
            route.continue();
        });

        const page = await context.newPage();
        
        await page.goto('https://www.bratgenerator.com/', { waitUntil: 'domcontentloaded', timeout: 10000 });

        try {
            await page.click('#onetrust-accept-btn-handler', { timeout: 2000 });
        } catch {}

        await page.evaluate(() => setupTheme('white'));

        return { browser, page };
    }
    const { browser, page } = await createBrowserInstance();
    try {
        await page.fill('#textInput', \`${text}\`);
        const overlay = await page.locator('#textOverlay');

        console.log(await overlay.screenshot({ 
           type: 'png' 
        }).then(a => a.toString('base64')))

    } finally {
        await browser.close();
    }

})();
`)
  return Buffer.from(res.output,'base64')
  } catch(e) {
    console.error(e)
    throw new Error(e)
  }
}