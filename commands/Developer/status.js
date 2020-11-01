module.exports.run = async (bot, message, args, database) => {
    if (!bot.config.devs.includes(message.author.id)) return console.log(`${message.author.username} (ID: ${message.author.id}) tried to use "servers"`)
    if (!args[0]){
        const collection = bot.database.collection("info");
    
        // create a filter for server id to find
        const filter = { _id: "5f6c5183784bc0b5904a1b9d" };
        
        const result = await collection.findOne(filter);
        return message.channel.createMessage("Current bot status is: "+result.status)
    }else{
        const collection = bot.database.collection("info");
    
        // create a filter for server id to find
        const filter = { _id: "5f6c5183784bc0b5904a1b9d" };
        
        // create a document that sets the server count
        if (args[0] == 'offline'){
            updateDoc = {
                $set: {
                    "status": "invisible"
                }
            };
        }
        else{
            updateDoc = {
                $set: {
                    "status": `${args[0]}`
                }
            };
        }

        const result = await collection.updateOne(filter, updateDoc);
        return message.channel.createMessage("Changed bot status to: "+args[0])
    }
}

module.exports.info = {
    name: "status",
    description: "Changes the bot status",
    category: "Developer",
}