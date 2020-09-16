const Discord = require('discord.js')
const ms = require('ms')

module.exports.run = async (bot, message, args) => {
    userCount = 0
    for ([guildID, guild] of bot.guilds.cache){
        if (bot.config.ignore.includes(guildID)){
                
        }else{
            userCount += guild.memberCount
        }
    }
    embed = new Discord.MessageEmbed()
        .setTitle("Among Us Bot Info")
        .setURL("https://themystery.me/Among-Us")
        .setFooter("Created by TheMystery#7755")
        .setDescription("The only Among Us Discord bot you need for your friends group/server.")
        .addField("Ping", `${bot.ws.ping.toFixed(1)}ms`,true)
        .addField("\u200B", "\u200B",true)
        .addField("Uptime", ms(bot.uptime,{long:true}),true)
        .addField("Guilds",bot.guilds.cache.size,true)
        .addField("\u200B", "\u200B",true)
        .addField("Users", userCount, true)
        .addField("Support","[Discord Invite](https://discord.gg/AD2a24y)")
    message.channel.send(embed)
}

module.exports.info = {
    name: "info",
    description: "Get information about the bot.",
    category: "About",
    aliases: ["i"],
}