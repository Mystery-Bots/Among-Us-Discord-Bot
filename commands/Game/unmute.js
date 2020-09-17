const Discord = require('discord.js')
const mariadb  = require("mariadb")

module.exports.run = async (bot, message, args) => {
    channel = message.member.voice.channel

    if (!channel){
        return message.reply("Sorry but you are not connected to a voice chat for me to manage.")
    }

    let connection = await mariadb.createConnection(bot.database)
    guild = message.guild
    connection.query(`SELECT * FROM \`${guild.id}\``).then( async (rows) => {
        deadUsers = []
        for (deadUser of rows){
            await deadUsers.push(deadUser.memberid)
        }
        for ([memberID, member] of channel.members){
            if (deadUsers.includes(memberID)){}
            else{
                await member.voice.setMute(false, "Among Us Game Chat Control")
            }
        }
        await connection.destroy();
        message.channel.send("Users unmuted for round. To re-mute the voice chat please use" + `\`${bot.config.prefix}mute\`.`)
    }).catch( async () => {
        for ([memberID, member] of channel.members){
            await member.voice.setMute(false, "Among Us Game Chat Control")
        }
        await connection.destroy();
        message.channel.send("Users unmuted for round. To re-mute the voice chat please use" + `\`${bot.config.prefix}mute\`.`)
    })
}

module.exports.info = {
    name: "unmute",
    description: "Unmute all players in the chat",
    category: "Game",
    aliases: ["um", "u"],
    GuildOnly: true
}