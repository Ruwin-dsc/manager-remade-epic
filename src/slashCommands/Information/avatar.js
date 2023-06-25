const { CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, SelectMenuBuilder, ApplicationCommandOptionType } = require("discord.js");
module.exports = {
    name: "pic",
    description: "Récup la pp d'un membre !",
    owner: false,
    options: [
        {
             type: 6,
            name: "user",
            description: "Quelle user ?",
            required: false,
           
        },
    ],
    run: async (client, interaction) => {

        const member = interaction.options.getMember("user") || interaction.member;
            const embed = new EmbedBuilder()
            .setTitle(`Utilisateur`)
            .setDescription(`[**${member.user.tag}**](https://discord.com/users/${member.user.id}) | \`${member.user.id}\``)
            .setColor(client.config.color)
            .setFooter({ text: client.config.footer, iconURL: client.user.avatarURL() })
            .setImage(`${member.displayAvatarURL({ dynamic: true, format: "png", size: 512}) || emoji.pp}`)
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}