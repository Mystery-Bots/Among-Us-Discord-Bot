const mariadb  = require("mariadb")

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
    let guild = message.guildID
    let connection = await mariadb.createConnection(bot.database)
    connection.query(`SELECT * FROM \`${guild}\``).then( async (rows) => {
        await connection.destroy();
        let deadUsers = []
        let failed = false
        for (deadUser of rows){
            await deadUsers.push(deadUser[0])
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
            message.channel.createMessage("Users unmuted for round. To re-mute the voice chat please use" + `\`${bot.config.prefix[0]}mute\`.`)
        }
    }).catch( async () => {
        await connection.destroy();
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
            message.channel.createMessage("Users unmuted for round. To re-mute the voice chat please use" + `\`${bot.config.prefix[0]}mute\`.`)
        }
    })
}

module.exports.info = {
    name: "unmute",
    description: "Unmute all players in the chat",
    category: "Game",
    aliases: ["um", "u"],
    GuildOnly: true
}
