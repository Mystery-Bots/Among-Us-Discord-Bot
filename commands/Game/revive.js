const Discord = require('discord.js')
const mariadb  = require("mariadb")

module.exports.run = async (bot, message, args) => {
    guild = message.guild
    user = message.mentions.users.first()
    if (!user) user = message.author
    member = await guild.members.fetch(user)
    channel = message.member.voice.channel
    if (!channel){
        return message.reply("Sorry but you or the mentioned user are not connected to a voice chat for me to manage.")
    }
    let connection = await mariadb.createConnection(bot.database)
    connection.query(`SELECT * FROM \`${guild.id}\` WHERE memberid = '${user.id}'`).then( async (rows) => {
        if (!rows[0]){
            await connection.destroy();
            message.channel.send(`${user.tag} is not listed as dead.`)
        }else{
            await connection.query(`DELETE FROM \`${guild.id}\` WHERE memberid = '${user.id}'`)
            await member.voice.setMute(false, "Among Us Game Chat Control")
            await connection.destroy();
            message.channel.send(`${user.tag} Revived. To list people as dead use \`${bot.config.prefix}dead\`.`)
        }
    }).catch( async () => {
        await connection.destroy();
        message.channel.send(`${user.tag} is not listed as dead.`)
    })
}

module.exports.info = {
    name: "revive",
    description: "Revive yourself or someone else if you set them as dead on accident.",
    category: "Game",
    aliases: ["r"],
    GuildOnly: true
}