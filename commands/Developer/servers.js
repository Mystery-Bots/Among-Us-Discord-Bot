const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.tag} (ID: ${message.author.id}) tried to use "servers"`)
    embed = new Discord.MessageEmbed()
        .setTitle("Server List")
        for ([guildID, guild] of bot.guilds.cache){
            if (bot.config.ignore.includes(guildID)){
                
            }
            else{
                invites = await guild.fetchInvites()
                if (!invites){
                    invite = "No Perms"
                }else if (invites.size < 1){
                    invite = "No Invites"
                }
                else{
                    invite = invites.first()
                }
                embed.addField(`${guild.name} (ID: ${guild.id})`, `Member Count: ${guild.memberCount}\nInvite: ${invite}`,true)
            }
        }
        message.channel.send(embed)
}

module.exports.info = {
    name: "servers",
    description: "Gets a list of all servers the bot is in and their member counts",
    category: "Developer",
}