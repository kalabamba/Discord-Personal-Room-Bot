const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("🤖 | See uptime the bot."),
    run: async (client, interaction) => {
        await interaction.deferReply().catch(err => {})
        const days = Math.floor(client.uptime / 86400000)
        const hours = Math.floor(client.uptime / 3600000) % 24
        const minutes = Math.floor(client.uptime / 60000) % 60
        const seconds = Math.floor(client.uptime / 1000) % 60
        const embed = new EmbedBuilder()
        .setTitle(`${client.user.username}`)
        .setColor("Aqua")
        .addFields({ name: ':computer: UPTIME', value: `${days}days ${hours}hrs ${minutes}min ${seconds}sec`, inline: true })
        .setTimestamp(new Date())
        return interaction.editReply({embeds: [embed]})
 }
}
