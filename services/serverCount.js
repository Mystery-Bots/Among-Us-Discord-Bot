const centra = require('centra')
const { MongoClient } = require("mongodb");

const DB = 'https://discord.bots.gg/api/v1/bots/754922494376542219/stats'
const DBToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMjk1Nzk4MjUxMDIwNDg0NjA4IiwiaWF0IjoxNjAxMjgwMDQ1fQ.WZhkfbuu8AzyGUbYjsPMuUIPNSZayLRZUtPTwE5E3WY'
const DBL = "https://discordbotlist.com/api/v1/bots/754922494376542219/stats"
const DBLToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6Ijc1NDkyMjQ5NDM3NjU0MjIxOSIsImlhdCI6MTYwMjIxMTI4OX0.JSiSSfGrwtT2UPYEsy_D2FQNNxtBhQwljMFLAWOwVkE"
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";

async function update(serverCount) {
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();

		const database = client.db("bot");
		const collection = database.collection("info");

        // create a filter for server count to update
		const filter = { _id: "5f6c5183784bc0b5904a1b9d" };

		// create a document that sets the server count
		const updateDoc = {
			$set: {
				count: `${serverCount}`
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

async function DBLUpdate(bot){
    result = await centra(DBL,'POST')
        .header("Authorization",DBLToken)
        .body({
            "guilds":bot.guilds.size,
            "users":bot.users.size
        }).send().then(res => {
            console.log(`Sent data: {"guilds":${bot.guilds.size},"users":${bot.users.size}} to Discord Bots List`)
        })
}



module.exports.Run = async function (bot) {
    setInterval(async function() {
        await update(bot.guilds.size);
        await DBUpdate(bot)
        await DBLUpdate(bot)
    },120 * 1000)
};