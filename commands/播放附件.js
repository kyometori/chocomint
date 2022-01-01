const { MessageEmbed } = require('discord.js')

module.exports = {
  type: 'MESSAGE',
  name: '播放附件',
  async execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor({ name: `${interaction.client.settings.name} 通知中心`, iconURL: interaction.client.user.displayAvatarURL() })
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

    const atts = interaction.targetMessage.attachments;

    if (!atts.size) return interaction.reply({
      content: '這個訊息沒有附件',
      ephemeral: true
    });

    const att = atts.first();

    await interaction.deferReply();

    async function afterPlay([track, queued]) {
      res.setFooter({ text: `由 ${track.player.displayName} 指定的歌曲`, iconURL: track.player.user.displayAvatarURL() });

      if (queued) {
        res.setDescription(`已將 [${track.title}](${track.audioResource}) 加入隊列`);
      } else {
        res.setDescription(`開始播放 [${track.title}](${track.audioResource})`);
      }

      interaction.editReply({
        embeds: [res]
      });
    }

    interaction.client.music
      .get(interaction.guild.id)
      .play(att.url, {
        player: interaction.member,
        title: att.name,
        details: {}
      })
      .then(afterPlay)
      .catch(e => {
        if (e.message === 'UNSUPPORTED_URL_TYPE')
          return interaction.editReply('我們不支援播放此檔案類型');
        throw e;
      })
  }
}
