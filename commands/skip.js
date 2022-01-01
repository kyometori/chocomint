const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'skip',
  description: '已經厭倦了嗎......那就直接跳過吧',
  execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor({ name: `${interaction.client.settings.name} 通知中心`, iconURL: interaction.client.user.displayAvatarURL() })
      .setColor(0xE4FFF6);

    if (!interaction.client.music.has(interaction.guild.id)) {
      res.setDescription('你用指令前有在動腦的嗎');
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

    try {
      manager.skip();
      res.setDescription(`${interaction.user}，已跳過這首歌`);
      interaction.reply({ embeds: [res] });
    } catch(err) {
      if (err.message === 'NO_RESOURCES_PLAYING') {
        res.setDescription(`${interaction.user}，你覺得有東西能跳過嗎`);
        return interaction.reply({ embeds: [res], ephemeral: true });
      }
      throw err;
    }
  }
}
