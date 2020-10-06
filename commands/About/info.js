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
    "https://themystery.s-ul.eu/bot/l4PQmeQ3",
    "https://themystery.s-ul.eu/bot/kj0elCnG",
    "https://themystery.s-ul.eu/bot/BkgP4wyw",
    "https://themystery.s-ul.eu/bot/zuFhrjTA",
    "https://themystery.s-ul.eu/bot/Fi1yfLwo",
    "https://themystery.s-ul.eu/bot/EplSSNXt",
    "https://themystery.s-ul.eu/bot/a3nnrBmj",
    "https://themystery.s-ul.eu/bot/mw4KhkOT",
    "https://themystery.s-ul.eu/bot/0IssEuGF",
    "https://themystery.s-ul.eu/bot/UYr66rph",
    "https://themystery.s-ul.eu/bot/v6QOWIvQ",
    "https://themystery.s-ul.eu/bot/5MT8kSEi"
]

module.exports.run = async (bot, message, args) => {
    userCount = 0
    color = Math.floor(Math.random() * crewColor.length) //Number 0 to 11
    embedObject = {embed:{
        title: `${bot.user.username} Info`,
        url: "https://aub.themystery.me",
        footer: {
            text: "Created by TheMystery#7755"
        },
        thumbnail: {
            url: crewColor[color]
        },
        color: embedColor[color],
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
                value: bot.guilds.size,
                inline: true
            },
            {
                name: "\u200B",
                value: "\u200B",
                inline: true
            },
            {
                name: "Shard ID",
                value: message.channel.guild.shard.id,
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
                value: `If you wish to buy premium feel free to check it out [here](https://www.patreon.com/TheMystery)`,
                inline: true
            }
        ]
    }}
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