module.exports.run = async (bot, message, args, database) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "deletetoken"`)
    token = args[0]

    let tokenCollection = bot.database.collection("tokens")
    let tokenCheck = await tokenCollection.findOne({"token":token})
    
    // Check if token is used for a server
    if (tokenCheck.guildID){
        let serversCollection = bot.database.collection("servers")
        await serversCollection.deleteOne({guildID:tokenCheck.guildID})
        await tokenCollection.deleteOne({"token":token});
        message.channel.createMessage(`Deleted token: \`${token}\` and removed premium from \`${tokenCheck.guildID}\``)
    }
    // If token isn't used for a server
    else {   
    await tokenCollection.deleteOne({"token":token});
    message.channel.createMessage(`Deleted token: \`${token}\``)
    }
}

module.exports.info = {
    name: "deletetoken",
    description: "Deletes a premium token",
    category: "Developer",
}