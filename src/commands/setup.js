const { EmbedBuilder, ChannelType, PermissionFlagsBits} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("🤖 | Setup Bot!"),
	    run: async (client, interaction) => {
            await interaction.deferReply().catch(err => {})
            if(!interaction.member.permissions.has("ADMINISTRATOR") || !interaction.user.id === 157971450437959680 ) return interaction.followUp({content: "You need to have the `ADMINISTRATOR` permission to use this command!"})
            else {
                try{
                    if(!interaction.guild.channels.cache.find(channel => channel.name === "Personal Rooms" && channel.type === ChannelType.GuildCategory)) {
                        let cat = new Promise((resolve, reject)=> {resolve(interaction.guild.channels.create({name:"Personal Rooms", type: ChannelType.GuildCategory, position: interaction.guild.channels.size, reason: "Setup by " + interaction.user.tag}))})
                        await cat
                        interaction.guild.channels.create({
                            name:"Join to Create", 
                            type: ChannelType.GuildVoice, 
                            parent: interaction.guild.channels.cache.find(channel => channel.name === "Personal Rooms"), 
                            reason: "Setup by " + interaction.user.tag, 
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.roles.everyone.id, 
                                    deny: [PermissionFlagsBits.Speak],
                                },
                            ],
                        })
                        const embed = new EmbedBuilder()
                        .setDescription("Setup Complete!")
                        .setColor("Aqua")
                        return interaction.followUp({embeds: [embed]})
                    }else {
                        if(!interaction.guild.channels.cache.find(channel => channel.name === "Join to Create" && channel.type === ChannelType.GuildVoice && channel.parentId === interaction.guild.channels.cache.find(channel => channel.name === "Personal Rooms" && channel.type === ChannelType.GuildCategory).id)){
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
                            })
                            const embed = new EmbedBuilder()
                            .setDescription("Setup Complete!")
                            .setColor("Aqua")
                            return interaction.followUp({embeds: [embed]})
                        }else {
                            const embed = new EmbedBuilder()
                            .setDescription("Setup Already Completed!")
                            .setColor("Aqua")
                            return interaction.followUp({embeds: [embed]})
                        }
                        
                    }  
                }
                catch(err) {console.log(err.message)}
                
            }
        }
};

