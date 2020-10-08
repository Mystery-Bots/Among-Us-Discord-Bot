const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";

async function getGuildStatus(guild) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();

		const database = client.db("bot");
		const collection = database.collection("servers");
    
        // create a filter for server id to find
        const filter = { "guildID": `${guild.id}` };
        
        const result = await collection.findOne(filter);
        if (!result){
            return null
        }else{
            return result.status
        }

    } finally {
		await client.close();
	}
}

module.exports.run = async (bot, message, args) => {
    guild = message.channel.guild
    if (guild.ownerID != message.author.id) return message.channel.createMessage("This command can only be run by the server owner")
    status = await getGuildStatus(guild)
    if (!status) return message.channel.createMessage("This is a premium feature. If you would like to get premium you can do so here:\n<https://www.patreon.com/TheMystery>")
    
    const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();

		const database = client.db("bot");
		const collection = database.collection("servers");
    
        // create a filter for server id to find
        const filter = { "guildID": `${guild.id}` };
        
        // create a document that sets the server count
        if (args[0] == 'null'){
            updateDoc = {
                $set: {
                    prefix: null
                }
            };
        }
        else{
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
    message.channel.createMessage("Server prefix is now `"+args[0]+"`")
}

module.exports.info = {
    name: "prefix",
    description: "Change the prefix of the bot in your server. (Premium Only)",
    category: "Support",
}