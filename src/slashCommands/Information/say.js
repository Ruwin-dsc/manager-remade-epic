const { CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, SelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../config")

module.exports = {
    name: "say",
    description: "Permet de renvoyer un message via le bot !",
    owner: false,
    options: [
        {
            name: "message",
            description: "Quel ai le message a renvoyer ?",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve("SendMessages"))) return interaction.reply({ content: `**❌ Les autorisations actuelles sur ce serveur ne me permettent pas d'utiliser cette commande**`, ephemeral: true }).catch(() => { });
        if(!interaction.member.permissions.has(PermissionsBitField.resolve("Administrator"))) return interaction.reply({content: `❌ Vous n'avez pas la permissions de faire cette commande !`})
        
        try {

            const msg = interaction.options.getString("message");
            interaction.reply({content: 'Le message a été envoyé !', ephemeral: true})
            interaction.channel.send({content: `${msg}`})
        } catch (error) {
            console.log('Une erreur est survenue sur la commande say', error)
        }
    }
}