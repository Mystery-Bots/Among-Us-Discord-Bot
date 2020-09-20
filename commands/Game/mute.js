const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    channel = message.member.voice.channel

    if (!channel){
        return message.reply("Sorry but you are not connected to a voice chat for me to manage.")
    }

    for ([memberID, member] of channel.members){
        await member.voice.setMute(true, "Among Us Game Chat Control").catch(()=>{})
    }
    message.channel.send("Users muted for round. To unmute the voice chat for discussion please use" + `\`${bot.config.prefix}unmute\`.`)

}

module.exports.info = {
    name: "mute",
    description: "Mute all players in the chat",
    category: "Game",
    aliases: ["m"],
    GuildOnly: true
}