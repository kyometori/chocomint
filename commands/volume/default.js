const { MessageEmbed } = require('discord.js');

module.exports = {
  type: 'SUB_COMMAND',
  name: 'default',
  description: '還原為預設音量',
  async execute(interaction) {
    const res = new MessageEmbed()
  		.setAuthor({ name: `${interaction.client.settings.name} 音量中心`, iconURL: interaction.client.user.displayAvatarURL() })
  		.setColor(0xE4FFF6);

    await interaction.deferReply();

    interaction.client.music.get(interaction.guild.id).setVolume(1);

    res.setDescription(`已將音量還原為預設值（100%）`);
    interaction.editReply({ embeds: [res] });
  }
}
