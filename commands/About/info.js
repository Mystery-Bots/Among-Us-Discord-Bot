const ms = require('ms')

embedColor = [
    0x3e474e,
    0xf6f656,
    0xd8e1f2,
    0xc51110,
    0x6c2fbb,
    0xef54bc,
    0xf17d0e,
    0x50f038,
    0x10802c,
    0x38e3dd,
    0x70491e,
    0x132ed3
]

crewColor = [
    "https://cdn.themystery.me/bot/l4PQmeQ3",
    "https://cdn.themystery.me/bot/kj0elCnG",
    "https://cdn.themystery.me/bot/BkgP4wyw",
    "https://cdn.themystery.me/bot/zuFhrjTA",
    "https://cdn.themystery.me/bot/Fi1yfLwo",
    "https://cdn.themystery.me/bot/EplSSNXt",
    "https://cdn.themystery.me/bot/a3nnrBmj",
    "https://cdn.themystery.me/bot/mw4KhkOT",
    "https://cdn.themystery.me/bot/0IssEuGF",
    "https://cdn.themystery.me/bot/UYr66rph",
    "https://cdn.themystery.me/bot/v6QOWIvQ",
    "https://cdn.themystery.me/bot/5MT8kSEi"
]

deadCrew = "https://cdn.themystery.me/bot/iP9xDX98"

module.exports.run = async (bot, message, args) => {
    let collection = bot.database.collection("info");
	let filter = { _id: "5f6c5183784bc0b5904a1b9d" };
	let result = await collection.findOne(filter);
    color = Math.floor(Math.random() * crewColor.length) //Number 0 to 11
    dead = Math.floor(Math.random() * 101) //Number 0 to 100
    timestring = new Date
    embedObject = {embed:{
        title: `${bot.user.username} Info`,
        url: "https://aub.mysterybots.com",
        footer: {
            text: "Created by TheMystery#7755"
        },
        timestamp: timestring.toISOString(),
        description: "The only Among Us Discord bot you need for your friends group/server.",
        fields: [
            {
                name: "Ping",
                value: `${message.channel.guild.shard.latency.toFixed(1)} ms`,
                inline: true
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: true
            },
            {
                name: "Uptime",
                value: ms(bot.uptime, {long:true}),
                inline: true
            },
            {
                name: "Servers",
                value: result.servers.toLocaleString(),
                inline: true
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: true
            },
            {
                name: "Shards",
                value: `Current Shard ID: ${message.channel.guild.shard.id}\nTotal Shards: ${bot.shards.size}`,
                inline: true
            },
            {
                name: "Support",
                value: "[Discord Invite](https://discord.gg/AD2a24y)",
                inline: true
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: true
            },
            {
                name: "Premium",
                value: `If you wish to buy premium feel free to check it out [here](https://aub.mysterybots.com/premium)`,
                inline: true
            }
        ]
    }}
    if (dead != 100){
        embedObject.embed.thumbnail = {
            url: crewColor[color]
        }
        embedObject.embed.color = embedColor[color]
    }else{
        embedObject.embed.thumbnail = {
            url: deadCrew
        }
        embedObject.embed.color = embedColor["9"]
    }
    message.channel.createMessage(embedObject).catch((error) => {
		if (error.message == "Missing Permissions"){
			message.channel.createMessage("I need `Embed Links` permissions to be able to send this message.")
		}
	})
}

module.exports.info = {
    name: "info",
    description: "Get information about the bot.",
    category: "About",
    aliases: ["i"],
}