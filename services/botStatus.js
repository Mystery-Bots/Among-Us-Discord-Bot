currentStatus = 0;

async function fetchStatus(bot){
	let collection = bot.database.collection("info");

	// create a filter for server count to update
	let filter = { _id: "5f6c5183784bc0b5904a1b9d" };

	let result = await collection.findOne(filter);
	return result.status
} 

async function fetchServers(bot){
	let collection = bot.database.collection("info");

	// create a filter for server count to update
	let filter = { _id: "5f6c5183784bc0b5904a1b9d" };

	let result = await collection.findOne(filter);
	return result.servers.toLocaleString()
} 

module.exports.Run = async function (bot) {
	console.log("Bot Ready");
	
	bot.editStatus(await fetchStatus(bot), {name:`${bot.config.prefix}help | ${await fetchServers(bot)} Servers!`, type: 0 });
	setInterval(async function () {
		let statuses = [
			`${bot.config.prefix}help | ${await fetchServers(bot)} Servers!`,
			`${bot.config.prefix}help | aub.mysterybots.com`,
		];
		currentStatus = currentStatus + 1 < statuses.length ? currentStatus + 1 : 0;
		let status = statuses[currentStatus];
		bot.editStatus(await fetchStatus(bot),{name: status, type: 0});
	}, 60 * 1000);
};
