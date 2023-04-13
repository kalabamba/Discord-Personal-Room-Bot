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
		if (oldState.channelId === newState.channelId) return;
		if (oldState.channelId !== newState.channelId && newState.channelId !== null && client.channels.cache.get(newState.channelId).name === config.joinRoomName && client.channels.cache.get(newState.channelId).parentId === client.channels.cache.get(newState.channelId).guild.channels.cache.find(channel => channel.name === config.categoryName && channel.type === ChannelType.GuildCategory).id) {
			const channel = client.channels.cache.get(newState.channelId);
			if (channel.guild.channels.cache.find(c => c.name === newState.member.displayName + '\'s Room' && c.type === ChannelType.GuildVoice) === undefined) {
				const category = channel.guild.channels.cache.find(c => c.name === config.categoryName && c.type === ChannelType.GuildCategory);
				const name = newState.member.displayName + '\'s Room';
				const newChannel = await category.guild.channels.create({
					name: name,
					type: ChannelType.GuildVoice,
					parent: category,
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
							id: category.guild.roles.everyone,
							deny: [PermissionFlagsBits.Connect],
						},
					],
				});
				newState.setChannel(newChannel);
			}
			else {
				const oldChannel = channel.guild.channels.cache.find(c => c.name === newState.member.displayName + '\'s Room' && c.type === ChannelType.GuildVoice);
				newState.setChannel(oldChannel);
			}
		}
		else if (newState.channelId === null) {
			const channel = client.channels.cache.get(oldState.channelId);
			if (channel.name !== config.joinRoomName && channel.parentId === channel.guild.channels.cache.find(c => c.name === config.categoryName && c.type === ChannelType.GuildCategory).id) {
				setTimeout(async () => {
					try {
						if (channel.members.size === 0) await channel.delete();
						const personalChannel = channel.guild.channels.cache.find(c => c.name === oldState.member.displayName + '\'s Room' && c.type === ChannelType.GuildVoice);
						if (personalChannel !== undefined && personalChannel.members.size === 0) await personalChannel.delete();
					}
					catch (err) {
						console.log(err.message);
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

client.login(token);
