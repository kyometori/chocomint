const { MessageEmbed } = require('discord.js');
const { YoutubeUtils } = require('@kyometori/djsmusic');

module.exports = {
  type: 'MESSAGE',
  name: '播放',
  async execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor(`${interaction.client.settings.name} 通知中心`, interaction.client.user.displayAvatarURL())
      .setColor(0xE4FFF6);

    if (!interaction.client.music.has(interaction.guild.id)) {
      res.setDescription('我還不在任何語音頻道中，請先讓我加入一個！');
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

    async function afterPlay([track, queued]) {
      if (track.details.from === 'Youtube')
        await track.details.data.fetch();
      res.setFooter(`由 ${track.player.displayName} 指定的歌曲`, track.player.user.displayAvatarURL());

      if (queued) {
        if (track.details.from === 'Youtube') {
          res.setThumbnail(track.details.data.thumbnailUrl)
            .setDescription(`已將 [${track.title}](${track.details.data.url}) 加入隊列`);
        } else {
          res.setDescription(`已將 ${track.audioResource} 加入隊列`);
        }
      } else {
        if (track.details.from === 'Youtube') {
          res.setThumbnail(track.details.data.thumbnailUrl)
            .setDescription(`開始播放 [${track.title}](${track.details.data.url})`);
        } else {
          res.setDescription(`開始播放 ${track.audioResource}`);
        }
      }

      interaction.editReply({
        embeds: [res]
      });
    }

    const query = interaction.options.getMessage('message').content;
    if (!query) return interaciton.reply({
      content: '這則訊息沒有內容',
      ephemeral: true
    })

    await interaction.deferReply();

    manager.play(query, { player: interaction.member, details: {} })
      .then(afterPlay)
      .catch(e => {
        if (e.message === 'UNSUPPORTED_URL_TYPE') {
          YoutubeUtils.searchFirstVideo(query)
            .then(data => data.play(manager, {player: interaction.member }).then(afterPlay))
            .catch(e => {
              interaction.editReply('找不到任何東西');
            });

          return
        }
        else if (e.message === 'UNPLAYABLE_YOUTUBE_URL' || e.message === 'INVALID_YOUTUBE_URL') {
          return interaction.editReply('我無法播放這首歌')
        }
        throw e;
      });

  }
}
