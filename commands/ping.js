module.exports = {
  type: 'CHAT_INPUT',
  name: 'ping',
  description: '來看看你點的薄荷巧克力會在多久後抵達......',
  async xecute(interaction) {
    const msg = await interaction.reply({ content: '🔄｜計算中......', fetchReply: true })
    const ping = msg.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply(`ℹ️｜機器人延遲為 ${ping}ms，API 延遲為 ${interaction.client.ws.ping}ms`);
  }
}
