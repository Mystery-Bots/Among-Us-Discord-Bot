// Vote for the bot on Discord Bot List and Top.gg

module.exports.run = async (bot, message, args) => {
    embedObject = {embed: {
        title: "Vote for Among Us Bot",
        thumbnail: {
            url: "https://themystery.s-ul.eu/bot/ehRyaZhA"
        },
        fields: [
            {
                name: "Discord Bot List",
                value: "https://discordbotlist.com/bots/among-us-bot-9765/upvote",
                inline: true
            }/* ,
            {
                name: "Top.gg",
                value: "https://top.gg/bot/754922494376542219/vote",
                inline: true
            } */
        ]
    }}
    message.channel.createMessage(embedObject)
}

module.exports.info = {
    name: "vote",
    description: "Vote for the bot on different bot lists",
    category: "Support",
}