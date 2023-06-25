const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'prevname',
  description: 'Affiche vos anciens pseudo',
  usage: '/prevname',
  category: 'Owners',
  userPerms: [],
  botPerms: [],
  cooldown: 0,
  guildOnly: false,
  maintenance: false,
  options: [
    {
      type: 3,
      name: "user",
      description: "ID de l'utilisateur",
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const userid = interaction.options.getString('user') || interaction.user.id;
    try {
      const response = await axios.get(`http://${client.config.panel}/prevnames/${userid}`);
      const pseudonyms = response.data.pseudonyms;
      const pseudonymCount = pseudonyms.length;

      if (pseudonymCount === 0) {
        interaction.reply('Aucun pseudo trouvé.');
      } else {
        const embed = new EmbedBuilder()
          .setColor(client.config.color)
          .setTitle(`Prevnames`)
          .setDescription(pseudonyms.map((entry, index) => `**${index + 1})** <t:${Math.floor(entry.timestamp)}:R> - [\`${entry.old_name}\`](https://discord.com/users/${userid})`).join('\n'))
          .setFooter({ text: `Totals des Prevnames dans L'API : ${pseudonymCount}`, iconURL: interaction.user.avatarURL() })

        interaction.reply({ embeds: [embed],  ephemeral: false });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération :', error);
      interaction.reply('Une erreur s\'est produite.');
    }
  }
}
