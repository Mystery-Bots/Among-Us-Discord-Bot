module.exports.run = async (bot, message, args, database) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "setprem"`)
    guild = bot.guilds.find(guild => guild.id == args[0])
    owner = guild.members.find(member => member.id == guild.ownerID).user

    const collection = database.collection("servers");
    
    // create a filter for server id to find
    const filter = { "guildID": `${guild.id}` };

        
    // create a document that sets the server info
    const updateDoc = {
        $set:{
            "guildID": `${guild.id}`,
            "status":{
                "type":args[1],
                "color":args[2]
            },
            "guildInfo":{
                "name":guild.name,
                "owner":`${owner.username}#${owner.discriminator}`,
                "ownerID":guild.ownerID
            },
            "prefix":null
        }
    };
    const result = await collection.updateOne(filter, updateDoc,{upsert:true});
    message.channel.createMessage(`Added: ${guild.name} as a ${args[1]} server`)
}

module.exports.info = {
    name: "addserver",
    description: "Sets the status for a server",
    category: "Developer",
}