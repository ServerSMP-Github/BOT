const { Client, CommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  name: "help",
  description: "Show All Commands",
  type: ApplicationCommandType.ChatInput,
  options: [
      {
        name: "commands",
        description: "Serch for a command",
        type: ApplicationCommandOptionType.String,
        required: false,
      }
    ],

  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {

    if (!args[0]) {
      let categories = [];

      readdirSync("./SlashCommands/").forEach((dir) => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../SlashCommands/${dir}/${command}`);

          if (!file.name) return "No command name.";

          let name = file.name.replace(".js", "");
          let description = file.description;

          return `\`${name}\` : ${description} \n`;
        });

        let data = new Object();

        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "In progress." : cmds.join(" "),
        };

        categories.push(data);
      });

      const embed = new EmbedBuilder()
        .setTitle("📬 Need help? Here are all of my commands:")
        .addFields(categories)
        .setDescription(
          `Use \`/help\` followed by a command name to get more additional information on a command. For example: \`/help report\`.`
        )
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
        })
        .setTimestamp()
        .setColor("BLUE");
      return interaction.followUp({ embeds: [embed] });
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

      if (!command) {
        const embed = new EmbedBuilder()
          .setTitle(
            `Invalid command! Use \`/help\` for all of my commands!`
          )
          .setColor("BLUE");
        return interaction.followUp({ embeds: [embed] });
      }

      const embed = new EmbedBuilder()
        .setTitle("Command Details:")
        .addField("PREFIX:", `\`/\``)
        .addField(
          "COMMAND:",
          command.name ? `\`${command.name}\`` : "No name for this command."
        )
        .addField(
          "USAGE:",
          command.usage
            ? `\`/${command.name} ${command.usage}\``
            : `\`/${command.name}\``
        )
        .addField(
          "DESCRIPTION:",
          command.description
            ? command.description
            : "No description for this command."
        )
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
          })
        .setTimestamp()
        .setColor("BLUE");
      return interaction.followUp({ embeds: [embed] });
    }
  },
};
