const { Client } = require('discord.js');
require('dotenv').config();
const client = new Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES']
});

client.once('ready', () => {
  console.log(`${client.user.tag} 已成功上線！`);
  require('./features/presence.js')(client);
});

client.login(process.env.TOKEN);
