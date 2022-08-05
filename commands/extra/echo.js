const { Client, Message, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "echo",
    description: "Echos your text as an embed!",
    usage: "[ message ]",

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const description = args.join(" ");
        if (!args.length) return message.reply("Please specify some text to echo!");

        const embed = new EmbedBuilder()
            .setTitle("Echo!")
            .setDescription(description)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setColor("Random")
        message.reply({ embeds: [embed] });
    },
};
