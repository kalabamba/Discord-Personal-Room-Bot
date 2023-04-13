const { EmbedBuilder} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
    .setName('add-user')
	.setDescription('🤖 | Add a user to your personal room.')
    .addUserOption(option =>
        option
        .setName('user')
        .setDescription('the user you want to add.')
        .setRequired(true)),
        
	    run: async (client, interaction) => {
            await interaction.deferReply({ ephemeral: true }).catch(err => {})
            try{
                const user = interaction.options.getUser('user')
                if(!interaction.member.voice.channel) return interaction.editReply({content: "You need to be in a voice channel to use this command!", ephemeral: true})
                if(!channel.guild.channels.cache.find(channel => channel.name === process.env.categoryName && channel.type === ChannelType.GuildCategory)) return interaction.editReply({content: "The category for the personal rooms doesn't exist, please contact the server owner to setup the bot!", ephemeral: true})
                const channel = interaction.guild.channels.cache.find(channel => channel.name === interaction.member.voice.channel.name && interaction.member.voice.channel.parentId === channel.guild.channels.cache.find(channel => channel.name === process.env.categoryName && channel.type === ChannelType.GuildCategory).id)
                const member = interaction.guild.members.cache.get(user.id)
                const embed = new EmbedBuilder()
                .setDescription("Added <@" + user.id + "> to your personal room!")
                .setTimestamp(new Date())
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
};
