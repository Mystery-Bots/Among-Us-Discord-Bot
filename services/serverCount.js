const centra = require('centra')

const DB = 'https://discord.bots.gg/api/v1/bots/754922494376542219/stats'
const DBToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMjk1Nzk4MjUxMDIwNDg0NjA4IiwiaWF0IjoxNjAxMjgwMDQ1fQ.WZhkfbuu8AzyGUbYjsPMuUIPNSZayLRZUtPTwE5E3WY' // Invalid
const DBL = "https://discordbotlist.com/api/v1/bots/754922494376542219/stats"
const DBLToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6Ijc1NDkyMjQ5NDM3NjU0MjIxOSIsImlhdCI6MTYwMjIxMTI4OX0.JSiSSfGrwtT2UPYEsy_D2FQNNxtBhQwljMFLAWOwVkE" // Invalid
const TOP = 'https://top.gg/api/bots/754922494376542219/stats'
const TOPToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc1NDkyMjQ5NDM3NjU0MjIxOSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjAxNTkzNTA0fQ.VvPAuqP6RLUEECLm-v7qkJaB6kASyW1SH6XItdLZPAU' // Invalid


async function DBUpdate(bot, servers){
    result = await centra(DB,'POST')
        .header("Authorization",DBToken)
        .body({
            "shardCount":bot.shards.size,
            "guildCount":servers
        }).send().then(res => {
            console.log(`Sent data: ${res.body.toString()} to Discord Bots`)
        })
}

async function DBLUpdate(bot, servers){
    result = await centra(DBL,'POST')
        .header("Authorization",DBLToken)
        .body({
            "guilds":servers
        }).send().then(res => {
            console.log(`Sent data: {"guilds":${servers}} to Discord Bots List`)
        })
}

async function TOPUpdate(bot, servers){
    result = await centra(TOP,'POST')
        .header("Authorization",TOPToken)
        .body({
            "server_count":servers,
            "shard_count":bot.shards.size
        }).send().then(res => {
            console.log(`Sent data: {"server_count":${servers}, "shard_count":${bot.shards.size}} to Top.gg`)
        })
}



module.exports.Run = async function (bot) {
    setInterval(async function() {
        let collection = bot.database.collection("info");
        let filter = { _id: "5f6c5183784bc0b5904a1b9d" };
        let result = await collection.findOne(filter);
        await DBUpdate(bot, result.servers)
        await DBLUpdate(bot, result.servers)
        await TOPUpdate(bot, result.servers)
    },1000 * 60 * 60)
};
