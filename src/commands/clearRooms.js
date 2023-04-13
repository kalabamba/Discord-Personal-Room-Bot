const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear-empty-rooms')
		.setDescription('🤖 | Clears empty rooms')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	run: async (client, interaction) => {
		await interaction.deferReply().catch(() => {
			interaction.editReply({ content: 'an error occurred.', ephemeral: true });
		});
		try {
			const rootCategory = interaction.guild.channels.cache.find(ch => ch.name === config.categoryName && ch.type === ChannelType.GuildCategory);
			interaction.guild.channels.cache.forEach(async channel => {
				if (channel.name !== config.joinRoomName && channel.type === ChannelType.GuildVoice && channel.parentId === rootCategory.id && channel.members.size === 0) {
					await channel.delete();
				}
			});
			const seconds = Math.floor((Date.now() - interaction.createdTimestamp)/ 1000) % 60;
			const miliseconds = Math.floor((Date.now() - interaction.createdTimestamp) % 1000);
			const embed = new EmbedBuilder()
				.setTitle('Cleared empty rooms.')
				.setColor('Aqua')
				.addFields({ name: ':computer: Process Time', value: `${seconds} sec ${miliseconds} ms`, inline: true })
				.setTimestamp(new Date());
			return interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			console.error(error);
			return interaction.editReply({ content: 'an error occurred.', ephemeral: true });
		}
	},
};
