const fs = require('fs');
const { MessageEmbed, Collection } = require('discord.js');
searchCommands = new Collection();

const subCommandFiles = fs.readdirSync('./commands/search').filter(file => file.endsWith('.js'));
for (const file of subCommandFiles) {
	const command = require(`./search/${file}`);
  searchCommands.set(command.name, command);
}

module.exports = {
  type: 'CHAT_INPUT',
  name: 'search',
  description: '懶得抓網址的話，就讓我來幫你吧',
  options: [...searchCommands.values()],
  async execute(interaction) {
		const res = new MessageEmbed()
			.setAuthor(`${interaction.client.settings.name} 通知中心`, interaction.client.user.displayAvatarURL())
			.setColor(0xE4FFF6);

		if (!interaction.client.music.has(interaction.guild.id)) {
			res.setDescription('我還不再任何語音頻道中，請先讓我加入一個！');
			return interaction.reply({
				embeds: [res],
				ephemeral: true
			});
		}

		const manager = interaction.client.music.get(interaction.guild.id);

		if (!interaction.member.voice.channel ||
				interaction.member.voice.channel.id !== manager.channel.id) {

			res.setDescription('你必須跟我在同個語音頻道才能使用此指令');
			return interaction.reply({
				embeds: [res],
				ephemeral: true
			});
		}

    const commandName = interaction.options.getSubcommand();

    command = searchCommands.get(commandName);
    if (!command) return interaction.reply({
      content: '找不到指令',
      ephemeral: true
    });

    try {
      await command.execute(interaction);
    } catch(err) {
      interaction.reply({
        content: '出現錯誤',
        ephemeral: true
      });
      console.log(err);
    }
  }
}
