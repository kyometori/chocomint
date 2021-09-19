const { Client, Collection } = require('discord.js');
const { createMusicManager } = require('@kyometori/djsmusic');
const fs = require('fs');
require('dotenv').config();
const client = new Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES']
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`${client.user.tag} 已成功上線！`);
  require('./features/presence.js')(client);
  createMusicManager(client, {
    defaultMaxQueueSize: Infinity,
    enableInlineVolume: true
  });
});

client.on('interactionCreate', async interaction => {
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
});

client.on('error', console.log);
process.on('uncaughtException', console.log);

client.login(process.env.TOKEN);
