module.exports.run = async (bot, message, args) => {
    let channelID = args[1]
    if (!channelID){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat that I can manage.")
    }
    let channel = bot.getChannel(channelID)
    if (!channel){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat that I can manage.")
    }
    if (!channel.type == 2){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat that I can manage.")
    }
    let failed = false
    if (channel.voiceMembers.length < 1){
        return message.channel.createMessage("Sorry but no body is in that voice chat.")
    }
    for ([memberID, member] of channel.voiceMembers){
        try {
            if (member.bot){continue}
            await member.edit({mute:true}, "Among Us Game Chat Control")
        }
        catch (e) {
            failed = true
            message.channel.createMessage("Sorry but I need permissions to Mute Members")
            break
        }
    }
    if (!failed){
        message.channel.createMessage("Users muted for round. To unmute the voice chat for discussion please use" + `\`${bot.config.prefix[0]}unmute\`.`)
    }
}