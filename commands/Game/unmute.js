const Discord = require('discord.js')
const mysql = require("mysql")

module.exports.run = async (bot, message, args) => {
    channel = message.member.voice.channel

    if (!channel){
        return message.reply("Sorry but you are not connected to a voice chat for me to manage.")
    }

    let connection = mysql.createConnection(bot.database)
    guild = message.guild.id

    connection.query(`SELECT * FROM \`${guild}\``, async function (_error,results) {
        if (!results){
            for ([memberID, member] of channel.members){
                
                member.voice.setMute(false, "Among Us Game Chat Control")
            }
        }
        else{
            deadUsers = []
            for (deadUser of results){
                deadUsers.push(deadUser.memberid)
            }
            for ([memberID, member] of channel.members){
                if (deadUsers.includes(memberID)){}
                else{
                    member.voice.setMute(false, "Among Us Game Chat Control")
                }
            }
        }
        connection.destroy();
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