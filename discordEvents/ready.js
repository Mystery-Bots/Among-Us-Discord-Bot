const Discord = require("discord.js")
let config = require("../config")
module.exports.Run = function(bot){
        bot.user.setPresence({status: 'idle' })
        require('../services/botStatus').Run(bot)
}