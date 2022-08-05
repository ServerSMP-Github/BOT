const client = require('../index');
const Schema = require('../models/logs/invites');
const { EmbedBuilder } = require("discord.js");
const InvitesTracker = require("@androz2091/discord-invites-tracker");
const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true,
});

tracker.on("guildMemberAdd", async (member, type, invite) => {
    Schema.findOne({
        Guild: member.guild.id
    }, async (err, data) => {
        if (!data) return;

        const channel = member.guild.channels.cache.get(data.Channel);
        if (type === "normal") {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: `${member.user.tag} joined!`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .addField("Information", [
                        `➤ **Code:** \`${invite.code}\``,
                        `➤ **Created by:** \`${invite.inviter.tag}\``,
                        `➤ **Uses:** \`${invite.uses}\``,
                    ].join('\n'))
                    .setFooter({
                        text: "Type: Normal"
                    })
                    .setColor("BLUE")
                ]
            });
        } else if (type === "permissions") {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: `${member.user.tag} joined!`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setFooter({
                        text: `Type: Permissions **|** I don't have the "MANAGE_GUILD" permission`
                    })
                    .setColor("BLUE")
                ]
            });
            channel.send(
                `Welcome ${member}! I can't figure out how you joined because I don't have the "MANAGE_GUILD" permission!`
            );
        } else if (type === "unknown") {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: `${member.user.tag} joined!`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setFooter({
                        text: "Type: Unknown"
                    })
                    .setColor("BLUE")
                ]
            });
        } else if (type === "vanity") {
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: `${member.user.tag} joined!`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .addField("Information", [
                        `➤ **Created by:** \`${member.guild.name}\``,
                    ].join('\n'))
                    .setFooter({
                        text: "Type: Vanity URL"
                    })
                    .setColor("BLUE")
                ]
            });
        }
    });
});
