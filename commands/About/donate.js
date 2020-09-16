const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {

    embed = new Discord.MessageEmbed()
        .setTitle("Donations")
        .setDescription("If you would like to donate to keep the bot running.\nFeel free to donate [here](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VAKYBY5DB8UQE&source=url)")
        .setURL("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VAKYBY5DB8UQE&source=url")
        .setColor("GREEN")
    message.channel.send(embed)
}

module.exports.info = {
    name: "donate",
    description: "Get a link to help support the bot",
    category: "About",
}