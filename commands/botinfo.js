const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'botinfo',
  description: '有關我的資訊',
  async execute(interaction) {
    await interaction.deferReply();

    const { tag } = interaction.client.user;
    const { nickname } = interaction.guild.me;
    const totalMemberCount = interaction.client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

    const infoEmbed = new MessageEmbed()
      .setAuthor('我的資訊', interaction.client.user.displayAvatarURL(), 'https://discord.com/oauth2/authorize?client_id=887896057621671997&permissions=517580573952&scope=bot%20applications.commands')
      .addFields({
        name: '名字',
        value: tag,
        inline: true
      }, {
        name: '在本伺服器暱稱',
        value: nickname ?? '無',
        inline: true
      }, {
        name: '版本',
        value: 'v1.1.0',
        inline: true
      }, {
        name: '服務伺服器數量',
        value: `${interaction.client.guilds.cache.size}`,
        inline: true
      }, {
        name: '服務總用戶數量',
        value: `${totalMemberCount}`,
        inline: true
      }, {
        name: '語音連接數量',
        value: `${interaction.client.music.connections.size}`,
        inline: true
      }, {
        name: '開始服務時間',
        value: `<t:${~~(interaction.client.user.createdTimestamp/1000)}:R>`,
        inline: true
      }, {
        name: '加入本伺服器時間',
        value: `<t:${~~(interaction.guild.me.joinedTimestamp/1000)}:R>`,
        inline: true
      }, {
        name: '\u200b',
        value: '\u200b',
        inline: true
      }, {
        name: '開發團隊',
        value: 'Chocomint Dev Team',
      }, {
        name: '相關連結',
        value: '[邀請我](https://discord.com/oauth2/authorize?client_id=887896057621671997&permissions=517580573952&scope=bot%20applications.commands)・[原始碼](https://github.com/kyometori/chocomint)・[Chocomint Ice](https://github.com/kyometori/chocomint#chocomint-ice)'
      })
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter(`${interaction.user.tag}・使用 /help 來查看所有指令`, interaction.user.displayAvatarURL());

    interaction.editReply({
      embeds: [infoEmbed]
    });
  }
}
