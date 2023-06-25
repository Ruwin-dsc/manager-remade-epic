const { CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, SelectMenuBuilder } = require("discord.js");
const config = require("../../config")

module.exports = {
    name: "ping",
    description: "Renvoie le ping du bot !",
    owner: false,

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve("SendMessages"))) return interaction.reply({ content: `**❌ Les autorisations actuelles sur ce serveur ne me permettent pas d'utiliser cette commande**`, ephemeral: true }).catch(() => { });
        await interaction.deferReply();

     try {
        await interaction.followUp({content: `Je cherche le ping du bot, veuillez patienter !`})

        await interaction.editReply({content: `Le ping du bot est de : ${client.ws.ping} ms`})
  } catch (error) {
      console.log('Une erreur est survenue sur la commande ping', error)
  }
   }
 }