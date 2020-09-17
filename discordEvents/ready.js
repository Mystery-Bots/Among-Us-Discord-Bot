const Discord = require("discord.js")
let config = require("../config")
module.exports.Run = function(bot){
        bot.user.setPresence({status: 'online' })
        require('../services/botStatus').Run(bot)
}