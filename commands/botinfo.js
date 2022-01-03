const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'CHAT_INPUT',
  name: 'botinfo',
  description: '有關我的資訊',
  async execute(interaction) {
    await interaction.deferReply();

    const { tag } = interaction.client.user;
    const { nickname } = interaction.guild.me;
    const promiseGuildCount = interaction.client.shard
      .fetchClientValues('guilds.cache.size')
      .then(reduceReturnValue);
    const promiseMemberCount = interaction.client.shard
      .broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
      .then(reduceReturnValue);
    const promiseConnectionsCount = interaction.client.shard
      .fetchClientValues('music.connections.size')
      .then(reduceReturnValue);

    const [totalGuildCount, totalMemberCount, totalConnectionsCount] =
      await Promise.all([promiseGuildCount, promiseMemberCount, promiseConnectionsCount]);

    const infoEmbed = new MessageEmbed()
      .setAuthor({ name: '我的資訊', iconURL: interaction.client.user.displayAvatarURL(), url: 'https://discord.com/oauth2/authorize?client_id=887896057621671997&permissions=517580573952&scope=bot%20applications.commands' })
      .setColor(0xE4FFF6)
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
        value: 'v1.3.0',
        inline: true
      }, {
        name: '服務伺服器數量',
        value: `${totalGuildCount}`,
        inline: true
      }, {
        name: '服務總用戶數量',
        value: `${totalMemberCount}`,
        inline: true
      }, {
        name: '語音連接數量',
        value: `${totalConnectionsCount}`,
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
        name: '在此伺服器分支編號',
        value: `${interaction.client.shard.ids[0]}`,
        inline: true
      }, {
        name: '開發團隊',
        value: 'Chocomint Dev Team',
      }, {
        name: '相關連結',
        value: '[邀請我](https://discord.com/oauth2/authorize?client_id=887896057621671997&permissions=517580573952&scope=bot%20applications.commands)・[原始碼](https://github.com/kyometori/chocomint)・[Chocomint Ice](https://github.com/kyometori/chocomint#chocomint-ice)'
      })
      .setThumbnail(interaction.client.user.displayAvatarURL({ format: 'png', size: 300 }))
      .setFooter({ text: `${interaction.user.tag}・使用 /help 來查看所有指令`, iconURL: interaction.user.displayAvatarURL() });

    interaction.editReply({
      embeds: [infoEmbed]
    });
  }
}

function reduceReturnValue(result) {
  return result.reduce((acc, now) => acc + now, 0);
}
