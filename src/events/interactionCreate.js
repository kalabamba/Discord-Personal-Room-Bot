const { InteractionType } = require('discord.js');
const { readdirSync } = require('fs');

module.exports = {
	name: 'interactionCreate',
	execute: async (interaction) => {
		const client = interaction.client;
		if (interaction.type == InteractionType.ApplicationCommand) {
			if (interaction.user.bot) return;

			readdirSync('./src/commands').forEach(file => {
				const command = require(`../../src/commands/${file}`);
				if (interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
					command.run(client, interaction);
				}
			});
		}
	} };
