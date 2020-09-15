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
            return message.channel.send('No players died in the round. Unmuting all players')
        }
        else{
            await connection.query(`DROP TABLE \`${guild}\``)
            for ([memberID, member] of channel.members){
                
                member.voice.setMute(false, "Among Us Game Chat Control")
            }
        }
        connection.destroy();
        message.channel.send("All users unmuted.")
    })
}

module.exports.info = {
    name: "end",
    description: "End the game. Unmutes all players even those who are set as dead",
    category: "Game",
    aliases: ["e"],
    GuildOnly: true
}