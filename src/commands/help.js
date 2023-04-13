const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('🤖 | See all commands.')
		,
	run: async (client, interaction) => {
		await interaction.deferReply().catch(() => {
			interaction.editReply({ content: 'an error occurred.', ephemeral: true });
		});
		const embed = new EmbedBuilder()
			.setTitle('Personal Manager Bot / Help')
			.setColor('Aqua')
			.addFields(
				{ name: '🤖 | Bot', value: '`/help`', inline: true },
				{ name: 'setup', value: '`/setup`', inline: true },
				{ name: 'addUser', value: '`/add-user @user`', inline: true },
				{ name: 'ping', value: '`/ping`', inline: true },
				{ name: 'uptime', value: '`/uptime`', inline: true },
				{ name: 'invite', value: '`/invite`', inline: true },
			)
			.setTimestamp(new Date());
		return interaction.editReply({ embeds: [embed] });
	},
};
