const ms = require('ms')

statuses = {
    "ready":"<:online:756022005999861830>",
    "disconnected":"<:offline:756022560503758868>",
    "connecting":"<:dnd:756022005979152425>",
    "resuming":"<:idle:758486536089239572>",
    "handshaking":"<:idle:758486536089239572>",
}

module.exports.run = async (bot, message, args) => {
    embedObject = {embed:{
        title: `${bot.user.username} Shards Info`,
        url: "https://aub.mysterybots.com",
        footer: {
            text: "Created by TheMystery#7755"
        },
        description: "Status of all bot shards",
        fields: []
    }}
    for ([shardID, shard] of bot.shards){
        embedObject.embed.fields.push({name:`Shard ${shardID}`, value: `Status: ${statuses[shard.status]}\nPing:${shard.latency}`})
    }
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