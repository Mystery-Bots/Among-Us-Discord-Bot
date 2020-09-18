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
    connection.query(`SELECT * FROM \`${guild.id}\``).then( async () => {
        connection.query(`SELECT * FROM \`${guild.id}\` WHERE memberid = '${user.id}'`).then( async (rows) => {
            if (!rows[0]){
                await connection.query(`INSERT INTO \`${guild.id}\` (memberid) VALUES ('${user.id}')`)
                await connection.destroy();
                await member.voice.setMute(true, "Among Us Game Chat Control")
                message.channel.send(`${user.tag} set as dead for round. When round is over use \`${bot.config.prefix}end\` to unmute all players.\nIf you made a mistake in listing someone as dead use \`${bot.config.prefix}revive\`.`)
            }else{
                await connection.destroy();
                message.channel.send(`${user.tag} is already dead.`)
            }
        }).catch( async () => {
            await connection.query(`INSERT INTO \`${guild.id}\` (memberid) VALUES ('${user.id}')`)
            await connection.destroy();
            await member.voice.setMute(true, "Among Us Game Chat Control")
            message.channel.send(`${user.tag} set as dead for round. When round is over use \`${bot.config.prefix}end\` to unmute all players.\nIf you made a mistake in listing someone as dead use \`${bot.config.prefix}revive\`.`)
        })
    }).catch( async () => {
        await connection.query(`CREATE TABLE \`${guild.id}\` (memberid VARCHAR(255))`)
        await connection.query(`INSERT INTO \`${guild.id}\` (memberid) VALUES ('${user.id}')`)
        await connection.destroy();
        await member.voice.setMute(true, "Among Us Game Chat Control")
        message.channel.send(`${user.tag} set as dead for round. When round is over use \`${bot.config.prefix}end\` to unmute all players.\nIf you made a mistake in listing someone as dead use \`${bot.config.prefix}revive\`.`)
    })
}

module.exports.info = {
    name: "dead",
    description: "Set yourself or someone else to dead so they don't get unmuted when running the unmute command",
    category: "Game",
    aliases: ["d"],
    GuildOnly: true
}