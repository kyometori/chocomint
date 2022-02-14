module.exports = {
  name: 'help',
  '指令名稱': function(interaction) {
    const value = interaction.options
      .getFocused()
      .split('')
      .join('.*');

    const commandList = interaction.client.commands
      .filter(v => v.type === 'CHAT_INPUT')
      .map(v => ({ name: v.name, value: v.name }))
      .filter(v => {
        const testCase = new RegExp(`^.*${value}.*$`, 'gi');
        return testCase.test(v.name);
      })
      .slice(0, 25);

    interaction.respond(commandList).catch(() => {});
  }
}
