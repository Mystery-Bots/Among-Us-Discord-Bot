const { MongoClient } = require("mongodb");
const mariadb  = require("mariadb")
botStatus = require("../status.json").status
const uri = "mongodb+srv://among-us-bot:BW3Lb86EifZOiu3U@cluster0.daswr.mongodb.net/bot?retryWrites=true&w=majority";
currentStatus = 0;

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

async function fetchStatus(bot){
	let connection = await mariadb.createConnection(bot.database)
	status = await connection.query(`SELECT status FROM botInfo`).then( async (rows) => {
		return rows[0]
	})
	return status
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
		if (currentStatus == 0) {
			//update(bot.guilds.size);
		}
		let status = statuses[currentStatus];
		bot.editStatus(await fetchStatus(bot),{name: status, type: 0});
	}, 60 * 1000);
};
