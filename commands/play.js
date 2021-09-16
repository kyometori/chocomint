const { MessageEmbed } = require('discord.js');
const { YoutubeUtils } = require('@kyometori/djsmusic');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'play',
  description: '播放音樂，支援各類檔案網址、Youtube、直接搜尋',
  options: [{
    type: 'STRING',
    name: '內容',
    description: '網址或搜尋字串',
    required: true
  }],
  execute(interaction) {
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

      interaction.deferReply();

      function afterPlay([track, queued]) {
        res.setThumbnail(track.details.thumbnailUrl)
          .setFooter(`由 ${track.player.displayName} 指定的歌曲`, track.player.user.displayAvatarURL());

        if (queued) {
          res.setDescription(`已將 [${track.title}](${track.details.ytUrl}) 加入隊列`);
        } else {
          res.setDescription(`開始播放 [${track.title}](${track.details.ytUrl})`);
        }

        interaction.editReply({
          embeds: [res]
        });
      }

      const query = interaction.options.getString('內容');
      manager.play(query, { player: interaction.member })
        .then(afterPlay)
        .catch(e => {
          if (e.message === 'UNSUPPORTED_URL_TYPE') {
            YoutubeUtils.searchFirstVideo(query)
              .then(data => data.play(manager, {player: interaction.member }).then(afterPlay))
              .catch(e => {
                interaction.reply('找不到任何東西');
              });

            return
          }
          throw e;
        });
  }
}
