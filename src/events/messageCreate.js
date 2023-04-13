module.exports = {
	name: 'messageCreate',
	execute: async (message) => {
		const client = message.client;
		if (message.author.bot) return;
		if (message.channel.type === 'dm') return;
	} };
