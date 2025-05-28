import { chromium } from 'playwright'

(async () => {
    async function createBrowserInstance() {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            viewport: { width: 1920, height: 1080 },
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
        await page.fill('#textInput', '😂😭');
        
await page.evaluate(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/twemoji.min.js';
    script.onload = () => {
        twemoji.parse(document.body);
    };
    document.head.appendChild(script);
});
       
await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
    `;
    document.head.appendChild(style);
});


await page.waitForTimeout(1000);
        const overlay = await page.locator('#textOverlay');

        console.log(await overlay.screenshot({ 
           type: 'png' 
        }).then(a => a.toString('base64')))

    } finally {
        await browser.close();
    }

})()