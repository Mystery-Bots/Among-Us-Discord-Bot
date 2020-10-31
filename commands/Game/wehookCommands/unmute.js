module.exports.run = async (bot, message, args) => {
    let channelID = args[1]
    if (!channelID){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat that I can manage.")
    }
    let channel = bot.getChannel(channelID)
    if (!channel){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat that I can manage.")
    }
    if (channel.type == 0){
        return message.channel.createMessage("Sorry but the channel ID is not a voice chat ID.")
    }
    /* let guild = message.channel.guild
    
    const collection = database.collection("games");

    // create a filter for server id to find
    const filter = { "guildID": `${guild.id}` };
    
    const result = await collection.findOne(filter);
    if (!result){ */
        let failed = false
        for ([memberID, member] of channel.voiceMembers){
            try {
                await member.edit({mute:false}, "Among Us Game Chat Control")
            }
            catch (e) {
                failed = true
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
        }
        if (!failed){
            message.channel.createMessage("Users unmuted for round. To re-mute the voice chat please use" + `\`${bot.config.prefix}mute\`.`).catch(()=>{})
        }
    /* }else{
        let deadUsers = []
        let failed = false
        for (deadUser of result.dead){
            await deadUsers.push(deadUser)
        }
        if (channel.voiceMembers.size < 1){
            return message.channel.createMessage("Sorry but no body is in that voice chat.")
        }
        for ([memberID, member] of channel.voiceMembers){
            try {
                if (deadUsers.includes(memberID)){}
                else{
                    await member.edit({mute:false}, "Among Us Game Chat Control")
                }
            }
            catch (e){
                failed = true
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
        }
        if (!failed){
            message.channel.createMessage("Users unmuted for round. To re-mute the voice chat please use" + `\`${bot.config.prefix}mute\`.`).catch(()=>{})
        }
    } */
}

module.exports.info = {
    name: "unmute",
    description: "Unmute all players in the chat",
    category: "Game",
    aliases: ["um", "u"],
    GuildOnly: true
}
