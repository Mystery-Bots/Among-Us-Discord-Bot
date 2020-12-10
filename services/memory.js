Discord = require('eris')

module.exports.Run = async function (bot) {
    console.log(`${Math.round((process.memoryUsage().heapUsed / 1024 / 1024)*100)/100} MB`)
    setInterval(async function() {
        delete bot.users
        delete bot.guilds
        bot.users = new Discord.Collection(Discord.User)
        bot.guilds = new Discord.Collection(Discord.Guild)
        console.log(`${Math.round((process.memoryUsage().heapUsed / 1024 / 1024)*100)/100} MB`)
    }, 60 * 1000)
};