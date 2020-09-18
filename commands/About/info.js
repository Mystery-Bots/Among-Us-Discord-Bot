const Discord = require('discord.js')
const ms = require('ms')

crewColor = [
    "https://themystery.s-ul.eu/bot/l4PQmeQ3",
    "https://themystery.s-ul.eu/bot/kj0elCnG",
    "https://themystery.s-ul.eu/bot/BkgP4wyw",
    "https://themystery.s-ul.eu/bot/zuFhrjTA",
    "https://themystery.s-ul.eu/bot/Fi1yfLwo",
    "https://themystery.s-ul.eu/bot/EplSSNXt",
    "https://themystery.s-ul.eu/bot/a3nnrBmj",
    "https://themystery.s-ul.eu/bot/mw4KhkOT",
    "https://themystery.s-ul.eu/bot/0IssEuGF",
    "https://themystery.s-ul.eu/bot/UYr66rph",
    "https://themystery.s-ul.eu/bot/v6QOWIvQ",
    "https://themystery.s-ul.eu/bot/5MT8kSEi"
]

module.exports.run = async (bot, message, args) => {
    userCount = 0
    for ([guildID, guild] of bot.guilds.cache){
        if (bot.config.ignore.includes(guildID)){
                
        }else{
            userCount += guild.memberCount
        }
    }
    color = Math.floor(Math.random() * crewColor.length) //Number 0 to 11
    embed = new Discord.MessageEmbed()
        .setTitle("Among Us Bot Info")
        .setURL("https://themystery.me/Among-Us")
        .setFooter("Created by TheMystery#7755")
        .setThumbnail(crewColor[color])
        .setDescription("The only Among Us Discord bot you need for your friends group/server.")
        .addField("Ping", `${bot.ws.ping.toFixed(1)}ms`,true)
        .addField("\u200B", "\u200B",true)
        .addField("Uptime", ms(bot.uptime,{long:true}),true)
        .addField("Guilds",bot.guilds.cache.size,true)
        .addField("\u200B", "\u200B",true)
        .addField("Users", userCount, true)
        .addField("Support","[Discord Invite](https://discord.gg/AD2a24y)",true)
        .addField("\u200B", "\u200B",true)
        .addField("Donate",`If you wish to donate feel free to run \`${bot.config.prefix}donate\``,true)
    message.channel.send(embed)
}

module.exports.info = {
    name: "info",
    description: "Get information about the bot.",
    category: "About",
    aliases: ["i"],
}