module.exports.run = async (bot, message, args) => {
    let token = args[0]
    let tokenCollection = bot.database.collection("tokens")
    let tokenCheck = await tokenCollection.findOne({"token":token})
    // Check if token was provided
    if (!token){
        return message.channel.createMessage("Please provide a token to be removed. If you can't remember your token check your PayPal tractions for the Transaction ID.")
    }
    // Check if valid token
    if (!tokenCheck){
        return message.channel.createMessage("This is an invalid token. If you can't remember your token check your PayPal tractions for the Transaction ID.")
    }
    // Check if user has manage server perms
    if (!message.member.permission.has("manageGuild")){
        if (!tokenCheck.userID){
            let setTokenOwner = {
                $set:{
                    "userID":message.author.id
                }
            }
            // Set token owner
            await tokenCollection.updateOne({"token":token},setTokenOwner)
            return message.channel.createMessage("You need `Manage Server` to remove a premium token in this server.")
        }
            // If owned. Is it owned the user running the command
        else if (tokenCheck.userID != message.author.id){
            return message.channel.createMessage("This is not your premium token.")
        }
        // Return generic message
        else {
            return message.channel.createMessage("You need `Manage Server` to remove a premium token in this server.")
        }
    }
    if (!tokenCheck.userID){
        let setTokenOwner = {
            $set:{
                "userID":message.author.id
            }
        }
        // Set token owner
        await tokenCollection.updateOne({"token":token},setTokenOwner)
    }
    // If owned. Is it owned the user running the command
    else if (tokenCheck.userID != message.author.id){
        return message.channel.createMessage("This is not your premium token.")
    }
    // Check if token is assigned to a guild
    if (!tokenCheck.guildID){
        return message.channel.createMessage("This token is not in use.")
    }
    let guild = message.channel.guild
    let serversCollection = bot.database.collection("servers")
    let serverCheck = await serversCollection.findOne({guildID:guild.id})
    //Check if guild is already premium
    if (!serverCheck){
        return message.channel.createMessage(`Server \`${guild.name}\` doesn't have premium.`)
    }
    let tokenUpdateDoc = {
        $unset:{
            "guildID":guild.id,
        }
    }
    // Set token to guild
    await tokenCollection.updateOne({"token":token},tokenUpdateDoc)

    // Delete server from premium list
    await serversCollection.deleteOne({guildID:guild.id})
    message.channel.createMessage(`Premium removed from \`${guild.name}\`.`)

}

module.exports.info = {
    name: "remove",
    description: "Remove a premium token from a server",
    usage: "<token>",
    category: "Premium",
    GuildOnly: true
}