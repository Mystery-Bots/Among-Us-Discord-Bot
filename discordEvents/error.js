const Discord = require("eris")

module.exports.Run = async function (bot, error){
    channel = await bot.channels.fetch("755883889876140062")
    var embed = new Discord.MessageEmbed()
        .setTitle("ERROR")/t
        .setDescription(`${error.name}\n${error.message}`)
        .setColor("#ff0000")
        .setTimestamp()
    channel.send(embed)
    console.error(error)
}