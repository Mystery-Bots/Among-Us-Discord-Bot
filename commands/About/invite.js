const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {

    message.channel.send("Here is an invite for you to add me to your server.\n<:Invite:756026277311283292>https://discord.com/api/oauth2/authorize?client_id=754922494376542219&permissions=8&scope=bot<:Invite:756026277311283292>")

}

module.exports.info = {
    name: "invite",
    description: "Get bot invite to add to your server",
    category: "About",
}