const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  console.log('Opened Google successfully');

  // Keep browser open for manual inspection for a short time.
  await page.waitForTimeout(10000);
  await browser.close();
})();
