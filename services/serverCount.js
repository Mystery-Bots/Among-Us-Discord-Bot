const centra = require('centra')
const { MongoClient } = require("mongodb");

const DB = 'https://discord.bots.gg/api/v1/bots/754922494376542219/stats'
const DBToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMjk1Nzk4MjUxMDIwNDg0NjA4IiwiaWF0IjoxNjAxMjgwMDQ1fQ.WZhkfbuu8AzyGUbYjsPMuUIPNSZayLRZUtPTwE5E3WY'
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";

async function update(serverCount) {
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();

		const database = client.db("bot");
		const collection = database.collection("info");

		// create a filter for a movie to update
		const filter = { _id: "5f6c5183784bc0b5904a1b9d" };

		// create a document that sets the plot of the movie
		const updateDoc = {
			$set: {
				count: serverCount
			},
		};

        const result = await collection.updateOne(filter, updateDoc);
        console.log(`Sent data: {count:${serverCount}} to the Website`)
	} finally {
		await client.close();
	}
}

async function DBUpdate(bot){
    result = await centra(DB,'POST')
        .header("Authorization",DBToken)
        .body({
            "shardCount":bot.shards.size,
            "guildCount":bot.guilds.size
        }).send().then(res => {
            console.log(`Sent data: ${res.body.toString()} to Discord Bots`)
        })
}


module.exports.Run = async function (bot) {
    setInterval(async function() {
        await update(bot.guilds.size);
        await DBUpdate(bot)
    },120 * 1000)
};