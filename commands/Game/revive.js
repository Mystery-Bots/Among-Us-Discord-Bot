const Discord = require('discord.js')
const mysql = require("mysql")

module.exports.run = async (bot, message, args) => {
    let connection = mysql.createConnection(bot.database)
    guild = message.guild.id
    user = message.mentions.users.first()
    if (!user) user = message.author
    connection.query(`SELECT * FROM \`${guild}\``, async function (_error,results) {
        if (!results){
            message.channel.send(`${user.tag} is not listed as dead`)
        }
        else{
            await connection.query(`DELETE FROM \`${guild}\` WHERE memberid = '${user.id}'`)
        }
        connection.destroy();
        message.channel.send(`${user.tag} Revived. To list people as dead use \`${bot.config.prefix}dead\`.\nTo unmute revived players use \`${bot.config.prefix}unmute\``)
    })
}

module.exports.info = {
    name: "revive",
    description: "Revive yourself or someone else if you set them as dead on accident.",
    category: "Game",
    aliases: ["r"],
    GuildOnly: true
}