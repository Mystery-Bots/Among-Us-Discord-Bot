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
    let guild = message.channel.guild

    let collection = bot.database.collection("games");

    // create a filter for server id to find
    let filter = { "guildID": `${guild.id}` };
    
    let result = await collection.findOne(filter);
    if (!result){
        let failed = false
        if (channel.voiceMembers.size < 1){
            return message.channel.createMessage("Sorry but no body is in that voice chat.")
        }
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
            message.channel.createMessage('No players died in the game. Unmuting all players.').catch(()=>{})
        }
    }else{
        let failed = false
        for ([memberID, member] of channel.voiceMembers){
            try {
                await member.edit({mute:false}, "Among Us Game Chat Control")
            }
            catch (e){
                failed = true
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
        }
        if (!failed){
            dead = result.dead
            for ([memberID, member] of channel.voiceMembers){
                index = dead.indexOf(member.id)
                dead.splice(index,1)
            }
            if (dead.length == 0){
                await collection.deleteOne(filter);
            }else{
                updateDoc = {
                    $set:{
                        "dead":dead
                    }
                }
                await collection.updateOne(filter, updateDoc,{upsert:true});
            }
            message.channel.createMessage("Game ended. All users unmuted.").catch(()=>{})
        }
    }
}

module.exports.info = {
    name: "end",
    description: "End the game. Unmutes all players even those who are set as dead",
    category: "Game",
    aliases: ["e"],
    GuildOnly: true
}
