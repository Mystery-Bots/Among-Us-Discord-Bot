const mariadb  = require("mariadb")

module.exports.run = async (bot, message, args) => {
    channelID = message.member.voiceState.channelID
    if (!channelID){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    channel = bot.getChannel(channelID)
    if (!channel.type == 2){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    guild = message.guildID
    let connection = await mariadb.createConnection(bot.database)
    connection.query(`SELECT * FROM \`${guild}\``).then( async () => {
        let failed = false
        for ([memberID, member] of channel.voiceMembers){
            try {
                await member.edit({mute:false}, "Among Us Game Chat Control")
            }
            catch (e){
                failed = true
                await connection.destroy();
                console.log("Conection Closed. end 1");
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
        }
        if (!failed){
            await connection.query(`DROP TABLE \`${guild}\``)
            await connection.destroy();
            console.log("Conection Closed. end 2");
            message.channel.createMessage("Game ended. All users unmuted.")
        }
    }).catch( async (error) => {
        await connection.destroy();
        console.log("Conection Closed. end 3");
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
            message.channel.createMessage('No players died in the game. Unmuting all players.')
        }
    })
}

module.exports.info = {
    name: "end",
    description: "End the game. Unmutes all players even those who are set as dead",
    category: "Game",
    aliases: ["e"],
    GuildOnly: true
}
