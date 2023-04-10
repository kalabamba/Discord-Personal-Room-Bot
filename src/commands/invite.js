const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("🤖 | invite link!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
    const embed = new EmbedBuilder()
    .setDescription("https://discord.com/api/oauth2/authorize?client_id=1094820165671211058&permissions=285214768&scope=bot")
    .setColor("Aqua")
    return interaction.followUp({embeds: [embed]})
 }
}
