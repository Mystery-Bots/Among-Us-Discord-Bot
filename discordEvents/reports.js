const Discord = require("discord.js")

module.exports.Run = async function (bot, message,error){
    if (error.message == "Target user is not connected to voice."){
        message.reply("Sorry but you or the mentioned user are not connected to a voice chat for me to manage.").catch((error) => {
            message.author.send("Sorry but you or the mentioned user are not connected to a voice chat for me to manage. Also please give me permissions to Send Messages")
        })
    }
    else if (error.message == "Missing Permissions"){
        message.reply("Sorry but I need permissions to Mute Members").catch((error) => {
            message.author.send("Sorry but I need permissions to Mute Members and Send Messages")
        })
    }
    else {
        message.reply("There was an error. A message has been sent to the TheMystery to alert them of this problem.\nIf this continues to happen please join the Support Server").catch((error) => {
            message.author.send("There was an error. A message has been sent to the TheMystery to alert them of this problem.\nIf this continues to happen please join the Support Server")
        })
    }
}