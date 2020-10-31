module.exports.run = async (bot, message, args, database) => {
    let guild = message.channel.guild
    let userMention = message.mentions[0]
    if (!userMention) userMention = message.author
    let member = await guild.members.find(user => user.id == userMention.id)
    let channelID = message.member.voiceState.channelID
    if (!channelID){
        return message.channel.createMessage("Sorry but you or the mentioned user are not connected to a voice chat for me to manage.")
    }
    let channel = bot.getChannel(channelID)
    if (!channel.type == 2){
        return message.channel.createMessage("Sorry but you or the mentioned user are not connected to a voice chat for me to manage.")
    }

    const collection = database.collection("games");

    // create a filter for server id to find
    const filter = { "guildID": `${guild.id}` };
    
    const result = await collection.findOne(filter);
    if (!result){
        message.channel.createMessage(`${member.user.username} is not listed as dead.`).catch(()=>{})
    }else{
        if(!result.dead.includes(member.id)){
            return message.channel.createMessage(`${member.user.username} is not listed as dead.`).catch(()=>{})
        }
        let failed = false
        try {
            await member.edit({mute:false}, "Among Us Game Chat Control")
        }
        catch (e){
            failed = true
            return message.channel.createMessage("Sorry but I need permissions to Mute Members").catch(()=>{})
        }
        if (!failed){
            dead = result.dead
            index = dead.indexOf(member.id)
            dead.splice(index,1)
            if (dead.length == 0){
                await collection.deleteOne(filter);
            }else{
                const updateDoc = {
                    $set:{
                        "dead":dead,
                        "updatedAt":new Date
                    }
                }
                await collection.updateOne(filter, updateDoc,{upsert:true});
            }
            message.channel.createMessage(`${member.user.username} Revived. To list people as dead use \`${bot.config.prefix}dead\`.`).catch(()=>{})
        }
    }
}

module.exports.info = {
    name: "revive",
    description: "Revive yourself or someone else if you set them as dead on accident.",
    category: "Game",
    usage: "(@user)",
    aliases: ["r"],
    GuildOnly: true,
    disabled: true
}