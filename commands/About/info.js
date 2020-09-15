const Discord = require('discord.js')
const ms = require('ms')

module.exports.run = async (bot, message, args) => {

    embed = new Discord.MessageEmbed()
        .setTitle("Among Us Bot Info")
        .setURL("https://themystery.me/Among-Us")
        .setFooter("Created by TheMystery#7755")
        .setDescription("The only Among Us Discord bot you need for your friends group/server.")
        .addField("Ping", `${bot.ws.ping.toFixed(1)}ms`,true)
        .addField("Uptime", ms(bot.uptime,{long:true}),true)
        .addField('\u200b', '\u200b',true)
        .addField("Guilds",bot.guilds.cache.size,true)
        .addField("Players",bot.users.cache.size-1, true)
        .addField("Support","[Discord Invite](https://discord.gg/AD2a24y)")
    message.channel.send(embed)
}

module.exports.info = {
    name: "info",
    description: "Get information about the bot.",
    category: "About",
    aliases: ["i"],
}