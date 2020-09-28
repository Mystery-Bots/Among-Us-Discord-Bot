const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {

    message.channel.createMessage("Here is an invite for you to join the support server.\n<:Invite:756026277311283292><https://discord.gg/AD2a24y><:Invite:756026277311283292>")

}

module.exports.info = {
    name: "support",
    description: "Get bot invite to the support server",
    category: "Support",
}