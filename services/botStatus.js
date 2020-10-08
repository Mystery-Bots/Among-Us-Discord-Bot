botStatus = require("../status.json").status
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";

currentStatus = 0;

async function fetchStatus(bot){
	const client = new MongoClient(uri, { useUnifiedTopology: true });
	try {
		await client.connect();

		const database = client.db("bot");
		const collection = database.collection("info");

        // create a filter for server count to update
		const filter = { _id: "5f6c5183784bc0b5904a1b9d" };

		const result = await collection.findOne(filter);
		return result.status
	} finally {
		await client.close();
	}
}

module.exports.Run = async function (bot) {
	console.log("Bot Ready");
	bot.editStatus(await fetchStatus(bot), {name:`${bot.config.prefix}help | ${bot.guilds.size} Servers!`, type: 0 });
	setInterval(async function () {
		let statuses = [
			`${bot.config.prefix}help | ${bot.guilds.size} Servers!`,
			`${bot.config.prefix}help | aub.TheMystery.me`,
		];
		currentStatus = currentStatus + 1 < statuses.length ? currentStatus + 1 : 0;
		let status = statuses[currentStatus];
		bot.editStatus(await fetchStatus(bot),{name: status, type: 0});
	}, 60 * 1000);
};
