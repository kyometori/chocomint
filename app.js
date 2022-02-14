const { Client, Collection } = require('discord.js');
const { createMusicManager } = require('@kyometori/djsmusic');
const fs = require('fs');
require('dotenv').config();
const client = new Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES']
});

process.env.DEVMODE = process.env.DEVMODE === 'true' ? '1' : '';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

client.commands = new Collection();
client.autocomplete = new Collection();
client.settings = require('./settings.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const autocompleteFiles = fs.readdirSync('./autocomplete').filter(file => file.endsWith('.js'));
for (const file of autocompleteFiles) {
	const autocomplete = require(`./autocomplete/${file}`);
  client.autocomplete.set(autocomplete.name, autocomplete);
}

client.once('shardReady', id => {
  if (id === client.shard.count - 1) setTimeout(() => console.log(`${YELLOW}[MANAGER]${RESET} 全數上線完畢`), 0);
});

client.once('ready', () => {
  if (client.shard) console.log(`${GREEN}[SHARD#${client.shard.ids[0]}]${RESET} ${client.user.tag} 已成功上線`);
  else console.log('成功上線')
  require('./features/presence.js')(client);
  createMusicManager(client, {
    defaultMaxQueueSize: Infinity,
    enableInlineVolume: true
  });
});

client.on('interactionCreate', interaction => {
  if (interaction.isApplicationCommand()) return commandHandler(interaction);
  if (interaction.isAutocomplete()) return autocompleteHandler(interaction);
});

function commandHandler(interaction) {
  const { commandName } = interaction;
  const command = client.commands.get(commandName);

  if (!command) interaction.reply({
    content: '找不到指令',
    ephemeral: true
  });

  command.execute(interaction)
    .then(() => {
      console.log(`${GREEN}[SHARD#${client.shard.ids[0]}]${RESET} 執行指令：${command.name}`);
    })
    .catch(onError);
  if (process.env.DEVMODE)
    interaction.channel.send(`⚠️ 目前是開發測試狀態，可能會頻繁的上下線導致各種指令中斷，請斟酌使用，我們盡快完成更新`);
}

function autocompleteHandler(interaction) {
  const { commandName } = interaction;
  const { name } = interaction.options.getFocused(true);
  client.autocomplete.get(commandName)[name](interaction);
}

function onError(err) {
  console.error(`${GREEN}[SHARD#${client.shard.ids[0]}]${RESET} ${RED}出現錯誤：${RESET}`);
  console.error(err);
}

client.on('error', onError);
process.on('uncaughtException', onError);

client.login(process.env.TOKEN);
