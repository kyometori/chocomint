const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'resume',
  description: '當你暫停後想要繼續播放，可以考慮看看這個指令',
  execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor({ name: `${interaction.client.settings.name} 通知中心`, iconURL: interaction.client.user.displayAvatarURL() })
      .setColor(0xE4FFF6);

    if (!interaction.client.music.has(interaction.guild.id)) {
      res.setDescription('等你找到可以繼續播放的音樂再來找我，okay？');
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
      res.setDescription(`${interaction.user}，你要不要想一下你在用什麼指令`);
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    try {
      manager.resume();
      res.setDescription(`${interaction.user}，已繼續播放`);
      interaction.reply({ embeds: [res] });
    } catch(err) {
      if (err.message === 'ALREADY_PLAYING') {
        res.setDescription(`${interaction.user}，歌曲已經在播放了，沒聽到應該是你的問題`);
        return interaction.reply({ embeds: [res], ephemeral: true });
      }
      throw err;
    }
  }
}
