/**
 * clear.js
 * 使用純 node.js （無套件依賴）
 * 這個檔案是用來清除指令資料（取消發佈指令）的
 * 每當需要刪除全部指令時，請執行此檔案
 * 注意全域指令有一小時 cooldown
 */

/***** 清除部分 *****/
// Native https module
const https = require('https');

// 因為 token 在 .env 裡面，所以還是要用到 dotenv 套件
// 真的要無套件依賴的話，請將下方兩行改成下面這行：
// const TOKEN = 'your-token'
require('dotenv').config();
const  { TOKEN } = process.env;

const GuildId = process.argv[2];

clear(TOKEN, GuildId);
/**/

/***** 函式 *****/
// deploy function
async function clear(token, guild) {
  // Constants
  const { id } = await getDataByToken(token);
  const data = JSON.stringify([]);
  const path = guild
    ? `/api/v9/applications/${id}/guilds/${guild}/commands`
    : `/api/v9/applications/${id}/commands`;

  // request discord api
  const req = https.request({
    protocol: 'https:',
    hostname: 'discord.com',
    path: path,
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
      Authorization: `Bot ${token}`
    }
  }, response => {
    // response data string
    let r = '';
    // 收到資料就加上去
    response.on('data', (chunk) => {
        r += chunk;
    });
    // 全部收到之後
    response.once('end', () => {
      // 清除失敗
      if (response.statusCode !== 200) {
        console.error(JSON.parse(r));
        throw new Error('指令清除失敗');
      }
      // 成功清除指令
      console.log('成功清除指令')
      if (!guild) console.log('你清除的為全域指令，需等待一小時後才會作用至所有伺服器');
      else console.log('伺服器 ID：' + guild);
    });
  });

  // request body
  req.write(data);
  // 完成 request
  req.end();
}

// get data function
function getDataByToken(token) {
  // 透過神奇的 Promise 讓我們可以 return callback 中的 listener 中的東西
  return new Promise((resolve, reject) => {
    // request discord api
    https.get('https://discord.com/api/v9/users/@me', {
      headers: {
        Authorization: `Bot ${token}`
      }
    }, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.once('end', () => {
        // 失敗就 reject
        if (res.statusCode !== 200) return reject(JSON.parse(data));
        // 返回資料
        resolve(JSON.parse(data))
      });
    });
  });
}
/**/
