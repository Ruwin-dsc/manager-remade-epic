const { CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, SelectMenuBuilder, StringSelectMenuBuilder,ModalBuilder,TextInputBuilder ,TextInputStyle, RoleSelectMenuBuilder} = require("discord.js");
const config = require("../../config")
module.exports = {
    name: "soutien",
    description: "soutien ma blle",
    owner: false,

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.resolve("SendMessages"))) return interaction.reply({ content: `**❌ Les autorisations actuelles sur ce serveur ne me permettent pas d'utiliser cette commande**`, ephemeral: true }).catch(() => { });
    
        await interaction.deferReply({})
    async function updateEmbed() {
    
        const channelpfp = client.db.get(`${client.user.id}_${interaction.guild.id}.rolesoutien`);
        const ez = channelpfp ? `<@&${channelpfp}>` : "Aucun Role";
    
        const ddd = client.db.get(`${client.user.id}_${interaction.guild.id}.soutientext`) 
        const text = ddd ? `${ddd}` : "Aucun";
        let stat = client.db.get(`${client.user.id}_${interaction.guild.id}.actifsoutien`) === true;
        if (!stat) {
            stat = "non";
        } else {
          stat = "oui";
        }
    let e = new EmbedBuilder()
    e.setAuthor({ name: "Soutien", iconURL: client.user.displayAvatarURL({})})
    e.setFields({ name: `Role`, value: `${ez}`, inline: true}, {name: "Status", value: `${text}`, inline: true},{name: "Actif", value: `${stat}`, inline: true} )
    let menuoptions = new StringSelectMenuBuilder()
    .setCustomId('MenuSelection')
    .setPlaceholder("Choisis une option")
    .addOptions([
        {
            label: "Modifier le role",
            value: `editrole`,
            emoji : "<:7Wuq9GJy4Y:1112798018534658048>"
        },
        {
            label: "Modifier le texte",
            value: `edittext`,
            emoji : "<:7Wuq9GJy4Y:1112798018534658048>"
        },
        {
            label: "Supprimer",
            value: `del`,
            emoji : "<:HKRFvtnem9:1112797998829817927>"
        },
        {
            label: "Modifier l'état",
            value: `on`,
            emoji: "<:discotoolsxyzicon59:1112739974270435349>"
    
        },
     
       
    ])
    const row =  new ActionRowBuilder().addComponents([menuoptions])
    interaction.editReply({ embeds: [e], components: [row] }) 
    }
    updateEmbed()
    
    const collector = interaction.channel.createMessageComponentCollector({})
    
    collector.on("collect", async (i)=> {
    switch(i.customId) {
        case "role":

            
            client.db.set(`${client.user.id}_${i.guild.id}.rolesoutien`, await i.values[0])
        updateEmbed()
        break;
        case 'cancel':

            i.editReply({ components: [new ActionRowBuilder().addComponents([menuoptions])]})
        break;
    } 
    switch(i.values[0]) {
        case 'edittext':
            const dddd = new ModalBuilder()
            .setCustomId('modal-soutien')
            .setTitle('Soutien');
          const favoriteColorInput = new TextInputBuilder()
            .setCustomId('textsoutien')
            .setMaxLength(128)
            .setMinLength(1)
            .setPlaceholder('discord.gg/automod')
            .setRequired(true)
            .setLabel("Quel est le status du soutien ?")
            .setStyle(TextInputStyle.Short);
          const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
          dddd.addComponents(firstActionRow);
          await i.showModal(dddd);
    
          client.on('interactionCreate', async (interaction)=> {
            if(interaction.customId === "modal-soutien") {
      const name = await interaction.fields.fields.get('textsoutien').value;
    
      client.db.set(`${client.user.id}_${interaction.guild.id}.soutientext`, name) 
       updateEmbed()
    
    }})
    
          break;
        case 'editrole':

            const channel = new RoleSelectMenuBuilder()
            .setCustomId('role')
            .setPlaceholder('Choisis un role')
    
    const cancel = new ButtonBuilder()
    .setCustomId("cancel")
    .setEmoji("<:YWfqSlWYOv:1112797979796046004>")
    .setStyle(ButtonStyle.Danger)
    
    const ch = new ActionRowBuilder().addComponents(channel)
    const b = new ActionRowBuilder().addComponents(cancel)
    i.editReply({ components: [ch, b]})
        break;
        case "del":

            client.db.delete(`${client.user.id}_${i.guild.id}.rolesoutien`)
            client.db.delete(`${client.user.id}_${i.guild.id}.soutientext`)
            updateEmbed()
            break;
            case 'on':
    
            if(client.db.get(`${client.user.id}_${i.guild.id}.actifsoutien`)===true) {
               await client.db.delete(`${client.user.id}_${i.guild.id}.actifsoutien`)
            } else {
               await client.db.set(`${client.user.id}_${i.guild.id}.actifsoutien`, true)
            }
            updateEmbed()
            break;
    }
    
    })

    }}