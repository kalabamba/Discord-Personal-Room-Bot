const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("🤖 | invite link!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
      if (process.env.oauthv2link === undefined) {
        interaction.editReply("Missing `oauthv2link` in .env! Please contact with <@157971450437959680>")
      }else {
        const embed = new EmbedBuilder()
        .setTitle(`${client.user.username}'s invite link:`)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`My invite link is: ${process.env.oauthv2link}`)
        .setColor("Aqua")
        return interaction.editReply({embeds: [embed]})
    }
 }
}