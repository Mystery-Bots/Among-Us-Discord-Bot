module.exports.run = async (bot, message, args) => {

    embedObject = {embed: {
        title: "Donations",
        thumbnail: {
            url: "https://themystery.s-ul.eu/bot/Ih7eUxcH"
        },
        description: "If you would like to donate to keep the bot running.\nFeel free to donate [here](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VAKYBY5DB8UQE&source=url)",
        url: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VAKYBY5DB8UQE&source=url",
        color: 0x00ff00
    }}
    message.channel.createMessage(embedObject)
}

module.exports.info = {
    name: "donate",
    description: "Get a link to help support the bot",
    category: "Support",
}