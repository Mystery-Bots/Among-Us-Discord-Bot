const mariadb  = require("mariadb")

module.exports.run = async (bot, message, args) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "servers"`)
    let connection = await mariadb.createConnection(bot.database)
    if (!args[0]){
        await connection.query(`SELECT status FROM botInfo`).then( async (rows) => {
            await connection.destroy();
            message.channel.createMessage("Current bot status is: "+rows[0])
        })
    }else{
        await connection.query(`SELECT status FROM botInfo`).then( async (rows) => {
            await connection.query(`UPDATE botInfo SET status = '${args[0]}' WHERE status = '${rows[0]}'`)
        })
        await connection.destroy();
        message.channel.createMessage("Changed bot status to: "+args[0])
    }
}

module.exports.info = {
    name: "status",
    description: "Changes the bot status",
    category: "Developer",
}