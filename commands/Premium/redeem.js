colorEmbed = {
    title:"Select a Premium Color",
    description: "<:crewmate_black:756037185576108083> Black\n\
                <:crewmate_yellow:756036948535017542> Yellow\n\
                <:crewmate_white:756037159672348792> White\n\
                <:crewmate_red:756036857006915665> Red\n\
                <:crewmate_purple:756037126709182485> Purple\n\
                <:crewmate_pink:756037448810889226> Pink\n\
                <:crewmate_orange:756036915404210277> Orange\n\
                <:crewmate_lime:756036983280631839> Lime\n\
                <:crewmate_green:756037021092413471> Green\n\
                <:crewmate_cyan:756037049940967495> Cyan\n\
                <:crewmate_brown:756037630696751126> Brown\n\
                <:crewmate_blue:756037090143109130> Blue"
}

colors = {
    "black":0,
    "yellow":1,
    "white":2,
    "red":3,
    "purple":4,
    "pink":5,
    "orange":6,
    "lime":7,
    "green":8,
    "cyan":9,
    "brown":10,
    "blue":11
}

module.exports.run = async (bot, message, args) => {
    let token = args[0]
    let color = args[1]
    let tokenCollection = bot.database.collection("tokens")
    let tokenCheck = await tokenCollection.findOne({"token":token})
    // Check if token was provided
    if (!token){
        return message.channel.createMessage("Please provide a token to be redeemed. If you can't remember your token check your PayPal tractions for the Transaction ID.")
    }
    // Check if valid token
    if (!tokenCheck){
        return message.channel.createMessage("This is an invalid token. If you can't remember your token check your PayPal tractions for the Transaction ID.")
    }
    // Check if user has manage server perms
    if (!message.member.permission.has("manageGuild")){
        // Check if token is owned by a user
        if (!tokenCheck.userID){
            let setTokenOwner = {
                $set:{
                    "userID":message.author.id
                }
            }
            // Set token owner
            await tokenCollection.updateOne({"token":token},setTokenOwner)
            return message.channel.createMessage("You need `Manage Server` to redeem a premium token in this server.")
        // If owned. Is it owned the user running the command
        }else if (tokenCheck.userID != message.author.id){
            return message.channel.createMessage("This is not your premium token.")
        }
    }
    // Check if token is assigned to a guild
    if (tokenCheck.guildID){
        return message.channel.createMessage("This token is already used by a server.")
    }
    // Check if token has an owner
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
    // Check if a color was provided
    if (!color){
        return message.channel.createMessage({embed:colorEmbed})
    }
    let guild = message.channel.guild
    let serversCollection = bot.database.collection("servers")
    let serverCheck = await serversCollection.findOne({guildID:guild.id})
    //Check if guild is already premium
    if (serverCheck){
        return message.channel.createMessage(`Server \`${guild.name}\` already has premium.`)
    }
    // Convert color to it's number equivalent
    color = colors[color.toLowerCase()]
    
    let tokenUpdateDoc = {
        $set:{
            "guildID":guild.id,
            "userID":message.author.id
        }
    }
    // Set token to guild
    await tokenCollection.updateOne({"token":token},tokenUpdateDoc)
    let serverUpdateDoc = {
            "guildID": `${guild.id}`,
            "status":{
                "type":"premium",
                "color":color
            },
            "guildInfo":{
                "name":guild.name,
                "ownerID":guild.ownerID
            },
            "prefix":null
    }
    // Set server to premium
    await serversCollection.insertOne(serverUpdateDoc)
    message.channel.createMessage(`Premium has been added to \`${guild.name}\`.`)
}

module.exports.info = {
    name: "redeem",
    description: "Redeem a premium token to claim premium for your server",
    usage: "<token> <color>",
    category: "Premium",
    GuildOnly: true
}