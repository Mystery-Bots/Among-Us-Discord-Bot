Discord = require('eris')

module.exports.Run = async function (bot) {
    console.log(`${Math.round((process.memoryUsage().heapUsed / 1024 / 1024)*100)/100} MB`)
    setInterval(async function() {
        console.log(`${Math.round((process.memoryUsage().heapUsed / 1024 / 1024)*100)/100} MB`)
        console.log(bot.users.length)
        delete bot.users
        bot.users = new Discord.Collection(Discord.User)
    }, 60 * 1000)
};