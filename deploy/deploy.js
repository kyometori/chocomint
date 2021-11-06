/**
 * deploy.js
 * 使用純 node.js （無套件依賴）
 * 這個檔案是用來發布斜線指令的
 * 每當指令內容有更新時，就應該執行一次這個檔案
 * 注意全域指令有一小時 cooldown
 */

/***** 部署部分 *****/
// Native https and fs module
const https = require('https');
const fs = require('fs')

// 因為 token 在 .env 裡面，所以還是要用到 dotenv 套件
// 真的要無套件依賴的話，請將下方兩行改成下面這行：
// const TOKEN = 'your-token'
require('dotenv').config();
const  { TOKEN } = process.env;

const command_type_resolve = {
  "CHAT_INPUT": 1,
  "USER": 2,
  "MESSAGE": 3
}

const option_type_resolve = {
  "SUB_COMMAND": 1,
  "SUB_COMMAND_GROUP": 2,
  "STRING": 3,
  "INTEGER": 4,
  "BOOLEAN": 5,
  "USER": 6,
  "CHANNEL": 7,
  "ROLE": 8,
  "MENTIONABLE": 9,
  "NUMBER": 10
}

const GuildId = process.argv[2];
const commands = [];

// fs 的目錄是從根目錄來算的，所以是讀 ./commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// 遍歷指令
for (const file of commandFiles) {
  // 抓取檔案
  const command = require(`../commands/${file}`);
  // 基本資料
  const data = {
    type: command_type_resolve[command.type],
    name: command.name,
    description: command.description
  }

  /***** 如果指令有選項的話 *****/
  if (command.options) {
    // 宣告裝填選項的空陣列
    data.options = [];
    // 製作選項
    makeOptions(data.options, command.options);
  }
  /**/

  // 將資料放入要 request 的陣列中
  commands.push(data);
}

const data = JSON.stringify(commands);

deploy(TOKEN, data, GuildId);
/**/

/***** 函式 *****/
// deploy function
async function deploy(token, commandData, guild) {
  // 解出應用程式 id
  const { id } = await getDataByToken(token)
    .catch(err => {
      console.error(err);
      throw err;
    });

  // Endpoint 的路徑
  const path = guild
    ? `/api/v9/applications/${id}/guilds/${guild}/commands`
    : `/api/v9/applications/${id}/commands`;

  const req = https.request({
    protocol: 'https:',
    hostname: 'discord.com',
    path: path,
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(commandData),
      Authorization: `Bot ${token}`
    }
  }, response => {

    let r = '';

    // 獲取資料
    response.on('data', (chunk) => {
        r += chunk;
    });

    // 完成時
    response.once('end', () => {
      // 清除失敗
      if (response.statusCode !== 200) {
        console.error(JSON.parse(r));
        throw new Error('指令部署失敗');
      }
      // 成功清除指令
      console.log('成功部署指令')
      if (!guild) console.log('你部署的為全域指令，需等待一小時後才會作用至所有伺服器');
      else console.log('伺服器 ID：' + guild);
    });
  });

  req.write(commandData);
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

// 解析 option 的函式
function resolveOptions(option) {
  const data = {
    type: option_type_resolve[option.type],
    name: option.name,
    description: option.description,
    // 以下可能缺項，但 JSON.stringify 會幫我們拿掉
    required: option.required,
    choices: option.choices,
    channel_types: option.channelTypes,
    min_value: option.minValue,
    max_value: option.maxValue,
    autocomplete: option.autocomplete
  }

  return data;
}

// 製作 option 的函式
function makeOptions(container, options) {
  // 遍歷選項
  for (const option of options) {
    // 解出選項
    const option_data = resolveOptions(option);

    // 如果選項還有選項
    if (option.options?.length) {
      // 選項的選項的容器
      option_data.options = [];
      // 透過遞迴把選項加入
      makeOptions(option_data.options, option.options);
    }

    // 將選項放入容器
    container.push(option_data);
  }
}
/**/
