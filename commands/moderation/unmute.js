const { Message, Client, PermissionsBitField } = require('discord.js');
const Schema = require('../../models/moderator/mute');

module.exports = {
    name: 'unmute',
    usage: '[@user]',
    description : "Admins can unmute users so they can talk in text channels.",
    userPermission: [PermissionsBitField.Flags.ManageMessages],
    botPermission: [PermissionsBitField.Flags.ManageRoles],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!Member) return message.channel.send('Member not found')
        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
        Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
            if(!data) return message.reply("Member was not muted.");
            const user = data.Users.findIndex((prop) => prop === Member.id);
            if(user === -1) return message.reply("Member is not muted.");
            data.Users.splice(user, 1);
            data.save();
            await Member.roles.remove(role);
            message.channel.send(`${Member.displayName} is now unmuted`);
        })
    }
}