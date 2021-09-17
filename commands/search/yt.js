const { YoutubeUtils } = require('@kyometori/djsmusic');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');

module.exports = {
  type: 'SUB_COMMAND',
  name: 'yt',
  description: '搜尋 Youtube 上面的東西',
  options: [{
    type: 'STRING',
    name: '搜尋字串',
    description: '搜尋字串',
    required: true
  }],
  async execute(interaction) {
    interaction.deferReply();
    const query = interaction.options.getString('搜尋字串');

    const results = await YoutubeUtils.search(query, 15);

    const res = new MessageEmbed()
      .setAuthor('Chocomint 搜尋中心', interaction.client.user.displayAvatarURL())
      .setDescription(`${interaction.user}，以下為搜尋結果\n請使用選單選擇你要播放的音樂，或按按鈕離開\n\n` +
                      results.map((r, i) => `\`${i+1}. \` ${r.title}`).join('\n\n'))
      .setColor(0xE4FFF6);

    const select = new MessageSelectMenu({
      customId: 'MusicSearchSelectMenu',
      placeholder: '請選擇',
      options: results.map((r, i) => ({ label: `${i+1}`, description: r.title, value: `${i}` })),
    });

    const exitButton = new MessageButton({
      customId: 'MusicSearchExitButton',
      label: '取消',
      emoji: '❌',
      style: 'DANGER'
    })

    const selectRow = new MessageActionRow({
      components: [select]
    });

    const buttonRow = new MessageActionRow({
      components: [exitButton]
    })

    const message = await interaction.editReply({ embeds: [res], components: [selectRow, buttonRow] });

    async function filter(i) {
      if (!i.customId.startsWith('MusicSearch')) return false;

      await i.deferUpdate();

      if (i.user.id !== interaction.user.id) {
        i.followUp({
          content: i.isButton() ? '請不要亂按別人的按鈕' : '請不要亂幫別人做選擇',
          ephemeral: true
        });
        return false;
      }

      return true
    }

    function afterPlay([track, queued]) {
      res.setThumbnail(track.details.thumbnailUrl)
        .setAuthor('Chocomint 通知中心', interaction.client.user.displayAvatarURL())
        .setFooter(`由 ${track.player.displayName} 指定的歌曲`, track.player.user.displayAvatarURL());

      if (queued) {
        res.setDescription(`已將 [${track.title}](${track.details.ytUrl}) 加入隊列`);
      } else {
        res.setDescription(`開始播放 [${track.title}](${track.details.ytUrl})`);
      }

      interaction.channel.send({
        embeds: [res]
      });
    }

    message.awaitMessageComponent({ filter: filter, time: 30e3, error: ['time'] })
      .then(i => {
        if (i.isButton()) {
          i.followUp({
            content: '已結束搜尋',
            ephemeral: true
          });
          return message.delete();
        }
        const selectIndex = i.values[0];
        const data = results[selectIndex];
        data.play(interaction.client.music.get(interaction.guild.id), { player: interaction.member })
          .then(afterPlay);
        message.delete();
      })
      .catch(() => {
        message.delete();
        interaction.followUp({
          content: '搜尋因閒置過久而結束',
          ephemeral: true
        })
      });
  }
}
