const Discord = require('discord.js')
const mysql = require("mysql")

module.exports.run = async (bot, message, args) => {
    let connection = mysql.createConnection(bot.database)
    guild = message.guild
    user = message.mentions.users.first()
    if (!user) user = message.author
    member = await guild.members.fetch(user)
    connection.query(`SELECT * FROM \`${guild.id}\``, async function (_error,results) {
        if (!results){
            message.channel.send(`${user.tag} is not listed as dead`)
        }
        else{
            await connection.query(`DELETE FROM \`${guild.id}\` WHERE memberid = '${user.id}'`)
            await member.voice.setMute(false, "Among Us Game Chat Control")
        }
        connection.destroy();
        message.channel.send(`${user.tag} Revived. To list people as dead use \`${bot.config.prefix}dead\`.`)
    })
}

module.exports.info = {
    name: "revive",
    description: "Revive yourself or someone else if you set them as dead on accident.",
    category: "Game",
    aliases: ["r"],
    GuildOnly: true
}