const { Client, Collection, GatewayIntentBits, PermissionFlagsBits, ChannelType } = require("discord.js")
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
})
require('dotenv').config()
const { readdirSync } = require("fs")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
let token = process.env.TOKEN

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const commands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
})


client.on("ready", async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    console.log(`Bot logged in as ${client.user.tag}!`);
})

readdirSync('./src/events').forEach(async file => {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})

client.on('voiceStateUpdate', async (oldState, newState) => {
  try {
    if (oldState.channelId === newState.channelId) return;
    if (oldState.channelId === null) {
      const channel = client.channels.cache.get(newState.channelId);
      if (channel.name === 'Join to Create' && channel.parentId === channel.guild.channels.cache.find(channel => channel.name === "Personal Rooms" && channel.type === ChannelType.GuildCategory).id && channel.guild.channels.cache.find(channel => channel.name === newState.member.displayName + "'s Room" && channel.type === ChannelType.GuildVoice) === undefined) {
        const category = channel.guild.channels.cache.find(channel => channel.name === "Personal Rooms" && channel.type === ChannelType.GuildCategory);
        const name = newState.member.displayName + "'s Room";
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
    } else if (newState.channelId === null) {
      const channel = client.channels.cache.get(oldState.channelId);
      if (channel.name !== 'Join to Create' && channel.parentId === channel.guild.channels.cache.find(channel => channel.name === "Personal Rooms" && channel.type === ChannelType.GuildCategory).id && channel.members.size === 0) {
        setTimeout(()=> {
          try{
            if (channel.members.size === 0) channel.delete();
          }
          catch(err){
            console.log(err.message)
          }
          
        }, 5000)
      }
    }
  }
  catch(err){
    console.log(err)
  }

});



client.login(token)
