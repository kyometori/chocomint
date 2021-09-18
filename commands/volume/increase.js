const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'SUB_COMMAND',
  name: 'increase',
  description: '增加音量',
  async execute(interaction) {
    const res = new MessageEmbed()
  		.setAuthor('Chocomint 音量中心', interaction.client.user.displayAvatarURL())
  		.setColor(0xE4FFF6);

    const manager = interaction.client.music.get(interaction.guild.id);
    if (manager.getVolume() > 2) {
      res.setDescription('音量已經到達上限了！');
      return interaction.reply({
        embeds: [res],
        ephemeral: true
      });
    }
    await interaction.deferReply();

    manager.setVolume(manager.getVolume() + 0.1);

    res.setDescription(`已將音量設為 ${~~(manager.getVolume() * 100)}%`)
    interaction.editReply({ embeds: [res] });
  }
}
