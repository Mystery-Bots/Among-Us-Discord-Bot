const Discord = require('discord.js')
const mysql = require("mysql")

module.exports.run = async (bot, message, args) => {
    let connection = mysql.createConnection(bot.database)
    guild = message.guild.id
    user = message.mentions.users.first()
    if (!user) user = message.author
    connection.query(`SELECT * FROM \`${guild}\``, async function (_error,results) {
        if (!results){
            await connection.query(`CREATE TABLE \`${guild}\` (memberid VARCHAR(255))`)
            await connection.query(`INSERT INTO \`${guild}\` (memberid) VALUES ('${user.id}')`)
        }
        else{
            await connection.query(`INSERT INTO \`${guild}\` (memberid) VALUES ('${user.id}')`)
        }
        connection.destroy();
        message.channel.send(`${user.tag} set as dead for round. When round is over use \`${bot.config.prefix}end\` to unmute all players.\nIf you made a mistake in listing someone as dead use \`${bot.config.prefix}revive\``)
    })
}

module.exports.info = {
    name: "dead",
    description: "Set yourself or someone else to dead so they don't get unmuted when running the unmute command",
    category: "Game",
    aliases: ["d"],
    GuildOnly: true
}