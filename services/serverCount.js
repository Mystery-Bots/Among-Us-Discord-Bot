const centra = require('centra')

const DB = 'https://discord.bots.gg/api/v1/bots/754922494376542219/stats'
const DBToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMjk1Nzk4MjUxMDIwNDg0NjA4IiwiaWF0IjoxNjAxMjgwMDQ1fQ.WZhkfbuu8AzyGUbYjsPMuUIPNSZayLRZUtPTwE5E3WY'

module.exports.Run = async function (bot) {
    setInterval(async function() {
        centra(DB,'POST')
            .header("Authorization",DBToken)
            .body({
                "shardCount":bot.shards.size,
                "guildCount":bot.guilds.size
            }).send().then(res => {
                console.log(`Sent data: ${res.body.toString()} to Discord Bots`)
            })
    },120 * 1000)
};