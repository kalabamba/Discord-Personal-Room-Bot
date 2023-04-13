const { ActivityType } = require('discord.js');
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({
			activities: [{ name: '/setup-bot | by Turgut#3128', type: ActivityType.Watching }],
			status: 'online',
		});
	} };
