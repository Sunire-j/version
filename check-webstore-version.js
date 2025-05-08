const puppeteer = require('puppeteer');
const fs = require('fs');

const EXTENSION_ID = 'kfmfanlapbdpopjfhoianldpndmadjaf'; // 여기에 확장 프로그램 ID 입력

async function getWebstoreVersion() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const url = `https://chrome.google.com/webstore/detail/${EXTENSION_ID}`;

  await page.goto(url, { waitUntil: 'networkidle0' });

  // page.evaluate()를 사용하여 XPath로 요소를 찾고 텍스트를 추출
  const versionText = await page.evaluate(() => {
    const element = document.evaluate('/html/body/c-wiz/div/div/main/div/section[4]/div[2]/ul/li[1]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent.trim() : null;
  });
  
  console.log(`웹스토어에서 가져온 버전: ${versionText}`);
  await browser.close();
  return versionText;
}

async function main() {
  const webstoreVersion = await getWebstoreVersion();
  const localPath = './version.json';
  const localVersion = JSON.parse(fs.readFileSync(localPath, 'utf8')).version;

  if (webstoreVersion && webstoreVersion !== localVersion) {
    console.log(`🔄 새 버전 감지됨: ${webstoreVersion}`);
    fs.writeFileSync(localPath, JSON.stringify({ version: webstoreVersion }, null, 2));
  } else {
    console.log(`✅ 버전 동일: ${webstoreVersion}`);
  }
}

main();
