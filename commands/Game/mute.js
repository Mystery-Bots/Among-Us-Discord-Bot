module.exports.run = async (bot, message, args) => {
    let channelID = message.member.voiceState.channelID
    if (!channelID){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let channel = bot.getChannel(channelID)
    if (!channel.type == 2){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let failed = false
    for ([memberID, member] of channel.voiceMembers){
        try {
            await member.edit({mute:true}, "Among Us Game Chat Control")
        }
        catch (e) {
            failed = true
            message.channel.createMessage("Sorry but I need permissions to Mute Members")
            break
        }
    }
    if (!failed){
        message.channel.createMessage("Users muted for round. To unmute the voice chat for discussion please use" + `\`${bot.config.prefix}unmute\`.`)
    }
}

module.exports.info = {
    name: "mute",
    description: "Mute all players in the chat",
    category: "Game",
    aliases: ["m"],
    GuildOnly: true
}
