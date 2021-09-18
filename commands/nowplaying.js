const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'nowplaying',
  description: '現在在放什麼東西？真是個好問題',
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

    if (!manager.isPlaying) {
      res.setDescription('現在沒有在播放東西！');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const np = manager.nowPlaying;

    let des = '';

    if (np.details.from === 'Youtube') {
      des = `正在播放：[${np.title}](${np.details.data.url})\n\n` +
            `播放時間：${timeResolve(~~(np.playedMs/1000))} / ${timeResolve(+np.details.data.lengthSeconds)}\n\n` +
            `上傳頻道：[${np.details.data.channel.name} ${np.details.data.channel.verified ? '☑️' : ''}](${np.details.data.channel.url}) \n\n` +
            `上傳日期：${np.details.data.uploadDate}\n\n` +
            `觀看次數：${np.details.data.viewCount.replace(/(.)(?=(\d{3})+$)/g,'$1,')}\n\u200b`;
      res.setThumbnail(np.details.data.thumbnailUrl);
    }
    else {
      des = `正在播放：[${np.title === 'unknown' ? np.audioResource : np.title}](${np.audioResource})\n\n` +
            `播放時間：${timeResolve(~~(np.playedMs/1000))}`;
    }

    res.setDescription(des)
      .setFooter(`由 ${np.player.user.tag} 指定的樂曲`, np.player.user.displayAvatarURL());


    interaction.editReply({ embeds: [res] });
  }
}

function timeResolve(second) {
  if (second < 60) return `0:${toTwoDigits(second)}`;
  else return `${~~(second/60)}:${toTwoDigits(second%60)}`;
}

function toTwoDigits(num) {
  return num < 10 ? `0${num}` : `${num}`;
}
