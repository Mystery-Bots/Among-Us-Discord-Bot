const ms = require('ms')

statuses = {
    "ready":"<:online:756022005999861830>",
    "disconnected":"<:offline:756022560503758868>",
    "connecting":"<:dnd:756022005979152425>",
    "resuming":"<:idle:758486536089239572>",
    "handshaking":"<:idle:758486536089239572>",
}

module.exports.run = async (bot, message, args) => {
    pings = []
    embedObject = {embed:{
        title: `${bot.user.username} Shards Info`,
        url: "https://aub.mysterybots.com",
        footer: {
            text: "Created by TheMystery#7755"
        },
        fields: []
    }}
    for ([shardID, shard] of bot.shards){
        if (!isFinite(shard.latency)) {
            pings.push(shard.latency)
        }
        if (shardID == message.channel.guild.shard.id){
            embedObject.embed.fields.push({name:`Shard ${shardID} (This Shard)`, value: `Status: ${statuses[shard.status]}\nPing: ${isFinite(shard.latency) ? `${shard.latency} ms` : "Offline"}`, inline:true})
        }else{
            embedObject.embed.fields.push({name:`Shard ${shardID}`, value: `Status: ${statuses[shard.status]}\nPing: ${isFinite(shard.latency) ? `${shard.latency} ms` : "Offline"}`, inline:true})
        }
    }
    embedObject.embed.description = `Status of all bot shards\nAverage Ping: ${(pings.reduce((a, b) => a + b)/pings.size)} ms`,
    message.channel.createMessage(embedObject).catch((error) => {
		if (error.message == "Missing Permissions"){
			message.channel.createMessage("I need `Embed Links` permissions to be able to send this message.")
		}
	})
}

module.exports.info = {
    name: "shard",
    description: "Get information about all the bot's shards.",
    category: "About",
}