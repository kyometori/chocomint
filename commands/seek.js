const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'seek',
  description: '想跳到某個段落嗎，這或許有幫助',
  options: [{
    type: 'INTEGER',
    name: '分',
    description: '分鐘數'
  }, {
    type: 'INTEGER',
    name: '秒',
    description: '秒數'
  }],
  async execute(interaction) {
    const res = new MessageEmbed()
      .setAuthor(`${interaction.client.settings.name} 通知中心`, interaction.client.user.displayAvatarURL())
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

    const minute = interaction.options.getInteger('分') ?? 0;
    const second = interaction.options.getInteger('秒') ?? 0;

    if (second > 60 || second < 0 || minute < 0) {
      res.setDescription('動點腦，輸入一個有效的數字，好嗎？');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    try {
      manager.seek((minute*60+second)*1000);
      res.setDescription(`已跳至 ${minute > 0 ? `${minute} 分 ` : ''}${second} 秒`);
      return interaction.editReply({
        embeds: [res]
      });
    } catch(err) {
      if (err.message === 'INVALID_SEEK_TIME') {
        res.setDescription('你跳得有點太後面了，已經超出這首歌的範圍，考不考慮往前一點');
        return interaction.editReply({ embeds: [res] });
      }
      throw err;
    }
  }
}
