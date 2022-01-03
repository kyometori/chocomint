const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'pause',
  description: '想要休息一下嗎？可以用這個指令暫停音樂',
  async execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor({ name: `${interaction.client.settings.name} 通知中心`, iconURL: interaction.client.user.displayAvatarURL() })
      .setColor(0xE4FFF6);

    if (!interaction.client.music.has(interaction.guild.id)) {
      res.setDescription('這伺服器完全沒有在播放音樂，有什麼可以暫停的');
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
      res.setDescription(`${interaction.user}，你可能需要檢查一下你的耳朵`);
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    try {
      manager.pause();
      res.setDescription(`${interaction.user}，已暫停播放`);
      interaction.reply({ embeds: [res] });
    } catch(err) {
      if (err.message === 'ALREADY_PAUSED') {
        res.setDescription(`${interaction.user}，要怎麼暫停已經暫停的東西`);
        return interaction.reply({ embeds: [res], ephemeral: true });
      }
      throw err;
    }
  }
}
