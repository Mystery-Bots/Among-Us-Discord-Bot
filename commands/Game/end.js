const Discord = require('discord.js')
const mysql = require("mysql")

module.exports.run = async (bot, message, args) => {
    let connection = mysql.createConnection(bot.database)
    guild = message.guild.id
    connection.query(`SELECT * FROM \`${guild}\``, async function (_error,results) {
        if (!results){
            return message.reply('No players died in the round')
        }
        else{
            connection.query(`DROP TABLE \`${guild}\``)
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