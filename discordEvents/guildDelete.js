const mariadb  = require("mariadb")

module.exports.Run = async function(bot, guild){
    let connection = await mariadb.createConnection(bot.database)
    connection.query(`SELECT * FROM \`${guild.id}\``).then( async () => {
        await connection.query(`DROP TABLE \`${guild.id}\``)
        await connection.destroy();
    }).catch( async (error) => {
        await connection.destroy();
    })
}