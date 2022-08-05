const Client = require('../index');
const schema = require('../models/moderator/captcha');
const { EmbedBuilder, MessageAttachment } = require('discord.js');
const { CaptchaGenerator } = require('captcha-canvas');

Client.on('guildMemberAdd', async (member) => {
    if (member.user.bot) return;
    schema.findOne({
        Guild: member.guild.id
    }, async (err, data) => {
        if (data) {
            try {
                const captcha = new CaptchaGenerator({
                    height: 200,
                    width: 600
                });
                const buffer = await captcha.generate();
                const attachment = new MessageAttachment(buffer, "captcha.png");
                const msg = await member.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle('Please enter the captcha')
                        .setImage('attachment://captcha.png')
                        .setColor("Random")
                    ],
                    files: [attachment]
                })
                const filter = m => m.author.id == member.id;
                msg.channel.awaitMessages({
                        filter,
                        max: 1,
                        time: 10000
                    })
                    .then(collected => {
                        if (collected.first().content == captcha.text) return msg.channel.send("Congrats, you have answered the captcha.");
                        else {
                            msg.channel.send("You have answered the captcha incorrectly!");
                            msg.channel.send(`You have been kicked from **${member.guild.name}** for not answering the captcha correctly.`);
                            member.kick();
                        }
                    })
                    .catch(collected => {
                        msg.channel.send(`You have been kicked from **${member.guild.name}** for not answering the captcha correctly.`);
                        member.kick();
                    });
            } catch (e) {
                return console.error(e);
            }
        }
    });
});
