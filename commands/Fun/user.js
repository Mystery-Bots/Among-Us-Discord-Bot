const moment = require("moment")

module.exports.run = async (bot, message, args) => {
    if (args[0]){
        user = message.channel.guild.members.find(user => user.id == message.mentions[0].id)
    }else{
        user = message.member
    }
    timestring = new Date
    let embedObject = {embed: {
        title: `${user.username}#${user.user.discriminator} Info`,
        thumbnail: {
            url: user.avatarURL
        },
        timestamp: timestring.toISOString(),
        fields: [  
            {
                name: "Created On",
                value:moment(user.createdAt).format("DD/MM/YY hh:mm a"),
                inline: true
            },
            {
                name: "Joined On",
                value:moment(user.joinedAt).format("DD/MM/YY hh:mm a"),
                inline: true
            },
            {
                name: "Boosting",
                value: user.premiumSince ? moment(user.premiumSince).format("DD/MM/YY hh:mm a") : "Not boosting",
                inline: true
            },
            {
                name: `Roles [${user.roles.length}]`,
                value: `<@&${user.roles.join("> <@&")}>`
            }
        ],
        footer: {
            text: `ID: ${user.id}`
        }
    }}
    message.channel.createMessage(embedObject)
}

module.exports.info = {
    name: "user",
    description: "Display information about a user",
    usage:"(@user)",
    category: "Fun",
    GuildOnly: true
}