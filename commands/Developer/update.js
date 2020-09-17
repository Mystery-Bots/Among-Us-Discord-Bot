const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.tag} (ID: ${message.author.id}) tried to use "servers"`)
    embed = new Discord.MessageEmbed()
        .setTitle("Update Message")
        .setTimestamp()
        .setAuthor("TheMystery",message.author.avatarURL())
        .setDescription(args.join(' '))
        .setURL("https://discord.gg/AD2a24y")
        .setFooter("To opt out of these messages please join the support server")
        for ([guildID, guild] of bot.guilds.cache){
            if (guild.available){
                if (bot.config.ignore.includes(guildID)||bot.config.updateIgnore.includes(guildID)){
                    if (guild.id == "755289058741059596"){
                        channel = await bot.channels.fetch("755292856792383600")
                        channel.send(embed)
                    }
                }else{
                    channel = await guild.channels.cache.find(channel => (channel.name == "general" || channel.name == "among-us") && channel.type == "text")
                    if (!channel){
                        console.log("No General or Among Us channel in guild "+ guild.name)
                    }else{
                        channel.send(embed)
                    }
                }
            }
        }
}

module.exports.info = {
    name: "update",
    description: "Sends an update message to all server the bot is in",
    usage: '<message>',
    category: "Developer",
}