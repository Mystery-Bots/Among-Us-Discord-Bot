module.exports.run = async (bot, message, args) => {

    message.channel.createMessage("Here is an link to my privacy policy.\n<:Invite:756026277311283292><https://aub.themystery.me/privacy><:Invite:756026277311283292>")

}

module.exports.info = {
    name: "privacy",
    description: "Get a link to the privacy policy for the bot.",
    category: "About",
}