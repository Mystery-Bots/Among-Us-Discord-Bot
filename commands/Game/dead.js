const mariadb  = require("mariadb")

module.exports.run = async (bot, message, args) => {
    guild = message.channel.guild
    userMention = message.mentions[0]
    if (!userMention) userMention = message.author
    member = await guild.members.find(user => user.id == userMention.id)
    channelID = message.member.voiceState.channelID
    if (!channelID){
        return message.channel.createMessage("Sorry but you or the mentioned user are not connected to a voice chat for me to manage.")
    }
    channel = bot.getChannel(channelID)
    let connection = await mariadb.createConnection(bot.database)
    connection.query(`SELECT * FROM \`${guild.id}\``).then( async () => {
        connection.query(`SELECT * FROM \`${guild.id}\` WHERE memberid = '${member.id}'`).then( async (rows) => {
            if (!rows[0]){
                let failed = false
                try {
                    await member.edit({mute:true}, "Among Us Game Chat Control")
                }
                catch (e){
                    failed = true
                    await connection.destroy();
                    return message.channel.createMessage("Sorry but I need permissions to Mute Members")
                }
                if (!failed){
                    await connection.query(`INSERT INTO \`${guild.id}\` (memberid) VALUES ('${member.id}')`)
                    await connection.destroy();
                    message.channel.createMessage(`${member.user.username} set as dead for round. When round is over use \`${bot.config.prefix}end\` to unmute all players.\nIf you made a mistake in listing someone as dead use \`${bot.config.prefix}revive\`.`)
                }
            }else{
                await connection.destroy();
                message.channel.createMessage(`${member.user.username} is already dead.`)
            }
        }).catch( async (error) => {
            console.log(error)
            let failed = false
            try {
                await member.edit({mute:true}, "Among Us Game Chat Control")
            }
            catch (e){
                failed = true
                await connection.destroy();
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
            if (!failed){
                await connection.query(`INSERT INTO \`${guild.id}\` (memberid) VALUES ('${member.id}')`)
                await connection.destroy();
                message.channel.createMessage(`${member.user.username} set as dead for round. When round is over use \`${bot.config.prefix}end\` to unmute all players.\nIf you made a mistake in listing someone as dead use \`${bot.config.prefix}revive\`.`)
            }
        })
    }).catch( async (error) => {
        let failed = false
        try {
            await member.edit({mute:true}, "Among Us Game Chat Control")
        }
        catch (e){
            failed = true
            await connection.destroy();
            return message.channel.createMessage("Sorry but I need permissions to Mute Members")
        }
        if (!failed){
            await connection.query(`CREATE TABLE \`${guild.id}\` (memberid VARCHAR(255))`)
            await connection.query(`INSERT INTO \`${guild.id}\` (memberid) VALUES ('${member.id}')`)
            await connection.destroy();
            message.channel.createMessage(`${member.user.username} set as dead for round. When round is over use \`${bot.config.prefix}end\` to unmute all players.\nIf you made a mistake in listing someone as dead use \`${bot.config.prefix}revive\`.`)
        }
    })
}

module.exports.info = {
    name: "dead",
    description: "Set yourself or someone else to dead so they don't get unmuted when running the unmute command",
    category: "Game",
    usage: "(User Mention)",
    aliases: ["d"],
    GuildOnly: true
}