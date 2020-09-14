const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
    channel = message.member.voice.channel
    
    if (!message.member.permissions.has('MUTE_MEMBERS')){
        return message.reply("I'm sorry but I only allow users with the `Mute Members` permission to use this command.")
    }

    if (!channel){
        return message.reply("Sorry but you are not connected to a voice chat for me to manage.")
    }

    for ([memberID, member] of channel.members){
        member.voice.setMute(true, "Among Us Game Chat Control")
    }
    message.channel.send("Users muted for round. To unmute the voice chat for discussion please use" + `\`${bot.config.prefix}umute\`.`)

}

module.exports.info = {
    name: "mute",
    description: "Mute all players in the chat",
    category: "Game",
    aliases: ["m"],
    GuildOnly: true
}