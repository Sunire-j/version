const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const EXTENSION_ID = 'kfmfanlapbdpopjfhoianldpndmadjaf'; // 여기에 자신의 확장 프로그램 ID를 입력하세요.

async function getWebstoreVersion() {
  const url = `https://chrome.google.com/webstore/detail/${EXTENSION_ID}`;
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  
  // 버전 정보가 있는 div.N3EXSc 클래스 내의 텍스트를 추출
  const versionText = $('div.N3EXSc').text().trim();
  
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
