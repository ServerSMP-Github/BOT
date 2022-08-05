const {
    MessageActionRow,
    Message,
    MessageEmbed,
    MessageButton,
} = require("discord.js");

module.exports = async (message, embeds) => {
    if (!message || !embeds) throw new Error(console.log('Please provide all arguments, make sure they are valid'))

    let index = 0;

    let button = new MessageActionRow()
        .addComponents(
            new MessageButton().setCustomId(`previous`) //button to go back a page
            .setLabel('Previous Page').setEmoji("◀️").setStyle('SECONDARY'),

            new MessageButton().setCustomId(`home`) //home button to go back to the main menu
            .setLabel('Home Page').setEmoji("🏠").setStyle("SECONDARY"),

            new MessageButton().setCustomId(`next`) //button to go forward a page
            .setLabel('Next Page').setEmoji("▶️").setStyle('SECONDARY'),
        );

    let buttons = [button];

    let msg = await message.channel.send({
        embeds: [embeds[0]],
        components: buttons
    }).then((message) => {

        const buttonID = [`previous`, `home`, `next`];

        const buttons = async (interaction) => {
            if (interaction.user.id === message.author.id) return interaction.reply({
                content: "Only the button owner can use these",  
                ephemeral: true,
            });

            if (!buttonID.includes(interaction.customId)) return;

            if (interaction.customId == `previous`) {
                index = index > 0 ? --index : embeds.length - 1;
                await interaction.deferUpdate();

                await interaction.message.edit({
                    embeds: [embeds[index]]
                });

            } else if (interaction.customId == `home`) {
                index = 0;
                await interaction.deferUpdate();

                await interaction.message.edit({
                    embeds: [embeds[index]]
                });

            } else if (interaction.customId == `next`) {
                index = index + 1 < embeds.length ? ++index : 0;
                await interaction.deferUpdate();

                await interaction.message.edit({
                    embeds: [embeds[index]]
                });
            } 
        };

        const filter = (interaction) => {
            return !interaction.user.bot
        };

        const collector = message.createMessageComponentCollector({
            filter,
            componentType: "BUTTON",
            time: 50000
        });

        collector.on("collect", buttons);
        collector.on("end", () => {                   
            button.components[0].setDisabled(true)
            button.components[1].setDisabled(true)
            button.components[2].setDisabled(true)

            message.edit({
                components: [button]
            });
        });
    });

    return msg;

}