require('dotenv').config();
const config = require('./config.json');
const express = require('express');
const app = express();
const { Client, Collection, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require('discord.js');
const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const token = process.env.TOKEN;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
});
client.commands = new Collection();

const rest = new REST({ version: '10' }).setToken(token);

const commands = [];
readdirSync('./src/commands').forEach(async file => {
	const command = require(`./src/commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
});


client.on('ready', async () => {
	try {
		await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: commands },
		);
	}
	catch (error) {
		console.error(error);
	}
	console.log(`Bot logged in as ${client.user.tag}!`);
});

readdirSync('./src/events').forEach(async file => {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	try {
		const newStateRootCategory = newState.guild.channels.cache.find(channel => channel.name === config.categoryName && channel.type === ChannelType.GuildCategory);
		if (oldState.channelId === newState.channelId) return;
		else if (newState.channelId !== null && newState.channel.name === config.joinRoomName && newState.channel.parentId === newStateRootCategory.id) {
			const channel = newState.channel;
			const boss = findBoss(newState);
			if (channel.guild.channels.cache.find(c => (c.name === newState.member.displayName + '\'s Room' && c.type === ChannelType.GuildVoice) || (c.name === boss.value && c.type === ChannelType.GuildVoice)) === undefined) {
				const name = (boss) ? boss.value : newState.member.displayName + '\'s Room';
				const newChannel = await newState.guild.channels.create({
					name: name,
					type: ChannelType.GuildVoice,
					parent: newStateRootCategory,
					permissionOverwrites: [
						{
							id: client.user.id,
							allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.ManageChannels],
						},
						{
							id: newState.member.id,
							allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak, PermissionFlagsBits.Stream, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
						},
						{
							id: newStateRootCategory.guild.roles.everyone,
							deny: [PermissionFlagsBits.Connect],
						},
					],
				});
				await newState.setChannel(newChannel);
				console.log('+ Created new channel: ' + newState.guild.name + ' ==> ' + newChannel.name);
			}
			else if (boss) {
				const oldChannel = channel.guild.channels.cache.find(c => c.name === boss.value && c.type === ChannelType.GuildVoice);
				newState.setChannel(oldChannel);
			}
			else {
				const oldChannel = channel.guild.channels.cache.find(c => c.name === newState.member.displayName + '\'s Room' && c.type === ChannelType.GuildVoice);
				newState.setChannel(oldChannel);
			}
		}
		else if (newState.channelId === null) {
			const oldStateRootCategory = oldState.guild.channels.cache.find(ch => ch.name === config.categoryName && ch.type === ChannelType.GuildCategory);
			if (oldState.channel.name !== config.joinRoomName && oldState.channel.parentId === oldStateRootCategory.id && oldState.channel.members.size === 0) {
				setTimeout(async () => {
					try {
						if (oldState.channel.members.size === 0) {
							const chName = oldState.channel.name;
							await oldState.channel.delete();
							console.log('- Deleted channel: ' + oldState.guild.name + ' ==> ' + chName);
						}
						const personalChannel = oldState.guild.channels.cache.find(ch => ch.name === oldState.member.displayName + '\'s Room' && ch.type === ChannelType.GuildVoice);
						if (personalChannel && personalChannel.members.size === 0) {
							const chName = personalChannel.name;
							await personalChannel.delete();
							console.log('- Deleted channel: ' + personalChannel.guild.name + ' ==> ' + chName);
						}
						const boss = findBoss(oldState);
						const bossChannel = oldState.guild.channels.cache.find(ch => ch.name === boss.value && ch.type === ChannelType.GuildVoice && ch.parentId === oldStateRootCategory.id);
						if (bossChannel && bossChannel.members.size === 0) {
							const chName = bossChannel.name;
							await bossChannel.delete();
							console.log('- Deleted channel: ' + bossChannel.guild.name + ' ==> ' + chName);
						}
					}
					catch (err) {
						console.log(err);
					}

				}, 5000);
			}
		}
	}
	catch (err) {
		console.log(err);
	}
});

// Express Status Page
app.get('/', function(req, res) {
	res.send('Bot is Online!');
});

app.listen(3000, () => {
	console.log('Bot listening on port 3000');
});

// Find Boss Function
function findBoss(state) {
	const foundData = config.bosses.find(boss => boss.id === state.member.id);
	return foundData;
}

client.login(token);
