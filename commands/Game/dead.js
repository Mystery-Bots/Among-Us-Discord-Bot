const Discord = require('discord.js')
const mysql = require("mysql")

module.exports.run = async (bot, message, args) => {
    guild = message.guild
    user = message.mentions.users.first()
    if (!user) user = message.author
    member = await guild.members.fetch(user)
    channel = message.member.voice.channel
    if (!channel){
        return message.reply("Sorry but you or the mentioned user are not connected to a voice chat for me to manage.")
    }
    let connection = mysql.createConnection(bot.database)
    connection.query(`SELECT * FROM \`${guild.id}\``, async function (_error,results) {
        if (!results){
            await connection.query(`CREATE TABLE \`${guild.id}\` (memberid VARCHAR(255))`)
            await connection.query(`INSERT INTO \`${guild.id}\` (memberid) VALUES ('${user.id}')`)
            await member.voice.setMute(true, "Among Us Game Chat Control")
        }
        else{
            await connection.query(`INSERT INTO \`${guild.id}\` (memberid) VALUES ('${user.id}')`)
            await member.voice.setMute(true, "Among Us Game Chat Control")
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