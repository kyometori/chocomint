const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'shuffle',
  description: '覺得都同一個人點一長串不公平嗎，你可以試著洗牌',
  async execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor('Chocomint 通知中心', interaction.client.user.displayAvatarURL())
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

    if (!manager.queue.length) {
      res.setDescription('隊列目前沒有東西');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    manager.queue = manager.queue.sort((a, b) => Math.random() - 0.5);

    res.setDescription('已成功將隊列順序打亂');

    interaction.editReply({
      embeds: [res]
    });

  }
}
