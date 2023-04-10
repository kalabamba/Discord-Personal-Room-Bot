const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🤖 | See your ping!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
    const embed = new EmbedBuilder()
    .setDescription(client.ws.ping + " ms")
    .setColor("Aqua")
    return interaction.followUp({embeds: [embed]})
 }
}
