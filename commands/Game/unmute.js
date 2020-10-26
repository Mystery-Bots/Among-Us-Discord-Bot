module.exports.run = async (bot, message, args, database) => {
    let channelID = message.member.voiceState.channelID
    if (!channelID){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let channel = bot.getChannel(channelID)
    if (!channel.type == 2){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let guild = message.channel.guild

    const collection = database.collection("games");

    // create a filter for server id to find
    const filter = { "guildID": `${guild.id}` };
    
    const result = await collection.findOne(filter);
    if (!result){
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
            message.channel.createMessage("Users unmuted for round. To re-mute the voice chat please use" + `\`${bot.config.prefix[0]}mute\`.`).catch(()=>{})
        }
    }else{
        let deadUsers = []
        let failed = false
        for (deadUser of result.dead){
            await deadUsers.push(deadUser)
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
            message.channel.createMessage("Users unmuted for round. To re-mute the voice chat please use" + `\`${bot.config.prefix[0]}mute\`.`).catch(()=>{})
        }
    }
}

module.exports.info = {
    name: "unmute",
    description: "Unmute all players in the chat",
    category: "Game",
    aliases: ["um", "u"],
    GuildOnly: true
}
