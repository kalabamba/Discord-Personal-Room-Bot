const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("🤖 | Looking for my invite link? Here it is!"),
    run: async (client, interaction) => {
      await interaction.deferReply().catch(err => {})
      if (process.env.oauthv2link === undefined) {
        interaction.editReply(`Missing invite link! Please contact with <@${process.env.ownerId}>`)
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