const axios = require('axios');
const cheerio = require('cheerio');

const EXTENSION_ID = 'kfmfanlapbdpopjfhoianldpndmadjaf';  // 자신의 익스텐션 ID로 변경

async function getWebstoreVersion() {
  // 1. HTML을 가져오기
  const url = `https://chrome.google.com/webstore/detail/${EXTENSION_ID}`;
  const response = await axios.get(url);
  const html = response.data;

  // 2. Cheerio로 HTML 파싱
  const $ = cheerio.load(html);

  // 3. 원하는 정보 추출 (예시로 버전 정보를 추출)
  const versionText = $('div.N3EXSc').text().trim();  // 이 부분을 실제 HTML에 맞게 수정

  return versionText;
}

async function main() {
  try {
    const webstoreVersion = await getWebstoreVersion();
    console.log(`웹스토어에서 가져온 버전: ${webstoreVersion}`);
  } catch (error) {
    console.error('버전 가져오기 실패:', error);
  }
}

main();
