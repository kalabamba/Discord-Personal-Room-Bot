const { ActivityType } = require("discord.js")
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
  client.user.setPresence({
	activities: [{ name: 'Your Personal Room Menager', type: ActivityType.Watching }],
	status: 'online',
  })
}};
