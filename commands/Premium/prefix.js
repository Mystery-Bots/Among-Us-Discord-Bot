async function getGuildStatus(guild, database) {

    const collection = database.collection("servers");

    // create a filter for server id to find
    const filter = { "guildID": `${guild.id}` };
    
    const result = await collection.findOne(filter);
    if (!result){
        return null
    }else{
        return result
    }
}

module.exports.run = async (bot, message, args, database) => {
    guild = message.channel.guild
    guildData = await getGuildStatus(guild, database)

    if (!args[0]){
        if (!guildData) return message.channel.createMessage("This server has no custom prefix")
        if (!guildData.prefix) return message.channel.createMessage("This server has no custom prefix")
        else return message.channel.createMessage("This server's custom prefix is `"+guildData.prefix+"`")
    }
    if (!message.member.permission.has('manageGuild')) return message.channel.createMessage("This command can only be run by users who have `manage server` permissions")
    
    if (!guildData) return message.channel.createMessage("This is a premium feature. If you would like to get premium you can do so here:\n<https://www.patreon.com/TheMystery>")
    
    const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();

		const database = client.db("bot");
		const collection = database.collection("servers");
    
        // create a filter for server id to find
        const filter = { "guildID": `${guild.id}` };
        
        // create a document that sets the server count
        if (args[0] == 'none' || args[0] == 'clear' || args[0] == 'remove'){
            updateDoc = {
                $set: {
                    prefix: null
                }
            };
        }if (args[0].match(/a/i)){
            return message.channel.createMessage("This custom prefix could not be set. Please try something that doesn't start with `a` or `A`")
        }else{
            updateDoc = {
                $set: {
                    prefix: `${args[0]}`
                }
            };
        }

        const result = await collection.updateOne(filter, updateDoc);

    } finally {
		await client.close();
    }
    if (args[0] == 'none' || args[0] == 'clear' || args[0] == 'remove'){
        message.channel.createMessage("Server prefix was removed")
    }else{
        message.channel.createMessage("Server prefix is now `"+args[0]+"`")
    }
}

module.exports.info = {
    name: "prefix",
    description: "Change the prefix of the bot in your server. (Premium Only)",
    category: "Premium",
}