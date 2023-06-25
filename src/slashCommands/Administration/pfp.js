
const { PermissionFlagsBits } = require('discord.js')
const ms = require('ms')
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle, PermissionsBitField, ButtonBuilder, ComponentType, Client, Message, ChannelSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, ModalBuilder, messageLink } = require("discord.js")

module.exports = {
    name: "pfp",
    description: "Configure le PFP du robot.",
    usage: "/help",
    category: "Membres",
    userPerms: [],
    botPerms: [],
    cooldown: 0,
    guildOnly: false,
    maintenance: false,
    run: async (client, interaction, message) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            let mess = `Vous n'avez pas la permission d'utiliser cette commande. Permissions manquantes : \`ManageMessages\``;
            await interaction.reply({
                content: mess,
                ephemeral: true
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(client.config.color)
            .setTitle("PFP")
            .setFooter({ text: client.config.footer, iconURL: client.user.avatarURL() });

        const pfpStatus = client.db.get(`pfp_status_${interaction.guild.id}`);
        if (pfpStatus === true) {
            embed.addFields({ name: "Status du PFP", value: "\`✅\`", inline: true });
        } else {
            embed.addFields({ name: "Status du PFP", value: "\`❌\`", inline: true });
        }

        const channel = client.db.get(`pfp_${interaction.guild.id}`);

        if (channel === null) {
            embed.addFields({
                name: 'Channel',
                value: `Aucun channel`,
                inline: true
            });
        } else {
            embed.addFields({
                name: 'Channel',
                value: `<#${channel}>`,
                inline: true
            });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Support")
                    .setStyle("Link")
                    .setURL(client.config.support)
            );

        const RowPFP = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_help_' + interaction.id)
                    .setPlaceholder('Choisis une option')
                    .setOptions(
                        {
                            label: 'Status',
                            value: 'status_' + interaction.id
                        },
                        {
                            label: 'Channel',
                            value: 'channel_' + interaction.id
                        },
                        {
                            label: 'Reset',
                            value: 'reset_' + interaction.id,
                        }
                    )
            );

        interaction.reply({ embeds: [embed], components: [RowPFP, row] });

        const collector = interaction.channel.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: ms("2m") });

        collector.on("collect", async (i) => {
            if (i.values[0] === `reset_${interaction.id}`) {
                i.update({ content: '\`✅\` Reset Terminé !', embeds: [], components: [] });
                client.db.delete(`pfp_${interaction.guild.id}`);
                client.db.delete(`pfp_status_${interaction.guild.id}`);
            }

            if (i.values[0] === `status_${interaction.id}`) {
                const currentStatus = client.db.get(`pfp_status_${interaction.guild.id}`);
                if (currentStatus === true) {
                    const embed = new EmbedBuilder()
                        .setColor(client.config.color)
                        .setTitle("PFP")
                        .setFooter({ text: client.config.footer, iconURL: client.user.avatarURL() })
                        .addFields({
                            name: "Status",
                            inline: true, 
                            value: '\`❌\`'
                        });
                        const channel = client.db.get(`pfp_${interaction.guild.id}`);

                        if (channel === null) {
                            embed.addFields({
                                name: 'Channel',
                                value: `Aucun channel`,
                                inline: true
                            });
                        } else {
                            embed.addFields({
                                name: 'Channel',
                                value: `<#${channel}>`,
                                inline: true
                            });
                        }

                    i.update({ content: null, embeds: [embed] });
                    client.db.set(`pfp_status_${interaction.guild.id}`, false);
                } else {
                    const embed = new EmbedBuilder()
                        .setColor(client.config.color)
                        .setTitle("PFP")
                        .setFooter({ text: client.config.footer, iconURL: client.user.avatarURL() })
                        .addFields({
                            name: "Status",
                            inline: true,
                            value: '\`✅\`'
                        });
                        const channel = client.db.get(`pfp_${interaction.guild.id}`);

                        if (channel === null) {
                            embed.addFields({
                                name: 'Channel',
                                value: `Aucun channel`,
                                inline: true
                            });
                        } else {
                            embed.addFields({
                                name: 'Channel',
                                value: `<#${channel}>`,
                                inline: true
                            });
                        }
                    i.update({ content: null, embeds: [embed] });
                    client.db.set(`pfp_status_${interaction.guild.id}`, true);
                }
            }

            if (i.values[0] === `channel_${interaction.id}`) {
                const row = new ChannelSelectMenuBuilder()
                    .setCustomId('sown')
                    .setPlaceholder('Merci de choisir le channel')
                    .setChannelTypes(['GuildText']);
                    
                const rowchannel = new ActionRowBuilder()
                    .addComponents(row);

                i.reply({ components: [rowchannel], ephemeral: true }).catch(console.error);
            }
        });

        client.on("interactionCreate", async (interaction) => {
            if (interaction.customId === 'sown') {
                if (interaction.user.id === interaction.member.user.id) {
                    const selectedOptions = interaction.values;
                    client.db.set(`pfp_${interaction.guild.id}`, selectedOptions);
                    interaction.update({ embeds: [], content: `\`✅\` Channel bien défini sur <#${selectedOptions}> !`, components: [] })
                  

                }
            }
        });
    }
};
