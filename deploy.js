/**
 * deploy.js
 * 這個檔案是用來發布新的斜線指令的
 * 每當指令的 metadata 有更新時，就應該執行一次此檔案
 * 注意全域指令有一小時 cooldown
 */
const { Client } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const client = new Client({
  intents: ['GUILDS']
});

const GuildId = process.argv[2];

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
  commands.push(command);
}

client.once('ready', async () => {
  console.log('開始部署');

  try {
    if (!GuildId) {
      await client.application.commands.set(commands);
    } else {
      const guild = client.guilds.cache.get(GuildId);
      if (!guild) return console.log('無此伺服器');
      await guild.commands.set(commands);
    }
  } catch (err) {
    console.log('出現錯誤');
    throw err;
  }

  console.log('完成部署');
  console.log('程式可以結束');
  if (!GuildId) console('你部署的是全域指令，請注意需等待一小時才會顯示於 Discord 上');
  console.log('------------------------------------')
});


client.login(process.env.TOKEN);
