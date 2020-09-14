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
        member.voice.setMute(false, "Among Us Game Chat Control")
    }
    message.channel.send("Users unmuted for round. To remute the voice chat please use" + `\`${bot.config.prefix}mute\`.`)

}

module.exports.info = {
    name: "unmute",
    description: "Unmute all players in the chat",
    category: "Game",
    aliases: ["um", "u"],
    GuildOnly: true
}