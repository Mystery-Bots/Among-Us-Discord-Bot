currentStatus = 1

module.exports.Run = async function(bot){
    console.log("Bot Ready")
    setInterval(async function(){
        let statuses = [
            `${bot.config.prefix}help | ${bot.guilds.cache.size} Guilds!`,
            `${bot.config.prefix}help | TheMystery.me/Among-Us`,
        ]
        currentStatus = currentStatus + 1 < statuses.length ? currentStatus + 1 : 0
        let status = statuses[currentStatus]
        bot.user.setActivity(status, { type: 'PLAYING' })
    }, 10 * 1000)
}   