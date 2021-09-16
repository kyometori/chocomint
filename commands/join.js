const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'join',
  description: '加入一個語音頻道',
  execute(interaction) {
    const { channel } = interaction;
    const vc = interaction.member.voice.channel;
    const res = new MessageEmbed()
      .setAuthor('Chocomint 通知中心', interaction.client.user.displayAvatarURL())
      .setColor(0xE4FFF6);

    if (!vc) {
      res.setDescription('請先加入一個語音頻道');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    if (interaction.client.music.has(interaction.guild.id)) {
      const manager = interaction.client.music.get(interaction.guild.id);
      if (vc.id === manager.channel.id) {
        res.setDescription('我已經在你的語音頻道中了');
        return interaction.reply({
          embeds: [res],
          ephemeral: true
        });
      }

      res.setDescription('我已經在伺服器的其他語音頻道中了，請先將我退出再重新加入');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    interaction.client.music.join({
      channel: vc
    }).then(manager => {
      manager.on('end', next => {
        if (next) {
          res.setDescription(`開始播放 [${next.title}](${next.details.ytUrl})`)
            .setThumbnail(next.details.thumbnailUrl)
            .setFooter(`由 ${next.player.displayName} 指定的歌曲`, next.player.user.displayAvatarURL());
        } else {
          res.setDescription('隊列中的歌曲已播放完畢')
            .setThumbnail('')
            .setFooter('');
        }
        channel.send({ embeds: [res] });

      });
    });
    res.setDescription(`已成功加入 ${vc.name}`);
    interaction.reply({ embeds: [res] });
  }
}
