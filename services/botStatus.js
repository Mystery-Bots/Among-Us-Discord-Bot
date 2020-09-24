const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";
currentStatus = 1;

async function update(serverCount, botStatus) {
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
				status: botStatus,
				count: `${serverCount}`,
			},
		};

		const result = await collection.updateOne(filter, updateDoc);
	} finally {
		await client.close();
	}
}

module.exports.Run = async function (bot) {
	console.log("Bot Ready");
	setInterval(async function () {
		let statuses = [
			`${bot.config.prefix}help | ${bot.guilds.cache.size} Servers!`,
			`${bot.config.prefix}help | aub.TheMystery.me`,
		];
		currentStatus = currentStatus + 1 < statuses.length ? currentStatus + 1 : 0;
		if (currentStatus == 0) {
			update(bot.guilds.cache.size, bot.user.presence.status);
		}
		let status = statuses[currentStatus];
		//bot.user.setActivity(status, { type: "PLAYING" });
	}, 10 * 1000);
};
