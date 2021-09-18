const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'loop',
  description: '想重複聽某首歌嗎？這東西能滿足你的需求',
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

    if (!manager.isPlaying) {
      res.setDescription('沒有東西在播放');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    manager.setLoop(!manager.nowPlaying.isLooping);

    if (manager.nowPlaying.isLooping) {
      res.setDescription('已開始重複播放');
      return interaction.editReply({ embeds: [res] });
    }

    res.setDescription('已停止重複播放');
    interaction.editReply({ embeds: [res] });
  }
}
