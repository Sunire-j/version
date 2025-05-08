const puppeteer = require('puppeteer');
const fs = require('fs');

const EXTENSION_ID = 'kfmfanlapbdpopjfhoianldpndmadjaf';

async function getWebstoreVersion() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = `https://chrome.google.com/webstore/detail/${EXTENSION_ID}`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const versionText = await page.evaluate(() => {
    const versionElement = document.querySelector('div.N3EXSc');
    return versionElement ? versionElement.textContent.trim() : null;
  });

  await browser.close();
  return versionText;
}

async function main() {
  const webstoreVersion = await getWebstoreVersion();
  const localPath = './version.json';
  const localVersion = JSON.parse(fs.readFileSync(localPath, 'utf8')).version;

  if (webstoreVersion !== localVersion) {
    console.log(`🔄 새 버전 감지됨: ${webstoreVersion}`);
    fs.writeFileSync(localPath, JSON.stringify({ version: webstoreVersion }, null, 2));
  } else {
    console.log(`✅ 버전 동일: ${webstoreVersion}`);
  }
}

main();
