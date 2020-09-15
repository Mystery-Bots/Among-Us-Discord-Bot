const Discord = require('discord.js')
const mysql = require("mysql")

module.exports.run = async (bot, message, args) => {
    let connection = mysql.createConnection(bot.database)
    guild = message.guild.id
    connection.query(`SELECT * FROM \`${guild}\``, async function (_error,results) {
        if (!results){
            for ([memberID, member] of channel.members){
                
                member.voice.setMute(false, "Among Us Game Chat Control")
            }
            return message.reply('No players died in the round. Unmuting all players')
        }
        else{
            connection.query(`DROP TABLE \`${guild}\``)
            for ([memberID, member] of channel.members){
                
                member.voice.setMute(false, "Among Us Game Chat Control")
            }
        }
        connection.end();
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