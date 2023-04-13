require('dotenv').config();
const config = require('../../config.json');
const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup-bot')
		.setDescription('Setup the personal room manager!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	run: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: true }).catch(() => {
			interaction.editReply({ content: 'an error acquired.', ephemeral: true });
		});
		if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) || !interaction.user.id === process.env.ownerId) {return interaction.followUp({ content: 'You need to have the `ADMINISTRATOR` permission to use this command!' });}
		else {
			try {
				if (!interaction.guild.channels.cache.find(channel => channel.name === config.commandRoomName && channel.type === ChannelType.GuildText) || !interaction.guild.channels.cache.find(channel => channel.name === config.joinRoomName && channel.type === ChannelType.GuildVoice) || !interaction.guild.channels.cache.find(channel => channel.name === config.categoryName && channel.type === ChannelType.GuildCategory)) {
					if (!interaction.guild.channels.cache.find(channel => channel.name === config.categoryName && channel.type === ChannelType.GuildCategory)) {
						await new Promise((resolve) => {
							resolve(interaction.guild.channels.create({
								name: config.categoryName,
								type: ChannelType.GuildCategory,
								position: interaction.guild.channels.size,
								reason: 'Setup by ' + interaction.user.tag,
							}),
							);
						});
					}

					if (!interaction.guild.channels.cache.find(channel => channel.name === config.joinRoomName && channel.type === ChannelType.GuildVoice)) {
						interaction.guild.channels.create({
							name: config.joinRoomName,
							type: ChannelType.GuildVoice,
							parent: interaction.guild.channels.cache.find(channel => channel.name === config.categoryName),
							reason: 'Setup by ' + interaction.user.tag,
							permissionOverwrites: [
								{
									id: interaction.guild.roles.everyone.id,
									deny: [PermissionFlagsBits.Speak, PermissionFlagsBits.SendMessages],
								},
							],
							userLimit: 1,
						});
					}
					if (!interaction.guild.channels.cache.find(channel => channel.name === config.commandRoomName && channel.type === ChannelType.GuildText)) {
						await interaction.guild.channels.create({
							name: config.commandRoomName,
							type: ChannelType.GuildText,
							parent: interaction.guild.channels.cache.find(channel => channel.name === config.categoryName),
							reason: 'Setup by ' + interaction.user.tag,
							permissionOverwrites: [
								{
									id: interaction.guild.roles.everyone.id,
									allow: [PermissionFlagsBits.SendMessages],
								},
							],
						});
						const cmdchannel = interaction.guild.channels.cache.find(channel => channel.name === config.commandRoomName && channel.type === ChannelType.GuildText);
						const vchannelId = interaction.guild.channels.cache.find(channel => channel.name === config.joinRoomName && channel.type === ChannelType.GuildVoice).id;
						const embed = new EmbedBuilder()
							.setTitle('Personal Room Manager')
							.setDescription('This is the personal room manager, you can use this to create your own personal room, and add users to it!')
							.setColor('Aqua')
							.addFields({ name: 'Usage', value: `🔉 <#${vchannelId}> - Join for Create your personal room` })
							.addFields({ name: 'Commands', value: '`/setup-bot` - Setup the personal room manager\n`/add-user @user` - Add a user to your personal room' })
							.setTimestamp(new Date())
							.setFooter({ text: 'Setup by ' + interaction.user.tag, iconURL: interaction.user.avatarURL() });
						cmdchannel.send({ embeds: [embed] });
					}
					const embed = new EmbedBuilder()
						.setDescription('Setup Complete!')
						.setColor('Aqua');
					return interaction.editReply({ embeds: [embed] });
				}
				else {
					const embed = new EmbedBuilder()
						.setDescription('Setup Already Completed!')
						.setColor('Aqua');
					return interaction.editReply({ embeds: [embed] });
				}
			}
			catch (err) {
				console.log(err);
				interaction.editReply({ content: 'An error acquired!', ephemeral: true });
			}
		}
	},
};
