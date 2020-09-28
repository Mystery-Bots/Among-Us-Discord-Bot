const mariadb  = require("mariadb")

module.exports.run = async (bot, message, args) => {
    guild = message.channel.guild
    userMention = message.mentions[0]
    if (!userMention) userMention = message.author
    member = await guild.members.find(user => user.id == userMention.id)
    channelID = message.member.voiceState.channelID
    if (!channelID){
        return message.reply("Sorry but you or the mentioned user are not connected to a voice chat for me to manage.")
    }
    channel = bot.getChannel(channelID)
    let connection = await mariadb.createConnection(bot.database)
    connection.query(`SELECT * FROM \`${guild.id}\` WHERE memberid = '${member.id}'`).then( async (rows) => {
        if (!rows[0]){
            await connection.destroy();
            message.channel.createMessage(`${member.user.username} is not listed as dead.`)
        }else{
            let failed = false
            try {
                await member.edit({mute:false}, "Among Us Game Chat Control")
            }
            catch (e){
                failed = true
                await connection.destroy();
                return message.channel.createMessage("Sorry but I need permissions to Mute Members")
            }
            if (!failed){
                await connection.query(`DELETE FROM \`${guild.id}\` WHERE memberid = '${member.id}'`)
                await connection.query(`SELECT * FROM \`${guild.id}\``).then( async (rows) => {
                    if (!rows[0]){await connection.query(`DROP TABLE \`${guild.id}\``)}
                    await connection.destroy()
                })
                message.channel.createMessage(`${member.user.username} Revived. To list people as dead use \`${bot.config.prefix}dead\`.`)
            }
        }
    }).catch( async () => {
        await connection.destroy();
        message.channel.createMessage(`${member.user.username} is not listed as dead.`)
    })
}

module.exports.info = {
    name: "revive",
    description: "Revive yourself or someone else if you set them as dead on accident.",
    category: "Game",
    usage: "(User Mention)",
    aliases: ["r"],
    GuildOnly: true
}