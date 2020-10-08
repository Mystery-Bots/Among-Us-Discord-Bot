module.exports.run = async (bot, message, args) => {
    if (!args[0]) args[0] = "null"
    if (args[0].toLowerCase() == "mute"){return await require("./wehookCommands/mute").run(bot, message,args)}
    if (args[0].toLowerCase() == "unmute"){return await require("./wehookCommands/unmute").run(bot, message,args)}
    if (args[0].toLowerCase() == "end"){return await require("./wehookCommands/end").run(bot, message,args)}
    return message.channel.createMessage("The commands that can be run by a webhook are `mute`, `unmute` and `end`")

}

module.exports.info = {
    name: "webhook",
    description: "Commands for webhooks",
    usage: "<mute, unmute, end> <channelID>",
    category: "Game",
    GuildOnly: true,
    WebhookOnly: true
}