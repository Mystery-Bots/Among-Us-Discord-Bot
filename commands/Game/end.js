const mariadb  = require("mariadb")

module.exports.run = async (bot, message, args) => {
    let channelID = message.member.voiceState.channelID
    if (!channelID){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let channel = bot.getChannel(channelID)
    if (!channel.type == 2){
        return message.channel.createMessage("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let guild = message.guildID
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
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
        }
        if (!failed){
            for ([memberID, member] of channel.voiceMembers){
                await connection.query(`DELETE FROM \`${guild}\` WHERE memberid = '${member.id}'`)
            }
            await connection.query(`SELECT * FROM \`${guild}\``).then( async (rows) => {
                if (!rows[0]) {await connection.query(`DROP TABLE \`${guild}\``);}
                await connection.destroy();
            })
            message.channel.createMessage("Game ended. All users unmuted.")
        }
    }).catch( async (error) => {
        await connection.destroy();
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
