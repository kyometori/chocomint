const { Client, Collection } = require('discord.js');
const { createMusicManager } = require('@kyometori/djsmusic');
const fs = require('fs');
require('dotenv').config();
const client = new Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES']
});

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

client.once('ready', () => {
  console.log(`${client.user.tag} 已成功上線！`);
  require('./features/presence.js')(client);
  createMusicManager(client, {
    defaultMaxQueueSize: Infinity,
    enableInlineVolume: true
  });
});

client.on('interactionCreate', interaction => {
  if (interaction.isCommand() || interaction.isContextMenu()) commandHandler(interaction);
  if (interaction.isAutocomplete()) autocompleteHandler(interaction);
});

async function commandHandler(interaction) {
  if (!interaction.isCommand() && !interaction.isContextMenu()) return;

  const { commandName } = interaction;
  const command = client.commands.get(commandName);

  if (!command) interaction.reply({
    content: '找不到指令',
    ephemeral: true
  });

  try {
    await command.execute(interaction);
  } catch(err) {
    console.log(err);
  }
}

async function autocompleteHandler(interaction) {
  const { commandName } = interaction;
  const command = client.commands.get(commandName)
  const { name } = interaction.options.getFocused(true);
  client.autocomplete.get(commandName)[name](interaction);
}


client.on('error', console.error);
process.on('uncaughtException', console.error);

client.login(process.env.TOKEN);
