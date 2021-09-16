module.exports = {
  type: 'CHAT_INPUT',
  name: 'invite',
  description: '取得邀請連結',
  execute(interaction) {
    interaction.reply('你可以使用[此連結](https://discord.com/oauth2/authorize?client_id=887896057621671997&permissions=517580573952&scope=bot%20applications.commands)來邀請我加入你的伺服器！');
  }
}
