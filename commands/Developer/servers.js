const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.tag} (ID: ${message.author.id}) tried to use "servers"`)
    message.channel.startTyping()
    embed = new Discord.MessageEmbed()
        .setTitle("Server List")
        for ([guildID, guild] of bot.guilds.cache){
            if (bot.config.ignore.includes(guildID)){
                
            }
            else{
                if (guild.me.hasPermission("MANAGE_GUILD")){
                    invites = await guild.fetchInvites()
                }else{
                    invites = undefined
                }
                if (!invites){  
                    invite = "No Perms"
                }else if (invites.size < 1){
                    invite = "No Invites"
                }
                else{
                    invite = invites.first()
                }
                embed.addField(`${guild.name} (ID: ${guild.id})`, `Member Count: ${guild.memberCount}\nPermissions: ${guild.me.permissions.bitfield}\nInvite: ${invite}`,true)
            }
        }
        message.channel.stopTyping(true)
        message.channel.send(embed)
}

module.exports.info = {
    name: "servers",
    description: "Gets a list of all servers the bot is in and their member counts",
    category: "Developer",
}