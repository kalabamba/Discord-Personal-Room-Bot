const { EmbedBuilder, ChannelType, PermissionFlagsBits} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('personal-rooms')
	.setDescription('🤖 | Personal Room Manager!')
    .addSubcommand(subcommand =>
        subcommand
            .setName('add-user')
            .setDescription('Add a user to a your personal room!')
            .addUserOption(option =>
                option
                .setName('user')
                .setDescription('Add a user to a your personal room!')
                .setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand
            .setName('setup')
            .setDescription('Setup the personal room manager!')),
        
        
	    run: async (client, interaction) => {
            await interaction.deferReply({ ephemeral: true }).catch(err => {})
            // SETUP COMMAND
            if(interaction.options.getSubcommand() === "setup") {
                if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator) || !interaction.user.id === 157971450437959680 ) return interaction.followUp({content: "You need to have the `ADMINISTRATOR` permission to use this command!"})
                else {
                    try{
                        if (!interaction.guild.channels.cache.find(channel => channel.name === "room-commands" && channel.type === ChannelType.GuildText) || !interaction.guild.channels.cache.find(channel => channel.name === "Join to Create" && channel.type === ChannelType.GuildVoice) || !interaction.guild.channels.cache.find(channel => channel.name === "Personal Rooms" && channel.type === ChannelType.GuildCategory)) {
                            
                            if(!interaction.guild.channels.cache.find(channel => channel.name === "Personal Rooms" && channel.type === ChannelType.GuildCategory)) {
                                await new Promise((resolve, reject)=> {resolve(interaction.guild.channels.create({
                                    name:"Personal Rooms", 
                                    type: ChannelType.GuildCategory, 
                                    position: interaction.guild.channels.size, 
                                    reason: "Setup by " + interaction.user.tag,
                                    })
                                )})
                            }

                            if(!interaction.guild.channels.cache.find(channel => channel.name === "Join to Create" && channel.type === ChannelType.GuildVoice)) {
                                interaction.guild.channels.create({
                                    name:"Join to Create", 
                                    type: ChannelType.GuildVoice, 
                                    parent: interaction.guild.channels.cache.find(channel => channel.name === "Personal Rooms"), 
                                    reason: "Setup by " + interaction.user.tag, 
                                    permissionOverwrites: [
                                        {
                                            id: interaction.guild.roles.everyone.id, 
                                            deny: [PermissionFlagsBits.Speak, PermissionFlagsBits.SendMessages],
                                        },
                                    ],
                                    userLimit: 1,
                                })
                            }
                            if(!interaction.guild.channels.cache.find(channel => channel.name === "room-commands" && channel.type === ChannelType.GuildText)){
                                await interaction.guild.channels.create({
                                    name:"room-commands", 
                                    type: ChannelType.GuildText, 
                                    parent: interaction.guild.channels.cache.find(channel => channel.name === "Personal Rooms"), 
                                    reason: "Setup by " + interaction.user.tag, 
                                    permissionOverwrites: [
                                        {
                                            id: interaction.guild.roles.everyone.id, 
                                            allow: [PermissionFlagsBits.SendMessages],
                                        },
                                    ],
                                })
                                let cmdchannel = interaction.guild.channels.cache.find(channel => channel.name === "room-commands" && channel.type === ChannelType.GuildText)
                                const vchannelId = interaction.guild.channels.cache.find(channel => channel.name === "Join to Create" && channel.type === ChannelType.GuildVoice).id
                                const embed = new EmbedBuilder()
                                .setTitle("Personal Room Manager")
                                .setDescription("This is the personal room manager, you can use this to create your own personal room, and add users to your personal room!")
                                .setColor("Aqua")
                                .addFields({name: "Usage", value: `🔉 <#${vchannelId}> - Join for Create your personal room`})
                                .addFields({name: "Commands", value: "`/personal-rooms setup` - Setup the personal room manager\n`/personal-rooms add-user @user` - Add a user to your personal room"})
                                .setTimestamp(new Date())
                                .setFooter({ text: "Setup by " + interaction.user.tag, iconURL: interaction.user.avatarURL() })
                                cmdchannel.send({embeds: [embed]})
                            }
                            const embed = new EmbedBuilder()
                            .setDescription("Setup Complete!")
                            .setColor("Aqua")
                            return interaction.editReply({embeds: [embed]})
                        }else{
                            const embed = new EmbedBuilder()
                            .setDescription("Setup Already Completed!")
                            .setColor("Aqua")
                            return interaction.editReply({embeds: [embed]})
                        }
                    }
                    catch(err) {
                        console.log(err);
                        interaction.editReply({content: 'Bir hata meydana geldi.', ephemeral: true })
                    }
                }
            }
            // ADD USER COMMAND
            else if (interaction.options.getUser('user')){
                try{
                    const user = interaction.options.getUser('user')
                    if(!interaction.member.voice.channel) return interaction.editReply({content: "You need to be in a voice channel to use this command!", ephemeral: true})
                    const channel = interaction.guild.channels.cache.find(channel => channel.name === interaction.member.voice.channel.name)
                    const member = interaction.guild.members.cache.get(user.id)
                    const embed = new EmbedBuilder()
                    .setDescription("Added <@" + user.id + "> to your personal room!")
                    .setColor("Aqua")
                    await channel.permissionOverwrites.create(member, {
                        ViewChannel: true,
                        Connect: true,
                        Speak: true,
                        Stream: true,
                        SendMessages: true,
                        ReadMessageHistory: true,
                    })
                    interaction.editReply({embeds: [embed]})
                }
                catch(err) {
                    interaction.editReply({content: 'Bir hata meydana geldi.', ephemeral: true })
                }    
            }
        }
};
