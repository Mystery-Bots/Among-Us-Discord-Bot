const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";
currentStatus = 1;

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
				count: `${serverCount}`
			},
		};

		const result = await collection.updateOne(filter, updateDoc);
	} finally {
		await client.close();
	}
}

async function serverCount(bot){
	count = await bot.shard.fetchClientValues('guilds.cache.size')
			.then(results => {
				return results.reduce((acc, guildCount) => acc + guildCount, 0)
			})
			.catch(console.error);
	return count
}

module.exports.Run = async function (bot) {
	console.log(`Shard ${bot.shard.ids} Ready`);
	setInterval(async function () {
		let statuses = [
			`${await serverCount(bot)} Servers!`,
			`aub.TheMystery.me`,
		];
		currentStatus = currentStatus + 1 < statuses.length ? currentStatus + 1 : 0;
		if (currentStatus == 0) {
			//update(bot.guilds.cache.size);
		}
		let status = statuses[currentStatus];
		bot.user.setActivity(status, { type: "PLAYING" });
	}, 60 * 1000);
};
