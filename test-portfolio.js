const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  try {
    await page.goto('http://localhost:5173/portfolio.html', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Page loaded successfully');
    
    // Check if container exists
    const container = await page.$('.editorial-gallery-wrapper');
    console.log('Container exists:', !!container);
    
    if (container) {
        const bgText = await page.evaluate(() => document.querySelector('.editorial-gallery-bg-text').innerText);
        console.log('BG Text:', bgText);
    }
  } catch (e) {
    console.error('Navigation error:', e.message);
  }
  
  await browser.close();
})();
