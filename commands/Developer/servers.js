const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.tag} (ID: ${message.author.id}) tried to use "servers"`)
    message.channel.startTyping()
    list = []
        for ([guildID, guild] of bot.guilds.cache){
            if (bot.config.ignore.includes(guildID)){
                
            }
            else{
                if (!guild.owner){
                    list.push(`${guild.name} (ID: ${guild.id}): Owner: **Unknown User** (ID: ${guild.ownerID})  Member Count: ${guild.memberCount}`)
                }
                else{
                    list.push(`${guild.name} (ID: ${guild.id}): Owner: ${guild.owner.user.tag} (ID: ${guild.ownerID})  Member Count: ${guild.memberCount}`)
                }
            }
        }
        message.channel.stopTyping(true)
        message.channel.send(`${list.join("\n")}`,{code:true, split:true})
}

module.exports.info = {
    name: "servers",
    description: "Gets a list of all servers the bot is in and their member counts",
    category: "Developer",
}