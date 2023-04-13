const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🤖 | Returns latency and API ping.'),
	run: async (client, interaction) => {
		await interaction.deferReply().catch(() => {
			interaction.editReply({ content: 'an error acquired.', ephemeral: true });
		});
		const embed = new EmbedBuilder()
			.setTitle('PONG! :ping_pong:')
			.setThumbnail(interaction.user.displayAvatarURL())
			.setDescription(client.ws.ping + ' ms')
			.setColor('Aqua')
			.addFields(
				{ name: 'Latency', value: `\`${Date.now() - interaction.createdTimestamp}ms\`` },
				{ name: 'API Latency', value: `\`${Math.round(client.ws.ping)}ms\`` },
			);
		return interaction.editReply({ embeds: [embed] });
	},
};
