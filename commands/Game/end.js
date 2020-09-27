const Discord = require('discord.js')
const mariadb  = require("mariadb")

module.exports.run = async (bot, message, args) => {
    channel = message.member.voice.channel
    if (!channel){
        return message.reply("Sorry but you are not connected to a voice chat for me to manage.")
    }
    let connection = await mariadb.createConnection(bot.database)
    guild = message.guild
    connection.query(`SELECT * FROM \`${guild.id}\``).then( async () => {
        await connection.query(`DROP TABLE \`${guild.id}\``)
        await connection.destroy();
        for ([memberID, member] of channel.members){
            await member.voice.setMute(false, "Among Us Game Chat Control").catch(() => {return message.channel.send("Sorry but I need permissions to Mute Members")})
        }
        message.channel.send("Game ended. All users unmuted.")
    }).catch( async () => {
        await connection.destroy();
        for ([memberID, member] of channel.members){
            await member.voice.setMute(false, "Among Us Game Chat Control").catch(() => {return message.channel.send("Sorry but I need permissions to Mute Members")})
        }
        return message.channel.send('No players died in the game. Unmuting all players.')
    })
}

module.exports.info = {
    name: "end",
    description: "End the game. Unmutes all players even those who are set as dead",
    category: "Game",
    aliases: ["e"],
    GuildOnly: true
}