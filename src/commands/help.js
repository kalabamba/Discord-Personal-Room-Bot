require('dotenv').config();
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
			.setAuthor({ name: 'Personal Room Manager Bot / Help', iconURL: client.user.avatarURL(), url: 'https://turgutmemis.com' })
			.setTitle('For commands and their usage, please visit the website.')
			.setDescription('[Click here](https://www.turgutmemis.com) to visit the website.')
			.setColor('Aqua')
			.addFields(
				{ name: 'Support Server', value: 'https://fatihbaskaya.com/dc', inline: false },
			)
			.setImage( client.user.avatarURL() )
			.setFooter({ text: 'Personal Room Manager | by Turgut#3128', iconURL: client.user.avatarURL() })
		return interaction.editReply({ embeds: [embed] });
	},
};
