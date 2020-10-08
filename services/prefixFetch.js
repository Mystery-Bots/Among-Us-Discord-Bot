const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";

async function getPrefixs(){
    const client = new MongoClient(uri, { 
            useUnifiedTopology: true,
            socketTimeoutMS: 2000000
        });
        try {
            await client.connect()
    
            const database = client.db("bot");
            const collection = database.collection("servers");
            const results = await collection.find();
            items = {}
            await results.forEach((item) => {
                if (!item){}
                else{
                    id = item.guildID
                    prefix = item.prefix
                    items[id] = prefix
                }
            })
            return items
        } finally {
            await client.close();
        }
    }

module.exports.prefixes = {}

module.exports.Run = async function () {
    setInterval(async function() {
        module.exports.prefixes = await getPrefixs()
    },1 * 1000)
}