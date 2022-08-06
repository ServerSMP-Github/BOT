const { MessageEmbed, Message, Client } = require('discord.js');
const Schema = require('../../models/blacklist');

module.exports = {
    name: 'blacklist-remove',
    category : 'owner',
    usage: '[serverID]',
    description : "Prince527 can unblacklist a server so they can use the bot.",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const id = args[0];
        if(!id) return message.reply('Please specify a guild id!');
        Schema.findOne({ Server: id }, async(err, data) => {
            if(!data) return message.reply('That guild id does not exist in the database!');
            data.delete();
            message.reply("Guild was unblacklisted successfully!");
        })
    }
}
