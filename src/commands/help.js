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
			.setTitle('Personal Room Manager Bot / Help')
			.setColor('Aqua')
			.addFields(
				{ name: 'For commands and their usage, please visit the website.', value: '[CLICK HERE](www.turgutmemis.com) to visit the website.', inline: false },
				{ name: 'Support Server', value: 'https://fatihbaskaya.com/dc', inline: true },
			)
			.setImage( client.user.avatarURL() )
			.setFooter({ text: 'Personal Room Manager Bot', iconURL: client.user.avatarURL() })
		return interaction.editReply({ embeds: [embed] });
	},
};
