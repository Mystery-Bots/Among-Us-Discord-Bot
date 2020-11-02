let colorEmbed = {
    title:"Select a Premium Color",
    description: "<:crewmate_black:756037185576108083> Black\n\
                <:crewmate_yellow:756036948535017542> Yellow\n\
                <:crewmate_white:756037159672348792> White\n\
                <:crewmate_red:756036857006915665> Red\n\
                <:crewmate_purple:756037126709182485> Purple\n\
                <:crewmate_pink:756037448810889226> Pink\n\
                <:crewmate_orange:756036915404210277> Orange\n\
                <:crewmate_limegreen:756036983280631839> Lime\n\
                <:crewmate_green:756037021092413471> Green\n\
                <:crewmate_cyan:756037049940967495> Cyan\n\
                <:crewmate_brown:756037630696751126> Brown\n\
                <:crewmate_blue:756037090143109130> Blue"
}

let colors = {
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

let invscolors = {
    0:"black",
    1:"yellow",
    2:"white",
    3:"red",
    4:"purple",
    5:"pink",
    6:"orange",
    7:"lime",
    8:"green",
    9:"cyan",
    10:"brown",
    11:"blue",
}


module.exports.run = async (bot, message, args) => {
    let color = args[0]
    let guild = message.channel.guild
    if (!message.member.permission.has("manageGuild")){
        return message.channel.createMessage("You need `Manage Server` to change the color of this server.")
    }
    let serversCollection = bot.database.collection("servers")
    let serverCheck = await serversCollection.findOne({guildID:guild.id})
    //Check if guild is already premium
    if (!serverCheck){
        return message.channel.createMessage(`This server does not have premium.`)
    }
    // Check if a color was provided
    if (!color){
        return message.channel.createMessage({embed:colorEmbed})
    }
    // Convert color to it's number equivalent
    color = colors[color.toLowerCase()]
    
    let serverUpdateDoc = {
        $set:{
            "status":{
                "type":"premium",
                "color":color
            }
        }
    }
    // Set server to premium
    await serversCollection.updateOne({guildID:guild.id},serverUpdateDoc)
    message.channel.createMessage(`Color of \`${guild.name}\` has been set to \`${invscolors[color]}\`.`)
}

module.exports.info = {
    name: "color",
    description: "Set the color of a server",
    usage: "<color>",
    category: "Premium",
    GuildOnly: true
}